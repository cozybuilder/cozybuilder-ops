#!/usr/bin/env node
// Auto Documentation Sync — dry-run + apply.
// 안전 규칙:
//  - AUTO-DOCS 마커 내부만 수정한다.
//  - GLOBAL.md / DOC_APPROVALS.md 는 절대 자동수정하지 않는다.
//  - active 승인(DOC_APPROVALS) + 마커 존재 + 등록된 generator 가 모두 있을 때만 실제 쓰기.
//  - 마커 없음/중복/짝불일치/승인없음/generator없음 → 쓰지 않고 보류(proposal-only) 또는 abort.
//  - bot commit/push 는 하지 않는다.
// 사용: node scripts/auto-docs.mjs [--dry-run|--apply]

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");
const args = new Set(process.argv.slice(2));
const APPLY = args.has("--apply") || args.has("--write");

const readText = (a) => readFileSync(a, "utf8");
const readLines = (a) => readText(a).split(/\r?\n/);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// 절대 자동수정 금지 대상
const NEVER = new Set(["GLOBAL.md", "DOC_APPROVALS.md"]);

let selfProject = "cozybuilder-ops";
try { selfProject = JSON.parse(readText(resolve(repoRoot, "docs-guard.config.json"))).selfProjectName ?? selfProject; } catch { /* 기본값 */ }

const cfgAbs = resolve(repoRoot, "auto-docs.config.json");
if (!existsSync(cfgAbs)) { console.error("ERROR: auto-docs.config.json 없음"); process.exit(2); }
let cfg;
try { cfg = JSON.parse(readText(cfgAbs)); } catch (e) { console.error(`ERROR: config 파싱 실패: ${e.message}`); process.exit(2); }

// DOC_APPROVALS Registry: block_id -> status
function loadApprovals(abs) {
  const map = new Map();
  if (!existsSync(abs)) return map;
  let header = null;
  for (const line of readLines(abs)) {
    if (!line.trim().startsWith("|")) { if (header) break; else continue; }
    const cells = line.split("|").slice(1, -1).map((c) => c.trim());
    if (cells.length && cells.every((c) => /^:?-+:?$/.test(c))) continue;
    if (!header) { header = cells; continue; }
    const bi = header.indexOf("block_id"), si = header.indexOf("status");
    if (bi >= 0 && si >= 0 && cells.length === header.length) map.set(cells[bi], cells[si]);
  }
  return map;
}
const approvals = loadApprovals(resolve(repoRoot, "DOC_APPROVALS.md"));

// ── generators: block_id -> () => 결정적(deterministic) 문자열 ──
const listFiles = (dir, re) => {
  const abs = resolve(repoRoot, dir);
  return existsSync(abs) ? readdirSync(abs).filter((f) => re.test(f)).sort() : [];
};
const generators = {
  "ops-doc-map": () => {
    const g = JSON.parse(readText(resolve(repoRoot, "docs-guard.config.json")));
    return (g.rootRequiredDocs ?? []).map((d) => `- [${d}](${d})`).join("\n");
  },
  "playbook-automation-index": () => {
    const s = listFiles("scripts", /\.mjs$/).map((f) => `- \`scripts/${f}\``);
    const w = listFiles(".github/workflows", /\.ya?ml$/).map((f) => `- \`.github/workflows/${f}\``);
    return ["**scripts**", ...s, "", "**workflows**", ...w].join("\n");
  },
};

function markerCount(content, id) {
  const re = /<!--\s*AUTO-DOCS:(START|END):([A-Za-z0-9_-]+)\s*-->/g;
  let m; const order = [];
  while ((m = re.exec(content)) !== null) { if (m[2] === id) order.push(m[1]); }
  return order;
}
function markersValid(content, id) {
  const order = markerCount(content, id);
  return order.length === 2 && order[0] === "START" && order[1] === "END";
}
function applyBlock(content, id, body) {
  const re = new RegExp(`(<!--\\s*AUTO-DOCS:START:${escapeRe(id)}\\s*-->)[\\s\\S]*?(<!--\\s*AUTO-DOCS:END:${escapeRe(id)}\\s*-->)`);
  return content.replace(re, `$1\n${body}\n$2`);
}

const proposalOnly = [], notHere = [], noMarker = [], noGen = [], ready = [], applied = [], errorsList = [];
const fileEdits = new Map(); // document -> content

for (const b of cfg.blocks ?? []) {
  const status = approvals.get(b.block_id);
  if (status !== "active") { proposalOnly.push(`${b.block_id} (status=${status ?? "none"})`); continue; }
  if (b.repository !== selfProject) { notHere.push(`${b.block_id} (repository=${b.repository})`); continue; }
  if (NEVER.has(b.document)) { errorsList.push(`${b.block_id}: ${b.document} 은 자동수정 금지 대상`); continue; }
  const docAbs = resolve(repoRoot, b.document);
  const content = fileEdits.get(b.document) ?? (existsSync(docAbs) ? readText(docAbs) : null);
  if (content === null) { noMarker.push(`${b.block_id} → ${b.document} (문서 없음)`); continue; }
  if (markerCount(content, b.block_id).length === 0) { noMarker.push(`${b.block_id} → ${b.document} (마커 없음)`); continue; }
  if (!markersValid(content, b.block_id)) { errorsList.push(`${b.block_id}: ${b.document} 마커 무결성 실패(중복/짝)`); continue; }
  const gen = generators[b.block_id];
  if (!gen) { noGen.push(`${b.block_id} → ${b.document} (generator 미등록)`); continue; }
  ready.push(`${b.block_id} → ${b.document} (${b.mode})`);
  if (APPLY) {
    const next = applyBlock(content, b.block_id, gen());
    fileEdits.set(b.document, next);
    if (next !== content) applied.push(`${b.block_id} → ${b.document}`);
  }
}

// abort 시 쓰기 취소
let written = [];
if (APPLY && errorsList.length === 0) {
  for (const [doc, content] of fileEdits) {
    const abs = resolve(repoRoot, doc);
    if (existsSync(abs) && readText(abs) !== content) { writeFileSync(abs, content); written.push(doc); }
  }
}

const mode = APPLY ? "APPLY" : "DRY-RUN";
console.log(`== Auto-Docs ${mode} (bot commit/push 없음) ==`);
console.log(`blocks=${(cfg.blocks ?? []).length} / 실행후보=${ready.length} / 쓰기=${written.length}`);
const dump = (t, a) => { if (a.length) { console.log(`-- ${t} --`); a.forEach((x) => console.log(`   ${x}`)); } };
dump("proposal-only (active 아님)", proposalOnly);
dump("이 레포 미대상 (repository=*/타레포)", notHere);
dump("마커 없음 → 대상 아님", noMarker);
dump("generator 미등록 → 보류(proposal-only)", noGen);
dump("실행후보 (active+마커+generator)", ready);
if (APPLY) dump("실제 수정 적용", applied);
if (written.length) dump("파일 쓰기", written);
if (errorsList.length) { dump("ERROR (abort · 쓰기 취소)", errorsList); console.log(`auto-docs: ${mode} FAIL`); process.exit(1); }
console.log(`auto-docs: ${mode} OK — ${written.length} writes — PASS`);
process.exit(0);
