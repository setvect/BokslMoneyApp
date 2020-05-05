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
      return await this.listCodeItem(code);
    });

    // ================ 등록 ================
    // 메인코드에 대한 코드 항목 목록
    ipcMain.handle("code/addItem", async (event, item) => {
      const records = await connSeque.query(
        "select ifnull(max(c.CODE_ITEM_SEQ), 0) + 1 as cnt from CB_CODE_ITEM c where c.CODE_MAIN_ID = $codeMainId",
        {
          bind: { codeMainId: item.codeMainId, },
          type: QueryTypes.SELECT,
        }
      );

      item.codeItemSeq = records[0].cnt;
      item.deleteF = false;
      const instance = await codeItem.create(item);
      return instance;
    });

    // ================ 수정 ================
    // 정보 수정
    ipcMain.handle("code/editItem", async (event, item) => {
      const saveItem = await codeItem.findOne({
        where: {
          codeMainId: item.codeMainId,
          codeItemSeq: item.codeItemSeq,
        },
      });
      saveItem.name = item.name;
      saveItem.save();
    });

    // 정렬 변경
    ipcMain.handle("code/changeOrder", async (event, param) => {
      const downItem = await codeItem.findOne({
        where: {
          codeMainId: param.codeMainId,
          codeItemSeq: param.downCodeItemSeq,
        },
      });
      const upItem = await codeItem.findOne({
        where: {
          codeMainId: param.codeMainId,
          codeItemSeq: param.upCodeItemSeq,
        },
      });

      const temp = downItem.orderNo;
      downItem.orderNo = upItem.orderNo;
      upItem.orderNo = temp;
      downItem.save();
      upItem.save();
    });

    // ================ 삭제 ================
    ipcMain.handle("code/deleteItem", async (event, item) => {
      const saveItem = await codeItem.findOne({
        where: {
          codeMainId: item.codeMainId,
          codeItemSeq: item.codeItemSeq,
        },
      });
      saveItem.deleteF = true;
      saveItem.save();
    });
  },
  async listCodeItem(mainCode) {
    const result = await codeItem.findAll({
      where: {
        deleteF: false,
        codeMainId: mainCode,
      },
      order: ["orderNo"],
      raw: true,
    });
    return result;
  },
  // {코드 일련번호: 코드 정보}
  async getMappingCode(mainCode) {
    // 자산 종류 코드
    const codeList = await this.listCodeItem(mainCode);
    const idByMap = codeList.reduce((result, item, index, array) => {
      result[item.codeItemSeq] = item;
      return result;
    }, {});
    return idByMap;
  },
};
