import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await req.json();
    const { username, score, scenario, attemptNumber } = body as {
      username: string;
      score: number;
      scenario: string;
      attemptNumber: number;
    };

    if (!username || typeof score !== 'number' || !scenario) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase.from('scores').insert({
      username: username.slice(0, 50),
      score: Math.max(0, Math.round(score)),
      scenario: scenario.slice(0, 100),
      attempt_number: Math.max(1, Math.round(attemptNumber)),
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[score] error:', err);
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}
