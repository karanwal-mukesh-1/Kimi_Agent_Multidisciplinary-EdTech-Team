import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Music,
  Type,
  User,
  Lock,
  Info,
  Heart,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useAudio } from '../hooks/useAudio';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const {
    soundEnabled,
    musicEnabled,
    narrationEnabled,
    difficulty,
    toggleSound,
    toggleMusic,
    toggleNarration,
    setDifficulty,
  } = useGameStore();

  const { playClick } = useAudio();

  const handleOpenParentDashboard = () => {
    playClick();
    useGameStore.getState().setScreen('parent-dashboard');
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-sky-50 to-blue-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sky-100">
        <button
          onClick={() => {
            playClick();
            onBack();
          }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-sm hover:scale-105 transition-transform border-2 border-white/50"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>

        <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          Settings
        </h1>

        <div className="w-12" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Audio Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-5 shadow-md border-2 border-slate-100 mb-4"
        >
          <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-blue-500" />
            Audio
          </h2>

          <div className="space-y-3">
            {/* Sound Effects */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-green-500" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-400" />
                )}
                <span className="font-medium text-slate-700">
                  Sound Effects
                </span>
              </div>
              <button
                onClick={() => {
                  playClick();
                  toggleSound();
                }}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  soundEnabled ? 'bg-green-400' : 'bg-slate-300'
                }`}
                aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'}
              >
                <motion.div
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ left: soundEnabled ? 28 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Music */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Music
                  className={`w-5 h-5 ${
                    musicEnabled ? 'text-green-500' : 'text-slate-400'
                  }`}
                />
                <span className="font-medium text-slate-700">
                  Background Music
                </span>
              </div>
              <button
                onClick={() => {
                  playClick();
                  toggleMusic();
                }}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  musicEnabled ? 'bg-green-400' : 'bg-slate-300'
                }`}
                aria-label={musicEnabled ? 'Disable music' : 'Enable music'}
              >
                <motion.div
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ left: musicEnabled ? 28 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Narration */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Type
                  className={`w-5 h-5 ${
                    narrationEnabled ? 'text-green-500' : 'text-slate-400'
                  }`}
                />
                <span className="font-medium text-slate-700">
                  Voice Narration
                </span>
              </div>
              <button
                onClick={() => {
                  playClick();
                  toggleNarration();
                }}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  narrationEnabled ? 'bg-green-400' : 'bg-slate-300'
                }`}
                aria-label={
                  narrationEnabled ? 'Disable narration' : 'Enable narration'
                }
              >
                <motion.div
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ left: narrationEnabled ? 28 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Difficulty Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-5 shadow-md border-2 border-slate-100 mb-4"
        >
          <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span className="text-xl">🎮</span>
            Difficulty
          </h2>

          <div className="flex gap-3">
            <button
              onClick={() => {
                playClick();
                setDifficulty('easy');
              }}
              className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${
                difficulty === 'easy'
                  ? 'bg-green-100 border-2 border-green-400 text-green-700'
                  : 'bg-slate-50 border-2 border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <span className="text-2xl block mb-1">😊</span>
              Easy
            </button>
            <button
              onClick={() => {
                playClick();
                setDifficulty('normal');
              }}
              className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${
                difficulty === 'normal'
                  ? 'bg-blue-100 border-2 border-blue-400 text-blue-700'
                  : 'bg-slate-50 border-2 border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <span className="text-2xl block mb-1">🤓</span>
              Normal
            </button>
          </div>
        </motion.div>

        {/* Parent Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-5 shadow-md border-2 border-slate-100 mb-4"
        >
          <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-500" />
            Parents
          </h2>

          <button
            onClick={handleOpenParentDashboard}
            className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-3 border-2 border-purple-200"
          >
            <Lock className="w-5 h-5" />
            Parent Dashboard
          </button>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-5 shadow-md border-2 border-slate-100 mb-4"
        >
          <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-slate-500" />
            About
          </h2>

          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌍</span>
              <div>
                <p className="font-bold text-slate-700">Little Explorer</p>
                <p>Version 1.0.0</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <p className="font-bold text-slate-700">Educational Geography Game</p>
                <p>For children ages 5-8</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-400" />
              <div>
                <p className="font-bold text-slate-700">Made with love</p>
                <p>Safe, ad-free learning</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
