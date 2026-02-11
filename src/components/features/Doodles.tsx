import React from 'react';
import { cn } from '@/lib/utils';

interface DoodleProps {
  className?: string;
  style?: React.CSSProperties;
}

// Yarn string forming a lightbulb (ideas/productivity)
export function LightbulbYarn({ className, style }: DoodleProps) {
  return (
    <svg 
      viewBox="0 0 40 50" 
      className={cn("w-10 h-12 text-board-coral/60", className)}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 5 C10 5, 5 15, 5 22 C5 30, 12 35, 15 38 L15 45 L25 45 L25 38 C28 35, 35 30, 35 22 C35 15, 30 5, 20 5" />
      <path d="M15 45 L25 45" />
      <path d="M16 48 L24 48" />
      <path d="M18 8 Q 20 12, 22 8" className="text-board-mint/40" />
    </svg>
  );
}

// Yarn string forming a target/goal
export function TargetYarn({ className, style }: DoodleProps) {
  return (
    <svg 
      viewBox="0 0 40 40" 
      className={cn("w-10 h-10 text-board-lavender/60", className)}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="20" cy="20" r="16" />
      <circle cx="20" cy="20" r="10" className="text-board-mint/50" />
      <circle cx="20" cy="20" r="4" className="text-board-coral/60" />
    </svg>
  );
}

// Yarn string forming a checkmark
export function CheckYarn({ className, style }: DoodleProps) {
  return (
    <svg 
      viewBox="0 0 40 40" 
      className={cn("w-8 h-8 text-board-mint/70", className)}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 22 L16 30 L32 10" />
    </svg>
  );
}

// Yarn string forming a clock/time
export function ClockYarn({ className, style }: DoodleProps) {
  return (
    <svg 
      viewBox="0 0 40 40" 
      className={cn("w-8 h-8 text-primary/40", className)}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="20" cy="20" r="16" />
      <path d="M20 10 L20 20 L28 24" />
    </svg>
  );
}

// Yarn string forming a pencil
export function PencilYarn({ className, style }: DoodleProps) {
  return (
    <svg 
      viewBox="0 0 40 50" 
      className={cn("w-8 h-10 text-board-coral/50", className)}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 40 L10 15 L20 5 L30 15 L30 40 L10 40" />
      <path d="M20 40 L20 48" />
      <path d="M15 15 L25 15" className="text-board-lavender/60" />
    </svg>
  );
}

// Yarn loop/swirl
export function LoopYarn({ className, style }: DoodleProps) {
  return (
    <svg 
      viewBox="0 0 50 30" 
      className={cn("w-12 h-7 text-board-lavender/50", className)}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M5 15 C5 5, 20 5, 25 15 C30 25, 45 25, 45 15" />
    </svg>
  );
}

// Yarn string forming a star
export function StarYarn({ className, style }: DoodleProps) {
  return (
    <svg 
      viewBox="0 0 40 40" 
      className={cn("w-8 h-8 text-board-mint/60", className)}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 5 L23 15 L34 15 L25 22 L28 33 L20 26 L12 33 L15 22 L6 15 L17 15 Z" />
    </svg>
  );
}

// Yarn tangled dots pattern
export function TangledYarn({ className, style }: DoodleProps) {
  return (
    <svg 
      viewBox="0 0 60 40" 
      className={cn("w-14 h-10 text-primary/30", className)}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M5 20 Q 15 5, 25 20 T 45 20 T 55 25" />
      <path d="M10 30 Q 20 15, 35 25 T 50 15" className="text-board-coral/40" />
    </svg>
  );
}

// Yarn forming document/list
export function ListYarn({ className, style }: DoodleProps) {
  return (
    <svg 
      viewBox="0 0 35 45" 
      className={cn("w-8 h-10 text-board-lavender/60", className)}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect x="5" y="5" width="25" height="35" rx="2" />
      <path d="M10 15 L25 15" />
      <path d="M10 22 L25 22" className="text-board-mint/50" />
      <path d="M10 29 L20 29" className="text-board-coral/50" />
    </svg>
  );
}

// Wavy yarn line
export function WavyYarn({ className, style }: DoodleProps) {
  return (
    <svg 
      viewBox="0 0 100 20" 
      className={cn("w-24 h-5 text-primary/30", className)}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M0 10 Q 12.5 0, 25 10 T 50 10 T 75 10 T 100 10" />
    </svg>
  );
}
