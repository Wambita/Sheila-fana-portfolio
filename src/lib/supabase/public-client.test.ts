import { afterEach, describe, expect, it, vi } from "vitest";

import { uncachedFetch } from "./public-client";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("uncachedFetch", () => {
  // ADR-016: Supabase responses must never enter the persistent fetch Data Cache.
  it("forces cache: no-store and keeps the caller's options", async () => {
    const spy = vi.fn().mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", spy);

    await uncachedFetch("http://127.0.0.1:54321/rest/v1/x", {
      headers: { apikey: "test" },
      cache: "force-cache",
    });

    expect(spy).toHaveBeenCalledWith("http://127.0.0.1:54321/rest/v1/x", {
      headers: { apikey: "test" },
      cache: "no-store",
    });
  });
});
