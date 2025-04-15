/**
 * LeetCode 200. 岛屿数量
 * 使用深度优先搜索解决岛屿数量问题
 */

// 定义单元格的状态
export enum CellState {
  WATER = '0',         // 水域
  LAND = '1',          // 未访问的陆地
  VISITED = '2',       // 已访问的陆地
  CURRENT = '3',       // 当前正在访问的单元格
  EXPLORING = '4'      // 正在探索的方向
}

// 定义队列/栈中的位置
export interface Position {
  i: number;  // 行
  j: number;  // 列
}

// 定义动画步骤记录
export interface AnimationStep {
  grid: string[][];    // 当前网格状态
  currentPosition?: [number, number]; // 当前访问位置
  exploringDirection?: string; // 当前探索方向 (up/down/left/right)
  islandCount: number; // 当前岛屿计数
  message: string;     // 描述当前步骤
  stack?: Position[];  // DFS中的栈状态
  queue?: Position[];  // BFS中的队列状态
}

// DFS遍历方法 - 使用栈
export const numIslandsWithAnimation = (originalGrid: string[][]): AnimationStep[] => {
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
    
    // 定义四个方向：上、下、左、右
    const directions = [
      { di: -1, dj: 0, name: '上' },
      { di: 1, dj: 0, name: '下' },
      { di: 0, dj: -1, name: '左' },
      { di: 0, dj: 1, name: '右' }
    ];
    
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
      
      // 标记为已访问
      grid[i][j] = CellState.VISITED;
      
      let foundNeighbor = false;
      
      // 探索四个方向
      for (const { di, dj, name } of directions) {
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
  
  // BFS版本的岛屿数量算法实现
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
      message: `发现陆地 (${startI},${startJ})，开始搜索新岛屿。将其加入队列。`,
      queue: [...queue]
    });
    
    // 定义四个方向：上、下、左、右
    const directions = [
      { di: -1, dj: 0, name: '上' },
      { di: 1, dj: 0, name: '下' },
      { di: 0, dj: -1, name: '左' },
      { di: 0, dj: 1, name: '右' }
    ];
    
    while (queue.length > 0) {
      // 出队一个元素
      const { i, j } = queue.shift()!;
      
      // 如果单元格已被标记为VISITED，说明是重复访问，跳过
      if (grid[i][j] === CellState.VISITED) {
        continue;
      }
      
      // 标记当前位置为"当前访问"状态
      grid[i][j] = CellState.CURRENT;
      
      // 记录当前单元格的访问状态
      steps.push({
        grid: cloneGrid(grid),
        currentPosition: [i, j],
        islandCount: count,
        message: `当前正在访问单元格 (${i},${j})。`,
        queue: [...queue]
      });
      
      // 标记为已访问
      grid[i][j] = CellState.VISITED;
      
      // 探索四个方向
      for (const { di, dj, name } of directions) {
        const ni = i + di;
        const nj = j + dj;
        
        // 检查是否有效单元格
        if (ni >= 0 && nj >= 0 && ni < rows && nj < cols && grid[ni][nj] === CellState.LAND) {
          // 标记为正在探索，避免重复入队
          grid[ni][nj] = CellState.EXPLORING;
          
          // 记录探索方向
          steps.push({
            grid: cloneGrid(grid),
            currentPosition: [i, j],
            exploringDirection: name,
            islandCount: count,
            message: `从 (${i},${j}) 向${name}方向探索，发现陆地 (${ni},${nj})。将其加入队列。`,
            queue: [...queue]
          });
          
          // 将新的位置加入队列
          queue.push({ i: ni, j: nj });
          
          // 记录更新的队列状态
          steps.push({
            grid: cloneGrid(grid),
            currentPosition: [i, j],
            islandCount: count,
            message: `将 (${ni},${nj}) 加入队列。`,
            queue: [...queue]
          });
        }
      }
      
      // BFS中如果队列为空，表示当前连通区域已遍历完成
      if (queue.length === 0) {
        steps.push({
          grid: cloneGrid(grid),
          islandCount: count,
          message: `队列为空，当前岛屿搜索完成。`,
          queue: []
        });
      }
    }
  };
  
  // 使用DFS遍历整个网格
  const useDFS = true; // 设置为false使用BFS
  
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
            `扫描单元格 (${i},${j})，是水域，继续扫描。` : 
            `扫描单元格 (${i},${j})，已访问过，继续扫描。`
        });
        continue;
      }
      
      steps.push({
        grid: cloneGrid(grid),
        currentPosition: [i, j],
        islandCount: count,
        message: `扫描单元格 (${i},${j})，发现未访问的陆地，开始${useDFS ? "DFS" : "BFS"}搜索。`
      });
      
      // 发现一个新岛屿
      count++;
      
      // 根据设置选择DFS或BFS
      if (useDFS) {
        dfs(i, j);
      } else {
        bfs(i, j);
      }
      
      // 记录完成一个岛屿的搜索
      steps.push({
        grid: cloneGrid(grid),
        islandCount: count,
        message: `完成一个岛屿的搜索，当前岛屿数量: ${count}。`
      });
    }
  }
  
  // 记录最终结果
  steps.push({
    grid: cloneGrid(grid),
    islandCount: count,
    message: `搜索完成，总共发现 ${count} 个岛屿。`
  });
  
  return steps;
};

// 为了支持选择不同的算法方式，添加一个BFS版本的求解函数
export const numIslandsWithAnimationBFS = (originalGrid: string[][]): AnimationStep[] => {
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
  
  // BFS版本的岛屿数量算法实现（与上面的函数完全相同，但使用BFS）
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
      message: `发现陆地 (${startI},${startJ})，开始搜索新岛屿。将其加入队列。`,
      queue: [...queue]
    });
    
    // 定义四个方向：上、下、左、右
    const directions = [
      { di: -1, dj: 0, name: '上' },
      { di: 1, dj: 0, name: '下' },
      { di: 0, dj: -1, name: '左' },
      { di: 0, dj: 1, name: '右' }
    ];
    
    while (queue.length > 0) {
      // 出队一个元素
      const { i, j } = queue.shift()!;
      
      // 如果单元格已被标记为VISITED，说明是重复访问，跳过
      if (grid[i][j] === CellState.VISITED) {
        continue;
      }
      
      // 标记当前位置为"当前访问"状态
      grid[i][j] = CellState.CURRENT;
      
      // 记录当前单元格的访问状态
      steps.push({
        grid: cloneGrid(grid),
        currentPosition: [i, j],
        islandCount: count,
        message: `当前正在访问单元格 (${i},${j})。`,
        queue: [...queue]
      });
      
      // 标记为已访问
      grid[i][j] = CellState.VISITED;
      
      // 探索四个方向
      for (const { di, dj, name } of directions) {
        const ni = i + di;
        const nj = j + dj;
        
        // 检查是否有效单元格
        if (ni >= 0 && nj >= 0 && ni < rows && nj < cols && grid[ni][nj] === CellState.LAND) {
          // 标记为正在探索，避免重复入队
          grid[ni][nj] = CellState.EXPLORING;
          
          // 记录探索方向
          steps.push({
            grid: cloneGrid(grid),
            currentPosition: [i, j],
            exploringDirection: name,
            islandCount: count,
            message: `从 (${i},${j}) 向${name}方向探索，发现陆地 (${ni},${nj})。将其加入队列。`,
            queue: [...queue]
          });
          
          // 将新的位置加入队列
          queue.push({ i: ni, j: nj });
          
          // 记录更新的队列状态
          steps.push({
            grid: cloneGrid(grid),
            currentPosition: [i, j],
            islandCount: count,
            message: `将 (${ni},${nj}) 加入队列。`,
            queue: [...queue]
          });
        }
      }
      
      // BFS中如果队列为空，表示当前连通区域已遍历完成
      if (queue.length === 0) {
        steps.push({
          grid: cloneGrid(grid),
          islandCount: count,
          message: `队列为空，当前岛屿搜索完成。`,
          queue: []
        });
      }
    }
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
            `扫描单元格 (${i},${j})，是水域，继续扫描。` : 
            `扫描单元格 (${i},${j})，已访问过，继续扫描。`
        });
        continue;
      }
      
      steps.push({
        grid: cloneGrid(grid),
        currentPosition: [i, j],
        islandCount: count,
        message: `扫描单元格 (${i},${j})，发现未访问的陆地，开始BFS搜索。`
      });
      
      // 发现一个新岛屿
      count++;
      
      // 使用BFS
      bfs(i, j);
      
      // 记录完成一个岛屿的搜索
      steps.push({
        grid: cloneGrid(grid),
        islandCount: count,
        message: `完成一个岛屿的搜索，当前岛屿数量: ${count}。`
      });
    }
  }
  
  // 记录最终结果
  steps.push({
    grid: cloneGrid(grid),
    islandCount: count,
    message: `搜索完成，总共发现 ${count} 个岛屿。`
  });
  
  return steps;
};

// 原有算法保持不变
export const numIslands = (grid: string[][]): number => {
  if (!grid || grid.length === 0) return 0;
  
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  
  // 深度优先搜索函数
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
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === '1') {
        count++; // 发现一个岛屿
        dfs(i, j); // 通过DFS标记整个岛屿
      }
    }
  }
  
  return count;
};

// 工具函数：深拷贝网格，防止原网格被修改
export const cloneGrid = (grid: string[][]): string[][] => {
  return grid.map(row => [...row]);
};

// 生成随机网格数据
export const generateRandomGrid = (rows: number, cols: number, landProbability = 0.3): string[][] => {
  const grid: string[][] = [];
  
  for (let i = 0; i < rows; i++) {
    const row: string[] = [];
    for (let j = 0; j < cols; j++) {
      row.push(Math.random() < landProbability ? '1' : '0');
    }
    grid.push(row);
  }
  
  return grid;
};

// 预设示例
export const sampleGrids = [
  [
    ['1', '1', '1', '1', '0'],
    ['1', '1', '0', '1', '0'],
    ['1', '1', '0', '0', '0'],
    ['0', '0', '0', '0', '0']
  ],
  [
    ['1', '1', '0', '0', '0'],
    ['1', '1', '0', '0', '0'],
    ['0', '0', '1', '0', '0'],
    ['0', '0', '0', '1', '1']
  ]
]; 