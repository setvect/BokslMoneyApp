import { ipcMain } from "electron";
import category from "../../model/category-vo";

export default {
  init() {
    // ================ 조회 ================
    // 메인 코드 목록
    ipcMain.handle("category/list", async(event, param) => {
      const defaultCondition = { deleteF: false, };
      const where = { ...defaultCondition, ...param, };
      console.log('where :>> ', where);
      const result = await category.findAll({ where, raw: true, });
      return result;
    });
    // ================ 등록 ================
    ipcMain.handle("category/addItem", async(event, item) => {
      item.deleteF = false;
      console.log('item :>> ', item);
      const instance = await category.create(item);
      return instance;
    });

    // ================ 수정 ================
    ipcMain.handle("category/editItem", async(event, item) => {
      const saveItem = await category.findByPk(item.categorySeq);
      await saveItem.update(item);
    });

    // ================ 삭제 ================
  },
};