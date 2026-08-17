
import { useSelector } from "@tanstack/react-store";
import { closeSavedRecipeDrawer, recipeStore } from "../store/recipe-ui-store";
import SavedRecipeItem from "./saved-recipe-item";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function SavedRecipeDrawer() {
    const isDrawerOpen = useSelector(
        recipeStore, 
        (state) => state.isSavedRecipesDrawerOpen
    );
    
    const savedRecipeIds = useSelector(
        recipeStore,
        (state) => state.savedRecipeIds
    );

    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        }

    }, [isDrawerOpen]);

    if (!isDrawerOpen) {
      return null;
    }

    // if (savedRecipeIds.length === 0) {
    //     return (
    //       <div>
    //         <p>Oops! No saved recipes yet. </p>
    //         <p>Save recipes to find them here.</p>
    //       </div>
    //     );
        
    // }
    
  return (
    <>
      {/* backdrop  */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={closeSavedRecipeDrawer}
      />
      {/* drawer  */}
      <aside className="flex fixed right-0 top-0 h-screen z-50 w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between shadow px-6 py-4">
          <h2 className="text-lg font-semibold">Saved Recipes</h2>
          <button onClick={closeSavedRecipeDrawer}>
            <X />
          </button>
        </div>

        {/* scrollable drawer content  */}
        <div className="flex-1 overflow-y-auto p-4">
          {savedRecipeIds.length === 0 ? (
            <div>
              <p>Oops! No saved recipes yet.</p>
              <p>Save recipes to find them here.</p>
            </div>
          ) : (
            savedRecipeIds.map((id) => (
              <SavedRecipeItem key={id} recipeId={id} />
            ))
          )}
        </div>
      </aside>
    </>
  );
}
