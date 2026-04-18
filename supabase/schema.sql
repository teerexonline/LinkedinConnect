-- Run this in your Supabase SQL editor

-- Startups
create table if not exists public.startups (
  id uuid primary key default gen_random_uuid(),
  linkedin_url text unique not null,
  linkedin_company_id text,
  name text not null,
  description text,
  logo_url text,
  industry text,
  company_size text,
  headquarters text,
  website text,
  follower_count integer default 0,
  featured_post_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User follows (which user followed which startup)
create table if not exists public.user_follows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  startup_id uuid references public.startups(id) on delete cascade not null,
  followed_at timestamptz default now(),
  unique(user_id, startup_id)
);

-- User points
create table if not exists public.user_points (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_points integer default 0,
  updated_at timestamptz default now()
);

-- User profiles (stores LinkedIn OAuth token for API calls)
create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  linkedin_id text,
  linkedin_access_token text,
  linkedin_token_expires_at timestamptz,
  display_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.startups enable row level security;
alter table public.user_follows enable row level security;
alter table public.user_points enable row level security;
alter table public.user_profiles enable row level security;

-- Startups: anyone can read, authenticated users can insert
create policy "Anyone can view startups" on public.startups
  for select using (true);
create policy "Authenticated users can add startups" on public.startups
  for insert with check (auth.role() = 'authenticated');

-- Follows: own rows only
create policy "Users can view their follows" on public.user_follows
  for select using (auth.uid() = user_id);
create policy "Users can insert their follows" on public.user_follows
  for insert with check (auth.uid() = user_id);

-- Points: own row only
create policy "Users can view their points" on public.user_points
  for select using (auth.uid() = user_id);

-- Profiles: own row only
create policy "Users can view their profile" on public.user_profiles
  for select using (auth.uid() = user_id);
create policy "Users can upsert their profile" on public.user_profiles
  for all using (auth.uid() = user_id);

-- Function to award a point
create or replace function public.award_points(p_user_id uuid, p_points int default 1)
returns void language plpgsql security definer as $$
begin
  insert into public.user_points (user_id, total_points)
  values (p_user_id, p_points)
  on conflict (user_id)
  do update set
    total_points = GREATEST(0, user_points.total_points + p_points),
    updated_at = now();
end;
$$;
