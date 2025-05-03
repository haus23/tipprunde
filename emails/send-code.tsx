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
  Section,
  Text,
} from '@react-email/components';

interface SendTotpEmailProps {
  name: string;
  code: string;
  magicLink: string;
}

export default function SendCode({
  name,
  code,
  magicLink,
}: SendTotpEmailProps) {
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

const mauve = {
  mauve1: '#fdfcfd',
  mauve2: '#faf9fb',
  mauve3: '#f2eff3',
  mauve4: '#eae7ec',
  mauve5: '#e3dfe6',
  mauve6: '#dbd8e0',
  mauve7: '#d0cdd7',
  mauve8: '#bcbac7',
  mauve9: '#8e8c99',
  mauve10: '#84828e',
  mauve11: '#65636d',
  mauve12: '#211f26',
};

const violet = {
  violet1: '#fdfcfe',
  violet2: '#faf8ff',
  violet3: '#f4f0fe',
  violet4: '#ebe4ff',
  violet5: '#e1d9ff',
  violet6: '#d4cafe',
  violet7: '#c2b5f5',
  violet8: '#aa99ec',
  violet9: '#6e56cf',
  violet10: '#654dc4',
  violet11: '#6550b9',
  violet12: '#2f265f',
};

const main = {
  backgroundColor: mauve.mauve1,
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  marginBottom: '16px',
  padding: '24px 16px',
  border: '1px solid #eee',
  borderRadius: '5px',
  boxShadow: '0 5px 10px ' + mauve.mauve6,
};

const heading = {
  color: violet.violet12,
  fontSize: '24px',
  fontWeight: 'medium',
  lineHeight: '32px',
  margin: '16px 0 0',
  textAlign: 'center' as const,
};

const primary = {
  color: mauve.mauve12,
  fontSize: '16px',
  lineHeight: '28px',
  textAlign: 'center' as const,
};

const secondary = {
  color: mauve.mauve11,
  fontSize: '16px',
  lineHeight: '28px',
  textAlign: 'center' as const,
};

const tertiary = {
  fontSize: '16px',
  color: mauve.mauve10,
  display: 'block',
  textAlign: 'center' as const,
};

const logo = {
  margin: '12px auto 0',
};

const codeContainer = {
  background: mauve.mauve3,
  borderRadius: '4px',
  margin: '16px auto 14px',
  verticalAlign: 'middle',
  width: '280px',
};

const codeNumbers = {
  color: '#000',
  fontFamily: 'HelveticaNeue-Bold',
  fontSize: '32px',
  fontWeight: 700,
  letterSpacing: '6px',
  lineHeight: '40px',
  paddingBottom: '8px',
  paddingTop: '8px',
  margin: '0 auto',
  display: 'block',
  textAlign: 'center' as const,
};

const buttonContainer = {
  margin: '16px auto 14px',
  verticalAlign: 'middle',
  width: '280px',
};

const button = {
  marginTop: '16px',
  backgroundColor: violet.violet9,
  borderRadius: '5px',
  color: '#fff',
  display: 'block',
  fontSize: '16px',
  fontWeight: 'semi-bold',
  textAlign: 'center' as const,
  textDecoration: 'none',
  padding: '12px 64px',
  margin: '0 auto',
};

const hr = {
  borderColor: mauve.mauve6,
  margin: '20px 0',
};

const linkContainer = {
  background: mauve.mauve3,
  borderRadius: '4px',
  margin: '16px auto 14px',
  verticalAlign: 'middle',
};

const linkText = {
  color: mauve.mauve11,
  fontSize: '16px',
  lineHeight: '28px',
  textAlign: 'center' as const,
  padding: '0 16px',
};
