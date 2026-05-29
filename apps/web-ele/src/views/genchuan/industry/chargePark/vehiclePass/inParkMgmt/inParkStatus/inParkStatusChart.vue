<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getInParkStatusChart } from '#/api/genchuan/industry/chargePark/vehiclePass/inParkMgmt/inParkStatus';
import Map from '#/genchuan-components/Map/index.vue';

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

const markerIcons = {
  normal: '/static/imgs/dataHub/map/marker-blue.png',
  warning: '/static/imgs/dataHub/map/marker-orange.png',
  danger: '/static/imgs/dataHub/map/marker-red.png',
};

const statusIconMap = {
  green: 'normal',
  orange: 'warning',
  red: 'danger',
};

const statusKeyMap = {
  '正常在停': 'green',
  '超时长在停': 'orange',
  '异常状态': 'red',
};

const infoWindowConfig = {
  title: 'locationName',
  fields: [
    { key: 'plateNo', label: '车牌号', bold: true },
    { key: 'spaceName', label: '车位名称' },
    { key: 'stationName', label: '场站名称' },
    { key: 'statusName', label: '状态', bold: true },
  ],
};

const state = reactive({
  chartData: {
    trend: [],
    locationList: [],
  },
  hasData: false,
});

const trendChartRef = ref(null);
let trendChartInstance = null;

const mapData = computed(() => {
  if (!state.chartData.locationList || state.chartData.locationList.length === 0) {
    return [];
  }

  return state.chartData.locationList.map((item, index) => ({
    id: item.id || `vehicle-${index}`,
    coordinate: `${item.lon},${item.lat}`,
    statusName: item.status || '正常在停',
    locationName: item.plateNo,
    plateNo: item.plateNo,
    spaceName: item.spaceName,
    stationName: item.stationName,
  }));
});

async function loadChartData() {
  try {
    const params = {
      stationId: props.parkId,
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

    console.log(
      '[inParkStatusChart] hasTrendData:',
      hasTrendData,
      'hasLocationData:',
      hasLocationData,
    );
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
  console.log(
    '[inParkStatusChart] initTrendChart called, ref:',
    trendChartRef.value,
    'data length:',
    state.chartData.trend.length,
  );
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
    const clickedDate = params.name;
    let startTime, endTime;
    if (/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}$/.test(clickedDate)) {
      // 处理小时范围，例如 "2026-05-19 10:00" 变成 "2026-05-19 10:00:00" 到 "2026-05-19 10:59:59"
      startTime = `${clickedDate}:00`;
      // 把 "2026-05-19 10:00" 变成 "2026-05-19 10:59:59"
      endTime = `${clickedDate.replace(/\d{2}$/, '59')}:59`;
    } else {
      startTime = `${clickedDate} 00:00:00`;
      endTime = `${clickedDate} 23:59:59`;
    }
    window.dispatchEvent(
      new CustomEvent('filterByChart:inParkStatus', {
        detail: {
          inTime: [startTime, endTime],
        },
      }),
    );
  });
}

function handleMapMarkerClick(markerData) {
  // Emit event to open vehicle detail dialog
  window.dispatchEvent(
    new CustomEvent('openVehicleDetail:inParkStatus', {
      detail: {
        plateNo: markerData.plateNo,
        id: markerData.id,
      },
    }),
  );
}

function initCharts() {
  initTrendChart();
}

function handleCardClick(key) {
  const filterMap = {
    inParkCarCount: { showAll: true },
    overTimeCarCount: { overTime: true },
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
  });
});
onUnmounted(() => {
  trendChartInstance?.dispose();
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
      <div class="chart-container">
        <div v-if="state.chartData.trend.length > 0" ref="trendChartRef" style="width: 100%; height: 100%"></div>
        <div v-else style="display: flex; align-items: center; justify-content: center; height: 100%; color: #909399;">
          暂无趋势数据
        </div>
      </div>
      <div
        v-if="state.chartData.locationList.length > 0"
        class="chart-container map-container"
      >
        <div class="map-title">在停车辆分布地图</div>
        <Map
          :data="mapData"
          :marker-icons="markerIcons"
          :status-icon-map="statusIconMap"
          :status-key-map="statusKeyMap"
          :info-window-config="infoWindowConfig"
          @marker-click="handleMapMarkerClick"
        />
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
  gap: 15px;
  align-items: flex-end;
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
      max-width: 50%;
      height: 330px;
      padding: 10px;
      background-color: hsl(var(--card));
      border-radius: 8px;
      box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
    }

    .map-container {
      position: relative;

      .map-title {
        position: absolute;
        top: 20px;
        left: 50%;
        z-index: 10;
        padding: 8px 16px;
        background: rgb(255 255 255 / 95%);
        border-radius: 4px;
        box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
        font-size: 14px;
        font-weight: 500;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
