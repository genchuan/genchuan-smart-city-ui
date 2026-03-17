<script setup>
import { ref } from 'vue';

import CompletedTable from './completed/index.vue';
import DisposalTable from './disposal/index.vue';
import PendingTable from './pending/index.vue';
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
const emit = defineEmits(['arrow-change']);
const activeName = ref('实时监测');
const arrowChange = () => {
  emit('arrow-change');
};
const tabsData = ref([
  { label: '实时监测', component: MontiorTable },
  { label: '待处置预警', component: PendingTable },
  { label: '处置中工单', component: DisposalTable },
  { label: '已完成归档', component: CompletedTable },
]);
const handleClick = (item) => {
  console.log(item);
  const nowObj = tabsData.value.find((v) => v.label === item);
  isComponent.value.now = nowObj.component;
};
const isComponent = ref({
  now: MontiorTable,
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
