import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PlantScanner from './pages/PlantScanner';
import UserProfile from './pages/UserProfile';
import LoginPage from './pages/LoginPage';
import AuthModal from './components/AuthModal';
import Chatbot from './components/Chatbot';
import { getStoredUser, logout } from './services/authService';

export const App = () => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('haritayan_lang') || 'en';
  });
  const [activePage, setActivePage] = useState('home');
  const [currentUser, setCurrentUser] = useState(() => {
    return getStoredUser() || null;
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

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    navigateTo('login');
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
        onOpenLogin={() => navigateTo('login')}
        onLogout={handleLogout}
        onUserChange={handleUserChange}
      />

      <main style={{ flex: 1 }}>
        {activePage === 'login' && (
          <LoginPage
            currentLang={currentLang}
            onLoginSuccess={(user) => {
              handleUserChange(user);
              navigateTo('profile');
            }}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

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
            onLogout={handleLogout}
            onNavigateToScanner={() => navigateTo('scanner')}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {activePage === 'home' && (
          <Home
            currentLang={currentLang}
            onNavigateToScanner={() => navigateTo('scanner')}
            onNavigateToProfile={() => navigateTo(currentUser ? 'profile' : 'login')}
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

      {/* HaritAyan Sahayak Rule-Based Assistant Chatbot */}
      <Chatbot
        currentLang={currentLang}
        onNavigate={navigateTo}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  );
};

export default App;
