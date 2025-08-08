import { UserCMF, Company } from '../types';

const sampleUserCMF: UserCMF = {
  id: "john-smith",
  name: "John Smith",
  mustHaves: [
    "High Velocity of Execution",
    "Growth-Oriented Environment", 
    "People-First Mentality",
    "Remote/San Diego Location"
  ],
  wantToHave: [
    "Product & Platform Strategy",
    "Cross-Functional Collaboration",
    "Customer-Obsessed Culture",
    "Developer Success Focus",
    "Technical Innovation (AI/ML)"
  ],
  experience: ["AI/ML Products", "Data Pipelines", "Monetization", "Payments", "Gaming"],
  targetRole: "Senior Technical Product Management (Group PM to VP-level)",
  targetCompanies: "Late funding rounds and public companies"
};

const sampleCompanies: Company[] = [
  {
    id: 1,
    name: "Anthropic",
    logo: "https://logo.clearbit.com/anthropic.com",
    matchScore: 96,
    industry: "AI/ML",
    stage: "Late Stage",
    location: "San Francisco, CA",
    employees: "~500",
    remote: "Remote-Friendly",
    openRoles: 12,
    connections: [2, 5, 8],
    connectionTypes: { 2: "AI Competitor", 5: "Similar Culture", 8: "Platform Focus" },
    matchReasons: [
      "AI Safety Research matches Technical Innovation",
      "Fast-moving culture matches High Velocity", 
      "People-first values matches mentality",
      "Remote-friendly matches location needs"
    ],
    color: "#10B981",
    angle: 0,
    distance: 80
  },
  {
    id: 2,
    name: "OpenAI",
    logo: "https://logo.clearbit.com/openai.com",
    matchScore: 88,
    industry: "AI/ML",
    stage: "Late Stage",
    location: "San Francisco, CA",
    employees: "~1000",
    remote: "Hybrid",
    openRoles: 15,
    connections: [1, 8, 14],
    connectionTypes: { 1: "AI Competitor", 8: "Platform APIs", 14: "Research Focus" },
    matchReasons: [
      "Cutting-edge AI research matches innovation focus",
      "High-impact product development",
      "Platform strategy for AI tools"
    ],
    color: "#F59E0B",
    angle: 45,
    distance: 100
  },
  {
    id: 3,
    name: "Stripe",
    logo: "https://logo.clearbit.com/stripe.com",
    matchScore: 94,
    industry: "Fintech",
    stage: "Late Stage",
    location: "San Francisco, CA",
    employees: "~8000",
    remote: "Remote-Friendly",
    openRoles: 23,
    connections: [4, 9, 11],
    connectionTypes: { 4: "Fintech APIs", 9: "Developer Platform", 11: "Payment Processing" },
    matchReasons: [
      "Payments expertise matches your PayPal background",
      "Developer platform aligns with Platform Strategy",
      "High-growth environment matches velocity needs"
    ],
    color: "#10B981",
    angle: 90,
    distance: 85
  },
  {
    id: 4,
    name: "Plaid",
    logo: "https://logo.clearbit.com/plaid.com",
    matchScore: 83,
    industry: "Fintech",
    stage: "Late Stage",
    location: "San Francisco, CA",
    employees: "~1500",
    remote: "Remote-Friendly",
    openRoles: 9,
    connections: [3, 11, 12],
    connectionTypes: { 3: "Fintech APIs", 11: "Banking APIs", 12: "Developer Tools" },
    matchReasons: [
      "API platform matches developer focus",
      "Fintech experience relevant",
      "Developer-first culture"
    ],
    color: "#F59E0B",
    angle: 120,
    distance: 120
  },
  {
    id: 5,
    name: "Discord",
    logo: "https://logo.clearbit.com/discord.com",
    matchScore: 89,
    industry: "Gaming/Communication",
    stage: "Late Stage",
    location: "San Francisco, CA",
    employees: "~1000",
    remote: "Remote-Friendly",
    openRoles: 8,
    connections: [1, 6, 13],
    connectionTypes: { 1: "People-First Culture", 6: "Gaming Platform", 13: "Developer APIs" },
    matchReasons: [
      "Gaming platform matches Riot Games experience",
      "Fast-paced product development culture",
      "Strong focus on developer experience",
      "People-centric remote culture"
    ],
    color: "#10B981",
    angle: 135,
    distance: 95
  },
  {
    id: 6,
    name: "Riot Games",
    logo: "https://logo.clearbit.com/riotgames.com",
    matchScore: 92,
    industry: "Gaming",
    stage: "Mature",
    location: "Los Angeles, CA",
    employees: "~2500",
    remote: "Hybrid",
    openRoles: 6,
    connections: [5, 13, 7],
    connectionTypes: { 5: "Gaming Platform", 13: "Gaming APIs", 7: "Entertainment" },
    matchReasons: [
      "Direct experience match from your background",
      "Platform products (League, Valorant)",
      "Player-focused culture and values"
    ],
    color: "#10B981",
    angle: 180,
    distance: 90
  },
  {
    id: 7,
    name: "Netflix",
    logo: "https://logo.clearbit.com/netflix.com",
    matchScore: 78,
    industry: "Entertainment",
    stage: "Public",
    location: "Los Angeles, CA",
    employees: "~11000",
    remote: "Hybrid",
    openRoles: 4,
    connections: [6, 15],
    connectionTypes: { 6: "Entertainment", 15: "Content Platform" },
    matchReasons: [
      "Platform strategy for content delivery",
      "Data-driven product decisions",
      "LA location preference"
    ],
    color: "#6B7280",
    angle: 200,
    distance: 140
  },
  {
    id: 8,
    name: "Databricks",
    logo: "https://logo.clearbit.com/databricks.com",
    matchScore: 91,
    industry: "Data/ML",
    stage: "Public",
    location: "San Francisco, CA",
    employees: "~6000",
    remote: "Remote-Friendly",
    openRoles: 18,
    connections: [1, 2, 14],
    connectionTypes: { 1: "AI/ML Platform", 2: "ML Infrastructure", 14: "Data Science" },
    matchReasons: [
      "Data platform matches ML/AI background",
      "Strong growth trajectory matches environment needs",
      "Developer-focused platform strategy",
      "Remote-first engineering culture"
    ],
    color: "#10B981",
    angle: 225,
    distance: 92
  },
  {
    id: 9,
    name: "GitHub",
    logo: "https://logo.clearbit.com/github.com",
    matchScore: 85,
    industry: "Developer Tools",
    stage: "Public (Microsoft)",
    location: "San Francisco, CA",
    employees: "~3000",
    remote: "Remote-Friendly",
    openRoles: 14,
    connections: [3, 10, 12],
    connectionTypes: { 3: "Developer Platform", 10: "Dev Tools", 12: "API Platform" },
    matchReasons: [
      "Developer platform matches focus",
      "Collaboration tools align with values",
      "Remote-first culture"
    ],
    color: "#F59E0B",
    angle: 270,
    distance: 110
  },
  {
    id: 10,
    name: "Vercel",
    logo: "https://logo.clearbit.com/vercel.com",
    matchScore: 87,
    industry: "Developer Tools",
    stage: "Late Stage",
    location: "San Francisco, CA",
    employees: "~400",
    remote: "Remote-Friendly",
    openRoles: 7,
    connections: [9, 12, 15],
    connectionTypes: { 9: "Dev Tools", 12: "Developer APIs", 15: "Platform" },
    matchReasons: [
      "Developer platform focus",
      "Fast execution and deployment",
      "Remote-first startup culture"
    ],
    color: "#10B981",
    angle: 300,
    distance: 105
  },
  {
    id: 11,
    name: "Mercury",
    logo: "https://logo.clearbit.com/mercury.com",
    matchScore: 80,
    industry: "Fintech",
    stage: "Late Stage",
    location: "San Francisco, CA",
    employees: "~400",
    remote: "Remote-Friendly",
    openRoles: 5,
    connections: [3, 4],
    connectionTypes: { 3: "Financial APIs", 4: "Banking Technology" },
    matchReasons: [
      "Fintech platform for businesses",
      "Startup velocity and execution",
      "Remote-friendly culture"
    ],
    color: "#F59E0B",
    angle: 315,
    distance: 125
  },
  {
    id: 12,
    name: "Retool",
    logo: "https://logo.clearbit.com/retool.com",
    matchScore: 84,
    industry: "Developer Tools",
    stage: "Late Stage",
    location: "San Francisco, CA",
    employees: "~800",
    remote: "Remote-Friendly",
    openRoles: 11,
    connections: [9, 10, 4],
    connectionTypes: { 9: "Developer Platform", 10: "Internal Tools", 4: "API Integration" },
    matchReasons: [
      "Developer tools and internal platforms",
      "API-first architecture",
      "High growth environment"
    ],
    color: "#F59E0B",
    angle: 330,
    distance: 115
  },
  {
    id: 13,
    name: "Epic Games",
    logo: "https://logo.clearbit.com/epicgames.com",
    matchScore: 86,
    industry: "Gaming",
    stage: "Late Stage",
    location: "Cary, NC",
    employees: "~4500",
    remote: "Remote-Friendly",
    openRoles: 12,
    connections: [5, 6],
    connectionTypes: { 5: "Gaming Platform", 6: "Game Development" },
    matchReasons: [
      "Gaming platform experience relevant",
      "Unreal Engine developer ecosystem",
      "Platform and marketplace strategy"
    ],
    color: "#F59E0B",
    angle: 25,
    distance: 108
  },
  {
    id: 14,
    name: "Scale AI",
    logo: "https://logo.clearbit.com/scale.com",
    matchScore: 89,
    industry: "AI/Data",
    stage: "Late Stage",
    location: "San Francisco, CA",
    employees: "~1000",
    remote: "Remote-Friendly",
    openRoles: 16,
    connections: [1, 2, 8],
    connectionTypes: { 1: "AI Infrastructure", 2: "ML Operations", 8: "Data Platform" },
    matchReasons: [
      "AI platform and infrastructure",
      "Data pipeline expertise relevant",
      "High growth trajectory"
    ],
    color: "#10B981",
    angle: 60,
    distance: 95
  },
  {
    id: 15,
    name: "Notion",
    logo: "https://logo.clearbit.com/notion.so",
    matchScore: 86,
    industry: "Productivity",
    stage: "Late Stage",
    location: "San Francisco, CA",
    employees: "~500",
    remote: "Remote-First",
    openRoles: 6,
    connections: [10, 7],
    connectionTypes: { 10: "Platform APIs", 7: "Content Platform" },
    matchReasons: [
      "Platform product strategy",
      "Remote-first company culture",
      "People-focused values and growth"
    ],
    color: "#F59E0B",
    angle: 290,
    distance: 108
  }
];

export { sampleUserCMF, sampleCompanies };