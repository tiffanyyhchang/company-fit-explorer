import React from 'react';
import { ControlPanelProps } from '../types';

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  marketFitScore, 
  onMarketFitChange 
}) => {
  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
      <h3 className="font-bold text-lg mb-3 text-gray-900">Company Fit Explorer</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Candidate Market Fit Threshold: {marketFitScore}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={marketFitScore}
          onChange={(e) => onMarketFitChange(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded border-2 border-green-500 mr-2"></div>
          <span>High Market Fit</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded border-2 border-yellow-500 mr-2"></div>
          <span>Medium Market Fit</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded border-2 border-gray-400 mr-2"></div>
          <span>Low Market Fit</span>
        </div>
      </div>

      <div className="mt-4 text-xs space-y-1 text-gray-700">
        <div className="flex items-center">
          <div className="w-3 h-0.5 bg-red-500 mr-2"></div>
          <span>Competitors</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-0.5 bg-green-500 mr-2"></div>
          <span>Partners</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-0.5 bg-purple-500 mr-2"></div>
          <span>Parent/Child</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-0.5 bg-yellow-500 mr-2"></div>
          <span>Ecosystem</span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;