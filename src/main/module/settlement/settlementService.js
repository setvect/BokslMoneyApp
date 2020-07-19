import {
  ipcMain
} from "electron";
import category from "../../model/category-vo";
import transactionService from "../transaction/transactionService.js";
import moment from "moment";
import _ from "lodash";
import {
  Op
} from "sequelize";

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
      param.to = moment(param.from).add(1, "year") ;
      let list = await transactionService.list(param);

      let groupByMonthCategory = _.reduce(list, (result, item)=>{
        let month = item.transactionDate.getMonth();
        if(result[month] == null) {
          result[month] = {};
        }
        if(result[month][item.category.parentSeq] == null) {
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
      param.to = moment(param.from).add(1, "year") ;
      let list = await transactionService.list(param);

      let groupByMonthKind = _.reduce(list, (result, item)=>{
        let month = item.transactionDate.getMonth();
        if(result[month] == null) {
          result[month] = {};
        }
        if(result[month][item.kind] == null) {
          result[month][item.kind] = 0;
        }
        result[month][item.kind] += item.money;
        return result;
      }, {});
      console.log("groupByMonthKind :>> ", groupByMonthKind);
      return groupByMonthKind;
    });
  },
};