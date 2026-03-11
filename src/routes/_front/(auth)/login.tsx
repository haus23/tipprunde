import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/routes/_front/(auth)/-login-form.tsx";

export const Route = createFileRoute("/_front/(auth)/login")({
  head: () => ({
    meta: [{ title: "Log In | runde.tips" }],
  }),
  component: LoginRoute,
});

function LoginRoute() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="border-input flex w-full max-w-sm flex-col gap-6 rounded-xl border p-8">
        <h1 className="text-2xl font-medium">Log In</h1>
        <LoginForm />
      </div>
    </div>
  );
}
