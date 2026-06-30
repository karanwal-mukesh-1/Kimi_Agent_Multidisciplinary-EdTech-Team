import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Play } from 'lucide-react';
import type { Country } from '../data/countries';
import { useGameStore } from '../store/gameStore';

interface CountryIntroProps {
  country: Country;
  onExplore: () => void;
  onBack: () => void;
}

export function CountryIntro({ country, onExplore, onBack }: CountryIntroProps) {
  const isCompleted = useGameStore((s) => s.isCountryCompleted(country.id));
  const progress = useGameStore((s) => s.getCountryProgress(country.id));

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: `url(${country.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg hover:scale-105 transition-transform border-2 border-white/50"
        onClick={onBack}
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6 text-slate-700" />
      </motion.button>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-4 max-w-lg">
        {/* Flag */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-8xl drop-shadow-2xl"
        >
          {country.flag}
        </motion.div>

        {/* Country Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl sm:text-6xl font-black text-white text-center"
          style={{
            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          {country.name}
        </motion.h1>

        {/* Info Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">{country.continent}</span>
          </div>
          <div className="w-px h-6 bg-white/40" />
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <span className="text-white font-semibold">{country.landmark}</span>
          </div>
        </motion.div>

        {/* Quick Facts Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-white/50 w-full max-w-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{country.animal}</span>
            <p className="text-slate-600 font-medium">
              Capital: <span className="font-bold text-slate-800">{country.capital}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">👋</span>
            <p className="text-slate-600 font-medium">
              They say: <span className="font-bold text-slate-800">"{country.greeting}"</span>
            </p>
          </div>
          {isCompleted && progress && (
            <div className="mt-3 flex items-center gap-2 pt-3 border-t border-slate-200">
              <div className="flex">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${
                      s <= progress.stars
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-500">Completed!</span>
            </div>
          )}
        </motion.div>

        {/* Explore Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExplore}
          className="mt-4 bg-white text-slate-800 font-black text-xl px-10 py-4 rounded-3xl shadow-xl border-4 border-white/50 flex items-center gap-3 hover:shadow-2xl transition-shadow"
        >
          <Play className="w-6 h-6 fill-current" />
          {isCompleted ? 'Explore Again!' : 'Start Exploring!'}
        </motion.button>

        {/* Gem Reward */}
        {!isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-2 bg-purple-100/80 backdrop-blur-sm rounded-full px-4 py-2"
          >
            <span className="text-xl">💎</span>
            <span className="text-purple-700 font-bold">+{country.gems} Gems</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
