import React from 'react';
import GameBoard from './GameBoard';
import Controls from './Controls';
import ScoreDisplay from './ScoreDisplay';
import GameOver from './GameOver';
import type { GameState, Direction } from '../types/game';

interface GameScreenProps {
  gameState: GameState;
  highScore: number;
  onDirectionChange: (direction: Direction) => void;
  onPause: () => void;
  onRestart: () => void;
  onHome: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  gameState,
  highScore,
  onDirectionChange,
  onPause,
  onRestart,
  onHome
}) => {
  return (
    <div className="game-screen-container relative flex flex-col items-center justify-center p-4">
      <div className="game-header w-full max-w-lg mb-4">
        <ScoreDisplay score={gameState.score} highScore={highScore} />
      </div>
      
      <div className="game-content relative">
        <GameBoard gameState={gameState} />
        
        {gameState.status === 'GAME_OVER' && (
          <GameOver 
            score={gameState.score} 
            onRestart={onRestart} 
            onHome={onHome} 
          />
        )}
      </div>
      
      <div className="game-controls mt-6">
        <Controls onDirectionChange={onDirectionChange} onPause={onPause} />
      </div>
      
      {gameState.status === 'PAUSED' && (
        <div className="pause-overlay bg-black/50 absolute inset-0 flex items-center justify-center z-5">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">游戏暂停</h2>
            <button
              className="py-2 px-6 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              onClick={onPause}
            >
              继续游戏
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen; 