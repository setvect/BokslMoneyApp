<template id='item-panel'>
  <div>
    <div>
      <list :kind="kind" area="main" :parent-seq="0" v-on:@select-item="selectItem" />
    </div>
    <div>
      <list :kind="kind" area="sub" :parent-seq="mainItem.categorySeq" />
    </div>
  </div>
</template>

<script type="text/javascript">
import listComponent from "./categoryList.vue";

export default {
  data() {
    return {
      mainItem: { categorySeq: -1, },
    };
  },
  props: {
    kind: String,
  },
  components: {
    list: listComponent,
  },
  methods: {
    selectItem(item) {
      console.log('item :>> ', item);
      this.mainItem = item;
    },
  },
};
</script>