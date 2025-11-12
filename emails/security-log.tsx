import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface SecurityLogEmailProps {
  attemptedEmail: string;
  timestamp: string;
}

export const SecurityLogEmail = ({
  attemptedEmail,
  timestamp,
}: SecurityLogEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Login-Versuch mit unbekannter Email: {attemptedEmail}</Preview>
      <Container style={container}>
        <Heading style={h1}>🔒 Sicherheitsprotokoll</Heading>

        <Text style={text}>
          Es wurde ein Login-Versuch mit einer unbekannten Email-Adresse
          registriert:
        </Text>

        <Section style={infoBox}>
          <Text style={infoText}>
            <strong>Email:</strong> {attemptedEmail}
          </Text>
          <Text style={infoText}>
            <strong>Zeitpunkt:</strong> {timestamp}
          </Text>
        </Section>

        <Text style={footerText}>
          Dies ist eine automatische Benachrichtigung des
          Sicherheitsüberwachungssystems.
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

SecurityLogEmail.PreviewProps = {
  attemptedEmail: "unknown@example.com",
  timestamp: new Date().toLocaleString("de-DE"),
} as SecurityLogEmailProps;

export default SecurityLogEmail;

// Styles
const main = {
  backgroundColor: "#f6f6f6",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "20px",
  borderRadius: "8px",
  maxWidth: "600px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 20px",
  padding: "0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 20px",
};

const infoBox = {
  backgroundColor: "#f9f9f9",
  border: "1px solid #e0e0e0",
  borderRadius: "4px",
  padding: "16px",
  marginBottom: "20px",
};

const infoText = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "8px 0",
  fontFamily: "monospace",
};

const footerText = {
  color: "#666",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "20px 0 0",
  fontStyle: "italic",
};

const linkContainer = {
  textAlign: "center" as const,
  marginTop: "20px",
};

const linkText = {
  color: "#818283",
};
