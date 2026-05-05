'use client';

import { useRef, useState, useEffect } from 'react';
import { Scenario, JudgmentResult, MonkeyMood } from '@/types';
import MonkeyExpression, { getMoodFromScore } from './MonkeyExpression';

interface ShareCardProps {
  scenario: Scenario;
  result: JudgmentResult;
  username: string;
  rank: number | null;
  onBack: () => void;
}

export default function ShareCard({ scenario, result, username, rank, onBack }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copying, setCopying] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const mood: MonkeyMood = getMoodFromScore(result.daysTotal);

  // Dynamically load html2canvas
  useEffect(() => {
    import('html2canvas').catch(() => {});
  }, []);

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `kaput-${username}-${result.daysTotal}days.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  }

  async function handleCopy() {
    if (!cardRef.current) return;
    setCopying(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setTimeout(() => setCopying(false), 1500);
      });
    } catch {
      // Fallback: copy text
      const text = `I would survive ${result.daysTotal} days in a ${scenario.name}! 🐒 Play at kaput.app`;
      await navigator.clipboard.writeText(text);
      setTimeout(() => setCopying(false), 1500);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-8"
      style={{
        background: `linear-gradient(160deg, ${scenario.bgFrom} 0%, ${scenario.bgTo} 100%)`,
      }}
    >
      <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-5">Your Share Card</p>

      {/* The card itself — this gets captured */}
      <div
        ref={cardRef}
        style={{
          width: 340,
          background: `linear-gradient(160deg, ${scenario.bgFrom} 0%, ${scenario.bgTo} 100%)`,
          borderRadius: 24,
          padding: 32,
          border: '1.5px solid rgba(255,255,255,0.2)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* KAPUT logo */}
        <div style={{ marginBottom: 8 }}>
          <span
            style={{
              fontSize: 42,
              fontWeight: 900,
              letterSpacing: '-2px',
              color: scenario.accentColor,
              textShadow: '3px 3px 0 rgba(0,0,0,0.3)',
              lineHeight: 1,
            }}
          >
            KAPUT
          </span>
        </div>

        {/* Monkey */}
        <MonkeyExpression mood={mood} size={140} />

        {/* Score */}
        <div style={{ marginTop: 12 }}>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            I would survive
          </p>
          <p style={{ color: '#fff', fontSize: 64, fontWeight: 900, lineHeight: 1, letterSpacing: '-3px' }}>
            {result.daysTotal}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, fontWeight: 700, marginTop: 4 }}>
            days in a{' '}
            <span style={{ color: scenario.accentColor }}>{scenario.name}</span>
          </p>
        </div>

        {/* Rank */}
        {rank && (
          <div
            style={{
              marginTop: 14,
              background: 'rgba(0,0,0,0.3)',
              borderRadius: 12,
              padding: '6px 16px',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700 }}>
              Ranked <span style={{ color: '#FFD700' }}>#{rank}</span> today
            </p>
          </div>
        )}

        {/* URL */}
        <p style={{ marginTop: 16, color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 600 }}>
          kaput.app
        </p>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex gap-3 w-full max-w-sm">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 py-4 rounded-2xl font-black text-base shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60"
          style={{
            background: scenario.accentColor,
            color: '#fff',
            boxShadow: `0 6px 20px ${scenario.accentColor}55`,
          }}
        >
          {downloading ? 'Saving...' : '↓ Download'}
        </button>
        <button
          onClick={handleCopy}
          disabled={copying}
          className="flex-1 py-4 rounded-2xl font-bold text-base border border-white/25 text-white transition-all hover:bg-white/10 active:scale-95 disabled:opacity-60"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          {copying ? 'Copied!' : '⎘ Copy'}
        </button>
      </div>

      <button
        onClick={onBack}
        className="mt-4 text-white/50 text-sm hover:text-white/80 transition-colors font-medium"
      >
        ← Back to results
      </button>
    </div>
  );
}
