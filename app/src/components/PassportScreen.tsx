import { motion } from 'framer-motion';
import { ArrowLeft, Star, Lock, Globe } from 'lucide-react';
import { countries } from '../data/countries';
import { useGameStore } from '../store/gameStore';
import { useAudio } from '../hooks/useAudio';

interface PassportScreenProps {
  onBack: () => void;
  onSelectCountry: (countryId: string) => void;
}

export function PassportScreen({ onBack, onSelectCountry }: PassportScreenProps) {
  const { playClick } = useAudio();
  const completedCountries = useGameStore((s) => s.completedCountries);
  const collectedStamps = useGameStore((s) => s.collectedStamps);
  const isCountryUnlocked = useGameStore((s) => s.isCountryUnlocked);
  const gems = useGameStore((s) => s.gems);
  const totalStars = useGameStore((s) => s.totalStars);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
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

      {/* Header */}
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
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="text-2xl">🛂</span>
            My Passport
          </h1>
        </div>

        <div className="flex gap-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg flex items-center gap-1 border-2 border-white/50">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-slate-700 text-sm">{totalStars}</span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 px-4 mb-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-white/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 rounded-full p-2">
                <span className="text-xl">💎</span>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Gems</p>
                <p className="text-xl font-black text-purple-600">{gems}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Countries</p>
                <p className="text-xl font-black text-green-600">
                  {completedCountries.length}/{countries.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 rounded-full p-2">
                <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Stars</p>
                <p className="text-xl font-black text-yellow-600">{totalStars}</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 bg-slate-100 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(completedCountries.length / countries.length) * 100}%`,
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Stamps Grid */}
      <div className="relative z-10 flex-1 overflow-auto px-4 pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {countries.map((country, index) => {
            const isCompleted = collectedStamps.includes(country.id);
            const isUnlocked = isCountryUnlocked(country.id);
            const progress = completedCountries.find(
              (cc) => cc.countryId === country.id
            );

            return (
              <motion.button
                key={country.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                onClick={() => {
                  if (isUnlocked) {
                    playClick();
                    onSelectCountry(country.id);
                  }
                }}
                disabled={!isUnlocked}
                className={`relative rounded-2xl p-4 shadow-md border-4 transition-all ${
                  isCompleted
                    ? 'bg-white border-opacity-100'
                    : isUnlocked
                    ? 'bg-white/70 border-white/50'
                    : 'bg-slate-100/50 border-slate-200/50'
                }`}
                style={{
                  borderColor: isCompleted ? country.color : undefined,
                }}
              >
                {isCompleted ? (
                  <>
                    {/* Stamp design */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={{ rotate: -10 }}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-dashed flex items-center justify-center mb-2"
                        style={{ borderColor: country.color }}
                      >
                        <span className="text-3xl sm:text-4xl">
                          {country.flag}
                        </span>
                      </motion.div>
                      <p className="font-bold text-slate-800 text-sm text-center">
                        {country.name}
                      </p>
                      <div className="flex gap-0.5 mt-1">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= (progress?.stars || 1)
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {/* Completed badge */}
                    <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                      <span className="text-xs">✅</span>
                    </div>
                  </>
                ) : isUnlocked ? (
                  <div className="flex flex-col items-center opacity-70">
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-dashed border-slate-300 flex items-center justify-center mb-2"
                    >
                      <span className="text-3xl sm:text-4xl">
                        {country.flag}
                      </span>
                    </div>
                    <p className="font-bold text-slate-600 text-sm text-center">
                      {country.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Tap to explore!</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center opacity-40">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-200 flex items-center justify-center mb-2">
                      <Lock className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="font-bold text-slate-400 text-sm text-center">
                      ???
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Locked</p>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
