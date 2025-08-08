import { UserCMF, Company, GraphData } from '../types';

// EXACT positioning algorithm from wireframe - DO NOT modify
export const calculatePosition = (company: Company, centerX: number, centerY: number, zoom: number = 1) => {
  // Convert angle to radians
  const angleRad = ((company.angle || 0) * Math.PI) / 180;
  
  // Use the exact distance from our data (NOT calculated from match score)
  const distance = (company.distance || 100) * zoom;
  
  return {
    x: centerX + Math.cos(angleRad) * distance,
    y: centerY + Math.sin(angleRad) * distance
  };
};

export const transformToGraphData = (cmf: UserCMF, companies: Company[]): GraphData => {
  const centerX = 400;
  const centerY = 300;
  
  const nodes = [
    // Background match score zone circles
    {
      data: {
        id: 'zone-excellent',
        label: '',
        type: 'zone-excellent' as const
      },
      position: { x: centerX, y: centerY }
    },
    {
      data: {
        id: 'zone-good',
        label: '',
        type: 'zone-good' as const
      },
      position: { x: centerX, y: centerY }
    },
    {
      data: {
        id: 'zone-fair',
        label: '',
        type: 'zone-fair' as const
      },
      position: { x: centerX, y: centerY }
    },
    // CMF center node
    {
      data: {
        id: 'cmf-center',
        label: 'YOUR CMF',
        type: 'cmf' as const,
        cmf: cmf
      },
      position: { x: centerX, y: centerY }
    },
    // Company nodes with exact positions
    ...companies.map(company => ({
      data: {
        id: `company-${company.id}`,
        label: company.name,
        type: 'company' as const,
        company: company
      },
      position: calculatePosition(company, centerX, centerY, 1)
    })),
    // Company label nodes - positioned below each company
    ...companies.map(company => {
      const pos = calculatePosition(company, centerX, centerY, 1);
      return {
        data: {
          id: `label-${company.id}`,
          label: `${company.name}\n${company.matchScore}%`,
          type: 'company-label' as const,
          company: company
        },
        position: { x: pos.x, y: pos.y + 20 } // 20px below the company node for better spacing
      };
    })
  ];

  const edges = companies.flatMap(company =>
    company.connections.map(connectionId => ({
      data: {
        id: `edge-${company.id}-${connectionId}`,
        source: `company-${company.id}`,
        target: `company-${connectionId}`,
        relationship: company.connectionTypes[connectionId]
      }
    }))
  );

  return { nodes, edges };
};

export const getMatchScoreColor = (matchScore: number): string => {
  if (matchScore >= 90) return '#10B981'; // Green - excellent match
  if (matchScore >= 80) return '#F59E0B'; // Yellow - good match
  return '#6B7280'; // Gray - moderate match
};

export const getCytoscapeStyles = (): any[] => [
  // Background Zone Circles - Match Quality Zones
  {
    selector: 'node[type="zone-excellent"]',
    style: {
      'width': 160, // 80px radius = 160px diameter
      'height': 160,
      'background-color': 'transparent',
      'background-opacity': 0,
      'border-width': 0.5,
      'border-color': '#10B981', // Green for excellent matches
      'border-opacity': 0.3,
      'z-index': -8,
      'events': 'no'
    }
  },
  {
    selector: 'node[type="zone-good"]',
    style: {
      'width': 220, // 110px radius = 220px diameter  
      'height': 220,
      'background-color': 'transparent',
      'background-opacity': 0,
      'border-width': 0.3,
      'border-color': '#F59E0B', // Yellow for good matches
      'border-opacity': 0.5,
      'z-index': -9,
      'events': 'no'
    }
  },
  {
    selector: 'node[type="zone-fair"]',
    style: {
      'width': 280, // 140px radius = 280px diameter
      'height': 280,
      'background-color': 'transparent',
      'background-opacity': 0,
      'border-color': '#6B7280', // Gray for fair matches
      'border-opacity': 0.3,
      'border-width': 0.3,
      'z-index': -10,
      'events': 'no'
    }
  },
  // Central CMF Node - exact specs
  {
    selector: 'node[type="cmf"]',
    style: {
      'width': 60,
      'height': 60,
      'background-color': '#3B82F6',
      'border-width': 1,
      //'border-color': '#1F2937',
       'border-color': 'white',
      // 'border-color': 'transparent',
      'label': 'YOUR\nCMF\n\nJohn Smith',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': 6,
      'font-weight': 'bold',
      'color': 'white',
      'text-wrap': 'wrap',
      'text-max-width': '90px',
      'z-index': 10
    }
  },
  // Company Nodes - exact specs: 25px diameter, white border
  {
    selector: 'node[type="company"]',
    style: {
      'width': 25,
      'height': 25,
      'background-color': (ele: any) => ele.data('company')?.color || '#6B7280',
      'border-width': 2,
      'border-color': 'white',
      'label': (ele: any) => {
        const company = ele.data('company');
        return company ? company.name.substring(0, 2).toUpperCase() : '';
      },
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': 6,
      'font-weight': 'bold',
      'color': 'white',
      'z-index': 5
    }
  },
  // Company Label Nodes - positioned below each company
  {
    selector: 'node[type="company-label"]',
    style: {
      'width': 60,
      'height': 30,
      'background-color': 'white',
      'background-opacity': 0,
      //'background-opacity': 0.8,
      // 'border-width': 0,
      // 'border-color': '#e5e7eb',
      'border-opacity': 0,
      // 'shape': 'round-rectangle',
      'label': 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': 5,
      'font-weight': 450,
      // 'font-weight': 'bold',
      'color': '#1F2937',
      'text-wrap': 'wrap',
      'text-max-width': '55px',
      'z-index': 5,
      'events': 'no'
    }
  },
  // Connection Lines - exact specs
  {
    selector: 'edge',
    style: {
      'width': 0.3,
      'line-color': '#E5E7EB',
      'target-arrow-shape': 'none',
      'curve-style': 'straight',
      'opacity': 0.6,
      'z-index': 1
    }
  },
  // Selected Node Styles
  {
    selector: 'node.selected',
    style: {
      'border-width': 2, 
      'border-color': 'black',
      'z-index': 9
    }
  },
  // Highlighted Connection Lines
  {
    selector: 'edge.highlighted',
    style: {
      'width': 1.5,
      'line-color': '#3B82F6',
      'opacity': 1,
      'transition-property': 'width, opacity',
      'transition-duration': '0.1s',
      'transition-timing-function': 'ease-out',
      'z-index': 5
    }
  },
  // Hover Effects for company nodes (keep white border on hover)
  {
    selector: 'node[type="company"]:hover',
    style: {
      'border-width': 1,
      'border-color': 'white',
      'z-index': 7
    }
  },
  // Dimmed company nodes when hovering others
  {
    selector: 'node[type="company"].dimmed',
    style: {
      'opacity': 0.3,
      'z-index': -1,
      'transition-property': 'opacity',
      'transition-duration': '0.1s',
      'transition-timing-function': 'ease-out'
    }
  },
  // Dimmed label nodes
  {
    selector: 'node[type="company-label"].dimmed',
    style: {
      'opacity': 0.2,
      'z-index': -1,
      'transition-property': 'opacity',
      'transition-duration': '0.1s',
      'transition-timing-function': 'ease-out'
    }
  },
  // Active (non-dimmed) company nodes should appear on top
  {
    selector: 'node[type="company"]:not(.dimmed)',
    style: {
      'z-index': 8
    }
  },
  // Active (non-dimmed) label nodes should appear on top  
  {
    selector: 'node[type="company-label"]:not(.dimmed)',
    style: {
      'z-index': 8
    }
  },
  // Ensure zone nodes maintain their background z-index regardless of other rules
  {
    selector: 'node[type="zone-excellent"], node[type="zone-good"], node[type="zone-fair"]',
    style: {
      'z-index': -8
    }
  }
];