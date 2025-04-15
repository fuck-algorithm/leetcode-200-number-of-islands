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
  // 从localStorage读取用户上次选择的算法，如果没有则使用默认值dfs
  const [algorithm, setAlgorithm] = useState<'dfs' | 'bfs'>(() => {
    const savedAlgorithm = localStorage.getItem('algorithm');
    return (savedAlgorithm === 'dfs' || savedAlgorithm === 'bfs') ? savedAlgorithm : 'dfs';
  })
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
  
  // 当算法选择变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('algorithm', algorithm);
  }, [algorithm]);
  
  // 使用ResizeObserver监听容器大小变化
  useEffect(() => {
    if (!mainContentRef.current) return;
    
    const handleResize = () => {
      // 仅当窗口大小变化时调用
      // 避免创建新事件，防止无限递归
    };
    
    // 创建一个ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      // 仅记录大小变化，不触发新的resize事件
      // 避免创建无限循环
    });
    resizeObserver.observe(mainContentRef.current);
    
    // 窗口大小变化时重新计算
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
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
  
  // 修改算法选择的处理函数
  const handleAlgorithmChange = (newAlgorithm: 'dfs' | 'bfs') => {
    setAlgorithm(newAlgorithm);
    
    // 如果有动画步骤，使用新算法重新计算
    if (grid.length > 0) {
      resetAnimation();
      calculateIslandCount(grid);
    }
  }

  return (
    <div className="app-container">
      <div className="top-section">
        <div className="title-container">
          <a 
            href="https://leetcode.com/problems/number-of-islands/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="title-link"
          >
            <h1>LeetCode 200 - 岛屿数量可视化计算器</h1>
          </a>
          <a 
            href="https://github.com/fuck-algorithm/leetcode-200-number-of-islands" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="github-link" 
            title="在GitHub上查看源代码"
          >
            <svg className="github-icon" viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
              <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </a>
        </div>
        <p className="description">给你一个由 '1'（陆地）和 '0'（水）组成的二维网格，请你计算网格中岛屿的数量。岛屿由相邻的陆地连接而成，可以假设网格的四个边均被水包围。</p>
      </div>
      
      {/* 返回列表页链接 */}
      <a 
        href="https://fuck-algorithm.github.io/leetcode-hot-100/" 
        className="back-to-list" 
        title="返回 LeetCode Hot 100 列表"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="back-arrow">←</span>
        <span className="back-text">返回列表</span>
      </a>
      
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
              onAlgorithmChange={handleAlgorithmChange}
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
