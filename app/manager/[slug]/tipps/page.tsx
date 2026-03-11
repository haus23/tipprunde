import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tipps" };

export default function Page({ params }: { params: { slug: string } }) {
  return <h1 className="px-4 text-2xl font-medium sm:px-0">tipps</h1>;
}
