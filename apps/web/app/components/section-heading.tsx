export function SectionHeading({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-muted mb-3 text-xs font-medium tracking-wide uppercase">
      {children}
    </h2>
  );
}
