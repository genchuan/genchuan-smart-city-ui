<script setup>
import {ref, computed, onMounted} from 'vue';
import {ElSelect, ElOption} from 'element-plus';
import Bar from '#/genchuan-components/stats/barClick.vue';
import BarHorizontal from '#/genchuan-components/stats/barHorizontal.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import {
  getCompareMgmtChart,
  getCompareMgmtScoreRank,
} from '#/api/genchuan/educationTeaching/studentMgmt/moralEdu/compareMgmt/data.js';

const loading = ref(true);
const chartData = ref({});
const scoreRankData = ref({});

// 周期筛选
const cycleFilter = ref('月');
const cycleOptions = [
  {label: '周', value: '周'},
  {label: '月', value: '月'},
  {label: '学期', value: '学期'},
];

// ========== 条形图数据（班级德育得分排名）==========
const barHorizontalData = computed(() => {
  const rankList = [...(chartData.value.rankList || [])];
  const sorted = rankList.sort((a, b) => a.totalScore - b.totalScore);
  return {
    xData: sorted.map(item => item.className),
    seriesData: [{name: '总得分', data: sorted.map(item => item.totalScore)}],
  };
});

// ========== 柱状图数据（各班级得分统计，点击筛选） ==========
const barData = computed(() => {
  const classList = scoreRankData.value.classList || [];
  const scoreList = scoreRankData.value.scoreList || [];
  return {
    xData: classList,
    seriesData: [{name: '总得分', data: scoreList}],
  };
});

// ========== 饼图数据 ==========
const pieOptions = computed(() => [
  {
    title: '状态分布',
    type: 'status',
    getData: () => {
      const status = chartData.value.statusCount || {scoringCount: 0, finishedCount: 0};
      return [
        {name: '打分中', value: status.scoringCount || 0},
        {name: '已汇总', value: status.finishedCount || 0},
      ];
    },
  },
  {
    title: '周期分布',
    type: 'cycle',
    getData: () => {
      const cycle = chartData.value.cycleCount || {weekCount: 0, monthCount: 0, termCount: 0};
      return [
        {name: '周', value: cycle.weekCount || 0},
        {name: '月', value: cycle.monthCount || 0},
        {name: '学期', value: cycle.termCount || 0},
      ];
    },
  },
]);

const activePieIndex = ref(0);
const currentPieData = computed(() => pieOptions.value[activePieIndex.value]?.getData() || []);
const currentPieTitle = computed(() => pieOptions.value[activePieIndex.value]?.title || '');

const handlePieChange = (index) => {
  activePieIndex.value = index;
};

const emit = defineEmits(['barSelect', 'pieSelect']);

// 柱状图点击（筛选班级）
const handleBarClick = (className) => {
  emit('barSelect', {field: 'className', value: className});
};

// 饼图点击
const handlePieClick = (item) => {
  const currentType = pieOptions.value[activePieIndex.value]?.type;
  if (currentType === 'status') {
    emit('barSelect', {field: 'status', value: item.name});
  } else if (currentType === 'cycle') {
    emit('barSelect', {field: 'cycle', value: item.name});
  }
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, rankRes] = await Promise.allSettled([
      getCompareMgmtChart({cycle: cycleFilter.value}),
      getCompareMgmtScoreRank({cycle: cycleFilter.value}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      console.warn('图表总览接口失败，使用模拟数据');
      chartData.value = {
        rankList: [
          {className: '高一(1)班', totalScore: 92.5, rankNo: 1},
          {className: '高一(3)班', totalScore: 90.0, rankNo: 2},
          {className: '高一(2)班', totalScore: 88.0, rankNo: 3},
          {className: '高二(1)班', totalScore: 85.5, rankNo: 4},
        ],
        statusCount: {scoringCount: 5, finishedCount: 15},
        cycleCount: {weekCount: 8, monthCount: 10, termCount: 2},
      };
    }
    if (rankRes.status === 'fulfilled') {
      scoreRankData.value = rankRes.value;
    } else {
      console.warn('得分排名接口失败，使用模拟数据');
      scoreRankData.value = {
        classList: ['高一(1)班', '高一(2)班', '高一(3)班', '高二(1)班'],
        scoreList: [92.5, 88.0, 90.0, 85.5],
        rankList: [1, 3, 2, 4],
      };
    }
  } catch (error) {
    console.error('加载图表数据失败', error);
  } finally {
    loading.value = false;
  }
};

const onCycleChange = () => {
  loadData();
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <!-- 饼图区域（带下拉选择器） -->
    <div class="pie-chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activePieIndex" size="small" @change="handlePieChange">
          <el-option
            v-for="(opt, idx) in pieOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>
      <Pie
        style="flex: 1 !important;"
        :title-text="currentPieTitle"
        :data="currentPieData"
        @pie-click="handlePieClick"
      />
    </div>

    <BarHorizontal
      style="flex: 1.5 !important;"
      title="班级德育得分排名"
      :x-data="barHorizontalData.xData"
      :series-data="barHorizontalData.seriesData"
      y-name="班级"
      x-name="得分"
      @bar-click="handleBarClick"
    />
    <Bar
      style="flex: 2 !important;"
      title="各班级得分统计"
      :x-data="barData.xData"
      :series-data="barData.seriesData"
      y-name="得分"
      @bar-click="handleBarClick"
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

  .pie-chart-area {
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
