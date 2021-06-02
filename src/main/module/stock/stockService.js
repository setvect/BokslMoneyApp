import {
  ipcMain
} from "electron";
import stock from "../../model/stock-vo.js";
import codeService from "../code/codeService";

export default {
  init() {
    // ================ 조회 ================
    // 계좌 목록
    ipcMain.handle("stock/listItem", async(event, accountSeq) => {
      return await this.listStock(accountSeq);
    });

    // ================ 등록 ================
    // 계좌에 대한 계좌 항목 목록

    ipcMain.handle("stock/addItem", async(event, item) => {
      item.deleteF = false;
      const instance = await stock.create(item);
      return instance;
    });

    // ================ 수정 ================
    // 정보 수정
    ipcMain.handle("stock/editItem", async(event, item) => {
      const saveItem = await stock.findByPk(item.stockSeq);
      await saveItem.update(item);
    });

    // ================ 삭제 ================
    ipcMain.handle("stock/deleteItem", async(event, stockSeq) => {
      const saveItem = await stock.findByPk(stockSeq);
      saveItem.deleteF = true;
      await saveItem.save();
    });
  },
  /**
   *
   * @param {*} accountSeq 연결계좌
   */
  async listStock(accountSeq) {
    let where = {
      deleteF: false,
    };
    if (accountSeq != null) {
      where = {
        ...where,
        accountSeq,
      };
    }
    const stockList = await stock.findAll({
      where,
      order: ["name"],
      raw: true,
    });

    // 주식 종류
    const stockCodeMap = await codeService.getMappingCode("TYPE_STOCK");
    // 상장 국가
    const nationCodeMap = await codeService.getMappingCode("TYPE_NATION");

    stockList.forEach((stock) => {
      stock.typeName = stockCodeMap[stock.stockType].name;
      stock.nationName = nationCodeMap[stock.nation].name;
    });


    return stockList;
  },
};