import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import VoiceNavigator from './components/VoiceNavigator';
import MaverickWidget from './components/MaverickWidget';
import './App.css'; // Make sure to create this file

function App() {
  const [activePage, setActivePage] = useState('/');
  const [listening, setListening] = useState(false);

  // Keep track of current route for navigation highlighting
  useEffect(() => {
    setActivePage(window.location.pathname);
  }, []);

  return (
    <Router>
      <VoiceNavigator />
      <MaverickWidget />

      <header className="app-header">
        <div className="logo">
          <span className="logo-text">VOXA ASSIST</span>
          <div className={`voice-indicator ${listening ? 'active' : ''}`}>
            <div className="voice-wave"></div>
          </div>
        </div>
        
        <nav className="main-nav">
          <Link 
            to="/" 
            className={activePage === '/' ? 'active' : ''}
            onClick={() => setActivePage('/')}
          >
            <i className="fa fa-home"></i> Home
          </Link>
          <Link 
            to="/about" 
            className={activePage === '/about' ? 'active' : ''}
            onClick={() => setActivePage('/about')}
          >
            <i className="fa fa-info-circle"></i> About
          </Link>
          <Link 
            to="/contact" 
            className={activePage === '/contact' ? 'active' : ''}
            onClick={() => setActivePage('/contact')}
          >
            <i className="fa fa-envelope"></i> Contact
          </Link>
        </nav>
      </header>

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      
      <footer className="app-footer">
        <p>VOXA ASSIST © {new Date().getFullYear()}</p>
      </footer>
    </Router>
  );
}

export default App;