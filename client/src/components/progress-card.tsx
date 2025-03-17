import { cn } from "@/lib/utils";

interface ProgressCardProps {
  title: string;
  progress: number;
  className?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ title, progress, className }) => {
  return (
    <div className={cn("bg-gray-700 rounded-lg p-4", className)}>
      <div className="flex justify-between items-center mb-2">
        <h5 className="font-bold">{title}</h5>
        <span className="text-accent">{progress}% Complete</span>
      </div>
      <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default ProgressCard;
