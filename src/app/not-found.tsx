import Link from "next/link";
import { PageIntro } from "@/components/layout/PageIntro";

export default function NotFound() {
  return (
    <PageIntro title="Page not found">
      <p>
        This page doesn’t exist or is no longer available.{" "}
        <Link href="/">Go to the home page</Link>.
      </p>
    </PageIntro>
  );
}
