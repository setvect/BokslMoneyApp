import { ipcRenderer } from "electron";
import CommonUtil from "./common-util.js";
import waitDialog from "./waiting.js";

const NOTING_OPERATION = () => {};

export default {
  invoke(eventName, _param, _callback, _option) {
    let option = _option || {};
    let param = _param;
    let callback = _callback || NOTING_OPERATION;
    let waitMsg = option.waitMsg || "처리 중입니다";
    let finallyCall = option.finallyCall || NOTING_OPERATION;

    let errorCall =
      option.errorCall ||
      function(err) {
        CommonUtil.popupError(err);
      };

    if (option.waitDialog != false) {
      waitDialog.show(waitMsg, { dialogSize: "sm", });
    }

    ipcRenderer
      .invoke(eventName, param)
      .then((result) => callback(result))
      .catch((err) => errorCall(err))
      .finally(() => {
        if (option.waitDialog != false) {
          waitDialog.hide();
        }
        finallyCall();
      });
  },
};
