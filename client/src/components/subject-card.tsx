import { useLocation } from "wouter";
import { ProgressRing } from "./progress-ring";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SubjectCardProps {
  subject: {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
    progressPercentage: number;
    completedLessons: number;
    totalLessons: number;
  };
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const [, setLocation] = useLocation();

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue-600":
        return "bg-blue-100 text-blue-600";
      case "green-600":
        return "bg-green-100 text-green-600";
      case "purple-600":
        return "bg-purple-100 text-purple-600";
      case "orange-600":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  const getButtonVariant = () => {
    if (subject.progressPercentage === 0) {
      return "outline";
    }
    return "default";
  };

  const getButtonText = () => {
    if (subject.progressPercentage === 0) {
      return "Start";
    }
    return "Continue";
  };

  const handleClick = () => {
    // In a real app, this would navigate to the subject's lesson list
    // For now, we'll navigate to the first lesson
    setLocation(`/lesson/lesson-${subject.id.split('-')[0]}-1`);
  };

  return (
    <Card className="bg-card rounded-2xl shadow-lg border border-border card-hover">
      <CardContent className="p-4">
        <div className={`subject-icon ${getColorClasses(subject.color)} mx-auto mb-3`}>
          <i className={`${subject.icon} text-2xl`}></i>
        </div>
        
        <h3 className="font-semibold text-center mb-1">{subject.name}</h3>
        <p className="text-xs text-muted-foreground text-center mb-3">
          {subject.totalLessons} lessons available
        </p>

        <div className="mb-3 flex justify-center">
          <ProgressRing progress={subject.progressPercentage} />
        </div>

        <Button
          variant={getButtonVariant()}
          className="w-full"
          onClick={handleClick}
          data-testid={`button-subject-${subject.id}`}
        >
          {getButtonText()}
        </Button>
      </CardContent>
    </Card>
  );
}
