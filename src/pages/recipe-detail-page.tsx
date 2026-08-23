import { useParams } from "react-router-dom"
import { useRecipe } from "../features/recipes/queries/use-recipe"
import { LoadingIndicator } from "../shared/components/loading-indicator";
import { ErrorState } from "../shared/components/error-state";
import RecipeDetailsCard from "../features/recipes/components/recipe-detail-card";
import RelatedRecipes from "../features/recipes/components/related-recipes";
import { useEffect } from "react";
import { addRecentlyViewedRecipe } from "../features/recipes/store/recipe-ui-store";

export default function RecipeDetailPage() {
  const {id} = useParams();
  const recipeId = Number(id);
  const isValidId = !Number.isNaN(recipeId) && recipeId > 0;
  
  const { data, isPending, isError } = useRecipe(recipeId, isValidId);

  useEffect(() => {
    if (isValidId && data) {
      addRecentlyViewedRecipe(recipeId);
    }

  }, [recipeId, isValidId, data]);

  if (!isValidId) {
    return <p>Invalid recipe ID.</p>
  }
  if (isPending === true) return <LoadingIndicator />
  if (isError === true) return <ErrorState message="Unable to load recipe details page." />;
  // console.log(data)
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-4 md:gap-6 lg:gap-8">
      <RecipeDetailsCard key={recipeId} recipe={data} />
      <RelatedRecipes recipe={data} />
    </main>
  );
}
