import React from 'react';
import { CMFGraphExplorerProps } from '../types';
import { useCompanySelection } from '../hooks/useCompanySelection';
import CompanyGraph from './CompanyGraph';
import CompanyDetailPanel from './CompanyDetailPanel';

const CMFGraphExplorer: React.FC<CMFGraphExplorerProps> = ({ userCMF, companies }) => {
  const {
    selectedCompany,
    hoveredCompany,
    handleCompanySelect,
    handleCompanyHover,
    handleCompanySelectFromPanel,
  } = useCompanySelection();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Graph Area */}
      <div className="flex-1 relative">
        <CompanyGraph
          cmf={userCMF}
          companies={companies}
          selectedCompany={selectedCompany}
          hoveredCompany={hoveredCompany}
          onCompanySelect={handleCompanySelect}
          onCompanyHover={handleCompanyHover}
        />
        
        {/* CMF Info Overlay */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {userCMF.name}'s CMF
          </h2>
          <div className="text-sm text-gray-600">
            <p className="mb-1"><strong>Target Role:</strong> {userCMF.targetRole}</p>
            <p className="mb-2"><strong>Target Companies:</strong> {userCMF.targetCompanies}</p>
            <div className="mb-2">
              <strong>Must Haves:</strong>
              <ul className="list-disc list-inside text-xs mt-1">
                {userCMF.mustHaves.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Match Quality</h3>
          <div className="space-y-1 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>90%+ Excellent Match</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>80-89% Good Match</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
              <span>70-79% Moderate Match</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-96 bg-white border-l border-gray-200 overflow-hidden">
        <CompanyDetailPanel
          selectedCompany={selectedCompany}
          allCompanies={companies}
          onCompanySelect={handleCompanySelectFromPanel}
        />
      </div>
    </div>
  );
};

export default CMFGraphExplorer;