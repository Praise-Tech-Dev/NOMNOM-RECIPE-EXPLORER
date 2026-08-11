import { useQuery } from "@tanstack/react-query";
import { recipeDetailOptions } from "./recipe-options";


export function useRecipe(id: number, enabled=true) {
  return useQuery({
    ...recipeDetailOptions(id),
    enabled,
  });
}
