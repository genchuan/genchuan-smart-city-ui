<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

import IconButton from '#/components/common/IconButton.vue';
import MapComponent from '#/genchuan-components/Map/index.vue';

const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: () => ({
      cards: [],
      charts: [],
    }),
  },
  showMapToggle: {
    type: Boolean,
    default: false,
  },
  mapData: {
    type: Array,
    default: () => [],
  },
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
});

const emit = defineEmits([
  'barClick',
  'cardClick',
  'chartClick',
  'lineClick',
  'pieClick',
]);

const chartRefs = ref({});
const chartInstances = ref({});
const showMap = ref(false);
const toggleView = () => {
  showMap.value = !showMap.value;
  // 当切换回图表视图时，重新初始化图表
  if (!showMap.value) {
    // 使用nextTick确保DOM已经更新
    setTimeout(() => {
      initCharts();
    }, 0);
  }
};

const initCharts = () => {
  props.data.charts.forEach((chart, index) => {
    const chartRef = chartRefs.value[`chart-${index}`];
    if (!chartRef) return;

    if (chartInstances.value[`chart-${index}`]) {
      chartInstances.value[`chart-${index}`].dispose();
    }

    const chartInstance = echarts.init(chartRef);
    chartInstances.value[`chart-${index}`] = chartInstance;

    const option = getChartOption(chart);
    chartInstance.setOption(option);
    chartInstance.off('click');
    chartInstance.on('click', (params) => {
      const payload = {
        chart,
        dataIndex: params.dataIndex,
        name: String(params.name || ''),
        value: params.value,
      };

      switch (chart.type) {
        case 'bar': {
          emit('barClick', payload);
          break;
        }
        case 'line': {
          emit('lineClick', payload);
          break;
        }
        case 'pie': {
          emit('pieClick', payload);
          break;
        }
        // No default
      }

      emit('chartClick', payload);

      if (typeof chart.onClick === 'function') {
        chart.onClick(payload);
      }
    });
  });
};

const handleCardClick = (card, index) => {
  emit('cardClick', { card, index, type: card.type });

  if (typeof card.onClick === 'function') {
    card.onClick({ card, index });
  }
};

const getChartOption = (chart) => {
  const freshColors = ['#4A90E2', '#50E3C2', '#FF9F40', '#A17FE0', '#FF6B8B'];

  const option = {
    backgroundColor: 'transparent',
    title:
      chart.type === 'pie'
        ? undefined
        : {
            text: chart.title,
            left: 'center',
            textStyle: {
              color: '#6E7E91',
              fontSize: 16,
              fontWeight: 500,
            },
          },
    tooltip: {
      trigger: chart.type === 'pie' ? 'item' : 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: {
        color: '#6E7E91',
      },
    },
    color: freshColors,
  };

  if (chart.type === 'pie') {
    option.title = {
      text: chart.title,
      left: 'center',
      top: 10,
      textStyle: {
        color: '#6E7E91',
        fontSize: 16,
        fontWeight: 500,
      },
    };
    option.legend = {
      orient: 'horizontal',
      bottom: 5,
      type: 'scroll',
      left: 'center',
      textStyle: {
        color: '#6E7E91',
        fontSize: 11,
      },
      itemWidth: 12,
      itemHeight: 12,
      formatter(name) {
        // 名称过长时截断
        return name.length > 5 ? `${name.slice(0, 5)}...` : name;
      },
    };
    option.series = [
      {
        name: chart.title,
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
        data: chart.data,
      },
    ];
  } else if (chart.type === 'line' || chart.type === 'bar') {
    option.grid = {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
      backgroundColor: 'transparent',
    };
    option.xAxis = {
      type: 'category',
      boundaryGap: chart.type === 'bar',
      data: chart.xAxis,
      axisLabel: {
        show: chart.showXAxisLabel !== false,
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
        show: false,
      },
    };
    option.yAxis = {
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
    };
    option.series = [
      {
        name: chart.title,
        type: chart.type,
        data: chart.series,
        itemStyle: {
          borderRadius: chart.type === 'bar' ? [4, 4, 0, 0] : undefined,
        },
        smooth: chart.type === 'line',
        lineStyle:
          chart.type === 'line'
            ? {
                width: 3,
              }
            : undefined,
        symbol: chart.type === 'line' ? 'circle' : undefined,
        symbolSize: chart.type === 'line' ? 6 : undefined,
        label: {
          show: chart.type === 'bar',
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
            show: chart.type === 'bar',
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
      },
    ];
  }

  return option;
};

const handleResize = () => {
  Object.values(chartInstances.value).forEach((chartInstance) => {
    chartInstance.resize();
  });
};

watch(
  () => props.data,
  () => {
    initCharts();
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  Object.values(chartInstances.value).forEach((chartInstance) => {
    chartInstance.dispose();
  });
});
</script>

<template>
  <div class="park-chart-box">
    <!-- 卡片区域 -->
    <div class="chart-box-left">
      <div
        v-for="(card, index) in data.cards"
        :key="`card-${index}`"
        class="stat-card"
        :class="{ 'stat-card-clickable': typeof card.onClick === 'function' }"
        :style="{
          borderLeftColor: card.color || '#13ce66',
        }"
        @click="handleCardClick(card, index)"
      >
        <div class="card-header">
          <h3 class="card-title">{{ card.title }}</h3>
          <div
            class="card-indicator"
            :style="{ backgroundColor: card.color || '#13ce66' }"
          ></div>
        </div>
        <div class="card-body">
          <div class="card-value">{{ card.value }}</div>
          <div class="card-desc" v-if="card.desc">{{ card.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 图表/地图区域 -->
    <div v-if="!showMap" class="charts-wrapper">
      <!-- 地图/图表切换按钮 -->
      <div v-if="showMapToggle" class="toggle-container">
        <IconButton
          :content="showMap ? '图表' : '地图'"
          icon-name="Switch"
          @click="toggleView"
          class="toggle-button"
        />
      </div>
      <div
        v-for="(chart, index) in data.charts"
        :key="`chart-${index}`"
        :class="{
          'simple-bar-chart': chart.type !== 'pie', // 非圆环图（pie）添加类名
          'park-type-chart': chart.type === 'pie', // 圆环图添加类名
        }"
        :ref="(el) => (chartRefs[`chart-${index}`] = el)"
      ></div>
    </div>
    <!-- 地图区域 -->
    <div v-else class="map-wrapper">
      <!-- 地图/图表切换按钮 -->
      <div v-if="showMapToggle" class="toggle-container">
        <IconButton
          :content="showMap ? '图表' : '地图'"
          icon-name="Switch"
          @click="toggleView"
          class="toggle-button"
        />
      </div>
      <MapComponent
        :data="mapData"
        :marker-icons="mapConfig.markerIcons"
        :status-icon-map="mapConfig.statusIconMap"
        :status-key-map="mapConfig.statusKeyMap"
        :info-window-config="mapConfig.infoWindowConfig"
      />
    </div>
  </div>
</template>

<style scoped>
.park-chart-box {
  display: flex;
  flex-wrap: nowrap; /* 强制不换行 */
  gap: 20px;
  width: 100%;
  height: auto;
  min-height: 300px;
  overflow: hidden; /* 防止内容溢出 */
}

.chart-box-left {
  display: flex;
  flex-shrink: 0; /* 防止卡片区域被压缩 */
  flex-direction: column;
  gap: 16px;
  width: 200px;
}

.stat-card-clickable {
  cursor: pointer;
}

.charts-wrapper {
  position: relative;
  display: flex;
  flex: 1 1 0; /* 允许收缩和增长 */
  gap: 20px;
  min-width: 0; /* 允许内容收缩到小于内容宽度 */
}

.map-wrapper {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  height: 280px;
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

.simple-bar-chart,
.park-type-chart {
  flex: 1;
  min-width: 0;
  height: 280px;
}
</style>
