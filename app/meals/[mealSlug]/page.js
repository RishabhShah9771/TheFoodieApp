import { getMeal } from "@/lib/meals"; // Import the getMeal function to fetch meal data based on the meal slug
import classes from "./page.module.css"; // Import CSS module for styling this page
import Image from "next/image"; // Import Next.js optimized Image component
import { notFound } from "next/navigation"; // Import notFound utility to handle 404 pages

// This function is used by Next.js to generate dynamic metadata (like title and description) for each meal detail page.
// When we need to pass dynamic metadata, we define an async function named generateMetadata.
// Next.js will automatically call this function and use its return value for the page's <head> section.
// The function receives an object with route parameters (params), which we use to fetch the correct meal data.
export async function generateMetadata({ params }) {
  const meal = await getMeal(params.mealSlug); // Fetch the meal data using the mealSlug from the URL

  if (!meal) {
    notFound(); // If no meal is found, trigger a 404 page
  }

  // Return an object with metadata properties for the page
  return {
    title: meal.title, // Set the page title to the meal's title
    description: meal.summary, // Set the meta description to the meal's summary
  };
}

// The main component for the meal detail page.
// This is an async function because we need to fetch meal data before rendering the page.
// The function receives an object with route parameters (params), which we use to fetch the correct meal data.
export default async function MealsDetail({ params }) {
  const meal = await getMeal(params.mealSlug); // Fetch the meal data using the mealSlug from the URL

  if (!meal) {
    notFound(); // If no meal is found, trigger a 404 page
  }

  // Replace all newline characters in the instructions with <br /> tags for proper HTML formatting.
  // This ensures that line breaks in the instructions are rendered correctly in the browser.
  meal.instructions = meal.instructions.replace(/\n/g, "<br />");

  // Render the meal detail page
  return (
    <>
      {/* Header section containing the meal image and basic info */}
      <header className={classes.header}>
        <div className={classes.image}>
          {/* Display the meal image using Next.js Image component for optimized loading */}
          <Image src={meal.image} alt={meal.title} fill />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          {/* Display the creator's name as a mailto link */}
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          {/* Display the meal summary */}
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      {/* Main section containing the meal instructions */}
      <main>
        {/* Render the meal instructions with HTML line breaks.
            We use dangerouslySetInnerHTML to render the HTML string.
            This is safe here because the instructions are sanitized and controlled. */}
        <p
          className={classes.instructions}
          dangerouslySetInnerHTML={{
            __html: meal.instructions,
          }}
        ></p>
      </main>
    </>
  );
}
