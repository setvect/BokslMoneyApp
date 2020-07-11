import { ipcMain } from "electron";
import userVo from "../../model/user-vo.js";
import util from "../../util.js";

export default {
  init() {
    ipcMain.handle("checkLogin", async(event, password) => {
      const user = await userVo.findByPk("boksl");
      let r = util.compareBcrypt(password, user.password);
      return r;
    });
  },
};
