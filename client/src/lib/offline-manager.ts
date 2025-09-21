// Offline Game Manager for AriseEDU
// Handles offline game state, progress sync, and data persistence

export interface OfflineGameState {
  id: string;
  type: 'village' | 'skill' | 'farm' | 'mini_game' | 'festival' | 'community' | 'ar';
  data: any;
  timestamp: number;
  syncRequired: boolean;
  version: number;
}

export interface OfflineProgress {
  userId: string;
  gameStates: OfflineGameState[];
  lastSync: number;
  pendingActions: OfflineAction[];
}

export interface OfflineAction {
  id: string;
  type: 'progress_update' | 'achievement_unlock' | 'skill_unlock' | 'reward_claim';
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

export class OfflineManager {
  private static instance: OfflineManager;
  private isOnline: boolean = navigator.onLine;
  private syncQueue: OfflineAction[] = [];
  private syncInProgress: boolean = false;

  private constructor() {
    this.setupEventListeners();
    this.loadOfflineData();
  }

  public static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Periodic sync when online
    setInterval(() => {
      if (this.isOnline && this.syncQueue.length > 0) {
        this.syncOfflineData();
      }
    }, 30000); // Every 30 seconds
  }

  private loadOfflineData(): void {
    try {
      const stored = localStorage.getItem('arise-offline-progress');
      if (stored) {
        const data = JSON.parse(stored);
        this.syncQueue = data.pendingActions || [];
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  }

  private saveOfflineData(): void {
    try {
      const data: OfflineProgress = {
        userId: this.getCurrentUserId(),
        gameStates: this.getGameStates(),
        lastSync: Date.now(),
        pendingActions: this.syncQueue
      };
      localStorage.setItem('arise-offline-progress', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }

  private getCurrentUserId(): string {
    // This would typically come from auth context
    return localStorage.getItem('arise-user-id') || 'anonymous';
  }

  private getGameStates(): OfflineGameState[] {
    // This would collect current game states from the game engine
    return [];
  }

  // Save game state for offline access
  public saveGameState(type: string, data: any): void {
    const gameState: OfflineGameState = {
      id: `${type}_${Date.now()}`,
      type: type as any,
      data,
      timestamp: Date.now(),
      syncRequired: !this.isOnline,
      version: 1
    };

    try {
      const stored = localStorage.getItem(`arise-game-${type}`);
      const states = stored ? JSON.parse(stored) : [];
      states.push(gameState);
      
      // Keep only last 50 states per type
      if (states.length > 50) {
        states.splice(0, states.length - 50);
      }
      
      localStorage.setItem(`arise-game-${type}`, JSON.stringify(states));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }

  // Load game state for offline access
  public loadGameState(type: string): any[] {
    try {
      const stored = localStorage.getItem(`arise-game-${type}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load game state:', error);
      return [];
    }
  }

  // Queue action for sync when online
  public queueAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>): void {
    const offlineAction: OfflineAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: 3
    };

    this.syncQueue.push(offlineAction);
    this.saveOfflineData();

    // Try to sync immediately if online
    if (this.isOnline) {
      this.syncOfflineData();
    }
  }

  // Sync offline data with server
  public async syncOfflineData(): Promise<void> {
    if (!this.isOnline || this.syncInProgress || this.syncQueue.length === 0) {
      return;
    }

    this.syncInProgress = true;

    try {
      const actionsToSync = [...this.syncQueue];
      const successfulActions: string[] = [];

      for (const action of actionsToSync) {
        try {
          await this.syncAction(action);
          successfulActions.push(action.id);
        } catch (error) {
          console.error(`Failed to sync action ${action.id}:`, error);
          action.retryCount++;
          
          if (action.retryCount >= action.maxRetries) {
            console.error(`Action ${action.id} exceeded max retries, removing from queue`);
            successfulActions.push(action.id);
          }
        }
      }

      // Remove successfully synced actions
      this.syncQueue = this.syncQueue.filter(action => 
        !successfulActions.includes(action.id)
      );

      this.saveOfflineData();
    } catch (error) {
      console.error('Failed to sync offline data:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncAction(action: OfflineAction): Promise<void> {
    const endpoint = this.getEndpointForAction(action.type);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify({
        actionId: action.id,
        type: action.type,
        data: action.data,
        timestamp: action.timestamp
      })
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`);
    }
  }

  private getEndpointForAction(type: string): string {
    const endpoints = {
      progress_update: '/api/sync-progress',
      achievement_unlock: '/api/sync-achievements',
      skill_unlock: '/api/sync-skills',
      reward_claim: '/api/sync-rewards'
    };
    return endpoints[type as keyof typeof endpoints] || '/api/sync-generic';
  }

  private getAuthToken(): string {
    return localStorage.getItem('arise-auth-token') || '';
  }

  // Check if specific game type is available offline
  public isGameAvailableOffline(type: string): boolean {
    try {
      const stored = localStorage.getItem(`arise-game-${type}`);
      return stored !== null;
    } catch (error) {
      return false;
    }
  }

  // Get offline game statistics
  public getOfflineStats(): {
    totalStates: number;
    pendingActions: number;
    lastSync: number;
    storageUsed: number;
  } {
    const gameTypes = ['village', 'skill', 'farm', 'mini_game', 'festival', 'community', 'ar'];
    let totalStates = 0;
    let storageUsed = 0;

    gameTypes.forEach(type => {
      const states = this.loadGameState(type);
      totalStates += states.length;
    });

    // Calculate approximate storage usage
    try {
      const stored = localStorage.getItem('arise-offline-progress');
      if (stored) {
        storageUsed += stored.length;
      }
    } catch (error) {
      // Ignore storage calculation errors
    }

    return {
      totalStates,
      pendingActions: this.syncQueue.length,
      lastSync: this.getLastSyncTime(),
      storageUsed
    };
  }

  private getLastSyncTime(): number {
    try {
      const stored = localStorage.getItem('arise-offline-progress');
      if (stored) {
        const data = JSON.parse(stored);
        return data.lastSync || 0;
      }
    } catch (error) {
      // Ignore parsing errors
    }
    return 0;
  }

  // Clear offline data (for testing or user request)
  public clearOfflineData(): void {
    try {
      const gameTypes = ['village', 'skill', 'farm', 'mini_game', 'festival', 'community', 'ar'];
      gameTypes.forEach(type => {
        localStorage.removeItem(`arise-game-${type}`);
      });
      localStorage.removeItem('arise-offline-progress');
      this.syncQueue = [];
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  }

  // Download game assets for offline play
  public async downloadGameAssets(gameType: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/games/${gameType}/assets`);
      if (!response.ok) {
        throw new Error('Failed to download game assets');
      }

      const assets = await response.json();
      
      // Store assets in IndexedDB for offline access
      await this.storeAssetsInIndexedDB(gameType, assets);
      
      return true;
    } catch (error) {
      console.error('Failed to download game assets:', error);
      return false;
    }
  }

  private async storeAssetsInIndexedDB(gameType: string, assets: any): Promise<void> {
    // This would use IndexedDB to store large game assets
    // For now, we'll use localStorage as a fallback
    try {
      localStorage.setItem(`arise-assets-${gameType}`, JSON.stringify(assets));
    } catch (error) {
      console.error('Failed to store assets:', error);
    }
  }

  // Get offline game assets
  public getOfflineGameAssets(gameType: string): any {
    try {
      const stored = localStorage.getItem(`arise-assets-${gameType}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get offline assets:', error);
      return null;
    }
  }

  // Check if user is online
  public isOnline(): boolean {
    return this.isOnline;
  }

  // Force sync (for manual sync button)
  public async forceSync(): Promise<boolean> {
    if (!this.isOnline) {
      return false;
    }

    try {
      await this.syncOfflineData();
      return true;
    } catch (error) {
      console.error('Force sync failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const offlineManager = OfflineManager.getInstance();
