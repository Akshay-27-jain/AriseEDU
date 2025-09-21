import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Lock, 
  CheckCircle, 
  Star, 
  ArrowRight,
  BookOpen,
  Calculator,
  Microscope,
  Globe,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'math' | 'science' | 'language' | 'general';
  prerequisites: string[];
  cost: number;
  benefits: Record<string, any>;
  maxLevel: number;
  currentLevel: number;
  isUnlocked: boolean;
  canUnlock: boolean;
}

interface SkillTreeProps {
  skills: Skill[];
  skillPoints: number;
  onUnlockSkill: (skillId: string) => void;
  onViewSkill: (skillId: string) => void;
  className?: string;
}

export function SkillTree({ 
  skills, 
  skillPoints, 
  onUnlockSkill, 
  onViewSkill, 
  className 
}: SkillTreeProps) {
  const getCategoryIcon = (category: string) => {
    const iconMap = {
      math: Calculator,
      science: Microscope,
      language: BookOpen,
      general: Globe
    };
    return iconMap[category as keyof typeof iconMap] || Star;
  };

  const getCategoryColor = (category: string) => {
    const colorMap = {
      math: 'bg-blue-500',
      science: 'bg-green-500',
      language: 'bg-purple-500',
      general: 'bg-orange-500'
    };
    return colorMap[category as keyof typeof colorMap] || 'bg-gray-500';
  };

  const getSkillIcon = (icon: string) => {
    const iconMap = {
      'zap': Zap,
      'star': Star,
      'award': Award,
      'book': BookOpen,
      'calculator': Calculator,
      'microscope': Microscope,
      'globe': Globe
    };
    return iconMap[icon as keyof typeof iconMap] || Star;
  };

  const getSkillColor = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500';
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Skill Points Display */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Skill Points</h3>
                <p className="text-sm text-muted-foreground">Available for unlocking skills</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{skillPoints}</div>
              <div className="text-sm text-muted-foreground">points available</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skill Categories */}
      {Object.entries(groupedSkills).map(([category, categorySkills]) => {
        const CategoryIcon = getCategoryIcon(category);
        
        return (
          <div key={category} className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-white",
                getCategoryColor(category)
              )}>
                <CategoryIcon className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-semibold capitalize">{category} Skills</h2>
              <Badge variant="outline">
                {categorySkills.filter(s => s.isUnlocked).length} / {categorySkills.length}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorySkills.map(skill => {
                const SkillIcon = getSkillIcon(skill.icon);
                const isMaxLevel = skill.currentLevel >= skill.maxLevel;
                const canUpgrade = skill.isUnlocked && !isMaxLevel && skillPoints >= skill.cost;
                
                return (
                  <Card 
                    key={skill.id}
                    className={cn(
                      "transition-all duration-200 hover:shadow-lg",
                      skill.isUnlocked && "ring-2 ring-green-400",
                      !skill.isUnlocked && "opacity-60"
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center text-white",
                            getSkillColor(skill.color)
                          )}>
                            <SkillIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{skill.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{skill.description}</p>
                          </div>
                        </div>
                        
                        {skill.isUnlocked && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Level {skill.currentLevel}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Skill Level Progress */}
                      {skill.isUnlocked && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Level {skill.currentLevel} / {skill.maxLevel}</span>
                            <span>{Math.round((skill.currentLevel / skill.maxLevel) * 100)}%</span>
                          </div>
                          <Progress 
                            value={(skill.currentLevel / skill.maxLevel) * 100} 
                            className="h-2" 
                          />
                        </div>
                      )}

                      {/* Skill Benefits */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Benefits</h4>
                        <div className="space-y-1">
                          {Object.entries(skill.benefits).map(([key, value]) => (
                            <div key={key} className="text-xs text-muted-foreground">
                              <span className="font-medium">{key}:</span> {String(value)}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Prerequisites */}
                      {skill.prerequisites.length > 0 && !skill.isUnlocked && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Prerequisites</h4>
                          <div className="flex flex-wrap gap-1">
                            {skill.prerequisites.map(prereqId => {
                              const prereq = skills.find(s => s.id === prereqId);
                              return (
                                <Badge 
                                  key={prereqId}
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    prereq?.isUnlocked ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                                  )}
                                >
                                  {prereq?.name || prereqId}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        {!skill.isUnlocked ? (
                          <Button 
                            onClick={() => onUnlockSkill(skill.id)}
                            disabled={!skill.canUnlock || skillPoints < skill.cost}
                            className="flex-1"
                            size="sm"
                          >
                            {skillPoints < skill.cost ? (
                              <>
                                <Lock className="w-4 h-4 mr-2" />
                                Need {skill.cost} points
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4 mr-2" />
                                Unlock ({skill.cost} pts)
                              </>
                            )}
                          </Button>
                        ) : canUpgrade ? (
                          <Button 
                            onClick={() => onUnlockSkill(skill.id)}
                            className="flex-1"
                            size="sm"
                          >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Upgrade ({skill.cost} pts)
                          </Button>
                        ) : isMaxLevel ? (
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            disabled
                            size="sm"
                          >
                            <Award className="w-4 h-4 mr-2" />
                            Max Level
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            disabled
                            size="sm"
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            Need {skill.cost} points
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          onClick={() => onViewSkill(skill.id)}
                          size="sm"
                        >
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
