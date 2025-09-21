import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { useLocation } from 'wouter';

export default function SimpleGameDashboard() {
  const [, setLocation] = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const gameFeatures = [
    {
      id: 'village',
      name: 'Village Quest',
      description: 'Explore the learning village with interactive buildings',
      icon: MapPin,
      color: 'bg-blue-500',
      status: 'Available'
    },
    {
      id: 'skills',
      name: 'Skill Tree',
      description: 'Unlock skills like Math Wizard and Word Master',
      icon: Zap,
      color: 'bg-purple-500',
      status: 'Available'
    },
    {
      id: 'farm',
      name: 'Knowledge Farm',
      description: 'Grow your knowledge like crops in a farm',
      icon: Leaf,
      color: 'bg-green-500',
      status: 'Available'
    },
    {
      id: 'community',
      name: 'Community Challenges',
      description: 'Join team challenges and compete with friends',
      icon: Users,
      color: 'bg-orange-500',
      status: 'Available'
    },
    {
      id: 'games',
      name: 'Mini Games',
      description: 'Math Runner, Word Builder, and more fun games',
      icon: Gamepad2,
      color: 'bg-red-500',
      status: 'Available'
    },
    {
      id: 'festivals',
      name: 'Festival Games',
      description: 'Celebrate Diwali, Pongal, and other festivals',
      icon: Sparkles,
      color: 'bg-yellow-500',
      status: 'Available'
    },
    {
      id: 'ar',
      name: 'AR Models',
      description: 'View 3D models in augmented reality',
      icon: Camera,
      color: 'bg-indigo-500',
      status: 'Coming Soon'
    },
    {
      id: 'rewards',
      name: 'Rewards Store',
      description: 'Redeem points for certificates and prizes',
      icon: Gift,
      color: 'bg-pink-500',
      status: 'Available'
    }
  ];

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
              
              {/* Back to Dashboard */}
              <Button
                onClick={() => setLocation('/dashboard')}
                variant="outline"
                size="sm"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Welcome Message */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Game Hub!</h2>
                <p className="text-gray-600">
                  Explore all the exciting game features that make learning fun and engaging. 
                  Each feature is designed to help you learn through play, competition, and achievement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.id}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => {
                  if (feature.status === 'Available') {
                    // Handle feature click
                    console.log(`Opening ${feature.name}`);
                  }
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge 
                      variant={feature.status === 'Available' ? 'default' : 'secondary'}
                      className={feature.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                    >
                      {feature.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <h3 className="text-lg font-semibold mb-2">{feature.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                  
                  <Button 
                    className={`w-full ${feature.status === 'Available' ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' : 'bg-gray-300 cursor-not-allowed'}`}
                    disabled={feature.status !== 'Available'}
                  >
                    {feature.status === 'Available' ? 'Explore' : 'Coming Soon'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Tutor */}
        <Card className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Tutor Assistant</h3>
                <p className="text-gray-600 mb-4">
                  Get smart hints and guidance while learning. I'm here to help you understand concepts 
                  without giving away the answers!
                </p>
                <Button variant="outline" className="bg-white">
                  <Bot className="w-4 h-4 mr-2" />
                  Chat with AI Tutor
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">1,250</h3>
              <p className="text-gray-600">Total Points</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">15</h3>
              <p className="text-gray-600">Crops Planted</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">3</h3>
              <p className="text-gray-600">Skills Unlocked</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


