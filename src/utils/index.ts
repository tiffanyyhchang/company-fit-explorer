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