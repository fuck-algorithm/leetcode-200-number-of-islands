import { CellState, AnimationStep, Position, DIRECTIONS, Grid } from './types';
import { cloneGrid } from './gridUtils';

/**
 * DFS算法相关实现
 */

/**
 * 使用DFS算法计算岛屿数量并生成动画步骤
 * @param originalGrid 原始网格数据
 * @returns 动画步骤数组
 */
export const numIslandsWithAnimation = (originalGrid: Grid): AnimationStep[] => {
  if (!originalGrid || originalGrid.length === 0) return [];
  
  // 深拷贝网格，避免修改原网格
  const grid = cloneGrid(originalGrid);
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  
  // 记录每一步的动画状态
  const steps: AnimationStep[] = [];
  
  // 添加初始状态
  steps.push({
    grid: cloneGrid(grid),
    islandCount: 0,
    message: '初始状态：绿色表示陆地(1)，白色表示水域(0)。'
  });
  
  // 深度优先搜索函数 - 使用显式栈实现，而不是递归
  const dfs = (startI: number, startJ: number) => {
    // 使用栈来替代递归
    const stack: Position[] = [];
    stack.push({ i: startI, j: startJ });
    
    // 标记起始位置为"当前访问"状态
    grid[startI][startJ] = CellState.CURRENT;
    
    // 记录栈状态
    steps.push({
      grid: cloneGrid(grid),
      currentPosition: [startI, startJ],
      islandCount: count,
      message: `发现陆地 (${startI},${startJ})，开始搜索新岛屿。将其加入栈。`,
      stack: [...stack]
    });
    
    while (stack.length > 0) {
      const { i, j } = stack[stack.length - 1]; // 查看栈顶元素但不弹出
      
      // 标记当前位置为"当前访问"状态
      grid[i][j] = CellState.CURRENT;
      
      // 记录当前单元格的访问状态
      steps.push({
        grid: cloneGrid(grid),
        currentPosition: [i, j],
        islandCount: count,
        message: `当前正在访问单元格 (${i},${j})。`,
        stack: [...stack]
      });
      
      // 使用包含岛屿编号的标记，而不是简单的已访问状态
      // 例如：第1个岛屿的单元格标记为"V1"，第2个岛屿标记为"V2"
      grid[i][j] = `V${count}`;
      
      let foundNeighbor = false;
      
      // 探索四个方向
      for (const { di, dj, name } of DIRECTIONS) {
        const ni = i + di;
        const nj = j + dj;
        
        // 检查是否有效单元格
        if (ni >= 0 && nj >= 0 && ni < rows && nj < cols && grid[ni][nj] === CellState.LAND) {
          // 标记为正在探索
          grid[ni][nj] = CellState.EXPLORING;
          
          // 记录探索方向
          steps.push({
            grid: cloneGrid(grid),
            currentPosition: [i, j],
            exploringDirection: name,
            islandCount: count,
            message: `从 (${i},${j}) 向${name}方向探索，发现陆地 (${ni},${nj})。将其加入栈。`,
            stack: [...stack]
          });
          
          // 将新的位置加入栈
          stack.push({ i: ni, j: nj });
          foundNeighbor = true;
          
          // 记录更新的栈状态
          steps.push({
            grid: cloneGrid(grid),
            currentPosition: [i, j],
            islandCount: count,
            message: `将 (${ni},${nj}) 加入栈。`,
            stack: [...stack]
          });
          
          break; // 找到一个邻居后就跳出循环，模拟深度优先
        }
      }
      
      // 如果没有找到未访问的邻居，则弹出栈顶元素
      if (!foundNeighbor) {
        stack.pop();
        
        if (stack.length > 0) {
          const next = stack[stack.length - 1];
          steps.push({
            grid: cloneGrid(grid),
            currentPosition: [i, j],
            islandCount: count,
            message: `单元格 (${i},${j}) 的所有邻居都已访问，将其从栈中弹出。返回到 (${next.i},${next.j})。`,
            stack: [...stack]
          });
        } else {
          steps.push({
            grid: cloneGrid(grid),
            islandCount: count,
            message: `单元格 (${i},${j}) 的所有邻居都已访问，将其从栈中弹出。栈为空，岛屿搜索完成。`,
            stack: []
          });
        }
      }
    }
  };
  
  // 遍历网格
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // 记录当前扫描位置，不论是水域还是陆地都记录
      if (grid[i][j] !== CellState.LAND) {
        steps.push({
          grid: cloneGrid(grid),
          currentPosition: [i, j],
          islandCount: count,
          message: grid[i][j] === CellState.WATER ? 
            `检查位置 (${i},${j}) - 水域，继续搜索。` : 
            `检查位置 (${i},${j}) - 已访问过的区域，继续搜索。`
        });
        continue;
      }
      
      if (grid[i][j] === CellState.LAND) {
        // 找到一个新岛屿
        count++;
        
        // 记录发现新岛屿
        steps.push({
          grid: cloneGrid(grid),
          currentPosition: [i, j],
          islandCount: count,
          message: `发现第 ${count} 个岛屿，从 (${i},${j}) 开始搜索。`,
          stack: []
        });
        
        // 使用深度优先搜索标记整个岛屿
        dfs(i, j);
      }
    }
  }
  
  // 添加算法完成的最终状态
  steps.push({
    grid: cloneGrid(grid),
    islandCount: count,
    message: `算法完成！共发现 ${count} 个岛屿。`
  });
  
  return steps;
};

/**
 * 原始DFS算法 - 无动画版本
 * @param grid 网格数据
 * @returns 岛屿数量
 */
export const numIslandsDFS = (grid: Grid): number => {
  if (!grid || grid.length === 0) return 0;
  
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  
  // 用于标记已访问位置的辅助函数
  const dfs = (i: number, j: number) => {
    // 边界检查
    if (i < 0 || j < 0 || i >= rows || j >= cols || grid[i][j] === '0') {
      return;
    }
    
    // 标记当前岛屿为已访问 (将'1'改为'0')
    grid[i][j] = '0';
    
    // 递归搜索四个方向
    dfs(i + 1, j); // 下
    dfs(i - 1, j); // 上
    dfs(i, j + 1); // 右
    dfs(i, j - 1); // 左
  };
  
  // 遍历整个网格
  const gridCopy = cloneGrid(grid); // 避免修改原始网格
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (gridCopy[i][j] === '1') {
        count++; // 发现一个岛屿
        dfs(i, j); // 通过DFS标记整个岛屿
      }
    }
  }
  
  return count;
}; 