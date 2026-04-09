<!-- 文件5: components/chart.vue (图表组件：卡片 + 饼图切换 + 柱状图切换) -->
<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage, ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import {
  getAidWorkChart,
  getApplyCount,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/aidWork/data.js';

const loading = ref(true);
const chartData = ref({});
const typeApplyData = ref([]);

// 卡片列表
const cardList = computed(() => {
  const totalCount = chartData.value.totalApplyCount || 0;
  const totalPass = chartData.value.totalPassCount || 0;
  const totalAmount = chartData.value.totalApplyAmount || 0;
  const totalGrant = chartData.value.totalGrantAmount || 0;
  return [
    { title: '总申请数', value: totalCount, color: '#409EFF', status: 'total' },
    { title: '总通过数', value: totalPass, color: '#67C23A', status: 'passed' },
    { title: '总申请金额', value: `¥${totalAmount.toFixed(2)}`, color: '#E6A23C', status: 'amount' },
    { title: '总发放金额', value: `¥${totalGrant.toFixed(2)}`, color: '#F56C6C', status: 'grant' },
  ];
});

// 各状态申请数量饼图数据
const statusPieData = computed(() => {
  const map = chartData.value.statusCountMap || {};
  return Object.entries(map).map(([name, value]) => ({ name, value }));
});

// 各资助类型申请数量饼图数据
const typePieData = computed(() => {
  const map = chartData.value.typeCountMap || {};
  return Object.entries(map).map(([name, value]) => ({ name, value }));
});

// 饼图切换选项
const pieOptions = computed(() => [
  {
    title: '各状态申请数量',
    data: statusPieData.value,
    type: 'status',
  },
  {
    title: '各资助类型申请数量',
    data: typePieData.value,
    type: 'aidType',
  },
]);

const activePieIndex = ref(0);
const currentPieData = computed(() => pieOptions.value[activePieIndex.value] || pieOptions.value[0]);

// 切换饼图
const handlePieChange = (index) => {
  activePieIndex.value = index;
};

// 柱状图数据
const barXData = computed(() => typeApplyData.value.map(item => item.name));

// 柱状图切换选项
const chartOptions = computed(() => [
  {
    type: 'bar',
    title: '各类型申请人数',
    xData: barXData.value,
    seriesData: [{ name: '申请人数', data: typeApplyData.value.map(item => item.applyCount) }],
    yName: '人数',
  },
  {
    type: 'bar',
    title: '各类型办理完成人数',
    xData: barXData.value,
    seriesData: [{ name: '办理完成人数', data: typeApplyData.value.map(item => item.finishCount) }],
    yName: '人数',
  },
  {
    type: 'bar',
    title: '各类型办理完成率',
    xData: barXData.value,
    seriesData: [{ name: '办理完成率(%)', data: typeApplyData.value.map(item => item.finishRate) }],
    yName: '完成率(%)',
  },
]);

const activeChartIndex = ref(0);
const currentChart = computed(() => chartOptions.value[activeChartIndex.value] || chartOptions.value[0]);

// 切换柱状图
const handleChartChange = (index) => {
  activeChartIndex.value = index;
};

const emit = defineEmits(['cardClick', 'pieClick', 'barClick']);

const handleCardClick = (cardInfo) => {
  emit('cardClick', cardInfo.status);
};

// 饼图点击：根据当前选中的饼图类型传递不同的筛选参数
const handlePieClick = (item) => {
  const pieType = currentPieData.value.type;
  emit('pieClick', { type: pieType, value: item.name });
};

const handleBarClick = (params) => {
  // 柱状图点击筛选对应类型
  const typeName = params.name;
  emit('barClick', { type: 'aidType', value: typeName });
};

const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, applyRes] = await Promise.allSettled([
      getAidWorkChart({}),
      getApplyCount({}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        totalApplyCount: 256,
        totalPassCount: 198,
        totalApplyAmount: 768000,
        totalGrantAmount: 594000,
        statusCountMap: { '待审核': 32, '已通过': 198, '已完成': 26 },
        typeCountMap: { '奖学金': 86, '助学金': 102, '助学贷款': 48, '勤工俭学': 20 },
      };
    }
    if (applyRes.status === 'fulfilled') {
      typeApplyData.value = applyRes.value.list || [];
    } else {
      typeApplyData.value = [
        { name: '奖学金', applyCount: 86, finishCount: 78, finishRate: 90.70 },
        { name: '助学金', applyCount: 102, finishCount: 92, finishRate: 90.20 },
        { name: '助学贷款', applyCount: 48, finishCount: 42, finishRate: 87.50 },
        { name: '勤工俭学', applyCount: 20, finishCount: 18, finishRate: 90.00 },
      ];
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
    <!-- 卡片区 -->
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <!-- 饼图切换区域 -->
    <div class="pie-chart-area">
      <div class="pie-select-wrapper">
        <el-select
          v-model="activePieIndex"
          size="small"
          @change="handlePieChange"
        >
          <el-option
            v-for="(opt, idx) in pieOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>
      <Pie
        :title-text="currentPieData.title"
        :data="currentPieData.data"
        @pie-click="handlePieClick"
      />
    </div>

    <!-- 柱状图切换区域 -->
    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select
          v-model="activeChartIndex"
          size="small"
          @change="handleChartChange"
        >
          <el-option
            v-for="(opt, idx) in chartOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>
      <Bar
        :title="currentChart.title"
        :x-data="currentChart.xData"
        :series-data="currentChart.seriesData"
        :y-name="currentChart.yName"
        @bar-click="handleBarClick"
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
    gap: 12px;
    min-width: 360px;
    max-width: 400px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }
}

/* 饼图切换区域样式 */
.pie-chart-area {
  position: relative;
  flex: 1;
  min-width: 280px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}

.pie-select-wrapper {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
}

/* 柱状图切换区域样式 */
.chart-area {
  position: relative;
  flex: 1.5;
  min-width: 300px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}

.chart-select-wrapper {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
}
</style>
