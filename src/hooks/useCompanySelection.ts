import { useState } from 'react';
import { Company } from '../types';

/**
 * Custom hook for managing company selection and connection highlighting
 * Centralizes the business logic for company interactions
 */
export const useCompanySelection = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [hoveredCompany, setHoveredCompany] = useState<Company | null>(null);
  const [highlightedConnections, setHighlightedConnections] = useState<Set<number>>(new Set());

  const handleCompanySelect = (company: Company | null) => {
    setSelectedCompany(company);
    
    // Update highlighted connections
    if (company) {
      setHighlightedConnections(new Set(company.connections));
    } else {
      setHighlightedConnections(new Set());
    }
  };

  const handleCompanyHover = (company: Company | null) => {
    setHoveredCompany(company);
    
    // Optionally highlight connections on hover (only if no company is selected)
    if (company && !selectedCompany) {
      setHighlightedConnections(new Set(company.connections));
    } else if (!company && !selectedCompany) {
      setHighlightedConnections(new Set());
    }
  };

  const handleCompanySelectFromPanel = (company: Company | null) => {
    setSelectedCompany(company);
    if (company) {
      setHighlightedConnections(new Set(company.connections));
    } else {
      setHighlightedConnections(new Set());
    }
  };

  return {
    selectedCompany,
    hoveredCompany,
    highlightedConnections,
    handleCompanySelect,
    handleCompanyHover,
    handleCompanySelectFromPanel,
  };
};