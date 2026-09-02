import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { AddRecipeInput } from "../../recipes/types/add-recipe-input";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Minus, Plus, Trash2, X } from "lucide-react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Recipe } from "../../recipes/types/recipe.types";
import type { AddRecipeMutationContext } from "../mutations/use-add-recipe";
import { toast } from "sonner";
import { useRecipeTags } from "../../recipes/queries/use-recipe-tags";
import { validateAddRecipeForm, validateBasicInfo, validateBasicInfoField, validateRecipeDetails } from "../validation/add-recipe-validation";
import type { AddRecipeFormErrors } from "../types/add-recipe-form-errors.types";



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

type FormStep = 1 | 2;
type FormField =
  | "name"
  | "cuisine"
  | "difficulty"
  | "prepTimeMinutes"
  | "cookTimeMinutes"
  | "servings"
  | "image";

const createInitialFormData = () : AddRecipeInput => ({
  name: "",
  cuisine: "",
  difficulty: "",
  prepTimeMinutes: 0,
  cookTimeMinutes: 0,
  servings: 1,
  ingredients: [""],
  instructions: [""],
  mealType: [],
  tags: [],
  image: "",
});

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
  

  
  const [formData, setFormData] = useState<AddRecipeInput>(
    createInitialFormData
  );

  const [currentStep, setCurrentStep] = useState<FormStep>(1)

  const { data: tags = [] } = useRecipeTags();

  const [isTagPickerOpen, setIsTagPickerOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState("");

  const filteredTags = tags.filter((tag) =>
    tag.toLowerCase().includes(tagSearch.toLowerCase()),
  );

  const tagPickerRef = useRef<HTMLDivElement>(null);

  const [errors, setErrors] = useState<AddRecipeFormErrors>({});
  // state for onBlur handler 
  const [touchedFields, setTouchedFields] = useState<
    Set<FormField>
    >(new Set())

  useEffect(() => {
    if (!isTagPickerOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        tagPickerRef.current &&
        !tagPickerRef.current.contains(event.target as Node)
      ) {
        setIsTagPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTagPickerOpen]);

  if (!isOpen) return null;

  

  // file updater for simple inputs (name, cuisine, difficulty, prepTime, cookTime, servings, image url)
  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value, type} = event.target;

    const field = name as FormField;
    const newValue = type === "number" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));

    if (touchedFields.has(field)) {
      const nextFormData = {
        ...formData,
        [field]: newValue,
      }

      const error = validateBasicInfoField(field, nextFormData);

      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    };
  };

  // handler for increasing or reducing the servings count
  const handleServingsChange = (amount: number) => {
    setFormData((prev) => {
      const newServings = Math.max(1, prev.servings + amount);

      if (touchedFields.has("servings")) {
        const nextFormData = {
          ...prev,
          servings: newServings,
        };

        const error = validateBasicInfoField(
          "servings",
          nextFormData
        );

        setErrors((prev) => ({
          ...prev,
          servings: error,
        }));
      }

      return {
        ...prev,
        servings: newServings,
      };
    });
  };

  const handleIngredientChange = (value: string, index: number) => {
    setFormData((prev) => {
      const nextIngredients = prev.ingredients.map(
        (ingredient, ingredientIndex) =>
          ingredientIndex === index ? value : ingredient,
      );

      const hasEmptyIngredient = nextIngredients.some(
        (ingredient) => ingredient.trim() === "",
      );

      if (errors.ingredients && !hasEmptyIngredient) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ingredients: undefined,
        }));
      }

      return {
        ...prev,
        ingredients: nextIngredients,
      };
    });
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const removeIngredient = (indexToRemove: number) => {
    setFormData((prev) => {
      if (prev.ingredients.length === 1) {
        return prev;
      }

      return {
        ...prev,
      ingredients: prev.ingredients.filter(
        (_, ingredientIndex) => ingredientIndex !== indexToRemove,
        ),
      };
    });
      
  };

  // instructions handler
  const handleInstructionChange = (value: string, index: number) => {
    setFormData((prev) => {
      const nextInstructions = prev.instructions.map(
        (instruction, instructionIndex) =>
          instructionIndex === index ? value : instruction,
      );

      const hasEmptyInstruction = nextInstructions.some(
        (instruction) => instruction.trim() === "",
      );

      if (errors.instructions && !hasEmptyInstruction) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          instructions: undefined,
        }));
      }

      return {
        ...prev,
        instructions: nextInstructions,
      };
    });
  };


  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }));
  }
  const removeInstruction = (indexToRemove: number) => {
    setFormData((prev) => {
      if (prev.instructions.length === 1) {
        return prev;
      }
      return {
        ...prev,
        instructions: prev.instructions.filter(
          (_, index) => index !== indexToRemove,
        ),
      };
    }
    );
  }
  // tag handler
  const toggleTag = (tag: string) => {
    setFormData((prev) => {
      const isSelected = prev.tags.includes(tag);

      const nextTags = isSelected
        ? prev.tags.filter((selectedTag) => selectedTag !== tag)
        : [...prev.tags, tag];

      if (nextTags.length > 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          tags: undefined,
        }));
      }

      return {
        ...prev,
        tags: nextTags,
      };
    });
  };

  // handler validate basic info fields on blur
  const handleFieldBlur = (fieldName: FormField) => {
    setTouchedFields((prev) => {
      const next = new Set(prev);
      next.add(fieldName);
      return next;
    });

    const error = validateBasicInfoField(fieldName, formData);

    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }))
  }

  // Step 2 on blur handler
  const handleRecipeDetailsBlur = (
    field: "ingredients" | "instructions" | "mealType",
  ) => {
    const validationErrors = validateRecipeDetails(formData);

    setErrors((prev) => ({
      ...prev,
      [field]: validationErrors[field],
    }));
  };

  const handleNext = () => {
    const ValidationErrors = validateBasicInfo(formData);

    if (Object.keys(ValidationErrors).length > 0) {
      setErrors(ValidationErrors);

      setTouchedFields((prev) => {
        const next = new Set(prev);

        Object.keys(ValidationErrors).forEach((field) => {
          next.add(field as FormField);
        });

        return next;
      });
      return;
    }
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };


  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const validationErrors = validateAddRecipeForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      const basicInfoFields: FormField[] = [
      "name",
      "cuisine",
      "difficulty",
      "prepTimeMinutes",
      "cookTimeMinutes",
      "servings",
      "image",
      ];

      const hasBasicInfoErrors = basicInfoFields.some(
        (field) => validationErrors[field],
      );

      if (hasBasicInfoErrors) {
        setCurrentStep(1);
      }

      return;
  
    }

    console.log("FORM SUBMITTED");

    addRecipeMutation.mutate(formData, {
      onSuccess: () => {
        setFormData(createInitialFormData());
        setCurrentStep(1);
        setTagSearch("");
        setIsTagPickerOpen(false);
        setErrors({});
        toast.success("Recipe added successfully");
        onClose();
      },
      onError: () => {
        toast.error("Failed to add recipe");
      },
    });
  };




  const inputClassName =
    "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

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
            <>
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
                <label
                  htmlFor="cuisine"
                  className="text-sm font-medium text-slate-700"
                >
                  Cuisine
                </label>

                <input
                  placeholder="e.g. Nigerian"
                  className={inputClassName}
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleFieldChange}
                  onBlur={() => handleFieldBlur("cuisine")}
                  aria-invalid={Boolean(errors.cuisine)}
                  aria-describedby={
                    errors.cuisine ? "cuisine-error" : undefined
                  }
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
                    value={formData.difficulty}
                    onChange={(event) => {
                      const newValue = event.target.value;

                      setFormData((prev) => ({
                        ...prev,
                        difficulty: newValue,
                      }));

                      if (touchedFields.has("difficulty")) {
                        const nextFormData = {
                          ...formData,
                          difficulty: newValue,
                        };

                        const error = validateBasicInfoField(
                          "difficulty",
                          nextFormData,
                        );

                        setErrors((prev) => ({
                          ...prev,
                          difficulty: error,
                        }));
                      }
                    }}
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
                    value={formData.prepTimeMinutes}
                    onChange={handleFieldChange}
                    onBlur={() => handleFieldBlur("prepTimeMinutes")}
                    aria-invalid={Boolean(errors.prepTimeMinutes)}
                    aria-describedby={
                      errors.prepTimeMinutes
                        ? "prepTimeMinutes-error"
                        : undefined
                    }
                  />
                  {errors.prepTimeMinutes && (
                    <p
                      id="prepTimeMinutes-error"
                      className="text-xs text-red-600"
                    >
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
                    type="number"
                    min={0}
                    value={formData.cookTimeMinutes}
                    onChange={handleFieldChange}
                    className={inputClassName}
                    onBlur={() => handleFieldBlur("cookTimeMinutes")}
                    aria-invalid={Boolean(errors.cookTimeMinutes)}
                    aria-describedby={
                      errors.cookTimeMinutes
                        ? "cookTimeMinutes-error"
                        : undefined
                    }
                  />
                  {errors.cookTimeMinutes && (
                    <p
                      id="cookTimeMinutes-error"
                      className="text-xs text-red-600"
                    >
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
                    onClick={() => handleServingsChange(-1)}
                    className="flex p-2.5 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
                  >
                    <Minus size={16} />
                  </button>

                  <input
                    className={inputClassName}
                    type="number"
                    name="servings"
                    min={1}
                    value={formData.servings}
                    onChange={handleFieldChange}
                    onBlur={() => handleFieldBlur("servings")}
                    aria-invalid={Boolean(errors.servings)}
                    aria-describedby={
                      errors.servings ? "servings-error" : undefined
                    }
                  />

                  <button
                    type="button"
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
                <label
                  htmlFor="image"
                  className="text-sm font-medium text-slate-700"
                >
                  Image URL
                </label>

                <input
                  className={inputClassName}
                  type="url"
                  name="image"
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
          ) : (
            // step 2 fields
            <>
              {/* ingredients  */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">Ingredients</p>

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

              {/* instructions  */}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">Instructions</p>

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
                    <p className="text-xs text-red-600">
                      {errors.instructions}
                    </p>
                  )}
                </div>
              </div>
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

                <div className="relative" ref={tagPickerRef}>
                  {/* Selected tags */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setIsTagPickerOpen((prev) => !prev)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setIsTagPickerOpen((prev) => !prev);
                      }
                    }}
                    className={`min-h-11 w-full cursor-pointer rounded-lg border px-3 py-2 transition ${
                      isTagPickerOpen
                        ? "border-slate-400 ring-2 ring-slate-100"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {formData.tags.length > 0 ? (
                        formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                          >
                            {tag}

                            <button
                              type="button"
                              tabIndex={0}
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleTag(tag);
                              }}
                              aria-label={`Remove ${tag}`}
                              className="rounded-full p-0.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-400">
                          Selected tags
                        </span>
                      )}

                      <ChevronDown
                        size={18}
                        className={`ml-auto shrink-0 text-slate-500 transition-transform ${
                          isTagPickerOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Tag picker */}
                  {isTagPickerOpen && (
                    <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                      {/* Search */}
                      <div className="border-b border-slate-100 p-2">
                        <input
                          type="text"
                          value={tagSearch}
                          onChange={(event) => setTagSearch(event.target.value)}
                          placeholder="Search tags..."
                          className={inputClassName}
                        />
                      </div>

                      {/* Options */}
                      <div className="max-h-52 overflow-y-auto p-1">
                        {filteredTags.length > 0 ? (
                          filteredTags.map((tag) => {
                            const isSelected = formData.tags.includes(tag);

                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${
                                  isSelected
                                    ? "bg-slate-100 text-slate-900"
                                    : "text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                <span>{tag}</span>

                                {isSelected && (
                                  <span className="text-slate-900">
                                    <Check size={14} />
                                  </span>
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <p className={inputClassName}>No matching tags</p>
                        )}
                      </div>
                    </div>
                  )}

                  {errors.tags && (
                    <p id="tags-error" className="text-xs text-red-600">
                      {errors.tags}
                    </p>
                  )}
                </div>
              </div>
              {/* meal type  */}
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-slate-900">Meal Type</p>
                <div className="relative w-full">
                  <select
                    value={formData.mealType[0] ?? ""}
                    onChange={(event) => {
                      const selectedValue = event.target.value;

                      setFormData((prev) => ({
                        ...prev,
                        mealType: selectedValue ? [selectedValue] : [],
                      }));

                      if (selectedValue) {
                        setErrors((prev) => ({
                          ...prev,
                          mealType: undefined,
                        }));
                      }
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
