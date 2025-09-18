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

  // First, check for company names
  for (const [name, symbol] of Object.entries(COMPANY_TO_SYMBOL)) {
    if (lowerMessage.includes(name)) {
      return symbol;
    }
  }

  // Check for direct ticker symbols (1-5 uppercase letters)
  const tickerMatch = upperMessage.match(/\b([A-Z]{1,5}(?:\.[A-Z]{1,2})?)\b/);
  if (tickerMatch) {
    // Validate it's likely a real ticker (avoid matching random words)
    const potentialTicker = tickerMatch[1];
    // Common tickers or patterns
    if (potentialTicker.length <= 5 && /^[A-Z]+(\.[A-Z]+)?$/.test(potentialTicker)) {
      return potentialTicker;
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

  // Check if message contains chart-related keywords
  const hasChartKeyword = CHART_KEYWORDS.some(keyword =>
    lowerMessage.includes(keyword)
  );

  // Check if there's a symbol mentioned
  const hasSymbol = extractSymbol(message) !== null;

  // If both chart keyword and symbol are present, it's likely a chart request
  if (hasChartKeyword && hasSymbol) {
    return true;
  }

  // Special cases: "analyze X stock" pattern
  if (lowerMessage.includes('analyze') && hasSymbol) {
    return true;
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