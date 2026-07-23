# DOC_APPROVALS — 자동 문서수정 승인 이력

> **Common Brain OS v2.0**
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
- `active`는 승인만 뜻하지 않는다. capability·generator·마커·필수 검사가 모두 일치해야 실행된다.
- 런타임은 사람이 명령으로 실행하는 `manual-local-v1`이며 bot commit/push는 허용하지 않는다.

## Registry

| approval_id | status | approved_by | approved_at | last_changed_at | last_changed_by | repository | document | block_id | mode | allowed_triggers | allowed_updates | forbidden_updates | required_checks | linked_config | linked_commit_or_pr | notes |
|-------------|--------|-------------|-------------|-----------------|-----------------|------------|----------|----------|------|------------------|-----------------|-------------------|-----------------|---------------|---------------------|-------|
| apr-status-recent | revoked | cozy | 2026-07-03 | 2026-07-23 | cozy | * | docs/STATUS.md | status-recent-changes | append | program-repo PR source change | changed-date;changed-file-scope;category-guess | stage-decision;prose-summary | docs-guard;marker-integrity | auto-docs.config.json#status-recent-changes | docs-reorg-20260723 | 재발방지 요청에 따라 STATUS 이력 누적 capability 철회 |
| apr-status-verify | revoked | cozy | 2026-07-03 | 2026-07-23 | cozy | * | docs/STATUS.md | status-verification | regenerate | build/test result change | latest-selftest;build-result | stage-decision;prose | docs-guard;marker-integrity | auto-docs.config.json#status-verification | docs-reorg-20260723 | STATUS는 수동 현재 스냅샷으로 유지 |
| apr-readme-links | revoked | cozy | 2026-07-03 | 2026-07-23 | cozy | * | README.md | readme-doc-links | regenerate | docs file add or remove | doc-link-list | product-desc;prose | docs-guard;marker-integrity | auto-docs.config.json#readme-doc-links | docs-reorg-20260723 | 구현되지 않은 capability를 active로 두지 않음 |
| apr-readme-cmds | revoked | cozy | 2026-07-03 | 2026-07-23 | cozy | * | README.md | readme-commands | regenerate | package.json scripts change | command-list | prose | docs-guard;marker-integrity | auto-docs.config.json#readme-commands | docs-reorg-20260723 | 구현되지 않은 capability를 active로 두지 않음 |
| apr-ops-doc-map | active | cozy | 2026-07-03 | 2026-07-03 | cozy | cozybuilder-ops | README.md | ops-doc-map | regenerate | rootRequiredDocs change;root doc add or remove | doc-map-list | role-desc;prose | docs-guard;marker-integrity | auto-docs.config.json#ops-doc-map | batch-1 | 역할설명은 GLOBAL 소유 |
| apr-projects-meta | revoked | cozy | 2026-07-03 | 2026-07-23 | cozy | cozybuilder-ops | PROJECTS.md | projects-meta | regenerate | registry meta change | branch;origin;pointer-normalize | status-decision;add-remove;detail-copy | docs-guard;marker-integrity | auto-docs.config.json#projects-meta | docs-reorg-20260723 | 구현되지 않은 capability를 active로 두지 않음 |
| apr-prog-list | revoked | cozy | 2026-07-03 | 2026-07-23 | cozy | cozybuilder-ops | PROGRAM_INTEGRATION.md | prog-list | regenerate | PROJECTS official-list change | program-list | policy-body | docs-guard;marker-integrity | auto-docs.config.json#prog-list | docs-reorg-20260723 | 아키텍처 문서에 프로젝트 목록을 복제하지 않음 |
| apr-playbook-index | active | cozy | 2026-07-03 | 2026-07-23 | cozy | cozybuilder-ops | docs/playbooks/DOCUMENTATION_MAINTENANCE.md | playbook-automation-index | regenerate | script or workflow add | automation-command-index | procedure-body | docs-guard;marker-integrity | auto-docs.config.json#playbook-automation-index | docs-reorg-20260723 | 조건부 절차 문서로 대상 이동 |

## 철회 / 대체 이력

- STATUS append·검증 자동화, 미구현 공용 README 자동화, PROJECTS/프로그램 목록 자동화는
  문서 책임 분리와 fail-closed 원칙에 따라 철회했다.

---

_Common Brain OS v2.0 · cozybuilder-ops_
