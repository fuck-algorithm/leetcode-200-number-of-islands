import { AnimationStep } from '../utils/island';
import { MutableRefObject } from 'react';
import i18next from 'i18next';

export interface AnimationControllerProps {
  animationSteps: AnimationStep[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  animationRef: MutableRefObject<number | null>;
  setMessage: (message: string) => void;
  setAnimationSteps?: (steps: AnimationStep[]) => void;
}

const AnimationController = {
  // 动画控制：重置
  resetAnimation: (props: AnimationControllerProps) => {
    const { animationRef, setIsPlaying, setCurrentStep, setMessage } = props;
    
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    setCurrentStep(0);
    setIsPlaying(false);
    setMessage('');
  },
  
  // 动画控制：播放/暂停
  togglePlayPause: (props: AnimationControllerProps) => {
    const { setIsPlaying, isPlaying } = props;
    setIsPlaying(!isPlaying);
  },
  
  // 动画控制：前进一步
  stepForward: (props: AnimationControllerProps) => {
    const { currentStep, animationSteps, setCurrentStep, setIsPlaying } = props;
    
    if (currentStep < animationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsPlaying(false);
    }
  },
  
  // 动画控制：后退一步
  stepBackward: (props: AnimationControllerProps) => {
    const { currentStep, setCurrentStep } = props;
    
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  },
  
  // 动画控制：跳转到开始
  jumpToStart: (props: AnimationControllerProps) => {
    const { setCurrentStep } = props;
    setCurrentStep(0);
  },
  
  // 动画控制：跳转到结束
  jumpToEnd: (props: AnimationControllerProps) => {
    const { animationSteps, setCurrentStep, setIsPlaying } = props;
    
    setCurrentStep(animationSteps.length - 1);
    setIsPlaying(false);
  },
  
  // 更新消息
  updateMessage: (props: AnimationControllerProps) => {
    const { animationSteps, currentStep, setMessage } = props;
    const t = i18next.t.bind(i18next);
    
    if (animationSteps.length === 0 || currentStep >= animationSteps.length) return;
    
    const step = animationSteps[currentStep];
    
    // 更新消息内容
    let newMessage = '';
    
    if (step.currentPosition) {
      const [row, col] = step.currentPosition;
      newMessage = t('animation.checkingPosition', { row, col });
      
      if (step.grid[row][col] === '0') {
        newMessage += t('animation.isWater');
      } else if (step.grid[row][col] === '1') {
        newMessage += t('animation.isNewLand');
      } else if (step.grid[row][col].startsWith('V')) {
        newMessage += t('animation.isVisitedLand');
      }
    } else if (step.islandCount > 0) {
      newMessage = t('animation.islandsFound', { count: step.islandCount });
      if (currentStep === animationSteps.length - 1) {
        newMessage += t('animation.searchComplete');
      }
    } else {
      newMessage = t('animation.startingSearch');
    }
    
    // 添加探索方向的信息
    if (step.exploringDirection) {
      let direction = step.exploringDirection;
      newMessage += t('animation.exploring', { direction });
    }
    
    setMessage(newMessage);
    return newMessage;
  },
  
  // 获取当前动画步骤
  getCurrentAnimationStep: (props: AnimationControllerProps) => {
    const { animationSteps, currentStep } = props;
    
    if (animationSteps.length > 0 && currentStep < animationSteps.length) {
      return animationSteps[currentStep];
    }
    return null;
  }
};

export default AnimationController; 