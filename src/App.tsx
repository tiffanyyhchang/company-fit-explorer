import React from 'react';
import CMFGraphExplorer from './components/CMFGraphExplorer';
import { sampleUserCMF, sampleCompanies } from './data/companies';

const App: React.FC = () => {
  return (
    <div className="App">
      <CMFGraphExplorer 
        userCMF={sampleUserCMF}
        companies={sampleCompanies}
      />
    </div>
  );
};

export default App;