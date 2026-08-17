import { useState } from "react";
import { Heart, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { openSavedRecipeDrawer } from "../../features/recipes/store/recipe-ui-store";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold" onClick={closeMenu}>
          NomNom
        </NavLink>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-black"
                : "text-gray-600 hover:text-black"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/recipes"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-black"
                : "text-gray-600 hover:text-black"
            }
          >
            Recipes
          </NavLink>

          <button
            type="button"
            onClick={openSavedRecipeDrawer}
            className="flex items-center gap-2 text-gray-600 transition-colors hover:text-black"
          >
            <Heart size={18} className="text-red-500 fill-red-500" />
            Saved Recipes
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav className="border-t bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "font-semibold text-black" : "text-gray-600"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/recipes"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "font-semibold text-black" : "text-gray-600"
              }
            >
              Recipes
            </NavLink>
            
            <button
              type="button"
              onClick={() => {
                openSavedRecipeDrawer();
                closeMenu();
              }}
              className="flex items-center gap-2 text-left text-gray-600"
            >
              <Heart size={18} className="text-red-500 fill-red-500" />
              Saved Recipes
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
