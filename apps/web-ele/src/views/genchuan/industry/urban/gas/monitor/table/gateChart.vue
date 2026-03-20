<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '总监测管网路段数', value: 10, color: '#4A90E2' },
    { title: '在线设备数', value: 8, color: '#50E3C2' },
    { title: '设备在线率', value: '80%', color: '#FF9F40' },
    { title: '超标指标数', value: 1, color: '#A17FE0' },
    { title: '正常监测路段数', value: 9, color: '#FF6B8B' },
    { title: '各区域监测路段数', value: 10, color: '#FFD93D' },
  ],
  mapData: [
    { id: 1, locationName: '福州市台江区八一七中路管网段', coordinateInfo: '119.2965,26.0753', statusName: '正常', riskLevel: '低风险' },
    { id: 2, locationName: '厦门市思明区湖滨南路管网段', coordinateInfo: '118.0889,24.4708', statusName: '正常', riskLevel: '低风险' },
    { id: 3, locationName: '泉州市丰泽区刺桐路管网段', coordinateInfo: '118.6880,24.8740', statusName: '异常', riskLevel: '高风险' },
    { id: 4, locationName: '漳州市芗城区胜利路管网段', coordinateInfo: '117.6505,24.5115', statusName: '正常', riskLevel: '低风险' },
    { id: 5, locationName: '莆田市城厢区文献路管网段', coordinateInfo: '119.0071,25.4366', statusName: '已停止', riskLevel: '中风险' },
    { id: 6, locationName: '宁德市蕉城区蕉城南路管网段', coordinateInfo: '119.5268,26.6597', statusName: '正常', riskLevel: '低风险' },
    { id: 7, locationName: '龙岩市新罗区中山路管网段', coordinateInfo: '117.0227,25.1054', statusName: '正常', riskLevel: '低风险' },
    { id: 8, locationName: '三明市梅列区列东街管网段', coordinateInfo: '117.6333,26.2717', statusName: '正常', riskLevel: '低风险' },
    { id: 9, locationName: '南平市延平区解放路管网段', coordinateInfo: '118.1972,26.6597', statusName: '已停止', riskLevel: '中风险' },
    { id: 10, locationName: '平潭综合实验区金井湾管网段', coordinateInfo: '119.7854,25.4615', statusName: '正常', riskLevel: '低风险' },
  ],
  mapConfig: {
    markerIcons: {
      normal: '/static/imgs/dataHub/map/marker-blue.png',
      yellow: '/static/imgs/dataHub/map/marker-yellow.png',
      red: '/static/imgs/dataHub/map/marker-red.png',
    },
    statusIconMap: {
      green: 'normal',
      orange: 'yellow',
      red: 'red',
      blue: 'normal',
      gray: 'normal',
    },
    statusKeyMap: {
      '正常': 'green',
      '异常': 'red',
      '离线': 'red',
      '维护中': 'orange',
      '停用': 'red',
      '建设中': 'gray',
    },
    infoWindowConfig: {
      title: 'locationName',
      fields: [
        { key: 'id', label: '编号' },
        { key: 'statusName', label: '状态', bold: true },
        { key: 'riskLevel', label: '风险等级' },
      ],
    },
  },
});

// 图表引用
const pieChartRef1 = ref(null);
const pieChartRef2 = ref(null);
const barLineChartRef = ref(null);
let pieChartInstance1 = null;
let pieChartInstance2 = null;
let barLineChartInstance = null;

// 显示地图状态
const mapVisible = ref(true);

// 饼图切换状态
const firstChartIndex = ref(0);
const secondChartIndex = ref(1);
const chartIndex = ref(0);

// 第一个饼图的数据
const firstChartData = [
  {
    label: '监测状态占比',
    data: [
      { name: '运行中', value: 8 },
      { name: '已停止', value: 2 },
    ]
  },
  {
    label: '设备在线率',
    data: [
      { name: '在线', value: 8 },
      { name: '离线/异常', value: 2 },
    ]
  }
];

// 第二个饼图的数据
const secondChartData = [
  {
    label: '燃气浓度状态占比',
    data: [
      { name: '正常', value: 9 },
      { name: '超标', value: 1 },
    ]
  },
  {
    label: '预警等级占比',
    data: [
      { name: 'Ⅰ级', value: 5 },
      { name: 'Ⅱ级', value: 4 },
      { name: 'Ⅲ级', value: 1 },
    ]
  }
];

// 所有柱状图的数据（已删除折线图）
const allChartsData = [
  {
    label: '不同区域管网压力对比',
    type: 'bar',
    data: {
      xAxis: ['福州', '厦门', '泉州', '漳州', '莆田', '宁德'],
      series: [0.35, 0.32, 0.45, 0.28, 0.38, 0.33]
    }
  },
  {
    label: '不同区域燃气浓度对比',
    type: 'bar',
    data: {
      xAxis: ['福州', '厦门', '泉州', '漳州', '莆田', '宁德'],
      series: [0.8, 0.5, 1.2, 0.3, 0.9, 0.7]
    }
  }
];

// 切换地图/图表视图
const toggleView = () => {
  mapVisible.value = !mapVisible.value;
  if (!mapVisible.value) {
    setTimeout(() => {
      initCharts();
    }, 0);
  }
};

// 切换第一个饼图
const handlePie1Change = (index) => {
  firstChartIndex.value = index;
  initPieChart1();
};

// 切换第二个饼图
const handlePie2Change = (index) => {
  secondChartIndex.value = index;
  initPieChart2();
};

// 切换图表
const handleBarLineChange = (index) => {
  chartIndex.value = index;
  initBarLineChart();
};

// 获取圆环图配置
const getPieOption = (chartData) => {
  const freshColors = ['#4A90E2', '#50E3C2', '#FF9F40', '#A17FE0', '#FF6B8B', '#FFD93D'];

  return {
    backgroundColor: 'transparent',
    title: {
      text: chartData?.label || '分布统计',
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
        name: chartData?.label || '分布统计',
        type: 'pie',
        radius: ['35%', '55%'],
        center: ['50%', '52%'],
        avoidLabelOverlap: true,
        minShowLabelAngle: 5,
        label: {
          show: true,
          position: 'outside',
          formatter(params) {
            const name = params.name.length > 4 ? `${params.name.slice(0, 4)}...` : params.name;
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
      text: chartData?.label || '趋势统计',
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
        name: chartData?.label || '趋势统计',
        type: type,
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
  if (pieChartRef1.value && firstChartData[firstChartIndex.value]) {
    try {
      if (pieChartInstance1) {
        pieChartInstance1.dispose();
        pieChartInstance1 = null;
      }

      if (firstChartData[firstChartIndex.value].data && firstChartData[firstChartIndex.value].data.length > 0) {
        pieChartInstance1 = echarts.init(pieChartRef1.value);
        const option = getPieOption(firstChartData[firstChartIndex.value]);
        pieChartInstance1.setOption(option);
      }
    } catch (error) {
      console.error('初始化第一个圆环图失败:', error);
    }
  }
};

// 初始化第二个圆环图
const initPieChart2 = () => {
  if (pieChartRef2.value && secondChartData[secondChartIndex.value]) {
    try {
      if (pieChartInstance2) {
        pieChartInstance2.dispose();
        pieChartInstance2 = null;
      }

      if (secondChartData[secondChartIndex.value].data && secondChartData[secondChartIndex.value].data.length > 0) {
        pieChartInstance2 = echarts.init(pieChartRef2.value);
        const option = getPieOption(secondChartData[secondChartIndex.value]);
        pieChartInstance2.setOption(option);
      }
    } catch (error) {
      console.error('初始化第二个圆环图失败:', error);
    }
  }
};

// 初始化柱状/折线图
const initBarLineChart = () => {
  if (!barLineChartRef.value || !allChartsData[chartIndex.value] || !allChartsData[chartIndex.value].data) return;
  if (!allChartsData[chartIndex.value].data.xAxis || allChartsData[chartIndex.value].data.xAxis.length === 0) return;

  try {
    if (barLineChartInstance) {
      barLineChartInstance.dispose();
      barLineChartInstance = null;
    }

    barLineChartInstance = echarts.init(barLineChartRef.value);
    const option = getBarLineOption(allChartsData[chartIndex.value]);
    barLineChartInstance.setOption(option);
  } catch (error) {
    console.error('初始化柱状/折线图失败:', error);
  }
};

// 初始化所有图表
const initCharts = () => {
  initPieChart1();
  initPieChart2();
  initBarLineChart();
};

// 处理窗口大小变化
const handleResize = () => {
  pieChartInstance1?.resize();
  pieChartInstance2?.resize();
  barLineChartInstance?.resize();
};

onMounted(() => {
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
  <div class="park-chart-box">
    <div class="chart-box-left">
      <Card
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>
    <Circle
      width="340px"
      height="330px"
      title-text="道路类型占比"
      :data="[
        { name: '正常运行', value: 4 },
        { name: '数据异常', value: 5 },
      ]"
    />
    <Circle
      width="340px"
      height="330px"
      title-text="启用状态占比"
      :data="[
        { name: '启用', value: 4 },
        { name: '禁用', value: 5 },
      ]"
      :colors="['#67C23A', '#E6A23C', '#F56C6C', '#909399']"
    />
    <Columnar
      height="330px"
      title="不同道路对比"
      :x-data="['福州', '厦门', '泉州', '莆田', '漳州', '龙岩']"
      :series-data="[{ name: '', data: [58, 42, 35, 15, 13, 33] }]"
    />
  </div>
</template>
