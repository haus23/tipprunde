import { browser } from "$app/environment";

type User = App.Locals["user"];

let user = $state<User | undefined>(undefined);

export async function fetchUser() {
  if (!browser) return;
  try {
    const res = await fetch("/api/me");
    user = res.ok ? await res.json() : undefined;
  } catch {
    user = undefined;
  }
}

export const userStore = {
  get current() {
    return user;
  },
  get id() {
    return user?.id;
  },
};
