/**
 * Anthropic Claude Provider
 * 
 * Implementation for Anthropic Claude API integration
 */

import { BaseLLMProvider, CompanyAnalysisRequest, LLMResponse, LLMSettings } from '../types';

export class AnthropicProvider extends BaseLLMProvider {
  private readonly baseUrl = 'http://localhost:3001/api/llm/anthropic';

  constructor(settings: LLMSettings) {
    super(settings);
  }

  async analyzeCompany(request: CompanyAnalysisRequest): Promise<LLMResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ request })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Anthropic API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze company with Claude'
      };
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/validate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        }
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.valid;

    } catch (error) {
      console.error('API key validation error:', error);
      return false;
    }
  }

  async estimateCost(prompt: string): Promise<number> {
    // Rough estimation: ~4 chars per token
    const estimatedInputTokens = Math.ceil(prompt.length / 4);
    const estimatedOutputTokens = this.maxTokens;
    return this.calculateCost(estimatedInputTokens, estimatedOutputTokens);
  }

  private buildCompanyAnalysisPrompt(request: CompanyAnalysisRequest): string {
    return `You are a company research assistant. Analyze "${request.companyName}" and provide comprehensive company information in JSON format.

User's Candidate Market Fit (CMF) Criteria:
- Target Role: ${request.userCMF.targetRole}
- Must-Haves: ${request.userCMF.mustHaves.join(', ')}
${request.userCMF.wantToHave?.length ? `- Want-to-Have: ${request.userCMF.wantToHave.join(', ')}` : ''}
${request.userCMF.experience?.length ? `- Experience: ${request.userCMF.experience.join(', ')}` : ''}
${request.userCMF.targetCompanies ? `- Target Companies: ${request.userCMF.targetCompanies}` : ''}

Provide a JSON response with this exact structure:

{
  "name": "Company Name",
  "industry": "Primary industry (e.g., AI/ML, Fintech, Gaming, Healthcare)",
  "stage": "Company stage (Early Stage, Late Stage, Public, Mature)",
  "location": "Primary location (e.g., San Francisco, CA)",
  "employees": "Employee range (e.g., ~500, 1000-5000, 10000+)",
  "remote": "Remote policy (Remote-Friendly, Hybrid, In-Office)",
  "openRoles": 15,
  "matchScore": 85,
  "matchReasons": [
    "Specific reason why this company matches user's criteria",
    "Another specific alignment with their requirements",
    "Additional match reason based on their experience"
  ],
  "connections": ["Company1", "Company2", "Company3"],
  "connectionTypes": {
    "Company1": "Direct Competitor",
    "Company2": "Industry Partner", 
    "Company3": "Similar Stage"
  },
  "description": "Brief company description focusing on what they do and their mission"
}

Calculate matchScore (0-100) by evaluating:
1. Alignment with must-have criteria (weighted most heavily)
2. Fit with target role and company stage
3. Relevance to experience background
4. Match with want-to-have preferences

Be accurate and base analysis on real company information. Return only valid JSON.`;
  }

  private parseCompanyResponse(responseText: string) {
    try {
      // Clean up potential markdown formatting
      const cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Failed to parse Claude response:', responseText);
      throw new Error('Invalid JSON response from Claude API');
    }
  }

  private calculateCost(inputTokens: number, outputTokens: number): number {
    // Dynamic pricing based on model - default to Claude 4 Sonnet pricing
    let inputPrice = 3;
    let outputPrice = 15;
    
    if (this.model.includes('haiku')) {
      inputPrice = 1;
      outputPrice = 5;
    }
    
    const inputCost = (inputTokens / 1000000) * inputPrice;
    const outputCost = (outputTokens / 1000000) * outputPrice;
    return inputCost + outputCost;
  }
}