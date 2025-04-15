/**
 * 岛屿数量计算与可视化入口
 * 将所有模块导出，让外部能够统一导入
 */

// 导出所有类型定义
export * from './types';

// 导出网格工具函数
export * from './gridUtils';

// 导出DFS和BFS算法
export * from './dfsAlgorithm';
export * from './bfsAlgorithm';

// 导出i18n工具函数
export * from './i18nHelper';

// 为了兼容现有代码，提供原始的numIslands函数
import { numIslandsDFS } from './dfsAlgorithm';
export const numIslands = numIslandsDFS; 