import { createClient } from "@supabase/supabase-js";
import { mealPlan } from "../data/mealPlan";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Run with: npx dotenv -e .env.local -- npx tsx scripts/seed.ts"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function seed() {
  console.log(`Seeding ${mealPlan.length} base meal plan entries...`);

  const rows = mealPlan.map((dp) => ({
    day: dp.day,
    week: dp.week,
    meals: dp.meals,
    reminders: dp.reminders ?? null,
  }));

  const { data, error } = await supabase
    .from("base_meal_plans")
    .upsert(rows, { onConflict: "day,week" })
    .select();

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Done! Inserted/updated ${data.length} rows.`);
  data.forEach((r) => console.log(`  ${r.day} Week ${r.week} → ${r.id}`));
}

seed();
