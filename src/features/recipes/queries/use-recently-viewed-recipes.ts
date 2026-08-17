import { useQueries } from "@tanstack/react-query";
import { recipeDetailOptions } from "./recipe-options";

export function useRecentlyViewedRecipes(
    recentlyViewedRecipes: number[],
    enabled = true,
){
    
    const queries = recentlyViewedRecipes.map((id) => ({
        ...recipeDetailOptions(id),
        enabled,
    }));

    return useQueries({
        queries,
    })
}