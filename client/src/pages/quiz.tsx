import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth.tsx";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function QuizPage() {
  const { quizId } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const { data: quiz, isLoading } = useQuery({
    queryKey: ["/api/quizzes", quizId],
    enabled: !!quizId,
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (data: {
      quizId: string;
      score: number;
      totalQuestions: number;
      timeSpent: number;
      answers: number[];
    }) => {
      const response = await apiRequest("POST", `/api/user/${user?.id}/quiz-attempts`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Quiz Completed!",
        description: "Great job! Your score has been saved.",
      });
      setLocation("/dashboard");
    },
  });

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSubmitQuiz();
    }
  }, [timeLeft]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-destructive">Quiz not found</div>
      </div>
    );
  }

  const currentQuestion = quiz?.questions?.[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (quiz?.questions?.length || 0) - 1;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);
      
      if (isLastQuestion) {
        handleSubmitQuiz(newAnswers);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      }
    }
  };

  const handleSubmitQuiz = (finalAnswers = answers) => {
    const score = finalAnswers.reduce((total, answer, index) => {
      return total + (answer === quiz?.questions?.[index]?.correctAnswer ? quiz?.questions?.[index]?.points || 0 : 0);
    }, 0);

    const timeSpent = (quiz?.timeLimit || 0) - timeLeft;

    submitQuizMutation.mutate({
      quizId: quiz?.id || '',
      score,
      totalQuestions: quiz?.questions?.length || 0,
      timeSpent,
      answers: finalAnswers,
    });
  };

  const handleSkip = () => {
    if (isLastQuestion) {
      handleSubmitQuiz();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-accent text-accent-foreground py-4 px-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation("/dashboard")}
            data-testid="button-exit-quiz"
          >
            <X className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-semibold" data-testid="text-quiz-title">{quiz?.title}</h1>
            <p className="text-sm opacity-80">Question {currentQuestionIndex + 1} of {quiz?.questions?.length || 0}</p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80">Time</div>
            <div className="font-semibold" data-testid="text-time-left">{formatTime(timeLeft)}</div>
          </div>
        </div>

        {/* Quiz Progress */}
        <div className="mt-4">
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className="bg-secondary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${((currentQuestionIndex + 1) / (quiz?.questions?.length || 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="px-6 py-8">
        <div className="max-w-md mx-auto">
          <Card className="bg-card rounded-2xl shadow-lg border border-border mb-6">
            <CardContent className="p-6">
              {/* Question Image */}
              <img 
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300" 
                alt="Children solving math problems together in classroom" 
                className="w-full h-32 object-cover rounded-xl mb-4"
              />

              <h2 className="text-xl font-semibold mb-4" data-testid="text-question">
                {currentQuestion?.question}
              </h2>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion?.options?.map((option: string, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full p-4 h-auto text-left justify-start transition-colors ${
                      selectedAnswer === index ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                    data-testid={`button-answer-${index}`}
                  >
                    <span className={`inline-block w-8 h-8 rounded-full text-center leading-8 mr-3 text-sm font-medium ${
                      selectedAnswer === index ? 'bg-white text-primary' : 'bg-primary text-primary-foreground'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleSkip}
              data-testid="button-skip"
            >
              Skip
            </Button>
            <Button 
              className="flex-1"
              onClick={handleNext}
              disabled={selectedAnswer === null}
              data-testid="button-submit-answer"
            >
              {isLastQuestion ? "Submit Quiz" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
