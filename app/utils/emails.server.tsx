import { render, toPlainText } from "@react-email/components";
import { env } from "./env.server";
import { SecurityLogEmail } from "~/emails/security-log";
import { SendCodeEmail } from "~/emails/send-code";

/**
 * Sends email with login code to user
 *
 * @param emailProps Username, email-address and the login code
 */
export async function sendCodeMail(emailProps: {
  name: string;
  email: string;
  code: string;
}) {
  const { name, code, email } = emailProps;

  const html = await render(<SendCodeEmail name={name} code={code} />);
  const text = toPlainText(html);

  await sendMail({
    from: `Tipprunde <${env.WELCOME_EMAIL}>`,
    to: `${name} <${email}>`,
    subject: "Tipprunde Login Code",
    category: "login-code",
    html,
    text,
  });
}

/**
 * Sends security log email for invalid login attempts
 *
 * @param attemptedEmail Email address that was used for login attempt
 * @param timestamp Timestamp of the attempt
 */
export async function sendSecurityLogMail(
  attemptedEmail: string,
  timestamp: string,
) {
  const html = await render(
    <SecurityLogEmail attemptedEmail={attemptedEmail} timestamp={timestamp} />,
  );
  const text = toPlainText(html);

  await sendMail({
    from: `Tipprunde Security <${env.SECURITY_EMAIL}>`,
    to: env.ROOT_EMAIL,
    subject: `Login-Versuch mit unbekannter Email: ${attemptedEmail}`,
    category: "security-log",
    html,
    text,
  });
}

// Email sending implementation

type EmailProps = {
  from: string;
  to: string;
  subject: string;
  html?: string;
  text: string;
  category: string;
};

async function sendMail(props: EmailProps) {
  const { from, to, subject, html, text } = props;
  const httpBody = {
    from,
    to,
    subject,
    html,
    text,
    tags: [{ name: "category", value: props.category }],
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    body: JSON.stringify(httpBody),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.RESEND_TOKEN}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error("Resend API error:", {
      status: response.status,
      name: errorData?.name,
      message: errorData?.message,
      category: props.category,
    });
    throw new Error("Probleme beim Email-Versand");
  }
}
