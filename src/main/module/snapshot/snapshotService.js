import {
  ipcMain
} from "electron";
import snapshot from "../../model/snapshot-vo.js";
import assetGroup from "../../model/assetGroup-vo.js";
import stockEvaluate from "../../model/stockEvaluate-vo.js";
import accountService from "../account/accountService.js";
import codeService from "../code/codeService";

import {
  Sequelize
} from "sequelize";
import _ from "lodash";

export default {
  init() {
    // ================ 조회 ================
    ipcMain.handle("snapshot/listItem", async(event, snapshotSeq) => {
      return await this.listSnapshot(snapshotSeq);
    });

    ipcMain.handle("snapshot/getItem", async(event, snapshotSeq) => {
      const snapshotItem = await snapshot.findByPk(snapshotSeq, {
        include: [{
          model: assetGroup,
        }, {
          model: stockEvaluate,
        }],
      });

      const accountCodeMap = await codeService.getMappingCode("TYPE_ACCOUNT");
      const result = snapshotItem.toJSON();

      result.assetGroups.forEach((account) => {
        account.accountTypeName = accountCodeMap[account.accountType].name;
      });
      return result;
    });

    // ================ 등록 ================
    ipcMain.handle("snapshot/addItem", async(event, item) => {
      item.deleteF = false;
      item.regDate = new Date();
      const snapshotItem = await snapshot.create(item);
      item.snapshotSeq = snapshotItem.snapshotSeq;
      await this.updateStock(item);
    });

    // ================ 수정 ================
    ipcMain.handle("snapshot/editItem", async(event, item) => {
      const saveItem = await snapshot.findByPk(item.snapshotSeq);
      await saveItem.update(item);
      await this.updateStock(item);
    });

    // ================ 삭제 ================
    ipcMain.handle("snapshot/deleteItem", async(event, snapshotSeq) => {
      const saveItem = await snapshot.findByPk(snapshotSeq);
      saveItem.deleteF = true;
      await saveItem.save();
    });
  },
  async listSnapshot() {
    let where = {
      deleteF: false,
    };
    const snapshotList = await snapshot.findAll({
      attributes: [
        "snapshotSeq",
        "note",
        "regDate",
        "deleteF",
        [Sequelize.fn("sum", Sequelize.col("TOTAL_AMOUNT")), "totalAmount"],
        [Sequelize.fn("sum", Sequelize.col("EVALUATE_AMOUNT")), "evaluateAmount"]
      ],
      include: {
        model: assetGroup,
        attributes: [],
      },
      where,
      order: [
        ["snapshotSeq", "DESC"]
      ],
      group: ["snapshotSeq"],
    });
    // 자바스크립트 객체(특히 날짜)를 가져오기 위해 후처리 추가
    const rtnValue = snapshotList.map(record => record.get({
      plain: true,
    }));
    return rtnValue;
  },
  async updateStock(item) {
    await assetGroup.destroy({
      where: {
        snapshotSeq: item.snapshotSeq,
      },
    });
    await stockEvaluate.destroy({
      where: {
        snapshotSeq: item.snapshotSeq,
      },
    });

    const stockEvaluateList = item.stockEvaluateList;
    stockEvaluateList.forEach((s) => {
      s.snapshotSeq = item.snapshotSeq;
    });

    const accountList = await accountService.listAccount();
    const assetGroupItem = _.chain(accountList)
      .groupBy("accountType")
      .map((accountType, id) => ({
        snapshotSeq: item.snapshotSeq,
        accountType: id,
        totalAmount: _.sumBy(accountType, (o) => {
          const purchaseSum = _.chain(stockEvaluateList).filter(s => s.accountSeq === o.accountSeq).sumBy("buyAmount").value();
          return o.balance + purchaseSum;
        }),
        evaluateAmount: _.sumBy(accountType, (o) => {
          const evaluateSum = _.chain(stockEvaluateList).filter(s => s.accountSeq === o.accountSeq).sumBy("evaluateAmount").value();
          return o.balance + evaluateSum;
        }),
      }))
      .value();

    await assetGroup.bulkCreate(assetGroupItem);
    await stockEvaluate.bulkCreate(stockEvaluateList);
  },
};