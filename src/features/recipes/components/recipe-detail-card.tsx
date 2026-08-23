import { useState } from "react";
import type { Recipe } from "../types/recipe.types";
import { Card } from "./Card";
import { recipeStore, toggleSavedRecipe } from "../store/recipe-ui-store";
import { useSelector } from "@tanstack/react-store";
import { BookmarkIcon } from "lucide-react";
type RecipeDetailsCardProps = {
  recipe: Recipe;
};

export default function RecipeDetailsCard({recipe}: RecipeDetailsCardProps) {
    const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);

    const handleCheckboxChange = (ingredient: string) => {
        setCheckedIngredients((prevCheckedIngredients) =>
          prevCheckedIngredients.includes(ingredient)
            ? prevCheckedIngredients.filter((item) => item !== ingredient)
            : [...prevCheckedIngredients, ingredient],
        );
    }

    const isSaved = useSelector(
      recipeStore,
      (state) => state.savedRecipeIds.includes(recipe.id)
    )
  return (
    <Card variant="plain">
      <div className="grid gap-6 md:grid-cols-2">
        {/* recipe image  */}
        <div className="overflow-hidden aspect-square">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* recipe details  */}
        <div className=" space-y-4 py-4">
          <div className="flex flex-wrap gap-3 justify-between items-start">
            <h1 className="text-2xl font-bold md:text-3xl">{recipe.name}</h1>
            <button
              type="button"
              className={`text-blue-600 text-bold rounded-lg lg:pr-10`}
              onClick={() => toggleSavedRecipe(recipe.id)}
            >
              <BookmarkIcon
                size={isSaved ? 36 : 30}
                fill={isSaved ? "currentColor" : "none"}
              />
            </button>
          </div>

          <div className="space-y-2">
            <div className="">
              <strong className="text-[16px] md:text-xl">Ingredients :</strong>
              {recipe.ingredients.map((ingredient) => (
                <div key={ingredient} className="flex gap-2">
                  <label>
                    <input
                      type="checkbox"
                      checked={checkedIngredients.includes(ingredient)}
                      onChange={() => handleCheckboxChange(ingredient)}
                    />
                  </label>
                  <div className="">{ingredient}</div>
                </div>
              ))}
            </div>
            <p>
              <strong>Selected: </strong>
              {checkedIngredients.length || "No"} ingredients selected
            </p>
          </div>
          <div className="">
            <strong className="text-[16px] md:text-xl">Instructions</strong>
            <ul className="list-disc pl-5 flex flex-wrap">
              {recipe.instructions.map((instruction) => (
                <li key={instruction}>{instruction}</li>
              ))}
            </ul>
          </div>

          <div className="">
            <strong className="text-[16px] md:text-xl">Tags: </strong>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <div key={tag} className="px-2 py-1 bg-amber-700/40 rounded-lg">
                  {tag}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 ">
              <div className="flex flex-wrap">
                <strong>Meal Type: </strong>

                {recipe.mealType.map((meal) => (
                  <span key={meal}>{meal}</span>
                ))}
              </div>
              <span>
                <strong>Difficulty:</strong> {recipe.difficulty}
              </span>

              <span>
                <strong>Rating:</strong> {recipe.rating}
              </span>

              <span>
                <strong>Prep:</strong> {recipe.prepTimeMinutes} min
              </span>

              <span>
                <strong>Cook:</strong> {recipe.cookTimeMinutes} min
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
