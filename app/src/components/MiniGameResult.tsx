import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Gem, ArrowRight } from 'lucide-react';
import type { Country } from '../data/countries';
import { encouragements } from '../data/countries';
import { useGameStore } from '../store/gameStore';
import { useAudio } from '../hooks/useAudio';

interface MiniGameResultProps {
  country: Country;
  onGetStamp: () => void;
}

export function MiniGameResult({ country, onGetStamp }: MiniGameResultProps) {
  const [showStars, setShowStars] = useState(0);
  const progress = useGameStore((s) => s.getCountryProgress(country.id));
  const stars = progress?.stars || 1;
  const gems = progress?.gemsEarned || country.gems;
  const { playSuccess } = useAudio();

  const message = encouragements[Math.floor(Math.random() * encouragements.length)];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= stars; i++) {
      timers.push(
        setTimeout(() => {
          setShowStars(i);
          playSuccess();
        }, i * 600)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [stars, playSuccess]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-purple-400/30 via-pink-400/30 to-blue-400/30">
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 8 + (i % 4) * 4,
              height: 8 + (i % 4) * 4,
              background: [country.color, '#FFB7B2', '#B5EAD7', '#A2D2FF', '#FFDAC1'][i % 5],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 0.5, 1],
              opacity: [0, 0.8, 0.4, 0.8],
              y: [0, -50, -100],
              x: [0, (Math.random() - 0.5) * 50],
            }}
            transition={{
              duration: 3,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        {/* Congratulations Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="text-center"
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            🎉
          </motion.div>
          <h1
            className="text-4xl sm:text-5xl font-black text-white"
            style={{
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            {message}
          </h1>
          <p className="text-white/80 text-lg mt-2 font-medium">
            You completed {country.name}! 🌍
          </p>
        </motion.div>

        {/* Stars */}
        <div className="flex gap-4">
          {[1, 2, 3].map((star) => (
            <motion.div
              key={star}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={
                showStars >= star
                  ? { opacity: 1, scale: 1, rotate: 0 }
                  : { opacity: 0.3, scale: 0.8, rotate: 0 }
              }
              transition={{ duration: 0.5, type: 'spring', delay: star * 0.2 }}
            >
              <Star
                className={`w-16 h-16 sm:w-20 sm:h-20 ${
                  showStars >= star
                    ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg'
                    : 'text-slate-300 fill-slate-300'
                }`}
                style={
                  showStars >= star
                    ? { filter: 'drop-shadow(0 0 10px rgba(250,204,21,0.6))' }
                    : {}
                }
              />
            </motion.div>
          ))}
        </div>

        {/* Reward Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-4 border-white/50 max-w-xs w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Gem className="w-6 h-6 text-purple-500" />
              <span className="font-bold text-slate-700">Gems Earned</span>
            </div>
            <motion.span
              className="text-2xl font-black text-purple-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2, type: 'spring' }}
            >
              +{gems}
            </motion.span>
          </div>
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{country.flag}</span>
              <div>
                <p className="font-bold text-slate-800">{country.name}</p>
                <p className="text-sm text-slate-500">
                  {country.continent} • {country.capital}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Get Stamp Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGetStamp}
          className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-black text-xl px-10 py-4 rounded-3xl shadow-xl border-4 border-white/50 flex items-center gap-3 hover:shadow-2xl transition-shadow"
        >
          <span className="text-2xl">🛂</span>
          Get My Stamp!
          <ArrowRight className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}
