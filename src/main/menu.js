import { Menu } from "electron";
const { dialog } = require("electron");

export default {
  init() {
    const template = [
      {
        label: "기능",
        submenu: [
          {
            label: "가계부 쓰기(달력)",
            accelerator: "Ctrl+F1",
            click() {
              dialog.showMessageBox(null, { title: "가계부 쓰기(달력)" });
            },
          },
          {
            label: "가계부 쓰기(표)",
            accelerator: "Ctrl+F2",
            click() {
              dialog.showMessageBox(null, { title: "가계부 쓰기(표)" });
            },
          },
          {
            label: "결산",
            accelerator: "Ctrl+F3",
            click() {
              dialog.showMessageBox(null, { title: "결산" });
              3;
            },
          },
          {
            label: "통계",
            accelerator: "Ctrl+F4",
            click() {
              dialog.showMessageBox(null, { title: "통계" });
              4;
            },
          },
          {
            label: "분류 관리",
            accelerator: "Ctrl+F5",
            click() {
              dialog.showMessageBox(null, { title: "분류 관리" });
            },
          },
          {
            label: "계좌 관리",
            accelerator: "Ctrl+F6",
            click() {
              dialog.showMessageBox(null, { title: "계좌 관리" });
            },
          },
          {
            label: "코드 관리",
            accelerator: "Ctrl+F7",
            click() {
              dialog.showMessageBox(null, { title: "코드 관리" });
            },
          },
        ],
      },
      {
        role: "Window",
        submenu: [
          {
            role: "minimize",
          },
          {
            role: "close",
          },
        ],
      },
      {
        role: "Help",
        submenu: [
          {
            label: "Reload",
            accelerator: "F5",
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
          },
        ],
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  },
};
