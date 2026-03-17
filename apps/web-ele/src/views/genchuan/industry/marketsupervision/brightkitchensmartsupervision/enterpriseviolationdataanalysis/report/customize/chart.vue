<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';
import { ElOption, ElSelect } from 'element-plus';

const state = reactive({
  cardList: [
    { title: '涉及企业数', value: 283, color: '#4A90E2' },
    { title: '低风险企业数', value: 156, color: '#50E3C2' },
    { title: '中风险企业数', value: 98, color: '#FF9F40' },
    { title: '高风险企业数', value: 29, color: '#FF6B8B' },
    { title: '平均整改完成率', value: '89.6%', color: '#A17FE0' },
    { title: '最高违规频次企业数', value: 12, color: '#FFD93D' },
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
        { key: 'id', label: '井盖编号' },
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

// 饼图切换状态
const firstChartIndex = ref(0);
const secondChartIndex = ref(0); // 修正初始值为0
const chartIndex = ref(0);

// 第一个饼图的数据（全区域风险占比）
const firstChartData = [
  {
    label: '筛选范围企业风险等级占比',
    data: [
      { name: '低风险', value: 156 },
      { name: '中风险', value: 98 },
      { name: '高风险', value: 29 },
    ],
  },
];

// 第二个饼图的数据（泉州区域风险占比，差异化数据）
const secondChartData = [
  {
    label: '高频风险点分布占比',
    data: [
      { name: '低风险', value: 65 },
      { name: '中风险', value: 28 },
      { name: '高风险', value: 52 },
    ],
  },
];
// 所有折线图和柱状图的数据（包含新增图表类型）
const allChartsData = [
  // 原有图表数据
  {
    label: '不同月份复审台账新增数量及复审完成数量对比',
    type: 'bar',
    stack: 'total',
    data: {
      xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        { name: '新增数量', data: [12, 15, 18, 14, 16, 20] },
        { name: '完成数量', data: [10, 13, 15, 12, 14, 18] },
      ],
    },
  },
  {
    label: '不同区域/复审人的复审完成数量及整改完成率对比',
    type: 'bar',
    data: {
      xAxis: ['福州', '厦门', '泉州', '莆田', '宁德', '龙岩'],
      series: [
        { name: '复审完成数量', data: [15, 18, 25, 14, 16, 13] },
        { name: '整改完成率(%)', data: [85, 92, 95, 88, 90, 82] },
      ],
    },
  },
  {
    label: '近3个月泉州复审台账企业整改完成率趋势',
    type: 'line',
    data: {
      xAxis: [
        '第1周',
        '第2周',
        '第3周',
        '第4周',
        '第5周',
        '第6周',
        '第7周',
        '第8周',
        '第9周',
        '第10周',
        '第11周',
        '第12周',
      ],
      series: [80, 82, 85, 87, 89, 91, 92, 93, 94, 95, 96, 97],
    },
  },
  {
    label: '泉州各区县企业风险等级数量对比',
    type: 'bar',
    data: {
      xAxis: [
        '鲤城区',
        '丰泽区',
        '洛江区',
        '泉港区',
        '晋江市',
        '石狮市',
        '南安市',
      ],
      series: [
        { name: '高风险', data: [12, 15, 8, 6, 20, 9, 18] },
        { name: '中风险', data: [25, 30, 18, 15, 35, 20, 28] },
        { name: '低风险', data: [45, 50, 35, 30, 60, 40, 55] },
      ],
    },
  },
  {
    label: '泉州各区县企业平均整改完成率对比',
    type: 'bar',
    data: {
      xAxis: [
        '鲤城区',
        '丰泽区',
        '洛江区',
        '泉港区',
        '晋江市',
        '石狮市',
        '南安市',
      ],
      series: [{ name: '整改完成率(%)', data: [92, 94, 88, 85, 96, 90, 91] }],
    },
  },
  {
    label: '泉州企业月度违规频次TOP10排名',
    type: 'bar',
    data: {
      xAxis: [
        '企业A',
        '企业B',
        '企业C',
        '企业D',
        '企业E',
        '企业F',
        '企业G',
        '企业H',
        '企业I',
        '企业J',
      ],
      series: [
        { name: '违规频次', data: [35, 32, 28, 25, 22, 18, 15, 12, 10, 8] },
      ],
    },
  },
  {
    label: '泉州近6个月企业整体风险等级变化趋势',
    type: 'line',
    data: {
      xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [8.5, 8.2, 7.8, 7.5, 7.2, 6.8],
    },
  },
  {
    label: '泉州近6个月整体整改完成率变化趋势',
    type: 'line',
    data: {
      xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [85, 88, 90, 92, 94, 95],
    },
  },

  // 新增：基础柱状图 - 筛选范围内不同区域企业违规频次对比
  {
    label: '筛选范围内不同区域企业违规频次对比',
    type: 'bar',
    data: {
      xAxis: ['福州', '厦门', '泉州', '莆田', '宁德', '龙岩'],
      series: [
        { name: '安全生产违规', data: [28, 32, 45, 25, 30, 22] },
        { name: '环保违规', data: [15, 18, 25, 12, 16, 10] },
        { name: '资质违规', data: [10, 12, 18, 8, 11, 7] },
      ],
    },
  },

  // 新增：基础柱状图 - 不同企业类型整改完成率对比
  {
    label: '不同企业类型整改完成率对比',
    type: 'bar',
    data: {
      xAxis: ['制造业', '服务业', '建筑业', '批发零售业', '农林牧渔业'],
      series: [
        { name: '整改完成率(%)', data: [92, 88, 85, 90, 87] },
        { name: '整改及时率(%)', data: [85, 82, 78, 84, 80] },
      ],
    },
  },

  // 新增：区域面积图 - 筛选范围内企业违规频次随时间的变化趋势
  {
    label: '筛选范围内企业违规频次随时间的变化趋势',
    type: 'line', // ECharts中面积图基于折线图+areaStyle实现，type仍为line
    data: {
      xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        {
          name: '泉州',
          data: [65, 72, 68, 75, 70, 66],
          areaStyle: true, // 标记为面积图（前端渲染时会自动应用面积样式）
        },
        {
          name: '厦门',
          data: [58, 65, 62, 68, 64, 60],
          areaStyle: true,
        },
        {
          name: '福州',
          data: [55, 60, 58, 63, 59, 56],
          areaStyle: true,
        },
      ],
    },
  },

  // 新增：基础饼图 - 筛选范围内企业违规类型分布占比
  {
    label: '筛选范围内企业违规类型分布占比',
    type: 'pie', // 新增pie类型，需确保getBarLineOption兼容pie类型
    data: {
      // 饼图无xAxis，用series直接存数据（保持格式兼容）
      series: [
        {
          name: '违规类型',
          data: [
            { name: '安全生产违规', value: 180 },
            { name: '环保违规', value: 96 },
            { name: '资质违规', value: 64 },
            { name: '台账不规范', value: 45 },
            { name: '其他违规', value: 25 },
          ],
        },
      ],
    },
  },
];

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
      text: chartData?.label || '分布统计',
      left: 'center',
      top: 10,
      textStyle: { color: '#6E7E91', fontSize: 14, fontWeight: 500 },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: { color: '#6E7E91' },
    },
    color: freshColors,
    legend: {
      orient: 'horizontal',
      bottom: 5,
      type: 'scroll',
      left: 'center',
      textStyle: { color: '#6E7E91', fontSize: 10 },
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
          label: { show: true, fontSize: 13, fontWeight: 'bold' },
          scale: true,
          scaleSize: 5,
        },
        labelLine: {
          show: true,
          length: 12,
          length2: 8,
          smooth: true,
          lineStyle: { color: '#9AA8B7', width: 1 },
        },
        itemStyle: { borderWidth: 2, borderColor: '#fff' },
        data: chartData?.data || [],
      },
    ],
  };
};

// 获取柱状/折线图配置
const getBarLineOption = (chartData) => {
  const freshColors = ['#4A90E2', '#50E3C2', '#FF9F40', '#A17FE0', '#FF6B8B'];
  const type = chartData?.type || 'bar';
  const isStack = chartData?.stack === 'total';
  const seriesData = chartData?.data?.series || [];

  const series = Array.isArray(seriesData)
    ? seriesData.map((item, index) => {
        if (typeof item !== 'object') {
          return {
            name: chartData?.label || '趋势统计',
            type,
            data: seriesData,
            itemStyle: {
              borderRadius: type === 'bar' ? [4, 4, 0, 0] : undefined,
              color: freshColors[0],
            },
            smooth: type === 'line',
            lineStyle:
              type === 'line' ? { width: 3, color: freshColors[0] } : undefined,
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
              label: { show: type === 'bar', fontSize: 14, fontWeight: 'bold' },
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
          };
        }
        return {
          name: item.name || chartData?.label || '趋势统计',
          type,
          data: item.data || [],
          stack: isStack ? 'total' : undefined,
          itemStyle: {
            borderRadius: type === 'bar' ? [4, 4, 0, 0] : undefined,
            color: freshColors[index % freshColors.length],
          },
          smooth: type === 'line',
          lineStyle:
            type === 'line'
              ? { width: 3, color: freshColors[index % freshColors.length] }
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
            label: { show: type === 'bar', fontSize: 14, fontWeight: 'bold' },
          },
          areaStyle:
            type === 'line'
              ? {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: `rgba(${hexToRgb(freshColors[index % freshColors.length])}, 0.3)`,
                    },
                    {
                      offset: 1,
                      color: `rgba(${hexToRgb(freshColors[index % freshColors.length])}, 0.05)`,
                    },
                  ]),
                }
              : undefined,
        };
      })
    : [
        {
          name: chartData?.label || '趋势统计',
          type,
          data: [],
          itemStyle: {
            borderRadius: type === 'bar' ? [4, 4, 0, 0] : undefined,
            color: freshColors[0],
          },
          smooth: type === 'line',
          lineStyle:
            type === 'line' ? { width: 3, color: freshColors[0] } : undefined,
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
            label: { show: type === 'bar', fontSize: 14, fontWeight: 'bold' },
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
      ];

  return {
    backgroundColor: 'transparent',
    title: {
      text: chartData?.label || '趋势统计',
      left: 'center',
      top: 5,
      textStyle: { color: '#6E7E91', fontSize: 14, fontWeight: 500 },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: { color: '#6E7E91' },
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
      axisLine: { lineStyle: { color: '#E8F4FD' } },
      axisTick: { lineStyle: { color: '#E8F4FD' } },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#9AA8B7', fontSize: 11 },
      axisLine: { lineStyle: { color: '#E8F4FD' } },
      axisTick: { lineStyle: { color: '#E8F4FD' } },
      splitLine: { lineStyle: { color: '#F0F6FC', type: 'dashed' } },
    },
    series,
  };
};

// 辅助函数：将十六进制颜色转换为RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}`
    : '74, 144, 226';
}

// 初始化第一个圆环图（增强容错）
const initPieChart1 = () => {
  if (!pieChartRef1.value) return; // 先判断DOM是否存在
  try {
    if (pieChartInstance1) {
      pieChartInstance1.dispose();
      pieChartInstance1 = null;
    }
    const currentData =
      firstChartData[firstChartIndex.value] || firstChartData[0]; // 兜底取第一条
    if (currentData?.data?.length > 0) {
      pieChartInstance1 = echarts.init(pieChartRef1.value);
      const option = getPieOption(currentData);
      pieChartInstance1.setOption(option, true); // 加true强制更新
    }
  } catch (error) {
    console.error('初始化第一个圆环图失败:', error);
  }
};

// 初始化第二个圆环图（增强容错）
const initPieChart2 = () => {
  if (!pieChartRef2.value) return; // 先判断DOM是否存在
  try {
    if (pieChartInstance2) {
      pieChartInstance2.dispose();
      pieChartInstance2 = null;
    }
    const currentData =
      secondChartData[secondChartIndex.value] || secondChartData[0]; // 兜底取第一条
    if (currentData?.data?.length > 0) {
      pieChartInstance2 = echarts.init(pieChartRef2.value);
      const option = getPieOption(currentData);
      pieChartInstance2.setOption(option, true); // 加true强制更新
    }
  } catch (error) {
    console.error('初始化第二个圆环图失败:', error);
  }
};

// 初始化柱状/折线图
const initBarLineChart = () => {
  if (!barLineChartRef.value || !allChartsData[chartIndex.value]) return;
  try {
    if (barLineChartInstance) {
      barLineChartInstance.dispose();
      barLineChartInstance = null;
    }
    const currentData = allChartsData[chartIndex.value];
    if (currentData?.data?.xAxis?.length > 0) {
      barLineChartInstance = echarts.init(barLineChartRef.value);
      const option = getBarLineOption(currentData);
      barLineChartInstance.setOption(option, true);
    }
  } catch (error) {
    console.error('初始化柱状/折线图失败:', error);
  }
};

// 初始化所有图表（增加延迟确保DOM挂载）
const initCharts = () => {
  // 增加少量延迟，确保DOM完全渲染
  setTimeout(() => {
    initPieChart1();
    initPieChart2();
    initBarLineChart();
  }, 100);
};

// 处理窗口大小变化
const handleResize = () => {
  setTimeout(() => {
    // 防抖
    pieChartInstance1?.resize();
    pieChartInstance2?.resize();
    barLineChartInstance?.resize();
  }, 100);
};

onMounted(() => {
  nextTick(() => {
    initCharts();
  });
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  [pieChartInstance1, pieChartInstance2, barLineChartInstance].forEach(
    (instance) => {
      if (instance) {
        instance.dispose();
      }
    },
  );
});
</script>

<template>
  <div class="stats-four-visualization">
    <!-- 卡片区 -->
    <div class="cards-section">
      <div
        v-for="(card, index) in state.cardList"
        :key="`card-${index}`"
        class="stat-card"
        :style="{ borderLeftColor: card.color || '#4A90E2' }"
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
        </div>
      </div>
    </div>

    <!-- 右侧展示区 -->
    <div class="right-section">
      <div class="charts-section">
        <!-- 第一个圆环图 -->
        <div class="pie-chart-area">
          <div v-if="firstChartData.length > 1" class="chart-select-wrapper">
            <ElSelect
              v-model="firstChartIndex"
              size="small"
              class="chart-select"
              @change="handlePie1Change"
            >
              <ElOption
                v-for="(option, idx) in firstChartData"
                :key="idx"
                :label="option.label"
                :value="idx"
              />
            </ElSelect>
          </div>
          <div ref="pieChartRef1" class="chart-container"></div>
        </div>

        <!-- 第二个圆环图 -->
        <div class="pie-chart-area">
          <div v-if="secondChartData.length > 1" class="chart-select-wrapper">
            <ElSelect
              v-model="secondChartIndex"
              size="small"
              class="chart-select"
              @change="handlePie2Change"
            >
              <ElOption
                v-for="(option, idx) in secondChartData"
                :key="idx"
                :label="option.label"
                :value="idx"
              />
            </ElSelect>
          </div>
          <div ref="pieChartRef2" class="chart-container"></div>
        </div>

        <!-- 柱状/折线图 -->
        <div class="bar-line-chart-area">
          <div
            v-if="allChartsData.length > 1"
            class="chart-select-wrapper bar-line-select"
          >
            <ElSelect
              v-model="chartIndex"
              size="small"
              class="chart-select"
              @change="handleBarLineChange"
            >
              <ElOption
                v-for="(option, idx) in allChartsData"
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
  padding: 10px; /* 加内边距避免溢出 */
  box-sizing: border-box; /* 包含内边距 */
}

/* 卡片区样式 */
.cards-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  flex-shrink: 0;
  gap: 12px;
  width: 260px;
  height: 320px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  padding: 12px 14px; 
  border-radius: 8px;
  border-left: 4px solid #4a90e2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-title {
  font-size: 13px;
  color: #6e7e91;
  font-weight: 600;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
}

.card-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 4px;
}

/* 右侧展示区样式 */
.right-section {
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  height: 320px;
}

/* 图表区样式 - 关键：修复flex布局宽度问题 */
.charts-section {
  display: flex;
  flex: 1;
  gap: 20px;
  min-width: 0;
  height: 100%; /* 确保高度继承 */
}

/* 圆环图区域 - 关键：移除min-width:0，固定最小宽度 */
.pie-chart-area {
  position: relative;
  flex: 1;
  min-width: 200px; /* 给最小宽度，避免echarts无法渲染 */
  height: 100%;
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
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.chart-select :deep(.el-input__inner) {
  font-size: 12px;
}

.chart-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box; /* 包含内边距 */
}

/* 柱状/折线图区域 */
.bar-line-chart-area {
  position: relative;
  flex: 1.5;
  min-width: 300px; /* 给最小宽度 */
  height: 100%;
}

.bar-line-select {
  left: 10px;
}
</style>
