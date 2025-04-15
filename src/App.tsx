import { useState, useEffect, useRef } from 'react'
import './App.css'
import IslandGrid from './components/IslandGrid'
import Stack from './components/Stack'
import Queue from './components/Queue'
import AnimationControls from './components/AnimationControls'
import ControlPanel from './components/ControlPanel'
import { 
  CellState, 
  numIslandsWithAnimation, 
  numIslandsWithAnimationBFS,
  AnimationStep, 
  Position
} from './utils/islandSolver'

type Grid = string[][]

// 生成指定范围内的随机整数
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function App() {
  // 生成5到20之间的随机值作为初始行列数
  const initialSize = getRandomInt(5, 20);
  const [rows, setRows] = useState<number>(initialSize)
  const [cols, setCols] = useState<number>(initialSize)
  const [landProbability, setLandProbability] = useState<number>(0.4)
  const [grid, setGrid] = useState<Grid>([])
  const [islandCount, setIslandCount] = useState<number | null>(null)
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([])
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [animationSpeed, setAnimationSpeed] = useState<number>(500)
  const [message, setMessage] = useState<string>('')
  const [algorithm, setAlgorithm] = useState<'dfs' | 'bfs'>('dfs')
  const [customGridInput, setCustomGridInput] = useState<string>('')
  const animationRef = useRef<number | null>(null)
  
  // 计算岛屿数量和动画步骤
  const calculateIslandCount = (gridToCalculate: Grid) => {
    // 根据当前算法类型选择不同的遍历函数
    const steps = algorithm === 'dfs' 
      ? numIslandsWithAnimation(gridToCalculate)
      : numIslandsWithAnimationBFS(gridToCalculate);
      
    const count = steps.length > 0 ? steps[steps.length - 1].islandCount : 0
    setIslandCount(count)
    setAnimationSteps(steps)
    setCurrentStep(0)
    setMessage('开始遍历网格寻找岛屿...')
  }
  
  // 设置行数的安全函数
  const setRowsSafe = (value: number) => {
    setRows(Math.min(value, 50));
  }
  
  // 设置列数的安全函数
  const setColsSafe = (value: number) => {
    setCols(Math.min(value, 50));
  }
  
  // 生成随机岛屿网格
  const generateRandomGrid = () => {
    // 确保行列数在范围内
    const safeRows = Math.min(rows, 50);
    const safeCols = Math.min(cols, 50);
    
    const newGrid: Grid = []
    for (let i = 0; i < safeRows; i++) {
      const row: CellState[] = []
      for (let j = 0; j < safeCols; j++) {
        // 随机生成水域或陆地
        row.push(Math.random() < landProbability ? CellState.LAND : CellState.WATER)
      }
      newGrid.push(row)
    }
    setGrid(newGrid)
    setIslandCount(null)
    resetAnimation()
    // 自动计算岛屿数量
    calculateIslandCount(newGrid)
    
    // 填充到自定义输入框
    const gridString = newGrid.map(row => 
      row.map(cell => cell === CellState.LAND ? '1' : '0').join('')
    ).join('\n')
    setCustomGridInput(gridString)
  }
  
  // 示例1：一个岛屿
  const example1 = () => {
    const exampleGrid: Grid = [
      [CellState.WATER, CellState.WATER, CellState.WATER, CellState.WATER, CellState.WATER],
      [CellState.WATER, CellState.LAND, CellState.LAND, CellState.LAND, CellState.WATER],
      [CellState.WATER, CellState.LAND, CellState.LAND, CellState.LAND, CellState.WATER],
      [CellState.WATER, CellState.LAND, CellState.LAND, CellState.LAND, CellState.WATER],
      [CellState.WATER, CellState.WATER, CellState.WATER, CellState.WATER, CellState.WATER]
    ]
    // 使用安全函数设置行列数
    setRowsSafe(exampleGrid.length)
    setColsSafe(exampleGrid[0].length)
    setGrid(exampleGrid)
    setIslandCount(null)
    resetAnimation()
    // 自动计算岛屿数量
    calculateIslandCount(exampleGrid)
    
    // 填充到自定义输入框
    const gridString = exampleGrid.map(row => 
      row.map(cell => cell === CellState.LAND ? '1' : '0').join('')
    ).join('\n')
    setCustomGridInput(gridString)
  }
  
  // 示例2：多个岛屿
  const example2 = () => {
    const exampleGrid: Grid = [
      [CellState.LAND, CellState.LAND, CellState.WATER, CellState.WATER, CellState.WATER],
      [CellState.LAND, CellState.LAND, CellState.WATER, CellState.WATER, CellState.WATER],
      [CellState.WATER, CellState.WATER, CellState.LAND, CellState.WATER, CellState.WATER],
      [CellState.WATER, CellState.WATER, CellState.WATER, CellState.LAND, CellState.LAND],
      [CellState.WATER, CellState.WATER, CellState.WATER, CellState.LAND, CellState.LAND]
    ]
    // 使用安全函数设置行列数
    setRowsSafe(exampleGrid.length)
    setColsSafe(exampleGrid[0].length)
    setGrid(exampleGrid)
    setIslandCount(null)
    resetAnimation()
    // 自动计算岛屿数量
    calculateIslandCount(exampleGrid)
    
    // 填充到自定义输入框
    const gridString = exampleGrid.map(row => 
      row.map(cell => cell === CellState.LAND ? '1' : '0').join('')
    ).join('\n')
    setCustomGridInput(gridString)
  }
  
  // 处理自定义网格输入
  const handleCustomGridSubmit = () => {
    try {
      // 解析用户输入的网格数据
      const inputLines = customGridInput.trim().split('\n');
      const customGrid: Grid = [];
      
      for (const line of inputLines) {
        const row = line.trim().split('').filter(char => char === '0' || char === '1');
        if (row.length > 0) {
          customGrid.push(row);
        }
      }
      
      // 验证网格是否有效
      if (customGrid.length === 0) {
        setMessage('输入的网格数据无效，请检查格式');
        return;
      }
      
      // 检查每行长度是否一致
      const firstRowLength = customGrid[0].length;
      if (customGrid.some(row => row.length !== firstRowLength)) {
        setMessage('输入的网格数据行长度不一致，请检查格式');
        return;
      }
      
      // 验证网格尺寸不超过最大限制
      if (customGrid.length > 50) {
        setMessage('网格行数不能超过50行');
        return;
      }
      
      if (firstRowLength > 50) {
        setMessage('网格列数不能超过50列');
        return;
      }
      
      // 设置并计算
      setRows(customGrid.length);
      setCols(firstRowLength);
      setGrid(customGrid);
      resetAnimation();
      calculateIslandCount(customGrid);
    } catch (error) {
      setMessage('解析输入数据时出错，请检查格式');
    }
  }
  
  // 动画控制：重置
  const resetAnimation = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    setAnimationSteps([])
    setCurrentStep(0)
    setIsPlaying(false)
    setMessage('')
  }
  
  // 动画控制：播放/暂停
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }
  
  // 动画控制：前进一步
  const stepForward = () => {
    if (currentStep < animationSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsPlaying(false)
    }
  }
  
  // 动画控制：后退一步
  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  // 动画控制：跳转到开始
  const jumpToStart = () => {
    setCurrentStep(0)
  }
  
  // 动画控制：跳转到结束
  const jumpToEnd = () => {
    setCurrentStep(animationSteps.length - 1)
    setIsPlaying(false)
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

      const timeoutId = setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate)
      }, animationSpeed)

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
    if (animationSteps.length === 0 || currentStep >= animationSteps.length) return
    
    const step = animationSteps[currentStep]
    
    // 更新消息内容
    let newMessage = ''
    
    if (step.currentPosition) {
      const [row, col] = step.currentPosition
      newMessage = `检查位置 (${row}, ${col})`
      
      if (step.grid[row][col] === CellState.WATER) {
        newMessage += ' - 水域，继续搜索'
      } else if (step.grid[row][col] === CellState.LAND) {
        newMessage += ' - 发现新陆地，开始探索新岛屿'
      } else if (step.grid[row][col] === CellState.VISITED) {
        newMessage += ' - 已访问过的陆地，继续搜索'
      }
    } else if (step.islandCount > 0) {
      newMessage = `已发现 ${step.islandCount} 个岛屿`
      if (currentStep === animationSteps.length - 1) {
        newMessage += ' - 搜索完成！'
      }
    } else {
      newMessage = '开始遍历网格寻找岛屿...'
    }
    
    // 添加探索方向的信息
    if (step.exploringDirection) {
      let direction = step.exploringDirection
      newMessage += ` - 向${direction}探索`
    }
    
    setMessage(newMessage)
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
  
  // 获取当前显示的网格
  const getCurrentDisplayGrid = (): Grid => {
    if (animationSteps.length > 0 && currentStep < animationSteps.length) {
      return animationSteps[currentStep].grid
    }
    return grid
  }

  // 获取当前动画步骤
  const getCurrentAnimationStep = () => {
    if (animationSteps.length > 0 && currentStep < animationSteps.length) {
      return animationSteps[currentStep]
    }
    return null
  }

  return (
    <div className="app-container">
      <div className="top-section">
        <h1>岛屿数量计算器 (LeetCode 200)</h1>
        <p className="description">给你一个由 '1'（陆地）和 '0'（水）组成的二维网格，请你计算网格中岛屿的数量。岛屿由相邻的陆地连接而成，可以假设网格的四个边均被水包围。</p>
      </div>
      
      <div className="main-content">
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
            <div className="visualization-container">
              {/* 将消息框移到这里，网格的上方 */}
              {animationSteps.length > 0 && currentStep < animationSteps.length && (
                <div className="message-box top-message">
                  {message || '点击"生成随机网格"按钮开始演示算法过程'}
                </div>
              )}
              <div className="grid-with-ds-container">
                <div className="island-grid-container">
                  {animationSteps.length > 0 && currentStep < animationSteps.length ? (
                    <IslandGrid 
                      grid={getCurrentDisplayGrid()} 
                      currentPosition={getCurrentAnimationStep()?.currentPosition}
                      exploringDirection={getCurrentAnimationStep()?.exploringDirection}
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
