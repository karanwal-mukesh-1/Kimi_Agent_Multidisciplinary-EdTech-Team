import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Compass, Globe, Star } from 'lucide-react';

interface TitleScreenProps {
  onPlay: () => void;
}

export function TitleScreen({ onPlay }: TitleScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
    }> = [];

    const colors = ['#FFB7B2', '#B5EAD7', '#A2D2FF', '#FFDAC1', '#C7CEEA', '#FFF4BD'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 8 + 2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: -Math.random() * 0.5 - 0.2,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animationId: number;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * 0.3;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/ui/title-bg.jpg)' }}
      />

      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-blue-900/20" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        {/* Floating Icons */}
        <motion.div
          className="flex gap-8 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Compass className="w-10 h-10 text-white/80 drop-shadow-lg" />
          </motion.div>
          <motion.div
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Globe className="w-12 h-12 text-white/90 drop-shadow-lg" />
          </motion.div>
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MapPin className="w-10 h-10 text-white/80 drop-shadow-lg" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
        >
          <h1
            className="text-5xl sm:text-7xl font-black text-white drop-shadow-2xl tracking-tight"
            style={{
              textShadow:
                '3px 3px 0 #2C3E50, -1px -1px 0 #2C3E50, 1px -1px 0 #2C3E50, -1px 1px 0 #2C3E50, 0 4px 8px rgba(0,0,0,0.3)',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Little Explorer
          </h1>
          <motion.p
            className="text-xl sm:text-2xl text-white/90 font-bold mt-2 drop-shadow-lg"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            🌍 World Adventure 🌍
          </motion.p>
        </motion.div>

        {/* Mascot */}
        <motion.div
          className="w-32 h-40 sm:w-40 sm:h-52"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <motion.img
            src="/assets/ui/mascot.png"
            alt="Foxy the Explorer"
            className="w-full h-full object-contain drop-shadow-2xl"
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Play Button */}
        <motion.button
          onClick={onPlay}
          className="relative group"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="bg-gradient-to-r from-coral-400 to-coral-500 text-white font-black text-2xl sm:text-3xl px-12 py-4 rounded-3xl shadow-xl border-4 border-white/50 flex items-center gap-3 hover:shadow-2xl transition-shadow">
            <Star className="w-8 h-8 fill-white" />
            Start Exploring!
            <Star className="w-8 h-8 fill-white" />
          </div>
          {/* Button glow */}
          <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>

        {/* Subtitle */}
        <motion.p
          className="text-white/70 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Learn about countries, flags, and cultures!
        </motion.p>
      </div>

      {/* Bottom decoration */}
      <motion.div
        className="absolute bottom-8 flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-3xl animate-bounce" style={{ animationDelay: '0s' }}>🎈</span>
        <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>✈️</span>
        <span className="text-3xl animate-bounce" style={{ animationDelay: '0.4s' }}>🗺️</span>
        <span className="text-3xl animate-bounce" style={{ animationDelay: '0.6s' }}>🌟</span>
      </motion.div>
    </div>
  );
}
