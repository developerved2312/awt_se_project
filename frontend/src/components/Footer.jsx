import React from 'react';
import {
  Sprout,
  MapPin,
  ChevronUp,
  ShieldAlert,
  Leaf,
  Compass,
} from 'lucide-react';
import { getTranslation } from '../services/translationService';

export const Footer = ({ currentLang = 'en', onNavigate }) => {
  const t = getTranslation(currentLang);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="main-footer"
      style={{
        backgroundColor: 'var(--bg-subtle)',
        borderTop: '1px solid var(--border-medium)',
        padding: '3.5rem 0 2rem',
        marginTop: '4.5rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.2fr 1.5fr',
            gap: '2.5rem',
            marginBottom: '2.5rem',
          }}
          className="footer-grid"
        >
          {/* Brand Info & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.9rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'var(--green-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sprout size={20} color="#ffffff" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-title)' }}>
                HaritAyan <span style={{ color: 'var(--dry-leaf)', fontFamily: 'var(--font-gujarati)', fontSize: '1.05rem' }}>हरित अयन</span>
              </h3>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: 1.6, maxWidth: '420px', marginBottom: '1.1rem' }}>
              {t.footer.about}
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.78rem',
                color: 'var(--text-body)',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Leaf size={13} color="var(--green-primary)" />
                <span><strong>Harit (हरित)</strong>: Greenery & Healthy Plants</span>
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Compass size={13} color="var(--dry-leaf)" />
                <span><strong>Ayan (अयन)</strong>: Simple Path Forward</span>
              </span>
            </div>
          </div>

          {/* Core Modules List */}
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t.footer.modules}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.86rem', color: 'var(--text-body)' }}>
              <li>
                <button
                  type="button"
                  onClick={() => (onNavigate ? onNavigate('heatmap') : scrollTo('module-01'))}
                  style={{ color: 'inherit', textAlign: 'left', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--green-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                >
                  • City Heat & Tree Cooling Map
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => (onNavigate ? onNavigate('scanner') : scrollTo('module-02'))}
                  style={{ color: 'inherit', textAlign: 'left', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--green-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                >
                  • Plant Disease Scanner
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => (onNavigate ? onNavigate('mandi') : scrollTo('module-03'))}
                  style={{ color: 'inherit', textAlign: 'left', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--green-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                >
                  • Mandi Crop Prices (APMC)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => (onNavigate ? onNavigate('weather') : scrollTo('module-04'))}
                  style={{ color: 'inherit', textAlign: 'left', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--green-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                >
                  • Weather Alerts & Advisory
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-marketplace-btn"
                  onClick={() => (onNavigate ? onNavigate('marketplace') : window.scrollTo({ top: 0 }))}
                  style={{ color: 'inherit', textAlign: 'left', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--green-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                >
                  • Krishi Tools & Machinery Market
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-admin-btn"
                  onClick={() => (onNavigate ? onNavigate('admin') : window.scrollTo({ top: 0 }))}
                  style={{ color: 'inherit', textAlign: 'left', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--green-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                >
                  • Operations & Admin Telemetry Hub
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('faq-section')}
                  style={{ color: 'inherit', textAlign: 'left', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--green-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                >
                  • FAQs & Help
                </button>
              </li>
            </ul>
          </div>

          {/* Vadodara Agro & Mandi Context */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--green-primary)', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
              <MapPin size={16} />
              <span>Vadodara District Coverage</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Covering APMC mandis in Sayajigunj, Padra, Karjan, Dabhoi, and Savli. Supporting local farmers and green city initiatives across Vadodara.
            </p>
            <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--green-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Leaf size={13} color="var(--green-primary)" />
              <span>Vadodara Agriculture & Urban Greening</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-medium)',
            paddingTop: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>{t.footer.copyright}</div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--green-primary)',
              background: '#ffffff',
              border: '1px solid var(--border-medium)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 600,
            }}
          >
            <span>Back to Top</span>
            <ChevronUp size={14} />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;