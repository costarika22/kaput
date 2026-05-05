# KAPUT

A daily survival scenario game. Pick 3 items, get judged by a feral monkey, survive as long as you can.

## Stack

- Next.js 16 + React 19
- Tailwind CSS v4
- Supabase (leaderboard)
- Anthropic API — `claude-sonnet-4-20250514` (AI judge)

## Setup

```bash
cp .env.local.example .env.local
# Fill in your keys, then:
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

## Database

Run `supabase-schema.sql` in your Supabase SQL Editor to create the `scores` table.
