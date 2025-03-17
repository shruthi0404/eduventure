import { useEffect, useRef } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

interface AnimatedLogoProps {
  onComplete?: () => void;
}

const AnimatedLogo = ({ onComplete }: AnimatedLogoProps) => {
  const playerRef = useRef<Player>(null);

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-[300px] h-[300px] mx-auto">
      <Player
        ref={playerRef}
        autoplay
        loop
        src="https://assets7.lottiefiles.com/packages/lf20_4djddwlk.json"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default AnimatedLogo;
