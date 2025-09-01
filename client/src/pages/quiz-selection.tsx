import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth.tsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Trophy, Play } from "lucide-react";
import { useLocation } from "wouter";

export default function QuizSelectionPage() {
  const { subjectId } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const { data: subject, isLoading: subjectLoading } = useQuery({
    queryKey: ["/api/subjects", subjectId],
    enabled: !!subjectId,
  });

  const { data: quizzes, isLoading: quizzesLoading } = useQuery({
    queryKey: ["/api/subjects", subjectId, "quizzes"],
    enabled: !!subjectId,
  });

  const { data: userAttempts } = useQuery({
    queryKey: ["/api/user", user?.id, "quiz-attempts"],
    enabled: !!user?.id,
  });

  if (subjectLoading || quizzesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading quizzes...</p>
        </div>
      </div>
    );
  }

  const getQuizStatus = (quizId: string) => {
    const attempt = userAttempts?.find((a: any) => a.quizId === quizId);
    if (attempt) {
      const percentage = Math.round((attempt.score / attempt.totalPoints) * 100);
      return { attempted: true, score: percentage };
    }
    return { attempted: false, score: 0 };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center space-x-4 text-white mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="text-white hover:bg-white/20"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{subject?.name} Quizzes</h1>
            <p className="text-sm opacity-80">Test your knowledge and earn points!</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        {quizzes && quizzes.length > 0 ? (
          <div className="space-y-4">
            {quizzes.map((quiz: any, index: number) => {
              const status = getQuizStatus(quiz.id);
              return (
                <Card key={quiz.id} className="bg-white dark:bg-gray-800 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      {status.attempted && (
                        <Badge variant={status.score >= 70 ? "default" : "secondary"}>
                          {status.score}%
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{Math.floor(quiz.timeLimit / 60)} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4" />
                          <span>{quiz.points} points</span>
                        </div>
                        <div>
                          {quiz.questions?.length || 0} questions
                        </div>
                      </div>

                      <Button
                        onClick={() => setLocation(`/quiz/${quiz.id}`)}
                        className="w-full"
                        variant={status.attempted ? "outline" : "default"}
                        data-testid={`button-start-quiz-${index}`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {status.attempted ? "Retake Quiz" : "Start Quiz"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-white dark:bg-gray-800 text-center p-8">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Quizzes Available</h3>
            <p className="text-muted-foreground mb-4">
              Complete some lessons first to unlock quizzes for this subject.
            </p>
            <Button onClick={() => setLocation(`/subject/${subjectId}`)}>
              View Lessons
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}