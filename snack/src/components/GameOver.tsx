import React from 'react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
  onHome: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart, onHome }) => {
  return (
    <div className="game-over-container bg-black/70 absolute inset-0 flex items-center justify-center z-10">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-2">游戏结束</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">你的蛇撞到了障碍物</p>
        
        <div className="score-display mb-8">
          <h3 className="text-lg text-gray-500 dark:text-gray-400">最终得分</h3>
          <p className="text-5xl font-bold">{score}</p>
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            className="py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            onClick={onRestart}
          >
            再来一局
          </button>
          <button
            className="py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            onClick={onHome}
          >
            返回主界面
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver; 