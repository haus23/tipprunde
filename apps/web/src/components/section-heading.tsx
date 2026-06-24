export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-muted mb-3 text-xs font-medium tracking-wide uppercase">{children}</h2>
  );
}
