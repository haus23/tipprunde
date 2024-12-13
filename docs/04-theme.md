# Theme

## ColorScheme (Light or Dark Mode)

Das Dark-/Light-Mode Styling ist in Tailwind konfiguriert über einen Klassenselektor. 
Zusätzlich setze ich bei den Farben auf die `light-dark` - CSS-Funktion, um mir
viel Code zu ersparen. Default-Modus ist `light`. Zur Zeit wird die Client-Einstellung
ignoriert. Eventuell könnte man `client-hints` auswerten. Das funktioniert aber noch nicht
im Firefox.

Falls Container Style-Queries auch im Firefox ankommen, könnte darüber ebenfalls die
Client-Einstellung genutzt werden ohne zusätzliches JavaScript.

## ThemeColor

Es ist einiges vorbereitet, aber noch nicht zu Ende entwickelt. Zur Zeit wird
auch nur eine Farbe genutzt: `grass` als `default` Akzentfarbe. 
