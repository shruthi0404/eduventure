import { useState } from 'react';
import { cn } from '@/lib/utils';

interface MemoryTileProps {
  index: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (index: number) => void;
}

const MemoryTile: React.FC<MemoryTileProps> = ({
  index,
  content,
  isFlipped,
  isMatched,
  onClick,
}) => {
  const handleClick = () => {
    if (!isFlipped && !isMatched) {
      onClick(index);
    }
  };

  return (
    <div
      className={cn(
        "memory-tile w-full aspect-square rounded-lg flex items-center justify-center cursor-pointer hover:bg-opacity-80 text-white transition-all duration-300 hover:scale-105",
        isMatched ? "bg-success" : isFlipped ? "bg-accent" : "bg-primary"
      )}
      onClick={handleClick}
    >
      {isFlipped || isMatched ? (
        <span className="text-center p-1 text-sm">{content}</span>
      ) : (
        <i className="fas fa-question text-3xl"></i>
      )}
    </div>
  );
};

export default MemoryTile;
