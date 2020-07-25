# 복슬포털 - TODO

### 메모

### 진행예정
- NEW-20200721: 데이터가 아무것도 없는 경우 초기데이터 입력

- NEW-20200712: 매뉴 구조 표시 되게(상단 매뉴 사용 안함)
- NEW-20200628: category sequelize의 외래키 설정 이용해 parentCategory 가져오기
- PBM-20200522: 두번 연속 팝업창 오픈하면 팝업창 요소가 클릭안되는 문제 - 발생하는 조건을 모르겠음.
- NEW-20200522: 컴포넌트 옵션 순서 권고사항으로 변경: https://kr.vuejs.org/v2/style-guide/index.html#%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-%EC%9D%B8%EC%8A%A4%ED%84%B4%EC%8A%A4-%EC%98%B5%EC%85%98-%EC%88%9C%EC%84%9C-%EC%B6%94%EC%B2%9C%ED%95%A8
- NEW-20200512: 페이지 전체 최소 넓이 지정
- NEW-20200331: sequelize 외래키

### 완료
- NEW-20200719(20200725): 비밀번호 변경
- NEW-20200725: 새창(새로운 인스턴스)
- NEW-20200512(?): bootstrap3으로 되어 있는 스타일을 bootstrap4로 변경(대규모 작업)
- NEW-20200712(?): 계좌 정보 업데이트 반영하기 - vuex - accountList
- NEW-20200101(20200722): 통계
- NEW-20200101(20200719): 결산
- NEW-20200101(20200719): 가계부 쓰기 - 표
  - 엑셀 내보내기
- REF-20200507(20200718): vue-util.js 사용하는 부분 없애기
- NEW-20200509: 샘플 데이터 입력
  - 마이그레이션으로 대체
- NEW-20200509(20200718): 마이그레이션(BokslMemoy 프로젝트에서 진행했음)
- NEW-20200101(20200712): 로그인
- NEW-20200711: 불필요한 블럭 레이어 표시하지 않기
- NEW-20200706(20200711): TransactionMixin -> mixin 이동
- NEW-20200706(20200711): 매뉴 뎁스 2->1로. 단축키 F1, F2, ... 이런식으로
- NEW-20200101(20200705): 가계부 쓰기 - 달력
- REF-20200522: 글로벌 이벤트 버스 사용하지 않기
- NEW-20200101(20200509): 분류 관리
- NEW-20200412(20200509): vue파일에 포메팅 했을 때 세미콜론; 추가하도록함
- NEW-20200509: 계좌목록 엑셀 다운로드
- NEW-20200505(20200507): 계좌 관리 - 엑셀 다운로드
- NEW-20200101: 계좌 관리
- NEW-20200101(20200504): 코드 관리
- PBM-20200405(20200429): Deprecation warning: value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ... warning 해결
- NEW-20200419: eslint \*.vue 파일에도 작동할 수 있도록
- NEW-20200405(20200419): eslint 셋팅, 사용.
- NEW-20200101(20200411): 기본 화면 구성
- NEW-20200407: 새로고침 단축키 적용
- PBM-20200404: [Vue warn]: \$attrs is readonly 오류 해결. bootstrap-vue 문제로 판단됨.
- NEW-20200329(20200330): 간단한 DB 연동. sqlite3, sequelize
- NEW-20200329(20200330): 필요없는 메뉴 제거
- NEW-20200329: electron-webpack 사용으로 인해 vscode를 사용한 디버깅이 안되는 문제 해결
- NEW-20200329: vue 연동
- NEW-20200329: sqlite3 추가해 빌드
- NEW-20200103: main-process debug 환경 만들기
- NEW-20200103: Banner 교체
- NEW-20200103: ESLINT 최신 버전으로 업데이트
- NEW-20200101: DB 설계

### 못함

### 안함
- PBM-20200706: GMT 계산 오류 확인해보기
  memoService, transactionService
  transaction_date` BETWEEN '2020-06-30 15:00:00.000 +00:00' AND '2020-07-31 14:59:59.999 +00:00';
  -> 범위 연산에서는 문제 없음
- NEW-20200705: AppUtil.getAccountName --> vuex 사용