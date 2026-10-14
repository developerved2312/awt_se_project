import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

export const App = () => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('haritayan_lang') || 'en';
  });

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('haritayan_lang', lang);
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
      />

      <main style={{ flex: 1 }}>
        <Home currentLang={currentLang} />
      </main>

      <Footer currentLang={currentLang} />
    </div>
  );
};

export default App;
