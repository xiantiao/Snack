import React from 'react';
import { GameState, Point } from '../types/game';

interface GameBoardProps {
  gameState: GameState;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const { snake, food, gridSize } = gameState;
  const cellSize = 20; // 每个格子的大小（像素）

  // 计算游戏区域的样式
  const boardStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridSize.width}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${gridSize.height}, ${cellSize}px)`,
    gap: '1px',
    backgroundColor: '#333',
    border: '2px solid #555',
    width: `${gridSize.width * cellSize + (gridSize.width - 1)}px`,
    height: `${gridSize.height * cellSize + (gridSize.height - 1)}px`,
  };

  // 渲染单个格子
  const renderCell = (x: number, y: number) => {
    // 检查是否是蛇头
    const isHead = snake.body[0].x === x && snake.body[0].y === y;
    
    // 检查是否是蛇身
    const isBody = snake.body.some((segment, index) => 
      index > 0 && segment.x === x && segment.y === y
    );
    
    // 检查是否是食物
    const isFood = food.x === x && food.y === y;
    
    // 设置格子的样式
    let cellStyle = {
      width: `${cellSize}px`,
      height: `${cellSize}px`,
      backgroundColor: '#222', // 默认背景色
      borderRadius: '0',
    };
    
    if (isHead) {
      cellStyle.backgroundColor = '#4CAF50'; // 蛇头颜色
      cellStyle.borderRadius = '4px';
    } else if (isBody) {
      cellStyle.backgroundColor = '#8BC34A'; // 蛇身颜色
    } else if (isFood) {
      cellStyle.backgroundColor = '#F44336'; // 食物颜色
      cellStyle.borderRadius = '50%';
    }
    
    return (
      <div 
        key={`${x}-${y}`} 
        style={cellStyle}
      />
    );
  };

  // 创建所有格子
  const cells = [];
  for (let y = 0; y < gridSize.height; y++) {
    for (let x = 0; x < gridSize.width; x++) {
      cells.push(renderCell(x, y));
    }
  }

  return (
    <div className="game-board-container flex justify-center items-center">
      <div style={boardStyle}>
        {cells}
      </div>
    </div>
  );
};

export default GameBoard; 