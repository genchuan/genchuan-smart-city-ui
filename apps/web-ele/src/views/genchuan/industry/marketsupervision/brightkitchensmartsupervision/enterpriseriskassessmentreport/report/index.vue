<script setup>
import { ref } from 'vue';

import CustomizeTable from './customize/index.vue';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  arrowShow: {
    type: Boolean,
    default: false,
  },
  arrowState: {
    type: Boolean,
    default: false,
  },
});
const activeName = ref('日报');

const tabsData = ref([{ label: '自定义报表', component: CustomizeTable }]);
const handleClick = (item) => {
  const nowObj = tabsData.value.find((v) => v.label === item);
  isComponent.value.now = nowObj.component;
};
const isComponent = ref({
  now: CustomizeTable,
});
</script>
<template>
  <div class="monitor-index">
    <component
      :second-show="props.secondShow"
      :arrow-show="props.arrowShow"
      @arrow-change="arrowChange"
      :is="isComponent.now"
      class="mark-table"
    />
  </div>
</template>
<style scoped lang="scss">
.common-index {
  .common-tabs {
    :deep(.el-tabs__nav) {
      margin-left: 0px !important;
    }
    :deep(.el-tabs__item) {
      padding-right: 5px !important;
    }
  }
}
</style>
