import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Droplets, 
  Crop, 
  Leaf, 
  Flame, 
  Clock, 
  Star,
  Zap,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FarmCrop {
  id: string;
  subjectId: string;
  cropType: string;
  plantedAt: Date;
  growthStage: number;
  health: number;
  isWithered: boolean;
  harvestValue: number;
}

interface FarmFieldProps {
  crops: FarmCrop[];
  onWaterCrop: (cropId: string) => void;
  onHarvestCrop: (cropId: string) => void;
  onPlantCrop: (subjectId: string, cropType: string) => void;
  availableSubjects: Array<{ id: string; name: string; color: string }>;
  className?: string;
}

export function FarmField({ 
  crops, 
  onWaterCrop, 
  onHarvestCrop, 
  onPlantCrop, 
  availableSubjects,
  className 
}: FarmFieldProps) {
  const getCropIcon = (cropType: string, growthStage: number) => {
    const stageIcons = {
      seed: '🌱',
      sprout: '🌿',
      growing: '🌾',
      ready: '🌽'
    };
    
    const stages = ['seed', 'sprout', 'growing', 'ready'];
    const currentStage = stages[growthStage] || 'seed';
    
    return stageIcons[currentStage as keyof typeof stageIcons] || '🌱';
  };

  const getCropColor = (subjectId: string) => {
    const subject = availableSubjects.find(s => s.id === subjectId);
    return subject?.color || 'green';
  };

  const getGrowthStageName = (growthStage: number) => {
    const stages = ['Seed', 'Sprout', 'Growing', 'Ready'];
    return stages[growthStage] || 'Seed';
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-600';
    if (health >= 60) return 'text-yellow-600';
    if (health >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getHealthStatus = (health: number) => {
    if (health >= 80) return 'Excellent';
    if (health >= 60) return 'Good';
    if (health >= 40) return 'Poor';
    return 'Critical';
  };

  const canHarvest = (crop: FarmCrop) => {
    return crop.growthStage >= 3 && !crop.isWithered && crop.harvestValue > 0;
  };

  const needsWater = (crop: FarmCrop) => {
    return crop.health < 60 && !crop.isWithered;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Farm Header */}
      <Card className="bg-gradient-to-r from-green-50 to-yellow-50 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Knowledge Farm</CardTitle>
                <p className="text-sm text-muted-foreground">Grow your knowledge like crops!</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {crops.length} Crops
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Plant New Crop */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Plant New Crop</CardTitle>
          <p className="text-sm text-muted-foreground">Choose a subject to plant and grow</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableSubjects.map(subject => (
              <Button
                key={subject.id}
                variant="outline"
                onClick={() => onPlantCrop(subject.id, subject.name.toLowerCase())}
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-white",
                  `bg-${subject.color}-500`
                )}>
                  <Leaf className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{subject.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {crops.map(crop => {
          const subject = availableSubjects.find(s => s.id === crop.subjectId);
          const isReady = canHarvest(crop);
          const needsWatering = needsWater(crop);
          
          return (
            <Card 
              key={crop.id}
              className={cn(
                "transition-all duration-200 hover:shadow-lg",
                crop.isWithered && "opacity-60 bg-red-50",
                isReady && "ring-2 ring-green-400 bg-green-50"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">
                      {getCropIcon(crop.cropType, crop.growthStage)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{crop.cropType}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {subject?.name || 'Unknown Subject'}
                      </p>
                    </div>
                  </div>
                  
                  {crop.isWithered && (
                    <Badge variant="destructive">
                      <Flame className="w-3 h-3 mr-1" />
                      Withered
                    </Badge>
                  )}
                  
                  {isReady && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Crop className="w-3 h-3 mr-1" />
                      Ready
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Growth Stage */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Growth Stage</span>
                    <span>{getGrowthStageName(crop.growthStage)}</span>
                  </div>
                  <Progress 
                    value={(crop.growthStage / 3) * 100} 
                    className="h-2" 
                  />
                </div>

                {/* Health Status */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Health</span>
                    <span className={getHealthColor(crop.health)}>
                      {getHealthStatus(crop.health)}
                    </span>
                  </div>
                  <Progress 
                    value={crop.health} 
                    className="h-2" 
                  />
                </div>

                {/* Harvest Value */}
                {crop.harvestValue > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>Harvest Value: {crop.harvestValue} points</span>
                    </div>
                  </div>
                )}

                {/* Time Planted */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      Planted {Math.floor((Date.now() - crop.plantedAt.getTime()) / (1000 * 60 * 60))}h ago
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {isReady ? (
                    <Button 
                      onClick={() => onHarvestCrop(crop.id)}
                      className="flex-1"
                      size="sm"
                    >
                      <Crop className="w-4 h-4 mr-2" />
                      Harvest
                    </Button>
                  ) : crop.isWithered ? (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      disabled
                      size="sm"
                    >
                      <Flame className="w-4 h-4 mr-2" />
                      Withered
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => onWaterCrop(crop.id)}
                      disabled={!needsWatering}
                      className="flex-1"
                      size="sm"
                    >
                      <Droplets className="w-4 h-4 mr-2" />
                      {needsWatering ? 'Water' : 'Healthy'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {crops.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Leaf className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Crops Planted</h3>
            <p className="text-muted-foreground mb-4">
              Start planting crops to grow your knowledge!
            </p>
            <Button onClick={() => onPlantCrop(availableSubjects[0]?.id || '', 'math')}>
              <Leaf className="w-4 h-4 mr-2" />
              Plant Your First Crop
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
