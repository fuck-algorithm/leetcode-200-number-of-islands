import React, { useEffect } from 'react';

interface AnimationControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onJumpToStart: () => void;
  onJumpToEnd: () => void;
  onSpeedChange: (speed: number) => void;
  currentSpeed: number;
  currentStep: number;
  totalSteps: number;
  onSliderChange: (step: number) => void;
}

const AnimationControls: React.FC<AnimationControlsProps> = ({
  isPlaying,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onReset,
  onJumpToStart,
  onJumpToEnd,
  onSpeedChange,
  currentSpeed,
  currentStep,
  totalSteps,
  onSliderChange
}) => {
  // 处理键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          onStepBackward();
          break;
        case 'ArrowRight':
          onStepForward();
          break;
        case ' ':
          e.preventDefault(); // 防止空格键滚动页面
          onPlayPause();
          break;
        case 'r':
        case 'R':
          onReset();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStepBackward, onStepForward, onPlayPause, onReset]);

  return (
    <div className="animation-controls-footer">
      <div className="control-buttons">
        <button onClick={onJumpToStart} className="control-button" title="跳到开始">⏮</button>
        <button onClick={onStepBackward} className="control-button" title="上一步">
          <span>←</span>
        </button>
        <button onClick={onPlayPause} className="control-button play-button" title="播放/暂停">
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button onClick={onStepForward} className="control-button" title="下一步">
          <span>→</span>
        </button>
        <button onClick={onJumpToEnd} className="control-button" title="跳到结束">⏭</button>
        <button onClick={onReset} className="control-button reset-button" title="重置">R</button>
      </div>
      
      <div className="animation-progress">
        <div className="step-info">
          {currentStep + 1} / {totalSteps || 1}
        </div>
        <input
          type="range"
          min="0"
          max={Math.max(0, (totalSteps || 1) - 1)}
          value={currentStep}
          onChange={(e) => onSliderChange(parseInt(e.target.value))}
          className="progress-slider"
        />
        <div className="speed-control">
          <label>
            速度:
            <select 
              className="speed-select"
              value={currentSpeed}
              onChange={(e) => onSpeedChange(parseInt(e.target.value))}
            >
              <option value="1000">慢</option>
              <option value="500">中</option>
              <option value="250">快</option>
              <option value="100">极快</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AnimationControls; 