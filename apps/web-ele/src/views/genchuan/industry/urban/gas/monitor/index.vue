<script setup>
import { onMounted, ref } from 'vue';

import CompletedEchart from './completed/chart.vue';
import CompletedTable from './completed/index.vue';
import DisposalEchart from './disposal/chart.vue';
import DisposalTable from './disposal/index.vue';
import PendingEchart from './pending/chart.vue';
import PendingTable from './pending/index.vue';
import MontiorEchart from './table/chart.vue';
import MontiorTable from './table/index.vue';

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
const activeName = ref('实时监测');
const arrowChange = () => {
  emit('arrow-change');
};
const tabsData = ref([
  {
    label: '实时监测',
    component: MontiorTable,
    echartComponent: MontiorEchart,
  },
  {
    label: '待处置预警',
    component: PendingTable,
    echartComponent: PendingEchart,
  },
  {
    label: '处置中工单',
    component: DisposalTable,
    echartComponent: DisposalEchart,
  },
  {
    label: '已完成归档',
    component: CompletedTable,
    echartComponent: CompletedEchart,
  },
]);
const handleClick = (item) => {
  const nowObj = tabsData.value.find((v) => v.label === item);
  isComponent.value.now = nowObj.component;
  isComponent.value.echartComponent = nowObj.echartComponent;
  emit('get-component', isComponent.value.echartComponent);
};
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
    <div class="tabel-tabs">
      <el-tabs
        v-if="props.secondShow"
        v-model="activeName"
        class="demo-tabs"
        @tab-change="handleClick"
      >
        <el-tab-pane
          v-for="item in tabsData"
          :key="item.label"
          :label="item.label"
          :name="item.label"
        />
      </el-tabs>
    </div>
    <component
      :second-show="props.secondShow"
      :arrow-show="props.arrowShow"
      @arrow-change="arrowChange"
      :is="isComponent.now"
      :class="props.secondShow ? 'second-show-table' : 'second-table'"
    />
  </div>
</template>
<style lang="scss">
.monitor-index {
  margin-top: 35px;

  .tabel-tabs {
    height: 40px;
  }

  .second-table {
    margin-top: -75px;
  }

  .second-show-table {
    margin-top: -75px;

    .vxe-grid--table-container {
      margin-top: 40px;
    }
  }
}
</style>
