import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Clock,
  HardDrive,
  RefreshCw,
  Cloud,
  CloudOff,
  Database,
  FileText,
  Video,
  Music,
  Image,
  BookOpen,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineManagerProps {
  className?: string;
}

export function OfflineManager({ className }: OfflineManagerProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [syncProgress, setSyncProgress] = useState(0);
  const [offlineStats, setOfflineStats] = useState({
    downloadedLessons: 15,
    cachedQuizzes: 8,
    offlineVideos: 12,
    offlineDocuments: 25,
    totalSize: '2.3 GB',
    lastSync: '2 hours ago'
  });

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleDownloadContent = async () => {
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const offlineContent = [
    {
      type: 'lessons',
      icon: BookOpen,
      title: 'Downloaded Lessons',
      count: offlineStats.downloadedLessons,
      size: '850 MB',
      color: 'bg-blue-500'
    },
    {
      type: 'quizzes',
      icon: Target,
      title: 'Cached Quizzes',
      count: offlineStats.cachedQuizzes,
      size: '120 MB',
      color: 'bg-green-500'
    },
    {
      type: 'videos',
      icon: Video,
      title: 'Offline Videos',
      count: offlineStats.offlineVideos,
      size: '1.2 GB',
      color: 'bg-purple-500'
    },
    {
      type: 'documents',
      icon: FileText,
      title: 'Offline Documents',
      count: offlineStats.offlineDocuments,
      size: '150 MB',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-600" />
            )}
            <span>Connection Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-3 h-3 rounded-full",
                isOnline ? "bg-green-500" : "bg-red-500"
              )} />
              <span className="font-medium">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
          
          {!isOnline && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  You're offline. Some features may not be available.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Offline Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HardDrive className="w-5 h-5" />
            <span>Offline Content</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {offlineContent.map((content, index) => {
              const Icon = content.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${content.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">{content.title}</h4>
                      <p className="text-sm text-muted-foreground">{content.count} items • {content.size}</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              );
            })}
            
            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Total Size</span>
                <span>{offlineStats.totalSize}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Progress */}
      {downloadProgress > 0 && downloadProgress < 100 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Downloading Content...</span>
                <span className="text-sm text-muted-foreground">{downloadProgress}%</span>
              </div>
              <Progress value={downloadProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sync Progress */}
      {isSyncing && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Syncing Data...</span>
                <span className="text-sm text-muted-foreground">{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          onClick={handleDownloadContent}
          disabled={!isOnline || downloadProgress > 0}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Content
        </Button>
        
        <Button 
          onClick={handleSyncData}
          disabled={!isOnline || isSyncing}
          variant="outline"
          className="w-full"
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", isSyncing && "animate-spin")} />
          Sync Data
        </Button>
      </div>

      {/* Last Sync Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Last Sync</span>
            </div>
            <span className="text-sm font-medium">{offlineStats.lastSync}</span>
          </div>
        </CardContent>
      </Card>

      {/* Cloud Storage Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {isOnline ? (
              <Cloud className="w-5 h-5 text-blue-600" />
            ) : (
              <CloudOff className="w-5 h-5 text-gray-400" />
            )}
            <span>Cloud Storage</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Storage Used</span>
              <span className="text-sm font-medium">2.3 GB / 5 GB</span>
            </div>
            <Progress value={46} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Used</span>
              <span>Available</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Offline indicator component
export function OfflineIndicator({ className }: { className?: string }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50",
      className
    )}>
      <div className="flex items-center justify-center space-x-2">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">You're offline. Some features may not be available.</span>
      </div>
    </div>
  );
}

