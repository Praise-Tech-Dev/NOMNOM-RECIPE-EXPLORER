import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { AddRecipeInput } from "../../recipes/types/add-recipe-input";
import { Minus, Plus, X } from "lucide-react";
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

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm  p-4  bg-slate-900/50">
      <form
        className={`relative bg-white flex flex-col gap-2 justify-center items-center  w-full max-h-[90vh] max-w-2xl rounded-xl px-4 py-4 md:px-8`}
        onSubmit={handleSubmit}
      >
        {/* header  */}
        <div className="relative w-full border-b border-slate-100  px-2 pb-4">
          <div className="">
            <h2 className="font-bold text-xl text-slate-900">
              Add a new Recipe
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add the details for your recipe below.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-0 right-0 cursor-pointer p-2 rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* body  */}
        <div className="flex flex-col gap-3 w-full min-h-0 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-700"
            >
              Recipe name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleFieldChange}
              placeholder="e.g. Creamy Garlic Pasta"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="cuisine"
              className="text-sm font-medium text-slate-700"
            >
              Cuisine
            </label>

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
              placeholder="e.g. Nigerian"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleFieldChange}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="difficulty"
              className="text-sm font-medium text-slate-700"
            >
              Difficulty
            </label>
            <input
              placeholder="e.g. Medium"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              value={formData.difficulty}
              name="difficulty"
              onChange={handleFieldChange}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="prepTimeMinutes"
              className="text-sm font-medium text-slate-700"
            >
              Prep Time
            </label>

            <input
              placeholder="e.g. Medium"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              type="number"
              name="prepTimeMinutes"
              value={formData.prepTimeMinutes}
              onChange={handleFieldChange}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="cookTimeMinutes"
              className="text-sm font-medium text-slate-700"
            >
              Cook Time
            </label>

            <input
              name="cookTimeMinutes"
              type="number"
              value={formData.cookTimeMinutes}
              onChange={handleFieldChange}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
          <div className="">
            <label
              htmlFor="difficulty"
              className="text-sm font-medium text-slate-700"
            >
              Servings
            </label>

            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              type="number"
              name="servings"
              min={1}
              value={formData.servings}
              onChange={handleFieldChange}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="difficulty"
              className="text-sm font-medium text-slate-700"
            >
              Image URL
            </label>

            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              type="url"
              name="image"
              value={formData.image}
              onChange={handleFieldChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="" className="font-semibold">
              Ingredients
            </label>

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
                  className="border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 rounded-lg px-4 py-2 min-w-0 flex-1"
                  value={ingredient}
                  placeholder={`Ingredient ${index + 1}`}
                  onChange={(event) =>
                    handleIngredientChange(event.target.value, index)
                  }
                />

                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  aria-label="remove button"
                  className="border-gray-700 text-black border rounded-lg px-3 py-2 shrink-0 hover:border-red-200"
                >
                  <Minus size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-2">
          <button
            className="border rounded-lg px-4 py-2 bg-black text-white"
            type="submit"
            disabled={addRecipeMutation.isPending}
          >
            {addRecipeMutation.isPending ? "Adding..." : "Add Recipe"}
          </button>
        </div>
      </form>
    </div>
  );
}
