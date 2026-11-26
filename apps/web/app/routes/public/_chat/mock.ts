// Mocked chat history — stands in for the chat database until it exists (see
// docs/decisions/01-chat.md). Deterministic, so every reload shows the same
// conversation; long enough to exercise loading older pages.

export type ChatMessage = {
  id: number;
  /** Display name of the sender; `null` is the logged-in user. */
  author: string | null;
  body: string;
  createdAt: Date;
};

const AUTHORS = [
  "Duschi",
  "Olli",
  "Chris",
  "Kay Z",
  "Rouge",
  "Falk",
  "Eberhard",
  "Phillip",
  "Frank",
  "Calle",
  "Lille",
];

const LINES = [
  "Hat jemand das Spiel gestern gesehen?",
  "Unfassbar, der Elfer in der Nachspielzeit.",
  "Mein Tipp war natürlich wieder ein Punkt daneben.",
  "Wer hat denn bitte auf ein 0:0 gesetzt?",
  "Ich!",
  "Respekt.",
  "Die Abwehr stand heute wie ein Hühnerhaufen.",
  "Nächste Runde wird alles besser, versprochen.",
  "Das sagst du jede Runde 😄",
  "Joker gesetzt und prompt verloren. Typisch.",
  "Wann ist eigentlich Tippschluss für Runde 4?",
  "Freitag, 20:30, wie immer vor dem ersten Anpfiff.",
  "Danke!",
  "Tabelle sieht auch schon wieder traurig aus für mich.",
  "Abwarten, die Zusatzfragen kommen ja noch.",
  "Ich hab bei den Zusatzfragen komplett geraten.",
  "Wie jeder hier.",
  "Kann mal jemand den Stadionsenf zur letzten Runde lesen? Großartig.",
  "Der Schiri hatte heute aber auch keinen guten Tag.",
  "Hätte, hätte, Fahrradkette.",
  "Nur noch drei Punkte bis zur Spitze!",
  "Freu dich nicht zu früh.",
  "Wer schaut heute Abend mit?",
  "Bin dabei, Kneipe wie immer?",
  "Klar.",
  "Das war mal ein Volltreffer, 2:1 genau getippt 🎯",
  "Glückwunsch, verdient.",
  "Pures Glück.",
  "Erfahrung, mein Lieber. Erfahrung.",
  "Morgen das Topspiel – wer tippt was?",
  "Ich sag 1:1, keiner traut sich was.",
  "Heimsieg, ganz klar.",
  "Ich bleib bei meinem Unentschieden-System.",
  "Das System hat dich letzte Runde 12 Punkte gekostet.",
  "Langfristig zahlt es sich aus.",
  "Wenn das mal ein Wort zum Sonntag ist.",
];

// A tiny linear congruential generator — enough to vary authors, texts and
// gaps without changing between reloads.
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 2 ** 32;
    return state / 2 ** 32;
  };
}

/** The full mocked history, oldest first, ending a few minutes ago. */
export function mockHistory(count = 240): ChatMessage[] {
  const random = seeded(23);
  const messages: ChatMessage[] = [];
  let time = Date.now() - 8 * 60 * 1000;
  let author = AUTHORS[0]!;

  // Built newest first, walking back in time, then reversed.
  for (let i = 0; i < count; i++) {
    // The newest three stay with others, so the mocked unread count holds.
    const isSelf = i >= 3 && random() < 0.15;
    if (random() < 0.55) author = AUTHORS[Math.floor(random() * AUTHORS.length)]!;
    messages.push({
      id: count - i,
      author: isSelf ? null : author,
      body: LINES[Math.floor(random() * LINES.length)]!,
      createdAt: new Date(time),
    });
    // Mostly a quick back-and-forth, now and then a quiet stretch of hours.
    const gap = random() < 0.12 ? random() * 9 * 60 : 0.5 + random() * 6;
    time -= gap * 60 * 1000;
  }

  return messages.reverse();
}

const random = seeded(42);

/** A message from someone else arriving "live", with the next free id. */
export function mockIncoming(id: number): ChatMessage {
  return {
    id,
    author: AUTHORS[Math.floor(random() * AUTHORS.length)]!,
    body: LINES[Math.floor(random() * LINES.length)]!,
    createdAt: new Date(),
  };
}
