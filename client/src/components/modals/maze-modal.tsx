import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { gameButtonStyles } from "@/lib/utils";
import MemoryTile from "@/components/memory-tile";

interface MemoryPair {
  text: string;
  match: string;
}

interface MazeModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
  title: string;
  gridSize: number;
  pairs: MemoryPair[];
  points: number;
}

const MazeModal: React.FC<MazeModalProps> = ({
  open,
  onClose,
  onComplete,
  title,
  gridSize,
  pairs,
  points
}) => {
  const [tiles, setTiles] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>([]);
  const [matched, setMatched] = useState<boolean[]>([]);
  const [moves, setMoves] = useState(0);
  const [firstSelection, setFirstSelection] = useState<number | null>(null);
  const [secondSelection, setSecondSelection] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Initialize game
  useEffect(() => {
    if (open) {
      initializeGame();
    }
  }, [open, pairs]);

  const initializeGame = () => {
    // Take only as many pairs as needed for the grid
    const pairsNeeded = Math.floor((gridSize * gridSize) / 2);
    const selectedPairs = pairs.slice(0, pairsNeeded);
    
    // Create an array with pairs of matching items
    let cards: string[] = [];
    selectedPairs.forEach(pair => {
      cards.push(pair.text);
      cards.push(pair.match);
    });
    
    // If odd number of cells, add one more
    if (cards.length < gridSize * gridSize) {
      cards.push("Free");
    }
    
    // Shuffle the cards
    cards = shuffleArray(cards);
    
    setTiles(cards);
    setFlipped(new Array(cards.length).fill(false));
    setMatched(new Array(cards.length).fill(false));
    setMoves(0);
    setFirstSelection(null);
    setSecondSelection(null);
    setIsChecking(false);
  };

  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleTileClick = (index: number) => {
    if (isChecking || flipped[index] || matched[index]) return;
    
    // Flip the tile
    const newFlipped = [...flipped];
    newFlipped[index] = true;
    setFlipped(newFlipped);
    
    if (firstSelection === null) {
      setFirstSelection(index);
    } else if (secondSelection === null) {
      setSecondSelection(index);
      setIsChecking(true);
      setMoves(moves + 1);
      
      // Check for a match
      setTimeout(() => {
        const newFlipped = [...flipped];
        const newMatched = [...matched];
        
        if (tiles[firstSelection] === tiles[index]) {
          // Check if it's a matching pair
          newMatched[firstSelection] = true;
          newMatched[index] = true;
        } else {
          // No match, flip back
          newFlipped[firstSelection] = false;
          newFlipped[index] = false;
        }
        
        setFlipped(newFlipped);
        setMatched(newMatched);
        setFirstSelection(null);
        setSecondSelection(null);
        setIsChecking(false);
        
        // Check if all matched
        if (newMatched.every(m => m)) {
          setTimeout(() => {
            onComplete(points);
          }, 1000);
        }
      }, 1000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-gray-800 rounded-xl w-full max-w-2xl p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">{title}</h3>
          <button className="text-gray-400 hover:text-white" onClick={onClose}>
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-lg mb-4">Navigate through the maze by revealing and matching Python concepts!</p>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="flex items-center">
              <i className="fas fa-star text-accent mr-2"></i>
              <span>+{points} points</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-clock text-gray-400 mr-2"></i>
              <span className="text-gray-400">Moves: <span id="maze-moves">{moves}</span></span>
            </div>
          </div>
        </div>
        
        <div 
          className="grid gap-3 mb-8"
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {tiles.map((content, index) => (
            <MemoryTile
              key={index}
              index={index}
              content={content}
              isFlipped={flipped[index]}
              isMatched={matched[index]}
              onClick={handleTileClick}
            />
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            className={`py-3 px-8 bg-secondary rounded-lg ${gameButtonStyles}`}
            onClick={initializeGame}
          >
            RESET MAZE
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MazeModal;
