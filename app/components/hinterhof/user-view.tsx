import { Form } from "react-router";
import { LogOutIcon } from "lucide-react";
import { useUser } from "~/lib/auth/use-user";
import { Button } from "../ui/button";
import { SidebarItem } from "../shell/sidebar-item";

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
      <SidebarItem tooltip="Abmelden">
        <Form method="post" action="/logout">
          <Button type="submit" variant="icon" className="w-full justify-start">
            <LogOutIcon />
            <span>Abmelden</span>
          </Button>
        </Form>
      </SidebarItem>
    </div>
  );
}
