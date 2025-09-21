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
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MathProblem {
  id: string;
  question: string;
  answer: number;
  options: number[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in seconds
}

interface MathRunnerProps {
  onScoreUpdate: (score: number) => void;
  onGameComplete: (finalScore: number, timeSpent: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // total game time in seconds
  className?: string;
}

export function MathRunner({ 
  onScoreUpdate, 
  onGameComplete, 
  difficulty, 
  timeLimit,
  className 
}: MathRunnerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Generate math problems based on difficulty
  const generateProblem = useCallback((): MathProblem => {
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1: number, num2: number, answer: number, question: string;
    
    switch (difficulty) {
      case 'easy':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        break;
      case 'medium':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        break;
      case 'hard':
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 100) + 1;
        break;
    }

    switch (operation) {
      case '+':
        answer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
        break;
      case '-':
        // Ensure positive result
        if (num1 < num2) [num1, num2] = [num2, num1];
        answer = num1 - num2;
        question = `${num1} - ${num2} = ?`;
        break;
      case '*':
        answer = num1 * num2;
        question = `${num1} × ${num2} = ?`;
        break;
      case '/':
        // Ensure whole number result
        answer = num1;
        num1 = num1 * num2;
        question = `${num1} ÷ ${num2} = ?`;
        break;
    }

    // Generate wrong options
    const options = [answer];
    while (options.length < 4) {
      const wrongAnswer = answer + Math.floor(Math.random() * 20) - 10;
      if (wrongAnswer !== answer && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }

    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return {
      id: `problem_${Date.now()}`,
      question,
      answer,
      options,
      difficulty,
      timeLimit: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 8 : 6
    };
  }, [difficulty]);

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

  // Problem timer effect
  useEffect(() => {
    let problemInterval: NodeJS.Timeout;
    
    if (isPlaying && currentProblem && !showResult) {
      problemInterval = setInterval(() => {
        // Time's up for current problem
        handleAnswer(-1); // -1 means time's up
      }, currentProblem.timeLimit * 1000);
    }
    
    return () => clearInterval(problemInterval);
  }, [isPlaying, currentProblem, showResult]);

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
    setScore(0);
    setStreak(0);
    setTimeLeft(timeLimit);
    setGameOver(false);
    setCurrentProblem(generateProblem());
  };

  const pauseGame = () => {
    setIsPlaying(!isPlaying);
  };

  const resetGame = () => {
    setGameStarted(false);
    setIsPlaying(false);
    setCurrentProblem(null);
    setScore(0);
    setStreak(0);
    setTimeLeft(timeLimit);
    setGameOver(false);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (answer: number) => {
    if (showResult || gameOver) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const correct = answer === currentProblem?.answer;
    setIsCorrect(correct);
    
    if (correct) {
      const points = currentProblem?.difficulty === 'easy' ? 10 : 
                   currentProblem?.difficulty === 'medium' ? 20 : 30;
      const newScore = score + points + (streak * 5);
      setScore(newScore);
      setStreak(prev => prev + 1);
      onScoreUpdate(newScore);
    } else {
      setStreak(0);
    }
    
    // Show result for 1.5 seconds, then next problem
    setTimeout(() => {
      if (timeLeft > 0) {
        setCurrentProblem(generateProblem());
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        handleGameOver();
      }
    }, 1500);
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
    return colors[diff as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStreakColor = (streakCount: number) => {
    if (streakCount >= 10) return 'text-purple-600';
    if (streakCount >= 5) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Math Runner</CardTitle>
                <p className="text-sm text-muted-foreground">Solve math problems as fast as you can!</p>
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
              <TrendingUp className={cn("w-4 h-4", getStreakColor(streak))} />
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
              <Target className="w-4 h-4 text-green-500" />
              <span className="text-2xl font-bold">{speed.toFixed(1)}x</span>
            </div>
            <p className="text-sm text-muted-foreground">Speed</p>
          </CardContent>
        </Card>
      </div>

      {/* Game Area */}
      <Card className="mb-6">
        <CardContent className="p-8">
          {!gameStarted ? (
            <div className="text-center py-12">
              <Zap className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <h3 className="text-2xl font-bold mb-2">Ready to Run?</h3>
              <p className="text-muted-foreground mb-6">
                Solve math problems as fast as you can! Each correct answer increases your speed.
              </p>
              <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500">
                <Play className="w-5 h-5 mr-2" />
                Start Game
              </Button>
            </div>
          ) : gameOver ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-2xl font-bold mb-2">Game Over!</h3>
              <p className="text-muted-foreground mb-6">
                Final Score: {score} points
              </p>
              <div className="flex space-x-4 justify-center">
                <Button onClick={startGame} size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Play Again
                </Button>
                <Button onClick={resetGame} variant="outline" size="lg">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          ) : currentProblem ? (
            <div className="space-y-6">
              {/* Problem Timer */}
              <div className="text-center">
                <Progress 
                  value={100} 
                  className="h-2 mb-2" 
                />
                <p className="text-sm text-muted-foreground">
                  {currentProblem.timeLimit} seconds per problem
                </p>
              </div>

              {/* Problem */}
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-8">{currentProblem.question}</h2>
                
                {/* Answer Options */}
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  {currentProblem.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      disabled={showResult}
                      className={cn(
                        "h-16 text-xl font-bold transition-all duration-200",
                        showResult && selectedAnswer === option && (
                          isCorrect ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                        ),
                        showResult && option === currentProblem.answer && "bg-green-500 hover:bg-green-600"
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
                      <div className="text-green-600 text-xl font-bold">
                        ✓ Correct! +{currentProblem.difficulty === 'easy' ? 10 : 
                                       currentProblem.difficulty === 'medium' ? 20 : 30} points
                      </div>
                    ) : (
                      <div className="text-red-600 text-xl font-bold">
                        ✗ Wrong! The answer was {currentProblem.answer}
                      </div>
                    )}
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
