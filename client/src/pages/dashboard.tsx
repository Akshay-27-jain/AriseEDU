import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth.tsx";
import { SubjectCard } from "@/components/subject-card";
import { AchievementBadge } from "@/components/achievement-badge";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Bell, Download, Gamepad2, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

export default function DashboardPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/user", user?.id, "dashboard"],
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-destructive">Failed to load dashboard</div>
      </div>
    );
  }

  const dashboardDefaults = { subjects: [], achievements: [], totalLessonsCompleted: 0 };
  const { subjects, achievements, totalLessonsCompleted } = dashboardData || dashboardDefaults;
  const todaysTarget = 5;
  const todaysProgress = Math.min(totalLessonsCompleted, todaysTarget);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="gradient-bg text-white py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold" data-testid="text-user-initials">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm opacity-80">Good morning</p>
              <p className="font-semibold" data-testid="text-user-name">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Offline Indicator */}
            <div className="flex items-center space-x-1 bg-white bg-opacity-20 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-accent rounded-full offline-indicator"></div>
              <span className="text-xs">Offline Ready</span>
            </div>

            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mt-4 bg-white bg-opacity-10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-80">Today's Progress</span>
            <span className="text-sm font-semibold">{todaysProgress}/{todaysTarget} lessons</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className="bg-secondary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(todaysProgress / todaysTarget) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Achievement Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Achievements</h2>
            <Button variant="ghost" size="sm" className="text-primary font-medium">
              View All
            </Button>
          </div>

          <div className="flex space-x-4 overflow-x-auto pb-2">
            {achievements.map((achievement: any, index: number) => (
              <AchievementBadge
                key={achievement.id}
                icon={achievement.icon}
                color={achievement.color}
                name={achievement.name}
                data-testid={`achievement-${index}`}
              />
            ))}
            {achievements.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Complete lessons and quizzes to earn achievements!
              </div>
            )}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Subjects Available</h2>

          <div className="grid grid-cols-2 gap-4">
            {subjects.map((subject: any) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                data-testid={`subject-card-${subject.id}`}
              />
            ))}
          </div>
        </div>

        {/* Game Features */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">🎮 Game Features</h2>

          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={() => setLocation('/game')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-4 shadow-lg h-auto justify-start hover:from-purple-600 hover:to-pink-600"
            >
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                <Gamepad2 className="text-xl" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold">Enter Game Hub</h3>
                <p className="text-sm opacity-90">Village quests, skill trees, farming & more!</p>
              </div>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="bg-card rounded-xl p-4 shadow-lg border border-border card-hover h-auto justify-start"
                data-testid="button-take-quiz"
              >
                <div className="w-12 h-12 bg-secondary text-white rounded-xl flex items-center justify-center mr-4">
                  <i className="fas fa-question-circle text-xl"></i>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">Take Quiz</h3>
                  <p className="text-sm text-muted-foreground">Test your knowledge</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="bg-card rounded-xl p-4 shadow-lg border border-border card-hover h-auto justify-start"
                data-testid="button-download-lessons"
              >
                <div className="w-12 h-12 bg-accent text-white rounded-xl flex items-center justify-center mr-4">
                  <Download className="text-xl" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">Download Lessons</h3>
                  <p className="text-sm text-muted-foreground">For offline learning</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation currentPage="home" />
    </div>
  );
}
