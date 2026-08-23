import { useState } from "react";
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

  return (
    <div className="bg-gray-200 p-8 rounded-lg ">
      <form
        className="flex flex-col gap-2 justify-center items-center"
        onSubmit={(event) => {
          event.preventDefault();
          console.log("FORM SUBMITTED");

          addRecipeMutation.mutate(formData, {
            onSuccess: () => {
              onClose();
            },
          });
        }}
      >
        <h2 className="font-bold text-lg mb-4">Add Recipe</h2>

        <div className="">
          Name:{" "}
          <input
            value={formData.name}
            onChange={(event) => {
              setFormData({
                ...formData,
                name: event.target.value,
              });
            }}
            className="border rounded-lg px-4 py-1"
          />
        </div>
        <div className="">
          Cuisine{" "}
          <input
            className="border rounded-lg px-4 py-1"
            value={formData.cuisine}
            onChange={(event) => {
              setFormData({
                ...formData,
                cuisine: event.target.value,
              });
            }}
          />
        </div>
        <div className="">
          Difficulty{" "}
          <input
            className="border rounded-lg px-4 py-1"
            value={formData.difficulty}
            onChange={(event) => {
              setFormData({
                ...formData,
                difficulty: event.target.value,
              });
            }}
          />
        </div>
        <div className="">
          Prep Time{" "}
          <input
            className="border rounded-lg px-4 py-1"
            type="number"
            value={formData.prepTimeMinutes}
            onChange={(event) => {
              setFormData({
                ...formData,
                prepTimeMinutes: Number(event.target.value),
              });
            }}
          />
        </div>
        <div className=""></div>
        <div className="">
          Cook Time{" "}
          <input
            className="border rounded-lg px-4 py-1"
            type="number"
            value={formData.cookTimeMinutes}
            onChange={(event) => {
              setFormData({
                ...formData,
                cookTimeMinutes: Number(event.target.value),
              });
            }}
          />
        </div>
        <div className="">
          Servings{" "}
          <input
            className="border rounded-lg px-4 py-1"
            type="number"
            value={formData.servings}
            onChange={(event) => {
              setFormData({
                ...formData,
                servings: Number(event.target.value),
              });
            }}
          />
        </div>
        <div className="">
          Image URL{" "}
          <input
            className="border rounded-lg px-4 py-1"
            type="url"
            value={formData.image}
            onChange={(event) => {
              setFormData({
                ...formData,
                image: event.target.value,
              });
            }}
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
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      ingredients: formData.ingredients.map(
                        (ingredient, ingredientIndex) =>
                          ingredientIndex === index
                            ? event.target.value
                            : ingredient,
                      ),
                    });
                  }}
                />

                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      ingredients: formData.ingredients.filter(
                        (_, ingredientIndex) => ingredientIndex !== index,
                      ),
                    });
                  }}
                  className="bg-gray-700 text-white border rounded-lg px-3 py-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setFormData({
                ...formData,
                ingredients: [...formData.ingredients, ""],
              });
            }}
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

        {/* <button 
            type="button"
            onClick={() => {
                setFormData({
                  ...formData,
                  ingredients: formData.ingredients.filter(
                    (_, ingredientIndex) => ingredientIndex !== index
                  ),
                });
            }}
        >
            Remove
        </button> */}
      </form>
    </div>
  );
}
