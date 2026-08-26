import { useState, type ChangeEvent, type FormEvent } from "react";
import type { AddRecipeInput } from "../../recipes/types/add-recipe-input";
import { X } from "lucide-react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Recipe } from "../../recipes/types/recipe.types";
import type { AddRecipeMutationContext } from "../mutations/use-add-recipe";



type AddRecipeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  addRecipeMutation: UseMutationResult<
    Recipe,
    Error,
    AddRecipeInput,
    AddRecipeMutationContext
  >;
};


export default function AddRecipeModal({
  isOpen,
  onClose,
  addRecipeMutation,
}: AddRecipeModalProps) {
  // const addRecipeMutation = useAddRecipe();
  const [formData, setFormData] = useState<AddRecipeInput>({
    name: "",
    cuisine: "",
    difficulty: "",
    prepTimeMinutes: 0,
    cookTimeMinutes: 0,
    servings: 1,
    ingredients: [""],
    instructions: [""],
    mealType: [""],
    tags: [""],
    image: "",
  });

  if (!isOpen) return null;

  // file updater for simple inputs (name, cuisine, difficulty, prepTime, cookTime, servings, image url)
  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value, type} = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value): value,
    }));
  };

  const handleIngredientChange = (value:string , index:number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: formData.ingredients.map((ingredient, ingredientIndex) =>
        ingredientIndex === index ? value : ingredient),
    }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...formData.ingredients, ""],
    }));
  };

  const removeIngredient = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: formData.ingredients.filter(
        (_, ingredientIndex) => ingredientIndex !== indexToRemove,
      ),
    }));
  };
  
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log("FORM SUBMITTED");

    addRecipeMutation.mutate(formData, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  return (
    <div className="flex fixed inset-0 items-center justify-center backdrop-blur-sm  p-4 z-50 bg-slate-900/50">
      <form
        className={`bg-white flex flex-col gap-2 justify-center items-center max-h-full w-full sm:max-w-md md:max-w-xl lg:max-w-2xl rounded-xl py-4`}
        onSubmit={handleSubmit}
      >
        <h2 className="font-bold text-lg mb-4">Add Recipe</h2>

        <div className="">
          Name:{" "}
          <input
            name="name"
            value={formData.name}
            onChange={handleFieldChange}
            className="border rounded-lg px-4 py-1"
          />
        </div>
        <div className="">
          Cuisine{" "}
          {/* <input
            className="border rounded-lg px-4 py-1"
            value={formData.cuisine}
            onChange={(event) => {
              setFormData({
                ...formData,
                cuisine: event.target.value,
              });
            }}
          /> */}
          <input
            className="border rounded-lg px-4 py-1"
            name="cuisine"
            value={formData.cuisine}
            onChange={handleFieldChange}
          />
        </div>
        <div className="">
          Difficulty{" "}
          <input
            className="border rounded-lg px-4 py-1"
            value={formData.difficulty}
            name="difficulty"
            onChange={handleFieldChange}
          />
        </div>
        <div className="">
          Prep Time{" "}
          <input
            className="border rounded-lg px-4 py-1"
            type="number"
            name="prepTimeMinutes"
            value={formData.prepTimeMinutes}
            onChange={handleFieldChange}
          />
        </div>
        <div className=""></div>
        <div className="">
          Cook Time{" "}
          <input
            className="border rounded-lg px-4 py-1"
            name="cookTimeMinutes"
            type="number"
            value={formData.cookTimeMinutes}
            onChange={handleFieldChange}
          />
        </div>
        <div className="">
          Servings{" "}
          <input
            className="border rounded-lg px-4 py-1"
            type="number"
            name="servings"
            min={1}
            value={formData.servings}
            onChange={handleFieldChange}
          />
        </div>
        <div className="">
          Image URL{" "}
          <input
            className="border rounded-lg px-4 py-1"
            type="url"
            name="image"
            value={formData.image}
            onChange={handleFieldChange}
          />
        </div>
        <div>
          <label className="font-semibold">Ingredients</label>

          <div className="space-y-2 mt-2">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <input
                  className="border rounded-lg px-4 py-2 flex-1"
                  value={ingredient}
                  placeholder={`Ingredient ${index + 1}`}
                  onChange={(event) => handleIngredientChange(event.target.value, index)}
                />

                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="bg-gray-700 text-white border rounded-lg px-3 py-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addIngredient}
            className="bg-black text-white mt-2 border rounded-lg px-4 py-2"
          >
            + Add ingredient
          </button>
        </div>

        <div className="flex justify-between gap-4 mt-2">
          <button
            className="border rounded-lg px-4 py-2 bg-black text-white"
            type="submit"
            disabled={addRecipeMutation.isPending}
          >
            {addRecipeMutation.isPending ? "Adding..." : "Add Recipe"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex gap-2 items-center border rounded-lg px-4 py-2 bg-red-800 text-white"
          >
            Close <X size={18} />
          </button>
        </div>

        
      </form>
    </div>
  );
}
