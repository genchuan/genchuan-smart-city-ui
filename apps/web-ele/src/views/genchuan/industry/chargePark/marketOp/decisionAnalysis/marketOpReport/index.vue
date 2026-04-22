<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { ElMessage } from 'element-plus';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

import { getMarketOpReportChart } from '#/api/genchuan/industry/chargePark/marketOp/decisionAnalysis/marketOpReport';

import MarketOpReportStats from './components/MarketOpReportStats.vue';
import Table from './table/index.vue';

import '#/genchuan-components/page/index.scss';

// 控制统计组件显示/隐藏的状态
const showStats = ref(false);

// 切换统计组件显示/隐藏状态
const toggleStats = () => {
  showStats.value = !showStats.value;
  if (showStats.value) {
    fetchStatsData();
  }
};

// 统计数据
const statsData = ref({
  cards: [],
  barData: [],
  lineData: [],
});

// 获取统计数据
const fetchStatsData = async () => {
  try {
    // 调用API获取统计数据
    const response = await getMarketOpReportChart({ reportId: 1 });
    if (response && response.code === 200 && response.data) {
      const data = response.data;

      // 组装卡片数据 - 营销核心指标
      const coreIndex = data.coreIndex || {};
      statsData.value.cards = [
        {
          title: '活动参与率',
          value: coreIndex.joinRate ? `${(coreIndex.joinRate * 100).toFixed(1)}%` : '0%',
          color: '#4A90E2',
          type: 'joinRate',
        },
        {
          title: '优惠券核销率',
          value: coreIndex.couponRate ? `${(coreIndex.couponRate * 100).toFixed(1)}%` : '0%',
          color: '#50E3C2',
          type: 'couponRate',
        },
        {
          title: '卡种销量',
          value: coreIndex.cardSales || 0,
          color: '#FF9F40',
          type: 'cardSales',
        },
      ];

      // 组装柱状图数据 - 活动效果分布
      statsData.value.barData = (data.effectDistribution || []).map((item) => ({
        activityId: item.name,
        activityName: item.name,
        effectValue: item.value,
      }));

      // 组装折线图数据 - 营销运营趋势
      statsData.value.lineData = (data.marketTrend || []).map((item) => ({
        date: item.date,
        fullDate: item.date,
        value: item.value,
      }));
    } else {
      // 使用模拟数据
      useMockData();
    }
  } catch (error) {
    console.error('获取统计数据失败:', error);
    // 使用模拟数据
    useMockData();
  }
};

// 使用模拟数据
const useMockData = () => {
  // 组装卡片数据 - 营销核心指标
  statsData.value.cards = [
    {
      title: '活动参与率',
      value: '65.2%',
      color: '#4A90E2',
      type: 'joinRate',
    },
    {
      title: '优惠券核销率',
      value: '42.8%',
      color: '#50E3C2',
      type: 'couponRate',
    },
    {
      title: '卡种销量',
      value: 1286,
      color: '#FF9F40',
      type: 'cardSales',
    },
  ];

  // 组装柱状图数据 - 活动效果分布
  statsData.value.barData = [
    { activityId: '1', activityName: '积分活动', effectValue: 500 },
    { activityId: '2', activityName: '优惠活动', effectValue: 600 },
    { activityId: '3', activityName: '卡种销售', effectValue: 400 },
    { activityId: '4', activityName: '兑换业务', effectValue: 300 },
    { activityId: '5', activityName: '满减活动', effectValue: 450 },
  ];

  // 组装折线图数据 - 营销运营趋势
  statsData.value.lineData = generateTrendData();
};

// 生成趋势数据
const generateTrendData = () => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    const fullDateStr = date.toISOString().split('T')[0];
    // 随机生成指标值 (1000-2000之间)
    const value = Math.floor(Math.random() * 1000) + 1000;
    data.push({
      date: dateStr,
      fullDate: fullDateStr,
      value,
    });
  }
  return data;
};

// 处理卡片点击 - 钻取筛选
const handleCardClick = async (cardType) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('indicator', cardType);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理柱状图点击 - 钻取筛选活动
const handleBarClick = async (activityId) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('activity', activityId);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理折线图点击 - 钻取跳转对应时间的明细数据
const handleLineClick = async (date) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('trendDate', date);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const tableRef = ref(null);

// 使用computed确保showStats是响应式的
const showStatsValue = computed(() => showStats.value);

const tabArray = ref([
  {
    label: '营销运营报表',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('营销运营报表');
const secondShow = ref(false);

const tabChange = () => {
  // 切换标签时的逻辑
};

// 组件挂载时获取统计数据
onMounted(() => {
  fetchStatsData();
});
</script>
<template>
  <div class="common-index">
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <MarketOpReportStats
      v-if="showStats"
      :data="statsData"
      @card-click="handleCardClick"
      @bar-click="handleBarClick"
      @line-click="handleLineClick"
    />

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
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
