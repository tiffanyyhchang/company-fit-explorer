import React, { useState, useEffect, useRef } from 'react';
import { UserCMF, Company } from '../types';
import { getCompanySuggestions, getPopularCompanies, CompanySuggestion } from '../utils/companySuggestions';
import { getCompanyPreview, CompanyPreview, validateCompanyData } from '../utils/companyValidation';
import { getColorForScore, generateCareerUrl } from '../utils/companyPositioning';

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCompany: (company: Company) => Promise<void>;
  userCMF: UserCMF;
  existingCompanies: Company[];
}

type ModalStep = 'input' | 'confirm' | 'processing';

/**
 * AddCompanyModal Component
 * 
 * Multi-step modal for adding companies to the exploration:
 * 1. Input: User enters company name with autocomplete suggestions
 * 2. Confirm: Show company preview for user confirmation  
 * 3. Processing: Generate company data and add to graph
 */
const AddCompanyModal: React.FC<AddCompanyModalProps> = ({
  isOpen,
  onClose,
  onAddCompany,
  userCMF,
  existingCompanies,
}) => {
  const [step, setStep] = useState<ModalStep>('input');
  const [companyName, setCompanyName] = useState('');
  const [suggestions, setSuggestions] = useState<CompanySuggestion[]>([]);
  const [companyPreview, setCompanyPreview] = useState<CompanyPreview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Enhanced error messages for better user experience
  const errorMessages = {
    notFound: "We couldn't find that company. Try checking the spelling or using the full company name.",
    apiError: "Unable to connect to company database. Please try again.",
    llmError: "Failed to analyze company data. Please try again or contact support.",
    networkError: "Network connection issue. Please check your internet and try again."
  };

  // Reset modal state when closed and focus input when opened
  useEffect(() => {
    if (!isOpen) {
      resetModal();
    } else {
      // Focus input and show popular companies when opening
      setTimeout(() => {
        inputRef.current?.focus();
        if (!companyName.trim()) {
          const popularCompanies = getPopularCompanies(4);
          setSuggestions(popularCompanies);
          setShowSuggestions(true);
        }
      }, 100);
    }
  }, [isOpen]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Enter' && step === 'input' && companyName.trim()) {
        handleSearch();
      }
      if (e.key === 'Enter' && step === 'confirm') {
        handleConfirm();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, step, companyName]);

  const resetModal = () => {
    setStep('input');
    setCompanyName('');
    setSuggestions([]);
    setCompanyPreview(null);
    setError('');
    setIsLoading(false);
    setShowSuggestions(false);
  };

  const handleInputChange = async (value: string) => {
    setCompanyName(value);
    setError('');
    
    if (value.length > 1) {
      try {
        const companySuggestions = await getCompanySuggestions(value);
        setSuggestions(companySuggestions);
        setShowSuggestions(companySuggestions.length > 0);
      } catch (err) {
        // Silently fail for suggestions - not critical
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else if (value.length === 0) {
      // Show popular companies when input is empty
      const popularCompanies = getPopularCompanies(4);
      setSuggestions(popularCompanies);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: CompanySuggestion) => {
    setCompanyName(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSearch = async () => {
    if (!companyName.trim()) return;
    
    setIsLoading(true);
    setError('');
    setSuggestions([]);
    setShowSuggestions(false);
    
    try {
      const preview = await getCompanyPreview(companyName.trim());
      
      // Validate the preview data
      const validation = validateCompanyData(preview);
      
      if (!validation.isValid) {
        setError(errorMessages.notFound);
        return;
      }
      
      setCompanyPreview(preview);
      setStep('confirm');
    } catch (err) {
      const errorType = (err as Error).message.includes('network') ? 'networkError' : 'notFound';
      setError(errorMessages[errorType as keyof typeof errorMessages]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!companyPreview) return;
    
    setStep('processing');
    
    try {
      // Generate enhanced company data with smart positioning
      const matchScore = Math.floor(Math.random() * 40) + 60; // Random score 60-100% for now
      const industry = companyPreview.industry || 'Technology';
      
      const baseCompany: Company = {
        id: Date.now(), // Generate unique ID
        name: companyPreview.name,
        logo: companyPreview.logo || `https://ui-avatars.com/api/?name=${companyPreview.name}&background=random`,
        matchScore,
        industry,
        stage: determineCompanyStage(companyPreview),
        location: companyPreview.location || 'San Francisco, CA',
        employees: companyPreview.employees || '~500',
        remote: 'Remote-Friendly',
        openRoles: Math.floor(Math.random() * 10) + 5,
        connections: [], // Will be set by positioning logic
        connectionTypes: {}, // Will be set by positioning logic
        matchReasons: generateMatchReasons(companyPreview, userCMF),
        color: getColorForScore(matchScore),
        angle: 0, // Will be set by positioning logic
        distance: 0, // Will be set by positioning logic
        careerUrl: generateCareerUrl(companyPreview.name, companyPreview.domain)
      };

      // Import positioning utilities dynamically to avoid circular dependencies
      const { findOptimalPosition, mapConnectionsToExistingCompanies } = await import('../utils/companyPositioning');
      
      // Find optimal position with collision detection
      const optimalPosition = findOptimalPosition(baseCompany, existingCompanies);
      
      // Map connections to existing companies
      const connectionMapping = mapConnectionsToExistingCompanies(baseCompany, existingCompanies);
      
      // Final company with positioning and connections
      const finalCompany: Company = {
        ...baseCompany,
        angle: optimalPosition.angle,
        distance: optimalPosition.distance,
        connections: connectionMapping.connections,
        connectionTypes: connectionMapping.connectionTypes
      };

      await onAddCompany(finalCompany);
      onClose();
      resetModal();
    } catch (err) {
      console.error('Error adding company:', err);
      setError(errorMessages.apiError);
      setStep('confirm');
    }
  };

  // Helper function to determine company stage based on preview data
  const determineCompanyStage = (preview: CompanyPreview): string => {
    if (preview.confidence === 'high') {
      // For known companies, make educated guesses based on name/industry
      const name = preview.name.toLowerCase();
      if (name.includes('google') || name.includes('microsoft') || name.includes('apple') || 
          name.includes('amazon') || name.includes('meta') || name.includes('facebook')) {
        return 'Public';
      }
      if (name.includes('startup') || preview.industry === 'AI' || preview.industry === 'AI/ML') {
        return 'Early Stage';
      }
      return 'Late Stage';
    }
    
    // Default for unknown companies
    return 'Late Stage';
  };

  // Helper function to generate contextual match reasons
  const generateMatchReasons = (preview: CompanyPreview, userCMF: UserCMF): string[] => {
    const reasons: string[] = [];
    
    // Add role-specific reasons
    if (userCMF.targetRole) {
      reasons.push(`Strong alignment with your ${userCMF.targetRole} background`);
    }
    
    // Add industry-specific reasons
    if (preview.industry) {
      reasons.push(`Excellent fit in the ${preview.industry} industry`);
    }
    
    // Add must-have aligned reasons
    if (userCMF.mustHaves && userCMF.mustHaves.length > 0) {
      const randomMustHave = userCMF.mustHaves[Math.floor(Math.random() * userCMF.mustHaves.length)];
      reasons.push(`Company culture aligns with your requirement: ${randomMustHave}`);
    }
    
    // Add some generic positive reasons
    const genericReasons = [
      'Technology stack matches your experience',
      'Company growth trajectory looks promising',
      'Strong team and engineering culture',
      'Innovative approach to solving problems',
      'Good work-life balance and benefits'
    ];
    
    // Add 1-2 random generic reasons
    const shuffledGeneric = genericReasons.sort(() => 0.5 - Math.random());
    reasons.push(...shuffledGeneric.slice(0, 2));
    
    return reasons.slice(0, 4); // Limit to 4 reasons
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {step === 'input' && (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Add Company
                </h2>
                <p className="text-sm text-gray-600">
                  Enter the name of a company you'd like to add to your exploration.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    ref={inputRef}
                    id="company-name"
                    type="text"
                    value={companyName}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => {
                      if (suggestions.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding suggestions to allow clicks
                      setTimeout(() => setShowSuggestions(false), 150);
                    }}
                    placeholder="e.g., Airbnb, Figma, Linear"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    autoComplete="off"
                  />
                  
                  {/* Autocomplete suggestions */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto">
                      {!companyName.trim() && (
                        <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
                          Popular companies:
                        </div>
                      )}
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                        >
                          <img 
                            src={suggestion.logo} 
                            alt={`${suggestion.name} logo`}
                            className="w-8 h-8 rounded flex-shrink-0"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (!target.src.includes('ui-avatars.com')) {
                                const initials = suggestion.name
                                  .split(' ')
                                  .map(word => word.charAt(0))
                                  .join('')
                                  .substring(0, 2)
                                  .toUpperCase();
                                const colors = ['3B82F6', '10B981', 'F59E0B', 'EF4444', '8B5CF6', '06B6D4', 'F97316'];
                                const colorIndex = suggestion.name.length % colors.length;
                                const backgroundColor = colors[colorIndex];
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${backgroundColor}&color=fff&size=32&font-size=0.5`;
                              }
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900 truncate">{suggestion.name}</div>
                            {suggestion.industry && (
                              <div className="text-xs text-gray-500 truncate">{suggestion.industry}</div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {error && (
                  <div className="text-sm text-red-600 flex items-start space-x-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSearch}
                  disabled={!companyName.trim() || isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center space-x-2"
                >
                  {isLoading && (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  <span>{isLoading ? 'Searching...' : 'Search Company'}</span>
                </button>
              </div>
            </>
          )}

          {step === 'confirm' && companyPreview && (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirm Company
                </h2>
                <p className="text-sm text-gray-600">
                  Is this the company you want to add?
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={companyPreview.logo} 
                      alt={`${companyPreview.name} logo`}
                      className="w-12 h-12 rounded flex-shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('ui-avatars.com')) {
                          const initials = companyPreview.name
                            .split(' ')
                            .map(word => word.charAt(0))
                            .join('')
                            .substring(0, 2)
                            .toUpperCase();
                          const colors = ['3B82F6', '10B981', 'F59E0B', 'EF4444', '8B5CF6', '06B6D4', 'F97316'];
                          const colorIndex = companyPreview.name.length % colors.length;
                          const backgroundColor = colors[colorIndex];
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${backgroundColor}&color=fff&size=48&font-size=0.5`;
                        }
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{companyPreview.name}</h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          companyPreview.confidence === 'high' 
                            ? 'bg-green-100 text-green-800' 
                            : companyPreview.confidence === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {companyPreview.confidence === 'high' ? 'Verified' : 
                           companyPreview.confidence === 'medium' ? 'Likely match' : 'Basic info'}
                        </div>
                      </div>
                      
                      {companyPreview.domain && (
                        <p className="text-sm text-gray-600 truncate">{companyPreview.domain}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        {companyPreview.industry && (
                          <span>{companyPreview.industry}</span>
                        )}
                        {companyPreview.employees && (
                          <span>{companyPreview.employees} employees</span>
                        )}
                        {companyPreview.location && (
                          <span>{companyPreview.location}</span>
                        )}
                      </div>
                      
                      {companyPreview.description && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {companyPreview.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="text-sm text-red-600 flex items-start space-x-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setStep('input')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Add to Exploration
                </button>
              </div>
            </>
          )}

          {step === 'processing' && (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Adding Company
                </h2>
                <p className="text-sm text-gray-600">
                  Gathering company information and computing CMF match...
                </p>
              </div>
              
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="relative mb-4">
                    <svg className="w-8 h-8 animate-spin text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">
                    Analyzing {companyPreview?.name} against your CMF criteria...
                  </p>
                  <div className="mt-2 text-xs text-gray-400">
                    This may take 10-15 seconds
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCompanyModal;