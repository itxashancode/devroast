-- Create Profiles table
create table public.profiles (
  id text primary key, -- the GitHub username (lowercase)
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Scores table
create table public.scores (
  id text primary key, -- the GitHub username
  profile_id text references public.profiles(id) on delete cascade,
  data jsonb not null,
  roast text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Leaderboard table
create table public.leaderboard (
  id text primary key, -- the GitHub username
  username text not null,
  name text not null,
  avatar_url text not null,
  totalscore integer not null,
  impactscore integer not null,
  activityscore integer not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on all tables
alter table public.profiles enable row level security;
alter table public.scores enable row level security;
alter table public.leaderboard enable row level security;

-- Create policies to allow public read access
create policy "Allow public read access on profiles" on public.profiles for select using (true);
create policy "Allow public read access on scores" on public.scores for select using (true);
create policy "Allow public read access on leaderboard" on public.leaderboard for select using (true);

-- Create policies to allow all actions for service_role (used by API routes)
create policy "Allow service_role full access on profiles" on public.profiles for all using (true) with check (true);
create policy "Allow service_role full access on scores" on public.scores for all using (true) with check (true);
create policy "Allow service_role full access on leaderboard" on public.leaderboard for all using (true) with check (true);
