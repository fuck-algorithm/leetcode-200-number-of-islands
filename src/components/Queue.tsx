import React from 'react';
import { Position } from '../utils/island';

interface QueueProps {
  items: Position[];
}

const Queue: React.FC<QueueProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="ds-visualizer">
        <h3>队列 (Queue)</h3>
        <div className="queue-container">
          <div className="empty-message">空队列</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-visualizer">
      <h3>队列 (Queue)</h3>
      <div className="queue-container has-items">
        {/* 队列的可视化（先进先出）- 从上到下显示 */}
        {items.map((pos, index) => (
          <div key={index} className="queue-item">
            ({pos.i}, {pos.j})
            {index === 0 && <div className="item-label">队头</div>}
            {index === items.length - 1 && <div className="item-label">队尾</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Queue; 