import { useState, useEffect, useCallback } from 'react';
import { HighScore, GameSettings, Difficulty } from '../types/game';

// 本地存储键名
const HIGH_SCORES_KEY = 'snakeHighScores';
const GAME_SETTINGS_KEY = 'snakeGameSettings';
const INITIALIZED_KEY = 'snakeGameInitialized';

// 保存最高分
export const useHighScores = () => {
  const [highScores, setHighScores] = useState<HighScore[]>([]);

  // 初始化函数 - 检查是否需要清除测试数据
  const initializeStorage = useCallback(() => {
    const isInitialized = localStorage.getItem(INITIALIZED_KEY);
    
    // 如果是第一次运行，清除可能存在的测试数据
    if (!isInitialized) {
      localStorage.removeItem(HIGH_SCORES_KEY);
      localStorage.setItem(INITIALIZED_KEY, 'true');
      return [];
    }
    
    // 否则加载现有数据
    const storedScores = localStorage.getItem(HIGH_SCORES_KEY);
    if (storedScores) {
      try {
        return JSON.parse(storedScores);
      } catch (error) {
        console.error('Failed to parse high scores:', error);
        return [];
      }
    }
    
    return [];
  }, []);

  // 从本地存储加载最高分
  useEffect(() => {
    const scores = initializeStorage();
    setHighScores(scores);
  }, [initializeStorage]);

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
          localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(updatedScores));
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
    localStorage.removeItem(HIGH_SCORES_KEY);
    setHighScores([]);
  }, []);

  // 重置所有数据（包括初始化标志）
  const resetAllData = useCallback(() => {
    localStorage.removeItem(HIGH_SCORES_KEY);
    localStorage.removeItem(INITIALIZED_KEY);
    setHighScores([]);
  }, []);

  return { highScores, addHighScore, clearHighScores, resetAllData };
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
    const storedSettings = localStorage.getItem(GAME_SETTINGS_KEY);
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
    localStorage.setItem(GAME_SETTINGS_KEY, JSON.stringify(newSettings));
  };

  return { settings, updateSettings };
}; 