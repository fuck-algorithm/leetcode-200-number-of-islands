import { Grid } from './types';

/**
 * 网格操作相关的工具函数
 */

/**
 * 深拷贝网格，防止原网格被修改
 * @param grid 需要拷贝的网格
 * @returns 新的网格
 */
export const cloneGrid = (grid: Grid): Grid => {
  return grid.map(row => [...row]);
};

/**
 * 网格生成随机数据数据
 * @param rows 行数
 * @param cols 列数
 * @param landProbability 陆地概率 (0-1)
 * @returns 随机生成的网格
 */
export const generateRandomGrid = (rows: number, cols: number, landProbability = 0.3): Grid => {
  const grid: Grid = [];
  
  for (let i = 0; i < rows; i++) {
    const row: string[] = [];
    for (let j = 0; j < cols; j++) {
      row.push(Math.random() < landProbability ? '1' : '0');
    }
    grid.push(row);
  }
  
  return grid;
};

/**
 * 预设示例数据
 */
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