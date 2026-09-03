import type { AddRecipeInput } from "../../recipes/types/add-recipe-input";
import { inputClassName } from "../styles/form-styles";
import type { AddRecipeFormErrors } from "../types/add-recipe-form-errors.types";
import { Plus, Trash2 } from "lucide-react";

interface IngredientsSectionProps {
  formData: AddRecipeInput;
  errors: AddRecipeFormErrors;
  addIngredient: () => void;
  removeIngredient: (index: number) => void;
  handleIngredientChange: (value: string, index: number) => void;
  handleRecipeDetailsBlur: (
    field: "ingredients" | "instructions" | "mealType",
  ) => void;
}

export default function IngredientsSection({
  formData,
  errors,
  addIngredient,
  removeIngredient,
  handleIngredientChange,
  handleRecipeDetailsBlur
}: IngredientsSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Ingredients</h3>

          <button
            type="button"
            onClick={addIngredient}
            className="bg-black border rounded-lg px-4 py-2 flex items-center gap-1 text-sm font-medium text-white hover:bg-black/80"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        <div className="space-y-2">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2 w-full">
              <input
                className={`${inputClassName} min-w-0 flex-1`}
                value={ingredient}
                aria-label={`Ingredient ${index + 1}`}
                placeholder={`Ingredient ${index + 1}`}
                onChange={(event) =>
                  handleIngredientChange(event.target.value, index)
                }
                onBlur={() => handleRecipeDetailsBlur("ingredients")}
              />

              <button
                type="button"
                onClick={() => removeIngredient(index)}
                aria-label="remove button"
                className="shrink-0 rounded-lg p-2 text-slate-700 transition hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {errors.ingredients && (
            <p className="text-xs text-red-600">{errors.ingredients}</p>
          )}
        </div>
      </div>
    </>
  );
}
