import moment from "moment";

// 프로그램 전역적으로 사용하는 공통 함수
var CommonUtil = {};

/**
 * 프로그램 오류로 인한 경고창
 */
CommonUtil.popupError = function(err) {
  const message = err.response == null ? err.message : err.response.data.message;
  if (err.message != null) {
    console.log("프로그램 에러", message);
    Swal.fire("에러다", message, "error");
  } else {
    console.log("프로그램 에러", err);
    Swal.fire("에러다", err, "error");
  }
};
/**
 * 메시지 창
 */
CommonUtil.dialogInfo = function(title, message) {
  $("#alert-dialog").attr("title", title);
  $("#alert-dialog ._message").html(message);

  $("#alert-dialog").dialog({
    resizable: false,
    height: "auto",
    width: 550,
    modal: true,
    open: function() {
      $(".ui-dialog").css("z-index", 99999);
    },
    buttons: {
      Close: function() {
        $(this).dialog("close");
      },
    },
  });
  // 버튼에 X가 표시 되도록 강제 설정. 왜 안되는지 모르겠다.
  $("button.ui-dialog-titlebar-close").addClass("ui-icon").addClass("ui-icon-closethick");
};

/**
 * twbsPagination 페이징 처리 관련 옵션
 */
CommonUtil.makePageOption = function(page, callback) {
  return {
    initiateStartPageClick: false,
    totalPages: page.totalPage == 0 ? 1 : page.totalPage,
    visiblePages: page.visiblePage,
    startPage: page.currentPage,
    first: null,
    last: null,
    prev: "«",
    next: "»",
    href: "javascript:void(0)",
    onPageClick: callback,
  };
};

// 기존 페이징 객체 제거
CommonUtil.destroyPage = function(selector) {
  if ($(selector).data("twbs-pagination")) {
    $(selector).twbsPagination("destroy");
  }
};

CommonUtil.replaceAll = (text, org, dest) => {
  return text.split(org).join(dest);
};

// 콤마
CommonUtil.toComma = function(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 줄바꿈을 br 테그로 변경
CommonUtil.toBr = function(text) {
  if (text === undefined || text == null) {
    return null;
  }
  return text.replace(/(?:\r\n|\r|\n)/g, "<br/>");
};

// null 또는 빈 공백이면 true 반환
CommonUtil.isEmpty = function(val) {
  return val === undefined || val == null || val.length <= 0 ? true : false;
};

// 공백제거
CommonUtil.removeWhiteSpace = function(val) {
  if (CommonUtil.isEmpty(val)) {
    return "";
  } else {
    return val.replace(/\s/gi, "");
  }
};

// context root path
CommonUtil.getContextPath = function() {
  return $("meta[name='contextRoot']").attr("content");
};

CommonUtil.appendContextRoot = function(url) {
  return CommonUtil.getContextPath() + url;
};

// 정규표현식에서 사용하는 특수문자를 escape 처리함
CommonUtil.escapeRegExp = function(str) {
  return str.replace(/[\\-\\[\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\\\^\\$\\|]/g, "\\$&");
};

CommonUtil.escapeHtml = function(str) {
  str = str || "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\\"/g, "&quot;");
};

CommonUtil.unescapeHtml = function(str) {
  str = str || "";
  return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"");
};
// format - moment 라이브러리 날짜 패턴(예: YYYY.MM.DD)
CommonUtil.formatDate = (value, format) => {
  if (moment.isMoment(value)) {
    return value.format(format);
  }
  if (value instanceof Date) {
    return moment(value).format(format);
  }
  if (!isNaN(value)) {
    return moment(value).format(format);
  }
  return moment().format(format);
};

// content 내용을 다운로드
// 호출 예: CommonUtil.download(csvContent, 'dowload.csv', 'text/csv;encoding:utf-8');
CommonUtil.download = function(content, fileName, mimeType) {
  let a = document.createElement("a");
  mimeType = mimeType || "application/octet-stream";

  if (navigator.msSaveBlob) {
    // IE10
    navigator.msSaveBlob(
      new Blob([content], {
        type: mimeType,
      }),
      fileName
    );
  } else if (URL && "download" in a) {
    // html5 A[download]
    a.href = URL.createObjectURL(
      new Blob([content], {
        type: mimeType,
      })
    );
    a.setAttribute("download", fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    // only this mime type is supported
    location.href = "data:application/octet-stream," + encodeURIComponent(content);
  }
};

// 이차원 배열 값을 csv 포맷으로 변경
// data: 이차원 문자열 배열
CommonUtil.convertCsv = function(data) {
  const csvContent = data.map((arr) => {
    return arr.map((item) => {
      let t = item || "";
      return "\"" + t.replace("\"", "\"\"") + "\"";
    }).join(",");
  }).join("\n");
  return csvContent;
};

// 이차원 배열 값을 html table 형태로 변경(xls파일로 다운로드 받아 엑셀에서 열수 있게 하기 위함)
CommonUtil.convertHtmlTable = function(data) {
  let head = true;
  const rows = data.map((arr) => {
    let fields = arr.map((item) => {
      if (head) {
        return `<th>${CommonUtil.escapeHtml(item)}</th>`;
      } else {
        return `<td>${CommonUtil.escapeHtml(item)}</td>`;
      }
    }).join("");
    head = false;
    return `<tr>${fields}</tr>`;
  }).join("\n");
  return `<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><table border="1">${rows}</table>`;
};

export default CommonUtil;