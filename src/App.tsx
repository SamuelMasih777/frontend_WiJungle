// src/App.tsx
import React, { Fragment } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { SpotlightPrev } from './components/spotlight/spotlightPrev';
import GraphByTime from './graphs-info/graphByTime';
import GraphByIp from './graphs-info/graphByIPs';
import GraphByProtocol from './graphs-info/graphByProtocol';
import GraphByDestPort from './graphs-info/graphByDestPort';
import GraphByCategory from './graphs-info/graphByCategory';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <Fragment>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-black/[0.96] overflow-x-hidden">
      {/* <div className="flex"> */}
        <SpotlightPrev />
        <div className="bg-black/[0.96]">
          <GraphByCategory />
          <GraphByTime />
          <GraphByIp />
          <GraphByProtocol />
          <GraphByDestPort />
          {/* <GraphByCategory /> */}
        </div>
      
      </div>
      <Footer />
      </Fragment>
  );
};

export default App;
