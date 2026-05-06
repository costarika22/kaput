'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Scenario, JudgmentResult, MonkeyMood } from '@/types';
import { getMoodFromScore } from './MonkeyExpression';

interface ShareCardProps {
  scenario: Scenario;
  result: JudgmentResult;
  username: string;
  rank: number | null;
  onBack: () => void;
}

function article(name: string): string {
  return /^[aeiou]/i.test(name) ? 'an' : 'a';
}

export default function ShareCard({ scenario, result, username, rank, onBack }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copying, setCopying] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const mood: MonkeyMood = getMoodFromScore(result.daysTotal);

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
      const text = `I would survive ${result.daysTotal} days in ${article(scenario.name)} ${scenario.name}! Play at kaput.app`;
      await navigator.clipboard.writeText(text);
      setTimeout(() => setCopying(false), 1500);
    }
  }

  return (
    /* Full-screen dimmed overlay */
    <div
      onClick={onBack}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        zIndex: 50,
      }}
    >
      {/* Inner wrapper — stop propagation so clicking card doesn't dismiss */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '360px' }}
      >
        {/* The shareable card */}
        <div
          ref={cardRef}
          style={{
            width: '100%',
            background: `linear-gradient(160deg, ${scenario.bgFrom} 0%, ${scenario.bgTo} 100%)`,
            borderRadius: '20px',
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Monkey overlapping KAPUT — same composition as splash */}
          <div style={{ marginBottom: '-28px', zIndex: 1, position: 'relative' }}>
            <Image
              src={`/${mood}.png`}
              alt="Kaput"
              width={120}
              height={120}
              style={{ objectFit: 'contain' }}
            />
          </div>

          {/* KAPUT logo */}
          <h2
            style={{
              fontFamily: 'var(--font-bangers), Impact, sans-serif',
              fontSize: '64px',
              lineHeight: 1,
              color: '#0a0a0a',
              WebkitTextStroke: '4px white',
              paintOrder: 'stroke fill',
              letterSpacing: '3px',
              margin: 0,
              position: 'relative',
              zIndex: 0,
            }}
          >
            KAPUT
          </h2>

          {/* Score */}
          <p
            style={{
              fontFamily: 'var(--font-fira), monospace',
              fontSize: '13px',
              letterSpacing: '3px',
              color: '#4a6a7a',
              marginTop: '20px',
              textTransform: 'uppercase',
            }}
          >
            I would survive
          </p>
          <p
            style={{
              fontFamily: 'var(--font-fira), monospace',
              fontSize: '56px',
              fontWeight: 900,
              color: '#0a0a0a',
              lineHeight: 1,
              letterSpacing: '-2px',
              marginTop: '4px',
            }}
          >
            {Math.round(result.daysTotal)} Days
          </p>
          <p
            style={{
              fontFamily: 'var(--font-fira), monospace',
              fontSize: '13px',
              letterSpacing: '3px',
              color: '#4a6a7a',
              marginTop: '6px',
              textTransform: 'uppercase',
            }}
          >
            In {article(scenario.name)} {scenario.name}
          </p>

          {/* Rank */}
          {rank !== null && (
            <p
              style={{
                fontFamily: 'var(--font-fira), monospace',
                fontSize: '13px',
                letterSpacing: '2px',
                color: '#4a6a7a',
                marginTop: '12px',
                textTransform: 'uppercase',
              }}
            >
              Ranked #{rank} today
            </p>
          )}

          {/* URL placeholder */}
          {/* kaput.app */}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{
              flex: 1,
              padding: '16px',
              background: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              cursor: downloading ? 'not-allowed' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              opacity: downloading ? 0.6 : 1,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-fira), monospace', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: '#0a0a0a', textTransform: 'uppercase' }}>
              {downloading ? 'Saving...' : 'Download'}
            </span>
          </button>

          <button
            onClick={handleCopy}
            disabled={copying}
            style={{
              flex: 1,
              padding: '16px',
              background: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              cursor: copying ? 'not-allowed' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              opacity: copying ? 0.6 : 1,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-fira), monospace', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: '#0a0a0a', textTransform: 'uppercase' }}>
              {copying ? 'Copied!' : 'Copy'}
            </span>
          </button>
        </div>

        {/* Play Again */}
        <button
          onClick={onBack}
          style={{
            width: '100%',
            padding: '18px',
            background: '#0a0a0a',
            color: '#ffffff',
            fontFamily: 'var(--font-fira), monospace',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '2px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
