-- Run once in the new thesis test project's SQL Editor.
begin;
create table if not exists public.comments (
 id uuid primary key default gen_random_uuid(),
 post_id text not null check(post_id in ('A','B','C')),
 user_id uuid not null default auth.uid() references auth.users(id),
 display_name text not null check(char_length(display_name) between 1 and 40),
 body text not null check(char_length(trim(body)) between 1 and 4000),
 image_anchor jsonb,
 quoted_text text,
 quoted_comment_id uuid references public.comments(id),
 created_at timestamptz not null default now()
);
alter table public.comments add column if not exists room_id text not null default 'shared';
alter table public.comments add column if not exists kind text not null default 'comment';
alter table public.comments add column if not exists metadata jsonb not null default '{}'::jsonb;
create index if not exists comments_room_post_time_idx on public.comments(room_id,post_id,created_at);
alter table public.comments enable row level security;
drop policy if exists "Read shared test comments" on public.comments;
drop policy if exists "Publish as your own identity" on public.comments;
drop policy if exists comments_read on public.comments;
drop policy if exists comments_insert on public.comments;
create policy comments_read on public.comments for select to authenticated
 using(room_id='shared' or room_id=(select auth.uid())::text);
create policy comments_insert on public.comments for insert to authenticated
 with check(user_id=(select auth.uid()) and (room_id='shared' or room_id=(select auth.uid())::text));
revoke all on public.comments from anon,authenticated;
grant select on public.comments to authenticated;
grant insert(id,post_id,user_id,display_name,body,image_anchor,quoted_text,quoted_comment_id,room_id,kind,metadata) on public.comments to authenticated;

create table if not exists public.study_sessions (
 id uuid primary key,
 user_id uuid not null references auth.users(id),
 participant_code text not null check(participant_code ~ '^P[0-9]{3,6}$'),
 completed boolean not null default false,
 payload jsonb not null,
 created_at timestamptz not null default now()
);
alter table public.study_sessions enable row level security;
drop policy if exists study_owner_read on public.study_sessions;
drop policy if exists study_owner_insert on public.study_sessions;
drop policy if exists study_owner_update on public.study_sessions;
create policy study_owner_read on public.study_sessions for select to authenticated using(user_id=(select auth.uid()));
create policy study_owner_insert on public.study_sessions for insert to authenticated with check(user_id=(select auth.uid()));
create policy study_owner_update on public.study_sessions for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
revoke all on public.study_sessions from anon,authenticated;
grant select on public.study_sessions to authenticated;
grant insert(id,user_id,participant_code,completed,payload) on public.study_sessions to authenticated;
grant update(id,user_id,participant_code,completed,payload) on public.study_sessions to authenticated;
do $$ begin
 if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='comments') then
  alter publication supabase_realtime add table public.comments;
 end if;
end $$;
commit;
