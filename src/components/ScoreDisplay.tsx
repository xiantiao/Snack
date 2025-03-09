import React from 'react';

interface ScoreDisplayProps {
  score: number;
  highScore?: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, highScore }) => {
  return (
    <div className="score-display bg-gray-800 text-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between">
        <div className="current-score">
          <h3 className="text-sm font-semibold text-gray-400">当前得分</h3>
          <p className="text-3xl font-bold">{score}</p>
        </div>
        
        {highScore !== undefined && (
          <div className="high-score">
            <h3 className="text-sm font-semibold text-gray-400">最高得分</h3>
            <p className="text-3xl font-bold">{highScore}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay; 