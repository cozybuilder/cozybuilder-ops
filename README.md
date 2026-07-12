# cozybuilder-ops — Common Brain

> **Common Brain OS v1.0**
> Cozybuilder 전체 프로젝트를 관장하는 공통 운영 저장소(Single Source of Truth).

이 저장소는 코드가 아니라 **결정과 규칙**을 담는다.
모든 운영 결정은 GitHub에 코드를 올리기 **전에** 이곳 문서에 먼저 기록한다.

---

## 핵심 원칙 (요약)

전체 정의는 [GLOBAL.md](GLOBAL.md)에 있다. 여기서는 한 줄 요약만 둔다.

1. **Document First, GitHub Second** — 결정은 먼저 문서에 적고, GitHub 작업은 그 문서를 반영할 뿐이다.
2. **Single Source of Truth (SSOT)** — 모든 사실은 정확히 한 곳에만 존재한다. 다른 곳에서는 **복제하지 않고 링크**한다.

---

## 문서 지도 (Document Map)

| 문서 | 역할 | 단독 소유 정보 (SSOT) |
|------|------|----------------------|
| [README.md](README.md) | 진입점 · 길찾기 | (소유 없음 — 안내만) |
| [GLOBAL.md](GLOBAL.md) | 헌법 · 전 조직 표준/규칙 | 원칙, 명명/브랜치/커밋 규약, 문서 소유권 |
| [PLAYBOOK.md](PLAYBOOK.md) | 운영 절차 · 반복 워크플로 | "어떻게 하는가" 절차 |
| [PROJECTS.md](PROJECTS.md) | 프로젝트 등록부 | 프로젝트 목록·메타데이터·상태 포인터 |
| [PROGRAM_INTEGRATION.md](PROGRAM_INTEGRATION.md) | 프로그램 통합 아키텍처 | Homepage↔독립 프로그램 경계(정책) |
| [DOC_APPROVALS.md](DOC_APPROVALS.md) | 자동수정 승인 이력 | 자동 문서수정 승인 범위·승인/철회 이력 |
| [GEMINI_USAGE_GUIDE.md](GEMINI_USAGE_GUIDE.md) | Gemini 운영 참고 | CozyBuilder 내 Gemini 역할·검증 기준·현재 계정 기준 |
| [auto-docs.config.json](auto-docs.config.json) | 자동수정 설정 | 자동수정 블록·트리거 정의(capability) |
| [templates/project-template/](templates/project-template/) | 신규 프로젝트 골격 | 표준 스캐폴드 |

### 루트 문서 목록 (자동 생성)

> 아래 목록은 `auto-docs`(block: ops-doc-map)가 `docs-guard.config.json`에서 생성한다. 수동 편집 금지.

<!-- AUTO-DOCS:START:ops-doc-map -->
- [README.md](README.md)
- [GLOBAL.md](GLOBAL.md)
- [PLAYBOOK.md](PLAYBOOK.md)
- [PROJECTS.md](PROJECTS.md)
- [PROGRAM_INTEGRATION.md](PROGRAM_INTEGRATION.md)
- [DOC_APPROVALS.md](DOC_APPROVALS.md)
- [auto-docs.config.json](auto-docs.config.json)
<!-- AUTO-DOCS:END:ops-doc-map -->

---

## 읽는 순서

1. **README.md** (이 문서) — 전체 구조 파악
2. **GLOBAL.md** — 무엇이 규칙인지
3. **PLAYBOOK.md** — 어떻게 일하는지
4. **PROJECTS.md** — 무엇을 운영 중인지
5. (필요 시) **PROGRAM_INTEGRATION.md** — Homepage와 프로그램을 어떻게 연결하는지
6. (Gemini 사용 시) **GEMINI_USAGE_GUIDE.md** — 역할·검증·실전 테스트 기준

---

## 빠른 사용법

- 새 프로젝트 추가 → [PLAYBOOK.md](PLAYBOOK.md)의 "신규 프로젝트 등록" 절차를 따른다.
- 규칙을 바꾸고 싶다 → [GLOBAL.md](GLOBAL.md)를 수정하고 커밋한다. (Document First)
- 프로젝트 상태가 궁금하다 → [PROJECTS.md](PROJECTS.md)에서 해당 프로젝트의 STATUS 포인터를 따라간다.
- Gemini를 사용할 때 → [GEMINI_USAGE_GUIDE.md](GEMINI_USAGE_GUIDE.md)의 역할·검증 순서를 따른다.

---

_Common Brain OS v1.0 · cozybuilder-ops_