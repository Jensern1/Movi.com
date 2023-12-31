import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, vi, expect, test } from "vitest";
import { AuthProvider } from "../../../src/services/auth/AuthContext";
import HomePage from "../../../src/pages/HomePage/HomePage";

/**
 * @vitest-environment jsdom
 */

/** Overrides default window alert with mock function. */
window.alert = vi.fn();

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
 * Tests HomePage.
 */
describe("HomePage Component", () => {
  /**
   * Tests rendering of movies.
   */
  it("renders HomePage", async () => {
    render(<HomePage />);
  });
});

/**
 * Snapshot test.
 */
test("should match the snapshot", async () => {
  const { asFragment } = render(<HomePage />);
  await expect(asFragment()).toMatchSnapshot();
});
