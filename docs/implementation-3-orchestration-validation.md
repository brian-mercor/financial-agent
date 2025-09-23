# Implementation Guide 3: Multi-Agent Orchestration & Response Validation

## Overview
This document provides comprehensive implementation details for the multi-agent orchestration system with parallel capability execution, progressive response enhancement, and a sophisticated validation pipeline that ensures response quality and accuracy.

## Part 1: Multi-Agent Orchestration System

### 1.1 Capability Registry Implementation

```typescript
// services/capability-registry.service.ts

export interface CapabilityDefinition {
  agent_name: string;
  capability_name: string;
  description: string;
  parameters: Record<string, ParameterDefinition>;
  characteristics: CapabilityCharacteristics;
  executor: CapabilityExecutor;
}

export interface ParameterDefinition {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  default?: any;
  validation?: (value: any) => boolean;
}

export interface CapabilityCharacteristics {
  expose_unified: boolean;
  mode_exclusive: boolean;
  allowed_modes?: string[];
  screener_function?: boolean;
  speed: 'Fast' | 'Medium' | 'Slow';
  typical_runtime_ms: number;
  dependencies?: string[];
  cacheable: boolean;
  parallel_safe: boolean;
}

export interface CapabilityExecutor {
  execute(inputs: any, context: ExecutionContext): Promise<any>;
  validate?(inputs: any): Promise<boolean>;
  estimateTime?(inputs: any): number;
}

export class CapabilityRegistryService {
  private capabilities = new Map<string, CapabilityDefinition>();
  private agentCapabilities = new Map<string, Set<string>>();
  private dependencyGraph = new Map<string, Set<string>>();

  /**
   * Register a new capability
   */
  registerCapability(definition: CapabilityDefinition): void {
    const key = `${definition.agent_name}.${definition.capability_name}`;

    // Validate capability definition
    this.validateCapabilityDefinition(definition);

    // Store capability
    this.capabilities.set(key, definition);

    // Update agent mapping
    if (!this.agentCapabilities.has(definition.agent_name)) {
      this.agentCapabilities.set(definition.agent_name, new Set());
    }
    this.agentCapabilities.get(definition.agent_name)!.add(definition.capability_name);

    // Update dependency graph
    if (definition.characteristics.dependencies) {
      this.dependencyGraph.set(key, new Set(definition.characteristics.dependencies));
    }

    console.log(`Registered capability: ${key}`);
  }

  /**
   * Get available capabilities based on mode and filters
   */
  async getAvailableCapabilities(
    mode?: string,
    filters?: {
      expose_unified?: boolean;
      screener_function?: boolean;
      speed?: 'Fast' | 'Medium' | 'Slow';
    }
  ): Promise<CapabilityDefinition[]> {
    const available: CapabilityDefinition[] = [];

    for (const [key, capability] of this.capabilities) {
      // Check mode compatibility
      if (mode && !this.isCapabilityAllowedInMode(capability, mode)) {
        continue;
      }

      // Apply filters
      if (filters) {
        if (filters.expose_unified !== undefined &&
            capability.characteristics.expose_unified !== filters.expose_unified) {
          continue;
        }

        if (filters.screener_function !== undefined &&
            capability.characteristics.screener_function !== filters.screener_function) {
          continue;
        }

        if (filters.speed && capability.characteristics.speed !== filters.speed) {
          continue;
        }
      }

      available.push(capability);
    }

    return available;
  }

  /**
   * Execute a capability
   */
  async executeCapability(
    agentName: string,
    capabilityName: string,
    inputs: any,
    context: ExecutionContext
  ): Promise<any> {
    const key = `${agentName}.${capabilityName}`;
    const capability = this.capabilities.get(key);

    if (!capability) {
      throw new Error(`Capability not found: ${key}`);
    }

    // Validate inputs
    this.validateInputs(capability, inputs);

    // Check if custom validation exists
    if (capability.executor.validate) {
      const isValid = await capability.executor.validate(inputs);
      if (!isValid) {
        throw new Error(`Input validation failed for ${key}`);
      }
    }

    // Execute capability
    try {
      const startTime = Date.now();

      const result = await capability.executor.execute(inputs, context);

      const duration = Date.now() - startTime;
      await this.recordMetrics(key, duration, 'success');

      return result;
    } catch (error) {
      await this.recordMetrics(key, 0, 'failure');
      throw new Error(`Capability execution failed for ${key}: ${error.message}`);
    }
  }

  /**
   * Check if capability is allowed in given mode
   */
  private isCapabilityAllowedInMode(
    capability: CapabilityDefinition,
    mode: string
  ): boolean {
    const chars = capability.characteristics;

    // If mode_exclusive is true, mode must be in allowed_modes
    if (chars.mode_exclusive) {
      return chars.allowed_modes?.includes(mode) || false;
    }

    // If allowed_modes is specified, check if mode is included
    if (chars.allowed_modes) {
      return chars.allowed_modes.includes(mode);
    }

    // No mode restrictions
    return true;
  }

  /**
   * Validate capability definition
   */
  private validateCapabilityDefinition(definition: CapabilityDefinition): void {
    if (!definition.agent_name || !definition.capability_name) {
      throw new Error('Capability must have agent_name and capability_name');
    }

    if (!definition.executor || !definition.executor.execute) {
      throw new Error('Capability must have an executor with execute method');
    }

    // Validate parameter definitions
    for (const [paramName, paramDef] of Object.entries(definition.parameters)) {
      if (!paramDef.type || !paramDef.description) {
        throw new Error(`Invalid parameter definition for ${paramName}`);
      }
    }
  }

  /**
   * Validate inputs against parameter definitions
   */
  private validateInputs(capability: CapabilityDefinition, inputs: any): void {
    for (const [paramName, paramDef] of Object.entries(capability.parameters)) {
      const value = inputs[paramName];

      // Check required parameters
      if (paramDef.required && value === undefined) {
        throw new Error(`Required parameter missing: ${paramName}`);
      }

      // Check type if value provided
      if (value !== undefined) {
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (actualType !== paramDef.type) {
          throw new Error(`Invalid type for ${paramName}: expected ${paramDef.type}, got ${actualType}`);
        }

        // Run custom validation if provided
        if (paramDef.validation && !paramDef.validation(value)) {
          throw new Error(`Validation failed for parameter: ${paramName}`);
        }
      }
    }
  }

  private async recordMetrics(capability: string, duration: number, status: string): Promise<void> {
    // Record capability execution metrics
    // Implementation depends on metrics service
  }
}
```

### 1.2 Execution Plan Generator

```typescript
// services/execution-plan-generator.service.ts

export interface ExecutionStep {
  agent_name: string;
  capability_name: string;
  parameters: Record<string, any>;
  description: string;
  estimated_time_ms: number;
  dependencies: string[];
  priority: number;
}

export interface ExecutionPlan {
  steps: ExecutionStep[];
  estimated_total_time_ms: number;
  parallelization_groups: ExecutionStep[][];
  metadata: {
    query_complexity: 'simple' | 'moderate' | 'complex';
    data_sources_needed: string[];
    optimization_applied: string[];
  };
}

export class ExecutionPlanGenerator {
  constructor(
    private capabilityRegistry: CapabilityRegistryService,
    private llmService: LLMService
  ) {}

  /**
   * Generate optimized execution plan for a query
   */
  async generateExecutionPlan(
    query: string,
    context: QueryContext,
    routeType: ResponseRoute
  ): Promise<ExecutionPlan> {
    // For light path, generate minimal plan
    if (routeType === ResponseRoute.LIGHT_PATH) {
      return this.generateLightPathPlan(query, context);
    }

    // For complex analysis, generate comprehensive plan
    if (routeType === ResponseRoute.COMPLEX_ANALYSIS) {
      return this.generateComplexAnalysisPlan(query, context);
    }

    // Other routes have predefined plans
    return this.getPredefinedPlan(routeType);
  }

  /**
   * Generate plan using LLM for complex queries
   */
  private async generateComplexAnalysisPlan(
    query: string,
    context: QueryContext
  ): Promise<ExecutionPlan> {
    // Get available capabilities
    const capabilities = await this.capabilityRegistry.getAvailableCapabilities(
      context.mode,
      { expose_unified: true }
    );

    const capabilityDescriptions = this.formatCapabilitiesForLLM(capabilities);

    const prompt = `
Analyze this query and create an execution plan using available capabilities.

QUERY: ${query}

AVAILABLE CAPABILITIES:
${capabilityDescriptions}

Create an execution plan that:
1. Identifies all data needed to answer the query
2. Selects appropriate capabilities
3. Minimizes execution time through parallelization
4. Avoids redundant data fetches

Return JSON with this structure:
{
  "steps": [
    {
      "agent_name": "agent_name",
      "capability_name": "capability_name",
      "parameters": { ... },
      "description": "what this step does",
      "dependencies": ["step_ids_that_must_complete_first"]
    }
  ],
  "query_complexity": "simple|moderate|complex",
  "data_sources_needed": ["list", "of", "data", "types"],
  "reasoning": "explanation of plan"
}`;

    try {
      const response = await this.llmService.generateJSON(prompt, {
        temperature: 0.3,
        max_tokens: 1000
      });

      return this.optimizeExecutionPlan(response);
    } catch (error) {
      console.error('Failed to generate execution plan:', error);
      return this.getFallbackPlan(query, context);
    }
  }

  /**
   * Optimize execution plan for parallel execution
   */
  private optimizeExecutionPlan(rawPlan: any): ExecutionPlan {
    const steps: ExecutionStep[] = rawPlan.steps.map((step: any, index: number) => ({
      ...step,
      estimated_time_ms: this.estimateStepTime(step),
      priority: this.calculatePriority(step, index),
      dependencies: step.dependencies || []
    }));

    // Create parallelization groups based on dependencies
    const groups = this.createParallelizationGroups(steps);

    // Calculate total time (sum of longest path)
    const totalTime = this.calculateCriticalPathTime(groups);

    return {
      steps,
      estimated_total_time_ms: totalTime,
      parallelization_groups: groups,
      metadata: {
        query_complexity: rawPlan.query_complexity || 'moderate',
        data_sources_needed: rawPlan.data_sources_needed || [],
        optimization_applied: ['dependency_analysis', 'parallel_grouping']
      }
    };
  }

  /**
   * Create groups of steps that can execute in parallel
   */
  private createParallelizationGroups(steps: ExecutionStep[]): ExecutionStep[][] {
    const groups: ExecutionStep[][] = [];
    const completed = new Set<number>();
    const remaining = [...steps];

    while (remaining.length > 0) {
      const group: ExecutionStep[] = [];

      for (let i = 0; i < remaining.length; i++) {
        const step = remaining[i];
        const stepIndex = steps.indexOf(step);

        // Check if all dependencies are completed
        const canExecute = step.dependencies.every(dep => {
          const depIndex = parseInt(dep.replace('step_', ''));
          return completed.has(depIndex);
        });

        if (canExecute) {
          group.push(step);
          completed.add(stepIndex);
        }
      }

      if (group.length > 0) {
        groups.push(group);
        // Remove executed steps from remaining
        group.forEach(step => {
          const index = remaining.indexOf(step);
          if (index > -1) {
            remaining.splice(index, 1);
          }
        });
      } else if (remaining.length > 0) {
        // Circular dependency or invalid plan
        console.error('Invalid execution plan - circular dependencies detected');
        groups.push(remaining);
        break;
      }
    }

    return groups;
  }

  /**
   * Calculate critical path time
   */
  private calculateCriticalPathTime(groups: ExecutionStep[][]): number {
    let totalTime = 0;

    for (const group of groups) {
      // Time for a group is the maximum time of any step in the group
      const groupTime = Math.max(...group.map(s => s.estimated_time_ms));
      totalTime += groupTime;
    }

    return totalTime;
  }

  /**
   * Estimate execution time for a step
   */
  private estimateStepTime(step: any): number {
    // Get capability characteristics
    const key = `${step.agent_name}.${step.capability_name}`;
    const capability = this.capabilityRegistry.getCapability(key);

    if (capability?.characteristics.typical_runtime_ms) {
      return capability.characteristics.typical_runtime_ms;
    }

    // Default estimates based on capability name patterns
    const estimates: Record<string, number> = {
      'web_search': 3000,
      'vector_search': 2000,
      'sentiment_analysis': 4000,
      'options_flow': 3000,
      'earnings_analysis': 3000,
      'macro_indicators': 2000,
      'consolidator': 5000
    };

    for (const [pattern, time] of Object.entries(estimates)) {
      if (step.capability_name.includes(pattern)) {
        return time;
      }
    }

    return 2000; // Default 2 seconds
  }

  private calculatePriority(step: any, index: number): number {
    // Higher priority for data gathering steps
    if (step.capability_name.includes('search') ||
        step.capability_name.includes('fetch')) {
      return 10;
    }

    // Medium priority for analysis
    if (step.capability_name.includes('analysis')) {
      return 5;
    }

    // Lower priority for consolidation
    if (step.capability_name.includes('consolidat')) {
      return 1;
    }

    return 5 - (index * 0.1); // Default with slight preference for earlier steps
  }
}
```

### 1.3 Parallel Capability Executor

```typescript
// services/parallel-executor.service.ts

export interface ExecutionResult {
  step: ExecutionStep;
  result: any;
  status: 'success' | 'failure' | 'timeout';
  duration_ms: number;
  error?: string;
}

export interface ExecutionProgress {
  total_steps: number;
  completed_steps: number;
  failed_steps: number;
  current_group: number;
  total_groups: number;
  estimated_remaining_ms: number;
}

export class ParallelExecutorService {
  private readonly MAX_PARALLEL = 10;
  private readonly DEFAULT_TIMEOUT_MS = 30000;

  constructor(
    private capabilityRegistry: CapabilityRegistryService,
    private cacheService: CacheService,
    private eventPublisher: EventPublisher
  ) {}

  /**
   * Execute plan with parallel optimization
   */
  async executePlan(
    plan: ExecutionPlan,
    context: ExecutionContext,
    progressCallback?: (progress: ExecutionProgress) => Promise<void>
  ): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = [];
    const stepResults = new Map<string, any>();

    let completedSteps = 0;
    let failedSteps = 0;

    for (let groupIndex = 0; groupIndex < plan.parallelization_groups.length; groupIndex++) {
      const group = plan.parallelization_groups[groupIndex];

      // Report progress
      if (progressCallback) {
        await progressCallback({
          total_steps: plan.steps.length,
          completed_steps: completedSteps,
          failed_steps: failedSteps,
          current_group: groupIndex + 1,
          total_groups: plan.parallelization_groups.length,
          estimated_remaining_ms: this.estimateRemainingTime(plan, groupIndex)
        });
      }

      // Execute group in parallel
      const groupResults = await this.executeGroup(
        group,
        stepResults,
        context
      );

      // Process results
      for (const result of groupResults) {
        results.push(result);

        if (result.status === 'success') {
          completedSteps++;
          // Store result for dependent steps
          const stepId = `${result.step.agent_name}.${result.step.capability_name}`;
          stepResults.set(stepId, result.result);
        } else {
          failedSteps++;
        }
      }

      // Check if we should continue after failures
      if (failedSteps > 0 && this.shouldAbortOnFailure(group)) {
        console.error(`Aborting execution due to ${failedSteps} failed steps`);
        break;
      }
    }

    return results;
  }

  /**
   * Execute a group of steps in parallel
   */
  private async executeGroup(
    group: ExecutionStep[],
    previousResults: Map<string, any>,
    context: ExecutionContext
  ): Promise<ExecutionResult[]> {
    // Limit parallelism
    const batches = this.createBatches(group, this.MAX_PARALLEL);
    const allResults: ExecutionResult[] = [];

    for (const batch of batches) {
      const batchPromises = batch.map(step =>
        this.executeStep(step, previousResults, context)
      );

      const batchResults = await Promise.allSettled(batchPromises);

      // Process batch results
      for (let i = 0; i < batchResults.length; i++) {
        const result = batchResults[i];
        const step = batch[i];

        if (result.status === 'fulfilled') {
          allResults.push(result.value);
        } else {
          allResults.push({
            step,
            result: null,
            status: 'failure',
            duration_ms: 0,
            error: result.reason?.message || 'Unknown error'
          });
        }
      }
    }

    return allResults;
  }

  /**
   * Execute a single step
   */
  private async executeStep(
    step: ExecutionStep,
    previousResults: Map<string, any>,
    context: ExecutionContext
  ): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(step);
      const cached = await this.cacheService.get(cacheKey);

      if (cached && this.isCacheValid(cached, step)) {
        return {
          step,
          result: cached.data,
          status: 'success',
          duration_ms: Date.now() - startTime
        };
      }

      // Prepare parameters with dependency results
      const parameters = this.prepareParameters(
        step,
        previousResults
      );

      // Execute capability with timeout
      const result = await this.executeWithTimeout(
        this.capabilityRegistry.executeCapability(
          step.agent_name,
          step.capability_name,
          parameters,
          context
        ),
        step.estimated_time_ms * 2 || this.DEFAULT_TIMEOUT_MS
      );

      // Cache successful result
      if (result) {
        await this.cacheService.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        }, 300); // 5 min TTL
      }

      return {
        step,
        result,
        status: 'success',
        duration_ms: Date.now() - startTime
      };

    } catch (error) {
      const isTimeout = error.message.includes('timeout');

      return {
        step,
        result: null,
        status: isTimeout ? 'timeout' : 'failure',
        duration_ms: Date.now() - startTime,
        error: error.message
      };
    }
  }

  /**
   * Execute with timeout
   */
  private async executeWithTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`Operation timeout after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
  }

  /**
   * Prepare parameters with dependency injection
   */
  private prepareParameters(
    step: ExecutionStep,
    previousResults: Map<string, any>
  ): Record<string, any> {
    const parameters = { ...step.parameters };

    // Inject results from dependencies
    if (step.dependencies && step.dependencies.length > 0) {
      parameters._dependency_results = {};

      for (const dep of step.dependencies) {
        if (previousResults.has(dep)) {
          parameters._dependency_results[dep] = previousResults.get(dep);
        }
      }
    }

    return parameters;
  }

  /**
   * Create batches for parallel execution
   */
  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];

    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }

    return batches;
  }

  /**
   * Generate cache key for step
   */
  private generateCacheKey(step: ExecutionStep): string {
    const params = JSON.stringify(step.parameters);
    const hash = crypto.createHash('md5').update(params).digest('hex');
    return `exec:${step.agent_name}:${step.capability_name}:${hash}`;
  }

  /**
   * Check if cached result is valid
   */
  private isCacheValid(cached: any, step: ExecutionStep): boolean {
    if (!cached.timestamp) return false;

    // Check age based on capability characteristics
    const maxAge = step.estimated_time_ms < 2000 ? 60000 : 300000; // 1 min for fast, 5 min for slow
    const age = Date.now() - cached.timestamp;

    return age < maxAge;
  }

  /**
   * Determine if execution should abort after failures
   */
  private shouldAbortOnFailure(group: ExecutionStep[]): boolean {
    // Abort if any critical capability fails
    const criticalCapabilities = ['consolidator', 'validator'];

    return group.some(step =>
      criticalCapabilities.some(critical =>
        step.capability_name.includes(critical)
      )
    );
  }

  /**
   * Estimate remaining execution time
   */
  private estimateRemainingTime(plan: ExecutionPlan, currentGroupIndex: number): number {
    let remainingTime = 0;

    for (let i = currentGroupIndex + 1; i < plan.parallelization_groups.length; i++) {
      const group = plan.parallelization_groups[i];
      const groupTime = Math.max(...group.map(s => s.estimated_time_ms));
      remainingTime += groupTime;
    }

    return remainingTime;
  }
}
```

## Part 2: Progressive Response Enhancement

### 2.1 Fast and Slow System Implementation

```typescript
// services/progressive-response.service.ts

export interface FastSystemResponse {
  thoughts: string;
  initial_analysis: string;
  confidence: number;
}

export interface SlowSystemResponse {
  comprehensive_analysis: string;
  data_results: ExecutionResult[];
  consolidated_narrative: string;
  validation_results?: ValidationResult;
}

export class ProgressiveResponseService {
  constructor(
    private llmService: LLMService,
    private executorService: ParallelExecutorService,
    private consolidatorService: ConsolidatorService,
    private validatorService: ResponseValidatorService
  ) {}

  /**
   * Execute progressive response generation
   */
  async generateProgressiveResponse(
    query: string,
    context: QueryContext,
    plan: ExecutionPlan,
    eventPublisher: EventPublisher
  ): Promise<{
    fast: FastSystemResponse;
    slow: SlowSystemResponse;
  }> {
    // Start fast system immediately
    const fastPromise = this.executeFastSystem(query, context);

    // Start slow system in parallel
    const slowPromise = this.executeSlowSystem(
      query,
      context,
      plan,
      eventPublisher
    );

    // Stream fast system results as they arrive
    const fast = await fastPromise;
    await eventPublisher.publish({
      event_type: 'fast_system_complete',
      content: fast
    });

    // Wait for slow system
    const slow = await slowPromise;
    await eventPublisher.publish({
      event_type: 'slow_system_complete',
      content: slow
    });

    return { fast, slow };
  }

  /**
   * Fast system - immediate response generation
   */
  private async executeFastSystem(
    query: string,
    context: QueryContext
  ): Promise<FastSystemResponse> {
    const prompt = `
Provide immediate thoughts and initial analysis for this query.
Be concise but insightful. Show understanding and set expectations.

QUERY: ${query}

${context.conversation_history ?
  `CONTEXT: ${this.summarizeHistory(context.conversation_history)}` : ''}

Provide:
1. Initial thoughts (1-2 sentences)
2. What data/analysis will be needed
3. Expected insights

Keep response under 150 words.`;

    const response = await this.llmService.generate(prompt, {
      temperature: 0.7,
      max_tokens: 200,
      stream: true // Enable streaming for fast response
    });

    return {
      thoughts: this.extractThoughts(response),
      initial_analysis: response,
      confidence: 0.6 // Lower confidence for fast response
    };
  }

  /**
   * Slow system - comprehensive analysis with data
   */
  private async executeSlowSystem(
    query: string,
    context: QueryContext,
    plan: ExecutionPlan,
    eventPublisher: EventPublisher
  ): Promise<SlowSystemResponse> {
    // Execute plan with progress updates
    const dataResults = await this.executorService.executePlan(
      plan,
      context,
      async (progress) => {
        await eventPublisher.publish({
          event_type: 'execution_progress',
          content: progress
        });
      }
    );

    // Filter successful results
    const successfulResults = dataResults.filter(r => r.status === 'success');

    // Consolidate results into narrative
    const consolidated = await this.consolidatorService.consolidate(
      query,
      successfulResults,
      context
    );

    // Validate response
    let validationResults;
    if (context.enable_validation) {
      validationResults = await this.validatorService.validate(
        query,
        consolidated,
        successfulResults
      );

      // Apply refinements if needed
      if (validationResults.refinements) {
        consolidated.narrative = validationResults.refined_response;
      }
    }

    return {
      comprehensive_analysis: consolidated.narrative,
      data_results: dataResults,
      consolidated_narrative: consolidated.narrative,
      validation_results: validationResults
    };
  }

  private extractThoughts(response: string): string {
    // Extract first 1-2 sentences as thoughts
    const sentences = response.match(/[^.!?]+[.!?]+/g) || [];
    return sentences.slice(0, 2).join(' ').trim();
  }

  private summarizeHistory(history: any[]): string {
    // Create concise summary of conversation history
    return history
      .slice(-3) // Last 3 exchanges
      .map(h => `${h.role}: ${h.content.substring(0, 100)}...`)
      .join('\n');
  }
}
```

### 2.2 Response Consolidator

```typescript
// services/consolidator.service.ts

export interface ConsolidationResult {
  narrative: string;
  key_findings: string[];
  data_sources_used: string[];
  confidence: number;
  metadata: Record<string, any>;
}

export class ConsolidatorService {
  constructor(
    private llmService: LLMService,
    private formatters: Map<string, ResponseFormatter>
  ) {}

  /**
   * Consolidate execution results into coherent narrative
   */
  async consolidate(
    query: string,
    results: ExecutionResult[],
    context: QueryContext
  ): Promise<ConsolidationResult> {
    // Group results by agent
    const groupedResults = this.groupResultsByAgent(results);

    // Format results for LLM
    const formattedData = this.formatResultsForConsolidation(groupedResults);

    // Generate consolidated narrative
    const narrative = await this.generateNarrative(
      query,
      formattedData,
      context
    );

    // Extract key findings
    const keyFindings = await this.extractKeyFindings(narrative, results);

    return {
      narrative,
      key_findings: keyFindings,
      data_sources_used: this.extractDataSources(results),
      confidence: this.calculateConfidence(results),
      metadata: {
        total_capabilities_used: results.length,
        successful_executions: results.filter(r => r.status === 'success').length,
        consolidation_timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Generate narrative from results
   */
  private async generateNarrative(
    query: string,
    formattedData: string,
    context: QueryContext
  ): Promise<string> {
    const systemPrompt = this.getConsolidationPrompt(context.mode);

    const prompt = `
Synthesize the following data into a comprehensive response to the user's query.

USER QUERY: ${query}

DATA FROM MULTIPLE SOURCES:
${formattedData}

REQUIREMENTS:
1. Answer the user's question directly and comprehensively
2. Synthesize insights from all data sources
3. Use specific numbers and data points
4. Highlight key findings and actionable insights
5. Maintain institutional-grade quality
6. Structure with clear sections if needed
7. Avoid redundancy between sources

Create a cohesive narrative that flows naturally, not just a list of findings.`;

    const response = await this.llmService.generate(prompt, {
      system: systemPrompt,
      temperature: 0.7,
      max_tokens: 1500
    });

    return response;
  }

  /**
   * Format results for consolidation
   */
  private formatResultsForConsolidation(
    groupedResults: Map<string, ExecutionResult[]>
  ): string {
    const sections: string[] = [];

    for (const [agent, results] of groupedResults) {
      const formatter = this.formatters.get(agent) || this.defaultFormatter;
      const formatted = formatter.format(results);

      sections.push(`\n[${agent.toUpperCase()}]\n${formatted}`);
    }

    return sections.join('\n\n---\n');
  }

  /**
   * Extract key findings using LLM
   */
  private async extractKeyFindings(
    narrative: string,
    results: ExecutionResult[]
  ): Promise<string[]> {
    const prompt = `
Extract 3-5 key findings from this analysis.

ANALYSIS:
${narrative}

Return JSON array of key findings (each 1 sentence):
["finding 1", "finding 2", ...]`;

    try {
      const findings = await this.llmService.generateJSON(prompt, {
        temperature: 0.3,
        max_tokens: 200
      });

      return Array.isArray(findings) ? findings : [];
    } catch (error) {
      console.error('Failed to extract key findings:', error);
      return [];
    }
  }

  /**
   * Get mode-specific consolidation prompt
   */
  private getConsolidationPrompt(mode?: string): string {
    const basePrompt = `You are an elite financial analyst synthesizing multi-source intelligence.
Your role is to create institutional-grade responses that are comprehensive yet concise.`;

    const modePrompts: Record<string, string> = {
      bny: `${basePrompt}
Focus on BNY Mellon perspectives: custody, asset servicing, and institutional insights.`,

      portfolio_agent: `${basePrompt}
Focus on portfolio management: risk-adjusted returns, allocation, and rebalancing.`,

      standard: basePrompt
    };

    return modePrompts[mode || 'standard'] || basePrompt;
  }

  private groupResultsByAgent(results: ExecutionResult[]): Map<string, ExecutionResult[]> {
    const grouped = new Map<string, ExecutionResult[]>();

    for (const result of results) {
      const agent = result.step.agent_name;
      if (!grouped.has(agent)) {
        grouped.set(agent, []);
      }
      grouped.get(agent)!.push(result);
    }

    return grouped;
  }

  private extractDataSources(results: ExecutionResult[]): string[] {
    const sources = new Set<string>();

    for (const result of results) {
      sources.add(`${result.step.agent_name}.${result.step.capability_name}`);
    }

    return Array.from(sources);
  }

  private calculateConfidence(results: ExecutionResult[]): number {
    if (results.length === 0) return 0;

    const successRate = results.filter(r => r.status === 'success').length / results.length;
    return Math.min(0.95, successRate * 0.9 + 0.1); // Base 0.1 + up to 0.9 from success rate
  }

  private defaultFormatter = {
    format: (results: ExecutionResult[]) => {
      return results
        .map(r => `${r.step.capability_name}: ${JSON.stringify(r.result, null, 2)}`)
        .join('\n');
    }
  };
}
```

## Part 3: Response Validation Pipeline

### 3.1 Response Validator Service

```typescript
// services/response-validator.service.ts

export interface ValidationResult {
  is_valid: boolean;
  confidence_score: number;
  issues_found: ValidationIssue[];
  refinements?: string;
  refined_response?: string;
  validation_metadata: {
    checks_performed: string[];
    duration_ms: number;
    validators_used: string[];
  };
}

export interface ValidationIssue {
  type: 'accuracy' | 'relevance' | 'completeness' | 'consistency' | 'factual';
  severity: 'critical' | 'warning' | 'info';
  description: string;
  location?: string;
  suggested_fix?: string;
}

export class ResponseValidatorService {
  private validators: Map<string, Validator> = new Map();

  constructor(
    private llmService: LLMService,
    private factCheckService: FactCheckService,
    private styleGuideService: StyleGuideService
  ) {
    this.registerValidators();
  }

  /**
   * Register all validators
   */
  private registerValidators(): void {
    this.validators.set('relevance', new RelevanceValidator(this.llmService));
    this.validators.set('faithfulness', new FaithfulnessValidator(this.llmService));
    this.validators.set('factual', new FactualValidator(this.factCheckService));
    this.validators.set('consistency', new ConsistencyValidator());
    this.validators.set('style', new StyleValidator(this.styleGuideService));
  }

  /**
   * Validate response through all checks
   */
  async validate(
    query: string,
    response: string,
    dataResults: ExecutionResult[]
  ): Promise<ValidationResult> {
    const startTime = Date.now();
    const issues: ValidationIssue[] = [];
    const checksPerformed: string[] = [];

    // Run all validators in parallel
    const validationPromises = Array.from(this.validators.entries()).map(
      async ([name, validator]) => {
        try {
          const result = await validator.validate({
            query,
            response,
            dataResults
          });

          checksPerformed.push(name);
          if (result.issues) {
            issues.push(...result.issues);
          }

          return { name, result };
        } catch (error) {
          console.error(`Validator ${name} failed:`, error);
          return { name, error };
        }
      }
    );

    const validationResults = await Promise.all(validationPromises);

    // Calculate overall validity
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    const isValid = criticalIssues.length === 0;

    // Apply refinements if needed
    let refinedResponse;
    if (!isValid || issues.length > 3) {
      refinedResponse = await this.refineResponse(
        query,
        response,
        issues,
        dataResults
      );
    }

    // Calculate confidence
    const confidence = this.calculateValidationConfidence(issues);

    return {
      is_valid: isValid,
      confidence_score: confidence,
      issues_found: issues,
      refinements: this.generateRefinementSummary(issues),
      refined_response: refinedResponse,
      validation_metadata: {
        checks_performed: checksPerformed,
        duration_ms: Date.now() - startTime,
        validators_used: Array.from(this.validators.keys())
      }
    };
  }

  /**
   * Refine response based on validation issues
   */
  private async refineResponse(
    query: string,
    response: string,
    issues: ValidationIssue[],
    dataResults: ExecutionResult[]
  ): Promise<string> {
    const issuesSummary = this.summarizeIssues(issues);
    const availableData = this.extractAvailableData(dataResults);

    const prompt = `
Refine this response to address the identified issues.

ORIGINAL QUERY: ${query}

ORIGINAL RESPONSE:
${response}

ISSUES FOUND:
${issuesSummary}

AVAILABLE DATA:
${availableData}

Create a refined response that:
1. Addresses all critical issues
2. Maintains accuracy and relevance
3. Uses only the provided data
4. Follows institutional style guidelines
5. Keeps similar length and structure

Refined response:`;

    const refined = await this.llmService.generate(prompt, {
      temperature: 0.5,
      max_tokens: 1500
    });

    // Validate the refined response (quick check)
    const quickCheck = await this.validators.get('relevance')!.validate({
      query,
      response: refined,
      dataResults
    });

    return quickCheck.score > 0.7 ? refined : response;
  }

  /**
   * Calculate overall validation confidence
   */
  private calculateValidationConfidence(issues: ValidationIssue[]): number {
    if (issues.length === 0) return 0.95;

    const weights = {
      critical: -0.3,
      warning: -0.1,
      info: -0.02
    };

    let score = 1.0;
    for (const issue of issues) {
      score += weights[issue.severity];
    }

    return Math.max(0.1, Math.min(0.95, score));
  }

  private summarizeIssues(issues: ValidationIssue[]): string {
    return issues
      .map(i => `- [${i.severity.toUpperCase()}] ${i.type}: ${i.description}`)
      .join('\n');
  }

  private extractAvailableData(results: ExecutionResult[]): string {
    const successful = results.filter(r => r.status === 'success');
    return successful
      .slice(0, 5) // Limit to avoid token overflow
      .map(r => `${r.step.capability_name}: ${JSON.stringify(r.result, null, 2)}`)
      .join('\n\n');
  }

  private generateRefinementSummary(issues: ValidationIssue[]): string {
    if (issues.length === 0) return 'No refinements needed';

    const critical = issues.filter(i => i.severity === 'critical');
    const warnings = issues.filter(i => i.severity === 'warning');

    return `Found ${critical.length} critical issues and ${warnings.length} warnings requiring refinement`;
  }
}

/**
 * Individual validator implementations
 */
abstract class Validator {
  abstract validate(input: {
    query: string;
    response: string;
    dataResults: ExecutionResult[];
  }): Promise<{
    score: number;
    issues?: ValidationIssue[];
  }>;
}

class RelevanceValidator extends Validator {
  constructor(private llmService: LLMService) {
    super();
  }

  async validate(input: any): Promise<any> {
    const prompt = `
Score how relevant this response is to the query (0.0-1.0).

QUERY: ${input.query}
RESPONSE: ${input.response}

Consider:
- Does it answer the question asked?
- Is it on-topic throughout?
- Are all parts relevant?

Return JSON:
{
  "score": 0.0-1.0,
  "issues": ["issue descriptions if score < 0.8"]
}`;

    const result = await this.llmService.generateJSON(prompt, {
      temperature: 0.3,
      max_tokens: 200
    });

    const issues: ValidationIssue[] = [];
    if (result.score < 0.8) {
      issues.push({
        type: 'relevance',
        severity: result.score < 0.5 ? 'critical' : 'warning',
        description: result.issues?.[0] || 'Response may not fully address the query'
      });
    }

    return { score: result.score, issues };
  }
}

class FaithfulnessValidator extends Validator {
  constructor(private llmService: LLMService) {
    super();
  }

  async validate(input: any): Promise<any> {
    const availableData = input.dataResults
      .filter(r => r.status === 'success')
      .map(r => JSON.stringify(r.result))
      .join('\n');

    const prompt = `
Check if the response only uses information from the provided data (faithfulness).

RESPONSE: ${input.response}

AVAILABLE DATA:
${availableData}

Identify any claims not supported by the data.

Return JSON:
{
  "score": 0.0-1.0,
  "unsupported_claims": ["list of claims not in data"]
}`;

    const result = await this.llmService.generateJSON(prompt, {
      temperature: 0.3,
      max_tokens: 300
    });

    const issues: ValidationIssue[] = [];
    if (result.unsupported_claims?.length > 0) {
      issues.push({
        type: 'accuracy',
        severity: 'critical',
        description: `Unsupported claims found: ${result.unsupported_claims.join(', ')}`
      });
    }

    return { score: result.score, issues };
  }
}

class FactualValidator extends Validator {
  constructor(private factCheckService: FactCheckService) {
    super();
  }

  async validate(input: any): Promise<any> {
    // Extract factual claims from response
    const claims = await this.extractFactualClaims(input.response);

    // Fact-check each claim
    const checkResults = await Promise.all(
      claims.map(claim => this.factCheckService.check(claim))
    );

    const issues: ValidationIssue[] = [];
    let score = 1.0;

    for (const result of checkResults) {
      if (!result.isValid) {
        score -= 0.2;
        issues.push({
          type: 'factual',
          severity: 'critical',
          description: `Factual error: ${result.claim}`,
          suggested_fix: result.correction
        });
      }
    }

    return { score: Math.max(0, score), issues };
  }

  private async extractFactualClaims(response: string): Promise<string[]> {
    // Extract sentences with numbers, dates, or specific claims
    const sentences = response.match(/[^.!?]+[.!?]+/g) || [];
    return sentences.filter(s =>
      /\d+%|\$\d+|increased|decreased|grew|fell/i.test(s)
    );
  }
}
```

## Configuration and Integration

### Configuration Settings

```typescript
// config/orchestration.config.ts

export const OrchestrationConfig = {
  execution: {
    max_parallel_capabilities: 10,
    default_timeout_ms: 30000,
    retry_on_failure: true,
    max_retries: 2,
    cache_ttl_seconds: 300
  },

  planning: {
    enable_llm_planning: true,
    fallback_to_predefined: true,
    max_plan_attempts: 2,
    optimization_enabled: true
  },

  validation: {
    enabled: true,
    validators: ['relevance', 'faithfulness', 'factual', 'consistency', 'style'],
    refinement_enabled: true,
    refinement_threshold: 3, // Number of issues to trigger refinement
    fact_checking_enabled: true
  },

  progressive_response: {
    fast_system_enabled: true,
    fast_system_timeout_ms: 2000,
    stream_fast_thoughts: true,
    consolidation_strategy: 'intelligent' // 'simple' | 'intelligent' | 'comprehensive'
  }
};
```

### Main Orchestrator

```typescript
// orchestrators/main.orchestrator.ts

export class MainOrchestrator {
  constructor(
    private registry: CapabilityRegistryService,
    private planner: ExecutionPlanGenerator,
    private executor: ParallelExecutorService,
    private progressiveResponse: ProgressiveResponseService,
    private validator: ResponseValidatorService
  ) {}

  async orchestrate(
    query: string,
    context: QueryContext,
    routeDecision: RouteDecision
  ): Promise<OrchestrationResult> {
    const startTime = Date.now();

    try {
      // Generate execution plan
      const plan = await this.planner.generateExecutionPlan(
        query,
        context,
        routeDecision.primary_route
      );

      // Execute with progressive response
      const response = await this.progressiveResponse.generateProgressiveResponse(
        query,
        context,
        plan,
        this.eventPublisher
      );

      // Validate if enabled
      let validation;
      if (OrchestrationConfig.validation.enabled) {
        validation = await this.validator.validate(
          query,
          response.slow.consolidated_narrative,
          response.slow.data_results
        );
      }

      return {
        narrative: validation?.refined_response || response.slow.consolidated_narrative,
        fast_response: response.fast,
        execution_results: response.slow.data_results,
        validation,
        metadata: {
          route_used: routeDecision.primary_route,
          total_duration_ms: Date.now() - startTime,
          plan_complexity: plan.metadata.query_complexity,
          capabilities_used: plan.steps.length
        }
      };

    } catch (error) {
      console.error('Orchestration failed:', error);
      throw new OrchestrationError('Failed to orchestrate response', error);
    }
  }
}
```

## Testing Strategy

### Integration Tests

```typescript
// tests/orchestration.test.ts

describe('Multi-Agent Orchestration', () => {
  describe('Parallel Execution', () => {
    it('should execute independent capabilities in parallel', async () => {
      const plan: ExecutionPlan = {
        steps: [
          { agent_name: 'sentiment', capability_name: 'web_search', ... },
          { agent_name: 'sentiment', capability_name: 'vector_search', ... },
          { agent_name: 'macro', capability_name: 'indicators', ... }
        ],
        parallelization_groups: [
          [/* all three steps - no dependencies */]
        ]
      };

      const startTime = Date.now();
      const results = await executor.executePlan(plan, context);
      const duration = Date.now() - startTime;

      // Should complete faster than sequential execution
      expect(duration).toBeLessThan(5000); // All parallel
      expect(results.length).toBe(3);
    });

    it('should respect dependencies', async () => {
      const plan: ExecutionPlan = {
        steps: [
          { agent_name: 'data', capability_name: 'fetch', dependencies: [] },
          { agent_name: 'analysis', capability_name: 'process', dependencies: ['step_0'] }
        ],
        parallelization_groups: [
          [/* step 0 */],
          [/* step 1 - depends on 0 */]
        ]
      };

      const results = await executor.executePlan(plan, context);

      // Verify execution order
      expect(results[0].step.capability_name).toBe('fetch');
      expect(results[1].step.capability_name).toBe('process');
    });
  });

  describe('Response Validation', () => {
    it('should detect and fix relevance issues', async () => {
      const query = 'What is AAPL stock price?';
      const irrelevantResponse = 'Apple makes iPhones and computers.';

      const validation = await validator.validate(
        query,
        irrelevantResponse,
        []
      );

      expect(validation.is_valid).toBe(false);
      expect(validation.issues_found).toContainEqual(
        expect.objectContaining({ type: 'relevance' })
      );
      expect(validation.refined_response).toBeDefined();
    });

    it('should detect unsupported claims', async () => {
      const response = 'AAPL is up 50% today'; // Not in data
      const dataResults = [
        { result: { price_change: '2%' }, status: 'success' }
      ];

      const validation = await validator.validate(
        'AAPL performance',
        response,
        dataResults
      );

      expect(validation.issues_found).toContainEqual(
        expect.objectContaining({ type: 'accuracy' })
      );
    });
  });

  describe('Progressive Response', () => {
    it('should stream fast thoughts before data arrives', async () => {
      const events: any[] = [];
      const mockPublisher = {
        publish: async (event) => events.push(event)
      };

      await progressiveResponse.generateProgressiveResponse(
        'Analyze TSLA',
        context,
        plan,
        mockPublisher
      );

      // Fast system should complete first
      const fastEvent = events.find(e => e.event_type === 'fast_system_complete');
      const slowEvent = events.find(e => e.event_type === 'slow_system_complete');

      expect(events.indexOf(fastEvent)).toBeLessThan(events.indexOf(slowEvent));
    });
  });
});
```

## Deployment Checklist

### Prerequisites
- [ ] Capability registry populated
- [ ] LLM service configured
- [ ] Cache service available
- [ ] Event streaming infrastructure

### Implementation Steps

1. **Week 1: Core Orchestration**
   - [ ] Implement CapabilityRegistry
   - [ ] Build ExecutionPlanGenerator
   - [ ] Create ParallelExecutor
   - [ ] Unit tests

2. **Week 2: Progressive Response**
   - [ ] Implement Fast/Slow systems
   - [ ] Build Consolidator
   - [ ] Add streaming support
   - [ ] Integration tests

3. **Week 3: Validation Pipeline**
   - [ ] Implement validators
   - [ ] Add fact-checking
   - [ ] Build refinement system
   - [ ] Validation tests

4. **Week 4: Integration & Optimization**
   - [ ] Wire everything together
   - [ ] Performance optimization
   - [ ] Load testing
   - [ ] Production deployment

This completes the comprehensive implementation guide for multi-agent orchestration and response validation.