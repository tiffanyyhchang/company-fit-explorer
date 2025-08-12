/**
 * LLM Provider Configurations
 * 
 * Configuration details for supported LLM providers
 */

import { LLMProviderConfig } from './types';

export const LLM_PROVIDERS: Record<string, LLMProviderConfig> = {
  anthropic: {
    name: 'anthropic',
    displayName: 'Anthropic Claude',
    models: [
      {
        id: 'claude-sonnet-4-20250514',
        name: 'Claude Sonnet 4',
        description: 'Latest flagship model with superior reasoning and coding',
        costPer1MTokens: { input: 3, output: 15 }
      },
      {
        id: 'claude-3-7-sonnet-20250219',
        name: 'Claude 3.7 Sonnet',
        description: 'Extended thinking mode for complex analysis',
        costPer1MTokens: { input: 3, output: 15 }
      },
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        description: 'Proven model for reasoning and analysis',
        costPer1MTokens: { input: 3, output: 15 }
      },
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku',
        description: 'Fast and cost-effective for simpler tasks',
        costPer1MTokens: { input: 1, output: 5 }
      }
    ],
    apiKeyLabel: 'Anthropic API Key',
    apiKeyPlaceholder: 'sk-ant-api03-...',
    docsUrl: 'https://docs.anthropic.com/en/api/getting-started'
  },
  
  openai: {
    name: 'openai',
    displayName: 'OpenAI GPT',
    models: [
      {
        id: 'gpt-5',
        name: 'GPT-5',
        description: 'Latest breakthrough model with exceptional capabilities',
        costPer1MTokens: { input: 1.25, output: 10 }
      },
      {
        id: 'gpt-4.5-turbo',
        name: 'GPT-4.5 Turbo',
        description: 'Enhanced GPT-4 with faster response times',
        costPer1MTokens: { input: 2.5, output: 10 }
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: 'Multimodal model with strong reasoning',
        costPer1MTokens: { input: 2.5, output: 10 }
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        description: 'Affordable model for everyday tasks',
        costPer1MTokens: { input: 0.15, output: 0.6 }
      }
    ],
    apiKeyLabel: 'OpenAI API Key',
    apiKeyPlaceholder: 'sk-proj-...',
    docsUrl: 'https://platform.openai.com/docs/quickstart'
  },
  
  google: {
    name: 'google',
    displayName: 'Google Gemini',
    models: [
      {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        description: 'Latest high-performance model with advanced reasoning',
        costPer1MTokens: { input: 1.25, output: 5 }
      },
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        description: 'Proven model with long context and strong performance',
        costPer1MTokens: { input: 1.25, output: 5 }
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        description: 'Fast and efficient for quick tasks',
        costPer1MTokens: { input: 0.075, output: 0.3 }
      }
    ],
    apiKeyLabel: 'Google AI API Key',
    apiKeyPlaceholder: 'AIza...',
    docsUrl: 'https://ai.google.dev/gemini-api/docs/quickstart'
  }
};

export const DEFAULT_LLM_SETTINGS = {
  provider: 'none' as const,
  apiKey: '',
  model: '',
  maxTokens: 1500,
  temperature: 0.7
};