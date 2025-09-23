import { Groq } from 'groq-sdk';
import OpenAI from 'openai'; // Used for Azure client
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
  private azureClient?: OpenAI;
  private config: LLMServiceConfig;

  constructor(config: LLMServiceConfig = {}) {
    this.config = config;
    this.initializeClients();
  }

  private initializeClients() {
    // Check for .env file existence
    const envFileExists = require('fs').existsSync('/root/repo/apps/backend/.env');

    console.log('[LLMService] ===========================================');
    console.log('[LLMService] LLM Service Initialization Status');
    console.log('[LLMService] ===========================================');
    console.log('[LLMService] .env file exists:', envFileExists ? 'YES ✓' : 'NO ✗ (create from .env.example)');
    console.log('[LLMService] Checking API providers:', {
      hasGroqKey: !!process.env.GROQ_API_KEY,
      hasAzureKey: !!process.env.AZURE_OPENAI_API_KEY,
      hasAzureEndpoint: !!process.env.AZURE_OPENAI_ENDPOINT,
      azureDeployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || process.env.AZURE_OPENAI_DEPLOYMENT
    });

    // Track configured providers
    let configuredProviders = [];

    // Initialize Groq client
    if (process.env.GROQ_API_KEY) {
      try {
        this.groqClient = new Groq({
          apiKey: process.env.GROQ_API_KEY,
        });
        console.log('[LLMService] ✓ Groq client initialized successfully');
        configuredProviders.push('Groq');
      } catch (error) {
        console.error('[LLMService] ✗ Failed to initialize Groq client:', error);
      }
    } else {
      console.log('[LLMService] ✗ Groq: No API key found (set GROQ_API_KEY in .env)');
    }

    // OpenAI client removed - using Azure or Groq only

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

      try {
        this.azureClient = new OpenAI({
          apiKey: process.env.AZURE_OPENAI_API_KEY,
          baseURL,
          defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION || '2024-08-01-preview' },
          defaultHeaders: {
            'api-key': process.env.AZURE_OPENAI_API_KEY,
          },
        });
        console.log('[LLMService] ✓ Azure OpenAI client initialized successfully');
        configuredProviders.push('Azure OpenAI');
      } catch (error) {
        console.error('[LLMService] ✗ Failed to initialize Azure OpenAI client:', error);
      }
    } else {
      if (!process.env.AZURE_OPENAI_API_KEY) {
        console.log('[LLMService] ✗ Azure: No API key found (set AZURE_OPENAI_API_KEY in .env)');
      }
      if (!process.env.AZURE_OPENAI_ENDPOINT) {
        console.log('[LLMService] ✗ Azure: No endpoint found (set AZURE_OPENAI_ENDPOINT in .env)');
      }
    }

    // Summary
    console.log('[LLMService] ===========================================');
    if (configuredProviders.length > 0) {
      console.log('[LLMService] ✓ READY: Configured providers:', configuredProviders.join(', '));
    } else {
      console.log('[LLMService] ⚠️  WARNING: No LLM providers configured!');
      console.log('[LLMService] ⚠️  Chat will NOT work without at least one provider.');
      console.log('[LLMService] ⚠️  ACTION REQUIRED:');
      console.log('[LLMService] ⚠️  1. Copy .env.example to .env');
      console.log('[LLMService] ⚠️  2. Add GROQ_API_KEY or AZURE_OPENAI_API_KEY to .env');
      console.log('[LLMService] ⚠️  3. Restart the backend');
    }
    console.log('[LLMService] ===========================================');
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

    // No providers configured - throw error
    console.error('[LLMService] CRITICAL: No LLM providers configured!');
    throw new Error('No LLM providers configured. Please add GROQ_API_KEY or AZURE_OPENAI_API_KEY to /apps/backend/.env');
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
          await this.config.providerSwitchCallback('azure', 'error', 'Azure API error');
        }
      }
    }

    // No providers configured - throw error
    console.error('[LLMService] CRITICAL: No LLM providers configured for streaming!');
    throw new Error('No LLM providers configured. Please add GROQ_API_KEY or AZURE_OPENAI_API_KEY to /apps/backend/.env');
  }

  private getMockResponse(message: string, assistantType: string): LLMResponse {
    // MOCK: This is a mock response for development/testing
    const mockResponses: Record<string, string> = {
      general: `I understand you're asking about: "${message}".

As a MOCK assistant (no LLM API configured), I can provide this test response to verify the chat interface is working correctly.

To enable real AI responses:
1. Add your API key to /apps/backend/.env
2. Choose from: GROQ_API_KEY or AZURE_OPENAI_API_KEY
3. Restart the backend server

The system is functioning properly - this mock response confirms the chat pipeline is operational.`,

      analyst: `[MOCK Financial Analyst Response]

Analyzing your query: "${message}"

📊 Market Overview (Mock Data):
• S&P 500: +0.45%
• NASDAQ: +0.62%
• VIX: 14.2 (low volatility)

This is a mock response. Configure an LLM provider in .env for real analysis.`,

      trader: `[MOCK Trader Response]

Trading perspective on: "${message}"

📈 Mock Trading Signal:
• Trend: Bullish (mock)
• Support: $145 (mock)
• Resistance: $152 (mock)

Configure LLM API keys for actual trading insights.`,

      advisor: `[MOCK Financial Advisor Response]

Regarding your question: "${message}"

💼 Mock Advisory:
• Risk Level: Moderate (mock)
• Suggested Allocation: 60/40 stocks/bonds (mock)
• Time Horizon: Long-term (mock)

Add API keys to receive personalized financial advice.`,

      riskManager: `[MOCK Risk Manager Response]

Risk assessment for: "${message}"

⚠️ Mock Risk Metrics:
• VaR (95%): -2.5% (mock)
• Sharpe Ratio: 1.2 (mock)
• Max Drawdown: -15% (mock)

Configure LLM providers for actual risk analysis.`,

      economist: `[MOCK Economist Response]

Economic perspective on: "${message}"

📉 Mock Economic Indicators:
• GDP Growth: 2.1% (mock)
• Inflation: 3.2% (mock)
• Unemployment: 3.8% (mock)

Enable real LLM for comprehensive economic analysis.`
    };

    const content = mockResponses[assistantType] || mockResponses.general;

    return {
      content,
      provider: 'mock',
      model: `mock-${assistantType}`,
      tokensUsed: 0,
    };
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