# PROGRAM_INTEGRATION — 프로그램 통합 아키텍처

> **Common Brain OS v1.0 원문 정책**
> Homepage(플랫폼) ↔ 독립 프로그램의 연결에 대한 최상위 아키텍처 표준.
> v2 문서 재배치에서는 내용 정책을 바꾸지 않고 루트에서 이 경로로 이동했다.
> 현재 `HOMEPAGE_PROGRAM_OPERATING_MODEL.md`와 충돌하므로 적용 전
> [KNOWN_CONFLICTS.md](../governance/KNOWN_CONFLICTS.md)를 반드시 확인한다.

이 문서가 다른 문서/프로젝트와 충돌하면, 프로그램 통합에 한해 이 문서가 우선한다고 기존
정책은 규정했다. 다만 현재 확인된 직접 충돌은 코지 결정 전까지 어느 한쪽으로 임의 해석하지 않는다.

## 1. 핵심 원칙

1. **정식 프로그램은 반드시 독립 프로젝트로 유지한다.** (독립 저장소 / 독립 배포)
2. **Homepage는 플랫폼/진입점만 담당한다.** — 로그인, 구독, 권한 확인, Programs 소개,
   그리고 `/apps/[appKey]` 실행 진입점.
3. **프로그램 본체(엔진/데이터/출력 UI)를 Homepage 저장소 내부로 이동하지 않는다.**
4. **모든 정식 프로그램에 동일 원칙을 적용한다.** — Ebook, ClipMiner, ShortsFactory, Movie Maker 등.
5. **정책(ops)과 구현(homepage)을 분리한다.** 정책은 본 문서, 구현 상세는 homepage 문서가 소유.
6. **개별 프로젝트 문서에는 본 문서를 링크로만 참조한다. 내용을 복사하지 않는다.** (SSOT)

## 2. 책임 경계

| 구분 | Homepage(플랫폼)가 소유 | 독립 프로그램이 소유 |
|---|---|---|
| 회원/인증 | 회원가입·로그인 | — |
| 접근 | 무료 구독·권한 확인·앱 접근 제어 | 토큰 검증 |
| 발견 | Programs 소개·상세(CMS) | — |
| 실행 | `/apps/[appKey]` 진입 게이트(권한 가드 → launch token 발급 → redirect) | 자체 도메인에서 실제 실행 |
| 기능 | 없음 | 엔진·데이터·출력 UI 전부 |

판정 기준은 `이것은 플랫폼(권한/진입점)의 일인가, 프로그램 엔진의 일인가?`다.
확신이 서지 않으면 흡수하지 않고 분리 쪽을 택한다.

## 3. 적용 대상 프로그램

대상 프로그램 목록·상태의 등록부 SSOT는 [PROJECTS.md](../../PROJECTS.md)다.

- Ebook Publishing System
- ClipMiner Web
- ShortsFactory
- Movie Maker (movieminer)
- 향후 모든 정식 프로그램

ClipMiner Desktop(v0.1.1)은 과도기 보조 제품으로 병행한다.

## 4. 정책과 구현 분리

- 정책: 경계·원칙·적용 대상
- 구현 상세: `/apps/[appKey]` 런처 게이트, launch token(HS256) 발급·검증,
  `user_app_subscriptions`/`canAccessApp` 권한 판정, app key 레지스트리
- 구현 정본: homepage의 `PLATFORM_APP_ARCHITECTURE.md`

같은 사실을 양쪽에 쓰지 않는다. 정책 변경은 이 정책 문서에서, 구현 변경은 homepage 문서에서
관리한다.

## 5. 개별 프로젝트 적용

- 각 프로그램의 `CLAUDE.md` 또는 README는 이 문서를 링크로만 참조한다.
- 신규 프로그램 등록 절차는
  [PROJECT_LIFECYCLE.md](../playbooks/PROJECT_LIFECYCLE.md)를 따른다.

## 6. 웹프로그램 호출 표준

모든 정식 프로그램의 기본 통합 구조이며, 토큰 서명·검증과 권한 판정 함수 등 구현 상세는
homepage 문서가 소유한다.

### 6.1 Homepage 담당

- 로그인 / 인증
- 구독 / 결제 및 권한 확인
- Launch Token 발급
- `/apps/[appKey]` 진입점

Homepage는 프로그램 본체를 포함하지 않는다.

### 6.2 정식 웹프로그램 공통 요건

- 독립 프로젝트
- 독립 도메인
- 독립 배포
- Launch Token 검증 후 실행

### 6.3 표준 실행 흐름

```text
Programs 상세
  → 무료구독 / 결제
  → user_app_subscriptions
  → /apps/[appKey]
  → requireAppAccess()
  → signLaunchToken()
  → 독립 서비스 URL
  → 프로그램 내부 verify-launch
  → 실행
```

지속 권한인 `user_app_subscriptions`와 순간 실행 허가인 launch token은 분리한다.
권한 미통과 시 Homepage 진입점에서 차단한다.

## 7. 데스크톱 / 모바일 예외

- Desktop / Mobile 형태의 프로그램은 과도기적 또는 보조 제품으로 유지될 수 있다.
  - 예: ClipMiner Desktop(v0.1.1), 감사일기 Android
- 기존 정책은 장기 정식 서비스의 기본을 §6 웹프로그램 호출 표준으로 두었다.
- 보조 제품과 정식 웹프로그램은 병행할 수 있다.
- 데스크톱 배포 방식의 구현 세부는 각 프로젝트 문서가 소유한다.

---

_Common Brain OS v1.0 원문 정책 · v2 경로 재배치_
