import { Groq } from 'groq-sdk';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface LLMServiceConfig {
  streamCallback?: (token: string, metadata?: any) => Promise<void>;
  providerSwitchCallback?: (from: string, to: string, reason: string) => Promise<void>;
}

interface LLMResponse {
  content: string;
  provider: string;
  model: string;
  tokensUsed?: number;
}

export class LLMService {
  private groqClient?: Groq;
  private openaiClient?: OpenAI;
  private azureClient?: OpenAI;
  private config: LLMServiceConfig;

  constructor(config: LLMServiceConfig = {}) {
    this.config = config;
    this.initializeClients();
  }

  private initializeClients() {
    console.log('[LLMService] Initializing LLM clients', {
      hasGroqKey: !!process.env.GROQ_API_KEY,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      hasAzureKey: !!process.env.AZURE_OPENAI_API_KEY,
      hasAzureEndpoint: !!process.env.AZURE_OPENAI_ENDPOINT,
      azureDeployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || process.env.AZURE_OPENAI_DEPLOYMENT
    });

    // Initialize Groq client
    if (process.env.GROQ_API_KEY) {
      try {
        this.groqClient = new Groq({
          apiKey: process.env.GROQ_API_KEY,
        });
        console.log('[LLMService] Groq client initialized');
      } catch (error) {
        console.error('[LLMService] Failed to initialize Groq client:', error);
      }
    }

    // Initialize OpenAI client
    if (process.env.OPENAI_API_KEY) {
      try {
        this.openaiClient = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        console.log('[LLMService] OpenAI client initialized');
      } catch (error) {
        console.error('[LLMService] Failed to initialize OpenAI client:', error);
      }
    }

    // Initialize Azure OpenAI client
    if (process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
      // For model-router, we don't include the deployment name in the URL
      const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || process.env.AZURE_OPENAI_DEPLOYMENT || 'model-router';
      const isModelRouter = deploymentName.includes('model-router');

      const baseURL = isModelRouter
        ? `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/model-router`
        : `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${deploymentName}`;

      console.log('[LLMService] Initializing Azure OpenAI client', {
        endpoint: process.env.AZURE_OPENAI_ENDPOINT,
        deploymentName,
        isModelRouter,
        baseURL
      });

      this.azureClient = new OpenAI({
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        baseURL,
        defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION || '2024-08-01-preview' },
        defaultHeaders: {
          'api-key': process.env.AZURE_OPENAI_API_KEY,
        },
      });
    }
  }

  async process(
    message: string,
    assistantType: string,
    context: { traceId: string; userId: string },
    history?: Array<{ role: 'user' | 'assistant'; content: string }>,
    responseStyle: 'conversational' | 'report' = 'conversational'
  ): Promise<LLMResponse> {
    const systemPrompt = this.getSystemPrompt(assistantType, responseStyle);

    // Build messages array with history
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history if provided
    if (history && history.length > 0) {
      // Limit history to last 10 exchanges to avoid token limits
      const recentHistory = history.slice(-20);
      for (const msg of recentHistory) {
        if (msg.content && msg.content.trim()) {
          messages.push({
            role: msg.role,
            content: msg.content
          });
        }
      }
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    // Try Groq first
    if (this.groqClient) {
      try {
        const completion = await this.groqClient.chat.completions.create({
          messages,
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
          max_tokens: 2048,
          stream: false,
        });

        return {
          content: completion.choices[0]?.message?.content || '',
          provider: 'groq',
          model: 'llama-3.3-70b-versatile',
          tokensUsed: completion.usage?.total_tokens,
        };
      } catch (error) {
        console.error('Groq API failed:', error);
      }
    }

    // Fallback to Azure OpenAI
    if (this.azureClient) {
      try {
        const completion = await this.azureClient.chat.completions.create({
          messages,
          model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4',
          temperature: 0.7,
          max_tokens: 2048,
          stream: false,
        });

        return {
          content: completion.choices[0]?.message?.content || '',
          provider: 'azure',
          model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4',
          tokensUsed: completion.usage?.total_tokens,
        };
      } catch (error) {
        console.error('Azure OpenAI API failed:', error);
      }
    }

    // Fallback to OpenAI
    if (this.openaiClient) {
      try {
        const completion = await this.openaiClient.chat.completions.create({
          messages,
          model: 'gpt-4-turbo-preview',
          temperature: 0.7,
          max_tokens: 2048,
          stream: false,
        });

        return {
          content: completion.choices[0]?.message?.content || '',
          provider: 'openai',
          model: 'gpt-4-turbo-preview',
          tokensUsed: completion.usage?.total_tokens,
        };
      } catch (error) {
        console.error('OpenAI API failed:', error);
        throw new Error('All LLM providers failed');
      }
    }

    // No providers configured - return mock response
    return {
      content: `[${assistantType.toUpperCase()} ASSISTANT]\n\nI'm responding to your message: "${message}"\n\nTo enable AI responses, please configure an LLM provider (Groq, Azure OpenAI, or OpenAI) in your environment variables.`,
      provider: 'mock',
      model: 'none',
      tokensUsed: 0,
    };
  }

  async processWithStreaming(
    message: string,
    assistantType: string,
    context: { traceId: string; userId: string },
    history?: Array<{ role: 'user' | 'assistant'; content: string }>,
    responseStyle: 'conversational' | 'report' = 'conversational'
  ): Promise<LLMResponse> {
    const systemPrompt = this.getSystemPrompt(assistantType, responseStyle);
    let accumulatedContent = '';
    let provider = 'groq';
    let model = 'llama-3.3-70b-versatile';
    let tokensUsed = 0;

    // Build messages array with history (same as non-streaming version)
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history if provided
    if (history && history.length > 0) {
      // Limit history to last 10 exchanges to avoid token limits
      const recentHistory = history.slice(-20);
      messages.push(...recentHistory);
    }

    // Add the current user message
    messages.push({ role: 'user', content: message });

    // Try Azure first if model-router is configured
    const azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || process.env.AZURE_OPENAI_DEPLOYMENT || 'model-router';

    console.log('[LLMService] Selecting provider for streaming', {
      hasAzureClient: !!this.azureClient,
      hasGroqClient: !!this.groqClient,
      hasOpenAIClient: !!this.openaiClient,
      azureDeployment,
      isModelRouter: azureDeployment.includes('model-router')
    });

    // Check Azure client availability
    const useAzure = this.azureClient && azureDeployment;

    if (useAzure) {
      console.log('[LLMService] Azure client is available, attempting to use it');
    } else {
      console.log('[LLMService] Azure client not available', {
        hasClient: !!this.azureClient,
        deployment: azureDeployment
      });
    }

    if (useAzure) {
      try {
        provider = 'azure';
        model = azureDeployment;

        console.log('[LLMService] Using Azure model-router for streaming', {
          deployment: azureDeployment,
          messageCount: messages.length
        });

        const stream = await this.azureClient.chat.completions.create({
          messages,
          model: azureDeployment,
          temperature: 0.7,
          max_tokens: 2048,
          stream: true,
        });

        for await (const chunk of stream) {
          const token = chunk.choices[0]?.delta?.content || '';
          if (token) {
            accumulatedContent += token;
            if (this.config.streamCallback) {
              await this.config.streamCallback(token, { provider, model });
            }
          }
          // Track usage if available
          if (chunk.usage) {
            tokensUsed = chunk.usage.total_tokens || 0;
          }
        }

        return { content: accumulatedContent, provider, model, tokensUsed };
      } catch (error) {
        console.error('Azure streaming failed:', error);
        if (this.config.providerSwitchCallback) {
          await this.config.providerSwitchCallback('azure', 'groq', 'Azure API error');
        }
        // Fall through to try Groq
      }
    }

    // Try Groq as fallback
    if (this.groqClient) {
      try {
        const stream = await this.groqClient.chat.completions.create({
          messages,
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
          max_tokens: 2048,
          stream: true,
        });

        for await (const chunk of stream) {
          const token = chunk.choices[0]?.delta?.content || '';
          if (token) {
            accumulatedContent += token;
            if (this.config.streamCallback) {
              await this.config.streamCallback(token, { provider, model });
            }
          }
          // Usage is not available in streaming chunks for Groq
        }

        return { content: accumulatedContent, provider, model, tokensUsed };
      } catch (error) {
        console.error('Groq streaming failed:', error);
        if (this.config.providerSwitchCallback) {
          await this.config.providerSwitchCallback('groq', 'azure', 'Groq API error');
        }
      }
    }

    // Fallback to Azure OpenAI (try this FIRST if Groq is not configured properly)
    if (this.azureClient) {
      try {
        provider = 'azure';
        model = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || process.env.AZURE_OPENAI_DEPLOYMENT || 'model-router';

        const stream = await this.azureClient.chat.completions.create({
          messages,
          model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || process.env.AZURE_OPENAI_DEPLOYMENT || 'model-router',
          temperature: 0.7,
          max_tokens: 2048,
          stream: true,
        });

        accumulatedContent = '';
        for await (const chunk of stream) {
          const token = chunk.choices[0]?.delta?.content || '';
          if (token) {
            accumulatedContent += token;
            if (this.config.streamCallback) {
              await this.config.streamCallback(token, { provider, model });
            }
          }
          // Usage is not available in streaming chunks for Groq
        }

        return { content: accumulatedContent, provider, model, tokensUsed };
      } catch (error) {
        console.error('Azure OpenAI streaming failed:', error);
        if (this.config.providerSwitchCallback) {
          await this.config.providerSwitchCallback('azure', 'openai', 'Azure API error');
        }
      }
    }

    // Fallback to OpenAI
    if (this.openaiClient) {
      try {
        provider = 'openai';
        model = 'gpt-4-turbo-preview';
        
        const stream = await this.openaiClient.chat.completions.create({
          messages,
          model: 'gpt-4-turbo-preview',
          temperature: 0.7,
          max_tokens: 2048,
          stream: true,
        });

        accumulatedContent = '';
        for await (const chunk of stream) {
          const token = chunk.choices[0]?.delta?.content || '';
          if (token) {
            accumulatedContent += token;
            if (this.config.streamCallback) {
              await this.config.streamCallback(token, { provider, model });
            }
          }
          // Usage is not available in streaming chunks for Groq
        }

        return { content: accumulatedContent, provider, model, tokensUsed };
      } catch (error) {
        console.error('OpenAI streaming failed:', error);
        throw new Error('All LLM providers failed');
      }
    }

    throw new Error('No LLM providers configured');
  }

  private getSystemPrompt(assistantType: string, responseStyle: 'conversational' | 'report' = 'conversational'): string {
    // For conversational style, use simpler prompts
    if (responseStyle === 'conversational') {
      const conversationalPrompts: Record<string, string> = {
        general: 'You are a helpful AI assistant. Provide clear, concise, and accurate responses.',
        analyst: 'You are a financial analyst. Provide market insights and analysis in a clear, conversational manner.',
        trader: 'You are an experienced trader. Share trading insights and strategies conversationally.',
        advisor: 'You are a financial advisor. Provide investment advice in a friendly, accessible way.',
        riskManager: 'You are a risk management expert. Explain risks and mitigation strategies clearly.',
        economist: 'You are an economist. Discuss economic trends and impacts in an approachable manner.',
      };
      return conversationalPrompts[assistantType] || conversationalPrompts.general;
    }

    // For report style, use the detailed prompts
    const basePrompt = `You are an expert assistant that provides comprehensive, report-style responses.
Always format your responses using markdown with:
- Clear hierarchical headings (##, ###)
- Bullet points and numbered lists where appropriate
- Bold text for key terms and emphasis
- Tables for comparative data
- Code blocks when showing technical examples
- Blockquotes for important insights
- Horizontal rules to separate major sections

Structure your responses as professional reports with:
1. An executive summary or key takeaways section
2. Detailed analysis sections with clear headings
3. Supporting data and evidence
4. Actionable conclusions or recommendations

Be thorough and comprehensive, providing in-depth analysis rather than brief answers.`;

    const prompts: Record<string, string> = {
      general: `${basePrompt}
You are a helpful AI assistant providing detailed, well-researched responses on any topic.`,

      analyst: `${basePrompt}
You are a senior financial analyst providing institutional-grade market research reports. Include:
- Market overview and sentiment analysis
- Technical analysis with key levels and indicators
- Fundamental analysis and valuation metrics
- Comparative analysis with peers/benchmarks
- Risk factors and considerations
- Investment thesis and price targets`,

      trader: `${basePrompt}
You are an experienced trading strategist providing detailed trading plans. Include:
- Market structure and trend analysis
- Entry and exit strategies with specific levels
- Position sizing and risk management rules
- Alternative scenarios and contingency plans
- Key indicators and signals to monitor
- Historical performance context`,

      advisor: `${basePrompt}
You are a certified financial advisor providing comprehensive investment guidance. Include:
- Portfolio allocation recommendations
- Risk assessment and suitability analysis
- Tax considerations and optimization strategies
- Time horizon and goal alignment
- Diversification strategies
- Regular review and rebalancing guidelines`,

      riskManager: `${basePrompt}
You are a chief risk officer providing detailed risk assessment reports. Include:
- Risk identification and categorization
- Probability and impact analysis
- Value at Risk (VaR) calculations
- Stress testing and scenario analysis
- Hedging strategies and instruments
- Risk mitigation recommendations`,

      economist: `${basePrompt}
You are a chief economist providing comprehensive economic analysis reports. Include:
- Macroeconomic indicators and trends
- Policy analysis and implications
- Sector and industry impacts
- International trade and currency effects
- Economic forecasts and scenarios
- Investment implications and opportunities`,
    };

    return prompts[assistantType] || prompts.general;
  }
}