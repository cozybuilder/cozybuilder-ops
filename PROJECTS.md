# PROJECTS — 프로젝트 등록부

> **Common Brain OS v1.0**
> cozybuilder 프로젝트 목록·메타데이터·상태 포인터의 **단일 소유 문서(SSOT)**.
> 개별 프로젝트의 살아있는 상태는 그 프로젝트의 `STATUS.md`가 소유한다 — 여기는 **포인터만** 둔다.

신규 등록 절차는 [PLAYBOOK.md P1](PLAYBOOK.md)을 따른다.

---

## 등록 상태 범례

- 🟢 **active** — 운영/개발 중인 제품. 유지보수·확장 대상.
- 🟡 **paused** — 일시 중단. 재개 가능한 상태.
- 🔵 **candidate** — 로컬에 존재하나 정체/등록 미확정. 확인 후 분류.
- 📋 **planned** — 개발 전(기획·문서 단계 또는 코드 없음).
- 📦 **archived** — 종료/동결.

---

## 등록부

> 아래 목록은 작업 디렉터리(`C:\projects`)의 **실제 git 메타데이터**와 코비 승인(2026-06-26)으로 확정한 사실이다.
> 폴더명 kebab-case 통일과 STATUS.md 포인터 연결은 후속 작업으로 분리한다.

| 프로젝트 | 상태 | 기본 브랜치 | 원격(origin) | STATUS 포인터 |
|----------|------|-------------|--------------|----------------|
| cozybuilder-ops | 🟢 active | `main` | github.com/cozybuilder/cozybuilder-ops | (본 저장소 — 운영 허브) |
| homepage | 🟢 active | `main` | github.com/cozybuilder/cozybuilder-homepage | (미작성) |
| ebookPublishingSystem | 🟢 active | `main` | github.com/cozybuilder/ebookPublishingSystem | (미작성) |
| gratitude-note | 🟢 active | `master` | github.com/cozybuilder/gratitude-note | (미작성) |
| ClipMiner | 🟢 active | `main` | github.com/cozybuilder/clipminer | docs/STATUS.md |
| movieminer | 🔵 candidate | (git 미초기화) | (없음) | (미작성) |
| house_rental | 📋 planned | (git 미초기화) | (없음) | (미작성) |
| ShortsFactory | 📋 planned | (코드/폴더 없음) | (없음) | (미작성) |
| cozyrent | 📋 planned | `main` | github.com/cozybuilder/cozyrent (PRIVATE) | docs/STATUS.md |

---

## 운영 메모

- 위 데이터의 출처는 채팅 기억이 아니라 디스크의 실제 `.git` 메타데이터 + 코비 승인이다.
- **ClipMiner**(🟢)는 개발 공백이 있으나, 홈페이지 등록·웹서비스 편입 예정으로 장기 active로 간주한다.
- **ClipMiner**: 2026-06-26 Common Brain 편입 완료(README/CLAUDE/docs/STATUS), GitHub(cozybuilder/clipminer) 초기 push 완료, 브랜치 main. 폴더명(ClipMiner→clipminer) 변경은 후속.
- **movieminer**(🔵)는 실제 앱 코드가 있으나 git 미초기화 — 정체 확정 후 분류한다.
- **house_rental / ShortsFactory**(📋)는 개발 전 — 착수 시 active로 승격한다.
- **cozyrent**(📋 planned / document-ready): 제품명 **코지임대**(건물주용 임대관리 앱). Path `C:\projects\cozyrent`. GitHub `cozybuilder/cozyrent` **Visibility=PRIVATE 고정**(저장소 D-017, 공개 전환 금지·필요 시 별도 Lite/Open 신규). Platform=Android mobile app. 비즈니스 모델=첫 달 무료 + 구독 + 광고 가능. Main doc=docs/AI_CONTEXT.md, Status doc=docs/STATUS.md. 2026-06-30 문서 초기 구축·remote 연결·main push 완료, 코드 미착수.
- 폴더명 kebab-case 통일, STATUS.md 포인터 연결은 후속 작업으로 분리한다.
- 등록부 행이 늘거나 메타데이터가 바뀔 때만 이 문서를 수정한다 ([GLOBAL.md §2 소유권](GLOBAL.md)).

---

_Common Brain OS v1.0 · cozybuilder-ops_
