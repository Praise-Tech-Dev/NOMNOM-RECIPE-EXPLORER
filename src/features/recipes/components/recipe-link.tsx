import { useQueryClient } from "@tanstack/react-query";
import { Link, type LinkProps } from "react-router-dom";
import { recipeDetailOptions } from "../queries/recipe-options";

type RecipeLinkProps = LinkProps & {
    recipeId: number;
}

export default function RecipeLink({
    recipeId,
    children,
    ...linkProps
}: RecipeLinkProps) {
    const queryClient = useQueryClient();

    const prefetchRecipe = () => {
        queryClient.prefetchQuery(recipeDetailOptions(recipeId))
    }

  return (
    <Link
        {...linkProps}
        onMouseEnter={prefetchRecipe}
        onFocus={prefetchRecipe}
    >
      {children}
    </Link>
  )
}
