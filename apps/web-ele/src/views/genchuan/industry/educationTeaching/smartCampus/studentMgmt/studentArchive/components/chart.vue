<script setup>
import { ref, computed, onMounted } from 'vue';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getStudentArchiveCard,
  getStudentArchiveChart,
} from '#/api/genchuan/industry/educationTeaching/smartCampus/studentMgmt/studentArchive/data.js';

const loading = ref(true);
const cardData = ref({});      // 卡片数据
const chartData = ref({});     // 饼图 + 折线图数据

// 卡片列表（符合 Indicator 组件要求）
const cardList = computed(() => {
  const data = cardData.value;
  return [
    { title: '学生总数', value: data.studentTotal || 0, yoy: data.studentTotalYoy, color: '#409EFF', status: 'total' },
    { title: '在籍人数', value: data.inStudentTotal || 0, yoy: data.inStudentTotalYoy, color: '#67C23A', status: 'inStudent' },
    { title: '休学人数', value: data.suspendStudentTotal || 0, color: '#E6A23C', status: 'suspend' },
    { title: '退学人数', value: data.quitStudentTotal || 0, color: '#F56C6C', status: 'quit' },
    { title: '异动人数', value: data.changeStudentTotal || 0, color: '#909399', status: 'change' },
  ];
});

// 饼图数据：转换后端 statusPieList 为 { name, value } 格式
const pieData = computed(() => {
  const list = chartData.value.statusPieList || [];
  return list.map(item => ({
    name: item.statusName,
    value: item.count,
  }));
});

// 折线图数据：转换后端 changeTrendList
const lineData = computed(() => {
  const trend = chartData.value.changeTrendList || [];
  return {
    xAxis: trend.map(item => item.period),
    series: [{ name: '异动人数', data: trend.map(item => item.count) }],
  };
});

const emit = defineEmits(['cardSelect', 'pieSelect', 'lineSelect']);

// 卡片点击：派发自定义事件
const handleCardClick = (cardInfo) => {
  let filterType = null;
  let filterValue = null;
  switch (cardInfo.status) {
    case 'inStudent':
      filterType = 'status';
      filterValue = '0';
      break;
    case 'suspend':
      filterType = 'status';
      filterValue = '1';
      break;
    case 'quit':
      filterType = 'status';
      filterValue = '2';
      break;
    case 'change':
      filterType = 'status';
      filterValue = '3';
      break;
    case 'total':
      filterType = 'studentNo';
      filterValue = '';
      break;
    default: return;
  }
  window.dispatchEvent(new CustomEvent('student-archive-chart-filter', {
    detail: { type: filterType, value: filterValue }
  }));
};

// 饼图点击：按学籍状态筛选
const handlePieClick = (params) => {
  // params.name 是状态名称，需要映射回 status 值
  const statusMap = { '在籍': '0', '休学': '1', '退学': '2', '异动': '3' };
  const statusValue = statusMap[params.name];
  if (statusValue) {
    window.dispatchEvent(new CustomEvent('student-archive-chart-filter', {
      detail: { type: 'status', value: statusValue }
    }));
  }
};

// 折线图点击：按异动时间筛选
const handleLineClick = (params) => {
  const period = params.xValue || params.name; // 格式 "2026-02"
  if (period) {
    // 转为时间戳范围（该月第一天到该月最后一天）
    const [year, month] = period.split('-');
    const start = new Date(parseInt(year), parseInt(month) - 1, 1).getTime();
    const end = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59).getTime();
    window.dispatchEvent(new CustomEvent('student-archive-chart-filter', {
      detail: { type: 'archiveTime', value: [start, end] }
    }));
  }
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    // 并行请求两个接口
    const [cardRes, chartRes] = await Promise.all([
      getStudentArchiveCard(),
      getStudentArchiveChart(),
    ]);
    cardData.value = cardRes;
    chartData.value = chartRes;
  } catch (error) {
    console.error('加载图表数据失败', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <div class="box-left-m">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <Pie
      style="flex: 1 !important;"
      title-text="学籍状态分布"
      :data="pieData"
      @pie-click="handlePieClick"
    />

    <lineChart
      style="flex: 1.5 !important;"
      title="学籍异动趋势"
      :x-data="lineData.xAxis"
      :series-data="lineData.series"
      y-name="异动人数"
      @line-click="handleLineClick"
    />
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  padding-left: 15px;
  padding-right: 15px;
  width: 100% !important;

  .box-left-m {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr);
    min-width: 360px;
    max-width: 400px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }
}
</style>
