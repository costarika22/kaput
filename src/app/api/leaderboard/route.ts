import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    // Today's UTC date bounds
    const now = new Date();
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const endOfDay = new Date(startOfDay.getTime() + 86400000);

    const { data: entries, error } = await supabase
      .from('scores')
      .select('id, username, score, scenario, attempt_number, created_at')
      .gte('created_at', startOfDay.toISOString())
      .lt('created_at', endOfDay.toISOString())
      .order('score', { ascending: false })
      .limit(100);

    if (error) throw error;

    const top10 = (entries || []).slice(0, 10);

    let playerRank: number | null = null;
    if (username) {
      const idx = (entries || []).findIndex((e) => e.username === username);
      if (idx !== -1) playerRank = idx + 1;
    }

    return NextResponse.json({ entries: top10, playerRank });
  } catch (err) {
    console.error('[leaderboard] error:', err);
    return NextResponse.json({ entries: [], playerRank: null });
  }
}
