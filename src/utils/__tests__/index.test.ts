import { describe, it, expect } from 'vitest'
import { formatCurrency, formatCompanyType, getFallbackAvatar } from '../index'

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format currency with dollar sign and commas', () => {
      expect(formatCurrency(1000)).toBe('$1,000')
      expect(formatCurrency(50000)).toBe('$50,000')
      expect(formatCurrency(1234567)).toBe('$1,234,567')
    })

    it('should handle zero and negative values', () => {
      expect(formatCurrency(0)).toBe('$0')
      expect(formatCurrency(-1000)).toBe('$-1,000')
    })

    it('should handle decimal values', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
    })
  })

  describe('formatCompanyType', () => {
    it('should capitalize each word and replace hyphens with spaces', () => {
      expect(formatCompanyType('late-stage')).toBe('Late Stage')
      expect(formatCompanyType('early-stage')).toBe('Early Stage')
      expect(formatCompanyType('public')).toBe('Public')
    })

    it('should handle multiple hyphens', () => {
      expect(formatCompanyType('pre-seed-startup')).toBe('Pre Seed Startup')
    })

    it('should handle single words', () => {
      expect(formatCompanyType('startup')).toBe('Startup')
      expect(formatCompanyType('enterprise')).toBe('Enterprise')
    })

    it('should handle empty strings', () => {
      expect(formatCompanyType('')).toBe('')
    })
  })

  describe('getFallbackAvatar', () => {
    it('should generate avatar URL with encoded company name', () => {
      const result = getFallbackAvatar('OpenAI')
      expect(result).toBe('https://ui-avatars.com/api/?name=OpenAI&background=random')
    })

    it('should handle company names with spaces', () => {
      const result = getFallbackAvatar('Epic Games')
      expect(result).toBe('https://ui-avatars.com/api/?name=Epic%20Games&background=random')
    })

    it('should handle special characters', () => {
      const result = getFallbackAvatar('Company & Co.')
      expect(result).toBe('https://ui-avatars.com/api/?name=Company%20%26%20Co.&background=random')
    })

    it('should handle empty company names', () => {
      const result = getFallbackAvatar('')
      expect(result).toBe('https://ui-avatars.com/api/?name=&background=random')
    })
  })
})