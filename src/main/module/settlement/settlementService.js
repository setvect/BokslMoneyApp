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

    ipcMain.handle("settlement/statAssets", async(event, condition) => {
      const fromDate = (moment([condition.fromYear, 0, 1])).toDate();
      const records = await connSeque.query(`
        SELECT STRFTIME('%Y-%m', TRANSACTION_DATE) AS DATE, KIND, SUM(MONEY) AS MONEY
        FROM BE_TRANSACTION
        WHERE TRANSACTION_DATE >= :fromDate
        GROUP BY STRFTIME('%Y-%m', TRANSACTION_DATE), KIND
        ORDER BY 1, 2
      `,
      {
        replacements: { fromDate: fromDate, },
        type: QueryTypes.SELECT,
      });
      let dateByGroup = _.groupBy(records, "DATE");

      let sumOfMonth = _.map(dateByGroup, (value, key)=>{
        let monthType = _.chain(value)
          .keyBy("kind")
          .mapValues("MONEY")
          .value();
        let profit = monthType["INCOME"] - monthType["SPENDING"];

        return { "DATE": new Date(key + "-01").getTime(), profit, };
      });

      let allAcount = await accountService.listAccount();
      const totalAssets = _.sumBy(allAcount, "balance");

      let rangeSum = _.sumBy(sumOfMonth, "profit");

      let result = _.chain(sumOfMonth).keyBy("DATE").mapValues((v)=>{
        rangeSum -= v.profit;
        let diff = totalAssets - rangeSum;
        return diff;
      }).value();

      return result;
    });
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