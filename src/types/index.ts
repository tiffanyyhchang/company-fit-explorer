export interface UserCMF {
  id: string;
  name: string;
  mustHaves: string[];
  wantToHave: string[];
  experience: string[];
  targetRole: string;
  targetCompanies: string;
}

export interface Company {
  id: number;
  name: string;
  logo: string;
  matchScore: number;
  industry: string;
  stage: string;
  location: string;
  employees: string;
  remote: string;
  openRoles: number;
  connections: number[];
  connectionTypes: Record<number, string>;
  matchReasons: string[];
  color: string;
  angle?: number;
  distance?: number;
}

export interface GraphData {
  nodes: Array<{
    data: {
      id: string;
      label: string;
      type: 'cmf' | 'company' | 'company-label' | 'zone-excellent' | 'zone-good' | 'zone-fair';
      company?: Company;
      cmf?: UserCMF;
    };
    position?: { x: number; y: number };
  }>;
  edges: Array<{
    data: {
      id: string;
      source: string;
      target: string;
      relationship: string;
    };
  }>;
}

// CMF Component Props
export interface CMFGraphExplorerProps {
  userCMF: UserCMF;
  companies: Company[];
}

export interface CompanyGraphProps {
  cmf: UserCMF;
  companies: Company[];
  selectedCompany: Company | null;
  hoveredCompany: Company | null;
  onCompanySelect: (company: Company | null) => void;
  onCompanyHover: (company: Company | null) => void;
}

export interface CompanyDetailPanelProps {
  selectedCompany: Company | null;
  allCompanies: Company[];
  onCompanySelect: (company: Company) => void;
}