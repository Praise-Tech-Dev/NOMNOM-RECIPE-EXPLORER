import type { AddRecipeInput } from "../../recipes/types/add-recipe-input";
import type { AddRecipeFormErrors } from "../types/add-recipe-form-errors.types";
import { Plus, Trash2 } from "lucide-react";
import { inputClassName } from "../styles/form-styles";

interface InstructionsSectionProps {
  formData: AddRecipeInput;
  errors: AddRecipeFormErrors;
  addInstruction: () => void;
  removeInstruction: (index: number) => void;
  handleInstructionChange: (value: string, index: number) => void;
  handleRecipeDetailsBlur: (
    field: "ingredients" | "instructions" | "mealType",
  ) => void;
}

export default function InstructionsSection({ formData, errors, addInstruction, removeInstruction, handleInstructionChange, handleRecipeDetailsBlur }: InstructionsSectionProps,
) {
  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Instructions</h3>

          <button
            type="button"
            onClick={addInstruction}
            className="flex items-center gap-1 rounded-lg border bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80"
          >
            <Plus size={16} />
            Add step
          </button>
        </div>

        <div className="space-y-2">
          {formData.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600">
                {index + 1}
              </div>

              <textarea
                value={instruction}
                placeholder={`Step ${index + 1}`}
                aria-label={`Instruction step ${index + 1}`}
                onChange={(event) =>
                  handleInstructionChange(event.target.value, index)
                }
                onBlur={() => handleRecipeDetailsBlur("instructions")}
                rows={2}
                className={`${inputClassName} min-w-0 flex-1 resize-none`}
              />

              <button
                type="button"
                onClick={() => removeInstruction(index)}
                aria-label={`Remove step ${index + 1}`}
                className="shrink-0 rounded-lg p-2 text-slate-700 transition hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {errors.instructions && (
            <p className="text-xs text-red-600">{errors.instructions}</p>
          )}
        </div>
      </div>
    </>
  );
}
