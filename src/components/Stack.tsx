import React from 'react';
import { useTranslation } from 'react-i18next';
import './DataStructure.css';

interface StackProps {
  items: { i: number; j: number; label?: string }[];
  title?: string;
}

const Stack: React.FC<StackProps> = ({ items = [], title }) => {
  const { t } = useTranslation();
  // 确保items是一个数组，防止undefined错误
  const safeItems = Array.isArray(items) ? items : [];
  const hasItems = safeItems.length > 0;

  return (
    <div className="ds-visualizer">
      <h3>{title || t('dataStructure.stack')} {hasItems && <span className="ds-count">({safeItems.length})</span>}</h3>
      <div className={`stack-container ${hasItems ? 'has-items' : ''}`}>
        {!hasItems ? (
          <div className="empty-message">{t('dataStructure.emptyStack')}</div>
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
                    {isTop ? t('dataStructure.stackTop') : isBottom ? t('dataStructure.stackBottom') : `#${safeItems.length - index}`}
                  </span>
                </div>
              );
            })}
          </>
        )}
      </div>
      {hasItems && (
        <div className="ds-bottom">
          <span className="ds-info">{t('dataStructure.lifo')}</span>
          <span className="ds-total">{t('dataStructure.totalElements', { count: safeItems.length })}</span>
        </div>
      )}
    </div>
  );
};

export default Stack; 