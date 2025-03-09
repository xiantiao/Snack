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

// 辅助函数：调整颜色明暗
const shadeColor = (color: string, percent: number): string => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.floor(R * (100 + percent) / 100);
  G = Math.floor(G * (100 + percent) / 100);
  B = Math.floor(B * (100 + percent) / 100);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  R = (R > 0) ? R : 0;
  G = (G > 0) ? G : 0;
  B = (B > 0) ? B : 0;

  return `#${(R.toString(16).padStart(2, '0'))}${(G.toString(16).padStart(2, '0'))}${(B.toString(16).padStart(2, '0'))}`;
};

const GameBoard: React.FC<GameBoardProps> = React.memo(({ gameState }) => {
  const { snake, food, gridSize, activeEffects } = gameState;
  const cellSize = 20; // 每个格子的大小（像素）
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // 计算画布尺寸
  const canvasWidth = gridSize.width * cellSize * 1.5; // 增加宽度以适应等角投影
  const canvasHeight = gridSize.height * cellSize * 1.2; // 增加高度以适应等角投影
  
  // 2.5D参数
  const tileHeight = 8; // 方块高度
  
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
    
    // 绘制2.5D网格
    drawIsometricGrid(ctx);
    
    // 绘制食物
    drawIsometricFood(ctx, food);
    
    // 绘制蛇
    drawIsometricSnake(ctx, snake, activeEffects);
    
    // 如果有活跃效果，显示效果指示器
    if (activeEffects.length > 0) {
      drawEffectIndicators(ctx, activeEffects);
    }
  }, [snake, food, gridSize, canvasWidth, canvasHeight, activeEffects]);
  
  // 绘制等角投影网格
  const drawIsometricGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    for (let y = 0; y < gridSize.height; y++) {
      for (let x = 0; x < gridSize.width; x++) {
        // 计算等角投影坐标
        const isoX = (x - y) * cellSize / 2 + canvasWidth / 2;
        const isoY = (x + y) * cellSize / 4 + 50; // 添加一些顶部边距
        
        // 绘制地板方块
        drawIsometricTile(ctx, isoX, isoY, cellSize, '#333', '#222');
      }
    }
  };
  
  // 绘制等角投影方块
  const drawIsometricTile = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    size: number, 
    borderColor: string, 
    fillColor: string
  ) => {
    const halfSize = size / 2;
    
    // 绘制顶面
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + halfSize, y - halfSize / 2);
    ctx.lineTo(x, y - size / 2);
    ctx.lineTo(x - halfSize, y - halfSize / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.stroke();
    
    // 绘制右侧面
    ctx.fillStyle = shadeColor(fillColor, -10); // 稍暗一些
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + halfSize, y - halfSize / 2);
    ctx.lineTo(x + halfSize, y - halfSize / 2 + tileHeight);
    ctx.lineTo(x, y + tileHeight);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // 绘制左侧面
    ctx.fillStyle = shadeColor(fillColor, -20); // 更暗一些
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - halfSize, y - halfSize / 2);
    ctx.lineTo(x - halfSize, y - halfSize / 2 + tileHeight);
    ctx.lineTo(x, y + tileHeight);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };
  
  // 绘制等角投影食物
  const drawIsometricFood = (ctx: CanvasRenderingContext2D, food: any) => {
    const foodColor = getFoodColor(food.type);
    
    // 计算等角投影坐标
    const isoX = (food.x - food.y) * cellSize / 2 + canvasWidth / 2;
    const isoY = (food.x + food.y) * cellSize / 4 + 50 - tileHeight; // 减去高度使其位于方块顶部
    
    // 绘制食物（球体）
    ctx.fillStyle = foodColor;
    ctx.beginPath();
    ctx.arc(isoX, isoY - cellSize / 4, cellSize / 3, 0, Math.PI * 2);
    ctx.fill();
    
    // 添加高光效果
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(isoX - cellSize / 8, isoY - cellSize / 4 - cellSize / 8, cellSize / 8, 0, Math.PI * 2);
    ctx.fill();
    
    // 为特殊食物添加标记
    if (food.type !== 'NORMAL') {
      ctx.fillStyle = '#FFF';
      ctx.font = `${cellSize / 3}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let symbol = '';
      switch (food.type) {
        case 'SPEED': symbol = '↑'; break;
        case 'SLOW': symbol = '↓'; break;
        case 'BONUS': symbol = '+'; break;
      }
      
      ctx.fillText(symbol, isoX, isoY - cellSize / 4);
    }
  };
  
  // 绘制等角投影蛇
  const drawIsometricSnake = (
    ctx: CanvasRenderingContext2D, 
    snake: { body: Point[], direction: string }, 
    activeEffects: any[]
  ) => {
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
    
    // 绘制蛇身
    snake.body.forEach((segment, index) => {
      // 计算等角投影坐标
      const isoX = (segment.x - segment.y) * cellSize / 2 + canvasWidth / 2;
      const isoY = (segment.x + segment.y) * cellSize / 4 + 50 - tileHeight; // 减去高度使其位于方块顶部
      
      if (index === 0) {
        // 蛇头
        drawIsometricCube(ctx, isoX, isoY, cellSize, headColor, snake.direction);
      } else {
        // 蛇身
        drawIsometricCube(ctx, isoX, isoY, cellSize * 0.9, bodyColor);
      }
    });
  };
  
  // 绘制等角投影立方体（蛇身段）
  const drawIsometricCube = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    size: number, 
    color: string,
    direction?: string
  ) => {
    const halfSize = size / 2;
    const cubeHeight = tileHeight * 1.5; // 立方体高度
    
    // 绘制顶面
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - cubeHeight);
    ctx.lineTo(x + halfSize, y - halfSize / 2 - cubeHeight);
    ctx.lineTo(x, y - size / 2 - cubeHeight);
    ctx.lineTo(x - halfSize, y - halfSize / 2 - cubeHeight);
    ctx.closePath();
    ctx.fill();
    
    // 绘制右侧面
    ctx.fillStyle = shadeColor(color, -10); // 稍暗一些
    ctx.beginPath();
    ctx.moveTo(x, y - cubeHeight);
    ctx.lineTo(x + halfSize, y - halfSize / 2 - cubeHeight);
    ctx.lineTo(x + halfSize, y - halfSize / 2);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();
    
    // 绘制左侧面
    ctx.fillStyle = shadeColor(color, -20); // 更暗一些
    ctx.beginPath();
    ctx.moveTo(x, y - cubeHeight);
    ctx.lineTo(x - halfSize, y - halfSize / 2 - cubeHeight);
    ctx.lineTo(x - halfSize, y - halfSize / 2);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();
    
    // 如果是蛇头，添加眼睛
    if (direction) {
      ctx.fillStyle = '#000';
      const eyeSize = size / 8;
      
      // 根据方向绘制眼睛
      switch (direction) {
        case 'UP':
          ctx.beginPath();
          ctx.arc(x - halfSize / 3, y - cubeHeight - size / 8, eyeSize, 0, Math.PI * 2);
          ctx.arc(x + halfSize / 3, y - cubeHeight - size / 8, eyeSize, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'DOWN':
          ctx.beginPath();
          ctx.arc(x - halfSize / 3, y - cubeHeight + size / 8, eyeSize, 0, Math.PI * 2);
          ctx.arc(x + halfSize / 3, y - cubeHeight + size / 8, eyeSize, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'LEFT':
          ctx.beginPath();
          ctx.arc(x - halfSize / 2, y - cubeHeight - size / 8, eyeSize, 0, Math.PI * 2);
          ctx.arc(x - halfSize / 2, y - cubeHeight + size / 8, eyeSize, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'RIGHT':
          ctx.beginPath();
          ctx.arc(x + halfSize / 2, y - cubeHeight - size / 8, eyeSize, 0, Math.PI * 2);
          ctx.arc(x + halfSize / 2, y - cubeHeight + size / 8, eyeSize, 0, Math.PI * 2);
          ctx.fill();
          break;
      }
    }
  };
  
  // 绘制效果指示器
  const drawEffectIndicators = (ctx: CanvasRenderingContext2D, activeEffects: any[]) => {
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
  };
  
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