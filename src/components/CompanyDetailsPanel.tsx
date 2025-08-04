import React from 'react';
import { CompanyDetailsPanelProps } from '../types';
import { formatCurrency, formatCompanyType, getFallbackAvatar } from '../utils';

const CompanyDetailsPanel: React.FC<CompanyDetailsPanelProps> = ({ 
  company, 
  getMarketFitColor 
}) => {
  return (
    <div className="w-80 bg-white shadow-lg overflow-y-auto">
      {!company ? (
        <div className="p-6 flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <div className="mb-4 text-4xl">🏢</div>
            <h3 className="font-semibold mb-2">Select a Company</h3>
            <p className="text-sm">Click on any company node to view detailed information and find your perfect fit.</p>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex items-center mb-4">
            <img 
              src={company.logo} 
              alt={company.name}
              className="w-12 h-12 rounded mr-3"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                target.src = getFallbackAvatar(company.name);
              }}
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
              <p className="text-sm text-gray-600">{company.location}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Market Fit Score</h3>
              <div className={`text-2xl font-bold ${getMarketFitColor(company.marketFit)}`}>
                {company.marketFit}/10
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Min Compensation</h3>
              <p className="text-lg text-gray-800">{formatCurrency(company.minComp)}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Culture Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {company.culture.map((keyword, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Company Type</h3>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                {formatCompanyType(company.type)}
              </span>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                Click on other companies to explore relationships and find companies that fit your career goals. 
                Use the market fit slider to filter companies by your preferences.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetailsPanel;