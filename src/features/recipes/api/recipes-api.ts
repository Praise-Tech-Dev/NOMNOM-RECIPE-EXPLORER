


import type { RecipeListResponse } from "../types/recipe-list.types";
import type { Recipe } from "../types/recipe.types";
import { apiClient } from "../../../shared/api/api-client";
import type { RecipeListParams } from "../types/recipe-list-params";

export const getRecipes = async (
  params: RecipeListParams,
  signal?: AbortSignal
) => {
  const { 
    page, 
    pageSize,
    q,
    tag,
    mealType,
    sortBy,
    order,
  } = params;
  const skip = (page - 1) * pageSize;

  let endpoint = "recipes";

  if (q) {
    endpoint = `recipes/search`
  } else if (tag) {
    endpoint = `recipes/tag/${encodeURIComponent(tag)}`
  } else if (mealType) {
    endpoint = `recipes/meal-type/${encodeURIComponent(mealType)}`
  }

  const searchParams = new URLSearchParams();
  searchParams.set("limit", String(pageSize));
  searchParams.set("skip", String(skip));

  if (q) {
    searchParams.set("q", q);
  }
  if (sortBy) {
    searchParams.set("sortBy", sortBy);
  }

  if (order) {
    searchParams.set("order", order);
  }
  
  
  const data = await apiClient<RecipeListResponse>(
    `${endpoint}?${searchParams.toString()}`,
    signal
  );
  console.log("RECIPE PARAMS:", params);
  console.log("RECIPE ENDPOINT:", endpoint);
  return data;
};

export const getRecipe = async (id: number) => {
  const data = await apiClient<Recipe>(`recipes/${id}`);
  return data;

}

export const getRecipeTags = async () => {
  const data = await apiClient<string[]>("recipes/tags");
  return data;
}

export const getRecipeMealtype = async () => {
  const data = await apiClient<string[]>("recipes/meal-type");
  return data;
}