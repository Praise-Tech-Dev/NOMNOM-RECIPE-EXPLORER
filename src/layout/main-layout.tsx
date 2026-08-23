import { Outlet } from "react-router-dom";

import Header from "../shared/components/header";
import SavedRecipeDrawer from "../features/recipes/components/saved-recipe-drawer";

export default function MainLayout() {
  return (
    <div className="mx-auto px-4 md:px-8">
      <Header />

      <main className="pt-16 ">
        <Outlet />
      </main>
        
      <SavedRecipeDrawer />
    </div>
  );
}
