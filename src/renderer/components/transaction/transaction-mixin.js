export default {
  data() {
    return {
      accountList: [],
      attributeList: [],
    };
  },
  computed: {
  },
  methods: {
    // 계좌 목록
    loadAccount() {
      ElectronUtil.invoke("account/listItem", {}, result => {
        this.accountList = result;
      });
    },
    // 속성
    loadAttribute(codeMainId) {
      ElectronUtil.invoke("code/listItem", codeMainId, result => {
        this.attributeList = result;
      });
    },
  },
  mounted() {
  },
};