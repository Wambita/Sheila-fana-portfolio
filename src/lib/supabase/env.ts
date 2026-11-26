import { z } from "zod";

const publicEnvSchema = z.object({
  url: z.url(),
  anonKey: z.string().min(1),
});

export type PublicSupabaseEnv = z.infer<typeof publicEnvSchema>;

/**
 * Reads the public Supabase settings. Throws a readable error when they are missing,
 * so a misconfigured build fails loudly instead of rendering empty pages.
 */
export function getPublicSupabaseEnv(
  // Literal `process.env.NEXT_PUBLIC_*` reads so Next.js can inline them.
  env: Record<string, string | undefined> = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
): PublicSupabaseEnv {
  const result = publicEnvSchema.safeParse({
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  if (!result.success) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY " +
        "(see .env.example; locally, run `npx supabase status`).",
    );
  }
  return result.data;
}
