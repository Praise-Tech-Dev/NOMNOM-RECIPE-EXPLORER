import { ErrorState } from "../../../shared/components/error-state";
import { LoadingIndicator } from "../../../shared/components/loading-indicator";
import { useRecipes } from "../queries/use-recipes";
import type { Recipe } from "../types/recipe.types";
import RecipeCard from "./recipe-card";
import RecipeLink from "./recipe-link";


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
          //   <div key={recipe.id}>
          //     <div className="w-50">
          //       <img src={recipe.image} alt={recipe.name} />
          //     </div>
          //     {recipe.name}
          //   </div>

            <RecipeLink
                key={recipe.id} 
                recipeId={recipe.id} 
                to={`/recipes/${recipe.id}`}
            >
            <RecipeCard recipe={recipe} />
            </RecipeLink>
        ))}
      </div>
    </div>
  );
}
