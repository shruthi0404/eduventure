import { useEffect, useState } from 'react';
import { gameColors } from '@/lib/utils';

interface LogoAnimationProps {
  onComplete?: () => void;
  showTitle?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const LogoAnimation: React.FC<LogoAnimationProps> = ({ 
  onComplete,
  showTitle = true,
  size = 'large'
}) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Animate progress bar
    if (onComplete) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 2;
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onComplete();
            }, 200);
          }
          return newProgress;
        });
      }, 60);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [onComplete]);
  
  // Scale everything based on size
  const controllerScale = {
    small: 'scale-50',
    medium: 'scale-75',
    large: 'scale-100',
  }[size];
  
  const containerSize = {
    small: 'w-24 h-24',
    medium: 'w-48 h-48',
    large: 'w-64 h-64',
  }[size];
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${containerSize} flex items-center justify-center overflow-hidden`}>
        {/* CSS-based game controller logo animation */}
        <div className={`relative transform ${controllerScale}`}>
          {/* Main controller body */}
          <div className="absolute w-48 h-32 bg-primary rounded-3xl shadow-lg animate-pulse" 
               style={{left: '-24px', top: '-16px'}}></div>
          
          {/* Left joystick */}
          <div className="absolute top-8 left-4 w-10 h-10 bg-gray-700 rounded-full shadow-inner">
            <div className="absolute top-1 left-1 w-8 h-8 bg-gray-800 rounded-full animate-ping opacity-75"></div>
          </div>
          
          {/* Right joystick */}
          <div className="absolute top-8 right-4 w-10 h-10 bg-gray-700 rounded-full shadow-inner">
            <div className="absolute top-1 left-1 w-8 h-8 bg-gray-800 rounded-full animate-ping opacity-75" 
                 style={{animationDelay: '500ms'}}></div>
          </div>
          
          {/* D-pad */}
          <div className="absolute bottom-8 left-8 w-6 h-12 bg-gray-800 rounded-md"></div>
          <div className="absolute bottom-11 left-5 w-12 h-6 bg-gray-800 rounded-md"></div>
          
          {/* Action buttons */}
          <div className="absolute bottom-8 right-4 w-6 h-6 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="absolute bottom-12 right-8 w-6 h-6 bg-red-500 rounded-full animate-bounce" 
               style={{animationDelay: '100ms'}}></div>
          <div className="absolute bottom-16 right-4 w-6 h-6 bg-green-500 rounded-full animate-bounce"
               style={{animationDelay: '200ms'}}></div>
          <div className="absolute bottom-12 right-0 w-6 h-6 bg-yellow-500 rounded-full animate-bounce"
               style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
      
      {showTitle && (
        <>
          <h1 className="text-4xl md:text-6xl text-primary font-bold mt-8 mb-2 animate-bounce">EduVenture</h1>
          <p className="text-xl md:text-2xl text-accent animate-pulse">Get Ready to Level Up!</p>
          
          {onComplete && (
            <div className="mt-8 relative w-48 h-4 bg-gray-700 rounded-full overflow-hidden shadow-inner">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
              <div className="absolute w-full text-center text-xs text-white font-bold leading-4">
                {progress}%
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LogoAnimation;
