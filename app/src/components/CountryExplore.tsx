import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Play, Lock, Star } from 'lucide-react';
import type { Country } from '../data/countries';
import { useGameStore } from '../store/gameStore';
import { useAudio } from '../hooks/useAudio';

interface CountryExploreProps {
  country: Country;
  onPlayMiniGame: () => void;
  onBack: () => void;
  showMascotMessage: (msg: string) => void;
}

export function CountryExplore({
  country,
  onPlayMiniGame,
  onBack,
  showMascotMessage,
}: CountryExploreProps) {
  const [discoveredFacts, setDiscoveredFacts] = useState<Set<string>>(new Set());
  const [activeFact, setActiveFact] = useState<string | null>(null);
  const [showFactPopup, setShowFactPopup] = useState(false);
  const { playClick, playSuccess } = useAudio();
  const isCompleted = useGameStore((s) => s.isCountryCompleted(country.id));

  const handleDiscoverFact = useCallback(
    (factId: string) => {
      if (discoveredFacts.has(factId)) {
        // Show the fact again
        const fact = country.facts.find((f) => f.id === factId);
        if (fact) {
          setActiveFact(fact.text);
          setShowFactPopup(true);
        }
        return;
      }

      playSuccess();
      const newDiscovered = new Set(discoveredFacts);
      newDiscovered.add(factId);
      setDiscoveredFacts(newDiscovered);

      const fact = country.facts.find((f) => f.id === factId);
      if (fact) {
        setActiveFact(fact.text);
        setShowFactPopup(true);
        useGameStore.getState().recordFactLearned();

        // Check if all facts discovered
        if (newDiscovered.size >= country.facts.length) {
          setTimeout(() => {
            showMascotMessage(
              'Great job! Now let\'s play a mini-game! 🎮'
            );
          }, 2000);
        } else {
          const remaining = country.facts.length - newDiscovered.size;
          showMascotMessage(
            `Amazing! ${remaining} more ${remaining === 1 ? 'fact' : 'facts'} to find!`
          );
        }
      }
    },
    [discoveredFacts, country, playSuccess, showMascotMessage]
  );

  const allFactsDiscovered = discoveredFacts.size >= country.facts.length;

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${country.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: country.color,
              left: `${10 + (i * 8) % 80}%`,
              top: `${20 + (i * 13) % 60}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.7, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Top HUD */}
      <div className="relative z-20 flex items-center justify-between p-4">
        <button
          onClick={() => {
            playClick();
            onBack();
          }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg hover:scale-105 transition-transform border-2 border-white/50"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border-2 border-white/50">
          <h2 className="text-lg font-bold text-slate-800">
            {country.flag} {country.name}
          </h2>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2 border-2 border-white/50">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <span className="font-bold text-slate-700">
            {discoveredFacts.size}/{country.facts.length}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        {/* Greeting Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl px-6 py-3 shadow-lg border-2 border-white/50 mb-6"
        >
          <p className="text-center text-slate-700 font-medium">
            People here say{' '}
            <span className="font-bold text-lg" style={{ color: country.color }}>
              "{country.greeting}"
            </span>{' '}
            which means Hello!
          </p>
        </motion.div>

        {/* Fact Orbs */}
        <div className="flex gap-6 sm:gap-10 mb-8">
          {country.facts.map((fact, index) => {
            const isDiscovered = discoveredFacts.has(fact.id);
            return (
              <motion.button
                key={fact.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.2, type: 'spring' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  playClick();
                  handleDiscoverFact(fact.id);
                }}
                className="relative group"
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-full blur-xl"
                  style={{ background: country.color }}
                  animate={{
                    opacity: isDiscovered ? [0.2, 0.4, 0.2] : [0.4, 0.8, 0.4],
                    scale: isDiscovered ? 1 : [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                />

                {/* Orb */}
                <div
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-3xl sm:text-4xl shadow-xl border-4 transition-all duration-300 ${
                    isDiscovered
                      ? 'bg-white/90 border-green-400'
                      : 'bg-white/80 border-white/50'
                  }`}
                >
                  {isDiscovered ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      ✅
                    </motion.span>
                  ) : (
                    <span className="animate-pulse">{fact.icon}</span>
                  )}
                </div>

                {/* Label */}
                <p
                  className={`mt-2 text-center text-xs sm:text-sm font-bold transition-colors ${
                    isDiscovered ? 'text-green-600' : 'text-white'
                  }`}
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
                >
                  {isDiscovered ? 'Learned!' : 'Tap me!'}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Mini Game Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: allFactsDiscovered || isCompleted ? 0 : 20 }}
          transition={{ delay: 0.8 }}
        >
          {allFactsDiscovered || isCompleted ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playClick();
                onPlayMiniGame();
              }}
              className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl px-10 py-4 rounded-3xl shadow-xl border-4 border-white/50 flex items-center gap-3 hover:shadow-2xl transition-shadow"
            >
              <Play className="w-6 h-6 fill-current" />
              Play Mini-Game!
              <Star className="w-6 h-6 fill-yellow-300 text-yellow-300" />
            </motion.button>
          ) : (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 flex items-center gap-2 text-slate-500">
              <Lock className="w-5 h-5" />
              <span className="font-medium">Discover all facts to unlock the game!</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Fact Popup */}
      <AnimatePresence>
        {showFactPopup && activeFact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setShowFactPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-white/50 max-w-sm mx-4"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="text-6xl mb-4"
                >
                  💡
                </motion.div>
                <h3
                  className="text-2xl font-black mb-3"
                  style={{ color: country.color }}
                >
                  Did You Know?
                </h3>
                <p className="text-slate-700 text-lg font-medium leading-relaxed">
                  {activeFact}
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFactPopup(false)}
                  className="mt-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-8 py-3 rounded-2xl transition-colors"
                >
                  Awesome! ✨
                </motion.button>
              </div>

              {/* Confetti */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-sm"
                    style={{
                      background: [country.color, '#FFB7B2', '#B5EAD7', '#A2D2FF'][
                        i % 4
                      ],
                      left: `${10 + (i * 8) % 80}%`,
                      top: '50%',
                    }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1, 0.5],
                      opacity: [1, 1, 0],
                      x: (Math.random() - 0.5) * 200,
                      y: -100 - Math.random() * 100,
                      rotate: Math.random() * 360,
                    }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="relative z-20 p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-full h-4 shadow-inner border-2 border-white/50 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: country.color }}
            initial={{ width: 0 }}
            animate={{
              width: `${(discoveredFacts.size / country.facts.length) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <p className="text-center text-white text-sm font-medium mt-1" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
          {discoveredFacts.size === country.facts.length
            ? 'All facts discovered! 🎉'
            : `Discover ${country.facts.length - discoveredFacts.size} more ${country.facts.length - discoveredFacts.size === 1 ? 'fact' : 'facts'}!`}
        </p>
      </div>
    </div>
  );
}
