# MULTI_DEVICE_GIT_SYNC — 다중 개발 장비 Git 동기화 기준

> **Common Brain OS v2.0 문서 구조** · 절차 확정 2026-07-21
> Windows PC와 MacBook 등 여러 장비에서 동일 프로젝트를 수정할 때 적용하는 필수 기준.
> GitHub 원격 저장소를 장비 간 소스 동기화의 기준으로 사용한다.

---

## 1. 절대 원칙

- 한 프로젝트의 동일 브랜치를 여러 장비에서 동시에 수정하지 않는다.
- 다른 장비에서 작업을 시작하기 전에 반드시 현재 장비의 변경 상태와 원격 최신 상태를 확인한다.
- 이전 장비의 작업은 반드시 `commit → push`까지 완료한 뒤 다음 장비로 전환한다.
- 다음 장비는 반드시 `git status`로 로컬 변경이 없음을 확인하고 `git pull`을 완료한 뒤 소스를 수정한다.
- `pull`하지 않은 오래된 소스에서 수정·commit·push하지 않는다.
- 로컬 파일 복사, 메신저 전송, USB 복사로 두 장비의 소스를 합치지 않는다. 소스 이동은 GitHub를 통해서만 한다.

---

## 2. 장비 전환 표준 절차

### 2.1 현재 작업 장비

```bash
git status
# 필요한 검증 실행
git add <변경 파일>
git commit -m "<type>: <요약>"
git push
```

- `git status`에 미커밋 변경이 남은 상태로 다른 장비에서 같은 프로젝트 작업을 시작하지 않는다.
- push 완료와 원격 반영을 확인한다.

### 2.2 다음 작업 장비

```bash
git status
git pull --ff-only
```

- `git status`가 clean이 아니면 pull보다 먼저 로컬 변경의 출처와 필요성을 확인한다.
- `git pull --ff-only`가 실패하면 임의 merge·rebase·강제 push를 하지 않고 작업을 중단해 충돌 원인을 확인한다.
- pull 성공 후 현재 HEAD가 원격 브랜치와 일치하는지 확인하고 작업한다.

---

## 3. 동시 작업 예외

- 동시 작업이 반드시 필요할 때만 장비별 별도 브랜치를 사용한다.
- 별도 브랜치 생성과 병합 범위는 코지 승인 후 진행한다.
- 같은 파일을 두 장비에서 동시에 수정하는 작업은 가급적 분리하지 않는다.
- 병합 전 각 브랜치의 검증 결과를 확인한다.

---

## 4. 금지 사항

- pull 없이 오래된 로컬 소스 수정
- 미커밋 변경을 남겨둔 채 다른 장비에서 같은 브랜치 작업
- `git push --force` 또는 `git push -f`
- 충돌 내용을 이해하지 않은 상태에서 자동 선택으로 덮어쓰기
- 원격 최신 변경을 삭제하는 reset·checkout·파일 덮어쓰기
- `.env`, keystore, 인증서, 비밀번호 등 미추적 환경 파일을 Git에 추가

---

## 5. CozyBuilder 기본 운영 방식

- MacBook: iOS/Xcode 빌드·App Store 배포 및 이동형 메인 개발
- Windows PC: Android 빌드·보조 개발 및 기존 로컬 프로젝트 유지
- 두 장비 모두 같은 GitHub 저장소를 사용한다.
- 한 시점에는 한 장비만 해당 프로젝트의 기본 브랜치를 수정한다.
- 작업 장비를 바꿀 때마다 `이전 장비 commit·push 완료 → 다음 장비 clean 확인·pull 완료` 순서를 지킨다.

---

_Common Brain OS v2.0 문서 구조 · cozybuilder-ops · docs/operations_
