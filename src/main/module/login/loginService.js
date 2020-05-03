import { ipcMain } from "electron";
import userVo from "../../model/user-vo.js";

export default {
  init() {
    ipcMain.handle("loginCheck", async (event, passwd) => {
      const result = await userVo.findByPk("boksl");
      return result;
    });
  },
};
