// Offline functionality utilities

export interface OfflineLesson {
  id: string;
  title: string;
  content: any;
  downloadedAt: Date;
}

export interface OfflineProgress {
  lessonId: string;
  completed: boolean;
  score?: number;
  syncRequired: boolean;
}

class OfflineManager {
  private lessons: Map<string, OfflineLesson> = new Map();
  private progress: Map<string, OfflineProgress> = new Map();

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    try {
      const savedLessons = localStorage.getItem("offline-lessons");
      if (savedLessons) {
        const lessons = JSON.parse(savedLessons);
        this.lessons = new Map(lessons);
      }

      const savedProgress = localStorage.getItem("offline-progress");
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        this.progress = new Map(progress);
      }
    } catch (error) {
      console.error("Failed to load offline data:", error);
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem("offline-lessons", JSON.stringify(Array.from(this.lessons.entries())));
      localStorage.setItem("offline-progress", JSON.stringify(Array.from(this.progress.entries())));
    } catch (error) {
      console.error("Failed to save offline data:", error);
    }
  }

  async downloadLesson(lessonId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/lessons/${lessonId}`);
      if (!response.ok) return false;

      const lesson = await response.json();
      const offlineLesson: OfflineLesson = {
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        downloadedAt: new Date(),
      };

      this.lessons.set(lessonId, offlineLesson);
      this.saveToLocalStorage();
      return true;
    } catch (error) {
      console.error("Failed to download lesson:", error);
      return false;
    }
  }

  getOfflineLesson(lessonId: string): OfflineLesson | undefined {
    return this.lessons.get(lessonId);
  }

  isLessonDownloaded(lessonId: string): boolean {
    return this.lessons.has(lessonId);
  }

  getDownloadedLessons(): OfflineLesson[] {
    return Array.from(this.lessons.values());
  }

  updateProgress(lessonId: string, progress: Omit<OfflineProgress, "syncRequired">) {
    this.progress.set(lessonId, { ...progress, syncRequired: true });
    this.saveToLocalStorage();
  }

  getProgress(lessonId: string): OfflineProgress | undefined {
    return this.progress.get(lessonId);
  }

  async syncProgress(userId: string): Promise<boolean> {
    if (!navigator.onLine) return false;

    try {
      const progressToSync = Array.from(this.progress.entries())
        .filter(([, progress]) => progress.syncRequired);

      for (const [lessonId, progress] of progressToSync) {
        const response = await fetch(`/api/user/${userId}/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId,
            completed: progress.completed,
            score: progress.score,
          }),
        });

        if (response.ok) {
          this.progress.set(lessonId, { ...progress, syncRequired: false });
        }
      }

      this.saveToLocalStorage();
      return true;
    } catch (error) {
      console.error("Failed to sync progress:", error);
      return false;
    }
  }

  removeLesson(lessonId: string) {
    this.lessons.delete(lessonId);
    this.saveToLocalStorage();
  }

  getStorageUsage(): { lessons: number; totalMB: number } {
    const lessonsCount = this.lessons.size;
    const dataSize = localStorage.getItem("offline-lessons")?.length || 0;
    const progressSize = localStorage.getItem("offline-progress")?.length || 0;
    const totalMB = (dataSize + progressSize) / (1024 * 1024);

    return { lessons: lessonsCount, totalMB };
  }

  clearAllData() {
    this.lessons.clear();
    this.progress.clear();
    localStorage.removeItem("offline-lessons");
    localStorage.removeItem("offline-progress");
  }
}

export const offlineManager = new OfflineManager();

// Check if app is running offline
export function isOffline(): boolean {
  return !navigator.onLine;
}

// Listen for online/offline events
export function setupOfflineListeners(
  onOnline: () => void,
  onOffline: () => void
) {
  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);

  return () => {
    window.removeEventListener("online", onOnline);
    window.removeEventListener("offline", onOffline);
  };
}
