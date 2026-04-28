<script setup>
import { ref } from 'vue';
import SpacePushTable from './table/index.vue';
import SpacePushChart from './table/chart.vue';
import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tabArray = ref([
  {
    label: '空位推送',
    components: SpacePushTable,
    chartComponent: SpacePushChart,
    secondShow: false,
    arrowShow: true,          // 新增：控制图表显隐
  },
]);

const activeName = ref('空位推送');
const secondShow = ref(false);
const chartRef = ref(null);   // 可选，用于后续调用图表方法

const tabChange = () => {};

// 新增：切换图表显隐
const arrowChange = () => {
  tabArray.value.forEach((v) => {
    v.arrowShow = !v.arrowShow;
  });
};

const handleChartRefresh = (filters, activeTab) => {
  const eventMap = {
    '空位推送': 'space-push-chart-refresh',
  };
  const eventName = eventMap[activeTab];
  if (eventName) {
    window.dispatchEvent(new CustomEvent(eventName, { detail: filters }));
  }
};

// 可选：刷新图表的方法（如果图表组件暴露了 refresh 方法）
const refreshChart = () => {
  chartRef.value?.refresh();
};
</script>

<template>
  <div class="common-index">
    <!-- 新增：通过 arrowShow 控制图表显隐 -->
    <component
      v-if="tabArray.find(item => item.label === activeName)?.arrowShow"
      :is="tabArray.find(item => item.label === activeName)?.chartComponent"
      ref="chartRef"
      @refresh="(filters) => handleChartRefresh(filters, activeName)"
    />
    <div class="icon-change">
      <el-icon class="tabel-tab-icon" v-if="secondShow" @click="changeArrowStatus">
        <ArrowDown />
      </el-icon>
      <el-icon class="tabel-tab-icon" v-if="!secondShow" @click="changeArrowStatus">
        <ArrowUp />
      </el-icon>
    </div>
    <el-tabs v-model="activeName" class="common-tabs" type="card" @tab-change="tabChange">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <!-- 新增：传递 arrowShow 并监听 arrow-change 事件 -->
        <component
          :is="item.components"
          :second-show="item.secondShow"
          :arrow-show="item.arrowShow"
          @arrow-change="arrowChange"
          :key="item.label"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
