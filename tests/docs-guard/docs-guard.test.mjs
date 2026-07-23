import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

function fixture() {
  const parent = mkdtempSync(join(tmpdir(), "cozy-docs-guard-"));
  const root = join(parent, "repo");
  cpSync(sourceRoot, root, {
    recursive: true,
    filter: (source) => {
      const rel = relative(sourceRoot, source);
      return rel !== ".git" && !rel.startsWith(`.git${sep}`);
    }
  });
  return { parent, root };
}

function run(root) {
  return spawnSync(process.execPath, ["scripts/verify-docs-guard.mjs"], {
    cwd: root,
    encoding: "utf8"
  });
}

function runAutoDocs(root, mode = "--dry-run") {
  return spawnSync(process.execPath, ["scripts/auto-docs.mjs", mode], {
    cwd: root,
    encoding: "utf8"
  });
}

function withFixture(callback) {
  const { parent, root } = fixture();
  try { callback(root); }
  finally { rmSync(parent, { recursive: true, force: true }); }
}

test("baseline passes", () => withFixture((root) => {
  const result = run(root);
  assert.equal(result.status, 0, result.stdout + result.stderr);
}));

test("missing schemaVersion is a config failure", () => withFixture((root) => {
  const path = join(root, "docs-guard.config.json");
  const config = JSON.parse(readFileSync(path, "utf8"));
  delete config.schemaVersion;
  writeFileSync(path, JSON.stringify(config, null, 2));
  const result = run(root);
  assert.equal(result.status, 2);
  assert.match(result.stdout, /schemaVersion/);
}));

test("missing nested archive policy is a config failure", () => withFixture((root) => {
  const path = join(root, "docs-guard.config.json");
  const config = JSON.parse(readFileSync(path, "utf8"));
  delete config.archivePolicy;
  writeFileSync(path, JSON.stringify(config, null, 2));
  const result = run(root);
  assert.equal(result.status, 2);
  assert.match(result.stdout, /archivePolicy/);
}));

test("path traversal is a config failure", () => withFixture((root) => {
  const path = join(root, "docs-guard.config.json");
  const config = JSON.parse(readFileSync(path, "utf8"));
  config.requiredFiles.push("../outside.md");
  writeFileSync(path, JSON.stringify(config, null, 2));
  const result = run(root);
  assert.equal(result.status, 2);
  assert.match(result.stdout, /저장소 밖|\.\./);
}));

test("GLOBAL rejects an unapproved H2", () => withFixture((root) => {
  const path = join(root, "GLOBAL.md");
  writeFileSync(path, `${readFileSync(path, "utf8")}\n## 현재 사업 목표\n\n임시 값\n`);
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /허용되지 않은 H2/);
}));

test("mandatory context byte budget is enforced", () => withFixture((root) => {
  const path = join(root, "GLOBAL.md");
  writeFileSync(path, `${readFileSync(path, "utf8")}\n${"x".repeat(9000)}\n`);
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /context-budget/);
}));

test("PROJECTS rejects operating notes", () => withFixture((root) => {
  const path = join(root, "PROJECTS.md");
  writeFileSync(path, `${readFileSync(path, "utf8")}\n## 운영 메모\n\n누적 이력\n`);
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /허용되지 않은 H2|금지 H2/);
}));

test("STATUS template rejects change history", () => withFixture((root) => {
  const path = join(root, "templates/project-template/docs/STATUS.md");
  writeFileSync(path, `${readFileSync(path, "utf8")}\n## 변경 이력\n\n- 누적\n`);
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /금지 H2/);
}));

test("duplicate ownership fails", () => withFixture((root) => {
  const path = join(root, "docs-guard.config.json");
  const config = JSON.parse(readFileSync(path, "utf8"));
  config.documentRegistry[1].owns.push("organization-constitution");
  writeFileSync(path, JSON.stringify(config, null, 2));
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /이중 소유/);
}));

test("new active Markdown must be registered or belong to a collection", () => withFixture((root) => {
  writeFileSync(join(root, "docs/unregistered.md"), "# unregistered\n");
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /Registry\/collection 미등록/);
}));

test("archive requires a non-SSOT marker", () => withFixture((root) => {
  writeFileSync(join(root, "docs/history/invalid.md"), "# old\n");
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /비정본 marker 없음/);
}));

test("STATUS append capability always fails", () => withFixture((root) => {
  const path = join(root, "auto-docs.config.json");
  const config = JSON.parse(readFileSync(path, "utf8"));
  config.blocks.push({
    block_id: "bad-status-append",
    repository: "cozybuilder-ops",
    document: "docs/STATUS.md",
    mode: "append",
    triggers: ["commit"],
    dataSource: "changed-files",
    generator: "bad-status-append",
    tier: "manual"
  });
  writeFileSync(path, JSON.stringify(config, null, 2));
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /STATUS append/);
}));

test("active approval and capability must match", () => withFixture((root) => {
  const path = join(root, "auto-docs.config.json");
  const config = JSON.parse(readFileSync(path, "utf8"));
  config.blocks[0].triggers = ["different trigger"];
  writeFileSync(path, JSON.stringify(config, null, 2));
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /triggers capability\/approval 불일치/);
}));

test("approval parser ignores lookalike tables outside Registry", () => withFixture((root) => {
  const path = join(root, "DOC_APPROVALS.md");
  const content = readFileSync(path, "utf8");
  const lines = content.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => line.startsWith("| approval_id |"));
  const activeIndex = lines.findIndex((line) => line.startsWith("| apr-ops-doc-map |"));
  const fakeRow = lines[activeIndex].replace("| active |", "| revoked |");
  const fake = `\n## 참고 예시 아님\n\n${lines[headerIndex]}\n${lines[headerIndex + 1]}\n${fakeRow}\n`;
  writeFileSync(path, content.replace("\n## Registry\n", `${fake}\n## Registry\n`));
  const guard = run(root);
  assert.equal(guard.status, 0, guard.stdout + guard.stderr);
  const autoDocs = runAutoDocs(root);
  assert.equal(autoDocs.status, 0, autoDocs.stdout + autoDocs.stderr);
  assert.match(autoDocs.stdout, /실행후보=2/);
}));

test("active approval requires identity dates and checks", () => withFixture((root) => {
  const path = join(root, "DOC_APPROVALS.md");
  const content = readFileSync(path, "utf8").replace(
    "| apr-ops-doc-map | active | cozy |",
    "| apr-ops-doc-map | active |  |"
  );
  writeFileSync(path, content);
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /active 승인 필수 셀 비어 있음/);
}));

test("approval Registry header rejects duplicate or reordered columns", () => withFixture((root) => {
  const path = join(root, "DOC_APPROVALS.md");
  const content = readFileSync(path, "utf8").replace(
    "| approval_id | status | approved_by |",
    "| approval_id | status | status | approved_by |"
  );
  writeFileSync(path, content);
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /순서까지 정확히 일치/);
  const autoDocs = runAutoDocs(root);
  assert.notEqual(autoDocs.status, 0);
}));

test("active auto-docs marker removal fails guard and dry-run", () => withFixture((root) => {
  const path = join(root, "README.md");
  const content = readFileSync(path, "utf8").replace(
    /<!-- AUTO-DOCS:START:ops-doc-map -->[\s\S]*?<!-- AUTO-DOCS:END:ops-doc-map -->/,
    ""
  );
  writeFileSync(path, content);
  const guard = run(root);
  assert.equal(guard.status, 1);
  assert.match(guard.stdout, /active 블록 마커 없음/);
  const autoDocs = runAutoDocs(root);
  assert.notEqual(autoDocs.status, 0);
  assert.match(autoDocs.stderr, /사전 검증 실패/);
}));

test("auto-docs apply refuses repository traversal without writing", () => withFixture((root) => {
  const outside = join(dirname(root), "outside.md");
  writeFileSync(outside, "<!-- AUTO-DOCS:START:ops-doc-map -->\nunchanged\n<!-- AUTO-DOCS:END:ops-doc-map -->\n");
  const path = join(root, "auto-docs.config.json");
  const config = JSON.parse(readFileSync(path, "utf8"));
  config.blocks[0].document = "../outside.md";
  writeFileSync(path, JSON.stringify(config, null, 2));
  const before = readFileSync(outside, "utf8");
  const result = runAutoDocs(root, "--apply");
  assert.notEqual(result.status, 0);
  assert.equal(readFileSync(outside, "utf8"), before);
}));

test("auto-docs apply refuses dot-segment protected path bypass", () => withFixture((root) => {
  const globalPath = join(root, "GLOBAL.md");
  writeFileSync(
    globalPath,
    `${readFileSync(globalPath, "utf8")}\n<!-- AUTO-DOCS:START:ops-doc-map -->\nunchanged\n<!-- AUTO-DOCS:END:ops-doc-map -->\n`
  );
  const configPath = join(root, "auto-docs.config.json");
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  config.blocks[0].document = "./GLOBAL.md";
  writeFileSync(configPath, JSON.stringify(config, null, 2));
  const before = readFileSync(globalPath, "utf8");
  const result = runAutoDocs(root, "--apply");
  assert.notEqual(result.status, 0);
  assert.equal(readFileSync(globalPath, "utf8"), before);
}));

test("auto-docs refuses a protected-document symlink alias", () => withFixture((root) => {
  const readmePath = join(root, "README.md");
  const globalPath = join(root, "GLOBAL.md");
  writeFileSync(
    globalPath,
    `${readFileSync(globalPath, "utf8")}\n<!-- AUTO-DOCS:START:ops-doc-map -->\nunchanged\n<!-- AUTO-DOCS:END:ops-doc-map -->\n`
  );
  rmSync(readmePath);
  symlinkSync("GLOBAL.md", readmePath);
  const before = readFileSync(globalPath, "utf8");
  const guard = run(root);
  assert.equal(guard.status, 1);
  assert.match(guard.stdout, /symbolic link/);
  const autoDocs = runAutoDocs(root, "--apply");
  assert.notEqual(autoDocs.status, 0);
  assert.equal(readFileSync(globalPath, "utf8"), before);
}));

test("auto-docs refuses an ancestor-directory symlink alias", () => withFixture((root) => {
  const globalPath = join(root, "GLOBAL.md");
  writeFileSync(
    globalPath,
    `${readFileSync(globalPath, "utf8")}\n<!-- AUTO-DOCS:START:ops-doc-map -->\nunchanged\n<!-- AUTO-DOCS:END:ops-doc-map -->\n`
  );
  symlinkSync(".", join(root, "alias"));
  const configPath = join(root, "auto-docs.config.json");
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  config.blocks[0].document = "alias/GLOBAL.md";
  writeFileSync(configPath, JSON.stringify(config, null, 2));
  const before = readFileSync(globalPath, "utf8");
  const guard = run(root);
  assert.equal(guard.status, 1);
  assert.match(guard.stdout, /symbolic link/);
  const autoDocs = runAutoDocs(root, "--apply");
  assert.notEqual(autoDocs.status, 0);
  assert.equal(readFileSync(globalPath, "utf8"), before);
}));
