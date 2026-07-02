# PLAYBOOK — 운영 절차

> **Common Brain OS v1.0**
> 반복되는 운영 워크플로의 **단일 소유 문서**. "어떻게 하는가"를 담는다.
> 규칙(무엇이 옳은가)은 [GLOBAL.md](GLOBAL.md)가 소유한다 — 여기서는 절차만 다룬다.

---

## P0. 모든 작업의 기본 흐름

> 원칙: [GLOBAL.md §1.1 Document First, GitHub Second](GLOBAL.md)

1. 결정한다.
2. 해당 정보를 **소유하는 문서**에 기록한다. ([GLOBAL.md §2](GLOBAL.md))
3. 실행(코드/저장소 작업)한다.
4. 아래 P3 보고 형식으로 마무리한다.

---

## P1. 신규 프로젝트 등록

1. `templates/project-template/`를 복사해 새 프로젝트 골격을 만든다.
2. 골격의 플레이스홀더(`<PROJECT_NAME>` 등)를 채운다.
3. [PROJECTS.md](PROJECTS.md) 등록부에 **한 행**을 추가한다 (목록의 SSOT).
4. 프로젝트 상태는 그 프로젝트의 `STATUS.md`가 소유하고, PROJECTS.md는 포인터만 둔다.
5. P3 형식으로 보고한다.

## P2. STATUS 갱신

- 개별 프로젝트의 살아있는 상태는 그 프로젝트의 `STATUS.md`에 기록한다.
- 갱신 시 무엇이/언제/왜 바뀌었는지 한 줄이라도 남긴다.
- 등록부 수준 메타데이터(이름·저장소·포인터)가 바뀐 경우에만 [PROJECTS.md](PROJECTS.md)를 함께 갱신한다.

## P3. 표준 통신 형식 (Standard Communication Format)

> 원칙: [GLOBAL.md §7 Communication Principles](GLOBAL.md).
> **모든 지시와 보고는 복붙 가능한 블록 안에** 작성한다. **평문 지시/보고 금지.** 새 대화창에서도 예외 없다.
> 방향별 템플릿: 지시는 P3.2, 보고는 P3.3. 완료 보고의 구속 규칙(Output Contract)은 P3.4.

### P3.1 마무리 순서 (STATUS → commit → push)

작업 완료 시 항상 아래 순서로 마무리한다.

1. **STATUS 갱신** (해당 시) — 바뀐 상태를 STATUS.md에 반영.
2. **commit** — [GLOBAL.md §4 커밋 규약](GLOBAL.md)을 따른다.
3. **push** — 원격이 연결된 경우. 미연결이면 "원격 미연결 — push 보류"로 보고에 명시한다.

### P3.2 표준 지시 형식 (Standard Instruction Format) — 코비 → 클로

코비가 클로에게 내리는 지시는 아래 구조를 **코드블록 안에** 채워 작성한다.

```
━━━━━━━━━━━━━━━━━━
코비 → 클로
작업명:
━━━━━━━━━━━━━━━━━━

■ 목적
...

■ 작업 내용
...

■ 주의사항
...

■ 완료 조건
...
━━━━━━━━━━━━━━━━━━
```

### P3.3 표준 보고 형식 (Standard Reporting Format) — 클로 → 코지/코비

클로의 완료 보고는 아래 구조를 ` ```text ` 코드블록 안에 채워 작성한다.
수신자(코지/코비)는 **지시를 내린 사람**에 맞춘다.

```text
━━━━━━━━━━━━━━━━━━
클로 → [코지/코비] 완료 보고
작업명:
━━━━━━━━━━━━━━━━━━

■ 진행 방식
...

■ 변경 파일
...

■ 적용 원칙
...

■ 검증
...

■ Self Validation
- 본 보고가 현재 Output Contract(P3.4)를 만족하는가? ✅ / ❌
- 코드블록 밖 평문 출력이 없는가? ✅ / ❌
- 질문/승인 요청이 동일 코드블록 안에 있는가? (해당 시) ✅ / ❌

■ commit / push
...

■ 다음 액션 / 질문·승인 요청
...
━━━━━━━━━━━━━━━━━━
```

### P3.4 클로 완료 보고 표준 (Output Contract)

> **구속 규칙(contract).** [GLOBAL.md §7 Communication Principles](GLOBAL.md)를 완료 보고에 대해 구체화한다.
> 새 대화·새 프로젝트에서도 예외 없다.

1. **모든 완료 보고는 ` ```text ` 코드블록 안에 작성한다.** 평문 보고 금지.
   (fence 는 ` ```text ` 로 통일한다 — IDE/GitHub/ChatGPT/Claude/Gemini 호환성 확보.)
2. **수신자**는 지시를 내린 사람(코지 또는 코비)에 맞춘다. 헤더: `클로 → [코지/코비] 완료 보고`.
3. **구조**는 P3.3 템플릿을 따른다 (작업명 / 진행 방식 / 변경 파일 / 적용 원칙 / 검증 / commit·push / 다음 액션).
4. **commit / push 결과를 항상 명시**한다 (성공 해시 / 실패 원인 / 보류 사유 중 하나).
5. **작업 위치 가드**: 작업 위치가 지정 Repository와 다르면, 다른 작업을 멈추고
   `작업 폴더가 잘못되었습니다`만 보고한다.
6. **코드블록 밖 평문 출력을 금지**한다. 보고 본문 설명은 전부 코드블록 안에 둔다.
7. **질문·승인 요청도 반드시 동일 코드블록 안에 포함**한다. 블록 밖에 별도 질문을 두지 않는다.
8. 이 Output Contract 는 **완료 보고뿐 아니라 분석·진행 보고에도 동일하게 적용**한다.

### P3.4.6 Self Validation

1. 새로운 **출력 규칙을 추가/수정한 경우, 그 작업의 완료 보고 자체가 새 규칙을 만족**해야 한다.
2. 규칙을 문서화했으나 실제 완료 보고가 이를 따르지 못하면 **표준 적용 실패**로 간주한다.
3. 적용 실패 시, **수정된 형식으로 완료 보고를 즉시 재작성**한다.
4. 보고의 `■ 검증`에 다음을 반드시 포함한다:

   ```
   ■ Self Validation
   - 본 보고가 현재 Output Contract를 만족하는가? ✅ / ❌
   - 코드블록 밖 평문 출력이 없는가? ✅ / ❌
   - 질문/승인 요청이 동일 코드블록 안에 있는가? (해당 시) ✅ / ❌
   ```

## P4. 신규 저장소 부트스트랩

1. 로컬에 디렉터리 생성 후 `git init -b main` ([GLOBAL.md §3](GLOBAL.md)).
2. 골격 문서를 먼저 작성한다 (Document First).
3. 첫 커밋을 만든다.
4. 원격 저장소를 만들고 연결한 뒤 push 한다 (GitHub Second).

## P5. 표준 진화 절차 (Standard Evolution Process)

> 철학·원칙은 [GLOBAL.md §8 Standards Evolve Through Practice](GLOBAL.md)가 소유한다 — 여기서는 절차만 다룬다.
> 이 절차를 완료해 commit/push 되기 전까지, 합의는 공식 기준정보가 아니다.

```
문제 발견
   ↓
패턴 확인 (실전에서 반복 등장 확인)
   ↓
코지(CEO) 승인
   ↓
코비(PM) 방향 정리 (저장 문서 결정: GLOBAL=철학·원칙 / PLAYBOOK=절차)
   ↓
클로(DEV) 문서 반영 + STATUS·현재 상태 기록
   ↓
commit
   ↓
push
   ↓
공식 기준 승격
```

- 저장 위치 판단: 철학·원칙·표준은 [GLOBAL.md](GLOBAL.md), 반복 절차는 본 문서. 중복 금지([GLOBAL.md §2](GLOBAL.md)).
- 승격 요건: 최소 1회 실전 적용 또는 충분한 합의([GLOBAL.md §8.1](GLOBAL.md)).

## P6. Documentation Sync Guard (문서 동기화 가드)

> 목적: 프로젝트 구조·상태·기준정보 변경 시 **관련 문서 갱신 누락을 검출**한다.
> 자동 수정하지 않는다. 철학은 [GLOBAL.md](GLOBAL.md)(Document First/SSOT) — 본 절은 **실행 절차**만 소유한다.

### P6.1 범위와 한계

- **검증한다**: ①루트 필수문서 존재 ②템플릿 필수문서 존재 ③레포 내부 마크다운 상대링크 무결성
  ④PROJECTS.md STATUS 포인터 문법 ⑤PROJECTS.md 테이블 최소 구조.
- **하지 않는다**: 자동 수정 / 타 레포·private STATUS 실존 검사 / 네트워크 호출.
- **마크다운 링크 검사는 inline `[text](link)` 만 대상**이다. 이미지 `![alt]()`, reference-style
  `[text][id]`, HTML `<a href>`, autolink `<https://…>`, 그리고 코드블록/인라인 코드 내부 표기는 1차 범위에서 제외한다.
- **의미적 최신성(내용이 실제 최신인지)은 검증하지 못한다.** 통과 = 구조·링크·문법이 온전함을 뜻할 뿐.
- 타 레포/private/URL 포인터는 실패가 아니라 **warning**.

### P6.2 SSOT

- 필수문서 목록·허용 센티넬·검사 옵션은 **`docs-guard.config.json` 이 단독 소유**한다.
- 본 절은 목록을 복제하지 않는다 — 절차·실행·한계·config 위치만 둔다.

### P6.3 실행

- 로컬(1차 자기검증): `node scripts/verify-docs-guard.mjs` — Node 내장만, 의존성 없음.
- CI(최종 백스톱): `.github/workflows/docs-guard.yml` 가 push/PR 시 setup-node 후 동일 스크립트 실행.
- 판정: **error ≥ 1 → 실패(exit 1)**, warning만 있으면 통과(exit 0)하되 로그에 표시.

### P6.4 클로 작업 규칙

- 문서/구조/상태 변경 커밋 **전** 로컬 가드를 실행하고, 완료 보고 검증에 결과를 포함한다(P3.4 Self Validation 연계).

### P6.5 항목·센티넬 추가 절차

- 새 센티넬·검사 항목이 필요하면 먼저 본 절에 근거를 남긴 뒤 `docs-guard.config.json` 에 추가한다([GLOBAL.md §8](GLOBAL.md)).

---

_Common Brain OS v1.0 · cozybuilder-ops_
