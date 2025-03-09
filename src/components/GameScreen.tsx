import React, { useEffect } from 'react';
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
  // 当游戏状态为RUNNING时，监听键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.status !== 'RUNNING') return;
      
      switch (e.key) {
        case 'ArrowUp':
          onDirectionChange('UP');
          break;
        case 'ArrowDown':
          onDirectionChange('DOWN');
          break;
        case 'ArrowLeft':
          onDirectionChange('LEFT');
          break;
        case 'ArrowRight':
          onDirectionChange('RIGHT');
          break;
        case ' ':
          onPause();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status, onDirectionChange, onPause]);
  
  return (
    <div className="game-screen flex flex-col items-center justify-center w-full h-full">
      <div className="game-header mb-4 w-full flex justify-between items-center">
        <ScoreDisplay score={gameState.score} highScore={highScore} />
        <button 
          onClick={onPause} 
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          {gameState.status === 'PAUSED' ? '继续' : '暂停'}
        </button>
      </div>
      
      <div className="game-container relative flex justify-center items-center mb-4">
        <div className="game-board-wrapper relative">
          <GameBoard gameState={gameState} />
          {gameState.status === 'GAME_OVER' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <GameOver 
                score={gameState.score} 
                onRestart={onRestart} 
                onHome={onHome}
              />
            </div>
          )}
          {gameState.status === 'PAUSED' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-white text-2xl font-bold p-4 rounded bg-gray-800 bg-opacity-80">
                游戏暂停
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="game-controls mt-4">
        <Controls onDirectionChange={onDirectionChange} onPause={onPause} />
      </div>
    </div>
  );
};

export default GameScreen; 