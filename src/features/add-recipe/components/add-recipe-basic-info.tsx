import { ChevronDown, Minus, Plus } from "lucide-react";
import type { AddRecipeInput } from "../../recipes/types/add-recipe-input";
import type { AddRecipeFormErrors } from "../types/add-recipe-form-errors.types";
import type { ChangeEvent } from "react";
import { inputClassName } from "../styles/form-styles";

interface AddRecipeBasicInfoProps {
    formData: AddRecipeInput;
    errors: AddRecipeFormErrors;
    handleFieldChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleFieldBlur: (field: "name" | "cuisine" | "difficulty" | "prepTimeMinutes" | "cookTimeMinutes" | "servings" | "image") => void;
    handleServingsChange: (amount: number) => void;
}

export function AddRecipeBasicInfo({ formData, errors, handleFieldChange, handleFieldBlur, handleServingsChange }: AddRecipeBasicInfoProps) {
    
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-slate-700">
          Recipe name
        </label>
        <input
          name="name"
          id="name"
          value={formData.name}
          onChange={handleFieldChange}
          onBlur={() => handleFieldBlur("name")}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          maxLength={100}
          placeholder="e.g. Creamy Garlic Pasta"
          required
          className={inputClassName}
        />

        {errors.name && (
          <p id="name-error" className="text-xs text-red-600">
            {errors.name}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cuisine" className="text-sm font-medium text-slate-700">
          Cuisine
        </label>

        <input
          placeholder="e.g. Nigerian"
          className={inputClassName}
          name="cuisine"
          id="cuisine"
          value={formData.cuisine}
          onChange={handleFieldChange}
          onBlur={() => handleFieldBlur("cuisine")}
          aria-invalid={Boolean(errors.cuisine)}
          aria-describedby={errors.cuisine ? "cuisine-error" : undefined}
          required
        />

        {errors.cuisine && (
          <p id="cuisine-error" className="text-xs text-red-600">
            {errors.cuisine}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="difficulty"
          className="text-sm font-medium text-slate-700"
        >
          Difficulty
        </label>
        <div className="relative w-full">
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleFieldChange}
            onBlur={() => handleFieldBlur("difficulty")}
            aria-invalid={Boolean(errors.difficulty)}
            aria-describedby={
              errors.difficulty ? "difficulty-error" : undefined
            }
            required
            className="w-full border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 rounded-lg py-2.5  pl-4 pr-10 appearance-none cursor-pointer
                    min-w-0 flex-1 outline-none text-sm"
          >
            <option value="">Select a difficulty type</option>
            <option value="Hard">Hard</option>
            <option value="Medium">Medium</option>
            <option value="Easy">Easy</option>
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black"
          />
        </div>
        {errors.difficulty && (
          <p id="difficulty-error" className="text-xs text-red-600">
            {errors.difficulty}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <label
            htmlFor="prepTimeMinutes"
            className="text-sm font-medium text-slate-700"
          >
            Prep Time
          </label>

          <input
            placeholder="e.g. Medium"
            className={inputClassName}
            type="number"
            min={0}
            name="prepTimeMinutes"
            id="prepTimeMinutes"
            value={formData.prepTimeMinutes}
            onChange={handleFieldChange}
            onBlur={() => handleFieldBlur("prepTimeMinutes")}
            aria-invalid={Boolean(errors.prepTimeMinutes)}
            aria-describedby={
              errors.prepTimeMinutes ? "prepTimeMinutes-error" : undefined
            }
          />
          {errors.prepTimeMinutes && (
            <p id="prepTimeMinutes-error" className="text-xs text-red-600">
              {errors.prepTimeMinutes}
            </p>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label
            htmlFor="cookTimeMinutes"
            className="text-sm font-medium text-slate-700"
          >
            Cook Time
          </label>

          <input
            name="cookTimeMinutes"
            id="cookTimeMinutes"
            type="number"
            min={0}
            value={formData.cookTimeMinutes}
            onChange={handleFieldChange}
            className={inputClassName}
            onBlur={() => handleFieldBlur("cookTimeMinutes")}
            aria-invalid={Boolean(errors.cookTimeMinutes)}
            aria-describedby={
              errors.cookTimeMinutes ? "cookTimeMinutes-error" : undefined
            }
          />
          {errors.cookTimeMinutes && (
            <p id="cookTimeMinutes-error" className="text-xs text-red-600">
              {errors.cookTimeMinutes}
            </p>
          )}
        </div>
      </div>

      <div className="">
        <label
          htmlFor="servings"
          className="text-sm font-medium text-slate-700"
        >
          Servings
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Decrease servings"
            onClick={() => handleServingsChange(-1)}
            className="flex p-2.5 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            <Minus size={16} />
          </button>

          <input
            className={inputClassName}
            type="number"
            name="servings"
            id="servings"
            min={1}
            value={formData.servings}
            onChange={handleFieldChange}
            onBlur={() => handleFieldBlur("servings")}
            aria-invalid={Boolean(errors.servings)}
            aria-describedby={errors.servings ? "servings-error" : undefined}
          />

          <button
            type="button"
            aria-label="Increase servings"
            onClick={() => handleServingsChange(1)}
            className="flex p-2.5 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            <Plus size={16} />
          </button>
        </div>
        {errors.servings && (
          <p id="servings-error" className="text-xs text-red-600">
            {errors.servings}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="image" className="text-sm font-medium text-slate-700">
          Image URL
        </label>

        <input
          className={inputClassName}
          type="url"
          name="image"
          id="image"
          value={formData.image}
          onChange={handleFieldChange}
          onBlur={() => handleFieldBlur("image")}
          aria-invalid={Boolean(errors.image)}
          aria-describedby={errors.image ? "image-error" : undefined}
          placeholder="https://example.com/image.jpg"
        />
        {errors.image && (
          <p id="image-error" className="text-xs text-red-600">
            {errors.image}
          </p>
        )}
      </div>
    </>
  );    
        
}
