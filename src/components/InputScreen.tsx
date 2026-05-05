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
  const [touched, setTouched] = useState(false);

  const valid = item1.trim().length > 0 && item2.trim().length > 0 && item3.trim().length > 0;

  function handleSubmit() {
    setTouched(true);
    if (!valid) return;
    onSubmit([item1.trim(), item2.trim(), item3.trim()]);
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: `linear-gradient(160deg, ${scenario.bgFrom} 0%, ${scenario.bgTo} 100%)`,
      }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-white/60 hover:text-white transition-colors text-sm font-bold flex items-center gap-1"
        >
          ← Back
        </button>
        <div className="flex-1" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
        {/* Scenario reminder */}
        <div className="text-center mb-8 max-w-sm">
          <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-1">Surviving</p>
          <h2 className="text-white font-black text-2xl md:text-3xl">{scenario.name}</h2>
        </div>

        {/* Input card */}
        <div
          className="w-full max-w-sm rounded-2xl p-6 border border-white/20 shadow-2xl"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
        >
          <p className="text-white/70 text-sm mb-5 leading-relaxed">
            Choose 3 items you would bring to survive. Be strategic — or creative. The monkey will judge you either way.
          </p>

          <div className="space-y-4">
            {[
              { label: 'Item 1', value: item1, set: setItem1 },
              { label: 'Item 2', value: item2, set: setItem2 },
              { label: 'Item 3', value: item3, set: setItem3 },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label className="text-white/60 text-xs uppercase tracking-widest font-semibold block mb-1.5">
                  {label}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className={`w-full bg-white/10 text-white border rounded-xl px-4 py-3 text-base font-medium outline-none transition-all focus:bg-white/15 ${
                    touched && value.trim().length === 0
                      ? 'border-red-400/60 focus:border-red-400'
                      : 'border-white/20 focus:border-white/50'
                  }`}
                  autoComplete="off"
                />
                {touched && value.trim().length === 0 && (
                  <p className="text-red-400 text-xs mt-1">Required</p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full py-4 rounded-2xl font-black text-lg shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
            style={{
              background: valid ? scenario.accentColor : 'rgba(255,255,255,0.15)',
              color: '#fff',
              boxShadow: valid ? `0 6px 24px ${scenario.accentColor}55` : 'none',
            }}
          >
            Judge Me →
          </button>
        </div>
      </div>
    </div>
  );
}
