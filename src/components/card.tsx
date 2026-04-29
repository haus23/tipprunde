interface CardProps {
  title: string;
  children: React.ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="bg-surface border-surface rounded-md border">
      <div className="border-input border-b px-4 py-3">
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}
