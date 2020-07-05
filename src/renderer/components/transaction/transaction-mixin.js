export default {
  data() {
    return {
      attributeList: [],
    };
  },
  computed: {
  },
  methods: {
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