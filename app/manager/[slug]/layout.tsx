import type { Metadata } from "next";
import type React from "react";

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const label = slug.toUpperCase().replace(/([A-Z]+)(\d+)/, "$1 $2");
  return { title: { template: `${label} – %s`, default: label } };
}

export default function SlugLayout({ children }: Props) {
  return children;
}
