import React, { useEffect, useRef, useState } from 'react';
import pkg from 'tsgammon-core';
const { Game, boardStateNodeFromArray, collectMoves, formatMove } = pkg;

export default function BackgammonGame() {
  const [gameState, setGameState] = useState<any>(null);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [legalMoves, setLegalMoves] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!gameState) {
      // Initialize with starting position
      const initialState = boardStateNodeFromArray([
        0, // bar point
        2,0,0,0,0,-5, 0,-3,0,0,0,5,
        -5,0,0,0,3,0,5,0,0,0,0,-2,
        0  // opponent's bar point
      ], 1, 1); // Initial dice roll
      setGameState(initialState);
    }
  }, []);

  useEffect(() => {
    if (gameState && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawBoard(ctx, canvas.width, canvas.height);
        drawPosition(ctx, gameState.board, canvas.width, canvas.height);
        
        if (selectedPoint !== null) {
          highlightPoint(ctx, selectedPoint, canvas.width, canvas.height);
          legalMoves.forEach(move => {
            highlightLegalMove(ctx, move.to, canvas.width, canvas.height);
          });
        }
      }
    }
  }, [gameState, selectedPoint, legalMoves]);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameState || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const point = getClickedPoint(x, y, canvas.width, canvas.height);
    
    if (point !== null) {
      if (selectedPoint === null) {
        setSelectedPoint(point);
        const moves = collectMoves(gameState);
        setLegalMoves(moves.filter(move => move.from === point));
      } else {
        const move = legalMoves.find(m => m.to === point);
        if (move) {
          const newState = gameState.makeMove(move);
          setGameState(newState);
        }
        setSelectedPoint(null);
        setLegalMoves([]);
      }
    }
  };

  const drawBoard = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw board background
    ctx.fillStyle = '#E6D5AC';
    ctx.fillRect(0, 0, width, height);
    
    // Draw points
    const pointWidth = width / 12;
    const pointHeight = height * 0.4;
    
    for (let i = 0; i < 24; i++) {
      const x = (i % 12) * pointWidth;
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
    const pointWidth = width / 12;
    const checkerSize = pointWidth * 0.8;
    
    for (let point = 0; point < 24; point++) {
      const count = Math.abs(board.points[point]);
      const color = board.points[point] > 0 ? 1 : -1;
      
      if (count > 0) {
        const x = (point % 12) * pointWidth + pointWidth / 2;
        const baseY = point < 12 ? checkerSize : height - checkerSize;
        
        for (let i = 0; i < count; i++) {
          ctx.beginPath();
          ctx.arc(x, baseY + (i * checkerSize * 0.4), checkerSize / 2, 0, Math.PI * 2);
          ctx.fillStyle = color === 1 ? 'white' : 'black';
          ctx.fill();
          ctx.strokeStyle = '#000';
          ctx.stroke();
        }
      }
    }
  };

  const highlightPoint = (ctx: CanvasRenderingContext2D, point: number, width: number, height: number) => {
    const pointWidth = width / 12;
    const x = (point % 12) * pointWidth;
    const y = point < 12 ? 0 : height - height * 0.4;
    
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, pointWidth, height * 0.4);
  };

  const highlightLegalMove = (ctx: CanvasRenderingContext2D, point: number, width: number, height: number) => {
    const pointWidth = width / 12;
    const x = (point % 12) * pointWidth;
    const y = point < 12 ? 0 : height - height * 0.4;
    
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, pointWidth, height * 0.4);
  };

  const getClickedPoint = (x: number, y: number, width: number, height: number): number | null => {
    const pointWidth = width / 12;
    const pointHeight = height * 0.4;
    
    const col = Math.floor(x / pointWidth);
    const row = y < height / 2 ? 0 : 1;
    
    if (col >= 0 && col < 12) {
      return row === 0 ? col : 23 - col;
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
          onClick={() => {
            const initialState = boardStateNodeFromArray([
              0,2,0,0,0,0,-5,0,-3,0,0,0,5,
              -5,0,0,0,3,0,5,0,0,0,0,-2,0
            ], 1, 1);
            setGameState(initialState);
            setSelectedPoint(null);
            setLegalMoves([]);
          }}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
        >
          New Game
        </button>
        <button
          onClick={() => {
            if (gameState) {
              const dice1 = Math.floor(Math.random() * 6) + 1;
              const dice2 = Math.floor(Math.random() * 6) + 1;
              const newState = boardStateNodeFromArray(
                gameState.board.points,
                dice1,
                dice2
              );
              setGameState(newState);
            }
          }}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
        >
          Roll Dice
        </button>
      </div>
    </div>
  );
}
