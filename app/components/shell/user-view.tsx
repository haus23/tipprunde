import { Form } from "react-router";
import { LogOutIcon } from "lucide-react";
import { useUser } from "~/lib/auth/user";
import { Button } from "../ui/button";
import { SidebarItem } from "./sidebar-item";

export function UserView() {
  const user = useUser();

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs uppercase group-data-[sidebar-collapsed=true]/shell:hidden">
        {user.name}
      </span>
      <Form method="post" action="/logout">
        <SidebarItem tooltip="Abmelden">
          <Button
            type="submit"
            variant="plain"
            className="w-full justify-start gap-2.5 px-2 py-1 rounded-md group-data-[sidebar-collapsed=true]/shell:w-8 overflow-hidden [&>svg]:size-5 [&>svg]:shrink-0"
          >
            <LogOutIcon />
            <span>Abmelden</span>
          </Button>
        </SidebarItem>
      </Form>
    </div>
  );
}
