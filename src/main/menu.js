import { Menu } from "electron";

export default {
  init() {
    const template = [
      {
        role: "Window",
        submenu: [
          {
            role: "minimize"
          },
          {
            role: "close"
          }
        ]
      },
      {
        role: "Help",
        submenu: [
          {
            label: "Toggle DevTools",
            click(item, focusedWindow) {
              focusedWindow.toggleDevTools();
            }
          },
          {
            label: "Learn More",
            click() {
              require("electron").shell.openExternal(
                "https://github.com/setvect/BokslMoneyApp"
              );
            }
          }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
};
