import React, { useState } from 'react';
import {
  Sprout,
  Menu,
  X,
  Compass,
  Layers,
  MapPin,
  HelpCircle,
  Camera,
} from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { getTranslation } from '../services/translationService';

export const Navbar = ({
  currentLang = 'en',
  onLanguageChange,
  activePage = 'home',
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = getTranslation(currentLang);

  const handleItemClick = (item) => {
    setMobileMenuOpen(false);
    if (item.page) {
      if (onNavigate) onNavigate(item.page);
    } else if (item.anchor) {
      if (activePage !== 'home' && onNavigate) {
        onNavigate('home');
        setTimeout(() => {
          const element = document.getElementById(item.anchor);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        const element = document.getElementById(item.anchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  };

  const navItems = [
    { id: 'nav-home', page: 'home', label: currentLang === 'gu' ? 'મુખ્ય પૃષ્ઠ' : 'Home', icon: Compass },
    { id: 'nav-scanner', page: 'scanner', label: currentLang === 'gu' ? 'AI વિઝન સ્કેનર' : 'AI Plant Scanner', icon: Camera },
    { id: 'nav-modules', anchor: 'modules-section', label: currentLang === 'gu' ? '૪ મોડ્યુલ્સ' : 'Core Modules', icon: Layers },
    { id: 'nav-vadodara', anchor: 'vadodara-context', label: currentLang === 'gu' ? 'વડોદરા એગ્રો-ગ્રીડ' : 'Vadodara Focus', icon: MapPin },
    { id: 'nav-faq', anchor: 'faq-section', label: currentLang === 'gu' ? 'પ્રશ્નોત્તરી (FAQ)' : 'General FAQs', icon: HelpCircle },
  ];

  return (
    <header
      id="main-navbar"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(251, 249, 245, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 2px 10px rgba(35, 45, 40, 0.03)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => {
            if (onNavigate) onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          id="nav-brand-logo"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--green-primary) 0%, var(--green-deep) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(45, 106, 79, 0.2)',
            }}
          >
            <Sprout size={22} color="#ffffff" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: 'var(--text-title)',
                  letterSpacing: '-0.02em',
                }}
              >
                {t.nav.brand}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--dry-leaf-dark)',
                  background: 'var(--dry-leaf-soft)',
                  border: '1px solid var(--dry-leaf-border)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-gujarati)',
                  fontWeight: 600,
                }}
              >
                {t.nav.subBrand}
              </span>
            </div>
            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Smart Agriculture & Plant Intelligence
            </span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav
          id="desktop-nav-links"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
          className="desktop-only"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.page && activePage === item.page;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                type="button"
                onClick={() => handleItemClick(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 0.95rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--green-deep)' : 'var(--text-body)',
                  backgroundColor: isActive ? 'var(--bg-tint-green)' : 'transparent',
                  border: isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--green-deep)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-tint-green)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-body)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <Icon size={16} color="var(--green-primary)" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions & Language Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {/* Quick Action Button to Scanner */}
          <button
            type="button"
            id="nav-quick-scan-btn"
            onClick={() => onNavigate && onNavigate('scanner')}
            className="btn btn-primary desktop-only"
            style={{
              padding: '0.45rem 0.95rem',
              fontSize: '0.84rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Camera size={15} />
            <span>{currentLang === 'gu' ? 'AI સ્કેનર' : 'AI Scanner'}</span>
          </button>

          <LanguageSelector currentLang={currentLang} onLanguageChange={onLanguageChange} />

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            id="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              padding: '6px',
              borderRadius: '8px',
              background: '#ffffff',
              color: 'var(--text-title)',
              border: '1px solid var(--border-medium)',
            }}
            className="mobile-toggle"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-dropdown"
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--border-subtle)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.page && activePage === item.page;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--green-deep)' : 'var(--text-title)',
                  backgroundColor: isActive ? 'var(--green-wash)' : 'var(--bg-tint-green)',
                  border: isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
                  textAlign: 'left',
                }}
              >
                <Icon size={17} color="var(--green-primary)" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;