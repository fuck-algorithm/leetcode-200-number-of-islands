import React from 'react';
import GridControls from './GridControls';
import AlgorithmSelector from './AlgorithmSelector';
import CustomGridInput from './CustomGridInput';
import ResultDisplay from './ResultDisplay';
import Legend from './Legend';

interface ControlPanelProps {
  rows: number;
  cols: number;
  landProbability: number;
  algorithm: 'dfs' | 'bfs';
  customGridInput: string;
  islandCount: number | null;
  onRowsChange: (rows: number) => void;
  onColsChange: (cols: number) => void;
  onLandProbabilityChange: (prob: number) => void;
  onGenerateRandomGrid: () => void;
  onExample1: () => void;
  onExample2: () => void;
  onAlgorithmChange: (algorithm: 'dfs' | 'bfs') => void;
  onCustomGridInputChange: (value: string) => void;
  onCustomGridSubmit: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  rows,
  cols,
  landProbability,
  algorithm,
  customGridInput,
  islandCount,
  onRowsChange,
  onColsChange,
  onLandProbabilityChange,
  onGenerateRandomGrid,
  onExample1,
  onExample2,
  onAlgorithmChange,
  onCustomGridInputChange,
  onCustomGridSubmit
}) => {
  return (
    <div className="left-column">
      <div className="controls">
        <GridControls 
          rows={rows}
          cols={cols}
          landProbability={landProbability}
          onRowsChange={onRowsChange}
          onColsChange={onColsChange}
          onLandProbabilityChange={onLandProbabilityChange}
          onGenerateRandomGrid={onGenerateRandomGrid}
          onExample1={onExample1}
          onExample2={onExample2}
        />
        
        <AlgorithmSelector 
          algorithm={algorithm}
          onAlgorithmChange={onAlgorithmChange}
        />
        
        <CustomGridInput 
          value={customGridInput}
          onChange={onCustomGridInputChange}
          onSubmit={onCustomGridSubmit}
        />
        
        <ResultDisplay islandCount={islandCount} />
      </div>
      
      <Legend />
    </div>
  );
};

export default ControlPanel; 