import React from 'react';
import { useTranslation } from 'react-i18next';
import './ControlPanel.css';

interface AlgorithmSelectorProps {
  algorithm: 'dfs' | 'bfs';
  onAlgorithmChange: (algorithm: 'dfs' | 'bfs') => void;
}

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  algorithm,
  onAlgorithmChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="algorithm-selector compact-selector">
      <div className="algorithm-header">
        <span className="algo-label">{t('controls.algorithm')}</span>
        <div className="radio-options">
          <label className={`tiny-radio ${algorithm === 'dfs' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="algorithm"
              checked={algorithm === 'dfs'}
              onChange={() => onAlgorithmChange('dfs')}
            />
            <span className="radio-dot"></span>
            <span className="algo-name">{t('controls.dfs')}</span>
          </label>
          
          <label className={`tiny-radio ${algorithm === 'bfs' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="algorithm"
              checked={algorithm === 'bfs'}
              onChange={() => onAlgorithmChange('bfs')}
            />
            <span className="radio-dot"></span>
            <span className="algo-name">{t('controls.bfs')}</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmSelector; 