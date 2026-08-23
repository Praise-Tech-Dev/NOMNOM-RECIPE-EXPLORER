// import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import RecipeCard from "../features/recipes/components/recipe-card";
import { useRecipes } from "../features/recipes/queries/use-recipes";
import { ErrorState } from "../shared/components/error-state";
import { LoadingIndicator } from "../shared/components/loading-indicator";
import { useState } from "react";
import type {
  SortField,
  SortOrder,
} from "../features/recipes/types/recipe-list-params";
import { useRecipeTags } from "../features/recipes/queries/use-recipe-tags";
import RecentlyViewedRecipes from "../features/recipes/components/recently-viewed-recipes";
import { useSelector } from "@tanstack/react-store";
import { recipeStore, toggleRecipeView } from "../features/recipes/store/recipe-ui-store";
import { Grid2X2, List } from "lucide-react";
import AddRecipeModal from "../features/add-recipe/components/add-recipe-modal";
import { useAddRecipe } from "../features/add-recipe/mutations/use-add-recipe";

export default function RecipePage() {
  // const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const page = parseInt(searchParams.get("page") || "1");
  const q = searchParams.get("q") || "";
  const sortBy = (searchParams.get("sortBy") as SortField) || undefined;
  const order = (searchParams.get("order") as SortOrder) || undefined;
  const tag = searchParams.get("tag") || "";
  const mealType = searchParams.get("mealType") || "";
  const isFiltering = Boolean(q || tag || mealType);
  // Assuming a total of 100 recipes and 6 recipes per page
  const pageSize = 6;
  const params = { page, pageSize, q, tag, sortBy, order, mealType };
  const { data, isPending, isError, isPlaceholderData, isFetching } =
    useRecipes(params);

  const {
    data: tags,
    // isPending: isTagsPending,
  } = useRecipeTags();

  const recipeView = useSelector(recipeStore, (state) => state.recipeView);

  const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false);

  const addRecipeMutation = useAddRecipe(params);

  // console.log("TAGS:", tags);
  // console.log("IS ARRAY:", Array.isArray(tags));

  if (isPending) return <LoadingIndicator />;

  if (isError) return <ErrorState message="Unable to load recipes page." />;

  const { total } = data;

  const totalPages = Math.ceil(total / pageSize);

  

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-4 md:gap-6 lg:gap-8">
      {!isFiltering && <RecentlyViewedRecipes />}

      <form
        className="my-4 flex flex-col space-y-4"
        onSubmit={(event) => {
          event.preventDefault();

          const params = new URLSearchParams(searchParams);

          if (searchInput.trim()) {
            params.set("q", searchInput.trim());
            params.delete("tag");
            params.delete("mealType");
          } else {
            params.delete("q");
          }

          params.set("page", "1");

          setSearchParams(params);
        }}
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search recipes..."
            className="w-full border rounded-md px-4 py-2 sm:flex-1"
          />

          <button
            type="submit"
            className="bg-black px-4 py-2 rounded-md text-white"
          >
            Search
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap ">
          <select
            value={tag}
            onChange={(event) => {
              const params = new URLSearchParams(searchParams);

              if (event.target.value) {
                params.set("tag", event.target.value);
                params.delete("q");
                params.delete("mealType");
                setSearchInput("");
              } else {
                params.delete("tag");
              }

              params.set("page", "1");
              setSearchParams(params);
            }}
            className="w-full border rounded-sm px-4 py-2 sm:w-auto"
          >
            <option value="">All Tags</option>
            {tags?.map((tag) => {
              return (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              );
            })}
          </select>
          <select
            value={mealType}
            onChange={(event) => {
              const params = new URLSearchParams(searchParams);

              if (event.target.value) {
                params.set("mealType", event.target.value);
                params.delete("q");
                params.delete("tag");
                setSearchInput("");
              } else {
                params.delete("mealType");
              }
              params.set("page", "1");
              setSearchParams(params);
            }}
            className="w-full border rounded-sm px-4 py-2 sm:w-auto "
          >
            <option value="">Meal Type</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
            <option value="Dessert">Dessert</option>
          </select>

          <select
            className=" w-full border rounded-sm px-4 py-2  sm:w-auto"
            value={sortBy || ""}
            onChange={(event) => {
              const params = new URLSearchParams(searchParams);

              if (event.target.value) {
                params.set("sortBy", event.target.value);
              } else {
                params.delete("sortBy");
              }

              params.set("page", "1");

              setSearchParams(params);
            }}
          >
            <option value="">Sort by ...</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
            <option value="cookTimeMinutes">Cook Time</option>
          </select>
          <select
            className="w-full border rounded-sm px-4 py-2 sm:w-auto"
            value={order || ""}
            onChange={(event) => {
              const params = new URLSearchParams(searchParams);

              if (event.target.value) {
                params.set("order", event.target.value);
              } else {
                params.delete("order");
              }

              params.set("page", "1");

              setSearchParams(params);
            }}
          >
            <option value="">Order ...</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setSearchParams({});
                setSearchInput("");
              }}
              className="bg-gray-200 px-4 py-2 rounded-sm w-fit"
            >
              Clear filters
            </button>

            <button
              type="button"
              onClick={() => setIsAddRecipeModalOpen(true)}
              className="rounded-sm w-fit bg-black px-4 py-2 text-white"
            >
              Add Recipe
            </button>
          </div>
          <div className="flex w-fit overflow-hidden rounded-lg border">
            <button
              type="button"
              aria-pressed={recipeView === "grid"}
              onClick={() => {
                if (recipeView !== "grid") {
                  toggleRecipeView();
                }
              }}
              className={`flex items-center gap-2 px-3 py-2 text-sm transition ${
                recipeView === "grid"
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Grid2X2 size={18} />
              <span>Grid</span>
            </button>

            <button
              type="button"
              aria-pressed={recipeView === "compact"}
              onClick={() => {
                if (recipeView !== "compact") {
                  toggleRecipeView();
                }
              }}
              className={`flex items-center gap-2 border-l px-3 py-2 text-sm transition ${
                recipeView === "compact"
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <List size={18} />
              <span>Compact</span>
            </button>
          </div>
        </div>
      </form>
      <AddRecipeModal
        isOpen={isAddRecipeModalOpen}
        onClose={() => setIsAddRecipeModalOpen(false)}
        addRecipeMutation={addRecipeMutation}
      />

      <h2 className="text-lg font-bold">All recipes</h2>

      <div
        className={
          recipeView === "grid"
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "grid grid-cols-1 gap-4"
        }
      >
        {data.recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} variant={recipeView} />
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <span className="text-lg font-semibold">Current page: {page}</span>
        <span className="text-lg font-semibold">Total pages: {totalPages}</span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            className={
              page === 1
                ? "cursor-not-allowed rounded-xl bg-gray-300 px-4 py-3 text-gray-500"
                : "rounded-xl bg-black px-4 py-3 text-white"
            }
            onClick={() =>
              setSearchParams((old) => {
                const params = new URLSearchParams(old);
                const newPage = Math.max(page - 1, 1);
                params.set("page", newPage.toString());
                return params;
              })
            }
          >
            Previous page
          </button>
          <button
            onClick={() => {
              if (!isPlaceholderData) {
                setSearchParams((old) => {
                  const params = new URLSearchParams(old);
                  const currentPage = parseInt(old.get("page") || "1");
                  if (currentPage >= totalPages) return params;
                  params.set("page", (currentPage + 1).toString());

                  return params;
                });
              }
            }}
            className={
              isPlaceholderData || isFetching
                ? "opacity-50 cursor-not-allowed bg-amber-600 px-4 py-4 rounded-xl"
                : "bg-amber-600 px-4 py-4 rounded-xl text-white"
            }
            disabled={page >= totalPages || isPlaceholderData || isFetching}
          >
            Next page
          </button>
        </div>
      </div>
    </section>
  );
}
