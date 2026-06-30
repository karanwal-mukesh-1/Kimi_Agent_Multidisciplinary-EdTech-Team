import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Clock, Trophy } from 'lucide-react';
import type { Country } from '../data/countries';
import { encouragements } from '../data/countries';
import { useAudio } from '../hooks/useAudio';

interface MiniGameScreenProps {
  country: Country;
  onComplete: (stars: number, factsLearned: string[]) => void;
  onBack: () => void;
}

// ===== FLAG MATCH GAME =====
function FlagMatchGame({
  country,
  onComplete,
}: {
  country: Country;
  onComplete: (stars: number) => void;
}) {
  const pairs = country.miniGame.pairs || [];
  const [cards] = useState(
    [...pairs].sort(() => Math.random() - 0.5)
  );
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [shakeCard, setShakeCard] = useState<number | null>(null);
  const { playClick, playSuccess } = useAudio();

  const handleCardClick = useCallback(
    (index: number) => {
      if (flipped.length >= 2) return;
      if (flipped.includes(index)) return;
      if (matched.has(cards[index].id)) return;

      playClick();
      const newFlipped = [...flipped, index];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setMoves((m) => m + 1);
        const [first, second] = newFlipped;

        if (cards[first].flag === cards[second].flag) {
          // Match!
          setTimeout(() => {
            playSuccess();
            setMatched((prev) => new Set([...prev, cards[first].id, cards[second].id]));
            setFlipped([]);

            // Check win
            const newMatched = new Set([...matched, cards[first].id, cards[second].id]);
            if (newMatched.size === cards.length) {
              const stars = mistakes <= 2 ? 3 : mistakes <= 4 ? 2 : 1;
              setTimeout(() => onComplete(stars), 800);
            }
          }, 600);
        } else {
          // No match
          setMistakes((m) => m + 1);
          setShakeCard(index);
          setTimeout(() => {
            setShakeCard(null);
            setFlipped([]);
          }, 1000);
        }
      }
    },
    [flipped, cards, matched, mistakes, playClick, playSuccess, onComplete]
  );

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="bg-white/80 rounded-full px-4 py-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span className="font-bold text-slate-700">{moves} moves</span>
        </div>
        <div className="bg-white/80 rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-red-500 font-bold">{mistakes} mistakes</span>
        </div>
      </div>

      <div
        className={`grid gap-3 ${
          cards.length <= 4 ? 'grid-cols-2' : cards.length <= 6 ? 'grid-cols-3' : 'grid-cols-4'
        }`}
      >
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index);
          const isMatched = matched.has(card.id);
          const isShaking = shakeCard === index;

          return (
            <motion.button
              key={`${card.id}-${index}`}
              whileHover={!isMatched ? { scale: 1.05 } : {}}
              whileTap={!isMatched ? { scale: 0.95 } : {}}
              onClick={() => handleCardClick(index)}
              className={`relative w-24 h-32 sm:w-28 sm:h-36 rounded-2xl shadow-lg border-4 transition-all ${
                isMatched
                  ? 'bg-green-100 border-green-400 opacity-60'
                  : isFlipped
                  ? 'bg-white border-blue-400'
                  : 'bg-gradient-to-br from-purple-400 to-pink-400 border-white/50 hover:shadow-xl'
              }`}
              animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              {isFlipped || isMatched ? (
                <motion.div
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  className="flex flex-col items-center justify-center h-full"
                >
                  <span className="text-4xl">{card.flag}</span>
                  <span className="text-xs font-bold text-slate-600 mt-1">
                    {card.name}
                  </span>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-4xl">❓</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <p className="text-white text-center font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
        Find all the matching flag pairs! 🚩
      </p>
    </div>
  );
}

// ===== SORT FOOD GAME =====
function SortFoodGame({
  country,
  onComplete,
}: {
  country: Country;
  onComplete: (stars: number) => void;
}) {
  const foods = useMemo(
    () => [...(country.miniGame.foods || [])].sort(() => Math.random() - 0.5),
    [country.miniGame.foods]
  );
  const [remainingFoods, setRemainingFoods] = useState(foods);
  const [sorted, setSorted] = useState<{ local: typeof foods; other: typeof foods }>({
    local: [],
    other: [],
  });
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const { playClick, playSuccess } = useAudio();

  const handleDrop = useCallback(
    (foodId: string, basket: 'local' | 'other') => {
      playClick();
      const food = remainingFoods.find((f) => f.id === foodId);
      if (!food) return;

      const isCorrect = basket === (food.isLocal ? 'local' : 'other');

      if (isCorrect) {
        playSuccess();
        setScore((s) => s + 1);
        setFeedback('correct');
        setSorted((prev) => ({
          ...prev,
          [basket]: [...prev[basket], food],
        }));
        setRemainingFoods((prev) => prev.filter((f) => f.id !== foodId));

        if (score + 1 >= foods.length) {
          const stars = mistakes <= 1 ? 3 : mistakes <= 2 ? 2 : 1;
          setTimeout(() => onComplete(stars), 500);
        }
      } else {
        setMistakes((m) => m + 1);
        setFeedback('wrong');
      }

      setTimeout(() => setFeedback(null), 800);
    },
    [remainingFoods, score, mistakes, foods.length, playClick, playSuccess, onComplete]
  );

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Score */}
      <div className="bg-white/80 rounded-full px-6 py-2 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-bold text-slate-700">
            {score}/{foods.length}
          </span>
        </div>
        <div className="w-px h-6 bg-slate-300" />
        <span className="text-red-500 font-bold text-sm">
          {mistakes} wrong
        </span>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`text-2xl font-black ${
              feedback === 'correct' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {feedback === 'correct'
              ? encouragements[Math.floor(Math.random() * encouragements.length)]
              : 'Try the other basket!'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remaining Foods */}
      <div className="flex flex-wrap justify-center gap-3 min-h-[80px]">
        <AnimatePresence>
          {remainingFoods.map((food) => (
            <motion.div
              key={food.id}
              layout
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="bg-white rounded-2xl p-3 shadow-lg border-2 border-white/50 text-4xl cursor-grab hover:scale-110 transition-transform"
            >
              {food.image}
              <p className="text-xs font-bold text-slate-600 text-center mt-1">
                {food.name}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Baskets */}
      <div className="flex gap-4 sm:gap-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (remainingFoods.length > 0) {
              handleDrop(remainingFoods[0].id, 'local');
            }
          }}
          className="bg-green-100 hover:bg-green-200 rounded-3xl p-6 shadow-lg border-4 border-green-300 w-36 sm:w-44 transition-colors"
        >
          <div className="text-4xl mb-2">🧺</div>
          <p className="font-bold text-green-800 text-sm">
            {country.name} Food
          </p>
          <div className="flex flex-wrap gap-1 mt-2 justify-center min-h-[40px]">
            {sorted.local.map((f) => (
              <span key={f.id} className="text-xl">
                {f.image}
              </span>
            ))}
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (remainingFoods.length > 0) {
              handleDrop(remainingFoods[0].id, 'other');
            }
          }}
          className="bg-orange-100 hover:bg-orange-200 rounded-3xl p-6 shadow-lg border-4 border-orange-300 w-36 sm:w-44 transition-colors"
        >
          <div className="text-4xl mb-2">🌍</div>
          <p className="font-bold text-orange-800 text-sm">
            Other Food
          </p>
          <div className="flex flex-wrap gap-1 mt-2 justify-center min-h-[40px]">
            {sorted.other.map((f) => (
              <span key={f.id} className="text-xl">
                {f.image}
              </span>
            ))}
          </div>
        </motion.button>
      </div>

      <p className="text-white text-center font-medium text-sm" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
        Tap a food, then tap the right basket! 🍽️
      </p>
    </div>
  );
}

// ===== GREETING MATCH GAME =====
function GreetingMatchGame({
  country,
  onComplete,
}: {
  country: Country;
  onComplete: (stars: number) => void;
}) {
  const greeting = country.miniGame.greeting;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { playClick, playSuccess } = useAudio();

  if (!greeting) return null;

  const handleSelect = useCallback(
    (option: string) => {
      playClick();
      setSelectedOption(option);
      const correct = option === greeting.correct;
      setIsCorrect(correct);
      setShowResult(true);

      if (correct) {
        playSuccess();
        setTimeout(() => onComplete(3), 1500);
      }
    },
    [greeting, playClick, playSuccess, onComplete]
  );

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Greeting Display */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-4 border-white/50 text-center"
      >
        <p className="text-slate-500 font-medium mb-2">People in {country.name} say:</p>
        <motion.p
          className="text-5xl font-black"
          style={{ color: country.color }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          "{greeting.text}"
        </motion.p>
        <div className="mt-4 flex justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-slate-300"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </div>
      </motion.div>

      {/* Question */}
      <p className="text-white text-xl font-bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
        What does this mean? 🤔
      </p>

      {/* Options */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {greeting.options.map((option, index) => (
          <motion.button
            key={option}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !showResult && handleSelect(option)}
            disabled={showResult}
            className={`py-4 px-6 rounded-2xl font-bold text-lg shadow-lg border-4 transition-all ${
              showResult && option === greeting.correct
                ? 'bg-green-100 border-green-400 text-green-800'
                : showResult && option === selectedOption && !isCorrect
                ? 'bg-red-100 border-red-400 text-red-800'
                : 'bg-white/90 border-white/50 text-slate-700 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              {showResult && option === greeting.correct && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-2xl"
                >
                  ✅
                </motion.span>
              )}
              {showResult && option === selectedOption && !isCorrect && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-2xl"
                >
                  ❌
                </motion.span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Result */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-2xl font-black ${isCorrect ? 'text-green-400' : 'text-red-400'}`}
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
          >
            {isCorrect ? '🎉 Correct! Amazing!' : 'Try again!'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ===== MAIN MINI GAME SCREEN =====
export function MiniGameScreen({ country, onComplete, onBack }: MiniGameScreenProps) {
  const { playClick } = useAudio();
  const [gameType] = useState(country.miniGame.type);

  const handleComplete = useCallback(
    (stars: number) => {
      const factsLearned = country.facts.map((f) => f.id);
      onComplete(stars, factsLearned);
    },
    [country, onComplete]
  );

  const gameTitle =
    gameType === 'flag-match'
      ? 'Flag Match'
      : gameType === 'sort-food'
      ? 'Sort the Food'
      : 'Greeting Match';

  const gameIcon =
    gameType === 'flag-match' ? '🚩' : gameType === 'sort-food' ? '🍽️' : '👋';

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Background with country theme */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${country.image})` }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${country.color}40, ${country.color}20)` }}
      />

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
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="text-2xl">{gameIcon}</span>
            {gameTitle}
          </h2>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2 border-2 border-white/50">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-slate-700">Win up to 3!</span>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 overflow-auto">
        <div className="w-full max-w-lg">
          {gameType === 'flag-match' && (
            <FlagMatchGame country={country} onComplete={handleComplete} />
          )}
          {gameType === 'sort-food' && (
            <SortFoodGame country={country} onComplete={handleComplete} />
          )}
          {gameType === 'greeting-match' && (
            <GreetingMatchGame country={country} onComplete={handleComplete} />
          )}
        </div>
      </div>
    </div>
  );
}
