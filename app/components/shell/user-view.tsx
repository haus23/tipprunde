import { UserRoundIcon } from "lucide-react";
import { useFetcher } from "react-router";
import { useUser } from "~/utils/user";

export function UserView() {
  const user = useUser();
  const fetcher = useFetcher();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2 px-1">
      <div>
        <UserRoundIcon size={18} />
      </div>
      <div className="flex flex-col text-sm">
        <span className="font-semibold">{user.name}</span>
        <fetcher.Form method="post" action="/logout" className="">
          <button type="submit" className="text-xs hover:underline">
            Log Out
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
}
