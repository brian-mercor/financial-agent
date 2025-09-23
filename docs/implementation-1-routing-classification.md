# Implementation Guide 1: Intelligent Query Routing & Classification System

## Overview
This document provides comprehensive implementation details for the 5-route classification system that intelligently routes user queries to optimize response time and quality. This is a critical component that determines the entire response generation pipeline.

## Architecture Components

### 1. Core Classification Service

```typescript
// services/query-classifier.service.ts

import { Observable, forkJoin } from 'rxjs';
import { LLMService } from './llm.service';

export interface ClassificationResult {
  simple_followup: boolean;
  casual_conversation: boolean;
  light_path: boolean;
  comparison_route: boolean;
  thematic_baskets_route: boolean;
  portfolio_agent: boolean;
  chart_request: boolean;
  reasoning: Record<string, string>;
  confidence_scores: Record<string, number>;
}

export interface QueryContext {
  user_query: string;
  conversation_history: ConversationItem[];
  workflow_options?: WorkflowOptions;
  persona?: UserPersona;
  mode?: 'standard' | 'bny' | 'portfolio_agent';
}

export class QueryClassifierService {
  constructor(
    private llmService: LLMService,
    private cacheService: CacheService
  ) {}

  /**
   * Main classification method - runs all checks in parallel
   */
  async classifyQuery(context: QueryContext): Promise<ClassificationResult> {
    // Check for manual route overrides first
    if (context.workflow_options) {
      const override = this.checkManualOverrides(context.workflow_options);
      if (override) return override;
    }

    // Check cache for recent similar queries
    const cacheKey = this.generateCacheKey(context);
    const cached = await this.cacheService.get(cacheKey);
    if (cached && this.isCacheValid(cached)) {
      return cached.classification;
    }

    // Run all classification checks in parallel
    const [
      simpleFollowup,
      casualConversation,
      lightPath,
      comparisonRoute,
      thematicBasket,
      chartRequest
    ] = await Promise.all([
      this.checkSimpleFollowup(context),
      this.checkCasualConversation(context),
      this.checkLightPath(context),
      this.checkComparisonRoute(context),
      this.checkThematicBasket(context),
      this.checkChartRequest(context)
    ]);

    const result: ClassificationResult = {
      simple_followup: simpleFollowup.classification,
      casual_conversation: casualConversation.classification,
      light_path: lightPath.classification,
      comparison_route: comparisonRoute.classification,
      thematic_baskets_route: thematicBasket.classification,
      portfolio_agent: context.mode === 'portfolio_agent',
      chart_request: chartRequest.classification,
      reasoning: this.combineReasonings(
        simpleFollowup,
        casualConversation,
        lightPath,
        comparisonRoute,
        thematicBasket,
        chartRequest
      ),
      confidence_scores: this.extractConfidenceScores(
        simpleFollowup,
        casualConversation,
        lightPath,
        comparisonRoute,
        thematicBasket,
        chartRequest
      )
    };

    // Cache the result
    await this.cacheService.set(cacheKey, {
      classification: result,
      timestamp: Date.now()
    }, 300); // 5 minute TTL

    return result;
  }

  /**
   * Check if query is a simple follow-up that can be answered from context
   */
  private async checkSimpleFollowup(context: QueryContext): Promise<ClassificationCheck> {
    const prompt = `
Analyze if this is a simple follow-up question that can be answered using ONLY the conversation context.

CONVERSATION HISTORY:
${this.formatConversationHistory(context.conversation_history)}

CURRENT QUESTION: ${context.user_query}

Follow-up indicators:
- References "that", "this", "it" without clear standalone context
- Clarification requests: "Can you explain that further?"
- Building on previous topics: "What about Microsoft?" (when Apple was just discussed)
- NEW ENTITY FOLLOW-UPS: These require new analysis, return false

CAN IT BE ANSWERED WITH CONVERSATION CONTEXT ONLY?
Check if the conversation history contains sufficient information to fully answer the question.

Return JSON only:
{
  "is_followup": boolean,
  "can_answer_with_context": boolean,
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation"
}`;

    try {
      const response = await this.llmService.generateJSON(prompt, {
        temperature: 0.3,
        max_tokens: 200
      });

      return {
        classification: response.is_followup && response.can_answer_with_context,
        confidence: response.confidence || 0.5,
        reasoning: response.reasoning
      };
    } catch (error) {
      console.error('Simple followup check failed:', error);
      return { classification: false, confidence: 0, reasoning: 'Check failed' };
    }
  }

  /**
   * Check if this is casual conversation or platform help
   */
  private async checkCasualConversation(context: QueryContext): Promise<ClassificationCheck> {
    const prompt = `
Determine if this is casual conversation, platform help, or greeting.

USER QUERY: ${context.user_query}

CASUAL CONVERSATION INDICATORS:
- Greetings: "hello", "hi", "good morning"
- Platform questions: "what can you do", "how does this work"
- Meta questions: "are you AI", "who made you"
- Competitive questions: "how do you compare to Bloomberg"
- Small talk: weather, jokes, general chat

Return JSON only:
{
  "is_casual_conversation": boolean,
  "confidence": 0.0-1.0,
  "category": "greeting" | "platform_help" | "meta_question" | "small_talk" | "not_casual",
  "reasoning": "brief explanation"
}`;

    try {
      const response = await this.llmService.generateJSON(prompt, {
        temperature: 0.3,
        max_tokens: 200
      });

      return {
        classification: response.is_casual_conversation,
        confidence: response.confidence || 0.5,
        reasoning: response.reasoning,
        metadata: { category: response.category }
      };
    } catch (error) {
      console.error('Casual conversation check failed:', error);
      return { classification: false, confidence: 0, reasoning: 'Check failed' };
    }
  }

  /**
   * Check if query needs only 1-3 quick data lookups (light path)
   */
  private async checkLightPath(context: QueryContext): Promise<ClassificationCheck> {
    const prompt = `
Determine if this query can be answered with 1-3 quick data lookups (light path).

USER QUERY: ${context.user_query}

LIGHT PATH CRITERIA:
✅ QUALIFIES (return true):
- Single data point requests: "What's AAPL's PE ratio?"
- Simple lookups: "Show me MSFT's latest earnings"
- Direct questions: "What's the Fed rate?"
- Single-topic analysis: "NVDA sentiment today"

❌ DOES NOT QUALIFY (return false):
- Comparisons: "Compare AAPL vs MSFT"
- Multi-factor analysis: "Analyze TSLA's prospects"
- Investment advice: "Should I buy?"
- Complex synthesis: "Market outlook with rates and earnings"
- Thematic requests: "AI stocks to watch"

Return JSON only:
{
  "is_light_path": boolean,
  "estimated_lookups": 1-10,
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation"
}`;

    try {
      const response = await this.llmService.generateJSON(prompt, {
        temperature: 0.3,
        max_tokens: 200
      });

      return {
        classification: response.is_light_path && response.estimated_lookups <= 3,
        confidence: response.confidence || 0.5,
        reasoning: response.reasoning,
        metadata: { estimated_lookups: response.estimated_lookups }
      };
    } catch (error) {
      console.error('Light path check failed:', error);
      return { classification: false, confidence: 0, reasoning: 'Check failed' };
    }
  }

  /**
   * Check if this is a comparison request between specific tickers
   */
  private async checkComparisonRoute(context: QueryContext): Promise<ClassificationCheck> {
    // First, quick regex check for comparison keywords
    const comparisonKeywords = /compare|versus|vs\.?|against|difference between|better|comparison/i;
    if (!comparisonKeywords.test(context.user_query)) {
      return { classification: false, confidence: 1.0, reasoning: 'No comparison keywords found' };
    }

    const prompt = `
Determine if this is a request to compare specific stocks/companies.

USER QUERY: ${context.user_query}

COMPARISON ROUTE CRITERIA:
✅ QUALIFIES (return true):
- "Compare AAPL and MSFT"
- "GOOGL vs META performance"
- "Which is better: NVDA or AMD?"
- "Difference between Tesla and Rivian"

❌ DOES NOT QUALIFY (return false):
- "Compare tech stocks" (too broad, no specific tickers)
- "How does inflation compare to last year" (not stocks)
- "Best stocks to buy" (not comparison)

Extract ticker symbols if found.

Return JSON only:
{
  "is_comparison": boolean,
  "tickers_found": ["TICKER1", "TICKER2"],
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation"
}`;

    try {
      const response = await this.llmService.generateJSON(prompt, {
        temperature: 0.3,
        max_tokens: 200
      });

      return {
        classification: response.is_comparison && response.tickers_found?.length >= 2,
        confidence: response.confidence || 0.5,
        reasoning: response.reasoning,
        metadata: { tickers: response.tickers_found }
      };
    } catch (error) {
      console.error('Comparison route check failed:', error);
      return { classification: false, confidence: 0, reasoning: 'Check failed' };
    }
  }

  /**
   * Check if this is a thematic basket request
   */
  private async checkThematicBasket(context: QueryContext): Promise<ClassificationCheck> {
    // Quick check for thematic keywords
    const thematicKeywords = /theme|basket|stocks for|plays? on|exposure to|companies in|sector|industry|trend/i;
    if (!thematicKeywords.test(context.user_query)) {
      return { classification: false, confidence: 1.0, reasoning: 'No thematic keywords found' };
    }

    const prompt = `
Determine if this is a request for a thematic basket of stocks.

USER QUERY: ${context.user_query}

THEMATIC BASKET CRITERIA:
✅ QUALIFIES (return true):
- "AI stocks to invest in"
- "Clean energy plays"
- "Companies benefiting from remote work"
- "Chip manufacturers"
- "Banks with high dividends"
- "EV charging infrastructure stocks"

❌ DOES NOT QUALIFY (return false):
- "AAPL and MSFT comparison" (specific comparison)
- "What's the best tech stock?" (single stock)
- "Market outlook" (general analysis)

Return JSON only:
{
  "is_thematic_basket": boolean,
  "theme_identified": "theme description",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation"
}`;

    try {
      const response = await this.llmService.generateJSON(prompt, {
        temperature: 0.3,
        max_tokens: 200
      });

      return {
        classification: response.is_thematic_basket,
        confidence: response.confidence || 0.5,
        reasoning: response.reasoning,
        metadata: { theme: response.theme_identified }
      };
    } catch (error) {
      console.error('Thematic basket check failed:', error);
      return { classification: false, confidence: 0, reasoning: 'Check failed' };
    }
  }

  /**
   * Check if query requests a chart/visualization
   */
  private async checkChartRequest(context: QueryContext): Promise<ClassificationCheck> {
    const chartKeywords = /chart|graph|plot|visuali[sz]e|show me.*trend|display.*data/i;
    const hasChartKeyword = chartKeywords.test(context.user_query);

    // Extract potential ticker symbols
    const tickerPattern = /\b[A-Z]{1,5}\b/g;
    const potentialTickers = context.user_query.match(tickerPattern) || [];

    return {
      classification: hasChartKeyword && potentialTickers.length > 0,
      confidence: hasChartKeyword ? 0.9 : 0.1,
      reasoning: hasChartKeyword
        ? `Chart keyword found with potential tickers: ${potentialTickers.join(', ')}`
        : 'No chart visualization keywords found',
      metadata: { tickers: potentialTickers }
    };
  }
}
```

### 2. Route Manager Implementation

```typescript
// services/route-manager.service.ts

export enum ResponseRoute {
  SIMPLE_FOLLOWUP = 'simple_followup',
  CASUAL_CONVERSATION = 'casual_conversation',
  COMPARISON = 'comparison_route',
  THEMATIC_BASKET = 'thematic_baskets_route',
  LIGHT_PATH = 'light_path',
  COMPLEX_ANALYSIS = 'complex_analysis'
}

export interface RouteDecision {
  primary_route: ResponseRoute;
  fallback_route?: ResponseRoute;
  confidence: number;
  estimated_time_seconds: number;
  capabilities_needed: string[];
  reasoning: string;
}

export class RouteManagerService {
  constructor(
    private classifierService: QueryClassifierService,
    private capabilityRegistry: CapabilityRegistryService
  ) {}

  /**
   * Determine the optimal route based on classification results
   */
  async determineRoute(
    classification: ClassificationResult,
    context: QueryContext
  ): Promise<RouteDecision> {
    // Priority order for route selection (highest to lowest)
    // This order ensures short-circuits happen when appropriate

    // 1. Check for manual overrides from workflow_options
    if (context.workflow_options?.comparison_route) {
      return this.createRouteDecision(
        ResponseRoute.COMPARISON,
        classification.confidence_scores.comparison_route || 1.0,
        'Manual override: comparison route requested'
      );
    }

    if (context.workflow_options?.thematic_baskets_route) {
      return this.createRouteDecision(
        ResponseRoute.THEMATIC_BASKET,
        classification.confidence_scores.thematic_baskets_route || 1.0,
        'Manual override: thematic basket route requested'
      );
    }

    // 2. Simple follow-up (highest priority for speed)
    if (classification.simple_followup &&
        classification.confidence_scores.simple_followup > 0.7) {
      return this.createRouteDecision(
        ResponseRoute.SIMPLE_FOLLOWUP,
        classification.confidence_scores.simple_followup,
        classification.reasoning.simple_followup
      );
    }

    // 3. Casual conversation (quick response needed)
    if (classification.casual_conversation &&
        classification.confidence_scores.casual_conversation > 0.7) {
      return this.createRouteDecision(
        ResponseRoute.CASUAL_CONVERSATION,
        classification.confidence_scores.casual_conversation,
        classification.reasoning.casual_conversation
      );
    }

    // 4. Comparison route (short-circuit opportunity)
    if (classification.comparison_route &&
        classification.confidence_scores.comparison_route > 0.6) {
      return this.createRouteDecision(
        ResponseRoute.COMPARISON,
        classification.confidence_scores.comparison_route,
        classification.reasoning.comparison_route
      );
    }

    // 5. Thematic basket (specialized handling)
    if (classification.thematic_baskets_route &&
        classification.confidence_scores.thematic_baskets_route > 0.6) {
      return this.createRouteDecision(
        ResponseRoute.THEMATIC_BASKET,
        classification.confidence_scores.thematic_baskets_route,
        classification.reasoning.thematic_baskets_route
      );
    }

    // 6. Light path (quick data lookups)
    if (classification.light_path &&
        classification.confidence_scores.light_path > 0.6) {
      return this.createRouteDecision(
        ResponseRoute.LIGHT_PATH,
        classification.confidence_scores.light_path,
        classification.reasoning.light_path
      );
    }

    // 7. Default to complex analysis for everything else
    return this.createRouteDecision(
      ResponseRoute.COMPLEX_ANALYSIS,
      0.5, // Default confidence
      'No specific route matched - using comprehensive analysis'
    );
  }

  private createRouteDecision(
    route: ResponseRoute,
    confidence: number,
    reasoning: string
  ): RouteDecision {
    const routeConfigs = {
      [ResponseRoute.SIMPLE_FOLLOWUP]: {
        estimated_time: 2,
        capabilities: [],
        fallback: ResponseRoute.LIGHT_PATH
      },
      [ResponseRoute.CASUAL_CONVERSATION]: {
        estimated_time: 2,
        capabilities: ['platform_help_or_casual_conversation'],
        fallback: ResponseRoute.SIMPLE_FOLLOWUP
      },
      [ResponseRoute.COMPARISON]: {
        estimated_time: 10,
        capabilities: ['handle_compare_request', 'ticker_extraction', 'comparison_data_fetch'],
        fallback: ResponseRoute.COMPLEX_ANALYSIS
      },
      [ResponseRoute.THEMATIC_BASKET]: {
        estimated_time: 30,
        capabilities: ['handle_thematic_basket', 'ticker_extraction', 'basket_generation'],
        fallback: ResponseRoute.COMPLEX_ANALYSIS
      },
      [ResponseRoute.LIGHT_PATH]: {
        estimated_time: 15,
        capabilities: ['quick_data_lookup'],
        fallback: ResponseRoute.COMPLEX_ANALYSIS
      },
      [ResponseRoute.COMPLEX_ANALYSIS]: {
        estimated_time: 60,
        capabilities: ['generate_data_plan', 'execute_capabilities', 'consolidator'],
        fallback: null
      }
    };

    const config = routeConfigs[route];

    return {
      primary_route: route,
      fallback_route: config.fallback,
      confidence,
      estimated_time_seconds: config.estimated_time,
      capabilities_needed: config.capabilities,
      reasoning
    };
  }

  /**
   * Validate if a route can be executed with current system state
   */
  async validateRoute(decision: RouteDecision): Promise<boolean> {
    // Check if all required capabilities are available
    for (const capability of decision.capabilities_needed) {
      const isAvailable = await this.capabilityRegistry.isCapabilityAvailable(capability);
      if (!isAvailable) {
        console.warn(`Required capability ${capability} not available for route ${decision.primary_route}`);
        return false;
      }
    }

    return true;
  }

  /**
   * Get fallback route if primary fails
   */
  getFallbackRoute(decision: RouteDecision): RouteDecision | null {
    if (!decision.fallback_route) return null;

    return this.createRouteDecision(
      decision.fallback_route,
      decision.confidence * 0.8, // Reduce confidence for fallback
      `Fallback from ${decision.primary_route}: ${decision.reasoning}`
    );
  }
}
```

### 3. Integration with Main Chat Handler

```typescript
// handlers/chat-stream-enhanced.handler.ts

export class EnhancedChatStreamHandler {
  constructor(
    private classifier: QueryClassifierService,
    private routeManager: RouteManagerService,
    private routeExecutors: Map<ResponseRoute, RouteExecutor>,
    private eventPublisher: EventPublisher
  ) {}

  async handleChatRequest(request: ChatRequest): Promise<ChatResponse> {
    const startTime = Date.now();
    const requestId = generateRequestId();

    try {
      // Step 1: Build query context
      const context: QueryContext = {
        user_query: request.message,
        conversation_history: request.history || [],
        workflow_options: request.workflowOptions,
        persona: request.persona,
        mode: this.determineMode(request)
      };

      // Step 2: Classify query (parallel classification)
      await this.publishEvent('classification_start', { requestId });
      const classification = await this.classifier.classifyQuery(context);
      await this.publishEvent('classification_complete', {
        requestId,
        classification,
        duration_ms: Date.now() - startTime
      });

      // Step 3: Determine optimal route
      const routeDecision = await this.routeManager.determineRoute(
        classification,
        context
      );

      await this.publishEvent('route_selected', {
        requestId,
        route: routeDecision.primary_route,
        confidence: routeDecision.confidence,
        estimated_time: routeDecision.estimated_time_seconds
      });

      // Step 4: Validate route feasibility
      const isValid = await this.routeManager.validateRoute(routeDecision);
      if (!isValid && routeDecision.fallback_route) {
        const fallback = this.routeManager.getFallbackRoute(routeDecision);
        if (fallback) {
          routeDecision = fallback;
          await this.publishEvent('route_fallback', {
            requestId,
            new_route: fallback.primary_route,
            reason: 'Primary route validation failed'
          });
        }
      }

      // Step 5: Execute selected route
      const executor = this.routeExecutors.get(routeDecision.primary_route);
      if (!executor) {
        throw new Error(`No executor found for route: ${routeDecision.primary_route}`);
      }

      const response = await executor.execute({
        context,
        classification,
        routeDecision,
        requestId,
        eventPublisher: this.eventPublisher
      });

      // Step 6: Return response with metadata
      return {
        ...response,
        metadata: {
          requestId,
          route_used: routeDecision.primary_route,
          classification_confidence: routeDecision.confidence,
          processing_time_ms: Date.now() - startTime,
          capabilities_used: routeDecision.capabilities_needed
        }
      };

    } catch (error) {
      await this.publishEvent('request_error', {
        requestId,
        error: error.message,
        duration_ms: Date.now() - startTime
      });
      throw error;
    }
  }

  private determineMode(request: ChatRequest): string {
    if (request.workflowOptions?.portfolio_agent) return 'portfolio_agent';
    if (request.assistantType === 'bny') return 'bny';
    return 'standard';
  }

  private async publishEvent(type: string, data: any): Promise<void> {
    await this.eventPublisher.publish({
      event_type: type,
      timestamp: new Date().toISOString(),
      ...data
    });
  }
}
```

### 4. Configuration and Testing

```typescript
// config/classification.config.ts

export const ClassificationConfig = {
  // Confidence thresholds for each route
  thresholds: {
    simple_followup: 0.7,
    casual_conversation: 0.7,
    comparison_route: 0.6,
    thematic_baskets_route: 0.6,
    light_path: 0.6,
    complex_analysis: 0.0 // Always available as fallback
  },

  // Cache settings
  cache: {
    enabled: true,
    ttl_seconds: 300,
    max_size: 1000
  },

  // Parallel execution settings
  parallel: {
    max_concurrent_checks: 6,
    timeout_ms: 5000,
    retry_on_failure: true,
    max_retries: 2
  },

  // LLM settings for classification
  llm: {
    model: 'gpt-4-turbo',
    temperature: 0.3,
    max_tokens: 200,
    timeout_ms: 3000
  },

  // Feature flags
  features: {
    enable_caching: true,
    enable_fallbacks: true,
    enable_confidence_scoring: true,
    enable_manual_overrides: true,
    log_classifications: true
  }
};
```

### 5. Testing Strategy

```typescript
// tests/classification.test.ts

describe('Query Classification System', () => {
  let classifier: QueryClassifierService;
  let routeManager: RouteManagerService;

  beforeEach(() => {
    classifier = new QueryClassifierService(mockLLMService, mockCacheService);
    routeManager = new RouteManagerService(classifier, mockCapabilityRegistry);
  });

  describe('Classification Accuracy', () => {
    const testCases = [
      {
        query: "What was that about inflation you mentioned?",
        expected_route: ResponseRoute.SIMPLE_FOLLOWUP,
        context: { has_history: true }
      },
      {
        query: "Compare AAPL and MSFT performance",
        expected_route: ResponseRoute.COMPARISON,
        context: { has_history: false }
      },
      {
        query: "Show me AI stocks to invest in",
        expected_route: ResponseRoute.THEMATIC_BASKET,
        context: { has_history: false }
      },
      {
        query: "What's Tesla's PE ratio?",
        expected_route: ResponseRoute.LIGHT_PATH,
        context: { has_history: false }
      },
      {
        query: "Analyze my portfolio risk and suggest improvements",
        expected_route: ResponseRoute.COMPLEX_ANALYSIS,
        context: { has_history: false }
      }
    ];

    testCases.forEach(testCase => {
      it(`should classify "${testCase.query}" as ${testCase.expected_route}`, async () => {
        const context: QueryContext = {
          user_query: testCase.query,
          conversation_history: testCase.context.has_history ? mockHistory : [],
          workflow_options: {},
          mode: 'standard'
        };

        const classification = await classifier.classifyQuery(context);
        const route = await routeManager.determineRoute(classification, context);

        expect(route.primary_route).toBe(testCase.expected_route);
        expect(route.confidence).toBeGreaterThan(0.5);
      });
    });
  });

  describe('Parallel Classification Performance', () => {
    it('should complete all classifications within timeout', async () => {
      const startTime = Date.now();

      const context: QueryContext = {
        user_query: "Compare AAPL and MSFT, show me a chart",
        conversation_history: [],
        workflow_options: {},
        mode: 'standard'
      };

      const classification = await classifier.classifyQuery(context);
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(5000); // 5 second timeout
      expect(classification).toHaveProperty('comparison_route');
      expect(classification).toHaveProperty('chart_request');
    });
  });

  describe('Fallback Behavior', () => {
    it('should fallback to complex analysis when route validation fails', async () => {
      // Mock capability unavailable
      mockCapabilityRegistry.isCapabilityAvailable.mockResolvedValue(false);

      const context: QueryContext = {
        user_query: "Compare AAPL and MSFT",
        conversation_history: [],
        workflow_options: {},
        mode: 'standard'
      };

      const classification = await classifier.classifyQuery(context);
      let route = await routeManager.determineRoute(classification, context);

      const isValid = await routeManager.validateRoute(route);
      if (!isValid) {
        route = routeManager.getFallbackRoute(route) || route;
      }

      expect(route.primary_route).toBe(ResponseRoute.COMPLEX_ANALYSIS);
    });
  });
});
```

## Deployment Checklist

### Prerequisites
- [ ] LLM service configured with JSON generation support
- [ ] Cache service (Redis/Memory) available
- [ ] Event publisher configured
- [ ] Capability registry initialized

### Implementation Steps
1. **Week 1: Core Classification**
   - [ ] Implement QueryClassifierService
   - [ ] Set up parallel classification methods
   - [ ] Add caching layer
   - [ ] Unit tests for each classification method

2. **Week 2: Route Management**
   - [ ] Implement RouteManagerService
   - [ ] Add route validation logic
   - [ ] Implement fallback mechanism
   - [ ] Integration tests with classifier

3. **Week 3: Integration**
   - [ ] Integrate with chat handler
   - [ ] Add event publishing
   - [ ] Performance optimization
   - [ ] Load testing with parallel requests

4. **Week 4: Polish**
   - [ ] Add monitoring/metrics
   - [ ] Optimize LLM prompts
   - [ ] Documentation
   - [ ] Production deployment

## Performance Targets

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Classification Latency | < 2s (p95) | End-to-end from request to route decision |
| Classification Accuracy | > 90% | Manual validation of 1000 sample queries |
| Parallel Execution | 6 concurrent | All classification checks run simultaneously |
| Cache Hit Rate | > 40% | Monitor cache hits vs misses |
| Fallback Success Rate | > 95% | Successful fallback when primary fails |

## Monitoring & Observability

```typescript
// monitoring/classification.metrics.ts

export class ClassificationMetrics {
  // Track classification performance
  static recordClassification(
    route: ResponseRoute,
    confidence: number,
    duration_ms: number
  ): void {
    metrics.histogram('classification.duration', duration_ms, {
      route,
      confidence_bucket: Math.floor(confidence * 10) / 10
    });

    metrics.increment('classification.count', {
      route
    });
  }

  // Track route distribution
  static recordRouteSelection(route: ResponseRoute): void {
    metrics.increment('route.selected', {
      route
    });
  }

  // Track failures and fallbacks
  static recordFallback(from: ResponseRoute, to: ResponseRoute): void {
    metrics.increment('route.fallback', {
      from_route: from,
      to_route: to
    });
  }
}
```

## Troubleshooting Guide

### Common Issues

1. **High Latency in Classification**
   - Check LLM service response times
   - Verify parallel execution is working
   - Increase cache TTL if appropriate

2. **Incorrect Route Selection**
   - Review and adjust confidence thresholds
   - Analyze classification reasoning in logs
   - Refine LLM prompts for better accuracy

3. **Excessive Fallbacks**
   - Ensure all required capabilities are registered
   - Check capability health/availability
   - Review route validation logic

4. **Cache Misses**
   - Verify cache key generation logic
   - Check cache size limits
   - Consider increasing TTL for stable queries

This completes the comprehensive implementation guide for the intelligent query routing and classification system. The system will enable the TypeScript backend to match the Python app's sophisticated routing capabilities.