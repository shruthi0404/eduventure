import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  width?: string;
  showPercentage?: boolean;
  className?: string;
}

const ProgressBar = ({ 
  progress, 
  width = 'w-full', 
  showPercentage = false,
  className 
}: ProgressBarProps) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={cn(
      "progress-bar relative h-4 bg-gray-200 rounded-lg overflow-hidden",
      width,
      className
    )}>
      <div 
        className="progress-bar-fill h-full bg-gradient-to-r from-primary to-secondary rounded-lg"
        style={{ width: `${clampedProgress}%` }}
      ></div>
      {showPercentage && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-xs text-white font-bold">
          {clampedProgress}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
