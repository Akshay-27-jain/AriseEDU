import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Download, 
  Eye, 
  Lock, 
  Unlock,
  Star,
  Target,
  Zap,
  Globe,
  Microscope,
  Heart,
  Atom,
  Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ARModel {
  id: string;
  name: string;
  subjectId: string;
  modelUrl: string;
  thumbnailUrl: string;
  description: string;
  unlockRequirements: {
    level?: number;
    points?: number;
    achievements?: string[];
    subjects?: string[];
  };
  category: 'science' | 'biology' | 'astronomy' | 'chemistry' | 'physics';
  isUnlocked: boolean;
  downloadSize: number; // in MB
  isDownloaded: boolean;
  viewCount: number;
  rating: number;
}

interface ARModelsProps {
  models: ARModel[];
  userLevel: number;
  userPoints: number;
  userAchievements: string[];
  onUnlockModel: (modelId: string) => void;
  onDownloadModel: (modelId: string) => void;
  onViewModel: (modelId: string) => void;
  className?: string;
}

export function ARModels({ 
  models, 
  userLevel, 
  userPoints, 
  userAchievements,
  onUnlockModel, 
  onDownloadModel, 
  onViewModel,
  className 
}: ARModelsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isARSupported, setIsARSupported] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const categories = [
    { id: 'all', name: 'All Models', icon: Globe },
    { id: 'science', name: 'Science', icon: Microscope },
    { id: 'biology', name: 'Biology', icon: Heart },
    { id: 'astronomy', name: 'Astronomy', icon: Sun },
    { id: 'chemistry', name: 'Chemistry', icon: Atom },
    { id: 'physics', name: 'Physics', icon: Zap }
  ];

  // Check AR support
  useEffect(() => {
    const checkARSupport = async () => {
      if ('xr' in navigator) {
        try {
          const isSupported = await (navigator as any).xr.isSessionSupported('immersive-ar');
          setIsARSupported(isSupported);
        } catch (error) {
          console.log('AR not supported:', error);
        }
      }
    };
    
    checkARSupport();
  }, []);

  const filteredModels = models.filter(model => 
    selectedCategory === 'all' || model.category === selectedCategory
  );

  const canUnlockModel = (model: ARModel) => {
    const { unlockRequirements } = model;
    
    if (unlockRequirements.level && userLevel < unlockRequirements.level) return false;
    if (unlockRequirements.points && userPoints < unlockRequirements.points) return false;
    if (unlockRequirements.achievements) {
      const hasAllAchievements = unlockRequirements.achievements.every(achievement => 
        userAchievements.includes(achievement)
      );
      if (!hasAllAchievements) return false;
    }
    
    return true;
  };

  const getCategoryIcon = (category: string) => {
    const iconMap = {
      science: Microscope,
      biology: Heart,
      astronomy: Sun,
      chemistry: Atom,
      physics: Zap,
      general: Globe
    };
    return iconMap[category as keyof typeof iconMap] || Globe;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      science: 'bg-blue-500',
      biology: 'bg-green-500',
      astronomy: 'bg-purple-500',
      chemistry: 'bg-orange-500',
      physics: 'bg-red-500',
      general: 'bg-gray-500'
    };
    return colors[category as keyof typeof iconMap] || 'bg-gray-500';
  };

  const getRarityColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-yellow-100 text-yellow-800';
    if (rating >= 4.0) return 'bg-blue-100 text-blue-800';
    if (rating >= 3.5) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      setCameraPermission(false);
    }
  };

  const startARView = async (model: ARModel) => {
    if (!isARSupported) {
      alert('AR is not supported on this device. Please use a compatible mobile device.');
      return;
    }

    if (cameraPermission === null) {
      await requestCameraPermission();
    }

    if (cameraPermission === false) {
      alert('Camera permission is required for AR viewing.');
      return;
    }

    onViewModel(model.id);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>AR Models</CardTitle>
                <p className="text-sm text-muted-foreground">Explore 3D models in augmented reality!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">AR Support</div>
              <Badge variant={isARSupported ? "default" : "secondary"}>
                {isARSupported ? 'Supported' : 'Not Available'}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* AR Support Info */}
      {!isARSupported && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">AR Not Supported</h3>
                <p className="text-sm text-yellow-700">
                  AR viewing requires a compatible mobile device with camera support. 
                  You can still view model previews and download them for offline use.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    selectedCategory === category.id && "bg-purple-500 hover:bg-purple-600"
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map(model => {
          const CategoryIcon = getCategoryIcon(model.category);
          const canUnlock = canUnlockModel(model);
          const isUnlocked = model.isUnlocked || canUnlock;
          
          return (
            <Card 
              key={model.id}
              className={cn(
                "transition-all duration-200 hover:shadow-lg",
                !isUnlocked && "opacity-60"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center text-white",
                      getCategoryColor(model.category)
                    )}>
                      <CategoryIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{model.description}</p>
                    </div>
                  </div>
                  
                  {!isUnlocked && (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Model Thumbnail */}
                <div className="mb-4">
                  <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    {model.thumbnailUrl ? (
                      <img 
                        src={model.thumbnailUrl} 
                        alt={model.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <CategoryIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">3D Model Preview</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Model Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">{model.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-muted-foreground">{model.viewCount}</span>
                    </div>
                  </div>
                  
                  <Badge className={getRarityColor(model.rating)}>
                    {model.rating >= 4.5 ? 'Legendary' : 
                     model.rating >= 4.0 ? 'Epic' : 
                     model.rating >= 3.5 ? 'Rare' : 'Common'}
                  </Badge>
                </div>

                {/* Download Size */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Download Size</span>
                    <span>{model.downloadSize} MB</span>
                  </div>
                  <Progress value={model.isDownloaded ? 100 : 0} className="h-2 mt-1" />
                </div>

                {/* Unlock Requirements */}
                {!isUnlocked && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Unlock Requirements</h4>
                    <div className="space-y-1">
                      {model.unlockRequirements.level && (
                        <div className="text-xs text-muted-foreground">
                          • Level {model.unlockRequirements.level} 
                          {userLevel >= model.unlockRequirements.level ? ' ✓' : ` (Current: ${userLevel})`}
                        </div>
                      )}
                      {model.unlockRequirements.points && (
                        <div className="text-xs text-muted-foreground">
                          • {model.unlockRequirements.points} points 
                          {userPoints >= model.unlockRequirements.points ? ' ✓' : ` (Current: ${userPoints})`}
                        </div>
                      )}
                      {model.unlockRequirements.achievements && (
                        <div className="text-xs text-muted-foreground">
                          • {model.unlockRequirements.achievements.length} achievements
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  {!isUnlocked ? (
                    <Button 
                      onClick={() => onUnlockModel(model.id)}
                      disabled={!canUnlock}
                      className="w-full"
                      size="sm"
                    >
                      {canUnlock ? (
                        <>
                          <Unlock className="w-4 h-4 mr-2" />
                          Unlock Model
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Requirements Not Met
                        </>
                      )}
                    </Button>
                  ) : (
                    <>
                      <Button 
                        onClick={() => startARView(model)}
                        disabled={!isARSupported}
                        className="w-full"
                        size="sm"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        View in AR
                      </Button>
                      
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => onDownloadModel(model.id)}
                          variant="outline"
                          className="flex-1"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {model.isDownloaded ? 'Downloaded' : 'Download'}
                        </Button>
                        
                        <Button 
                          onClick={() => onViewModel(model.id)}
                          variant="outline"
                          className="flex-1"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredModels.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No AR Models Found</h3>
            <p className="text-muted-foreground">
              Try selecting a different category or check back later for new models!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface ARViewerProps {
  modelUrl: string;
  modelName: string;
  onClose: () => void;
  className?: string;
}

export function ARViewer({ modelUrl, modelName, onClose, className }: ARViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to access camera');
        setIsLoading(false);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (error) {
    return (
      <div className={cn("fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", className)}>
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">Camera Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={onClose}>Close</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("fixed inset-0 bg-black z-50", className)}>
      {/* Camera View */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        
        {/* AR Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Starting AR Camera...</p>
            </div>
          </div>
        )}
        
        {/* Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="bg-black bg-opacity-50 rounded-lg px-4 py-2 text-white">
            <h3 className="font-semibold">{modelName}</h3>
            <p className="text-sm opacity-75">Point camera at a flat surface</p>
          </div>
          
          <Button
            onClick={onClose}
            variant="destructive"
            size="sm"
          >
            Close AR
          </Button>
        </div>
        
        {/* Instructions */}
        <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 rounded-lg p-4 text-white text-center">
          <p className="text-sm">
            Move your device to explore the 3D model. Tap and drag to rotate, pinch to zoom.
          </p>
        </div>
      </div>
    </div>
  );
}
