import React from 'react';
import './ControlPanel.css';

interface AlgorithmSelectorProps {
  algorithm: 'dfs' | 'bfs';
  onAlgorithmChange: (algorithm: 'dfs' | 'bfs') => void;
}

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  algorithm,
  onAlgorithmChange
}) => {
  return (
    <div className="algorithm-selector compact-selector">
      <div className="algorithm-header">
        <span className="algo-label">算法:</span>
        <div className="radio-options">
          <label className={`tiny-radio ${algorithm === 'dfs' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="algorithm"
              checked={algorithm === 'dfs'}
              onChange={() => onAlgorithmChange('dfs')}
            />
            <span className="radio-dot"></span>
            <span className="algo-name">深度优先 (DFS)</span>
          </label>
          
          <label className={`tiny-radio ${algorithm === 'bfs' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="algorithm"
              checked={algorithm === 'bfs'}
              onChange={() => onAlgorithmChange('bfs')}
            />
            <span className="radio-dot"></span>
            <span className="algo-name">广度优先 (BFS)</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmSelector; 