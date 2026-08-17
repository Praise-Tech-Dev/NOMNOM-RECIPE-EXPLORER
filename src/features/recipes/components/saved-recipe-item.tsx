import { ErrorState } from "../../../shared/components/error-state";
import { LoadingIndicator } from "../../../shared/components/loading-indicator";
import { useRecipe } from "../queries/use-recipe";
import { closeSavedRecipeDrawer, toggleSavedRecipe } from "../store/recipe-ui-store";
import { Card } from "./Card";
import RecipeLink from "./recipe-link";
import { BookmarkIcon } from "lucide-react";

type SavedRecipeItemProps = {
    recipeId: number;
}

export default function SavedRecipeItem({ recipeId }: SavedRecipeItemProps) {
    const {data, isPending, isError } = useRecipe(recipeId, true);
    if (isPending === true) return <LoadingIndicator />
      if (isError === true) return <ErrorState message="Unable to load saved recipe items." />;
    
  return (
    <div className="">
      {/* <RecipeCard recipe={data} /> */}
      <Card className="relative flex mb-4">
        <RecipeLink
          recipeId={recipeId}
          to={`/recipes/${recipeId}`}
          onClick={closeSavedRecipeDrawer}
        >
          <div className="flex items-center justify-center gap-4">
            <div className="w-1/2 overflow-hidden">
              <img
                src={data.image}
                alt={data.name}
                className="w-full object-contain"
              />
            </div>
            <div className="w-1/2 p-4">
              <div>
                <strong>{data.name}</strong>
              </div>
              <div>
                <strong>Cuisine:</strong> {data.cuisine},
              </div>
              <div>
                <strong>Difficulty:</strong> {data.difficulty}
              </div>
              <div>
                <strong>Rating:</strong> {data.rating}
              </div>
            </div>
          </div>
        </RecipeLink>

        <button
          type="button"
          onClick={() => toggleSavedRecipe(recipeId)}
          aria-label={`Remove ${data.name} from saved recipes`}
          className="text-blue-600/60 absolute top-3 right-3"
        >
          <BookmarkIcon size={18} fill="currentColor" />
        </button>
      </Card>
    </div>
  );
}
