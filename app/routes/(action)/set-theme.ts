import { data, type ActionFunctionArgs } from "react-router";
import * as v from "valibot";
import { setUserPreference, ColorSchemeSchema } from "~/utils/user-prefs.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const colorSchemeInput = formData.get("colorScheme");

  // Validate the color scheme value
  const result = v.safeParse(ColorSchemeSchema, colorSchemeInput);
  if (!result.success) {
    return data(
      { success: false, error: "Invalid color scheme", issues: result.issues },
      { status: 400 }
    );
  }

  const colorScheme = result.output;

  // Set the color scheme preference
  const cookie = await setUserPreference(request, "colorScheme", colorScheme);

  return data(
    { success: true, colorScheme },
    {
      headers: {
        "Set-Cookie": cookie,
      },
    }
  );
}