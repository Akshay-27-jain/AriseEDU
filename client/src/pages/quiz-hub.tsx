import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Gamepad2, 
  Sparkles, 
  Clock, 
  Star, 
  Trophy,
  Zap,
  Target,
  Users,
  Award,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Brain,
  Flame
} from 'lucide-react';
import { BottomNavigation } from '@/components/bottom-navigation';
import { cn } from '@/lib/utils';

export default function QuizHub() {
  const [activeTab, setActiveTab] = useState('traditional');
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);

  // Sample quiz data
  const traditionalQuizzes = [
    {
      id: 'math-basic',
      title: 'Basic Mathematics',
      subject: 'Mathematics',
      difficulty: 'Easy',
      questions: 10,
      timeLimit: 15,
      points: 100,
      color: 'bg-blue-500',
      description: 'Test your basic math skills'
    },
    {
      id: 'science-physics',
      title: 'Physics Fundamentals',
      subject: 'Science',
      difficulty: 'Medium',
      questions: 15,
      timeLimit: 20,
      points: 150,
      color: 'bg-green-500',
      description: 'Explore the laws of physics'
    },
    {
      id: 'language-grammar',
      title: 'English Grammar',
      subject: 'Language',
      difficulty: 'Easy',
      questions: 12,
      timeLimit: 18,
      points: 120,
      color: 'bg-purple-500',
      description: 'Master English grammar rules'
    }
  ];

  const miniGames = [
    {
      id: 'math-runner',
      title: 'Math Runner',
      type: 'Speed Game',
      difficulty: 'Medium',
      timeLimit: 60,
      points: 200,
      color: 'bg-red-500',
      description: 'Solve math problems as fast as you can!',
      icon: '🏃‍♂️'
    },
    {
      id: 'word-builder',
      title: 'Word Builder',
      type: 'Puzzle Game',
      difficulty: 'Easy',
      timeLimit: 90,
      points: 150,
      color: 'bg-yellow-500',
      description: 'Unscramble letters to form words',
      icon: '🧩'
    },
    {
      id: 'science-lab',
      title: 'Science Lab',
      type: 'Experiment Game',
      difficulty: 'Hard',
      timeLimit: 120,
      points: 300,
      color: 'bg-indigo-500',
      description: 'Conduct virtual science experiments',
      icon: '🧪'
    }
  ];

  const festivalQuizzes = [
    {
      id: 'diwali-quiz',
      title: 'Diwali Festival Quiz',
      type: 'Cultural',
      difficulty: 'Easy',
      timeLimit: 10,
      points: 100,
      color: 'bg-orange-500',
      description: 'Test your knowledge about Diwali',
      icon: '🎆',
      isActive: true
    },
    {
      id: 'pongal-quiz',
      title: 'Pongal Harvest Quiz',
      type: 'Cultural',
      difficulty: 'Medium',
      timeLimit: 15,
      points: 150,
      color: 'bg-yellow-500',
      description: 'Learn about Pongal celebrations',
      icon: '🌾',
      isActive: false
    },
    {
      id: 'independence-quiz',
      title: 'Independence Day Quiz',
      type: 'Cultural',
      difficulty: 'Medium',
      timeLimit: 12,
      points: 120,
      color: 'bg-green-500',
      description: 'Celebrate India\'s independence',
      icon: '🇮🇳',
      isActive: false
    }
  ];

  const communityChallenges = [
    {
      id: 'weekly-math',
      title: 'Weekly Math Challenge',
      description: 'Solve 50 math problems this week',
      participants: 125,
      progress: 35,
      target: 50,
      timeLeft: '3 days',
      rewards: 'Special Math Badge',
      color: 'bg-blue-500'
    },
    {
      id: 'science-explorer',
      title: 'Science Explorer Mission',
      description: 'Complete 20 science experiments',
      participants: 89,
      progress: 12,
      target: 20,
      timeLeft: '5 days',
      rewards: 'Science Explorer Badge',
      color: 'bg-green-500'
    }
  ];

  // Sample questions for demo
  const sampleQuestions = [
    {
      id: 1,
      question: 'What is 15 + 27?',
      options: ['40', '42', '41', '43'],
      correct: 1,
      explanation: '15 + 27 = 42'
    },
    {
      id: 2,
      question: 'Which planet is closest to the Sun?',
      options: ['Venus', 'Mercury', 'Earth', 'Mars'],
      correct: 1,
      explanation: 'Mercury is the closest planet to the Sun'
    }
  ];

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setQuizStarted(true);
    setTimeLeft(quiz.timeLimit * 60); // Convert to seconds
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setStreak(0);
  };

  const handleAnswer = (answerIndex) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === sampleQuestions[currentQuestion]?.correct;
    if (isCorrect) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    setTimeout(() => {
      if (currentQuestion < sampleQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // Quiz completed
        setQuizStarted(false);
        setCurrentQuiz(null);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuiz(null);
    setTimeLeft(0);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setStreak(0);
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (quizStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            resetQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (quizStarted && currentQuiz) {
    const question = sampleQuestions[currentQuestion];
    const isCorrect = selectedAnswer === question?.correct;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Quiz Header */}
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{currentQuiz.title}</h1>
              <p className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {sampleQuestions.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">{streak}</div>
                <div className="text-sm text-muted-foreground">Streak</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">{formatTime(timeLeft)}</div>
                <div className="text-sm text-muted-foreground">Time Left</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Content */}
        <div className="p-6">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              {question && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center mb-8">{question.question}</h2>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {question.options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={showResult}
                        className={cn(
                          "h-16 text-lg font-medium transition-all duration-200",
                          showResult && selectedAnswer === index && (
                            isCorrect ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                          ),
                          showResult && index === question.correct && "bg-green-500 hover:bg-green-600"
                        )}
                        variant={showResult ? "default" : "outline"}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>

                  {showResult && (
                    <div className="mt-6 text-center">
                      {isCorrect ? (
                        <div className="text-green-600 text-xl font-bold flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 mr-2" />
                          Correct! +10 points
                        </div>
                      ) : (
                        <div className="text-red-600 text-xl font-bold flex items-center justify-center">
                          <XCircle className="w-6 h-6 mr-2" />
                          Wrong! The answer was "{question.options[question.correct]}"
                        </div>
                      )}
                      
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quiz Controls */}
        <div className="fixed bottom-4 left-4 right-4">
          <div className="flex justify-center space-x-4">
            <Button onClick={resetQuiz} variant="outline" size="lg">
              <RotateCcw className="w-5 h-5 mr-2" />
              Exit Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="gradient-bg text-white py-6 px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Quiz Hub</h1>
            <p className="text-white/80">Choose your learning adventure</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">1,250</div>
            <div className="text-sm text-white/80">Total Points</div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="traditional">Traditional</TabsTrigger>
            <TabsTrigger value="mini-games">Mini Games</TabsTrigger>
            <TabsTrigger value="festivals">Festivals</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          {/* Traditional Quizzes */}
          <TabsContent value="traditional" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {traditionalQuizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 ${quiz.color} rounded-lg flex items-center justify-center`}>
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="outline">{quiz.difficulty}</Badge>
                    </div>
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{quiz.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Questions</span>
                        <span>{quiz.questions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Time Limit</span>
                        <span>{quiz.timeLimit} min</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Points</span>
                        <span>{quiz.points}</span>
                      </div>
                      <Button 
                        onClick={() => startQuiz(quiz)}
                        className="w-full mt-4"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Quiz
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Mini Games */}
          <TabsContent value="mini-games" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {miniGames.map((game) => (
                <Card key={game.id} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="text-4xl">{game.icon}</div>
                      <Badge variant="outline">{game.difficulty}</Badge>
                    </div>
                    <CardTitle className="text-lg">{game.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Type</span>
                        <span>{game.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Time Limit</span>
                        <span>{game.timeLimit} sec</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Points</span>
                        <span>{game.points}</span>
                      </div>
                      <Button 
                        onClick={() => startQuiz(game)}
                        className="w-full mt-4"
                      >
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        Play Game
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Festival Quizzes */}
          <TabsContent value="festivals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {festivalQuizzes.map((quiz) => (
                <Card key={quiz.id} className={`hover:shadow-lg transition-all duration-200 ${!quiz.isActive ? 'opacity-60' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="text-4xl">{quiz.icon}</div>
                      <div className="flex space-x-2">
                        <Badge variant="outline">{quiz.difficulty}</Badge>
                        {quiz.isActive && <Badge className="bg-green-100 text-green-800">Active</Badge>}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{quiz.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Type</span>
                        <span>{quiz.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Time Limit</span>
                        <span>{quiz.timeLimit} min</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Points</span>
                        <span>{quiz.points}</span>
                      </div>
                      <Button 
                        onClick={() => startQuiz(quiz)}
                        disabled={!quiz.isActive}
                        className="w-full mt-4"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {quiz.isActive ? 'Start Quiz' : 'Coming Soon'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Community Challenges */}
          <TabsContent value="community" className="space-y-6">
            <div className="space-y-4">
              {communityChallenges.map((challenge) => (
                <Card key={challenge.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${challenge.color} rounded-lg flex items-center justify-center`}>
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{challenge.title}</h3>
                          <p className="text-sm text-muted-foreground">{challenge.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">{challenge.participants} participants</div>
                        <div className="text-sm text-muted-foreground">{challenge.timeLeft} left</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{challenge.progress}/{challenge.target}</span>
                      </div>
                      <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Reward: {challenge.rewards}</span>
                        <Button size="sm">
                          <Users className="w-4 h-4 mr-2" />
                          Join Challenge
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation currentPage="quiz" />
    </div>
  );
}

