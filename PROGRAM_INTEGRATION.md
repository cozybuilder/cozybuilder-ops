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

- Ebook Publishing System (정식 웹프로그램)
- ClipMiner Web (정식 웹프로그램 — 신규 개발 예정) ※ ClipMiner Desktop(v0.1.1)은 과도기 보조 제품으로 병행 → §7
- ShortsFactory (정식 웹프로그램)
- Movie Maker (movieminer)
- 향후 모든 정식 프로그램 (기본 구조는 §6 웹프로그램 호출 표준)

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

## 6. 웹프로그램 호출 표준 (Web Program Launch Standard)

> **모든 정식 프로그램의 기본(default) 통합 구조.** 신규 정식 프로그램은 이 표준을 따른다.
> 본 절은 **정책·구조**만 정의한다. 토큰 서명/검증, 권한 판정 함수 등 **구현 상세는
> homepage/PLATFORM_APP_ARCHITECTURE.md 가 소유**한다(복제 금지, 링크 참조 — §4·§5).

### 6.1 Homepage가 담당하는 것 (그리고 그것만)

- 로그인 / 인증
- 구독 / 결제 및 권한 확인
- Launch Token 발급
- `/apps/[appKey]` 진입점(게이트) 제공

→ Homepage는 **프로그램 본체(엔진·데이터·출력 UI)를 포함하지 않는다.** (→ §1, §2)

### 6.2 정식 웹프로그램의 공통 요건

모든 정식 웹프로그램은 다음을 만족한다.

- **독립 프로젝트** (독립 저장소)
- **독립 도메인** (예: `https://{app}.cozybuilder.co.kr`)
- **독립 배포**
- **Launch Token 검증 후 실행** (프로그램 본체가 자체적으로 토큰을 검증)

### 6.3 표준 실행 흐름 (canonical)

```
Programs 상세
  ↓ 무료구독 / 결제
user_app_subscriptions  (app_key 기준 권한)
  ↓
/apps/[appKey]
  ↓ requireAppAccess()   (로그인 + 구독 권한 검증)
signLaunchToken()        (단명 서명 launch token 발급)
  ↓
https://{app}.cozybuilder.co.kr/?launch_token=...
  ↓ 프로그램 내부 verify-launch  (토큰 검증)
실행
```

- **권한(지속) = `user_app_subscriptions`**, **실행 허가(순간) = launch token** — 둘은 분리된다.
- 권한 미통과 시 진입점에서 차단한다(미로그인 → 로그인, 미구독 → 프로그램 상세). 본체로 토큰이 새지 않는다.

---

## 7. 데스크톱 / 모바일 예외 규정

- Desktop / Mobile 형태의 프로그램은 **과도기적 또는 보조 제품**으로 유지될 수 있다.
  - 예: ClipMiner Desktop(v0.1.1), 감사일기(Gratitude Note) Android.
- 단, **장기 정식 서비스의 기본 원칙은 §6 웹프로그램 호출 표준(Web Program + Launch Token)**이다.
  - 보조 제품과 정식 웹프로그램은 병행 가능하다(예: ClipMiner Desktop ↔ ClipMiner Web). 정식 라인은 §6를 따른다.
- 데스크톱 배포(설치형/무설치, 다운로드 제공 방식 등)의 **구현 세부는 각 프로젝트 문서가 소유**한다(본 문서는 정책만).

---

_Common Brain OS v1.0 · cozybuilder-ops_
