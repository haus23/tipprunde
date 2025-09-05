import * as v from "valibot";
import { useLoaderData, useFetcher } from "react-router";
import type { loader } from "~/root";

export const ColorSchemeSchema = v.picklist(["light", "dark", "system"]);
export type ColorScheme = v.InferOutput<typeof ColorSchemeSchema>;

export const UserPreferencesSchema = v.object({
  colorScheme: v.optional(ColorSchemeSchema, "system"),
});
export type UserPreferences = v.InferOutput<typeof UserPreferencesSchema>;

export function useTheme() {
  const { userPrefs } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const setColorScheme = (colorScheme: ColorScheme, options?: { closeMobileNav?: () => void }) => {
    fetcher.submit(
      { colorScheme },
      {
        method: "POST",
        action: "/action/set-theme",
      },
    );
    
    // Close mobile navigation if callback provided
    if (options?.closeMobileNav) {
      options.closeMobileNav();
    }
  };

  return {
    colorScheme: userPrefs.colorScheme,
    setColorScheme,
  };
}
