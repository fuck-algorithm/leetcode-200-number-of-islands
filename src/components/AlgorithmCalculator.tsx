import { 
  Grid, 
  AnimationStep,
  numIslandsWithAnimation, 
  numIslandsWithAnimationBFS 
} from '../utils/island';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

export interface AlgorithmCalculatorProps {
  grid: Grid;
  algorithm: 'dfs' | 'bfs';
  setIslandCount: (count: number) => void;
  setAnimationSteps: (steps: AnimationStep[]) => void;
  setCurrentStep: (step: number) => void;
  setMessage: (message: string) => void;
}

const AlgorithmCalculator = {
  // 计算岛屿数量和动画步骤
  calculateIslandCount: (props: AlgorithmCalculatorProps) => {
    const { 
      grid, 
      algorithm, 
      setIslandCount, 
      setAnimationSteps, 
      setCurrentStep, 
      setMessage 
    } = props;
    
    // 根据当前算法类型选择不同的遍历函数
    const steps = algorithm === 'dfs' 
      ? numIslandsWithAnimation(grid)
      : numIslandsWithAnimationBFS(grid);
      
    const count = steps.length > 0 ? steps[steps.length - 1].islandCount : 0;
    
    setIslandCount(count);
    setAnimationSteps(steps);
    setCurrentStep(0);
    setMessage(i18next.t('animation.startingSearch'));
    
    return { count, steps };
  }
};

export default AlgorithmCalculator; 