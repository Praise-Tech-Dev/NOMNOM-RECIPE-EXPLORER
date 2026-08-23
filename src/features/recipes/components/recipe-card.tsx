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
    <Card className="relative w-full min-w-0 overflow-hidden">
      <RecipeLink recipeId={recipe.id} to={`/recipes/${recipe.id}`}>
        <div
          className={variant === "grid" ? "flex flex-col" : "flex sm:flex-row"}
        >
          <div
            className={
              variant === "grid"
                ? "aspect-square w-full overflow-hidden"
                : "aspect-square w-full shrink-0 overflow-hidden sm:w-40"
            }
          >
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full object-cover"
            />
          </div>
          <div className="min-w-0 p-4">
            <div className="line-clamp-2 text-lg font-semibold ">
              {recipe.name}
            </div>
            <div className="text-sm">
              <strong>Cuisine:</strong> {recipe.cuisine},
            </div>
            <div className="text-sm">
              <strong>Difficulty:</strong> {recipe.difficulty},{" "}
            </div>
          </div>
        </div>
      </RecipeLink>
      <button
        type="button"
        aria-label={isSaved ? "Remove from saved recipes" : "Save recipe"}
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
