import React from 'react';

const Legend: React.FC = () => {
  return (
    <div className="legend">
      <div className="legend-item">
        <div className="legend-color water"></div>
        <span>水域 (0)</span>
      </div>
      <div className="legend-item">
        <div className="legend-color land"></div>
        <span>陆地 (1)</span>
      </div>
      <div className="legend-item">
        <div className="legend-color visited"></div>
        <span>已访问</span>
      </div>
      <div className="legend-item">
        <div className="legend-color current"></div>
        <span>当前位置</span>
      </div>
      <div className="legend-item">
        <div className="legend-color exploring"></div>
        <span>探索方向</span>
      </div>
    </div>
  );
};

export default Legend; 