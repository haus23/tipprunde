import { AppSidebar } from '~/components/shell/app-sidebar';

interface Props {
  children: React.ReactNode;
}

export function AppShell({ children }: Props) {
  return (
    <div className="flex">
      <div className="w-64">
        <AppSidebar />
      </div>
      <main className="grow p-4">{children}</main>
    </div>
  );
}
