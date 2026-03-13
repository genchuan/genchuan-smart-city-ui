<script setup>
import { onMounted, ref } from 'vue';

import MontiorEchart from './customize/chart.vue';
import MontiorTable from './customize/index.vue';

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
const emit = defineEmits(['arrow-change', 'get-component']);
const arrowChange = () => {
  emit('arrow-change');
};
const tabsData = ref([
  {
    label: '实时监测',
    component: MontiorTable,
    echartComponent: MontiorEchart,
  },
]);
const isComponent = ref({
  now: MontiorTable,
  echartComponent: MontiorEchart,
});
onMounted(() => {
  emit('get-component', tabsData.value[0].echartComponent);
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
<style lang="scss">
.monitor-index {
  margin-top: 35px;
  .mark-table {
    margin-top: -35px;
  }
}
</style>
