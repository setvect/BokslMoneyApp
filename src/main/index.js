import { app } from "electron";
import menu from "./menu.js";

import loginService from "./module/login/loginService.js";
import codeService from "./module/code/codeService.js";
import accountService from "./module/account/accountService.js";
import categoryService from "./module/category/categoryService.js";
import transactionService from "./module/transaction/transactionService.js";
import oftenUsedService from "./module/oftenUsed/oftenUsedService.js";
import settlement from "./module/settlement/settlementService.js";
import memoService from "./module/memo/memoService.js";
import userService from "./module/user/userService.js";
import util from "./util.js";
import userVo from "./model/user-vo.js";
import accountVo from "./model/account-vo.js";
import categoryVo from "./model/category-vo.js";
import oftenUsedVo from "./model/oftenUsed-vo.js";
import memoVo from "./model/memo-vo.js";
import transactionVo from "./model/transaction-vo.js";
import codeMainVo from "./model/codeMain-vo.js";
import codeItemVo from "./model/codeItem-vo.js";
import constant from "./constant.js";

// 0. 디렉토리 생성
util.makeDir("./db");

// 1. 윈도우 메뉴 초기화
menu.init();

// 2. DB 초기화
userVo
  .sync()
  .then(() => {
    return userVo.findAll();
  })
  .then((users) => {
    if (users.length !== 0) {
      return null;
    }
    const hash = util.encodeBcrypt("1234");
    // 기본 사용자 등록
    return userVo.create({
      userId: constant.USER_ID,
      name: "복슬이",
      password: hash,
      deleteF: false,
    });
  })
  .catch(util.errorLog);

accountVo.sync().then(() => console.log("account .."));
categoryVo.sync().then(() => console.log("category .."));
oftenUsedVo.sync().then(() => console.log("oftenUsed .."));
memoVo.sync().then(() => console.log("memo .."));
transactionVo.sync().then(() => console.log("transaction .."));
codeMainVo
  .sync()
  .then(() => {
    return codeMainVo.findAll();
  })
  .then((codeMain) => {
    if (codeMain.length !== 0) {
      return null;
    }
    // 기본 코드
    return codeMainVo.bulkCreate([
      {
        codeMainId: "KIND_CODE",
        name: "자산유형",
        deleteF: false,
      },
      {
        codeMainId: "ATTR_SPENDING",
        name: "지출속성",
        deleteF: false,
      },
      {
        codeMainId: "ATTR_TRANSFER",
        name: "이체속성",
        deleteF: false,
      },
      {
        codeMainId: "ATTR_INCOME",
        name: "수입속성",
        deleteF: false,
      }
    ]);
  })
  .then(() => console.log("codeMain .."));
codeItemVo.sync().then(() => console.log("codeItem .."));

// event init
loginService.init();
userService.init();
codeService.init();
accountService.init();
categoryService.init();
transactionService.init();
oftenUsedService.init();
settlement.init();
memoService.init();

app.on("ready", () => {
  util.newInstanceWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
