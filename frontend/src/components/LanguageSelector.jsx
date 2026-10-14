import React from 'react';
import { Globe } from 'lucide-react';

export const LanguageSelector = ({ currentLang, onLanguageChange }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#ffffff',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-full)',
        padding: '3px 4px',
        gap: '2px',
        boxShadow: 'var(--shadow-sm)',
      }}
      id="language-selector"
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 6px', color: 'var(--green-primary)' }}>
        <Globe size={14} />
      </div>

      <button
        type="button"
        id="lang-btn-en"
        onClick={() => onLanguageChange('en')}
        style={{
          padding: '4px 10px',
          fontSize: '0.76rem',
          fontWeight: '700',
          borderRadius: 'var(--radius-full)',
          background: currentLang === 'en' ? 'var(--green-primary)' : 'transparent',
          color: currentLang === 'en' ? '#ffffff' : 'var(--text-muted)',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        EN
      </button>

      <button
        type="button"
        id="lang-btn-gu"
        onClick={() => onLanguageChange('gu')}
        style={{
          padding: '4px 10px',
          fontSize: '0.76rem',
          fontWeight: '700',
          borderRadius: 'var(--radius-full)',
          background: currentLang === 'gu' ? 'var(--green-primary)' : 'transparent',
          color: currentLang === 'gu' ? '#ffffff' : 'var(--text-muted)',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-gujarati)',
          transition: 'all 0.15s ease',
        }}
      >
        ગુજરાતી
      </button>
    </div>
  );
};

export default LanguageSelector;