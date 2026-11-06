import { Fragment } from "react";
import { splitDishes } from "@/lib/foodEmoji";

/** Dish names with their food emoji (hidden by CSS when emojis are off). */
export default function MealName({ name }: { name: string }) {
  return (
    <>
      {splitDishes(name).map((dish, i) => (
        <Fragment key={i}>
          {i > 0 && " + "}
          {dish.emoji && (
            <span className="food-emoji" aria-hidden="true">
              {dish.emoji}{" "}
            </span>
          )}
          {dish.name}
        </Fragment>
      ))}
    </>
  );
}
