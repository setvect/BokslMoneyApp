import { ipcMain } from "electron";
import codeMain from "../../model/codeMain-vo.js";

export default {
  init() {
    ipcMain.handle("code/codeMainlistAll", async (event) => {
      const result = await codeMain.findAll({
        where: {
          deleteF: false,
        },
        attributes: ["codeMainId", "name"],
        raw: true,
      });
      return result;
    });
  },
};
