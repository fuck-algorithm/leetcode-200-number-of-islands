import React from 'react';
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
  return (
    <div className="grid-controls">
      <div className="control-group">
        <label>
          行数:
          <input
            type="number"
            min="2"
            max="50"
            value={rows}
            onChange={(e) => onRowsChange(parseInt(e.target.value) || 5)}
          />
        </label>
        <label>
          列数:
          <input
            type="number"
            min="2"
            max="50"
            value={cols}
            onChange={(e) => onColsChange(parseInt(e.target.value) || 5)}
          />
        </label>
      </div>
      
      <div className="control-group">
        <label>
          陆地概率:
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={landProbability}
            onChange={(e) => onLandProbabilityChange(parseFloat(e.target.value))}
          />
          {(landProbability * 100).toFixed(0)}%
        </label>
      </div>
      
      <div className="control-group">
        <button onClick={onGenerateRandomGrid}>生成随机网格</button>
        <button onClick={onExample1}>示例1</button>
        <button onClick={onExample2}>示例2</button>
      </div>
    </div>
  );
};

export default GridControls; 