-- Meal plan text fixes
-- ===========================================================================
-- 1. Drops the example fruits and salad vegetables:
--      "Cut fruits (Papaya, Watermelon, Pineapple - whichever available)" -> "Cut fruits"
--      "Cut Salad (Cucumber, Amla)"                                       -> "Cut Salad"
-- 2. Renames "Moong Dal + Veg + Paneer Cheela" -> "Moong Dal Veg Paneer Mix Cheela"
--    (it is one cheela, not three dishes).
-- 3. Dosa batter doesn't need soaking. Week 1 Monday's soak reminder now only
--    mentions Chole, and Dosa Batter moves to that day's stock check.
--
-- How to run: Supabase dashboard -> SQL Editor -> paste this whole file -> Run.
--
-- It only replaces text that still matches the original word for word, so
-- anything an editor has already changed in the app is left alone. Safe to
-- run more than once.

begin;

-- 1 + 2: meals, every day
update public.base_meal_plans
set meals = replace(
              replace(
                replace(
                  meals::text,
                  ' (Papaya, Watermelon, Pineapple - whichever available)', ''),
                ' (Cucumber, Amla)', ''),
              'Moong Dal + Veg + Paneer Cheela', 'Moong Dal Veg Paneer Mix Cheela'
            )::jsonb
where meals::text like any (array[
  '%(Papaya, Watermelon, Pineapple - whichever available)%',
  '%(Cucumber, Amla)%',
  '%Moong Dal + Veg + Paneer Cheela%'
]);

-- 3: reminders, Week 1 Monday only
update public.base_meal_plans
set reminders = replace(
                  replace(
                    reminders::text,
                    'Soak <strong>Chole</strong> and <strong>Dosa Batter</strong> tonight → Tuesday meals',
                    'Soak <strong>Chole</strong> tonight → Tuesday lunch'),
                  -- The closing quote makes this match only the untouched reminder,
                  -- so running the file twice doesn't add Dosa Batter twice.
                  'Check stock: <strong>Paneer, Matar</strong> for tonight’s dinner"',
                  'Check stock: <strong>Paneer, Matar</strong> for tonight’s dinner · <strong>Dosa Batter</strong> for Tue breakfast"'
                )::jsonb
where day = 'Monday'
  and week = 1
  and reminders::text like '%<strong>Dosa Batter</strong> tonight%';

commit;

-- Check the result:
--   select week, day, meals, reminders
--   from public.base_meal_plans
--   order by week, array_position(
--     array['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], day);
