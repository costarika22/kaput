export interface Scenario {
  id: number;
  name: string;
  description: string;
  bgFrom: string;
  bgTo: string;
  textColor: string;
  accentColor: string;
}

export type MonkeyMood = 'devastated' | 'disappointed' | 'neutral' | 'impressed' | 'euphoric';

export interface JudgmentResult {
  itemScores: [number, number, number];
  comboBonus: boolean;
  daysTotal: number;
  verdict: string;
  attemptNumber: number;
  penaltyApplied: boolean;
  penaltyLabel: string | null;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  scenario: string;
  attempt_number: number;
  created_at: string;
}

export type Screen = 'landing' | 'input' | 'loading' | 'results' | 'share';
