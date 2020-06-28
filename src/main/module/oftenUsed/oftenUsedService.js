import {
  ipcMain
} from "electron";
import oftenUsed from "../../model/oftenUsed-vo.js";
import connSeque from "../../model/connSeque.js";
import {
  Op
} from "sequelize";

export default {
  init() {
    // ================ 조회 ================
    // 계좌 목록
    ipcMain.handle("oftenUsed/listItem", async(event, kind) => {
      const result = await oftenUsed.findAll({
        where: {
          deleteF: false,
          kind,
        },
        order: ["orderNo"],
        raw: true,
      });
      return result;
    });

    // ================ 등록 ================
    // 계좌에 대한 계좌 항목 목록
    ipcMain.handle("oftenUsed/addItem", async(event, item) => {
      item.deleteF = false;
      let order = await oftenUsed.max("orderNo", {
        where: {
          "kind": item.kind,
        },
      });
      item.orderNo = order || 1;
      item.orderNo++;

      const instance = await oftenUsed.create(item);
      return instance;
    });

    // ================ 수정 ================
    // 정보 수정
    ipcMain.handle("oftenUsed/editItem", async(event, item) => {
      const saveItem = await oftenUsed.findByPk(item.oftenUsedSeq);
      await saveItem.update(item);
    });

    // 정렬 변경
    ipcMain.handle("oftenUsed/changeOrder", async(event, param) => {
      const downItem = await oftenUsed.findByPk(param.downOftenUsedSeq);
      const upItem = await oftenUsed.findByPk(param.upOftenUsedSeq);
      const temp = downItem.orderNo;
      downItem.orderNo = upItem.orderNo;
      upItem.orderNo = temp;
      downItem.save();
      upItem.save();
    });

    // ================ 삭제 ================
    ipcMain.handle("oftenUsed/deleteItem", async(event, oftenUsedSeq) => {
      const saveItem = await oftenUsed.findByPk(oftenUsedSeq);
      saveItem.deleteF = true;
      saveItem.save();
    });
  },
};