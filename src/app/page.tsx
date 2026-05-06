'use client';

import { useState, useEffect, useCallback } from 'react';
import { Screen, JudgmentResult } from '@/types';
import { getTodayScenario } from '@/lib/scenarios';
import { getUsername, setUsername as saveUsername, incrementTodayAttemptCount } from '@/lib/username';
import SplashScreen from '@/components/SplashScreen';
import LandingScreen from '@/components/LandingScreen';
import InputScreen from '@/components/InputScreen';
import LoadingScreen from '@/components/LoadingScreen';
import ResultsScreen from '@/components/ResultsScreen';
import ShareCard from '@/components/ShareCard';

export default function GamePage() {
  const scenario = getTodayScenario();
  const [screen, setScreen] = useState<Screen>('splash');
  const [username, setUsernameState] = useState('');
  const [items, setItems] = useState<[string, string, string]>(['', '', '']);
  const [result, setResult] = useState<JudgmentResult | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUsernameState(getUsername());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setScreen('landing'), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Paint the scenario gradient on <html> so it covers the full scrollable document
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--scene-bg',
      `linear-gradient(160deg, ${scenario.bgFrom} 0%, ${scenario.bgTo} 100%)`
    );
  }, [scenario.bgFrom, scenario.bgTo]);

  // Reset scroll position on every screen transition
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  function handleUsernameChange(name: string) {
    saveUsername(name);
    setUsernameState(name);
  }

  const handleSubmitItems = useCallback(async (submittedItems: [string, string, string]) => {
    setItems(submittedItems);
    setError(null);
    setScreen('loading');

    const attemptNumber = incrementTodayAttemptCount();

    try {
      const judgeRes = await fetch('/api/judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: submittedItems,
          scenarioName: scenario.name,
          scenarioDescription: scenario.description,
          attemptNumber,
        }),
      });

      if (!judgeRes.ok) {
        const errBody = await judgeRes.json().catch(() => ({}));
        throw new Error(errBody.detail || errBody.error || 'Judgment failed');
      }
      const judgment: JudgmentResult = await judgeRes.json();
      setResult(judgment);

      // Save score (fire and forget)
      const currentUsername = getUsername();
      fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUsername,
          score: judgment.daysTotal,
          scenario: scenario.name,
          attemptNumber,
        }),
      }).catch(() => {});

      // Fetch rank after score saves
      setTimeout(async () => {
        try {
          const lbRes = await fetch(`/api/leaderboard?username=${encodeURIComponent(currentUsername)}`);
          const lbData = await lbRes.json();
          setRank(lbData.playerRank ?? null);
        } catch {
          // rank unavailable — fine
        }
      }, 800);

      setScreen('results');
    } catch (err) {
      console.error(err);
      setError('The monkey is temporarily unavailable. Please try again.');
      setScreen('input');
    }
  }, [scenario]);

  return (
    <main className="min-h-screen">
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600/90 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-xl backdrop-blur">
          {error}
        </div>
      )}

      {screen === 'splash' && <SplashScreen scenario={scenario} />}

      {screen === 'landing' && (
        <LandingScreen
          scenario={scenario}
          username={username}
          onUsernameChange={handleUsernameChange}
          onStart={() => setScreen('input')}
        />
      )}

      {screen === 'input' && (
        <InputScreen
          scenario={scenario}
          onSubmit={handleSubmitItems}
          onBack={() => setScreen('landing')}
        />
      )}

      {screen === 'loading' && (
        <LoadingScreen scenario={scenario} />
      )}

      {(screen === 'results' || screen === 'share') && result && (
        <ResultsScreen
          scenario={scenario}
          items={items}
          result={result}
          username={username}
          onTryAgain={() => { setResult(null); setScreen('input'); }}
          onShare={() => setScreen('share')}
          sharingActive={screen === 'share'}
        />
      )}

      {screen === 'share' && result && (
        <ShareCard
          scenario={scenario}
          result={result}
          username={username}
          rank={rank}
          onBack={() => setScreen('results')}
        />
      )}
    </main>
  );
}
