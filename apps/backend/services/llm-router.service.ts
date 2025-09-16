import { groqService, GroqService } from './groq.service';
import { azureOpenAI, AzureOpenAIService } from './azure-openai.service';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables
dotenvConfig({ path: '.env.local' });

export type LLMProvider = 'groq' | 'azure-openai' | 'openai' | 'auto';
export type ModelType = 'gpt-5' | 'gpt-4-turbo' | 'gpt-4' | 'llama-3.3-70b' | 'llama-3.1-8b' | 'auto';

interface LLMConfig {
  provider?: LLMProvider;
  model?: ModelType;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Unified LLM Router Service
 * Provides a single interface to swap between different LLM providers
 * Supports Groq (Llama), Azure OpenAI (GPT-5, GPT-4), and OpenAI
 */
export class LLMRouterService {
  private preferredProvider: LLMProvider;
  private preferredModel: ModelType;
  private groq: GroqService;
  private azure: AzureOpenAIService;
  
  constructor() {
    // Load provider preference from environment
    this.preferredProvider = (process.env.LLM_PROVIDER as LLMProvider) || 'azure-openai';
    this.preferredModel = (process.env.LLM_MODEL as ModelType) || 'gpt-5';
    
    // Initialize services
    this.groq = groqService;
    this.azure = azureOpenAI;
    
    // Log configuration
    console.info(`LLM Router initialized with provider: ${this.preferredProvider}, model: ${this.preferredModel}`);
    this.logAvailableProviders();
  }
  
  /**
   * Log available providers and their status
   */
  private logAvailableProviders() {
    const providers = [];
    
    if (this.azure.isConfigured()) {
      providers.push('Azure OpenAI (GPT-5, GPT-4)');
    }
    
    if (this.groq.isConfigured()) {
      providers.push('Groq (Llama 3.3, 3.1)');
    }
    
    if (providers.length === 0) {
      console.error('⚠️ WARNING: No LLM providers are configured!');
      console.error('Please configure at least one of: AZURE_OPENAI_API_KEY, GROQ_API_KEY');
    } else {
      console.info(`✅ Available LLM providers: ${providers.join(', ')}`);
    }
  }
  
  /**
   * Get the active provider based on configuration and availability
   */
  private getActiveProvider(provider?: LLMProvider): 'groq' | 'azure' | null {
    const requestedProvider = provider || this.preferredProvider;
    
    // Handle explicit provider requests
    if (requestedProvider === 'groq' && this.groq.isConfigured()) {
      return 'groq';
    }
    
    if ((requestedProvider === 'azure-openai' || requestedProvider === 'openai') && this.azure.isConfigured()) {
      return 'azure';
    }
    
    // Auto mode: try preferred first, then fallback
    if (requestedProvider === 'auto') {
      // For GPT models, prefer Azure
      if (this.preferredModel?.startsWith('gpt') && this.azure.isConfigured()) {
        return 'azure';
      }
      
      // For Llama models, prefer Groq
      if (this.preferredModel?.startsWith('llama') && this.groq.isConfigured()) {
        return 'groq';
      }
      
      // Fallback to any available
      if (this.azure.isConfigured()) return 'azure';
      if (this.groq.isConfigured()) return 'groq';
    }
    
    return null;
  }
  
  /**
   * Map model names to provider-specific model IDs
   */
  private mapModelToProvider(model: ModelType, provider: 'groq' | 'azure'): string {
    const modelMap: Record<ModelType, { groq?: string; azure?: string }> = {
      'gpt-5': {
        azure: 'gpt-5', // GPT-5 through Azure model router
      },
      'gpt-4-turbo': {
        azure: 'gpt-4-turbo',
      },
      'gpt-4': {
        azure: 'gpt-4',
      },
      'llama-3.3-70b': {
        groq: 'llama-3.3-70b-versatile',
      },
      'llama-3.1-8b': {
        groq: 'llama-3.1-8b-instant',
      },
      'auto': {
        groq: 'llama-3.3-70b-versatile',
        azure: 'gpt-5', // Default to GPT-5 for Azure
      },
    };
    
    const mapping = modelMap[model] || modelMap['auto'];
    return provider === 'groq' ? (mapping.groq || 'llama-3.3-70b-versatile') : (mapping.azure || 'gpt-5');
  }
  
  /**
   * Create a chat completion with automatic provider selection
   */
  async createChatCompletion(
    messages: ChatMessage[],
    config?: LLMConfig
  ): Promise<any> {
    const provider = this.getActiveProvider(config?.provider);
    
    if (!provider) {
      throw new Error('No LLM provider is configured. Please set up Azure OpenAI or Groq API keys.');
    }
    
    const model = config?.model || this.preferredModel;
    const providerModel = this.mapModelToProvider(model, provider);
    
    console.info(`🤖 Using ${provider === 'azure' ? 'Azure OpenAI' : 'Groq'} with model: ${providerModel}`);
    
    try {
      if (provider === 'azure') {
        // Use Azure OpenAI with GPT-5 or GPT-4
        const response = await this.azure.createChatCompletion({
          messages,
          model: providerModel,
          temperature: config?.temperature ?? 0.7,
          max_tokens: config?.maxTokens ?? 2000,
          stream: config?.stream ?? false,
        });
        
        return response;
      } else {
        // Use Groq with Llama models
        const response = await this.groq.createChatCompletion({
          messages,
          model: providerModel,
          temperature: config?.temperature ?? 0.7,
          max_tokens: config?.maxTokens ?? 2000,
          stream: config?.stream ?? false,
        });
        
        return response;
      }
    } catch (error: any) {
      console.error(`❌ ${provider} failed:`, error.message);
      
      // Try fallback provider
      const fallbackProvider = provider === 'azure' ? 'groq' : 'azure';
      const canFallback = fallbackProvider === 'azure' ? this.azure.isConfigured() : this.groq.isConfigured();
      
      if (canFallback) {
        console.info(`🔄 Attempting fallback to ${fallbackProvider}...`);
        
        const fallbackModel = this.mapModelToProvider('auto', fallbackProvider as 'groq' | 'azure');
        
        if (fallbackProvider === 'azure') {
          return await this.azure.createChatCompletion({
            messages,
            model: fallbackModel,
            temperature: config?.temperature ?? 0.7,
            max_tokens: config?.maxTokens ?? 2000,
            stream: config?.stream ?? false,
          });
        } else {
          return await this.groq.createChatCompletion({
            messages,
            model: fallbackModel,
            temperature: config?.temperature ?? 0.7,
            max_tokens: config?.maxTokens ?? 2000,
            stream: config?.stream ?? false,
          });
        }
      }
      
      throw error;
    }
  }
  
  /**
   * Stream chat completion responses
   */
  async *streamChatCompletion(
    messages: ChatMessage[],
    config?: LLMConfig
  ): AsyncGenerator<any> {
    const provider = this.getActiveProvider(config?.provider);
    
    if (!provider) {
      throw new Error('No LLM provider is configured');
    }
    
    const model = config?.model || this.preferredModel;
    const providerModel = this.mapModelToProvider(model, provider);
    
    if (provider === 'azure') {
      const stream = this.azure.streamChatCompletion({
        messages,
        model: providerModel,
        temperature: config?.temperature ?? 0.7,
        max_tokens: config?.maxTokens ?? 2000,
      });
      
      for await (const chunk of stream) {
        yield chunk;
      }
    } else {
      const stream = this.groq.streamChatCompletion({
        messages,
        model: providerModel,
        temperature: config?.temperature ?? 0.7,
        max_tokens: config?.maxTokens ?? 2000,
      });
      
      for await (const chunk of stream) {
        yield chunk;
      }
    }
  }
  
  /**
   * Set the preferred provider at runtime
   */
  setPreferredProvider(provider: LLMProvider) {
    this.preferredProvider = provider;
    console.info(`🔄 LLM provider switched to: ${provider}`);
  }
  
  /**
   * Set the preferred model at runtime
   */
  setPreferredModel(model: ModelType) {
    this.preferredModel = model;
    console.info(`🔄 LLM model switched to: ${model}`);
  }
  
  /**
   * Get current configuration
   */
  getConfiguration() {
    return {
      preferredProvider: this.preferredProvider,
      preferredModel: this.preferredModel,
      availableProviders: {
        groq: this.groq.isConfigured(),
        azure: this.azure.isConfigured(),
      },
      capabilities: {
        groq: this.groq.isConfigured() ? this.groq.getModelCapabilities() : null,
        azure: this.azure.isConfigured() ? this.azure.getModelCapabilities() : null,
      },
    };
  }
  
  /**
   * Check if any provider is configured
   */
  isConfigured(): boolean {
    return this.groq.isConfigured() || this.azure.isConfigured();
  }
  
  /**
   * Get recommendations for optimal model selection
   */
  getRecommendations(useCase: 'fast' | 'quality' | 'cost' | 'balanced'): { provider: LLMProvider; model: ModelType } {
    const recommendations = {
      fast: {
        provider: 'groq' as LLMProvider,
        model: 'llama-3.1-8b' as ModelType,
        reason: 'Groq with Llama 3.1 8B provides sub-second responses',
      },
      quality: {
        provider: 'azure-openai' as LLMProvider,
        model: 'gpt-5' as ModelType,
        reason: 'GPT-5 via Azure provides state-of-the-art quality',
      },
      cost: {
        provider: 'groq' as LLMProvider,
        model: 'llama-3.3-70b' as ModelType,
        reason: 'Groq offers competitive pricing with excellent quality',
      },
      balanced: {
        provider: 'azure-openai' as LLMProvider,
        model: 'gpt-4-turbo' as ModelType,
        reason: 'GPT-4 Turbo balances quality, speed, and cost',
      },
    };
    
    const recommendation = recommendations[useCase];
    console.info(`📊 Recommendation for ${useCase}: ${recommendation.reason}`);
    
    return { provider: recommendation.provider, model: recommendation.model };
  }
}

// Export singleton instance
export const llmRouter = new LLMRouterService();

// Export as default
export default llmRouter;