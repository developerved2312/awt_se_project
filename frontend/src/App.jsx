import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PlantScanner from './pages/PlantScanner';
import UserProfile from './pages/UserProfile';
import AuthModal from './components/AuthModal';
import { getStoredUser, MOCK_DEMO_USERS } from './services/authService';

export const App = () => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('haritayan_lang') || 'en';
  });
  const [activePage, setActivePage] = useState('home');
  const [currentUser, setCurrentUser] = useState(() => {
    return getStoredUser() || MOCK_DEMO_USERS[0]; // Defaults to Ramesh Patel (Cotton Farmer)
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('haritayan_lang', lang);
  };

  const navigateTo = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserChange = (newUser) => {
    setCurrentUser(newUser);
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
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onUserChange={handleUserChange}
      />

      <main style={{ flex: 1 }}>
        {activePage === 'scanner' && (
          <PlantScanner
            currentLang={currentLang}
            currentUser={currentUser}
            onNavigateHome={() => navigateTo('home')}
            onNavigateProfile={() => navigateTo('profile')}
          />
        )}

        {activePage === 'profile' && (
          <UserProfile
            currentLang={currentLang}
            currentUser={currentUser}
            onUserChange={handleUserChange}
            onNavigateToScanner={() => navigateTo('scanner')}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {activePage === 'home' && (
          <Home
            currentLang={currentLang}
            onNavigateToScanner={() => navigateTo('scanner')}
            onNavigateToProfile={() => navigateTo('profile')}
          />
        )}
      </main>

      <Footer
        currentLang={currentLang}
        onNavigate={navigateTo}
      />

      {/* Auth & 1-Click Demo Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          handleUserChange(user);
          navigateTo('profile');
        }}
        currentLang={currentLang}
      />
    </div>
  );
};

export default App;
