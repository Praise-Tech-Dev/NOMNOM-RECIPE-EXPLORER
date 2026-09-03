import type { Dispatch, RefObject, SetStateAction } from "react";
import type { AddRecipeInput } from "../../recipes/types/add-recipe-input";
import type { AddRecipeFormErrors } from "../types/add-recipe-form-errors.types";
import { Check, ChevronDown, X } from "lucide-react";
import { inputClassName } from "../styles/form-styles";

interface TagsPickerProps {
  formData: AddRecipeInput;
  errors: AddRecipeFormErrors;

  toggleTag: (tag: string) => void;

  isTagPickerOpen: boolean;
  setIsTagPickerOpen: Dispatch<SetStateAction<boolean>>;

  tagSearch: string;
  setTagSearch: Dispatch<SetStateAction<string>>;

  filteredTags: string[];

  tagPickerRef: RefObject<HTMLDivElement | null>;
}

export default function TagsPicker(
  {
    formData,
    errors,
    toggleTag,
    isTagPickerOpen,
    setIsTagPickerOpen,
    tagSearch,
    setTagSearch,
    filteredTags,
    tagPickerRef
  }: TagsPickerProps,
) {
  return (
    <div className="relative" ref={tagPickerRef}>
      {/* Selected tags */}
      <div
        role="button"
        aria-label="Select recipe tags"
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
            <span className="text-sm text-slate-400">Selected tags</span>
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
              aria-label="Search tags"
              name="tagSearch"
              id="tagSearch"
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
  );
}
