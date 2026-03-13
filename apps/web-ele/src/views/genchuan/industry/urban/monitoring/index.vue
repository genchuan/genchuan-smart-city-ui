<script setup>
import { ref } from 'vue';

import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

import monitor from './monitor/index.vue';
import tableGateChart from './monitor/table/gateChart.vue';
import pendingGateChart from './monitor/pending/gateChart.vue';
import disposalGateChart from './monitor/disposal/gateChart.vue';
import completedGateChart from './monitor/completed/gateChart.vue';
import report from './report/index.vue';
import dayGateChart from './report/day/gateChart.vue';
import weekGateChart from './report/week/gateChart.vue';
import montlyGateChart from './report/montly/gateChart.vue';
import seasonGateChart from './report/season/gateChart.vue';
import halfGateChart from './report/half/gateChart.vue';
import yearGateChart from './report/year/gateChart.vue';
import customizeGateChart from './report/customize/gateChart.vue';

import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};
const tabArray = ref([
  {
    label: '窨井盖设施监测',
    components: monitor,
    showSecondary: false,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '窨井盖设施监测报表',
    components: report,
    showSecondary: false,
    secondShow: false,
    arrowShow: false,
    arrowState: false,
  },
]);

const arrowChange = () => {
  // 切换secondShow状态
  secondShow.value = !secondShow.value;
  // 更新tabArray中的secondShow属性
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
    v.arrowShow = secondShow.value;
  });
};
const activeName = ref('窨井盖设施监测');
const secondShow = ref(true);
const activeSubTab = ref('实时监测');
const activeReportTab = ref('日报');

// 初始化时设置窨井盖设施监测标签页的 secondShow 为 true
const initTabState = () => {
  const monitorTab = tabArray.value.find((v) => v.label === '窨井盖设施监测');
  if (monitorTab) {
    monitorTab.showSecondary = true;
    monitorTab.secondShow = true;
    monitorTab.arrowShow = true;
    monitorTab.arrowState = true;
  }
};

// 调用初始化函数
initTabState();
const tabChange = (item) => {
  tabArray.value.forEach((v) => {
    v.showSecondary = false;
    v.secondShow = false;
    v.arrowShow = false;
    v.arrowState = false;
  });
  const nowObj = tabArray.value.find((v) => v.label === item);
  nowObj.arrowShow = true;
  nowObj.arrowState = true;
  nowObj.secondShow = true;
  
  // 确保切换标签页时能正确显示对应图表
  if (item === '窨井盖设施监测报表') {
    // 触发一次报表子标签页的切换，确保图表更新
    handleSubTabChange(activeReportTab.value);
  }
};

const handleSubTabChange = (subTab) => {
  if (activeName.value === '窨井盖设施监测') {
    activeSubTab.value = subTab;
  } else if (activeName.value === '窨井盖设施监测报表') {
    activeReportTab.value = subTab;
  }
};

const getCurrentGateChart = () => {
  if (activeName.value === '窨井盖设施监测') {
    switch (activeSubTab.value) {
      case '实时监测':
        return tableGateChart;
      case '待处置预警':
        return pendingGateChart;
      case '处置中工单':
        return disposalGateChart;
      case '已完成归档':
        return completedGateChart;
      default:
        return tableGateChart;
    }
  } else if (activeName.value === '窨井盖设施监测报表') {
    switch (activeReportTab.value) {
      case '日报':
        return dayGateChart;
      case '周报':
        return weekGateChart;
      case '月报':
        return montlyGateChart;
      case '季报':
        return seasonGateChart;
      case '半年报':
        return halfGateChart;
      case '年报':
        return yearGateChart;
      case '自定义报表':
        return customizeGateChart;
      default:
        return dayGateChart;
    }
  }
  return tableGateChart;
};
</script>
<template>
  <div class="common-index">
    <!-- 条件渲染图表组件 -->
    <component v-if="secondShow" :is="getCurrentGateChart()" />
    <el-tabs
      v-model="activeName"
      class="common-tabs"
      type="card"
      @tab-change="tabChange"
    >
      <el-tab-pane
        v-for="item in tabArray"
        :key="item.label"
        :name="item.label"
      >
        <template #label>
          <div class="table-first">
            <span>{{ item.label }}</span>
          </div>
        </template>
        <component
          :is="item.components"
          :second-show="item.secondShow"
          :key="item.label"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
          @sub-tab-change="handleSubTabChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
