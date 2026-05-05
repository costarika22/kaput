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
}

export default function ResultsScreen({
  scenario,
  items,
  result,
  username,
  onTryAgain,
  onShare,
}: ResultsScreenProps) {
  const [displayDays, setDisplayDays] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  const [lbLoading, setLbLoading] = useState(true);
  const mood: MonkeyMood = getMoodFromScore(result.daysTotal);
  const hasAnimated = useRef(false);

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
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        setLeaderboard(data.entries || []);
        setPlayerRank(data.playerRank || null);
      } catch {
        // silent
      } finally {
        setLbLoading(false);
      }
    }
    fetchLb();
  }, []);

  const moodLabel: Record<MonkeyMood, string> = {
    devastated: 'Devastated',
    disappointed: 'Disappointed',
    neutral: 'Neutral',
    impressed: 'Impressed',
    euphoric: 'Euphoric',
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: `linear-gradient(160deg, ${scenario.bgFrom} 0%, ${scenario.bgTo} 100%)`,
      }}
    >
      <div className="flex-1 flex flex-col items-center px-5 pt-8 pb-10">
        {/* Scenario label */}
        <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-6">
          {scenario.name}
        </p>

        {/* Monkey */}
        <div className="relative">
          <MonkeyExpression mood={mood} size={160} />
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold"
            style={{ background: scenario.accentColor, color: '#fff' }}
          >
            {moodLabel[mood]}
          </div>
        </div>

        {/* Score */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm font-medium mb-1">You would survive</p>
          <p
            className="font-black text-7xl md:text-8xl tabular-nums"
            style={{ color: '#fff', textShadow: `0 0 40px ${scenario.accentColor}99` }}
          >
            {displayDays}
          </p>
          <p className="text-white/80 text-lg font-bold mt-1">
            days in a <span style={{ color: scenario.accentColor }}>{scenario.name}</span>
          </p>
        </div>

        {/* Verdict */}
        <div
          className="mt-6 max-w-sm w-full rounded-2xl px-5 py-4 border border-white/20"
          style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
        >
          <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-2">The Monkey&apos;s Verdict</p>
          <p className="text-white text-sm leading-relaxed italic">&ldquo;{result.verdict}&rdquo;</p>
        </div>

        {/* Item scores */}
        <div
          className="mt-4 max-w-sm w-full rounded-2xl px-5 py-4 border border-white/15"
          style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)' }}
        >
          <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3">Item Ratings</p>
          <div className="space-y-2">
            {items.map((item, idx) => {
              const score = result.itemScores[idx];
              return (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-white/70 text-sm flex-1 truncate">{item}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${score}%`,
                          background: score >= 70 ? '#4ade80' : score >= 40 ? '#facc15' : '#f87171',
                        }}
                      />
                    </div>
                    <span className="text-white font-bold text-sm w-7 text-right">{score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Combo bonus */}
        {result.comboBonus && (
          <div
            className="mt-3 max-w-sm w-full rounded-xl px-4 py-2.5 border border-green-400/40 bg-green-500/20 flex items-center gap-2"
          >
            <span className="text-green-400 text-lg">✦</span>
            <div>
              <p className="text-green-300 font-bold text-sm">Combo Bonus +20 days</p>
              <p className="text-green-400/70 text-xs">Your items cover 3+ survival categories</p>
            </div>
          </div>
        )}

        {/* Replay penalty */}
        {result.penaltyApplied && result.penaltyLabel && (
          <div
            className="mt-3 max-w-sm w-full rounded-xl px-4 py-2.5 border border-red-400/40 bg-red-500/20 flex items-center gap-2"
          >
            <span className="text-red-400 text-lg">⚠</span>
            <div>
              <p className="text-red-300 font-bold text-sm">{result.penaltyLabel}</p>
              <p className="text-red-400/70 text-xs">Score reduced for repeated attempts</p>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div
          className="mt-6 max-w-sm w-full rounded-2xl px-5 py-4 border border-white/15"
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}
        >
          <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3">Today&apos;s Leaderboard</p>
          {lbLoading ? (
            <p className="text-white/30 text-sm text-center py-2">Loading...</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-2">No scores yet.</p>
          ) : (
            <div className="space-y-1.5">
              {leaderboard.slice(0, 10).map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg ${entry.username === username ? 'border border-white/30' : ''}`}
                  style={{
                    background: entry.username === username ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
                  }}
                >
                  <span className="text-white/40 text-xs font-bold w-5 text-center">
                    {idx === 0 ? '👑' : `#${idx + 1}`}
                  </span>
                  <span className="text-white text-sm flex-1 truncate font-medium">{entry.username}</span>
                  <span className="text-white font-black text-sm">{entry.score}</span>
                  <span className="text-white/40 text-xs">days</span>
                </div>
              ))}
              {playerRank && playerRank > 10 && (
                <>
                  <div className="text-center text-white/30 text-xs py-1">···</div>
                  <div
                    className="flex items-center gap-3 px-3 py-2 rounded-lg border border-white/30"
                    style={{ background: 'rgba(255,255,255,0.12)' }}
                  >
                    <span className="text-white/40 text-xs font-bold w-5 text-center">#{playerRank}</span>
                    <span className="text-white text-sm flex-1 truncate font-medium">{username}</span>
                    <span className="text-white font-black text-sm">{result.daysTotal}</span>
                    <span className="text-white/40 text-xs">days</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 max-w-sm w-full flex gap-3">
          <button
            onClick={onTryAgain}
            className="flex-1 py-4 rounded-2xl font-bold text-base border border-white/25 text-white transition-all hover:bg-white/10 active:scale-95"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            Try Again
          </button>
          <button
            onClick={onShare}
            className="flex-1 py-4 rounded-2xl font-black text-base shadow-xl transition-all hover:scale-[1.02] active:scale-95"
            style={{
              background: scenario.accentColor,
              color: '#fff',
              boxShadow: `0 6px 20px ${scenario.accentColor}55`,
            }}
          >
            Share →
          </button>
        </div>
      </div>
    </div>
  );
}
