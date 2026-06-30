import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Gamepad2,
  Globe,
  Star,
  Gem,
  TrendingUp,
  Calendar,
  Lock,
  Unlock,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { countries } from '../data/countries';
import { useGameStore } from '../store/gameStore';
import { useAudio } from '../hooks/useAudio';

interface ParentDashboardProps {
  onBack: () => void;
}

export function ParentDashboard({ onBack }: ParentDashboardProps) {
  const { playClick } = useAudio();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const store = useGameStore();
  const completedCountries = store.completedCountries;
  const gems = store.gems;
  const totalStars = store.totalStars;
  const unlockedIds = store.unlockedCountryIds;
  const dailyStreak = store.dailyLoginStreak;

  // Calculate stats
  const sessionDuration = Math.floor(
    (Date.now() - store.sessionStartTime) / 60000
  );
  const completionRate = Math.round(
    (completedCountries.length / countries.length) * 100
  );

  const favoriteCountryName = (() => {
    if (!store.favoriteCountry) return 'None yet';
    const c = countries.find((c) => c.id === store.favoriteCountry);
    return c ? `${c.flag} ${c.name}` : 'Unknown';
  })();

  const checkAccessCode = () => {
    if (accessCode === '1234') {
      setIsUnlocked(true);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-xl border-2 border-slate-100 max-w-sm w-full"
        >
          <div className="text-center mb-6">
            <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-slate-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">
              Parent Area
            </h2>
            <p className="text-slate-500 mt-2">
              Enter the access code to view progress data
            </p>
            <p className="text-slate-400 text-sm mt-1">Default: 1234</p>
          </div>

          <input
            type="password"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Enter code"
            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 text-center text-2xl font-bold tracking-widest text-slate-700 focus:outline-none focus:border-blue-400 transition-colors"
            maxLength={4}
            onKeyDown={(e) => e.key === 'Enter' && checkAccessCode()}
          />

          <button
            onClick={checkAccessCode}
            className="w-full mt-4 bg-slate-800 text-white font-bold py-3 rounded-2xl hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <Unlock className="w-5 h-5" />
            Unlock
          </button>

          <button
            onClick={() => {
              playClick();
              onBack();
            }}
            className="w-full mt-3 bg-slate-100 text-slate-600 font-bold py-3 rounded-2xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Game
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <button
          onClick={() => {
            playClick();
            onBack();
          }}
          className="bg-white rounded-2xl p-3 shadow-sm hover:scale-105 transition-transform border border-slate-200"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>

        <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          Learning Progress
        </h1>

        <div className="bg-white rounded-2xl px-3 py-2 shadow-sm border border-slate-200 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-bold text-slate-600">
            Day {dailyStreak}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-100 rounded-full p-2">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-slate-500">Session Time</span>
            </div>
            <p className="text-2xl font-black text-slate-800">
              {sessionDuration} min
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-100 rounded-full p-2">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-slate-500">Completion</span>
            </div>
            <p className="text-2xl font-black text-slate-800">
              {completionRate}%
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-yellow-100 rounded-full p-2">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-sm text-slate-500">Total Stars</span>
            </div>
            <p className="text-2xl font-black text-slate-800">{totalStars}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-purple-100 rounded-full p-2">
                <Gem className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-slate-500">Gems Collected</span>
            </div>
            <p className="text-2xl font-black text-slate-800">{gems}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-orange-100 rounded-full p-2">
                <BookOpen className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-sm text-slate-500">Facts Learned</span>
            </div>
            <p className="text-2xl font-black text-slate-800">
              {store.totalFactsLearned}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-pink-100 rounded-full p-2">
                <Gamepad2 className="w-5 h-5 text-pink-600" />
              </div>
              <span className="text-sm text-slate-500">Games Played</span>
            </div>
            <p className="text-2xl font-black text-slate-800">
              {store.totalGamesCompleted}
            </p>
          </motion.div>
        </div>

        {/* Favorite Country */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4"
        >
          <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Favorite Country
          </h3>
          <p className="text-lg font-black text-slate-800">
            {favoriteCountryName}
          </p>
        </motion.div>

        {/* Country Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4"
        >
          <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-500" />
            Country Progress
          </h3>
          <div className="space-y-2">
            {countries.map((country) => {
              const isCompleted = completedCountries.some(
                (cc) => cc.countryId === country.id
              );
              const progress = completedCountries.find(
                (cc) => cc.countryId === country.id
              );
              return (
                <div
                  key={country.id}
                  className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <span className="font-medium text-slate-700">
                      {country.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <>
                        <div className="flex">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${
                                s <= (progress?.stars || 1)
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded-full">
                          Done
                        </span>
                      </>
                    ) : unlockedIds.includes(country.id) ? (
                      <span className="text-xs text-blue-600 font-bold bg-blue-100 px-2 py-1 rounded-full">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded-full">
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Session Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4"
        >
          <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            This Session
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-sm text-slate-500">Countries Explored</p>
              <p className="text-xl font-black text-slate-800">
                {store.countriesExploredThisSession}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-sm text-slate-500">Games Played</p>
              <p className="text-xl font-black text-slate-800">
                {store.gamesPlayedThisSession}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-sm text-slate-500">Facts Learned</p>
              <p className="text-xl font-black text-slate-800">
                {store.factsLearnedThisSession}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-sm text-slate-500">Daily Streak</p>
              <p className="text-xl font-black text-slate-800">
                {dailyStreak} days
              </p>
            </div>
          </div>
        </motion.div>

        {/* Reset Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-8"
        >
          <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Danger Zone
          </h3>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset All Progress
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-red-600 font-medium text-center">
                Are you sure? This cannot be undone!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    useGameStore.getState().resetProgress();
                    setShowResetConfirm(false);
                  }}
                  className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
