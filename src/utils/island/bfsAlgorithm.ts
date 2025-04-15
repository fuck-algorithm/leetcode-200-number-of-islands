import { CellState, AnimationStep, Position, DIRECTIONS, Grid } from './types';
import { cloneGrid } from './gridUtils';
import { getI18nMessage } from './i18nHelper';

/**
 * BFS算法相关实现
 */

/**
 * 使用BFS算法计算岛屿数量并生成动画步骤
 * @param originalGrid 原始网格数据
 * @returns 动画步骤数组
 */
export const numIslandsWithAnimationBFS = (originalGrid: Grid): AnimationStep[] => {
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
    message: getI18nMessage('algorithmSteps.initialState')
  });
  
  // 广度优先搜索函数 - 使用队列实现
  const bfs = (startI: number, startJ: number) => {
    // 使用队列实现BFS
    const queue: Position[] = [];
    queue.push({ i: startI, j: startJ });
    
    // 标记起始位置为已访问，避免重复入队
    grid[startI][startJ] = CellState.CURRENT;
    
    // 记录队列状态
    steps.push({
      grid: cloneGrid(grid),
      currentPosition: [startI, startJ],
      islandCount: count,
      message: getI18nMessage('algorithmSteps.foundLand', { row: startI, col: startJ }),
      queue: [...queue] // 确保是队列的深拷贝
    });
    
    while (queue.length > 0) {
      // 出队一个元素
      const { i, j } = queue.shift()!;
      
      // 如果单元格已被标记为访问状态（以V开头），说明是重复访问，跳过
      if (grid[i][j].startsWith('V')) {
        // 记录当前队列状态（在跳过重复访问时也记录状态）
        steps.push({
          grid: cloneGrid(grid),
          currentPosition: [i, j],
          islandCount: count,
          message: getI18nMessage('algorithmSteps.cellAlreadyVisited', { row: i, col: j }),
          queue: [...queue]
        });
        continue;
      }
      
      // 标记当前位置为"当前访问"状态
      grid[i][j] = CellState.CURRENT;
      
      // 记录当前单元格的访问状态
      steps.push({
        grid: cloneGrid(grid),
        currentPosition: [i, j],
        islandCount: count,
        message: getI18nMessage('algorithmSteps.visitingCell', { row: i, col: j }),
        queue: [...queue] // 记录更新后的队列状态
      });
      
      // 使用包含岛屿编号的标记，而不是简单的已访问状态
      grid[i][j] = `V${count}`;
      
      // 记录邻居的探索状态，用于后续队列添加
      const neighbors: {ni: number; nj: number; name: string}[] = [];
      
      // 探索四个方向
      for (const { di, dj, name } of DIRECTIONS) {
        const ni = i + di;
        const nj = j + dj;
        
        // 检查是否有效单元格
        if (ni >= 0 && nj >= 0 && ni < rows && nj < cols && grid[ni][nj] === CellState.LAND) {
          // 标记为正在探索，避免重复入队
          grid[ni][nj] = CellState.EXPLORING;
          
          // 添加到邻居列表
          neighbors.push({ni, nj, name});
        }
      }
      
      // 处理所有邻居
      for (const {ni, nj, name} of neighbors) {
        // 记录探索方向
        steps.push({
          grid: cloneGrid(grid),
          currentPosition: [i, j],
          exploringDirection: name,
          islandCount: count,
          message: getI18nMessage('algorithmSteps.exploreDirection', {
            row: i,
            col: j,
            direction: name,
            newRow: ni,
            newCol: nj
          }),
          queue: [...queue] // 记录当前队列状态
        });
        
        // 将新的位置加入队列
        queue.push({ i: ni, j: nj });
        
        // 记录更新的队列状态 - 添加元素后立即记录
        steps.push({
          grid: cloneGrid(grid),
          currentPosition: [i, j],
          islandCount: count,
          message: getI18nMessage('algorithmSteps.addedToQueue', { 
            row: ni, 
            col: nj, 
            count: queue.length 
          }),
          queue: [...queue] // 确保是队列的深拷贝
        });
      }
    }
    
    // BFS中如果队列为空，表示当前连通区域已遍历完成
    steps.push({
      grid: cloneGrid(grid),
      islandCount: count,
      message: getI18nMessage('algorithmSteps.emptyQueueComplete'),
      queue: [] // 确保明确设置为空队列
    });
  };
  
  // 遍历整个网格
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // 记录当前扫描位置
      if (grid[i][j] !== CellState.LAND) {
        steps.push({
          grid: cloneGrid(grid),
          currentPosition: [i, j],
          islandCount: count,
          message: grid[i][j] === CellState.WATER ? 
            getI18nMessage('algorithmSteps.checkPositionWater', { row: i, col: j }) : 
            getI18nMessage('algorithmSteps.checkPositionVisited', { row: i, col: j })
        });
        continue;
      }
      
      steps.push({
        grid: cloneGrid(grid),
        currentPosition: [i, j],
        islandCount: count,
        message: getI18nMessage('algorithmSteps.foundUnvisitedLand', { row: i, col: j })
      });
      
      // 发现一个新岛屿
      count++;
      
      // 使用BFS
      bfs(i, j);
      
      // 记录完成一个岛屿的搜索
      steps.push({
        grid: cloneGrid(grid),
        islandCount: count,
        message: getI18nMessage('algorithmSteps.islandSearchComplete', { count })
      });
    }
  }
  
  // 记录最终结果
  steps.push({
    grid: cloneGrid(grid),
    islandCount: count,
    message: getI18nMessage('algorithmSteps.algorithmComplete', { count })
  });
  
  return steps;
};

/**
 * 原始BFS算法 - 无动画版本
 * @param grid 网格数据
 * @returns 岛屿数量
 */
export const numIslandsBFS = (grid: Grid): number => {
  if (!grid || grid.length === 0) return 0;
  
  const gridCopy = cloneGrid(grid); // 避免修改原始网格
  const rows = gridCopy.length;
  const cols = gridCopy[0].length;
  let count = 0;
  
  // BFS遍历辅助函数
  const bfs = (i: number, j: number) => {
    const queue: Position[] = [];
    queue.push({ i, j });
    gridCopy[i][j] = '0'; // 标记为已访问
    
    while (queue.length > 0) {
      const { i: row, j: col } = queue.shift()!;
      
      // 四个方向：上下左右
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      
      for (const [di, dj] of directions) {
        const ni = row + di;
        const nj = col + dj;
        
        // 检查边界和是否为陆地
        if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && gridCopy[ni][nj] === '1') {
          queue.push({ i: ni, j: nj });
          gridCopy[ni][nj] = '0'; // 标记为已访问，避免重复入队
        }
      }
    }
  };
  
  // 遍历网格寻找岛屿
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (gridCopy[i][j] === '1') {
        count++;
        bfs(i, j);
      }
    }
  }
  
  return count;
}; 