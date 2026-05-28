<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { unplateEnterApi } from '#/api/genchuan/industry/chargePark/vehiclePass/api-map';

const props = defineProps({
  parkId: { type: Number, default: null },
});

const cards = reactive([
  {
    title: '无牌入场量',
    value: 0,
    desc: '今日无牌车辆',
    color: '#4A90E2',
    key: 'total',
  },
  {
    title: '审核通过率',
    value: '0%',
    desc: '审核通过比例',
    color: '#50E3C2',
    key: 'passRate',
  },
]);

const state = reactive({
  chartData: {
    stationUnplateCount: [],
  },
  hasData: false,
});

const barChartRef = ref(null);
let barChartInstance = null;

async function loadChartData() {
  try {
    const params = {
      stationId: props.parkId,
    };

    const res = await unplateEnterApi.getChart(params);

    // Always update card values
    if (res?.cardData) {
      cards[0].value = res.cardData.unplateEnterCount || 0;
      cards[1].value = res.cardData.auditPassRate
        ? `${res.cardData.auditPassRate}%`
        : '0%';
    }

    // 使用模拟数据测试
    // const mockData = [
    //   { "stationName": "泉州万达旗舰充电站", "count": 10 },
    //   { "stationName": "仓山万达地下停车场", "count": 20 },
    //   { "stationName": "晋安湖公园东侧场站", "count": 30 },
    //   { "stationName": "马尾自贸区产业园区站", "count": 5 },
    //   { "stationName": "长乐国际机场T1航站楼", "count": 8 }
    // ];

    // state.chartData = {
    //   stationUnplateCount: mockData
    // };
    // state.hasData = true;

    // initCharts();

    // 正式代码（暂时注释）
    const hasChartData = res?.stationUnplateCount?.length > 0;
    if (hasChartData) {
      state.chartData = {
        stationUnplateCount: res.stationUnplateCount || [],
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

function initBarChart() {
  if (!barChartRef.value) return;
  if (barChartInstance) barChartInstance.dispose();
  barChartInstance = echarts.init(barChartRef.value);
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '各场站无牌入场量',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500 },
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: state.chartData.stationUnplateCount.map((item) => item.stationName),
    },
    yAxis: { type: 'value', name: '入场量' },
    series: [
      {
        type: 'bar',
        data: state.chartData.stationUnplateCount.map((item) => item.count),
        itemStyle: { borderRadius: [4, 4, 0, 0], color: '#FF9F40' },
        label: { show: true, position: 'top' },
      },
    ],
  };
  barChartInstance.setOption(option);

  // 添加点击事件
  barChartInstance.on('click', (params) => {
    window.dispatchEvent(
      new CustomEvent('filterByChart:unplateEnter', {
        detail: { stationName: params.name },
      }),
    );
  });
}

function initCharts() {
  initBarChart();
}

function handleCardClick(key) {
  const pad = (n) => String(n).padStart(2, '0');
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const todayStart = `${dateStr} 00:00:00`;
  const todayEnd = `${dateStr} 23:59:59`;

  const filterMap = {
    total: { registerTime: [todayStart, todayEnd] },
    passRate: { status: '已通过' },
    pending: { status: '待审核' },
  };

  const filterParams = filterMap[key];
  if (filterParams) {
    window.dispatchEvent(
      new CustomEvent('filterByChart:unplateEnter', { detail: filterParams }),
    );
  }
}

onMounted(() => {
  loadChartData();
  window.addEventListener('resize', () => {
    barChartInstance?.resize();
  });
});
onUnmounted(() => {
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
    <div v-if="state.hasData" class="chart-wrapper">
      <div class="chart-container">
        <div ref="barChartRef" style="width: 100%; height: 100%"></div>
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
      height: 330px;
      padding: 10px;
      background-color: hsl(var(--card));
      border-radius: 8px;
      box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
    }
  }
}
</style>
