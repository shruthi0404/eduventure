import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'secondary' | 'accent' | 'white';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const GameButton = forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ children, color = 'primary', size = 'md', className, ...props }, ref) => {
    const colorClasses = {
      primary: 'bg-primary hover:bg-primary/90 text-white',
      secondary: 'bg-secondary hover:bg-secondary/90 text-white',
      accent: 'bg-accent hover:bg-accent/90 text-white',
      white: 'bg-white hover:bg-gray-50 text-primary border border-primary',
    };

    const sizeClasses = {
      sm: 'py-2 px-4 text-sm',
      md: 'py-2 px-4',
      lg: 'py-3 px-6',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'game-btn font-bold rounded-lg transition duration-300',
          colorClasses[color],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GameButton.displayName = 'GameButton';

export default GameButton;
