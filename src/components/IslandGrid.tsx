import React, { useEffect, useRef, useState } from 'react';
import './IslandGrid.css';
import * as d3 from 'd3';
import { CellState } from '../utils/island';

interface IslandGridProps {
  grid: string[][];
  width?: number;
  height?: number;
  cellSize?: number;
  currentPosition?: [number, number]; // 当前访问位置
  exploringDirection?: string; // 当前探索方向
  showAnimation?: boolean; // 是否展示动画效果
}

const IslandGrid = ({ 
  grid, 
  width = 800, 
  height = 600, 
  cellSize = 40,
  currentPosition,
  exploringDirection,
  showAnimation = false
}: IslandGridProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  // 动态计算容器尺寸
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateSize = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const parentRect = container.parentElement?.getBoundingClientRect();
      
      if (parentRect) {
        setContainerSize({
          width: parentRect.width,
          height: parentRect.height
        });
      }
    };
    
    // 初始化
    updateSize();
    
    // 监听窗口大小变化
    window.addEventListener('resize', updateSize);
    
    // 创建一个ResizeObserver来监视容器大小变化
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);
    
    return () => {
      window.removeEventListener('resize', updateSize);
      resizeObserver.disconnect();
    };
  }, []);
  
  useEffect(() => {
    if (!svgRef.current || !grid.length) return;
    
    const svg = d3.select(svgRef.current);
    
    // 清除之前的内容
    svg.selectAll('*').remove();
    
    const rows = grid.length;
    const cols = grid[0].length;
    
    // 计算单元格大小，适应容器尺寸
    const dynamicCellSize = Math.min(
      (containerSize.width - 40) / cols,
      (containerSize.height - 40) / rows
    );
    
    // 使用动态计算的单元格大小或默认大小
    const actualCellSize = containerSize.width > 0 ? dynamicCellSize : cellSize;
    
    // 调整视图框大小以包含坐标轴标签
    const margin = { top: 20, left: 20 };
    
    svg
      .attr('width', cols * actualCellSize + margin.left)
      .attr('height', rows * actualCellSize + margin.top)
      .attr('viewBox', `${-margin.left} ${-margin.top} ${cols * actualCellSize + margin.left} ${rows * actualCellSize + margin.top}`);
    
    // 绘制网格
    const gridGroup = svg.append('g').attr('class', 'grid-group');
    
    // 创建箭头标记定义
    svg.append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#e74c3c');
    
    // 绘制单元格
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const cell = grid[i][j];
        let color;
        
        // 根据单元格状态设置颜色
        if (cell === CellState.WATER) {
          color = '#ecf0f1'; // 水域 - 白色
        } else if (cell === CellState.LAND) {
          color = '#2ecc71'; // 未访问陆地 - 绿色
        } else if (cell === CellState.CURRENT) {
          color = '#f39c12'; // 当前访问 - 橙色
        } else if (cell === CellState.EXPLORING) {
          color = '#9b59b6'; // 正在探索 - 紫色
        } else if (cell.startsWith('V')) {
          // 已访问陆地 - 使用不同的灰色色调区分不同的岛屿
          const islandNumber = parseInt(cell.substring(1)) || 0;
          // 生成不同岛屿的颜色变化
          const hue = (islandNumber * 30) % 360; // 色相每个岛屿相差30度
          color = `hsl(${hue}, 70%, 65%)`; // 使用HSL色彩空间，固定中等亮度和饱和度
        } else {
          color = '#3498db'; // 默认颜色 - 蓝色
        }
        
        // 判断是否是当前位置
        const isCurrentPosition = currentPosition && currentPosition[0] === i && currentPosition[1] === j;
        
        // 绘制单元格矩形
        gridGroup
          .append('rect')
          .attr('x', j * actualCellSize)
          .attr('y', i * actualCellSize)
          .attr('width', actualCellSize)
          .attr('height', actualCellSize)
          .attr('fill', color)
          .attr('stroke', isCurrentPosition ? '#e74c3c' : '#bdc3c7')
          .attr('stroke-width', isCurrentPosition ? 3 : 1);
        
        // 添加文本标签
        gridGroup
          .append('text')
          .attr('x', j * actualCellSize + actualCellSize / 2)
          .attr('y', i * actualCellSize + actualCellSize / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', cell === CellState.WATER ? 'black' : 'white')
          .attr('font-size', cell.startsWith('V') ? actualCellSize / 3.5 : actualCellSize / 3)
          .attr('font-weight', cell.startsWith('V') ? 'bold' : 'normal')
          .text(cell.startsWith('V') ? cell : (cell === CellState.EXPLORING ? 'E' : cell));
        
        // 如果是当前单元格，添加坐标标签
        if (isCurrentPosition) {
          gridGroup
            .append('text')
            .attr('x', j * actualCellSize + actualCellSize / 2)
            .attr('y', i * actualCellSize + actualCellSize / 5)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', '#e74c3c')
            .attr('font-size', actualCellSize / 4)
            .attr('font-weight', 'bold')
            .text(`(${i},${j})`);
        }
      }
    }
    
    // 如果有探索方向，绘制箭头
    if (currentPosition && exploringDirection && showAnimation) {
      const [i, j] = currentPosition;
      let dx = 0, dy = 0;
      
      // 根据方向确定箭头终点
      switch(exploringDirection) {
        case '上':
          dy = -1;
          break;
        case '下':
          dy = 1;
          break;
        case '左':
          dx = -1;
          break;
        case '右':
          dx = 1;
          break;
      }
      
      // 计算箭头起点和终点
      const startX = j * actualCellSize + actualCellSize / 2;
      const startY = i * actualCellSize + actualCellSize / 2;
      const endX = (j + dx) * actualCellSize + actualCellSize / 2;
      const endY = (i + dy) * actualCellSize + actualCellSize / 2;
      
      // 绘制箭头
      gridGroup
        .append('line')
        .attr('x1', startX)
        .attr('y1', startY)
        .attr('x2', endX)
        .attr('y2', endY)
        .attr('stroke', '#e74c3c')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrow)')
        .attr('class', 'direction-arrow');
    }
    
    // 添加坐标轴标签，使用淡灰色小号字体
    const axisGroup = svg.append('g').attr('class', 'axis-group');
    
    // 添加列索引 (j) - x轴
    for (let j = 0; j < cols; j++) {
      axisGroup
        .append('text')
        .attr('x', j * actualCellSize + actualCellSize / 2)
        .attr('y', -8)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#bbbbbb')  // 淡灰色
        .attr('font-size', actualCellSize / 4)  // 较小字体
        .text(j);
    }
    
    // 添加行索引 (i) - y轴
    for (let i = 0; i < rows; i++) {
      axisGroup
        .append('text')
        .attr('x', -10)
        .attr('y', i * actualCellSize + actualCellSize / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#bbbbbb')  // 淡灰色
        .attr('font-size', actualCellSize / 4)  // 较小字体
        .text(i);
    }
    
  }, [grid, width, height, cellSize, currentPosition, exploringDirection, showAnimation, containerSize]);
  
  return (
    <div ref={containerRef} className="island-grid-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default IslandGrid; 