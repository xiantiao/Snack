import React, { useRef, useEffect, useState } from 'react';
import { Direction } from '../types/game';

interface ControlsProps {
  onDirectionChange: (direction: Direction) => void;
  onPause: () => void;
}

interface TouchPosition {
  x: number;
  y: number;
}

const Controls: React.FC<ControlsProps> = ({ onDirectionChange, onPause }) => {
  const touchAreaRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<Direction | null>(null);
  
  // 处理滑动手势
  useEffect(() => {
    const touchArea = touchAreaRef.current;
    if (!touchArea) return;
    
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setTouchStart({
        x: touch.clientX,
        y: touch.clientY
      });
      setSwipeDirection(null);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      
      // 确定主要的滑动方向
      if (Math.abs(deltaX) > 30 || Math.abs(deltaY) > 30) {
        let direction: Direction;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // 水平滑动
          direction = deltaX > 0 ? 'RIGHT' : 'LEFT';
        } else {
          // 垂直滑动
          direction = deltaY > 0 ? 'DOWN' : 'UP';
        }
        
        if (swipeDirection !== direction) {
          setSwipeDirection(direction);
          onDirectionChange(direction);
        }
      }
    };
    
    const handleTouchEnd = () => {
      setTouchStart(null);
      setSwipeDirection(null);
    };
    
    // 添加事件监听器
    touchArea.addEventListener('touchstart', handleTouchStart);
    touchArea.addEventListener('touchmove', handleTouchMove);
    touchArea.addEventListener('touchend', handleTouchEnd);
    
    // 清理函数
    return () => {
      touchArea.removeEventListener('touchstart', handleTouchStart);
      touchArea.removeEventListener('touchmove', handleTouchMove);
      touchArea.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart, swipeDirection, onDirectionChange]);
  
  return (
    <div className="controls-container mt-4">
      {/* 滑动区域 */}
      <div 
        ref={touchAreaRef}
        className="touch-area w-full h-40 mb-4 rounded-lg bg-gray-800/10 flex items-center justify-center"
      >
        <div className="text-center text-gray-500">
          <p className="mb-2">滑动区域</p>
          <p className="text-sm">在此区域滑动来控制蛇的方向</p>
          {swipeDirection && (
            <div className="mt-2 font-bold">
              当前方向: {
                swipeDirection === 'UP' ? '↑' :
                swipeDirection === 'DOWN' ? '↓' :
                swipeDirection === 'LEFT' ? '←' : '→'
              }
            </div>
          )}
        </div>
      </div>
      
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