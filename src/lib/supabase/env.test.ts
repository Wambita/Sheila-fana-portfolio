import { describe, expect, it } from "vitest";

import { getPublicSupabaseEnv } from "./env";

describe("getPublicSupabaseEnv", () => {
  it("returns the URL and anon key", () => {
    expect(
      getPublicSupabaseEnv({
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-key",
      }),
    ).toEqual({ url: "http://127.0.0.1:54321", anonKey: "test-key" });
  });

  it("throws a readable error when settings are missing", () => {
    expect(() => getPublicSupabaseEnv({})).toThrow(
      /Supabase is not configured/,
    );
  });

  it("rejects a URL that isn't a URL", () => {
    expect(() =>
      getPublicSupabaseEnv({
        NEXT_PUBLIC_SUPABASE_URL: "localhost",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-key",
      }),
    ).toThrow(/Supabase is not configured/);
  });
});
