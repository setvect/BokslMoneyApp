import {
  ipcMain
} from "electron";
import trading from "../../model/trading-vo.js";

export default {
  init() {
    // ================ 조회 ================
    // 계좌 목록
    ipcMain.handle("trading/listItem", async(event, accountSeq) => {
      return await this.listStock(accountSeq);
    });

    // ================ 등록 ================
    // 계좌에 대한 계좌 항목 목록

    ipcMain.handle("trading/addItem", async(event, item) => {
      item.deleteF = false;
      const instance = await trading.create(item);
      return instance;
    });

    // ================ 수정 ================
    // 정보 수정
    ipcMain.handle("trading/editItem", async(event, item) => {
      const saveItem = await trading.findByPk(item.tradingSeq);
      await saveItem.update(item);
    });

    // ================ 삭제 ================
    ipcMain.handle("trading/deleteItem", async(event, tradingSeq) => {
      const saveItem = await trading.findByPk(tradingSeq);
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

    const result = await trading.findAll({
      where,
      order: ["name"],
      raw: true,
    });

    return result;
  },
};