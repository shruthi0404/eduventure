import { Dialog, DialogContent } from '@/components/ui/dialog';
import SuccessAnimation from '@/components/lottie/SuccessAnimation';
import GameButton from './GameButton';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  xpEarned: number;
}

const SuccessModal = ({ isOpen, onClose, xpEarned }: SuccessModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center">
          <div className="mb-4">
            <SuccessAnimation />
          </div>
          <h3 className="font-gaming text-2xl text-accent mb-2">Epic Win!</h3>
          <p className="text-gray-600 mb-4">
            You've completed the challenge and earned <span className="font-bold text-accent">+{xpEarned} XP</span>!
          </p>
          <div className="flex justify-center">
            <GameButton color="primary" onClick={onClose}>
              Continue Quest
            </GameButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
