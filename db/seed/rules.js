export function seedRules(db) {
  // Check if original rules already exist
  const existingRule = db
    .prepare("SELECT id FROM rules WHERE id = 'original-rules'")
    .get();

  if (existingRule) {
    console.log("✓ Original rules already exist, skipping");
    return;
  }

  // Insert initial rule set
  const insert = db.prepare(`
    INSERT INTO rules (id, name, description, tipRuleId, jokerRuleId)
    VALUES (?, ?, ?, ?, ?)
  `);

  insert.run(
    "original-rules",
    "Original-Regeln (2002)",
    "Die Regeln der ersten Meisterschaften: 3 Punkte für exakten Tipp, 1 Punkt für richtigen Ausgang. Zwei Joker pro Meisterschaft, die die Punkte verdoppeln. Keine Zusatzfragen.",
    "drei-oder-ein-punkt",
    "zwei-joker-gesamt"
  );

  console.log("✓ Original rules seeded successfully");
}
