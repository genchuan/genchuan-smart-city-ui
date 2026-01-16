<script setup>
import {
  defineProps,
  ref,
  onMounted,
  onUnmounted,
  watch,
  nextTick
} from 'vue';
import * as echarts from 'echarts';
import {fetchFlightGanttData} from '#/api/genchuan/industry/parkingmgmt/overview/RiskWarning.ts';

const props = defineProps({
  title: {
    type: String,
    default: 'Gantt of Airport Flight'
  },
  baseFontScale: {
    type: Number,
    default: 1
  }
});

const chartRef = ref(null);
const chartInstance = ref(null);
const chartData = ref({
  flight: {dimensions: [], data: []},
  parkingApron: {dimensions: [], data: []}
});

const vwToPx = (vw) => {
  return window.innerWidth * (vw / 100) * props.baseFontScale;
};

// 核心常量
const HEIGHT_RATIO = 0.6;
const DIM_CATEGORY_INDEX = 0;
const DIM_TIME_ARRIVAL = 1;
const DIM_TIME_DEPARTURE = 2;

// 初始化图表-核心方法 【全部修复完成】
const initChart = () => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }
  if (!chartData.value.flight.data.length || !chartData.value.parkingApron.data.length) return;

  chartInstance.value = echarts.init(chartRef.value);
  const fontSize = vwToPx(0.7);

  const option = {
    tooltip: {
      formatter: (params) => {
        const [idx, arrTime, depTime, flightNo, isVip] = params.data;
        const apronName = chartData.value.parkingApron.data[idx]?.[0] || '未知机位';
        return `航班号：${flightNo}<br/>停机位：${apronName}<br/>到达：${new Date(arrTime).toLocaleString()}<br/>起飞：${new Date(depTime).toLocaleString()}<br/>VIP航班：${isVip ? '是' : '否'}`;
      }
    },
    animation: false,
    backgroundColor: 'transparent',
    title: {
      text: props.title,
      left: 'center',
      textStyle: {fontSize, color: '#929ABA'}
    },
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'filter',
        height: 20,
        bottom: 0,
        start: 0,
        end: 100,
        handleSize: '80%',
        handleStyle: {
          color: '#20c997',
          borderColor: '#fff',
          borderWidth: 1
        }
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'filter',
        zoomOnMouseWheel: true,
        moveOnMouseWheel: true,
        moveOnMouseMove: true,
        preventDefaultMouseMove: true
      },
      {
        type: 'slider',
        yAxisIndex: 0,
        zoomLock: true,
        width: 10,
        right: 10,
        top: 70,
        bottom: 20,
        start: 0,
        end: 100,
        handleSize: '80%',
        handleStyle: {
          color: '#20c997',
          borderColor: '#fff',
          borderWidth: 1
        }
      },
      {
        type: 'inside',
        yAxisIndex: 0,
        moveOnMouseWheel: true,
        moveOnMouseMove: true,
        preventDefaultMouseMove: true
      }
    ],
    grid: {
      show: true,
      top: 70,
      bottom: 20,
      left: 100,
      right: 20,
      backgroundColor: 'transparent',
      borderWidth: 0
    },
    xAxis: {
      type: 'time',
      position: 'top',
      splitLine: {lineStyle: {color: ['#E9EDFF']}},
      axisLine: {show: false},
      axisTick: {lineStyle: {color: '#929ABA'}},
      axisLabel: {color: '#929ABA', fontSize: fontSize - 2},
      boundaryGap: true
    },
    yAxis: {
      axisTick: {show: false},
      splitLine: {show: false},
      axisLine: {show: false},
      axisLabel: {show: false},
      min: 0,
      max: chartData.value.parkingApron.data.length,
      boundaryGap: [0, 0.1]
    },
    series: [
      {
        id: 'flightData',
        type: 'custom',
        renderItem: renderGanttItem,
        dimensions: chartData.value.flight.dimensions,
        encode: {
          x: [DIM_TIME_ARRIVAL, DIM_TIME_DEPARTURE],
          y: DIM_CATEGORY_INDEX,
          tooltip: [0, 1, 2, 3, 4]
        },
        data: chartData.value.flight.data,
        itemStyle: {fill: '#20c997', opacity: 1}
      },
      {
        type: 'custom',
        renderItem: renderAxisLabelItem,
        dimensions: chartData.value.parkingApron.dimensions,
        encode: {x: -1, y: 0},
        data: chartData.value.parkingApron.data.map((item, index) => [index].concat(item))
      }
    ]
  };

  chartInstance.value.setOption(option);
  // 修复鼠标事件穿透问题 + 强制刷新尺寸
  chartInstance.value.getZr().on('mousedown', () => {
  });
  nextTick(() => {
    chartInstance.value && chartInstance.value.resize();
  })
};

// 甘特条自定义渲染
function renderGanttItem(params, api) {
  const categoryIndex = api.value(DIM_CATEGORY_INDEX);
  const timeArrival = api.coord([api.value(DIM_TIME_ARRIVAL), categoryIndex]);
  const timeDeparture = api.coord([api.value(DIM_TIME_DEPARTURE), categoryIndex]);
  let barLength = timeDeparture[0] - timeArrival[0];
  barLength = Math.max(barLength, 2);
  let x = timeArrival[0];
  if (barLength !== timeDeparture[0] - timeArrival[0]) {
    x = timeDeparture[0];
  }
  const barHeight = api.size([0, 1])[1] * HEIGHT_RATIO;
  const y = timeArrival[1] - barHeight / 2;
  const flightNumber = api.value(3) + '';
  const text = barLength > echarts.format.getTextRect(flightNumber).width + 40 ? flightNumber : '';
  const rectNormal = clipRectByRect(params, {x, y, width: barLength, height: barHeight});
  const rectVIP = clipRectByRect(params, {x, y, width: barLength / 2, height: barHeight});

  return {
    type: 'group',
    children: [
      {type: 'rect', ignore: !rectNormal, shape: rectNormal, style: api.style()},
      {
        type: 'rect',
        ignore: !rectVIP || !api.value(4),
        shape: rectVIP,
        style: api.style({fill: '#ffc107', opacity: 1})
      },
      {
        type: 'rect',
        ignore: !rectNormal,
        shape: rectNormal,
        style: {fill: 'transparent', text, textFill: '#fff', fontSize: 12, fontWeight: 'bold'}
      }
    ]
  };
}

// 侧边停机位标签
function renderAxisLabelItem(params, api) {
  const y = api.coord([0, api.value(0)])[1];
  if (y < params.coordSys.y + 5) return;
  return {
    type: 'group',
    position: [10, y],
    children: [
      {
        type: 'path',
        shape: {d: 'M0,0 L0,-20 L30,-20 C42,-20 38,-1 50,-1 L70,-1 L70,0 Z', layout: 'cover'},
        style: {fill: '#20c997'}
      },
      {
        type: 'text',
        style: {x: 24, y: -3, text: api.value(1), textFill: '#fff', textAlign: 'center'}
      },
      {
        type: 'text',
        style: {x: 75, y: -2, text: api.value(2), textFill: '#ccc', textAlign: 'center'}
      }
    ]
  };
}

// 矩形裁剪工具函数
function clipRectByRect(params, rect) {
  return echarts.graphic.clipRectByRect(rect, {
    x: params.coordSys.x,
    y: params.coordSys.y,
    width: params.coordSys.width,
    height: params.coordSys.height
  });
}

// 窗口大小适配
const handleResize = () => {
  nextTick(() => {
    chartInstance.value && chartInstance.value.resize();
  })
};

// 异步请求数据
const getChartData = async () => {
  try {
    const res = await fetchFlightGanttData({});
    chartData.value = res;
    console.log('✅ 航班数据请求成功：', res);
  } catch (err) {
    console.error('航班甘特图数据请求失败:', err);
  }
};

// 监听数据+属性变化，重新渲染
watch(
  [() => chartData.value, () => props.title, () => props.baseFontScale],
  () => {
    if (chartData.value.flight.data.length && chartData.value.parkingApron.data.length) {
      nextTick(() => initChart());
    }
  },
  {deep: true}
);

// 生命周期
onMounted(() => {
  getChartData();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }
});
</script>

<template>
  <div class="chart-container" ref="chartRef" style="width:100%;height:100%;"></div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
  background: transparent;
}
</style>
