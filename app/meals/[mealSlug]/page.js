import { getMeal } from "@/lib/meals";
import classes from "./page.module.css";
import Image from "next/image";

export default async function MealsDetail({ params }) {
  const meal = await getMeal(params.mealSlug);
  console.log(meal);

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image alt="" fill />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${"EMAIL"}`}>NAME</a>
          </p>
          <p className={classes.summary}>SUMMARY</p>
        </div>
      </header>
      <main>
        <p
          className={classes.instructions}
          dangerouslySetInnerHTML={{
            __html: "...",
          }}
        ></p>
      </main>
    </>
  );
}
