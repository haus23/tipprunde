import { Form } from "react-router";
import { LogOutIcon } from "lucide-react";
import { useUser } from "~/lib/auth/use-user";
import { Button } from "../ui/button";
import { SidebarItem } from "./sidebar-item";

export function UserView() {
  const user = useUser();

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs uppercase group-data-[sidebar-collapsed=true]:hidden">
        {user.name}
      </span>
      <Form method="post" action="/logout">
        <SidebarItem tooltip="Abmelden">
          <Button
            type="submit"
            variant="icon"
            className="w-full justify-start group-data-[sidebar-collapsed=true]:w-8 overflow-hidden"
          >
            <LogOutIcon />
            <span>Abmelden</span>
          </Button>
        </SidebarItem>
      </Form>
    </div>
  );
}
