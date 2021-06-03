import {
  ipcMain
} from "electron";
import assetGroup from "../../model/assetGroup-vo.js";
import {
  Sequelize
} from "sequelize";

export default {
  init() {
    // ================ 조회 ================
    ipcMain.handle("assetGroup/listItem", async(event, snapshotSeq) => {
      const result = await assetGroup.findAll({
        where: {
          snapshotSeq: snapshotSeq,
        },
        raw: true,
      });
      return result;
    });

    // ================ 등록 ================
    ipcMain.handle("assetGroup/addItem", async(event, item) => {
      item.deleteF = false;
      const instance = await assetGroup.create(item);
      return instance;
    });

    // ================ 수정 ================
    // 정보 수정
    ipcMain.handle("assetGroup/editItem", async(event, item) => {
      const saveItem = await assetGroup.findByPk(item.assetGroupSeq);
      await saveItem.update(item);
    });
  },
};