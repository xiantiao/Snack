export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type Point = {
  x: number;
  y: number;
};

export type Snake = {
  body: Point[];
  direction: Direction;
};

export type FoodType = 'NORMAL' | 'SPEED' | 'SLOW' | 'BONUS';

export type Food = Point & {
  type: FoodType;
  value: number; // 食物的分数价值
  effect?: {
    type: 'SPEED' | 'SLOW' | 'GROW'; // 效果类型
    duration: number; // 效果持续时间（毫秒）
    factor: number; // 效果因子（如速度变化的倍数）
  };
};

export type GameStatus = 'NOT_STARTED' | 'RUNNING' | 'PAUSED' | 'GAME_OVER';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type GameSettings = {
  difficulty: Difficulty;
  soundEnabled: boolean;
};

export type GameState = {
  snake: Snake;
  food: Food;
  score: number;
  status: GameStatus;
  gridSize: {
    width: number;
    height: number;
  };
  settings: GameSettings;
  activeEffects: Array<{
    type: 'SPEED' | 'SLOW' | 'GROW';
    endTime: number;
    factor: number;
  }>;
};

export type HighScore = {
  score: number;
  date: string;
}; 