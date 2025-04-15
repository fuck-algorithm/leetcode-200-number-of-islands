import React from 'react';
import { useTranslation } from 'react-i18next';
import './Legend.css';

const Legend: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="legend">
      <div className="legend-item">
        <div className="legend-color water"></div>
        <span>{t('legend.water')} (0)</span>
      </div>
      <div className="legend-item">
        <div className="legend-color land"></div>
        <span>{t('legend.land')} (1)</span>
      </div>
      <div className="legend-item">
        <div className="legend-color visited"></div>
        <div className="legend-text">
          <span>{t('legend.visited')}</span>
          <span className="legend-sub-text">{t('legend.visitedSubText')}</span>
        </div>
      </div>
      <div className="legend-item">
        <div className="legend-color current"></div>
        <span>{t('legend.current')}</span>
      </div>
      <div className="legend-item">
        <div className="legend-color exploring"></div>
        <span>{t('legend.exploring')}</span>
      </div>
    </div>
  );
};

export default Legend; 