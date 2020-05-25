import {
  ipcMain
} from "electron";
import transaction from "../../model/transaction-vo.js";
import {
  Op
} from "sequelize";

export default {
  init() {
    // ================ 조회 ================
    // 계좌 목록
    ipcMain.handle("transaction/listItem", async(event, param) => {
      const where = {};
      if (param.from && param.to) {
        where["transactionDate"] = {
          [Op.between]: [param.from, param.to],
        };
      }
      if(param.note) {
        where["note"] = {
          [Op.like]: `%${param.note}%`,
        };
      }
      if(param.categorySeq) {
        where["categorySeq"] = param.categorySeq;
      }

      if(param.accountSeq) {
        where["accountSeq"] = param.accountSeq;
      }

      if(param.kindTypeSet) {
        where["kind"] = param.kindTypeSet;
      }

      const result = await transaction.findAll({
        where,
        raw: true,
      });

      return result;
    });

    // ================ 등록 ================
    // 계좌에 대한 계좌 항목 목록
    ipcMain.handle("transaction/addItem", async(event, item) => {
      item.deleteF = false;
      const instance = await transaction.create(item);
      return instance;
    });

    // ================ 수정 ================
    // 정보 수정
    ipcMain.handle("transaction/editItem", async(event, item) => {
      const saveItem = await transaction.findByPk(item.transactionSeq);
      await saveItem.update(item);
    });

    // ================ 삭제 ================
    ipcMain.handle("transaction/deleteItem", async(event, transactionSeq) => {
      const saveItem = await transaction.findByPk(transactionSeq);
      saveItem.deleteF = true;
      saveItem.save();
    });
  },
};