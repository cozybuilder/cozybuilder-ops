#!/usr/bin/env node
// Documentation Guard v2 — fail-closed structure, ownership and context checks.
// Node built-ins only. No network. No automatic edits.

import { existsSync, lstatSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");
const realRepoRoot = realpathSync(repoRoot);
const configPath = resolve(repoRoot, "docs-guard.config.json");

const readText = (abs) => readFileSync(abs, "utf8");
const readLines = (abs) => readText(abs).split(/\r?\n/);
const normalizedBytes = (abs) => Buffer.byteLength(readText(abs).replace(/\r\n/g, "\n"), "utf8");
const splitRow = (line) => line.split("|").slice(1, -1).map((cell) => cell.trim());
const isSeparator = (cells) => cells.length > 0 && cells.every((cell) => /^:?-+:?$/.test(cell));
const isSafeRelativePath = (pathValue) => {
  if (typeof pathValue !== "string" || pathValue.trim() === "" || pathValue.includes("\0")) return false;
  if (isAbsolute(pathValue) || pathValue.includes("\\")) return false;
  const parts = pathValue.split("/");
  return !parts.some((part) => part === "" || part === "." || part === "..");
};
const isInsideRealRepo = (absolute) => {
  const rel = relative(realRepoRoot, realpathSync(absolute));
  return rel !== ".." && !rel.startsWith(`..${sep}`);
};
const hasSymlinkComponent = (absolute) => {
  const rel = relative(repoRoot, absolute);
  if (rel === ".." || rel.startsWith(`..${sep}`)) return true;
  let cursor = repoRoot;
  for (const part of rel.split(sep).filter(Boolean)) {
    cursor = resolve(cursor, part);
    if (lstatSync(cursor).isSymbolicLink()) return true;
  }
  return false;
};

function finishConfigFailure(messages) {
  console.log("── CONFIG ERRORS ──");
  messages.forEach((message) => console.log(`ERROR [config] ${message}`));
  console.log(`docs-guard: ${messages.length} config errors — FAIL`);
  process.exit(2);
}

let cfg;
try {
  cfg = JSON.parse(readText(configPath));
} catch (error) {
  finishConfigFailure([`docs-guard.config.json 로드 실패: ${error.message}`]);
}

const configErrors = [];
const allowedTopLevel = new Set([
  "_comment",
  "schemaVersion",
  "selfProjectName",
  "selfRepoName",
  "requiredFiles",
  "rootRequiredDocs",
  "rootMarkdownAllowlist",
  "templateRequiredDocs",
  "markdownLinkCheckTargets",
  "markdownLinkIgnorePrefixes",
  "mandatoryContext",
  "documentContracts",
  "documentRegistry",
  "documentCollections",
  "ownershipRegistryRoots",
  "archivePolicy",
  "projectsTable",
  "allowedStatusPointerSentinels",
  "statusPointerRules",
  "autoDocs"
]);
for (const key of Object.keys(cfg)) {
  if (!allowedTopLevel.has(key)) configErrors.push(`알 수 없는 최상위 키: ${key}`);
}
if (cfg.schemaVersion !== 2) configErrors.push("schemaVersion은 숫자 2여야 함");

const requiredArrays = [
  "requiredFiles",
  "rootRequiredDocs",
  "rootMarkdownAllowlist",
  "templateRequiredDocs",
  "markdownLinkCheckTargets",
  "documentContracts",
  "documentRegistry",
  "documentCollections",
  "ownershipRegistryRoots"
];
for (const key of requiredArrays) {
  if (!Array.isArray(cfg[key]) || cfg[key].length === 0) {
    configErrors.push(`${key}는 비어 있지 않은 배열이어야 함`);
  }
}
if (!Array.isArray(cfg.markdownLinkIgnorePrefixes)) {
  configErrors.push("markdownLinkIgnorePrefixes는 배열이어야 함");
}
if (!cfg.mandatoryContext || typeof cfg.mandatoryContext !== "object") {
  configErrors.push("mandatoryContext 객체가 필요함");
}
if (!cfg.archivePolicy || typeof cfg.archivePolicy !== "object" || !Array.isArray(cfg.archivePolicy.roots)) {
  configErrors.push("archivePolicy.roots 배열이 필요함");
}
if (typeof cfg.archivePolicy?.requiredMarker !== "string" || !cfg.archivePolicy.requiredMarker) {
  configErrors.push("archivePolicy.requiredMarker 문자열이 필요함");
}
if (!cfg.projectsTable || typeof cfg.projectsTable !== "object" || !Array.isArray(cfg.projectsTable.requiredColumns)) {
  configErrors.push("projectsTable과 requiredColumns 배열이 필요함");
}
if (!Array.isArray(cfg.allowedStatusPointerSentinels)) {
  configErrors.push("allowedStatusPointerSentinels는 배열이어야 함");
}
if (!cfg.statusPointerRules || typeof cfg.statusPointerRules !== "object") {
  configErrors.push("statusPointerRules 객체가 필요함");
}
if (!cfg.autoDocs || typeof cfg.autoDocs !== "object" || !Array.isArray(cfg.autoDocs.markerScanTargets)) {
  configErrors.push("autoDocs와 markerScanTargets 배열이 필요함");
}
if (!cfg.autoDocs?.approvalsTable || !Array.isArray(cfg.autoDocs.approvalsTable.requiredColumns)) {
  configErrors.push("autoDocs.approvalsTable.requiredColumns 배열이 필요함");
} else if (new Set(cfg.autoDocs.approvalsTable.requiredColumns).size !== cfg.autoDocs.approvalsTable.requiredColumns.length) {
  configErrors.push("autoDocs.approvalsTable.requiredColumns 중복 금지");
}

function safeRepoPath(pathValue, label) {
  if (!isSafeRelativePath(pathValue)) {
    configErrors.push(`${label}: 정규화된 저장소 상대경로만 허용 (${pathValue ?? "none"})`);
    return;
  }
  const absolute = resolve(repoRoot, pathValue);
  const rel = relative(repoRoot, absolute);
  if (rel === ".." || rel.startsWith(`..${sep}`)) {
    configErrors.push(`${label}: 저장소 밖 경로 금지 (${pathValue})`);
  }
}

const pathLists = [
  ["requiredFiles", cfg.requiredFiles],
  ["rootRequiredDocs", cfg.rootRequiredDocs],
  ["rootMarkdownAllowlist", cfg.rootMarkdownAllowlist],
  ["templateRequiredDocs", cfg.templateRequiredDocs],
  ["markdownLinkCheckTargets", cfg.markdownLinkCheckTargets],
  ["ownershipRegistryRoots", cfg.ownershipRegistryRoots]
];
for (const [label, list] of pathLists) {
  if (Array.isArray(list)) list.forEach((pathValue, index) => safeRepoPath(pathValue, `${label}[${index}]`));
}
for (const [index, contract] of (cfg.documentContracts ?? []).entries()) {
  safeRepoPath(contract?.path, `documentContracts[${index}].path`);
  for (const pattern of contract?.forbiddenRegex ?? []) {
    try { new RegExp(pattern, "m"); } catch (error) {
      configErrors.push(`documentContracts[${index}].forbiddenRegex: ${error.message}`);
    }
  }
}
for (const [index, entry] of (cfg.documentRegistry ?? []).entries()) {
  safeRepoPath(entry?.path, `documentRegistry[${index}].path`);
  if (!Array.isArray(entry?.owns) || entry.owns.length === 0) {
    configErrors.push(`documentRegistry[${index}].owns는 비어 있지 않은 배열이어야 함`);
  }
}
for (const [index, entry] of (cfg.documentCollections ?? []).entries()) {
  safeRepoPath(entry?.root, `documentCollections[${index}].root`);
  if (!Array.isArray(entry?.owns) || entry.owns.length === 0) {
    configErrors.push(`documentCollections[${index}].owns는 비어 있지 않은 배열이어야 함`);
  }
}
for (const [index, pathValue] of (cfg.archivePolicy?.roots ?? []).entries()) {
  safeRepoPath(pathValue, `archivePolicy.roots[${index}]`);
}
for (const [index, pathValue] of (cfg.mandatoryContext?.orderedFiles ?? []).entries()) {
  safeRepoPath(pathValue, `mandatoryContext.orderedFiles[${index}]`);
}
safeRepoPath(cfg.projectsTable?.file, "projectsTable.file");
safeRepoPath(cfg.autoDocs?.configFile, "autoDocs.configFile");
safeRepoPath(cfg.autoDocs?.approvalsFile, "autoDocs.approvalsFile");
for (const [index, pathValue] of (cfg.autoDocs?.markerScanTargets ?? []).entries()) {
  safeRepoPath(pathValue, `autoDocs.markerScanTargets[${index}]`);
}
if (configErrors.length) finishConfigFailure(configErrors);

const errors = [];
const warnings = [];
const err = (category, message) => errors.push(`ERROR [${category}] ${message}`);
const warn = (category, message) => warnings.push(`WARN  [${category}] ${message}`);

function validateExistingPath(pathValue, category, expected = "any") {
  const absolute = resolve(repoRoot, pathValue);
  if (!existsSync(absolute)) return false;
  const entry = lstatSync(absolute);
  if (entry.isSymbolicLink() || hasSymlinkComponent(absolute)) {
    err(category, `${pathValue}: symbolic link 경로 금지`);
    return false;
  }
  if (!isInsideRealRepo(absolute)) {
    err(category, `${pathValue}: 실제 경로가 저장소 밖을 가리킴`);
    return false;
  }
  if (expected === "file" && !entry.isFile()) {
    err(category, `${pathValue}: 일반 파일이어야 함`);
    return false;
  }
  if (expected === "directory" && !entry.isDirectory()) {
    err(category, `${pathValue}: 디렉터리여야 함`);
    return false;
  }
  return true;
}

function duplicates(items) {
  const seen = new Set();
  const dupes = new Set();
  for (const item of items) {
    if (seen.has(item)) dupes.add(item);
    seen.add(item);
  }
  return [...dupes];
}

for (const [label, list] of pathLists) {
  for (const duplicate of duplicates(list ?? [])) err("config-list", `${label} 중복: ${duplicate}`);
}

// 1. Required files and root Markdown allowlist.
for (const file of cfg.requiredFiles) {
  if (!existsSync(resolve(repoRoot, file))) err("required-file", `필수 파일 없음: ${file}`);
  else validateExistingPath(file, "required-file", "file");
}
for (const file of cfg.templateRequiredDocs) {
  if (!existsSync(resolve(repoRoot, file))) err("template-doc", `템플릿 문서 없음: ${file}`);
  else validateExistingPath(file, "template-doc", "file");
}
const rootAllow = new Set(cfg.rootMarkdownAllowlist);
for (const entry of readdirSync(repoRoot, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith(".md") && !rootAllow.has(entry.name)) {
    err("root-doc", `허용되지 않은 루트 Markdown: ${entry.name}`);
  } else if (entry.isSymbolicLink()) {
    err("root-doc", `루트 symbolic link 금지: ${entry.name}`);
  }
}

// 2. Mandatory context order and byte budgets.
const mandatory = cfg.mandatoryContext;
const fixedOrder = ["GLOBAL.md", "PLAYBOOK.md", "PROJECTS.md"];
if (JSON.stringify(mandatory?.orderedFiles) !== JSON.stringify(fixedOrder)) {
  err("context-order", `필독 순서는 ${fixedOrder.join(" → ")}로 고정`);
}
let mandatoryTotal = 0;
for (const file of mandatory?.orderedFiles ?? []) {
  const absolute = resolve(repoRoot, file);
  if (!existsSync(absolute)) {
    err("context-budget", `필독 문서 없음: ${file}`);
    continue;
  }
  const bytes = normalizedBytes(absolute);
  mandatoryTotal += bytes;
  const max = mandatory?.maxBytesByFile?.[file];
  if (!Number.isInteger(max) || max <= 0) err("context-budget", `${file} maxBytes 설정 오류`);
  else if (bytes > max) err("context-budget", `${file} ${bytes}B > ${max}B`);
}
if (!Number.isInteger(mandatory?.maxTotalBytes) || mandatory.maxTotalBytes <= 0) {
  err("context-budget", "maxTotalBytes 설정 오류");
} else if (mandatoryTotal > mandatory.maxTotalBytes) {
  err("context-budget", `필독 합계 ${mandatoryTotal}B > ${mandatory.maxTotalBytes}B`);
}

// 3. Document contracts: exact H1/H2 shape, size, required/forbidden sections.
for (const contract of cfg.documentContracts) {
  const absolute = resolve(repoRoot, contract.path);
  if (!existsSync(absolute)) {
    err("doc-contract", `계약 문서 없음: ${contract.path}`);
    continue;
  }
  const content = readText(absolute);
  const lines = content.split(/\r?\n/);
  const h1 = lines.filter((line) => /^# [^#]/.test(line));
  const h2 = lines.filter((line) => /^## [^#]/.test(line)).map((line) => line.slice(3).trim());
  if (h1.length !== 1) err("doc-contract", `${contract.path}: H1은 정확히 1개여야 함 (${h1.length})`);
  for (const duplicate of duplicates(h2)) err("doc-contract", `${contract.path}: H2 중복: ${duplicate}`);
  if (Number.isInteger(contract.maxBytes) && normalizedBytes(absolute) > contract.maxBytes) {
    err("doc-contract", `${contract.path}: ${normalizedBytes(absolute)}B > ${contract.maxBytes}B`);
  }
  const allowed = contract.allowedH2 ? new Set(contract.allowedH2) : null;
  if (allowed) {
    for (const heading of h2) if (!allowed.has(heading)) err("doc-contract", `${contract.path}: 허용되지 않은 H2: ${heading}`);
    for (const heading of allowed) if (!h2.includes(heading)) err("doc-contract", `${contract.path}: 필수 H2 없음: ${heading}`);
  }
  for (const heading of contract.requiredH2 ?? []) {
    if (!h2.includes(heading)) err("doc-contract", `${contract.path}: 필수 H2 없음: ${heading}`);
  }
  for (const heading of contract.forbiddenH2 ?? []) {
    if (h2.includes(heading)) err("doc-contract", `${contract.path}: 금지 H2: ${heading}`);
  }
  for (const pattern of contract.forbiddenRegex ?? []) {
    if (new RegExp(pattern, "m").test(content)) err("doc-contract", `${contract.path}: 금지 패턴 탐지: /${pattern}/`);
  }
}

// 4. Machine ownership registry.
const registryPaths = new Set();
const ownership = new Map();
for (const entry of cfg.documentRegistry) {
  if (registryPaths.has(entry.path)) err("ownership", `문서 등록 중복: ${entry.path}`);
  registryPaths.add(entry.path);
  if (!existsSync(resolve(repoRoot, entry.path))) err("ownership", `등록 문서 없음: ${entry.path}`);
  else validateExistingPath(entry.path, "ownership", "file");
  for (const key of entry.owns) {
    if (ownership.has(key)) err("ownership", `${key} 이중 소유: ${ownership.get(key)} / ${entry.path}`);
    else ownership.set(key, entry.path);
  }
}
const collectionRoots = [];
for (const entry of cfg.documentCollections) {
  const absoluteRoot = resolve(repoRoot, entry.root);
  if (!existsSync(absoluteRoot)) {
    err("ownership", `문서 collection 루트 없음: ${entry.root}`);
    continue;
  }
  if (!validateExistingPath(entry.root, "ownership", "directory")) continue;
  collectionRoots.push(entry.root);
  for (const key of entry.owns) {
    if (ownership.has(key)) err("ownership", `${key} 이중 소유: ${ownership.get(key)} / ${entry.root}`);
    else ownership.set(key, entry.root);
  }
}

// 5. Archive marker.
function walkMarkdown(directory) {
  if (!existsSync(directory)) return [];
  const output = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolute = resolve(directory, entry.name);
    if (entry.isDirectory()) output.push(...walkMarkdown(absolute));
    else if (entry.isFile() && entry.name.endsWith(".md")) output.push(absolute);
    else if (entry.isSymbolicLink()) {
      err("path", `${relative(repoRoot, absolute)}: governed 경로의 symbolic link 금지`);
    }
  }
  return output;
}
const archiveRoots = cfg.archivePolicy?.roots ?? [];
const isUnderRoot = (pathValue, root) => pathValue === root || pathValue.startsWith(`${root}/`);
for (const root of cfg.ownershipRegistryRoots) {
  const absoluteRoot = resolve(repoRoot, root);
  if (!existsSync(absoluteRoot)) {
    err("ownership", `소유권 검사 루트 없음: ${root}`);
    continue;
  }
  if (!validateExistingPath(root, "ownership", "directory")) continue;
  for (const file of walkMarkdown(absoluteRoot)) {
    const pathValue = relative(repoRoot, file).split(sep).join("/");
    if (registryPaths.has(pathValue)) continue;
    if (archiveRoots.some((archiveRoot) => isUnderRoot(pathValue, archiveRoot))) continue;
    const collections = collectionRoots.filter((collectionRoot) => isUnderRoot(pathValue, collectionRoot));
    if (collections.length === 0) err("ownership", `소유권 Registry/collection 미등록 문서: ${pathValue}`);
    else if (collections.length > 1) {
      err("ownership", `여러 문서 collection에 중복 포함: ${pathValue} (${collections.join(", ")})`);
    }
  }
}
for (const root of cfg.archivePolicy?.roots ?? []) {
  const absoluteRoot = resolve(repoRoot, root);
  if (!existsSync(absoluteRoot)) {
    err("archive", `archive 루트 없음: ${root}`);
    continue;
  }
  for (const file of walkMarkdown(absoluteRoot)) {
    if (!readText(file).includes(cfg.archivePolicy.requiredMarker)) {
      err("archive", `${relative(repoRoot, file)}: 비정본 marker 없음`);
    }
  }
}

// 6. Relative Markdown link integrity.
const ignorePrefixes = cfg.markdownLinkIgnorePrefixes ?? [];
const linkRegex = /(?<!\!)\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
for (const target of cfg.markdownLinkCheckTargets) {
  const absolute = resolve(repoRoot, target);
  if (!existsSync(absolute)) continue;
  if (!validateExistingPath(target, "md-link", "file")) continue;
  const fileDir = dirname(absolute);
  let inFence = false;
  readLines(absolute).forEach((line, index) => {
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; return; }
    if (inFence) return;
    const scrubbed = line.replace(/`[^`]*`/g, "");
    linkRegex.lastIndex = 0;
    let match;
    while ((match = linkRegex.exec(scrubbed)) !== null) {
      const raw = match[1];
      if (ignorePrefixes.some((prefix) => raw.startsWith(prefix))) continue;
      const pathPart = raw.split("#")[0];
      if (!pathPart) continue;
      const destination = resolve(fileDir, pathPart);
      if (!existsSync(destination)) err("md-link", `${target}:${index + 1} → ${raw} (대상 없음)`);
      else {
        const destinationRel = relative(repoRoot, destination);
        if (destinationRel === ".." || destinationRel.startsWith(`..${sep}`)) {
          err("md-link", `${target}:${index + 1} → ${raw} (저장소 밖 대상)`);
        } else {
          validateExistingPath(destinationRel.split(sep).join("/"), "md-link");
          if (pathPart.endsWith("/") && !statSync(destination).isDirectory()) {
            err("md-link", `${target}:${index + 1} → ${raw} (디렉터리 아님)`);
          }
        }
      }
    }
  });
}

// 7. PROJECTS registry and pointers.
const projectsConfig = cfg.projectsTable;
const projectFile = resolve(repoRoot, projectsConfig.file);
const pointerSentinels = cfg.allowedStatusPointerSentinels ?? [];
const pointerRules = cfg.statusPointerRules ?? {};

function validatePointer(project, pointer, lineNumber) {
  const where = `${projectsConfig.file}:${lineNumber} (${project})`;
  if (pointerSentinels.includes(pointer)) return;
  if (/^https?:\/\//.test(pointer)) {
    try { new URL(pointer); warn("status-pointer", `${where}: URL 포인터 비권장 (network 미검사)`); }
    catch { err("status-pointer", `${where}: 잘못된 URL: ${pointer}`); }
    return;
  }
  const relativeRules = pointerRules.repoRelative ?? {};
  const problems = [];
  if (!pointer) problems.push("빈 포인터");
  if (relativeRules.denyLeadingSlash && pointer.startsWith("/")) problems.push("leading slash 금지");
  if (relativeRules.denyBackslash && pointer.includes("\\")) problems.push("backslash 금지");
  if (relativeRules.denyDotDot && pointer.split("/").includes("..")) problems.push(".. 금지");
  const suffix = relativeRules.mustEndWith ?? "STATUS.md";
  if (!pointer.endsWith(suffix)) problems.push(`${suffix}로 끝나야 함`);
  if (problems.length) err("status-pointer", `${where}: ${problems.join(", ")} (값: ${pointer})`);
}

if (!existsSync(projectFile)) {
  err("projects-table", `${projectsConfig.file} 없음`);
} else {
  const lines = readLines(projectFile);
  const requiredColumns = projectsConfig.requiredColumns ?? [];
  const candidates = [];
  for (let index = 0; index < lines.length; index++) {
    if (!lines[index].trim().startsWith("|")) continue;
    const cells = splitRow(lines[index]);
    if (requiredColumns.every((column) => cells.includes(column))) candidates.push({ index, cells });
  }
  if (candidates.length !== 1) {
    err("projects-table", `등록부 표 헤더는 정확히 1개여야 함 (${candidates.length})`);
  } else {
    const { index: headerIndex, cells: header } = candidates[0];
    const projectIndex = header.indexOf("프로젝트");
    const statusIndex = header.indexOf("상태");
    const branchIndex = header.indexOf("기본 브랜치");
    const originIndex = header.indexOf("원격(origin)");
    const pointerIndex = header.indexOf(projectsConfig.statusPointerColumn);
    const projects = new Set();
    const origins = new Set();
    for (let index = headerIndex + 1; index < lines.length; index++) {
      if (!lines[index].trim().startsWith("|")) break;
      const cells = splitRow(lines[index]);
      if (isSeparator(cells)) continue;
      if (cells.length !== header.length) {
        err("projects-table", `${projectsConfig.file}:${index + 1} 셀 수 불일치`);
        continue;
      }
      const project = cells[projectIndex];
      const status = cells[statusIndex];
      const branch = cells[branchIndex];
      const origin = cells[originIndex];
      const pointer = cells[pointerIndex];
      if (projects.has(project)) err("projects-table", `프로젝트 중복: ${project}`);
      projects.add(project);
      if (origin !== "(없음)") {
        if (origins.has(origin)) err("projects-table", `원격 중복: ${origin}`);
        origins.add(origin);
      }
      if (/active/i.test(status) && (pointer === "(미작성)" || origin === "(없음)" || !branch)) {
        err("projects-table", `${project}: active 프로젝트는 원격·브랜치·STATUS 포인터 필수`);
      }
      validatePointer(project, pointer, index + 1);
    }
  }
}

// 8. Auto-docs capability, approvals, generators and markers.
function parseApprovals(absolute, tableConfig) {
  const rows = [];
  let header = null;
  let headerCount = 0;
  const lines = readLines(absolute);
  const registryHeadings = lines
    .map((line, index) => ({ line: line.trim(), index }))
    .filter((entry) => entry.line === "## Registry");
  if (registryHeadings.length !== 1) {
    err("auto-docs", `승인 문서의 ## Registry는 정확히 1개여야 함 (${registryHeadings.length})`);
    return rows;
  }
  const start = registryHeadings[0].index + 1;
  const nextH2 = lines.findIndex((line, index) => index >= start && /^##\s+/.test(line));
  const section = lines.slice(start, nextH2 === -1 ? lines.length : nextH2);
  for (const line of section) {
    if (!line.trim().startsWith("|")) {
      if (header) break;
      continue;
    }
    const cells = splitRow(line);
    if (isSeparator(cells)) continue;
    if (!header) {
      if (JSON.stringify(cells) !== JSON.stringify(tableConfig.requiredColumns)) {
        err("auto-docs", "승인 Registry 헤더는 requiredColumns와 순서까지 정확히 일치해야 함");
        return rows;
      }
      header = cells;
      headerCount++;
      continue;
    }
    if (header && cells.length === header.length) {
      rows.push(Object.fromEntries(header.map((column, index) => [column, cells[index]])));
    }
  }
  if (headerCount !== 1) err("auto-docs", `승인 Registry 헤더는 정확히 1개여야 함 (${headerCount})`);
  return rows;
}

function normalizeTriggerList(value) {
  const values = Array.isArray(value) ? value : String(value ?? "").split(";");
  return values.map((item) => item.trim()).filter(Boolean).sort();
}

function checkMarkers(target, ids) {
  const absolute = resolve(repoRoot, target);
  const closed = new Set();
  if (!existsSync(absolute)) {
    err("auto-marker", `대상 문서 없음: ${target}`);
    return closed;
  }
  if (!validateExistingPath(target, "auto-marker", "file")) return closed;
  const markerRegex = /<!--\s*AUTO-DOCS:(START|END):([A-Za-z0-9_-]+)\s*-->/g;
  const stack = [];
  let inFence = false;
  readLines(absolute).forEach((line, index) => {
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; return; }
    if (inFence) return;
    markerRegex.lastIndex = 0;
    let match;
    while ((match = markerRegex.exec(line.replace(/`[^`]*`/g, ""))) !== null) {
      const [, kind, id] = match;
      if (kind === "START") {
        if (stack.length) err("auto-marker", `${target}:${index + 1} 중첩 START:${id}`);
        if (closed.has(id) || stack.includes(id)) err("auto-marker", `${target}:${index + 1} 중복 ${id}`);
        if (!ids.has(id)) err("auto-marker", `${target}:${index + 1} 미정의 ${id}`);
        stack.push(id);
      } else if (!stack.length) {
        err("auto-marker", `${target}:${index + 1} 짝 없는 END:${id}`);
      } else {
        const opened = stack.pop();
        if (opened !== id) err("auto-marker", `${target}:${index + 1} END:${id} / START:${opened} 불일치`);
        else closed.add(id);
      }
    }
  });
  if (stack.length) err("auto-marker", `${target}: 닫히지 않은 마커 ${stack.join(", ")}`);
  return closed;
}

const autoConfigPath = resolve(repoRoot, cfg.autoDocs.configFile);
const approvalsPath = resolve(repoRoot, cfg.autoDocs.approvalsFile);
if (existsSync(autoConfigPath) && existsSync(approvalsPath)) {
  let autoConfig;
  try { autoConfig = JSON.parse(readText(autoConfigPath)); }
  catch (error) { err("auto-docs", `${cfg.autoDocs.configFile} 파싱 실패: ${error.message}`); }
  if (autoConfig) {
    if (autoConfig.schemaVersion !== 2) err("auto-docs", "auto-docs schemaVersion은 2여야 함");
    if (!Array.isArray(autoConfig.blocks)) err("auto-docs", "blocks 배열 없음");
    const blocks = autoConfig.blocks ?? [];
    const blockIds = blocks.map((block) => block.block_id);
    for (const duplicate of duplicates(blockIds)) err("auto-docs", `block_id 중복: ${duplicate}`);
    for (const block of blocks) {
      if (!isSafeRelativePath(block.document)) {
        err("auto-docs", `${block.block_id}: 안전하지 않은 document 경로 (${block.document ?? "none"})`);
      }
      if (/STATUS\.md$/i.test(block.document) && block.mode === "append") {
        err("auto-docs", `${block.block_id}: STATUS append는 승인 상태와 무관하게 금지`);
      }
    }

    const rows = parseApprovals(approvalsPath, cfg.autoDocs.approvalsTable);
    const approvalIds = rows.map((row) => row.approval_id);
    const approvalBlockIds = rows.map((row) => row.block_id);
    for (const duplicate of duplicates(approvalIds)) err("auto-docs", `approval_id 중복: ${duplicate}`);
    for (const duplicate of duplicates(approvalBlockIds)) err("auto-docs", `승인 block_id 중복: ${duplicate}`);
    const validStatuses = new Set(["proposed", "active", "revoked", "superseded"]);
    const activeRequiredFields = [
      "approval_id",
      "approved_by",
      "approved_at",
      "last_changed_at",
      "last_changed_by",
      "repository",
      "document",
      "block_id",
      "mode",
      "allowed_triggers",
      "required_checks"
    ];
    for (const row of rows) {
      if (!validStatuses.has(row.status)) err("auto-docs", `${row.block_id}: 잘못된 status ${row.status}`);
      if (row.status !== "active") continue;
      for (const field of activeRequiredFields) {
        if (!String(row[field] ?? "").trim()) err("auto-docs", `${row.block_id}: active 승인 필수 셀 비어 있음 (${field})`);
      }
      for (const field of ["approved_at", "last_changed_at"]) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(String(row[field] ?? ""))) {
          err("auto-docs", `${row.block_id}: ${field}는 YYYY-MM-DD여야 함`);
        }
      }
      const checks = new Set(normalizeTriggerList(row.required_checks));
      for (const check of ["docs-guard", "marker-integrity"]) {
        if (!checks.has(check)) err("auto-docs", `${row.block_id}: required_checks에 ${check} 필요`);
      }
    }

    const approvalsByBlock = new Map(rows.map((row) => [row.block_id, row]));
    const blocksById = new Map(blocks.map((block) => [block.block_id, block]));
    const implementedGenerators = new Set();
    const autoScript = readText(resolve(repoRoot, "scripts/auto-docs.mjs"));
    const generatorRegex = /^\s*"([^"]+)":\s*\(\)\s*=>/gm;
    let generatorMatch;
    while ((generatorMatch = generatorRegex.exec(autoScript)) !== null) implementedGenerators.add(generatorMatch[1]);

    for (const block of blocks) {
      const approval = approvalsByBlock.get(block.block_id);
      if (!approval) { err("auto-docs", `${block.block_id}: 승인장부 행 없음`); continue; }
      if (approval.status !== "active") warn("auto-docs", `${block.block_id}: status=${approval.status}, 실행 불가`);
      if (approval.status === "active") {
        for (const field of ["repository", "document", "mode"]) {
          if (String(block[field]) !== String(approval[field])) {
            err("auto-docs", `${block.block_id}: ${field} capability/approval 불일치`);
          }
        }
        const configTriggers = normalizeTriggerList(block.triggers);
        const approvedTriggers = normalizeTriggerList(approval.allowed_triggers);
        if (JSON.stringify(configTriggers) !== JSON.stringify(approvedTriggers)) {
          err("auto-docs", `${block.block_id}: triggers capability/approval 불일치`);
        }
        if (!block.generator || !implementedGenerators.has(block.generator)) {
          err("auto-docs", `${block.block_id}: 구현 generator 없음 (${block.generator ?? "none"})`);
        }
      }
    }
    for (const row of rows) {
      if (row.status === "active" && !blocksById.has(row.block_id)) {
        err("auto-docs", `${row.block_id}: active 승인에 capability 없음`);
      }
    }

    const localActiveDocs = new Set(
      blocks
        .filter((block) => approvalsByBlock.get(block.block_id)?.status === "active")
        .filter((block) => block.repository === cfg.selfProjectName)
        .map((block) => block.document)
    );
    const configuredTargets = new Set(cfg.autoDocs.markerScanTargets);
    for (const target of localActiveDocs) {
      if (!configuredTargets.has(target)) err("auto-docs", `active 대상이 markerScanTargets에 없음: ${target}`);
    }
    for (const target of configuredTargets) {
      if (!localActiveDocs.has(target)) err("auto-docs", `markerScanTargets에 비활성 대상: ${target}`);
    }
    const idSet = new Set(blockIds);
    const foundMarkers = new Map();
    for (const target of configuredTargets) {
      for (const id of checkMarkers(target, idSet)) {
        if (foundMarkers.has(id)) {
          err("auto-marker", `${id}: 여러 문서에 마커 존재 (${foundMarkers.get(id)} / ${target})`);
        } else {
          foundMarkers.set(id, target);
        }
      }
    }
    for (const block of blocks) {
      if (approvalsByBlock.get(block.block_id)?.status !== "active") continue;
      if (block.repository !== cfg.selfProjectName) continue;
      const markerTarget = foundMarkers.get(block.block_id);
      if (!markerTarget) {
        err("auto-marker", `${block.block_id}: active 블록 마커 없음 (${block.document})`);
      } else if (markerTarget !== block.document) {
        err("auto-marker", `${block.block_id}: 마커 문서 불일치 (${markerTarget} / ${block.document})`);
      }
    }
  }
}

if (errors.length) {
  console.log("── ERRORS ──");
  errors.forEach((message) => console.log(message));
}
if (warnings.length) {
  console.log("── WARNINGS ──");
  warnings.forEach((message) => console.log(message));
}
console.log(`docs-guard: ${errors.length} errors, ${warnings.length} warnings — ${errors.length ? "FAIL" : "PASS"}`);
process.exit(errors.length ? 1 : 0);
