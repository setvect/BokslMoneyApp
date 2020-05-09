# 복슬머니

가계부 프로그램

#### Build Setup

```bash
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

## 문제 해결에 도움이 된 사이트

### Vscode 관련

1. Prettier 설정(포맷팅 등) [https://ux.stories.pe.kr/150](https://ux.stories.pe.kr/150)
1. ESLient 설정 [https://eslint.org/docs/rules/](https://eslint.org/docs/rules/)
