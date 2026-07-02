#!/usr/bin/env node
// Documentation Sync Guard — detect-only 문서 동기화 가드.
// 원칙: Node 내장 모듈만 사용 / 네트워크 호출 없음 / 자동 수정 없음.
// 판정: ERROR >= 1 -> exit 1, 아니면 exit 0 (warning은 통과).
// SSOT: docs-guard.config.json (필수문서/센티넬/검사옵션).

import { readFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, ".."); // scripts/ 의 상위 = repo 루트

const errors = [];
const warnings = [];
const err = (cat, msg) => errors.push(`ERROR [${cat}] ${msg}`);
const warn = (cat, msg) => warnings.push(`WARN  [${cat}] ${msg}`);

const readLines = (abs) => readFileSync(abs, "utf8").split(/\r?\n/);

// 0. config 로드·검증
const cfgPath = resolve(repoRoot, "docs-guard.config.json");
let cfg;
try {
  cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
} catch (e) {
  console.error(`ERROR [config] docs-guard.config.json 로드 실패: ${e.message}`);
  console.log("docs-guard: 1 errors, 0 warnings — FAIL");
  process.exit(1);
}

// 1. 루트 필수 문서 존재
for (const doc of cfg.rootRequiredDocs ?? []) {
  if (!existsSync(resolve(repoRoot, doc))) err("root-doc", `필수 문서 없음: ${doc}`);
}

// 2. 템플릿 필수 문서 존재
for (const doc of cfg.templateRequiredDocs ?? []) {
  if (!existsSync(resolve(repoRoot, doc))) err("template-doc", `템플릿 문서 없음: ${doc}`);
}

// 3. inline Markdown 상대링크 무결성 ( [text](link) 만 대상 )
const ignorePrefixes = cfg.markdownLinkIgnorePrefixes ?? [];
const linkRe = /(?<!\!)\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
for (const target of cfg.markdownLinkCheckTargets ?? []) {
  const fileAbs = resolve(repoRoot, target);
  if (!existsSync(fileAbs)) continue; // 미존재는 1·2단계에서 이미 보고
  const fileDir = dirname(fileAbs);
  let inFence = false;
  readLines(fileAbs).forEach((line, i) => {
    // 코드블록(``` / ~~~)은 토글하여 내부를 건너뛴다.
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; return; }
    if (inFence) return;
    // 인라인 코드(`...`) 내부의 링크 표기는 예시일 뿐이므로 제거 후 검사한다.
    const scrubbed = line.replace(/`[^`]*`/g, "");
    linkRe.lastIndex = 0;
    let m;
    while ((m = linkRe.exec(scrubbed)) !== null) {
      const raw = m[1];
      if (ignorePrefixes.some((p) => raw.startsWith(p))) continue;
      const pathPart = raw.split("#")[0];
      if (pathPart === "") continue; // 순수 앵커
      const destAbs = resolve(fileDir, pathPart);
      const isDirLink = pathPart.endsWith("/");
      if (!existsSync(destAbs)) {
        err("md-link", `${target}:${i + 1} → ${raw} (대상 없음)`);
      } else if (isDirLink && !statSync(destAbs).isDirectory()) {
        err("md-link", `${target}:${i + 1} → ${raw} (디렉터리 아님)`);
      }
    }
  });
}

// 4 & 5. PROJECTS.md 테이블 최소 구조 + STATUS 포인터 문법
const pt = cfg.projectsTable ?? {};
const sentinels = cfg.allowedStatusPointerSentinels ?? [];
const rules = cfg.statusPointerRules ?? {};
const rel = rules.repoRelative ?? {};
const urlRule = rules.url ?? {};
const projFileAbs = resolve(repoRoot, pt.file ?? "PROJECTS.md");

const splitRow = (line) => line.split("|").slice(1, -1).map((c) => c.trim());
const isSep = (cells) => cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c));

function validatePointer(project, pointer, lineNo) {
  const where = `${pt.file}:${lineNo} (${project})`;
  if (sentinels.includes(pointer)) return; // ① 센티넬
  if (/^https?:\/\//.test(pointer)) {       // ② URL (network 미검사)
    const schemes = urlRule.requireScheme ?? ["http://", "https://"];
    const okScheme = schemes.some((s) => pointer.startsWith(s));
    let parseOk = true;
    try { new URL(pointer); } catch { parseOk = false; }
    if (okScheme && parseOk) warn("status-pointer", `${where}: URL 포인터 비권장 (network 미검사)`);
    else err("status-pointer", `${where}: 잘못된 URL 포인터: ${pointer}`);
    return;
  }
  // ③ repo-relative
  const problems = [];
  if (pointer === "") problems.push("빈 포인터");
  if (rel.denyLeadingSlash && pointer.startsWith("/")) problems.push("leading slash 금지");
  if (rel.denyBackslash && pointer.includes("\\")) problems.push("backslash 금지");
  if (rel.denyDotDot && pointer.split("/").includes("..")) problems.push(".. 경로 금지");
  const mustEnd = rel.mustEndWith ?? "STATUS.md";
  if (!pointer.endsWith(mustEnd)) problems.push(`${mustEnd} 로 끝나야 함`);
  if (problems.length) {
    err("status-pointer", `${where}: ${problems.join(", ")} (값: "${pointer}")`);
    return;
  }
  // selfProjectName 행만 실제 존재 검사, 그 외는 문법만
  if (rel.existenceCheckWhenSelfProject && project === cfg.selfProjectName) {
    if (!existsSync(resolve(repoRoot, pointer))) {
      err("status-pointer", `${where}: self 프로젝트 STATUS 파일 없음: ${pointer}`);
    }
  }
}

if (!existsSync(projFileAbs)) {
  err("table", `${pt.file} 없음`);
} else {
  const lines = readLines(projFileAbs);
  const required = pt.requiredColumns ?? [];
  let headerIdx = -1;
  let header = null;
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim().startsWith("|")) continue;
    const cells = splitRow(lines[i]);
    if (required.every((c) => cells.includes(c))) { headerIdx = i; header = cells; break; }
  }
  if (headerIdx === -1) {
    err("table", `${pt.file}: requiredColumns(${required.join(", ")}) 헤더 표를 찾지 못함`);
  } else {
    const projIdx = header.indexOf("프로젝트");
    const statusIdx = header.indexOf(pt.statusPointerColumn);
    for (let i = headerIdx + 1; i < lines.length; i++) {
      if (!lines[i].trim().startsWith("|")) break; // 표 종료
      const cells = splitRow(lines[i]);
      if (isSep(cells)) continue; // 구분선
      if (cells.length !== header.length) {
        err("table-row", `${pt.file}:${i + 1} 셀 수(${cells.length}) != 헤더(${header.length})`);
        continue;
      }
      validatePointer(cells[projIdx], cells[statusIdx], i + 1);
    }
  }
}

// 출력
if (errors.length) { console.log("── ERRORS ──"); errors.forEach((e) => console.log(e)); }
if (warnings.length) { console.log("── WARNINGS ──"); warnings.forEach((w) => console.log(w)); }
console.log(
  `docs-guard: ${errors.length} errors, ${warnings.length} warnings — ${errors.length ? "FAIL" : "PASS"}`
);
process.exit(errors.length ? 1 : 0);
