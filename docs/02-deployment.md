# Deployment

Fernes Ziel ist ein Serverless-Deployment (idealerweise bei/über Cloudflare).
Da fehlen mir aber noch zuviele Kenntnisse. Insbesondere das konsistente Setzen der
Umgebungsvariablen sowohl während der Entwicklung über Vite als auch zur
Produktionszeit (Wrangler im Falle von Cloudflare) habe ich noch nicht durchschaut.

Also wird zunächst über ein Docker-Image auf meinen eigenen Server deployed.

## Docker

Hier gibt es nicht viel zu sagen. Natürlich muss `pnpm` berücksichtigt werden.
Ansonsten ist es zunächst ein einfaches multi-stage Docker-Image.
