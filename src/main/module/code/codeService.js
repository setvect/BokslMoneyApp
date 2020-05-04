import { ipcMain } from "electron";
import codeMain from "../../model/codeMain-vo";
import codeItem from "../../model/codeItem-vo";
import connSeque from "../../model/connSeque.js";
import { QueryTypes } from "sequelize";

export default {
  init() {
    // ================ 조회 ================
    // 메인 코드 목록
    ipcMain.handle("code/listMain", async (event) => {
      const result = await codeMain.findAll({
        where: {
          deleteF: false,
        },
        attributes: ["codeMainId", "name"],
        raw: true,
      });
      return result;
    });

    // 메인코드에 대한 코드 항목 목록
    ipcMain.handle("code/listItem", async (event, code) => {
      const result = await codeItem.findAll({
        where: {
          deleteF: false,
          codeMainId: code,
        },
        raw: true,
      });

      return result;
    });

    // ================ 등록 ================
    // 메인코드에 대한 코드 항목 목록
    ipcMain.handle("code/addItem", async (event, item) => {
      console.log("item :>> ", item);
      console.log("item.codeMainId :>> ", item.codeMainId);
      const records = await connSeque.query(
        "select ifnull(max(c.CODE_ITEM_SEQ), 0) + 1 as cnt from CB_CODE_ITEM c where c.CODE_MAIN_ID = $codeMainId",
        {
          bind: { codeMainId: item.codeMainId, },
          type: QueryTypes.SELECT,
        }
      );
      console.log("records :>> ", records);

      item.codeItemSeq = records[0].cnt;
      item.deleteF = false;
      const instance = await codeItem.create(item);
      console.log("instance :>> ", instance);
      return instance;
    });

    // ================ 변경 ================

    // ================ 삭제 ================
  },
};
