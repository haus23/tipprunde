import { data, type ActionFunctionArgs } from "react-router";
import { setUserPreference, type ColorScheme } from "~/utils/user-prefs.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const colorScheme = formData.get("colorScheme") as ColorScheme;

  // Validate the color scheme value
  if (!colorScheme || !["light", "dark", "system"].includes(colorScheme)) {
    return data({ success: false, error: "Invalid color scheme" }, { status: 400 });
  }

  try {
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
  } catch (error) {
    return data({ success: false, error: "Failed to update color scheme" }, { status: 500 });
  }
}