import { useEffect, useState, useCallback } from 'react';
import { useGameStore } from './store/gameStore';
import { useAudio } from './hooks/useAudio';
import { countries } from './data/countries';
import { GlobeScene } from './components/GlobeScene';
import { TitleScreen } from './components/TitleScreen';
import { CountryIntro } from './components/CountryIntro';
import { CountryExplore } from './components/CountryExplore';
import { MiniGameScreen } from './components/MiniGameScreen';
import { MiniGameResult } from './components/MiniGameResult';
import { PassportStamp } from './components/PassportStamp';
import { PassportScreen } from './components/PassportScreen';
import { MascotGuide } from './components/MascotGuide';
import { ParentDashboard } from './components/ParentDashboard';
import { SettingsScreen } from './components/SettingsScreen';
import { Star, Volume2, VolumeX, Gem, Home } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

function App() {
  const {
    currentScreen,
    selectedCountryId,
    gems,
    totalStars,
    checkDailyLogin,
    setScreen,
    soundEnabled,
    toggleSound,
  } = useGameStore();

  const { playClick, playTransition } = useAudio();
  const [showMascot, setShowMascot] = useState(true);
  const [mascotMessage, setMascotMessage] = useState('');
  const [, setTransitionColor] = useState('#FFB7B2');

  useEffect(() => {
    checkDailyLogin();
  }, [checkDailyLogin]);

  const selectedCountry = countries.find((c) => c.id === selectedCountryId);

  const handleNavigate = useCallback(
    (screen: Parameters<typeof setScreen>[0]) => {
      playClick();
      if (screen === 'country-intro' && selectedCountry) {
        setTransitionColor(selectedCountry.color);
        playTransition();
      }
      setScreen(screen);
    },
    [playClick, playTransition, selectedCountry, setScreen]
  );

  const showMascotMessage = useCallback(
    (msg: string) => {
      setMascotMessage(msg);
      setShowMascot(true);
      setTimeout(() => setMascotMessage(''), 4000);
    },
    []
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-sky-200 to-blue-100">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-yellow-200/20 rounded-full blur-2xl animate-pulse delay-700" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-200/20 rounded-full blur-xl animate-pulse delay-1000" />
      </div>

      {/* Screen Content */}
      <AnimatePresence mode="wait">
        {currentScreen === 'title' && (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <TitleScreen onPlay={() => handleNavigate('globe')} />
          </motion.div>
        )}

        {currentScreen === 'globe' && (
          <motion.div
            key="globe"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="absolute inset-0"
          >
            <GlobeScene
              onSelectCountry={(countryId) => {
                useGameStore.getState().selectCountry(countryId);
                handleNavigate('country-intro');
              }}
            />
            {/* HUD */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
              <button
                onClick={() => {
                  playClick();
                  setScreen('passport');
                }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2 hover:scale-105 transition-transform border-2 border-white/50"
                aria-label="Open Passport"
              >
                <span className="text-2xl">🛂</span>
                <span className="text-sm font-bold text-slate-700 hidden sm:inline">
                  Passport
                </span>
              </button>

              <div className="flex items-center gap-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2 border-2 border-white/50">
                  <Gem className="w-5 h-5 text-purple-500" />
                  <span className="font-bold text-slate-700">{gems}</span>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2 border-2 border-white/50">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-slate-700">{totalStars}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  playClick();
                  setScreen('settings');
                }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2 hover:scale-105 transition-transform border-2 border-white/50"
                aria-label="Settings"
              >
                <span className="text-2xl">⚙️</span>
              </button>
            </div>
          </motion.div>
        )}

        {currentScreen === 'country-intro' && selectedCountry && (
          <motion.div
            key={`intro-${selectedCountry.id}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="absolute inset-0"
          >
            <CountryIntro
              country={selectedCountry}
              onExplore={() => handleNavigate('country-explore')}
              onBack={() => handleNavigate('globe')}
            />
          </motion.div>
        )}

        {currentScreen === 'country-explore' && selectedCountry && (
          <motion.div
            key={`explore-${selectedCountry.id}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <CountryExplore
              country={selectedCountry}
              onPlayMiniGame={() => handleNavigate('minigame-play')}
              onBack={() => handleNavigate('globe')}
              showMascotMessage={showMascotMessage}
            />
          </motion.div>
        )}

        {currentScreen === 'minigame-play' && selectedCountry && (
          <motion.div
            key={`minigame-${selectedCountry.id}`}
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <MiniGameScreen
              country={selectedCountry}
              onComplete={(stars: number, factsLearned: string[]) => {
                useGameStore.getState().completeCountry(selectedCountry.id, stars, factsLearned);
                handleNavigate('minigame-result');
              }}
              onBack={() => handleNavigate('country-explore')}
            />
          </motion.div>
        )}

        {currentScreen === 'minigame-result' && selectedCountry && (
          <motion.div
            key={`result-${selectedCountry.id}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="absolute inset-0"
          >
            <MiniGameResult
              country={selectedCountry}
              onGetStamp={() => handleNavigate('passport-stamp')}
            />
          </motion.div>
        )}

        {currentScreen === 'passport-stamp' && selectedCountry && (
          <motion.div
            key={`stamp-${selectedCountry.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <PassportStamp
              country={selectedCountry}
              onContinue={() => handleNavigate('globe')}
            />
          </motion.div>
        )}

        {currentScreen === 'passport' && (
          <motion.div
            key="passport"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <PassportScreen
              onBack={() => handleNavigate('globe')}
              onSelectCountry={(countryId) => {
                useGameStore.getState().selectCountry(countryId);
                handleNavigate('country-intro');
              }}
            />
          </motion.div>
        )}

        {currentScreen === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <SettingsScreen
              onBack={() => handleNavigate('globe')}
            />
          </motion.div>
        )}

        {currentScreen === 'parent-dashboard' && (
          <motion.div
            key="parent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <ParentDashboard onBack={() => handleNavigate('globe')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mascot */}
      <AnimatePresence>
        {showMascot && currentScreen !== 'title' && (
          <MascotGuide
            message={mascotMessage}
            onClick={() => {
              const messages = [
                'Tap a glowing landmark to travel!',
                'Collect stamps in your passport!',
                'You are doing amazing!',
                'Explore the world!',
                'Learn something new today!',
              ];
              showMascotMessage(
                messages[Math.floor(Math.random() * messages.length)]
              );
            }}
          />
        )}
      </AnimatePresence>

      {/* Sound Toggle - Floating */}
      {currentScreen !== 'title' && (
        <button
          onClick={toggleSound}
          className="absolute bottom-4 right-4 z-50 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:scale-110 transition-transform border-2 border-white/50"
          aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-slate-600" />
          ) : (
            <VolumeX className="w-5 h-5 text-slate-400" />
          )}
        </button>
      )}

      {/* Quick Navigation - Show on non-globe screens */}
      {currentScreen !== 'title' && currentScreen !== 'globe' && currentScreen !== 'settings' && (
        <div className="absolute top-4 left-4 z-30 flex gap-2">
          <button
            onClick={() => handleNavigate('globe')}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg hover:scale-105 transition-transform border-2 border-white/50"
            aria-label="Go to Globe"
          >
            <Home className="w-5 h-5 text-slate-600" />
          </button>
          {currentScreen !== 'passport' && (
            <button
              onClick={() => handleNavigate('passport')}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg hover:scale-105 transition-transform border-2 border-white/50"
              aria-label="Open Passport"
            >
              <span className="text-xl">🛂</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
