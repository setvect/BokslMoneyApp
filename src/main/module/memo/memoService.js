import {
  ipcMain
} from "electron";
import memo from "../../model/memo-vo.js";
import {
  Op
} from "sequelize";
import {
  Sequelize
} from "sequelize";
export default {
  init() {
    // ================ 조회 ================
    // 계좌 목록
    ipcMain.handle("memo/listItem", async(event, param) => {
      const where = {};
      where["memoDate"] = {
        [Op.between]: [param.from, param.to],
      };
      where["deleteF"] = false;

      let condition = {
        attributes: [
          "memoSeq",
          "note",
          [Sequelize.fn("strftime", "%Y-%m-%d", Sequelize.col("memo_date")), "memoDate"]
        ],
        where,
        raw: true,
      };
      if (param.returnCount) {
        condition.limit = param.returnCount;
      }
      const result = await memo.findAll(condition);
      return result;
    });

    // ================ 등록 ================
    // 계좌에 대한 계좌 항목 목록
    ipcMain.handle("memo/addItem", async(event, item) => {
      item.deleteF = false;
      const instance = await memo.create(item);
      return instance;
    });

    // ================ 수정 ================
    // 정보 수정
    ipcMain.handle("memo/editItem", async(event, item) => {
      const saveItem = await memo.findByPk(item.memoSeq);
      saveItem.set("note", item.note);
      await saveItem.save();
    });

    // ================ 삭제 ================
    ipcMain.handle("memo/deleteItem", async(event, memoSeq) => {
      const saveItem = await memo.findByPk(memoSeq);
      saveItem.deleteF = true;
      await saveItem.save();
    });
  },
};