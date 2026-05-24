<!-- 文件5: src/views/genchuan/industrialPark/securityMgmt/cameraMgmt/components/chart.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import { getCameraMgmtChart } from '#/api/genchuan/industry/industrialpark/securityMgmt/videoMonitor/cameraMgmt/data.js';

const loading = ref(true);
const chartData = ref({
  deviceTotalCount: 0,
  onlineCount: 0,
  offlineCount: 0,
  faultCount: 0,
  areaDeviceList: [],
  faultAreaList: [],
});

// 卡片数据
const cardList = computed(() => [
  { title: '设备总数', value: chartData.value.deviceTotalCount, color: '#409EFF', status: 'total' },
  { title: '在线数', value: chartData.value.onlineCount, color: '#67C23A', status: 'online' },
  { title: '离线数', value: chartData.value.offlineCount, color: '#E6A23C', status: 'offline' },
  { title: '故障数', value: chartData.value.faultCount, color: '#F56C6C', status: 'fault' },
]);

// 各区域设备数量柱状图
const areaBarData = computed(() => {
  const list = chartData.value.areaDeviceList || [];
  return {
    xData: list.map(item => item.area),
    seriesData: [{ name: '设备数量', data: list.map(item => item.count) }],
  };
});

// 故障设备区域分布柱状图
const faultBarData = computed(() => {
  const list = chartData.value.faultAreaList || [];
  return {
    xData: list.map(item => item.area),
    seriesData: [{ name: '故障设备数', data: list.map(item => item.count) }],
  };
});

// 图表选项配置（用于下拉选择器）
const chartOptions = [
  { label: '各区域设备数量', value: 0, barData: areaBarData, yName: '设备数量' },
  { label: '故障设备区域分布', value: 1, barData: faultBarData, yName: '故障设备数' },
];

const activeChartType = ref(0);
const currentChart = computed(() => chartOptions[activeChartType.value]);

const emit = defineEmits(['cardSelect', 'barSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClick = (areaName) => {
  emit('barSelect', { field: 'area', value: areaName });
};

const handleChartChange = (index) => {
  activeChartType.value = index;
};

const loadData = async () => {
  loading.value = true;
  try {
    const res = await getCameraMgmtChart();
    chartData.value = res;
  } catch (error) {
    console.error('加载图表数据失败', error);
    chartData.value = {
      deviceTotalCount: 30,
      onlineCount: 28,
      offlineCount: 1,
      faultCount: 1,
      areaDeviceList: [
        { area: '园区大门', count: 4 },
        { area: '办公楼', count: 10 },
        { area: '生产车间', count: 8 },
        { area: '仓库区', count: 6 },
        { area: '停车场', count: 2 },
      ],
      faultAreaList: [
        { area: '办公楼', count: 1 },
      ],
    };
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <div class="box-left">
      <Indicator class="left-card" v-for="item in cardList" :key="item.title" v-bind="item" @click="handleCardClick" />
    </div>

    <div class="chart-wrapper bar-chart-container">
      <!-- 下拉选择器，位于右上角 -->
      <div class="chart-select-wrapper">
        <el-select v-model="activeChartType" size="small" @change="handleChartChange">
          <el-option
            v-for="opt in chartOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </div>
      <Bar
        :title="currentChart.label"
        :x-data="currentChart.barData.value.xData"
        :series-data="currentChart.barData.value.seriesData"
        :y-name="currentChart.yName"
        @bar-click="handleBarClick"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  padding-left: 15px;
  padding-right: 15px;
  width: 100% !important;

  .box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin-top: 10px !important;
    .left-card { height: 150px !important; }
  }

  .chart-wrapper {
    position: relative;
    flex: 2;
    min-width: 300px;
  }

  .chart-select-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }

  .bar-chart-container {
    position: relative;
  }
}
</style>
