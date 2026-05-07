<script setup>
import { ref, markRaw } from 'vue';
import CycleReportTable from './table/index.vue';
import '#/components/page/index.scss';
import CycleReportChart from './table/chart.vue';
import { cycleTypeOptions } from './table/data';

const secondShow = ref(false);
const activeName = ref('全部'); // 默认选中“全部”
const chartVisible = ref(true); // 图表显隐状态，独立于标签页

// 生成标签页数组，每个标签页对应一个周期类型
const tabArray = ref(cycleTypeOptions.map(option => ({
  label: option.label,
  cycleType: option.value,
  components: markRaw(CycleReportTable),
})));

// 控制图表收缩/展开图标的方向（仅影响图标箭头，不影响图表显隐）
const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
};

// 控制图表显隐（点击收缩/展开按钮）
const arrowChange = () => {
  chartVisible.value = !chartVisible.value;
};

// 图表钻取事件
const handleChartRefresh = (filters) => {
  window.dispatchEvent(new CustomEvent('cycle-report-chart-refresh', { detail: filters }));
};
</script>

<template>
  <div class="common-index">
    <CycleReportChart v-if="chartVisible" @refresh="handleChartRefresh" />
    <div class="icon-change">
      <el-icon class="tabel-tab-icon" v-if="secondShow" @click="changeArrowStatus"><ArrowDown /></el-icon>
      <el-icon class="tabel-tab-icon" v-if="!secondShow" @click="changeArrowStatus"><ArrowUp /></el-icon>
    </div>
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <component
          :is="item.components"
          :second-show="secondShow"
          :arrow-show="chartVisible"
          :cycle-type="item.cycleType"
          @arrow-change="arrowChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.common-index {
  // 图表容器下边距
  :deep(.stats-four-visualization) {
    margin-bottom: 8px;
  }

  // 图标按钮组上下边距
  .icon-change {
    margin: 8px 0 16px 0;
  }

  // 确保 tabs 顶部无多余间距
  .el-tabs {
    margin-top: 0;
  }
}
</style>
