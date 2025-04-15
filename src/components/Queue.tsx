import React from 'react';
import './DataStructure.css';

interface QueueProps {
  items: { i: number; j: number; label?: string }[];
  title?: string;
}

const Queue: React.FC<QueueProps> = ({ items = [], title = '队列' }) => {
  // 确保items是一个数组，防止undefined错误
  const safeItems = Array.isArray(items) ? items : [];
  const hasItems = safeItems.length > 0;

  return (
    <div className="ds-visualizer">
      <h3>{title} {hasItems && <span className="ds-count">({safeItems.length})</span>}</h3>
      <div className={`queue-container ${hasItems ? 'has-items' : ''}`}>
        {!hasItems ? (
          <div className="empty-message">队列为空</div>
        ) : (
          <>
            {safeItems.map((item, index) => {
              const isFront = index === 0;
              const isBack = index === safeItems.length - 1;
              const { i, j } = item || { i: 0, j: 0 }; // 从i和j属性获取坐标
              
              return (
                <div 
                  key={`${i}-${j}-${index}`} 
                  className={`queue-item ${isFront ? 'queue-front' : ''} ${isBack ? 'queue-back' : ''}`}
                  data-index={index + 1}
                >
                  <div className="item-position">[{i}, {j}]</div>
                  {item.label && <div className="item-custom-label">{item.label}</div>}
                  <span className="item-label">
                    {isFront ? '队首' : isBack ? '队尾' : `#${index + 1}`}
                  </span>
                </div>
              );
            })}
          </>
        )}
      </div>
      {hasItems && (
        <div className="ds-bottom">
          <span className="ds-info">FIFO - 先进先出</span>
          <span className="ds-total">共 {safeItems.length} 个元素</span>
        </div>
      )}
    </div>
  );
};

export default Queue; 