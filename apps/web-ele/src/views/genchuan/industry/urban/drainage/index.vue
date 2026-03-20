<script setup>
import { ref } from 'vue';

import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

import monitor from './monitor/index.vue';
import report from './report/index.vue';
import drainageChart from './monitor/table/drainageChart.vue';

import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};
const tabArray = ref([
  {
    label: '排水管网监测',
    components: monitor,
    showSecondary: false,
    secondShow: false,
    arrowShow: true,
    arrowState: false,
  },
  {
    label: '排水管网监测报表',
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
const activeName = ref('排水管网监测');
const secondShow = ref(true);
const activeSubTab = ref('实时监测');

// 初始化时设置排水管网监测标签页的 secondShow 为 true
const initTabState = () => {
  const monitorTab = tabArray.value.find((v) => v.label === '排水管网监测');
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
};

const handleSubTabChange = (subTab) => {
  if (activeName.value === '排水管网监测') {
    activeSubTab.value = subTab;
  }
};

const getCurrentGateChart = () => {
  if (activeName.value === '排水管网监测') {
    switch (activeSubTab.value) {
      case '实时监测':
        return drainageChart;
      default:
        return drainageChart;
    }
  }
  return drainageChart;
};
</script>
<template>
  <div class="common-index">
    <!-- 条件渲染图表组件 -->
    <div class="drainage-chart-section" v-if="secondShow">
      <component :is="getCurrentGateChart()" />
    </div>
    
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

<style scoped lang="scss">
// 排水监测图表区域样式
.drainage-chart-section {
  margin-bottom: 20px;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
