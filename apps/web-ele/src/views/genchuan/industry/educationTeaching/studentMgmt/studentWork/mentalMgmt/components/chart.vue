<script setup>
import {computed, onMounted, ref} from 'vue';
import {ElSelect, ElOption} from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import {
  getMentalMgmtChart,
  getStatusDistribution,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/mentalMgmt/data.js';

const loading = ref(true);
const overviewData = ref({});
const mentalStatusData = ref([]);
const riskLevelData = ref([]);

// 饼图切换相关
const activePieType = ref('mentalStatus');
const pieOptions = [
  {title: '心理状态分布', value: 'mentalStatus'},
  {title: '风险等级分布', value: 'riskLevel'},
];
const currentPieTitle = computed(() => {
  const opt = pieOptions.find(o => o.value === activePieType.value);
  return opt ? opt.title : '';
});
const currentPieData = computed(() => {
  return activePieType.value === 'mentalStatus' ? mentalStatusData.value : riskLevelData.value;
});

// 卡片列表
const cardList = computed(() => {
  const data = overviewData.value;
  return [
    {title: '心理档案总数', value: data.totalCount || 0, color: '#409EFF', status: 'total'},
    {title: '心理状态正常', value: data.normalCount || 0, color: '#67C23A', status: 'normal'},
    {title: '心理状态关注', value: data.focusCount || 0, color: '#E6A23C', status: 'focus'},
    {title: '心理状态高危', value: data.highRiskCount || 0, color: '#F56C6C', status: 'highRisk'},
    {title: '风险等级低', value: data.lowRiskCount || 0, color: '#67C23A', status: 'lowRisk'},
    {title: '风险等级中', value: data.midRiskCount || 0, color: '#E6A23C', status: 'midRisk'},
    {
      title: '风险等级高',
      value: data.highRiskLevelCount || 0,
      color: '#F56C6C',
      status: 'highRiskLevel'
    },
    {title: '待评估', value: data.waitEvaluateCount || 0, color: '#909399', status: 'waitEvaluate'},
    {title: '咨询中', value: data.consultingCount || 0, color: '#409EFF', status: 'consulting'},
    {title: '已干预', value: data.intervenedCount || 0, color: '#67C23A', status: 'intervened'},
    {title: '近7天新增', value: data.recent7DayCount || 0, color: '#E6A23C', status: 'recent'},
  ];
});

// ========== 核心修改：所有点击改为派发自定义事件 ==========
// 卡片点击映射：根据卡片status映射到筛选字段
const handleCardClick = (cardInfo) => {
  let filterType = null;
  let filterValue = null;
  switch (cardInfo.status) {
    case 'normal':
      filterType = 'mentalStatus';
      filterValue = '正常';
      break;
    case 'focus':
      filterType = 'mentalStatus';
      filterValue = '关注';
      break;
    case 'highRisk':
      filterType = 'mentalStatus';
      filterValue = '高危';
      break;
    case 'lowRisk':
      filterType = 'riskLevel';
      filterValue = '低';
      break;
    case 'midRisk':
      filterType = 'riskLevel';
      filterValue = '中';
      break;
    case 'highRiskLevel':
      filterType = 'riskLevel';
      filterValue = '高';
      break;
    case 'waitEvaluate':
      filterType = 'status';
      filterValue = '待评估';
      break;
    case 'consulting':
      filterType = 'status';
      filterValue = '咨询中';
      break;
    case 'intervened':
      filterType = 'status';
      filterValue = '已干预';
      break;
    case 'recent':
      // 近7天新增：按创建时间筛选最近7天，列表组件需支持 createTime 范围筛选
      // 这里简化：传递 createTime 字段和日期范围字符串，列表组件需解析
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];
      filterType = 'createTime';
      filterValue = [startStr, endStr];
      break;
    case 'total':
    default:
      // 档案总数不筛选
      return;
  }
  window.dispatchEvent(new CustomEvent('mental-chart-filter', {
    detail: {type: filterType, value: filterValue}
  }));
};

// 饼图点击
const handlePieClick = (item) => {
  const type = activePieType.value === 'mentalStatus' ? 'mentalStatus' : 'riskLevel';
  window.dispatchEvent(new CustomEvent('mental-chart-filter', {
    detail: {type, value: item.name}
  }));
};

const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, distRes] = await Promise.allSettled([
      getMentalMgmtChart(),
      getStatusDistribution(),
    ]);
    if (chartRes.status === 'fulfilled') {
      overviewData.value = chartRes.value;
    } else {
      overviewData.value = {
        totalCount: 120,
        normalCount: 98,
        focusCount: 18,
        highRiskCount: 4,
        lowRiskCount: 100,
        midRiskCount: 16,
        highRiskLevelCount: 4,
        waitEvaluateCount: 10,
        consultingCount: 5,
        intervenedCount: 105,
        recent7DayCount: 8,
      };
    }
    if (distRes.status === 'fulfilled') {
      mentalStatusData.value = distRes.value.mentalStatusDistribution || [];
      riskLevelData.value = distRes.value.riskLevelDistribution || [];
    } else {
      mentalStatusData.value = [
        {name: '正常', value: 98},
        {name: '关注', value: 18},
        {name: '高危', value: 4},
      ];
      riskLevelData.value = [
        {name: '低', value: 100},
        {name: '中', value: 16},
        {name: '高', value: 4},
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
    <div class="box-left-big" style="flex: 2 !important;">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <div class="pie-chart-container" style="flex: 1 !important;">
      <div class="pie-select-wrapper">
        <el-select v-model="activePieType" size="small">
          <el-option v-for="opt in pieOptions" :key="opt.value" :label="opt.title"
                     :value="opt.value"/>
        </el-select>
      </div>
      <Pie
        :title-text="currentPieTitle"
        :data="currentPieData"
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

  .box-left-big {
    display: grid !important;
    grid-template-columns: repeat(6, 1fr);
    min-width: 360px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }

  .pie-chart-container {
    position: relative;
    min-width: 280px;
  }

  .pie-select-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }
}
</style>
