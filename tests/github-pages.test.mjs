import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const projectRoot = path.resolve(import.meta.dirname, "..");
const docsRoot = path.join(projectRoot, "docs");

test("GitHub Pages output uses repository-relative URLs", async () => {
  const html = await readFile(path.join(docsRoot, "index.html"), "utf8");
  assert.match(html, /src="\.\/assets\//);
  assert.match(html, /href="\.\/manifest\.webmanifest"/);
  assert.doesNotMatch(html, /(?:src|href)="\/(?!\/)/);
});

test("PWA manifest and service worker are complete", async () => {
  const manifest = JSON.parse(
    await readFile(path.join(docsRoot, "manifest.webmanifest"), "utf8"),
  );
  const serviceWorker = await readFile(path.join(docsRoot, "sw.js"), "utf8");

  assert.equal(manifest.start_url, "./");
  assert.equal(manifest.scope, "./");
  assert.equal(manifest.orientation, "portrait");
  assert.equal(manifest.icons.length, 2);
  assert.match(serviceWorker, /assets\/index-[^"]+\.js/);
  assert.match(serviceWorker, /assets\/index-[^"]+\.css/);
  assert.match(serviceWorker, /APP_ROOT/);

  await access(path.join(docsRoot, ".nojekyll"));
  assert.ok((await stat(path.join(docsRoot, "icon-192.png"))).size > 1000);
  assert.ok((await stat(path.join(docsRoot, "icon-512.png"))).size > 1000);
});

test("built app keeps character identity and removes obsolete school name", async () => {
  const assetNames = await import("node:fs/promises").then(({ readdir }) =>
    readdir(path.join(docsRoot, "assets")),
  );
  const scriptName = assetNames.find((name) => /^index-.+\.js$/.test(name));
  assert.ok(scriptName);

  const script = await readFile(path.join(docsRoot, "assets", scriptName), "utf8");
  assert.match(script, /강도윤의 휴대전화/);
  assert.match(script, /월백고등학교/);
  assert.doesNotMatch(script, /해원고등학교|이름 정보가 손상되었습니다/);
  assert.doesNotMatch(script, /doyoon-vote|최종 투표|투표 확정/);
  assert.match(script, /사진 상세정보|두 손가락으로 확대/);
  assert.doesNotMatch(script, /"\/assets\//);
});
