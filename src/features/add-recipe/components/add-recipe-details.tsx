import type { Dispatch, RefObject, SetStateAction } from "react";
import type { AddRecipeInput } from "../../recipes/types/add-recipe-input";
import type { AddRecipeFormErrors } from "../types/add-recipe-form-errors.types";
import { ChevronDown } from "lucide-react";
import IngredientsSection from "./ingredients-section";
import InstructionsSection from "./instructions";
import TagsPicker from "./tags-picker";

interface AddRecipeDetailsProps {
  formData: AddRecipeInput;
  errors: AddRecipeFormErrors;
  handleRecipeDetailsBlur: (
    field: "ingredients" | "instructions" | "mealType",
  ) => void;
  addIngredient: () => void;
  removeIngredient: (index: number) => void;
  handleIngredientChange: (value: string, index: number) => void;
  addInstruction: () => void;
  removeInstruction: (index: number) => void;
  handleInstructionChange: (value: string, index: number) => void;
  toggleTag: (tag: string) => void;
  handleMealTypeChange: (value: string) => void;
  isTagPickerOpen: boolean;
  setIsTagPickerOpen: Dispatch<SetStateAction<boolean>>;
  tagSearch: string;
  setTagSearch: Dispatch<SetStateAction<string>>;
  filteredTags: string[];
  tagPickerRef: RefObject<HTMLDivElement | null>;
}




export default function AddRecipeDetails({ formData, errors,  addIngredient, removeIngredient, handleIngredientChange, addInstruction, removeInstruction, handleInstructionChange, toggleTag, handleMealTypeChange, handleRecipeDetailsBlur, isTagPickerOpen, setIsTagPickerOpen, tagSearch, setTagSearch, filteredTags, tagPickerRef }: AddRecipeDetailsProps) {
  return (
    <>
              {/* ingredients  */}
              <IngredientsSection 
                formData={formData}
                errors={errors}
                addIngredient={addIngredient}
                removeIngredient={removeIngredient}
                handleIngredientChange={handleIngredientChange}
                handleRecipeDetailsBlur={handleRecipeDetailsBlur}
              />

              {/* instructions  */}

              <InstructionsSection 
                formData={formData}
                errors={errors}
                addInstruction={addInstruction}
                removeInstruction={removeInstruction}
                handleInstructionChange={handleInstructionChange}
                handleRecipeDetailsBlur={handleRecipeDetailsBlur}
              />
              {/* tags */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">Tags</p>
                    <p className="text-xs text-slate-500">
                      Select one or more tags
                    </p>
                  </div>
                </div>

                
                {/* tags  */}

                <TagsPicker
                  formData={formData}
                  errors={errors}
                  toggleTag={toggleTag}
                  isTagPickerOpen={isTagPickerOpen}
                  setIsTagPickerOpen={setIsTagPickerOpen}
                  tagSearch={tagSearch}
                  setTagSearch={setTagSearch}
                  filteredTags={filteredTags}
                  tagPickerRef={tagPickerRef}
                />
              </div>
              {/* meal type  */}
              <div className="flex flex-col gap-2">
                <label htmlFor="mealType" className="font-semibold text-slate-900">
                  Meal Type
                </label>
                <div className="relative w-full">
                  <select
                    id="mealType"
                    name="mealType"
                    value={formData.mealType[0] ?? ""}
                    onChange={(event) => {
                      const selectedValue = event.target.value;

                      handleMealTypeChange(selectedValue);
                    }}
                    onBlur={() => handleRecipeDetailsBlur("mealType")}
                    aria-invalid={Boolean(errors.mealType)}
                    aria-describedby={
                      errors.mealType ? "mealType-error" : undefined
                    }
                    className="w-full border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 rounded-lg py-2.5  pl-4 pr-10 appearance-none cursor-pointer
                    min-w-0 flex-1 outline-none text-sm"
                  >
                    <option value="">Select meal type</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                    <option value="Dessert">Dessert</option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black"
                  />
                </div>
                {errors.mealType && (
                  <p id="mealType-error" className="text-xs text-red-600">
                    {errors.mealType}
                  </p>
                )}
              </div>
            </>
  )
}
