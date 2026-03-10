import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CURRENT_CHAMPIONSHIP_COOKIE } from "@/proxy";

export default async function ManagerPage() {
  const cookieStore = await cookies();
  const currentSlug = cookieStore.get(CURRENT_CHAMPIONSHIP_COOKIE)?.value;

  if (currentSlug) {
    redirect(`/manager/${currentSlug}`);
  }

  const latest = await db.query.championships.findFirst({
    orderBy: { nr: "desc" },
  });

  if (latest) {
    redirect(`/manager/${latest.slug}`);
  }

  redirect("/manager/stammdaten/turniere");
}
