import {
  ipcMain
} from "electron";
import transactionService from "../transaction/transactionService.js";
import accountService from "../account/accountService.js";

import moment from "moment";
import _ from "lodash";
import {
  Op,
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
      console.log("records :>> ", records);
      let allAcount = await accountService.listAccount();
      const totalSum = _.sumBy(allAcount, "balance");
      return [];
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
};