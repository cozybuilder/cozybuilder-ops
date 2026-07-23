# KNOWN_CONFLICTS — 미해결 기준 충돌

> 역할: 두 활성 기준이 직접 충돌할 때 임의 해석을 막는 중단 게이트.
> 이 문서는 어느 정책을 채택할지 결정하지 않는다.

## 처리 원칙

- 충돌이 등록된 주제는 코지의 명시적 결정 전까지 구현·이전·정책 변경을 멈춘다.
- 문서 작성일이나 commit 시점이 더 늦다는 이유만으로 자동 승격하지 않는다.
- 결정 후 ADR에 근거와 대체 관계를 남기고, 대체된 문서는 archive로 이동한다.

## C-001. 프로그램 통합 방식

충돌 문서:

- [PROGRAM_INTEGRATION.md](../architecture/PROGRAM_INTEGRATION.md)
- [HOMEPAGE_PROGRAM_OPERATING_MODEL.md](../architecture/HOMEPAGE_PROGRAM_OPERATING_MODEL.md)

직접 충돌:

- 전자는 모든 정식 프로그램의 독립 저장소·독립 배포·웹 Launch Token 구조를 기본으로 한다.
- 후자는 무료·소형 프로그램을 Homepage 귀속형 A형으로 둘 수 있다고 규정한다.
- 결제·구독 소유, Desktop/Mobile 예외, 기존 프로그램 이전 범위도 하나로 확정되지 않았다.

현재 판정: **BLOCKED — 어느 한 문서를 현행 최종 정책으로 선택하지 않는다.**

필요 결정:

1. A형 Homepage 귀속을 허용할지
2. B형과 Mobile/Desktop 제품의 로그인·결제·실행 경계
3. 기존 프로그램과 신규 프로그램의 적용 시점
