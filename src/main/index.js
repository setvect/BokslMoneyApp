import {
  app
} from "electron";
import menu from "./menu.js";
import log4js from "log4js";

import loginService from "./module/login/loginService.js";
import codeService from "./module/code/codeService.js";
import accountService from "./module/account/accountService.js";
import categoryService from "./module/category/categoryService.js";
import transactionService from "./module/transaction/transactionService.js";
import oftenUsedService from "./module/oftenUsed/oftenUsedService.js";
import settlement from "./module/settlement/settlementService.js";
import memoService from "./module/memo/memoService.js";
import userService from "./module/user/userService.js";
import stockService from "./module/stock/stockService.js";

import util from "./util.js";
import userVo from "./model/user-vo.js";
import accountVo from "./model/account-vo.js";
import categoryVo from "./model/category-vo.js";
import oftenUsedVo from "./model/oftenUsed-vo.js";
import memoVo from "./model/memo-vo.js";
import transactionVo from "./model/transaction-vo.js";
import codeMainVo from "./model/codeMain-vo.js";
import codeItemVo from "./model/codeItem-vo.js";
import stockVo from "./model/stock-vo.js";
import constant from "./constant.js";

import initDataSet from "./initDataSet.js";
import tradingVo from "./model/trading-vo.js";

log4js.configure({
  appenders: {
    boksl: {
      type: "file",
      filename: "./logs/bokslMoney.log",
    },
  },
  categories: {
    default: {
      appenders: ["boksl"],
      level: "info",
    },
  },
});

// 0. 디렉토리 생성
util.makeDir("./db");

// 1. 윈도우 메뉴 초기화
menu.init();

app.on("ready", async() => {
  await init();
  util.newInstanceWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/**
 * DB 초기화
 */
async function init() {
  await userVo.sync();
  let users = await userVo.findAll();
  if (users.length == 0) {
    const hash = util.encodeBcrypt("boksl");
    // 기본 사용자 등록
    userVo.create({
      userId: constant.USER_ID,
      name: "복슬이",
      password: hash,
      deleteF: false,
    });
  }

  await codeMainVo.sync();
  let codeMain = await codeMainVo.findAll();
  if (codeMain.length == 0) {
    await codeMainVo.bulkCreate(initDataSet.codeMain);
  }

  await codeItemVo.sync();
  let codeItem = await codeItemVo.findAll();
  if (codeItem.length == 0) {
    await codeItemVo.bulkCreate(initDataSet.codeItem);
  }

  await categoryVo.sync();
  let category = await categoryVo.findAll();

  if (category.length == 0) {
    categoryVo.bulkCreate(initDataSet.category);
  }

  await accountVo.sync();
  let account = await accountVo.findAll();
  if (account.length == 0) {
    accountVo.bulkCreate(initDataSet.account);
  }

  await oftenUsedVo.sync();
  await memoVo.sync();
  await transactionVo.sync();
  await stockVo.sync();
  await tradingVo.sync();

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
  stockService.init();
}