import { useParams } from "react-router-dom"
import { useRecipe } from "../features/recipes/queries/use-recipe"
import { LoadingIndicator } from "../shared/components/loading-indicator";
import { ErrorState } from "../shared/components/error-state";
import RecipeDetailsCard from "../features/recipes/components/recipe-detail-card";
import RelatedRecipes from "../features/recipes/components/related-recipes";

export default function RecipeDetailPage() {
  const {id} = useParams();
  const recipeId = Number(id);
  const isValidId = !Number.isNaN(recipeId) && recipeId > 0;
  
  const { data, isPending, isError } = useRecipe(recipeId, isValidId);

  if (!isValidId) {
    return <p>Invalid recipe ID.</p>
  }
  if (isPending === true) return <LoadingIndicator />
  if (isError === true) return <ErrorState message="Unable to load recipe details page." />;
  console.log(data)
  return (
    <div>
      <h2>Receipe Detail Page</h2>
      <p>Recipe Id: {recipeId}</p>
      <RecipeDetailsCard key={recipeId} recipe={data} />
      <RelatedRecipes recipe={data}/>
    </div>
  )
}
