import { cn } from "@/lib/utils";

interface AchievementBadgeProps {
  icon: string;
  title: string;
  locked?: boolean;
  className?: string;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  icon, 
  title, 
  locked = false,
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div 
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center mb-2",
          locked ? "bg-gray-700" : "bg-accent bg-opacity-20"
        )}
      >
        <i 
          className={cn(
            `fas fa-${icon} text-2xl`,
            locked ? "text-gray-500" : "text-accent"
          )}
        ></i>
      </div>
      <span className={cn("text-xs text-center", locked && "text-gray-500")}>{title}</span>
    </div>
  );
};

export default AchievementBadge;
