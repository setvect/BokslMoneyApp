import Vue from "vue";
import moment from "moment";
import CommonUtil from "./common-util.js";
// 사용 안함.
const TYPE_VALUE = {
  SPENDING: {
    title: "지출",
    color: "#00bb33",
    icon: "fa-minus-square",
  },
  INCOME: {
    title: "수입",
    color: "#ff99cc",
    icon: "fa-plus-square",
  },
  TRANSFER: {
    title: "이체",
    color: "#66ccff",
    icon: "fa-check-square-o",
  },
};

// 거래 내역 mixin
const TransactionMixin = {
  data: function() {
    return {
      // 지출, 수입, 이체 내역
      transactionList: [],
      selectDate: moment(),
    };
  },
  computed: {
    sumIncome() {
      return this.sumCalculation((t) => t.kind == "INCOME");
    },
    sumSpending() {
      return this.sumCalculation((t) => t.kind == "SPENDING");
    },
    sumTransfer() {
      return this.sumCalculation((t) => t.kind == "TRANSFER");
    },
  },
  methods: {
    // 거래내역 또는 메모 등록 폼
    addItemForm(type) {
      if (type == "MEMO") {
        let memo = this.getMemo(this.selectDate);
        // 해당 날짜에 등록된 메모가 있다면 수정으로 없다면 새롭게 등록
        if (memo) {
          this.$refs.popupMemo.openEditForm(memo);
        } else {
          this.$refs.popupMemo.openAddForm(this.selectDate);
        }
      } else {
        this.$refs.popupAdd.openAddForm(type, this.selectDate);
      }
    },
    editForm(item) {
      var d = $.extend(true, {}, item);
      this.$refs.popupAdd.openEditForm(d);
    },
    deleteAction(item) {
      if (!confirm("삭제하시겠습니까?")) {
        return;
      }
      // VueUtil.post("/transaction/delete.do", { itemSeq: item.transactionSeq, }, result => {
      //   this.reload()
      // })
    },
    // 유형에 따른 UI 표현 속성값
    getKindAttr(kind) {
      return TYPE_VALUE[kind];
    },
    // 수입, 지출, 이체 합산
    sumCalculation(filterCondition) {
      return this.transactionList.filter(filterCondition).reduce((acc, t) => {
        return acc + t.money;
      }, 0);
    },
  },
};


export { TransactionMixin, TYPE_VALUE };
