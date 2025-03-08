import { useState, useEffect, useCallback, useRef } from 'react';
import { Direction, GameState, Point, GameStatus, Difficulty } from '../types/game';

// 根据难度设置游戏速度
const getDifficultySpeed = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'EASY': return 200;
    case 'MEDIUM': return 150;
    case 'HARD': return 100;
    default: return 150;
  }
};

// 初始游戏状态
const initialGameState = (gridSize: { width: number; height: number }): GameState => {
  // 蛇的初始位置在网格中央
  const centerX = Math.floor(gridSize.width / 2);
  const centerY = Math.floor(gridSize.height / 2);
  
  return {
    snake: {
      body: [
        { x: centerX, y: centerY },
        { x: centerX - 1, y: centerY },
        { x: centerX - 2, y: centerY }
      ],
      direction: 'RIGHT'
    },
    food: generateFood(
      [{ x: centerX, y: centerY }, { x: centerX - 1, y: centerY }, { x: centerX - 2, y: centerY }],
      gridSize
    ),
    score: 0,
    status: 'NOT_STARTED',
    gridSize,
    settings: {
      difficulty: 'MEDIUM',
      soundEnabled: true
    }
  };
};

// 生成食物的位置（不与蛇身重叠）
const generateFood = (snakeBody: Point[], gridSize: { width: number; height: number }): Point => {
  let newFood: Point;
  do {
    newFood = {
      x: Math.floor(Math.random() * gridSize.width),
      y: Math.floor(Math.random() * gridSize.height)
    };
  } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  
  return newFood;
};

// 检查是否碰撞墙壁
const isWallCollision = (head: Point, gridSize: { width: number; height: number }): boolean => {
  return (
    head.x < 0 || 
    head.y < 0 || 
    head.x >= gridSize.width || 
    head.y >= gridSize.height
  );
};

// 检查是否碰撞自身
const isSelfCollision = (head: Point, body: Point[]): boolean => {
  return body.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
};

// 检查是否吃到食物
const isEatingFood = (head: Point, food: Point): boolean => {
  return head.x === food.x && head.y === food.y;
};

// 根据方向获取下一个头部位置
const getNextHead = (currentHead: Point, direction: Direction): Point => {
  switch (direction) {
    case 'UP':
      return { x: currentHead.x, y: currentHead.y - 1 };
    case 'DOWN':
      return { x: currentHead.x, y: currentHead.y + 1 };
    case 'LEFT':
      return { x: currentHead.x - 1, y: currentHead.y };
    case 'RIGHT':
      return { x: currentHead.x + 1, y: currentHead.y };
    default:
      return currentHead;
  }
};

export const useGameLogic = (gridSize: { width: number; height: number }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState(gridSize));
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const lastDirectionRef = useRef<Direction>(gameState.snake.direction);

  // 重置游戏
  const resetGame = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    setGameState(initialGameState(gridSize));
  }, [gridSize]);

  // 开始游戏
  const startGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      status: 'RUNNING'
    }));
  }, []);

  // 暂停游戏
  const pauseGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      status: prevState.status === 'RUNNING' ? 'PAUSED' : 'RUNNING'
    }));
  }, []);

  // 改变蛇的方向
  const changeDirection = useCallback((newDirection: Direction) => {
    // 防止180度转向
    const currentDirection = lastDirectionRef.current;
    if (
      (currentDirection === 'UP' && newDirection === 'DOWN') ||
      (currentDirection === 'DOWN' && newDirection === 'UP') ||
      (currentDirection === 'LEFT' && newDirection === 'RIGHT') ||
      (currentDirection === 'RIGHT' && newDirection === 'LEFT')
    ) {
      return;
    }

    setGameState(prevState => ({
      ...prevState,
      snake: {
        ...prevState.snake,
        direction: newDirection
      }
    }));
    lastDirectionRef.current = newDirection;
  }, []);

  // 更新游戏设置
  const updateSettings = useCallback((difficulty: Difficulty, soundEnabled: boolean) => {
    setGameState(prevState => ({
      ...prevState,
      settings: {
        difficulty,
        soundEnabled
      }
    }));
  }, []);

  // 游戏主循环
  useEffect(() => {
    if (gameState.status !== 'RUNNING') {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const moveSnake = () => {
      setGameState(prevState => {
        const { snake, food, score, gridSize } = prevState;
        const head = snake.body[0];
        const direction = snake.direction;
        
        // 计算新的头部位置
        const newHead = getNextHead(head, direction);
        
        // 检查是否碰撞墙壁或自身
        if (isWallCollision(newHead, gridSize) || isSelfCollision(newHead, snake.body)) {
          return {
            ...prevState,
            status: 'GAME_OVER'
          };
        }
        
        // 创建新的蛇身体
        const newBody = [newHead, ...snake.body];
        
        // 检查是否吃到食物
        if (isEatingFood(newHead, food)) {
          // 生成新的食物
          const newFood = generateFood(newBody, gridSize);
          return {
            ...prevState,
            snake: {
              ...snake,
              body: newBody
            },
            food: newFood,
            score: score + 1
          };
        } else {
          // 如果没有吃到食物，移除尾部
          newBody.pop();
          return {
            ...prevState,
            snake: {
              ...snake,
              body: newBody
            }
          };
        }
      });
    };

    // 设置游戏循环
    gameLoopRef.current = setInterval(moveSnake, getDifficultySpeed(gameState.settings.difficulty));
    
    // 清理函数
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState.status, gameState.settings.difficulty]);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.status !== 'RUNNING') return;
      
      switch (e.key) {
        case 'ArrowUp':
          changeDirection('UP');
          break;
        case 'ArrowDown':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
          changeDirection('RIGHT');
          break;
        case ' ':
          pauseGame();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [changeDirection, pauseGame, gameState.status]);

  return {
    gameState,
    startGame,
    pauseGame,
    resetGame,
    changeDirection,
    updateSettings
  };
}; 