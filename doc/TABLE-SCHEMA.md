# 복슬머니 - 테이블 설계

## 회원관리

- AA_USER: 회원

| Column Name | Attribute Name | Key | Type    | Len | Not Null | Description |
| ----------- | -------------- | --- | ------- | --- | -------- | ----------- |
| USER_ID     | 아아디         | PK  | varchar | 20  | N        |
| NAME        | 이름           |     | varchar | 50  | N        |
| PASSWD      | 비밀번호       |     | varchar | 60  | N        |
| DELETE_F    | 삭제 여부      |     | char    | 1   | N        | Y, N        |

## 가계부

- BA_ACCOUNT: 계좌정보

| Column Name    | Attribute Name | Key | Type    | Len  | Not Null | Description                                                                 |
| -------------- | -------------- | --- | ------- | ---- | -------- | --------------------------------------------------------------------------- |
| ACCOUNT_SEQ    | 계좌\_일련번호 | PK  | integer |      | Y        |
| NAME           | 이름           |     | varchar | 100  | Y        |
| ACCOUNT_NUMBER | 계좌번호       |     | varchar | 100  |
| KIND_CODE      | 자산종류       |     | integer |      | Y        | CB_CODE_ITEM.CODE_ITEM_SEQ><br>코드 값 KIND_CODE<br>신용카드, 통장, 지갑 등 |
| BALANCE        | 잔고           |     | integer |      | Y        |
| INTEREST_RATE  | 이율           |     | varchar | 100  |
| TERM           | 계약기간       |     | varchar | 100  |
| EXP_DATE       | 만기일         |     | varchar | 100  |
| MONTHLY_PAY    | 월 납입액      |     | varchar | 100  |
| TRANSFER_DATE  | 이체일         |     | varchar | 100  |
| NOTE           | 메모 내용      |     | varchar | 1000 |
| STOCK_F        | 주식 게좌 여부 |     | varchar | 1    | Y        |
| DELETE_F       | 삭제 여부      |     | varchar | 1    | Y        |

- BB_CATEGORY: 거래 분류

| Column Name  | Attribute Name   | Key | Type    | Len | Not Null | Description                 |
| ------------ | ---------------- | --- | ------- | --- | -------- | --------------------------- |
| CATEGORY_SEQ | 아이템 일련번호  | PK  | integer |     | Y        |
| KIND         | 유형             |     | varchar | 20  | Y        | INCOME, SPENDING, TRANSFER  |
| NAME         | 항목이름         |     | varchar | 100 | Y        |
| PARENT_SEQ   | 부모항목 번호    |     | integer |     |          | 최대 2단계로만 함 기본값: 0 |
| ORDER_NO     | 항목내 정렬 순서 |     | integer |     | Y        |
| DELETE_F     | 삭제 여부        |     | varchar | 1   | Y        |

- BC_OFTEN_USED: 자주 쓰는 항목

| Column Name     | Attribute Name          | Key | Type    | Len | Not Null | Description                                                                                                                                                                |
| --------------- | ----------------------- | --- | ------- | --- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OFTEN_USED_SEQ  | 자주 쓰는 항목 일련번호 | PK  | integer |     | Y        |
| CATEGORY_SEQ    | 항목 일련번호           | FK  | integer |     | Y        | BB_CATEGORY 외래키                                                                                                                                                         |
| KIND            | 유형                    |     | varchar | 20  | Y        | INCOME, SPENDING, TRANSFER                                                                                                                                                 |
| TITLE           | 거래 제목               |     | varchar | 200 | Y        |
| PAY_ACCOUNT     | 출금계좌                |     | integer |     |          | BA_ACCOUNT 논리적 외래키                                                                                                                                                   |
| RECEIVE_ACCOUNT | 입금계좌                |     | integer |     |          | BA_ACCOUNT 논리적 외래키                                                                                                                                                   |
| MONEY           | 금액                    |     | integer |     |          |
| NOTE            | 항목 설명               |     | varchar | 200 |          |
| ATTRIBUTE       | 속성                    |     | integer |     |          | CB_CODE_ITEM.CODE_ITEM_SEQ <br/>코드 값 <br/>지출: ATTR_SPENDING 고정지출, 단순지출, <br/>이체: ATTR_TRANSFER 단순이체, 투자이체 <br>수입: ATTR_INCOME 단순 수입,투자 수입 |
| ORDER_NO        | 항목내 정렬 순서        |     | integer |     | Y        |
| DELETE_F        | 삭제 여부               |     | varchar | 1   | Y        |

- BD_MEMO: 메모

| Column Name | Attribute Name | Key | Type    | Len  | Not Null | Description |
| ----------- | -------------- | --- | ------- | ---- | -------- | ----------- |
| MEMO_SEQ    | 메모 일련번호  | PK  | integer |      | Y        |
| NOTE        | 메모 내용      |     | varchar | 1000 | Y        |
| MEMO_DATE   | 메모 일        |     | date    |      | Y        |
| DELETE_F    | 삭제 여부      |     | varchar | 1    | Y        |

- BE_TRANSACTION: 거래 내역

| Column Name      | Attribute Name | Key | Type    | Len | Not Null | Description                                                                                                                                                                |
| ---------------- | -------------- | --- | ------- | --- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TRANSACTION_SEQ  | 내역 일련번호  | PK  | integer |     | Y        |
| CATEGORY_SEQ     | 항목 일련번호  | FK  | integer |     | Y        | BB_CATEGORY 외래키                                                                                                                                                         |
| KIND             | 유형           |     | varchar | 20  | Y        | INCOME, SPENDING, TRANSFER                                                                                                                                                 |
| PAY_ACCOUNT      | 출금계좌       |     | integer |     |          | BA_ACCOUNT 논리적 외래키                                                                                                                                                   |
| RECEIVE_ACCOUNT  | 입금계좌       |     | integer |     |          | BA_ACCOUNT 논리적 외래키                                                                                                                                                   |
| ATTRIBUTE        | 속성           |     | integer |     |          | CB_CODE_ITEM.CODE_ITEM_SEQ <br/>코드 값 <br/>지출: ATTR_SPENDING 고정지출, 단순지출, <br/>이체: ATTR_TRANSFER 단순이체, 투자이체 <br>수입: ATTR_INCOME 단순 수입,투자 수입 |
| MONEY            | 금액           |     | integer |     | Y        |
| TRANSACTION_DATE | 사용일         |     | date    |     | Y        |
| NOTE             | 메모 내용      |     | varchar | 100 | Y        |
| FEE              | 수수료         |     | integer |

## 가계부

- CA_CODE_MAIN: 메인코드

| Column Name  | Attribute Name | Key | Type    | Len | Not Null | Description                                                                                                |
| ------------ | -------------- | --- | ------- | --- | -------- | ---------------------------------------------------------------------------------------------------------- |
| CODE_MAIN_ID | 매인 코드 값   | PK  | varchar | 20  | Y        | 자산유형: KIND_CODE<br/>지출항목: ATTR_SPENDING<br/>이체항목: ATTR_TRANSFER<br/>수입항목: ATTR_INCOME<br/> |
| NAME         | 코드 이름      |     | varchar | 100 | Y        |
| DELETE_F     | 삭제 여부      |     | varchar | 1   | Y        |

- CB_CODE_ITEM: 코드 항목값

| Column Name   | Attribute Name               | Key   | Type    | Len | Not Null | Description                    |
| ------------- | ---------------------------- | ----- | ------- | --- | -------- | ------------------------------ |
| CODE_MAIN_ID  | 매인 코드 값                 | PK,FK | varchar | 20  | Y        | CA_CODE_MAIN 외래키            |
| CODE_ITEM_SEQ | 메인코드 종속 일련번호       | PK    | integer |     | Y        | 다른 테이블에서 값으로 사용됨. |
| NAME          | 코드 이름                    |       | varchar | 100 | Y        | 한글로된 설명                  |
| ORDER_NO      | 메인 코드 내 항목들간의 순서 |       | integer |     | Y        |
| DELETE_F      | 삭제 여부                    |       | varchar | 1   | Y        |

## stock

- DA_STOCK: 주식

| Column Name     | Attribute Name | Key | Type    | Len  | Not Null | Description       |
| --------------- | -------------- | --- | ------- | ---- | -------- | ----------------- |
| STOCK_SEQ       | 일련번호       | PK  | integer |      | Y        |
| ACCOUNT_SEQ     | 연결 계좌      | FK  | integer |      | Y        | BA_ACCOUNT 외래키 |
| NAME            | 이름           |     | varchar | 100  | Y        |
| QUANTITY        | 수량           |     | integer |      | Y        |
| PURCHASE_AMOUNT | 구매금액       |     | integer |      | Y        |
| LINK            | 상세정보 링크  |     | varchar | 200  |
| NOTE            | 메모 내용      |     | varchar | 1000 |
| DELETE_F        | 삭제 여부      |     | varchar | 1    | Y        |

- DB_TRADING: 매매

| Column Name  | Attribute Name | Key | Type    | Len | Not Null | Description     |
| ------------ | -------------- | --- | ------- | --- | -------- | --------------- |
| TRADING_SEQ  | 일련번호       | PK  | integer |     | Y        |
| STOCK_SEQ    | 관련 주식      | FK  | integer |     | Y        | DA_STOCK 외래키 |
| NOTE         | 메모 내용      |     | varchar | 100 | Y        |
| KIND         | 유형           |     | varchar | 20  | Y        | BUYING, SELL    |
| TRADING_DATE | 매매일         |     | date    |     | Y        |
| PRICE        | 가격           |     | integer |     | Y        |
| QUANTITY     | 수량           |     | integer |     | Y        |
| TAX          | 세금           |     | integer |     | Y        |
| FEES         | 수수료         |     | integer |     | Y        |
