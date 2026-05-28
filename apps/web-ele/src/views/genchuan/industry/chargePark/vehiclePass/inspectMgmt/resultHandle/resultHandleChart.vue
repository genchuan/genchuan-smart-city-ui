<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getResultHandleChart } from '#/api/genchuan/industry/chargePark/vehiclePass/inspectMgmt/resultHandle';

const props = defineProps({
  parkId: { type: Number, default: null },
});

const cards = reactive([
  {
    title: '处置完成率',
    value: '0%',
    desc: '处置进度',
    color: '#50E3C2',
    key: 'handleCompleteRate',
  },
  {
    title: '违规整改率',
    value: '0%',
    desc: '整改进度',
    color: '#4A90E2',
    key: 'violationRectifyRate',
  },
]);

const state = reactive({
  chartData: {
    handleResultRate: [],
  },
  hasData: false,
});

const pieChartRef = ref(null);
let pieChartInstance = null;

async function loadChartData() {
  try {
    const params = {
      areaId: props.parkId,
    };

    const res = await getResultHandleChart(params);

    // 更新卡片数据
    if (res?.cardData) {
      cards[0].value = res.cardData.handleCompleteRate
        ? `${res.cardData.handleCompleteRate}%`
        : '0%';

      cards[1].value = res.cardData.violationRectifyRate
        ? `${res.cardData.violationRectifyRate}%`
        : '0%';
    }

    // 检查是否有图表数据
    const hasChartData = res?.handleResultRate?.length > 0;

    if (hasChartData) {
      state.chartData = {
        handleResultRate: res.handleResultRate || [],
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

  const colors = ['#67C23A', '#E6A23C', '#F56C6C', '#909399'];
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '处置结果占比',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500, color: '#303133' },
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return `${params.name}<br/>数量: ${params.value}<br/>占比: ${params.percent}%`;
      },
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#333',
      textStyle: { color: '#fff' },
    },
    legend: {
      bottom: 10,
      left: 'center',
      textStyle: { color: '#606266' },
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: state.chartData.handleResultRate.map((item, index) => ({
          name: item.name,
          value: item.value,
          itemStyle: { color: colors[index % colors.length] },
        })),
        label: {
          show: true,
          formatter: '{b}: {d}%',
          color: '#606266',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
      },
    ],
  };

  pieChartInstance.setOption(option);

  // 添加点击事件，实现下钻
  pieChartInstance.on('click', (params) => {
    handlePieClick(params.name);
  });

  // 鼠标悬停提示可点击
  pieChartInstance.on('mouseover', () => {
    pieChartRef.value.style.cursor = 'pointer';
  });
}

function initCharts() {
  initPieChart();
}

// 处理饼图点击事件 - 下钻到对应状态的记录
function handlePieClick(name) {
  const filterKey = name;

  window.dispatchEvent(
    new CustomEvent('filterByChart:resultHandle', {
      detail: { status: name, filterKey },
    }),
  );
}

// 处理卡片点击事件 - 精确下钻
function handleCardClick(key) {
  if (key === 'handleCompleteRate') {
    // 处置完成率：筛选已完成的记录
    window.dispatchEvent(
      new CustomEvent('filterByChart:resultHandle', {
        detail: { status: '已完成', filterKey: 'handleCompleteRate' },
      }),
    );
  } else if (key === 'violationRectifyRate') {
    // 违规整改率：筛选已整改状态的记录
    window.dispatchEvent(
      new CustomEvent('filterByChart:resultHandle', {
        detail: { rectifyStatus: '已整改', filterKey: 'violationRectifyRate' },
      }),
    );
  }
}

onMounted(() => {
  loadChartData();
  window.addEventListener('resize', () => {
    pieChartInstance?.resize();
  });
});

onUnmounted(() => {
  pieChartInstance?.dispose();
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
        <div ref="pieChartRef" style="width: 100%; height: 100%"></div>
      </div>
    </div>
    <div v-else class="chart-wrapper">
      <div class="chart-container no-data">
        <el-empty description="暂无数据" />
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
      padding: 16px 14px;
      overflow: hidden;
      cursor: pointer;
      border-left: 4px solid #4a90e2;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
      transition: all 0.3s ease;
      position: relative;
      background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, transparent 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }

      &:hover {
        box-shadow: 0 6px 16px rgb(0 0 0 / 15%);
        transform: translateY(-4px);
        background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);

        &::before {
          opacity: 1;
        }
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
          box-shadow: 0 0 8px currentColor;
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
    position: relative;

    .chart-container {
      flex: 1;
      min-width: 0;
      height: 330px;
      padding: 10px;
      background-color: hsl(var(--card));
      border-radius: 8px;
      box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
      position: relative;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
      }

      &.no-data {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
