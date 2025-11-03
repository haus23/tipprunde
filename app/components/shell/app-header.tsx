export function AppHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-8 flex items-center gap-4">
      <div>{children}</div>
    </div>
  );
}
