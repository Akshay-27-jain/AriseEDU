import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth.tsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function LessonDetailPage() {
  const { lessonId } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [userAnswer, setUserAnswer] = useState("");

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["/api/lessons", lessonId],
    enabled: !!lessonId,
  });

  const { data: progress } = useQuery({
    queryKey: ["/api/user", user?.id, "progress"],
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading lesson...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-destructive">Lesson not found</div>
      </div>
    );
  }

  const lessonProgress = progress?.filter((p: any) => 
    p.subjectId === lesson?.subjectId && p.completed
  ).length || 0;

  const totalLessons = 5; // This should come from the subject data
  const progressPercentage = Math.round((lessonProgress / totalLessons) * 100);

  const handleAnswer = () => {
    // Check answer logic here
    if (userAnswer === "5") {
      alert("Correct! Well done!");
    } else {
      alert("Try again!");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-4 px-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20"
            onClick={() => setLocation("/dashboard")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold" data-testid="text-lesson-title">{lesson?.title}</h1>
            <p className="text-sm opacity-80">Chapter 1 - Numbers</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20"
            data-testid="button-download-lesson"
          >
            <Download className="w-5 h-5" />
          </Button>
        </div>

        {/* Lesson Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-80">Lesson Progress</span>
            <span className="text-sm font-semibold">{lessonProgress}/{totalLessons} completed</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className="bg-secondary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="px-6 py-6 pb-20">
        <Card className="bg-card rounded-2xl shadow-lg border border-border mb-6">
          <CardContent className="p-6">
            {/* Content Image */}
            <img 
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400" 
              alt="Rural students learning mathematics with tablets" 
              className="w-full h-48 object-cover rounded-xl mb-4"
            />

            <h2 className="text-xl font-semibold mb-4">{lesson?.title}</h2>
            <p className="text-muted-foreground mb-4" data-testid="text-lesson-description">
              {lesson?.description}
            </p>

            {/* Interactive Element */}
            {lesson?.content?.sections?.find((section: any) => section.type === "interactive") && (
              <div className="bg-muted rounded-xl p-4 mb-4">
                <h3 className="font-semibold mb-2">Try it yourself:</h3>
                <div className="flex items-center space-x-4 text-lg mb-4">
                  <span>2</span>
                  <span className="text-primary">+</span>
                  <span>3</span>
                  <span>=</span>
                  <Input
                    type="text"
                    className="w-16 text-center"
                    placeholder="?"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    data-testid="input-answer"
                  />
                </div>
                <Button onClick={handleAnswer} size="sm" data-testid="button-check-answer">
                  Check Answer
                </Button>
              </div>
            )}

            <Button 
              className="w-full"
              data-testid="button-continue-lesson"
            >
              Continue Lesson
            </Button>
          </CardContent>
        </Card>

        {/* Lesson Navigation */}
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            className="flex-1" 
            disabled
            data-testid="button-previous-lesson"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button 
            className="flex-1"
            data-testid="button-next-lesson"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
