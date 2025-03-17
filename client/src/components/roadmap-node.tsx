import { useState } from "react";
import { cn, gameButtonStyles, gameColors } from "@/lib/utils";

export type NodeStatus = 'completed' | 'active' | 'locked';

interface RoadmapNodeProps {
  icon: string;
  title: string;
  description: string;
  xpReward?: number;
  status: NodeStatus;
  position: 'left' | 'right';
  onClick?: () => void;
}

const RoadmapNode: React.FC<RoadmapNodeProps> = ({
  icon,
  title,
  description,
  xpReward,
  status,
  position,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);
  
  // Status-based styles
  const nodeColor = {
    completed: "bg-gradient-to-br from-green-500 to-green-700 border-dark",
    active: "bg-gradient-to-br from-primary to-purple-700 border-dark cursor-pointer",
    locked: "bg-gradient-to-br from-gray-600 to-gray-800 border-dark cursor-not-allowed opacity-60",
  }[status];

  const iconColor = {
    completed: "text-white",
    active: "text-white",
    locked: "text-gray-400",
  }[status];

  const textColor = {
    completed: "text-green-400",
    active: "text-primary",
    locked: "text-gray-500",
  }[status];

  // Handle node click with animation
  const handleClick = () => {
    if (status !== 'locked' && onClick) {
      // Add slight pulse animation before calling onClick
      const nodeElement = document.getElementById(`node-${title.replace(/\s+/g, '-')}`);
      if (nodeElement) {
        nodeElement.classList.add('animate-pulse');
        setTimeout(() => {
          nodeElement.classList.remove('animate-pulse');
          onClick();
        }, 300);
      } else {
        onClick();
      }
    }
  };

  return (
    <div className={`relative ${position === 'right' ? 'ml-auto' : 'mr-auto'}`} style={{width: '85%'}}>
      {/* Connector line to the center path */}
      <div 
        className={`absolute top-1/2 h-[3px] ${position === 'left' ? 'right-0' : 'left-0'}`} 
        style={{
          width: '4rem',
          background: status === 'completed' 
            ? 'linear-gradient(to right, rgba(167, 139, 250, 0.8), rgba(37, 99, 235, 0))' 
            : 'linear-gradient(to right, rgba(75, 85, 99, 0.8), rgba(37, 99, 235, 0))',
          transform: 'translateY(-50%)',
          zIndex: 1
        }}
      ></div>
      
      {/* Node circle */}
      <div 
        id={`node-${title.replace(/\s+/g, '-')}`}
        className={cn(
          "roadmap-node w-20 h-20 rounded-full flex items-center justify-center z-20 shadow-xl border-[3px]",
          nodeColor,
          status !== 'locked' && "transform hover:scale-110 transition-all duration-300"
        )}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'absolute',
          top: '50%',
          [position === 'left' ? 'right' : 'left']: 0,
          transform: 'translateY(-50%)',
          boxShadow: status === 'completed' 
            ? '0 0 20px rgba(34, 197, 94, 0.5)' 
            : status === 'active' && hovered 
              ? '0 0 25px rgba(147, 51, 234, 0.7)' 
              : '0 5px 15px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Icon */}
        <div className="relative z-10">
          {/* Use SVG icons instead of Font Awesome */}
          {icon === 'code' && (
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          )}
          {icon === 'video' && (
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
          {icon === 'question' && (
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {icon === 'puzzle' && (
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          )}
          {icon === 'star' && (
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          )}
        </div>
        
        {/* Decorative glowing effect for completed and active nodes */}
        {status !== 'locked' && (
          <div className={`absolute inset-0 rounded-full ${status === 'completed' ? 'bg-green-500' : 'bg-primary'} opacity-20 animate-pulse`} style={{animationDuration: '3s'}}></div>
        )}
        
        {/* Status indicator */}
        {status === 'completed' && (
          <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center border-2 border-dark z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        {status === 'active' && (
          <div className="absolute -top-1 -right-1 bg-primary rounded-full w-6 h-6 flex items-center justify-center border-2 border-dark z-10 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        )}
        {status === 'locked' && (
          <div className="absolute -top-1 -right-1 bg-gray-600 rounded-full w-6 h-6 flex items-center justify-center border-2 border-dark z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Challenge info card */}
      <div 
        className={`transform transition-all duration-300 ${position === 'left' ? 'pr-32' : 'pl-32'}`}
        style={{
          transform: hovered && status !== 'locked' ? 'scale(1.05)' : 'scale(1)',
          filter: status === 'locked' ? 'grayscale(0.5)' : 'none',
        }}
      >
        <div className={`bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border ${
          status === 'completed' ? 'border-green-500/30' : 
          status === 'active' ? 'border-primary/30' :
          'border-gray-700/30'
        }`}>
          <h3 className={`text-xl font-bold mb-1 ${textColor} ${status === 'active' ? 'text-glow-subtle' : ''}`}>
            {title}
          </h3>
          <p className={status === 'locked' ? "text-gray-500 mb-2" : "text-gray-300 mb-2"}>
            {description}
          </p>
          <div className="flex items-center text-sm mt-2">
            {status === 'completed' ? (
              <div className="flex items-center bg-green-900/30 rounded-full px-3 py-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-400 font-semibold">Epic Win! Completed</span>
              </div>
            ) : status === 'active' ? (
              <div className="flex items-center bg-purple-900/30 rounded-full px-3 py-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-primary font-semibold">{xpReward} XP Quest Ready!</span>
              </div>
            ) : (
              <div className="flex items-center bg-gray-900/30 rounded-full px-3 py-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-gray-500">Path Locked - Complete Previous Quests</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapNode;
