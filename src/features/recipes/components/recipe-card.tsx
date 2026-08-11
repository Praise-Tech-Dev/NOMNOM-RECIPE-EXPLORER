import type { Recipe } from "../types/recipe.types";
import { Card } from "./Card";
type RecipeCardProps = {
  recipe: Recipe;
};

export default function RecipeCard({recipe}: RecipeCardProps) {
  return (
    <Card>
      <span className="">
        <div className="w-70 overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full object-contain"
          />
        </div>
        <div className="p-4">
          <div>{recipe.name}</div>
          <div>
            <strong>Cuisine:</strong> {recipe.cuisine},
          </div>
          <div>
            <strong>Difficulty:</strong> {recipe.difficulty},{" "}
          </div>
        </div>
      </span>
    </Card>
  );
}
