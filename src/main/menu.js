import {
  Menu
} from "electron";
import util from "./util.js";

export default {
  init() {
    const template = [{
      label: "가계부 쓰기(달력)",
      accelerator: "Ctrl+F1",
      click(item, focusedWindow) {
        focusedWindow.webContents.send("movePage", "calendar");
      },
    },
    {
      label: "가계부 쓰기(표)",
      accelerator: "Ctrl+F2",
      click(item, focusedWindow) {
        focusedWindow.webContents.send("movePage", "grid");
      },
    },
    {
      label: "결산",
      accelerator: "Ctrl+F3",
      click(item, focusedWindow) {
        focusedWindow.webContents.send("movePage", "settlement");
      },
    },
    {
      label: "통계",
      accelerator: "Ctrl+F4",
      click(item, focusedWindow) {
        focusedWindow.webContents.send("movePage", "stat");
      },
    },
    {
      label: "분류 관리",
      accelerator: "Ctrl+F5",
      click(item, focusedWindow) {
        focusedWindow.webContents.send("movePage", "category");
      },
    },
    {
      label: "계좌 관리",
      accelerator: "Ctrl+F6",
      click(item, focusedWindow) {
        focusedWindow.webContents.send("movePage", "account");
      },
    },
    {
      label: "코드 관리",
      accelerator: "Ctrl+F7",
      click(item, focusedWindow) {
        focusedWindow.webContents.send("movePage", "code", {
          mainCode: "KIND_CODE",
        });
      },
    },
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