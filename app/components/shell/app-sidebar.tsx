import { Link } from "react-router";
import { Logo } from "./logo";
import { UserView } from "./user-view";

export function AppSidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col border-r">
      <div className="p-2">
        <Link to="/" className="flex items-center gap-1">
          <Logo className="size-8" />
          <span className="text-lg">runde.tips</span>
        </Link>
      </div>
      <div className="grow p-2 flex flex-col">{children}</div>
      <hr className="my-1" />
      <div className="p-2">
        <UserView />
      </div>
    </div>
  );
}
