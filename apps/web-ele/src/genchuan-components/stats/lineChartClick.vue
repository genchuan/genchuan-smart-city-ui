<!-- /components/stats/line.vue -->
<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

const props = defineProps({
  title: { type: String, default: '数据统计' },
  xData: { type: Array, required: true },
  seriesData: { type: Array, required: true },
  yName: { type: String, default: '' },
  smooth: { type: Boolean, default: true },
});

const emit = defineEmits(['lineClick']);

const chartRef = ref(null);
let chartInstance = null;
let resizeTimer = null;
const defaultColors = ['#FF6B6B', '#FFD166', '#4a90e2', '#06D6A0'];

const debounce = (fn, delay = 300) => {
  return (...args) => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => fn.apply(this, args), delay);
  };
};

const checkContainerValid = () => {
  if (!chartRef.value) return false;
  const rect = chartRef.value.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
};

const initChart = async () => {
  await nextTick();

  if (!checkContainerValid()) {
    console.warn('ECharts 容器无效，200ms 后重试');
    setTimeout(initChart, 200);
    return;
  }

  if (chartInstance) {
    try {
      chartInstance.dispose();
    } catch (error) {
      console.warn('销毁旧 ECharts 实例失败', error);
    }
    chartInstance = null;
  }

  try {
    chartInstance = echarts.init(chartRef.value);

    const option = {
      title: {
        text: props.title,
        left: 'center',
        textStyle: { fontSize: 15, fontWeight: 300, color: '#6E7E91' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: {
        top: 40,
        left: 'center',
        textStyle: { fontSize: 12, color: '#6E7E91' },
      },
      grid: {
        left: '4%',
        right: '8%',
        bottom: '3%',
        containLabel: true,
        backgroundColor: 'transparent',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: props.xData,
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
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        name: props.yName,
        axisLabel: {
          color: '#9AA8B7',
          fontSize: 11,
        },
        axisLine: {
          lineStyle: {
            color: '#9AA8B7',
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
      series: props.seriesData.map((seriesItem, idx) => {
        const seriesColor =
          seriesItem.color || defaultColors[idx % defaultColors.length];
        return {
          name: seriesItem.name,
          type: 'line',
          smooth: props.smooth,
          data: seriesItem.data.map((value) => ({ value })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: `rgba(${Number.parseInt(seriesColor.slice(1, 3), 16)}, ${Number.parseInt(seriesColor.slice(3, 5), 16)}, ${Number.parseInt(seriesColor.slice(5, 7), 16)}, 0.3)`,
            },
          },
          lineStyle: {
            width: 2,
            color: seriesColor,
          },
          itemStyle: {
            color: seriesColor,
            borderWidth: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${seriesColor}80` },
              { offset: 1, color: `${seriesColor}10` },
            ]),
          },
        };
      }),
    };

    chartInstance.setOption(option, {
      notMerge: false,
      lazyUpdate: false,
    });

    chartInstance.off('click');
    chartInstance.on('click', (params) => {
      if (params.componentType === 'series') {
        const { seriesName, name: categoryName, value, dataIndex } = params;
        emit('lineClick', {
          type: 'series',
          seriesName,
          categoryName,
          value: value?.value ?? value,
          dataIndex,
        });
      } else if (params.componentType === 'xAxis') {
        emit('lineClick', {
          type: 'xAxis',
          categoryName: params.value,
        });
      }
    });
  } catch (error) {
    console.error('ECharts 初始化失败', error);
    chartInstance = null;
  }
};

watch(
  [() => props.xData, () => props.seriesData, () => props.smooth],
  () => {
    if (chartRef.value) {
      initChart();
    }
  },
  { deep: true, immediate: false },
);

const resizeHandler = debounce(() => {
  if (chartInstance && checkContainerValid()) {
    chartInstance.resize();
  }
});

onMounted(() => {
  nextTick(() => {
    initChart();
    window.addEventListener('resize', resizeHandler);
  });
});

onUnmounted(() => {
  clearTimeout(resizeTimer);
  window.removeEventListener('resize', resizeHandler);
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<template>
  <div
    ref="chartRef"
    style="
      min-width: 200px !important;
      max-width: 100%;
      height: 330px;
      background-color: hsl(var(--card));
      border-radius: 8px;
      box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
    "
  ></div>
</template>
