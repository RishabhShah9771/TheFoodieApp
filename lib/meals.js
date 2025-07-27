import sql from "better-sqlite3"; // Importing better-sqlite3 for SQLite database operations
import slugify from "slugify"; // Importing slugify to generate URL-friendly slugs from meal titles
import xss from "xss"; // Importing xss to sanitize user input and prevent XSS attacks
import fs from "node:fs"; // Importing Node.js file system module to handle image file storage

// Initialize a connection to the SQLite database file named 'meals.db'
const db = sql("meals.db");

/**
 * Fetches all meals from the database.
 * Simulates a delay of 2 seconds to mimic a real-world API/database call.
 * Returns an array of meal objects.
 */
export async function getAllMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network/database latency
  return db.prepare("SELECT * FROM meals").all(); // Retrieve all meal records from the 'meals' table
}

/**
 * Fetches a single meal from the database based on its slug.
 * @param {string} slug - The unique slug identifier for the meal.
 * @returns {object} The meal object if found, otherwise undefined.
 */
export function getMeal(slug) {
  // Simulated delay can be added here if needed (currently commented out)
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug); // Retrieve meal by slug
}

/**
 * Saves a new meal to the database, including handling image upload and sanitization.
 * @param {object} meal - The meal data, including image (as a File/Blob object).
 */
export async function saveMeal(meal) {
  // Generate a URL-friendly slug from the meal title (e.g., "My Meal" -> "my-meal")
  meal.slug = slugify(meal.title, { lower: true });

  // Sanitize the instructions field to prevent XSS attacks
  meal.instructions = xss(meal.instructions);

  // --- Image Handling Section ---
  // Images must be stored in the file system, not in the database.

  // Extract the file extension from the uploaded image's name (e.g., "jpg", "png")
  const extensions = meal.image.name.split(".").pop();

  // Create a unique file name using the slug and the original file extension
  const fileName = `${meal.slug}.${extensions}`;

  // Create a writable stream to save the image in the 'public/images' directory
  const stream = fs.createWriteStream(`public/images/${fileName}`);

  // Convert the uploaded image (File/Blob) to an ArrayBuffer, then to a Buffer for writing
  const bufferedImage = await meal.image.arrayBuffer();
  // arrayBuffer() returns a Promise, so we await it before using the result

  // Write the image buffer to the file system
  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      // If writing fails, throw an error to notify the caller
      throw new Error("Saving Image Failed, Please try again!!!");
    }
  });

  // Instead of storing the image itself in the database, store the relative path to the image file
  meal.image = `/images/${fileName}`;

  // Insert the new meal record into the 'meals' table, including the image path and slug
  db.prepare(
    `
    INSERT INTO meals
  (title,summary,instructions,creator,creator_email,image,slug)
  VALUES (
    @title,
    @summary,
    @instructions,
    @creator,
    @creator_email,
    @image,
    @slug
    )
    `
  ).run(meal);
}
