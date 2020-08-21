import {
  ipcMain
} from "electron";
import {
  Op
} from "sequelize";
import trading from "../../model/trading-vo.js";
import stockVo from "../../model/stock-vo.js";
import accountVo from "../../model/account-vo.js";

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
      item.sellGains = await this.calcSellGains(item);
      // TODO 주식 계좌 정보 반영 해야됨
      await this.applyAccount(item);
      const instance = await trading.create(item);
      return instance;
    });

    // ================ 수정 ================
    // 정보 수정
    ipcMain.handle("trading/editItem", async(event, item) => {
      const saveItem = await trading.findByPk(item.tradingSeq);
      await this.revertStock(item);

      item.sellGains = await this.calcSellGains(item);
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
  async applyAccount(tradingItem) {
    console.log("revertStock - trading :>> ", tradingItem);
    let money = tradingItem.price * tradingItem.quantity;
    if (tradingItem.kind == "BUYING") {
      await this.buyingStock(tradingItem);
    } else if (tradingItem.kind == "SELL") {
      await this.sellStock(tradingItem);
    }
  },
  async revertStock(tradingItem) {
    console.log("revertStock - trading :>> ", trading);
    if (tradingItem.kind == "BUYING") {
      await this.buyingStock(tradingItem);
    } else if (tradingItem.kind == "SELL") {
      await this.sellStock(tradingItem);
    }
  },
  async buyingStock(tradingItem) {
    let stockItem = await stockVo.findByPk(tradingItem.stockSeq, {
      raw: true,
    });

    let acc = await accountVo.findByPk(stockItem.accountSeq);
    let money = tradingItem.price * tradingItem.quantity;
    acc.balance = acc.balance - money - tradingItem.tax - tradingItem.fee;
    await acc.save();
  },
  async sellStock(tradingItem) {
    let stockItem = await stockVo.findByPk(tradingItem.stockSeq, {
      raw: true,
    });

    let acc = await accountVo.findByPk(stockItem.accountSeq);
    let money = tradingItem.price * tradingItem.quantity;
    acc.balance = acc.balance + money - tradingItem.tax - tradingItem.fee;
    await acc.save();
  },
  // 매도 차익 계산
  async calcSellGains(tradingItem) {
    // 매도만 매도 차익 계산
    if (tradingItem.kind != "SELL") {
      return 0;
    }

    let stockItem = await stockVo.findByPk(tradingItem.stockSeq, {
      raw: true,
    });
    // 평단가
    let avg = stockItem.purchaseAmount / stockItem.quantity;

    let total = tradingItem.price * tradingItem.quantity;
    // 매도 차익
    return total - (avg * tradingItem.quantity);
  },
};