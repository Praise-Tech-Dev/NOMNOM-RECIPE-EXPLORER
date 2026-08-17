import { createStore } from "@tanstack/react-store";

export interface RecipeUiState {
  savedRecipeIds: number[];
  recentlyViewedRecipeIds: number[];
  isSavedRecipesDrawerOpen: boolean;
  // isMobileNavigationOpen: boolean;
  // isAddRecipeModalOpen: boolean;
  recipeView: "grid" | "compact";
}

const savedRecipeView = localStorage.getItem("Recipe-View");

const initialRecipeUiState: RecipeUiState = {
  savedRecipeIds: JSON.parse(localStorage.getItem("Saved-Recipe-Ids") ?? "[]"),
  recentlyViewedRecipeIds: JSON.parse(
    localStorage.getItem("Recently-Viewed-Recipe-Ids") ?? "[]",
  ),
  isSavedRecipesDrawerOpen: false,
  // isMobileNavigationOpen: false,
  // isAddRecipeModalOpen: false,
  recipeView:
    savedRecipeView === "compact" || savedRecipeView === "grid"
      ? savedRecipeView
      : "grid",
};

export const recipeStore = createStore(initialRecipeUiState);

export const saveRecipe = (id: number) => {
  recipeStore.setState((prevState) => {
    if (prevState.savedRecipeIds.includes(id)) {
      return prevState;
    }
    return {
      ...prevState,
      savedRecipeIds: [...prevState.savedRecipeIds, id],
    };
  });
};

export const removeRecipe = (id: number) => {
  recipeStore.setState((state) => {
    if (state.savedRecipeIds.includes(id)) {
      return {
        ...state,
        savedRecipeIds: state.savedRecipeIds.filter(
          (recipeId) => recipeId !== id,
        ),
      };
    }
    return state;
  });
};

export const toggleSavedRecipe = (id: number) => {
  if (recipeStore.state.savedRecipeIds.includes(id)) {
    return removeRecipe(id);
  } else {
    return saveRecipe(id);
  }
};

export const openSavedRecipeDrawer = () => {
  recipeStore.setState((state) => {
    return {
      ...state,
      isSavedRecipesDrawerOpen: true,
    };
  });
};

export const closeSavedRecipeDrawer = () => {
  recipeStore.setState((state) => {
    return {
      ...state,
      isSavedRecipesDrawerOpen: false,
    };
  });
};

export const addRecentlyViewedRecipe = (id: number) => {
  recipeStore.setState((state) => {
    const updatedIds = [
      id,
      ...state.recentlyViewedRecipeIds
        .filter((recipeId) => recipeId !== id)
        .slice(0, 4),
    ];

    return {
      ...state,
      recentlyViewedRecipeIds: updatedIds,
    };
  });
};

export const toggleRecipeView = () => {
  recipeStore.setState((state) => ({
    ...state,
    recipeView: state.recipeView === "grid" ? "compact" : "grid",
  }));
};

recipeStore.subscribe(() => {
  localStorage.setItem(
    "Saved-Recipe-Ids",
    JSON.stringify(recipeStore.state.savedRecipeIds),
  );
  localStorage.setItem(
    "Recently-Viewed-Recipe-Ids",
    JSON.stringify(recipeStore.state.recentlyViewedRecipeIds),
  );
  localStorage.setItem("Recipe-View", recipeStore.state.recipeView);
});
