import {
  ipcMain
} from "electron";
import stockEvaluate from "../../model/stockEvaluate-vo.js";
import {
  Sequelize
} from "sequelize";

export default {
  init() {
    // ================ 조회 ================
    // 단일 항목 조회
    ipcMain.handle("stockEvaluate/listItem", async(event, snapshotSeq) => {
      const result = await stockEvaluate.findAll({
        where: {
          snapshotSeq: snapshotSeq,
        },
        raw: true,
      });
      return result;
    });

    // ================ 등록 ================
    ipcMain.handle("stockEvaluate/addItem", async(event, item) => {
      item.deleteF = false;
      const instance = await stockEvaluate.create(item);
      return instance;
    });

    // ================ 수정 ================
    // 정보 수정
    ipcMain.handle("stockEvaluate/editItem", async(event, item) => {
      const saveItem = await stockEvaluate.findByPk(item.stockEvaluateSeq);
      await saveItem.update(item);
    });
  },
};