import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Extend Vercel function timeout (hobby plan default is 10s — too short for AI calls)
export const maxDuration = 60;

// Replay penalty multipliers
function getPenaltyMultiplier(attempt: number): { mult: number; label: string | null } {
  if (attempt <= 2) return { mult: 1.0, label: null };
  if (attempt === 3) return { mult: 0.9, label: 'Replay Penalty -10%' };
  if (attempt === 4) return { mult: 0.8, label: 'Replay Penalty -20%' };
  return { mult: 0.7, label: 'Maximum Replay Penalty -30%' };
}

export async function POST(req: NextRequest) {
  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const body = await req.json();
    const { items, scenarioName, scenarioDescription, attemptNumber } = body as {
      items: [string, string, string];
      scenarioName: string;
      scenarioDescription: string;
      attemptNumber: number;
    };

    if (!items || items.length !== 3 || items.some((i: string) => !i?.trim())) {
      return NextResponse.json({ error: 'Three items required' }, { status: 400 });
    }

    const systemPrompt = `You are the Monkey — a survival scenario judge with a Victorian, formally well-spoken manner concealing barely-controlled passive-aggressive contempt. You are completely indifferent to whether the player survives or dies. You deliver dry deadpan judgments, occasionally with puns, always in complete sentences. You are slightly unhinged beneath the polished surface. You never show excitement. Even a perfect score gets a measured, faintly inconvenienced response. You never list the player's items back at them.

Your job is to evaluate three survival items for a given scenario and return a JSON object.

Scoring rules:
- Score each item 1-100 for how useful it is specifically in the given survival scenario
- Determine if the 3 items together cover 3 or more distinct survival categories from: Fire/Warmth, Shelter, Water, Food, Defense, Navigation/Signaling, Medical
- Calculate total days survived: sum of the three item scores, minimum 3, no hard max
- Apply combo bonus of +20 days if 3+ categories are covered
- Generate one single-line verdict in the monkey's voice (never reference items directly)

Return ONLY valid JSON, no markdown, no explanation:
{
  "itemScores": [score1, score2, score3],
  "comboBonus": true/false,
  "daysTotal": number,
  "verdict": "one line in monkey's voice"
}`;

    const userPrompt = `Scenario: ${scenarioName}
Description: ${scenarioDescription}

Player's 3 items:
1. ${items[0]}
2. ${items[1]}
3. ${items[2]}

Judge these items and return your JSON verdict.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const rawText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON robustly
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate and sanitize
    const itemScores: [number, number, number] = [
      Math.max(1, Math.min(100, Math.round(parsed.itemScores?.[0] ?? 30))),
      Math.max(1, Math.min(100, Math.round(parsed.itemScores?.[1] ?? 30))),
      Math.max(1, Math.min(100, Math.round(parsed.itemScores?.[2] ?? 30))),
    ];
    const comboBonus: boolean = Boolean(parsed.comboBonus);
    const baseScore = itemScores.reduce((a, b) => a + b, 0) + (comboBonus ? 20 : 0);

    // Apply replay penalty
    const { mult, label } = getPenaltyMultiplier(attemptNumber);
    const penaltiedScore = Math.max(3, Math.round(baseScore * mult));

    const verdict: string = typeof parsed.verdict === 'string'
      ? parsed.verdict.slice(0, 200)
      : 'I have rendered my judgment. You are welcome.';

    return NextResponse.json({
      itemScores,
      comboBonus,
      daysTotal: penaltiedScore,
      verdict,
      attemptNumber,
      penaltyApplied: mult < 1,
      penaltyLabel: label,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[judge] error:', err);
    return NextResponse.json(
      { error: 'Judgment failed', detail: message },
      { status: 500 }
    );
  }
}
