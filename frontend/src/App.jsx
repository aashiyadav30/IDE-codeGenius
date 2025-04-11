import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import IOPanel from './components/IOPanel';
import Footer from './components/Footer';
import EditorComponent from './components/EditorComponent';
import './App.css';

const App = () => {
  return (
    <div className="main-content">
      <Header />
      <div className="editor-container">
      <Sidebar />
        <EditorComponent/>
        <IOPanel />
      </div>
      <Footer />
    </div>
  );
};

export default App;