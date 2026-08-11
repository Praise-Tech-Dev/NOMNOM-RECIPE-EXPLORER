import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getRecipe, getRecipes, getRecipeTags } from "../api/recipes-api";
import { recipeKeys } from "./recipe-keys";
import type { RecipeListParams } from "../types/recipe-list-params";

export const recipesOptions = (
  params: RecipeListParams,
) => {
  return queryOptions({
    queryKey: recipeKeys.list(params),
    queryFn: ({signal}) => getRecipes(params, signal),
    placeholderData: keepPreviousData,
  });
};

export const recipeDetailsOptions = (id: number) => {
  return queryOptions({
    queryKey: recipeKeys.detail(id),
    queryFn: () => getRecipe(id),
  });
};

export const recipesTagsOptions = () => {
  return queryOptions({
    queryKey: recipeKeys.tags(),
    queryFn: getRecipeTags,
  });
};
// export const recipesMealTypeOptions = (mealType: string) => {
//   return queryOptions({
//     queryKey: recipeKeys.byMeal(mealType),
//     queryFn: () => getRecipeMealtype(mealType),
//   });
// };