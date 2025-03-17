import { Link } from 'wouter';
import GameButton from './GameButton';
import { Course } from '@shared/schema';

interface CourseCardProps {
  course: Course;
  onEnroll?: () => void;
  alreadyEnrolled?: boolean;
}

const CourseCard = ({ course, onEnroll, alreadyEnrolled = false }: CourseCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <img 
        className="h-48 w-full object-cover" 
        src={course.imageUrl} 
        alt={course.title} 
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-heading font-bold text-xl">{course.title}</h3>
          <span className={`${course.level === 'Beginner' ? 'bg-primary' : 'bg-accent'} text-white text-xs px-2 py-1 rounded-full`}>
            {course.level}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{course.modules} Modules • {course.hours} Hours</span>
          {alreadyEnrolled ? (
            <Link to={`/roadmap/${course.id}`}>
              <GameButton color="primary">Continue</GameButton>
            </Link>
          ) : (
            <GameButton color="primary" onClick={onEnroll}>Start Quest</GameButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
