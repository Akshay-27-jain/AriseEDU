import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Trophy, 
  Clock, 
  Target,
  Star,
  TrendingUp,
  Award,
  Calendar,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'monthly' | 'special';
  startDate: Date;
  endDate: Date;
  target: number;
  currentProgress: number;
  rewards: {
    points?: number;
    badges?: string[];
    unlockables?: string[];
  };
  isActive: boolean;
  participants: number;
  userProgress: number;
}

interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
  rank: number;
  avatar?: string;
}

interface CommunityChallengesProps {
  challenges: CommunityChallenge[];
  leaderboard: LeaderboardEntry[];
  onJoinChallenge: (challengeId: string) => void;
  onViewLeaderboard: () => void;
  className?: string;
}

export function CommunityChallenges({ 
  challenges, 
  leaderboard, 
  onJoinChallenge, 
  onViewLeaderboard,
  className 
}: CommunityChallengesProps) {
  const getChallengeTypeColor = (type: string) => {
    const colors = {
      weekly: 'bg-blue-100 text-blue-800',
      monthly: 'bg-purple-100 text-purple-800',
      special: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getChallengeTypeIcon = (type: string) => {
    const icons = {
      weekly: Calendar,
      monthly: Award,
      special: Star
    };
    return icons[type as keyof typeof icons] || Calendar;
  };

  const formatTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Community Challenges</CardTitle>
                <p className="text-sm text-muted-foreground">Join forces with other students to achieve great things!</p>
              </div>
            </div>
            <Button onClick={onViewLeaderboard} variant="outline">
              <Trophy className="w-4 h-4 mr-2" />
              View Leaderboard
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Active Challenges */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Challenges</h2>
        {challenges.filter(c => c.isActive).map(challenge => {
          const TypeIcon = getChallengeTypeIcon(challenge.type);
          const progressPercentage = (challenge.currentProgress / challenge.target) * 100;
          const userProgressPercentage = (challenge.userProgress / challenge.target) * 100;
          
          return (
            <Card key={challenge.id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <TypeIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getChallengeTypeColor(challenge.type)}>
                      {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {challenge.participants} participants
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Progress Section */}
                <div className="space-y-4">
                  {/* Community Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Community Progress</span>
                      <span>{challenge.currentProgress} / {challenge.target}</span>
                    </div>
                    <Progress 
                      value={progressPercentage} 
                      className="h-3 mb-2"
                    />
                    <div className="text-xs text-muted-foreground">
                      {progressPercentage.toFixed(1)}% complete
                    </div>
                  </div>

                  {/* User Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Your Progress</span>
                      <span>{challenge.userProgress} / {challenge.target}</span>
                    </div>
                    <Progress 
                      value={userProgressPercentage} 
                      className="h-2"
                    />
                  </div>

                  {/* Time Remaining */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeRemaining(challenge.endDate)}</span>
                    </div>
                    
                    <Button 
                      onClick={() => onJoinChallenge(challenge.id)}
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-purple-500"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Join Challenge
                    </Button>
                  </div>

                  {/* Rewards */}
                  <div className="flex flex-wrap gap-2">
                    {challenge.rewards.points && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        {challenge.rewards.points} Points
                      </Badge>
                    )}
                    {challenge.rewards.badges && challenge.rewards.badges.length > 0 && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        <Award className="w-3 h-3 mr-1" />
                        {challenge.rewards.badges.length} Badges
                      </Badge>
                    )}
                    {challenge.rewards.unlockables && challenge.rewards.unlockables.length > 0 && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Target className="w-3 h-3 mr-1" />
                        {challenge.rewards.unlockables.length} Unlockables
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completed Challenges */}
      {challenges.filter(c => !c.isActive).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Completed Challenges</h2>
          {challenges.filter(c => !c.isActive).map(challenge => (
            <Card key={challenge.id} className="opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Trophy className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {challenges.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Challenges Available</h3>
            <p className="text-muted-foreground">
              Check back later for new community challenges!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  className?: string;
}

export function Leaderboard({ entries, currentUserId, className }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600';
    if (rank === 2) return 'text-gray-600';
    if (rank === 3) return 'text-orange-600';
    return 'text-muted-foreground';
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Leaderboard</CardTitle>
              <p className="text-sm text-muted-foreground">Top performers in community challenges</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-2">
        {entries.map((entry, index) => (
          <Card 
            key={entry.userId}
            className={cn(
              "transition-all duration-200",
              entry.userId === currentUserId && "ring-2 ring-blue-400 bg-blue-50"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-center w-8">
                    {getRankIcon(entry.rank)}
                  </div>
                  
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    {entry.avatar ? (
                      <img 
                        src={entry.avatar} 
                        alt={entry.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <span className="text-white font-bold text-sm">
                        {entry.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">{entry.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {entry.userId === currentUserId ? 'You' : `Rank #${entry.rank}`}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={cn("text-2xl font-bold", getRankColor(entry.rank))}>
                    {entry.score}
                  </div>
                  <div className="text-sm text-muted-foreground">points</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {entries.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Rankings Yet</h3>
            <p className="text-muted-foreground">
              Join a challenge to start climbing the leaderboard!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
