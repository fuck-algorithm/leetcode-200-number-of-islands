import { CellState, Grid } from '../utils/island';

export interface GridGeneratorProps {
  rows: number;
  cols: number;
  landProbability: number;
  setGrid: (grid: Grid) => void;
  setCustomGridInput: (input: string) => void;
  resetAnimation: () => void;
  calculateIslandCount: (grid: Grid) => void;
}

// 生成指定范围内的随机整数
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 将网格转换为字符串表示形式，用于自定义输入框
export const gridToString = (grid: Grid): string => {
  return grid.map(row => 
    row.map(cell => cell === CellState.LAND ? '1' : '0').join('')
  ).join('\n');
};

export const GridGenerator = {
  // 生成随机岛屿网格
  generateRandomGrid: (props: GridGeneratorProps) => {
    const { rows, cols, landProbability, setGrid, resetAnimation, calculateIslandCount, setCustomGridInput } = props;
    
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
    
    setGrid(newGrid);
    resetAnimation();
    // 自动计算岛屿数量
    calculateIslandCount(newGrid);
    
    // 填充到自定义输入框
    setCustomGridInput(gridToString(newGrid));
    
    return newGrid;
  },
  
  // 示例1：一个岛屿
  generateExample1: (props: GridGeneratorProps) => {
    const { setGrid, resetAnimation, calculateIslandCount, setCustomGridInput } = props;
    
    const exampleGrid: Grid = [
      [CellState.WATER, CellState.WATER, CellState.WATER, CellState.WATER, CellState.WATER],
      [CellState.WATER, CellState.LAND, CellState.LAND, CellState.LAND, CellState.WATER],
      [CellState.WATER, CellState.LAND, CellState.LAND, CellState.LAND, CellState.WATER],
      [CellState.WATER, CellState.LAND, CellState.LAND, CellState.LAND, CellState.WATER],
      [CellState.WATER, CellState.WATER, CellState.WATER, CellState.WATER, CellState.WATER]
    ];
    
    setGrid(exampleGrid);
    resetAnimation();
    calculateIslandCount(exampleGrid);
    
    // 填充到自定义输入框
    setCustomGridInput(gridToString(exampleGrid));
    
    return exampleGrid;
  },
  
  // 示例2：多个岛屿
  generateExample2: (props: GridGeneratorProps) => {
    const { setGrid, resetAnimation, calculateIslandCount, setCustomGridInput } = props;
    
    const exampleGrid: Grid = [
      [CellState.LAND, CellState.LAND, CellState.WATER, CellState.WATER, CellState.WATER],
      [CellState.LAND, CellState.LAND, CellState.WATER, CellState.WATER, CellState.WATER],
      [CellState.WATER, CellState.WATER, CellState.LAND, CellState.WATER, CellState.WATER],
      [CellState.WATER, CellState.WATER, CellState.WATER, CellState.LAND, CellState.LAND],
      [CellState.WATER, CellState.WATER, CellState.WATER, CellState.LAND, CellState.LAND]
    ];
    
    setGrid(exampleGrid);
    resetAnimation();
    calculateIslandCount(exampleGrid);
    
    // 填充到自定义输入框
    setCustomGridInput(gridToString(exampleGrid));
    
    return exampleGrid;
  }
};

export default GridGenerator; 