import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddRecipeModal from "./add-recipe-modal";



// Mock the mutation
vi.mock("../mutations/use-add-recipe", () => ({
  useAddRecipe: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  params: {
    page: 1,
    pageSize: 10,
  },
};

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

function renderModal(props = defaultProps) {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <AddRecipeModal {...props} />
    </QueryClientProvider>,
  );
}

async function goToDetailsStep(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByRole("textbox", { name: /recipe name/i }),
    "Jollof Rice",
  );

  await user.type(
    screen.getByRole("textbox", { name: /cuisine/i }),
    "Nigerian",
  );

  await user.selectOptions(
    screen.getByRole("combobox", { name: /difficulty/i }),
    "Medium",
  );

  await user.type(
    screen.getByRole("textbox", { name: /image url/i }),
    "https://example.com/jollof.jpg",
  );

  await user.click(screen.getByRole("button", { name: /next/i }));

  expect(screen.getByText("Ingredients")).toBeInTheDocument();
}


describe("AddRecipeModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the modal when it is open", () => {
    renderModal();

    expect(
      screen.getByRole("heading", {
        name: /add a new recipe/i,
      }),
    ).toBeInTheDocument();
  });

  it("does not render when it is closed", () => {
    renderModal({
      ...defaultProps,
      isOpen: false,
    });

    expect(
      screen.queryByRole("heading", {
        name: /add a new recipe/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("renders all basic information fields", () => {
    renderModal();

    expect(
      screen.getByRole("textbox", {
        name: /recipe name/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", {
        name: /cuisine/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("combobox", {
        name: /difficulty/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("spinbutton", {
        name: /prep time/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("spinbutton", {
        name: /cook time/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("spinbutton", {
        name: /servings/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", {
        name: /image url/i,
      }),
    ).toBeInTheDocument();
  });

  it("allows the user to enter basic recipe information", async () => {
    const user = userEvent.setup();

    renderModal();

    const nameInput = screen.getByRole("textbox", {
      name: /recipe name/i,
    });

    const cuisineInput = screen.getByRole("textbox", {
      name: /cuisine/i,
    });

    await user.type(nameInput, "Jollof Rice");
    await user.type(cuisineInput, "Nigerian");

    expect(nameInput).toHaveValue("Jollof Rice");
    expect(cuisineInput).toHaveValue("Nigerian");
  });

  it("allows the user to select a difficulty", async () => {
    const user = userEvent.setup();

    renderModal();

    const difficulty = screen.getByRole("combobox", {
      name: /difficulty/i,
    });

    await user.selectOptions(difficulty, "Medium");

    expect(difficulty).toHaveValue("Medium");
  });

  it("allows zero prep and cook time", async () => {
    const user = userEvent.setup();

    renderModal();

    const prepTime = screen.getByRole("spinbutton", {
      name: /prep time/i,
    });

    const cookTime = screen.getByRole("spinbutton", {
      name: /cook time/i,
    });

    await user.clear(prepTime);
    await user.type(prepTime, "0");

    await user.clear(cookTime);
    await user.type(cookTime, "0");

    expect(prepTime).toHaveValue(0);
    expect(cookTime).toHaveValue(0);
  });

  it("moves to the recipe details step", async () => {
    const user = userEvent.setup();

    renderModal();

    await goToDetailsStep(user);

    expect(screen.getByText("Ingredients")).toBeInTheDocument();

    expect(screen.getByText("Instructions")).toBeInTheDocument();

    expect(screen.getByText("Tags")).toBeInTheDocument();

    expect(screen.getByText("Meal Type")).toBeInTheDocument();
  });

  it("allows adding another ingredient", async () => {
    const user = userEvent.setup();

    renderModal();

    await goToDetailsStep(user);

    const ingredientInputs = screen.getAllByPlaceholderText(/ingredient/i);

    const initialCount = ingredientInputs.length;

    await user.click(screen.getByRole("button", { name: /^add$/i }));

    const updatedIngredientInputs =
      screen.getAllByPlaceholderText(/ingredient/i);

    expect(updatedIngredientInputs).toHaveLength(initialCount + 1);
  });
  it("allows adding another instruction", async () => {
    const user = userEvent.setup();

    renderModal();

    await goToDetailsStep(user);

    const instructionInputs = screen.getAllByPlaceholderText(/step/i);

    const initialCount = instructionInputs.length;

    await user.click(screen.getByRole("button", { name: /add step/i }));

    const updatedInstructionInputs = screen.getAllByPlaceholderText(/step/i);

    expect(updatedInstructionInputs).toHaveLength(initialCount + 1);
  }); 
  
  it("allows selecting a meal type", async () => {
    const user = userEvent.setup();

    renderModal();

    await goToDetailsStep(user);

    const mealType = screen.getByRole("combobox", {
      name: /meal type/i,
    });

    await user.selectOptions(mealType, "Dinner");

    expect(mealType).toHaveValue("Dinner");
  });

  it("allows going back to the basic information step", async () => {
    const user = userEvent.setup();

    renderModal();

    await goToDetailsStep(user);

    expect(screen.getByText("Ingredients")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /back/i,
      }),
    );

    expect(
      screen.getByRole("textbox", {
        name: /recipe name/i,
      }),
    ).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup();

    const onClose = vi.fn();

    renderModal({
      ...defaultProps,
      onClose,
    });

    await user.click(
      screen.getByRole("button", {
        name: /close modal/i,
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("passes axe accessibility checks", async () => {
    const { container } = renderModal();

    const results = await axe(container);

    console.log(results.violations[0]);

    expect(results.violations).toHaveLength(0);
  });
});


