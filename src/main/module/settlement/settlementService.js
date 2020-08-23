import {
  ipcMain
} from "electron";
import transactionService from "../transaction/transactionService.js";
import tradingService from "../trading/tradingService.js";
import accountService from "../account/accountService.js";

import moment from "moment";
import _ from "lodash";
import {
  QueryTypes
} from "sequelize";

import connSeque from "../../model/connSeque.js";
import stockService from "../stock/stockService.js";

export default {
  init() {
    // ================ 조회 ================
    /**
     * return
     *  key: 상위 카테고리, value: 합산 금액
     */
    ipcMain.handle("settlement/groupOfMonth", async(event, condition) => {
      let param = {};
      param["kindTypeSet"] = [condition.kind];
      param.from = (moment([condition.year, 0, 1])).toDate();
      param.to = moment(param.from).add(1, "year");
      let list = await transactionService.list(param);

      let groupByMonthCategory = _.reduce(list, (result, item) => {
        let month = item.transactionDate.getMonth();
        if (result[month] == null) {
          result[month] = {};
        }
        if (result[month][item.category.parentSeq] == null) {
          result[month][item.category.parentSeq] = 0;
        }
        result[month][item.category.parentSeq] += item.money;
        return result;
      }, {});
      return groupByMonthCategory;
    });

    ipcMain.handle("settlement/groupKindOfMonth", async(event, condition) => {
      let param = {};
      param.from = (moment([condition.year, 0, 1])).toDate();
      param.to = moment(param.from).add(1, "year").toDate();
      const kindOfMonth = await this.getKindOfMonth(param);
      return kindOfMonth;
    });

    // 매수, 매도, 거래세, 수수료, 매도차익을 월별로 합상
    ipcMain.handle("settlement/groupTradingKindOfMonth", async(event, condition) => {
      let param = {};
      param.from = (moment([condition.year, 0, 1])).toDate();
      param.to = moment(param.from).add(1, "year").toDate();
      const groupOfMonthSum = await this.getTradingKindOfMonth(param);
      return groupOfMonthSum;
    });

    /**
     * 시작 년도 부터 현재까지 재산 변화
     */
    ipcMain.handle("settlement/statAssets", async(event, condition) => {
      let transactionSumOfMonth = await this.getTransactionSumOfMonth(condition);
      let tradingSumOfMonth = await this.getTradingSumOfMonth(condition);
      let totalSumOfMonth = [...transactionSumOfMonth, ...tradingSumOfMonth];
      let rangeSum = _.sumBy(totalSumOfMonth, "profit");
      let assetsSumOfMonth = _.chain(totalSumOfMonth).groupBy("DATE").map((objs, keys)=>({
        "DATE": keys,
        "profit": _.sumBy(objs, "profit"),
      })).value();

      let totalProperty = await this.getTotalProperty();
      let result = _.chain(assetsSumOfMonth).keyBy("DATE").mapValues((v) => {
        rangeSum -= v.profit;
        let diff = totalProperty - rangeSum;
        return diff;
      }).value();

      return result;
    });
  },
  /**
   * 월단위 거래(지출, 수입) 금액 합산
   * @param {*} condition
   */
  async getTransactionSumOfMonth(condition) {
    const fromDate = (moment([condition.fromYear, 0, 1])).toDate();
    const records = await connSeque.query(`
      SELECT STRFTIME('%Y-%m', TRANSACTION_DATE) AS DATE, KIND, SUM(MONEY) AS MONEY
      FROM BE_TRANSACTION
      WHERE TRANSACTION_DATE >= :fromDate
      GROUP BY STRFTIME('%Y-%m', TRANSACTION_DATE), KIND
      ORDER BY 1, 2
    `, {
      replacements: {
        fromDate: fromDate,
      },
      type: QueryTypes.SELECT,
    });
    let dateByGroup = _.groupBy(records, "DATE");

    let sumOfMonth = _.map(dateByGroup, (value, key) => {
      let monthType = _.chain(value)
        .keyBy("kind")
        .mapValues("MONEY")
        .value();
      let profit = (monthType["INCOME"] || 0) - (monthType["SPENDING"] || 0);

      return {
        "DATE": new Date(key + "-01").getTime(),
        profit,
      };
    });
    return sumOfMonth;
  },
  /**
   * 주식 거래시 발생한 이익, 손해(세금, 수수료 포함)을 월단위 계산
   * @param {*} condition
   */
  async getTradingSumOfMonth(condition) {
    const fromDate = (moment([condition.fromYear, 0, 1])).toDate();
    let tradingList = await tradingService.list({ from: fromDate, to: moment("210001231", "YYYYMMDD").toDate(), });
    let sumOfMonth = _.chain(tradingList).map((v, key)=>{
      v["TRADING_MONTH"] = moment(v["tradingDate"]).format("YYYY-MM");
      return v;
    }).groupBy("TRADING_MONTH").map((values, key)=>{
      let feeSum = _.chain(values).sumBy("fee").value() || 0;
      let taxSum = _.chain(values).sumBy("tax").value() || 0;
      let sellGainsSum = _.chain(values).sumBy("sellGains").value() || 0;
      let profit = sellGainsSum - feeSum - taxSum;
      return {
        "DATE": new Date(key + "-01").getTime(),
        profit,
      };
    }).value();
    return sumOfMonth;
  },
  /**
   * 전체 재산(계좌 잔고 + 주식 매입 금액)
   */
  async getTotalProperty() {
    // 계좌 잔고 합계
    let allAcount = await accountService.listAccount();
    const totalAccount = _.sumBy(allAcount, "balance");
    // 주식 구매금액
    let allStock = await stockService.listStock();
    const totalStock = _.sumBy(allStock, "purchaseAmount");
    console.log("###################################");
    console.log("totalAccount :>> ", totalAccount, totalStock);
    return totalAccount + totalStock;
  },

  async getKindOfMonth(param) {
    let list = await transactionService.list(param);
    let groupByMonthKind = _.reduce(list, (result, item) => {
      let month = item.transactionDate.getMonth();
      if (result[month] == null) {
        result[month] = {};
      }
      if (result[month][item.kind] == null) {
        result[month][item.kind] = 0;
      }
      result[month][item.kind] += item.money;
      return result;
    }, {});
    return groupByMonthKind;
  },
  /**
   * 주식 거래 매도, 매수 유형별 그룹핑
   * @param {*} param
   */
  async getTradingKindOfMonth(param) {
    let list = await tradingService.list(param);
    let groupByMonthKind = _.reduce(list, (result, item) => {
      let month = item.tradingDate.getMonth();
      if (result[month] == null) {
        result[month] = {};
        result[month]["BUYING"] = 0;
        result[month]["SELL"] = 0;
        result[month]["TAX"] = 0;
        result[month]["FEE"] = 0;
        result[month]["SELL_GAINS"] = 0;
      }

      result[month][item.kind] += item.price * item.quantity;
      result[month]["TAX"] += item.tax;
      result[month]["FEE"] += item.fee;
      result[month]["SELL_GAINS"] += item.sellGains;

      return result;
    }, {});
    return groupByMonthKind;
  },
};