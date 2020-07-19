import {
  mapGetters
} from "vuex";
import moment from "moment";
import { TYPE_VALUE } from "../../common/constant.js";
export default {
  data() {
    return {
      // 지출, 수입, 이체 내역
      transactionList: [],
      selectDate: moment(),
    };
  },
  computed: {
    ...mapGetters([
      "accountList",
      "accountMap",
      "categoryMap",
      "codeMap"
    ]),
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
    getAttributeList(kind) {
      const ITEM_TYPE_ATTR = {
        INCOME: "ATTR_INCOME",
        SPENDING: "ATTR_SPENDING",
        TRANSFER: "ATTR_TRANSFER",
      };
      return this.codeMap[ITEM_TYPE_ATTR[kind]];
    },
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
      ElectronUtil.invoke("transaction/deleteItem", item.transactionSeq, ()=>this.reload());
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
  mounted() {},
};