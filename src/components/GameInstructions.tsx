import React from 'react';

interface GameInstructionsProps {
  onClose: () => void;
}

const GameInstructions: React.FC<GameInstructionsProps> = ({ onClose }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">游戏说明</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">基本规则</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>使用方向键或滑动控制蛇的移动</li>
          <li>吃食物可以增加分数和蛇的长度</li>
          <li>撞到墙壁或自己的身体会导致游戏结束</li>
          <li>按空格键或点击暂停按钮可以暂停游戏</li>
        </ul>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">食物类型</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-red-500 mr-3 flex items-center justify-center">
              <span className="text-white font-bold"></span>
            </div>
            <div>
              <p className="font-semibold">普通食物</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">增加1分和蛇的长度</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-blue-500 mr-3 flex items-center justify-center">
              <span className="text-white font-bold">↑</span>
            </div>
            <div>
              <p className="font-semibold">加速食物</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">增加1分，并使蛇的速度提高50%，持续5秒</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-purple-500 mr-3 flex items-center justify-center">
              <span className="text-white font-bold">↓</span>
            </div>
            <div>
              <p className="font-semibold">减速食物</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">增加1分，并使蛇的速度降低30%，持续5秒</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-yellow-500 mr-3 flex items-center justify-center">
              <span className="text-white font-bold">+</span>
            </div>
            <div>
              <p className="font-semibold">奖励食物</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">增加3分和蛇的长度</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">难度设置</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="font-semibold">简单：</span>蛇的移动速度较慢</li>
          <li><span className="font-semibold">中等：</span>蛇的移动速度适中</li>
          <li><span className="font-semibold">困难：</span>蛇的移动速度较快</li>
        </ul>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">操作提示</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>在移动设备上，可以使用屏幕上的方向按钮或在滑动区域滑动来控制</li>
          <li>在电脑上，可以使用键盘方向键控制</li>
          <li>游戏会自动保存最高分记录</li>
        </ul>
      </div>
      
      <div className="flex justify-center">
        <button
          className="py-2 px-6 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          onClick={onClose}
        >
          明白了
        </button>
      </div>
    </div>
  );
};

export default GameInstructions; 