# Finagent Test Prompts Collection

## Overview
This document contains a collection of test prompts categorized by their expected behavior in the Finagent system. Some prompts trigger chart generation (non-streaming JSON responses), while others trigger regular text responses (suitable for streaming).

## Response Types

### 1. Chart Requests (JSON Response with Chart)
These prompts will return a JSON response with `chartHtml` field and should NOT use streaming:

#### Stock Chart Requests
- "Show me the AAPL chart"
- "Display Apple stock price"
- "Show me the chart for Tesla"
- "View MSFT technical analysis"
- "Display the price graph for NVDA"
- "Show me Amazon stock chart"
- "Can you show me the Google stock price chart?"
- "Display META trading chart"
- "Show Bitcoin price chart"
- "View Ethereum chart"

#### Chart with Analysis
- "Analyze AAPL stock for me"
- "Show me TSLA stock with technical indicators"
- "Display MSFT chart and give me your analysis"
- "Show me the SPY chart with RSI"
- "View AMZN price action for today"

#### Market Overview Charts
- "Show me the S&P 500 chart"
- "Display NASDAQ index"
- "View the Dow Jones chart"
- "Show me the market overview"

### 2. Regular Chat (Streaming Text Response)
These prompts should use streaming for better UX:

#### Market Questions (No Specific Symbol)
- "What are the top trending stocks today?"
- "Which sectors are performing well?"
- "What's happening in the market today?"
- "Give me a market update"
- "What are the best stocks to buy right now?"
- "Which stocks should I avoid?"
- "What's your market outlook?"

#### Trading Strategies
- "What is a good portfolio allocation strategy?"
- "How should I diversify my portfolio?"
- "Explain dollar-cost averaging"
- "What's the best strategy for beginners?"
- "How do I manage risk in trading?"
- "Explain options trading"
- "What are stop losses?"

#### Educational Questions
- "What is a P/E ratio?"
- "Explain market capitalization"
- "What are dividends?"
- "How do I read a balance sheet?"
- "What is technical analysis?"
- "Explain fundamental analysis"
- "What are ETFs?"

#### Portfolio Management
- "How should I rebalance my portfolio?"
- "What percentage should I allocate to bonds?"
- "Should I invest in international markets?"
- "How much emergency fund should I have?"
- "When should I take profits?"

### 3. Workflow Triggers (Multi-Agent Response)
These prompts trigger complex workflows with multiple agents:

- "Analyze my entire portfolio and give recommendations"
- "Compare AAPL, MSFT, and GOOGL for investment"
- "Create a comprehensive investment plan for $10,000"
- "Analyze tech sector and recommend top 5 stocks"
- "Perform full risk assessment of my positions"

## Detection Logic

### Chart Detection Keywords
The backend looks for these keywords to determine if a chart should be generated:
- 'chart', 'graph', 'show', 'display', 'view'
- 'price', 'stock', 'crypto', 'ticker', 'trading'
- 'candle', 'technical', 'analysis', 'market'

### Symbol Detection
The system can detect symbols in multiple formats:
- Direct ticker symbols: AAPL, MSFT, TSLA
- Company names: Apple, Microsoft, Tesla
- Crypto symbols: BTC, ETH, SOL (automatically adds USD)
- Index symbols: SPX, NDX, DJI

## Implementation Guidelines

### Frontend Logic
```javascript
// Determine if request needs streaming
function shouldUseStreaming(message) {
  const chartKeywords = ['chart', 'graph', 'show', 'display', 'view', 'price'];
  const hasChartKeyword = chartKeywords.some(keyword =>
    message.toLowerCase().includes(keyword)
  );

  // If it's a chart request, don't use streaming
  if (hasChartKeyword && detectSymbol(message)) {
    return false;
  }

  // Use streaming for general chat
  return true;
}

function detectSymbol(message) {
  // Check for ticker symbols
  const tickerMatch = message.match(/\b([A-Z]{1,5})\b/);
  if (tickerMatch) return tickerMatch[1];

  // Check for company names
  const companies = {
    'apple': 'AAPL',
    'microsoft': 'MSFT',
    'google': 'GOOGL',
    'amazon': 'AMZN',
    'tesla': 'TSLA',
    // ... more mappings
  };

  const lowerMessage = message.toLowerCase();
  for (const [name, symbol] of Object.entries(companies)) {
    if (lowerMessage.includes(name)) {
      return symbol;
    }
  }

  return null;
}
```

## Testing Checklist

### Chart Responses
- [ ] Verify chart renders correctly
- [ ] Check symbol is extracted properly
- [ ] Ensure TradingView widget loads
- [ ] Validate chart interactions work

### Streaming Responses
- [ ] Text appears progressively
- [ ] No UI blocking during streaming
- [ ] Proper error handling for stream interruption
- [ ] Markdown formatting preserved

### Mixed Content
- [ ] Can handle text response with embedded chart mention
- [ ] Switching between streaming and non-streaming in same session
- [ ] History context preserved across both types

## Example Test Scenarios

### Scenario 1: Chart Request
**Input**: "Show me the AAPL chart"
**Expected**:
- JSON response with `chartHtml` field
- No streaming
- Chart renders in UI

### Scenario 2: General Question
**Input**: "What's a good investment strategy?"
**Expected**:
- Streaming text response
- Progressive text display
- No chart generation

### Scenario 3: Analysis with Chart
**Input**: "Analyze Tesla stock for me"
**Expected**:
- JSON response with both text analysis and chart
- Symbol detected as TSLA
- Chart displays below analysis text

### Scenario 4: Follow-up Question
**Input**: "What about Microsoft?" (after previous AAPL question)
**Expected**:
- Context aware response
- Detects MSFT symbol
- Shows comparative analysis with chart

## Notes

- The `stream` parameter in the request should be set based on the prompt type
- Chart requests should always use `stream: false`
- General chat can use `stream: true` for better UX
- The backend handles both modes appropriately
- Frontend should adapt UI based on response type