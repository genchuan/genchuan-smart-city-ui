<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/bar.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import lineChart from '#/genchuan-components/stats/lineChart.vue';
import {
  getCoopEnterpriseChart,
  getCoopEnterpriseDistribution,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/employMgmt/coopEnterprise/data.js';

const loading = ref(true);
const chartData = ref({});
const distributionData = ref({});

const cardList = computed(() => {
  const total = chartData.value.totalEnterprise || 0;
  const cooperating = chartData.value.cooperatingEnterprise || 0;
  const finished = chartData.value.finishedEnterprise || 0;
  return [
    {title: '总合作企业数', value: total, color: '#409EFF', status: 'total'},
    {title: '合作中', value: cooperating, color: '#67C23A', status: 'cooperating'},
    {title: '已结束', value: finished, color: '#909399', status: 'finished'},
  ];
});

const pieData = computed(() => {
  const dist = distributionData.value.typeDistribution || [];
  return dist.map(item => ({name: item.name, value: item.value}));
});

const chartOptions = computed(() => [
  {
    type: 'bar',
    title: '各系部合作数量分布',
    getData: () => {
      const deptDist = distributionData.value.deptDistribution || [];
      return {
        xData: deptDist.map(item => item.name),
        seriesData: [{name: '合作企业数', data: deptDist.map(item => item.value)}],
      };
    },
    yName: '合作企业数',
  },
  {
    type: 'line',
    title: '合作趋势',
    getData: () => {
      const trend = chartData.value.coopTrend || [];
      return {
        xData: trend.map(item => item.date),
        seriesData: [{name: '合作企业数', data: trend.map(item => item.count)}],
      };
    },
    yName: '合作企业数',
  },
]);

const activeChartIndex = ref(0);
const currentChart = computed(() => {
  const opt = chartOptions.value[activeChartIndex.value];
  const {xData, seriesData} = opt.getData();
  return {
    type: opt.type,
    title: opt.title,
    xData,
    seriesData,
    yName: opt.yName,
  };
});

const handleChartChange = (index) => {
  activeChartIndex.value = index;
};

// ========== 核心修改：所有点击改为派发自定义事件 ==========
const handleCardClick = (cardInfo) => {
  let filterType = null;
  let filterValue = null;
  switch (cardInfo.status) {
    case 'cooperating':
      filterType = 'status';
      filterValue = '合作中';
      break;
    case 'finished':
      filterType = 'status';
      filterValue = '已结束';
      break;
    case 'total':
    default:
      return;
  }
  window.dispatchEvent(new CustomEvent('coop-enterprise-chart-filter', {
    detail: {type: filterType, value: filterValue}
  }));
};

const handlePieClick = (item) => {
  window.dispatchEvent(new CustomEvent('coop-enterprise-chart-filter', {
    detail: {type: 'enterpriseType', value: item.name}
  }));
};

// 加载数据（保持不变）
const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, distRes] = await Promise.allSettled([
      getCoopEnterpriseChart({}),
      getCoopEnterpriseDistribution({}),
    ]);
    if (chartRes.status === 'fulfilled') chartData.value = chartRes.value;
    else {
      chartData.value = {
        totalEnterprise: 36,
        cooperatingEnterprise: 28,
        finishedEnterprise: 8,
        deptCoopCount: [
          {deptName: '计算机系', count: 12},
          {deptName: '机电系', count: 10},
          {deptName: '经贸系', count: 8},
          {deptName: '其他', count: 6},
        ],
        coopTrend: [
          {date: '2024-01', count: 2},
          {date: '2024-02', count: 3},
          {date: '2024-03', count: 5},
        ],
      };
    }
    if (distRes.status === 'fulfilled') distributionData.value = distRes.value;
    else {
      distributionData.value = {
        typeDistribution: [
          {name: '民企', value: 22},
          {name: '国企', value: 8},
          {name: '外企', value: 6},
        ],
        deptDistribution: [
          {name: '计算机系', value: 12},
          {name: '机电系', value: 10},
          {name: '经贸系', value: 8},
          {name: '其他', value: 6},
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
    <div class="chart-box-left">
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
      title-text="合作企业类型分布"
      :data="pieData"
      @pie-click="handlePieClick"
    />

    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activeChartIndex" size="small" @change="handleChartChange">
          <el-option v-for="(opt, idx) in chartOptions" :key="idx" :label="opt.title" :value="idx"/>
        </el-select>
      </div>

      <Bar
        v-if="currentChart.type === 'bar'"
        :title="currentChart.title"
        :x-data="currentChart.xData"
        :series-data="currentChart.seriesData"
        :y-name="currentChart.yName"
      />
      <lineChart
        v-else
        :title="currentChart.title"
        :x-data="currentChart.xData"
        :series-data="currentChart.seriesData"
        :y-name="currentChart.yName"
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

  .chart-box-left {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin: 0;
  }

  .chart-area {
    position: relative;
    flex: 1.5;
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
