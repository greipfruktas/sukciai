import { officialSourceRegistry } from "../src/features/sources/registry";

process.stdout.write(`${JSON.stringify(officialSourceRegistry, null, 2)}\n`);
