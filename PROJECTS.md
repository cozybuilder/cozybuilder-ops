# PROJECTS — 프로젝트 등록부

> **Common Brain OS v2.0**
> 프로젝트 ID·등록 상태·기본 브랜치·원격 저장소·STATUS 포인터만 소유한다.
> 제품 설명·기술 구조·진행 내역·다음 작업은 각 프로젝트 문서가 소유한다.

## 등록 상태 범례

- 🟢 `active` — 운영 또는 개발 중
- 🟡 `paused` — 일시 중단
- 🔵 `candidate` — 존재하지만 정체·편입 미확정
- 📋 `planned` — 개발 전
- 📦 `archived` — 종료 또는 동결

## 등록부

| 프로젝트 | 상태 | 기본 브랜치 | 원격(origin) | STATUS 포인터 |
|---|---|---|---|---|
| cozybuilder-ops | 🟢 active | `main` | github.com/cozybuilder/cozybuilder-ops | (본 저장소 — 운영 허브) |
| mvp-idea | 🟢 active | `main` | github.com/cozybuilder/mvp-idea (PRIVATE) | docs/STATUS.md |
| homepage | 🟢 active | `main` | github.com/cozybuilder/cozybuilder-homepage | docs/STATUS.md |
| ebookPublishingSystem | 🟢 active | `main` | github.com/cozybuilder/ebookPublishingSystem | STATUS.md |
| gratitude-note | 🟢 active | `master` | github.com/cozybuilder/gratitude-note | docs/STATUS.md |
| ClipMiner | 🟢 active | `main` | github.com/cozybuilder/clipminer | docs/STATUS.md |
| movieminer | 🔵 candidate | `main` | (없음) | STATUS.md |
| house_rental | 📋 planned | (git 미초기화) | (없음) | (미작성) |
| ShortsFactory | 📋 planned | (코드/폴더 없음) | (없음) | (미작성) |
| cozyrent | 🟢 active | `main` | github.com/cozybuilder/cozyrent (PRIVATE) | docs/STATUS.md |
| fieldnote-ai | 🟢 active | `main` | github.com/cozybuilder/fieldnote-ai (PRIVATE) | docs/STATUS.md |
| lifetimestudio | 🟢 active | `main` | github.com/cozybuilder/lifetimestudio | docs/STATUS.md |
| ai-promotion | 🟢 active | `main` | github.com/cozybuilder/ai-promotion (PRIVATE) | docs/STATUS.md |

## 관리 규칙

- 한 프로젝트는 한 행만 가진다.
- 이 문서는 등록부 행의 값이 바뀔 때만 수정한다.
- 프로젝트 상세는 STATUS 포인터를 먼저 확인한다. `AI_CONTEXT.md`가 있으면 함께 읽고,
  없으면 해당 저장소 README와 STATUS를 진입 정본으로 사용한다.
- 과거 운영 메모는
  [PROJECTS_OPERATING_NOTES_2026-07-23.md](docs/history/PROJECTS_OPERATING_NOTES_2026-07-23.md)에
  비정본 archive로 보존한다.
- 신규 등록 절차는 [PROJECT_LIFECYCLE.md](docs/playbooks/PROJECT_LIFECYCLE.md)를 따른다.
