# PROGRAM_INTEGRATION — 프로그램 통합 아키텍처

> **Common Brain OS v1.0**
> Homepage(플랫폼) ↔ 독립 프로그램의 연결에 대한 **최상위 아키텍처 표준(SSOT)**.
> 철학·원칙은 [GLOBAL.md](GLOBAL.md), 절차는 [PLAYBOOK.md](PLAYBOOK.md)가 소유한다.
> 이 문서는 그 둘과 구분되는 **아키텍처 표준**을 단독 소유한다.

이 문서가 다른 문서/프로젝트와 충돌하면, 프로그램 통합에 한해 **이 문서가 우선**한다.

---

## 1. 핵심 원칙

1. **정식 프로그램은 반드시 독립 프로젝트로 유지한다.** (독립 저장소 / 독립 배포)
2. **Homepage는 플랫폼/진입점만 담당한다.** — 로그인, 구독, 권한 확인, Programs 소개,
   그리고 `/apps/[appKey]` 실행 진입점.
3. **프로그램 본체(엔진/데이터/출력 UI)를 Homepage 저장소 내부로 이동하지 않는다.**
4. **모든 정식 프로그램에 동일 원칙을 적용한다.** — Ebook, ClipMiner, ShortsFactory, Movie Maker 등.
5. **정책(ops)과 구현(homepage)을 분리한다.** 정책은 본 문서, 구현 상세는 homepage 문서가 소유.
6. **개별 프로젝트 문서에는 본 문서를 링크로만 참조한다. 내용을 복사하지 않는다.** (SSOT)

---

## 2. 책임 경계

| 구분 | Homepage(플랫폼)가 소유 | 독립 프로그램이 소유 |
|------|--------------------------|----------------------|
| 회원/인증 | 회원가입·로그인 | — |
| 접근 | 무료 구독·권한 확인·앱 접근 제어 | (토큰 검증만) |
| 발견 | Programs 소개·상세(CMS) | — |
| 실행 | `/apps/[appKey]` 진입 게이트(권한 가드 → launch token 발급 → redirect) | 자체 도메인에서 실제 실행 |
| 기능 | (없음) | 엔진·데이터·출력 UI 전부 |

판정 기준: **"이것은 플랫폼(권한/진입점)의 일인가, 프로그램 엔진의 일인가?"**
확신이 서지 않으면 흡수하지 말고 **분리** 쪽을 택한다.

---

## 3. 적용 대상 프로그램

대상 프로그램 목록·상태의 등록부 SSOT는 [PROJECTS.md](PROJECTS.md)다. 본 문서는 정책만 정의한다.

- Ebook Publishing System
- ClipMiner
- ShortsFactory
- Movie Maker (movieminer)
- 향후 모든 정식 프로그램

---

## 4. 정책(ops) vs 구현(homepage) 분리

- **정책(본 문서)**: 경계·원칙·적용 대상. "무엇을 분리하고 무엇을 Homepage가 담당하는가."
- **구현 상세(Homepage)**: `/apps/[appKey]` 런처 게이트, launch token(HS256) 발급·검증,
  `user_app_subscriptions`/`canAccessApp` 권한 판정, app_key 레지스트리 등.
  → 단일 소유: **homepage/PLATFORM_APP_ARCHITECTURE.md** (구현 정본). 본 문서는 그 문서를 링크한다.

> 같은 사실을 양쪽에 쓰지 않는다. 정책 변경은 여기서, 구현 변경은 homepage 문서에서.

---

## 5. 개별 프로젝트 적용

- 각 프로그램의 `CLAUDE.md`(또는 README)는 본 문서를 **링크로만** 참조한다. 원칙을 복제하지 않는다.
- 신규 프로그램 등록 절차는 [PLAYBOOK.md P1](PLAYBOOK.md)을 따르고, 통합 경계는 본 문서를 기준으로 한다.

---

_Common Brain OS v1.0 · cozybuilder-ops_
