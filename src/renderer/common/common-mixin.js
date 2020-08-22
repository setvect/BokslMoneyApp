/**
 * 공통으로 사용하는 mixin
 */
import {
  TYPE_VALUE
} from "./constant.js";

export default {
  data() {
    return {};
  },
  mounted() {

  },
  computed: {
    yearList() {
      let years = [];
      let d = new Date();
      for (let y = 2007; y <= d.getFullYear(); y++) {
        years.push(y);
      }
      return years.reverse();
    },
  },
  methods: {
    /**
     * 계좌, 코드, 분류, 주식 목록 로딩
     * @param {*} callback
     */
    loadBasicInfo(callback) {
      this.$store.dispatch("loadAcount")
        .then(() => this.$store.dispatch("loadCategory"))
        .then(() => this.$store.dispatch("loadCode"))
        .then(() => this.$store.dispatch("loadStock")).then(() => {
          if(callback == null) {
            return;
          }
          callback();
        });
    },
    // 유형에 따른 UI 표현 속성값
    getKindAttr(kind) {
      return TYPE_VALUE[kind];
    },
    getGainsColor(value) {
      if(value == 0) {
        return null;
      }
      else if(value > 0) {
        return "#f51818";
      }else{
        return "#1b61d1";
      }
    },

  },
};