import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { countries } from '../data/countries';

export type GameScreen =
  | 'title'
  | 'globe'
  | 'country-intro'
  | 'country-explore'
  | 'minigame-select'
  | 'minigame-play'
  | 'minigame-result'
  | 'passport-stamp'
  | 'passport'
  | 'parent-dashboard'
  | 'settings';

export interface CompletedCountry {
  countryId: string;
  completedAt: string;
  stars: number;
  gemsEarned: number;
  factsLearned: string[];
}

export interface GameState {
  // Navigation
  currentScreen: GameScreen;
  previousScreen: GameScreen | null;
  selectedCountryId: string | null;
  selectedMiniGame: string | null;

  // Player Progress
  gems: number;
  totalStars: number;
  completedCountries: CompletedCountry[];
  unlockedCountryIds: string[];
  collectedStamps: string[];
  dailyLoginStreak: number;
  lastLoginDate: string | null;

  // Settings
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficulty: 'easy' | 'normal';
  narrationEnabled: boolean;

  // Session Stats
  sessionStartTime: number;
  factsLearnedThisSession: number;
  gamesPlayedThisSession: number;
  countriesExploredThisSession: number;

  // Parent Dashboard Data
  totalPlayTime: number;
  totalFactsLearned: number;
  totalGamesCompleted: number;
  favoriteCountry: string | null;
  lastPlayed: string | null;

  // Actions
  setScreen: (screen: GameScreen) => void;
  goBack: () => void;
  selectCountry: (countryId: string) => void;
  completeCountry: (countryId: string, stars: number, factsLearned: string[]) => void;
  addGems: (amount: number) => void;
  addStars: (amount: number) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  setDifficulty: (diff: 'easy' | 'normal') => void;
  toggleNarration: () => void;
  recordGamePlayed: () => void;
  recordFactLearned: () => void;
  checkDailyLogin: () => void;
  resetProgress: () => void;
  unlockAllCountries: () => void;
  getCountryProgress: (countryId: string) => CompletedCountry | undefined;
  isCountryUnlocked: (countryId: string) => boolean;
  isCountryCompleted: (countryId: string) => boolean;
}

const initialState = {
  currentScreen: 'title' as GameScreen,
  previousScreen: null as GameScreen | null,
  selectedCountryId: null as string | null,
  selectedMiniGame: null as string | null,

  gems: 0,
  totalStars: 0,
  completedCountries: [] as CompletedCountry[],
  unlockedCountryIds: ['france'],
  collectedStamps: [] as string[],
  dailyLoginStreak: 0,
  lastLoginDate: null as string | null,

  soundEnabled: true,
  musicEnabled: true,
  difficulty: 'easy' as 'easy' | 'normal',
  narrationEnabled: true,

  sessionStartTime: Date.now(),
  factsLearnedThisSession: 0,
  gamesPlayedThisSession: 0,
  countriesExploredThisSession: 0,

  totalPlayTime: 0,
  totalFactsLearned: 0,
  totalGamesCompleted: 0,
  favoriteCountry: null as string | null,
  lastPlayed: null as string | null,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setScreen: (screen) =>
        set((state) => ({
          previousScreen: state.currentScreen,
          currentScreen: screen,
        })),

      goBack: () =>
        set((state) => ({
          currentScreen: state.previousScreen ?? 'globe',
          previousScreen: null,
        })),

      selectCountry: (countryId) =>
        set({
          selectedCountryId: countryId,
          countriesExploredThisSession: get().countriesExploredThisSession + 1,
        }),

      completeCountry: (countryId, stars, factsLearned) => {
        const state = get();
        const country = countries.find((c) => c.id === countryId);
        if (!country) return;

        const isAlreadyCompleted = state.completedCountries.some(
          (cc) => cc.countryId === countryId
        );

        const newCompleted: CompletedCountry = {
          countryId,
          completedAt: new Date().toISOString(),
          stars,
          gemsEarned: country.gems,
          factsLearned,
        };

        const newCompletedCountries = isAlreadyCompleted
          ? state.completedCountries.map((cc) =>
              cc.countryId === countryId ? newCompleted : cc
            )
          : [...state.completedCountries, newCompleted];

        const currentIndex = countries.findIndex((c) => c.id === countryId);
        const nextCountry = countries[currentIndex + 1];
        const newUnlocked = nextCountry
          ? [...new Set([...state.unlockedCountryIds, nextCountry.id])]
          : state.unlockedCountryIds;

        set({
          completedCountries: newCompletedCountries,
          gems: state.gems + country.gems,
          totalStars: state.totalStars + stars,
          collectedStamps: [...new Set([...state.collectedStamps, countryId])],
          unlockedCountryIds: newUnlocked,
          totalFactsLearned: state.totalFactsLearned + factsLearned.length,
          totalGamesCompleted: state.totalGamesCompleted + 1,
          favoriteCountry: countryId,
          lastPlayed: new Date().toISOString(),
        });
      },

      addGems: (amount) => set((state) => ({ gems: state.gems + amount })),

      addStars: (amount) => set((state) => ({ totalStars: state.totalStars + amount })),

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),

      setDifficulty: (diff) => set({ difficulty: diff }),

      toggleNarration: () => set((state) => ({ narrationEnabled: !state.narrationEnabled })),

      recordGamePlayed: () =>
        set((state) => ({
          gamesPlayedThisSession: state.gamesPlayedThisSession + 1,
        })),

      recordFactLearned: () =>
        set((state) => ({
          factsLearnedThisSession: state.factsLearnedThisSession + 1,
        })),

      checkDailyLogin: () => {
        const today = new Date().toDateString();
        const state = get();

        if (state.lastLoginDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const isConsecutive = state.lastLoginDate === yesterday.toDateString();
        const newStreak = isConsecutive ? state.dailyLoginStreak + 1 : 1;

        set({
          lastLoginDate: today,
          dailyLoginStreak: newStreak,
          gems: state.gems + Math.min(newStreak * 5, 50),
        });
      },

      resetProgress: () =>
        set({
          ...initialState,
          sessionStartTime: Date.now(),
        }),

      unlockAllCountries: () =>
        set({
          unlockedCountryIds: countries.map((c) => c.id),
        }),

      getCountryProgress: (countryId) =>
        get().completedCountries.find((cc) => cc.countryId === countryId),

      isCountryUnlocked: (countryId) =>
        get().unlockedCountryIds.includes(countryId),

      isCountryCompleted: (countryId) =>
        get().completedCountries.some((cc) => cc.countryId === countryId),
    }),
    {
      name: 'little-explorer-save',
      partialize: (state) => ({
        gems: state.gems,
        totalStars: state.totalStars,
        completedCountries: state.completedCountries,
        unlockedCountryIds: state.unlockedCountryIds,
        collectedStamps: state.collectedStamps,
        dailyLoginStreak: state.dailyLoginStreak,
        lastLoginDate: state.lastLoginDate,
        soundEnabled: state.soundEnabled,
        musicEnabled: state.musicEnabled,
        difficulty: state.difficulty,
        narrationEnabled: state.narrationEnabled,
        totalPlayTime: state.totalPlayTime,
        totalFactsLearned: state.totalFactsLearned,
        totalGamesCompleted: state.totalGamesCompleted,
        favoriteCountry: state.favoriteCountry,
        lastPlayed: state.lastPlayed,
      }),
    }
  )
);
