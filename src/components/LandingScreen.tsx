'use client';

import { useState } from 'react';
import { Scenario } from '@/types';

interface LandingScreenProps {
  scenario: Scenario;
  username: string;
  onUsernameChange: (name: string) => void;
  onStart: () => void;
}

export default function LandingScreen({ scenario, username, onUsernameChange, onStart }: LandingScreenProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(username);
  const [usernameError, setUsernameError] = useState('');
  const [checking, setChecking] = useState(false);

  function startEdit() {
    setEditValue(username);
    setUsernameError('');
    setEditing(true);
  }

  async function handleSave() {
    const trimmed = editValue.trim().toUpperCase();
    if (!trimmed || trimmed === username) {
      setEditing(false);
      return;
    }

    setChecking(true);
    setUsernameError('');

    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      const entries: { username: string }[] = data.entries ?? [];
      const taken = entries.some(
        (e) => e.username.toLowerCase() === trimmed.toLowerCase()
      );

      if (taken) {
        setUsernameError('Username is taken');
        setChecking(false);
        return;
      }

      onUsernameChange(trimmed);
      setEditing(false);
    } catch {
      onUsernameChange(trimmed);
      setEditing(false);
    } finally {
      setChecking(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: `linear-gradient(160deg, ${scenario.bgFrom} 0%, ${scenario.bgTo} 100%)`,
      }}
    >
      {/* Main content area — vertically centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p
          style={{
            fontFamily: 'var(--font-fira), monospace',
            fontSize: '13px',
            letterSpacing: '3px',
            color: '#6a8a9a',
            marginBottom: '12px',
            textTransform: 'uppercase',
          }}
        >
          Today&apos;s Challenge:
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-fira), monospace',
            fontSize: '40px',
            fontWeight: 900,
            color: '#0a0a0a',
            letterSpacing: '2px',
            lineHeight: 1.1,
            marginBottom: '20px',
            textTransform: 'uppercase',
          }}
        >
          {scenario.name}
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-fira), monospace',
            fontSize: '16px',
            color: '#2a2a2a',
            lineHeight: 1.6,
            maxWidth: '340px',
            textAlign: 'center',
          }}
        >
          {scenario.description}
        </p>
      </div>

      {/* Bottom actions */}
      <div className="px-5 pb-8 flex flex-col gap-3">
        {/* PLAY button */}
        <button
          onClick={onStart}
          style={{
            width: '100%',
            padding: '18px',
            background: '#0a0a0a',
            color: '#ffffff',
            fontFamily: 'var(--font-fira), monospace',
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '3px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          Play
        </button>

        {/* Username area */}
        <div>
          {editing ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => {
                    setEditValue(e.target.value.toUpperCase());
                    setUsernameError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  maxLength={24}
                  autoFocus
                  style={{
                    flex: 1,
                    padding: '14px 16px',
                    background: '#ffffff',
                    border: '1px solid #d0d0d0',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-fira), monospace',
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#0a0a0a',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleSave}
                  disabled={checking}
                  style={{
                    width: '48px',
                    height: '48px',
                    background: '#ffffff',
                    border: '1px solid #d0d0d0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    color: '#22a84a',
                    flexShrink: 0,
                  }}
                >
                  ✓
                </button>
              </div>
              {usernameError && (
                <p
                  style={{
                    fontFamily: 'var(--font-fira), monospace',
                    fontSize: '13px',
                    color: '#cc2020',
                    paddingLeft: '4px',
                  }}
                >
                  {usernameError}
                </p>
              )}
            </div>
          ) : (
            <div
              onClick={startEdit}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                background: '#ffffff',
                border: '1px solid #d0d0d0',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-fira), monospace',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#0a0a0a',
                }}
              >
                {username}
              </span>
              <span style={{ color: '#888888', fontSize: '16px' }}>✎</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
