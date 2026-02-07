import React, { useState, useEffect } from 'react';
import type { QuizConfig } from '../data/mockData';
import { Check, X, Award, ArrowRight, HelpCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface QuizPlayerProps {
  quizConfig: QuizConfig;
  onComplete: (score: number) => void;
}

interface QuestionState {
    status: 'unanswered' | 'correct' | 'incorrect';
    attempts: number;
    selectedOption: number | null;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quizConfig, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 is intro
  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>({});
  const [totalScore, setTotalScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Initialize states
  useEffect(() => {
    const initialStates: Record<string, QuestionState> = {};
    quizConfig.questions.forEach(q => {
        initialStates[q.id] = { status: 'unanswered', attempts: 0, selectedOption: null };
    });
    setQuestionStates(initialStates);
  }, [quizConfig]);

  const currentQuestion = quizConfig.questions[currentQuestionIndex];
  const currentState = currentQuestion ? questionStates[currentQuestion.id] : null;

  const handleStart = () => setCurrentQuestionIndex(0);

  const handleOptionSelect = (optionIdx: number) => {
    if (!currentState || currentState.status === 'correct') return; // Locked if correct

    setQuestionStates(prev => ({
        ...prev,
        [currentQuestion.id]: { 
            ...prev[currentQuestion.id], 
            selectedOption: optionIdx,
            status: 'unanswered' // Reset status so it doesn't show red immediately
        }
    }));
  };

  const handleSubmitAnswer = () => {
    if (!currentState || currentState.selectedOption === null) return;

    const isCorrect = currentState.selectedOption === currentQuestion.correctOption;
    
    setQuestionStates(prev => {
        const newState = { ...prev[currentQuestion.id] };
        
        if (isCorrect) {
            newState.status = 'correct';
            // Calculate score for this question
            let points = 0;
            const attempt = newState.attempts + 1; // current attempt
            if (attempt === 1) points = 5;
            else if (attempt === 2) points = 3;
            else if (attempt === 3) points = 1;
            else points = 0;
            
            setTotalScore(s => s + points);
        } else {
            newState.status = 'incorrect';
            newState.attempts += 1;
        }
        
        return { ...prev, [currentQuestion.id]: newState };
    });
    
    // Check global completion if correct
    if (isCorrect) {
        // We do this check in effect or separate loop usually, but here is fine
        const allSolved = quizConfig.questions.every((q, idx) => {
             if (idx === currentQuestionIndex) return true; // this one is solved now
             return questionStates[q.id]?.status === 'correct';
        });
        
        if (allSolved) {
             // Wait a bit then show success? Or just state
        }
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizConfig.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
    } else {
        setIsQuizCompleted(true);
        onComplete(totalScore);
    }
  };

  // Intro Screen
  if (currentQuestionIndex === -1) {
     return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-br from-white to-blue-50/50 rounded-2xl">
             <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
                 <HelpCircle size={48} className="text-blue-600" />
             </div>
             <h2 className="text-3xl font-black text-gray-900 mb-4">Quiz: Test Your Skills</h2>
             <p className="text-gray-600 mb-8 max-w-lg leading-relaxed">
                 Answer {quizConfig.questions.length} questions correctly to complete this lesson. 
                 Points are awarded based on how many attempts it takes you to get the correct answer.
             </p>
             
             <div className="grid grid-cols-4 gap-4 w-full max-w-2xl mb-10">
                  {[
                      { l: '1st Try', p: '5pts', c: 'bg-green-100 text-green-700 border-green-200' },
                      { l: '2nd Try', p: '3pts', c: 'bg-blue-100 text-blue-700 border-blue-200' },
                      { l: '3rd Try', p: '1pt', c: 'bg-orange-100 text-orange-700 border-orange-200' },
                      { l: '4th+', p: '0pts', c: 'bg-gray-100 text-gray-700 border-gray-200' },
                  ].map((r, i) => (
                      <div key={i} className={`border rounded-xl p-4 flex flex-col items-center ${r.c}`}>
                          <span className="text-xs font-bold uppercase tracking-wide opacity-80">{r.l}</span>
                          <span className="text-2xl font-black">{r.p}</span>
                      </div>
                  ))}
             </div>

             <button onClick={handleStart} className="btn-primary px-8 py-3 text-lg shadow-lg shadow-blue-500/30 flex items-center gap-2">
                 Start Quiz <ArrowRight size={20} />
             </button>
        </div>
     )
  }

  // Completion Screen
  if (isQuizCompleted) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-green-50">
                <Award size={56} className="text-green-600" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">Quiz Completed!</h2>
            <div className="text-2xl text-gray-600 mb-8">
                You scored <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-100">{totalScore} Points</span>
            </div>
            <p className="text-gray-500 mb-8 max-w-md">Great job demonstrating your knowledge. This lesson is now marked as complete.</p>
        </div>
      )
  }

  // Question UI
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 h-full flex flex-col">
       {/* Progress Header */}
       <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
             <span>Question {currentQuestionIndex + 1}</span>
             <span className="text-gray-300">/</span>
             <span>{quizConfig.questions.length}</span>
          </div>
          <div className="flex gap-1">
             {quizConfig.questions.map((q, i) => {
                 const s = questionStates[q.id];
                 return (
                     <div key={i} className={`w-2 h-2 rounded-full transition-all ${
                         i === currentQuestionIndex ? 'w-8 bg-blue-600' : 
                         s?.status === 'correct' ? 'bg-green-500' : 'bg-gray-200'
                     }`}></div>
                 )
             })}
          </div>
       </div>

       {/* Question Card */}
       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex-1 flex flex-col">
           <h3 className="text-2xl font-bold text-gray-900 mb-8 leading-snug">{currentQuestion.text}</h3>

           <div className="space-y-3 flex-1">
               {currentQuestion.options.map((option, idx) => {
                   const isSelected = currentState?.selectedOption === idx;
                   const isLocked = currentState?.status === 'correct';
                   const isCorrectOption = idx === currentQuestion.correctOption;
                   
                   let cardClass = "border-gray-100 hover:bg-gray-50 hover:border-gray-300";
                   if (isSelected) cardClass = "border-blue-500 bg-blue-50 ring-1 ring-blue-500";
                   if (isLocked && isCorrectOption) cardClass = "border-green-500 bg-green-50 ring-1 ring-green-500";
                   if (currentState?.status === 'incorrect' && isSelected) cardClass = "border-red-500 bg-red-50 ring-1 ring-red-500";

                   return (
                       <button
                          key={idx}
                          disabled={isLocked}
                          onClick={() => handleOptionSelect(idx)}
                          className={`w-full text-left p-5 rounded-xl border-2 transition-all flex items-center justify-between group ${cardClass}`}
                       >
                          <span className={`font-medium text-lg ${isLocked && isCorrectOption ? 'text-green-800' : 'text-gray-700'}`}>{option}</span>
                          
                          {/* Status Icons */}
                          {isLocked && isCorrectOption && <CheckCircle2 size={24} className="text-green-600" />}
                          {currentState?.status === 'incorrect' && isSelected && <AlertCircle size={24} className="text-red-500" />}
                          {!isLocked && currentState?.status !== 'incorrect' && (
                              <div className={`w-5 h-5 rounded-full border-2 ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 group-hover:border-gray-400'}`}></div>
                          )}
                       </button>
                   );
               })}
           </div>

           {/* Actions Area */}
           <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="text-sm">
                    {currentState?.status === 'incorrect' && (
                         <span className="text-red-600 font-bold flex items-center gap-1 animate-pulse">
                            <X size={16} /> Incorrect. Try again!
                         </span>
                    )}
                    {currentState?.status === 'correct' && (
                         <span className="text-green-600 font-bold flex items-center gap-1">
                            <Check size={16} /> Correct! +{currentState.attempts === 0 ? 5 : currentState.attempts === 1 ? 3 : currentState.attempts === 2 ? 1 : 0} points
                         </span>
                    )}
                </div>

                {currentState?.status === 'correct' ? (
                     <button onClick={handleNext} className="btn-primary pl-8 pr-6 py-3 flex items-center gap-2">
                         {currentQuestionIndex === quizConfig.questions.length - 1 ? 'Finish Quiz' : 'Next Question'} <ArrowRight size={20} />
                     </button>
                ) : (
                     <button 
                        onClick={handleSubmitAnswer} 
                        disabled={currentState?.selectedOption === null}
                        className="btn-secondary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        Submit Answer
                     </button>
                )}
           </div>
       </div>
    </div>
  );
};
