import React from 'react';

export const MetricCard = ({ title, value, subtitle, icon: Icon, color = '#06b6d4' }) => {
  return (
    <div className="glass-panel glow-card metric-card-responsive">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </p>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: `${color}20`,
          border: `1px solid ${color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          flexShrink: 0
        }}>
          {Icon && <Icon size={16} />}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
        <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.85rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
          {value}
        </h2>
        {subtitle && (
          <span style={{ fontSize: 11.5, color: 'var(--text-dim)', wordBreak: 'break-word' }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
