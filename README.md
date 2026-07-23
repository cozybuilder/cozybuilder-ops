# cozybuilder-ops — Common Brain

CozyBuilder 전체 프로젝트의 운영 원칙·절차·프로젝트 포인터를 관리하는 GitHub SSOT다.

## 기본 진입

프로젝트 작업 전 다음 세 문서만 항상 읽는다.

1. [GLOBAL.md](GLOBAL.md) — 불변 원칙과 최상위 권한
2. [PLAYBOOK.md](PLAYBOOK.md) — 공통 흐름과 조건별 상세 절차 라우터
3. [PROJECTS.md](PROJECTS.md) — 대상 저장소와 STATUS 포인터

그다음 `PLAYBOOK.md`가 지정한 조건부 문서와 대상 프로젝트의 STATUS를 읽는다.
`AI_CONTEXT.md`가 있으면 함께 읽고, 없으면 README와 STATUS를 진입 정본으로 사용한다.

## 문서 지도

| 영역 | 진입점 | 읽는 시점 |
|---|---|---|
| 문서 분류·소유·경량화 | [DOCUMENTATION_POLICY.md](docs/governance/DOCUMENTATION_POLICY.md) | 문서 변경 전 |
| 프로젝트 등록·STATUS | [PROJECT_LIFECYCLE.md](docs/playbooks/PROJECT_LIFECYCLE.md) | 신규 프로젝트·상태 갱신 |
| AI 지시·보고·검수 | [AI_COLLABORATION.md](docs/playbooks/AI_COLLABORATION.md) | AI 협업 |
| 문서 가드·자동화 | [DOCUMENTATION_MAINTENANCE.md](docs/playbooks/DOCUMENTATION_MAINTENANCE.md) | 구조·자동수정 |
| 역할 | [ROLES.md](docs/organization/ROLES.md) | 책임·승인 확인 |
| 사업 방향·경제성 | [BUSINESS_DIRECTION.md](docs/strategy/BUSINESS_DIRECTION.md) | 우선순위·비용 판단 |
| 개발환경 | [DEVELOPMENT_ENVIRONMENT.md](docs/operations/DEVELOPMENT_ENVIRONMENT.md) | 장비·계정·빌드 |
| 미해결 기준 충돌 | [KNOWN_CONFLICTS.md](docs/governance/KNOWN_CONFLICTS.md) | 충돌 주제 작업 전 |
| 프로그램 운영 모델 | [PROGRAM_INTEGRATION.md](docs/architecture/PROGRAM_INTEGRATION.md) · [HOMEPAGE 모델](docs/architecture/HOMEPAGE_PROGRAM_OPERATING_MODEL.md) | 충돌 결정 후 |
| 신규 프로젝트 골격 | [templates/project-template/](templates/project-template/) | 프로젝트 생성 |
| 제품 기획 템플릿 | [PLAN.md](templates/product-plan/PLAN.md) | 제품 기획 |
| 과거 기록 | [docs/history/](docs/history/) | 과거 조사만 |

## 루트 필수 파일

> 아래 블록은 `auto-docs`가 생성한다. 수동 편집하지 않는다.

<!-- AUTO-DOCS:START:ops-doc-map -->
- [README.md](README.md)
- [GLOBAL.md](GLOBAL.md)
- [PLAYBOOK.md](PLAYBOOK.md)
- [PROJECTS.md](PROJECTS.md)
- [DOC_APPROVALS.md](DOC_APPROVALS.md)
- [auto-docs.config.json](auto-docs.config.json)
<!-- AUTO-DOCS:END:ops-doc-map -->

## 검증

```bash
node scripts/verify-docs-guard.mjs
node scripts/auto-docs.mjs --dry-run
```

문서 변경은 [DOCUMENTATION_POLICY.md](docs/governance/DOCUMENTATION_POLICY.md)에 따라 단독 소유
위치와 이력 분리를 먼저 확인한다.
