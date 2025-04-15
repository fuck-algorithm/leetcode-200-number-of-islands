import React from 'react';
import { useTranslation } from 'react-i18next';
import './ControlPanel.css';

interface ResultDisplayProps {
  islandCount: number | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ islandCount }) => {
  const { t } = useTranslation();
  
  if (islandCount === null) {
    return null;
  }
  
  return (
    <div className="result">
      {t('results.islands', { count: islandCount })}
    </div>
  );
};

export default ResultDisplay; 