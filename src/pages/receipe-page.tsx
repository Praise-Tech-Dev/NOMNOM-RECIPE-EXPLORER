// import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import RecipeCard from "../features/recipes/components/recipe-card";
import { useRecipes } from "../features/recipes/queries/use-recipes";
import { ErrorState } from "../shared/components/error-state";
import { LoadingIndicator } from "../shared/components/loading-indicator";
import { useState } from "react";
import type { SortField, SortOrder } from "../features/recipes/types/recipe-list-params";
import { useRecipeTags } from "../features/recipes/queries/use-recipe-tags";

export default function RecipePage() {
    // const [page, setPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchInput, setSearchInput] = useState(
      searchParams.get("q") || ""
    );
    const page = parseInt(searchParams.get("page") || "1");
    const q = searchParams.get("q") || "";
    const sortBy = searchParams.get("sortBy") as SortField || undefined;
    const order = searchParams.get("order") as SortOrder|| undefined;
    const tag = searchParams.get("tag") || "";
    const mealType = searchParams.get("mealType") || "";
     // Assuming a total of 100 recipes and 6 recipes per page
    const pageSize = 6;
    const { data, isPending, isError, isPlaceholderData, isFetching } = useRecipes({
        page,
        pageSize,
        q,
        tag,
        sortBy,
        order,
        mealType,
    });

    const {
      data: tags,
      // isPending: isTagsPending,
    } = useRecipeTags();

    // console.log("TAGS:", tags);
    // console.log("IS ARRAY:", Array.isArray(tags));

    if (isPending) return <LoadingIndicator />;
    
    if (isError) return <ErrorState message="Unable to load recipes page." />;

    const { total} = data;
    
    const totalPages = Math.ceil(total / pageSize);



  return (
    <section>
      <h2>Recipe Page</h2>

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
        <div className="">
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search recipes..."
            className="border rounded-lg px-4 py-2"
          />

          <button
            type="submit"
            className="ml-2 bg-black px-4 py-2 rounded-lg text-white"
          >
            Search
          </button>
        </div>

        <div className="space-x-2">
          <select
            className="border rounded-lg px-4 py-2"
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
            className="border rounded-lg px-4 py-2"
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
            className="border rounded-lg px-4 py-2"
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
        </div>
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
          className="border rounded-lg px-4 py-2 w-1/2"
        >
          <option value="">Meal Type</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Snack">Snack</option>
          <option value="Dessert">Dessert</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setSearchParams({});
            setSearchInput("");
          }}
          className="bg-gray-200 px-4 py-2 rounded-lg w-fit"
        >
          Clear filters
        </button>
      </form>

      <div className="flex flex-wrap gap-8">
        {data.recipes.map((recipe) => (
          <Link to={`/recipes/${recipe.id}`}>
            <RecipeCard key={recipe.id} recipe={recipe} />
          </Link>
        ))}
      </div>

      <div className="space-x-4 mt-4">
        <span className="text-lg font-semibold">Current page: {page}</span>
        <span className="text-lg font-semibold">Total pages: {totalPages}</span>
        <button
          className="bg-black px-4 py-4 rounded-xl text-white"
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
    </section>
  );
}
