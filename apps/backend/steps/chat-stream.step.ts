import type { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'
import * as dotenv from 'dotenv'
import { LLMService } from '../services/llm-service'
import { WorkflowDetector } from '../services/workflow-detector'
import { agentPrompts } from '../src/mastra/config'
import { redisPublisher } from '../services/redis-publisher.service'

// Load environment variables
dotenv.config()

// Inline chart functions to avoid import issues
function extractSymbolFromQuery(query: string): string | null {
  const upperQuery = query.toUpperCase();
  
  const commonSymbols: Record<string, string> = {
    'APPLE': 'AAPL',
    'MICROSOFT': 'MSFT',
    'GOOGLE': 'GOOGL',
    'ALPHABET': 'GOOGL',
    'AMAZON': 'AMZN',
    'TESLA': 'TSLA',
    'META': 'META',
    'FACEBOOK': 'META',
    'NVIDIA': 'NVDA',
    'BERKSHIRE': 'BRK.B',
    'BITCOIN': 'BTCUSD',
    'ETHEREUM': 'ETHUSD',
    'S&P': 'SPX',
    'NASDAQ': 'NDX',
    'DOW': 'DJI',
  };

  for (const [name, symbol] of Object.entries(commonSymbols)) {
    if (upperQuery.includes(name)) {
      return symbol;
    }
  }

  // Only match tickers that are 2-5 letters (exclude single letters like "I")
  // and make sure they're not common English words
  const tickerMatch = query.match(/\b([A-Z]{2,5}(?:\.[A-Z]{1,2})?)\b/);
  if (tickerMatch) {
    const potentialTicker = tickerMatch[1];
    // Exclude common English words that might match the pattern
    const excludedWords = ['BE', 'DO', 'GO', 'IF', 'IN', 'IS', 'IT', 'ME', 'MY',
                          'NO', 'OF', 'ON', 'OR', 'SO', 'TO', 'UP', 'US', 'WE',
                          'AND', 'BUT', 'FOR', 'THE', 'YOU', 'ALL', 'CAN', 'HAS',
                          'HIS', 'HOW', 'ITS', 'MAY', 'NOT', 'OUR', 'OUT', 'SHE',
                          'WAS', 'WHO', 'WHY', 'YES'];
    if (!excludedWords.includes(potentialTicker)) {
      return potentialTicker;
    }
  }

  const cryptoMatch = query.match(/\b(BTC|ETH|SOL|ADA|DOT|AVAX|MATIC|LINK|UNI|AAVE|XRP|BNB|DOGE|SHIB)(?:USD)?\b/i);
  if (cryptoMatch) {
    const crypto = cryptoMatch[1].toUpperCase();
    return crypto.includes('USD') ? crypto : `${crypto}USD`;
  }

  return null;
}

function isChartRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  // Check for educational/explanatory patterns that should NOT trigger charts
  const educationalPatterns = [
    'what is', 'what are', 'explain', 'how does', 'how do',
    'define', 'definition', 'meaning', 'tell me about', 'describe'
  ];

  if (educationalPatterns.some(pattern => lowerMessage.includes(pattern))) {
    return false;
  }

  // Check for explicit chart requests
  const explicitChartKeywords = ['chart', 'graph', 'show me', 'display', 'view'];
  const hasExplicitRequest = explicitChartKeywords.some(keyword => lowerMessage.includes(keyword));

  // Check for trading context keywords
  const tradingKeywords = ['price', 'stock', 'ticker', 'trading', 'candle', 'technical analysis'];
  const hasTradingContext = tradingKeywords.some(keyword => lowerMessage.includes(keyword));

  // Must have either explicit chart request OR trading context with a symbol
  return hasExplicitRequest || (hasTradingContext && extractSymbolFromQuery(message) !== null);
}

function generateTradingViewChart(config: { symbol: string; theme?: string; height?: number; interval?: string }): string {
  const { symbol, theme = 'light', height = 500, interval = '1D' } = config;
  const containerId = `tradingview_${symbol.toLowerCase()}_${Date.now()}`;

  const widgetConfig = {
    autosize: false,
    width: '100%',
    height,
    symbol: symbol.toUpperCase(),
    interval,
    timezone: 'Etc/UTC',
    theme,
    style: '1',
    locale: 'en',
    toolbar_bg: theme === 'dark' ? '#1a1a1a' : '#f1f3f6',
    enable_publishing: false,
    allow_symbol_change: true,
    container_id: containerId,
    studies: ['RSI@tv-basicstudies'],
    show_popup_button: true,
    popup_width: '1000',
    popup_height: '650',
    hide_side_toolbar: false,
  };

  return `
    <div class="tradingview-chart-wrapper" style="width:100%;margin:20px 0;">
      <div class="chart-header" style="padding:12px 16px;background:${theme === 'dark' ? '#1a1a1a' : '#f7f9fc'};border:1px solid ${theme === 'dark' ? '#333' : '#e1e4e8'};border-bottom:none;border-radius:8px 8px 0 0;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <h3 style="margin:0;color:${theme === 'dark' ? '#fff' : '#24292e'};font-size:16px;font-weight:600;">
              ${symbol.toUpperCase()} Chart
            </h3>
            <p style="margin:4px 0 0;color:${theme === 'dark' ? '#8b949e' : '#586069'};font-size:13px;">
              Interactive chart • ${interval} timeframe • Real-time data
            </p>
          </div>
          <div style="display:flex;gap:8px;">
            <span style="padding:4px 10px;background:${theme === 'dark' ? '#21262d' : '#f6f8fa'};color:${theme === 'dark' ? '#58a6ff' : '#0969da'};border-radius:6px;font-size:12px;font-weight:500;">
              ${interval}
            </span>
            <span style="padding:4px 10px;background:${theme === 'dark' ? '#1f6feb20' : '#ddf4ff'};color:${theme === 'dark' ? '#58a6ff' : '#0969da'};border-radius:6px;font-size:12px;font-weight:500;">
              Live
            </span>
          </div>
        </div>
      </div>
      <div class="tradingview-widget-container" style="height:${height}px;width:100%;border:1px solid ${theme === 'dark' ? '#333' : '#e1e4e8'};border-top:none;border-radius:0 0 8px 8px;overflow:hidden;background:${theme === 'dark' ? '#0d1117' : '#ffffff'};">
        <div id="${containerId}" style="height:100%;width:100%;"></div>
        <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
        <script type="text/javascript">
          (function() {
            try {
              new TradingView.widget(${JSON.stringify(widgetConfig)});
            } catch (e) {
              console.error('TradingView widget initialization failed:', e);
            }
          })();
        </script>
      </div>
    </div>
  `;
}

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'ChatStream',
  path: '/api/chat/stream',
  method: 'POST',
  bodySchema: z.object({
    message: z.string(),
    assistantType: z.enum(['general', 'analyst', 'trader', 'advisor', 'riskManager', 'economist']).optional(),
    userId: z.string().optional(), // Make userId optional for flexibility
    context: z.object({
      symbols: z.array(z.string()).optional(),
      timeframe: z.string().optional(),
      riskTolerance: z.string().optional(),
    }).optional(),
    // Add support for conversation history
    history: z.array(z.object({
      id: z.string(),
      role: z.enum(['user', 'assistant']),
      content: z.string(),
      timestamp: z.string(),
      assistantType: z.string().optional(),
      chartHtml: z.string().optional(),
      hasChart: z.boolean().optional(),
      isStreaming: z.boolean().optional(),
    })).optional(),
    // Add support for stream flag (though Motia doesn't support actual streaming)
    stream: z.boolean().optional(),
  }),
  emits: [
    'chat.started',
    'workflow.trigger',
    'chat.completed',
    'chart.requested',
    'symbol.detected',
  ],
}

export const handler: Handlers['ChatStream'] = async (req: any, { logger, emit, state, streams, traceId }: any) => {
  const {
    message,
    assistantType = 'general',
    userId = `user-${Date.now()}`, // Default userId if not provided
    context,
    history,
    stream
  } = req.body
  
  try {
    // Log the incoming message with additional context
    logger.info('ChatStream received message', {
      message,
      traceId,
      hasHistory: !!history,
      historyLength: history?.length || 0,
      stream,
      userId,
      assistantType
    })
    
    // Check if the message is requesting a chart
    const detectedSymbol = extractSymbolFromQuery(message)
    const chartRequest = isChartRequest(message)
    
    logger.info('Chart detection results', { 
      message,
      detectedSymbol,
      chartRequest,
      willShowChart: !!(detectedSymbol && chartRequest),
      traceId 
    })
    
    if (detectedSymbol && chartRequest) {
      logger.info('Chart request detected in stream', { symbol: detectedSymbol, traceId })
      
      await emit({
        topic: 'symbol.detected',
        data: {
          symbol: detectedSymbol,
          originalMessage: message,
          traceId,
        },
      })

      // Generate TradingView chart
      const chartHtml = await generateTradingViewChart({
        symbol: detectedSymbol,
        theme: 'light',
        height: 500,
        interval: '1D',
      })

      await emit({
        topic: 'chart.requested',
        data: {
          symbol: detectedSymbol,
          timestamp: new Date().toISOString(),
          traceId,
        },
      })

      // Generate iframe version as alternative
      const chartIframe = `<iframe src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_${Date.now()}&symbol=${detectedSymbol}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=light&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en" style="width: 100%; height: 500px; border: 0;" allowtransparency="true" frameborder="0"></iframe>`;
      
      // Return chart response immediately without LLM call
      return {
        status: 200,
        body: {
          traceId,
          response: `Here's the interactive chart for ${detectedSymbol.toUpperCase()}:`,
          assistantType,
          llmProvider: 'groq',
          model: 'chart-display',
          chartHtml,
          chartIframe,
          chartConfig: {
            symbol: detectedSymbol,
            containerId: `tradingview_${detectedSymbol.toLowerCase()}_${Date.now()}`,
            height: 500,
            width: '100%',
            interval: '1D',
          },
          symbol: detectedSymbol,
          hasChart: true,
        },
      }
    }
    // Detect if this should trigger a workflow
    const workflowDetector = new WorkflowDetector()
    const shouldTriggerWorkflow = await workflowDetector.analyze(message, context)

    if (shouldTriggerWorkflow) {
      // Workflow path - return JSON response with workflowId
      logger.info('Workflow detected, triggering multi-agent analysis', { traceId })
      
      // Emit workflow trigger event
      await emit({
        topic: 'workflow.trigger',
        data: {
          workflowId: traceId,
          userId,
          message,
          context,
          agents: shouldTriggerWorkflow.agents,
        },
      })

      // Return JSON response with workflow ID for polling
      return {
        status: 200,
        body: {
          workflowId: traceId,
          message: 'Workflow initiated successfully',
          agents: shouldTriggerWorkflow.agents,
          estimatedTime: shouldTriggerWorkflow.estimatedTime,
        },
      }
    } else {
      // Regular chat path - process synchronously and return response
      logger.info('Processing chat message', { traceId, assistantType })
      
      // Emit chat started event
      await emit({
        topic: 'chat.started',
        data: { traceId, userId, message, assistantType },
      })

      try {
        // Initialize LLM service with streaming callbacks if requested
        const llmService = stream
          ? new LLMService({
              streamCallback: async (token, metadata) => {
                // Use Motia's native streams instead of Redis
                if (streams && streams['chat-messages']) {
                  const messageId = `${traceId}-${Date.now()}`
                  await streams['chat-messages'].set(
                    `user:${userId}`,
                    messageId,
                    {
                      id: messageId,
                      type: 'token',
                      userId,
                      traceId,
                      content: token,
                      metadata,
                      timestamp: new Date().toISOString(),
                    }
                  )
                }
                // Also publish to Redis for backward compatibility
                await redisPublisher.publishChatStream(
                  userId,
                  traceId,
                  'token',
                  { content: token, ...metadata }
                )
              },
              providerSwitchCallback: async (from, to, reason) => {
                // Use Motia's native streams
                if (streams && streams['chat-messages']) {
                  const messageId = `${traceId}-switch-${Date.now()}`
                  await streams['chat-messages'].set(
                    `user:${userId}`,
                    messageId,
                    {
                      id: messageId,
                      type: 'provider_switch',
                      userId,
                      traceId,
                      metadata: { from, to, reason },
                      timestamp: new Date().toISOString(),
                    }
                  )
                }
                // Also publish to Redis for backward compatibility
                await redisPublisher.publishChatStream(
                  userId,
                  traceId,
                  'provider_switch',
                  { from, to, reason }
                )
              },
            })
          : new LLMService()

        // Process message with appropriate method based on stream flag
        const response = stream
          ? await llmService.processWithStreaming(
              message,
              assistantType,
              { traceId, userId },
              history // Pass conversation history to LLM
            )
          : await llmService.process(
              message,
              assistantType,
              { traceId, userId },
              history // Pass conversation history to LLM
            )

        // Store complete response in state
        await state.set('chats', traceId, {
          userId,
          message,
          response: response.content,
          assistantType,
          provider: response.provider,
          model: response.model,
          timestamp: new Date().toISOString(),
        })

        // Send completion message via Motia streams
        if (stream && streams && streams['chat-messages']) {
          const completeMessageId = `${traceId}-complete`
          await streams['chat-messages'].set(
            `user:${userId}`,
            completeMessageId,
            {
              id: completeMessageId,
              type: 'complete',
              userId,
              traceId,
              response: response.content,
              provider: response.provider,
              model: response.model,
              timestamp: new Date().toISOString(),
            }
          )
        }

        // Emit completion event
        await emit({
          topic: 'chat.completed',
          data: {
            traceId,
            userId,
            response: response.content,
            provider: response.provider,
            model: response.model,
          },
        })

        // Check if LLM response mentions a symbol and add chart if appropriate
        const symbolInResponse = extractSymbolFromQuery(response.content)
        let chartHtml = null
        
        if (symbolInResponse && (response.content.toLowerCase().includes('chart') || 
                                 response.content.toLowerCase().includes('price') || 
                                 response.content.toLowerCase().includes('stock'))) {
          try {
            chartHtml = await generateTradingViewChart({
              symbol: symbolInResponse,
              theme: 'light',
              height: 500,
              interval: '1D',
            })
            
            await emit({
              topic: 'chart.requested',
              data: {
                symbol: symbolInResponse,
                source: 'llm-response',
                timestamp: new Date().toISOString(),
                traceId,
              },
            })
          } catch (chartError) {
            logger.warn('Failed to generate chart for detected symbol', { 
              symbol: symbolInResponse, 
              error: chartError 
            })
          }
        }

        // Return JSON response with optional chart
        return {
          status: 200,
          body: {
            traceId,
            response: response.content,
            assistantType,
            llmProvider: response.provider,
            model: response.model,
            chartHtml: chartHtml || undefined,
            symbol: symbolInResponse || undefined,
            hasChart: !!chartHtml,
          },
        }
      } catch (error) {
        logger.error('Error processing chat', { error: error instanceof Error ? error.message : 'Unknown error', traceId })
        throw error
      }
    }
  } catch (error) {
    logger.error('Error in chat stream', { error: error instanceof Error ? error.message : 'Unknown error', traceId })
    
    return {
      status: 500,
      body: {
        error: 'An error occurred processing your request',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }
  }
}