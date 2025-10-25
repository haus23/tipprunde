import { render, toPlainText } from "@react-email/components";
import { env } from "./env.server";
import SendTotpEmail from "~/email/send-totp";

/**
 * Sends email with login code to user
 *
 * @param request Request object
 * @param emailProps Username, email-address and the login code
 */
export async function sendCodeMail(emailProps: {
  name: string;
  email: string;
  code: string;
}) {
  const { name, code, email } = emailProps;

  const html = await render(<SendTotpEmail name={name} code={code} />);
  const text = toPlainText(html);

  await sendMail(
    {
      from: `Tipprunde <${env.WELCOME_EMAIL}>`,
      to: `${name} <${email}>`,
      subject: "Tipprunde Login Code",
      category: "totp",
      html,
      text,
    },
    "Postmark",
  );
}

// Abstraction Layer

type EmailProps = {
  from: string;
  to: string;
  subject: string;
  html?: string;
  text: string;
  category: string;
};

type Provider = "Resend" | "Postmark";

async function sendMail(props: EmailProps, provider: Provider = "Resend") {
  switch (provider) {
    case "Postmark":
      return await sendMailWithPostmark(props);
    default:
      return await sendMailWithResend(props);
  }
}

async function sendMailWithPostmark({
  from,
  to,
  subject,
  html,
  text,
  category,
}: EmailProps) {
  const httpBody = {
    From: from,
    To: to,
    Subject: subject,
    HtmlBody: html,
    TextBody: text,
    Tag: category,
    MessageStream: "outbound",
  };

  const response = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    body: JSON.stringify(httpBody),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": `${env.POSTMARK_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Probleme beim Email-Versand");
  }
}

async function sendMailWithResend(props: EmailProps) {
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
    throw new Error("Probleme beim Email-Versand");
  }
}
