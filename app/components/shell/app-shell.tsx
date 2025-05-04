interface Props {
  sidebar: React.ElementType;
  children: React.ReactNode;
}

export function AppShell({ children, sidebar }: Props) {
  const Sidebar = sidebar;

  return (
    <div>
      <div>
        <Sidebar />
      </div>
      <main className="p-4">{children}</main>
    </div>
  );
}
