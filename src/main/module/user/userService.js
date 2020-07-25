import {
  ipcMain
} from "electron";
import user from "../../model/user-vo.js";
import util from "../../util.js";
import constant from "../../constant.js";
export default {
  init() {
    // ================ 조회 ================

    // ================ 등록 ================

    // ================ 수정 ================
    // 비밀번호 수정
    ipcMain.handle("user/changePassword", async(event, password) => {
      const saveItem = await user.findByPk(constant.USER_ID);
      const hash = util.encodeBcrypt(password);
      saveItem.password = hash;
      await saveItem.save();
    });
    // ================ 삭제 ================
  },
};