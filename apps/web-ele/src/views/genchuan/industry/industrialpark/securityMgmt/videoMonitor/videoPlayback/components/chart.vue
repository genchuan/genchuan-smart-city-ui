<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Bar from '#/genchuan-components/stats/barClick.vue';
import lineChart from '#/genchuan-components/stats/lineChart.vue';
import { getVideoPlaybackChart } from '#/api/genchuan/industry/industrialpark/securityMgmt/videoMonitor/videoPlayback/data.js';

const loading = ref(true);
const chartData = ref({
  dailyQueryCount: [],
  cameraDurationList: [],
  monthlyTrendList: [],
});

// 每日录像检索次数柱状图
const dailyBarData = computed(() => {
  const data = chartData.value.dailyQueryCount || [];
  return {
    xData: data.map(item => item.date),
    seriesData: [{ name: '检索次数', data: data.map(item => item.count) }],
  };
});

// 各摄像头录像时长柱状图
const cameraBarData = computed(() => {
  const data = chartData.value.cameraDurationList || [];
  // 将秒转换为小时显示
  const durationHours = data.map(item => (item.duration / 3600).toFixed(1));
  return {
    xData: data.map(item => item.cameraName),
    seriesData: [{ name: '录像时长(小时)', data: durationHours }],
  };
});

// 近30天录像调用趋势折线图
const lineData = computed(() => {
  const data = chartData.value.monthlyTrendList || [];
  return {
    xAxis: data.map(item => item.date),
    series: [{ name: '调用次数', data: data.map(item => item.count) }],
  };
});

// 当前激活的图表类型（0-每日检索次数，1-各摄像头时长，2-调用趋势）
const activeChartType = ref(0);
const chartTypes = [
  { title: '每日录像检索次数', type: 'bar', data: dailyBarData, yName: '检索次数' },
  { title: '各摄像头录像时长', type: 'bar', data: cameraBarData, yName: '录像时长(小时)' },
  { title: '近30天录像调用趋势', type: 'line', data: lineData, yName: '调用次数' },
];

const currentChart = computed(() => chartTypes[activeChartType.value]);

const emit = defineEmits(['barSelect', 'lineSelect']);

const handleBarClick = (value) => {
  if (activeChartType.value === 0) {
    // 每日检索次数柱状图：传递日期
    emit('barSelect', { field: 'videoTime', value });
  } else if (activeChartType.value === 1) {
    // 各摄像头时长柱状图：传递摄像头名称
    emit('barSelect', { field: 'cameraName', value });
  }
};

const handleLineClick = (params) => {
  emit('lineSelect', { field: 'date', value: params.xValue });
};

const loadData = async () => {
  loading.value = true;
  try {
    const res = await getVideoPlaybackChart();
    chartData.value = res;
  } catch (error) {
    console.error('加载图表数据失败', error);
    chartData.value = {
      dailyQueryCount: [
        { date: '2025-05-01', count: 12 },
        { date: '2025-05-02', count: 15 },
        { date: '2025-05-03', count: 10 },
        { date: '2025-05-04', count: 18 },
        { date: '2025-05-05', count: 14 },
        { date: '2025-05-06', count: 20 },
        { date: '2025-05-07', count: 16 },
      ],
      cameraDurationList: [
        { cameraName: '大门摄像头', duration: 86400 },
        { cameraName: '办公楼东摄像头', duration: 72000 },
        { cameraName: '办公楼西摄像头', duration: 54000 },
        { cameraName: '车间A摄像头', duration: 108000 },
        { cameraName: '仓库北摄像头', duration: 43200 },
      ],
      monthlyTrendList: [
        { date: '2025-04-08', count: 8 },
        { date: '2025-04-12', count: 10 },
        { date: '2025-04-16', count: 12 },
        { date: '2025-04-20', count: 15 },
        { date: '2025-04-24', count: 14 },
        { date: '2025-04-28', count: 18 },
        { date: '2025-05-02', count: 16 },
        { date: '2025-05-06', count: 20 },
        { date: '2025-05-08', count: 22 },
      ],
    };
  } finally {
    loading.value = false;
  }
};

// 图表切换（通过下拉框）
function handleChartChange(value) {
  activeChartType.value = value;
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <!-- 右上角下拉切换框 -->
    <div class="chart-select-wrapper">
      <el-select v-model="activeChartType" size="small" @change="handleChartChange">
        <el-option
          v-for="(item, idx) in chartTypes"
          :key="idx"
          :label="item.title"
          :value="idx"
        />
      </el-select>
    </div>

    <!-- 动态渲染图表（柱状图或折线图） -->
    <Bar
      v-if="currentChart.type === 'bar'"
      :title="currentChart.title"
      :x-data="currentChart.data.value.xData"
      :series-data="currentChart.data.value.seriesData"
      :y-name="currentChart.yName"
      @bar-click="handleBarClick"
    />
    <lineChart
      v-else
      :title="currentChart.title"
      :x-data="currentChart.data.value.xAxis"
      :series-data="currentChart.data.value.series"
      :y-name="currentChart.yName"
      @line-click="handleLineClick"
    />
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  position: relative; /* 为绝对定位提供锚点 */
  padding: 0 15px 16px;
  width: 100%;
}

.chart-select-wrapper {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
}

/* 紧凑下拉框样式（可选） */
:deep(.el-select) {
  width: 160px;
}
</style>
