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
      className="min-h-screen animated-gradient"
      style={{
        background: `linear-gradient(160deg, ${scenario.bgFrom} 0%, ${scenario.bgTo} 100%)`,
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          padding: '0 20px',
        }}
      >
        {/* Main content area — vertically centered */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '40px' }}>
          <p
            style={{
              fontFamily: 'var(--font-fira), monospace',
              fontSize: '13px',
              letterSpacing: '3px',
              color: 'rgba(0,0,0,0.45)',
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
        <div style={{ paddingBottom: '40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ position: 'relative' }}>
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
                      width: '100%',
                      padding: '14px 48px 14px 16px',
                      background: '#ffffff',
                      border: '1px solid #d0d0d0',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-fira), monospace',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#0a0a0a',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    onClick={handleSave}
                    disabled={checking}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: checking ? 'not-allowed' : 'pointer',
                      color: '#22a84a',
                      fontSize: '20px',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      lineHeight: 1,
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
