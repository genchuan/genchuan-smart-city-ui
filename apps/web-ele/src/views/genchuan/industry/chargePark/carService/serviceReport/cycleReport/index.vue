<script setup>
import { ref, markRaw } from 'vue';
import CycleReportTable from './table/index.vue';
import '#/components/page/index.scss';
import CycleReportChart from './table/chart.vue';

const secondShow = ref(false);
const activeName = ref('周期报表');

const tabArray = ref([
  {
    label: '周期报表',
    components: markRaw(CycleReportTable),
    showSecondary: true,
    secondShow: false,
  },
]);

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach(v => v.secondShow = secondShow.value);
};

const handleChartRefresh = (filters) => {
  // 图表钻取时触发，传递给表格组件
  window.dispatchEvent(new CustomEvent('cycle-report-chart-refresh', { detail: filters }));
};
</script>

<template>
  <div class="common-index">
    <CycleReportChart @refresh="handleChartRefresh" />
    <div class="icon-change">
      <el-icon class="tabel-tab-icon" v-if="secondShow" @click="changeArrowStatus"><ArrowDown /></el-icon>
      <el-icon class="tabel-tab-icon" v-if="!secondShow" @click="changeArrowStatus"><ArrowUp /></el-icon>
    </div>
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <component :is="item.components" :second-show="item.secondShow" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
