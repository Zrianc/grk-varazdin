// Preuzima raspored, rezultate i ljestvicu s HRS-a u mapu data/ (pokreće GitHub Actions).
// Ručno: npx tsx scripts/hrs-sync.ts [mapa]
import { syncToDir } from "../src/lib/hrs";

const dir = process.argv[2] || "data";
syncToDir(dir)
  .then((r) => console.log(r.changed ? `HRS: ažurirano (${r.matches} utakmica, ${r.teams} klubova u ljestvici)` : "HRS: nema promjena"))
  .catch((e) => {
    console.error(String(e));
    process.exit(1);
  });
