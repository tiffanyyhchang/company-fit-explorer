import { RelationshipType } from '../types';

/**
 * Gets the appropriate CSS class for market fit score color
 */
export const getMarketFitColor = (score: number, threshold: number): string => {
  if (score >= threshold) return 'text-green-600';
  if (score >= threshold - 2) return 'text-yellow-600';
  return 'text-gray-500';
};

/**
 * Gets the color for different relationship types
 */
export const getRelationshipColor = (relationship: RelationshipType): string => {
  switch (relationship) {
    case 'competitor': return '#EF4444';
    case 'partner': return '#10B981';
    case 'parent': return '#8B5CF6';
    case 'ecosystem': return '#F59E0B';
    default: return '#6B7280';
  }
};

/**
 * Gets the border color based on market fit score and threshold
 */
export const getBorderColor = (marketFit: number, threshold: number): string => {
  if (marketFit >= threshold) return '#10B981'; // Green for good fit
  if (marketFit >= threshold - 2) return '#F59E0B'; // Yellow for okay fit
  return '#6B7280'; // Gray for low fit
};

/**
 * Gets the opacity based on market fit score and threshold
 */
export const getNodeOpacity = (marketFit: number, threshold: number): number => {
  return marketFit >= threshold - 3 ? 1 : 0.6;
};

/**
 * Formats currency amount with proper locale formatting
 */
export const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString()}`;
};

/**
 * Capitalizes and formats company type for display
 */
export const formatCompanyType = (type: string): string => {
  return type.replace('-', ' ').split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Generates fallback avatar URL for companies
 */
export const getFallbackAvatar = (companyName: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=random`;
};