import { ipcMain } from "electron";
import codeMain from "../../model/codeMain-vo.js";

export default {
  init() {
    ipcMain.on("code/codeMainlistAll", (event) => {
      console.log("event :>> ", event);
      codeMain
        .findAll({
          where: {
            deleteF: false,
          },
          attributes: ['codeMainId', 'name'],
          raw: true,
        })
        .then((result) => {
          console.log("result :>> ", result);
          event.sender.send("code/codeMainlistAll/response", result);
        });
    });
  },
};
