import type { Metadata } from "next";

import { Prose } from "@/components/content/Prose";
import { InDevelopment } from "@/components/layout/InDevelopment";
import { PageIntro } from "@/components/layout/PageIntro";
import { getProfile } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

/** Biography from the profile record (FR-02). Interests arrive in a later slice. */
export default async function Page() {
  const profile = await getProfile();
  if (!profile?.bio) return <InDevelopment title="About" />;

  return (
    <>
      <PageIntro title="About">
        {profile.location ? <p>Based in {profile.location}.</p> : null}
      </PageIntro>
      <Prose text={profile.bio} />
    </>
  );
}
