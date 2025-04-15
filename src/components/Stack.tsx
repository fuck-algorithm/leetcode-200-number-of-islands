import React from 'react';
import './DataStructure.css';

interface StackProps {
  items: { i: number; j: number; label?: string }[];
  title?: string;
}

const Stack: React.FC<StackProps> = ({ items = [], title = '栈' }) => {
  // 确保items是一个数组，防止undefined错误
  const safeItems = Array.isArray(items) ? items : [];
  const hasItems = safeItems.length > 0;

  return (
    <div className="ds-visualizer">
      <h3>{title} {hasItems && <span className="ds-count">({safeItems.length})</span>}</h3>
      <div className={`stack-container ${hasItems ? 'has-items' : ''}`}>
        {!hasItems ? (
          <div className="empty-message">栈为空</div>
        ) : (
          <>
            {safeItems.slice().reverse().map((item, index) => {
              const isTop = index === 0;
              const isBottom = index === safeItems.length - 1;
              const { i, j } = item || { i: 0, j: 0 }; // 从i和j属性获取坐标
              
              return (
                <div 
                  key={`${i}-${j}-${index}`} 
                  className={`stack-item ${isTop ? 'stack-top' : ''} ${isBottom ? 'stack-bottom' : ''}`}
                  data-index={safeItems.length - index}
                >
                  <div className="item-position">[{i}, {j}]</div>
                  {item.label && <div className="item-custom-label">{item.label}</div>}
                  <span className="item-label">
                    {isTop ? '栈顶' : isBottom ? '栈底' : `#${safeItems.length - index}`}
                  </span>
                </div>
              );
            })}
          </>
        )}
      </div>
      {hasItems && (
        <div className="ds-bottom">
          <span className="ds-info">LIFO - 后进先出</span>
          <span className="ds-total">共 {safeItems.length} 个元素</span>
        </div>
      )}
    </div>
  );
};

export default Stack; 