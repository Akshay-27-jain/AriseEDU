import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Calendar,
  BookOpen,
  Zap,
  Leaf,
  Users,
  Trophy,
  Star,
  Clock,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { BottomNavigation } from '@/components/bottom-navigation';
import { cn } from '@/lib/utils';

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');

  // Sample progress data
  const progressData = {
    totalPoints: 1250,
    level: 5,
    experience: 750,
    nextLevelExp: 1000,
    streak: 12,
    totalLessons: 45,
    completedLessons: 38,
    totalQuizzes: 20,
    completedQuizzes: 18,
    averageScore: 85,
    studyTime: 24, // hours
    achievements: 8,
    skillsUnlocked: 12,
    cropsHarvested: 25,
    villageLevel: 3
  };

  const subjectProgress = [
    { name: 'Mathematics', progress: 85, points: 450, lessons: 15, color: 'bg-blue-500' },
    { name: 'Science', progress: 72, points: 380, lessons: 12, color: 'bg-green-500' },
    { name: 'Language', progress: 68, points: 320, lessons: 11, color: 'bg-purple-500' },
    { name: 'History', progress: 45, points: 200, lessons: 8, color: 'bg-orange-500' }
  ];

  const recentAchievements = [
    { id: 1, name: 'Math Wizard', description: 'Completed 10 math lessons', icon: '🧮', date: '2024-01-15', points: 100 },
    { id: 2, name: 'Word Master', description: 'Scored 90% in language quiz', icon: '📚', date: '2024-01-14', points: 75 },
    { id: 3, name: 'Science Explorer', description: 'Unlocked 5 science skills', icon: '🔬', date: '2024-01-13', points: 150 },
    { id: 4, name: 'Streak Master', description: '7-day learning streak', icon: '🔥', date: '2024-01-12', points: 50 }
  ];

  const weeklyData = [
    { day: 'Mon', lessons: 3, points: 120, time: 45 },
    { day: 'Tue', lessons: 2, points: 80, time: 30 },
    { day: 'Wed', lessons: 4, points: 160, time: 60 },
    { day: 'Thu', lessons: 1, points: 40, time: 15 },
    { day: 'Fri', lessons: 3, points: 120, time: 45 },
    { day: 'Sat', lessons: 5, points: 200, time: 75 },
    { day: 'Sun', lessons: 2, points: 80, time: 30 }
  ];

  const getLevelProgress = () => {
    return (progressData.experience / progressData.nextLevelExp) * 100;
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600';
    if (streak >= 14) return 'text-orange-600';
    if (streak >= 7) return 'text-green-600';
    return 'text-blue-600';
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="gradient-bg text-white py-6 px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Your Progress</h1>
            <p className="text-white/80">Track your learning journey</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{progressData.level}</div>
            <div className="text-sm text-white/80">Level</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Level Progress</span>
            <span>{progressData.experience}/{progressData.nextLevelExp} XP</span>
          </div>
          <Progress value={getLevelProgress()} className="h-3" />
        </div>
      </div>

      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold">{progressData.totalPoints}</div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold">{progressData.completedLessons}</div>
                  <div className="text-sm text-muted-foreground">Lessons Done</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className={`w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <Activity className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className={`text-2xl font-bold ${getStreakColor(progressData.streak)}`}>
                    {progressData.streak}
                  </div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold">{progressData.achievements}</div>
                  <div className="text-sm text-muted-foreground">Achievements</div>
                </CardContent>
              </Card>
            </div>

            {/* Game Features Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gamepad2 className="w-5 h-5" />
                  <span>Game Features Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span>Village Level</span>
                  </div>
                  <Badge variant="secondary">{progressData.villageLevel}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span>Skills Unlocked</span>
                  </div>
                  <Badge variant="secondary">{progressData.skillsUnlocked}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-white" />
                    </div>
                    <span>Crops Harvested</span>
                  </div>
                  <Badge variant="secondary">{progressData.cropsHarvested}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAchievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-600">+{achievement.points}</div>
                        <div className="text-xs text-muted-foreground">{achievement.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <div className="space-y-4">
              {subjectProgress.map((subject, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${subject.color} rounded-lg flex items-center justify-center`}>
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{subject.name}</h3>
                          <p className="text-sm text-muted-foreground">{subject.lessons} lessons</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{subject.points}</div>
                        <div className="text-sm text-muted-foreground">points</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{subject.progress}%</span>
                      </div>
                      <Progress value={subject.progress} className="h-3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentAchievements.map((achievement) => (
                <Card key={achievement.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        <div className="flex items-center space-x-4">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            +{achievement.points} points
                          </Badge>
                          <span className="text-xs text-muted-foreground">{achievement.date}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Weekly Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="w-12 text-sm font-medium">{day.day}</div>
                      <div className="flex-1 mx-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${(day.lessons / 5) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground w-8">{day.lessons}</span>
                        </div>
                      </div>
                      <div className="w-16 text-sm text-muted-foreground">{day.time}m</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Study Time Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Study Time Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Mathematics</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      <span className="text-sm">40%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Science</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      <span className="text-sm">30%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Language</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                      <span className="text-sm">20%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>History</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                      <span className="text-sm">10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation currentPage="progress" />
    </div>
  );
}

