import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PlantScanner from './pages/PlantScanner';

export const App = () => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('haritayan_lang') || 'en';
  });
  const [activePage, setActivePage] = useState('home');

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('haritayan_lang', lang);
  };

  const navigateTo = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      id="haritayan-app-root"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        activePage={activePage}
        onNavigate={navigateTo}
      />

      <main style={{ flex: 1 }}>
        {activePage === 'scanner' ? (
          <PlantScanner
            currentLang={currentLang}
            onNavigateHome={() => navigateTo('home')}
          />
        ) : (
          <Home
            currentLang={currentLang}
            onNavigateToScanner={() => navigateTo('scanner')}
          />
        )}
      </main>

      <Footer
        currentLang={currentLang}
        onNavigate={navigateTo}
      />
    </div>
  );
};

export default App;
