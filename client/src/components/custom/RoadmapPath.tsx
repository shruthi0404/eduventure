import { RoadmapLevel } from '@shared/schema';
import LevelNode from './LevelNode';

interface RoadmapPathProps {
  levels: RoadmapLevel[];
  currentLevelId: number;
  onSelectLevel: (levelId: number) => void;
}

const RoadmapPath = ({ levels, currentLevelId, onSelectLevel }: RoadmapPathProps) => {
  return (
    <div className="roadmap-path p-8 mb-8 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-bold text-white">Your Python Learning Path</h2>
        <div className="bg-white/90 rounded-full py-1 px-3 text-primary text-sm font-medium">
          Level {levels.findIndex(level => level.id === currentLevelId) + 1}/{levels.length}
        </div>
      </div>
      
      <div className="relative py-4">
        {/* Path line */}
        <div className="absolute top-1/2 left-0 w-full h-2 bg-white/30 rounded-full -translate-y-1/2"></div>
        
        {/* Nodes */}
        <div className="relative flex justify-between items-center">
          {levels.map((level) => {
            // Determine status
            let status: 'completed' | 'current' | 'locked' = 'locked';
            
            const levelIndex = levels.findIndex(l => l.id === level.id);
            const currentIndex = levels.findIndex(l => l.id === currentLevelId);
            
            if (levelIndex < currentIndex) {
              status = 'completed';
            } else if (level.id === currentLevelId) {
              status = 'current';
            }
            
            return (
              <LevelNode
                key={level.id}
                title={level.title}
                icon={getIconForLevelType(level.type)}
                status={status}
                onClick={() => onSelectLevel(level.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Helper function to get appropriate icon for level type
function getIconForLevelType(type: string): string {
  switch (type) {
    case 'video':
      return 'fa-code';
    case 'challenge':
      return 'fa-puzzle-piece';
    case 'game':
      return 'fa-brain';
    case 'algorithm':
      return 'fa-cogs';
    case 'interview':
      return 'fa-briefcase';
    default:
      return 'fa-star';
  }
}

export default RoadmapPath;
