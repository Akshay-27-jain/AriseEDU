import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth.tsx";
import { AchievementBadge } from "@/components/achievement-badge";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, UserPen, Download, Languages, Shield, HelpCircle } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  const { data: dashboardData } = useQuery({
    queryKey: ["/api/user", user?.id, "dashboard"],
    enabled: !!user?.id,
  });

  const { data: quizAttempts } = useQuery({
    queryKey: ["/api/user", user?.id, "quiz-attempts"],
    enabled: !!user?.id,
  });

  const achievements = dashboardData?.achievements || [];
  const totalLessonsCompleted = dashboardData?.totalLessonsCompleted || 0;
  const totalQuizzesTaken = (quizAttempts as any[])?.length || 0;

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="gradient-bg text-white py-8 px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold" data-testid="text-profile-initials">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-1" data-testid="text-profile-name">{user?.name}</h1>
          <p className="opacity-80">{user?.class} Student</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold" data-testid="text-lessons-completed">{totalLessonsCompleted}</div>
              <div className="text-sm opacity-80">Lessons Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" data-testid="text-quizzes-taken">{totalQuizzesTaken}</div>
              <div className="text-sm opacity-80">Quizzes Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" data-testid="text-points-earned">{user?.points || 0}</div>
              <div className="text-sm opacity-80">Points Earned</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Achievement Badges */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Achievement Badges</h2>

          {/* Achievement showcase image */}
          <img 
            src="https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=200" 
            alt="Collection of colorful learning achievement badges and medals" 
            className="w-full h-32 object-cover rounded-xl mb-4"
          />

          <div className="grid grid-cols-4 gap-4">
            {achievements.slice(0, 3).map((achievement: any, index: number) => (
              <div key={achievement.id} className="text-center">
                <AchievementBadge
                  icon={achievement.icon}
                  color={achievement.color}
                  name=""
                  size="small"
                  data-testid={`profile-achievement-${index}`}
                />
                <p className="text-xs font-medium mt-2">{achievement.name}</p>
              </div>
            ))}
            
            {achievements.length < 4 && (
              <div className="text-center">
                <div className="achievement-badge bg-muted mx-auto mb-2" style={{width: '60px', height: '60px'}}>
                  <i className="fas fa-lock text-xl text-muted-foreground"></i>
                </div>
                <p className="text-xs text-muted-foreground">Locked</p>
              </div>
            )}
          </div>
        </div>

        {/* Settings Options */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold mb-4">Settings</h2>

          <Button
            variant="outline"
            className="w-full bg-card rounded-xl p-4 shadow-lg border border-border h-auto justify-between"
            data-testid="button-edit-profile"
          >
            <div className="flex items-center space-x-3">
              <UserPen className="text-primary w-5 h-5" />
              <span>Edit Profile</span>
            </div>
            <ChevronRight className="text-muted-foreground w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            className="w-full bg-card rounded-xl p-4 shadow-lg border border-border h-auto justify-between"
            data-testid="button-manage-downloads"
          >
            <div className="flex items-center space-x-3">
              <Download className="text-accent w-5 h-5" />
              <span>Manage Downloads</span>
            </div>
            <ChevronRight className="text-muted-foreground w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            className="w-full bg-card rounded-xl p-4 shadow-lg border border-border h-auto justify-between"
            data-testid="button-language-settings"
          >
            <div className="flex items-center space-x-3">
              <Languages className="text-secondary w-5 h-5" />
              <span>Language Settings</span>
            </div>
            <ChevronRight className="text-muted-foreground w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            className="w-full bg-card rounded-xl p-4 shadow-lg border border-border h-auto justify-between"
            data-testid="button-parental-controls"
          >
            <div className="flex items-center space-x-3">
              <Shield className="text-primary w-5 h-5" />
              <span>Parental Controls</span>
            </div>
            <ChevronRight className="text-muted-foreground w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            className="w-full bg-card rounded-xl p-4 shadow-lg border border-border h-auto justify-between"
            data-testid="button-help-support"
          >
            <div className="flex items-center space-x-3">
              <HelpCircle className="text-accent w-5 h-5" />
              <span>Help & Support</span>
            </div>
            <ChevronRight className="text-muted-foreground w-5 h-5" />
          </Button>
        </div>
      </div>

      <BottomNavigation currentPage="profile" />
    </div>
  );
}
