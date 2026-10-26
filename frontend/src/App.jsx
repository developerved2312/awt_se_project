import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PlantScanner from './pages/PlantScanner';
import UserProfile from './pages/UserProfile';
import LoginPage from './pages/LoginPage';
import MandiPrices from './pages/MandiPrices';
import HeatMap from './pages/HeatMap';
import IrrigationTimer from './pages/IrrigationTimer';
import Weather from './pages/Weather';
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

  const [redirectAfterLogin, setRedirectAfterLogin] = useState('scanner');
  const [loginPromptReason, setLoginPromptReason] = useState('');

  const navigateTo = (page, reason = '', overrideUser = undefined) => {
    const activeUser = overrideUser !== undefined ? overrideUser : (currentUser || getStoredUser());
    // If trying to access scanner or profile without being logged in, prompt login
    if ((page === 'scanner' || page === 'profile') && !activeUser) {
      setRedirectAfterLogin(page);
      setLoginPromptReason(page);
      setActivePage('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoginPromptReason(reason);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserChange = (newUser) => {
    setCurrentUser(newUser);
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setRedirectAfterLogin('scanner');
    setLoginPromptReason('');
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
            loginPromptReason={loginPromptReason}
            onLoginSuccess={(user) => {
              handleUserChange(user);
              const target = redirectAfterLogin || 'scanner';
              setRedirectAfterLogin('scanner');
              setLoginPromptReason('');
              navigateTo(target, '', user);
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
            onNavigate={navigateTo}
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

        {activePage === 'mandi' && (
          <MandiPrices
            currentLang={currentLang}
            onNavigateHome={() => navigateTo('home')}
            onNavigateScanner={() => navigateTo('scanner')}
          />
        )}

        {activePage === 'heatmap' && (
          <HeatMap
            currentLang={currentLang}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {activePage === 'irrigation' && (
          <IrrigationTimer
            currentLang={currentLang}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {activePage === 'weather' && (
          <Weather
            currentLang={currentLang}
            onNavigateHome={() => navigateTo('home')}
            onNavigateToHeatMap={() => navigateTo('heatmap')}
            onNavigateToIrrigation={() => navigateTo('irrigation')}
          />
        )}

        {activePage === 'home' && (
          <Home
            currentLang={currentLang}
            onNavigateToScanner={() => navigateTo('scanner')}
            onNavigateToMandi={() => navigateTo('mandi')}
            onNavigateToHeatMap={() => navigateTo('heatmap')}
            onNavigateToIrrigation={() => navigateTo('irrigation')}
            onNavigateToWeather={() => navigateTo('weather')}
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
