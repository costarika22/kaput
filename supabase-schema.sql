-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  score integer not null,
  scenario text not null,
  attempt_number integer not null default 1,
  created_at timestamptz not null default now()
);

-- Index for fast daily leaderboard queries
create index if not exists scores_created_at_idx on scores (created_at desc);
create index if not exists scores_score_idx on scores (score desc);

-- Enable Row Level Security
alter table scores enable row level security;

-- Allow anyone to read scores (public leaderboard)
create policy "Anyone can read scores"
  on scores for select
  using (true);

-- Allow anyone to insert scores (no auth required)
create policy "Anyone can insert scores"
  on scores for insert
  with check (true);
