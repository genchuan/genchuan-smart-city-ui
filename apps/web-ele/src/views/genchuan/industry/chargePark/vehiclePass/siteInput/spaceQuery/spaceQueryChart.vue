<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { spaceQueryApi } from '#/api/genchuan/industry/chargePark/vehiclePass/api-map';

const props = defineProps({
  parkId: { type: Number, default: null },
});

const cards = reactive([
  {
    title: '查询量',
    value: 0,
    desc: '累计查询次数',
    color: '#4A90E2',
    key: 'queryCount',
  },
  {
    title: '查询成功率',
    value: '0%',
    desc: '查询准确度',
    color: '#50E3C2',
    key: 'querySuccessRate',
  },
]);

const state = reactive({
  chartData: {
    spaceLocationList: [],
  },
  hasData: false,
});

const pieChartRef = ref(null);
const barChartRef = ref(null);
let pieChartInstance = null;
let barChartInstance = null;

async function loadChartData() {
  try {
    const params = {
      areaId: props.parkId,
    };

    const res = await spaceQueryApi.getChart(params);

    // Always update card values
    if (res?.cardData) {
      cards[0].value = res.cardData.queryCount || 0;
      cards[1].value = res.cardData.querySuccessRate
        ? `${res.cardData.querySuccessRate}%`
        : '0%';
    }

    // Check if there's chart data - spaceLocationList is map data
    const hasChartData = res?.spaceLocationList?.length > 0;

    if (hasChartData) {
      state.chartData = {
        spaceLocationList: res.spaceLocationList || [],
      };
      state.hasData = true;
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

function initPieChart() {
  if (!pieChartRef.value) return;
  if (pieChartInstance) pieChartInstance.dispose();
  pieChartInstance = echarts.init(pieChartRef.value);

  // 泊位位置分布地图 - 使用散点图展示
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '泊位位置分布',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500 },
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const data = state.chartData.spaceLocationList[params.dataIndex];
        return `${data.spaceNo}<br/>状态: ${data.spaceStatus}<br/>经度: ${data.lon}<br/>纬度: ${data.lat}`;
      },
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      name: '经度',
      scale: true,
      axisLabel: {
        formatter: '{value}°',
      },
    },
    yAxis: {
      type: 'value',
      name: '纬度',
      scale: true,
      axisLabel: {
        formatter: '{value}°',
      },
    },
    series: [
      {
        type: 'scatter',
        data: state.chartData.spaceLocationList.map((item) => [
          item.lon,
          item.lat,
        ]),
        symbolSize: 15,
        itemStyle: {
          color: (params) => {
            const item = state.chartData.spaceLocationList[params.dataIndex];
            return item.spaceStatus === '空闲' ? '#67C23A' : '#E6A23C';
          },
        },
        label: {
          show: true,
          formatter: (params) => {
            const data = state.chartData.spaceLocationList[params.dataIndex];
            return data.spaceNo;
          },
          position: 'top',
          fontSize: 10,
        },
      },
    ],
  };
  pieChartInstance.setOption(option);

  // 添加点击事件，支持钻取
  pieChartInstance.on('click', (params) => {
    if (params.componentType === 'series') {
      const spaceData = state.chartData.spaceLocationList[params.dataIndex];
      window.dispatchEvent(
        new CustomEvent('filterBySpace', {
          detail: { spaceNo: spaceData.spaceNo },
        }),
      );
    }
  });
}

function initBarChart() {
  // 接口只返回地图数据，不需要柱状图
}

function initCharts() {
  initPieChart();
  initBarChart();
}

function handleCardClick(key) {
  let status = '';
  if (key === 'queryCount') {
    status = ''; // 全部查询记录
  } else if (key === 'querySuccessRate') {
    status = 'success'; // 查询成功的记录
  }
  window.dispatchEvent(
    new CustomEvent('filterByChart:spaceQuery', { detail: { status } }),
  );
}

onMounted(() => {
  loadChartData();
  window.addEventListener('resize', () => {
    pieChartInstance?.resize();
    barChartInstance?.resize();
  });
});
onUnmounted(() => {
  pieChartInstance?.dispose();
  barChartInstance?.dispose();
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
    <div v-if="state.hasData" class="chart-wrapper-single">
      <div class="chart-container-single">
        <div ref="pieChartRef" style="width: 100%; height: 100%"></div>
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
      flex-direction: column;
      flex: 1;
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

  .chart-wrapper-single {
    display: flex !important;
    flex: 1 !important;
    min-width: 0 !important;
    max-width: none !important;
    margin: 0 !important;

    .chart-container-single {
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
