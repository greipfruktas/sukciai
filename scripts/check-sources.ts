const officialSources = ["https://stt.lt", "https://www.prokuraturos.lt", "https://www.teismai.lt", "https://vtek.lt", "https://vpt.lrv.lt"];
const live = process.argv.includes("--live");
const results: { url: string; available: boolean | null; status?: number; error?: string }[] = [];

for (const url of officialSources) {
  if (!live) { results.push({ url, available: null }); continue; }
  try {
    const response = await fetch(url, { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(8_000) });
    results.push({ url, available: response.ok || (response.status >= 300 && response.status < 400), status: response.status });
  } catch (error) {
    results.push({ url, available: false, error: error instanceof Error ? error.message : "unknown_error" });
  }
}

const critical = results.filter((item) => item.available === false);
console.log(JSON.stringify({ mode: live ? "live" : "configuration", checkedAt: new Date().toISOString(), configured: results.length, critical: critical.length, results }, null, 2));
if (live && critical.length > 0) process.exitCode = 1;
