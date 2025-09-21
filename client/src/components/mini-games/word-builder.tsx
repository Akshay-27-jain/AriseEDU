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
  BookOpen,
  Target,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WordPuzzle {
  id: string;
  word: string;
  scrambled: string;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  category: string;
}

interface WordBuilderProps {
  onScoreUpdate: (score: number) => void;
  onGameComplete: (finalScore: number, timeSpent: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  className?: string;
}

export function WordBuilder({ 
  onScoreUpdate, 
  onGameComplete, 
  difficulty, 
  timeLimit,
  className 
}: WordBuilderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState<WordPuzzle | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedLetters, setUsedLetters] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);

  // Word database by difficulty
  const wordDatabase = {
    easy: [
      { word: 'CAT', hint: 'A furry pet that meows', category: 'Animals' },
      { word: 'DOG', hint: 'A loyal pet that barks', category: 'Animals' },
      { word: 'SUN', hint: 'The bright star in our sky', category: 'Nature' },
      { word: 'MOON', hint: 'Shines at night', category: 'Nature' },
      { word: 'TREE', hint: 'Tall plant with leaves', category: 'Nature' },
      { word: 'BOOK', hint: 'You read this', category: 'Objects' },
      { word: 'CAKE', hint: 'Sweet dessert for birthdays', category: 'Food' },
      { word: 'FISH', hint: 'Lives in water', category: 'Animals' }
    ],
    medium: [
      { word: 'ELEPHANT', hint: 'Large animal with a trunk', category: 'Animals' },
      { word: 'MOUNTAIN', hint: 'Very tall landform', category: 'Geography' },
      { word: 'COMPUTER', hint: 'Electronic device for work', category: 'Technology' },
      { word: 'BUTTERFLY', hint: 'Colorful flying insect', category: 'Animals' },
      { word: 'ADVENTURE', hint: 'Exciting journey', category: 'Concepts' },
      { word: 'RAINBOW', hint: 'Colorful arc after rain', category: 'Nature' },
      { word: 'LIBRARY', hint: 'Place with many books', category: 'Places' },
      { word: 'FRIENDSHIP', hint: 'Bond between friends', category: 'Concepts' }
    ],
    hard: [
      { word: 'PHOTOSYNTHESIS', hint: 'Process plants use to make food', category: 'Science' },
      { word: 'MAGNIFICENT', hint: 'Extremely beautiful or impressive', category: 'Adjectives' },
      { word: 'EXTRAORDINARY', hint: 'Very unusual or remarkable', category: 'Adjectives' },
      { word: 'CONSTELLATION', hint: 'Group of stars forming a pattern', category: 'Astronomy' },
      { word: 'ARCHAEOLOGY', hint: 'Study of ancient civilizations', category: 'Science' },
      { word: 'PHILOSOPHY', hint: 'Study of fundamental questions', category: 'Academia' },
      { word: 'REVOLUTIONARY', hint: 'Involving dramatic change', category: 'Adjectives' },
      { word: 'SOPHISTICATED', hint: 'Complex and refined', category: 'Adjectives' }
    ]
  };

  // Scramble word function
  const scrambleWord = (word: string): string => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
  };

  // Generate word puzzle
  const generatePuzzle = useCallback((): WordPuzzle => {
    const words = wordDatabase[difficulty];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const scrambled = scrambleWord(randomWord.word);
    
    return {
      id: `puzzle_${Date.now()}`,
      word: randomWord.word,
      scrambled,
      hint: randomWord.hint,
      difficulty,
      timeLimit: difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 60,
      category: randomWord.category
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
    
    if (isPlaying && currentPuzzle && !showResult) {
      problemInterval = setInterval(() => {
        // Time's up for current problem
        handleSubmit();
      }, currentPuzzle.timeLimit * 1000);
    }
    
    return () => clearInterval(problemInterval);
  }, [isPlaying, currentPuzzle, showResult]);

  // Update available letters when puzzle changes
  useEffect(() => {
    if (currentPuzzle) {
      setAvailableLetters(currentPuzzle.scrambled.split(''));
      setUsedLetters([]);
      setUserInput('');
    }
  }, [currentPuzzle]);

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
    setScore(0);
    setStreak(0);
    setTimeLeft(timeLimit);
    setGameOver(false);
    setCurrentPuzzle(generatePuzzle());
  };

  const pauseGame = () => {
    setIsPlaying(!isPlaying);
  };

  const resetGame = () => {
    setGameStarted(false);
    setIsPlaying(false);
    setCurrentPuzzle(null);
    setScore(0);
    setStreak(0);
    setTimeLeft(timeLimit);
    setGameOver(false);
    setUserInput('');
    setShowResult(false);
    setUsedLetters([]);
    setAvailableLetters([]);
  };

  const handleLetterClick = (letter: string, index: number) => {
    if (showResult || gameOver) return;
    
    setUserInput(prev => prev + letter);
    setUsedLetters(prev => [...prev, letter]);
    setAvailableLetters(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveLetter = (index: number) => {
    if (showResult || gameOver) return;
    
    const letter = userInput[index];
    setUserInput(prev => prev.slice(0, index) + prev.slice(index + 1));
    setUsedLetters(prev => prev.filter((_, i) => i !== index));
    setAvailableLetters(prev => [...prev, letter]);
  };

  const handleSubmit = () => {
    if (showResult || gameOver || !currentPuzzle) return;
    
    const correct = userInput.toUpperCase() === currentPuzzle.word.toUpperCase();
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      const points = currentPuzzle.difficulty === 'easy' ? 15 : 
                   currentPuzzle.difficulty === 'medium' ? 25 : 40;
      const newScore = score + points + (streak * 3);
      setScore(newScore);
      setStreak(prev => prev + 1);
      onScoreUpdate(newScore);
    } else {
      setStreak(0);
    }
    
    // Show result for 2 seconds, then next puzzle
    setTimeout(() => {
      if (timeLeft > 0) {
        setCurrentPuzzle(generatePuzzle());
        setUserInput('');
        setShowResult(false);
        setUsedLetters([]);
      } else {
        handleGameOver();
      }
    }, 2000);
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
    if (streakCount >= 8) return 'text-purple-600';
    if (streakCount >= 5) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Word Builder</CardTitle>
                <p className="text-sm text-muted-foreground">Unscramble the letters to form words!</p>
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
              <BookOpen className="w-4 h-4 text-green-500" />
              <span className="text-2xl font-bold">{currentPuzzle?.word.length || 0}</span>
            </div>
            <p className="text-sm text-muted-foreground">Letters</p>
          </CardContent>
        </Card>
      </div>

      {/* Game Area */}
      <Card className="mb-6">
        <CardContent className="p-8">
          {!gameStarted ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-2xl font-bold mb-2">Ready to Build Words?</h3>
              <p className="text-muted-foreground mb-6">
                Unscramble the letters to form the correct word. Use the hint if you need help!
              </p>
              <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-green-500 to-blue-500">
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
          ) : currentPuzzle ? (
            <div className="space-y-6">
              {/* Puzzle Timer */}
              <div className="text-center">
                <Progress 
                  value={100} 
                  className="h-2 mb-2" 
                />
                <p className="text-sm text-muted-foreground">
                  {currentPuzzle.timeLimit} seconds per word
                </p>
              </div>

              {/* Hint */}
              <div className="text-center">
                <Badge variant="outline" className="mb-4">
                  {currentPuzzle.category}
                </Badge>
                <p className="text-lg text-muted-foreground mb-6">
                  {currentPuzzle.hint}
                </p>
              </div>

              {/* User Input */}
              <div className="text-center">
                <div className="min-h-[60px] flex items-center justify-center mb-4">
                  <div className="flex space-x-2">
                    {userInput.split('').map((letter, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleRemoveLetter(index)}
                        className="w-12 h-12 text-xl font-bold"
                      >
                        {letter}
                      </Button>
                    ))}
                    {userInput.length === 0 && (
                      <div className="text-muted-foreground text-lg">
                        Click letters to build your word
                      </div>
                    )}
                  </div>
                </div>

                {/* Available Letters */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {availableLetters.map((letter, index) => (
                    <Button
                      key={index}
                      onClick={() => handleLetterClick(letter, index)}
                      disabled={showResult}
                      className="w-12 h-12 text-xl font-bold"
                      variant="outline"
                    >
                      {letter}
                    </Button>
                  ))}
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={showResult || userInput.length === 0}
                  size="lg"
                  className="mb-4"
                >
                  Submit Word
                </Button>

                {/* Result Feedback */}
                {showResult && (
                  <div className="mt-6">
                    {isCorrect ? (
                      <div className="text-green-600 text-xl font-bold flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 mr-2" />
                        Correct! +{currentPuzzle.difficulty === 'easy' ? 15 : 
                                   currentPuzzle.difficulty === 'medium' ? 25 : 40} points
                      </div>
                    ) : (
                      <div className="text-red-600 text-xl font-bold flex items-center justify-center">
                        <XCircle className="w-6 h-6 mr-2" />
                        Wrong! The word was "{currentPuzzle.word}"
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
