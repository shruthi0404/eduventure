import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { gameButtonStyles, delay } from "@/lib/utils";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  xpEarned: number;
  achievements?: {
    icon: string;
    name: string;
    type: 'achievement' | 'xp' | 'level';
  }[];
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  onClose,
  xpEarned,
  achievements = []
}) => {
  const [animationStage, setAnimationStage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Reset animation state when modal opens
    if (open) {
      setAnimationStage(0);
      setShowConfetti(false);
      runAnimation();
    }
  }, [open]);

  // Sequence of animations
  const runAnimation = async () => {
    if (!open) return;
    
    await delay(300); // Wait for modal to open
    setShowConfetti(true);
    await delay(800);
    setAnimationStage(1); // Show title
    await delay(600);
    setAnimationStage(2); // Show XP
    await delay(800);
    setAnimationStage(3); // Show achievements
  };

  // Default achievements if none provided
  const displayAchievements = achievements.length > 0 ? achievements : [
    { icon: 'trophy', name: 'Achievement', type: 'achievement' },
    { icon: 'star', name: `+${xpEarned} XP`, type: 'xp' },
    { icon: 'unlock', name: 'Skill Up!', type: 'level' }
  ];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-gray-900/95 backdrop-blur-xl border border-primary/20 rounded-xl w-full max-w-md p-8 text-white text-center overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        {/* Confetti particles */}
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 60 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-5%`,
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                  animation: `confettiFall ${1.5 + Math.random() * 3}s forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  opacity: 0.7 + Math.random() * 0.3,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  width: `${3 + Math.random() * 6}px`,
                  height: `${3 + Math.random() * 6}px`,
                }}
              />
            ))}
          </div>
        )}
        
        {/* Success shine */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] animate-spin-slow opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary to-transparent blur-xl" style={{transform: 'rotate(45deg)'}}></div>
          </div>
        </div>
        
        {/* Victory icon */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping-slow"></div>
          <div className="relative achievement-unlock bg-gradient-to-br from-primary to-purple-700 rounded-full w-28 h-28 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white drop-shadow-xl" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04L3 8a9 9 0 009 9 9 9 0 009-9 9 9 0 00-.382-2.616z" />
            </svg>
          </div>
        </div>
        
        {/* Title with animation */}
        <div className={`transform transition-all duration-500 ${animationStage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h3 className="text-4xl text-accent font-russo-one mb-1 text-glow">EPIC WIN!</h3>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent my-3"></div>
        </div>
        
        {/* XP earned with animation */}
        <div className={`transform transition-all duration-500 ${animationStage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="text-xl mb-4">You've earned</p>
          <div className="inline-block bg-accent/20 px-6 py-2 rounded-full mb-6">
            <span className="text-3xl text-accent font-mono font-bold">{xpEarned} XP</span>
          </div>
        </div>
        
        {/* Rewards with staggered animation */}
        <div className={`flex justify-around mb-8 ${animationStage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          {displayAchievements.map((achievement, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center achievement-unlock"
              style={{ animationDelay: `${0.1 + index * 0.2}s` }}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-lg ${
                achievement.type === 'achievement' ? 'bg-gradient-to-b from-primary to-purple-800' :
                achievement.type === 'xp' ? 'bg-gradient-to-b from-accent to-purple-800' : 
                'bg-gradient-to-b from-green-500 to-green-700'
              }`}>
                {achievement.icon === 'trophy' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                )}
                {achievement.icon === 'star' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )}
                {achievement.icon === 'unlock' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>
              <span className="text-sm font-semibold text-white">{achievement.name}</span>
            </div>
          ))}
        </div>
        
        {/* Continue button with animation */}
        <div className={`transform transition-all duration-700 ${animationStage >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Button 
            className={`py-3 px-8 bg-gradient-to-r from-primary to-purple-700 text-white rounded-lg font-bold ${gameButtonStyles}`}
            onClick={onClose}
          >
            QUEST ON!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
