import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Gem, MapPin } from 'lucide-react';
import type { Country } from '../data/countries';
import { useGameStore } from '../store/gameStore';
import { useAudio } from '../hooks/useAudio';

interface PassportStampProps {
  country: Country;
  onContinue: () => void;
}

export function PassportStamp({ country, onContinue }: PassportStampProps) {
  const progress = useGameStore((s) => s.getCountryProgress(country.id));
  const { playStamp } = useAudio();

  useEffect(() => {
    const timer = setTimeout(() => {
      playStamp();
    }, 500);
    return () => clearTimeout(timer);
  }, [playStamp]);

  const nextCountry = (() => {
    const allCountries = [
      'france', 'egypt', 'japan', 'brazil', 'italy',
      'australia', 'usa', 'india', 'mexico', 'kenya'
    ];
    const currentIndex = allCountries.indexOf(country.id);
    return allCountries[currentIndex + 1] || null;
  })();

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Paper texture */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              #000 2px,
              #000 4px
            )`,
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-4 max-w-md w-full">
        {/* Passport Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1
            className="text-3xl sm:text-4xl font-black text-slate-800"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            🛂 My Passport
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {useGameStore.getState().collectedStamps.length} countries visited!
          </p>
        </motion.div>

        {/* Stamp Animation */}
        <motion.div
          initial={{ scale: 3, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            duration: 0.6,
            type: 'spring',
            damping: 10,
          }}
          className="relative"
        >
          {/* Stamp Container */}
          <div
            className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-8 border-dashed flex flex-col items-center justify-center shadow-2xl"
            style={{
              borderColor: country.color,
              background: `linear-gradient(135deg, ${country.color}20, ${country.color}10)`,
            }}
          >
            <motion.span
              className="text-5xl sm:text-6xl mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              {country.flag}
            </motion.span>
            <motion.p
              className="font-black text-slate-800 text-lg text-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {country.name}
            </motion.p>
            <motion.div
              className="flex gap-1 mt-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    s <= (progress?.stars || 1)
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </motion.div>
          </div>

          {/* Stamp impact effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: country.color }}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />

          {/* Confetti */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                background: [country.color, '#FFB7B2', '#B5EAD7', '#A2D2FF'][i % 4],
                left: '50%',
                top: '50%',
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0.5],
                x: (Math.random() - 0.5) * 300,
                y: (Math.random() - 0.5) * 300,
                rotate: Math.random() * 720,
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 1, delay: 0.3 + i * 0.05 }}
            />
          ))}
        </motion.div>

        {/* Stamp Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white rounded-2xl p-4 shadow-lg border-2 border-slate-100 w-full"
        >
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-slate-400" />
            <span className="text-slate-600 font-medium">
              Visited on {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Gem className="w-5 h-5 text-purple-500" />
            <span className="text-slate-600 font-medium">
              Earned {progress?.gemsEarned || country.gems} gems
            </span>
          </div>
        </motion.div>

        {/* Next Country Hint */}
        {nextCountry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center"
          >
            <p className="text-slate-500 font-medium">
              Where will you go next? 🗺️
            </p>
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="bg-slate-800 text-white font-bold text-lg px-10 py-4 rounded-3xl shadow-xl flex items-center gap-3 hover:bg-slate-700 transition-colors"
        >
          Continue Exploring!
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
