import { ErrorState } from "../../../shared/components/error-state";
import { LoadingIndicator } from "../../../shared/components/loading-indicator";
import { useRecipes } from "../queries/use-recipes";
import type { Recipe } from "../types/recipe.types";
import RecipeCard from "./recipe-card";


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
  // const recipeView = useSelector(recipeStore, (state) => state.recipeView);

  if (!tag) return <p>No related recipes found.</p>

  if (isPending === true) return <LoadingIndicator />
  if (isError === true) return <ErrorState message="Unable to load related recipes." />;
  const relatedRecipes = data?.recipes.filter(
      (relatedRecipe) => relatedRecipe.id !== recipe.id
  )

  if (!relatedRecipes?.length) {
    return null
  }
    
  return (
    <div className="space-y-2">
      <h2 className="text-lg md:text-2xl font-semibold">Related Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedRecipes?.map((recipe) => (
          <RecipeCard recipe={recipe} variant="grid" />
        ))}
      </div>
    </div>
  );
}
