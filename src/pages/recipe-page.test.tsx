import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import RecipePage from "./receipe-page";

// Helper component to track current URL query parameters in tests
function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="url-location">{location.search}</div>;
}

// Mock hooks to isolate UI & debounce testing
vi.mock("../features/recipes/queries/use-recipes", () => ({
  useRecipes: () => ({
    data: { recipes: [], total: 0 },
    isPending: false,
    isError: false,
    isPlaceholderData: false,
    isFetching: false,
  }),
}));

vi.mock("../features/recipes/queries/use-recipe-tags", () => ({
  useRecipeTags: () => ({ data: [] }),
}));

vi.mock("../features/add-recipe/mutations/use-add-recipe", () => ({
  useAddRecipe: () => ({ mutate: vi.fn() }),
}));

describe("RecipePage Debounced Search", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.useFakeTimers();
    queryClient = new QueryClient();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderWithProviders = (initialUrl = "/recipes") => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialUrl]}>
          <LocationDisplay />
          <Routes>
            <Route path="/recipes" element={<RecipePage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it("updates input immediately but does not update URL before 400ms", () => {
    renderWithProviders();

    const input = screen.getByPlaceholderText(
      /search recipes/i,
    ) as HTMLInputElement;

    // Type query
    fireEvent.change(input, { target: { value: "burger" } });
    expect(input.value).toBe("burger");

    // Advance 200ms (timer not elapsed yet)
    act(() => {
      vi.advanceTimersByTime(200);
    });

    const locationText = screen.getByTestId("url-location").textContent;
    expect(locationText).not.toContain("q=burger");
  });

  it("updates the URL searchParams after 400ms of inactivity", () => {
    renderWithProviders();

    const input = screen.getByPlaceholderText(
      /search recipes/i,
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "pasta" } });

    // Advance full debounce delay
    act(() => {
      vi.advanceTimersByTime(400);
    });

    const locationText = screen.getByTestId("url-location").textContent;
    expect(locationText).toContain("q=pasta");
    expect(locationText).toContain("page=1");
  });
});
