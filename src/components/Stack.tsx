import React from 'react';
import './DataStructure.css';
import { Position } from '../utils/island';

interface StackProps {
  items: Position[];
}

const Stack: React.FC<StackProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="ds-visualizer">
        <h3>栈 (Stack)</h3>
        <div className="stack-container">
          <div className="empty-message">空栈</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-visualizer">
      <h3>栈 (Stack)</h3>
      <div className="stack-container has-items">
        {/* 栈的可视化（后进先出）- 倒序显示，栈顶在上方 */}
        {[...items].reverse().map((pos, index) => (
          <div key={index} className="stack-item">
            ({pos.i}, {pos.j})
            {index === 0 && <div className="item-label">栈顶</div>}
          </div>
        ))}
        <div className="ds-bottom">栈底</div>
      </div>
    </div>
  );
};

export default Stack; 