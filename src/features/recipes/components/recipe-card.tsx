import { useSelector } from "@tanstack/react-store";
import { recipeStore, toggleSavedRecipe } from "../store/recipe-ui-store";
import type { Recipe } from "../types/recipe.types";
import { Card } from "./Card";
import RecipeLink from "./recipe-link";
import { BookmarkIcon } from "lucide-react";
type RecipeCardProps = {
  recipe: Recipe;
  variant: "grid" | "compact";
};

export default function RecipeCard({recipe, variant}: RecipeCardProps) {
  const isSaved = useSelector(
    recipeStore, 
    (state) => state.savedRecipeIds.includes(recipe.id),
  );
  return (
    <Card className="relative max-w-100 flex flex-col items-center justify-center">
      <RecipeLink recipeId={recipe.id} to={`/recipes/${recipe.id}`}>
        <div
          className={
            variant === "grid"
              ? "flex flex-col items-center justify-center"
              : "flex flex-row items-center"
          }
        >
          <div className="w-70 overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full object-contain"
            />
          </div>
          <div className="p-4">
            <div className="text-lg font-semibold ">{recipe.name}</div>
            <div>
              <strong>Cuisine:</strong> {recipe.cuisine},
            </div>
            <div>
              <strong>Difficulty:</strong> {recipe.difficulty},{" "}
            </div>
          </div>
        </div>
      </RecipeLink>
      <button
        type="button"
        className={`text-blue-600 text-bold absolute top-3 right-3 rounded-lg`}
        onClick={() => toggleSavedRecipe(recipe.id)}
      >
        <BookmarkIcon
          size={isSaved ? 30 : 24}
          fill={isSaved ? "currentColor" : "none"}
        />
      </button>
    </Card>
  );
}
