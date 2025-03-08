export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type Point = {
  x: number;
  y: number;
};

export type Snake = {
  body: Point[];
  direction: Direction;
};

export type Food = Point;

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
};

export type HighScore = {
  score: number;
  date: string;
}; 