import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { gameButtonStyles } from "@/lib/utils";

interface McqQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

interface McqModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
  title: string;
  questions: McqQuestion[];
}

const McqModal: React.FC<McqModalProps> = ({
  open,
  onClose,
  onComplete,
  title,
  questions
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>([]);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setScore(0);
      setAnswered(new Array(questions.length).fill(false));
    }
  }, [open, questions.length]);

  const handleNext = () => {
    if (selectedOption !== null && !answered[currentQuestionIndex]) {
      // Check if answer is correct
      const currentQuestion = questions[currentQuestionIndex];
      if (selectedOption === currentQuestion.correctAnswer) {
        setScore(prev => prev + currentQuestion.points);
      }
      
      // Mark question as answered
      const newAnswered = [...answered];
      newAnswered[currentQuestionIndex] = true;
      setAnswered(newAnswered);
    }
    
    // Move to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      // Complete the challenge
      onComplete(score);
    }
  };

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      // Complete the challenge
      onComplete(score);
    }
  };

  // Get current question
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-gray-800 rounded-xl w-full max-w-2xl p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">{title}</h3>
          <button className="text-gray-400 hover:text-white" onClick={onClose}>
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3">
                <span className="font-bold">{currentQuestionIndex + 1}</span>
              </div>
              <span className="text-lg font-bold">Question {currentQuestionIndex + 1} of {questions.length}</span>
            </div>
            <div className="text-accent">+{currentQuestion.points} points</div>
          </div>
          
          <p className="text-lg mb-6">{currentQuestion.question}</p>
          
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${
                  selectedOption === index 
                    ? 'bg-primary bg-opacity-50' 
                    : 'bg-gray-800 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedOption(index)}
              >
                <span className="mr-2">{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline"
            className="py-3 px-6 bg-gray-700 rounded-lg"
            onClick={handleSkip}
          >
            SKIP
          </Button>
          <Button 
            className={`py-3 px-8 bg-primary rounded-lg ${gameButtonStyles}`}
            onClick={handleNext}
          >
            {currentQuestionIndex < questions.length - 1 ? 'NEXT' : 'FINISH'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default McqModal;
