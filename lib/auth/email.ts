export async function sendTotpEmail(to: string, code: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL,
      to,
      subject: "Dein Login-Code",
      html: `<p>Dein Code lautet: <strong>${code}</strong></p><p>Er ist 10 Minuten gültig.</p>`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend error: ${response.status}`);
  }
}
