import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Settings, 
  Award, 
  Star, 
  Zap, 
  Leaf, 
  MapPin, 
  Camera, 
  Gift,
  Trophy,
  Target,
  Calendar,
  Clock,
  Download,
  Wifi,
  WifiOff,
  Edit,
  Save,
  X,
  Plus,
  Minus
} from 'lucide-react';
import { BottomNavigation } from '@/components/bottom-navigation';
import { cn } from '@/lib/utils';

export default function EnhancedProfile() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [avatar, setAvatar] = useState('👨‍🎓');
  const [name, setName] = useState('Alex Kumar');
  const [classLevel, setClassLevel] = useState('Class 10');
  const [language, setLanguage] = useState('English');

  // Profile data
  const profileData = {
    totalPoints: 1250,
    level: 5,
    experience: 750,
    nextLevelExp: 1000,
    streak: 12,
    joinDate: '2024-01-01',
    totalStudyTime: 45, // hours
    achievements: 8,
    skillsUnlocked: 12,
    villageLevel: 3,
    cropsHarvested: 25,
    quizzesCompleted: 18,
    lessonsCompleted: 38
  };

  const achievements = [
    { id: 1, name: 'Math Wizard', description: 'Mastered 20 math lessons', icon: '🧮', date: '2024-01-15', rarity: 'epic' },
    { id: 2, name: 'Word Master', description: 'Scored 90% in language quiz', icon: '📚', date: '2024-01-14', rarity: 'rare' },
    { id: 3, name: 'Science Explorer', description: 'Unlocked 5 science skills', icon: '🔬', date: '2024-01-13', rarity: 'legendary' },
    { id: 4, name: 'Streak Master', description: '7-day learning streak', icon: '🔥', date: '2024-01-12', rarity: 'common' },
    { id: 5, name: 'Village Builder', description: 'Reached village level 3', icon: '🏘️', date: '2024-01-11', rarity: 'rare' },
    { id: 6, name: 'Crop Master', description: 'Harvested 20 crops', icon: '🌾', date: '2024-01-10', rarity: 'common' }
  ];

  const unlockedSkills = [
    { name: 'Math Wizard', level: 3, maxLevel: 5, progress: 60, color: 'bg-blue-500' },
    { name: 'Word Master', level: 2, maxLevel: 5, progress: 40, color: 'bg-purple-500' },
    { name: 'Science Explorer', level: 1, maxLevel: 5, progress: 20, color: 'bg-green-500' },
    { name: 'History Scholar', level: 4, maxLevel: 5, progress: 80, color: 'bg-orange-500' }
  ];

  const unlockedAvatars = [
    { id: 1, emoji: '👨‍🎓', name: 'Student', unlocked: true, selected: true },
    { id: 2, emoji: '🧑‍🔬', name: 'Scientist', unlocked: true, selected: false },
    { id: 3, emoji: '👩‍🏫', name: 'Teacher', unlocked: true, selected: false },
    { id: 4, emoji: '🧑‍💻', name: 'Programmer', unlocked: false, selected: false },
    { id: 5, emoji: '🧑‍🎨', name: 'Artist', unlocked: false, selected: false }
  ];

  const backgrounds = [
    { id: 1, name: 'Default', color: 'bg-blue-500', unlocked: true, selected: true },
    { id: 2, name: 'Forest', color: 'bg-green-500', unlocked: true, selected: false },
    { id: 3, name: 'Space', color: 'bg-purple-500', unlocked: true, selected: false },
    { id: 4, name: 'Ocean', color: 'bg-cyan-500', unlocked: false, selected: false }
  ];

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'bg-gray-100 text-gray-800',
      rare: 'bg-blue-100 text-blue-800',
      epic: 'bg-purple-100 text-purple-800',
      legendary: 'bg-orange-100 text-orange-800'
    };
    return colors[rarity] || 'bg-gray-100 text-gray-800';
  };

  const getLevelProgress = () => {
    return (profileData.experience / profileData.nextLevelExp) * 100;
  };

  const handleDownloadData = () => {
    // Simulate data download
    console.log('Downloading user data...');
  };

  const handleSyncData = () => {
    // Simulate data sync
    console.log('Syncing data...');
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="gradient-bg text-white py-6 px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl">
                {avatar}
              </div>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full p-0"
                  onClick={() => setIsEditing(false)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{name}</h1>
              <p className="text-white/80">{classLevel} • {language}</p>
              <div className="flex items-center space-x-2 mt-1">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-green-300" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-300" />
                )}
                <span className="text-sm text-white/80">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{profileData.level}</div>
            <div className="text-sm text-white/80">Level</div>
            <div className="text-sm text-white/80">{profileData.totalPoints} points</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Level Progress</span>
            <span>{profileData.experience}/{profileData.nextLevelExp} XP</span>
          </div>
          <Progress value={getLevelProgress()} className="h-3" />
        </div>
      </div>

      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
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
                  <div className="text-2xl font-bold">{profileData.totalPoints}</div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold">{profileData.streak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold">{profileData.achievements}</div>
                  <div className="text-sm text-muted-foreground">Achievements</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold">{profileData.totalStudyTime}h</div>
                  <div className="text-sm text-muted-foreground">Study Time</div>
                </CardContent>
              </Card>
            </div>

            {/* Game Features Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Game Features Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span>Village Level</span>
                  </div>
                  <Badge variant="secondary">{profileData.villageLevel}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span>Skills Unlocked</span>
                  </div>
                  <Badge variant="secondary">{profileData.skillsUnlocked}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-white" />
                    </div>
                    <span>Crops Harvested</span>
                  </div>
                  <Badge variant="secondary">{profileData.cropsHarvested}</Badge>
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
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Completed Math Quiz</h4>
                      <p className="text-sm text-muted-foreground">Scored 85% • 2 hours ago</p>
                    </div>
                    <div className="text-sm font-semibold text-green-600">+50 points</div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Unlocked New Skill</h4>
                      <p className="text-sm text-muted-foreground">Word Master Level 2 • 1 day ago</p>
                    </div>
                    <div className="text-sm font-semibold text-blue-600">+25 points</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{achievement.name}</h3>
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground">{achievement.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div className="space-y-4">
              {unlockedSkills.map((skill, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${skill.color} rounded-lg flex items-center justify-center`}>
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{skill.name}</h3>
                          <p className="text-sm text-muted-foreground">Level {skill.level} / {skill.maxLevel}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{skill.progress}%</div>
                        <div className="text-sm text-muted-foreground">Progress</div>
                      </div>
                    </div>
                    <Progress value={skill.progress} className="h-3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Customize Tab */}
          <TabsContent value="customize" className="space-y-6">
            {/* Avatar Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Avatar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  {unlockedAvatars.map((avatarOption) => (
                    <div
                      key={avatarOption.id}
                      className={cn(
                        "w-16 h-16 rounded-lg flex items-center justify-center text-2xl cursor-pointer transition-all duration-200",
                        avatarOption.selected ? "ring-2 ring-blue-500 bg-blue-50" : "bg-gray-100 hover:bg-gray-200",
                        !avatarOption.unlocked && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => {
                        if (avatarOption.unlocked) {
                          setAvatar(avatarOption.emoji);
                        }
                      }}
                    >
                      {avatarOption.unlocked ? avatarOption.emoji : '🔒'}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Background Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Background</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {backgrounds.map((bg) => (
                    <div
                      key={bg.id}
                      className={cn(
                        "w-20 h-12 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200",
                        bg.color,
                        bg.selected ? "ring-2 ring-white" : "hover:scale-105",
                        !bg.unlocked && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => {
                        if (bg.unlocked) {
                          // Handle background selection
                        }
                      }}
                    >
                      {!bg.unlocked && <div className="text-white text-lg">🔒</div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Name</h3>
                    <p className="text-sm text-muted-foreground">Your display name</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Class Level</h3>
                    <p className="text-sm text-muted-foreground">Your current class</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Language</h3>
                    <p className="text-sm text-muted-foreground">App language preference</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Download Data</h3>
                    <p className="text-sm text-muted-foreground">Export your learning progress</p>
                  </div>
                  <Button onClick={handleDownloadData} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Sync Data</h3>
                    <p className="text-sm text-muted-foreground">Sync with cloud storage</p>
                  </div>
                  <Button onClick={handleSyncData} variant="outline" size="sm">
                    <Wifi className="w-4 h-4 mr-2" />
                    Sync Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation currentPage="profile" />
    </div>
  );
}

