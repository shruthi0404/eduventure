import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { gameButtonStyles } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface CodingModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
  title: string;
  task: string;
  starterCode: string;
  expectedOutput: string;
  points: number;
}

const CodingModal: React.FC<CodingModalProps> = ({
  open,
  onClose,
  onComplete,
  title,
  task,
  starterCode,
  expectedOutput,
  points
}) => {
  const [code, setCode] = useState(starterCode);
  const [testResult, setTestResult] = useState<{
    status: 'success' | 'error' | 'idle';
    output?: string;
    message?: string;
  }>({ status: 'idle' });

  // Reset state when modal opens
  useState(() => {
    if (open) {
      setCode(starterCode);
      setTestResult({ status: 'idle' });
    }
  });

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleTest = () => {
    // In a real app, this would send the code to a server for execution
    // For demo purposes, we'll check if the code contains "print" and "Hello, World!"
    if (code.includes('print') && code.includes('Hello, World!')) {
      setTestResult({
        status: 'success',
        output: 'Hello, World!',
        message: 'Test passed!'
      });
    } else {
      setTestResult({
        status: 'error',
        output: '',
        message: 'Test failed: Make sure to print "Hello, World!"'
      });
    }
  };

  const handleSubmit = () => {
    // Test one more time before submitting
    if (code.includes('print') && code.includes('Hello, World!')) {
      onComplete(points);
    } else {
      setTestResult({
        status: 'error',
        output: '',
        message: 'Submission failed: Make sure to print "Hello, World!"'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-gray-800 rounded-xl w-full max-w-4xl p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">{title}</h3>
          <button className="text-gray-400 hover:text-white" onClick={onClose}>
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <h4 className="text-xl font-bold mb-4">{title}</h4>
              <p className="text-gray-300 mb-4">{task}</p>
              <div className="bg-gray-900 p-4 rounded-lg mb-4">
                <pre className="text-gray-300"><code>{starterCode}</code></pre>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-star text-accent mr-2"></i>
                  <span>+{points} points</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-clock text-gray-400 mr-2"></i>
                  <span className="text-gray-400">5 minutes</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h4 className="text-lg font-bold mb-2">Expected Output:</h4>
              <div className="bg-gray-900 p-4 rounded-lg">
                <pre className="text-gray-300"><code>{expectedOutput}</code></pre>
              </div>
              
              {testResult.status !== 'idle' && (
                <div className="mt-4">
                  <h4 className="text-lg font-bold mb-2">Your Output:</h4>
                  <div className={`bg-gray-900 p-4 rounded-lg border ${
                    testResult.status === 'success' ? 'border-green-500' : 'border-red-500'
                  }`}>
                    <pre className="text-gray-300"><code>{testResult.output || 'No output'}</code></pre>
                    <p className={`mt-2 ${
                      testResult.status === 'success' ? 'text-green-500' : 'text-red-500'
                    }`}>{testResult.message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="bg-gray-900 rounded-lg overflow-hidden mb-6">
              <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                <span className="font-bold">Your Solution</span>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-white">
                    <i className="fas fa-expand-alt"></i>
                  </button>
                  <button 
                    className="text-gray-400 hover:text-white"
                    onClick={() => setCode(starterCode)}
                  >
                    <i className="fas fa-redo-alt"></i>
                  </button>
                </div>
              </div>
              <Textarea
                className="w-full h-64 bg-gray-900 text-gray-300 p-4 focus:outline-none font-mono border-none resize-none"
                placeholder="Write your code here..."
                value={code}
                onChange={handleCodeChange}
              />
            </div>
            
            <div className="space-x-4 flex justify-end">
              <Button 
                variant="outline"
                className="py-3 px-6 bg-gray-700 rounded-lg"
                onClick={handleTest}
              >
                TEST
              </Button>
              <Button 
                className={`py-3 px-8 bg-primary rounded-lg ${gameButtonStyles}`}
                onClick={handleSubmit}
                disabled={testResult.status !== 'success'}
              >
                SUBMIT
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodingModal;
