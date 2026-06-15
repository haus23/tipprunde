# Ranking Refactor — Arbeitsnotizen

<!-- Hier einfach auf Deutsch eintragen, welche Datenänderungen Einfluss auf das Ranking haben. -->
<!-- Freies Format — Liste, Tabelle, Fließtext, egal. -->

> Idee dieses Dokuments: welche Änderung an den Daten führt zu welcher Berechnung. Diese Berechnung ist abhängig sowohl von den fundamentalen Änderungen Tipp eines Spielers und Ergebnis des Spiels als auch von diversen Flags in den Daten und im Regelwerk

Wenn ich im folgenden von Änderung spreche, meine ich sowohl das initiale Eintragen als auch
nachträgliche Änderungen

## Aktueller Stand (neue Turnier verändern dieses)

### Änderung Spiel - Ergebnis

Alle Tipps werden berechnet

- abhängig von der tipRuleId im ruleset des Turniers: TIP_RULES
- abhängig von Jokern (später auch extra Jokern - folgt später und ist eine einfache JOKER_RULES Änderung die problemlos auf dem Tipp iterativ eingeführt wird als optionales Flag)
- triggert applyMatchRule - eventuelle zusätzliche Punkte durch MATCH_RULES, die durch ein (iterativ) neues optionales Flag auf dem Tipp gekennzeichnet werden zur späteren Visulisierung
- triggert Ranking Berechnung

## Änderung Tipp

Dieser Tipp wird neu berechnet falls ein Ergebnis des Spiels schon vorlag

- abhängig von der tipRuleId im ruleset des Turniers: TIP_RULES
- abhängig von Jokern (später auch extra Jokern - folgt später und ist eine einfache JOKER_RULES Änderung die problemlos auf dem Tipp iterativ eingeführt wird als optionales Flag)
- triggert applyMatchRule - eventuelle zusätzliche Punkte durch MATCH_RULES, die durch ein (iterativ) neues optionales Flag auf dem Tipp gekennzeichnet werden zur späteren Visulisierung
- triggert Ranking Berechnung

## Toggle Flag extraQuestionPointsPublished

Die Punkte der Zusatzfragen werden akkumuliert übernommen in die Ranking Berechnung

- triggert Ranking Berechnung

## Zukunft

Eine Runde kann "abgeschlossen" werden, damit ein expliziter Zeitpunkt existiert, an dem
spezielle ROUND_RULES greifen und zusätzliche Punkte für diese Runde verggeben. Das können
zum Beispiel Zusatzpunkte für einen oder mehrere Tipps (neues optionales Flag auf dem Tipp)
sein oder auch extra Punkte für das gute Abschneiden in dieser Runde (roundPoints Tabelle).

- triggert applyRoundRule
- triggert Ranking Berechnung

## Offen

Immer noch unklar ist mit, was wir mit Runden machen, in denen es keine ROUND_RULE gibt.
Mit ROUND_RULE ist das flag "completed" in der Manager UI klar zu togglen.

Aber: jede Runde hat das completed flag not null. Also sehen alle Runde ohne ROUND_RULE aus
wie "nicht abgeschlossen"

- Lösung 1: Refaktor als nullable -> nullable bedeute "nichts" im Sinne von irrelevant
- Lösung 2: Markiere Runde als abgeschlossen, falls das letzte Spiel-Ergebnis eingetragen wurde und es keine besondere ROUND_RULE gab
- Lösoung 3: Markiere Runden als abgeschlossen, wenn das Turnier abgeschlossen wird.

## Implizite Klarheiten:

Abschliessen eines Turniers bedeutet nur eine visuelle Änderung im Frontend. Wenn alle Regeln so sitzen, könnte jederzeit alles ohne Problem geändert werden. Falls das ungewünscht ist (offene Diskussion) müssten wir die UI von allem (Tipps, Ergebnisse, Flags) disablen.
