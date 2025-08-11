import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { CompanyGraphProps } from '../types';
import { transformToGraphData, getCytoscapeStyles } from '../utils/graphDataTransform';

const CompanyGraph: React.FC<CompanyGraphProps> = ({
  cmf,
  companies,
  selectedCompany,
  // hoveredCompany,
  onCompanySelect,
  onCompanyHover,
  watchlistCompanyIds = new Set(),
  viewMode: _viewMode = 'explore'
}) => {
  const cyRef = useRef<HTMLDivElement>(null);
  const cyInstance = useRef<cytoscape.Core | null>(null);
  const onCompanySelectRef = useRef(onCompanySelect);
  const onCompanyHoverRef = useRef(onCompanyHover);
  const selectedCompanyRef = useRef(selectedCompany);

  // Keep refs updated
  onCompanySelectRef.current = onCompanySelect;
  onCompanyHoverRef.current = onCompanyHover;
  selectedCompanyRef.current = selectedCompany;

  useEffect(() => {
    if (!cyRef.current) return;

    const graphData = transformToGraphData(cmf, companies, watchlistCompanyIds);
    
    try {
      cyInstance.current = cytoscape({
        container: cyRef.current,
        elements: [...graphData.nodes, ...graphData.edges],
      style: [
        ...getCytoscapeStyles(),
        {
          selector: 'core',
          style: {
            'background-color': '#f9fafb'
          }
        }
      ],
      layout: { 
        name: 'preset' // CRITICAL: Use preset positions from our data
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      autoungrabify: true, // Disable dragging to maintain precise positions
      wheelSensitivity: 0.3,
      minZoom: 0.5,
      maxZoom: 5
    });

    } catch (error) {
      console.error('Error initializing Cytoscape graph:', error);
      // Create a minimal fallback instance to prevent further errors
      cyInstance.current = cytoscape({
        container: cyRef.current,
        elements: [],
        style: getCytoscapeStyles(),
      });
      return; // Skip event handlers if graph failed to initialize properly
    }

    const cy = cyInstance.current;

    // Company hover events - simple but stable approach
    let hoverTimeout: ReturnType<typeof setTimeout> | null = null;
    let currentHoveredCompany: any = null;
    let currentHoveredNode: any = null;
    
    cy.on('mouseover', 'node[type="company"]', (event) => {
      const company = event.target.data('company');
      
      // Clear any pending timeout
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      
      // Reset previous hovered node's class (if it's not selected)
      if (currentHoveredNode && currentHoveredNode !== event.target) {
        currentHoveredNode.removeClass('hovered');
      }
      
      // Add hovered class for CSS transition
      event.target.addClass('hovered');
      currentHoveredNode = event.target;
      
      // Only update if this is a different company
      if (currentHoveredCompany?.id !== company.id) {
        currentHoveredCompany = company;
        // Temporarily disable to test centering issue
        // onCompanyHover(company);
        
        if (!selectedCompanyRef.current) {
          // Highlight connected nodes and edges
          const connectedNodes = event.target.connectedEdges().connectedNodes();
          const allCompanyNodes = cy.nodes('[type="company"]');
          const allNameLabelNodes = cy.nodes('[type="company-name-label"]');
          const allPercentLabelNodes = cy.nodes('[type="company-percent-label"]');
          
          // Dim all company and label nodes first
          allCompanyNodes.addClass('dimmed');
          allNameLabelNodes.addClass('dimmed');
          allPercentLabelNodes.addClass('dimmed');
          
          // Highlight current node and connected nodes
          event.target.removeClass('dimmed');
          connectedNodes.filter('[type="company"]').removeClass('dimmed');
          
          // Also highlight the labels for current and connected companies
          const currentNameLabel = cy.getElementById(`name-label-${company.id}`);
          const currentPercentLabel = cy.getElementById(`percent-label-${company.id}`);
          currentNameLabel.removeClass('dimmed');
          currentPercentLabel.removeClass('dimmed');
          
          company.connections.forEach((connId: number) => {
            const connNameLabel = cy.getElementById(`name-label-${connId}`);
            const connPercentLabel = cy.getElementById(`percent-label-${connId}`);
            connNameLabel.removeClass('dimmed');
            connPercentLabel.removeClass('dimmed');
          });
          
          // Highlight only outgoing edges from hovered node to its declared connections
          company.connections.forEach((connId: number) => {
            const edge = cy.getElementById(`edge-${company.id}-${connId}`);
            if (edge.length > 0) {
              edge.addClass('highlighted');
            }
          });
          
          // Also highlight edges between companies that are BOTH directly connected to the hovered node
          const directlyConnectedIds = company.connections.map((id: number) => `company-${id}`);
          
          // Only check edges between nodes that are directly connected to the hovered company
          for (let i = 0; i < directlyConnectedIds.length; i++) {
            const nodeId = directlyConnectedIds[i];
            const node = cy.getElementById(nodeId);
            const nodeEdges = node.connectedEdges();
            
            for (let j = 0; j < nodeEdges.length; j++) {
              const edge = nodeEdges[j];
              const sourceNode = edge.source();
              const targetNode = edge.target();
              
              // Skip edges that connect to the hovered company (already highlighted above)
              if (sourceNode.id() === `company-${company.id}` || 
                  targetNode.id() === `company-${company.id}`) {
                continue;
              }
              
              // Only highlight if BOTH endpoints are in the directly connected list
              if (directlyConnectedIds.includes(sourceNode.id()) && 
                  directlyConnectedIds.includes(targetNode.id())) {
                edge.addClass('highlighted');
              }
            }
          }
        }
      }
    });

    // Only clear highlights when explicitly moving away
    cy.on('mouseout', 'node[type="company"]', (event) => {
      // Don't clear immediately - wait to see if mouse enters another company node
      hoverTimeout = setTimeout(() => {
        currentHoveredCompany = null;
        currentHoveredNode = null;
        // Temporarily disable to test centering issue
        // onCompanyHover(null);
        
        // Remove hovered class to return to default style
        event.target.removeClass('hovered');
        
        if (!selectedCompanyRef.current) {
          cy.nodes().removeClass('dimmed');
          cy.edges().removeClass('highlighted');
        }
        hoverTimeout = null;
      }, 2); // Quick response now that callback issues are resolved
    });

    // Company click events
    cy.on('tap', 'node[type="company"]', (event) => {
      const company = event.target.data('company');
      onCompanySelectRef.current(company);
    });

    // Background click to deselect
    cy.on('tap', (event) => {
      if (event.target === cy) {
        onCompanySelectRef.current(null);
      }
    });

    // CMF center node styling
    cy.on('tap', 'node[type="cmf"]', () => {
      // Show CMF details or do nothing
      console.log('CMF center clicked', cmf);
    });

    return () => {
      // Clean up any pending timeouts
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      
      if (cyInstance.current) {
        cyInstance.current.destroy();
      }
    };
  }, [cmf, companies]);

  // Handle selection changes from external components
  useEffect(() => {
    if (!cyInstance.current) return;

    const cy = cyInstance.current;
    
    // Clear previous selections
    cy.nodes().removeClass('selected dimmed');
    cy.edges().removeClass('highlighted');

    if (selectedCompany) {
      // Get selected node and its connections
      const selectedNode = cy.getElementById(`company-${selectedCompany.id}`);
      const connectedEdges = selectedNode.connectedEdges();
      const connectedNodes = connectedEdges.connectedNodes();
      const allCompanyNodes = cy.nodes('[type="company"]');
      const allNameLabelNodes = cy.nodes('[type="company-name-label"]');
      const allPercentLabelNodes = cy.nodes('[type="company-percent-label"]');
      
      // Dim all company and label nodes first
      allCompanyNodes.addClass('dimmed');
      allNameLabelNodes.addClass('dimmed');
      allPercentLabelNodes.addClass('dimmed');
      
      // Highlight selected node and connected nodes
      selectedNode.removeClass('dimmed').addClass('selected');
      connectedNodes.filter('[type="company"]').removeClass('dimmed');
      
      // Also highlight the labels for selected and connected companies
      const selectedNameLabel = cy.getElementById(`name-label-${selectedCompany.id}`);
      const selectedPercentLabel = cy.getElementById(`percent-label-${selectedCompany.id}`);
      selectedNameLabel.removeClass('dimmed');
      selectedPercentLabel.removeClass('dimmed');
      
      selectedCompany.connections.forEach((connId: number) => {
        const connNameLabel = cy.getElementById(`name-label-${connId}`);
        const connPercentLabel = cy.getElementById(`percent-label-${connId}`);
        connNameLabel.removeClass('dimmed');
        connPercentLabel.removeClass('dimmed');
      });
      
      // Highlight only outgoing edges from selected node to its declared connections
      selectedCompany.connections.forEach((connId: number) => {
        const edge = cy.getElementById(`edge-${selectedCompany.id}-${connId}`);
        if (edge.length > 0) {
          edge.addClass('highlighted');
        }
      });
      
      // Also highlight edges between companies that are BOTH directly connected to the selected node
      const directlyConnectedIds = selectedCompany.connections.map(id => `company-${id}`);
      
      // Only check edges between nodes that are directly connected to the selected company
      for (let i = 0; i < directlyConnectedIds.length; i++) {
        const nodeId = directlyConnectedIds[i];
        const node = cy.getElementById(nodeId);
        const nodeEdges = node.connectedEdges();
        
        for (let j = 0; j < nodeEdges.length; j++) {
          const edge = nodeEdges[j];
          const sourceNode = edge.source();
          const targetNode = edge.target();
          
          // Skip edges that connect to the selected company (already highlighted above)
          if (sourceNode.id() === `company-${selectedCompany.id}` || 
              targetNode.id() === `company-${selectedCompany.id}`) {
            continue;
          }
          
          // Only highlight if BOTH endpoints are in the directly connected list
          if (directlyConnectedIds.includes(sourceNode.id()) && 
              directlyConnectedIds.includes(targetNode.id())) {
            edge.addClass('highlighted');
          }
        }
      }
    }
  }, [selectedCompany]);

  return (
    <div className="w-full h-full relative">
      {/* Cytoscape Graph Container */}
      <div 
        ref={cyRef} 
        className="w-full h-full"
        style={{ cursor: 'grab', backgroundColor: '#f9fafb' }}
        data-cy="cytoscape-container"
      />
      
      {/* Graph Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2" style={{ zIndex: 10 }}>
        <button 
          className="bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => cyInstance.current?.fit()}
          title="Fit to view"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
        
        <button 
          className="bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => cyInstance.current?.zoom(cyInstance.current.zoom() * 1.2)}
          title="Zoom in"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        
        <button 
          className="bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => cyInstance.current?.zoom(cyInstance.current.zoom() * 0.8)}
          title="Zoom out"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M18 12H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CompanyGraph;