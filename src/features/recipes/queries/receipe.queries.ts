// import { useQueries, useQuery } from "@tanstack/react-query"
// import { getRecipe, getRecipeId } from "../api/recipes-api";
// import { recipeKeys } from "./recipe-keys";
// // import { getRecipes } from "../api/recipes-api"

// export const useRecipesId = () => {
//   return useQuery({
//     queryKey: recipeKeys.list(6, 0),
//     queryFn:  getRecipeId,
  
//   });
// }

// export const useRecipes = (ids: number[] = []) => {
//   return useQueries({
//     queries: (ids ?? []).map((id) => {
//       return {
//         queryKey: recipeKeys.detail(id),
//         queryFn: () => getRecipe(id),
//       };
//     })
//   })
// }