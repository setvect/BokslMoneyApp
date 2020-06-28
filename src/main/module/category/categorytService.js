import {
  ipcMain
} from "electron";
import category from "../../model/category-vo";

export default {
  init() {
    // ================ 조회 ================
    ipcMain.handle("category/getOne", async(event, categorySeq) => {
      const result = await category.findByPk(categorySeq, {
        raw: true,
      });
      console.log("result :>> ", result);
      if (result.parentSeq != 0) {
        result.parentCategory = await category.findByPk(result.parentSeq, {
          raw: true,
        });
      }
      return result;
    });

    // 메인 분류 목록
    ipcMain.handle("category/list", async(event, param) => {
      const defaultCondition = {
        deleteF: false,
      };
      const where = {
        ...defaultCondition,
        ...param,
      };
      const result = await category.findAll({
        where,
        order: ["orderNo"],
        raw: true,
      });
      return result;
    });

    // ================ 등록 ================
    ipcMain.handle("category/addItem", async(event, item) => {
      item.deleteF = false;
      const instance = await category.create(item);
      return instance;
    });

    // ================ 수정 ================
    ipcMain.handle("category/editItem", async(event, item) => {
      const saveItem = await category.findByPk(item.categorySeq);
      await saveItem.update(item);
    });

    // 정렬 변경
    ipcMain.handle("category/changeOrder", async(event, param) => {
      const downItem = await category.findByPk(param.downCategorySeq);
      const upItem = await category.findByPk(param.upCategorySeq);

      const temp = downItem.orderNo;
      downItem.orderNo = upItem.orderNo;
      upItem.orderNo = temp;
      await downItem.save();
      await upItem.save();
    });

    ipcMain.handle("category/deleteItem", async(event, categorySeq) => {
      const saveItem = await category.findByPk(categorySeq);
      saveItem.deleteF = true;
      saveItem.save();
    });


    // ================ 삭제 ================
  },
};