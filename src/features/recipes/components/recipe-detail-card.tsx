import { useState } from "react";
import type { Recipe } from "../types/recipe.types";
import { Card } from "./Card";
import { recipeStore, toggleSavedRecipe } from "../store/recipe-ui-store";
import { useSelector } from "@tanstack/react-store";
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
    <Card>
      <div className="flex">
        <div className="w-[40%] overflow-hidden aspect-square">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full object-contain"
          />
        </div>
        <div className="p-4">
          <div>{recipe.name}</div>
          <div>
            <strong>Ingredients :</strong>{" "}
            {recipe.ingredients.map((ingredient) => (
              <div key={ingredient}>
                <label>
                  <input
                    type="checkbox"
                    checked={checkedIngredients.includes(ingredient)}
                    onChange={() => handleCheckboxChange(ingredient)}
                  />
                </label>
                {ingredient}
              </div>
            ))}
            <p>
              <strong>Selected: </strong>
              {checkedIngredients.join(", ") || "None"}
            </p>
          </div>
          <ul className="list-disc pl-5">
            {recipe.instructions.map((instruction) => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ul>
          <div className="">
            <strong>Tags: </strong>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <div
                  key={tag}
                  className="px-2 py-1 bg-amber-700/60 font-semibold rounded-lg"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div>
            <strong>Meal Type:</strong>

            {recipe.mealType.map((meal) => (
              <span key={meal}>{meal}</span>
            ))}
          </div>
          <div>
            <strong>Difficulty:</strong> {recipe.difficulty},{" "}
          </div>
          <button
            type="button"
            className="bg-black text-white px-4 py-2 rounded-lg"
            onClick={() => toggleSavedRecipe(recipe.id)}
          >
            {isSaved ? "Unsave" : "Save"}
          </button>
        </div>
      </div>
    </Card>
  );
}
