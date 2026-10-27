import { PgBoss } from "pg-boss";
import { writeFileSync } from "node:fs";
import { validateProductionEnvironment } from "../src/lib/production-config.ts";

const env = validateProductionEnvironment(process.env);
const boss = new PgBoss(env.DATABASE_URL);
await boss.start();
await boss.work("ingest-source", async ([job]) => {
  console.info("Received ingestion job", job.id);
});

async function stop() { await boss.stop({ graceful: true, timeout: 30_000 }); process.exit(0); }
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
writeFileSync("/tmp/worker-ready", new Date().toISOString(), { mode: 0o600 });
console.info("Sukčiai.lt worker ready");
