import { renderSendCodeEmail } from '~/emails/send-code';
import { renderSendSecurityLogEmail } from '~/emails/send-security-log';

import { env } from './env.server';

/**
 * Notifies admin about a security breach
 *
 * @param props Subject and security message
 */
export async function sendErrorMail({
  subject,
  msg,
}: {
  subject: string;
  msg: string;
}) {
  const { html, text } = await renderSendSecurityLogEmail({
    name: 'Root',
    msg,
  });

  await sendMail({
    from: `Tipprunde Security <${env.SECURITY_EMAIL}>`,
    to: `Tipprunde Root <${env.ROOT_EMAIL}>`,
    category: 'security',
    subject,
    html,
    text,
  });
}

/**
 * Sends email with login code to user
 *
 * @param props Username, email-address and the login code
 */
export async function sendCodeMail(props: {
  userName: string;
  code: string;
  email: string;
}) {
  const { userName, code, email } = props;
  const { html, text } = await renderSendCodeEmail({
    name: userName,
    code,
    magicLink: `https://www.runde.tips/onboarding?code=${code}`,
  });

  await sendMail(
    {
      from: `Tipprunde <${env.WELCOME_EMAIL}>`,
      to: `${userName} <${email}>`,
      subject: 'Tipprunde Login Code',
      category: 'totp',
      html,
      text,
    },
    'Postmark',
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

type Provider = 'Resend' | 'Postmark';

async function sendMail(props: EmailProps, provider: Provider = 'Resend') {
  switch (provider) {
    case 'Postmark':
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
    MessageStream: 'outbound',
  };

  const response = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    body: JSON.stringify(httpBody),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': `${env.POSTMARK_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error('Probleme beim Email-Versand');
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
    tags: [{ name: 'category', value: props.category }],
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    body: JSON.stringify(httpBody),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.RESEND_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error('Probleme beim Email-Versand');
  }
}
