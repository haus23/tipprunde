import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  pretty,
  render,
  Section,
  Text,
} from '@react-email/components';

import {
  button,
  buttonContainer,
  codeContainer,
  codeNumbers,
  container,
  heading,
  hr,
  linkContainer,
  linkText,
  logo,
  main,
  primary,
  secondary,
  tertiary,
} from './_styles';

interface SendCodeProps {
  name: string;
  code: string;
  magicLink: string;
}

export default function SendCode({ name, code, magicLink }: SendCodeProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Login Code für die Tipprunde: {code}</Preview>
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
            Du hast einen Login-Code angefordert. Und hier ist er! Du kannst ihn
            manuell eintippen oder den Login-Link benutzen.
          </Text>
          <Section style={codeContainer}>
            <Text style={codeNumbers}>{code}</Text>
          </Section>
          <Section style={buttonContainer}>
            <Button style={button} href={magicLink}>
              Login - Link
            </Button>
          </Section>
          <Text style={secondary}>
            Achtung: Code und Link sind genau fünf Minuten gültig und
            funktionieren nur in dem Browser, in dem du die Anmeldung gestartet
            hast.
          </Text>
          <Text style={primary}>Viel Spaß, Dein Tipprunden-Team!</Text>
          <Hr style={hr} />
          <Text style={secondary}>
            Wenn du Probleme hast den Magic-Link Button zu benutzen, kopiere
            einfach den folgenden Text-Link und füge ihn im Browser ein:
          </Text>
          <Section style={linkContainer}>
            <Text style={linkText}>{magicLink}</Text>
          </Section>
          <Text style={tertiary}>© 2025 Haus23 Tipprunde</Text>
        </Container>
      </Body>
    </Html>
  );
}

SendCode.PreviewProps = {
  name: 'Micha',
  code: '546713',
  magicLink: 'https://www.runde.tips/login?code=546713',
};

export async function renderSendCodeEmail(props: SendCodeProps) {
  const html = await pretty(await render(<SendCode {...props} />));
  const text = await render(<SendCode {...props} />, { plainText: true });
  return { html, text };
}
