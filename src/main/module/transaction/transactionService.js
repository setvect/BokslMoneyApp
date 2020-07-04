import {
  ipcMain
} from "electron";
import transaction from "../../model/transaction-vo.js";
import account from "../../model/account-vo";
import category from "../../model/category-vo.js";
import categoryService from "../category/categorytService.js";
import {
  Op
} from "sequelize";

export default {
  init() {
    // ================ 조회 ================
    // 계좌 목록
    ipcMain.handle("transaction/listItem", async(event, param) => {
      return this.list(param);
    });

    // ================ 등록 ================
    // 계좌에 대한 계좌 항목 목록
    ipcMain.handle("transaction/addItem", async(event, item) => {
      item.deleteF = false;
      const instance = await transaction.create(item);
      this.applyAccount(item);
      return instance;
    });

    // ================ 수정 ================
    // 정보 수정
    ipcMain.handle("transaction/editItem", async(event, item) => {
      const beforeTrans = await transaction.findByPk(item.transactionSeq);
      await this.revertAccount(beforeTrans);
      await beforeTrans.update(item);
      await this.applyAccount(item);
    });

    // ================ 삭제 ================
    ipcMain.handle("transaction/deleteItem", async(event, transactionSeq) => {
      const item = await transaction.findByPk(transactionSeq);
      this.revertAccount(item);
      item.destroy();
    });

  },
  async list(param) {
    const where = {};
    if (param.from && param.to) {
      where["transactionDate"] = {
        [Op.between]: [param.from, param.to],
      };
    }
    if (param.note) {
      where["note"] = {
        [Op.like]: `%${param.note}%`,
      };
    }
    if (param.categorySeq) {
      where["categorySeq"] = param.categorySeq;
    }

    if (param.accountSeq) {
      where["accountSeq"] = param.accountSeq;
    }

    if (param.kindTypeSet) {
      where["kind"] = param.kindTypeSet;
    }

    let condition = {
      where,
      raw: true,
      nest: true,
      include: [{
        model: category,
      }],
    };
    if (param.returnCount) {
      condition.limit = param.returnCount;
    }
    const result = await transaction.findAll(condition);
    return result;
  },
  async applyAccount(trans) {
    let money = trans.money;
    if (trans.kind == "INCOME") {
      this.addAcount(trans.receiveAccount, money);
    } else if (trans.kind == "SPENDING") {
      this.subAcount(trans.payAccount, money);
    } else if (trans.kind == "TRANSFER") {
      this.subAcount(trans.payAccount, money + trans.fee);
      this.addAcount(trans.receiveAccount, money);
    }
  },
  async revertAccount(trans) {
    let money = trans.money;
    if (trans.kind == "INCOME") {
      this.subAcount(trans.receiveAccount, money);
    } else if (trans.kind == "SPENDING") {
      this.addAcount(trans.payAccount, money);
    } else if (trans.kind == "TRANSFER") {
      this.addAcount(trans.payAccount, money);
      this.subAcount(trans.receiveAccount, money + trans.fee);
    }
  },
  async addAcount(accountSeq, money) {
    let acc = await account.findByPk(accountSeq);
    acc.update({
      balance: acc.balance + money,
    });
  },
  async subAcount(accountSeq, money) {
    let acc = await account.findByPk(accountSeq);
    acc.update({
      balance: acc.balance - money,
    });
  },
};