import React from "react";
import { describe, it, vi, expect, afterEach, beforeEach, test } from "vitest";
import {
  render as rtlRender,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../../../src/services/auth/AuthContext";
import MyLibraryPage from "../../../src/pages/MyLibraryPage/MyLibraryPage";
import Module from "module";

/**
 * @vitest-environment jsdom
 */

/** Overrides default window alert with mock function. */
window.alert = vi.fn();

/**
 * Mocks useAuth to simulate an authenticated user context.
 */
vi.mock("../../../src/services/auth/AuthContext.tsx", async () => {
  const actual: Module = await vi.importActual(
    "../../../src/services/auth/AuthContext.tsx"
  );
  return {
    ...actual,
    useAuth: () => ({
      userID: "123",
    }),
  };
});

/**
 * Mock useUsersLibrariesQuery to provide the users libraries.
 */
vi.mock("../../../src/services/getUserLibraries.ts", () => ({
  useUsersLibrariesQuery: () => ({
    data: {
      libraries: [
        { movies: [], name: "library 1" },
        { movies: [], name: "library 2" },
      ],
    },
  }),
}));

/**
 * Mocks useCreateLibrary to create library.
 */
const mockMutate = vi.fn();
vi.mock("../../../src/services/mutateLibrary", () => ({
  useCreateLibrary: () => ({
    mutate: mockMutate,
  }),
}));

/** QueryClient instance */
const queryClient = new QueryClient();

/**
 * Render component with necessary providers.
 * @param {React.ReactElement} ui
 */
function render(ui: React.ReactElement) {
  return rtlRender(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>{ui}</BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

/**
 * Tests MyLibraryPage.
 */
describe("MyLibraryPage Component", () => {
  // Cleans up before and after each test.
  afterEach(cleanup);
  beforeEach(cleanup);

  /**
   * Test rendering of MyLibraryPage.
   */
  it("Test rendering of MyLibraryPage", async () => {
    render(<MyLibraryPage />);
    expect(screen.getByText("My Libraries")).toBeDefined();
  });

  /**
   * Test create new library popup.
   */
  it("Test create new library popup.", async () => {
    render(<MyLibraryPage />);

    // Click the Create Libary button.
    fireEvent.click(screen.getByText("Create New"));

    // Fill in the new libary name.
    fireEvent.change(screen.getByLabelText("Library Name"), {
      target: { value: "New Library" },
    });

    // Click the Create button.
    fireEvent.click(screen.getByText("Create"));

    // Assert that new Libary has been created.
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith("New Library");
    });
  });

  /**
   * Test canceling the creation of a new library.
   */
  it("Test canceling the library creation.", async () => {
    render(<MyLibraryPage />);

    // Click the Create Libary button.
    fireEvent.click(screen.getByText("Create New"));

    // Fill in the new library name.
    const input = screen.getByLabelText("Library Name");
    fireEvent.change(input, {
      target: { value: "New Library" },
    });

    // Click the Cancel button.
    fireEvent.click(screen.getByText("Cancel"));

    // Check if the popup is closed.
    expect(screen.getByText("My Libraries")).toBeDefined();
  });
});

/**
 * Snapshot test.
 */
test("should match the snapshot", async () => {
  const { asFragment } = render(<MyLibraryPage />);
  await expect(asFragment()).toMatchSnapshot();
});
