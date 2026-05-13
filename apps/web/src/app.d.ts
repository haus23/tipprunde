declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: { id: number; name: string; role: "user" | "manager" | "admin" };
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
