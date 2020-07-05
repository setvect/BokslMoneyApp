import {
  ipcMain
} from "electron";
import category from "../../model/category-vo";
import transactionService from "../transaction/transactionService.js";
import moment from "moment";
import _ from "lodash";
import {
  Op
} from "sequelize";

export default {
  init() {
    // ================ 조회 ================
    ipcMain.handle("category/getOne", async(event, categorySeq) => {
      const result = await category.findByPk(categorySeq, {
        raw: true,
      });
      if (result.parentSeq != 0) {
        result.parentCategory = await category.findByPk(result.parentSeq, {
          raw: true,
        });
      }
      return result;
    });

    // 메인 분류 목록
    ipcMain.handle("category/list", async(event, param) => {
      return this.list(param);
    });

    // 자주 사용하는 카테고리 조회
    ipcMain.handle("/category/listRecommend", async(event, param) => {
      let categorySeqMap = await this.findByCategoryName({
        kind: param.kind,
        name: param.note,
      });

      param.from = (moment()).add(-100, "days").toDate();
      param.to = new Date();
      param.returnCount = 1000;

      let list = await transactionService.list(param);
      let categoryMap = _.countBy(list, "categorySeq");
      let mergeCategorySeq = {};
      _(categorySeqMap).forEach((value, key) => {
        let v = mergeCategorySeq[key];
        if (v == null) {
          mergeCategorySeq[key] = value;
        } else {
          mergeCategorySeq[key] += value;
        }
      });

      _(categoryMap).forEach((value, key) => {
        let v = mergeCategorySeq[key];
        if (v == null) {
          mergeCategorySeq[key] = value;
        } else {
          mergeCategorySeq[key] += value;
        }
      });

      // console.log("mergeCategorySeq :>> ", mergeCategorySeq);
      // 자주 사용하는 카테고리
      let findCategory = await category.findAll({
        where: {
          "categorySeq": {
            [Op.in]: Object.keys(mergeCategorySeq),
          },
        },
        raw: true,
      });

      // 많이 사용된 카테고리로 정렬
      let sortCategory = _.sortBy(findCategory, (c) => -mergeCategorySeq[c.categorySeq]);

      for (const c of sortCategory) {
        const parent = await category.findByPk(c.parentSeq, {
          raw: true,
        });
        c.parentCategory = parent;
      }
      // console.log("sortCategory :>> ", sortCategory);

      return sortCategory;
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

    // ================ 삭제 ================
    ipcMain.handle("category/deleteItem", async(event, categorySeq) => {
      const saveItem = await category.findByPk(categorySeq);
      saveItem.deleteF = true;
      saveItem.save();
    });
  },

  async findByCategoryName(param) {
    let categoryList = await this.list({
      kind: param.kind,
      name: {
        [Op.like]: `%${param.name}%`,
      },
    });
    let categorySeqMap = _.chain(categoryList).keyBy("categorySeq").mapValues(() => 1000).value();
    return categorySeqMap;
  },
  async list(param) {
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
  },
};