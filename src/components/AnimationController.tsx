import { AnimationStep } from '../utils/island';
import { MutableRefObject } from 'react';

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
    const { animationRef, setAnimationSteps, setCurrentStep, setIsPlaying, setMessage } = props;
    
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (setAnimationSteps) {
      setAnimationSteps([]);
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
    
    if (animationSteps.length === 0 || currentStep >= animationSteps.length) return;
    
    const step = animationSteps[currentStep];
    
    // 更新消息内容
    let newMessage = '';
    
    if (step.currentPosition) {
      const [row, col] = step.currentPosition;
      newMessage = `检查位置 (${row}, ${col})`;
      
      if (step.grid[row][col] === '0') {
        newMessage += ' - 水域，继续搜索';
      } else if (step.grid[row][col] === '1') {
        newMessage += ' - 发现新陆地，开始探索新岛屿';
      } else if (step.grid[row][col].startsWith('V')) {
        newMessage += ' - 已访问过的陆地，继续搜索';
      }
    } else if (step.islandCount > 0) {
      newMessage = `已发现 ${step.islandCount} 个岛屿`;
      if (currentStep === animationSteps.length - 1) {
        newMessage += ' - 搜索完成！';
      }
    } else {
      newMessage = '开始遍历网格寻找岛屿...';
    }
    
    // 添加探索方向的信息
    if (step.exploringDirection) {
      let direction = step.exploringDirection;
      newMessage += ` - 向${direction}探索`;
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