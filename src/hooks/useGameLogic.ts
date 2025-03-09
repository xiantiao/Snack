import { useState, useEffect, useCallback, useRef } from 'react';
import { Direction, GameState, Point, GameStatus, Difficulty, Food, FoodType } from '../types/game';

// 根据难度设置游戏速度
const getDifficultySpeed = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'EASY': return 200;
    case 'MEDIUM': return 150;
    case 'HARD': return 100;
    default: return 150;
  }
};

// 音效类
class SoundManager {
  private static instance: SoundManager;
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;

  private constructor() {
    // 初始化音效
    this.sounds = {
      move: new Audio('/sounds/move.mp3'),
      eat: new Audio('/sounds/eat.mp3'),
      gameOver: new Audio('/sounds/game_over.mp3')
    };
    
    // 预加载音效
    Object.values(this.sounds).forEach(audio => {
      audio.load();
      audio.volume = 0.5;
    });
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public play(sound: 'move' | 'eat' | 'gameOver'): void {
    if (!this.enabled) return;
    
    const audio = this.sounds[sound];
    if (audio) {
      // 重置音频以便重新播放
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.error(`Failed to play sound: ${sound}`, error);
      });
    }
  }
}

// 初始游戏状态
const initialGameState = (gridSize: { width: number; height: number }): GameState => {
  // 蛇的初始位置在网格中央
  const centerX = Math.floor(gridSize.width / 2);
  const centerY = Math.floor(gridSize.height / 2);
  
  const initialSnakeBody = [
    { x: centerX, y: centerY },
    { x: centerX - 1, y: centerY },
    { x: centerX - 2, y: centerY }
  ];
  
  return {
    snake: {
      body: initialSnakeBody,
      direction: 'RIGHT'
    },
    food: generateFood(initialSnakeBody, gridSize),
    score: 0,
    status: 'NOT_STARTED',
    gridSize,
    settings: {
      difficulty: 'MEDIUM',
      soundEnabled: true
    },
    activeEffects: []
  };
};

// 生成食物的位置（不与蛇身重叠）
const generateFood = (snakeBody: Point[], gridSize: { width: number; height: number }): Food => {
  let newFood: Point;
  do {
    newFood = {
      x: Math.floor(Math.random() * gridSize.width),
      y: Math.floor(Math.random() * gridSize.height)
    };
  } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  
  // 随机生成食物类型
  const foodTypes: FoodType[] = ['NORMAL', 'SPEED', 'SLOW', 'BONUS'];
  const randomType = foodTypes[Math.floor(Math.random() * foodTypes.length)];
  
  // 根据类型设置食物属性
  switch (randomType) {
    case 'NORMAL':
      return {
        ...newFood,
        type: 'NORMAL',
        value: 1
      };
    case 'SPEED':
      return {
        ...newFood,
        type: 'SPEED',
        value: 1,
        effect: {
          type: 'SPEED',
          duration: 5000, // 5秒
          factor: 1.5 // 速度提高50%
        }
      };
    case 'SLOW':
      return {
        ...newFood,
        type: 'SLOW',
        value: 1,
        effect: {
          type: 'SLOW',
          duration: 5000, // 5秒
          factor: 0.7 // 速度降低30%
        }
      };
    case 'BONUS':
      return {
        ...newFood,
        type: 'BONUS',
        value: 3 // 3倍分数
      };
    default:
      return {
        ...newFood,
        type: 'NORMAL',
        value: 1
      };
  }
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
  const gameLoopRef = useRef<number | null>(null);
  const lastDirectionRef = useRef<Direction>(gameState.snake.direction);
  const lastUpdateTimeRef = useRef<number>(0);
  const speedRef = useRef<number>(getDifficultySpeed(gameState.settings.difficulty));
  const soundManagerRef = useRef<SoundManager>(SoundManager.getInstance());
  const lastMoveTimeRef = useRef<number>(0);
  const moveIntervalRef = useRef<number>(100); // 移动音效的最小间隔

  // 重置游戏
  const resetGame = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
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
    speedRef.current = getDifficultySpeed(difficulty);
    soundManagerRef.current.setEnabled(soundEnabled);
    setGameState(prevState => ({
      ...prevState,
      settings: {
        difficulty,
        soundEnabled
      }
    }));
  }, []);

  // 初始化音效设置
  useEffect(() => {
    soundManagerRef.current.setEnabled(gameState.settings.soundEnabled);
  }, [gameState.settings.soundEnabled]);

  // 游戏主循环
  useEffect(() => {
    if (gameState.status !== 'RUNNING') {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    // 更新速度引用
    let baseSpeed = getDifficultySpeed(gameState.settings.difficulty);
    
    // 应用活跃效果对速度的影响
    const now = performance.now();
    const activeSpeedEffects = gameState.activeEffects.filter(
      effect => (effect.type === 'SPEED' || effect.type === 'SLOW') && effect.endTime > now
    );
    
    // 计算速度修正因子
    let speedFactor = 1;
    activeSpeedEffects.forEach(effect => {
      speedFactor *= effect.factor;
    });
    
    // 应用速度修正
    speedRef.current = baseSpeed / speedFactor;
    
    const moveSnake = (timestamp: number) => {
      // 控制游戏速度
      if (timestamp - lastUpdateTimeRef.current < speedRef.current) {
        gameLoopRef.current = requestAnimationFrame(moveSnake);
        return;
      }
      
      lastUpdateTimeRef.current = timestamp;
      
      // 播放移动音效（限制频率）
      if (timestamp - lastMoveTimeRef.current > moveIntervalRef.current) {
        soundManagerRef.current.play('move');
        lastMoveTimeRef.current = timestamp;
      }
      
      setGameState(prevState => {
        const { snake, food, score, gridSize, activeEffects } = prevState;
        const head = snake.body[0];
        const direction = snake.direction;
        
        // 计算新的头部位置
        const newHead = getNextHead(head, direction);
        
        // 检查是否碰撞墙壁或自身
        if (isWallCollision(newHead, gridSize) || isSelfCollision(newHead, snake.body)) {
          // 播放游戏结束音效
          soundManagerRef.current.play('gameOver');
          return {
            ...prevState,
            status: 'GAME_OVER'
          };
        }
        
        // 创建新的蛇身体
        const newBody = [newHead, ...snake.body];
        
        // 检查是否吃到食物
        if (isEatingFood(newHead, food)) {
          // 播放吃食物音效
          soundManagerRef.current.play('eat');
          
          // 生成新的食物
          const newFood = generateFood(newBody, gridSize);
          
          // 更新活跃效果
          const now = performance.now();
          let newActiveEffects = [...activeEffects.filter(effect => effect.endTime > now)];
          
          // 如果食物有效果，添加到活跃效果列表
          if (food.effect) {
            newActiveEffects.push({
              type: food.effect.type,
              endTime: now + food.effect.duration,
              factor: food.effect.factor
            });
          }
          
          return {
            ...prevState,
            snake: {
              ...snake,
              body: newBody
            },
            food: newFood,
            score: score + food.value,
            activeEffects: newActiveEffects
          };
        } else {
          // 如果没有吃到食物，移除尾部
          newBody.pop();
          
          // 更新活跃效果（移除过期的效果）
          const now = performance.now();
          const newActiveEffects = activeEffects.filter(effect => effect.endTime > now);
          
          return {
            ...prevState,
            snake: {
              ...snake,
              body: newBody
            },
            activeEffects: newActiveEffects
          };
        }
      });
      
      // 如果游戏仍在运行，继续请求下一帧
      if (gameState.status === 'RUNNING') {
        gameLoopRef.current = requestAnimationFrame(moveSnake);
      }
    };

    // 启动游戏循环
    lastUpdateTimeRef.current = performance.now();
    gameLoopRef.current = requestAnimationFrame(moveSnake);
    
    // 清理函数
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState.status, gameState.settings.difficulty, gameState.activeEffects]);

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