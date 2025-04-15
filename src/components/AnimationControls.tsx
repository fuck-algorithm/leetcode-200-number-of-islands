import React, { useEffect, useRef, useState } from 'react';
import './AnimationControls.css';

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

// 定义速度选项
const speedOptions = [
  { value: 0.5, label: '0.5x' },
  { value: 1, label: '1x' },
  { value: 1.5, label: '1.5x' },
  { value: 2, label: '2x' },
  { value: 3, label: '3x' }
];

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
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const speedSelectRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [handlePulse, setHandlePulse] = useState(false);
  const [previousStep, setPreviousStep] = useState(currentStep);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastPlayStateRef = useRef(isPlaying);
  
  // 处理键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        onPlayPause();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onStepForward();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onStepBackward();
      } else if (e.key === 'r') {
        e.preventDefault();
        onReset();
      } else if (e.key === 'Home') {
        e.preventDefault();
        onJumpToStart();
      } else if (e.key === 'End') {
        e.preventDefault();
        onJumpToEnd();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayPause, onStepForward, onStepBackward, onReset, onJumpToStart, onJumpToEnd]);
  
  // 处理点击外部关闭速度菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (speedSelectRef.current && !speedSelectRef.current.contains(event.target as Node)) {
        setIsSpeedMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 播放状态变更时触发脉冲效果
  useEffect(() => {
    if (isPlaying !== lastPlayStateRef.current) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 500);
      lastPlayStateRef.current = isPlaying;
      return () => clearTimeout(timer);
    }
  }, [isPlaying]);
  
  // 步骤变更时触发脉冲效果
  useEffect(() => {
    if (currentStep !== previousStep) {
      setHandlePulse(true);
      setPreviousStep(currentStep);
      const timer = setTimeout(() => setHandlePulse(false), 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, previousStep]);
  
  // 动画效果 - 播放中的进度条动画
  useEffect(() => {
    if (isPlaying && progressContainerRef.current) {
      const fillElement = progressContainerRef.current.querySelector('.progress-fill') as HTMLElement;
      if (fillElement) {
        fillElement.classList.add('playing');
        const animationDuration = `${5 / (currentSpeed || 1)}s`;
        fillElement.style.animationDuration = animationDuration;
      }
    } else if (progressContainerRef.current) {
      const fillElement = progressContainerRef.current.querySelector('.progress-fill') as HTMLElement;
      if (fillElement) {
        fillElement.classList.remove('playing');
      }
    }
  }, [isPlaying, currentSpeed]);
  
  // 计算进度百分比
  const progressPercentage = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;
  
  // 处理拖动进度条
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressContainerRef.current) return;
    
    const rect = progressContainerRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newStep = Math.round(percentage * (totalSteps - 1));
    onSliderChange(newStep);
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressClick(e);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!progressContainerRef.current || !isDragging) return;
    
    const rect = progressContainerRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newStep = Math.round(percentage * (totalSteps - 1));
    onSliderChange(newStep);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // 根据动画速度计算填充样式
  const getFillStyle = () => {
    return {
      width: `${progressPercentage}%`,
    };
  };
  
  // 找到当前速度对应的标签文本
  const getCurrentSpeedLabel = () => {
    const option = speedOptions.find(opt => opt.value === currentSpeed);
    return option ? option.label : '1x';
  };
  
  // 切换速度菜单的开关状态
  const toggleSpeedMenu = () => {
    setIsSpeedMenuOpen(!isSpeedMenuOpen);
  };
  
  // 处理速度选择
  const handleSpeedSelect = (value: number) => {
    onSpeedChange(value);
    setIsSpeedMenuOpen(false);
  };

  return (
    <div className="animation-controls-footer">
      <div className="control-buttons">
        <button 
          onClick={onJumpToStart} 
          className="control-button" 
          title="跳到开始 (快捷键: Home) - 跳转到动画的第一步"
          disabled={currentStep === 0}
        >⏮</button>
        <button 
          onClick={onStepBackward} 
          className="control-button" 
          title="上一步 (快捷键: ←左方向键) - 回到前一步动画"
          disabled={currentStep === 0}
        >
          <span>←</span>
        </button>
        <button 
          onClick={onPlayPause} 
          className={`control-button play-button ${isPlaying ? 'playing' : ''}`} 
          title={isPlaying ? "暂停 (快捷键: 空格键) - 暂停自动播放" : "播放 (快捷键: 空格键) - 开始自动播放动画"}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button 
          onClick={onStepForward} 
          className="control-button" 
          title="下一步 (快捷键: →右方向键) - 前进到下一步动画"
          disabled={currentStep === totalSteps - 1}
        >
          <span>→</span>
        </button>
        <button 
          onClick={onJumpToEnd} 
          className="control-button" 
          title="跳到结束 (快捷键: End) - 跳转到动画的最后一步"
          disabled={currentStep === totalSteps - 1}
        >⏭</button>
        <button 
          onClick={onReset} 
          className="control-button reset-button" 
          title="重置 (快捷键: R键) - 将动画重置到初始状态，清除所有动画步骤"
        >R</button>
      </div>
      
      <div className="animation-progress">
        <div className="step-info" title="当前步数 / 总步数">
          {currentStep + 1} / {totalSteps || 1}
        </div>
        
        <div 
          ref={progressContainerRef}
          className={`progress-container ${isDragging ? 'dragging' : ''}`}
          onClick={handleProgressClick}
          onMouseDown={handleMouseDown}
          title="动画进度条 - 拖动以跳转到特定步骤"
        >
          <div 
            className={`progress-fill ${showPulse ? 'pulse-effect' : ''}`}
            style={getFillStyle()}
          ></div>
          
          <div 
            className={`progress-handle ${handlePulse ? 'pulse-handle' : ''}`}
            style={{ left: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="speed-control" ref={speedSelectRef}>
          <span title="设置动画播放速度">速度:</span>
          <div className="custom-select-container">
            <div 
              className="custom-select-trigger" 
              onClick={toggleSpeedMenu}
              title="点击更改动画播放速度"
            >
              {getCurrentSpeedLabel()}
              <span className="custom-select-arrow"></span>
            </div>
            
            {isSpeedMenuOpen && (
              <div className="custom-select-options">
                {speedOptions.map(option => (
                  <div 
                    key={option.value} 
                    className={`custom-select-option ${option.value === currentSpeed ? 'selected' : ''}`} 
                    onClick={() => handleSpeedSelect(option.value)}
                    title={`将播放速度设置为${option.label}`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 保留原始选择框作为隐藏的后备方案 */}
          <select 
            className="speed-select visually-hidden"
            value={currentSpeed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            aria-hidden="true"
          >
            {speedOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AnimationControls;