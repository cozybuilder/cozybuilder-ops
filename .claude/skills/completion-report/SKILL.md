---
name: completion-report
description: CozyBuilder 프로젝트의 완료·분석·진행 보고를 PLAYBOOK P3 형식(Output Contract)으로 작성한다. 작업을 마치고 코지/코비에게 보고할 때, 완료 보고·분석 보고·진행 보고를 요청받았을 때 사용한다. Use when writing a completion/analysis/progress report for any CozyBuilder project.
---

# completion-report — CozyBuilder 완료 보고 Skill

모든 CozyBuilder 프로젝트의 완료·분석·진행 보고에 공통 적용한다.

## SSOT

- 보고 형식의 단일 소유 문서는 `C:\projects\cozybuilder-ops\PLAYBOOK.md` §P3이다.
- 보고 작성 전 반드시 PLAYBOOK §P3.3(템플릿)과 §P3.4(Output Contract)를 실제 파일로 읽는다.
- 아래 체크리스트와 PLAYBOOK이 충돌하면 **항상 PLAYBOOK이 우선**한다. 이 Skill은 절차 안내일 뿐 형식을 소유하지 않는다.

## 절차

1. **작업 위치 가드**: 작업 위치가 지시서의 지정 Repository와 다르면 다른 작업을 멈추고
   `작업 폴더가 잘못되었습니다`만 보고한다. 다른 프로젝트의 내용을 보고에 혼입하지 않는다.
2. **마무리 순서 확인** (P3.1): STATUS 갱신(해당 시) → commit → push.
   코드 변경이 있으면 그 프로젝트 STATUS.md 갱신 없이 commit/push 하지 않는다(P2).
   원격 미연결이면 `원격 미연결 — push 보류`로 보고에 명시한다.
3. **문서 가드** (P6.4): 문서·구조·상태 변경 커밋 전 로컬 docs-guard를 실행하고
   그 결과를 보고의 `■ 검증`에 포함한다(가드 config가 없는 저장소는 그 사실을 명시).
4. **PLAYBOOK §P3.3 템플릿을 읽고** 보고를 작성한다.
5. **보고 전 자기검증** 후 출력한다. 출력 규칙을 추가·수정한 작업이라면 **그 보고 자체가
   새 규칙을 만족해야 하며**, 미충족 시 수정된 형식으로 즉시 재작성한다(P3.4.6).

## 작성 체크리스트 (P3.4 요약 — 상세는 PLAYBOOK)

- [ ] 보고 전체를 **하나의 ` ```text ` 코드블록** 안에 작성 (평문 보고 금지)
- [ ] 헤더: `클로 → [코지/코비] 완료 보고` — 수신자는 지시를 내린 사람
- [ ] 구조: 작업명 / 진행 방식 / 변경 파일 / 적용 원칙 / 검증 / Self Validation / commit·push / 다음 액션
- [ ] commit / push 결과 명시 (성공 해시 / 실패 원인 / 보류 사유 중 하나)
- [ ] STATUS.md 갱신 여부 명시 (`반영 완료` 또는 `갱신 불필요 — <사유>`)
- [ ] 코드블록 밖 평문 출력 없음
- [ ] 질문·승인 요청도 동일 코드블록 안에 포함
- [ ] 코지 승인이 필요한 요청은 `🔴 [코지 승인 요청] 🔴` 표시 사용 (P7.5)
- [ ] 문서·구조 변경 작업이면 docs-guard 실행 결과를 `■ 검증`에 포함 (P6.4)
- [ ] Self Validation 5문항 포함 (아래)
- [ ] 분석·진행 보고에도 동일 형식 적용

## Self Validation (5문항)

보고 말미에 아래 5문항을 ✅ / ❌ 로 답한다.
1~3은 PLAYBOOK P3.4.6이 소유한 기본 문항이고, 4~5는 누락 빈도가 높은 Output Contract
항목(P3.4 4항·9항)을 재점검하는 본 Skill의 보강 문항이다.

```
■ Self Validation
- 본 보고가 현재 Output Contract(P3.4)를 만족하는가? ✅ / ❌
- 코드블록 밖 평문 출력이 없는가? ✅ / ❌
- 질문/승인 요청이 동일 코드블록 안에 있는가? (해당 시) ✅ / ❌
- commit / push 결과(성공 해시 / 실패 원인 / 보류 사유)가 명시되어 있는가? ✅ / ❌
- STATUS.md 갱신 여부(반영 완료 / 갱신 불필요—사유)가 명시되어 있는가? ✅ / ❌
```

## 보고 품질 원칙

- 확인된 사실 / 추정 / 제안 / 미확정을 구분해 적는다.
- 검증은 인상이 아니라 git 산출물·명령 실측 근거로 적는다(P8).
- 숫자를 근거 없이 확정하지 않는다.
