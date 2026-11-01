import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = process.env.STUDIO_TEST_PORT || "3100";
const url = `http://127.0.0.1:${port}`;
const child = spawn(
  process.execPath,
  [
    path.join(root, "node_modules/next/dist/bin/next"),
    "dev",
    "--port",
    port,
    "--hostname",
    "127.0.0.1",
  ],
  { cwd: root, stdio: ["ignore", "pipe", "pipe"] },
);
let output = "";
child.stdout.on("data", (chunk) => {
  output += chunk;
});
child.stderr.on("data", (chunk) => {
  output += chunk;
});
try {
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      if ((await fetch(url, { signal: AbortSignal.timeout(2500) })).ok) {
        ready = true;
        break;
      }
    } catch {}
    if (child.exitCode !== null) break;
    await delay(200);
  }
  if (!ready)
    throw new Error(
      `Stop any existing npm run dev process before running this test.\n${output}`,
    );
  await new Promise((resolve, reject) => {
    const review = spawn(
      process.execPath,
      [path.join(root, "scripts/browser-review.mjs")],
      {
        cwd: root,
        env: { ...process.env, STUDIO_REVIEW_URL: url },
        stdio: "inherit",
      },
    );
    review.on("error", reject);
    review.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error("Browser checks failed.")),
    );
  });
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  child.kill("SIGTERM");
}
