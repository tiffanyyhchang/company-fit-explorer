export interface CompanyData {
  id: string;
  name: string;
  logo: string;
  location: string;
  minComp: number;
  culture: string[];
  marketFit: number;
  type: CompanyType;
}

export interface CompanyNode {
  data: CompanyData;
}

export interface CompanyEdge {
  data: {
    source: string;
    target: string;
    relationship: RelationshipType;
  };
}

export interface GraphData {
  nodes: CompanyNode[];
  edges: CompanyEdge[];
}

export type CompanyType = 
  | 'tech-giant' 
  | 'ai-startup' 
  | 'growth' 
  | 'established' 
  | 'startup';

export type RelationshipType = 
  | 'competitor' 
  | 'partner' 
  | 'parent' 
  | 'ecosystem';

export interface ControlPanelProps {
  marketFitScore: number;
  onMarketFitChange: (score: number) => void;
}

export interface CompanyDetailsPanelProps {
  company: CompanyData | null;
  getMarketFitColor: (score: number) => string;
}

export interface GraphContainerProps {
  cyRef: React.RefObject<HTMLDivElement>;
}