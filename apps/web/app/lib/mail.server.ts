const RESEND_API_KEY = process.env["RESEND_API_KEY"]!;
const FROM_EMAIL = process.env["FROM_EMAIL"]!;

export type Mail = {
  to: string;
  subject: string;
  html: string;
  /**
   * Required, not optional: a mail without a plaintext part looks like spam to
   * filters, and some clients render nothing at all.
   */
  text: string;
};

export async function sendMail({ to, subject, html, text }: Mail): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html, text }),
  });

  if (!res.ok) {
    // Resend explains itself in the body — the bare status sent debugging down
    // the wrong path more than once.
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend error: ${res.status}${detail ? ` — ${detail}` : ""}`);
  }
}
