# Theme

The color system of this app is created around the radix colors sand/orange.

Source code for all colors: https://github.com/radix-ui/colors

## Understanding the Scale

The docs: https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale

### Use cases

There are 12 steps in each scale. Each step was designed for at least one specific use case.

This table is a simple overview of the most common use case for each step. However, there are many exceptions and caveats to factor in, which are covered in further detail below.

Step | Use Case

1 | App background
2 | Subtle background
3 | UI element background
4 | Hovered UI element background
5 | Active / Selected UI element background
6 | Subtle borders and separators
7 | UI element border and focus rings
8 | Hovered UI element border
9 | Solid backgrounds
10 | Hovered solid backgrounds
11 | Low-contrast text
12 | High-contrast text

## Color Tokens for tailwindcss

All tailwind colors must be defined as theme color using a light-dark function in the `app/app.css`. The theme vars must use the dedicated color name for its purpose:

Eg:

--background-color-surface: light-dark(color(display-p3 0.992 0.992 0.989), color(display-p3 0 0 0));
--text-color-app: light-dark(...)
--border-color-subtle: ...
--ring-color-...

A derived color of the original sand/orange colors may be used, if a more subtle difference between two steps is needed. Also for any semantic color (success, error, warning) new colors may be choosed.

## Reference Sand/Orange CSS colors

Sand Light
sand1: "color(display-p3 0.992 0.992 0.989)",
sand2: "color(display-p3 0.977 0.977 0.973)",
sand3: "color(display-p3 0.943 0.942 0.936)",
sand4: "color(display-p3 0.913 0.912 0.903)",
sand5: "color(display-p3 0.885 0.883 0.873)",
sand6: "color(display-p3 0.854 0.852 0.839)",
sand7: "color(display-p3 0.813 0.81 0.794)",
sand8: "color(display-p3 0.738 0.734 0.713)",
sand9: "color(display-p3 0.553 0.553 0.528)",
sand10: "color(display-p3 0.511 0.511 0.488)",
sand11: "color(display-p3 0.388 0.388 0.37)",
sand12: "color(display-p3 0.129 0.126 0.111)",

Sand Dark
sand1: "color(display-p3 0.067 0.067 0.063)",
sand2: "color(display-p3 0.098 0.098 0.094)",
sand3: "color(display-p3 0.135 0.135 0.129)",
sand4: "color(display-p3 0.164 0.163 0.156)",
sand5: "color(display-p3 0.193 0.192 0.183)",
sand6: "color(display-p3 0.23 0.229 0.217)",
sand7: "color(display-p3 0.285 0.282 0.267)",
sand8: "color(display-p3 0.384 0.378 0.357)",
sand9: "color(display-p3 0.434 0.428 0.403)",
sand10: "color(display-p3 0.487 0.481 0.456)",
sand11: "color(display-p3 0.707 0.703 0.68)",
sand12: "color(display-p3 0.933 0.933 0.926)",

Orange Light
orange1: "color(display-p3 0.995 0.988 0.985)",
orange2: "color(display-p3 0.994 0.968 0.934)",
orange3: "color(display-p3 0.989 0.938 0.85)",
orange4: "color(display-p3 1 0.874 0.687)",
orange5: "color(display-p3 1 0.821 0.583)",
orange6: "color(display-p3 0.975 0.767 0.545)",
orange7: "color(display-p3 0.919 0.693 0.486)",
orange8: "color(display-p3 0.877 0.597 0.379)",
orange9: "color(display-p3 0.9 0.45 0.2)",
orange10: "color(display-p3 0.87 0.409 0.164)",
orange11: "color(display-p3 0.76 0.34 0)",
orange12: "color(display-p3 0.323 0.185 0.127)",

Orange Dark
orange1: "color(display-p3 0.088 0.07 0.057)",
orange2: "color(display-p3 0.113 0.089 0.061)",
orange3: "color(display-p3 0.189 0.12 0.056)",
orange4: "color(display-p3 0.262 0.132 0)",
orange5: "color(display-p3 0.315 0.168 0.016)",
orange6: "color(display-p3 0.376 0.219 0.088)",
orange7: "color(display-p3 0.465 0.283 0.147)",
orange8: "color(display-p3 0.601 0.359 0.201)",
orange9: "color(display-p3 0.9 0.45 0.2)",
orange10: "color(display-p3 0.98 0.51 0.23)",
orange11: "color(display-p3 1 0.63 0.38)",
orange12: "color(display-p3 0.98 0.883 0.775)",
