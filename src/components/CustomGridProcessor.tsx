import { Grid, CellState } from '../utils/island';
import i18next from 'i18next';

export interface CustomGridProcessorProps {
  customGridInput: string;
  setGrid: (grid: Grid) => void;
  setRows: (rows: number) => void;
  setCols: (cols: number) => void;
  resetAnimation: () => void;
  calculateIslandCount: (grid: Grid) => void;
  setMessage: (message: string) => void;
}

export const CustomGridProcessor = {
  // 处理自定义网格输入
  processCustomGrid: (props: CustomGridProcessorProps) => {
    const { 
      customGridInput, 
      setGrid, 
      setRows, 
      setCols, 
      resetAnimation, 
      calculateIslandCount, 
      setMessage 
    } = props;

    try {
      // 解析用户输入的网格数据
      const inputLines = customGridInput.trim().split('\n');
      const customGrid: Grid = [];
      
      for (const line of inputLines) {
        const row = line.trim().split('').filter(char => char === '0' || char === '1');
        if (row.length > 0) {
          customGrid.push(row as CellState[]);
        }
      }
      
      // 验证网格是否有效
      if (customGrid.length === 0) {
        setMessage(i18next.t('errors.invalidGridData'));
        return false;
      }
      
      // 检查每行长度是否一致
      const firstRowLength = customGrid[0].length;
      if (customGrid.some(row => row.length !== firstRowLength)) {
        setMessage(i18next.t('errors.inconsistentRowLength'));
        return false;
      }
      
      // 验证网格尺寸不超过最大限制
      if (customGrid.length > 50) {
        setMessage(i18next.t('errors.maxRowsExceeded'));
        return false;
      }
      
      if (firstRowLength > 50) {
        setMessage(i18next.t('errors.maxColsExceeded'));
        return false;
      }
      
      // 设置并计算
      setRows(customGrid.length);
      setCols(firstRowLength);
      setGrid(customGrid);
      resetAnimation();
      calculateIslandCount(customGrid);
      
      return true;
    } catch (error) {
      setMessage(i18next.t('errors.parseError'));
      return false;
    }
  }
};

export default CustomGridProcessor; 