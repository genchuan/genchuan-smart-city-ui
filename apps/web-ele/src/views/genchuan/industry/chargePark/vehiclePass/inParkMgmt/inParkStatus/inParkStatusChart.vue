<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getInParkStatusChart } from '#/api/genchuan/industry/chargePark/vehiclePass/inParkMgmt/inParkStatus';

const props = defineProps({
  parkId: { type: Number, default: null },
});

const cards = reactive([
  {
    title: '在停车辆数',
    value: 0,
    desc: '当前在停总数',
    color: '#4A90E2',
    key: 'inParkCarCount',
  },
  {
    title: '超时长车辆数',
    value: 0,
    desc: '超时停车',
    color: '#FF6B8B',
    key: 'overTimeCarCount',
  },
]);

const state = reactive({
  chartData: {
    trend: [],
    locationList: [],
  },
  hasData: false,
});

const trendChartRef = ref(null);
const mapChartRef = ref(null);
let trendChartInstance = null;
let mapChartInstance = null;

async function loadChartData() {
  try {
    const params = {
      stationName: props.parkId,
    };

    const res = await getInParkStatusChart(params);
    console.log('[inParkStatusChart] API Response:', res);

    // Always update card values
    if (res?.cardData) {
      cards[0].value = res.cardData.inParkCarCount || 0;
      cards[1].value = res.cardData.overTimeCarCount || 0;
    }

    // Check if there's chart data
    const hasTrendData = res?.inParkCountTrend?.length > 0;
    const hasLocationData = res?.carLocationList?.length > 0;

    console.log('[inParkStatusChart] hasTrendData:', hasTrendData, 'hasLocationData:', hasLocationData);
    console.log('[inParkStatusChart] trend data:', res?.inParkCountTrend);
    console.log('[inParkStatusChart] location data:', res?.carLocationList);

    if (hasTrendData || hasLocationData) {
      state.chartData = {
        trend: res.inParkCountTrend || [],
        locationList: res.carLocationList || [],
      };
      state.hasData = true;
      // 等待 DOM 更新后再初始化图表
      await nextTick();
      initCharts();
    } else {
      state.hasData = false;
    }
  } catch (error) {
    console.error('加载图表数据失败:', error);
    state.hasData = false;
  }
}

function initTrendChart() {
  console.log('[inParkStatusChart] initTrendChart called, ref:', trendChartRef.value, 'data length:', state.chartData.trend.length);
  if (!trendChartRef.value || state.chartData.trend.length === 0) return;
  if (trendChartInstance) trendChartInstance.dispose();
  trendChartInstance = echarts.init(trendChartRef.value);
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '在停量趋势',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500 },
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: state.chartData.trend.map((item) => item.time),
    },
    yAxis: { type: 'value', name: '在停数量' },
    series: [
      {
        name: '在停数量',
        type: 'line',
        data: state.chartData.trend.map((item) => item.count),
        smooth: true,
        lineStyle: { width: 3, color: '#4A90E2' },
        areaStyle: { color: 'rgba(74,144,226,0.1)' },
        symbol: 'circle',
        symbolSize: 6,
      },
    ],
  };
  console.log('[inParkStatusChart] Trend chart option:', option);
  trendChartInstance.setOption(option);

  // 添加点击事件
  trendChartInstance.on('click', (params) => {
    window.dispatchEvent(
      new CustomEvent('filterByChart:inParkStatus', {
        detail: { time: params.name },
      }),
    );
  });
}

function initMapChart() {
  console.log('[inParkStatusChart] initMapChart called, ref:', mapChartRef.value, 'data length:', state.chartData.locationList.length);
  if (!mapChartRef.value || state.chartData.locationList.length === 0) return;
  if (mapChartInstance) mapChartInstance.dispose();
  mapChartInstance = echarts.init(mapChartRef.value);

  const scatterData = state.chartData.locationList.map((item) => ({
    value: [item.lon, item.lat],
    name: item.plateNo,
    spaceName: item.spaceName,
  }));

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '在停车辆分布地图',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500 },
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return `车牌: ${params.data.name}<br/>车位: ${params.data.spaceName}<br/>经纬度: (${params.data.value[0]}, ${params.data.value[1]})`;
      },
    },
    xAxis: {
      type: 'value',
      name: '经度',
      scale: true,
    },
    yAxis: {
      type: 'value',
      name: '纬度',
      scale: true,
    },
    series: [
      {
        name: '车辆位置',
        type: 'scatter',
        data: scatterData,
        symbolSize: 12,
        itemStyle: {
          color: '#FF6B8B',
          shadowBlur: 10,
          shadowColor: 'rgba(255, 107, 139, 0.5)',
        },
        emphasis: {
          itemStyle: {
            color: '#FF3860',
            borderColor: '#fff',
            borderWidth: 2,
          },
        },
      },
    ],
  };
  mapChartInstance.setOption(option);

  // 添加点击事件
  mapChartInstance.on('click', (params) => {
    window.dispatchEvent(
      new CustomEvent('filterByChart:inParkStatus', {
        detail: { plateNo: params.data.name },
      }),
    );
  });
}

function initCharts() {
  initTrendChart();
  initMapChart();
}

function handleCardClick(key) {
  const filterMap = {
    inParkCarCount: {},
    overTimeCarCount: { parkStatus: '超时在停' },
  };

  const filterParams = filterMap[key];
  if (filterParams) {
    window.dispatchEvent(
      new CustomEvent('filterByChart:inParkStatus', { detail: filterParams }),
    );
  }
}

onMounted(() => {
  loadChartData();
  window.addEventListener('resize', () => {
    trendChartInstance?.resize();
    mapChartInstance?.resize();
  });
});
onUnmounted(() => {
  trendChartInstance?.dispose();
  mapChartInstance?.dispose();
});
</script>

<template>
  <div class="chart-box">
    <!-- 左侧卡片区域 -->
    <div class="box-left">
      <div
        v-for="card in cards"
        :key="card.key"
        class="left-card"
        :style="{ borderLeftColor: card.color }"
        @click="handleCardClick(card.key)"
      >
        <div class="card-header">
          <span class="card-title">{{ card.title }}</span>
          <div
            class="card-indicator"
            :style="{ backgroundColor: card.color }"
          ></div>
        </div>
        <div class="card-body">
          <div class="card-value" :style="{ color: card.color }">
            {{ card.value }}
          </div>
          <div class="card-desc">{{ card.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧图表区域 -->
    <div v-if="state.hasData" class="chart-wrapper">
      <div
        v-if="state.chartData.locationList.length > 0"
        class="chart-container"
      >
        <div ref="mapChartRef" style="width: 100%; height: 100%"></div>
      </div>
      <div v-if="state.chartData.trend.length > 0" class="chart-container">
        <div ref="trendChartRef" style="width: 100%; height: 100%"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 覆盖全局样式
@media (min-width: 1200px) {
  .chart-box .chart-wrapper {
    min-width: 0 !important;
    margin-left: 0 !important;
  }

  .chart-box .chart-wrapper .chart-container {
    min-width: 0 !important;
  }
}

.chart-box {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 15px;
  width: 100% !important;
  padding-right: 15px;
  padding-bottom: 0.5rem;
  padding-left: 15px;

  .box-left {
    display: flex !important;
    flex: 0 0 auto !important;
    flex-direction: column;
    gap: 12px;
    min-width: 280px !important;
    max-width: 320px !important;
    height: 330px;

    .left-card {
      display: flex;
      flex: 1;
      flex-direction: column;
      flex: 1;
      padding: 16px 14px;
      overflow: hidden;
      cursor: pointer;
      border-left: 4px solid #4a90e2;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
        transform: translateY(-2px);
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        .card-title {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.3;
          color: #606266;
        }

        .card-indicator {
          flex-shrink: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
      }

      .card-body {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;

        .card-value {
          margin-bottom: 4px;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
        }

        .card-desc {
          font-size: 12px;
          line-height: 1;
          color: #909399;
        }
      }
    }
  }

  .chart-wrapper {
    display: flex !important;
    flex: 1 !important;
    gap: 15px;
    min-width: 0 !important;
    max-width: none !important;
    margin: 0 !important;

    .chart-container {
      flex: 1;
      min-width: 0;
      height: 330px;
      padding: 10px;
      background-color: hsl(var(--card));
      border-radius: 8px;
      box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
    }
  }
}
</style>
