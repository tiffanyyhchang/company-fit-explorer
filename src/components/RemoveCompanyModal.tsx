import React from 'react';
import { Company } from '../types';

interface RemoveCompanyModalProps {
  isOpen: boolean;
  company: Company | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RemoveCompanyModal: React.FC<RemoveCompanyModalProps> = ({
  isOpen,
  company,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Remove Company
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Remove{' '}
            <span className="font-semibold">{company.name}</span> from your 
            company exploration? You can add it back later using the + button.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-700">
                <p className="font-medium">This will:</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Hide the company from your exploration graph</li>
                  <li>Remove it from your watchlist (if saved)</li>
                  <li>Hide related connections in the visualization</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <strong>Company Details:</strong>
            <div className="mt-1 bg-gray-50 rounded p-2">
              <p><span className="text-gray-500">Industry:</span> {company.industry}</p>
              <p><span className="text-gray-500">Stage:</span> {company.stage}</p>
              <p><span className="text-gray-500">Match Score:</span> {company.matchScore}%</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700 transition-colors duration-200"
            autoFocus
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
          >
            Remove Company
          </button>
        </div>
      </div>
    </div>
  );
};