/**
 * Google Gemini Provider
 * 
 * Implementation for Google Gemini API integration
 */

import { BaseLLMProvider, CompanyAnalysisRequest, LLMResponse, LLMSettings } from '../types';

export class GoogleProvider extends BaseLLMProvider {
  private readonly baseUrl = 'http://localhost:3001/api/google';

  constructor(settings: LLMSettings) {
    super(settings);
  }

  async analyzeCompany(request: CompanyAnalysisRequest): Promise<LLMResponse> {
    try {
      // Note: Google AI API might work from browser in some cases, but let's be consistent
      // with other providers for now
      return {
        success: false,
        error: 'Google AI API calls are not recommended directly from the browser due to security concerns. Please use a proxy server or backend integration.'
      };

      // TODO: The following code might work with proper API key setup

    } catch (error) {
      console.error('Google API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze company with Gemini'
      };
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      // Note: Direct API calls from browser may be blocked by CORS
      // For now, we'll validate the API key format instead
      if (!this.apiKey || !this.apiKey.startsWith('AIza')) {
        console.error('Invalid Google API key format. Should start with "AIza"');
        return false;
      }

      // API key format looks correct
      return true;

      // TODO: In production, this validation should be done through a proxy server
      
    } catch (error) {
      console.error('Google API validation error:', error);
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
    return `Analyze "${request.companyName}" and provide comprehensive company information as JSON.

User's Candidate Market Fit (CMF) Criteria:
- Target Role: ${request.userCMF.targetRole}
- Must-Haves: ${request.userCMF.mustHaves.join(', ')}
${request.userCMF.wantToHave?.length ? `- Want-to-Have: ${request.userCMF.wantToHave.join(', ')}` : ''}
${request.userCMF.experience?.length ? `- Experience: ${request.userCMF.experience.join(', ')}` : ''}
${request.userCMF.targetCompanies ? `- Target Companies: ${request.userCMF.targetCompanies}` : ''}

Return JSON with this exact structure:

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

Base analysis on real company information. Return only valid JSON.`;
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
      console.error('Failed to parse Google response:', responseText);
      throw new Error('Invalid JSON response from Google API');
    }
  }

  private calculateCost(inputTokens: number, outputTokens: number): number {
    // Dynamic pricing based on model
    let inputPrice = 1.25;
    let outputPrice = 5;
    
    if (this.model.includes('flash')) {
      inputPrice = 0.075;
      outputPrice = 0.3;
    }
    // Both Gemini 1.5 Pro and 2.5 Pro use same pricing
    
    const inputCost = (inputTokens / 1000000) * inputPrice;
    const outputCost = (outputTokens / 1000000) * outputPrice;
    return inputCost + outputCost;
  }
}