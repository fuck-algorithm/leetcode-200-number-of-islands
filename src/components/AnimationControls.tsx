import React, { useEffect, useRef, useState } from 'react';

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
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [handlePulse, setHandlePulse] = useState(false);
  const [previousStep, setPreviousStep] = useState(currentStep);
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

  // 获取步骤标记的位置
  const getStepMarkers = () => {
    if (totalSteps <= 1) return [];
    
    // 限制标记的数量，以避免视觉拥挤
    const maxMarkers = Math.min(totalSteps, 50);
    const interval = totalSteps > maxMarkers ? Math.ceil(totalSteps / maxMarkers) : 1;
    
    const markers = [];
    for (let i = 0; i < totalSteps; i += interval) {
      const percentage = ((i / (totalSteps - 1)) * 100);
      markers.push({
        position: percentage,
        isCompleted: i <= currentStep,
        step: i,
      });
    }
    
    // 确保最后一个步骤有标记
    if (totalSteps > 1 && markers[markers.length - 1].step !== totalSteps - 1) {
      markers.push({
        position: 100,
        isCompleted: totalSteps - 1 <= currentStep,
        step: totalSteps - 1,
      });
    }
    
    return markers;
  };

  // 处理点击步骤标记
  const handleStepMarkerClick = (e: React.MouseEvent, step: number) => {
    e.stopPropagation();
    onSliderChange(step);
  };

  // 渲染步骤标记
  const stepMarkers = getStepMarkers();

  return (
    <div className="animation-controls-footer">
      <div className="control-buttons">
        <button 
          onClick={onJumpToStart} 
          className="control-button" 
          title="跳到开始 (Home)"
          disabled={currentStep === 0}
        >⏮</button>
        <button 
          onClick={onStepBackward} 
          className="control-button" 
          title="上一步 (←)"
          disabled={currentStep === 0}
        >
          <span>←</span>
        </button>
        <button 
          onClick={onPlayPause} 
          className={`control-button play-button ${isPlaying ? 'playing' : ''}`} 
          title="播放/暂停 (空格)"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button 
          onClick={onStepForward} 
          className="control-button" 
          title="下一步 (→)"
          disabled={currentStep === totalSteps - 1}
        >
          <span>→</span>
        </button>
        <button 
          onClick={onJumpToEnd} 
          className="control-button" 
          title="跳到结束 (End)"
          disabled={currentStep === totalSteps - 1}
        >⏭</button>
        <button 
          onClick={onReset} 
          className="control-button reset-button" 
          title="重置 (R)"
        >R</button>
      </div>
      
      <div className="animation-progress">
        <div className="step-info">
          {currentStep + 1} / {totalSteps || 1}
        </div>
        
        <div 
          ref={progressContainerRef}
          className={`progress-container ${isDragging ? 'dragging' : ''}`}
          onClick={handleProgressClick}
          onMouseDown={handleMouseDown}
        >
          <div 
            className={`progress-fill ${showPulse ? 'pulse-effect' : ''}`}
            style={getFillStyle()}
          ></div>
          
          {stepMarkers.map((marker, index) => (
            <div 
              key={index}
              className={`step-marker ${marker.isCompleted ? 'completed' : ''}`}
              style={{ left: `${marker.position}%` }}
              onClick={(e) => handleStepMarkerClick(e, marker.step)}
              title={`步骤 ${marker.step + 1}`}
            ></div>
          ))}
          
          <div 
            className={`progress-handle ${handlePulse ? 'pulse-handle' : ''}`}
            style={{ left: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="speed-control">
          <span>速度:</span>
          <select 
            className="speed-select"
            value={currentSpeed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
            <option value="3">3x</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AnimationControls; 