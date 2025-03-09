import React, { useRef, useEffect, useCallback } from 'react';
import { GameState, Point, FoodType } from '../types/game';

interface GameBoardProps {
  gameState: GameState;
}

// 根据食物类型获取颜色
const getFoodColor = (type: FoodType): string => {
  switch (type) {
    case 'NORMAL': return '#F44336'; // 红色
    case 'SPEED': return '#2196F3';  // 蓝色
    case 'SLOW': return '#9C27B0';   // 紫色
    case 'BONUS': return '#FFC107';  // 黄色
    default: return '#F44336';
  }
};

const GameBoard: React.FC<GameBoardProps> = React.memo(({ gameState }) => {
  const { snake, food, gridSize, activeEffects } = gameState;
  const cellSize = 20; // 每个格子的大小（像素）
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // 计算画布尺寸
  const canvasWidth = gridSize.width * cellSize;
  const canvasHeight = gridSize.height * cellSize;
  
  // 绘制游戏画面
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 清空画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // 绘制背景
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // 绘制网格线
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    // 绘制垂直线
    for (let x = 1; x < gridSize.width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, canvasHeight);
      ctx.stroke();
    }
    
    // 绘制水平线
    for (let y = 1; y < gridSize.height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(canvasWidth, y * cellSize);
      ctx.stroke();
    }
    
    // 绘制食物
    const foodColor = getFoodColor(food.type);
    ctx.fillStyle = foodColor;
    ctx.beginPath();
    const foodX = food.x * cellSize + cellSize / 2;
    const foodY = food.y * cellSize + cellSize / 2;
    ctx.arc(foodX, foodY, cellSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    
    // 为特殊食物添加标记
    if (food.type !== 'NORMAL') {
      ctx.fillStyle = '#FFF';
      ctx.font = `${cellSize / 2}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let symbol = '';
      switch (food.type) {
        case 'SPEED': symbol = '↑'; break;
        case 'SLOW': symbol = '↓'; break;
        case 'BONUS': symbol = '+'; break;
      }
      
      ctx.fillText(symbol, foodX, foodY);
    }
    
    // 绘制蛇身
    const hasSpeedEffect = activeEffects.some(effect => 
      effect.type === 'SPEED' && effect.endTime > performance.now()
    );
    
    const hasSlowEffect = activeEffects.some(effect => 
      effect.type === 'SLOW' && effect.endTime > performance.now()
    );
    
    // 根据效果调整蛇的颜色
    let headColor = '#4CAF50'; // 默认蛇头颜色
    let bodyColor = '#8BC34A'; // 默认蛇身颜色
    
    if (hasSpeedEffect) {
      headColor = '#2196F3'; // 速度提升时蛇头为蓝色
      bodyColor = '#64B5F6'; // 速度提升时蛇身为浅蓝色
    } else if (hasSlowEffect) {
      headColor = '#9C27B0'; // 速度降低时蛇头为紫色
      bodyColor = '#CE93D8'; // 速度降低时蛇身为浅紫色
    }
    
    snake.body.forEach((segment, index) => {
      if (index === 0) {
        // 蛇头
        ctx.fillStyle = headColor;
        ctx.fillRect(
          segment.x * cellSize + 1, 
          segment.y * cellSize + 1, 
          cellSize - 2, 
          cellSize - 2
        );
        
        // 绘制蛇眼睛
        ctx.fillStyle = '#000';
        const eyeSize = cellSize / 6;
        const eyeOffset = cellSize / 4;
        
        // 根据方向绘制眼睛
        switch (snake.direction) {
          case 'UP':
            ctx.fillRect(segment.x * cellSize + eyeOffset, segment.y * cellSize + eyeOffset, eyeSize, eyeSize);
            ctx.fillRect(segment.x * cellSize + cellSize - eyeOffset - eyeSize, segment.y * cellSize + eyeOffset, eyeSize, eyeSize);
            break;
          case 'DOWN':
            ctx.fillRect(segment.x * cellSize + eyeOffset, segment.y * cellSize + cellSize - eyeOffset - eyeSize, eyeSize, eyeSize);
            ctx.fillRect(segment.x * cellSize + cellSize - eyeOffset - eyeSize, segment.y * cellSize + cellSize - eyeOffset - eyeSize, eyeSize, eyeSize);
            break;
          case 'LEFT':
            ctx.fillRect(segment.x * cellSize + eyeOffset, segment.y * cellSize + eyeOffset, eyeSize, eyeSize);
            ctx.fillRect(segment.x * cellSize + eyeOffset, segment.y * cellSize + cellSize - eyeOffset - eyeSize, eyeSize, eyeSize);
            break;
          case 'RIGHT':
            ctx.fillRect(segment.x * cellSize + cellSize - eyeOffset - eyeSize, segment.y * cellSize + eyeOffset, eyeSize, eyeSize);
            ctx.fillRect(segment.x * cellSize + cellSize - eyeOffset - eyeSize, segment.y * cellSize + cellSize - eyeOffset - eyeSize, eyeSize, eyeSize);
            break;
        }
      } else {
        // 蛇身
        ctx.fillStyle = bodyColor;
        ctx.fillRect(
          segment.x * cellSize + 2, 
          segment.y * cellSize + 2, 
          cellSize - 4, 
          cellSize - 4
        );
      }
    });
    
    // 如果有活跃效果，显示效果指示器
    if (activeEffects.length > 0) {
      const now = performance.now();
      activeEffects.forEach((effect, index) => {
        if (effect.endTime > now) {
          // 计算剩余时间比例
          const remainingTime = effect.endTime - now;
          const maxDuration = 5000; // 假设最大持续时间为5秒
          const ratio = Math.min(remainingTime / maxDuration, 1);
          
          // 绘制效果指示器
          ctx.fillStyle = effect.type === 'SPEED' ? '#2196F3' : 
                          effect.type === 'SLOW' ? '#9C27B0' : '#4CAF50';
          
          const indicatorWidth = 50;
          const indicatorHeight = 5;
          const padding = 10;
          
          ctx.fillRect(
            padding, 
            padding + (indicatorHeight + 5) * index, 
            indicatorWidth * ratio, 
            indicatorHeight
          );
          
          // 绘制效果图标
          ctx.font = '10px Arial';
          ctx.fillText(
            effect.type === 'SPEED' ? '↑' : 
            effect.type === 'SLOW' ? '↓' : '+',
            padding + indicatorWidth + 5,
            padding + (indicatorHeight + 5) * index + indicatorHeight
          );
        }
      });
    }
  }, [snake, food, gridSize, canvasWidth, canvasHeight, activeEffects]);
  
  // 当游戏状态变化时重新绘制
  useEffect(() => {
    drawGame();
  }, [drawGame, gameState]);
  
  return (
    <div className="game-board-container flex justify-center items-center">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="border-2 border-gray-600"
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // 只有当蛇、食物、游戏状态或活跃效果发生变化时才重新渲染
  const prevSnake = prevProps.gameState.snake;
  const nextSnake = nextProps.gameState.snake;
  const prevFood = prevProps.gameState.food;
  const nextFood = nextProps.gameState.food;
  const prevStatus = prevProps.gameState.status;
  const nextStatus = nextProps.gameState.status;
  const prevEffects = prevProps.gameState.activeEffects;
  const nextEffects = nextProps.gameState.activeEffects;
  
  // 检查蛇头位置是否变化
  const headChanged = 
    prevSnake.body[0].x !== nextSnake.body[0].x || 
    prevSnake.body[0].y !== nextSnake.body[0].y;
  
  // 检查蛇长度是否变化
  const lengthChanged = prevSnake.body.length !== nextSnake.body.length;
  
  // 检查食物位置或类型是否变化
  const foodChanged = 
    prevFood.x !== nextFood.x || 
    prevFood.y !== nextFood.y ||
    prevFood.type !== nextFood.type;
  
  // 检查游戏状态是否变化
  const statusChanged = prevStatus !== nextStatus;
  
  // 检查方向是否变化
  const directionChanged = prevSnake.direction !== nextSnake.direction;
  
  // 检查活跃效果是否变化
  const effectsChanged = 
    prevEffects.length !== nextEffects.length ||
    prevEffects.some((effect, index) => 
      index >= nextEffects.length || 
      effect.type !== nextEffects[index].type ||
      effect.endTime !== nextEffects[index].endTime
    );
  
  return !(headChanged || lengthChanged || foodChanged || statusChanged || directionChanged || effectsChanged);
});

export default GameBoard; 