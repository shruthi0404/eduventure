import { cn } from '@/lib/utils';

interface LevelNodeProps {
  title: string;
  icon: string;
  status: 'completed' | 'current' | 'locked';
  onClick: () => void;
}

const LevelNode = ({ title, icon, status, onClick }: LevelNodeProps) => {
  // Determine color based on status
  const nodeColor = 
    status === 'completed' ? 'bg-accent' : 
    status === 'current' ? 'bg-secondary pulse-animation' : 
    'bg-white/20';
  
  const iconColor = status === 'locked' ? 'text-white/50' : 'text-white';
  const titleColor = status === 'locked' ? 'text-white/50' : 'text-white';
  const statusText = 
    status === 'completed' ? 'Completed' : 
    status === 'current' ? 'In Progress' : 
    'Locked';
  
  return (
    <div className="level-node">
      <button 
        onClick={status !== 'locked' ? onClick : undefined}
        className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2 z-10 relative",
          nodeColor,
          status !== 'locked' ? 'shadow-lg' : ''
        )}
        disabled={status === 'locked'}
      >
        <i className={`fas ${icon} ${iconColor} text-2xl`}></i>
      </button>
      <p className={`text-center ${titleColor} font-bold`}>{title}</p>
      <p className="text-center text-white/70 text-sm">{statusText}</p>
    </div>
  );
};

export default LevelNode;
