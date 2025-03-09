import React from 'react';
import { Direction } from '../types/game';

interface ControlsProps {
  onDirectionChange: (direction: Direction) => void;
  onPause: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onDirectionChange, onPause }) => {
  return (
    <div className="controls-container mt-4">
      {/* 移动控制按钮 */}
      <div className="flex flex-col items-center gap-2">
        <button 
          className="w-16 h-12 bg-gray-700 text-white rounded-t-lg hover:bg-gray-600 focus:outline-none"
          onClick={() => onDirectionChange('UP')}
          aria-label="向上移动"
        >
          ↑
        </button>
        <div className="flex gap-2">
          <button 
            className="w-16 h-12 bg-gray-700 text-white rounded-l-lg hover:bg-gray-600 focus:outline-none"
            onClick={() => onDirectionChange('LEFT')}
            aria-label="向左移动"
          >
            ←
          </button>
          <button 
            className="w-16 h-12 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
            onClick={() => onPause()}
            aria-label="暂停游戏"
          >
            ||
          </button>
          <button 
            className="w-16 h-12 bg-gray-700 text-white rounded-r-lg hover:bg-gray-600 focus:outline-none"
            onClick={() => onDirectionChange('RIGHT')}
            aria-label="向右移动"
          >
            →
          </button>
        </div>
        <button 
          className="w-16 h-12 bg-gray-700 text-white rounded-b-lg hover:bg-gray-600 focus:outline-none"
          onClick={() => onDirectionChange('DOWN')}
          aria-label="向下移动"
        >
          ↓
        </button>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>也可以使用键盘方向键控制</p>
      </div>
    </div>
  );
};

export default Controls; 