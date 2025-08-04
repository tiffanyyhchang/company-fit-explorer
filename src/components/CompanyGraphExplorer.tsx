import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { CompanyData } from '../types';
import { companyData } from '../data/companies';
import { getMarketFitColor } from '../utils';
import { getCytoscapeStyles, getCytoscapeLayout } from '../utils/cytoscapeConfig';
import ControlPanel from './ControlPanel';
import CompanyDetailsPanel from './CompanyDetailsPanel';
import GraphContainer from './GraphContainer';

const CompanyGraphExplorer: React.FC = () => {
  const cyRef = useRef<HTMLDivElement>(null);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [marketFitScore, setMarketFitScore] = useState(7);

  useEffect(() => {
    if (!cyRef.current) return;

    const cy = cytoscape({
      container: cyRef.current,
      elements: companyData,
      style: getCytoscapeStyles(marketFitScore),
      layout: getCytoscapeLayout()
    });

    // Handle node clicks
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      const data = node.data();
      setSelectedCompany(data);
      
      // Highlight connected nodes
      cy.elements().removeClass('highlighted');
      node.addClass('highlighted');
      node.connectedEdges().addClass('highlighted');
      node.connectedEdges().connectedNodes().addClass('highlighted');
    });

    // Handle background clicks
    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        setSelectedCompany(null);
        cy.elements().removeClass('highlighted');
      }
    });

    return () => {
      cy.destroy();
    };
  }, [marketFitScore]);

  const handleMarketFitChange = (score: number) => {
    setMarketFitScore(score);
  };

  const getMarketFitColorForThreshold = (score: number) => {
    return getMarketFitColor(score, marketFitScore);
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex">
      <div className="flex-1 relative">
        <GraphContainer cyRef={cyRef} />
        <ControlPanel 
          marketFitScore={marketFitScore} 
          onMarketFitChange={handleMarketFitChange} 
        />
      </div>
      <CompanyDetailsPanel 
        company={selectedCompany} 
        getMarketFitColor={getMarketFitColorForThreshold} 
      />
    </div>
  );
};

export default CompanyGraphExplorer;