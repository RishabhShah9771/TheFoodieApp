"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

export default async function shareMeal(prevState, formdata) {
  function formValidation(text) {
    return !text || text.trim() === "";
  }
  // This will run the function on the server by adding this directive in the function and also it need to be a async function
  // This function is passed to action of the form and then the form submition is handled in there.
  const meal = {
    title: formdata.get("title"),
    summary: formdata.get("summary"),
    instructions: formdata.get("instructions"),
    image: formdata.get("image"),
    creator: formdata.get("name"),
    creator_email: formdata.get("email"),
    // Passing the field names in the get method of the form.
  };

  if (
    formValidation(meal.title) ||
    formValidation(meal.summary) ||
    formValidation(meal.instructions) ||
    formValidation(meal.creator) ||
    formValidation(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    meal.image.size === 0
  ) {
    return {
      message: "Invalid Input.. Please enter valid Details..",
      // this return objects should not have any method or it will get lost while executing.
      // Only use simple values.
    };
  }

  await saveMeal(meal);
  // Server actions are not compitable with client directive. but that can be solved by creating a seperate compoenent and the can call the function in the required places.
  revalidatePath("/", "layout");
  // It is used for the next to stop the instant loading the previous page, instead it will check again then the data is displayed.
  // It will also partially clear the cache when any new data is added from the form input from user.
  
  redirect("/meals");
}
