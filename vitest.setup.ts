import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// `server-only` throws outside the React Server Components bundler; tests import those modules directly.
vi.mock("server-only", () => ({}));

afterEach(() => {
  cleanup();
});
