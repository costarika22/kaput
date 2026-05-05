'use client';

import { useState, useCallback } from 'react';
import { Scenario } from '@/types';
import MonkeyExpression from './MonkeyExpression';
import { MonkeyMood } from '@/types';

interface LoadingScreenProps {
  scenario: Scenario;
}

const FLINCH_MOODS: MonkeyMood[] = ['devastated', 'disappointed', 'neutral', 'impressed', 'euphoric'];

const FLINCH_TEXTS = [
  '...',
  'Hmm.',
  'Interesting.',
  'I see.',
  'Really.',
  'I am processing.',
  'Do not do that again.',
  'Noted.',
];

export default function LoadingScreen({ scenario }: LoadingScreenProps) {
  const [flinchCount, setFlinchCount] = useState(0);
  const [currentMood, setCurrentMood] = useState<MonkeyMood>('neutral');
  const [flinchText, setFlinchText] = useState('The monkey is judging your choices...');
  const [bouncing, setBouncing] = useState(false);

  const handleMonkeyClick = useCallback(() => {
    const newCount = flinchCount + 1;
    setFlinchCount(newCount);
    const mood = FLINCH_MOODS[newCount % FLINCH_MOODS.length];
    setCurrentMood(mood);
    setFlinchText(FLINCH_TEXTS[newCount % FLINCH_TEXTS.length]);
    setBouncing(true);
    setTimeout(() => setBouncing(false), 300);
  }, [flinchCount]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{
        background: `linear-gradient(160deg, ${scenario.bgFrom} 0%, ${scenario.bgTo} 100%)`,
      }}
    >
      <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-8">
        {scenario.name}
      </p>

      {/* Monkey with click interaction */}
      <div
        onClick={handleMonkeyClick}
        className="cursor-pointer select-none relative"
        style={{
          transform: bouncing ? 'scale(0.88) rotate(-8deg)' : 'scale(1) rotate(0deg)',
          transition: 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)',
        }}
        title="Tap the monkey"
        role="button"
        aria-label="Tap the monkey"
      >
        {/* Idle float animation via inline keyframes in globals */}
        <div className="monkey-idle">
          <MonkeyExpression mood={currentMood} size={220} />
        </div>
        {flinchCount > 0 && (
          <div
            className="absolute -top-2 -right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-lg border border-white/20"
            style={{ backdropFilter: 'blur(4px)' }}
          >
            {FLINCH_TEXTS[flinchCount % FLINCH_TEXTS.length]}
          </div>
        )}
      </div>

      {/* Tap hint */}
      <p className="mt-2 text-white/35 text-xs">
        {flinchCount === 0 ? 'tap the monkey' : `${flinchCount} tap${flinchCount > 1 ? 's' : ''}`}
      </p>

      {/* Status text */}
      <p className="mt-6 text-white font-bold text-xl max-w-xs">
        {flinchText}
      </p>

      {/* Animated dots */}
      <div className="mt-4 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-white/40"
            style={{
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
