import { useSelector } from "@tanstack/react-store";
import { ErrorState } from "../../../shared/components/error-state";
import { LoadingIndicator } from "../../../shared/components/loading-indicator";
import { useRecipes } from "../queries/use-recipes";
import RecipeCard from "./recipe-card";
import { recipeStore } from "../store/recipe-ui-store";

export function QuickMeal() {
  const { data, isPending, isError } = useRecipes({
    page: 1,
    pageSize: 6,
  });
  const recipeView = useSelector(recipeStore, (state) => state.recipeView);

  if (isPending) return <LoadingIndicator />;

  if (isError) return <ErrorState message="Unable to load recipes." />;

  return (
    <section>
      <h2>Quick Meals</h2>

      <div className="flex flex-wrap gap-8">
        {data.recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} variant={recipeView} />
        ))}
      </div>
    </section>
  );
}
