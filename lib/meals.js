import sql from "better-sqlite3";

const db = sql("meals.db");

export async function getAllMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return db.prepare("SELECT * FROM meals").all();
}

export async function getMeal(slug) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const meal = db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);

  return meal;
}
