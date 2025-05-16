import { Logo } from '~/components/shell/logo';
import { Link } from '~/components/ui/link';

export function AppSidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-clip border-app-6 border-r shadow-sm">
      <div className="fixed inset-y-0 left-0 hidden w-[calc(var(--sidebar-width)-1px)] overflow-y-auto bg-app-1 md:flex md:flex-col">
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
