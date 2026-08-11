import { EmptyState } from "../../../shared/components/empty-state";
import { ErrorState } from "../../../shared/components/error-state";
import { LoadingIndicator } from "../../../shared/components/loading-indicator";
import { useRecipes } from "../queries/use-recipes";
import RecipeCard from "./recipe-card";

export default function QueryPractice() {
    const { data, isPending, isError, isFetching, error, refetch } =
      useRecipes();
    

    if (isPending) {
        return <LoadingIndicator />
    }

    if (isError) {
        return (
          <ErrorState
            message={error.message || "Something went wrong."}
            onRetry={refetch}
          />
        );
    }

    if (data.length === 0) {
      return <EmptyState />;
    }
  return (
    <>
      {isFetching && <p>Refreshing recipes...</p>}
      <ul className="flex flex-wrap gap-8">
        {data.map((recipe) => {
          return (
            <li key={recipe.id}>
              
              <RecipeCard recipe={recipe} />
            </li>
          );
        })}
      </ul>
    </>
  );
}
