'use client';

import React, { useState, useEffect, useRef } from 'react';
import MainMenu from '../components/MainMenu';
import GameScreen from '../components/GameScreen';
import GameSettings from '../components/GameSettings';
import Scoreboard from '../components/Scoreboard';
import GameInstructions from '../components/GameInstructions';
import { useGameLogic } from '../hooks/useGameLogic';
import { useHighScores, useGameSettings } from '../hooks/useLocalStorage';
import type { GameStatus } from '../types/game';

export default function Home() {
  // 游戏网格大小
  const gridSize = { width: 20, height: 20 };
  
  // 游戏状态
  const { gameState, startGame, pauseGame, resetGame, changeDirection, updateSettings: updateGameSettings } = useGameLogic(gridSize);
  
  // 本地存储钩子
  const { highScores, addHighScore, clearHighScores, resetAllData } = useHighScores();
  const { settings, updateSettings } = useGameSettings();
  
  // 界面状态
  const [currentScreen, setCurrentScreen] = useState<'MENU' | 'GAME' | 'SETTINGS' | 'SCOREBOARD' | 'INSTRUCTIONS'>('MENU');
  
  // 用于跟踪游戏结束状态，避免多次记录分数
  const gameOverProcessedRef = useRef(false);
  
  // 当游戏状态变为GAME_OVER时，记录最高分
  useEffect(() => {
    if (gameState.status === 'GAME_OVER' && gameState.score > 0 && !gameOverProcessedRef.current) {
      // 标记已处理，避免重复记录
      gameOverProcessedRef.current = true;
      
      try {
        addHighScore(gameState.score);
      } catch (error) {
        console.error('Failed to add high score:', error);
      }
    } else if (gameState.status !== 'GAME_OVER') {
      // 重置标记，为下一次游戏结束做准备
      gameOverProcessedRef.current = false;
    }
  }, [gameState.status, gameState.score, addHighScore]);
  
  // 同步游戏设置
  useEffect(() => {
    updateGameSettings(settings.difficulty, settings.soundEnabled);
  }, [settings, updateGameSettings]);
  
  // 处理开始游戏
  const handleStartGame = () => {
    resetGame();
    startGame();
    setCurrentScreen('GAME');
  };
  
  // 处理返回主菜单
  const handleBackToMenu = () => {
    resetGame();
    setCurrentScreen('MENU');
  };
  
  // 处理重新开始游戏
  const handleRestartGame = () => {
    resetGame();
    startGame();
  };
  
  // 处理打开设置
  const handleOpenSettings = () => {
    setCurrentScreen('SETTINGS');
  };
  
  // 处理打开排行榜
  const handleOpenScoreboard = () => {
    setCurrentScreen('SCOREBOARD');
  };
  
  // 处理打开游戏说明
  const handleOpenInstructions = () => {
    setCurrentScreen('INSTRUCTIONS');
  };
  
  // 处理关闭弹窗
  const handleCloseModal = () => {
    setCurrentScreen('MENU');
  };
  
  // 处理设置更新
  const handleSettingsUpdate = (newSettings: typeof settings) => {
    updateSettings(newSettings);
  };
  
  // 处理清除排行榜
  const handleClearScoreboard = () => {
    clearHighScores();
  };
  
  // 处理重置所有数据
  const handleResetAllData = () => {
    if (window.confirm('确定要重置所有数据吗？这将清除所有测试数据和游戏记录。')) {
      resetAllData();
    }
  };
  
  // 渲染当前界面
  const renderScreen = () => {
    switch (currentScreen) {
      case 'GAME':
        return (
          <GameScreen 
            gameState={gameState}
            highScore={highScores.length > 0 ? highScores[0].score : 0}
            onDirectionChange={changeDirection}
            onPause={pauseGame}
            onRestart={handleRestartGame}
            onHome={handleBackToMenu}
          />
        );
      case 'SETTINGS':
        return (
          <div className="modal-container fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <GameSettings 
              settings={settings}
              onSettingsChange={handleSettingsUpdate}
              onClose={handleCloseModal}
            />
          </div>
        );
      case 'SCOREBOARD':
        return (
          <div className="modal-container fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Scoreboard 
              highScores={highScores}
              onClose={handleCloseModal}
              onClear={handleClearScoreboard}
              onResetAll={handleResetAllData}
            />
          </div>
        );
      case 'INSTRUCTIONS':
        return (
          <div className="modal-container fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <GameInstructions 
              onClose={handleCloseModal}
            />
          </div>
        );
      case 'MENU':
      default:
        return (
          <MainMenu 
            onStartGame={handleStartGame}
            onOpenSettings={handleOpenSettings}
            onOpenScoreboard={handleOpenScoreboard}
            onOpenInstructions={handleOpenInstructions}
          />
        );
    }
  };
  
  return (
    <div className="game-container min-h-screen flex flex-col items-center justify-center p-4">
      {renderScreen()}
    </div>
  );
}
