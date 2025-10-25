import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface SendTotpEmailProps {
  name: string;
  code: string;
}

export const SendTotpEmail = ({ name, code }: SendTotpEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Login Code für die Tipprunde: {code}</Preview>
      <Container style={container}>
        <Section style={logoContainer}>
          <Row>
            <Column>
              <Img
                src="https://www.runde.tips/img/logo-with-bg.png"
                width="48"
                height="40"
                alt="Haus23 Logo"
              />
            </Column>
            <Column style={logoTextContainer}>
              <Text style={logoText}>runde.tips</Text>
            </Column>
          </Row>
        </Section>
        <Heading style={h1}>Hallo {name}!</Heading>
        <Text style={heroText}>
          Du hast einen Login-Code angefordert. Und hier ist er! Du kannst ihn
          manuell in deinem geöffneten Browser eintippen oder kopieren und
          einfügen.
        </Text>

        <Section style={codeBox}>
          <Text style={confirmationCodeText}>{code}</Text>
        </Section>

        <Text style={text}>
          Achtung: Der Code ist nur fünf Minuten gültig und funktioniert nur in
          dem Browser, in dem du die Anmeldung gestartet hast.
        </Text>

        <Section style={linkContainer}>
          <Link style={linkText} href="https://www.runde.tips">
            © 2025 Haus23 Tipprunde
          </Link>
        </Section>
      </Container>
    </Body>
  </Html>
);

SendTotpEmail.PreviewProps = {
  name: "Micha",
  code: "710412",
} as SendTotpEmailProps;

export default SendTotpEmail;

// Styles
// TODO: extract and reuse them in a _styles.ts file
// TODO: evaluate tailwind usage

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "0px 20px",
};

const h1 = {
  color: "#1d1c1d",
  fontSize: "36px",
  fontWeight: "500",
  margin: "24px 0",
  padding: "0",
  lineHeight: "42px",
};

const heroText = {
  fontSize: "20px",
  lineHeight: "28px",
  marginBottom: "30px",
  textAlign: "justify" as const,
};

const codeBox = {
  background: "rgb(245, 244, 245)",
  borderRadius: "4px",
  marginBottom: "30px",
  padding: "40px 10px",
};

const confirmationCodeText = {
  fontSize: "36px",
  textAlign: "center" as const,
  verticalAlign: "middle",
  letterSpacing: "2px",
};

const text = {
  color: "#000",
  fontSize: "14px",
  lineHeight: "24px",
  textAlign: "justify" as const,
};

const logoContainer = {
  marginTop: "32px",
};

const logoTextContainer = {
  width: "100%",
  paddingLeft: "8px",
};

const logoText = {
  fontSize: "28px",
};

const linkContainer = {
  textAlign: "center" as const,
};

const linkText = {
  color: "#818283",
};
