import { GraphData } from '../types';

export const companyData: GraphData = {
  nodes: [
    // Tech Giants
    { 
      data: { 
        id: 'google', 
        name: 'Google', 
        logo: 'https://logo.clearbit.com/google.com',
        location: 'Mountain View, CA',
        minComp: 180000,
        culture: ['innovation', 'scale', 'data-driven'],
        marketFit: 8,
        type: 'tech-giant'
      } 
    },
    { 
      data: { 
        id: 'meta', 
        name: 'Meta', 
        logo: 'https://logo.clearbit.com/meta.com',
        location: 'Menlo Park, CA',
        minComp: 175000,
        culture: ['fast-moving', 'impact', 'open'],
        marketFit: 7,
        type: 'tech-giant'
      } 
    },
    { 
      data: { 
        id: 'apple', 
        name: 'Apple', 
        logo: 'https://logo.clearbit.com/apple.com',
        location: 'Cupertino, CA',
        minComp: 170000,
        culture: ['excellence', 'design', 'privacy'],
        marketFit: 6,
        type: 'tech-giant'
      } 
    },
    
    // AI/ML Companies
    { 
      data: { 
        id: 'openai', 
        name: 'OpenAI', 
        logo: 'https://logo.clearbit.com/openai.com',
        location: 'San Francisco, CA',
        minComp: 200000,
        culture: ['cutting-edge', 'research', 'impact'],
        marketFit: 9,
        type: 'ai-startup'
      } 
    },
    { 
      data: { 
        id: 'anthropic', 
        name: 'Anthropic', 
        logo: 'https://logo.clearbit.com/anthropic.com',
        location: 'San Francisco, CA',
        minComp: 190000,
        culture: ['safety', 'research', 'ethics'],
        marketFit: 9,
        type: 'ai-startup'
      } 
    },
    { 
      data: { 
        id: 'deepmind', 
        name: 'DeepMind', 
        logo: 'https://logo.clearbit.com/deepmind.com',
        location: 'London, UK',
        minComp: 165000,
        culture: ['research', 'breakthrough', 'collaboration'],
        marketFit: 8,
        type: 'ai-startup'
      } 
    },
    
    // Growth Companies
    { 
      data: { 
        id: 'stripe', 
        name: 'Stripe', 
        logo: 'https://logo.clearbit.com/stripe.com',
        location: 'San Francisco, CA',
        minComp: 160000,
        culture: ['fast-growth', 'global', 'developer-first'],
        marketFit: 8,
        type: 'growth'
      } 
    },
    { 
      data: { 
        id: 'notion', 
        name: 'Notion', 
        logo: 'https://logo.clearbit.com/notion.so',
        location: 'San Francisco, CA',
        minComp: 150000,
        culture: ['user-focused', 'creative', 'async'],
        marketFit: 7,
        type: 'growth'
      } 
    },
    { 
      data: { 
        id: 'figma', 
        name: 'Figma', 
        logo: 'https://logo.clearbit.com/figma.com',
        location: 'San Francisco, CA',
        minComp: 155000,
        culture: ['design', 'collaboration', 'creative'],
        marketFit: 6,
        type: 'growth'
      } 
    },
    
    // Established Tech
    { 
      data: { 
        id: 'microsoft', 
        name: 'Microsoft', 
        logo: 'https://logo.clearbit.com/microsoft.com',
        location: 'Redmond, WA',
        minComp: 165000,
        culture: ['inclusive', 'growth-mindset', 'innovation'],
        marketFit: 7,
        type: 'established'
      } 
    },
    { 
      data: { 
        id: 'amazon', 
        name: 'Amazon', 
        logo: 'https://logo.clearbit.com/amazon.com',
        location: 'Seattle, WA',
        minComp: 160000,
        culture: ['customer-obsessed', 'ownership', 'high-bar'],
        marketFit: 6,
        type: 'established'
      } 
    }
  ],
  edges: [
    // Competition relationships
    { data: { source: 'google', target: 'meta', relationship: 'competitor' } },
    { data: { source: 'google', target: 'apple', relationship: 'competitor' } },
    { data: { source: 'meta', target: 'apple', relationship: 'competitor' } },
    
    // AI space relationships
    { data: { source: 'openai', target: 'anthropic', relationship: 'competitor' } },
    { data: { source: 'openai', target: 'deepmind', relationship: 'competitor' } },
    { data: { source: 'anthropic', target: 'deepmind', relationship: 'competitor' } },
    { data: { source: 'google', target: 'deepmind', relationship: 'parent' } },
    { data: { source: 'google', target: 'openai', relationship: 'competitor' } },
    { data: { source: 'microsoft', target: 'openai', relationship: 'partner' } },
    
    // Growth company relationships
    { data: { source: 'stripe', target: 'notion', relationship: 'ecosystem' } },
    { data: { source: 'figma', target: 'notion', relationship: 'ecosystem' } },
    
    // Cloud/Platform relationships
    { data: { source: 'microsoft', target: 'amazon', relationship: 'competitor' } },
    { data: { source: 'google', target: 'amazon', relationship: 'competitor' } },
    { data: { source: 'google', target: 'microsoft', relationship: 'competitor' } }
  ]
};