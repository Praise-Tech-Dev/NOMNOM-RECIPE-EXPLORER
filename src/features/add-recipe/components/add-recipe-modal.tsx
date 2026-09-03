import { useEffect, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { validateAddRecipeForm } from "../validation/add-recipe-validation";
import { useAddRecipe } from "../mutations/use-add-recipe";
import type { RecipeListParams } from "../../recipes/types/recipe-list-params";
import { useAddRecipeForm } from "../hooks/use-add-recipe-form";
import { AddRecipeBasicInfo } from "./add-recipe-basic-info";
import AddRecipeDetails from "./add-recipe-details";


type AddRecipeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  params: RecipeListParams;
};




export default function AddRecipeModal({
  isOpen,
  onClose,
  params,
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

  const addRecipeMutation = useAddRecipe(params);
  const {
    formData,
    currentStep,
    errors,
    isTagPickerOpen,
    setIsTagPickerOpen,
    tagSearch,
    setTagSearch,
    filteredTags,
    tagPickerRef,

    handleFieldChange,
    handleServingsChange,
    handleIngredientChange,
    addIngredient,
    removeIngredient,
    handleInstructionChange,
    addInstruction,
    removeInstruction,
    toggleTag,
    handleMealTypeChange,
    handleFieldBlur,
    handleRecipeDetailsBlur,
    handleNext,
    handleBack,
    resetForm,
    setFormErrors,
    goToStep,
  } = useAddRecipeForm();

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const validationErrors = validateAddRecipeForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);

      const hasBasicInfoErrors = Boolean(
        validationErrors.name ||
        validationErrors.cuisine ||
        validationErrors.difficulty ||
        validationErrors.prepTimeMinutes ||
        validationErrors.cookTimeMinutes ||
        validationErrors.servings ||
        validationErrors.image
      )
    
      
      if (hasBasicInfoErrors) {
        goToStep(1);
      }

      return;
    }


    addRecipeMutation.mutate(formData, {
      onSuccess: () => {
        resetForm();
        toast.success("Recipe added successfully");
        onClose();
      },
      onError: () => {
        toast.error("Failed to add recipe");
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
        <div className="relative w-full border-b border-slate-100  px-2 pb-4 space-y-2">
          <div className="">
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

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  currentStep === 1
                    ? "bg-black text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                1
              </div>

              <span
                className={`text-sm font-medium text-slate-900
                ${currentStep === 1 ? "block" : "hidden"}
                `}
              >
                Basic info
              </span>
            </div>

            <div className="h-px flex-1 bg-slate-200" />

            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  currentStep === 2
                    ? "bg-black text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                2
              </div>

              <span
                className={` text-sm font-medium ${
                  currentStep === 2 ? "block" : "hidden"
                }`}
              >
                Recipe details
              </span>
            </div>
          </div>
        </div>

        {/* body  */}
        <div className="flex flex-col gap-3 w-full min-h-0 overflow-y-auto">
          {currentStep === 1 ? (
            <AddRecipeBasicInfo
              formData={formData}
              errors={errors}
              handleFieldChange={handleFieldChange}
              handleFieldBlur={handleFieldBlur}
              handleServingsChange={handleServingsChange}
              />
          ) : (
            <AddRecipeDetails
              formData={formData}
              errors={errors}
              handleRecipeDetailsBlur={handleRecipeDetailsBlur}
              addIngredient={addIngredient}
              removeIngredient={removeIngredient}
              handleIngredientChange={handleIngredientChange}
              addInstruction={addInstruction}
              removeInstruction={removeInstruction}
              handleInstructionChange={handleInstructionChange}
              toggleTag={toggleTag}
              handleMealTypeChange={handleMealTypeChange}
              isTagPickerOpen={isTagPickerOpen}
              setIsTagPickerOpen={setIsTagPickerOpen}
              tagSearch={tagSearch}
              setTagSearch={setTagSearch}
              filteredTags={filteredTags}
              tagPickerRef={tagPickerRef}
            />
          )}
        </div>

        <div className="">
          {currentStep === 1 ? (
            <>
              <button
                className="flex items-center gap-2 border rounded-lg px-4 py-2 bg-black text-white"
                type="button"
                // disabled={addRecipeMutation.isPending}
                onClick={handleNext}
              >
                Next <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                className="flex items-center gap-2 border rounded-lg px-4 py-2 bg-black text-white"
                type="button"
                onClick={handleBack}
                // disabled={addRecipeMutation.isPending}
              >
                Back <ArrowLeft size={16} />
              </button>
              <div className="flex justify-between gap-4 mt-2">
                <button
                  className="border rounded-lg px-4 py-2 bg-black text-white"
                  type="submit"
                  disabled={addRecipeMutation.isPending}
                >
                  {addRecipeMutation.isPending ? "Adding..." : "Add Recipe"}
                </button>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
