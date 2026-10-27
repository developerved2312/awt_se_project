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
  Activity,
  UserCheck,
  User,
  Sparkles,
  LogOut,
  LogIn,
  Edit3,
  Droplets,
  Wrench,
  Server,
} from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { getTranslation } from '../services/translationService';

export const Navbar = ({
  currentLang = 'en',
  onLanguageChange,
  activePage = 'home',
  onNavigate,
  currentUser,
  onOpenAuth,
  onUserChange,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moduleDropdownOpen, setModuleDropdownOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileMenuRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const t = getTranslation(currentLang);
  const isGu = currentLang === 'gu';

  const handleMouseEnterModules = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setModuleDropdownOpen(true);
  };

  const handleMouseLeaveModules = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setModuleDropdownOpen(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

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

  // Platform modules specification (simple, clear, natural wording)
  const modulesList = [
    {
      id: 'module-plant-pathology',
      page: 'scanner',
      title: isGu ? 'પાક રોગ સ્કેનર' : 'Plant Disease Scanner',
      subtitle: isGu ? 'પાનનો ફોટો પાડીને રોગ અને ઉપાયો જાણો' : 'Scan leaf photo to find crop disease & remedies',
      icon: Activity,
      status: 'active',
      statusText: isGu ? 'ઉપલબ્ધ' : 'Active',
    },
    {
      id: 'module-urban-heat',
      page: 'heatmap',
      anchor: null,
      title: isGu ? 'શહેરની ગરમી અને વૃક્ષારોપણ નકશો' : 'City Heat & Tree Cooling Map',
      subtitle: isGu ? 'વડોદરાના વિસ્તારો અને વૃક્ષોથી તાપમાન ઘટાડો' : 'Vadodara heat zones and tree cooling benefits',
      icon: Flame,
      status: 'active',
      statusText: isGu ? 'લાઈવ' : 'Live',
    },
    {
      id: 'module-apmc-mandi',
      page: 'mandi',
      anchor: null,
      title: isGu ? 'APMC મંડી બજાર ભાવ' : 'APMC Mandi Market Prices',
      subtitle: isGu ? 'વડોદરા જિલ્લાની મંડીઓના રોજના તાજા ભાવ' : 'Daily market rates across Vadodara district mandis',
      icon: BarChart3,
      status: 'active',
      statusText: isGu ? 'લાઈવ' : 'Live',
    },
    {
      id: 'module-irrigation-timer',
      page: 'irrigation',
      anchor: null,
      title: isGu ? 'સ્માર્ટ સિંચાઈ ટાઈમર' : 'Smart Irrigation Timer',
      subtitle: isGu ? 'પાક, જમીન અને વીજળી શેડ્યૂલ મુજબ પાણી ગણતરી' : 'Precision root-zone moisture timer and power roster',
      icon: Droplets,
      status: 'active',
      statusText: isGu ? 'લાઈવ' : 'Live',
    },
    {
      id: 'module-weather-advisory',
      page: 'weather',
      anchor: null,
      title: isGu ? 'હવામાન આગાહી અને સલાહ' : 'Weather Alerts & Advisory',
      subtitle: isGu ? 'ગરમીની ચેતવણી અને ખેડૂતો માટે જરૂરી સૂચનાઓ' : 'Agro-weather observations & heatwave notices',
      icon: Shield,
      status: 'active',
      statusText: isGu ? 'લાઈવ' : 'Live',
    },
    {
      id: 'module-equipment-marketplace',
      page: 'marketplace',
      anchor: null,
      title: isGu ? 'કૃષિ ઓજાર & સાધન બજાર' : 'Krishi Tools Marketplace',
      subtitle: isGu ? 'સાધન ભાડા & i-ખેડૂત ૪૦-૬૦% સબસિડી' : 'Farm machinery rental & i-Khedut subsidies',
      icon: Wrench,
      status: 'active',
      statusText: isGu ? 'સબસિડી' : 'Subsidy',
    },
  ];

  return (
    <header
      id="main-navbar"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(251, 249, 245, 0.96)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 6px rgba(27, 40, 32, 0.04)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '68px',
        }}
      >
        {/* Institutional Brand Identity */}
        <div
          onClick={() => {
            if (onNavigate) onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          id="nav-brand-logo"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'linear-gradient(145deg, var(--green-primary) 0%, var(--green-deep) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(27, 67, 50, 0.18)',
            }}
          >
            <Sprout size={20} color="#ffffff" strokeWidth={2.2} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--text-title)',
                  letterSpacing: '-0.02em',
                }}
              >
                HaritAyan
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--dry-leaf-dark)',
                  background: 'var(--dry-leaf-soft)',
                  border: '1px solid var(--dry-leaf-border)',
                  padding: '1px 6px',
                  borderRadius: '3px',
                  fontFamily: 'var(--font-gujarati)',
                  fontWeight: 600,
                }}
              >
                {t.nav.subBrand}
              </span>
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              {isGu ? 'સ્માર્ટ ખેતી અને પર્યાવરણ માર્ગદર્શિકા' : 'Smart Agriculture & Green City Platform'}
            </span>
          </div>
        </div>

        {/* Desktop Navigation - Normal Navbar with Uniform Hover */}
        <nav
          id="desktop-nav-links"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
          className="desktop-only"
        >
          {/* Home Link */}
          <button
            type="button"
            onClick={() => handleItemClick({ page: 'home' })}
            className={`nav-link-item ${activePage === 'home' ? 'active' : ''}`}
          >
            <Compass size={15} color="var(--green-primary)" />
            <span>{isGu ? 'મુખ્ય પૃષ્ઠ' : 'Home'}</span>
          </button>

          {/* Formal "Modules" Dropdown with Smooth Hover */}
          <div
            className="nav-dropdown-wrapper"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnterModules}
            onMouseLeave={handleMouseLeaveModules}
          >
            <button
              type="button"
              id="nav-module-dropdown-btn"
              onClick={() => setModuleDropdownOpen(!moduleDropdownOpen)}
              className={`nav-link-item ${activePage === 'scanner' || activePage === 'mandi' ? 'active' : ''} ${moduleDropdownOpen ? 'open' : ''}`}
              aria-haspopup="true"
              aria-expanded={moduleDropdownOpen}
            >
              <Layers size={15} color="var(--green-primary)" />
              <span>
                {activePage === 'scanner'
                  ? isGu
                    ? 'પાક સ્કેનર'
                    : 'Plant Scanner'
                  : activePage === 'mandi'
                  ? isGu
                    ? 'APMC મંડી ભાવ'
                    : 'APMC Mandi'
                  : isGu
                    ? 'મોડ્યુલ્સ'
                    : 'Modules'}
              </span>
              <ChevronDown
                size={14}
                style={{
                  transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: moduleDropdownOpen ? 'rotate(180deg)' : 'none',
                  color: 'var(--text-muted)',
                }}
              />
            </button>

            {/* Dropdown Card */}
            {moduleDropdownOpen && (
              <div
                className="module-dropdown-menu"
                style={{
                  width: '370px',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 10px 30px rgba(27, 40, 32, 0.1)',
                  padding: '0.5rem',
                }}
              >
                <div
                  style={{
                    padding: '0.4rem 0.65rem 0.5rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: '0.35rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {isGu ? 'પ્લેટફોર્મ સેવાઓ' : 'Platform Features'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {modulesList.map((mod) => {
                    const ModIcon = mod.icon;
                    const isActive = mod.status === 'active';
                    const isSelected = mod.page && activePage === mod.page;

                    return (
                      <div
                        key={mod.id}
                        onClick={() => handleSelectModule(mod)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.7rem',
                          padding: '0.65rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isSelected ? 'var(--bg-tint-green)' : 'transparent',
                          border: isSelected ? '1px solid var(--border-medium)' : '1px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = 'var(--bg-tint-green)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            backgroundColor: isActive ? 'var(--green-wash)' : '#f2efe9',
                            color: isActive ? 'var(--green-primary)' : 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <ModIcon size={16} strokeWidth={2} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem' }}>
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
                                fontWeight: 600,
                                padding: '1px 5px',
                                borderRadius: '3px',
                                flexShrink: 0,
                                backgroundColor: isActive ? '#e8f5e9' : '#f0ece3',
                                color: isActive ? '#1b5e20' : 'var(--text-muted)',
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

          {/* Regional Context Link */}
          <button
            type="button"
            onClick={() => handleItemClick({ anchor: 'vadodara-context' })}
            className="nav-link-item"
          >
            <MapPin size={15} color="var(--green-primary)" />
            <span>{isGu ? 'વડોદરા ગાઇડ' : 'Vadodara Guide'}</span>
          </button>

          {/* FAQs Link */}
          <button
            type="button"
            onClick={() => handleItemClick({ anchor: 'faq-section' })}
            className="nav-link-item"
          >
            <HelpCircle size={15} color="var(--green-primary)" />
            <span>{isGu ? 'પ્રશ્નોત્તરી અને મદદ' : 'FAQs & Help'}</span>
          </button>

          {/* Tools & Equipment Marketplace Link */}
          <button
            type="button"
            id="nav-marketplace-link"
            onClick={() => handleItemClick({ page: 'marketplace' })}
            className={`nav-link-item ${activePage === 'marketplace' ? 'active' : ''}`}
            style={{
              fontWeight: 700,
              backgroundColor: activePage === 'marketplace' ? 'var(--green-wash)' : 'transparent',
              color: activePage === 'marketplace' ? 'var(--green-deep)' : 'var(--text-title)',
            }}
          >
            <Wrench size={15} color="var(--green-primary)" />
            <span>{isGu ? 'ઓજાર બજાર' : 'Tools Market'}</span>
          </button>

          {/* Farmer / Officer / Admin Desk Link */}
          <button
            type="button"
            id="nav-profile-link"
            onClick={() => {
              if (currentUser?.role === 'admin') {
                handleItemClick({ page: 'admin' });
              } else {
                handleItemClick({ page: 'profile' });
              }
            }}
            className={`nav-link-item ${activePage === 'profile' || (currentUser?.role === 'admin' && activePage === 'admin') ? 'active' : ''}`}
            style={{
              fontWeight: 700,
              backgroundColor: (activePage === 'profile' || (currentUser?.role === 'admin' && activePage === 'admin')) ? 'var(--green-wash)' : 'transparent',
              color: (activePage === 'profile' || (currentUser?.role === 'admin' && activePage === 'admin')) ? 'var(--green-deep)' : 'var(--text-title)',
            }}
          >
            {currentUser?.role === 'admin' ? (
              <Shield size={15} color="var(--green-primary)" />
            ) : currentUser?.role === 'officer' ? (
              <Shield size={15} color="var(--green-primary)" />
            ) : (
              <Sprout size={15} color="var(--green-primary)" />
            )}
            <span>
              {currentUser?.role === 'admin'
                ? isGu
                  ? 'એડમિન કન્સોલ'
                  : 'Admin Console'
                : currentUser?.role === 'officer'
                ? isGu
                  ? 'અધિકારી ડેસ્ક'
                  : 'Officer Desk'
                : isGu
                ? 'કૃષિ સલાહ ડેસ્ક'
                : 'Farmer Desk'}
            </span>
          </button>
        </nav>

        {/* Actions & Language Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
          }}
        >
          {currentUser ? (
            <>
              {/* User Profile Chip with Dropdown */}
              <div style={{ position: 'relative' }} ref={profileMenuRef}>
                <div
                  id="nav-profile-chip-btn"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  title="Profile Menu & Account Actions"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    backgroundColor: (currentUser.role === 'admin' || currentUser.role === 'officer') ? '#d8f3dc' : '#f0f5ea',
                    border: (currentUser.role === 'admin' || currentUser.role === 'officer') ? '1.5px solid var(--green-primary)' : '1px solid var(--border-medium)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>
                    {currentUser.role === 'admin' ? '🛡️' : currentUser.role === 'officer' ? '🌾' : '👨‍🌾'}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        color: 'var(--text-title)',
                        lineHeight: 1.1,
                      }}
                    >
                      {currentUser.name?.split(' ')?.[0] || 'User'}
                    </span>
                    <span
                      style={{
                        fontSize: '0.64rem',
                        color: (currentUser.role === 'admin' || currentUser.role === 'officer') ? 'var(--green-deep)' : 'var(--text-muted)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'officer' ? 'Officer' : 'Farmer'}
                    </span>
                  </div>
                  <ChevronDown
                    size={13}
                    style={{
                      color: 'var(--text-muted)',
                      transform: profileMenuOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </div>

                {/* Profile Actions Dropdown Menu */}
                {profileMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '260px',
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid var(--border-medium)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                      padding: '0.65rem',
                      zIndex: 1000,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                    }}
                  >
                    <div style={{ padding: '0.5rem 0.65rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.25rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-title)' }}>
                        {currentUser.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {currentUser.email}
                      </div>
                    </div>

                    {/* Edit Details Action */}
                    <button
                      type="button"
                      id="nav-dropdown-edit-btn"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        if (onNavigate) onNavigate('profile');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: 'var(--bg-tint-green)',
                        color: 'var(--green-deep)',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                      }}
                    >
                      <Edit3 size={15} color="var(--green-primary)" />
                      <span>{isGu ? 'વિગતો સુધારો (Edit Details)' : 'Edit Details / Profile'}</span>
                    </button>

                    {/* Admin Telemetry Hub Action - Only for Admin */}
                    {currentUser?.role === 'admin' && (
                      <button
                        type="button"
                        id="nav-dropdown-admin-btn"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          if (onNavigate) onNavigate('admin');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.6rem 0.75rem',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: '#d8f3dc',
                          color: 'var(--green-deep)',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%',
                        }}
                      >
                        <Server size={15} color="var(--green-primary)" />
                        <span>{isGu ? 'એડમિન કન્સોલ (Admin Console)' : 'Admin Operations Console'}</span>
                      </button>
                    )}

                    {/* Logout Action */}
                    <button
                      type="button"
                      id="nav-dropdown-logout-btn"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        if (onLogout) onLogout();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #fecaca',
                        backgroundColor: '#fff5f5',
                        color: '#c81e1e',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                      }}
                    >
                      <LogOut size={15} color="#c81e1e" />
                      <span>{isGu ? 'લૉગ આઉટ (Log Out)' : 'Log Out'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Direct Quick Logout Button */}
              <button
                type="button"
                id="nav-logout-btn"
                onClick={onLogout}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid #f8b4b4',
                  backgroundColor: '#fff5f5',
                  color: '#c81e1e',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.15s ease',
                }}
                title="Sign out of account"
              >
                <LogOut size={13} />
                <span>{isGu ? 'લૉગ આઉટ' : 'Logout'}</span>
              </button>
            </>
          ) : (
            <>
              {/* Standalone Sign In Button */}
              <button
                type="button"
                id="nav-login-btn"
                onClick={() => {
                  if (onNavigate) onNavigate('login');
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--green-primary)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 2px 8px rgba(45,106,79,0.22)',
                }}
              >
                <LogIn size={14} />
                <span>{isGu ? 'પ્રવેશ કરો (Login)' : 'Sign In'}</span>
              </button>
            </>
          )}

          <LanguageSelector currentLang={currentLang} onLanguageChange={onLanguageChange} />

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            id="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              padding: '6px',
              borderRadius: '6px',
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
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
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
              padding: '0.65rem 0.85rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              color: activePage === 'home' ? 'var(--green-deep)' : 'var(--text-title)',
              backgroundColor: activePage === 'home' ? 'var(--green-wash)' : 'var(--bg-tint-green)',
              border: 'none',
              textAlign: 'left',
            }}
          >
            <Compass size={16} color="var(--green-primary)" />
            <span>{isGu ? 'મુખ્ય પૃષ્ઠ' : 'Home'}</span>
          </button>

          {/* Mobile Modules Listing */}
          <div
            style={{
              padding: '0.65rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
                display: 'block',
                marginBottom: '0.45rem',
              }}
            >
              {isGu ? 'પ્લેટફોર્મ સેવાઓ:' : 'Platform Modules:'}
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
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
                      padding: '0.5rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? '#e8f5e9' : '#ffffff',
                      border: isSelected ? '1px solid var(--border-medium)' : '1px solid var(--border-subtle)',
                      textAlign: 'left',
                      fontSize: '0.84rem',
                      fontWeight: 600,
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
                        fontWeight: 600,
                        padding: '1px 5px',
                        borderRadius: '3px',
                        backgroundColor: mod.status === 'active' ? '#c8e6c9' : '#f0ece3',
                        color: mod.status === 'active' ? '#1b5e20' : 'var(--text-muted)',
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
              padding: '0.65rem 0.85rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-title)',
              backgroundColor: 'var(--bg-tint-green)',
              border: 'none',
              textAlign: 'left',
            }}
          >
            <MapPin size={16} color="var(--green-primary)" />
            <span>{isGu ? 'વડોદરા એગ્રો-ગ્રીડ' : 'Vadodara Agro-Grid'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleItemClick({ anchor: 'faq-section' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.85rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-title)',
              backgroundColor: 'var(--bg-tint-green)',
              border: 'none',
              textAlign: 'left',
            }}
          >
            <HelpCircle size={16} color="var(--green-primary)" />
            <span>{isGu ? 'પ્રશ્નોત્તરી (FAQ)' : 'General FAQs'}</span>
          </button>

          {currentUser && (
            <button
              type="button"
              onClick={() => handleItemClick({ page: 'profile' })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                color: activePage === 'profile' ? 'var(--green-deep)' : 'var(--text-title)',
                backgroundColor: activePage === 'profile' ? 'var(--green-wash)' : '#eef6ec',
                border: 'none',
                textAlign: 'left',
              }}
            >
              {currentUser?.role === 'officer' ? (
                <Shield size={16} color="var(--green-primary)" />
              ) : (
                <Sprout size={16} color="var(--green-primary)" />
              )}
              <span>
                {currentUser?.name || (isGu ? 'ખેડૂત પ્રોફાઇલ (Profile)' : 'My Profile')}
              </span>
            </button>
          )}

          {currentUser && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigate) onNavigate('profile');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                color: 'var(--green-deep)',
                backgroundColor: 'var(--bg-tint-green)',
                border: '1px solid var(--border-medium)',
                textAlign: 'left',
              }}
            >
              <Edit3 size={16} color="var(--green-primary)" />
              <span>{isGu ? 'વિગતો સુધારો (Edit Details)' : 'Edit Profile Details'}</span>
            </button>
          )}

          {currentUser ? (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onLogout) onLogout();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                color: '#c81e1e',
                backgroundColor: '#fff5f5',
                border: '1px solid #f8b4b4',
                textAlign: 'left',
              }}
            >
              <LogOut size={16} />
              <span>{isGu ? 'લૉગ આઉટ કરો (Logout)' : 'Sign Out / Logout'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigate) onNavigate('login');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff',
                backgroundColor: 'var(--green-primary)',
                border: 'none',
                textAlign: 'left',
              }}
            >
              <LogIn size={16} />
              <span>{isGu ? 'પ્રવેશ કરો (Sign In)' : 'Sign In to HaritAyan'}</span>
            </button>
          )}
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