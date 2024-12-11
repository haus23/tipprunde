import * as v from 'valibot';

const colorSchemeSchema = v.picklist(['dark', 'light']);
const themeColorSchema = v.picklist(['default']);

const themeSchema = v.object({
  colorScheme: colorSchemeSchema,
  themeColor: themeColorSchema,
});

export type ColorScheme = v.InferInput<typeof colorSchemeSchema>;
export type ThemeColor = v.InferInput<typeof themeColorSchema>;

export type Theme = v.InferInput<typeof themeSchema>;
