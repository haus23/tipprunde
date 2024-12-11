# Remix Server

Die App setzt auf den eingebauten Express-Server von `@react-router/serve`.
Solange wir keine Anpassungen benötigen (CSP, Websockets oder ähnliches) bzw.
sogar die Runtime wechseln bleibt der Server als Produktions-Abhängigkeit
im `package.json`.
