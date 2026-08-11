import { useQuery } from "@tanstack/react-query";
import { recipesTagsOptions } from "./recipe-options";

export function useRecipeTags() {
  return useQuery(recipesTagsOptions());
}
