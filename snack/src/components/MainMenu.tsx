import React from 'react';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenSettings: () => void;
  onOpenScoreboard: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ 
  onStartGame, 
  onOpenSettings, 
  onOpenScoreboard 
}) => {
  return (
    <div className="main-menu-container flex flex-col items-center justify-center min-h-[70vh] p-8">
      <h1 className="text-5xl font-bold mb-8 text-center">贪吃蛇</h1>
      
      <div className="snake-icon mb-10 text-6xl">🐍</div>
      
      <div className="menu-buttons flex flex-col gap-4 w-full max-w-xs">
        <button
          className="py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xl font-semibold"
          onClick={onStartGame}
        >
          开始游戏
        </button>
        
        <button
          className="py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={onOpenSettings}
        >
          设置
        </button>
        
        <button
          className="py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          onClick={onOpenScoreboard}
        >
          排行榜
        </button>
      </div>
      
      <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>使用方向键或屏幕按钮控制蛇的移动</p>
        <p>吃到食物得分，撞到墙壁或自身游戏结束</p>
      </div>
    </div>
  );
};

export default MainMenu; 