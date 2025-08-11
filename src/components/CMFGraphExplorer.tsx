import React, { useState, useMemo } from 'react';
import { CMFGraphExplorerProps, ViewMode } from '../types';
import { useCompanySelection } from '../hooks/useCompanySelection';
import { useWatchlist } from '../hooks/useWatchlist';
import CompanyGraph from './CompanyGraph';
import CompanyDetailPanel from './CompanyDetailPanel';

const CMFGraphExplorer: React.FC<CMFGraphExplorerProps> = ({ userCMF, companies }) => {
  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>('explore');
  
  // Company selection state
  const {
    selectedCompany,
    hoveredCompany,
    handleCompanySelect,
    handleCompanyHover,
    handleCompanySelectFromPanel,
  } = useCompanySelection();

  // Watchlist state and actions
  const {
    companyIds: watchlistCompanyIds,
    isLoading: watchlistLoading,
    error: watchlistError,
    toggleWatchlist,
    isInWatchlist,
    stats: watchlistStats,
    watchlistCompanies,
  } = useWatchlist({ 
    companies,
    onError: (error) => {
      // Handle watchlist errors gracefully
      console.warn('Watchlist error:', error.message);
    }
  });

  // Filter companies based on view mode
  const displayedCompanies = useMemo(() => {
    if (viewMode === 'watchlist') {
      return watchlistCompanies;
    }
    return companies;
  }, [companies, watchlistCompanies, viewMode]);

  // Handle view mode toggle
  const handleViewModeChange = (newMode: ViewMode) => {
    setViewMode(newMode);
    // Clear selection when switching views to avoid confusion
    if (selectedCompany && newMode === 'watchlist' && !isInWatchlist(selectedCompany.id)) {
      handleCompanySelect(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Graph Area */}
      <div className="flex-1 relative">
        {/* View Mode Toggle */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex">
            <button
              onClick={() => handleViewModeChange('explore')}
              className={`w-56 px-4 py-3 font-medium transition-colors flex items-center justify-center space-x-2 whitespace-nowrap ${
                viewMode === 'explore'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Explore Companies ({companies.length})</span>
            </button>
            <button
              onClick={() => handleViewModeChange('watchlist')}
              className={`w-56 px-4 py-3 font-medium transition-colors flex items-center justify-center space-x-2 whitespace-nowrap ${
                viewMode === 'watchlist'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>Your Watchlist ({watchlistCompanyIds.size})</span>
            </button>
          </div>
        </div>

        <CompanyGraph
          cmf={userCMF}
          companies={displayedCompanies}
          selectedCompany={selectedCompany}
          hoveredCompany={hoveredCompany}
          onCompanySelect={handleCompanySelect}
          onCompanyHover={handleCompanyHover}
          watchlistCompanyIds={watchlistCompanyIds}
          viewMode={viewMode}
        />
        
        {/* CMF Info Overlay */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {userCMF.name}'s Candidate-Market Fit
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
            <div className="flex items-center pt-2 border-t border-gray-200">
              <span className="text-red-500 font-bold mr-2">♥</span>
              <span>In Watchlist</span>
            </div>
          </div>
        </div>

        {/* Watchlist Empty State */}
        {viewMode === 'watchlist' && displayedCompanies.length === 0 && !watchlistLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Companies in Watchlist
              </h3>
              <p className="text-gray-600 mb-4">
                Start building your watchlist by saving companies you're interested in.
              </p>
              <button
                onClick={() => handleViewModeChange('explore')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Explore Companies
              </button>
            </div>
          </div>
        )}

        {/* Watchlist Loading State */}
        {viewMode === 'watchlist' && watchlistLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your watchlist...</p>
            </div>
          </div>
        )}

        {/* Watchlist Error State */}
        {watchlistError && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg shadow">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{watchlistError}</span>
            </div>
          </div>
        )}
      </div>

      {/* Side Panel */}
      <div className="w-96 bg-white border-l border-gray-200 overflow-hidden">
        <CompanyDetailPanel
          selectedCompany={selectedCompany}
          allCompanies={displayedCompanies}
          isInWatchlist={isInWatchlist}
          onToggleWatchlist={toggleWatchlist}
          onCompanySelect={handleCompanySelectFromPanel}
          viewMode={viewMode}
          watchlistStats={watchlistStats}
        />
      </div>
    </div>
  );
};

export default CMFGraphExplorer;