import { Logo } from '~/components/shell/logo';
import { Link } from '~/components/ui/link';

export function AppSidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[var(--sidebar-width)] border-app-6 border-r shadow-sm">
      <div className="fixed inset-y-0 left-0 flex w-[calc(var(--sidebar-width)-1px)] flex-col bg-app-1">
        <div className="p-2">
          <Link to={'/'} className="flex items-center gap-x-1">
            <Logo className="size-8" />
            <span className="text-lg">runde.tips</span>
          </Link>
        </div>
        <hr className="border-app-6" />
        {children}
      </div>
    </div>
  );
}
