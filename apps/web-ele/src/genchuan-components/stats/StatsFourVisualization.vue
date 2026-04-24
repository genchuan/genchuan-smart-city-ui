<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';
import { ElOption, ElSelect } from 'element-plus';

import IconButton from '#/components/common/IconButton.vue';
import MapComponent from '#/genchuan-components/Map/index.vue';

const props = defineProps({
  // 卡片数据
  cards: {
    type: Array,
    default: () => [],
  },
  // 是否显示地图切换按钮
  showMapToggle: {
    type: Boolean,
    default: false,
  },
  // 地图数据
  mapData: {
    type: Array,
    default: () => [],
  },
  // 地图配置
  mapConfig: {
    type: Object,
    default: () => ({
      markerIcons: {
        normal: '/static/imgs/dataHub/map/marker-blue.png',
      },
      statusIconMap: {
        green: 'normal',
        orange: 'normal',
        red: 'normal',
        blue: 'normal',
        gray: 'normal',
      },
      statusKeyMap: {
        正常: 'green',
        异常: 'red',
        离线: 'red',
        维护中: 'orange',
        停用: 'red',
        建设中: 'gray',
      },
      infoWindowConfig: {
        title: 'locationName',
        fields: [
          { key: 'geoCode', label: '地理编码' },
          { key: 'statusName', label: '状态', bold: true },
          { key: 'areaName', label: '区域' },
          { key: 'layerTypeName', label: '图层类型' },
          { key: 'adminCode', label: '行政区划' },
          { key: 'checkResultName', label: '校验结果' },
        ],
      },
    }),
  },
  // 圆环图选项列表，用于下拉切换
  pieChartOptions: {
    type: Array,
    default: () => [],
    // 格式: [{ label: '选项1', value: 'key1', data: [...] }, ...]
  },
  // 柱状/折线图选项列表，用于下拉切换
  barLineChartOptions: {
    type: Array,
    default: () => [],
    // 格式: [{ label: '选项1', value: 'key1', type: 'bar', data: {...} }, ...]
  },
  // 当前选中的圆环图索引（可由父组件控制）
  currentPieIndex: {
    type: Number,
    default: 0,
  },
  // 当前选中的柱状/折线图索引（可由父组件控制）
  currentBarLineIndex: {
    type: Number,
    default: 0,
  },
  // 默认是否显示地图
  defaultShowMap: {
    type: Boolean,
    default: false,
  },
  // 圆环图标题
  pieChartTitle: {
    type: String,
    default: '分布统计',
  },
  // 柱状/折线图标题
  barLineChartTitle: {
    type: String,
    default: '趋势统计',
  },
});

const emit = defineEmits([
  'update:currentPieIndex',
  'update:currentBarLineIndex',
  'pieChartChange',
  'barLineChartChange',
  'cardClick',
  'pieClick',
  'barLineClick',
]);

// 图表引用
const pieChartRef1 = ref(null);
const pieChartRef2 = ref(null);
const barLineChartRef = ref(null);
let pieChartInstance1 = null;
let pieChartInstance2 = null;
let barLineChartInstance = null;

// 显示地图状态
const showMap = ref(props.defaultShowMap);

// 当前选中的图表索引（本地状态）- 两个圆环图各自独立
// 默认第一个圆环图显示第一个选项，第二个圆环图显示第二个选项（如果存在）
const localPieIndex1 = ref(0);
const localPieIndex2 = ref(
  props.currentPieIndex > 0 ? props.currentPieIndex : 1,
);
const localBarLineIndex = ref(props.currentBarLineIndex);

// 计算第一个圆环图数据
const currentPieData1 = computed(() => {
  if (props.pieChartOptions.length === 0) return null;
  const index = localPieIndex1.value;
  if (index < 0 || index >= props.pieChartOptions.length) {
    return props.pieChartOptions[0];
  }
  return props.pieChartOptions[index];
});

// 计算第二个圆环图数据
const currentPieData2 = computed(() => {
  if (props.pieChartOptions.length === 0) return null;
  const index = localPieIndex2.value;
  if (index < 0 || index >= props.pieChartOptions.length) {
    return props.pieChartOptions[0];
  }
  return props.pieChartOptions[index];
});

// 计算当前选中的柱状/折线图数据
const currentBarLineData = computed(() => {
  if (props.barLineChartOptions.length === 0) return null;
  const index = localBarLineIndex.value;
  if (index < 0 || index >= props.barLineChartOptions.length) {
    return props.barLineChartOptions[0];
  }
  return props.barLineChartOptions[index];
});

// 切换地图/图表视图
const toggleView = () => {
  showMap.value = !showMap.value;
  if (!showMap.value) {
    setTimeout(() => {
      initCharts();
    }, 0);
  }
};

const handleCardClick = (card) => {
  emit('cardClick', card);
};

// 第一个圆环图切换
const handlePie1Change = (index) => {
  localPieIndex1.value = index;
  initPieChart1();
};

// 第二个圆环图切换
const handlePie2Change = (index) => {
  localPieIndex2.value = index;
  emit('update:currentPieIndex', index);
  emit('pieChartChange', props.pieChartOptions[index]);
  initPieChart2();
};

// 柱状/折线图切换
const handleBarLineChange = (index) => {
  localBarLineIndex.value = index;
  emit('update:currentBarLineIndex', index);
  emit('barLineChartChange', props.barLineChartOptions[index]);
  initBarLineChart();
};

// 获取圆环图配置
const getPieOption = (chartData) => {
  const freshColors = [
    '#4A90E2',
    '#50E3C2',
    '#FF9F40',
    '#A17FE0',
    '#FF6B8B',
    '#FFD93D',
  ];

  return {
    backgroundColor: 'transparent',
    title: {
      text: chartData?.label || props.pieChartTitle,
      left: 'center',
      top: 10,
      textStyle: {
        color: '#6E7E91',
        fontSize: 14,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: {
        color: '#6E7E91',
      },
    },
    color: freshColors,
    legend: {
      orient: 'horizontal',
      bottom: 5,
      type: 'scroll',
      left: 'center',
      textStyle: {
        color: '#6E7E91',
        fontSize: 10,
      },
      itemWidth: 10,
      itemHeight: 10,
      formatter(name) {
        return name.length > 4 ? `${name.slice(0, 4)}...` : name;
      },
    },
    series: [
      {
        name: chartData?.label || props.pieChartTitle,
        type: 'pie',
        radius: ['35%', '55%'],
        center: ['50%', '52%'],
        avoidLabelOverlap: true,
        minShowLabelAngle: 5,
        label: {
          show: true,
          position: 'outside',
          formatter(params) {
            const name =
              params.name.length > 4
                ? `${params.name.slice(0, 4)}...`
                : params.name;
            return `{name|${name}}\n{percent|${params.percent}%}`;
          },
          rich: {
            name: {
              color: '#6E7E91',
              fontSize: 11,
              lineHeight: 16,
              align: 'center',
            },
            percent: {
              color: '#4A90E2',
              fontSize: 12,
              fontWeight: 'bold',
              lineHeight: 16,
              align: 'center',
            },
          },
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold',
          },
          scale: true,
          scaleSize: 5,
        },
        labelLine: {
          show: true,
          length: 12,
          length2: 8,
          smooth: true,
          lineStyle: {
            color: '#9AA8B7',
            width: 1,
          },
        },
        itemStyle: {
          borderWidth: 2,
          borderColor: '#fff',
        },
        data: chartData?.data || [],
      },
    ],
  };
};

// 获取柱状/折线图配置
const getBarLineOption = (chartData) => {
  const freshColors = ['#4A90E2', '#50E3C2', '#FF9F40', '#A17FE0', '#FF6B8B'];
  const type = chartData?.type || 'bar';

  return {
    backgroundColor: 'transparent',
    title: {
      text: chartData?.label || props.barLineChartTitle,
      left: 'center',
      top: 5,
      textStyle: {
        color: '#6E7E91',
        fontSize: 14,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: {
        color: '#6E7E91',
      },
    },
    color: freshColors,
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '40px',
      containLabel: true,
      backgroundColor: 'transparent',
    },
    xAxis: {
      type: 'category',
      boundaryGap: type === 'bar',
      data: chartData?.data?.xAxis || [],
      axisLabel: {
        color: '#9AA8B7',
        fontSize: 11,
        rotate: chartData?.data?.xAxis?.length > 8 ? 30 : 0,
      },
      axisLine: {
        lineStyle: {
          color: '#E8F4FD',
        },
      },
      axisTick: {
        lineStyle: {
          color: '#E8F4FD',
        },
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#9AA8B7',
        fontSize: 11,
      },
      axisLine: {
        lineStyle: {
          color: '#E8F4FD',
        },
      },
      axisTick: {
        lineStyle: {
          color: '#E8F4FD',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#F0F6FC',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: chartData?.label || props.barLineChartTitle,
        type,
        data: chartData?.data?.series || [],
        itemStyle: {
          borderRadius: type === 'bar' ? [4, 4, 0, 0] : undefined,
          color: freshColors[0],
        },
        smooth: type === 'line',
        lineStyle:
          type === 'line'
            ? {
                width: 3,
                color: freshColors[0],
              }
            : undefined,
        symbol: type === 'line' ? 'circle' : undefined,
        symbolSize: type === 'line' ? 6 : undefined,
        label: {
          show: type === 'bar',
          position: 'top',
          color: '#6E7E91',
          fontSize: 12,
          formatter: '{c}',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(74, 144, 226, 0.3)',
          },
          label: {
            show: type === 'bar',
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        areaStyle:
          type === 'line'
            ? {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(74, 144, 226, 0.3)' },
                  { offset: 1, color: 'rgba(74, 144, 226, 0.05)' },
                ]),
              }
            : undefined,
      },
    ],
  };
};

// 初始化第一个圆环图
const initPieChart1 = () => {
  if (pieChartRef1.value && currentPieData1.value) {
    try {
      if (pieChartInstance1) {
        pieChartInstance1.dispose();
        pieChartInstance1 = null;
      }

      if (currentPieData1.value.data && currentPieData1.value.data.length > 0) {
        pieChartInstance1 = echarts.init(pieChartRef1.value);
        const option = getPieOption(currentPieData1.value);
        pieChartInstance1.setOption(option);
        pieChartInstance1.on('click', (params) => {
          emit('pieClick', {
            chartIndex: 1,
            chartKey: currentPieData1.value?.value,
            data: params,
          });
        });
      }
    } catch (error) {
      console.error('初始化第一个圆环图失败:', error);
    }
  }
};

// 初始化第二个圆环图
const initPieChart2 = () => {
  if (pieChartRef2.value && currentPieData2.value) {
    try {
      if (pieChartInstance2) {
        pieChartInstance2.dispose();
        pieChartInstance2 = null;
      }

      if (currentPieData2.value.data && currentPieData2.value.data.length > 0) {
        pieChartInstance2 = echarts.init(pieChartRef2.value);
        const option = getPieOption(currentPieData2.value);
        pieChartInstance2.setOption(option);
        pieChartInstance2.on('click', (params) => {
          emit('pieClick', {
            chartIndex: 2,
            chartKey: currentPieData2.value?.value,
            data: params,
          });
        });
      }
    } catch (error) {
      console.error('初始化第二个圆环图失败:', error);
    }
  }
};

// 初始化圆环图（两个圆环区域都可以切换）
const initPieCharts = () => {
  initPieChart1();
  initPieChart2();
};

// 初始化柱状/折线图
const initBarLineChart = () => {
  // 确保 DOM 元素和数据都存在
  if (
    !barLineChartRef.value ||
    !currentBarLineData.value ||
    !currentBarLineData.value.data
  )
    return;
  // 确保数据不为空
  if (
    !currentBarLineData.value.data.xAxis ||
    currentBarLineData.value.data.xAxis.length === 0
  )
    return;

  try {
    if (barLineChartInstance) {
      barLineChartInstance.dispose();
      barLineChartInstance = null;
    }

    barLineChartInstance = echarts.init(barLineChartRef.value);
    const option = getBarLineOption(currentBarLineData.value);
    barLineChartInstance.setOption(option);
    barLineChartInstance.on('click', (params) => {
      emit('barLineClick', {
        chartType: currentBarLineData.value?.type || 'bar',
        chartKey: currentBarLineData.value?.value,
        data: params,
      });
    });
  } catch (error) {
    console.error('初始化柱状/折线图失败:', error);
  }
};

// 初始化所有图表
const initCharts = () => {
  initPieCharts();
  initBarLineChart();
};

// 处理窗口大小变化
const handleResize = () => {
  pieChartInstance1?.resize();
  pieChartInstance2?.resize();
  barLineChartInstance?.resize();
};

// 监听数据变化
watch(
  () => props.pieChartOptions,
  () => {
    initPieCharts();
  },
  { deep: true },
);

watch(
  () => props.barLineChartOptions,
  () => {
    initBarLineChart();
  },
  { deep: true },
);

watch(
  () => props.currentPieIndex,
  (newVal) => {
    if (newVal !== localPieIndex2.value) {
      localPieIndex2.value = newVal;
      initPieChart2();
    }
  },
);

watch(
  () => props.currentBarLineIndex,
  (newVal) => {
    if (newVal !== localBarLineIndex.value) {
      localBarLineIndex.value = newVal;
      initBarLineChart();
    }
  },
);

watch(
  () => props.defaultShowMap,
  (newVal) => {
    showMap.value = newVal;
  },
);

onMounted(() => {
  // 使用 nextTick 确保 DOM 已经渲染完成
  nextTick(() => {
    initCharts();
  });
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (pieChartInstance1) {
    pieChartInstance1.dispose();
    pieChartInstance1 = null;
  }
  if (pieChartInstance2) {
    pieChartInstance2.dispose();
    pieChartInstance2 = null;
  }
  if (barLineChartInstance) {
    barLineChartInstance.dispose();
    barLineChartInstance = null;
  }
});
</script>

<template>
  <div class="stats-four-visualization">
    <!-- 卡片区 - 2x2网格布局 -->
    <div class="cards-section">
      <div
        v-for="(card, index) in cards"
        :key="`card-${index}`"
        class="stat-card"
        :style="{
          borderLeftColor: card.color || '#4A90E2',
        }"
        @click="handleCardClick(card)"
      >
        <div class="card-header">
          <span class="card-title">{{ card.title }}</span>
          <div
            class="card-indicator"
            :style="{ backgroundColor: card.color || '#4A90E2' }"
          ></div>
        </div>
        <div class="card-body">
          <div class="card-value" :style="{ color: card.color || '#4A90E2' }">
            {{ card.value }}
          </div>
          <div class="card-desc" v-if="card.desc">{{ card.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧展示区 -->
    <div class="right-section">
      <!-- 地图/图表切换按钮 -->
      <div v-if="showMapToggle" class="toggle-container">
        <IconButton
          :content="showMap ? '图表' : '地图'"
          icon-name="Switch"
          @click="toggleView"
          class="toggle-button"
        />
      </div>

      <!-- 地图视图 -->
      <div v-if="showMap" class="map-wrapper">
        <MapComponent
          :data="mapData"
          :marker-icons="mapConfig.markerIcons"
          :status-icon-map="mapConfig.statusIconMap"
          :status-key-map="mapConfig.statusKeyMap"
          :info-window-config="mapConfig.infoWindowConfig"
        />
      </div>

      <!-- 图表视图 - 两个圆环图 + 一个较宽图表 -->
      <div v-else class="charts-section">
        <!-- 第一个圆环图展示区（带切换） -->
        <div class="pie-chart-area">
          <!-- 下拉切换按钮 -->
          <div v-if="pieChartOptions.length > 1" class="chart-select-wrapper">
            <ElSelect
              :model-value="localPieIndex1"
              size="small"
              class="chart-select"
              @change="handlePie1Change"
            >
              <ElOption
                v-for="(option, idx) in pieChartOptions"
                :key="idx"
                :label="option.label"
                :value="idx"
              />
            </ElSelect>
          </div>
          <div ref="pieChartRef1" class="chart-container"></div>
        </div>

        <!-- 第二个圆环图展示区（带切换） -->
        <div class="pie-chart-area">
          <!-- 下拉切换按钮 -->
          <div v-if="pieChartOptions.length > 1" class="chart-select-wrapper">
            <ElSelect
              :model-value="localPieIndex2"
              size="small"
              class="chart-select"
              @change="handlePie2Change"
            >
              <ElOption
                v-for="(option, idx) in pieChartOptions"
                :key="idx"
                :label="option.label"
                :value="idx"
              />
            </ElSelect>
          </div>
          <div ref="pieChartRef2" class="chart-container"></div>
        </div>

        <!-- 柱状/折线图展示区（更宽） -->
        <div class="bar-line-chart-area">
          <!-- 下拉切换按钮 -->
          <div
            v-if="barLineChartOptions.length > 1"
            class="chart-select-wrapper bar-line-select"
          >
            <ElSelect
              :model-value="localBarLineIndex"
              size="small"
              class="chart-select"
              @change="handleBarLineChange"
            >
              <ElOption
                v-for="(option, idx) in barLineChartOptions"
                :key="idx"
                :label="option.label"
                :value="idx"
              />
            </ElSelect>
          </div>
          <div ref="barLineChartRef" class="chart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-four-visualization {
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  width: 100%;
  height: auto;
  min-height: 320px;
  overflow: hidden;
}

/* 卡片区样式 - 2x2网格布局 */
.cards-section {
  display: grid;
  flex-shrink: 0;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 260px;
  height: 320px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  padding: 12px 14px;
  overflow: hidden;
  background: #fff;
  border-left: 4px solid #4a90e2;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-title {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  color: #6e7e91;
  white-space: nowrap;
}

.card-indicator {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
}

.card-value {
  margin-bottom: 4px;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
}

.card-desc {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
  line-height: 1.3;
  color: #9aa8b7;
  white-space: nowrap;
}

/* 右侧展示区样式 */
.right-section {
  position: relative;
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  height: 320px;
}

.toggle-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1999;
}

.toggle-button {
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
}

/* 地图容器 */
.map-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
}

/* 图表区样式 */
.charts-section {
  display: flex;
  flex: 1;
  gap: 20px;
  min-width: 0;
}

/* 圆环图区域 */
.pie-chart-area {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 320px;
}

.chart-select-wrapper {
  position: absolute;
  top: 8px;
  left: 10px;
  z-index: 10;
}

.chart-select {
  width: 90px;
}

.chart-select :deep(.el-input__wrapper) {
  background-color: rgb(255 255 255 / 95%);
  box-shadow: 0 1px 4px rgb(0 0 0 / 10%);
}

.chart-select :deep(.el-input__inner) {
  font-size: 12px;
}

.chart-container {
  width: 100%;
  height: 100%;
}

/* 柱状/折线图区域 - 更宽 */
.bar-line-chart-area {
  position: relative;
  flex: 1.5;
  min-width: 0;
  height: 320px;
}

.bar-line-select {
  left: 10px;
}
</style>
