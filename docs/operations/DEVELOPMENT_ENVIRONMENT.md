# DEVELOPMENT_ENVIRONMENT — CozyBuilder 개발환경 SSOT

> **Common Brain OS v1.0** · 최초 작성 2026-07-18 (클로 전수 실측) · 최근 갱신 2026-07-20
> 개발 하드웨어·설치 도구·계정/콘솔·도메인/DNS·빌드/배포 환경의 **단일 소유 문서(SSOT)**.
> 프로젝트 작업 전 이 문서를 먼저 읽는다 — **여기 기록된 값을 코지에게 다시 묻지 않는다** ([PLAYBOOK.md P12](../../PLAYBOOK.md)).

각 항목은 세 등급으로 구분한다. 등급 없는 항목은 없다 — 추정으로 채운 값은 없다.

- **[실측]** — 이 PC/기기/서버에서 명령·API로 직접 확인 (확인일 병기)
- **[콘솔]** — 코지가 콘솔·화면에서 확인해 보고한 사실 (보고일 병기)
- **[미확인]** — 아직 누구도 확인하지 않음 (추정 금지 · 필요 시에만 확인)

---

## 1. 하드웨어

### 1.1 Windows 개발 PC — [실측 2026-07-18 · 화면 재확인 2026-07-20]

| 항목 | 값 |
|---|---|
| 메인보드 | ASRock **H81M-DGS R2.0** (조립 PC — 제조사/모델 필드 "To Be Filled By O.E.M.") |
| BIOS | AMI **P1.30** (2014-07-02) |
| CPU | Intel **Core i7-4790** @3.60GHz · 4코어/8스레드 |
| GPU | NVIDIA **GeForce GTX 1060 3GB** (드라이버 32.0.15.6636) |
| RAM | **16GB** = 8GB×2 (Samsung DDR3 1600MHz · 슬롯 2/2 전부 사용 — 증설 시 교체 필요) |
| 저장장치 | **Crucial BX500 240GB SSD**(CT240BX500SSD1) 단일 — Windows 표시 총 224GB |
| 볼륨 | **C:**(OS+작업 동일 드라이브) · 사용 약 172GB · **남은 약 52GB** ⚠ 용량 여유 적음 |
| 작업 경로 | `C:\projects\` |
| OS | **Windows 10 Home 22H2** · 10.0.19045 · 64비트(x64) |
| 가상화 | CPU 펌웨어 VT **비활성**(VirtualizationFirmwareEnabled=False) · HypervisorPresent=True(OS 보고) · **WSL 미설치** · Docker 미설치 |
| 네트워크 | Realtek PCIe GbE (유선) |
| 모니터 | 1920×1080(주) + 1920×1200 듀얼 |
| Android 빌드 | **가능** — [실측] cozyrent v15 release APK/AAB 빌드 성공(2026-07-18) |
| iOS 빌드 | **불가** — macOS/Xcode 필요(이 PC는 Windows) |
| 운영 역할 | Windows 전용·Android 보조 개발 및 기존 로컬 프로젝트 유지 |

- 종전 구두 정보와 대조: ASRock H81M-DGS ✔(R2.0) · RAM 8GB×2 ✔(총 16GB) · `C:\projects` ✔ ·
  "SSD/HDD 보유" → **실측은 SSD 1개뿐**(HDD 미검출 — 분리·미장착 여부 [미확인]).

### 1.2 노트북 (LG Gram) — [미확인]

- 이 PC에서 실측 불가. 모델·CPU·RAM·저장장치·용도·빌드 가능 범위 전부 [미확인]. 확인되면 이 표를 채운다.

### 1.3 MacBook Air (Apple 메인 개발 장비) — [콘솔 2026-07-20]

| 항목 | 값 |
|---|---|
| 모델 | **MacBook Air 13형 (M3, 2024년 모델)** |
| 칩 | **Apple M3** |
| 메모리 | **24GB 통합 메모리** |
| 저장장치 | **1TB SSD** · macOS 표시 총 **994.66GB** |
| 초기 가용 공간 | **969.55GB 사용 가능**(초기화 직후 확인) |
| 디스플레이 | 13.6형 내장 Retina · **2560×1664** |
| macOS | **macOS Sequoia 15.2** 확인 · **15.7 업데이트 진행 시작**(2026-07-20) |
| AppleCare+ | **2028-03-18 만료** |
| 활성화 | 판매자 계정 잠금 없이 정상 활성화·초기 설정 완료 |
| FileVault | 초기 설정에서 디스크 암호화 켜기 선택 |
| 운영 역할 | iOS/Xcode 빌드·App Store 배포 및 이동형 메인 개발 장비 |

- 구입가: **1,325,000원** — 장비비 증빙·세무 처리는 별도 비용 문서가 소유한다.
- 일련번호 원문은 보안상 이 문서에 기록하지 않는다.

### 1.4 실기기 (테스트 폰)

**Samsung Galaxy S23 — [실측 2026-07-18]** (상시 테스트폰 · 데이터 보호 절대규칙은 [cozyrent/docs/AI_CONTEXT.md] 소유)

| 항목 | 값 |
|---|---|
| 모델 | **SM-S911N** (일련번호 마스킹 `R3CW…X1H` — 전체 기재 금지) |
| OS | **Android 16** (API 36) · One UI 버전코드 80500 |
| 화면 | 1080×2340 · 480dpi |
| 연결 | USB 상시 연결 · USB 디버깅 승인(adb state=`device`) |
| 용도 | CozyRent Play **내부 테스트** 실기기 · 코지임대 설치본 = **Play App Signing 재서명본**(v15 · installer=com.android.vending) |
| 절대규칙 | uninstall·pm clear·공장초기화·실데이터 수정 금지 · 업데이트는 Play 경유(로컬 APK는 서명 불일치로 설치 불가 — §7) |

**iPhone — [미확인]** — 실보유·연결 확인된 iPhone 없음. 후보·계획은 기재하지 않는다.

---

## 2. 소프트웨어 툴체인

### 2.1 전역 도구 — [실측 2026-07-18]

| 도구 | 버전 | 비고 |
|---|---|---|
| Git | 2.54.0.windows.1 | |
| Node.js / npm | v24.16.0 / 11.16.0 | 패키지 매니저는 전 프로젝트 **npm**(lockfile 기준) |
| Python | 3.12.10 | |
| Claude Code | 2.1.165 | 클로 실행 환경 |
| PowerShell | 5.1 (Windows PowerShell) | |
| Git Bash | GNU bash 5.3.9 | |
| Android Studio | **2026.1** (+ 내장 JBR **OpenJDK 21.0.10** — Android 빌드의 JAVA_HOME으로 사용) | 전역 `java` 없음(JBR만) |
| Android SDK | build-tools 35.0.0/36.1.0/37.0.0 · platforms android-36/36.1 · platform-tools adb **37.0.0**(1.0.41) | `%LOCALAPPDATA%\Android\Sdk` |
| VS Code | 설치(user 설치본) | |
| Supabase CLI | 2.109.1 | npx 경유(cozyrent devDep) · Management 로그인 완료(네이티브 자격 저장소) |

**미설치 — [실측]**: GitHub CLI(gh) · pnpm · yarn · Docker · WSL · sqlite3 CLI · gcloud · Firebase CLI ·
Cloudflare Wrangler · Codex CLI. (필요해지면 설치 후 이 표를 갱신.)

### 2.2 프로젝트 로컬 (cozyrent) — [실측 2026-07-18]

TypeScript 5.9.3 · Vite 6.4.3 · Vitest 2.1.9 · React 18.3.1 · Tailwind CSS 4.3.2 ·
Capacitor 8.4.1(core/android) · Gradle wrapper 8.14.3. (다른 프로젝트의 로컬 버전은 각 저장소 package.json이 소유.)

### 2.3 Apple 개발도구 — [콘솔 2026-07-20]

| 도구 | 상태 | 비고 |
|---|---|---|
| macOS | Sequoia 15.2 확인 · 15.7 업데이트 진행 | 업데이트 완료 후 버전 재확인 필요 |
| Xcode | **미설치** | macOS 업데이트 후 App Store에서 설치 예정 |
| Xcode Command Line Tools | **미확인** | Xcode 설치 후 실측 |
| Homebrew | **미설치/미확인** | 개발환경 세팅 시 설치 후 기록 |
| Git / Node.js / npm | **미확인** | Mac 전역 버전 실측 필요 |
| Android Studio / Android SDK | **미설치/미확인** | Mac 세팅 시 설치 후 기록 |
| VS Code | **미설치/미확인** | Mac 세팅 시 설치 후 기록 |
| Docker | **미설치/미확인** | 필요성 확정 후 설치 |
| iOS 빌드·서명 | **아직 미검증** | Xcode·Apple Developer 설정 후 CozyRent 첫 빌드로 검증 |

---

## 3. 저장소·로컬 경로 — [실측 2026-07-18]

> 프로젝트 등록부(상태·의미)는 [PROJECTS.md](../../PROJECTS.md)가 소유 — 여기는 **디스크 실측**만 기록한다.

| 로컬 폴더(C:\projects\) | 브랜치 | origin | 비고 |
|---|---|---|---|
| cozybuilder-ops | main | cozybuilder/cozybuilder-ops | 운영 허브 · Actions 워크플로 1 |
| cozyrent | main | cozybuilder/cozyrent (PRIVATE) | 주 개발 대상 · npm |
| homepage | main | cozybuilder/cozybuilder-homepage | **Vercel 자동 배포(main)** [실측: docs/STATUS] |
| ClipMiner | main | cozybuilder/clipminer | npm |
| clipminer-web | main | cozybuilder/clipminer-web | **등록부(PROJECTS.md)에 없음** |
| ai-video-production | main | cozybuilder/ai-video-production | **등록부에 없음** · package.json 없음 |
| ebookPublishingSystem | main | cozybuilder/ebookPublishingSystem | Actions 워크플로 1 |
| fieldnote-ai | main | cozybuilder/fieldnote-ai (PRIVATE) | 코드 착수 전 |
| gratitude-note | **master** | cozybuilder/gratitude-note | |
| movieminer | main | (원격 없음) | 등록부와 일치(🔵) |
| ai-promotion | **(git 미초기화)** | — | ⚠ 등록부는 "GitHub PRIVATE 연결"로 기재 — **불일치**(§9) |
| cozyrent-keys | (git 아님) | — | **upload keystore 보관 폴더**(§7 — 커밋 금지 영역) |
| cozyrent-backups | (git 아님) | — | 실기기 백업 보관(예: 2026-07-16-auth2-device) |

- **등록부에 있으나 폴더 없음**: lifetimestudio · house_rental · ShortsFactory(코드 없음은 등록부와 일치) — lifetimestudio는 🟢인데 로컬 clone 없음(§9).
- GitHub Actions: 로컬 기준 cozybuilder-ops·ebookPublishingSystem 각 1개 워크플로. 나머지 저장소 0.
- MacBook의 저장소 clone 경로는 아직 [미확인] — 개발환경 세팅 후 이 절에 추가한다.

---

## 4. 클라우드·콘솔·외부 서비스

### 4.1 GitHub — [실측/콘솔]

- Org **cozybuilder** · 저장소 목록은 §3·PROJECTS.md. secrets: 저장소별 [미확인](이번 조사 범위 밖).
- GitHub App/Connector: **ChatGPT 연결 및 문서 읽기·쓰기 동작 확인** — [콘솔 2026-07-20, 본 문서 갱신으로 검증].

### 4.2 Google Cloud (GCP) — 인증용 프로젝트

- 프로젝트: **cozyrent-dev** — [콘솔 2026-07-18]. prod GCP 프로젝트 [미확인](미생성 추정 금지 — 확인 필요 시 코지).
- OAuth 동의 화면: **테스트 중** · 테스트 사용자 = cozybuilder.studio@gmail.com + 코지 계정 — [콘솔 2026-07-18].
- **Web OAuth Client**: 존재 · Client ID는 cozyrent `.env`(`VITE_GOOGLE_WEB_CLIENT_ID`)·Supabase provider에 주입 완료 —
  [실측 2026-07-18: 3중 일치(코지 전달값=번들=Supabase authorize client_id)]. **Client Secret은 Supabase provider 설정에만**(원문 기록 금지).
- **Android OAuth Client**: `cozyrent-dev-android-play` · 패키지 com.cozybuilder.cozyrent ·
  SHA-1 = Play App Signing 인증서 `DB:6C:53:BA:28:B9:09:AC:F3:1C:FF:EA:B6:27:1E:4A:D3:70:40:39` —
  [콘솔 등록 + 실측 대조 일치 2026-07-18]. upload key SHA-1용 Android client는 **미등록**(로컬 빌드 로그인 필요 시 선택 — AUTH_CONSOLE_SETUP).
- 서비스 계정: Play Android Publisher용 존재(키는 Supabase secrets 보관 — 존재만 기록) — [실측: 결제 검증 함수 동작으로 확인].
- 결제용 GCP·Play 연동 상세는 [cozyrent/docs/BILLING_CONSOLE_SETUP.md]·[cozyrent/docs/AUTH_CONSOLE_SETUP.md] 소유.

### 4.3 Google Play Console

- 개발자 계정명 [미확인](콘솔 전용 — 문서 필요 시 코지 확인).
- 앱: **코지임대** `com.cozybuilder.cozyrent` · **내부 테스트 트랙** 운영 — [콘솔·실측].
- **Play App Signing 사용** — 앱 서명 인증서 [실측 2026-07-18: 기기 설치본 추출]:
  SHA-1 `DB:6C:53:BA:28:B9:09:AC:F3:1C:FF:EA:B6:27:1E:4A:D3:70:40:39` · SHA-256 `05aa608a…0723d1`(전체는 필요 시 재실측).
- **upload key** [실측]: SHA-1 `C9:93:BE:A7:5B:96:2E:E5:49:AC:C7:59:6E:51:2E:44:30:A1:D2:09` (인증서 지문=공개 정보 · 키 파일·비밀번호는 §7).
- 현재 versionCode: **15** — [실측: build.gradle + 기기 설치본]. versionName 1.0.
- 라이선스 테스터: cozybuilder.studio@gmail.com **지정됨(코지)** · 콘솔 등록 상태 [미확인 — 코지 확인 항목으로 남음].
- 결제 테스트 정책: 실결제 금지 · 라이선스 테스트 구독만(상세는 cozyrent SUBSCRIPTION/BILLING 문서 소유).

### 4.4 Supabase — [실측 2026-07-18: projects list·API]

| 프로젝트 | ref | 리전 | 용도 |
|---|---|---|---|
| **cozyrent-dev** | yywhbiljpcxetpstvtea | **Seoul** ap-northeast-2 | CozyRent 인증·결제 원장·백엔드(링크됨) |
| Cozybuilder-homepage | zniktvkdqaxqmgwmogyb | Tokyo ap-northeast-1 | 홈페이지용 |

- cozyrent-dev [실측]: Auth **Google provider 활성**(id_token 검증 동작) · Email 활성 · **SMTP=Resend 정상**(발신자
  no-reply@mail.cozybuilder.co.kr · 외부 수신자 200 — §4.5) · Edge Functions 배포(verify-purchase·rtdn-webhook·entitlement-issue·
  reconcile-subscriptions·point-defer 등) · migrations 4종(billing 원장·예약·reconcile·trial_carry) · **pg_cron**(reconcile 매시) ·
  **Vault 사용**(reconcile_cron_secret). 상세는 cozyrent docs(AUTH_CONSOLE_SETUP·SUBSCRIPTION·BILLING_PLAN) 소유.
- **prod 프로젝트 미생성** — [실측: projects list에 없음]. 출시 전 별도 승인으로 생성.
- URL·publishable key는 cozyrent `.env`(미추적)·대시보드에 있음 — 여기 원문 복제 안 함. service_role·SMTP 비밀번호 기록 금지.

### 4.5 Resend (이메일 발송)

- 용도: Supabase 이메일 OTP — [실측 2026-07-18: 외부 수신자 발송 200].
- 등록 도메인: **mail.cozybuilder.co.kr** · Provider Cloudflare · 리전 Tokyo · **Verified(DKIM/SPF/MX 전부)** —
  [콘솔 2026-07-18 코지 확인]. (최초 보고의 `mail.cozybuilder.kr` 표기는 **오기**였음 — `.co.kr`가 맞음 · §9 #9 해소.)
- 발신자: Supabase SMTP sender = **no-reply@mail.cozybuilder.co.kr** · Sender name **코지임대** — [실측 2026-07-18: 수신 메일 From 확인].
- 상태: 외부 수신자 발송 정상(종전 소유자-전용 제한은 기본 발신자 `onboarding@resend.dev` 때문 — 도메인 인증+발신자 전환으로 해소).
- 무료 플랜 제한: 월 3,000통·일 100통(Resend Free 공표 기준 — 초과 필요 시 유료 검토).
- API key: Supabase SMTP 설정(password 필드)에만 저장(보관 위치만 기록 — 원문 금지).

### 4.6 Cloudflare / 도메인 — [콘솔 2026-07-18 코지 확인]

- zone **cozybuilder.co.kr** — DNS를 Cloudflare에서 관리 · **Free 플랜** · 상태 **Active**.
- [미확인]: 등록기관 · nameserver 목록 · DNSSEC · proxy 정책 · mail.cozybuilder.kr용 레코드 위치(§4.5 주의 참조) ·
  Cloudflare Pages/Workers 사용 여부. Wrangler는 로컬 미설치 [실측].
- 홈페이지: cozybuilder-homepage → **Vercel 자동 배포(main)** [실측: homepage docs/STATUS]. SSL·서브도메인 목록 [미확인].

---

## 5. 모바일 빌드·서명 환경 (CozyRent) — [실측 2026-07-18]

| 항목 | 값 |
|---|---|
| applicationId/namespace | `com.cozybuilder.cozyrent` |
| SDK | minSdk 24 · targetSdk 36 · compileSdk 36 |
| Capacitor / Gradle / JDK | 8.4.1 / wrapper 8.14.3 / Android Studio JBR 21(JAVA_HOME 지정 필요) |
| versionCode 관리 | `android/app/build.gradle` (현재 **15**) |
| release keystore | `android/keystore.properties`(git **미추적**) + 키 파일 `C:\projects\cozyrent-keys\upload-keystore.*` — 비밀번호·파일 기록/커밋 금지 |
| 서명 체계 | 로컬 빌드=**upload key**(SHA-1 C9:93…D2:09) → Play 업로드 시 **Play App Signing 재서명**(SHA-1 DB:6C…40:39) |
| ⚠ 설치 정책 | Play 설치본 위에 로컬 APK 설치 **불가**(서명 불일치 INSTALL_FAILED_UPDATE_INCOMPATIBLE — 실측). **uninstall 우회 금지** → 데이터 보존 업데이트는 **AAB Play 내부 테스트 업로드 경유만** |
| 산출물 경로 | AAB `android/app/build/outputs/bundle/release/` · APK `…/apk/release/` |
| 빌드 env | `vite build` 시점의 `.env`(git 미추적)가 번들에 포함 — 공개값만: `VITE_SUPABASE_URL`·`VITE_SUPABASE_PUBLISHABLE_KEY`·`VITE_GOOGLE_WEB_CLIENT_ID`·(승인 시)`VITE_COMMERCE_GATE_ENABLED` |
| 번들 금지 | Google OAuth **Client Secret** · service_role · SMTP 비밀번호 · keystore 값 — 번들 grep 검증을 빌드 검증 항목에 포함 |
| adb 정책 | `install -r`만(데이터 보존) · uninstall/pm clear/재설치 금지 — 상세는 cozyrent AI_CONTEXT 소유 |

---

## 6. AI·업무 도구와 역할

| 도구/주체 | 역할 |
|---|---|
| **코지** (CEO) | 최종 승인 · 콘솔 조작(GCP/Play/Supabase 대시보드/Resend/Cloudflare/DNS) · 실기기 조작·결제 확인 |
| **코비** (ChatGPT · PM) | 방향·기준 정리 · 작업 지시 · 검토 |
| **클로** (Claude Code 2.1.165 · DEV) | 로컬 실행·코드·문서·검증 · CLI(supabase/adb/gradle) · 커밋/푸시 |
| GitHub (org cozybuilder) | 코드·문서 SSOT |
| Supabase / GCP / Play Console / Resend / Cloudflare / Vercel | §4 각 항목 |
| Android Studio(JBR)·VS Code | 빌드·편집 도구 |
| 이미지·영상 제작 도구 | [미확인] (사용 확정 시 기재) |

구독 플랜·계정 식별자는 운영에 필요한 최소만 기록(비밀번호·결제정보·개인 토큰 금지 — §8).

---

## 7. 환경별 담당·변경 절차

| 영역 | 조작 주체 | 변경 시 갱신 문서 | 변경 후 검증 |
|---|---|---|---|
| PC 하드웨어·OS·전역 도구 | 코지(물리)/클로(설치·실측) | 이 문서 §1·§2 | 해당 명령 재실측 |
| 저장소 추가/이동 | 클로(코지 승인) | PROJECTS.md + 이 문서 §3 | git remote/branch 확인 |
| GCP OAuth·동의 화면 | **코지 콘솔** | cozyrent AUTH_CONSOLE_SETUP + 이 문서 §4.2 | authorize client_id·SHA 실측 대조 |
| Play Console(업로드·서명·테스터) | **코지 콘솔** | cozyrent STATUS + 이 문서 §4.3 | 기기 설치본 versionCode·서명 실측 |
| Supabase(대시보드 설정·SMTP) | **코지 대시보드** | AUTH_CONSOLE_SETUP + 이 문서 §4.4·4.5 | settings API·OTP 발송 실측 |
| Supabase(CLI: 함수·마이그레이션·크론) | 클로 CLI | cozyrent 해당 docs | 배포 응답·db query 실측 |
| DNS·도메인 | **코지**(Cloudflare/등록기관) | 이 문서 §4.6 (+Resend §4.5) | dig/Resend 인증 상태 |
| 키스토어·secret | 코지 보관/클로 사용 | **값 기록 금지** — 보관 위치·갱신일·담당만 이 문서에 | 서명 검증(apksigner)·기능 실측 |
| 새 장비 추가/폐기 | 코지 | 이 문서 §1 (폐기 시 행 이동·데이터 처리 방식 기록) | 실측 후 기재 |

secret 변경 시 문서에는 **무엇이 어디 보관되는지·언제 갱신했는지·누가 담당인지만** 기록한다.

---

## 8. 기록 금지 (보안·개인정보)

비밀번호 · OTP 코드 · API key 원문 · OAuth Client Secret · service_role key · SMTP 비밀번호 ·
keystore 비밀번호/파일 · private key · 복구 코드 · 주민번호/사업자 민감정보 · 개인 결제정보.
공개 가능한 식별자(이메일·일련번호 등)도 불필요하면 마스킹한다.

---

## 9. 미확인·불일치 종합 (다음 확인 대상)

| # | 항목 | 상태 |
|---|---|---|
| 1 | LG Gram 노트북 사양·용도 | 미확인 |
| 2 | MacBook Apple 개발 툴체인 | **장비 확인 완료** · macOS 업데이트/Xcode·Homebrew·Git·Node·Android Studio 설치 및 첫 iOS 빌드 미검증 |
| 3 | iPhone 실보유·iOS 테스트 | 미확인 |
| 4 | 메인 PC HDD(SSD 외 저장장치) | 미확인(실측은 SSD 1개뿐) |
| 5 | ai-promotion: 폴더 git 미초기화 ↔ PROJECTS.md "GitHub PRIVATE" 기재 | **불일치 — 등록부 소유자(코비/코지) 판단 필요** |
| 6 | lifetimestudio: 등록부 🟢 active ↔ 로컬 clone 없음 | 불일치(clone 필요 여부) |
| 7 | clipminer-web · ai-video-production: 로컬+원격 존재 ↔ 등록부에 없음 | 등록부 반영 여부 판단 필요 |
| 8 | Play Console 개발자 계정명 · 라이선스 테스터 등록 상태 | 미확인 |
| 9 | ~~Resend 도메인 TLD 차이~~ | **해소(2026-07-18)** — 실도메인 `mail.cozybuilder.co.kr`(Cloudflare 관리 · Verified). `.kr` 표기는 오기였음 |
| 10 | Cloudflare 등록기관·NS·DNSSEC·proxy·Pages/Workers | 미확인 |
| 11 | GitHub 저장소별 secrets | 미확인 · ChatGPT Connector 읽기/쓰기 확인 완료(2026-07-20) |
| 12 | prod(GCP·Supabase·SMTP 도메인) | 미생성/미확인 — 출시 전 별도 승인 |

---

_Common Brain OS v1.0 · cozybuilder-ops · docs/operations_