import {
  ipcMain
} from "electron";
import account from "../../model/account-vo";
import codeService from "../code/codeService";
import stockService from "../stock/stockService.js";

export default {
  init() {
    // ================ 조회 ================
    ipcMain.handle("account/listItem", async() => {
      return await this.listAccount();
    });

    // ================ 등록 ================
    ipcMain.handle("account/addItem", async(event, item) => {
      item.deleteF = false;
      const instance = await account.create(item);
      return instance;
    });

    // ================ 수정 ================
    ipcMain.handle("account/editItem", async(event, item) => {
      const saveItem = await account.findByPk(item.accountSeq);
      await saveItem.update(item);
    });

    // ================ 삭제 ================
    ipcMain.handle("account/deleteItem", async(event, accountSeq) => {
      const saveItem = await account.findByPk(accountSeq);
      saveItem.deleteF = true;
      await saveItem.save();
    });
  },
  async listAccount() {
    const accountList = await account.findAll({
      where: {
        deleteF: false,
      },
      order: ["name"],
      raw: true,
    });
    // 자산 종류
    const kindCodeMap = await codeService.getMappingCode("KIND_CODE");
    // 계좌 성격
    const accountCodeMap = await codeService.getMappingCode("TYPE_ACCOUNT");
    // 연결 주식 맵핑
    let stockList = await stockService.listStock();

    accountList.forEach((account) => {
      account.kindName = kindCodeMap[account.kindCode].name;
      account.accountTypeName = accountCodeMap[account.accountType].name;
      account.stockList = stockList.filter(s => s.accountSeq == account.accountSeq);
    });

    return accountList;
  },
};