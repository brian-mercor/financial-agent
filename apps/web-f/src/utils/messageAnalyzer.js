// Utility functions to analyze message intent and determine response type

// Company name to ticker symbol mapping
const COMPANY_TO_SYMBOL = {
  'apple': 'AAPL',
  'microsoft': 'MSFT',
  'google': 'GOOGL',
  'alphabet': 'GOOGL',
  'amazon': 'AMZN',
  'tesla': 'TSLA',
  'meta': 'META',
  'facebook': 'META',
  'nvidia': 'NVDA',
  'berkshire': 'BRK.B',
  'bitcoin': 'BTCUSD',
  'ethereum': 'ETHUSD',
  'netflix': 'NFLX',
  'disney': 'DIS',
  'paypal': 'PYPL',
  'adobe': 'ADBE',
  'salesforce': 'CRM',
  'oracle': 'ORCL',
  'intel': 'INTC',
  'amd': 'AMD',
  'spotify': 'SPOT',
  'uber': 'UBER',
  'airbnb': 'ABNB',
  'snap': 'SNAP',
  'twitter': 'TWTR',
  'zoom': 'ZM',
  'shopify': 'SHOP',
  'square': 'SQ',
  'block': 'SQ',
  'coinbase': 'COIN',
  'robinhood': 'HOOD',
};

// Keywords that indicate a chart request
const CHART_KEYWORDS = [
  'chart', 'graph', 'show', 'display', 'view',
  'price', 'stock price', 'trading', 'technical',
  'candle', 'candlestick', 'analyze', 'analysis'
];

// Keywords that indicate a streaming text response
const STREAMING_KEYWORDS = [
  'explain', 'what is', 'how to', 'why', 'when',
  'strategy', 'advice', 'recommend', 'suggestion',
  'tell me about', 'describe', 'compare', 'difference',
  'portfolio', 'allocation', 'diversify', 'risk'
];

/**
 * Extract stock symbol from message
 * @param {string} message - User message
 * @returns {string|null} - Detected stock symbol or null
 */
export function extractSymbol(message) {
  const upperMessage = message.toUpperCase();
  const lowerMessage = message.toLowerCase();

  // Exclude common financial terms and abbreviations that aren't stock symbols
  const excludedPatterns = [
    'P/E', 'PE RATIO', 'P/B', 'PB RATIO', 'P/S', 'PS RATIO',
    'EV/EBITDA', 'EBITDA', 'ROE', 'ROI', 'ROA', 'ROIC',
    'EPS', 'DCF', 'IPO', 'ETF', 'CEO', 'CFO', 'CTO',
    'Q1', 'Q2', 'Q3', 'Q4', 'YTD', 'TTM', 'CAGR',
    'AI', 'ML', 'API', 'UI', 'UX', 'IT', 'HR', 'PR'
  ];

  // Check if message is asking about a financial term/concept
  const isAskingAboutConcept = message.match(/\b(what is|what's|explain|define|meaning of)\b/i);
  if (isAskingAboutConcept) {
    // Don't extract symbols from educational questions
    for (const pattern of excludedPatterns) {
      if (upperMessage.includes(pattern.replace('/', ''))) {
        return null;
      }
    }
  }

  // First, check for company names with proper context
  for (const [name, symbol] of Object.entries(COMPANY_TO_SYMBOL)) {
    const nameRegex = new RegExp(`\\b${name}\\b`, 'i');
    if (nameRegex.test(lowerMessage)) {
      // Check if it's in a chart/stock context
      const contextWords = ['show', 'display', 'chart', 'analyze', 'stock', 'price', 'view', 'analysis'];
      const hasContext = contextWords.some(word =>
        lowerMessage.includes(word)
      );
      if (hasContext) {
        return symbol;
      }
    }
  }

  // Check for explicit stock ticker mentions with context
  // Look for patterns like "AAPL stock", "show AAPL", "$AAPL", etc.
  const explicitTickerPatterns = [
    /\$([A-Z]{2,5})\b/,                    // $AAPL (minimum 2 chars for $)
    /\b([A-Z]{2,5})\s+(?:stock|shares?|chart|price)/i,  // AAPL stock
    /(?:show|display|analyze|view)\s+(?:me\s+)?(?:the\s+)?([A-Z]{2,5})\b/i,  // show AAPL
    /\b([A-Z]{2,5})\s+(?:to|at|around|near)\s+\$/i,     // AAPL at $150
  ];

  for (const pattern of explicitTickerPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const ticker = match[1].toUpperCase();
      // Validate it's a reasonable ticker length and format
      if (ticker.length >= 2 && ticker.length <= 5 && /^[A-Z]+$/.test(ticker)) {
        // Avoid single letter matches unless with $ prefix
        if (ticker.length > 1 || message.includes('$' + ticker)) {
          // Final check - not in excluded patterns
          if (!excludedPatterns.includes(ticker)) {
            return ticker;
          }
        }
      }
    }
  }

  // Check for crypto symbols
  const cryptoMatch = message.match(/\b(BTC|ETH|SOL|ADA|DOT|AVAX|MATIC|LINK|UNI|AAVE|XRP|BNB|DOGE|SHIB)(?:USD)?\b/i);
  if (cryptoMatch) {
    const crypto = cryptoMatch[1].toUpperCase();
    return crypto.includes('USD') ? crypto : `${crypto}USD`;
  }

  // Check for market indices
  const indexMatch = lowerMessage.match(/\b(s&p|sp500|nasdaq|dow jones|dow|russell)\b/);
  if (indexMatch) {
    const indexMap = {
      's&p': 'SPX',
      'sp500': 'SPX',
      'nasdaq': 'NDX',
      'dow jones': 'DJI',
      'dow': 'DJI',
      'russell': 'RUT'
    };
    return indexMap[indexMatch[1]] || null;
  }

  return null;
}

/**
 * Determine if message is requesting a chart
 * @param {string} message - User message
 * @returns {boolean} - True if chart is requested
 */
export function isChartRequest(message) {
  const lowerMessage = message.toLowerCase();

  // If asking about concepts or explanations, not a chart request
  if (message.match(/\b(what is|what's a|explain|how does|why|when should)\b/i)) {
    return false;
  }

  // Check if there's a valid symbol mentioned
  const symbol = extractSymbol(message);
  if (!symbol) {
    return false;
  }

  // Explicit chart request keywords with symbol
  const explicitChartKeywords = [
    'show', 'display', 'view', 'chart', 'graph',
    'price chart', 'stock chart', 'trading chart'
  ];

  const hasExplicitChartRequest = explicitChartKeywords.some(keyword =>
    lowerMessage.includes(keyword)
  );

  if (hasExplicitChartRequest) {
    return true;
  }

  // "Analyze X" pattern - only if X is clearly a stock
  if (lowerMessage.includes('analyze') && symbol) {
    // Make sure it's "analyze AAPL" not "analyze P/E ratio"
    const analyzePattern = /analyze\s+(?:the\s+)?([A-Z]{2,5}|[\w]+)\s*(?:stock|shares?|chart)?/i;
    const match = message.match(analyzePattern);
    if (match && symbol) {
      return true;
    }
  }

  return false;
}

/**
 * Determine if message should use streaming response
 * @param {string} message - User message
 * @returns {boolean} - True if streaming should be used
 */
export function shouldUseStreaming(message) {
  // Chart requests should not use streaming
  if (isChartRequest(message)) {
    return false;
  }

  const lowerMessage = message.toLowerCase();

  // Check for explicit streaming indicators
  const hasStreamingKeyword = STREAMING_KEYWORDS.some(keyword =>
    lowerMessage.includes(keyword)
  );

  // Questions about general concepts should stream
  if (lowerMessage.includes('?') && !extractSymbol(message)) {
    return true;
  }

  // Educational or explanatory content should stream
  if (hasStreamingKeyword) {
    return true;
  }

  // Default to streaming for better UX on longer responses
  return true;
}

/**
 * Determine the type of request
 * @param {string} message - User message
 * @returns {object} - Analysis result
 */
export function analyzeMessage(message) {
  const symbol = extractSymbol(message);
  const isChart = isChartRequest(message);
  const shouldStream = shouldUseStreaming(message);

  return {
    symbol,
    isChartRequest: isChart,
    shouldStream,
    requestType: isChart ? 'chart' : 'chat',
    // Additional metadata for logging
    metadata: {
      hasSymbol: !!symbol,
      messageLength: message.length,
      isQuestion: message.includes('?'),
    }
  };
}

/**
 * Get suggested follow-up questions based on context
 * @param {string} symbol - Current stock symbol
 * @param {string} lastResponse - Last response type
 * @returns {array} - Array of suggested questions
 */
export function getSuggestedQuestions(symbol = null, lastResponse = 'chat') {
  if (symbol && lastResponse === 'chart') {
    return [
      `What's the technical analysis for ${symbol}?`,
      `Is ${symbol} a good buy right now?`,
      `Show me the weekly chart for ${symbol}`,
      `Compare ${symbol} with its competitors`,
    ];
  }

  if (symbol && lastResponse === 'chat') {
    return [
      `Show me the ${symbol} chart`,
      `What are the key metrics for ${symbol}?`,
      `What's the price target for ${symbol}?`,
      `Show me ${symbol} with technical indicators`,
    ];
  }

  // Default suggestions
  return [
    'What are the top trending stocks today?',
    'Show me the S&P 500 chart',
    'What\'s a good portfolio allocation strategy?',
    'Analyze AAPL stock for me',
  ];
}