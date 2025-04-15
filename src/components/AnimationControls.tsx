import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactDOM from 'react-dom';
import './AnimationControls.css';

// 创建一个使用Portal的Tooltip组件
const TooltipPortal = ({ children }: { children: React.ReactNode }) => {
  // 确保我们在浏览器环境中
  if (typeof document === 'undefined') return null;
  
  return ReactDOM.createPortal(
    children,
    document.body
  );
};

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

// 创建一个简单的Tooltip组件
const Tooltip = ({ text, style, className }: { text: string, style?: React.CSSProperties, className?: string }) => {
  return (
    <TooltipPortal>
      <div className={`tooltip ${className || ''}`} style={style}>{text}</div>
    </TooltipPortal>
  );
};

// 创建一个带Tooltip的按钮组件
const ButtonWithTooltip = ({ 
  onClick, 
  disabled,
  className,
  tooltipText,
  tooltipClassName,
  children
}: {
  onClick: () => void,
  disabled?: boolean,
  className: string,
  tooltipText: string,
  tooltipClassName?: string,
  children: React.ReactNode
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // 处理鼠标进入
  const handleMouseEnter = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // 设置位置在按钮上方
      setPosition({
        top: rect.top - 50,
        left: rect.left + (rect.width / 2)
      });
      setShowTooltip(true);
    }
  };
  
  // 渲染托管到body的tooltip
  const renderTooltip = () => {
    if (!showTooltip) return null;
    
    const style = {
      top: `${position.top}px`,
      left: `${position.left}px`,
      transform: 'translateX(-50%)'
    };
    
    return <Tooltip text={tooltipText} style={style} className={tooltipClassName} />;
  };
  
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={className}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {renderTooltip()}
    </button>
  );
};

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
  const { t } = useTranslation();
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const speedSelectRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [handlePulse, setHandlePulse] = useState(false);
  const [previousStep, setPreviousStep] = useState(currentStep);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const [showProgressTooltip, setShowProgressTooltip] = useState(false);
  const [showStepInfoTooltip, setShowStepInfoTooltip] = useState(false);
  const [showSpeedTooltip, setShowSpeedTooltip] = useState(false);
  const [showSpeedSelectTooltip, setShowSpeedSelectTooltip] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastPlayStateRef = useRef(isPlaying);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  
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
        <ButtonWithTooltip 
          onClick={onJumpToStart} 
          className="control-button" 
          tooltipText={t('animation.jumpToStart')}
          tooltipClassName="tooltip-primary"
          disabled={currentStep === 0}
        >
          ⏮
        </ButtonWithTooltip>
        
        <ButtonWithTooltip 
          onClick={onStepBackward} 
          className="control-button" 
          tooltipText={t('animation.stepBackward')}
          tooltipClassName="tooltip-primary"
          disabled={currentStep === 0}
        >
          ⏪
        </ButtonWithTooltip>
        
        <ButtonWithTooltip 
          onClick={onPlayPause} 
          className={`control-button play-button ${isPlaying ? 'playing' : ''}`} 
          tooltipText={isPlaying ? t('animation.pause') : t('animation.play')}
          tooltipClassName="tooltip-primary"
        >
          {isPlaying ? '⏸' : '▶️'}
        </ButtonWithTooltip>
        
        <ButtonWithTooltip 
          onClick={onStepForward} 
          className="control-button" 
          tooltipText={t('animation.stepForward')}
          tooltipClassName="tooltip-primary"
          disabled={currentStep === totalSteps - 1}
        >
          ⏩
        </ButtonWithTooltip>
        
        <ButtonWithTooltip 
          onClick={onJumpToEnd} 
          className="control-button" 
          tooltipText={t('animation.jumpToEnd')}
          tooltipClassName="tooltip-primary"
          disabled={currentStep === totalSteps - 1}
        >
          ⏭
        </ButtonWithTooltip>
        
        <ButtonWithTooltip 
          onClick={onReset} 
          className="control-button reset-button" 
          tooltipText={t('animation.reset')}
          tooltipClassName="tooltip-primary"
        >
          🔄
        </ButtonWithTooltip>
      </div>
      
      <div className="animation-progress">
        <div 
          className="step-info"
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltipPosition({
              top: rect.top - 40,
              left: rect.left + rect.width / 2
            });
            setShowStepInfoTooltip(true);
          }}
          onMouseLeave={() => setShowStepInfoTooltip(false)}
        >
          {currentStep + 1} / {totalSteps || 1}
          {showStepInfoTooltip && <Tooltip 
            text={t('animation.stepInfo')} 
            className="tooltip-primary"
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              transform: 'translateX(-50%)'
            }} 
          />}
        </div>
        
        <div 
          ref={progressContainerRef}
          className={`progress-container ${isDragging ? 'dragging' : ''}`}
          onClick={handleProgressClick}
          onMouseDown={handleMouseDown}
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltipPosition({
              top: rect.top - 40,
              left: rect.left + rect.width / 2
            });
            setShowProgressTooltip(true);
          }}
          onMouseLeave={() => setShowProgressTooltip(false)}
        >
          <div 
            className={`progress-fill ${showPulse ? 'pulse-effect' : ''}`}
            style={getFillStyle()}
          ></div>
          
          <div 
            className={`progress-handle ${handlePulse ? 'pulse-handle' : ''}`}
            style={{ left: `${progressPercentage}%` }}
          ></div>
          
          {showProgressTooltip && <Tooltip 
            text={t('animation.progressTooltip')} 
            className="tooltip-primary"
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              transform: 'translateX(-50%)'
            }} 
          />}
        </div>
        
        <div className="speed-control" ref={speedSelectRef}>
          <span
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltipPosition({
                top: rect.top - 40,
                left: rect.left + rect.width / 2
              });
              setShowSpeedTooltip(true);
            }}
            onMouseLeave={() => setShowSpeedTooltip(false)}
          >
            {t('animation.speed')}
            {showSpeedTooltip && <Tooltip 
              text={t('animation.speedTooltip')} 
              className="tooltip-primary"
              style={{
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`,
                transform: 'translateX(-50%)'
              }} 
            />}
          </span>
          
          <div className="custom-select-container">
            <div 
              className="custom-select-trigger" 
              onClick={toggleSpeedMenu}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPosition({
                  top: rect.top - 40,
                  left: rect.left + rect.width / 2
                });
                setShowSpeedSelectTooltip(true);
              }}
              onMouseLeave={() => setShowSpeedSelectTooltip(false)}
            >
              {getCurrentSpeedLabel()}
              <span className="custom-select-arrow"></span>
              {showSpeedSelectTooltip && <Tooltip 
                text={t('animation.speedSelectTooltip')} 
                className="tooltip-primary"
                style={{
                  top: `${tooltipPosition.top}px`,
                  left: `${tooltipPosition.left}px`,
                  transform: 'translateX(-50%)'
                }} 
              />}
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