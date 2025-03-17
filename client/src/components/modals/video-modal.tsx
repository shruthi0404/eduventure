import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { gameButtonStyles } from "@/lib/utils";
import LottiePlayer from "@/components/ui/lottie-player";

interface VideoQuestion {
  time: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  xpReward: number;
  questions: VideoQuestion[];
}

const VideoModal: React.FC<VideoModalProps> = ({
  open,
  onClose,
  onComplete,
  title,
  description,
  videoUrl,
  duration,
  xpReward,
  questions
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setCurrentQuestionIndex(null);
      setVideoPlaying(false);
      setSelectedOption(null);
      setScore(0);
      setQuizCompleted(false);
    }
  }, [open]);

  // Simulate video playback and trigger questions
  useEffect(() => {
    if (!open || quizCompleted) return;

    if (videoPlaying) {
      const questionTimers = questions.map((q, index) => {
        return setTimeout(() => {
          setCurrentQuestionIndex(index);
          setVideoPlaying(false);
        }, q.time * 1000);
      });

      return () => {
        questionTimers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [videoPlaying, open, questions, quizCompleted]);

  const handlePlayVideo = () => {
    setVideoPlaying(true);
    
    // If there are no questions, complete after video duration
    if (questions.length === 0) {
      setTimeout(() => {
        setQuizCompleted(true);
        onComplete(xpReward);
      }, 5000); // Simulate 5 seconds for demo
    }
  };

  const handleAnswerSubmit = () => {
    if (currentQuestionIndex === null || selectedOption === null) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    
    // Check if answer is correct
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prev => prev + (xpReward / questions.length));
    }
    
    // Move to next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(null);
      setSelectedOption(null);
      setVideoPlaying(true);
    } else {
      setQuizCompleted(true);
      onComplete(score + (selectedOption === currentQuestion.correctAnswer ? (xpReward / questions.length) : 0));
    }
  };

  const currentQuestion = currentQuestionIndex !== null ? questions[currentQuestionIndex] : null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-gray-800 rounded-xl w-full max-w-4xl p-0 text-white">
        <div className="relative">
          <div className="aspect-w-16 aspect-h-9 bg-black">
            <div className="w-full h-full flex items-center justify-center">
              {/* Video placeholder */}
              <img 
                src={`https://via.placeholder.com/800x450?text=${encodeURIComponent(title)}`} 
                alt={title} 
                className="max-w-full max-h-full" 
              />
              {!videoPlaying && !currentQuestion && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    className="w-20 h-20 bg-primary rounded-full flex items-center justify-center"
                    onClick={handlePlayVideo}
                  >
                    <i className="fas fa-play text-3xl text-white"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Quiz popup */}
          {currentQuestion && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-95 p-6">
              <div className="max-w-xl mx-auto text-center">
                <h3 className="text-2xl text-accent font-russo-one mb-4">Pop Quiz!</h3>
                <p className="text-xl mb-6">{currentQuestion.question}</p>
                
                <div className="bg-gray-800 p-4 rounded-lg mb-6 text-left">
                  <pre className="text-gray-300">
                    <code>{currentQuestion.options[currentQuestion.correctAnswer]}</code>
                  </pre>
                </div>
                
                <div className="space-y-4 mb-8">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      className={`w-full py-3 px-4 rounded-lg text-left ${
                        selectedOption === index 
                          ? 'bg-primary bg-opacity-50' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={() => setSelectedOption(index)}
                    >
                      <span className="mr-2">{String.fromCharCode(65 + index)}.</span> {option}
                    </button>
                  ))}
                </div>
                
                <Button 
                  className={`py-3 px-8 bg-primary rounded-lg ${gameButtonStyles}`}
                  onClick={handleAnswerSubmit}
                  disabled={selectedOption === null}
                >
                  SUBMIT ANSWER
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">{title}</h3>
            <button className="text-gray-400 hover:text-white" onClick={onClose}>
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          <p className="text-gray-300 mb-4">{description}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <i className="fas fa-clock text-gray-400 mr-2"></i>
              <span className="text-gray-400">{duration}</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-star text-accent mr-2"></i>
              <span>{xpReward} XP Available</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
