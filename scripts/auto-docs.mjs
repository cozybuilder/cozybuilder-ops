#!/usr/bin/env node
// Auto Documentation Sync — v0 dry-run 전용.
// 절대 규칙: 파일을 쓰지 않는다 / bot commit·push 없음 / GLOBAL·DOC_APPROVALS 미대상.
// fail-closed: DOC_APPROVALS.md 에서 status=active 인 block 만 실행 후보.
//   그마저도 v0 에서는 "AUTO-DOCS 마커 존재 여부 + 실행 계획"만 dry-run 출력(쓰기 없음).

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");
const args = new Set(process.argv.slice(2));

// v0 은 dry-run 전용. 실제 쓰기 요청은 거부.
if (args.has("--write") || args.has("--apply")) {
  console.error("ERROR: v0 는 dry-run 전용입니다. 실제 자동수정(--write/--apply)은 미지원입니다.");
  process.exit(2);
}

const readText = (abs) => readFileSync(abs, "utf8");
const readLines = (abs) => readText(abs).split(/\r?\n/);

// selfProjectName (repo 스코프 판정용)
let selfProject = "cozybuilder-ops";
try {
  const g = JSON.parse(readText(resolve(repoRoot, "docs-guard.config.json")));
  selfProject = g.selfProjectName ?? selfProject;
} catch { /* 기본값 사용 */ }

// capability 로드
const cfgAbs = resolve(repoRoot, "auto-docs.config.json");
if (!existsSync(cfgAbs)) { console.error("ERROR: auto-docs.config.json 없음"); process.exit(2); }
let cfg;
try { cfg = JSON.parse(readText(cfgAbs)); }
catch (e) { console.error(`ERROR: auto-docs.config.json 파싱 실패: ${e.message}`); process.exit(2); }

// 승인장부(DOC_APPROVALS.md Registry) 로드: block_id -> status
function loadApprovals(abs) {
  const map = new Map();
  if (!existsSync(abs)) return map;
  let header = null;
  for (const line of readLines(abs)) {
    if (!line.trim().startsWith("|")) { if (header) break; else continue; }
    const cells = line.split("|").slice(1, -1).map((c) => c.trim());
    if (cells.length && cells.every((c) => /^:?-+:?$/.test(c))) continue;
    if (!header) { header = cells; continue; }
    const bi = header.indexOf("block_id");
    const si = header.indexOf("status");
    if (bi >= 0 && si >= 0 && cells.length === header.length) map.set(cells[bi], cells[si]);
  }
  return map;
}
const approvals = loadApprovals(resolve(repoRoot, "DOC_APPROVALS.md"));

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const hasMarker = (content, id) =>
  new RegExp(`<!--\\s*AUTO-DOCS:START:${escapeRe(id)}\\s*-->`).test(content);

const proposalOnly = [], notHere = [], noMarker = [], ready = [];

for (const b of cfg.blocks ?? []) {
  const status = approvals.get(b.block_id);
  if (status !== "active") { proposalOnly.push(`${b.block_id} (status=${status ?? "none"})`); continue; }
  // 이 레포에서 실행 가능한 대상만(그 외는 프로그램 레포 몫)
  if (b.repository !== selfProject) { notHere.push(`${b.block_id} (repository=${b.repository})`); continue; }
  const docAbs = resolve(repoRoot, b.document);
  if (!existsSync(docAbs) || !hasMarker(readText(docAbs), b.block_id)) {
    noMarker.push(`${b.block_id} → ${b.document}`);
    continue;
  }
  ready.push(`${b.block_id} → ${b.document} (${b.mode})`);
}

console.log("== Auto-Docs DRY-RUN (v0 · 쓰기 없음 · commit/push 없음) ==");
console.log(`blocks=${(cfg.blocks ?? []).length} / active-in-repo 실행후보(마커 존재)=${ready.length}`);
const dump = (title, arr) => { if (arr.length) { console.log(`-- ${title} --`); arr.forEach((x) => console.log(`   ${x}`)); } };
dump("proposal-only (active 아님 → 자동수정 안 함)", proposalOnly);
dump("이 레포 미대상 (repository=* 또는 타 레포)", notHere);
dump("ops 문서지만 AUTO-DOCS 마커 없음 → 대상 아님", noMarker);
dump("자동수정 후보 (마커 존재, v0 는 미기록)", ready);
console.log("auto-docs: dry-run OK — 0 writes, 0 commits — PASS");
process.exit(0);
