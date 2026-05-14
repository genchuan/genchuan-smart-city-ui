<script setup>
import { markRaw, ref } from 'vue';

import CycleReportChart from './table/chart.vue';
import { cycleTypeOptions } from './table/data';
import CycleReportTable from './table/index.vue';

import '#/components/page/index.scss';

const secondShow = ref(false);
const activeName = ref('全部'); // 默认选中“全部”
const chartVisible = ref(true); // 图表显隐状态，独立于标签页

// 生成标签页数组，每个标签页对应一个周期类型
const tabArray = ref(
  cycleTypeOptions.map((option) => ({
    label: option.label,
    cycleType: option.value,
    components: markRaw(CycleReportTable),
  })),
);

// 控制图表收缩/展开图标的方向（仅影响图标箭头，不影响图表显隐）
const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
};

// 控制图表显隐（点击收缩/展开按钮）
const arrowChange = () => {
  chartVisible.value = !chartVisible.value;
};

// 图表钻取事件:把当前激活 tab 的 cycleType 一并发出去,
// 防止之前访问过的其它 tab 实例(仍挂载)也响应导致多开抽屉
const handleChartRefresh = (filters) => {
  const tab = tabArray.value.find((t) => t.label === activeName.value);
  const activeCycleType = tab ? tab.cycleType : '';
  window.dispatchEvent(
    new CustomEvent('cycle-report-chart-refresh', {
      detail: { ...filters, _activeCycleType: activeCycleType },
    }),
  );
};
</script>

<template>
  <div class="common-index">
    <CycleReportChart v-if="chartVisible" @refresh="handleChartRefresh" />
    <div class="icon-change">
      <el-icon
        class="tabel-tab-icon"
        v-if="secondShow"
        @click="changeArrowStatus"
      >
        <ArrowDown />
      </el-icon>
      <el-icon
        class="tabel-tab-icon"
        v-if="!secondShow"
        @click="changeArrowStatus"
      >
        <ArrowUp />
      </el-icon>
    </div>
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane
        v-for="item in tabArray"
        :key="item.label"
        :name="item.label"
        lazy
      >
        <template #label>
          <div class="table-first">
            <span>{{ item.label }}</span>
          </div>
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

  // 图标按钮组上下边距
  .icon-change {
    margin: 8px 0 16px;
  }

  // 确保 tabs 顶部无多余间距
  .el-tabs {
    margin-top: 0;
  }
}
</style>
