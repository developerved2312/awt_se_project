import React, { useState, useRef, useEffect } from 'react';
import {
  Sprout,
  Menu,
  X,
  Compass,
  Layers,
  MapPin,
  HelpCircle,
  Camera,
  ChevronDown,
  Flame,
  BarChart3,
  Shield,
  CheckCircle2,
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
  const [moduleDropdownOpen, setModuleDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const t = getTranslation(currentLang);
  const isGu = currentLang === 'gu';

  // Close module dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setModuleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item) => {
    setMobileMenuOpen(false);
    setModuleDropdownOpen(false);
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

  const handleSelectModule = (module) => {
    setModuleDropdownOpen(false);
    setMobileMenuOpen(false);
    if (module.page && onNavigate) {
      onNavigate(module.page);
    } else if (module.anchor) {
      if (activePage !== 'home' && onNavigate) {
        onNavigate('home');
        setTimeout(() => {
          const element = document.getElementById(module.anchor);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        const element = document.getElementById(module.anchor);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Modules definition: Module 2 is active, other 3 are upcoming
  const modulesList = [
    {
      id: 'module-02',
      page: 'scanner',
      num: '02',
      title: isGu ? 'જેમિની AI વિઝન સ્કેનર' : 'Gemini AI Vision Scanner',
      subtitle: isGu ? 'પાક રોગ નિદાન અને જૈવિક-વૈજ્ઞાનિક ઉપાયો' : 'Crop Disease Diagnostics & Organic Remedies',
      icon: Camera,
      status: 'active',
      statusText: isGu ? 'સક્રિય' : 'Available',
    },
    {
      id: 'module-01',
      page: null,
      anchor: 'modules-section',
      num: '01',
      title: isGu ? 'અર્બન હીટ કૂલિંગ સિમ્યુલેટર' : 'Urban Heat Mitigation & Simulator',
      subtitle: isGu ? 'વડોદરા વોર્ડ તાપમાન અને વૃક્ષારોપણ' : 'Vadodara Heat Island & Canopy Modeling',
      icon: Flame,
      status: 'upcoming',
      statusText: isGu ? 'ફેઝ ૧' : 'Phase 1',
    },
    {
      id: 'module-03',
      page: null,
      anchor: 'modules-section',
      num: '03',
      title: isGu ? 'લાઈવ APMC મંડી ભાવ એન્જિન' : 'Real-Time APMC Mandi Engine',
      subtitle: isGu ? 'સયાજીગંજ, પાદરા અને કરજણ બજાર ભાવ' : 'Sayajigunj, Padra & Karjan Tickers',
      icon: BarChart3,
      status: 'upcoming',
      statusText: isGu ? 'ફેઝ ૩' : 'Phase 3',
    },
    {
      id: 'module-04',
      page: null,
      anchor: 'modules-section',
      num: '04',
      title: isGu ? 'ઓપરેશન્સ અને હવામાન ચેતવણી' : 'Operations & Advisory Panel',
      subtitle: isGu ? 'IMD હીટવેવ સલાહ અને સિસ્ટમ ટેલિમેટ્રી' : 'IMD Heatwave Alerts & Control Hub',
      icon: Shield,
      status: 'upcoming',
      statusText: isGu ? 'ફેઝ ૪' : 'Phase 4',
    },
  ];

  return (
    <header
      id="main-navbar"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(251, 249, 245, 0.94)',
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
            gap: '0.45rem',
          }}
          className="desktop-only"
        >
          {/* Home Link */}
          <button
            type="button"
            onClick={() => handleItemClick({ page: 'home' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.95rem',
              fontSize: '0.88rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              color: activePage === 'home' ? 'var(--green-deep)' : 'var(--text-body)',
              backgroundColor: activePage === 'home' ? 'var(--bg-tint-green)' : 'transparent',
              border: activePage === 'home' ? '1px solid var(--border-medium)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Compass size={16} color="var(--green-primary)" />
            <span>{isGu ? 'મુખ્ય પૃષ્ઠ' : 'Home'}</span>
          </button>

          {/* Unified "Select Module" Dropdown Menu */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              type="button"
              id="nav-module-dropdown-btn"
              onClick={() => setModuleDropdownOpen(!moduleDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.95rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)',
                color: activePage === 'scanner' ? 'var(--green-deep)' : 'var(--text-title)',
                backgroundColor: activePage === 'scanner' ? 'var(--bg-tint-green)' : '#ffffff',
                border: '1.5px solid var(--border-medium)',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {activePage === 'scanner' ? (
                <Camera size={16} color="var(--green-primary)" />
              ) : (
                <Layers size={16} color="var(--green-primary)" />
              )}
              <span>
                {activePage === 'scanner'
                  ? isGu
                    ? 'મોડ્યુલ ૦૨: AI વિઝન સ્કેનર'
                    : 'Module 02: Vision Scanner'
                  : isGu
                  ? 'મોડ્યુલ્સ પસંદ કરો'
                  : 'Select Module'}
              </span>
              <ChevronDown
                size={15}
                style={{
                  transition: 'transform 0.2s ease',
                  transform: moduleDropdownOpen ? 'rotate(180deg)' : 'none',
                  color: 'var(--text-muted)',
                }}
              />
            </button>

            {/* Dropdown Card */}
            {moduleDropdownOpen && (
              <div className="module-dropdown-menu">
                <div
                  style={{
                    padding: '0.45rem 0.75rem 0.65rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: '0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {isGu ? 'હરિત અયન મોડ્યુલ્સ' : 'HaritAyan Modules Grid'}
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: 'var(--bg-tint-green)',
                      color: 'var(--green-primary)',
                      fontWeight: 700,
                    }}
                  >
                    1 Active
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {modulesList.map((mod) => {
                    const ModIcon = mod.icon;
                    const isActiveModule = mod.status === 'active';
                    const isSelected = mod.page && activePage === mod.page;

                    return (
                      <div
                        key={mod.id}
                        onClick={() => handleSelectModule(mod)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.65rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isSelected
                            ? 'var(--bg-tint-green)'
                            : 'transparent',
                          border: isSelected
                            ? '1px solid var(--green-light)'
                            : '1px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = 'var(--bg-tint-green)';
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = 'transparent';
                          }
                        }}
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: isActiveModule ? 'var(--green-wash)' : 'var(--bg-subtle)',
                            color: isActiveModule ? 'var(--green-primary)' : 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <ModIcon size={16} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                            <span
                              style={{
                                fontSize: '0.86rem',
                                fontWeight: 700,
                                color: isSelected ? 'var(--green-deep)' : 'var(--text-title)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {mod.title}
                            </span>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                padding: '1px 5px',
                                borderRadius: '3px',
                                flexShrink: 0,
                                backgroundColor: isActiveModule ? '#dcfce7' : '#f3efe6',
                                color: isActiveModule ? '#166534' : 'var(--text-muted)',
                              }}
                            >
                              {mod.statusText}
                            </span>
                          </div>
                          <p
                            style={{
                              fontSize: '0.74rem',
                              color: 'var(--text-muted)',
                              margin: 0,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {mod.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Vadodara Agro-Grid Link */}
          <button
            type="button"
            onClick={() => handleItemClick({ anchor: 'vadodara-context' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.85rem',
              fontSize: '0.88rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-body)',
              backgroundColor: 'transparent',
              border: '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--green-deep)';
              e.currentTarget.style.backgroundColor = 'var(--bg-tint-green)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-body)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <MapPin size={16} color="var(--green-primary)" />
            <span>{isGu ? 'વડોદરા એગ્રો-ગ્રીડ' : 'Vadodara Focus'}</span>
          </button>

          {/* FAQs Link */}
          <button
            type="button"
            onClick={() => handleItemClick({ anchor: 'faq-section' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.85rem',
              fontSize: '0.88rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-body)',
              backgroundColor: 'transparent',
              border: '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--green-deep)';
              e.currentTarget.style.backgroundColor = 'var(--bg-tint-green)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-body)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <HelpCircle size={16} color="var(--green-primary)" />
            <span>{isGu ? 'પ્રશ્નોત્તરી (FAQ)' : 'General FAQs'}</span>
          </button>
        </nav>

        {/* Actions & Language Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
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
            padding: '1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <button
            type="button"
            onClick={() => handleItemClick({ page: 'home' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.95rem',
              fontSize: '0.92rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
              color: activePage === 'home' ? 'var(--green-deep)' : 'var(--text-title)',
              backgroundColor: activePage === 'home' ? 'var(--green-wash)' : 'var(--bg-tint-green)',
              border: 'none',
              textAlign: 'left',
            }}
          >
            <Compass size={17} color="var(--green-primary)" />
            <span>{isGu ? 'મુખ્ય પૃષ્ઠ' : 'Home'}</span>
          </button>

          {/* Mobile Modules Section */}
          <div
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
                display: 'block',
                marginBottom: '0.45rem',
              }}
            >
              {isGu ? 'મોડ્યુલ્સ પસંદ કરો:' : 'Select Module:'}
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {modulesList.map((mod) => {
                const ModIcon = mod.icon;
                const isSelected = mod.page && activePage === mod.page;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => handleSelectModule(mod)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? '#dcfce7' : '#ffffff',
                      border: isSelected ? '1px solid var(--green-light)' : '1px solid var(--border-subtle)',
                      textAlign: 'left',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      color: 'var(--text-title)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ModIcon size={15} color={mod.status === 'active' ? 'var(--green-primary)' : 'var(--text-muted)'} />
                      <span>{mod.title}</span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '1px 5px',
                        borderRadius: '3px',
                        backgroundColor: mod.status === 'active' ? '#bbf7d0' : '#f3efe6',
                        color: mod.status === 'active' ? '#166534' : 'var(--text-muted)',
                      }}
                    >
                      {mod.statusText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleItemClick({ anchor: 'vadodara-context' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.95rem',
              fontSize: '0.92rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-title)',
              backgroundColor: 'var(--bg-tint-green)',
              border: 'none',
              textAlign: 'left',
            }}
          >
            <MapPin size={17} color="var(--green-primary)" />
            <span>{isGu ? 'વડોદરા એગ્રો-ગ્રીડ' : 'Vadodara Focus'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleItemClick({ anchor: 'faq-section' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.95rem',
              fontSize: '0.92rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-title)',
              backgroundColor: 'var(--bg-tint-green)',
              border: 'none',
              textAlign: 'left',
            }}
          >
            <HelpCircle size={17} color="var(--green-primary)" />
            <span>{isGu ? 'પ્રશ્નોત્તરી (FAQ)' : 'General FAQs'}</span>
          </button>
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