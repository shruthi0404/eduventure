import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { gameButtonStyles, truncateText } from "@/lib/utils";
import { Link } from "wouter";

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  rating: number;
  challenges: number;
  badge?: {
    text: string;
    color: string;
  };
  onClick?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  image,
  rating,
  challenges,
  badge,
  onClick,
}) => {
  return (
    <Card className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
      <div className="h-48 relative overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        {badge && (
          <div className={`absolute top-2 right-2 bg-${badge.color} text-dark px-2 py-1 rounded-lg text-sm font-bold`}>
            {badge.text}
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xl font-bold text-white">{title}</h4>
          <div className="flex items-center">
            <i className="fas fa-star text-accent mr-1"></i>
            <span>{(rating / 10).toFixed(1)}</span>
          </div>
        </div>
        <p className="text-gray-300 mb-4">{truncateText(description, 75)}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <i className="fas fa-bolt text-white"></i>
            </div>
            <span className="ml-2 text-gray-300">{challenges} challenges</span>
          </div>
          <Button 
            className={`py-2 px-4 bg-primary rounded-lg text-sm ${gameButtonStyles}`}
            onClick={onClick}
            asChild={!onClick}
          >
            {onClick ? (
              "START QUEST"
            ) : (
              <Link to={`/roadmap/${id}`}>START QUEST</Link>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
