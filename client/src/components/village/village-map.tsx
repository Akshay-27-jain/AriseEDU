import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Lock, CheckCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VillageBuilding {
  id: string;
  name: string;
  type: 'house' | 'shop' | 'lab' | 'library';
  subjectId?: string;
  description: string;
  icon: string;
  color: string;
  unlockLevel: number;
  position: { x: number; y: number };
  isUnlocked: boolean;
  isCompleted?: boolean;
  questCount?: number;
}

interface VillageMapProps {
  buildings: VillageBuilding[];
  userLevel: number;
  onBuildingClick: (buildingId: string) => void;
  className?: string;
}

export function VillageMap({ 
  buildings, 
  userLevel, 
  onBuildingClick, 
  className 
}: VillageMapProps) {
  const getBuildingIcon = (type: string, icon: string) => {
    const iconMap = {
      house: '🏠',
      shop: '🏪',
      lab: '🧪',
      library: '📚'
    };
    return iconMap[type as keyof typeof iconMap] || '🏢';
  };

  const getBuildingColor = (color: string) => {
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

  return (
    <div className={cn("relative w-full h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl overflow-hidden", className)}>
      {/* Village Background Elements */}
      <div className="absolute inset-0">
        {/* Sky */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-blue-200 to-blue-100"></div>
        
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-green-200 to-green-100"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-4 left-4 text-2xl">☁️</div>
        <div className="absolute top-8 right-8 text-xl">🌤️</div>
        <div className="absolute bottom-4 left-8 text-lg">🌳</div>
        <div className="absolute bottom-6 right-4 text-lg">🌲</div>
        <div className="absolute bottom-2 left-1/2 text-sm">🌿</div>
      </div>

      {/* Buildings */}
      {buildings.map((building) => {
        const isLocked = userLevel < building.unlockLevel;
        const canInteract = building.isUnlocked && !isLocked;
        
        return (
          <div
            key={building.id}
            className={cn(
              "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
              canInteract && "hover:scale-110 cursor-pointer",
              isLocked && "opacity-50"
            )}
            style={{
              left: `${building.position.x}%`,
              top: `${building.position.y}%`,
            }}
            onClick={() => canInteract && onBuildingClick(building.id)}
          >
            <Card className={cn(
              "w-16 h-16 p-2 shadow-lg border-2",
              getBuildingColor(building.color),
              building.isCompleted && "ring-2 ring-green-400",
              canInteract && "hover:shadow-xl"
            )}>
              <CardContent className="p-0 h-full flex flex-col items-center justify-center relative">
                {/* Building Icon */}
                <div className="text-2xl mb-1">
                  {getBuildingIcon(building.type, building.icon)}
                </div>
                
                {/* Lock Icon for locked buildings */}
                {isLocked && (
                  <Lock className="absolute -top-1 -right-1 w-4 h-4 text-white bg-red-500 rounded-full p-0.5" />
                )}
                
                {/* Completion Checkmark */}
                {building.isCompleted && (
                  <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-white bg-green-500 rounded-full p-0.5" />
                )}
                
                {/* Quest Count Badge */}
                {building.questCount && building.questCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs flex items-center justify-center"
                  >
                    {building.questCount}
                  </Badge>
                )}
              </CardContent>
            </Card>
            
            {/* Building Name */}
            <div className="text-center mt-1">
              <p className="text-xs font-medium text-gray-700 whitespace-nowrap">
                {building.name}
              </p>
              {isLocked && (
                <p className="text-xs text-gray-500">
                  Lv. {building.unlockLevel}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Village Level Indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-semibold">Village Level {userLevel}</span>
          </div>
        </div>
      </div>

      {/* Progress Path Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {buildings.map((building, index) => {
          if (index === 0 || !building.isUnlocked) return null;
          
          const prevBuilding = buildings[index - 1];
          if (!prevBuilding.isUnlocked) return null;
          
          return (
            <line
              key={`path-${index}`}
              x1={`${prevBuilding.position.x}%`}
              y1={`${prevBuilding.position.y}%`}
              x2={`${building.position.x}%`}
              y2={`${building.position.y}%`}
              stroke="url(#pathGradient)"
              strokeWidth="3"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
          );
        })}
        
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
