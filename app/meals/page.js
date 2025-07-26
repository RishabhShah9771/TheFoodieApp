import Link from "next/link";
import classes from "./page.module.css";
import MealsGrid from "@/components/meals/meals-grid";
import { getAllMeals } from "@/lib/meals";

async function MealsPage() {
  const meals = await getAllMeals();
  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious Meals, Created{" "}
          <span className={classes.highlight}> by you</span>
        </h1>
        <p>
          Choose your favourite recipe and cook it yourself. It is easy and
          delicious!
        </p>
        <p className={classes.cta}>
          <Link href="/meals/share">Share Your Favourite Recipe.</Link>
        </p>
      </header>
      <main className={classes.main}>
        <MealsGrid meals={meals} />
      </main>
    </>
  );
}
export default MealsPage;
