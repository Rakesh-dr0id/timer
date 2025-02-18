import { create } from 'zustand';
import { Timer } from '../types/timer';
import { nanoid } from 'nanoid';

const STORAGE_KEY = 'timers';

// Load timers from localStorage
const loadTimers = (): Timer[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const timers: Timer[] = stored ? JSON.parse(stored) : [];

    // Reset any ended timers and stop running timers
    return timers.map((timer) => ({
      ...timer,
      isRunning: false,
      remainingTime:
        timer.remainingTime <= 0 ? timer.duration : timer.remainingTime,
    }));
  } catch (error) {
    console.error('Failed to load timers:', error);
    return [];
  }
};

// Save timers to localStorage
const saveTimers = (timers: Timer[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
  } catch (error) {
    console.error('Failed to save timers:', error);
  }
};

interface TimerStore {
  timers: Timer[];
  addTimer: (timer: Omit<Timer, 'id'>) => void;
  deleteTimer: (id: string) => void;
  updateTimer: (id: string) => void;
  editTimer: (id: string, updates: Partial<Omit<Timer, 'id'>>) => void;
  toggleTimer: (id: string) => void;
  restartTimer: (id: string) => void;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  timers: loadTimers(),

  addTimer: (timer) => {
    set((state) => {
      const newTimers = [...state.timers, { ...timer, id: nanoid() }];
      saveTimers(newTimers);
      return { timers: newTimers };
    });
  },

  deleteTimer: (id) => {
    set((state) => {
      const newTimers = state.timers.filter((t) => t.id !== id);
      saveTimers(newTimers);
      return { timers: newTimers };
    });
  },

  updateTimer: (id) => {
    set((state) => {
      const newTimers = state.timers.map((timer) => {
        if (timer.id === id && timer.isRunning) {
          const newRemainingTime = Math.max(0, timer.remainingTime - 1);
          return { ...timer, remainingTime: newRemainingTime };
        }
        return timer;
      });
      saveTimers(newTimers);
      return { timers: newTimers };
    });
  },

  editTimer: (id, updates) => {
    set((state) => {
      const newTimers = state.timers.map((timer) => {
        if (timer.id === id) {
          return {
            ...timer,
            ...updates,
            remainingTime: updates.duration ?? timer.duration,
          };
        }
        return timer;
      });
      saveTimers(newTimers);
      return { timers: newTimers };
    });
  },

  toggleTimer: (id) => {
    set((state) => {
      const newTimers = state.timers.map((timer) => {
        if (timer.id === id) {
          return { ...timer, isRunning: !timer.isRunning };
        }
        return timer;
      });
      saveTimers(newTimers);
      return { timers: newTimers };
    });
  },

  restartTimer: (id) => {
    set((state) => {
      const newTimers = state.timers.map((timer) => {
        if (timer.id === id) {
          return {
            ...timer,
            remainingTime: timer.duration,
            isRunning: false,
          };
        }
        return timer;
      });
      saveTimers(newTimers);
      return { timers: newTimers };
    });
  },
}));

// Export the store instance for direct access
export const store = useTimerStore;
