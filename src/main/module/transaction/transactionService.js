import {
  ipcMain
} from "electron";
import transaction from "../../model/transaction-vo.js";
import account from "../../model/account-vo";
import category from "../../model/category-vo.js";
import {
  Op
} from "sequelize";

export default {
  init() {
    // ================ 조회 ================
    ipcMain.handle("transaction/listItem", async(event, param) => {
      return await this.list(param);
    });

    // ================ 등록 ================
    ipcMain.handle("transaction/addItem", async(event, item) => {
      item.deleteF = false;
      const instance = await transaction.create(item);
      await this.applyAccount(item);
      return instance;
    });

    // ================ 수정 ================
    ipcMain.handle("transaction/editItem", async(event, item) => {
      const beforeTrans = await transaction.findByPk(item.transactionSeq);
      await this.revertAccount(beforeTrans);
      await beforeTrans.update(item);
      await this.applyAccount(item);
    });

    // ================ 삭제 ================
    ipcMain.handle("transaction/deleteItem", async(event, transactionSeq) => {
      const item = await transaction.findByPk(transactionSeq);
      await this.revertAccount(item);
      await item.destroy();
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
      where[Op.or] = [{
        "payAccount": param.accountSeq,
      }, {
        "receiveAccount": param.accountSeq,
      }];
    }

    if (param.kindTypeSet) {
      where["kind"] = param.kindTypeSet;
    }

    let condition = {
      where,
      order: ["transactionDate"],
      // raw: true,
      nest: true,
      include: [{
        model: category,
      }],
    };
    if (param.returnCount) {
      condition.limit = param.returnCount;
    }
    const result = await transaction.findAll(condition);
    // 이런 방법도 있다
    const rtnValue = result.map(record => record.get({
      plain: true,
    }));
    return rtnValue;
  },
  async applyAccount(trans) {
    let money = trans.money;
    if (trans.kind == "INCOME") {
      await this.addAcount(trans.receiveAccount, money);
    } else if (trans.kind == "SPENDING") {
      await this.subAcount(trans.payAccount, money);
    } else if (trans.kind == "TRANSFER") {
      await this.subAcount(trans.payAccount, money + trans.fee);
      await this.addAcount(trans.receiveAccount, money);
    }
  },
  async revertAccount(trans) {
    let money = trans.money;
    if (trans.kind == "INCOME") {
      await this.subAcount(trans.receiveAccount, money);
    } else if (trans.kind == "SPENDING") {
      await this.addAcount(trans.payAccount, money);
    } else if (trans.kind == "TRANSFER") {
      await this.addAcount(trans.payAccount, money);
      await this.subAcount(trans.receiveAccount, money + trans.fee);
    }
  },
  async addAcount(accountSeq, money) {
    let acc = await account.findByPk(accountSeq);
    acc.balance = acc.balance + money;
    await acc.save();
  },
  async subAcount(accountSeq, money) {
    let acc = await account.findByPk(accountSeq);
    acc.balance = acc.balance - money;
    await acc.save();
  },
};