import React from 'react';
import type { HighScore } from '../types/game';

interface ScoreboardProps {
  highScores: HighScore[];
  onClose: () => void;
  onClear?: () => void;
  onResetAll?: () => void;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ 
  highScores, 
  onClose, 
  onClear,
  onResetAll
}) => {
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="scoreboard-container bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">排行榜</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          aria-label="关闭"
        >
          ✕
        </button>
      </div>
      
      {highScores.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  排名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  得分
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  日期
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {highScores.map((score, index) => (
                <tr key={index} className={index === 0 ? "bg-yellow-50 dark:bg-yellow-900/20" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {score.score}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatDate(score.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>还没有记录，开始游戏创造你的最高分吧！</p>
        </div>
      )}
      
      <div className="mt-6 flex flex-col gap-3">
        <button
          className="py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={onClose}
        >
          返回
        </button>
        
        {onClear && highScores.length > 0 && (
          <button
            className="py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            onClick={onClear}
          >
            清除所有记录
          </button>
        )}
        
        {onResetAll && (
          <button
            className="py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
            onClick={onResetAll}
          >
            重置所有数据（清除测试数据）
          </button>
        )}
      </div>
    </div>
  );
};

export default Scoreboard; 