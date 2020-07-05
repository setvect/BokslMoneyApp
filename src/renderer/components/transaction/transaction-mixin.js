import {
  mapGetters
} from "vuex";



export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters([
      "accountList",
      "categoryMap",
      "codeMap"
    ]),
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
  },
  mounted() {},
};