export interface AddRecipeInput {
  name: string;
  cuisine: string;
  difficulty: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  mealType: string[];
  tags: string[];
  image: string;
}