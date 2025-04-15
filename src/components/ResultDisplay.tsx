import React from 'react';

interface ResultDisplayProps {
  islandCount: number | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ islandCount }) => {
  if (islandCount === null) {
    return null;
  }
  
  return (
    <div className="result">
      岛屿数量: <span className="count">{islandCount}</span>
    </div>
  );
};

export default ResultDisplay; 