import React from 'react';

export const StatCard = ({ title, value, subtext, icon: Icon, color = 'primary', badgeText }) => {
  const colorMap = {
    primary: { bg: 'var(--primary-100)', text: 'var(--primary-700)' },
    accent: { bg: '#fef3c7', text: '#b45309' },
    success: { bg: '#dcfce7', text: '#15803d' },
    warning: { bg: '#ffedd5', text: '#c2410c' },
    danger: { bg: '#fee2e2', text: '#b91c1c' }
  };

  const currentTheme = colorMap[color] || colorMap.primary;

  return (
    <div className="stat-card">
      {Icon && (
        <div className="stat-icon-wrapper" style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}>
          <Icon size={24} />
        </div>
      )}
      <div className="stat-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="stat-label">{title}</span>
          {badgeText && <span className="badge badge-neutral">{badgeText}</span>}
        </div>
        <div className="stat-value">{value}</div>
        {subtext && <div className="stat-subtext">{subtext}</div>}
      </div>
    </div>
  );
};

export const Card = ({ title, action, children, style }) => {
  return (
    <div className="seu-card" style={style}>
      {(title || action) && (
        <div className="seu-card-header">
          {title && <div className="seu-card-title">{title}</div>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default StatCard;
