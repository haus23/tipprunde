import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Login | runde.tips" };

export default function Page() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="border-input flex w-full max-w-sm flex-col gap-6 rounded-xl border p-8">
        <h1 className="text-2xl font-medium">Log In</h1>
        <LoginForm />
      </div>
    </main>
  );
}
