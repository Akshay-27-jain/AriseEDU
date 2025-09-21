import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Gift, 
  Star, 
  Award, 
  Download,
  CheckCircle,
  Clock,
  Truck,
  CreditCard,
  Filter,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Reward {
  id: string;
  name: string;
  type: 'certificate' | 'badge' | 'physical';
  description: string;
  pointsCost: number;
  imageUrl?: string;
  isAvailable: boolean;
  category: 'academic' | 'achievement' | 'special' | 'physical';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  estimatedDelivery?: string;
  requirements?: string[];
}

interface UserReward {
  id: string;
  userId: string;
  rewardId: string;
  redeemedAt: Date;
  status: 'pending' | 'approved' | 'shipped' | 'delivered';
  trackingNumber?: string;
}

interface RewardsStoreProps {
  rewards: Reward[];
  userRewards: UserReward[];
  userPoints: number;
  onRedeemReward: (rewardId: string) => void;
  onViewReward: (rewardId: string) => void;
  className?: string;
}

export function RewardsStore({ 
  rewards, 
  userRewards, 
  userPoints, 
  onRedeemReward, 
  onViewReward,
  className 
}: RewardsStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All', icon: Gift },
    { id: 'academic', name: 'Academic', icon: Award },
    { id: 'achievement', name: 'Achievement', icon: Star },
    { id: 'special', name: 'Special', icon: CheckCircle },
    { id: 'physical', name: 'Physical', icon: Truck }
  ];

  const types = [
    { id: 'all', name: 'All Types' },
    { id: 'certificate', name: 'Certificates' },
    { id: 'badge', name: 'Digital Badges' },
    { id: 'physical', name: 'Physical Items' }
  ];

  const filteredRewards = rewards.filter(reward => {
    const matchesCategory = selectedCategory === 'all' || reward.category === selectedCategory;
    const matchesType = selectedType === 'all' || reward.type === selectedType;
    const matchesSearch = searchQuery === '' || 
      reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesType && matchesSearch && reward.isAvailable;
  });

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-100 text-gray-800',
      rare: 'bg-blue-100 text-blue-800',
      epic: 'bg-purple-100 text-purple-800',
      legendary: 'bg-orange-100 text-orange-800'
    };
    return colors[rarity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      certificate: Award,
      badge: Star,
      physical: Gift
    };
    return icons[type as keyof typeof icons] || Gift;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const canAfford = (pointsCost: number) => userPoints >= pointsCost;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Rewards Store</CardTitle>
                <p className="text-sm text-muted-foreground">Redeem your points for amazing rewards!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{userPoints}</div>
              <div className="text-sm text-muted-foreground">points available</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search rewards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
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

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              {types.map(type => (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    selectedType === type.id && "bg-purple-500 hover:bg-purple-600"
                  )}
                >
                  {type.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map(reward => {
          const TypeIcon = getTypeIcon(reward.type);
          const isRedeemable = canAfford(reward.pointsCost);
          
          return (
            <Card 
              key={reward.id}
              className={cn(
                "transition-all duration-200 hover:shadow-lg",
                !isRedeemable && "opacity-60"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <TypeIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{reward.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                  </div>
                  
                  <Badge className={getRarityColor(reward.rarity)}>
                    {reward.rarity.charAt(0).toUpperCase() + reward.rarity.slice(1)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Points Cost */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-2xl font-bold">{reward.pointsCost}</span>
                    <span className="text-sm text-muted-foreground">points</span>
                  </div>
                  
                  {!isRedeemable && (
                    <div className="text-sm text-muted-foreground">
                      Need {reward.pointsCost - userPoints} more
                    </div>
                  )}
                </div>

                {/* Requirements */}
                {reward.requirements && reward.requirements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Requirements</h4>
                    <div className="space-y-1">
                      {reward.requirements.map((req, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          • {req}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Estimated Delivery */}
                {reward.estimatedDelivery && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Delivery: {reward.estimatedDelivery}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => onRedeemReward(reward.id)}
                    disabled={!isRedeemable}
                    className="flex-1"
                    size="sm"
                  >
                    {isRedeemable ? (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Redeem
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4 mr-2" />
                        Not Enough Points
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => onViewReward(reward.id)}
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

      {/* Empty State */}
      {filteredRewards.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Gift className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Rewards Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or check back later for new rewards!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface MyRewardsProps {
  userRewards: UserReward[];
  rewards: Reward[];
  className?: string;
}

export function MyRewards({ userRewards, rewards, className }: MyRewardsProps) {
  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      shipped: Truck,
      delivered: Gift
    };
    return icons[status as keyof typeof icons] || Clock;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRewardById = (rewardId: string) => {
    return rewards.find(r => r.id === rewardId);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>My Rewards</CardTitle>
              <p className="text-sm text-muted-foreground">Track your redeemed rewards and their status</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {userRewards.map(userReward => {
          const reward = getRewardById(userReward.rewardId);
          if (!reward) return null;

          const StatusIcon = getStatusIcon(userReward.status);
          
          return (
            <Card key={userReward.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">{reward.name}</h3>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">{reward.pointsCost} points</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Redeemed: {new Date(userReward.redeemedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={getStatusColor(userReward.status)}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {userReward.status.charAt(0).toUpperCase() + userReward.status.slice(1)}
                    </Badge>
                    
                    {userReward.trackingNumber && (
                      <div className="text-sm text-muted-foreground mt-2">
                        Tracking: {userReward.trackingNumber}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {userRewards.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Rewards Yet</h3>
            <p className="text-muted-foreground">
              Start earning points and redeem them for amazing rewards!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
