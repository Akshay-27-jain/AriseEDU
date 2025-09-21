import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  MapPin, 
  Zap, 
  Leaf, 
  Users, 
  Gamepad2, 
  Sparkles, 
  Camera, 
  Gift,
  Bot,
  Wifi,
  WifiOff,
  Download,
  RefreshCw
} from 'lucide-react';
import { VillageMap } from '@/components/village/village-map';
import { VillageQuestList } from '@/components/village/village-quest';
import { SkillTree } from '@/components/skills/skill-tree';
import { FarmField } from '@/components/farming/farm-field';
import { CommunityChallenges, Leaderboard } from '@/components/community/community-challenges';
import { MathRunner } from '@/components/mini-games/math-runner';
import { WordBuilder } from '@/components/mini-games/word-builder';
import { DiwaliFireworkQuiz } from '@/components/festivals/diwali-firework-quiz';
import { ARModels } from '@/components/ar/ar-models';
import { RewardsStore, MyRewards } from '@/components/rewards/rewards-store';
import { AITutor } from '@/components/ai-tutor/ai-tutor';
import { GameEngine, GAME_CONSTANTS } from '@/lib/game-engine';
import { offlineManager } from '@/lib/offline-manager';
import { cn } from '@/lib/utils';

export default function GameDashboard() {
  const [activeTab, setActiveTab] = useState('village');
  const [gameEngine] = useState(new GameEngine());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineStats, setOfflineStats] = useState(offlineManager.getOfflineStats());
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [userScore, setUserScore] = useState(0);

  // Sample data - in real app, this would come from API
  const villageBuildings = [
    {
      id: 'math-house',
      name: 'Math House',
      type: 'house',
      subjectId: 'math',
      description: 'Learn mathematics through interactive problems',
      icon: '🧮',
      color: 'blue',
      unlockLevel: 1,
      position: { x: 20, y: 30 },
      isUnlocked: true,
      isCompleted: false,
      questCount: 3
    },
    {
      id: 'science-lab',
      name: 'Science Lab',
      type: 'lab',
      subjectId: 'science',
      description: 'Explore the wonders of science',
      icon: '🧪',
      color: 'green',
      unlockLevel: 2,
      position: { x: 50, y: 25 },
      isUnlocked: true,
      isCompleted: false,
      questCount: 2
    },
    {
      id: 'language-library',
      name: 'Language Library',
      type: 'library',
      subjectId: 'language',
      description: 'Master languages and literature',
      icon: '📚',
      color: 'purple',
      unlockLevel: 3,
      position: { x: 80, y: 35 },
      isUnlocked: false,
      isCompleted: false,
      questCount: 0
    }
  ];

  const villageQuests = [
    {
      id: 'math-quest-1',
      buildingId: 'math-house',
      title: 'Basic Addition',
      description: 'Complete 10 addition problems',
      type: 'lesson',
      requirements: {},
      rewards: { points: 50, skillPoints: 2 },
      order: 1,
      isCompleted: false,
      progress: 60,
      timeEstimate: 15,
      difficulty: 'easy'
    },
    {
      id: 'science-quest-1',
      buildingId: 'science-lab',
      title: 'Solar System Explorer',
      description: 'Learn about planets and their properties',
      type: 'mini_game',
      requirements: {},
      rewards: { points: 75, skillPoints: 3 },
      order: 1,
      isCompleted: false,
      progress: 0,
      timeEstimate: 20,
      difficulty: 'medium'
    }
  ];

  const skills = [
    {
      id: 'math-wizard',
      name: 'Math Wizard',
      description: 'Master of numbers and calculations',
      icon: 'zap',
      color: 'blue',
      category: 'math',
      prerequisites: [],
      cost: 1,
      benefits: { 'Problem Solving': '+20%', 'Speed': '+15%' },
      maxLevel: 5,
      currentLevel: 2,
      isUnlocked: true,
      canUnlock: true
    },
    {
      id: 'word-master',
      name: 'Word Master',
      description: 'Expert in language and communication',
      icon: 'book',
      color: 'purple',
      category: 'language',
      prerequisites: [],
      cost: 1,
      benefits: { 'Vocabulary': '+25%', 'Writing': '+20%' },
      maxLevel: 5,
      currentLevel: 1,
      isUnlocked: true,
      canUnlock: true
    }
  ];

  const farmCrops = [
    {
      id: 'crop-1',
      subjectId: 'math',
      cropType: 'Number Seeds',
      plantedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      growthStage: 1,
      health: 80,
      isWithered: false,
      harvestValue: 0
    }
  ];

  const availableSubjects = [
    { id: 'math', name: 'Mathematics', color: 'blue' },
    { id: 'science', name: 'Science', color: 'green' },
    { id: 'language', name: 'Language', color: 'purple' }
  ];

  const communityChallenges = [
    {
      id: 'weekly-math',
      title: 'Weekly Math Marathon',
      description: 'Solve 100 math problems together as a community',
      type: 'weekly',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      target: 100,
      currentProgress: 45,
      rewards: { points: 500, badges: ['Math Champion'], unlockables: ['Special Avatar'] },
      isActive: true,
      participants: 25,
      userProgress: 8
    }
  ];

  const leaderboard = [
    { userId: 'user1', name: 'Alex Kumar', score: 1250, rank: 1 },
    { userId: 'user2', name: 'Priya Sharma', score: 1180, rank: 2 },
    { userId: 'user3', name: 'Rahul Singh', score: 1100, rank: 3 }
  ];

  const arModels = [
    {
      id: 'solar-system',
      name: 'Solar System',
      subjectId: 'science',
      modelUrl: '/models/solar-system.glb',
      thumbnailUrl: '/thumbnails/solar-system.jpg',
      description: 'Interactive 3D model of our solar system',
      unlockRequirements: { level: 2, points: 100 },
      category: 'astronomy',
      isUnlocked: true,
      downloadSize: 15,
      isDownloaded: false,
      viewCount: 45,
      rating: 4.5
    }
  ];

  const rewards = [
    {
      id: 'cert-math-basic',
      name: 'Basic Math Certificate',
      type: 'certificate',
      description: 'Certificate for completing basic math skills',
      pointsCost: 200,
      category: 'academic',
      rarity: 'common',
      isAvailable: true
    }
  ];

  const userRewards = [];

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        offlineManager.forceSync();
      }
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Update offline stats periodically
    const interval = setInterval(() => {
      setOfflineStats(offlineManager.getOfflineStats());
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      clearInterval(interval);
    };
  }, []);

  const handleBuildingClick = (buildingId: string) => {
    console.log('Building clicked:', buildingId);
    // Navigate to building-specific content
  };

  const handleQuestStart = (questId: string) => {
    console.log('Quest started:', questId);
    // Start quest logic
  };

  const handleQuestView = (questId: string) => {
    console.log('Quest details:', questId);
    // Show quest details
  };

  const handleSkillUnlock = (skillId: string) => {
    console.log('Skill unlocked:', skillId);
    // Unlock skill logic
  };

  const handleSkillView = (skillId: string) => {
    console.log('Skill details:', skillId);
    // Show skill details
  };

  const handlePlantCrop = (subjectId: string, cropType: string) => {
    console.log('Planting crop:', subjectId, cropType);
    // Plant crop logic
  };

  const handleWaterCrop = (cropId: string) => {
    console.log('Watering crop:', cropId);
    // Water crop logic
  };

  const handleHarvestCrop = (cropId: string) => {
    console.log('Harvesting crop:', cropId);
    // Harvest crop logic
  };

  const handleJoinChallenge = (challengeId: string) => {
    console.log('Joining challenge:', challengeId);
    // Join challenge logic
  };

  const handleViewLeaderboard = () => {
    console.log('Viewing leaderboard');
    // Show leaderboard
  };

  const handleGameScore = (score: number) => {
    setUserScore(score);
    console.log('Game score updated:', score);
  };

  const handleGameComplete = (finalScore: number, timeSpent: number) => {
    console.log('Game completed:', finalScore, timeSpent);
    setCurrentGame(null);
  };

  const handleDownloadAssets = async () => {
    const success = await offlineManager.downloadGameAssets('all');
    if (success) {
      console.log('Game assets downloaded successfully');
    }
  };

  const handleForceSync = async () => {
    const success = await offlineManager.forceSync();
    if (success) {
      console.log('Data synced successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AriseEDU Game Hub</h1>
                <p className="text-sm text-gray-600">Your learning adventure awaits!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Online Status */}
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm text-gray-600">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              
              {/* Offline Stats */}
              <Badge variant="outline">
                {offlineStats.pendingActions} pending
              </Badge>
              
              {/* Sync Button */}
              <Button
                onClick={handleForceSync}
                variant="outline"
                size="sm"
                disabled={!isOnline}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync
              </Button>
              
              {/* Download Assets */}
              <Button
                onClick={handleDownloadAssets}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="village" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Village</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Skills</span>
            </TabsTrigger>
            <TabsTrigger value="farm" className="flex items-center space-x-2">
              <Leaf className="w-4 h-4" />
              <span className="hidden sm:inline">Farm</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center space-x-2">
              <Gamepad2 className="w-4 h-4" />
              <span className="hidden sm:inline">Games</span>
            </TabsTrigger>
            <TabsTrigger value="festivals" className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Festivals</span>
            </TabsTrigger>
            <TabsTrigger value="ar" className="flex items-center space-x-2">
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">AR</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center space-x-2">
              <Gift className="w-4 h-4" />
              <span className="hidden sm:inline">Rewards</span>
            </TabsTrigger>
          </TabsList>

          {/* Village Tab */}
          <TabsContent value="village" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VillageMap
                buildings={villageBuildings}
                userLevel={3}
                onBuildingClick={handleBuildingClick}
              />
              <VillageQuestList
                quests={villageQuests}
                onStartQuest={handleQuestStart}
                onViewDetails={handleQuestView}
              />
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <SkillTree
              skills={skills}
              skillPoints={15}
              onUnlockSkill={handleSkillUnlock}
              onViewSkill={handleSkillView}
            />
          </TabsContent>

          {/* Farm Tab */}
          <TabsContent value="farm">
            <FarmField
              crops={farmCrops}
              onWaterCrop={handleWaterCrop}
              onHarvestCrop={handleHarvestCrop}
              onPlantCrop={handlePlantCrop}
              availableSubjects={availableSubjects}
            />
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <CommunityChallenges
              challenges={communityChallenges}
              leaderboard={leaderboard}
              onJoinChallenge={handleJoinChallenge}
              onViewLeaderboard={handleViewLeaderboard}
            />
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Math Runner</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setCurrentGame('math-runner')}
                    className="w-full"
                  >
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    Play Math Runner
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Word Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setCurrentGame('word-builder')}
                    className="w-full"
                  >
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    Play Word Builder
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Festivals Tab */}
          <TabsContent value="festivals">
            <DiwaliFireworkQuiz
              onScoreUpdate={handleGameScore}
              onGameComplete={handleGameComplete}
              difficulty="medium"
              timeLimit={300}
            />
          </TabsContent>

          {/* AR Tab */}
          <TabsContent value="ar">
            <ARModels
              models={arModels}
              userLevel={3}
              userPoints={500}
              userAchievements={['math-basics', 'science-explorer']}
              onUnlockModel={(id) => console.log('Unlock model:', id)}
              onDownloadModel={(id) => console.log('Download model:', id)}
              onViewModel={(id) => console.log('View model:', id)}
            />
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <Tabs defaultValue="store" className="space-y-4">
              <TabsList>
                <TabsTrigger value="store">Rewards Store</TabsTrigger>
                <TabsTrigger value="my-rewards">My Rewards</TabsTrigger>
              </TabsList>
              <TabsContent value="store">
                <RewardsStore
                  rewards={rewards}
                  userRewards={userRewards}
                  userPoints={500}
                  onRedeemReward={(id) => console.log('Redeem reward:', id)}
                  onViewReward={(id) => console.log('View reward:', id)}
                />
              </TabsContent>
              <TabsContent value="my-rewards">
                <MyRewards
                  userRewards={userRewards}
                  rewards={rewards}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      {/* Game Overlay */}
      {currentGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {currentGame === 'math-runner' ? 'Math Runner' : 'Word Builder'}
              </h2>
              <Button
                onClick={() => setCurrentGame(null)}
                variant="outline"
                size="sm"
              >
                Close
              </Button>
            </div>
            
            {currentGame === 'math-runner' && (
              <MathRunner
                onScoreUpdate={handleGameScore}
                onGameComplete={handleGameComplete}
                difficulty="medium"
                timeLimit={120}
              />
            )}
            
            {currentGame === 'word-builder' && (
              <WordBuilder
                onScoreUpdate={handleGameScore}
                onGameComplete={handleGameComplete}
                difficulty="medium"
                timeLimit={180}
              />
            )}
          </div>
        </div>
      )}

      {/* AI Tutor */}
      <div className="fixed bottom-4 right-4 z-40">
        <AITutor
          currentSubject="math"
          currentQuestion="What is 2 + 2?"
          userAttempts={1}
          onHintUsed={(hintId) => console.log('Hint used:', hintId)}
          onRequestHelp={(question) => console.log('Help requested:', question)}
        />
      </div>
    </div>
  );
}
