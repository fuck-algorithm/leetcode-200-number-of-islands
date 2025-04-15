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
    <div className="control-group">
      <label>
        <input
          type="radio"
          name="algorithm"
          checked={algorithm === 'dfs'}
          onChange={() => onAlgorithmChange('dfs')}
        />
        深度优先搜索 (DFS)
      </label>
      <label>
        <input
          type="radio"
          name="algorithm"
          checked={algorithm === 'bfs'}
          onChange={() => onAlgorithmChange('bfs')}
        />
        广度优先搜索 (BFS)
      </label>
    </div>
  );
};

export default AlgorithmSelector; 