import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { createPublicClient } from "@/lib/supabase/public-client";

import { parseRow } from "./query";
import { profileSchema, type Profile } from "./schemas";
import { contentTags } from "./tags";

/** The site owner's profile, or null when it hasn't been entered yet. */
export async function getProfile(): Promise<Profile | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(contentTags.all, contentTags.profile);

  const result = await createPublicClient()
    .from("profile")
    .select(
      "full_name, headline, bio, location, links, avatar:media_assets(storage_path, alt_text, width, height)",
    )
    .maybeSingle();

  return parseRow("profile", result, profileSchema);
}
