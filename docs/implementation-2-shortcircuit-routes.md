# Implementation Guide 2: Short-Circuit Routes (Comparison & Thematic Baskets)

## Overview
This document details the implementation of two critical short-circuit routes that bypass full orchestration for optimal performance: the Comparison Route for direct ticker comparisons and the Thematic Basket Route for generating curated stock collections based on themes.

## Part 1: Comparison Route Implementation

### 1.1 Core Comparison Service

```typescript
// services/comparison-route.service.ts

import { Observable, forkJoin, from } from 'rxjs';
import { map, timeout } from 'rxjs/operators';

export interface ComparisonRequest {
  user_query: string;
  tickers: string[];
  conversation_history?: ConversationItem[];
  comparison_type?: 'performance' | 'fundamentals' | 'technical' | 'comprehensive';
  timeframe?: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y';
}

export interface ComparisonData {
  ticker: string;
  company_name: string;
  current_price: number;
  price_change_percent: number;
  market_cap: number;
  pe_ratio: number;
  dividend_yield: number;
  volume: number;
  avg_volume: number;
  beta: number;
  week_52_high: number;
  week_52_low: number;
  performance: {
    day_1: number;
    week_1: number;
    month_1: number;
    month_3: number;
    month_6: number;
    year_1: number;
  };
  fundamentals?: {
    revenue: number;
    revenue_growth: number;
    earnings: number;
    earnings_growth: number;
    gross_margin: number;
    operating_margin: number;
    roe: number;
    debt_to_equity: number;
  };
  technical_indicators?: {
    rsi: number;
    macd: { value: number; signal: number; histogram: number };
    moving_averages: {
      sma_20: number;
      sma_50: number;
      sma_200: number;
      ema_12: number;
      ema_26: number;
    };
    bollinger_bands: {
      upper: number;
      middle: number;
      lower: number;
    };
  };
}

export interface ComparisonResult {
  narrative: string;
  data: {
    extracted_tickers: TickerInfo[];
    comparison_data: Record<string, ComparisonData>;
    summary: ComparisonSummary;
  };
  confidence: number;
  processing_time_ms: number;
}

export class ComparisonRouteService {
  constructor(
    private dataService: MarketDataService,
    private llmService: LLMService,
    private cacheService: CacheService,
    private eventPublisher: EventPublisher
  ) {}

  /**
   * Main entry point for comparison route
   */
  async executeComparison(request: ComparisonRequest): Promise<ComparisonResult> {
    const startTime = Date.now();

    try {
      // Step 1: Extract and validate tickers
      const tickers = await this.extractAndValidateTickers(request);

      if (tickers.length < 2) {
        throw new Error('Comparison requires at least 2 valid tickers');
      }

      await this.publishEvent('comparison_start', {
        tickers,
        comparison_type: request.comparison_type || 'comprehensive'
      });

      // Step 2: Fetch comparison data in parallel
      const comparisonData = await this.fetchComparisonData(
        tickers,
        request.comparison_type || 'comprehensive',
        request.timeframe || '1Y'
      );

      // Step 3: Generate analysis narrative
      const narrative = await this.generateComparisonNarrative(
        tickers,
        comparisonData,
        request
      );

      // Step 4: Create summary insights
      const summary = this.generateComparisonSummary(comparisonData);

      await this.publishEvent('comparison_complete', {
        tickers,
        processing_time_ms: Date.now() - startTime
      });

      return {
        narrative,
        data: {
          extracted_tickers: tickers.map(t => ({
            symbol: t,
            name: comparisonData[t]?.company_name || t,
            confidence: 1.0
          })),
          comparison_data: comparisonData,
          summary
        },
        confidence: 0.95,
        processing_time_ms: Date.now() - startTime
      };

    } catch (error) {
      await this.publishEvent('comparison_error', {
        error: error.message,
        processing_time_ms: Date.now() - startTime
      });
      throw error;
    }
  }

  /**
   * Extract tickers from query using multiple methods
   */
  private async extractAndValidateTickers(request: ComparisonRequest): Promise<string[]> {
    // If tickers provided directly, validate them
    if (request.tickers && request.tickers.length > 0) {
      return this.validateTickers(request.tickers);
    }

    // Otherwise extract from query
    const extractionMethods = [
      this.extractTickersWithLLM(request.user_query),
      this.extractTickersWithRegex(request.user_query),
      this.extractTickersFromContext(request.conversation_history)
    ];

    const results = await Promise.allSettled(extractionMethods);

    // Combine and deduplicate tickers from all methods
    const allTickers = new Set<string>();
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value) {
        result.value.forEach(ticker => allTickers.add(ticker));
      }
    });

    return this.validateTickers(Array.from(allTickers));
  }

  /**
   * Extract tickers using LLM
   */
  private async extractTickersWithLLM(query: string): Promise<string[]> {
    const prompt = `
Extract stock ticker symbols from this query. Return ONLY valid ticker symbols.

QUERY: ${query}

Rules:
- Extract exact ticker symbols (e.g., AAPL, MSFT)
- Convert company names to tickers if possible
- Return empty array if no clear tickers found

Return JSON only:
{
  "tickers": ["TICKER1", "TICKER2"],
  "confidence": 0.0-1.0
}`;

    try {
      const response = await this.llmService.generateJSON(prompt, {
        temperature: 0.1,
        max_tokens: 100
      });

      return response.tickers || [];
    } catch (error) {
      console.error('LLM ticker extraction failed:', error);
      return [];
    }
  }

  /**
   * Extract tickers using regex patterns
   */
  private extractTickersWithRegex(query: string): Promise<string[]> {
    return new Promise((resolve) => {
      // Common ticker patterns
      const patterns = [
        /\$([A-Z]{1,5})\b/g,                    // $AAPL format
        /\b([A-Z]{2,5})(?:\s+vs\.?\s+[A-Z])/gi, // AAPL vs MSFT
        /\b([A-Z]{2,5})(?:\s+and\s+[A-Z])/gi,   // AAPL and MSFT
        /\b([A-Z]{2,5})(?:\s+or\s+[A-Z])/gi,    // AAPL or MSFT
      ];

      const tickers = new Set<string>();

      patterns.forEach(pattern => {
        const matches = query.matchAll(pattern);
        for (const match of matches) {
          if (match[1]) {
            tickers.add(match[1].toUpperCase());
          }
        }
      });

      // Also check for company name mappings
      const companyMappings: Record<string, string> = {
        'APPLE': 'AAPL',
        'MICROSOFT': 'MSFT',
        'GOOGLE': 'GOOGL',
        'ALPHABET': 'GOOGL',
        'AMAZON': 'AMZN',
        'META': 'META',
        'FACEBOOK': 'META',
        'TESLA': 'TSLA',
        'NVIDIA': 'NVDA',
        'NETFLIX': 'NFLX'
      };

      Object.entries(companyMappings).forEach(([company, ticker]) => {
        if (query.toUpperCase().includes(company)) {
          tickers.add(ticker);
        }
      });

      resolve(Array.from(tickers));
    });
  }

  /**
   * Fetch comprehensive comparison data
   */
  private async fetchComparisonData(
    tickers: string[],
    comparisonType: string,
    timeframe: string
  ): Promise<Record<string, ComparisonData>> {
    // Check cache first
    const cacheKey = `comparison:${tickers.sort().join('-')}:${comparisonType}:${timeframe}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch data in parallel for all tickers
    const dataPromises = tickers.map(ticker =>
      this.fetchTickerData(ticker, comparisonType, timeframe)
    );

    const results = await Promise.allSettled(dataPromises);

    const comparisonData: Record<string, ComparisonData> = {};
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        comparisonData[tickers[index]] = result.value;
      } else {
        console.error(`Failed to fetch data for ${tickers[index]}:`, result.reason);
        // Add placeholder data
        comparisonData[tickers[index]] = this.getPlaceholderData(tickers[index]);
      }
    });

    // Cache the result
    await this.cacheService.set(cacheKey, comparisonData, 300); // 5 min TTL

    return comparisonData;
  }

  /**
   * Fetch individual ticker data
   */
  private async fetchTickerData(
    ticker: string,
    comparisonType: string,
    timeframe: string
  ): Promise<ComparisonData> {
    const fetchTasks = [];

    // Always fetch basic quote data
    fetchTasks.push(this.dataService.getQuote(ticker));
    fetchTasks.push(this.dataService.getHistoricalPerformance(ticker, timeframe));

    // Conditionally fetch additional data based on comparison type
    if (comparisonType === 'fundamentals' || comparisonType === 'comprehensive') {
      fetchTasks.push(this.dataService.getFundamentals(ticker));
    }

    if (comparisonType === 'technical' || comparisonType === 'comprehensive') {
      fetchTasks.push(this.dataService.getTechnicalIndicators(ticker));
    }

    const [quote, performance, fundamentals, technicals] = await Promise.all(fetchTasks);

    return {
      ticker,
      company_name: quote.companyName,
      current_price: quote.price,
      price_change_percent: quote.changePercent,
      market_cap: quote.marketCap,
      pe_ratio: quote.peRatio,
      dividend_yield: quote.dividendYield,
      volume: quote.volume,
      avg_volume: quote.avgVolume,
      beta: quote.beta,
      week_52_high: quote.week52High,
      week_52_low: quote.week52Low,
      performance: performance,
      fundamentals: fundamentals,
      technical_indicators: technicals
    };
  }

  /**
   * Generate comparison narrative using LLM
   */
  private async generateComparisonNarrative(
    tickers: string[],
    data: Record<string, ComparisonData>,
    request: ComparisonRequest
  ): Promise<string> {
    const systemPrompt = `You are a financial analyst providing concise ticker comparisons.
Focus on key differences and actionable insights. Use data to support observations.`;

    const dataContext = this.formatDataForLLM(data);

    const userPrompt = `
Compare ${tickers.join(' vs ')} based on the following data:

${dataContext}

USER REQUEST: ${request.user_query}

Provide a focused comparison covering:
1. Current performance and valuation differences
2. Key fundamental metrics comparison
3. Notable strengths/weaknesses of each
4. Brief investment perspective

Keep response under 300 words. Be specific and data-driven.`;

    const response = await this.llmService.generate(userPrompt, {
      system: systemPrompt,
      temperature: 0.7,
      max_tokens: 500
    });

    return response;
  }

  /**
   * Generate comparison summary
   */
  private generateComparisonSummary(data: Record<string, ComparisonData>): ComparisonSummary {
    const tickers = Object.keys(data);

    // Find best performer across different metrics
    const rankings = {
      performance: this.rankByMetric(data, d => d.performance.year_1),
      valuation: this.rankByMetric(data, d => d.pe_ratio, true), // Lower is better
      growth: this.rankByMetric(data, d => d.fundamentals?.revenue_growth || 0),
      dividend: this.rankByMetric(data, d => d.dividend_yield),
      momentum: this.rankByMetric(data, d => d.performance.month_1)
    };

    return {
      winner_overall: this.determineOverallWinner(rankings),
      best_performer: rankings.performance[0],
      best_value: rankings.valuation[0],
      highest_dividend: rankings.dividend[0],
      strongest_momentum: rankings.momentum[0],
      key_insights: this.generateKeyInsights(data),
      risk_comparison: this.compareRisk(data)
    };
  }

  private async publishEvent(type: string, data: any): Promise<void> {
    await this.eventPublisher.publish({
      event_type: `comparison.${type}`,
      timestamp: new Date().toISOString(),
      ...data
    });
  }
}
```

### 1.2 Comparison Route Executor

```typescript
// executors/comparison-route.executor.ts

export class ComparisonRouteExecutor implements RouteExecutor {
  constructor(
    private comparisonService: ComparisonRouteService,
    private streamingService: StreamingService
  ) {}

  async execute(params: RouteExecutionParams): Promise<ChatResponse> {
    const { context, classification, requestId, eventPublisher } = params;

    try {
      // Start fast streaming thoughts
      const thoughtsStream = this.streamFastThoughts(
        context.user_query,
        classification
      );

      // Execute comparison in parallel with thoughts
      const comparisonPromise = this.comparisonService.executeComparison({
        user_query: context.user_query,
        tickers: classification.metadata?.tickers || [],
        conversation_history: context.conversation_history,
        comparison_type: 'comprehensive'
      });

      // Stream thoughts while comparison runs
      for await (const thought of thoughtsStream) {
        await eventPublisher.publish({
          event_type: 'streaming_content',
          content: { chunk: thought, system: 'fast' }
        });
      }

      // Wait for comparison to complete
      const comparisonResult = await comparisonPromise;

      // Stream the comparison narrative
      await this.streamingService.streamResponse(
        comparisonResult.narrative,
        requestId,
        'slow'
      );

      return {
        response: comparisonResult.narrative,
        collection: {
          extracted_tickers: comparisonResult.data.extracted_tickers,
          comparison_data: comparisonResult.data.comparison_data,
          summary: comparisonResult.data.summary
        },
        route_used: 'comparison_route',
        confidence: comparisonResult.confidence,
        status: 'success'
      };

    } catch (error) {
      console.error('Comparison route execution failed:', error);
      throw new RouteExecutionError('Comparison failed', error);
    }
  }

  private async* streamFastThoughts(
    query: string,
    classification: ClassificationResult
  ): AsyncGenerator<string> {
    const thoughts = [
      "Analyzing comparison request...",
      `Identified ${classification.metadata?.tickers?.length || 0} tickers for comparison`,
      "Fetching real-time market data...",
      "Comparing fundamental metrics...",
      "Analyzing relative performance...",
      "Generating insights..."
    ];

    for (const thought of thoughts) {
      yield thought + '\n';
      await this.delay(500);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

## Part 2: Thematic Basket Implementation

### 2.1 Core Thematic Basket Service

```typescript
// services/thematic-basket.service.ts

export interface ThematicBasketRequest {
  user_query: string;
  theme?: string;
  max_stocks?: number;
  min_stocks?: number;
  filters?: {
    market_cap_min?: number;
    market_cap_max?: number;
    sectors?: string[];
    exclude_sectors?: string[];
    min_volume?: number;
    regions?: ('US' | 'EU' | 'ASIA' | 'GLOBAL')[];
  };
}

export interface BasketStock {
  sub_group: string;
  ticker: string;
  name: string;
  rationale: string;
  theme_relevance_score: number;
  market_cap: number;
  sector: string;
  is_pure_play: boolean;
}

export interface ThematicBasketResult {
  narrative: string;
  data: {
    theme: string;
    overview: string;
    selection_criteria: string[];
    top_pure_plays: string[];
    basket: BasketStock[];
    metadata: {
      total_tickers: number;
      generation_time_ms: number;
      sub_groups: string[];
    };
  };
  json_representation: any;
  confidence: number;
}

export class ThematicBasketService {
  constructor(
    private llmService: LLMService,
    private dataService: MarketDataService,
    private screeningService: StockScreeningService,
    private validationService: TickerValidationService,
    private eventPublisher: EventPublisher
  ) {}

  /**
   * Main entry point for thematic basket generation
   */
  async generateThematicBasket(request: ThematicBasketRequest): Promise<ThematicBasketResult> {
    const startTime = Date.now();

    try {
      await this.publishEvent('basket_generation_start', {
        theme: request.theme || 'auto-detected',
        user_query: request.user_query
      });

      // Step 1: Enhance query for institutional-grade output
      const enhancedQuery = this.enhanceThematicQuery(request);

      // Step 2: Generate initial basket using LLM
      const initialBasket = await this.generateInitialBasket(enhancedQuery, request);

      // Step 3: Validate and enrich tickers
      const validatedBasket = await this.validateAndEnrichBasket(initialBasket);

      // Step 4: Organize into sub-groups and rank
      const organizedBasket = this.organizeBasket(validatedBasket);

      // Step 5: Generate structured data and narrative
      const structuredData = this.generateStructuredData(organizedBasket, request);

      // Step 6: Create JSON representation for frontend
      const jsonRepresentation = this.createJsonRepresentation(structuredData);

      await this.publishEvent('basket_generation_complete', {
        theme: structuredData.theme,
        total_stocks: structuredData.basket.length,
        generation_time_ms: Date.now() - startTime
      });

      return {
        narrative: structuredData.narrative,
        data: structuredData,
        json_representation: jsonRepresentation,
        confidence: 0.9
      };

    } catch (error) {
      await this.publishEvent('basket_generation_error', {
        error: error.message,
        generation_time_ms: Date.now() - startTime
      });
      throw error;
    }
  }

  /**
   * Enhance query with institutional requirements
   */
  private enhanceThematicQuery(request: ThematicBasketRequest): string {
    const baseQuery = request.user_query;
    const targetCount = request.max_stocks || 10;
    const minCount = request.min_stocks || 5;

    return `
Build a comprehensive thematic investment basket for institutional traders and portfolio managers on the theme: ${baseQuery}

Requirements:
- Identify ${minCount}-${targetCount} high-quality, liquid equity names (max 50 unless theme requires depth)
- Organize into logical sub-groups by theme purity, liquidity, and market cap
- Provide institutional-grade rationale for each selection (≤15 words)
- Include selection criteria and top 3 pure-play recommendations
- Focus on actionable insights for professional investors
- Format with clear theme overview, selection criteria, and structured basket table

Filters:
${request.filters ? JSON.stringify(request.filters, null, 2) : 'None'}

Original user query: ${baseQuery}`;
  }

  /**
   * Generate initial basket using LLM
   */
  private async generateInitialBasket(
    enhancedQuery: string,
    request: ThematicBasketRequest
  ): Promise<any> {
    const systemPrompt = THEMATIC_BASKET_SYSTEM_PROMPT;

    const prompt = `
${enhancedQuery}

## Output Format Requirements

You MUST structure your response with these exact sections for data extraction:

### THEME OVERVIEW
[75 words max institutional context]

### SELECTION CRITERIA
- [Criterion 1]
- [Criterion 2]
- [Criterion 3]
- [Additional criteria as needed]

### TOP 3 PURE-PLAYS
1. **[TICKER1]** - [Company Name] - [Brief reason]
2. **[TICKER2]** - [Company Name] - [Brief reason]
3. **[TICKER3]** - [Company Name] - [Brief reason]

### BASKET TABLE

| Sub-Group | Ticker | Name | Rationale |
|-----------|--------|------|-----------|
| [Category] | [TICKER] | [Company Name] | [15 words max institutional rationale] |
| ... | ... | ... | ... |

IMPORTANT:
- Use exact headers as shown
- Maintain table format with | delimiters
- Keep rationales under 15 words
- Include ${request.min_stocks || 10}-${request.max_stocks || 50} stocks total`;

    const response = await this.llmService.generate(prompt, {
      system: systemPrompt,
      temperature: 0.7,
      max_tokens: 2000
    });

    return this.parseBasketResponse(response);
  }

  /**
   * Parse LLM response into structured format
   */
  private parseBasketResponse(response: string): any {
    const sections: any = {};

    // Extract Theme Overview
    const overviewMatch = response.match(/### THEME OVERVIEW\s*\n([\s\S]*?)(?=###|$)/);
    sections.overview = overviewMatch ? overviewMatch[1].trim() : '';

    // Extract Selection Criteria
    const criteriaMatch = response.match(/### SELECTION CRITERIA\s*\n([\s\S]*?)(?=###|$)/);
    if (criteriaMatch) {
      sections.criteria = criteriaMatch[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim());
    }

    // Extract Top 3 Pure-Plays
    const purePlaysMatch = response.match(/### TOP 3 PURE-PLAYS\s*\n([\s\S]*?)(?=###|$)/);
    if (purePlaysMatch) {
      const purePlayLines = purePlaysMatch[1]
        .split('\n')
        .filter(line => line.match(/^\d\./));

      sections.purePlays = purePlayLines.map(line => {
        const match = line.match(/\*\*([A-Z]+)\*\*\s*-\s*([^-]+)\s*-\s*(.+)/);
        if (match) {
          return {
            ticker: match[1],
            name: match[2].trim(),
            reason: match[3].trim()
          };
        }
        return null;
      }).filter(Boolean);
    }

    // Extract Basket Table
    const tableMatch = response.match(/### BASKET TABLE[\s\S]*?\n([\s\S]*?)(?=$)/);
    if (tableMatch) {
      const tableLines = tableMatch[1]
        .split('\n')
        .filter(line => line.includes('|') && !line.includes('---'));

      sections.basket = tableLines
        .slice(1) // Skip header row
        .map(line => {
          const parts = line.split('|').map(p => p.trim()).filter(Boolean);
          if (parts.length >= 4) {
            return {
              sub_group: parts[0],
              ticker: parts[1],
              name: parts[2],
              rationale: parts[3]
            };
          }
          return null;
        })
        .filter(Boolean);
    }

    return sections;
  }

  /**
   * Validate tickers and enrich with market data
   */
  private async validateAndEnrichBasket(initialBasket: any): Promise<BasketStock[]> {
    const stocks = initialBasket.basket || [];
    const purePlays = new Set(
      (initialBasket.purePlays || []).map(p => p.ticker)
    );

    // Validate all tickers in parallel
    const validationPromises = stocks.map(async (stock: any) => {
      const isValid = await this.validationService.validateTicker(stock.ticker);
      if (!isValid) {
        console.warn(`Invalid ticker: ${stock.ticker}`);
        return null;
      }

      // Fetch additional data
      try {
        const quote = await this.dataService.getQuote(stock.ticker);
        const sectorInfo = await this.dataService.getSectorInfo(stock.ticker);

        return {
          ...stock,
          theme_relevance_score: purePlays.has(stock.ticker) ? 1.0 : 0.7,
          market_cap: quote.marketCap,
          sector: sectorInfo.sector,
          is_pure_play: purePlays.has(stock.ticker)
        } as BasketStock;
      } catch (error) {
        console.error(`Failed to enrich ${stock.ticker}:`, error);
        return {
          ...stock,
          theme_relevance_score: 0.5,
          market_cap: 0,
          sector: 'Unknown',
          is_pure_play: purePlays.has(stock.ticker)
        } as BasketStock;
      }
    });

    const results = await Promise.all(validationPromises);
    return results.filter(Boolean) as BasketStock[];
  }

  /**
   * Organize basket by sub-groups and sort
   */
  private organizeBasket(basket: BasketStock[]): BasketStock[] {
    // Group by sub_group
    const grouped = basket.reduce((acc, stock) => {
      if (!acc[stock.sub_group]) {
        acc[stock.sub_group] = [];
      }
      acc[stock.sub_group].push(stock);
      return acc;
    }, {} as Record<string, BasketStock[]>);

    // Sort within each group
    Object.keys(grouped).forEach(group => {
      grouped[group].sort((a, b) => {
        // Sort by: pure-play status, theme relevance, market cap
        if (a.is_pure_play !== b.is_pure_play) {
          return a.is_pure_play ? -1 : 1;
        }
        if (a.theme_relevance_score !== b.theme_relevance_score) {
          return b.theme_relevance_score - a.theme_relevance_score;
        }
        return b.market_cap - a.market_cap;
      });
    });

    // Flatten back to array
    return Object.values(grouped).flat();
  }

  /**
   * Generate final structured data
   */
  private generateStructuredData(
    basket: BasketStock[],
    request: ThematicBasketRequest
  ): any {
    const theme = request.theme || this.extractThemeFromQuery(request.user_query);
    const subGroups = [...new Set(basket.map(s => s.sub_group))];
    const purePlays = basket.filter(s => s.is_pure_play).slice(0, 3);

    // Generate markdown narrative
    const narrative = this.generateMarkdownNarrative(theme, basket, subGroups);

    return {
      theme,
      overview: `Institutional-grade basket for ${theme} theme with ${basket.length} carefully selected equities`,
      selection_criteria: [
        `Theme relevance and purity of play`,
        `Market liquidity (min $10M daily volume)`,
        `Fundamental strength and growth prospects`,
        `Risk-adjusted return potential`,
        `Portfolio diversification benefits`
      ],
      top_pure_plays: purePlays.map(s => `${s.ticker} - ${s.name}`),
      basket,
      narrative,
      metadata: {
        total_tickers: basket.length,
        generation_time_ms: 0, // Will be set by caller
        sub_groups: subGroups
      }
    };
  }

  /**
   * Generate markdown narrative for the basket
   */
  private generateMarkdownNarrative(
    theme: string,
    basket: BasketStock[],
    subGroups: string[]
  ): string {
    let markdown = `# 📊 Thematic Investment Basket: ${theme}\n\n`;
    markdown += `## Theme Overview\n\n`;
    markdown += `This institutional-grade basket identifies ${basket.length} high-conviction opportunities within the ${theme} theme, organized across ${subGroups.length} strategic sub-categories for optimal portfolio construction.\n\n`;

    markdown += `## Selection Criteria\n\n`;
    markdown += `- **Theme Alignment**: Direct revenue exposure or strategic positioning\n`;
    markdown += `- **Market Quality**: Minimum $10M daily volume, established market presence\n`;
    markdown += `- **Growth Potential**: Above-sector growth rates with expanding margins\n`;
    markdown += `- **Risk Profile**: Balanced risk-reward with manageable volatility\n\n`;

    markdown += `## Top 3 Pure-Plays\n\n`;
    const purePlays = basket.filter(s => s.is_pure_play).slice(0, 3);
    purePlays.forEach((stock, i) => {
      markdown += `${i + 1}. **${stock.ticker}** - ${stock.name} - *${stock.rationale}*\n`;
    });
    markdown += '\n';

    markdown += `## Complete Basket\n\n`;
    markdown += `| Sub-Group | Ticker | Company | Investment Thesis |\n`;
    markdown += `|-----------|--------|---------|------------------|\n`;

    basket.forEach(stock => {
      markdown += `| ${stock.sub_group} | **${stock.ticker}** | ${stock.name} | ${stock.rationale} |\n`;
    });

    markdown += `\n## Implementation Notes\n\n`;
    markdown += `- **Equal Weight**: Start with equal weighting, adjust based on conviction\n`;
    markdown += `- **Rebalancing**: Quarterly review recommended\n`;
    markdown += `- **Risk Management**: Set 5-7% stop-loss on individual positions\n`;
    markdown += `- **Time Horizon**: 12-24 month investment horizon optimal\n`;

    return markdown;
  }

  /**
   * Create JSON representation for frontend consumption
   */
  private createJsonRepresentation(structuredData: any): any {
    return {
      theme: {
        name: structuredData.theme,
        description: structuredData.overview
      },
      metrics: {
        total_stocks: structuredData.basket.length,
        sub_groups_count: structuredData.metadata.sub_groups.length,
        pure_plays_count: structuredData.basket.filter(s => s.is_pure_play).length
      },
      selection_criteria: structuredData.selection_criteria,
      top_picks: structuredData.top_pure_plays.map(pick => {
        const [ticker, ...nameParts] = pick.split(' - ');
        return {
          ticker,
          name: nameParts.join(' - ')
        };
      }),
      sub_groups: structuredData.metadata.sub_groups.map(group => ({
        name: group,
        stocks: structuredData.basket
          .filter(s => s.sub_group === group)
          .map(s => ({
            ticker: s.ticker,
            name: s.name,
            rationale: s.rationale,
            is_pure_play: s.is_pure_play,
            relevance_score: s.theme_relevance_score
          }))
      })),
      implementation_guidance: {
        weighting_strategy: 'equal_weight_initial',
        rebalancing_frequency: 'quarterly',
        risk_parameters: {
          stop_loss_percent: 7,
          position_size_max_percent: 10
        },
        investment_horizon_months: 18
      }
    };
  }

  private async publishEvent(type: string, data: any): Promise<void> {
    await this.eventPublisher.publish({
      event_type: `thematic_basket.${type}`,
      timestamp: new Date().toISOString(),
      ...data
    });
  }
}
```

### 2.2 Thematic Basket Route Executor

```typescript
// executors/thematic-basket-route.executor.ts

export class ThematicBasketRouteExecutor implements RouteExecutor {
  constructor(
    private basketService: ThematicBasketService,
    private streamingService: StreamingService,
    private tickerExtractionService: TickerExtractionService
  ) {}

  async execute(params: RouteExecutionParams): Promise<ChatResponse> {
    const { context, classification, requestId, eventPublisher } = params;

    try {
      // Start fast thoughts streaming
      const thoughtsStream = this.streamFastThoughts(
        context.user_query,
        classification.metadata?.theme
      );

      // Generate basket in parallel
      const basketPromise = this.basketService.generateThematicBasket({
        user_query: context.user_query,
        theme: classification.metadata?.theme,
        max_stocks: 50,
        min_stocks: 10
      });

      // Stream thoughts while basket generates
      for await (const thought of thoughtsStream) {
        await eventPublisher.publish({
          event_type: 'streaming_content',
          content: { chunk: thought, system: 'fast' }
        });
      }

      // Wait for basket generation
      const basketResult = await basketPromise;

      // Extract all tickers for additional processing
      const extractedTickers = await this.tickerExtractionService.extractFromBasket(
        basketResult.data.basket
      );

      // Stream the narrative response
      await this.streamingService.streamResponse(
        basketResult.narrative,
        requestId,
        'slow'
      );

      return {
        response: basketResult.narrative,
        collection: {
          thematic_basket_data: basketResult.json_representation,
          extracted_tickers: extractedTickers,
          theme: basketResult.data.theme,
          basket_summary: {
            total_stocks: basketResult.data.metadata.total_tickers,
            sub_groups: basketResult.data.metadata.sub_groups,
            top_picks: basketResult.data.top_pure_plays
          }
        },
        route_used: 'thematic_baskets_route',
        confidence: basketResult.confidence,
        status: 'success'
      };

    } catch (error) {
      console.error('Thematic basket route execution failed:', error);
      throw new RouteExecutionError('Basket generation failed', error);
    }
  }

  private async* streamFastThoughts(
    query: string,
    theme?: string
  ): AsyncGenerator<string> {
    const thoughts = [
      `Analyzing thematic investment opportunity...`,
      `Identified theme: ${theme || 'extracting from query'}`,
      `Researching relevant sectors and industries...`,
      `Screening for high-quality liquid equities...`,
      `Evaluating theme alignment and purity of play...`,
      `Organizing into strategic sub-categories...`,
      `Building institutional-grade basket...`
    ];

    for (const thought of thoughts) {
      yield thought + '\n';
      await this.delay(600);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

## Configuration & Integration

### Configuration Settings

```typescript
// config/shortcircuit-routes.config.ts

export const ShortCircuitRoutesConfig = {
  comparison: {
    enabled: true,
    max_tickers: 10,
    default_timeframe: '1Y',
    cache_ttl_seconds: 300,
    parallel_data_fetch: true,
    include_fundamentals: true,
    include_technicals: true,
    streaming: {
      enable_fast_thoughts: true,
      thought_delay_ms: 500
    }
  },

  thematic_basket: {
    enabled: true,
    default_min_stocks: 10,
    default_max_stocks: 50,
    max_allowed_stocks: 100,
    validation: {
      validate_tickers: true,
      enrich_with_data: true,
      remove_invalid: true
    },
    generation: {
      temperature: 0.7,
      max_tokens: 2000,
      enhance_query: true
    },
    streaming: {
      enable_fast_thoughts: true,
      thought_delay_ms: 600
    }
  },

  performance: {
    comparison_timeout_ms: 10000,
    basket_timeout_ms: 30000,
    parallel_enrichment_batch_size: 10,
    cache_strategy: 'aggressive' // 'aggressive' | 'moderate' | 'minimal'
  }
};
```

### Prompt Constants

```typescript
// prompts/thematic-basket.prompts.ts

export const THEMATIC_BASKET_SYSTEM_PROMPT = `
You are an Elite Equity Strategist building institutional-grade thematic investment baskets.

Your expertise:
- Identifying pure-play and adjacent opportunities within investment themes
- Organizing stocks into logical sub-categories for portfolio construction
- Providing concise, actionable rationales for each selection
- Balancing theme exposure with portfolio diversification

Guidelines:
- Focus on liquid, investable equities (no micro-caps unless specifically requested)
- Organize into clear sub-groups (e.g., "Core Infrastructure", "Enabling Technologies")
- Rationales must be specific and under 15 words
- Prioritize theme purity, then liquidity, then market cap
- Include both established leaders and emerging players when appropriate
`;

export const COMPARISON_SYSTEM_PROMPT = `
You are a Senior Equity Analyst providing focused stock comparisons.

Your expertise:
- Side-by-side analysis of financial metrics and performance
- Identifying relative strengths and weaknesses
- Providing actionable investment perspectives
- Clear, data-driven communication

Guidelines:
- Use specific numbers and percentages from provided data
- Highlight the most significant differences
- Consider multiple timeframes (short and long-term)
- Maintain objectivity while noting investment implications
- Keep analysis concise and decision-oriented
`;
```

## Testing Strategy

### Unit Tests

```typescript
// tests/shortcircuit-routes.test.ts

describe('Short-Circuit Routes', () => {
  describe('Comparison Route', () => {
    it('should extract tickers correctly from various formats', async () => {
      const testCases = [
        { query: 'Compare AAPL and MSFT', expected: ['AAPL', 'MSFT'] },
        { query: 'GOOGL vs META performance', expected: ['GOOGL', 'META'] },
        { query: '$TSLA versus $NVDA', expected: ['TSLA', 'NVDA'] },
        { query: 'Apple compared to Microsoft', expected: ['AAPL', 'MSFT'] }
      ];

      for (const test of testCases) {
        const result = await comparisonService.extractAndValidateTickers({
          user_query: test.query,
          tickers: []
        });
        expect(result).toEqual(expect.arrayContaining(test.expected));
      }
    });

    it('should complete comparison within 10 seconds', async () => {
      const startTime = Date.now();

      const result = await comparisonService.executeComparison({
        user_query: 'Compare AAPL and MSFT',
        tickers: ['AAPL', 'MSFT']
      });

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(10000);
      expect(result.data.comparison_data).toHaveProperty('AAPL');
      expect(result.data.comparison_data).toHaveProperty('MSFT');
    });
  });

  describe('Thematic Basket Route', () => {
    it('should generate valid basket structure', async () => {
      const result = await basketService.generateThematicBasket({
        user_query: 'AI and machine learning stocks',
        max_stocks: 20
      });

      expect(result.data.basket).toBeInstanceOf(Array);
      expect(result.data.basket.length).toBeGreaterThan(5);
      expect(result.data.basket.length).toBeLessThanOrEqual(20);

      result.data.basket.forEach(stock => {
        expect(stock).toHaveProperty('ticker');
        expect(stock).toHaveProperty('name');
        expect(stock).toHaveProperty('rationale');
        expect(stock).toHaveProperty('sub_group');
      });
    });

    it('should identify pure-plays correctly', async () => {
      const result = await basketService.generateThematicBasket({
        user_query: 'Electric vehicle stocks'
      });

      const purePlays = result.data.basket.filter(s => s.is_pure_play);
      expect(purePlays.length).toBeGreaterThan(0);
      expect(purePlays.length).toBeLessThanOrEqual(3);
    });

    it('should complete within 30 seconds', async () => {
      const startTime = Date.now();

      await basketService.generateThematicBasket({
        user_query: 'Clean energy stocks',
        max_stocks: 30
      });

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(30000);
    });
  });
});
```

## Performance Optimization

### Caching Strategy

```typescript
// services/shortcircuit-cache.service.ts

export class ShortCircuitCacheService {
  private readonly COMPARISON_PREFIX = 'comp:';
  private readonly BASKET_PREFIX = 'basket:';

  async cacheComparison(
    tickers: string[],
    data: ComparisonData,
    ttl: number = 300
  ): Promise<void> {
    const key = this.COMPARISON_PREFIX + tickers.sort().join('-');
    await this.cache.set(key, data, ttl);
  }

  async getCachedComparison(tickers: string[]): Promise<ComparisonData | null> {
    const key = this.COMPARISON_PREFIX + tickers.sort().join('-');
    return await this.cache.get(key);
  }

  async cacheBasket(
    theme: string,
    data: ThematicBasketResult,
    ttl: number = 600
  ): Promise<void> {
    const key = this.BASKET_PREFIX + this.hashTheme(theme);
    await this.cache.set(key, data, ttl);
  }

  private hashTheme(theme: string): string {
    // Create consistent hash for theme-based caching
    return crypto.createHash('md5').update(theme.toLowerCase()).digest('hex');
  }
}
```

## Deployment Checklist

### Prerequisites
- [ ] Market data service configured
- [ ] Stock screening service available
- [ ] Ticker validation service ready
- [ ] LLM service with sufficient token limits

### Implementation Steps

1. **Week 1: Comparison Route**
   - [ ] Implement ComparisonRouteService
   - [ ] Add ticker extraction methods
   - [ ] Set up data fetching pipeline
   - [ ] Create comparison narrative generator

2. **Week 2: Thematic Basket Route**
   - [ ] Implement ThematicBasketService
   - [ ] Add basket parsing logic
   - [ ] Create validation and enrichment pipeline
   - [ ] Build JSON representation generator

3. **Week 3: Integration & Optimization**
   - [ ] Wire up route executors
   - [ ] Implement caching layer
   - [ ] Add streaming support
   - [ ] Performance testing

4. **Week 4: Polish & Deploy**
   - [ ] Edge case handling
   - [ ] Error recovery
   - [ ] Documentation
   - [ ] Production deployment

This completes the comprehensive implementation guide for short-circuit routes.