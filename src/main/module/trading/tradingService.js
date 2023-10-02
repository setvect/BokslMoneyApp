import {
  ipcMain
} from "electron";
import {
  Op, Sequelize
} from "sequelize";
import trading from "../../model/trading-vo.js";
import stockVo from "../../model/stock-vo.js";
import accountVo from "../../model/account-vo.js";

export default {
  init() {
    // ================ 조회 ================
    ipcMain.handle("trading/listItem", async(event, param) => {
      return await this.list(param);
    });

    ipcMain.handle("trading/getSellGainsSum", async(event, param) => {
      return await this.getSellGainsSum(param);
    });

    // ================ 등록 ================
    ipcMain.handle("trading/addItem", async(event, item) => {
      item.deleteF = false;
      item.sellGains = await this.calcSellGains(item);
      await this.calcStock(item);
      const instance = await trading.create(item);
      return instance;
    });

    // ================ 수정 ================
    ipcMain.handle("trading/editItem", async(event, item) => {
      const saveItem = await trading.findByPk(item.tradingSeq);
      await this.revertStock(saveItem);

      item.sellGains = await this.calcSellGains(item);
      await this.calcStock(item);
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
    if (param.kindTypeSet && param.kindTypeSet.length > 0) {
      where["kind"] = param.kindTypeSet;
    }
    if (param.accountSeq) {
      const subResult = await stockVo.findAll(
        {
          "where":{
            "accountSeq": param.accountSeq,
          },
        }
      );
      const stockSeqList = subResult.map(record => record.get({
        plain: true,
      })["stockSeq"]);
      where["stockSeq"] = stockSeqList;
    }
    let condition = {
      where,
      // raw: true,
      order: ["tradingDate"],
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
  /**
   * @returns 특정 기간 매도 손익(수수료, 세금 포함)
   */
  async getSellGainsSum(param) {
    const where = {
      tradingDate: {
        [Op.between]: [param.from, param.to],
      },
      kind: "SELL",
    };

    let condition = {
      attributes: [
        [Sequelize.fn("sum", Sequelize.col("sell_gains")), "totalSellGains"],
        [Sequelize.fn("sum", Sequelize.col("tax")), "totalTax"],
        [Sequelize.fn("sum", Sequelize.col("fee")), "totalFee"]
      ],
      where,
      // raw: true,
      nest: true,
    };

    const result = await trading.findAll(condition);
    // raw를 false로 하고 이렇게 해야 date 타입 값이 moment에 문제 없이 처리 된다.
    const totalSellGains = result[0].getDataValue("totalSellGains");
    const totalTax = result[0].getDataValue("totalTax");
    const totalFee = result[0].getDataValue("totalFee");

    const rtnValue = (totalSellGains || 0) - (totalTax || 0) - (totalFee || 0);
    return rtnValue;
  },

  /**
   * 주식 매매를 정보를 통해 주식 거래 계좌, 주식 잔고 계산
   * @param {*} tradingItem 거래 내역
   */
  async calcStock(tradingItem) {
    let stockItem = await stockVo.findByPk(tradingItem.stockSeq);
    let acc = await accountVo.findByPk(stockItem.accountSeq);
    let money = tradingItem.price * tradingItem.quantity;

    if (tradingItem.kind == "BUYING") {
      acc.balance = acc.balance - money - tradingItem.tax - tradingItem.fee;
      stockItem.quantity += tradingItem.quantity;
      stockItem.purchaseAmount += tradingItem.price * tradingItem.quantity;
    } else if (tradingItem.kind == "SELL") {
      acc.balance = acc.balance + money - tradingItem.tax - tradingItem.fee;
      let avg = this.getAvgRatio(stockItem);
      stockItem.quantity -= tradingItem.quantity;
      // 평단가에서 주식 수량 빼기
      stockItem.purchaseAmount -= avg * tradingItem.quantity;
    }

    await acc.save();
    await stockItem.save();
  },
  /**
   * 주식 거래 계좌, 주식 잔고 거래 이전 상태로 돌려 놓기
   * @param {*} tradingItem
   */
  async revertStock(tradingItem) {
    let stockItem = await stockVo.findByPk(tradingItem.stockSeq);
    let acc = await accountVo.findByPk(stockItem.accountSeq);
    let money = tradingItem.price * tradingItem.quantity;

    if (tradingItem.kind == "BUYING") {
      acc.balance = acc.balance + money + tradingItem.tax + tradingItem.fee;
      stockItem.quantity -= tradingItem.quantity;
      stockItem.purchaseAmount -= tradingItem.price * tradingItem.quantity;
    } else if (tradingItem.kind == "SELL") {
      acc.balance = acc.balance - money + tradingItem.tax + tradingItem.fee;
      stockItem.quantity += tradingItem.quantity;
      // 매도 차익을 기준으로 평단가 계산
      let sellMoney = tradingItem.price * tradingItem.quantity - tradingItem.sellGains;
      let avg = Math.round(sellMoney / tradingItem.quantity);
      stockItem.purchaseAmount += avg * tradingItem.quantity;
    }

    await acc.save();
    await stockItem.save();
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
    let avg = this.getAvgRatio(stockItem);

    let total = tradingItem.price * tradingItem.quantity;
    // 매도 차익
    return total - (avg * tradingItem.quantity);
  },
  getAvgRatio(stockItem) {
    if(stockItem.quantity == 0) {
      return 0;
    }
    return Math.round(stockItem.purchaseAmount / stockItem.quantity);
  },
};