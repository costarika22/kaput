'use client';

import { useState } from 'react';
import { Scenario } from '@/types';

interface InputScreenProps {
  scenario: Scenario;
  onSubmit: (items: [string, string, string]) => void;
  onBack: () => void;
}

export default function InputScreen({ scenario, onSubmit, onBack }: InputScreenProps) {
  const [item1, setItem1] = useState('');
  const [item2, setItem2] = useState('');
  const [item3, setItem3] = useState('');

  const valid = item1.trim().length > 0 && item2.trim().length > 0 && item3.trim().length > 0;

  function handleSubmit() {
    if (!valid) return;
    onSubmit([item1.trim(), item2.trim(), item3.trim()]);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px',
    background: '#ffffff',
    border: '1px solid #d0d0d0',
    borderRadius: '8px',
    fontFamily: 'var(--font-fira), monospace',
    fontSize: '16px',
    color: '#0a0a0a',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-fira), monospace',
    fontSize: '13px',
    fontWeight: 600,
    color: '#555555',
    display: 'block',
    marginBottom: '8px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  };

  return (
    <div
      className="min-h-screen animated-gradient"
      style={{
        background: `linear-gradient(160deg, ${scenario.bgFrom} 0%, ${scenario.bgTo} 100%)`,
      }}
    >
      <div
        style={{
          maxWidth: '580px',
          margin: '0 auto',
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          padding: '0 20px',
        }}
      >
        {/* Scenario name at top */}
        <div style={{ paddingTop: '56px', textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: 'var(--font-fira), monospace',
              fontSize: '32px',
              fontWeight: 900,
              color: '#0a0a0a',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            {scenario.name}
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-fira), monospace',
              fontSize: '17px',
              fontWeight: 700,
              color: '#0a0a0a',
              marginTop: '16px',
              lineHeight: 1.4,
            }}
          >
            Choose 3 items to maximize how long you survive!
          </p>
        </div>

        {/* Item inputs */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px', padding: '32px 0' }}>
          <div>
            <label style={labelStyle}>Item 1</label>
            <input
              type="text"
              value={item1}
              onChange={(e) => setItem1(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter"
              autoComplete="off"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Item 2</label>
            <input
              type="text"
              value={item2}
              onChange={(e) => setItem2(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter"
              autoComplete="off"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Item 3</label>
            <input
              type="text"
              value={item3}
              onChange={(e) => setItem3(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter"
              autoComplete="off"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Bottom actions */}
        <div style={{ paddingBottom: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button
            onClick={handleSubmit}
            disabled={!valid}
            style={{
              width: '100%',
              padding: '18px',
              background: valid ? '#0a0a0a' : '#d0d0d0',
              color: valid ? '#ffffff' : '#888888',
              fontFamily: 'var(--font-fira), monospace',
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '3px',
              border: 'none',
              borderRadius: '8px',
              cursor: valid ? 'pointer' : 'not-allowed',
              textTransform: 'uppercase',
            }}
          >
            Judge Me
          </button>

          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'var(--font-fira), monospace',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '2px',
              color: '#0a0a0a',
              cursor: 'pointer',
              textTransform: 'uppercase',
              textAlign: 'center',
              padding: '4px',
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
