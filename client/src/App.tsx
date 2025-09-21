import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthPage from "@/pages/auth";
import ProfileSetupPage from "@/pages/profile-setup";
import DashboardPage from "@/pages/dashboard";
import SimpleGameDashboard from "@/pages/simple-game-dashboard";
import ProgressPage from "@/pages/progress";
import QuizHub from "@/pages/quiz-hub";
import SyllabusPage from "@/pages/syllabus";
import EnhancedProfile from "@/pages/enhanced-profile";
import LessonDetailPage from "@/pages/lesson-detail";
import QuizPage from "@/pages/quiz";
import QuizSelectionPage from "@/pages/quiz-selection";
import ProfilePage from "@/pages/profile";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth.tsx";
import { OfflineIndicator } from "@/components/offline-manager";
import { initializeLanguage } from "@/lib/i18n";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AuthPage} />
      <Route path="/profile-setup" component={ProfileSetupPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/progress" component={ProgressPage} />
      <Route path="/quiz-hub" component={QuizHub} />
      <Route path="/syllabus" component={SyllabusPage} />
      <Route path="/game" component={SimpleGameDashboard} />
      <Route path="/enhanced-profile" component={EnhancedProfile} />
      <Route path="/subject/:subjectId/quizzes" component={QuizSelectionPage} />
      <Route path="/lesson/:lessonId" component={LessonDetailPage} />
      <Route path="/quiz/:quizId" component={QuizPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize language on app start
  React.useEffect(() => {
    initializeLanguage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <OfflineIndicator />
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
