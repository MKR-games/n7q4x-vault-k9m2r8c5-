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
  const styleName = assetNames.find((name) => /^index-.+\.css$/.test(name));
  assert.ok(scriptName);
  assert.ok(styleName);

  const script = await readFile(path.join(docsRoot, "assets", scriptName), "utf8");
  const styles = await readFile(path.join(docsRoot, "assets", styleName), "utf8");
  assert.match(script, /강도윤의 휴대전화/);
  assert.match(script, /월백고등학교/);
  assert.doesNotMatch(script, /해원고등학교|이름 정보가 손상되었습니다/);
  assert.doesNotMatch(script, /doyoon-vote|최종 투표|투표 확정/);
  assert.match(script, /사진 상세정보|두 손가락으로 확대/);
  assert.match(script, /doyoon-phone-activity/);
  assert.match(script, /모든 메시지를 읽었습니다/);
  assert.match(script, /대화 검색/);
  assert.match(script, /읽기 전용/);
  assert.match(script, /doyoon-guide-font-size/);
  assert.match(script, /글자 크기/);
  assert.match(script, /app-icon-shell/);
  assert.match(script, /app-badge/);
  assert.match(script, /010-0000-7182/);
  assert.match(script, /010-0000-6431/);
  assert.match(script, /010-0000-8725/);
  assert.match(script, /010-0000-6158/);
  assert.match(script, /010-0000-9346/);
  assert.match(script, /010-0000-2040/);
  assert.match(script, /010-0000-2357/);
  assert.doesNotMatch(
    script,
    /010-(?!0000-)\d{4}-\d{4}|052-\d{3,4}-\d{4}/,
  );
  assert.match(script, /8월 · 날짜 정보 손상 · 오후 5:46/);
  assert.doesNotMatch(script, /10월 12일 오후 5:46/);
  assert.match(script, /10월 13일 일요일/);
  assert.match(script, /ENC_VIDEO_1013\.bin/);
  assert.match(script, /차단기 확인이라고 말하기/);
  assert.match(styles, /\.app-icon-shell\{[^}]*overflow:visible/);
  assert.match(styles, /\.app-icon\{[^}]*overflow:hidden/);
  assert.doesNotMatch(script, /"\/assets\//);
});
