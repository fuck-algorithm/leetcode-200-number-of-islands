import React from 'react';
import { useTranslation } from 'react-i18next';
import './DataStructure.css';

interface QueueProps {
  items: { i: number; j: number; label?: string }[];
  title?: string;
}

const Queue: React.FC<QueueProps> = ({ items = [], title }) => {
  const { t } = useTranslation();
  // 确保items是一个数组，防止undefined错误
  const safeItems = Array.isArray(items) ? items : [];
  const hasItems = safeItems.length > 0;

  return (
    <div className="ds-visualizer">
      <h3>{title || t('dataStructure.queue')} {hasItems && <span className="ds-count">({safeItems.length})</span>}</h3>
      <div className={`queue-container ${hasItems ? 'has-items' : ''}`}>
        {!hasItems ? (
          <div className="empty-message">{t('dataStructure.emptyQueue')}</div>
        ) : (
          <div className="queue-items-container">
            {safeItems.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === safeItems.length - 1;
              const { i, j } = item || { i: 0, j: 0 }; // 从i和j属性获取坐标
              
              return (
                <div 
                  key={`${i}-${j}-${index}`} 
                  className={`queue-item ${isFirst ? 'queue-front' : ''} ${isLast ? 'queue-back' : ''}`}
                  data-index={index + 1}
                >
                  <div className="item-position">[{i}, {j}]</div>
                  {item.label && <div className="item-custom-label">{item.label}</div>}
                  <span className="item-label">
                    {isFirst ? t('dataStructure.queueFront') : isLast ? t('dataStructure.queueBack') : `#${index + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {hasItems && (
        <div className="ds-bottom">
          <span className="ds-info">{t('dataStructure.fifo')}</span>
          <span className="ds-total">{t('dataStructure.totalElements', { count: safeItems.length })}</span>
        </div>
      )}
    </div>
  );
};

export default Queue; 