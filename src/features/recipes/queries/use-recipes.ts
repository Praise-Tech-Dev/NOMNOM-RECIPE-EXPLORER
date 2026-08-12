import { useQuery } from "@tanstack/react-query";
import { recipesOptions } from "./recipe-options";
import type { RecipeListParams } from "../types/recipe-list-params";

export function useRecipes(
  params: RecipeListParams,
  enabled = true,
) {
  return useQuery({
    ...recipesOptions(params),
    enabled,
  });
}
