import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AddRecipeInput } from "../../recipes/types/add-recipe-input";
import { addRecipe } from "../../recipes/api/recipes-api";
import { recipeKeys } from "../../recipes/queries/recipe-keys";

import type { RecipeListResponse } from "../../recipes/types/recipe-list.types";
import type { Recipe } from "../../recipes/types/recipe.types";
import type { RecipeListParams } from "../../recipes/types/recipe-list-params";

export type AddRecipeMutationContext = {
  previousData: RecipeListResponse | undefined;
  optimisticRecipe: Recipe;
};

export function useAddRecipe(params: RecipeListParams) {
    const queryClient = useQueryClient();
    return useMutation<
      Recipe,
      Error,
      AddRecipeInput,
      AddRecipeMutationContext
    >({
        mutationFn: (data: AddRecipeInput) => addRecipe(data),

        // if mutation succeeds we get the newRecipe from server 
        onSuccess: (newRecipe, _variables, context) => {
            queryClient.setQueryData<RecipeListResponse>(
              recipeKeys.list(params),
              (oldData) => {
                if (!oldData) return oldData;

                // we replace the temporary recipe with the new recipe from server
                return {
                  ...oldData,
                  recipes: oldData.recipes.map((recipe) =>
                    recipe.id === context.optimisticRecipe.id
                      ? newRecipe
                      : recipe,
                  ),
                };
              }
            );
        },
        
        // prepare for optimistic update 
        // happens before mutation function
        // data is the recipe information the user submitted
        onMutate: async (data) => {
          // Cancel current query : That is don't let an existing query request finish and overwrite the optimistic update
          await queryClient.cancelQueries({
            queryKey: recipeKeys.list(params)
          })

          // Snapshot: The data before mutation
          const previousData = queryClient.getQueryData<RecipeListResponse>(
            recipeKeys.list(params)
          );

          // create a temporary recipe: Since the server has not given me a complete Recipe temporarily pretend submitted recipe is a complete recipe
          const optimisticRecipe: Recipe = {
            ...data,
            id: Date.now(),
            rating: 0,
            reviewCount: 0,
            userId: 0,
            caloriesPerServing: 0,
          };

          // optimistic updater : put the temporary recipe into the cache so that the user sees it immediately
          queryClient.setQueryData<RecipeListResponse>(
            recipeKeys.list(params), 
            (oldData) => {
              if (!oldData) {
                return oldData;
              }

              // tanstack query takes the returned object and makes it available to later lifecycle callbacks as context
              return {
                ...oldData,
                recipes: [...oldData.recipes, optimisticRecipe],
              };
            }
          );

          return {
            previousData,
            optimisticRecipe
          };
        },

        // if mutation fails roll back to previous data
        onError: (_error, _variables, context) => {
          queryClient.setQueryData(
            recipeKeys.list(params),
            context?.previousData
          );
        }
    })
}