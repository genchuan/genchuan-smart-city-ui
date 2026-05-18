<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { getCycleReportChart } from '#/api/genchuan/industry/chargePark/vehiclePass/passReport/cycleReport';

import DrillDownDetailDialog from './components/DrillDownDetailDialog.vue';
import PassOpReportStats from './components/PassOpReportStats.vue';
import Table from './table/index.vue';

import '#/genchuan-components/page/index.scss';

const showStats = ref(true);

const toggleStats = () => {
  showStats.value = !showStats.value;
  if (showStats.value) {
    fetchStatsData();
  }
};

const statsData = ref({
  cards: [],
  pieData: [],
  barData: [],
  lineData: [],
});

const pieChartOptions = ref([]);
const barChartOptions = ref([]);
const lineChartOptions = ref([]);

const drillDownDialogRef = ref(null);

const fetchStatsData = async () => {
  try {
    // 获取今天的日期作为统计时间
    const today = new Date();
    const statTime = today.toISOString().split('T')[0]; // YYYY-MM-DD 格式

    const response = await getCycleReportChart({
      reportCycle: '日报',
      statTime,
      tenantId: 1,
    });
    const data = response?.data || response;

    if (data && data.cardData) {
      statsData.value.cards = [
        {
          title: '入场量',
          value: data.cardData.enterCount || 0,
          color: '#4A90E2',
          type: 'enterCount',
        },
        {
          title: '离场量',
          value: data.cardData.leaveCount || 0,
          color: '#50E3C2',
          type: 'leaveCount',
        },
        {
          title: '在停车辆数',
          value: data.cardData.parkingCount || 0,
          color: '#FF9F40',
          type: 'parkingCount',
        },
        {
          title: '识别成功率',
          value: `${data.cardData.identifySuccessRate || 0}%`,
          color: '#A17FE0',
          type: 'identifySuccessRate',
        },
        {
          title: '核验成功率',
          value: `${data.cardData.checkSuccessRate || 0}%`,
          color: '#FF6B8B',
          type: 'checkSuccessRate',
        },
        {
          title: '异常处置率',
          value: `${data.cardData.abnormalHandleRate || 0}%`,
          color: '#4A90E2',
          type: 'abnormalHandleRate',
        },
        {
          title: 'ETC通行成功率',
          value: `${data.cardData.etcPassSuccessRate || 0}%`,
          color: '#50E3C2',
          type: 'etcPassSuccessRate',
        },
      ];

      pieChartOptions.value = [
        {
          label: '异常类型占比',
          value: 'abnormalType',
          data: (data.pieData || []).map((item) => ({
            name: item.name || item.type,
            value: item.count || item.value,
            type: item.type,
          })),
        },
      ].filter((item) => item.data.length > 0);

      statsData.value.pieData = pieChartOptions.value[0]?.data || [];

      barChartOptions.value = [
        {
          label: '场站通行量分布',
          value: 'stationDistribution',
          data: (data.barData || []).map((item) => ({
            name: item.stationName || item.name,
            value: item.passCount || item.value,
            stationName: item.stationName,
          })),
        },
        {
          label: '时段通行量分布',
          value: 'hourDistribution',
          data: (data.barData || []).map((item) => ({
            name: item.hour || item.name,
            value: item.passCount || item.value,
          })),
        },
      ].filter((item) => item.data.length > 0);

      statsData.value.barData = barChartOptions.value[0]?.data || [];

      const lineDataList = data.lineData || [];
      lineChartOptions.value = [
        {
          label: '通行量趋势',
          value: 'passTrend',
          data: {
            xAxis: lineDataList.map((item) => {
              const dateObj = new Date(item.statTime);
              return `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
            }),
            series: lineDataList.map((item) => item.passCount),
            fullDates: lineDataList.map((item) => item.statTime),
          },
        },
        {
          label: '识别成功率趋势',
          value: 'identifyTrend',
          data: {
            xAxis: lineDataList.map((item) => {
              const dateObj = new Date(item.statTime);
              return `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
            }),
            series: lineDataList.map((item) => item.identifySuccessRate),
            fullDates: lineDataList.map((item) => item.statTime),
          },
        },
      ].filter((item) => item.data.xAxis.length > 0);

      statsData.value.lineData = lineDataList.map((item) => ({
        date: `${new Date(item.statTime).getMonth() + 1}/${new Date(item.statTime).getDate()}`,
        fullDate: item.statTime,
        value: item.passCount,
      }));
    } else {
      useMockData();
    }
  } catch (error) {
    console.error('获取统计数据失败:', error);
    useMockData();
  }
};

const useMockData = () => {
  statsData.value.cards = [
    { title: '入场量', value: 342, color: '#4A90E2', type: 'enterCount' },
    { title: '离场量', value: 338, color: '#50E3C2', type: 'leaveCount' },
    { title: '在停车辆数', value: 4, color: '#FF9F40', type: 'parkingCount' },
    {
      title: '识别成功率',
      value: '97.8%',
      color: '#A17FE0',
      type: 'identifySuccessRate',
    },
    {
      title: '核验成功率',
      value: '95.2%',
      color: '#FF6B8B',
      type: 'checkSuccessRate',
    },
    {
      title: '异常处置率',
      value: '90.5%',
      color: '#4A90E2',
      type: 'abnormalHandleRate',
    },
    {
      title: 'ETC通行成功率',
      value: '87.3%',
      color: '#50E3C2',
      type: 'etcPassSuccessRate',
    },
  ];

  pieChartOptions.value = [
    {
      label: '异常类型占比',
      value: 'abnormalType',
      data: [
        { name: '识别异常', value: 45, type: 'identify' },
        { name: '核验异常', value: 30, type: 'check' },
        { name: '支付异常', value: 25, type: 'payment' },
      ],
    },
  ];
  statsData.value.pieData = pieChartOptions.value[0].data;

  barChartOptions.value = [
    {
      label: '场站通行量分布',
      value: 'stationDistribution',
      data: [
        {
          name: '泉州丰泽充停场站',
          value: 342,
          stationName: '泉州丰泽充停场站',
        },
        {
          name: '龙文区碧湖公园停车场',
          value: 256,
          stationName: '龙文区碧湖公园停车场',
        },
        {
          name: '龙海区石码镇停车场',
          value: 189,
          stationName: '龙海区石码镇停车场',
        },
      ],
    },
    {
      label: '时段通行量分布',
      value: 'hourDistribution',
      data: [
        { name: '00-06时', value: 45 },
        { name: '06-12时', value: 156 },
        { name: '12-18时', value: 234 },
        { name: '18-24时', value: 178 },
      ],
    },
  ];
  statsData.value.barData = barChartOptions.value[0].data;

  const trendData = generateTrendData();
  lineChartOptions.value = [
    {
      label: '通行量趋势',
      value: 'passTrend',
      data: {
        xAxis: trendData.map((item) => item.date),
        series: trendData.map((item) => item.value),
        fullDates: trendData.map((item) => item.fullDate),
      },
    },
  ];
  statsData.value.lineData = trendData;
};

const generateTrendData = () => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    const fullDateStr = date.toISOString().split('T')[0];
    const value = Math.floor(Math.random() * 400) + 100;
    data.push({
      date: dateStr,
      fullDate: fullDateStr,
      value,
    });
  }
  return data;
};

const handleCardClick = async (cardType) => {
  console.log('卡片钻取:', cardType);

  if (drillDownDialogRef.value) {
    drillDownDialogRef.value.open({
      drillType: cardType,
      drillValue: cardType,
      drillName: '',
      reportCycle: activeName.value,
    });
  }

  await nextTick();
  const currentTable = getCurrentTableRef();
  if (currentTable) {
    currentTable.handleStatsFilter('card', cardType);
  }
};

const handlePieClick = async (drillInfo) => {
  console.log('饼图钻取:', drillInfo);

  if (drillDownDialogRef.value) {
    drillDownDialogRef.value.open({
      drillType: drillInfo.type,
      drillValue: drillInfo.value,
      drillName: drillInfo.name,
      reportCycle: activeName.value,
    });
  }
};

const handleBarClick = async (drillInfo) => {
  console.log('柱状图钻取:', drillInfo);

  if (drillDownDialogRef.value) {
    drillDownDialogRef.value.open({
      drillType: drillInfo.type,
      drillValue: drillInfo.value,
      drillName: drillInfo.name,
      reportCycle: activeName.value,
      ...(drillInfo.stationId ? { stationId: drillInfo.stationId } : {}),
    });
  }
};

const handleLineClick = async (drillInfo) => {
  console.log('折线图钻取:', drillInfo);

  if (drillDownDialogRef.value) {
    drillDownDialogRef.value.open({
      drillType: drillInfo.type,
      drillValue: drillInfo.value,
      drillName: drillInfo.name,
      reportCycle: activeName.value,
    });
  }
};

const tableRef = ref(null);

const showStatsValue = computed(() => showStats.value);

const getCurrentTableRef = () => {
  const activeIndex = reportCycleTabs.findIndex(
    (t) => t.label === activeName.value,
  );
  if (activeIndex === -1) return null;

  if (Array.isArray(tableRef.value)) {
    return tableRef.value[activeIndex] &&
      typeof tableRef.value[activeIndex].handleStatsFilter === 'function'
      ? tableRef.value[activeIndex]
      : null;
  }
  return tableRef.value &&
    typeof tableRef.value.handleStatsFilter === 'function'
    ? tableRef.value
    : null;
};

const reportCycleTabs = [
  { label: '全部', value: '' },
  { label: '日报', value: '日报' },
  { label: '周报', value: '周报' },
  { label: '月报', value: '月报' },
  { label: '季报', value: '季报' },
  { label: '半年报', value: '半年报' },
  { label: '年报', value: '年报' },
  { label: '自定义报表', value: '自定义报表' },
];

const tabArray = ref(
  reportCycleTabs.map((tab) => ({
    label: tab.label,
    value: tab.value,
    components: Table,
    showSecondary: true,
    secondShow: false,
  })),
);

const activeName = ref(reportCycleTabs[0].label);

const tabChange = (tabName) => {
  const tab = reportCycleTabs.find((t) => t.label === tabName);
  const currentTable = getCurrentTableRef();
  if (tab && currentTable) {
    currentTable.handleStatsFilter('reportCycle', tab.value);
  }
};

onMounted(() => {
  fetchStatsData();
  const firstTab = reportCycleTabs[0];
  if (firstTab) {
    setTimeout(() => {
      const currentTable = getCurrentTableRef();
      if (currentTable) {
        currentTable.handleStatsFilter('reportCycle', firstTab.value);
      }
    }, 300);
  }
});
</script>

<template>
  <div class="common-index">
    <PassOpReportStats
      v-if="showStats"
      :data="statsData"
      :pie-chart-options="pieChartOptions"
      :bar-chart-options="barChartOptions"
      :line-chart-options="lineChartOptions"
      @card-click="handleCardClick"
      @pie-click="handlePieClick"
      @bar-click="handleBarClick"
      @line-click="handleLineClick"
    />

    <DrillDownDetailDialog ref="drillDownDialogRef" />

    <el-tabs
      v-model="activeName"
      class="common-tabs"
      type="card"
      @tab-change="tabChange"
    >
      <el-tab-pane
        v-for="item in tabArray"
        :key="item.label"
        :name="item.label"
      >
        <template #label>
          <div class="table-first">
            <span>{{ item.label }}</span>
          </div>
        </template>
        <component
          :is="item.components"
          ref="tableRef"
          :second-show="item.secondShow"
          :show-stats="showStatsValue"
          :toggle-stats="toggleStats"
          :key="item.label"
          :active-report-cycle="item.value"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
