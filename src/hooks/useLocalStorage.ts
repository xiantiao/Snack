import { useState, useEffect, useCallback } from 'react';
import { HighScore, GameSettings, Difficulty } from '../types/game';

// 保存最高分
export const useHighScores = () => {
  const [highScores, setHighScores] = useState<HighScore[]>([]);

  // 从本地存储加载最高分
  useEffect(() => {
    const storedScores = localStorage.getItem('snakeHighScores');
    if (storedScores) {
      try {
        setHighScores(JSON.parse(storedScores));
      } catch (error) {
        console.error('Failed to parse high scores:', error);
        setHighScores([]);
      }
    } else {
      // 如果没有存储的分数，确保状态为空数组
      setHighScores([]);
    }
  }, []);

  // 添加新的最高分
  const addHighScore = useCallback((score: number) => {
    if (score <= 0) return; // 忽略零分或负分
    
    try {
      const newScore: HighScore = {
        score,
        date: new Date().toISOString()
      };

      setHighScores(prevScores => {
        // 确保prevScores是一个数组
        const validPrevScores = Array.isArray(prevScores) ? prevScores : [];
        
        const updatedScores = [...validPrevScores, newScore]
          .sort((a, b) => b.score - a.score)
          .slice(0, 10); // 只保留前10个最高分
        
        // 保存到本地存储
        try {
          localStorage.setItem('snakeHighScores', JSON.stringify(updatedScores));
        } catch (storageError) {
          console.error('Failed to save high scores to localStorage:', storageError);
        }
        
        return updatedScores;
      });
    } catch (error) {
      console.error('Error in addHighScore:', error);
    }
  }, []);

  // 清除所有高分记录
  const clearHighScores = useCallback(() => {
    localStorage.removeItem('snakeHighScores');
    setHighScores([]);
  }, []);

  return { highScores, addHighScore, clearHighScores };
};

// 保存游戏设置
export const useGameSettings = () => {
  const defaultSettings: GameSettings = {
    difficulty: 'MEDIUM' as Difficulty,
    soundEnabled: true
  };

  const [settings, setSettings] = useState<GameSettings>(defaultSettings);

  // 从本地存储加载设置
  useEffect(() => {
    const storedSettings = localStorage.getItem('snakeGameSettings');
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (error) {
        console.error('Failed to parse game settings:', error);
        setSettings(defaultSettings);
      }
    }
  }, []);

  // 更新设置
  const updateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    localStorage.setItem('snakeGameSettings', JSON.stringify(newSettings));
  };

  return { settings, updateSettings };
}; 