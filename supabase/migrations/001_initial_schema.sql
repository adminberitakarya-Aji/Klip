-- Klip — Initial database schema
-- Run this in Supabase Dashboard → SQL Editor

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- 2. TABLES
-- ============================================================

-- Profiles (extends auth.users)
create table public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  handle      text unique not null,
  display_name text not null,
  avatar_url  text,
  bio         text,
  is_verified boolean default false,
  created_at  timestamptz default now()
);

-- Clips (video posts)
create table public.clips (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles on delete cascade,
  video_url    text not null,
  thumbnail_url text,
  caption      text,
  song         text,
  created_at   timestamptz default now()
);

-- Comments
create table public.comments (
  id         uuid primary key default uuid_generate_v4(),
  clip_id    uuid not null references public.clips on delete cascade,
  user_id    uuid not null references public.profiles on delete cascade,
  text       text not null,
  created_at timestamptz default now()
);

-- Likes (junction table)
create table public.likes (
  clip_id    uuid not null references public.clips on delete cascade,
  user_id    uuid not null references public.profiles on delete cascade,
  created_at timestamptz default now(),
  primary key (clip_id, user_id)
);

-- Follows (junction table)
create table public.follows (
  follower_id  uuid not null references public.profiles on delete cascade,
  following_id uuid not null references public.profiles on delete cascade,
  created_at   timestamptz default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

-- ============================================================
-- 3. INDEXES
-- ============================================================
create index idx_clips_user_id on public.clips (user_id);
create index idx_clips_created_at on public.clips (created_at desc);
create index idx_comments_clip_id on public.comments (clip_id);
create index idx_likes_clip_id on public.likes (clip_id);
create index idx_likes_user_id on public.likes (user_id);
create index idx_follows_follower on public.follows (follower_id);
create index idx_follows_following on public.follows (following_id);

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.clips enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.follows enable row level security;

-- Profiles: anyone can read, owner can update
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Clips: anyone can read, owner can insert/delete
create policy "Clips are viewable by everyone"
  on public.clips for select using (true);

create policy "Users can insert own clips"
  on public.clips for insert with check (auth.uid() = user_id);

create policy "Users can delete own clips"
  on public.clips for delete using (auth.uid() = user_id);

-- Comments: anyone can read, owner can insert/delete
create policy "Comments are viewable by everyone"
  on public.comments for select using (true);

create policy "Users can insert own comments"
  on public.comments for insert with check (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.comments for delete using (auth.uid() = user_id);

-- Likes: anyone can read, owner can insert/delete
create policy "Likes are viewable by everyone"
  on public.likes for select using (true);

create policy "Users can insert own likes"
  on public.likes for insert with check (auth.uid() = user_id);

create policy "Users can delete own likes"
  on public.likes for delete using (auth.uid() = user_id);

-- Follows: anyone can read, owner can insert/delete
create policy "Follows are viewable by everyone"
  on public.follows for select using (true);

create policy "Users can follow others"
  on public.follows for insert with check (auth.uid() = follower_id);

create policy "Users can unfollow others"
  on public.follows for delete using (auth.uid() = follower_id);

-- ============================================================
-- 5. STORAGE BUCKETS
-- ============================================================

insert into storage.buckets (id, name, public) values ('videos', 'videos', true);
insert into storage.buckets (id, name, public) values ('thumbnails', 'thumbnails', true);

-- Storage policies: anyone can read, authenticated can upload
create policy "Videos are publicly accessible"
  on storage.objects for select using (bucket_id = 'videos');

create policy "Authenticated users can upload videos"
  on storage.objects for insert
  with check (bucket_id = 'videos' and auth.role() = 'authenticated');

create policy "Thumbnails are publicly accessible"
  on storage.objects for select using (bucket_id = 'thumbnails');

create policy "Authenticated users can upload thumbnails"
  on storage.objects for insert
  with check (bucket_id = 'thumbnails' and auth.role() = 'authenticated');

-- ============================================================
-- 6. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, handle, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'handle', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 7. HELPER FUNCTIONS
-- ============================================================

-- Get feed clips with profile, counts, and like status
create or replace function public.get_feed(
  p_user_id uuid default null,
  p_cursor timestamptz default null,
  p_limit int default 10
)
returns table (
  id uuid,
  user_id uuid,
  video_url text,
  thumbnail_url text,
  caption text,
  song text,
  created_at timestamptz,
  profiles jsonb,
  likes_count bigint,
  comments_count bigint,
  is_liked boolean
) as $$
begin
  return query
  select
    c.id,
    c.user_id,
    c.video_url,
    c.thumbnail_url,
    c.caption,
    c.song,
    c.created_at,
    jsonb_build_object(
      'id', p.id,
      'handle', p.handle,
      'display_name', p.display_name,
      'avatar_url', p.avatar_url,
      'bio', p.bio,
      'is_verified', p.is_verified,
      'created_at', p.created_at
    ) as profiles,
    (select count(*) from public.likes where clip_id = c.id) as likes_count,
    (select count(*) from public.comments where clip_id = c.id) as comments_count,
    case when p_user_id is not null
      then exists(select 1 from public.likes where clip_id = c.id and user_id = p_user_id)
      else false
    end as is_liked
  from public.clips c
  join public.profiles p on p.id = c.user_id
  where (p_cursor is null or c.created_at < p_cursor)
  order by c.created_at desc
  limit p_limit;
end;
$$ language plpgsql security definer;

-- Get profile with stats
create or replace function public.get_profile_stats(p_profile_id uuid, p_current_user_id uuid default null)
returns table (
  id uuid,
  handle text,
  display_name text,
  avatar_url text,
  bio text,
  is_verified boolean,
  created_at timestamptz,
  followers_count bigint,
  following_count bigint,
  total_likes bigint,
  is_following boolean
) as $$
begin
  return query
  select
    p.id,
    p.handle,
    p.display_name,
    p.avatar_url,
    p.bio,
    p.is_verified,
    p.created_at,
    (select count(*) from public.follows where following_id = p.id) as followers_count,
    (select count(*) from public.follows where follower_id = p.id) as following_count,
    (select count(*) from public.likes l join public.clips c on c.id = l.clip_id where c.user_id = p.id) as total_likes,
    case when p_current_user_id is not null
      then exists(select 1 from public.follows where follower_id = p_current_user_id and following_id = p.id)
      else false
    end as is_following
  from public.profiles p
  where p.id = p_profile_id;
end;
$$ language plpgsql security definer;
