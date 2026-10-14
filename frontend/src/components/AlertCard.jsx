import React from 'react';
import { AlertCircle } from 'lucide-react';

export const AlertCard = ({
  title,
  message,
  badgeText,
  id = 'alert-card',
}) => {
  return (
    <div
      id={id}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.9rem',
        padding: '0.95rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--dry-leaf-soft)',
        border: '1px solid var(--dry-leaf-border)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '1.75rem',
      }}
    >
      <div style={{ color: 'var(--dry-leaf-dark)', flexShrink: 0, marginTop: '2px' }}>
        <AlertCircle size={19} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--dry-leaf-dark)' }}>{title}</h4>
          {badgeText && (
            <span
              style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '99px',
                background: '#ffffff',
                color: 'var(--dry-leaf-dark)',
                fontWeight: 700,
                border: '1px solid var(--dry-leaf-border)',
              }}
            >
              {badgeText}
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.86rem', color: '#593b22', margin: 0, lineHeight: 1.5 }}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default AlertCard;