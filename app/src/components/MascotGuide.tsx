import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MascotGuideProps {
  message: string;
  onClick: () => void;
}

export function MascotGuide({ message, onClick }: MascotGuideProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute bottom-20 left-4 z-40 cursor-pointer"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: 'spring', damping: 15 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {(message || isHovered) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 10 }}
            className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl px-4 py-3 shadow-xl border-2 border-white/50 max-w-[200px]"
          >
            <p className="text-sm font-bold text-slate-700">
              {message || 'Tap me for tips! 🦊'}
            </p>
            {/* Triangle pointer */}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white rotate-45 border-r-2 border-b-2 border-white/50" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Image */}
      <motion.div
        className="relative"
        animate={{
          y: [0, -5, 0],
          rotate: isHovered ? [0, -5, 5, 0] : 0,
        }}
        transition={{
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 0.5 },
        }}
      >
        <img
          src="/assets/ui/mascot.png"
          alt="Foxy the Explorer - your guide"
          className="w-20 h-24 sm:w-24 sm:h-28 object-contain drop-shadow-xl"
          draggable={false}
        />
        
        {/* Sparkle effect when hovered */}
        <AnimatePresence>
          {isHovered && (
            <>
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-2 -right-2 text-yellow-400"
              >
                ✨
              </motion.div>
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-0 -left-3 text-yellow-400"
              >
                ✨
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
