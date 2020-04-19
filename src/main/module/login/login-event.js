import { ipcMain } from "electron";
import userVo from "../../model/user-vo.js";
import util from "../../util.js";

export default {
  init() {
    ipcMain.on("loginCheck", (event, passwd) => {
      // eslint-disable-next-line no-debugger
      userVo.findByPk("boksl").then((row) => {
        const result = util.compareBcrypt(passwd, row.password);
        event.sender.send("loginCheckResponse", result);
      });
    });
  },
};
