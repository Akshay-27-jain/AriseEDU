// Core Game Engine for AriseEDU
// Handles all game mechanics, state management, and progression systems

export interface GameState {
  village: VillageState;
  skills: SkillsState;
  farm: FarmState;
  community: CommunityState;
  miniGames: MiniGamesState;
  festivals: FestivalsState;
  ar: ARState;
  rewards: RewardsState;
}

export interface VillageState {
  level: number;
  unlockedBuildings: string[];
  currentQuests: VillageQuest[];
  completedQuests: string[];
  villageProgress: Record<string, any>;
}

export interface SkillsState {
  skillPoints: number;
  unlockedSkills: Record<string, number>; // skillId -> level
  availableSkills: string[];
}

export interface FarmState {
  level: number;
  crops: FarmCrop[];
  dailyStreak: number;
  lastActiveDate: Date;
  farmProgress: Record<string, any>;
}

export interface CommunityState {
  activeChallenges: CommunityChallenge[];
  userProgress: Record<string, number>;
  leaderboard: LeaderboardEntry[];
}

export interface MiniGamesState {
  unlockedGames: string[];
  highScores: Record<string, number>;
  gameProgress: Record<string, any>;
}

export interface FestivalsState {
  activeEvents: FestivalEvent[];
  completedEvents: string[];
  eventProgress: Record<string, any>;
}

export interface ARState {
  unlockedModels: string[];
  modelProgress: Record<string, any>;
}

export interface RewardsState {
  availableRewards: Reward[];
  userRewards: UserReward[];
  points: number;
}

export interface VillageQuest {
  id: string;
  buildingId: string;
  title: string;
  description: string;
  type: 'lesson' | 'quiz' | 'mini_game';
  requirements: Record<string, any>;
  rewards: Record<string, any>;
  order: number;
  isCompleted: boolean;
}

export interface FarmCrop {
  id: string;
  subjectId: string;
  cropType: string;
  plantedAt: Date;
  growthStage: number;
  health: number;
  isWithered: boolean;
  harvestValue: number;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'monthly' | 'special';
  startDate: Date;
  endDate: Date;
  target: number;
  currentProgress: number;
  rewards: Record<string, any>;
  isActive: boolean;
}

export interface FestivalEvent {
  id: string;
  name: string;
  type: 'diwali' | 'pongal' | 'independence_day';
  startDate: Date;
  endDate: Date;
  description: string;
  gameData: Record<string, any>;
  rewards: Record<string, any>;
  isActive: boolean;
}

export interface Reward {
  id: string;
  name: string;
  type: 'certificate' | 'badge' | 'physical';
  description: string;
  pointsCost: number;
  imageUrl?: string;
  isAvailable: boolean;
}

export interface UserReward {
  id: string;
  userId: string;
  rewardId: string;
  redeemedAt: Date;
  status: 'pending' | 'approved' | 'shipped';
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
  rank: number;
}

export class GameEngine {
  private state: GameState;
  private listeners: Array<(state: GameState) => void> = [];

  constructor(initialState?: Partial<GameState>) {
    this.state = {
      village: {
        level: 1,
        unlockedBuildings: [],
        currentQuests: [],
        completedQuests: [],
        villageProgress: {}
      },
      skills: {
        skillPoints: 0,
        unlockedSkills: {},
        availableSkills: []
      },
      farm: {
        level: 1,
        crops: [],
        dailyStreak: 0,
        lastActiveDate: new Date(),
        farmProgress: {}
      },
      community: {
        activeChallenges: [],
        userProgress: {},
        leaderboard: []
      },
      miniGames: {
        unlockedGames: [],
        highScores: {},
        gameProgress: {}
      },
      festivals: {
        activeEvents: [],
        completedEvents: [],
        eventProgress: {}
      },
      ar: {
        unlockedModels: [],
        modelProgress: {}
      },
      rewards: {
        availableRewards: [],
        userRewards: [],
        points: 0
      },
      ...initialState
    };
  }

  // State Management
  getState(): GameState {
    return { ...this.state };
  }

  setState(newState: Partial<GameState>): void {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Village Quest System
  unlockBuilding(buildingId: string): void {
    if (!this.state.village.unlockedBuildings.includes(buildingId)) {
      this.state.village.unlockedBuildings.push(buildingId);
      this.notifyListeners();
    }
  }

  completeQuest(questId: string): void {
    const quest = this.state.village.currentQuests.find(q => q.id === questId);
    if (quest && !quest.isCompleted) {
      quest.isCompleted = true;
      this.state.village.completedQuests.push(questId);
      this.processQuestRewards(quest);
      this.notifyListeners();
    }
  }

  private processQuestRewards(quest: VillageQuest): void {
    // Process skill points
    if (quest.rewards.skillPoints) {
      this.state.skills.skillPoints += quest.rewards.skillPoints;
    }

    // Process points
    if (quest.rewards.points) {
      this.state.rewards.points += quest.rewards.points;
    }

    // Process building unlocks
    if (quest.rewards.unlockBuilding) {
      this.unlockBuilding(quest.rewards.unlockBuilding);
    }
  }

  // Skill Tree System
  unlockSkill(skillId: string): boolean {
    if (this.canUnlockSkill(skillId)) {
      const currentLevel = this.state.skills.unlockedSkills[skillId] || 0;
      this.state.skills.unlockedSkills[skillId] = currentLevel + 1;
      this.state.skills.skillPoints -= this.getSkillCost(skillId);
      this.notifyListeners();
      return true;
    }
    return false;
  }

  canUnlockSkill(skillId: string): boolean {
    const currentLevel = this.state.skills.unlockedSkills[skillId] || 0;
    const cost = this.getSkillCost(skillId);
    return this.state.skills.skillPoints >= cost;
  }

  private getSkillCost(skillId: string): number {
    // This would typically come from the skill definition
    return 1; // Default cost
  }

  // Daily Farming System
  plantCrop(subjectId: string, cropType: string): void {
    const crop: FarmCrop = {
      id: `crop_${Date.now()}`,
      subjectId,
      cropType,
      plantedAt: new Date(),
      growthStage: 0,
      health: 100,
      isWithered: false,
      harvestValue: 0
    };
    this.state.farm.crops.push(crop);
    this.notifyListeners();
  }

  waterCrop(cropId: string): void {
    const crop = this.state.farm.crops.find(c => c.id === cropId);
    if (crop && !crop.isWithered) {
      crop.health = Math.min(100, crop.health + 20);
      this.notifyListeners();
    }
  }

  harvestCrop(cropId: string): number {
    const cropIndex = this.state.farm.crops.findIndex(c => c.id === cropId);
    if (cropIndex !== -1) {
      const crop = this.state.farm.crops[cropIndex];
      const harvestValue = crop.harvestValue;
      this.state.farm.crops.splice(cropIndex, 1);
      this.state.rewards.points += harvestValue;
      this.notifyListeners();
      return harvestValue;
    }
    return 0;
  }

  updateCropGrowth(): void {
    const now = new Date();
    this.state.farm.crops.forEach(crop => {
      const hoursSincePlanted = (now.getTime() - crop.plantedAt.getTime()) / (1000 * 60 * 60);
      
      // Update growth stage based on time
      if (hoursSincePlanted > 24 && crop.growthStage < 3) {
        crop.growthStage = Math.min(3, Math.floor(hoursSincePlanted / 24));
      }

      // Check if crop withered (no activity for 48 hours)
      if (hoursSincePlanted > 48 && crop.health < 50) {
        crop.isWithered = true;
      }

      // Calculate harvest value
      if (crop.growthStage === 3 && !crop.isWithered) {
        crop.harvestValue = Math.floor(crop.health / 10) * 10;
      }
    });
    this.notifyListeners();
  }

  // Community Challenges
  contributeToChallenge(challengeId: string, contribution: number): void {
    const challenge = this.state.community.activeChallenges.find(c => c.id === challengeId);
    if (challenge && challenge.isActive) {
      challenge.currentProgress = Math.min(challenge.target, challenge.currentProgress + contribution);
      
      if (!this.state.community.userProgress[challengeId]) {
        this.state.community.userProgress[challengeId] = 0;
      }
      this.state.community.userProgress[challengeId] += contribution;
      
      this.notifyListeners();
    }
  }

  // Mini Games
  recordGameScore(gameId: string, score: number): void {
    const currentHighScore = this.state.miniGames.highScores[gameId] || 0;
    if (score > currentHighScore) {
      this.state.miniGames.highScores[gameId] = score;
    }
    
    // Award points based on score
    this.state.rewards.points += Math.floor(score / 10);
    this.notifyListeners();
  }

  // Festival Events
  participateInFestival(eventId: string, progress: number): void {
    const event = this.state.festivals.activeEvents.find(e => e.id === eventId);
    if (event && event.isActive) {
      if (!this.state.festivals.eventProgress[eventId]) {
        this.state.festivals.eventProgress[eventId] = 0;
      }
      this.state.festivals.eventProgress[eventId] += progress;
      this.notifyListeners();
    }
  }

  // AR Models
  unlockARModel(modelId: string): void {
    if (!this.state.ar.unlockedModels.includes(modelId)) {
      this.state.ar.unlockedModels.push(modelId);
      this.notifyListeners();
    }
  }

  // Rewards System
  redeemReward(rewardId: string): boolean {
    const reward = this.state.rewards.availableRewards.find(r => r.id === rewardId);
    if (reward && this.state.rewards.points >= reward.pointsCost) {
      this.state.rewards.points -= reward.pointsCost;
      this.state.rewards.userRewards.push({
        id: `user_reward_${Date.now()}`,
        userId: 'current_user', // This would come from auth context
        rewardId,
        redeemedAt: new Date(),
        status: 'pending'
      });
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Daily Streak Management
  updateDailyStreak(): void {
    const today = new Date();
    const lastActive = this.state.farm.lastActiveDate;
    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Consecutive day
      this.state.farm.dailyStreak += 1;
    } else if (daysDiff > 1) {
      // Streak broken
      this.state.farm.dailyStreak = 1;
    }
    
    this.state.farm.lastActiveDate = today;
    this.notifyListeners();
  }

  // Game Progression
  checkLevelUp(): void {
    // Check if user should level up based on total points
    const newLevel = Math.floor(this.state.rewards.points / 100) + 1;
    if (newLevel > this.state.village.level) {
      this.state.village.level = newLevel;
      this.state.skills.skillPoints += 2; // Award skill points on level up
      this.notifyListeners();
    }
  }
}

// Game Constants
export const GAME_CONSTANTS = {
  SKILL_POINTS_PER_LEVEL: 2,
  POINTS_PER_CORRECT_ANSWER: 10,
  POINTS_PER_QUIZ_COMPLETION: 50,
  POINTS_PER_LESSON_COMPLETION: 25,
  DAILY_STREAK_BONUS: 5,
  CROP_GROWTH_HOURS: 24,
  CROP_WITHER_HOURS: 48,
  MAX_DAILY_STREAK: 30
};

// Game Utilities
export const gameUtils = {
  calculateXPRequired: (level: number): number => {
    return level * 100;
  },

  getSkillCategoryColor: (category: string): string => {
    const colors = {
      math: 'bg-blue-500',
      science: 'bg-green-500',
      language: 'bg-purple-500',
      general: 'bg-orange-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  },

  getCropGrowthStage: (crop: FarmCrop): string => {
    const stages = ['seed', 'sprout', 'growing', 'ready'];
    return stages[crop.growthStage] || 'seed';
  },

  formatTimeSpent: (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};
