import React, { useEffect, useRef, useState } from 'react';
import pkg from 'tsgammon-core';
const { boardStateNodeFromArray, collectMoves, boardStateNode, boardState, diceRoll } = pkg;

export default function BackgammonGame() {
  const [gameState, setGameState] = useState<any>(null);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [legalMoves, setLegalMoves] = useState<any[]>([]);
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const initialState = boardStateNode(boardState(), diceRoll(dice[0], dice[1]));
    setGameState(initialState);
    setSelectedPoint(null);
    setLegalMoves([]);
  };

  useEffect(() => {
    if (gameState && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBoard(ctx, canvas.width, canvas.height);
        drawPosition(ctx, gameState.board, canvas.width, canvas.height);
        drawDice(ctx, canvas.width, canvas.height);
        
        if (selectedPoint !== null) {
          highlightPoint(ctx, selectedPoint, canvas.width, canvas.height);
          legalMoves.forEach(move => {
            highlightLegalMove(ctx, move.to, canvas.width, canvas.height);
          });
        }
      }
    }
  }, [gameState, selectedPoint, legalMoves, dice]);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameState || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    
    const point = getClickedPoint(x, y, canvas.width, canvas.height);
    
    if (point !== null) {
      if (selectedPoint === null) {
        if (gameState.board.points[point] > 0) {
          setSelectedPoint(point);
          const moves = collectMoves(gameState)
            .filter(move => !move.isRedundant)
            .flatMap(move => move.moves)
            .filter(move => move.from === point);
          setLegalMoves(moves);
        }
      } else {
        const move = legalMoves.find(m => m.to === point);
        if (move) {
          const newState = boardStateNode(
            gameState.board.makeMove(move),
            diceRoll(dice[0], dice[1])
          );
          setGameState(newState);
        }
        setSelectedPoint(null);
        setLegalMoves([]);
      }
    }
  };

  const rollDice = () => {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    setDice([dice1, dice2]);
    
    const newState = boardStateNode(
      gameState ? gameState.board : boardState(),
      diceRoll(dice1, dice2)
    );
    setGameState(newState);
    setSelectedPoint(null);
    setLegalMoves([]);
  };

  const drawBoard = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Board background
    ctx.fillStyle = '#E6D5AC';
    ctx.fillRect(0, 0, width, height);
    
    // Bar line
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(width / 2 - 10, 0, 20, height);
    
    // Points
    const pointWidth = (width - 20) / 12;
    const pointHeight = height * 0.4;
    
    for (let i = 0; i < 24; i++) {
      const x = (i % 12) * pointWidth + (i >= 12 ? 20 : 0);
      const y = i < 12 ? 0 : height - pointHeight;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + pointWidth / 2, y + (i < 12 ? pointHeight : -pointHeight));
      ctx.lineTo(x + pointWidth, y);
      ctx.closePath();
      
      ctx.fillStyle = i % 2 === 0 ? '#8B4513' : '#D2691E';
      ctx.fill();
    }
  };

  const drawPosition = (ctx: CanvasRenderingContext2D, board: any, width: number, height: number) => {
    const pointWidth = (width - 20) / 12;
    const checkerSize = pointWidth * 0.8;
    
    for (let point = 0; point < 24; point++) {
      const count = Math.abs(board.points[point]);
      const color = board.points[point] > 0 ? 1 : -1;
      
      if (count > 0) {
        const x = (point % 12) * pointWidth + pointWidth / 2 + (point >= 12 ? 20 : 0);
        const baseY = point < 12 ? checkerSize : height - checkerSize;
        
        for (let i = 0; i < count; i++) {
          ctx.beginPath();
          ctx.arc(x, baseY + (i * checkerSize * 0.4 * (point < 12 ? 1 : -1)), 
            checkerSize / 2, 0, Math.PI * 2);
          ctx.fillStyle = color === 1 ? 'white' : 'black';
          ctx.fill();
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    }
  };

  const drawDice = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const diceSize = 40;
    const spacing = 10;
    const startX = width / 2 - diceSize - spacing;
    const startY = height / 2 - diceSize / 2;

    const drawDie = (x: number, y: number, value: number) => {
      ctx.fillStyle = 'white';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.fillRect(x, y, diceSize, diceSize);
      ctx.strokeRect(x, y, diceSize, diceSize);

      ctx.fillStyle = 'black';
      const dotSize = 6;
      const positions = {
        1: [[0.5, 0.5]],
        2: [[0.25, 0.25], [0.75, 0.75]],
        3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
        4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]],
        5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
        6: [[0.25, 0.25], [0.25, 0.5], [0.25, 0.75], [0.75, 0.25], [0.75, 0.5], [0.75, 0.75]]
      };

      positions[value as keyof typeof positions].forEach(([px, py]) => {
        ctx.beginPath();
        ctx.arc(x + px * diceSize, y + py * diceSize, dotSize, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    drawDie(startX, startY, dice[0]);
    drawDie(startX + diceSize + spacing * 2, startY, dice[1]);
  };

  const highlightPoint = (ctx: CanvasRenderingContext2D, point: number, width: number, height: number) => {
    const pointWidth = (width - 20) / 12;
    const x = (point % 12) * pointWidth + (point >= 12 ? 20 : 0);
    const y = point < 12 ? 0 : height - height * 0.4;
    
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, pointWidth, height * 0.4);
  };

  const highlightLegalMove = (ctx: CanvasRenderingContext2D, point: number, width: number, height: number) => {
    const pointWidth = (width - 20) / 12;
    const x = (point % 12) * pointWidth + (point >= 12 ? 20 : 0);
    const y = point < 12 ? 0 : height - height * 0.4;
    
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, pointWidth, height * 0.4);
  };

  const getClickedPoint = (x: number, y: number, width: number, height: number): number | null => {
    const pointWidth = (width - 20) / 12;
    const pointHeight = height * 0.4;
    
    if (x > width / 2 - 10 && x < width / 2 + 10) return null;
    const adjustedX = x > width / 2 ? x - 20 : x;
    
    const col = Math.floor(adjustedX / pointWidth);
    const row = y < height / 2 ? 0 : 1;
    
    if (col >= 0 && col < 12) {
      return row === 0 ? col : 23 - (11 - col);
    }
    
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
      <h3 className="text-xl font-display font-semibold mb-4 text-gray-900 dark:text-white">
        Backgammon Game
      </h3>
      <div className="relative aspect-[2/1] w-full">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          onClick={handleClick}
          className="w-full h-full"
        />
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={initializeGame}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
        >
          New Game
        </button>
        <button
          onClick={rollDice}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
        >
          Roll Dice
        </button>
      </div>
    </div>
  );
}
