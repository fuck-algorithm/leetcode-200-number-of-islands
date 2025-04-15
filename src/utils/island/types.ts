/**
 * 岛屿计算器相关类型定义
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

// 四个搜索方向定义
export const DIRECTIONS = [
  { di: -1, dj: 0, name: '上' },
  { di: 1, dj: 0, name: '下' },
  { di: 0, dj: -1, name: '左' },
  { di: 0, dj: 1, name: '右' }
];

// 定义网格类型
export type Grid = string[][]; 