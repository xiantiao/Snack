import React from 'react';
import type { Difficulty, GameSettings } from '../types/game';

interface GameSettingsProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onClose: () => void;
}

const GameSettings: React.FC<GameSettingsProps> = ({ 
  settings, 
  onSettingsChange,
  onClose
}) => {
  const handleDifficultyChange = (difficulty: Difficulty) => {
    onSettingsChange({
      ...settings,
      difficulty
    });
  };

  const handleSoundToggle = () => {
    onSettingsChange({
      ...settings,
      soundEnabled: !settings.soundEnabled
    });
  };

  return (
    <div className="settings-container bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">游戏设置</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          aria-label="关闭"
        >
          ✕
        </button>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">难度</h3>
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-md ${
              settings.difficulty === 'EASY' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => handleDifficultyChange('EASY')}
          >
            简单
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              settings.difficulty === 'MEDIUM' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => handleDifficultyChange('MEDIUM')}
          >
            中等
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              settings.difficulty === 'HARD' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => handleDifficultyChange('HARD')}
          >
            困难
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">音效</h3>
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={settings.soundEnabled}
              onChange={handleSoundToggle}
            />
            <div className={`block w-14 h-8 rounded-full ${
              settings.soundEnabled ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
              settings.soundEnabled ? 'transform translate-x-6' : ''
            }`}></div>
          </div>
          <span className="ml-3">
            {settings.soundEnabled ? '开启' : '关闭'}
          </span>
        </label>
      </div>
      
      <button
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        onClick={onClose}
      >
        保存设置
      </button>
    </div>
  );
};

export default GameSettings; 