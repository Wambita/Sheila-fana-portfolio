/**
 * Every public route; extend as pages are added. Detail routes use the obviously fake
 * rows from supabase/seed.sql, so e2e needs the local stack (doc 09).
 */
export const routes = [
  "/",
  "/projects",
  "/projects/sample-project-one",
  "/disciplines/sample-discipline-a",
  "/disciplines/sample-discipline-b",
  "/publications",
  "/credentials",
  "/experience",
  "/writing",
  "/about",
  "/contact",
] as const;
