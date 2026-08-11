export type SortField = "name" | "rating" | "cookTimeMinutes";
export type SortOrder = "asc" | "desc";

export interface RecipeListParams {
  page: number;
  pageSize: number;
  sortBy?: SortField;
  order?: SortOrder;
  q?: string; // search term
  tag?: string;
  mealType?: string;
}
