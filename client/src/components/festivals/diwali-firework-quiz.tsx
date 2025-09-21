import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Trophy, 
  Clock, 
  Sparkles,
  Target,
  Star,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiwaliQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'history' | 'traditions' | 'culture' | 'festivals';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface DiwaliFireworkQuizProps {
  onScoreUpdate: (score: number) => void;
  onGameComplete: (finalScore: number, timeSpent: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  className?: string;
}

export function DiwaliFireworkQuiz({ 
  onScoreUpdate, 
  onGameComplete, 
  difficulty, 
  timeLimit,
  className 
}: DiwaliFireworkQuizProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<DiwaliQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [fireworks, setFireworks] = useState<Array<{id: string, x: number, y: number, color: string}>>([]);
  const [questionIndex, setQuestionIndex] = useState(0);

  // Diwali questions database
  const diwaliQuestions: DiwaliQuestion[] = [
    {
      id: '1',
      question: 'What does Diwali celebrate?',
      options: ['Victory of light over darkness', 'Birth of Lord Krishna', 'Beginning of winter', 'Harvest festival'],
      correctAnswer: 0,
      explanation: 'Diwali celebrates the victory of light over darkness, good over evil, and knowledge over ignorance.',
      category: 'traditions',
      difficulty: 'easy'
    },
    {
      id: '2',
      question: 'Which goddess is primarily worshipped during Diwali?',
      options: ['Saraswati', 'Lakshmi', 'Durga', 'Kali'],
      correctAnswer: 1,
      explanation: 'Goddess Lakshmi, the goddess of wealth and prosperity, is primarily worshipped during Diwali.',
      category: 'traditions',
      difficulty: 'easy'
    },
    {
      id: '3',
      question: 'What is the traditional oil lamp called that is lit during Diwali?',
      options: ['Candle', 'Diya', 'Torch', 'Lantern'],
      correctAnswer: 1,
      explanation: 'Diya is the traditional oil lamp made of clay that is lit during Diwali celebrations.',
      category: 'traditions',
      difficulty: 'easy'
    },
    {
      id: '4',
      question: 'How many days does Diwali typically last?',
      options: ['1 day', '3 days', '5 days', '7 days'],
      correctAnswer: 2,
      explanation: 'Diwali is a 5-day festival, with each day having its own significance and rituals.',
      category: 'traditions',
      difficulty: 'medium'
    },
    {
      id: '5',
      question: 'What is the significance of Rangoli during Diwali?',
      options: ['Decoration', 'Welcome sign for Goddess Lakshmi', 'Good luck charm', 'All of the above'],
      correctAnswer: 3,
      explanation: 'Rangoli serves as decoration, a welcome sign for Goddess Lakshmi, and is considered a good luck charm.',
      category: 'traditions',
      difficulty: 'medium'
    },
    {
      id: '6',
      question: 'Which epic story is associated with Diwali?',
      options: ['Mahabharata', 'Ramayana', 'Bhagavad Gita', 'Vedas'],
      correctAnswer: 1,
      explanation: 'Diwali is associated with Lord Rama\'s return to Ayodhya after defeating Ravana, as told in the Ramayana.',
      category: 'history',
      difficulty: 'medium'
    },
    {
      id: '7',
      question: 'What is the traditional sweet made during Diwali?',
      options: ['Gulab Jamun', 'Ladoo', 'Barfi', 'All of the above'],
      correctAnswer: 3,
      explanation: 'Various sweets including Gulab Jamun, Ladoo, and Barfi are traditionally made during Diwali.',
      category: 'traditions',
      difficulty: 'easy'
    },
    {
      id: '8',
      question: 'In which month does Diwali usually fall?',
      options: ['September', 'October', 'November', 'December'],
      correctAnswer: 2,
      explanation: 'Diwali usually falls in October or November, depending on the lunar calendar.',
      category: 'culture',
      difficulty: 'easy'
    },
    {
      id: '9',
      question: 'What is the significance of cleaning homes before Diwali?',
      options: ['Aesthetic appeal', 'Welcome Goddess Lakshmi', 'Remove negative energy', 'Both B and C'],
      correctAnswer: 3,
      explanation: 'Cleaning homes before Diwali is done to welcome Goddess Lakshmi and remove negative energy.',
      category: 'traditions',
      difficulty: 'medium'
    },
    {
      id: '10',
      question: 'Which country celebrates Diwali as a national holiday?',
      options: ['India', 'Nepal', 'Sri Lanka', 'All of the above'],
      correctAnswer: 3,
      explanation: 'Diwali is celebrated as a national holiday in India, Nepal, and Sri Lanka.',
      category: 'culture',
      difficulty: 'hard'
    }
  ];

  // Filter questions by difficulty
  const filteredQuestions = diwaliQuestions.filter(q => q.difficulty === difficulty);

  // Generate fireworks animation
  const createFirework = useCallback(() => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    const newFirework = {
      id: `firework_${Date.now()}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    
    setFireworks(prev => [...prev, newFirework]);
    
    // Remove firework after animation
    setTimeout(() => {
      setFireworks(prev => prev.filter(f => f.id !== newFirework.id));
    }, 2000);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  // Question timer effect
  useEffect(() => {
    let questionInterval: NodeJS.Timeout;
    
    if (isPlaying && currentQuestion && !showResult) {
      questionInterval = setInterval(() => {
        // Time's up for current question
        handleAnswer(-1); // -1 means time's up
      }, 15000); // 15 seconds per question
    }
    
    return () => clearInterval(questionInterval);
  }, [isPlaying, currentQuestion, showResult]);

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
    setScore(0);
    setStreak(0);
    setTimeLeft(timeLimit);
    setGameOver(false);
    setQuestionIndex(0);
    setCurrentQuestion(filteredQuestions[0]);
  };

  const pauseGame = () => {
    setIsPlaying(!isPlaying);
  };

  const resetGame = () => {
    setGameStarted(false);
    setIsPlaying(false);
    setCurrentQuestion(null);
    setScore(0);
    setStreak(0);
    setTimeLeft(timeLimit);
    setGameOver(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setFireworks([]);
    setQuestionIndex(0);
  };

  const handleAnswer = (answerIndex: number) => {
    if (showResult || gameOver || !currentQuestion) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      const points = currentQuestion.difficulty === 'easy' ? 20 : 
                   currentQuestion.difficulty === 'medium' ? 30 : 50;
      const newScore = score + points + (streak * 5);
      setScore(newScore);
      setStreak(prev => prev + 1);
      onScoreUpdate(newScore);
      
      // Create fireworks for correct answer
      createFirework();
    } else {
      setStreak(0);
    }
    
    // Show result for 3 seconds, then next question
    setTimeout(() => {
      if (questionIndex < filteredQuestions.length - 1) {
        setQuestionIndex(prev => prev + 1);
        setCurrentQuestion(filteredQuestions[questionIndex + 1]);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        handleGameOver();
      }
    }, 3000);
  };

  const handleGameOver = () => {
    setIsPlaying(false);
    setGameOver(true);
    onGameComplete(score, timeLimit - timeLeft);
  };

  const getDifficultyColor = (diff: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[colors[diff as keyof typeof colors] || 'bg-gray-100 text-gray-800'];
  };

  const getStreakColor = (streakCount: number) => {
    if (streakCount >= 5) return 'text-purple-600';
    if (streakCount >= 3) return 'text-orange-600';
    return 'text-green-600';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      history: 'bg-blue-100 text-blue-800',
      traditions: 'bg-green-100 text-green-800',
      culture: 'bg-purple-100 text-purple-800',
      festivals: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto relative", className)}>
      {/* Fireworks Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {fireworks.map(firework => (
          <div
            key={firework.id}
            className="absolute w-4 h-4 rounded-full animate-ping"
            style={{
              left: `${firework.x}%`,
              top: `${firework.y}%`,
              backgroundColor: firework.color,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>

      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 relative z-10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-orange-800">🎆 Diwali Firework Quiz</CardTitle>
                <p className="text-sm text-muted-foreground">Test your knowledge about the Festival of Lights!</p>
              </div>
            </div>
            <Badge className={getDifficultyColor(difficulty)}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-2xl font-bold">{score}</span>
            </div>
            <p className="text-sm text-muted-foreground">Score</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Target className={cn("w-4 h-4", getStreakColor(streak))} />
              <span className={cn("text-2xl font-bold", getStreakColor(streak))}>{streak}</span>
            </div>
            <p className="text-sm text-muted-foreground">Streak</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-2xl font-bold">{timeLeft}</span>
            </div>
            <p className="text-sm text-muted-foreground">Time Left</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Star className="w-4 h-4 text-orange-500" />
              <span className="text-2xl font-bold">{questionIndex + 1}/{filteredQuestions.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Questions</p>
          </CardContent>
        </Card>
      </div>

      {/* Game Area */}
      <Card className="mb-6">
        <CardContent className="p-8">
          {!gameStarted ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎆</div>
              <h3 className="text-2xl font-bold mb-2 text-orange-800">Ready for Diwali Quiz?</h3>
              <p className="text-muted-foreground mb-6">
                Test your knowledge about the Festival of Lights! Correct answers will light up fireworks! 🎇
              </p>
              <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-orange-500 to-red-500">
                <Play className="w-5 h-5 mr-2" />
                Start Quiz
              </Button>
            </div>
          ) : gameOver ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-2 text-orange-800">Quiz Complete!</h3>
              <p className="text-muted-foreground mb-6">
                Final Score: {score} points
              </p>
              <div className="flex space-x-4 justify-center">
                <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-orange-500 to-red-500">
                  <Play className="w-5 h-5 mr-2" />
                  Play Again
                </Button>
                <Button onClick={resetGame} variant="outline" size="lg">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          ) : currentQuestion ? (
            <div className="space-y-6">
              {/* Question Progress */}
              <div className="text-center">
                <Progress 
                  value={((questionIndex + 1) / filteredQuestions.length) * 100} 
                  className="h-2 mb-2" 
                />
                <p className="text-sm text-muted-foreground">
                  Question {questionIndex + 1} of {filteredQuestions.length}
                </p>
              </div>

              {/* Question Category */}
              <div className="text-center">
                <Badge className={getCategoryColor(currentQuestion.category)}>
                  {currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1)}
                </Badge>
              </div>

              {/* Question */}
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-8 text-orange-800">
                  {currentQuestion.question}
                </h2>
                
                {/* Answer Options */}
                <div className="grid grid-cols-1 gap-3 max-w-lg mx-auto">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={showResult}
                      className={cn(
                        "h-16 text-lg font-medium transition-all duration-200",
                        showResult && selectedAnswer === index && (
                          isCorrect ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                        ),
                        showResult && index === currentQuestion.correctAnswer && "bg-green-500 hover:bg-green-600"
                      )}
                      variant={showResult ? "default" : "outline"}
                    >
                      {option}
                    </Button>
                  ))}
                </div>

                {/* Result Feedback */}
                {showResult && (
                  <div className="mt-6">
                    {isCorrect ? (
                      <div className="text-green-600 text-xl font-bold flex items-center justify-center">
                        <Sparkles className="w-6 h-6 mr-2" />
                        Correct! +{currentQuestion.difficulty === 'easy' ? 20 : 
                                   currentQuestion.difficulty === 'medium' ? 30 : 50} points
                      </div>
                    ) : (
                      <div className="text-red-600 text-xl font-bold flex items-center justify-center">
                        <Flame className="w-6 h-6 mr-2" />
                        Wrong! The answer was "{currentQuestion.options[currentQuestion.correctAnswer]}"
                      </div>
                    )}
                    
                    {/* Explanation */}
                    <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-800">
                        <strong>Explanation:</strong> {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Game Controls */}
      {gameStarted && !gameOver && (
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={pauseGame} 
            variant="outline"
            size="lg"
          >
            {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            {isPlaying ? 'Pause' : 'Resume'}
          </Button>
          <Button 
            onClick={resetGame} 
            variant="outline"
            size="lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>
      )}
    </div>
  );
}
