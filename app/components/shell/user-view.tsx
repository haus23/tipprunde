import { useUser } from "~/utils/user";
import { NavLink } from "../ui/nav-link";
import { LogInIcon, LogOutIcon, SettingsIcon } from "lucide-react";
import { useFetcher } from "react-router";

export function UserView() {
  const user = useUser();
  const fetcher = useFetcher();

  if (user) {
    return (
      <div className="flex flex-col gap-2">
        <NavLink to="/hinterhof">
          <SettingsIcon size={18} />
          <span>Manager</span>
        </NavLink>
        <fetcher.Form method="post" action="/logout" className="flex flex-col">
          <button type="submit" className="flex items-center gap-2 px-1">
            <LogOutIcon size={18} />
            <span>Log Out</span>
          </button>
        </fetcher.Form>
      </div>
    );
  } else {
    return (
      <div>
        <NavLink to="/login">
          <LogInIcon size={18} />
          <span>Log In</span>
        </NavLink>
      </div>
    );
  }
}
