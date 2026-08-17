import { recipeStore } from "../store/recipe-ui-store";
import { useRecentlyViewedRecipes } from "../queries/use-recently-viewed-recipes";

import RecipeCard from "./recipe-card";
import { useSelector } from "@tanstack/react-store";
import { EmptyState } from "../../../shared/components/empty-state";
import { LoadingIndicator } from "../../../shared/components/loading-indicator";
import { ErrorState } from "../../../shared/components/error-state";

export default function RecentlyViewedRecipes() {
  const recentlyViewedRecipes = useSelector(
    recipeStore,
    (state) => state.recentlyViewedRecipeIds,
  );

  const queries = useRecentlyViewedRecipes(recentlyViewedRecipes);
  const recipes = queries
    .map((query) => query.data)
    .filter((recipe) => recipe !== undefined);

  // console.log("Recently Viewed Recipes",recipes)

  const isLoading = queries.some((query) => query.isPending);
  const hasError = queries.some((query) => query.isError);

  const recipeView = useSelector(recipeStore, (state) => state.recipeView); 
  
  if (recentlyViewedRecipes.length === 0)
    return <EmptyState message="No recently viewed recipes." />;
  if (isLoading) return <LoadingIndicator />;
  if (hasError) return <ErrorState />;

  

  return (
    <div className="space-y-4 my-10">
      <h2 className="text-lg font-bold">Recently Viewed</h2>
      <div className="border-b w-1/2"></div>
      <div className="flex flex-wrap gap-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} variant={recipeView} />
        ))}
      </div>
    </div>
  );
}
