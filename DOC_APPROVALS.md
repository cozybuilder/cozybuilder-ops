# DOC_APPROVALS — 자동 문서수정 승인 이력

> **Common Brain OS v1.0**
> 자동 문서수정(Auto Documentation Sync)의 **승인 범위 · 승인/철회 이력**의 단일 소유 문서(SSOT).
> 능력(무엇을/어떻게)은 [auto-docs.config.json](auto-docs.config.json), 권한(누가/언제 승인)은 이 문서가 소유한다.

## 원칙 (fail-closed)

- 자동수정은 **아래 Registry 표에서 `status=active` 인 블록**에서만 허용된다.
- `proposed / revoked / superseded` 는 실행 게이트가 아니다. active 가 없으면 자동수정하지 않고 proposal-only 로 둔다.
- 이 문서 자체와 [GLOBAL.md](GLOBAL.md) 본문은 **자동수정 금지**(사람만 수정).
- 승인 범위 밖 변경은 다시 코지 승인을 받는다.
- 상태 수명주기: `proposed → active → revoked | superseded`.

## 파싱 정본

- 자동화 게이트는 **아래 `## Registry` 표만** 읽는다. 표 밖 설명은 참고용이며 게이트 판단에 쓰지 않는다.
- 표 컬럼 순서는 고정한다. 셀 안에서 목록은 `;` 로 구분하고 `|` 를 쓰지 않는다.
- (참고) `required_checks` 의 marker-integrity / approval-linkage 실제 강제는 2배치에서 구현된다.
  1배치에는 실행 런타임이 없으므로 active 항목도 실제 자동수정을 일으키지 않는다(범위 기록 목적).

## Registry

| approval_id | status | approved_by | approved_at | repository | document | block_id | mode | allowed_triggers | allowed_updates | forbidden_updates | required_checks | linked_config | linked_commit_or_pr | notes |
|-------------|--------|-------------|-------------|------------|----------|----------|------|------------------|-----------------|-------------------|-----------------|---------------|---------------------|-------|
| apr-status-recent | active | cozy | 2026-07-03 | * | docs/STATUS.md | status-recent-changes | append | program-repo PR source change | changed-date;changed-file-scope;category-guess | stage-decision;prose-summary | docs-guard;marker-integrity | auto-docs.config.json#status-recent-changes | batch-1 | 프로그램 레포에서 실행 |
| apr-status-verify | active | cozy | 2026-07-03 | * | docs/STATUS.md | status-verification | regenerate | build/test result change | latest-selftest;build-result | stage-decision;prose | docs-guard;marker-integrity | auto-docs.config.json#status-verification | batch-1 | - |
| apr-readme-links | active | cozy | 2026-07-03 | * | README.md | readme-doc-links | regenerate | docs file add or remove | doc-link-list | product-desc;prose | docs-guard;marker-integrity | auto-docs.config.json#readme-doc-links | batch-1 | 프로그램 레포 README |
| apr-readme-cmds | active | cozy | 2026-07-03 | * | README.md | readme-commands | regenerate | package.json scripts change | command-list | prose | docs-guard;marker-integrity | auto-docs.config.json#readme-commands | batch-1 | scripts 파생 |
| apr-ops-doc-map | active | cozy | 2026-07-03 | cozybuilder-ops | README.md | ops-doc-map | regenerate | rootRequiredDocs change;root doc add or remove | doc-map-list | role-desc;prose | docs-guard;marker-integrity | auto-docs.config.json#ops-doc-map | batch-1 | 역할설명은 GLOBAL 소유 |
| apr-projects-meta | active | cozy | 2026-07-03 | cozybuilder-ops | PROJECTS.md | projects-meta | regenerate | registry meta change | branch;origin;pointer-normalize | status-decision;add-remove;detail-copy | docs-guard;marker-integrity | auto-docs.config.json#projects-meta | batch-1 | 상태판정 제외 |
| apr-prog-list | active | cozy | 2026-07-03 | cozybuilder-ops | PROGRAM_INTEGRATION.md | prog-list | regenerate | PROJECTS official-list change | program-list | policy-body | docs-guard;marker-integrity | auto-docs.config.json#prog-list | batch-1 | SSOT=PROJECTS |
| apr-playbook-index | active | cozy | 2026-07-03 | cozybuilder-ops | PLAYBOOK.md | playbook-automation-index | regenerate | script or workflow add | automation-command-index | procedure-body | docs-guard;marker-integrity | auto-docs.config.json#playbook-automation-index | batch-1 | - |

## 철회 / 대체 이력

- (없음) — 철회 시 해당 행 status 를 `revoked` 로, 대체 시 `superseded` 로 바꾸고 사유·일자를 notes 에 남긴다.

---

_Common Brain OS v1.0 · cozybuilder-ops_
