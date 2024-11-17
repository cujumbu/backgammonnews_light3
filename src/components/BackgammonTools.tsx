import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { motion } from 'framer-motion';

function VirtualDice({ onRoll }: { onRoll: (value: number) => void }) {
  const [value, setValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  const handleClick = () => {
    if (isRolling) return;
    setIsRolling(true);
    
    // Animate dice roll
    let rolls = 0;
    const maxRolls = 10;
    const interval = setInterval(() => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      setValue(newValue);
      rolls++;
      
      if (rolls >= maxRolls) {
        clearInterval(interval);
        setIsRolling(false);
        onRoll(newValue);
      }
    }, 100);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className={`w-16 h-16 bg-white dark:bg-gray-700 rounded-xl shadow-lg flex items-center justify-center text-2xl font-bold ${
        isRolling ? 'animate-spin' : ''
      }`}
    >
      {value}
    </motion.button>
  );
}

export default function BackgammonTools() {
  const [pipCount, setPipCount] = useState({ player1: 167, player2: 167 });
  const [diceValues, setDiceValues] = useState([1, 1]);
  const [gameStats, setGameStats] = useState([
    { date: '2024-02-01', rating: 1500 },
    { date: '2024-02-05', rating: 1550 },
    { date: '2024-02-10', rating: 1525 },
    { date: '2024-02-15', rating: 1575 },
    { date: '2024-02-20', rating: 1600 }
  ]);

  const chartData = {
    labels: gameStats.map(stat => stat.date),
    datasets: [{
      label: 'Rating Progress',
      data: gameStats.map(stat => stat.rating),
      fill: false,
      borderColor: 'rgb(37, 99, 235)',
      tension: 0.1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgb(17, 24, 39)',
        titleColor: 'rgb(243, 244, 246)',
        bodyColor: 'rgb(243, 244, 246)',
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const handleDiceRoll = (index: number, value: number) => {
    const newDiceValues = [...diceValues];
    newDiceValues[index] = value;
    setDiceValues(newDiceValues);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Pip Count Calculator */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-xl font-display font-semibold mb-4 text-gray-900 dark:text-white">Pip Count Calculator</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Player 1
            </label>
            <input
              type="number"
              value={pipCount.player1}
              onChange={(e) => setPipCount({ ...pipCount, player1: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Player 2
            </label>
            <input
              type="number"
              value={pipCount.player2}
              onChange={(e) => setPipCount({ ...pipCount, player2: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pip difference: <span className="font-semibold text-accent">{Math.abs(pipCount.player1 - pipCount.player2)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Virtual Dice */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-xl font-display font-semibold mb-4 text-gray-900 dark:text-white">Virtual Dice</h3>
        <div className="flex justify-center gap-8 py-8">
          <VirtualDice onRoll={(value) => handleDiceRoll(0, value)} />
          <VirtualDice onRoll={(value) => handleDiceRoll(1, value)} />
        </div>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Click the dice to roll
        </p>
        <div className="mt-4 text-center text-sm font-medium text-accent">
          Current roll: {diceValues[0]} - {diceValues[1]}
        </div>
      </div>

      {/* Rating Progress Chart */}
      <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-xl font-display font-semibold mb-4 text-gray-900 dark:text-white">Rating Progress</h3>
        <div className="h-[300px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
