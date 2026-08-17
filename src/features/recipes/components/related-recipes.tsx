import { useSelector } from "@tanstack/react-store";
import { ErrorState } from "../../../shared/components/error-state";
import { LoadingIndicator } from "../../../shared/components/loading-indicator";
import { useRecipes } from "../queries/use-recipes";
import type { Recipe } from "../types/recipe.types";
import RecipeCard from "./recipe-card";
import { recipeStore } from "../store/recipe-ui-store";


type RelatedRecipesProps ={
    recipe: Recipe;
}

export default function RelatedRecipes({recipe}: RelatedRecipesProps) {
    const tag = recipe.tags[0];
    
    const {data, isPending, isError} = useRecipes({
        page: 1,
        pageSize: 5,
        tag: tag ?? "",
    },
    Boolean(tag),
  );
  const recipeView = useSelector(recipeStore, (state) => state.recipeView);

  if (!tag) return <p>No related recipes found.</p>

  if (isPending === true) return <LoadingIndicator />
  if (isError === true) return <ErrorState message="Unable to load related recipes." />;
  const relatedRecipes = data?.recipes.filter(
      (relatedRecipe) => relatedRecipe.id !== recipe.id
  )

  if (!relatedRecipes?.length) {
    return <p>No related recipes found.</p>;
  }
    
  return (
    <div>
      <h2>Related Recipes</h2>
      <div className="flex flex-wrap gap-4">
        {relatedRecipes?.map((recipe) => (
          
          <RecipeCard recipe={recipe} variant={recipeView} />
        ))}
      </div>
    </div>
  );
}
