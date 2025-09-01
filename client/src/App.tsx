import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthPage from "@/pages/auth";
import ProfileSetupPage from "@/pages/profile-setup";
import DashboardPage from "@/pages/dashboard";
import LessonDetailPage from "@/pages/lesson-detail";
import QuizPage from "@/pages/quiz";
import QuizSelectionPage from "@/pages/quiz-selection";
import ProfilePage from "@/pages/profile";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth.tsx";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AuthPage} />
      <Route path="/profile-setup" component={ProfileSetupPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/subject/:subjectId/quizzes" component={QuizSelectionPage} />
      <Route path="/lesson/:lessonId" component={LessonDetailPage} />
      <Route path="/quiz/:quizId" component={QuizPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
