import {
  ipcMain
} from "electron";
import {
  Op
} from "sequelize";
import trading from "../../model/trading-vo.js";

export default {
  init() {
    // ================ 조회 ================
    // 계좌 목록
    ipcMain.handle("trading/listItem", async(event, param) => {
      return await this.list(param);
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
  async list(param) {
    const where = {};
    if (param.from && param.to) {
      where["tradingDate"] = {
        [Op.between]: [param.from, param.to],
      };
    }
    if (param.note) {
      where["note"] = {
        [Op.like]: `%${param.note}%`,
      };
    }

    let condition = {
      where,
      raw: true,
      nest: true,
    };
    if (param.returnCount) {
      condition.limit = param.returnCount;
    }
    const result = await trading.findAll(condition);
    return result;
  },
};