# DOCUMENTATION_MAINTENANCE — 문서 변경·가드·자동화

> 읽는 시점: 문서 구조 변경, 자동 문서수정, 가드 규칙 변경.
> 분류 기준: [DOCUMENTATION_POLICY.md](../governance/DOCUMENTATION_POLICY.md).

## 1. 변경 전

1. 기록할 정보 유형과 단독 소유 문서를 정한다.
2. 다른 활성 문서의 중복을 검색한다.
3. 현재 문서를 축소할 경우 원문 commit/blob과 미해결 항목을 확인한다.
4. 자동수정 범위 변경은 코지 승인을 먼저 받는다.

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

## 5. 구조 변경 완료조건

- 이전 정보의 새 소유 위치 또는 Git 복구 근거가 있음
- 현재 문서에 과거 상세가 남지 않음
- 링크와 포인터가 유효함
- 기본 컨텍스트 예산 통과
- 가드와 auto-docs dry-run 통과
- 변경 매핑과 기준 commit을 `docs/history/`에 기록
