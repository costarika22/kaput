'use client';

import { useState, useCallback } from 'react';
import { Scenario, MonkeyMood } from '@/types';
import MonkeyExpression from './MonkeyExpression';

const FLINCH_MOODS: MonkeyMood[] = ['devastated', 'disappointed', 'neutral', 'impressed', 'euphoric'];
const REACTIONS = ['ow!', 'stop poking me', 'that hurt', 'rude'];

interface LoadingScreenProps {
  scenario: Scenario;
}

interface Reaction {
  id: number;
  text: string;
  x: number;
}

export default function LoadingScreen({ scenario }: LoadingScreenProps) {
  const [flinchCount, setFlinchCount] = useState(0);
  const [currentMood, setCurrentMood] = useState<MonkeyMood>('neutral');
  const [bouncing, setBouncing] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);

  const handleMonkeyClick = useCallback(() => {
    const newCount = flinchCount + 1;
    setFlinchCount(newCount);
    setCurrentMood(FLINCH_MOODS[newCount % FLINCH_MOODS.length]);
    setBouncing(true);
    setTimeout(() => setBouncing(false), 300);

    // Floating reaction
    const id = Date.now();
    const text = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
    const x = Math.round((Math.random() * 60) - 30);
    setReactions(prev => [...prev, { id, text, x }]);
    setTimeout(() => setReactions(prev => prev.filter(r => r.id !== id)), 1200);
  }, [flinchCount]);

  return (
    <div
      className="min-h-screen animated-gradient"
      style={{
        background: `linear-gradient(160deg, ${scenario.bgFrom} 0%, ${scenario.bgTo} 100%)`,
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 24px',
        }}
      >
        <div style={{ flex: 1 }} />

        {/* Monkey with floating reactions */}
        <div style={{ position: 'relative' }}>
          {reactions.map(r => (
            <span
              key={r.id}
              className="reaction-float"
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                marginLeft: `${r.x}px`,
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-fira), monospace',
                fontSize: '13px',
                fontWeight: 700,
                color: '#0a0a0a',
              }}
            >
              {r.text}
            </span>
          ))}

          <div
            onClick={handleMonkeyClick}
            role="button"
            aria-label="Tap Kaput"
            style={{
              cursor: 'pointer',
              userSelect: 'none',
              transform: bouncing ? 'scale(0.88) rotate(-8deg)' : 'scale(1) rotate(0deg)',
              transition: 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            <div className="monkey-idle">
              <MonkeyExpression mood={currentMood} size={240} />
            </div>
          </div>
        </div>

        {/* TAP ON KAPUT */}
        <p
          style={{
            fontFamily: 'var(--font-fira), monospace',
            fontSize: '12px',
            letterSpacing: '3px',
            color: 'rgba(0,0,0,0.4)',
            marginTop: '16px',
            textTransform: 'uppercase',
          }}
        >
          Tap on Kaput
        </p>

        <div style={{ flex: 1 }} />

        {/* KAPUT IS JUDGING YOU */}
        <p
          style={{
            fontFamily: 'var(--font-fira), monospace',
            fontSize: '18px',
            fontWeight: 700,
            color: '#0a0a0a',
            textAlign: 'center',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            lineHeight: 1.4,
          }}
        >
          Kaput is judging you... I would be worried.
        </p>

        {/* Pulsing dots */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '24px', paddingBottom: '48px' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.3)',
                animation: 'bounce 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
