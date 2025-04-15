import React from 'react';
import { useTranslation } from 'react-i18next';
import './GridVisualizer.css';
import { Grid, AnimationStep } from '../utils/island';
import IslandGrid from './IslandGrid';
import Stack from './Stack';
import Queue from './Queue';

interface GridVisualizerProps {
  grid: Grid;
  animationSteps: AnimationStep[];
  currentStep: number;
  algorithm: 'dfs' | 'bfs';
  message: string;
}

const GridVisualizer: React.FC<GridVisualizerProps> = ({
  grid,
  animationSteps,
  currentStep,
  algorithm,
  message
}) => {
  const { t } = useTranslation();

  // 获取当前显示的网格
  const getCurrentDisplayGrid = (): Grid => {
    if (animationSteps.length > 0 && currentStep < animationSteps.length) {
      return animationSteps[currentStep].grid;
    }
    return grid;
  };

  // 获取当前动画步骤
  const getCurrentAnimationStep = () => {
    if (animationSteps.length > 0 && currentStep < animationSteps.length) {
      return animationSteps[currentStep];
    }
    return null;
  };

  // 获取当前位置
  const getCurrentPosition = (): [number, number] | undefined => {
    const step = getCurrentAnimationStep();
    return step?.currentPosition;
  };

  // 获取当前探索方向
  const getExploringDirection = (): string | undefined => {
    const step = getCurrentAnimationStep();
    return step?.exploringDirection;
  };

  return (
    <div className="visualization-container">
      {/* 消息框，显示在网格上方 */}
      {animationSteps.length > 0 && currentStep < animationSteps.length && (
        <div className="message-box top-message">
          {t('results.message', { message: message || '点击"网格生成随机数据"按钮开始演示算法过程' })}
        </div>
      )}
      <div className="grid-with-ds-container">
        <div className="island-grid-container">
          {animationSteps.length > 0 && currentStep < animationSteps.length ? (
            <IslandGrid 
              grid={getCurrentDisplayGrid()} 
              currentPosition={getCurrentPosition()}
              exploringDirection={getExploringDirection()}
              showAnimation={true}
            />
          ) : (
            <IslandGrid grid={grid} />
          )}
        </div>
        
        {animationSteps.length > 0 && currentStep < animationSteps.length && (
          algorithm === 'dfs' ? 
            <Stack items={animationSteps[currentStep].stack || []} /> : 
            <Queue items={animationSteps[currentStep].queue || []} />
        )}
      </div>
    </div>
  );
};

export default GridVisualizer; 