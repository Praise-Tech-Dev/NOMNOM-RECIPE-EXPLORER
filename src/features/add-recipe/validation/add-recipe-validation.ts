import type { AddRecipeInput } from "../../recipes/types/add-recipe-input";
import type { AddRecipeFormErrors } from "../types/add-recipe-form-errors.types";

export function validateBasicInfoField(
  field: keyof AddRecipeFormErrors,
  formData: AddRecipeInput,
): string | undefined {
  switch (field) {
    case "name":
      if (!formData.name.trim()) {
        return "Recipe name is required";
      }
      break;
    case "cuisine":
      if (!formData.cuisine.trim()) {
        return "Cuisine is required";
      }
      break;
    case "difficulty":
      if (!formData.difficulty.trim()) {
        return "Difficulty is required";
      }
      break;
    case "prepTimeMinutes":
      if (formData.prepTimeMinutes < 0) {
        return "Preparation time cannot be negative";
      }
      break;
    case "cookTimeMinutes":
      if (formData.cookTimeMinutes < 0) {
        return "Cook time cannot be negative";
      }
      break;
    case "servings":
      if (formData.servings < 1) {
        return "Servings must be at least 1";
      }
      break;
    case "image": {
        if (!formData.image.trim()) {
          return "Image URL is required";
        }

        try {
          const url = new URL(formData.image);

          if (url.protocol !== "http:" && url.protocol !== "https:") {
            return "Image URL must start with http:// or https://";
          }

          return undefined;
        } catch {
          return "Please enter a valid image URL";
        }
      }
      break;
  }
  

  return undefined;
}

export function validateBasicInfo(
  formData: AddRecipeInput,
): AddRecipeFormErrors {
  const errors: AddRecipeFormErrors = {};

  const fields: Array<keyof AddRecipeFormErrors> = [
    "name",
    "cuisine",
    "difficulty",
    "prepTimeMinutes",
    "cookTimeMinutes",
    "servings",
    "image",
  ];

  for (const field of fields) {
    const error = validateBasicInfoField(field, formData);  

    if (error) {
      errors[field] = error;
    }
  }
  return errors;
}

export function validateRecipeDetails(
  formData: AddRecipeInput,
): AddRecipeFormErrors {
  const errors: AddRecipeFormErrors = {};

  // ingredients
  const hasEmptyIngredient = formData.ingredients.some(
    (ingredient) => ingredient.trim() === "",
  );
  // instructions
  const hasEmptyInstruction = formData.instructions.some(
    (instruction) => instruction.trim() === "",
  );

  if (hasEmptyIngredient) {
    errors.ingredients = "Please fill in all ingredients";
  }

  if (hasEmptyInstruction) {
    errors.instructions = "Please fill in all instruction steps";
  }
  if (formData.tags.length === 0) {
    errors.tags = "At least one tag is required";
  }
  // meal type
  if (formData.mealType.length === 0) {
    errors.mealType = "Meal type is required";
  }

  return errors;
}

export function validateAddRecipeForm(
  formData: AddRecipeInput,
): AddRecipeFormErrors {
  return {
    ...validateBasicInfo(formData),
    ...validateRecipeDetails(formData),
  };
}