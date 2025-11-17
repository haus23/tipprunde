import { data } from "react-router";
import { createUser, getUserByEmail, getUserBySlug } from "~/lib/db/users";
import type { Route } from "./+types/create";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("name")).trim();
  const slug = String(formData.get("slug")).trim();
  const email = String(formData.get("email") || "").trim() || null;

  // Validation
  const errors: Record<string, string> = {};

  if (!name) {
    errors.name = "Name ist erforderlich";
  }
  if (!slug) {
    errors.slug = "Slug ist erforderlich";
  } else {
    // Check for unique slug
    const existingSlug = getUserBySlug(slug);
    if (existingSlug) {
      errors.slug = "Slug bereits vergeben";
    }
  }

  // Check for unique email if provided
  if (email) {
    const existingEmail = getUserByEmail(email);
    if (existingEmail) {
      errors.email = "E-Mail bereits vergeben";
    }
  }

  if (Object.keys(errors).length > 0) {
    return data({ success: false, errors }, { status: 400 });
  }

  createUser({ name, slug, email, role: "USER" });

  return data({ success: true });
}
