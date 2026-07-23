# PLAYBOOK — 공통 실행 라우터

> **Common Brain OS v2.0**
> 모든 작업의 공통 시작·종료 흐름과 조건별 상세 절차의 진입 경로를 소유한다.
> 상세 절차를 이 파일에 누적하지 않는다.

## P0. 필수 진입 순서

프로젝트 작업·검수·지시 전 다음 순서를 지킨다.

1. GitHub의 최신 [`GLOBAL.md`](GLOBAL.md)를 읽는다.
2. GitHub의 최신 `PLAYBOOK.md`를 읽는다.
3. GitHub의 최신 [`PROJECTS.md`](PROJECTS.md)를 읽는다.
4. `PROJECTS.md`에서 대상 저장소와 STATUS 포인터를 확인한다.
5. 지정된 STATUS를 읽고, `docs/AI_CONTEXT.md`가 있으면 함께 읽는다. 기존 프로젝트에
   `AI_CONTEXT.md`가 없으면 README와 STATUS를 진입 정본으로 사용하며 내용을 추측해 만들지 않는다.
6. 아래 라우터와 프로젝트 문서가 지정하는 관련 SSOT를 읽는다.

private 저장소는 인증된 GitHub 연결로 확인한다. 현재 GitHub 근거를 읽지 못하면
`GitHub를 확인하지 않았다. 확인 후 답변하겠다.`라고 알리고 프로젝트 판단을 멈춘다.

작업 시작 시 실제로 확인 가능한 모델명만 고지한다. 세부 라우팅·fallback을 알 수 없으면
`라우팅 상태 확인 불가`라고 명시한다.

## P1. 공통 실행 흐름

1. **현재 주제 확정** — 목적·범위·완료조건·금지선을 정한다.
2. **소유 문서 확인** — 기록할 정보의 유형과 단독 소유 위치를 정한다.
3. **실제 근거 조사** — 문서·코드·diff·콘솔·로그를 읽기 전용으로 먼저 확인한다.
4. **실행** — 승인 범위 안에서 구현·문서 반영을 수행한다.
5. **검증** — 필요한 테스트·빌드·링크·데이터·실기기 범위를 확인한다.
6. **마무리** — STATUS → commit → push 순서를 지킨다.
7. **보고** — STATUS·commit·push·검증 결과와 잔여 위험을 포함한다.
8. **정지** — 코지 승인 또는 명시적 권한 위임 없이 다음 주제를 열지 않는다.

## P2. 절차 라우터

| 작업 조건 | 추가로 읽을 문서 |
|---|---|
| 문서 생성·이동·요약·대규모 정리 | [DOCUMENTATION_POLICY.md](docs/governance/DOCUMENTATION_POLICY.md) → [DOCUMENTATION_MAINTENANCE.md](docs/playbooks/DOCUMENTATION_MAINTENANCE.md) |
| 신규 프로젝트·저장소·STATUS·기준 승격 | [PROJECT_LIFECYCLE.md](docs/playbooks/PROJECT_LIFECYCLE.md) |
| AI 지시·보고·검수·인수인계 | [AI_COLLABORATION.md](docs/playbooks/AI_COLLABORATION.md) |
| 개발환경·장비·경로·콘솔·빌드/서명 | [ENVIRONMENT_VERIFICATION.md](docs/playbooks/ENVIRONMENT_VERIFICATION.md) |
| 다중 장비 Git 전환 | [MULTI_DEVICE_GIT_SYNC.md](docs/operations/MULTI_DEVICE_GIT_SYNC.md) |
| OAuth·결제·스토어·DNS·외부 API 장애 | [EXTERNAL_INTEGRATION_DIAGNOSTICS.md](docs/playbooks/EXTERNAL_INTEGRATION_DIAGNOSTICS.md) |
| 에이전트 자동화·권한 위임 | [AGENT_OPERATIONS.md](docs/playbooks/AGENT_OPERATIONS.md) |
| AI 영상 제작 | [AI_VIDEO_PRODUCTION.md](docs/playbooks/AI_VIDEO_PRODUCTION.md) |
| 프로그램의 Homepage 귀속·독립 운영 판단 | [KNOWN_CONFLICTS.md](docs/governance/KNOWN_CONFLICTS.md) → 충돌한 두 아키텍처 문서 |
| Gemini 사용 | [GEMINI_USAGE_GUIDE.md](docs/operations/GEMINI_USAGE_GUIDE.md) |
| 제품 기획 | [PLAN.md](templates/product-plan/PLAN.md) |
| 사업 우선순위·비용·유료 도구 | [BUSINESS_DIRECTION.md](docs/strategy/BUSINESS_DIRECTION.md) |

라우터에 없는 새 반복 절차가 필요하면 `PLAYBOOK.md` 본문에 붙이지 않는다.
[DOCUMENTATION_POLICY.md](docs/governance/DOCUMENTATION_POLICY.md)에 따라 조건부 절차 파일과
라우터 행을 추가한다.

## P3. 완료 계약

완료 보고에는 다음을 빠짐없이 포함한다.

- STATUS 반영 여부 또는 불필요 사유
- commit
- push 성공 여부 또는 구체적 보류 사유
- 검증 명령·결과·범위
- 승인 범위·금지사항 준수
- OPEN / BLOCKED / 검증 한계

보고 문구가 아니라 실제 GitHub와 검증 근거를 비교해 완료를 판정한다.
세부 템플릿과 승인 루프는 [AI_COLLABORATION.md](docs/playbooks/AI_COLLABORATION.md)를 따른다.

### P3.3 표준 보고 형식 호환 포인터

기존 도구가 참조하는 `P3.3` 보고 템플릿은
[AI_COLLABORATION.md §2](docs/playbooks/AI_COLLABORATION.md)가 단독 소유한다.

### P3.4 Output Contract 호환 포인터

기존 도구가 참조하는 `P3.4` 출력 계약과 `P3.4.6` 자기 적용 규칙은
[AI_COLLABORATION.md §2~§5](docs/playbooks/AI_COLLABORATION.md)가 단독 소유한다.

#### P3.4.6 Self Validation

출력 규칙을 추가·수정한 작업의 보고 자체가 새 규칙을 만족해야 한다. 미충족이면 즉시 새
형식으로 다시 작성한다.

## P4. 문서 변경 최소 절차

문서를 바꾸기 전에 정보 유형과 단독 소유 문서를 정한다. 변경 후에는 다음을 실행한다.

```bash
node scripts/verify-docs-guard.mjs
node scripts/auto-docs.mjs --dry-run
```

기본 필독 문서의 크기 초과, 허용되지 않은 섹션, 이력 누적, archive 표식 누락,
자동수정 승인 불일치는 실패로 처리한다.
