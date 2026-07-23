# PROJECTS 운영 메모 이전본

> **ARCHIVE — 현재 SSOT 아님**
> 기준 원문: `PROJECTS.md` at `1752b5144ce707be1ddff8391a781155b0211fc7`
> 현재 프로젝트 목록·메타데이터·포인터는 [PROJECTS.md](../../PROJECTS.md)만 확인한다.

이 문서는 과거 `PROJECTS.md`의 `운영 메모`에 누적돼 있던 프로젝트별 설명을 보존하기 위한
이전 기록이다. 세부 사실은 각 프로젝트 저장소의 `AI_CONTEXT.md`와 `STATUS.md`에서 다시
확인해야 하며, 이 파일을 현재 프로젝트 사실의 근거로 사용하지 않는다.

## 당시 운영 메모 원문

- 위 데이터의 출처는 채팅 기억이 아니라 디스크의 실제 `.git` 메타데이터 + 코비 승인이다.
- **ClipMiner**(🟢)는 개발 공백이 있으나, 홈페이지 등록·웹서비스 편입 예정으로 장기 active로 간주한다.
- **ClipMiner**: 2026-06-26 Common Brain 편입 완료(README/CLAUDE/docs/STATUS), GitHub(cozybuilder/clipminer) 초기 push 완료, 브랜치 main. 폴더명(ClipMiner→clipminer) 변경은 후속.
- **movieminer**(🔵): 2026-07-03 최소 문서(README/STATUS) 구축·git init(`main`, 문서 우선 초기 커밋) 완료. remote 미연결(origin 없음) — push 보류. 상태 SSOT는 STATUS.md. 정체·active 전환은 미확정(코지 승인 전 미전환).
- **house_rental / ShortsFactory**(📋)는 개발 전 — 착수 시 active로 승격한다.
- **cozyrent**(🟢 active / 개발 중): 제품명 **코지임대**(다가구·상가주택 건물주용 임대관리 앱). Path `C:\projects\cozyrent`. GitHub `cozybuilder/cozyrent` **Visibility=PRIVATE 고정**(저장소 D-017, 공개 전환 금지·필요 시 별도 Lite/Open 신규). Platform=Android mobile app. 비즈니스 모델=첫 달 무료 + 구독 + 광고 가능. 진입 요약=docs/AI_CONTEXT.md, 현재 상태 SSOT=docs/STATUS.md. 2026-06-30 문서 초기 구축·remote 연결·main push 완료. 이후 **React+Vite+TS+Tailwind v4 앱 개발 진행 중** — 홈 상황판/호실 탭·상세/건물 탭(고정지출·시설·하자수선)/계약·입금·입주기록 구현. 저장 계층은 localStorage 추상화(후속 Capacitor SQLite 교체형).
- **gratitude-note**: 2026-07-03 STATUS.md 포인터 연결 완료(docs/STATUS.md). README 진입문서화 완료.
- **fieldnote-ai**(🟢 active / 개발 착수 전): 제품명 **말해짠AI**(별칭 말해짜나). 건축·인테리어 현장 회의·상담·협의 음성을 현장용어 반영 전사문·회의록·금액·일정·변경사항·확인 메시지로 변환하는 AI 현장기록 SaaS. GitHub `cozybuilder/fieldnote-ai` **Visibility=PRIVATE**. 2026-07-14 `docs/business-research/`에서 발굴·검증(검증·출시·기술 조사 완료) 후 정식 프로젝트로 승격, 상세 문서 SSOT를 프로젝트 저장소로 이전. 진입 문서=docs/AI_CONTEXT.md, 현재 상태 SSOT=docs/STATUS.md. 실제 코드는 착수 전 — 다음 작업은 VITO·클로바 STT 기술 스파이크(공급자 실측 확정). business-research의 옛 상세 문서는 승격 안내 스텁만 남김(이중 SSOT 금지).
- **lifetimestudio**(🟢 active / 개발 착수 전): 제품명 **평생사진관**. 사용자의 사진과 결과 선택 이력을 바탕으로 사실 보존·Best Me·Dream Me 사진상품을 생성하고, 사용자가 선호하는 자신의 모습을 점진적으로 반영하는 개인화 AI 사진관. GitHub `cozybuilder/lifetimestudio`. 플랫폼 방향=**데스크탑 웹프로그램 우선 개발 → 웹 검증 후 바로 모바일 앱 제작**. PWA는 필수 중간 단계에서 제외. 초기 MVP는 단일 인물 프로필·Best Me·Dream Me 중심이며 커플·가족은 후속 확장. 진입 문서=docs/AI_CONTEXT.md, 제품 기획=docs/PLAN.md, 현재 상태 SSOT=docs/STATUS.md. 실제 코드는 착수 전 — 다음 작업은 이미지 생성·편집·개인화 API 기술 스파이크.
- **ai-promotion**(🟢 active / 개발 착수 전): 제품명 **AI Promotion**. 한국어 사용자를 위해 AI 서비스의 무료 플랜·무료 체험·크레딧·할인·추천 혜택과 공식 가입 경로를 역할·카테고리별로 구조화하는 웹 디렉터리. GitHub `cozybuilder/ai-promotion` **Visibility=PRIVATE**. 2026-07-15 보류 후보에서 사용자 승인으로 정식 프로젝트 승격. 긴 사전 검증 없이 정적 데이터 기반 MVP를 빠르게 개발·배포하고 실제 유입·클릭·제휴 전환으로 판단한다. 진입 문서=docs/AI_CONTEXT.md, 현재 상태 SSOT=docs/STATUS.md. 실제 코드는 착수 전 — 다음 작업은 웹 초기화, 샘플 데이터, 홈·목록·상세·검색·필터 구현.
- 폴더명 kebab-case 통일은 후속 작업으로 분리한다.
- 등록부 행이 늘거나 메타데이터가 바뀔 때만 이 문서를 수정한다.

원문 전체는 위 기준 commit의 `PROJECTS.md`에서도 복구할 수 있다. 이 archive는 현재 프로젝트
사실의 근거가 아니며, 최신 사실은 각 프로젝트의 GitHub SSOT에서 다시 확인한다.
