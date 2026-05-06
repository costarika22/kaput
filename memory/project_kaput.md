---
name: Kaput Project
description: Daily survival game built with Next.js, Anthropic API, Supabase
type: project
---

Kaput is a fully built daily survival scenario web game located at /Users/sarikagoel/Desktop/Kaput.

**Stack:** Next.js 16 (App Router), React 19, Tailwind v4, Supabase, Anthropic SDK, html2canvas

**Key details:**
- 19 daily scenarios rotated by UTC date
- AI judge via claude-sonnet-4-20250514 (server-side API route)
- Supabase leaderboard (daily reset via UTC date filter)
- Share card via html2canvas
- Username stored in localStorage (adjective + animal format)

**Why:** Built from scratch in one session per user specification.

**How to apply:** Reference this for any follow-up work on Kaput features, bug fixes, or deployment help.

**Dev server:** `npm run dev` (uses `node ./node_modules/next/dist/bin/next dev` — bypasses Node.js v25 symlink issue)

**Still needed from user:** ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local; Supabase table created via supabase-schema.sql; GitHub repo creation and push; Vercel deployment.
