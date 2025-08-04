import { getRelationshipColor, getBorderColor, getNodeOpacity } from './index';

export const getCytoscapeStyles = (marketFitScore: number) => [
  {
    selector: 'node',
    style: {
      'width': 80,
      'height': 80,
      'background-image': 'data(logo)',
      'background-fit': 'cover',
      'background-color': '#ffffff',
      'border-width': 3,
      'border-color': (ele: any) => {
        const fit = ele.data('marketFit');
        return getBorderColor(fit, marketFitScore);
      },
      'label': 'data(name)',
      'text-valign': 'bottom',
      'text-halign': 'center',
      'font-size': '12px',
      'font-weight': 'bold',
      'text-margin-y': 5,
      'color': '#1F2937',
      'text-background-color': '#ffffff',
      'text-background-opacity': 0.8,
      'text-background-padding': '3px',
      'opacity': (ele: any) => getNodeOpacity(ele.data('marketFit'), marketFitScore)
    }
  },
  {
    selector: 'node:selected',
    style: {
      'border-width': 5,
      'border-color': '#3B82F6'
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 2,
      'line-color': (ele: any) => {
        const rel = ele.data('relationship');
        return getRelationshipColor(rel);
      },
      'target-arrow-color': (ele: any) => {
        const rel = ele.data('relationship');
        return getRelationshipColor(rel);
      },
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'opacity': 0.7
    }
  },
  {
    selector: 'edge:selected',
    style: {
      'width': 4,
      'opacity': 1
    }
  }
];

export const getCytoscapeLayout = () => ({
  name: 'cose',
  idealEdgeLength: 120,
  nodeOverlap: 20,
  refresh: 20,
  fit: true,
  padding: 30,
  randomize: false,
  componentSpacing: 100,
  nodeRepulsion: 400000,
  edgeElasticity: 100,
  nestingFactor: 5,
  gravity: 80,
  numIter: 1000,
  initialTemp: 200,
  coolingFactor: 0.95,
  minTemp: 1.0
});