import { useState, useEffect, useRef } from 'react'
import './App.css'
import AnimationControls from './components/AnimationControls'
import ControlPanel from './components/ControlPanel'
import GridVisualizer from './components/GridVisualizer'
import { Grid, AnimationStep } from './utils/island'
import GridGenerator from './components/GridGenerator'
import CustomGridProcessor from './components/CustomGridProcessor'
import AnimationController from './components/AnimationController'
import AlgorithmCalculator from './components/AlgorithmCalculator'

// 生成指定范围内的随机整数
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function App() {
  // 生成5到20之间的随机值作为初始行列数
  const initialSize = getRandomInt(5, 20);
  const [rows, setRows] = useState<number>(initialSize)
  const [cols, setCols] = useState<number>(initialSize)
  // 从localStorage读取用户上次设置的陆地概率，如果没有则使用默认值0.4
  const [landProbability, setLandProbability] = useState<number>(() => {
    const savedProbability = localStorage.getItem('landProbability');
    return savedProbability ? Number(savedProbability) : 0.4;
  });
  const [grid, setGrid] = useState<Grid>([])
  const [islandCount, setIslandCount] = useState<number | null>(null)
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([])
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  // 从localStorage读取用户上次选择的速度，如果没有则使用默认值1
  const [animationSpeed, setAnimationSpeed] = useState<number>(() => {
    const savedSpeed = localStorage.getItem('animationSpeed');
    return savedSpeed ? Number(savedSpeed) : 1;
  })
  const [message, setMessage] = useState<string>('')
  const [algorithm, setAlgorithm] = useState<'dfs' | 'bfs'>('dfs')
  const [customGridInput, setCustomGridInput] = useState<string>('')
  const animationRef = useRef<number | null>(null)
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  // 当陆地概率变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('landProbability', landProbability.toString());
  }, [landProbability]);
  
  // 当速度变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('animationSpeed', animationSpeed.toString());
  }, [animationSpeed]);
  
  // 使用ResizeObserver监听容器大小变化
  useEffect(() => {
    if (!mainContentRef.current) return;
    
    const updateLayout = () => {
      // 触发网格组件重新渲染计算
      window.dispatchEvent(new Event('resize'));
    };
    
    // 初始更新
    updateLayout();
    
    // 创建一个ResizeObserver
    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(mainContentRef.current);
    
    // 窗口大小变化时也重新计算
    window.addEventListener('resize', updateLayout);
    
    return () => {
      window.removeEventListener('resize', updateLayout);
      resizeObserver.disconnect();
    };
  }, []);
  
  // 计算岛屿数量和动画步骤
  const calculateIslandCount = (gridToCalculate: Grid) => {
    AlgorithmCalculator.calculateIslandCount({
      grid: gridToCalculate,
      algorithm,
      setIslandCount,
      setAnimationSteps,
      setCurrentStep,
      setMessage
    });
  }
  
  // 设置行数的安全函数
  const setRowsSafe = (value: number) => {
    const safeValue = Math.min(value, 50);
    setRows(safeValue);
  }
  
  // 设置列数的安全函数
  const setColsSafe = (value: number) => {
    const safeValue = Math.min(value, 50);
    setCols(safeValue);
  }
  
  // 生成随机岛屿网格
  const generateRandomGrid = () => {
    GridGenerator.generateRandomGrid({
      rows,
      cols,
      landProbability,
      setGrid,
      setCustomGridInput,
      resetAnimation,
      calculateIslandCount
    });
  }
  
  // 示例1：一个岛屿
  const example1 = () => {
    const exampleGrid = GridGenerator.generateExample1({
      rows,
      cols,
      landProbability,
      setGrid,
      setCustomGridInput,
      resetAnimation,
      calculateIslandCount
    });
    
    // 设置行列数
    const newSize = exampleGrid.length;
    setRowsSafe(newSize);
    setColsSafe(newSize);
  }
  
  // 示例2：多个岛屿
  const example2 = () => {
    const exampleGrid = GridGenerator.generateExample2({
      rows,
      cols,
      landProbability,
      setGrid,
      setCustomGridInput,
      resetAnimation,
      calculateIslandCount
    });
    
    // 设置行列数
    const newSize = exampleGrid.length;
    setRowsSafe(newSize);
    setColsSafe(newSize);
  }
  
  // 处理自定义网格输入
  const handleCustomGridSubmit = () => {
    CustomGridProcessor.processCustomGrid({
      customGridInput,
      setGrid,
      setRows: setRowsSafe,
      setCols: setColsSafe,
      resetAnimation,
      calculateIslandCount,
      setMessage
    });
  }
  
  // 动画控制：重置
  const resetAnimation = () => {
    AnimationController.resetAnimation({
      animationRef,
      setAnimationSteps,
      currentStep,
      setCurrentStep,
      isPlaying,
      setIsPlaying,
      animationSteps,
      setMessage
    });
  }
  
  // 动画控制：播放/暂停
  const togglePlayPause = () => {
    AnimationController.togglePlayPause({
      animationRef,
      animationSteps,
      currentStep,
      setCurrentStep,
      isPlaying,
      setIsPlaying,
      setMessage
    });
  }
  
  // 动画控制：前进一步
  const stepForward = () => {
    AnimationController.stepForward({
      animationRef,
      animationSteps,
      currentStep,
      setCurrentStep,
      isPlaying,
      setIsPlaying,
      setMessage
    });
  }
  
  // 动画控制：后退一步
  const stepBackward = () => {
    AnimationController.stepBackward({
      animationRef,
      animationSteps,
      currentStep,
      setCurrentStep,
      isPlaying,
      setIsPlaying,
      setMessage
    });
  }
  
  // 动画控制：跳转到开始
  const jumpToStart = () => {
    AnimationController.jumpToStart({
      animationRef,
      animationSteps,
      currentStep,
      setCurrentStep,
      isPlaying,
      setIsPlaying,
      setMessage
    });
  }
  
  // 动画控制：跳转到结束
  const jumpToEnd = () => {
    AnimationController.jumpToEnd({
      animationRef,
      animationSteps,
      currentStep,
      setCurrentStep,
      isPlaying,
      setIsPlaying,
      setMessage
    });
  }
  
  // 动画播放效果
  useEffect(() => {
    if (isPlaying && animationSteps.length > 0) {
      if (currentStep >= animationSteps.length - 1) {
        setCurrentStep(0)
      }
      
      const animate = () => {
        setCurrentStep(prevStep => {
          if (prevStep < animationSteps.length - 1) {
            return prevStep + 1
          } else {
            setIsPlaying(false)
            return prevStep
          }
        })
      }

      // 使用速度值计算延迟时间
      // 速度1x对应500ms延迟，速度越大延迟越短
      const delay = Math.round(500 / animationSpeed);

      const timeoutId = setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate)
      }, delay)

      return () => {
        clearTimeout(timeoutId)
        if (animationRef.current !== null) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [isPlaying, currentStep, animationSteps, animationSpeed])
  
  // 更新消息
  useEffect(() => {
    AnimationController.updateMessage({
      animationRef,
      animationSteps,
      currentStep,
      setCurrentStep,
      isPlaying,
      setIsPlaying,
      setMessage
    });
  }, [currentStep, animationSteps])
  
  // 键盘快捷键处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (animationSteps.length === 0) return

      switch (e.key) {
        case 'ArrowLeft':
          stepBackward()
          break
        case 'ArrowRight':
          stepForward()
          break
        case ' ':
          e.preventDefault() // 防止空格键滚动页面
          togglePlayPause()
          break
        case 'r':
        case 'R':
          resetAnimation()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [animationSteps, currentStep, isPlaying])
  
  // 初始加载时生成一个随机网格
  useEffect(() => {
    // 使用初始化时的随机尺寸生成网格
    generateRandomGrid()
  }, [])

  return (
    <div className="app-container">
      <div className="top-section">
        <h1>LeetCode 200 - 岛屿数量可视化计算器</h1>
        <p className="description">给你一个由 '1'（陆地）和 '0'（水）组成的二维网格，请你计算网格中岛屿的数量。岛屿由相邻的陆地连接而成，可以假设网格的四个边均被水包围。</p>
      </div>
      
      <div ref={mainContentRef} className="main-content">
        <div className="bottom-section">
          <div className="left-column">
            <ControlPanel
              rows={rows}
              cols={cols}
              landProbability={landProbability}
              onRowsChange={setRowsSafe}
              onColsChange={setColsSafe}
              onLandProbabilityChange={setLandProbability}
              onGenerateRandomGrid={generateRandomGrid}
              onExample1={example1}
              onExample2={example2}
              algorithm={algorithm}
              onAlgorithmChange={setAlgorithm}
              customGridInput={customGridInput}
              onCustomGridInputChange={setCustomGridInput}
              onCustomGridSubmit={handleCustomGridSubmit}
              islandCount={islandCount}
            />
          </div>
          
          <div className="right-column">
            <GridVisualizer
              grid={grid}
              animationSteps={animationSteps}
              currentStep={currentStep}
              algorithm={algorithm}
              message={message}
            />
          </div>
        </div>
      </div>
      
      {/* 全宽进度条控制区域 */}
      <AnimationControls 
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onStepForward={stepForward}
        onStepBackward={stepBackward}
        onReset={resetAnimation}
        onJumpToStart={jumpToStart}
        onJumpToEnd={jumpToEnd}
        onSpeedChange={setAnimationSpeed}
        currentSpeed={animationSpeed}
        currentStep={currentStep}
        totalSteps={animationSteps.length}
        onSliderChange={setCurrentStep}
      />
    </div>
  )
}

export default App
