import { Outlet } from "react-router-dom";

import Header from "../shared/components/header";
import SavedRecipeDrawer from "../features/recipes/components/saved-recipe-drawer";

export default function MainLayout() {
  return (
    <>
      <Header />

      <main className="pt-16 ">
        <Outlet />
      </main>
        
      <SavedRecipeDrawer />
    </>
  );
}
