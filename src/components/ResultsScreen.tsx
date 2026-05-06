'use client';

import { useState, useEffect, useRef } from 'react';
import { Scenario, JudgmentResult, LeaderboardEntry, MonkeyMood } from '@/types';
import MonkeyExpression, { getMoodFromScore } from './MonkeyExpression';

interface ResultsScreenProps {
  scenario: Scenario;
  items: [string, string, string];
  result: JudgmentResult;
  username: string;
  onTryAgain: () => void;
  onShare: () => void;
  sharingActive?: boolean;
}

function article(name: string): string {
  return /^[aeiou]/i.test(name) ? 'AN' : 'A';
}

function scoreBarColor(score: number): string {
  if (score >= 70) return '#22c55e';
  if (score >= 40) return '#eab308';
  return '#ef4444';
}

export default function ResultsScreen({
  scenario,
  items,
  result,
  username,
  onTryAgain,
  onShare,
  sharingActive = false,
}: ResultsScreenProps) {
  const [displayDays, setDisplayDays] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  const [lbLoading, setLbLoading] = useState(true);
  const [lbOpen, setLbOpen] = useState(false);
  const mood: MonkeyMood = getMoodFromScore(result.daysTotal);
  const hasAnimated = useRef(false);

  // Default leaderboard open on desktop
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setLbOpen(true);
    }
  }, []);

  // Count-up animation
  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const target = result.daysTotal;
    const duration = 1400;
    const start = Date.now();
    function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayDays(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [result.daysTotal]);

  // Load leaderboard
  useEffect(() => {
    async function fetchLb() {
      try {
        const res = await fetch(`/api/leaderboard?username=${encodeURIComponent(username)}`);
        const data = await res.json();
        setLeaderboard(data.entries || []);
        setPlayerRank(data.playerRank ?? null);
      } catch {
        // silent
      } finally {
        setLbLoading(false);
      }
    }
    fetchLb();
  }, [username]);

  const verdictTwoSentences = result.verdict
    .split(/(?<=[.!?])\s+/)
    .slice(0, 2)
    .join(' ');

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-fira), monospace',
    fontSize: '13px',
    color: '#4a4a4a',
  };

  const sectionHeadStyle: React.CSSProperties = {
    fontFamily: 'var(--font-fira), monospace',
    fontSize: '14px',
    fontWeight: 700,
    color: '#0a0a0a',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  };

  return (
    <div
      className="min-h-screen animated-gradient"
      style={{
        background: `linear-gradient(160deg, ${scenario.bgFrom} 0%, ${scenario.bgTo} 100%)`,
        fontFamily: 'var(--font-fira), monospace',
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: '52px 24px 40px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Score header — centered */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ fontSize: '12px', letterSpacing: '3px', color: 'rgba(0,0,0,0.45)', textTransform: 'uppercase', marginBottom: '4px' }}>
            You would survive
          </p>
          <p
            className="score-reveal"
            style={{ fontSize: '72px', fontWeight: 900, color: '#0a0a0a', lineHeight: 1, letterSpacing: '-2px' }}
          >
            {displayDays} DAYS
          </p>
          <p style={{ fontSize: '12px', letterSpacing: '3px', color: 'rgba(0,0,0,0.45)', textTransform: 'uppercase', marginTop: '6px' }}>
            {article(scenario.name)} {scenario.name}
          </p>
        </div>

        {/* Monkey — left-aligned, 120px */}
        <div style={{ marginBottom: '16px' }}>
          <MonkeyExpression mood={mood} size={120} />
        </div>

        {/* Verdict — full-width italic, plain on background */}
        <p
          style={{
            fontFamily: 'var(--font-fira), monospace',
            fontSize: '15px',
            fontStyle: 'italic',
            color: '#2a2a2a',
            lineHeight: 1.6,
            marginBottom: '28px',
          }}
        >
          &ldquo;{verdictTwoSentences}&rdquo;
        </p>

        {/* Item Ratings */}
        <div style={{ marginBottom: '16px' }}>
          <p style={sectionHeadStyle}>Item Ratings</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map((item, idx) => {
              const score = Math.round(result.itemScores[idx]);
              const color = scoreBarColor(score);
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ ...labelStyle, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item}
                  </span>
                  <div style={{ width: '140px', height: '6px', background: 'rgba(0,0,0,0.12)', borderRadius: '3px', flexShrink: 0 }}>
                    <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.8s ease' }} />
                  </div>
                  <span style={{ ...labelStyle, fontWeight: 700, width: '28px', textAlign: 'right', flexShrink: 0 }}>{score}</span>
                </div>
              );
            })}

            {/* Combo bonus */}
            {result.comboBonus && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '4px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <span style={{ ...labelStyle, flex: 1 }}>Killer combo</span>
                <span style={{ fontFamily: 'var(--font-fira), monospace', fontSize: '13px', fontWeight: 700, color: '#16a34a' }}>+ 20 days</span>
              </div>
            )}

            {/* Replay penalty */}
            {result.penaltyApplied && result.penaltyLabel && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '4px', borderTop: result.comboBonus ? 'none' : '1px solid rgba(0,0,0,0.08)' }}>
                <span style={{ ...labelStyle, flex: 1 }}>Replay penalty</span>
                <span style={{ fontFamily: 'var(--font-fira), monospace', fontSize: '13px', fontWeight: 700, color: '#dc2626' }}>
                  {result.penaltyLabel}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard (collapsible, open by default on desktop) */}
        <div
          style={{
            marginBottom: '24px',
            background: 'rgba(255,255,255,0.45)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => setLbOpen((o) => !o)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'none',
              border: 'none',
              padding: '16px 20px',
              cursor: 'pointer',
              borderBottom: lbOpen ? '1px solid rgba(0,0,0,0.08)' : 'none',
            }}
          >
            <span style={{ ...sectionHeadStyle, marginBottom: 0 }}>Today&apos;s Leaderboard</span>
            <span style={{ fontSize: '18px', color: '#4a4a4a', transform: lbOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              &#8964;
            </span>
          </button>

          {lbOpen && (
            <div style={{ padding: '12px 20px 16px' }}>
              {lbLoading ? (
                <p style={{ ...labelStyle, textAlign: 'center', padding: '8px 0' }}>Loading...</p>
              ) : leaderboard.length === 0 ? (
                <p style={{ ...labelStyle, textAlign: 'center', padding: '8px 0' }}>No scores yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {leaderboard.slice(0, 3).map((entry, idx) => (
                    <div
                      key={entry.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        background: entry.username === username ? 'rgba(0,0,0,0.08)' : 'transparent',
                        fontFamily: 'var(--font-fira), monospace',
                        fontSize: '13px',
                      }}
                    >
                      <span style={{ color: '#6a6a6a', width: '24px', textAlign: 'center', flexShrink: 0 }}>
                        #{idx + 1}
                      </span>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#0a0a0a' }}>
                        {entry.username}
                      </span>
                      <span style={{ fontWeight: 700, color: '#0a0a0a' }}>{Math.round(entry.score)}</span>
                      <span style={{ color: '#6a6a6a' }}>days</span>
                    </div>
                  ))}
                  {playerRank !== null && playerRank > 3 && (
                    <>
                      <div style={{ textAlign: 'center', color: '#6a6a6a', fontSize: '12px', padding: '2px 0' }}>···</div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          background: 'rgba(0,0,0,0.08)',
                          fontFamily: 'var(--font-fira), monospace',
                          fontSize: '13px',
                        }}
                      >
                        <span style={{ color: '#6a6a6a', width: '24px', textAlign: 'center', flexShrink: 0 }}>#{playerRank}</span>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#0a0a0a' }}>{username}</span>
                        <span style={{ fontWeight: 700, color: '#0a0a0a' }}>{Math.round(result.daysTotal)}</span>
                        <span style={{ color: '#6a6a6a' }}>days</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action buttons — hidden while share modal is open */}
        {!sharingActive && <div style={{ display: 'flex', gap: '12px', maxWidth: '480px', margin: '0 auto', width: '100%' }}>
          <button
            onClick={onTryAgain}
            style={{
              flex: 1,
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
          <button
            onClick={onShare}
            style={{
              width: '56px',
              height: '56px',
              background: '#ffffff',
              border: '1px solid #d0d0d0',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            aria-label="Share"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          </button>
        </div>}
      </div>
    </div>
  );
}
