import { ipcMain } from "electron";
import account from "../../model/account-vo";

export default {
  init() {
    // ================ 조회 ================
    // 계좌 목록
    ipcMain.handle("account/listMain", async (event) => {
      const result = await account.findAll({
        where: {
          deleteF: false,
        },
        raw: true,
      });
      return result;
    });

    // ================ 등록 ================
    // 계좌에 대한 계좌 항목 목록
    ipcMain.handle("account/addItem", async (event, item) => {
      item.deleteF = false;
      const instance = await account.create(item);
      return instance;
    });

    // ================ 수정 ================
    // 정보 수정
    ipcMain.handle("account/editItem", async (event, item) => {
      const saveItem = await account.findByPk(item.accountSeq);
      await saveItem.update(item);
    });

    // ================ 삭제 ================
    ipcMain.handle("account/deleteItem", async (event, accountSeq) => {
      const saveItem = await account.findByPk(accountSeq);
      saveItem.deleteF = true;
      saveItem.save();
    });
  },
};
