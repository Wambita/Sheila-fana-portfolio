import { vi } from "vitest";

/**
 * Minimal stand-in for the Supabase query builder. Every chained call is recorded,
 * and awaiting the chain (or calling maybeSingle) resolves to the given result.
 */
export function fakeQuery(result: {
  data: unknown;
  error: { message: string } | null;
}) {
  const calls: Array<[string, ...unknown[]]> = [];
  const builder: Record<string, unknown> = {};
  for (const method of ["from", "select", "eq", "neq", "order"]) {
    builder[method] = vi.fn((...args: unknown[]) => {
      calls.push([method, ...args]);
      return builder;
    });
  }
  builder.maybeSingle = vi.fn(() => {
    calls.push(["maybeSingle"]);
    return Promise.resolve(result);
  });
  builder.then = (
    resolve: (value: unknown) => unknown,
    reject: (reason: unknown) => unknown,
  ) => Promise.resolve(result).then(resolve, reject);
  return { client: builder, calls };
}
