import { useState, useEffect, useCallback } from 'react';
import GameButton from './GameButton';

interface MazeCell {
  row: number;
  col: number;
  isWall: boolean;
  isPlayer: boolean;
  isGoal: boolean;
}

interface MemoryMazeProps {
  onComplete: () => void;
}

// Predefined maze layout (5x5)
const predefinedMaze = [
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 0, 1]
];

const MemoryMaze = ({ onComplete }: MemoryMazeProps) => {
  const [maze, setMaze] = useState<MazeCell[][]>([]);
  const [playerPosition, setPlayerPosition] = useState({ row: 1, col: 1 });
  const [isStarted, setIsStarted] = useState(false);

  // Initialize maze
  useEffect(() => {
    const initialMaze: MazeCell[][] = [];
    
    for (let row = 0; row < 5; row++) {
      const rowCells: MazeCell[] = [];
      
      for (let col = 0; col < 5; col++) {
        rowCells.push({
          row,
          col,
          isWall: predefinedMaze[row][col] === 1,
          isPlayer: row === 1 && col === 1,
          isGoal: row === 4 && col === 3
        });
      }
      
      initialMaze.push(rowCells);
    }
    
    setMaze(initialMaze);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isStarted) return;
    
    let newRow = playerPosition.row;
    let newCol = playerPosition.col;
    
    switch (e.key) {
      case 'ArrowUp':
        newRow = Math.max(0, playerPosition.row - 1);
        break;
      case 'ArrowDown':
        newRow = Math.min(4, playerPosition.row + 1);
        break;
      case 'ArrowLeft':
        newCol = Math.max(0, playerPosition.col - 1);
        break;
      case 'ArrowRight':
        newCol = Math.min(4, playerPosition.col + 1);
        break;
      default:
        return;
    }
    
    // Check if the new position is valid (not a wall)
    if (!maze[newRow][newCol].isWall) {
      const updatedMaze = maze.map((row) =>
        row.map((cell) => ({
          ...cell,
          isPlayer: cell.row === newRow && cell.col === newCol
        }))
      );
      
      setMaze(updatedMaze);
      setPlayerPosition({ row: newRow, col: newCol });
      
      // Check if player reached the goal
      if (newRow === 4 && newCol === 3) {
        onComplete();
      }
    }
  }, [maze, playerPosition, isStarted, onComplete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Handle button navigation
  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!isStarted) return;
    
    let newRow = playerPosition.row;
    let newCol = playerPosition.col;
    
    switch (direction) {
      case 'up':
        newRow = Math.max(0, playerPosition.row - 1);
        break;
      case 'down':
        newRow = Math.min(4, playerPosition.row + 1);
        break;
      case 'left':
        newCol = Math.max(0, playerPosition.col - 1);
        break;
      case 'right':
        newCol = Math.min(4, playerPosition.col + 1);
        break;
    }
    
    // Check if the new position is valid (not a wall)
    if (!maze[newRow][newCol].isWall) {
      const updatedMaze = maze.map((row) =>
        row.map((cell) => ({
          ...cell,
          isPlayer: cell.row === newRow && cell.col === newCol
        }))
      );
      
      setMaze(updatedMaze);
      setPlayerPosition({ row: newRow, col: newCol });
      
      // Check if player reached the goal
      if (newRow === 4 && newCol === 3) {
        onComplete();
      }
    }
  };

  const startMaze = () => {
    setIsStarted(true);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
      <div className="grid grid-cols-5 gap-1 mb-4 max-w-md mx-auto">
        {maze.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`maze-cell ${cell.isWall ? 'wall' : ''} ${
                cell.isPlayer ? 'player' : ''
              } ${cell.isGoal ? 'goal' : ''}`}
            ></div>
          ))
        )}
      </div>
      <div className="text-center">
        <p className="mb-2 text-sm text-gray-600">Use arrow keys to navigate the maze</p>
        <div className="flex justify-center gap-2 mb-4">
          <button 
            className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center"
            onClick={() => handleMove('up')}
            disabled={!isStarted}
          >
            <i className="fas fa-arrow-up"></i>
          </button>
          <button 
            className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center"
            onClick={() => handleMove('left')}
            disabled={!isStarted}
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <button 
            className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center"
            onClick={() => handleMove('down')}
            disabled={!isStarted}
          >
            <i className="fas fa-arrow-down"></i>
          </button>
          <button 
            className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center"
            onClick={() => handleMove('right')}
            disabled={!isStarted}
          >
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
        {!isStarted ? (
          <GameButton color="primary" onClick={startMaze}>
            Start Maze Challenge
          </GameButton>
        ) : (
          <p className="text-primary font-bold">Challenge in progress!</p>
        )}
      </div>
    </div>
  );
};

export default MemoryMaze;
