import { z } from 'zod';
import type { ApiRouteConfig, Handlers } from 'motia';
import { llmRouter } from '../services/llm-router.service';
import { agentPrompts } from '../src/mastra/config';
import { generateTradingViewChart, extractSymbolFromQuery } from '../services/chart.service';

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'ChatWithAgentV2',
  method: 'POST',
  path: '/api/chat/v2',
  bodySchema: z.object({
    message: z.string(),
    assistantType: z.enum(['general', 'analyst', 'trader', 'advisor', 'riskManager', 'economist']),
    userId: z.string(),
    sessionId: z.string().uuid().optional(),
    symbols: z.array(z.string()).optional(),
    provider: z.enum(['groq', 'azure-openai', 'openai', 'auto']).optional(),
    model: z.enum(['gpt-5', 'gpt-4-turbo', 'gpt-4', 'llama-3.3-70b', 'llama-3.1-8b', 'auto']).optional(),
  }),
  emits: ['chat.message.created', 'chart.requested', 'symbol.detected'],
};

export const handler: Handlers['ChatWithAgentV2'] = async (req, { logger, state, traceId, emit }) => {
  try {
    const { sessionId, provider, model } = req.body;
    
    logger.info('Processing chat request (V2)', { 
      assistantType: req.body.assistantType,
      message: req.body.message.substring(0, 50) + '...',
      sessionId,
      provider: provider || 'auto',
      model: model || 'auto',
      traceId 
    });

    // Check if the message is requesting a chart or contains a symbol
    const detectedSymbol = extractSymbolFromQuery(req.body.message);
    const isChartRequest = /\b(chart|graph|show|display|view|price|stock|crypto|ticker)\b/i.test(req.body.message);
    
    if (detectedSymbol && isChartRequest) {
      logger.info('Chart request detected', { symbol: detectedSymbol, traceId });
      
      await emit({
        topic: 'symbol.detected',
        data: {
          symbol: detectedSymbol,
          originalMessage: req.body.message,
          traceId,
        },
      });

      // Generate TradingView chart
      const chartHtml = await generateTradingViewChart({
        symbol: detectedSymbol,
        theme: 'light',
        height: 500,
        interval: '1D',
      });

      await emit({
        topic: 'chart.requested',
        data: {
          symbol: detectedSymbol,
          timestamp: new Date().toISOString(),
          traceId,
        },
      });

      // Return chart with minimal text response
      const chartResponse = {
        traceId,
        response: `Here's the interactive chart for ${detectedSymbol.toUpperCase()}:`,
        assistantType: req.body.assistantType,
        llmProvider: 'chart-only',
        model: 'chart-display',
        chartHtml,
        symbol: detectedSymbol,
        hasChart: true,
      };

      await state.set('chats', `${traceId}:response`, {
        ...chartResponse,
        timestamp: new Date().toISOString(),
      });

      return {
        status: 200,
        body: chartResponse,
      };
    }

    // Store the chat message
    await state.set('chats', traceId, {
      message: req.body.message,
      assistantType: req.body.assistantType,
      userId: req.body.userId,
      sessionId,
      timestamp: new Date().toISOString(),
    });

    // Get the appropriate system prompt for the assistant type
    const systemPrompt = agentPrompts[req.body.assistantType] || agentPrompts.general;

    let response: string;
    let llmProvider = 'none';
    let modelUsed = 'unknown';
    
    // Check if LLM router is configured
    if (!llmRouter.isConfigured()) {
      logger.warn('No LLM provider configured');
      response = `I'm your ${req.body.assistantType} assistant. To enable AI responses:

**Quick Setup - Use Azure OpenAI with GPT-5:**
1. Ensure Azure credentials are set in backend/.env.local:
   - AZURE_OPENAI_ENDPOINT (already set)
   - AZURE_OPENAI_API_KEY (needs new key)
   - AZURE_OPENAI_DEPLOYMENT_NAME=finagent2-model-router

2. Set LLM preferences:
   - LLM_PROVIDER=azure-openai
   - LLM_MODEL=gpt-5

**Alternative - Groq (for fast responses):**
- Add: GROQ_API_KEY=gsk-...
- Get from: https://console.groq.com/keys

Your message: "${req.body.message}"`;
      modelUsed = 'none';
      llmProvider = 'none';
    } else {
      try {
        // Use the LLM router with optional provider/model override
        const completion = await llmRouter.createChatCompletion(
          [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: req.body.message }
          ],
          {
            provider: provider || 'auto',
            model: model || 'auto',
            temperature: 0.7,
            maxTokens: 1500,
          }
        );
        
        // Extract response based on completion format
        if ('choices' in completion && completion.choices?.[0]?.message?.content) {
          response = completion.choices[0].message.content;
        } else {
          response = 'No response generated';
        }
        
        // Get the actual provider and model used from router config
        const config = llmRouter.getConfiguration();
        llmProvider = config.preferredProvider;
        modelUsed = config.preferredModel;
        
        logger.info('LLM response received', { llmProvider, modelUsed, traceId });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('LLM router failed', { error: errorMessage, traceId });
        
        // Provide helpful error message
        if (errorMessage.includes('API')) {
          response = `API Error: ${errorMessage}

Please check your API keys in backend/.env.local:
- For Azure/GPT-5: AZURE_OPENAI_API_KEY
- For Groq/Llama: GROQ_API_KEY

Set your preferred provider:
- LLM_PROVIDER=azure-openai (for GPT-5)
- LLM_MODEL=gpt-5`;
        } else {
          response = `Error processing your request: ${errorMessage}`;
        }
        llmProvider = 'error';
        modelUsed = 'none';
      }
    }

    // Store the response with metadata
    await state.set('chats', `${traceId}:response`, {
      response,
      assistantType: req.body.assistantType,
      llmProvider,
      model: modelUsed,
      timestamp: new Date().toISOString(),
    });

    // Check if response mentions a symbol and we should add a chart
    const symbolInResponse = extractSymbolFromQuery(response);
    let chartHtml = null;
    
    if (symbolInResponse && (response.toLowerCase().includes('chart') || response.toLowerCase().includes('price') || response.toLowerCase().includes('stock'))) {
      try {
        chartHtml = await generateTradingViewChart({
          symbol: symbolInResponse,
          theme: 'light',
          height: 500,
          interval: '1D',
        });
        
        await emit({
          topic: 'chart.requested',
          data: {
            symbol: symbolInResponse,
            source: 'llm-response',
            timestamp: new Date().toISOString(),
            traceId,
          },
        });
      } catch (chartError) {
        logger.warn('Failed to generate chart for detected symbol', { 
          symbol: symbolInResponse, 
          error: chartError 
        });
      }
    }

    // Emit message created event
    await emit({
      topic: 'chat.message.created',
      data: {
        traceId,
        message: req.body.message,
        response,
        assistantType: req.body.assistantType,
        llmProvider,
        model: modelUsed,
        userId: req.body.userId,
        sessionId,
        timestamp: new Date().toISOString(),
      },
    });

    return {
      status: 200,
      body: {
        traceId,
        response,
        assistantType: req.body.assistantType,
        llmProvider,
        model: modelUsed,
        chartHtml: chartHtml || undefined,
        symbol: symbolInResponse || undefined,
        hasChart: !!chartHtml,
        config: llmRouter.getConfiguration(), // Include config for debugging
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Chat V2 processing failed', { 
      error: errorMessage,
      traceId 
    });
    
    return {
      status: 500,
      body: {
        error: 'Failed to process chat request',
        details: errorMessage,
        traceId,
        recommendations: llmRouter.getConfiguration(),
      },
    };
  }
};