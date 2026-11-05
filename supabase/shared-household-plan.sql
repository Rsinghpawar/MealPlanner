-- Shared household meal plan
-- ===========================================================================
-- Makes base_meal_plans the one plan everyone sees (signed in or not), and
-- lets only the accounts listed in plan_editors change it.
--
-- How to run: Supabase dashboard -> SQL Editor -> paste this whole file ->
-- replace the email in step 3 -> Run. It runs as one transaction: if anything
-- fails (including "no editors were added"), nothing is changed.
--
-- Run it BEFORE deploying the app version that edits the shared plan.
-- Safe to run again; every step is idempotent.
--
-- user_meal_plan_edits (the old per-user edits) is left in place but is no
-- longer used by the app. See the end of the file to drop it later.

begin;

-- 1. Who may edit -----------------------------------------------------------
create table if not exists public.plan_editors (
  user_id uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);

alter table public.plan_editors enable row level security;

-- Signed-in users can check whether they are an editor (the app uses this to
-- show the edit buttons); nobody can read the rest of the list.
drop policy if exists "Editors can see their own row" on public.plan_editors;
create policy "Editors can see their own row"
  on public.plan_editors for select
  to authenticated
  using (user_id = (select auth.uid()));

-- The list itself is managed only from the dashboard (SQL Editor).
revoke all on public.plan_editors from anon, authenticated;
grant select on public.plan_editors to authenticated;

-- 2. The shared plan --------------------------------------------------------
alter table public.base_meal_plans
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.touch_base_meal_plan()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists touch_base_meal_plan on public.base_meal_plans;
create trigger touch_base_meal_plan
  before update on public.base_meal_plans
  for each row execute function public.touch_base_meal_plan();

alter table public.base_meal_plans enable row level security;

-- Replace whatever policies the table had with exactly the two below, so no
-- older, broader policy keeps working alongside them.
do $$
declare
  p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'base_meal_plans'
  loop
    execute format('drop policy %I on public.base_meal_plans', p.policyname);
  end loop;
end $$;

create policy "Anyone can read the meal plan"
  on public.base_meal_plans for select
  to anon, authenticated
  using (true);

create policy "Editors can change the meal plan"
  on public.base_meal_plans for update
  to authenticated
  using ((select auth.uid()) in (select user_id from public.plan_editors))
  with check ((select auth.uid()) in (select user_id from public.plan_editors));

-- The app can read every row, and editors can change only meals and
-- reminders: not the day, week or id, and nobody can add or delete days.
revoke all on public.base_meal_plans from anon, authenticated;
grant select on public.base_meal_plans to anon, authenticated;
grant update (meals, reminders) on public.base_meal_plans to authenticated;

-- 3. Add the editors --------------------------------------------------------
-- >>> Replace you@example.com with the email you log in with. For more than
-- >>> one editor: where email in ('first@example.com', 'second@example.com')
insert into public.plan_editors (user_id)
select id from auth.users
where email in ('you@example.com')
on conflict (user_id) do nothing;

do $$
begin
  if not exists (select 1 from public.plan_editors) then
    raise exception 'No editors were added. In step 3, replace you@example.com with the email you log in with, then run the file again.';
  end if;
end $$;

-- 4. Carry over existing edits ---------------------------------------------
-- Editors' private edits become the shared plan. If two editors changed the
-- same day, the most recent edit wins. Other accounts' edits are ignored.
do $$
begin
  if to_regclass('public.user_meal_plan_edits') is not null then
    update public.base_meal_plans b
    set meals = e.meals,
        reminders = e.reminders
    from (
      select distinct on (day, week) day, week, meals, reminders
      from public.user_meal_plan_edits
      where user_id in (select user_id from public.plan_editors)
      order by day, week, updated_at desc
    ) e
    where b.day = e.day and b.week = e.week;
  end if;
end $$;

commit;

-- Afterwards -----------------------------------------------------------------
-- Check who can edit:
--   select u.email, pe.added_at
--   from public.plan_editors pe join auth.users u on u.id = pe.user_id;
--
-- Add another editor later (they need an account first):
--   insert into public.plan_editors (user_id)
--   select id from auth.users where email = 'someone@example.com'
--   on conflict do nothing;
--
-- Once you're happy with the shared plan, remove the old per-user edits:
--   drop table public.user_meal_plan_edits;
