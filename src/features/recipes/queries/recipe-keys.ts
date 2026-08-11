import type { RecipeListParams } from "../types/recipe-list-params";

export const recipeKeys = {
  all: ["recipes"] as const,
  lists: () => [...recipeKeys.all, "list"] as const,
  list: (params: RecipeListParams) => [...recipeKeys.lists(), params] as const,
  tags: () => [...recipeKeys.all, "tags"] as const,
  byTag: (tag: string) => [...recipeKeys.all, "tag", tag] as const,
  byMeal: (mealType: string) => [...recipeKeys.all, "meal", mealType] as const,
  details: () => [...recipeKeys.all, "detail"] as const,
  detail: (recipeId: number) => [...recipeKeys.details(), recipeId] as const,
};
