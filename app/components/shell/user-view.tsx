import { useUser } from "~/utils/user";
import { NavLink } from "../ui/nav-link";
import { LogInIcon, LogOutIcon, SettingsIcon } from "lucide-react";

export function UserView() {
  const user = useUser();

  if (user) {
    return (
      <div className="flex flex-col gap-2">
        <NavLink to="/hinterhof">
          <SettingsIcon className="size-5" />
          <span>Manager</span>
        </NavLink>
        <NavLink to="/logout">
          <LogOutIcon className="size-5" />
          <span>Log Out</span>
        </NavLink>
      </div>
    );
  } else {
    return (
      <div>
        <NavLink to="/login">
          <LogInIcon className="size-5" />
          <span>Log In</span>
        </NavLink>
      </div>
    );
  }
}
