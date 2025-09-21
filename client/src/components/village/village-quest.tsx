import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  ClipboardPenIcon, 
  Gamepad2, 
  Star, 
  Clock, 
  Trophy,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VillageQuest {
  id: string;
  buildingId: string;
  title: string;
  description: string;
  type: 'lesson' | 'quiz' | 'mini_game';
  requirements: Record<string, any>;
  rewards: {
    points?: number;
    skillPoints?: number;
    unlockBuilding?: string;
    experience?: number;
  };
  order: number;
  isCompleted: boolean;
  progress?: number;
  timeEstimate?: number; // in minutes
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface VillageQuestProps {
  quest: VillageQuest;
  onStartQuest: (questId: string) => void;
  onViewDetails: (questId: string) => void;
  className?: string;
}

export function VillageQuestCard({ 
  quest, 
  onStartQuest, 
  onViewDetails, 
  className 
}: VillageQuestProps) {
  const getQuestIcon = (type: string) => {
    const iconMap = {
      lesson: BookOpen,
      quiz: ClipboardPenIcon,
      mini_game: Gamepad2
    };
    return iconMap[type as keyof typeof iconMap] || BookOpen;
  };

  const getQuestTypeColor = (type: string) => {
    const colorMap = {
      lesson: 'bg-blue-500',
      quiz: 'bg-green-500',
      mini_game: 'bg-purple-500'
    };
    return colorMap[type as keyof typeof colorMap] || 'bg-gray-500';
  };

  const getDifficultyColor = (difficulty?: string) => {
    const colorMap = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colorMap[difficulty as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  const QuestIcon = getQuestIcon(quest.type);

  return (
    <Card className={cn(
      "w-full transition-all duration-200 hover:shadow-lg",
      quest.isCompleted && "ring-2 ring-green-400 bg-green-50",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center text-white",
              getQuestTypeColor(quest.type)
            )}>
              <QuestIcon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{quest.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{quest.description}</p>
            </div>
          </div>
          
          {quest.isCompleted && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Trophy className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Quest Progress */}
        {quest.progress !== undefined && quest.progress > 0 && !quest.isCompleted && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{quest.progress}%</span>
            </div>
            <Progress value={quest.progress} className="h-2" />
          </div>
        )}

        {/* Quest Details */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quest.difficulty && (
            <Badge variant="outline" className={getDifficultyColor(quest.difficulty)}>
              {quest.difficulty.charAt(0).toUpperCase() + quest.difficulty.slice(1)}
            </Badge>
          )}
          
          {quest.timeEstimate && (
            <Badge variant="outline" className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{quest.timeEstimate} min</span>
            </Badge>
          )}
          
          <Badge variant="outline" className="flex items-center space-x-1">
            <Star className="w-3 h-3" />
            <span>Order {quest.order}</span>
          </Badge>
        </div>

        {/* Rewards Preview */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Rewards</h4>
          <div className="flex flex-wrap gap-2">
            {quest.rewards.points && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {quest.rewards.points} Points
              </Badge>
            )}
            {quest.rewards.skillPoints && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {quest.rewards.skillPoints} Skill Points
              </Badge>
            )}
            {quest.rewards.experience && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {quest.rewards.experience} XP
              </Badge>
            )}
            {quest.rewards.unlockBuilding && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Unlock Building
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {!quest.isCompleted ? (
            <>
              <Button 
                onClick={() => onStartQuest(quest.id)}
                className="flex-1"
                size="sm"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Start Quest
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onViewDetails(quest.id)}
                size="sm"
              >
                Details
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              className="flex-1"
              disabled
            >
              <Trophy className="w-4 h-4 mr-2" />
              Quest Completed
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface VillageQuestListProps {
  quests: VillageQuest[];
  onStartQuest: (questId: string) => void;
  onViewDetails: (questId: string) => void;
  className?: string;
}

export function VillageQuestList({ 
  quests, 
  onStartQuest, 
  onViewDetails, 
  className 
}: VillageQuestListProps) {
  const completedQuests = quests.filter(q => q.isCompleted);
  const availableQuests = quests.filter(q => !q.isCompleted);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Available Quests */}
      {availableQuests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Available Quests</h3>
          <div className="space-y-3">
            {availableQuests.map(quest => (
              <VillageQuestCard
                key={quest.id}
                quest={quest}
                onStartQuest={onStartQuest}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Quests */}
      {completedQuests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Completed Quests</h3>
          <div className="space-y-3">
            {completedQuests.map(quest => (
              <VillageQuestCard
                key={quest.id}
                quest={quest}
                onStartQuest={onStartQuest}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      )}

      {quests.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No quests available yet.</p>
          <p className="text-sm">Complete more lessons to unlock new quests!</p>
        </div>
      )}
    </div>
  );
}
