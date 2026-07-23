# Common Brain 문서 구조 개편 기록

> **ARCHIVE — 현재 SSOT 아님**
> 현재 문서 정책은 [DOCUMENTATION_POLICY.md](../governance/DOCUMENTATION_POLICY.md)를 확인한다.

## 기준

- 저장소: `cozybuilder/cozybuilder-ops`
- 이전 기준 commit: `1752b5144ce707be1ddff8391a781155b0211fc7`
- 이전 tree: `e1ba4fdfe7c1f0dc34a7836743cf5eeb1e923971`
- 이전 필독 문서:
  - `GLOBAL.md` 14,411B
  - `PLAYBOOK.md` 22,719B
  - `PROJECTS.md` 6,669B
  - 합계 43,799B

이전 원문은 위 commit에서 byte 단위로 복구할 수 있다.

## 재편 결과

- `GLOBAL.md`: 5,409B
- `PLAYBOOK.md`: 5,275B
- `PROJECTS.md`: 2,371B
- 기본 필독 합계: 13,055B
- 이전 43,799B 대비 30,744B 감소(약 70.2%)

현재 문서에는 원칙·라우팅·등록 정보만 남기고, 상세 절차·전략·역할·변동값·과거 기록은
조건부 문서 또는 archive로 분리했다.

## 원인

- 헌법 입장 기준과 조건부 문서 라우터가 없었다.
- `STATUS` 템플릿·PLAYBOOK·auto-docs가 변경 이력 누적을 동시에 요구했다.
- `PROJECTS`가 등록부와 프로젝트 상세를 함께 소유했다.
- 자동 가드는 존재·링크만 검사하고 문서 목적·크기·이중 소유를 검사하지 않았다.
- 아키텍처 문서 두 개가 서로 다른 정책을 동시에 SSOT라고 선언했다.

## 이전 매핑

| 이전 위치 | 새 소유 위치 | 처리 |
|---|---|---|
| `GLOBAL §1.4` 비용 상세 | `docs/strategy/BUSINESS_DIRECTION.md` | 원칙 한 줄만 헌법 유지 |
| `GLOBAL §7.2~7.4` 응답·조사·모델 절차 | `docs/playbooks/AI_COLLABORATION.md` | 조건부 절차로 이동 |
| `GLOBAL §8.2~8.3` 역할·성장 목표 | `docs/organization/ROLES.md`, `docs/strategy/BUSINESS_DIRECTION.md` | 역할/전략 분리 |
| `GLOBAL §8.4`, `PLAYBOOK P11` | `docs/playbooks/AGENT_OPERATIONS.md` | 권한·승인 절차 분리 |
| `PLAYBOOK P1·P2·P4·P5` | `docs/playbooks/PROJECT_LIFECYCLE.md` | 프로젝트 조건부 절차 |
| `PLAYBOOK P3·P8·P9` | `docs/playbooks/AI_COLLABORATION.md` | 지시·보고·검수 단일 소유 |
| `PLAYBOOK P6·P7` | `docs/playbooks/DOCUMENTATION_MAINTENANCE.md` | 가드·자동화 분리 |
| `PLAYBOOK P10` | `docs/playbooks/AI_VIDEO_PRODUCTION.md` | 진입 포인터만 유지 |
| `PLAYBOOK P12` | `docs/playbooks/ENVIRONMENT_VERIFICATION.md` | 환경 작업 조건부 절차 |
| `PLAYBOOK P13` | `docs/playbooks/EXTERNAL_INTEGRATION_DIAGNOSTICS.md` | 사고 기록과 절차 분리 |
| `PROJECTS §운영 메모` | 이전 commit + 이 archive 기록 | 등록부에서 제거, 프로젝트 SSOT로 확인 |
| 루트 `PROGRAM_INTEGRATION` | `docs/architecture/PROGRAM_INTEGRATION.md` | 정책을 새로 선택하지 않고 조건부 경로로 이동 |
| 상충하는 프로그램 통합 문서 2개 | `docs/governance/KNOWN_CONFLICTS.md` | 최신 날짜로 임의 선택하지 않고 BLOCKED 등록 |
| 루트 `GEMINI_USAGE_GUIDE` | `docs/operations/` + 계정 snapshot `docs/history/` | 변동값 분리 |
| 루트 제품기획 템플릿 | `templates/product-plan/PLAN.md` | 조건부 템플릿화 |
| 프로젝트 템플릿 `STATUS 변경 이력` | 제거 | 현재 스냅샷 계약으로 교체 |
| STATUS append 자동화 | 승인 철회·capability 제거 | 재누적 차단 |

## 아키텍처 충돌 처리

- 구 `PROGRAM_INTEGRATION.md` 최초 기준: 2026-06-26
- `HOMEPAGE_PROGRAM_OPERATING_MODEL.md` 추가: 2026-07-16
- 후자는 무료·소형 A형과 유료·독립 B형을 구분하고 자신을 공통 운영 기준 SSOT로 명시했다.

작성일이 더 늦다는 사실만으로 기존 정책을 대체할 승인 근거는 확인되지 않았다. 따라서 이번
재배치에서는 어느 쪽도 현행 최종 정책으로 선택하지 않았다. 충돌과 필요한 결정은
`KNOWN_CONFLICTS.md`에 등록했고, 코지 결정과 ADR 전까지 관련 구현·이전을 중단한다.

## 재발 방지

- 기본 필독 합계 24 KiB 상한
- 헌법·라우터·등록부의 허용 H2 고정
- 문서 소유 key 중복 실패
- archive 비정본 marker 필수
- 신규 `AI_CONTEXT·STATUS` 유형·크기 계약
- STATUS append capability 절대 금지
- active 승인·capability·trigger·generator·marker 완전 일치
- 승인 파서는 유일한 `## Registry`와 고정 컬럼 순서만 인정
- dot segment·저장소 밖 경로·파일/상위경로 symbolic link 차단
- `docs/·templates/`의 모든 Markdown은 개별 Registry·명시적 collection·archive 중 하나에 포함
- Node 내장 테스트로 실패 사례 고정

## 별도 후속 범위

- 기존 각 프로젝트의 대형 STATUS·DECISIONS·CHANGELOG 무손실 이전
- 변동성이 큰 개발환경·비즈니스 리서치의 세부 분류
- 저장소별 docs-guard 배포와 branch required check 설정
- 외부 AI용 `completion-report` 어댑터는 수정하지 않고 PLAYBOOK에 기존 P3.3/P3.4/P3.4.6
  호환 포인터를 유지
