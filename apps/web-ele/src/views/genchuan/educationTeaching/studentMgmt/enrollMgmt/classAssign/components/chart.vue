<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getClassAssignChart,
  getClassAssignDistribution,
} from '#/api/genchuan/educationTeaching/studentMgmt/enrollMgmt/classAssign/data.js';

const loading = ref(true);
const chartData = ref({});
const distributionData = ref({});

// 卡片数据
const cardList = computed(() => {
  const total = chartData.value.totalAssignTaskCount || 0;
  const unassigned = chartData.value.unassignedCount || 0;
  const assigned = chartData.value.assignedCount || 0;
  const totalStudents = chartData.value.totalAssignedStudentCount || 0;
  return [
    { title: '总分班任务数', value: total, color: '#409EFF', status: 'total' },
    { title: '未分班任务数', value: unassigned, color: '#E6A23C', status: 'unassigned' },
    { title: '已分班任务数', value: assigned, color: '#67C23A', status: 'assigned' },
    { title: '已分班学生总数', value: totalStudents, color: '#909399', status: 'totalStudents' },
  ];
});

// 近一周分班趋势折线图
const lineData = computed(() => {
  const trend = chartData.value.recentWeekAssignTrend || [];
  return {
    xAxis: trend.map(item => item.date),
    series: [{ name: '分班学生数', data: trend.map(item => item.count) }],
  };
});

// 班级人数饼图数据
const classPieData = computed(() => {
  const data = distributionData.value.classStudentCount || [];
  return data.map(item => ({ name: item.className, value: item.studentCount }));
});

// 专业分班占比饼图数据
const majorPieData = computed(() => {
  const data = distributionData.value.majorAssignRate || [];
  return data.map(item => ({ name: item.name, value: item.value }));
});

// 饼图切换选项
const pieOptions = computed(() => [
  { type: 'class', title: '各班级人数分布', data: classPieData.value },
  { type: 'major', title: '专业分班占比', data: majorPieData.value },
]);

const activePieIndex = ref(0);
const currentPie = computed(() => pieOptions.value[activePieIndex.value] || pieOptions.value[0]);

const handlePieChange = (index) => {
  activePieIndex.value = index;
};

const emit = defineEmits(['cardSelect', 'pieSelect', 'lineSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handlePieClick = (params) => {
  emit('pieSelect', {
    name: params.name,
    type: currentPie.value.type,  // 'class' 或 'major'
  });
};

const handleLineClick = (params) => {
  emit('lineSelect', { field: 'date', value: params.xValue });
};

const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, distRes] = await Promise.allSettled([
      getClassAssignChart({}),
      getClassAssignDistribution({}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        totalAssignTaskCount: 12,
        unassignedCount: 3,
        assignedCount: 9,
        totalAssignedStudentCount: 586,
        recentWeekAssignTrend: [
          { date: '2025-03-25', count: 68 },
          { date: '2025-03-26', count: 85 },
          { date: '2025-03-27', count: 135 },
          { date: '2025-03-28', count: 72 },
          { date: '2025-03-29', count: 42 },
          { date: '2025-03-30', count: 12 },
          { date: '2025-03-31', count: 12 },
        ],
      };
    }
    if (distRes.status === 'fulfilled') {
      distributionData.value = distRes.value;
    } else {
      distributionData.value = {
        classStudentCount: [
          { className: '2025级计算机1班', studentCount: 48 },
          { className: '2025级计算机2班', studentCount: 47 },
          { className: '2025级电商1班', studentCount: 45 },
          { className: '2025级机电1班', studentCount: 48 },
          { className: '2025级会计1班', studentCount: 43 },
          { className: '2025级学前1班', studentCount: 41 },
        ],
        majorAssignRate: [
          { name: '计算机应用技术', value: 0.28 },
          { name: '电子商务', value: 0.20 },
          { name: '机电一体化', value: 0.19 },
          { name: '会计电算化', value: 0.17 },
          { name: '学前教育', value: 0.16 },
        ],
      };
    }
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
    <div class="box-left">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <lineChart
      style="flex: 1.5 !important;"
      title="近一周分班趋势"
      :x-data="lineData.xAxis"
      :series-data="lineData.series"
      y-name="分班学生数"
      @line-click="handleLineClick"
    />

    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activePieIndex" size="small" @change="handlePieChange">
          <el-option v-for="(opt, idx) in pieOptions" :key="idx" :label="opt.title" :value="idx" />
        </el-select>
      </div>
      <Pie
        :title-text="currentPie.title"
        :data="currentPie.data"
        @pie-click="handlePieClick"
      />
    </div>
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

  .box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    min-width: 280px;
    max-width: 320px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }

  .chart-area {
    position: relative;
    flex: 1;
    min-width: 280px;
    height: 100%;
  }

  .chart-select-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }
}
</style>
