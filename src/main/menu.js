import {
  Menu
} from "electron";
import util from "./util.js";

export default {
  init() {
    const template = [
      {
        label: "비밀번호 변경",
        click(item, focusedWindow) {
          focusedWindow.webContents.send("changePassword");
        },
      },
      {
        label: "새창",
        click() {
          util.newInstanceWindow();
        },
      },
      {
        role: "Help",
        submenu: [{
          label: "Reload",
          accelerator: "Ctrl+Shift+R",
          click(item, focusedWindow) {
            focusedWindow.reload();
          },
        },
        {
          label: "Toggle DevTools",
          click(item, focusedWindow) {
            focusedWindow.toggleDevTools();
          },
        },
        {
          label: "Learn More",
          click() {
            require("electron").shell.openExternal(
              "https://github.com/setvect/BokslMoneyApp"
            );
          },
        }
        ],
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  },
};