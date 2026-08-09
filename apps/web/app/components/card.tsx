export function Card({ children }: { children: React.ReactNode }) {
  return <div className="border-subtle bg-surface-raised rounded-md border">{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-6">{children}</div>;
}
