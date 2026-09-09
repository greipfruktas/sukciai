import { readFile } from "node:fs/promises";

function argument(name: string) { const index = process.argv.indexOf(name); return index >= 0 ? process.argv[index + 1] : undefined; }
const from = argument("--from");
const sourceIds = argument("--source-ids")?.split(",").filter(Boolean) ?? [];
const skaidrinamPath = argument("--skaidrinam");
if (!from || !/^\d{4}-\d{2}-\d{2}$/.test(from)) throw new Error("Būtinas --from YYYY-MM-DD argumentas.");

let skaidrinamRecords = 0;
if (skaidrinamPath) {
  const content = await readFile(skaidrinamPath, "utf8");
  skaidrinamRecords = content.trim() ? Math.max(0, content.trim().split("\n").length - 1) : 0;
}

console.log(JSON.stringify({ mode: "validated_dry_run", from, sourceIds, skaidrinamPath: skaidrinamPath ?? null, skaidrinamRecords, note: "Gamybinis adapteris turi siųsti kiekvieną įrašą per bendrą publikavimo politiką." }, null, 2));
