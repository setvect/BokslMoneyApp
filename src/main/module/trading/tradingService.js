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
      await this.revertStock(item);
      await saveItem.update(item);
    });

    // ================ 삭제 ================
    ipcMain.handle("trading/deleteItem", async(event, tradingSeq) => {
      const item = await trading.findByPk(tradingSeq);
      await this.revertStock(item);
      await item.destroy();
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
      // raw: true,
      nest: true,
    };
    if (param.returnCount) {
      condition.limit = param.returnCount;
    }
    const result = await trading.findAll(condition);
    // raw를 false로 하고 이렇게 해야 date 타입 값이 moment에 문제 없이 처리 된다.
    const rtnValue = result.map(record => record.get({
      plain: true,
    }));
    return rtnValue;
  },
  async revertStock(trading) {
    console.log("revertStock - trading :>> ", trading);
    let money = trading.money;
    if (trading.kind == "BUYING") {
      // await this.subStock(trading.receiveAccount, money);
    } else if (trading.kind == "SELL") {
      // await this.addStock(trading.payAccount, money);
    }
  },
  async addStock(tradingSeq, money) {
    let acc = await trading.findByPk(tradingSeq);
    // acc.balance = acc.balance + money;
    // await acc.save();
  },
  async subStock(tradingSeq, money) {
    let acc = await trading.findByPk(tradingSeq);
    // acc.balance = acc.balance - money;
    // await acc.save();
  },
};