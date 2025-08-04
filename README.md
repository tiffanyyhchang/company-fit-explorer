# Company Fit Explorer - Interactive Company Graph

An interactive visualization tool for exploring tech companies and their relationships to help you discover companies that fit your preferences and career goals.

![Company Graph Explorer](./company-fit-explorer-ui.jpg)

## ✨ Features

- **Interactive Network Graph**: Visualize companies as nodes with relationships between them
- **Market Fit Filtering**: Adjust the market fit threshold to focus on companies that match your preferences
- **Company Details Panel**: Click on any company to see detailed information including:
  - Market fit score
  - Minimum compensation
  - Company culture keywords
  - Company type and location
- **Relationship Mapping**: Understand company relationships:
  - 🔴 **Competitors** - Direct market competitors
  - 🟢 **Partners** - Strategic partnerships
  - 🟣 **Parent/Child** - Ownership relationships
  - 🟡 **Ecosystem** - Companies in similar ecosystems
- **Visual Market Fit Indicators**: 
  - Green border: High market fit
  - Yellow border: Medium market fit
  - Gray border: Low market fit

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/company-fit-explorer.git
cd company-fit-explorer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm start` - Alias for `npm run dev`

## 🏗️ Built With

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Cytoscape.js** - Graph visualization library

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── CompanyGraphExplorer.tsx    # Main component
│   ├── ControlPanel.tsx            # Market fit controls
│   ├── CompanyDetailsPanel.tsx     # Company info panel
│   ├── GraphContainer.tsx          # Graph visualization container
│   └── index.ts                    # Component exports
├── data/                # Static data and configuration
│   └── companies.ts                # Company data and relationships
├── types/               # TypeScript type definitions
│   └── index.ts                    # All type definitions
├── utils/               # Utility functions and configurations
│   ├── index.ts                    # Helper functions
│   └── cytoscapeConfig.ts          # Graph styling configuration
├── styles/              # Styling files
│   └── index.css                   # Global styles and Tailwind imports
├── App.tsx              # Root application component
└── main.tsx             # Application entry point
```

## 📊 Data Structure

The application uses a flexible data structure for companies:

```typescript
interface CompanyData {
  id: string;           // Unique identifier
  name: string;         // Company name
  logo: string;         // Logo URL
  location: string;     // Company location
  minComp: number;      // Minimum compensation
  culture: string[];    // Culture keywords
  marketFit: number;    // Market fit score (1-10)
  type: string;         // Company type (tech-giant, ai-startup, etc.)
}
```

## 🎨 Customization

### Adding New Companies

Edit the `companyData` object in `company_graph_explorer.tsx`:

```javascript
const companyData = {
  nodes: [
    {
      data: {
        id: 'your-company',
        name: 'Your Company',
        logo: 'https://logo.clearbit.com/yourcompany.com',
        location: 'City, State',
        minComp: 150000,
        culture: ['innovative', 'fast-paced', 'collaborative'],
        marketFit: 8,
        type: 'startup'
      }
    }
    // ... more companies
  ],
  edges: [
    // Define relationships between companies
    { data: { source: 'company1', target: 'company2', relationship: 'competitor' } }
  ]
};
```

### Customizing Market Fit Calculation

The market fit score is currently a static value, but you can enhance it to be dynamic based on:
- Your skills and interests
- Salary requirements
- Location preferences
- Company culture preferences

### Styling Customization

The application uses Tailwind CSS. Key styling areas:
- `src/index.css` - Global styles
- Component classes in the TSX file for layout and colors

## 🔄 Company Relationships

- **Competitor**: Companies competing in the same market
- **Partner**: Strategic partnerships or integrations  
- **Parent**: Ownership relationships (parent company → subsidiary)
- **Ecosystem**: Companies in related ecosystems or similar focus areas

## 📱 Responsive Design

The application is responsive and works on:
- Desktop computers
- Tablets
- Mobile devices (with optimized touch interactions)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Author:** Pierre-Andre Galmes

## 🙏 Acknowledgments

- [Cytoscape.js](https://cytoscape.org/) for the excellent graph visualization library
- [Clearbit](https://clearbit.com/) for company logos
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

If you have questions or need help:
1. Check the [Issues](https://github.com/yourusername/company-fit-explorer/issues) page
2. Create a new issue if your question isn't already addressed
3. Provide as much detail as possible for faster resolution

---

**Happy company exploring! 🎯**