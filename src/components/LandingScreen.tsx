'use client';

import { useState, useEffect } from 'react';
import { Scenario, LeaderboardEntry } from '@/types';
import { setUsername } from '@/lib/username';

interface LandingScreenProps {
  scenario: Scenario;
  username: string;
  onUsernameChange: (name: string) => void;
  onStart: () => void;
}

export default function LandingScreen({ scenario, username, onUsernameChange, onStart }: LandingScreenProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(username);
  const [topScore, setTopScore] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTop() {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        if (data.entries && data.entries.length > 0) {
          setTopScore(data.entries[0]);
        }
      } catch {
        // leaderboard unavailable — no problem
      } finally {
        setLoading(false);
      }
    }
    fetchTop();
  }, []);

  function handleEditSave() {
    const trimmed = editValue.trim();
    if (trimmed.length > 0 && trimmed.length <= 24) {
      setUsername(trimmed);
      onUsernameChange(trimmed);
    }
    setEditing(false);
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${scenario.bgFrom} 0%, ${scenario.bgTo} 100%)`,
      }}
    >
      {/* Username top right */}
      <div className="absolute top-4 right-4 z-10">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEditSave()}
              maxLength={24}
              autoFocus
              className="bg-black/30 text-white border border-white/40 rounded-lg px-3 py-1 text-sm font-bold outline-none w-36"
            />
            <button
              onClick={handleEditSave}
              className="text-white/80 text-sm hover:text-white transition-colors font-bold"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setEditValue(username); setEditing(true); }}
            className="flex items-center gap-1.5 bg-black/25 rounded-xl px-3 py-1.5 hover:bg-black/35 transition-all"
          >
            <span className="text-white font-bold text-sm">{username}</span>
            <span className="text-white/60 text-xs">✎</span>
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 text-center">
        {/* Game title */}
        <div className="mb-2">
          <h1 className="text-8xl md:text-9xl" style={{ fontFamily: 'var(--font-bangers), Impact, sans-serif', letterSpacing: '2px', color: scenario.accentColor, textShadow: '4px 4px 0 rgba(0,0,0,0.3)' }}>
            KAPUT
          </h1>
          <p className="text-white/60 text-sm font-medium tracking-widest uppercase mt-1">Daily Survival Game</p>
        </div>

        {/* Scenario card */}
        <div className="mt-8 max-w-md w-full">
          <div
            className="rounded-2xl p-6 border border-white/20 shadow-2xl"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
          >
            <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-2">Today&apos;s Scenario</p>
            <h2 className="text-white font-black text-3xl md:text-4xl mb-3 leading-tight">{scenario.name}</h2>
            <p className="text-white/75 text-sm leading-relaxed">{scenario.description}</p>
          </div>
        </div>

        {/* Top score competitive pressure */}
        <div className="mt-5 max-w-md w-full">
          {!loading && topScore ? (
            <div className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 border border-white/15"
              style={{ background: 'rgba(0,0,0,0.2)' }}>
              <span className="text-yellow-400 text-lg">👑</span>
              <span className="text-white/70 text-sm">
                <span className="font-bold text-white">{topScore.username}</span> is leading with{' '}
                <span className="font-bold text-yellow-300">{topScore.score} days</span>
              </span>
            </div>
          ) : !loading ? (
            <div className="text-white/40 text-sm text-center">No scores yet today. Be the first.</div>
          ) : null}
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="mt-8 px-10 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: scenario.accentColor,
            color: '#fff',
            boxShadow: `0 8px 32px ${scenario.accentColor}66`,
          }}
        >
          Pick Your Items →
        </button>

        <p className="mt-4 text-white/40 text-xs">
          Pick 3 items. Get judged by a monkey. Try to survive.
        </p>
      </div>
    </div>
  );
}
