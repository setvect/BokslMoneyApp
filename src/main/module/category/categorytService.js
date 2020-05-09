import {
  ipcMain
} from "electron";
import category from "../../model/category-vo";

export default {
  init() {
    // ================ 조회 ================
    // 메인 코드 목록
    ipcMain.handle("category/list", async(event, kindType, parent) => {
      const where = {
        deleteF: false,
        kindType,
      };
      if (parent) {
        where[parent] = parent;
      }

      const result = await category.findAll({
        where,
        raw: true,
      });
      return result;
    });
    // ================ 등록 ================

    // ================ 수정 ================

    // ================ 삭제 ================
  },
};