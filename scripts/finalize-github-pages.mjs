import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputRoot = path.join(projectRoot, "docs");

async function listFiles(directory, prefix = "") {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(path.join(directory, entry.name), relativePath)));
    } else if (entry.name !== "sw.js") {
      files.push(relativePath);
    }
  }

  return files;
}

const precacheFiles = await listFiles(outputRoot);
const swPath = path.join(outputRoot, "sw.js");
const originalServiceWorker = await fs.readFile(swPath, "utf8");
const injectedServiceWorker = originalServiceWorker.replace(
  "const CORE_ASSETS = [",
  `const BUILD_ASSETS = ${JSON.stringify(
    precacheFiles.map((file) => `./${file}`),
    null,
    2,
  )};\nconst CORE_ASSETS = [\n  ...BUILD_ASSETS.map((asset) => new URL(asset, APP_ROOT).href),`,
);

await fs.writeFile(swPath, injectedServiceWorker);
await fs.writeFile(path.join(outputRoot, ".nojekyll"), "");
