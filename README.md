# 복슬머니

가계부 프로그램

#### Build Setup

``` bash
# install dependencies
npm install

# 프로그램 실행
npm run postinstall # 최초 한번
npm run start


# 인스톨 파일 만들기(최초 한번)
Start-Process powershell -Verb runAs
npm --add-python-to-path='true' --debug install --global windows-build-tools

#./dise/ 폴더에 실행파일 만들어짐.
npm run build

```

---
