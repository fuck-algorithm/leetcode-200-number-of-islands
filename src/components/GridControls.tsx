import React from 'react';
import { useTranslation } from 'react-i18next';
import './ControlPanel.css';

interface GridControlsProps {
  rows: number;
  cols: number;
  landProbability: number;
  onRowsChange: (rows: number) => void;
  onColsChange: (cols: number) => void;
  onLandProbabilityChange: (prob: number) => void;
  onGenerateRandomGrid: () => void;
  onExample1: () => void;
  onExample2: () => void;
}

const GridControls: React.FC<GridControlsProps> = ({
  rows,
  cols,
  landProbability,
  onRowsChange,
  onColsChange,
  onLandProbabilityChange,
  onGenerateRandomGrid,
  onExample1,
  onExample2
}) => {
  const { t } = useTranslation();

  // 生成指定范围内的随机整数
  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // 生成随机正方形网格（行列数相等）并立即生成随机网格
  const generateRandomSize = () => {
    const randomSize = getRandomInt(5, 15); // 5到15之间的随机整数，避免太大造成性能问题
    // 设置相同的行列数
    onRowsChange(randomSize);
    onColsChange(randomSize);
    
    // 立即生成随机网格
    setTimeout(() => onGenerateRandomGrid(), 0);
  };
  
  return (
    <div className="grid-controls">
      <div className="control-group size-control-group">
        <div className="size-controls-row">
          <div className="compact-size-inputs">
            <span>{t('controls.rows')}</span>
            <input
              type="number"
              min="2"
              max="30"
              value={rows}
              onChange={(e) => {
                const newRows = parseInt(e.target.value) || 5;
                onRowsChange(newRows);
              }}
            />
            <span>{t('controls.cols')}</span>
            <input
              type="number"
              min="2"
              max="30"
              value={cols}
              onChange={(e) => {
                const newCols = parseInt(e.target.value) || 5;
                onColsChange(newCols);
              }}
            />
            <button 
              className="dice-button" 
              title={t('controls.generateRandom')} 
              onClick={generateRandomSize}
            >
              🎲
            </button>
          </div>
        </div>
      </div>
      
      <div className="control-group">
        <div className="probability-label">
          {t('controls.landProbability')} {(landProbability * 100).toFixed(1)}%
        </div>
        <div className="probability-slider-container">
          <input
            className="probability-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={landProbability}
            onChange={(e) => onLandProbabilityChange(parseFloat(e.target.value))}
          />
          <div 
            className="probability-slider-fill" 
            style={{width: `${landProbability * 100}%`}}
          ></div>
        </div>
      </div>
      
      <div className="control-group">
        <button onClick={onGenerateRandomGrid}>{t('controls.generateRandom')}</button>
        <button onClick={onExample1}>{t('controls.example1')}</button>
        <button onClick={onExample2}>{t('controls.example2')}</button>
      </div>
    </div>
  );
};

export default GridControls; 