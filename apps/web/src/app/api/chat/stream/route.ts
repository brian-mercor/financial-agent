import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, assistantType = 'general', stream = true } = body;
    // const { history = [] } = body; // Uncomment when needed for context

    // For now, return a simple response to test the endpoint
    // In production, this would call your AI service
    
    if (stream) {
      // Create a SSE response
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            // Simulate streaming response
            const response = `I understand you're asking about "${message}". `;
            const words = response.split(' ');
            
            for (const word of words) {
              const chunk = `data: ${JSON.stringify({ content: word + ' ' })}\n\n`;
              controller.enqueue(encoder.encode(chunk));
              await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
            }
            
            // Check if message contains a stock symbol
            const stockPattern = /\b[A-Z]{1,5}\b/g;
            const symbols = message.match(stockPattern);
            
            if (symbols && symbols.length > 0) {
              const symbol = symbols[0];
              // Generate a simple chart HTML (in production, use real chart service)
              const chartHtml = `
                <div id="tradingview_${symbol}" style="height: 400px;">
                  <iframe 
                    src="https://s.tradingview.com/embed-widget/symbol-overview/?locale=en#%7B%22symbols%22%3A%5B%5B%22${symbol}%22%5D%5D%2C%22chartOnly%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A400%2C%22colorTheme%22%3A%22light%22%2C%22showVolume%22%3Atrue%2C%22showMA%22%3Afalse%2C%22hideDateRanges%22%3Afalse%2C%22hideMarketStatus%22%3Afalse%2C%22hideSymbolLogo%22%3Afalse%2C%22scalePosition%22%3A%22right%22%2C%22scaleMode%22%3A%22Normal%22%2C%22fontFamily%22%3A%22-apple-system%2C%20BlinkMacSystemFont%2C%20Trebuchet%20MS%2C%20Roboto%2C%20Ubuntu%2C%20sans-serif%22%2C%22fontSize%22%3A%2210%22%2C%22noTimeScale%22%3Afalse%2C%22valuesTracking%22%3A%221%22%2C%22changeMode%22%3A%22price-and-percent%22%2C%22chartType%22%3A%22area%22%2C%22maLineColor%22%3A%22%232962FF%22%2C%22maLineWidth%22%3A1%2C%22maLength%22%3A9%2C%22lineWidth%22%3A2%2C%22lineType%22%3A0%2C%22dateRanges%22%3A%5B%221d%7C1%22%2C%221m%7C30%22%2C%223m%7C60%22%2C%2212m%7C1D%22%2C%2260m%7C1W%22%2C%22all%7C1M%22%5D%7D"
                    style="width: 100%; height: 100%; border: none;"
                  ></iframe>
                </div>
              `;
              
              const chartChunk = `data: ${JSON.stringify({ chartHtml, hasChart: true })}\n\n`;
              controller.enqueue(encoder.encode(chartChunk));
            }
            
            // Send done signal
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          } catch (error) {
            console.error('Stream error:', error);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Non-streaming response
      return NextResponse.json({
        message: `I understand you're asking about "${message}". How can I help you further?`,
        assistantType,
        timestamp: new Date().toISOString(),
        hasChart: false,
      });
    }
  } catch (error) {
    console.error('Chat stream error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}