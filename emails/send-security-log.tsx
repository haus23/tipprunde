import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  pretty,
  render,
  Text,
} from '@react-email/components';

import {
  container,
  heading,
  hr,
  logo,
  main,
  primary,
  tertiary,
  warning,
} from './_styles';

interface SendSecurityLogProps {
  name: string;
  msg: string;
}

export default function SendSecurityLog({ name, msg }: SendSecurityLogProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>{msg}</Preview>
        <Container style={container}>
          <Link href="https://www.runde.tips/" style={tertiary}>
            Haus23 Tipprunde
          </Link>
          <Img
            src="https://www.runde.tips/img/logo-with-bg.png"
            alt="Logo"
            width="96"
            style={logo}
          />
          <Text style={heading}>Hallo {name}!</Text>
          <Text style={primary}>
            Es wurde eine Sicherheits-Meldung ausgelöst. Hier ist der
            Sicherheits-Log:
          </Text>
          <Text style={warning}>{msg}</Text>
          <Hr style={hr} />
          <Text style={tertiary}>© 2025 Haus23 Tipprunde</Text>
        </Container>
      </Body>
    </Html>
  );
}

SendSecurityLog.PreviewProps = {
  name: 'Micha',
  msg: 'Anmeldung von einem unbekannten Gerät.',
};

export async function renderSendSecurityLogEmail(props: SendSecurityLogProps) {
  const html = await pretty(await render(<SendSecurityLog {...props} />));
  const text = await render(<SendSecurityLog {...props} />, {
    plainText: true,
  });
  return { html, text };
}
