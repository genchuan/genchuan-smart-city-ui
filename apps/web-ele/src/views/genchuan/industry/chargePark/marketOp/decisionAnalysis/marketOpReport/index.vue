<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import {
  getCycleReportBarDrill,
  getCycleReportCardDrill,
  getCycleReportChart,
  getCycleReportLineDrill,
  getCycleReportPieDrill,
} from '#/api/genchuan/industry/chargePark/marketOp/decisionAnalysis/marketOpReport';

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
  pieData: [],
  barData: [],
  lineData: [],
});

// 获取统计数据
const fetchStatsData = async () => {
  try {
    // 调用API获取统计数据
    const response = await getCycleReportChart({ reportId: 1 });
    if (response && response.code === 200 && response.data) {
      const data = response.data;

      // 组装卡片数据 - 11张卡片
      statsData.value.cards = [
        {
          title: '活动数',
          value: data.activityCount || 0,
          color: '#4A90E2',
          type: 'activityCount',
        },
        {
          title: '参与用户数',
          value: data.joinUserCount || 0,
          color: '#50E3C2',
          type: 'joinUserCount',
        },
        {
          title: '抽奖量',
          value: data.lotteryCount || 0,
          color: '#FF9F40',
          type: 'lotteryCount',
        },
        {
          title: '中奖率',
          value: data.winningRate || '0%',
          color: '#A17FE0',
          type: 'winningRate',
        },
        {
          title: '优惠券发放量',
          value: data.couponSendCount || 0,
          color: '#FF6B8B',
          type: 'couponSendCount',
        },
        {
          title: '核销率',
          value: data.couponVerifyRate || '0%',
          color: '#4A90E2',
          type: 'couponVerifyRate',
        },
        {
          title: '卡种订单量',
          value: data.cardOrderCount || 0,
          color: '#50E3C2',
          type: 'cardOrderCount',
        },
        {
          title: '营收',
          value: `¥${(data.revenue || 0).toFixed(2)}`,
          color: '#FF9F40',
          type: 'revenue',
        },
        {
          title: '兑换量',
          value: data.exchangeCount || 0,
          color: '#A17FE0',
          type: 'exchangeCount',
        },
        {
          title: '总库存',
          value: data.totalStock || 0,
          color: '#FF6B8B',
          type: 'totalStock',
        },
        {
          title: '预警库存数',
          value: data.warnStockCount || 0,
          color: '#F56C6C',
          type: 'warnStockCount',
        },
      ];

      // 组装饼图数据 - 规则类型占比
      statsData.value.pieData = (data.ruleTypeDistribution || []).map(
        (item) => ({
          name: item.name,
          value: item.value,
          type: item.type,
        }),
      );

      // 组装柱状图数据 - 活动类型分布
      statsData.value.barData = (data.activityTypeDistribution || []).map(
        (item) => ({
          name: item.name,
          value: item.value,
          type: item.type,
        }),
      );

      // 组装折线图数据 - 活动参与趋势
      statsData.value.lineData = (data.joinTrend || []).map((item) => ({
        date: item.date,
        fullDate: item.fullDate,
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
  // 组装卡片数据 - 11张卡片
  statsData.value.cards = [
    { title: '活动数', value: 25, color: '#4A90E2', type: 'activityCount' },
    {
      title: '参与用户数',
      value: 1200,
      color: '#50E3C2',
      type: 'joinUserCount',
    },
    { title: '抽奖量', value: 3500, color: '#FF9F40', type: 'lotteryCount' },
    { title: '中奖率', value: '12.50%', color: '#A17FE0', type: 'winningRate' },
    {
      title: '优惠券发放量',
      value: 5000,
      color: '#FF6B8B',
      type: 'couponSendCount',
    },
    {
      title: '核销率',
      value: '38.60%',
      color: '#4A90E2',
      type: 'couponVerifyRate',
    },
    {
      title: '卡种订单量',
      value: 320,
      color: '#50E3C2',
      type: 'cardOrderCount',
    },
    { title: '营收', value: '¥15600.80', color: '#FF9F40', type: 'revenue' },
    { title: '兑换量', value: 890, color: '#A17FE0', type: 'exchangeCount' },
    { title: '总库存', value: 1200, color: '#FF6B8B', type: 'totalStock' },
    {
      title: '预警库存数',
      value: 35,
      color: '#F56C6C',
      type: 'warnStockCount',
    },
  ];

  // 组装饼图数据 - 规则类型占比
  statsData.value.pieData = [
    { name: '积分规则', value: 45, type: 'point' },
    { name: '抽奖规则', value: 30, type: 'lottery' },
    { name: '优惠券规则', value: 25, type: 'coupon' },
  ];

  // 组装柱状图数据 - 活动类型分布
  statsData.value.barData = [
    { name: '积分活动', value: 12, type: 'point' },
    { name: '抽奖活动', value: 8, type: 'lottery' },
    { name: '优惠券活动', value: 5, type: 'coupon' },
  ];

  // 组装折线图数据 - 活动参与趋势
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
    // 随机生成参与人数 (100-500之间)
    const value = Math.floor(Math.random() * 400) + 100;
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
  if (
    tableRef.value &&
    typeof tableRef.value.handleStatsFilter === 'function'
  ) {
    tableRef.value.handleStatsFilter('card', cardType);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }

  // 调用卡片钻取API
  try {
    const response = await getCycleReportCardDrill({ cardType });
    console.log('卡片钻取数据:', response);
  } catch (error) {
    console.error('卡片钻取失败:', error);
  }
};

// 处理饼图点击 - 钻取筛选规则类型
const handlePieClick = async (type) => {
  await nextTick();
  if (
    tableRef.value &&
    typeof tableRef.value.handleStatsFilter === 'function'
  ) {
    tableRef.value.handleStatsFilter('pie', type);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }

  // 调用饼图钻取API
  try {
    const response = await getCycleReportPieDrill({
      pieType: '规则类型占比',
      type,
    });
    console.log('饼图钻取数据:', response);
  } catch (error) {
    console.error('饼图钻取失败:', error);
  }
};

// 处理柱状图点击 - 钻取筛选活动类型
const handleBarClick = async (type) => {
  await nextTick();
  if (
    tableRef.value &&
    typeof tableRef.value.handleStatsFilter === 'function'
  ) {
    tableRef.value.handleStatsFilter('bar', type);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }

  // 调用柱状图钻取API
  try {
    const response = await getCycleReportBarDrill({
      barType: '活动类型分布',
      type,
    });
    console.log('柱状图钻取数据:', response);
  } catch (error) {
    console.error('柱状图钻取失败:', error);
  }
};

// 处理折线图点击 - 钻取跳转对应时间的明细数据
const handleLineClick = async (date) => {
  await nextTick();
  if (
    tableRef.value &&
    typeof tableRef.value.handleStatsFilter === 'function'
  ) {
    tableRef.value.handleStatsFilter('line', date);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }

  // 调用折线图钻取API
  try {
    const response = await getCycleReportLineDrill({
      lineType: '活动参与趋势',
      date,
    });
    console.log('折线图钻取数据:', response);
  } catch (error) {
    console.error('折线图钻取失败:', error);
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
      @pie-click="handlePieClick"
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
