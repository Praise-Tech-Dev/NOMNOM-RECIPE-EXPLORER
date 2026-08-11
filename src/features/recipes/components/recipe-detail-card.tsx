import type { Recipe } from "../types/recipe.types";
import { Card } from "./Card";
type RecipeDetailsCardProps = {
  recipe: Recipe;
};

export default function RecipeDetailsCard({recipe}: RecipeDetailsCardProps) {
  return (
    <Card>
      <div className="">
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
            <strong>Ingredients :</strong> {recipe.ingredients.map((ingredient) => (
                <div key={ingredient}>{ingredient}</div>
            ))}
          </div>
          <div>
            <strong>Difficulty:</strong> {recipe.difficulty},{" "}
          </div>
        </div>
      </div>
    </Card>
  );
}
