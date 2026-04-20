import "dotenv/config";

const NODE_URL = `http://localhost:${process.env.PORT || 5000}`;
const ML_URL   = process.env.ML_SERVICE_URL || "http://localhost:5001";

async function check(label: string, url: string) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (res.ok) console.log(`[OK] ${label} → ${url}`);
    else        console.log(`[WARN] ${label} returned ${res.status}`);
  } catch {
    console.log(`[FAIL] ${label} → ${url} — not reachable`);
  }
}

async function main() {
  console.log("🔥 Warming up services...\n");
  await check("Node.js API", `${NODE_URL}/api/health`);
  await check("ML Service",  `${ML_URL}/ml/health`);
  console.log("\n✅ Warm-up complete");
}

main();
