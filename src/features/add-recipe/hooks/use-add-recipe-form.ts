import { useEffect, useRef, useState, type ChangeEvent } from "react";

import type { AddRecipeInput } from "../../recipes/types/add-recipe-input";

import { useRecipeTags } from "../../recipes/queries/use-recipe-tags";

import {
  validateBasicInfo,
  validateBasicInfoField,
  validateRecipeDetails,
} from "../validation/add-recipe-validation";

import type { AddRecipeFormErrors } from "../types/add-recipe-form-errors.types";

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

export function useAddRecipeForm() {
  const [formData, setFormData] = useState<AddRecipeInput>(
    createInitialFormData,
  );

  const [currentStep, setCurrentStep] = useState<FormStep>(1);

  const { data: tags = [] } = useRecipeTags();

  const [isTagPickerOpen, setIsTagPickerOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState("");

  const [errors, setErrors] = useState<AddRecipeFormErrors>({});
  // state for onBlur handler
  const [touchedFields, setTouchedFields] = useState<Set<FormField>>(new Set());

  const tagPickerRef = useRef<HTMLDivElement>(null);

  // handler for increasing or reducing the servings count
  const handleServingsChange = (amount: number) => {
    setFormData((prev) => {
      const newServings = Math.max(1, prev.servings + amount);

      if (touchedFields.has("servings")) {
        const nextFormData = {
          ...prev,
          servings: newServings,
        };

        const error = validateBasicInfoField("servings", nextFormData);

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
  };
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
    });
  };
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

  // file updater for simple inputs (name, cuisine, difficulty, prepTime, cookTime, servings, image url)
  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = event.target;

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
      };

      const error = validateBasicInfoField(field, nextFormData);

      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const handleMealTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      mealType: value ? [value] : [],
    }));

    if (value) {
      setErrors((prev) => ({
        ...prev,
        mealType: undefined,
      }));
    }
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
    }));
  };

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
    const validationErrors = validateBasicInfo(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      setTouchedFields((prev) => {
        const next = new Set(prev);

        Object.keys(validationErrors).forEach((field) => {
          next.add(field as FormField);
        });

        return next;
      });
      return;
    }
    setCurrentStep(2);
  };

  const goToStep = (step: FormStep) => {
    setCurrentStep(step);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  

  const filteredTags = tags.filter((tag) =>
    tag.toLowerCase().includes(tagSearch.toLowerCase()),
  );

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

  const setFormErrors = (validationErrors: AddRecipeFormErrors) => {
    setErrors(validationErrors);
  };

  const resetForm = () => {
    setFormData(createInitialFormData());
    setCurrentStep(1);
    setTagSearch("");
    setIsTagPickerOpen(false);
    setErrors({});
    setTouchedFields(new Set());
  };

  return {
    formData,
    currentStep,
    errors,
    touchedFields,

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
    handleFieldBlur,
    handleRecipeDetailsBlur,
    handleNext,
    handleBack,
    handleMealTypeChange,
    resetForm,
    goToStep,
    setFormErrors,
  };
}