# DOCUMENTATION_MAINTENANCE — 문서 변경·가드·자동화

> 읽는 시점: 문서 구조 변경, 자동 문서수정, 가드 규칙 변경.
> 분류 기준: [DOCUMENTATION_POLICY.md](../governance/DOCUMENTATION_POLICY.md).

## 1. 변경 전

1. 기록할 정보 유형과 단독 소유 문서를 정한다.
2. 다른 활성 문서의 중복을 검색한다.
3. 현재 문서를 축소할 경우 원문 commit/blob과 미해결 항목을 확인한다.
4. 자동수정 범위 변경은 코지 승인을 먼저 받는다.

### 1.1 최종 Git 사실 확인 (재발방지 1차 — 2026-07-29)

제품 코드 커밋을 모두 끝낸 뒤, **그 최종 상태에서** 문서를 작성한다. 중간 단계 기준으로
먼저 쓰고 나중에 맞추지 않는다.

- SHA·versionCode·versionName·BUILD_HEAD·배포 여부·후보 상태는 지시서나 직전
  완료보고에서 복사하지 않는다 — Git·Gradle·산출물·배포 증거에서 다시 추출한다.
- 문서 교정으로 제품 코드가 추가 변경되면 제품 기준 HEAD도 다시 계산한다.
- 프로젝트 전용 의미 검증기가 있으면 필수 실행한다(예: cozyrent
  `node scripts/verify-release-state.mjs`).
- **검증 결과가 실제 문서 값과 일치하지 않으면 commit·push·완료 보고를 하지 않는다.**

반복 오류 판단 기준은 [AI_COLLABORATION.md §7](AI_COLLABORATION.md)이 소유한다.

## 2. 문서 가드

```bash
node scripts/verify-docs-guard.mjs
```

가드는 다음을 fail-closed로 검사한다.

- 필수 문서·템플릿 존재
- 상대 링크 무결성
- PROJECTS 표·STATUS 포인터 문법
- 기본 필독 문서 순서·개별/합계 크기
- 헌법·라우터·등록부의 허용 섹션과 금지 패턴
- `docs/·templates/` 전체의 개별 소유권 Registry·명시적 collection·archive 포함 여부
- archive의 비정본 표시
- 자동수정 승인·설정·마커 연결과 `## Registry` 고정 스키마
- 저장소 밖 경로·dot segment·보호문서 별칭·symbolic link 경로

문서·구조·상태 변경은 commit 전에 가드를 실행하고 결과를 완료 보고에 포함한다.

## 3. 자동수정 권한

- 능력: [`auto-docs.config.json`](../../auto-docs.config.json)
- 승인: [`DOC_APPROVALS.md`](../../DOC_APPROVALS.md)
- `block_id`가 양쪽에 존재하고 승인 상태가 `active`일 때만 실행한다.
- 자동수정은 정확히 한 쌍의 AUTO-DOCS 마커 내부만 허용한다.
- `GLOBAL.md`, `DOC_APPROVALS.md`, 마커 밖 사람 본문은 자동수정 금지다.
- bot commit/push는 별도 승인 전까지 금지한다.

```bash
node scripts/auto-docs.mjs --dry-run
node scripts/auto-docs.mjs --apply
```

`--apply`도 파일만 수정하며 사람이 diff를 검수한 뒤 commit·push한다.

## 4. 자동화 명령어 색인

> 아래 블록은 `auto-docs`가 생성한다. 수동 편집하지 않는다.

<!-- AUTO-DOCS:START:playbook-automation-index -->
**scripts**
- `scripts/auto-docs.mjs`
- `scripts/verify-docs-guard.mjs`

**workflows**
- `.github/workflows/docs-guard.yml`
<!-- AUTO-DOCS:END:playbook-automation-index -->

## 5. 대량 문서 변경

다음 중 하나라도 해당하면 대량 문서 변경으로 본다.

- 파일 3개 이상을 생성·이동·삭제한다.
- 문서 collection 또는 소유권 Registry를 변경한다.
- 다른 저장소로 자료를 이전한다.
- 동일 목적의 변경이 여러 commit으로 나뉠 가능성이 있다.

대량 변경은 아래 순서로만 진행한다.

1. 기본 브랜치에 파일별 commit을 연속 push하지 않는다.
2. 작업 브랜치 하나에서 전체 변경 범위와 삭제 대상을 먼저 확정한다.
3. 이전 대상은 새 위치에서 원격 재조회해 내용과 파일 수를 대조한다.
4. 원본 삭제, Registry·collection 정리, 링크 수정까지 한 논리적 변경으로 묶는다.
5. `verify-docs-guard`, guard 회귀 테스트, `auto-docs --dry-run`을 모두 통과시킨다.
6. Pull Request 한 건으로 검증하고, 성공한 뒤 기본 브랜치에 병합한다.
7. 중간 상태를 기본 브랜치에 push해 동일한 실패 알림을 반복 발생시키지 않는다.

CI가 실패하면 다음 파일을 추가로 수정하기 전에 실패 원인을 먼저 해결한다. 실패한 상태에서 후속 commit을 연속 push하지 않는다.

## 6. 구조 변경 완료조건

- 이전 정보의 새 소유 위치 또는 Git 복구 근거가 있음
- 현재 문서에 과거 상세가 남지 않음
- 링크와 포인터가 유효함
- 기본 컨텍스트 예산 통과
- 가드와 auto-docs dry-run 통과
- 변경 매핑과 기준 commit을 `docs/history/`에 기록
