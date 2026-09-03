import type { Mail } from "#/lib/mail.server.ts";

/**
 * The login code as a mail.
 *
 * Hand-rolled HTML on purpose. Mail clients are stuck two decades behind the
 * browser: layout goes through tables, styles have to be inline, and anything
 * modern (flex, grid, custom properties) is unreliable. The app's own tokens
 * are display-p3, which no client supports — so the Radix Sand/Orange values
 * below are their sRGB equivalents, kept in sync by hand.
 */

const ACCENT_TEXT = "#cc4e00"; // orange11 — accent on light, for text
const SAND_1 = "#fdfdfc";
const SAND_2 = "#f9f9f8";
const SAND_6 = "#dad9d6";
const SAND_11 = "#63635e";
const SAND_12 = "#21201c";

const DARK_SAND_1 = "#111110";
const DARK_SAND_2 = "#191918";
const DARK_SAND_6 = "#3b3a37";
const DARK_SAND_11 = "#b5b3ad";
const DARK_SAND_12 = "#eeeeec";
const DARK_ACCENT_TEXT = "#ffa057"; // orangeDark11

/**
 * Absolute, because mail has no relative paths. Deliberately the apex and not
 * `next.` — the file is mirrored in `apps/web/public/img`, so this same URL
 * keeps working once the domain moves here and `next.` goes away. Until then
 * it is served by the legacy stack, where it has to be uploaded by hand.
 *
 * A downscale of `logo-with-bg.png` (3160x2610, 276 KB — absurd for a 40px
 * mark) to 120x99 at 3.9 KB, greyscale+alpha since the artwork has no colour.
 * The white-background variant on purpose: `logo.png` is black on transparent
 * and would vanish against a dark client background. Its white tile is a
 * rounded rectangle with transparent corners, so the img needs no radius of
 * its own — one would clip the tile's own corners a second time.
 */
const LOGO_URL = "https://runde.tips/img/logo-email.png";

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO_STACK = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

function minutes(seconds: number): string {
  const m = Math.round(seconds / 60);
  return m === 1 ? "eine Minute" : `${m} Minuten`;
}

export function loginCodeMail(code: string, expiresIn: number): Omit<Mail, "to"> {
  const validity = `Der Code gilt ${minutes(expiresIn)}.`;

  // Shown in the inbox preview line, then hidden in the body itself. Without
  // one, clients pull the first visible text and the preview reads "runde.tips".
  const preheader = `Dein Anmelde-Code für runde.tips. ${validity}`;

  const html = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>Dein Anmelde-Code</title>
    <style>
      /* Outlook on Windows draws with the Word engine, which puts its own
         spacing around table cells and scales images crudely. */
      table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { -ms-interpolation-mode: bicubic; }

      /* Only Apple Mail, iOS and Outlook.com honour this — Gmail ignores it
         entirely, so the inline light styles have to stand on their own. */
      @media (prefers-color-scheme: dark) {
        .page { background-color: ${DARK_SAND_1} !important; }
        .card { background-color: ${DARK_SAND_2} !important; border-color: ${DARK_SAND_6} !important; }
        .heading, .code { color: ${DARK_SAND_12} !important; }
        .prose { color: ${DARK_SAND_11} !important; }
        .wordmark, .accent { color: ${DARK_ACCENT_TEXT} !important; }
        .rule { border-color: ${DARK_SAND_6} !important; }
        .codebox { background-color: ${DARK_SAND_1} !important; border-color: ${DARK_SAND_6} !important; }
      }
    </style>
    <!--[if mso]>
    <style>
      * { font-family: Arial, Helvetica, sans-serif !important; }
      .code { font-family: Consolas, 'Courier New', monospace !important; }
    </style>
    <![endif]-->
  </head>
  <body class="page" style="margin:0; padding:0; width:100%; background-color:${SAND_1};">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">${preheader}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="page" style="background-color:${SAND_1};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <!--[if mso]>
          <table role="presentation" width="440" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td>
          <![endif]-->

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:440px;">
            <tr>
              <td style="padding-bottom:20px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <!-- alt is empty on purpose: the wordmark right next to it already
                         carries the name, so a blocked image must not repeat it. -->
                    <td valign="middle" style="padding-right:10px; line-height:0; font-size:0;">
                      <img src="${LOGO_URL}" width="40" height="33" alt="" style="display:block; width:40px; height:33px; border:0;" />
                    </td>
                    <td valign="middle" style="font-family:${FONT_STACK}; font-size:15px; font-weight:600; letter-spacing:-0.01em;">
                      <span class="wordmark" style="color:${ACCENT_TEXT};">runde.tips</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="card" style="background-color:${SAND_2}; border:1px solid ${SAND_6}; border-radius:8px; padding:28px 28px 24px 28px;">

                <p class="heading" style="margin:0 0 6px 0; font-family:${FONT_STACK}; font-size:17px; font-weight:600; color:${SAND_12};">
                  Dein Anmelde-Code
                </p>
                <p class="prose" style="margin:0 0 20px 0; font-family:${FONT_STACK}; font-size:14px; line-height:1.5; color:${SAND_11};">
                  Gib diesen Code im Anmelde-Fenster ein, um dich anzumelden.
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td class="codebox" align="center" style="background-color:${SAND_1}; border:1px solid ${SAND_6}; border-radius:6px; padding:16px 12px;">
                      <span class="code" style="font-family:${MONO_STACK}; font-size:30px; font-weight:600; letter-spacing:0.22em; color:${SAND_12};">${code}</span>
                    </td>
                  </tr>
                </table>

                <p class="prose" style="margin:16px 0 0 0; font-family:${FONT_STACK}; font-size:13px; line-height:1.5; color:${SAND_11};">
                  ${validity}
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td class="rule" style="border-top:1px solid ${SAND_6}; font-size:0; line-height:0; height:1px; padding:0;">&nbsp;</td>
                  </tr>
                </table>

                <p class="prose" style="margin:16px 0 0 0; font-family:${FONT_STACK}; font-size:13px; line-height:1.5; color:${SAND_11};">
                  Du wolltest dich gar nicht anmelden? Dann ignoriere diese Mail einfach — ohne den
                  Code passiert nichts.
                </p>

              </td>
            </tr>

            <tr>
              <td class="prose" style="padding:16px 4px 0 4px; font-family:${FONT_STACK}; font-size:12px; line-height:1.5; color:${SAND_11};">
                Haus23 Tipprunde
              </td>
            </tr>
          </table>

          <!--[if mso]>
          </td></tr></table>
          <![endif]-->
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    "Dein Anmelde-Code für runde.tips",
    "",
    code,
    "",
    validity,
    "",
    "Du wolltest dich gar nicht anmelden? Dann ignoriere diese Mail einfach —",
    "ohne den Code passiert nichts.",
    "",
    "Haus23 Tipprunde",
  ].join("\n");

  return { subject: "Dein Anmelde-Code für runde.tips", html, text };
}
