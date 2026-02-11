import React, { useEffect, useState } from 'react';
import { FocusMode } from '@/contexts/FocusContext';

interface FocusChangeOverlayProps {
  targetMode: FocusMode | null;
  onComplete: () => void;
}

const modeColors: Record<FocusMode, string> = {
  productive: 'hsl(350, 70%, 65%)',
  design: 'hsl(45, 85%, 60%)',
  tech: 'hsl(220, 70%, 60%)',
};


export function FocusChangeOverlay({ targetMode, onComplete }: FocusChangeOverlayProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (targetMode) {
      setIsAnimating(true);
      
      const completeTimer = setTimeout(() => {
        setIsAnimating(false);
        onComplete();
      }, 700);

      return () => {
        clearTimeout(completeTimer);
      };
    }
  }, [targetMode, onComplete]);

  if (!targetMode || !isAnimating) return null;

  const color = modeColors[targetMode];

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {/* Color burst particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute top-1/2 left-1/2 rounded-full"
          style={{
            width: `${30 + Math.random() * 40}px`,
            height: `${30 + Math.random() * 40}px`,
            background: `radial-gradient(circle, ${color}cc, ${color}00)`,
            animation: `burstParticle 0.7s ease-out forwards`,
            animationDelay: `${i * 0.03}s`,
            ['--angle' as string]: `${(i * 30) + (Math.random() * 15)}deg`,
            ['--distance' as string]: `${150 + Math.random() * 250}px`,
            opacity: 0,
          }}
        />
      ))}

      {/* Central flash */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${color}50 0%, ${color}20 30%, transparent 70%)`,
          animation: 'colorFlash 0.5s ease-out forwards',
        }}
      />

      {/* Edge glow wash */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: `inset 0 0 120px 60px ${color}30`,
          animation: 'edgeGlow 0.6s ease-out forwards',
        }}
      />

      <style>{`
        @keyframes burstParticle {
          0% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(0.3);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--distance)) scale(0);
            opacity: 0;
          }
        }
        @keyframes colorFlash {
          0% { opacity: 0; transform: scale(0.5); }
          30% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.5); }
        }
        @keyframes edgeGlow {
          0% { opacity: 0; }
          40% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
