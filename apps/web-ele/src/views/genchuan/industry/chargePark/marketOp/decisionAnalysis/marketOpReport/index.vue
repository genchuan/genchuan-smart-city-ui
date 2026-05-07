<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';

import {
  getCycleReportChart,
} from '#/api/genchuan/industry/chargePark/marketOp/decisionAnalysis/marketOpReport';

import DrillDownDetailDialog from './components/DrillDownDetailDialog.vue';
import MarketOpReportStats from './components/MarketOpReportStats.vue';
import Table from './table/index.vue';

import '#/genchuan-components/page/index.scss';

// 控制统计组件显示/隐藏的状态 - 默认展开
const showStats = ref(true);

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

// 图表选项数据 - 用于图表切换
const pieChartOptions = ref([]);
const barChartOptions = ref([]);
const lineChartOptions = ref([]);

// 钻取弹窗引用
const drillDownDialogRef = ref(null);

// 获取统计数据
const fetchStatsData = async () => {
  try {
    // 调用API获取统计数据
    const response = await getCycleReportChart({ tenantId: 1 });
    console.log('getCycleReportChart response:', response);

    // 处理响应数据 - 支持两种格式：直接返回data或嵌套在response.data中
    const data = response?.data || response;

    if (data && data.cardData) {
      // 组装卡片数据 - 11张卡片
      statsData.value.cards = [
        {
          title: '活动数',
          value: data.cardData.activityCount || 0,
          color: '#4A90E2',
          type: 'activityCount',
        },
        {
          title: '参与用户数',
          value: data.cardData.joinUserCount || 0,
          color: '#50E3C2',
          type: 'joinUserCount',
        },
        {
          title: '抽奖量',
          value: data.cardData.lotteryCount || 0,
          color: '#FF9F40',
          type: 'lotteryCount',
        },
        {
          title: '中奖率',
          value: data.cardData.winningRate || '0%',
          color: '#A17FE0',
          type: 'winningRate',
        },
        {
          title: '优惠券发放量',
          value: data.cardData.couponSendCount || 0,
          color: '#FF6B8B',
          type: 'couponSendCount',
        },
        {
          title: '核销率',
          value: data.cardData.couponVerifyRate || '0%',
          color: '#4A90E2',
          type: 'couponVerifyRate',
        },
        {
          title: '卡种订单量',
          value: data.cardData.cardOrderCount || 0,
          color: '#50E3C2',
          type: 'cardOrderCount',
        },
        {
          title: '营收',
          value: `¥${(data.cardData.revenue || 0).toFixed(2)}`,
          color: '#FF9F40',
          type: 'revenue',
        },
        {
          title: '兑换量',
          value: data.cardData.exchangeCount || 0,
          color: '#A17FE0',
          type: 'exchangeCount',
        },
        {
          title: '总库存',
          value: data.cardData.totalStock || 0,
          color: '#FF6B8B',
          type: 'totalStock',
        },
        {
          title: '预警库存数',
          value: data.cardData.warnStockCount || 0,
          color: '#F56C6C',
          type: 'warnStockCount',
        },
      ];

      // 组装饼图选项数据 - 支持切换
      pieChartOptions.value = [
        {
          label: '规则类型占比',
          value: 'ruleType',
          data: (
            data.pieData?.find((item) => item.name === '规则类型占比')?.data ||
            []
          ).map((item) => ({
            name: getRuleTypeLabel(item.type),
            value: item.ratio,
            type: item.type,
          })),
        },
        {
          label: '配置类型占比',
          value: 'configType',
          data: (
            data.pieData?.find((item) => item.name === '配置类型占比')?.data ||
            []
          ).map((item) => ({
            name: getConfigTypeLabel(item.type),
            value: item.ratio,
            type: item.type,
          })),
        },
        {
          label: '券包类型占比',
          value: 'couponPackageType',
          data: (
            data.pieData?.find((item) => item.name === '券包类型占比')?.data ||
            []
          ).map((item) => ({
            name: getCouponPackageTypeLabel(item.type),
            value: item.ratio,
            type: item.type,
          })),
        },
      ].filter((item) => item.data.length > 0);

      // 默认饼图数据
      statsData.value.pieData = pieChartOptions.value[0]?.data || [];

      // 组装柱状图选项数据 - 支持切换
      barChartOptions.value = [
        {
          label: '活动类型分布',
          value: 'activityType',
          data: (
            data.barData?.find((item) => item.name === '活动类型分布')?.data ||
            []
          ).map((item) => ({
            name: getActivityTypeLabel(item.type),
            value: item.count,
            type: item.type,
          })),
        },
        {
          label: '奖品类型分布',
          value: 'prizeType',
          data: (
            data.barData?.find((item) => item.name === '奖品类型分布')?.data ||
            []
          ).map((item) => ({
            name: getPrizeTypeLabel(item.type),
            value: item.count,
            type: item.type,
          })),
        },
        {
          label: '优惠券类型分布',
          value: 'couponType',
          data: (
            data.barData?.find((item) => item.name === '优惠券类型分布')
              ?.data || []
          ).map((item) => ({
            name: getCouponTypeLabel(item.type),
            value: item.count,
            type: item.type,
          })),
        },
        {
          label: '卡种类型分布',
          value: 'cardType',
          data: (
            data.barData?.find((item) => item.name === '卡种类型分布')?.data ||
            []
          ).map((item) => ({
            name: getCardTypeLabel(item.type),
            value: item.count,
            type: item.type,
          })),
        },
        {
          label: '兑换类目分布',
          value: 'exchangeCategory',
          data: (
            data.barData?.find((item) => item.name === '兑换类目订单分布')
              ?.data || []
          ).map((item) => ({
            name: item.name,
            value: item.count,
            type: item.categoryId,
          })),
        },
      ].filter((item) => item.data.length > 0);

      // 默认柱状图数据
      statsData.value.barData = barChartOptions.value[0]?.data || [];

      // 组装折线图选项数据 - 支持切换
      const lineDataList = data.lineData || [];

      lineChartOptions.value = [
        {
          label: '活动参与趋势',
          value: 'joinTrend',
          data: {
            xAxis: (
              lineDataList.find((item) => item.name === '活动参与趋势')?.data ||
              []
            ).map((item) => {
              const dateObj = new Date(item.date);
              return `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
            }),
            series: (
              lineDataList.find((item) => item.name === '活动参与趋势')?.data ||
              []
            ).map((item) => item.count),
            fullDates: (
              lineDataList.find((item) => item.name === '活动参与趋势')?.data ||
              []
            ).map((item) => item.date),
          },
        },
        {
          label: '抽奖量趋势',
          value: 'lotteryTrend',
          data: {
            xAxis: (
              lineDataList.find((item) => item.name === '抽奖里趋势')?.data ||
              []
            ).map((item) => {
              const dateObj = new Date(item.date);
              return `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
            }),
            series: (
              lineDataList.find((item) => item.name === '抽奖里趋势')?.data ||
              []
            ).map((item) => item.count),
            fullDates: (
              lineDataList.find((item) => item.name === '抽奖里趋势')?.data ||
              []
            ).map((item) => item.date),
          },
        },
        {
          label: '优惠券发放趋势',
          value: 'couponSendTrend',
          data: {
            xAxis: (
              lineDataList.find((item) => item.name === '优惠券发放趋势')
                ?.data || []
            ).map((item) => {
              const dateObj = new Date(item.date);
              return `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
            }),
            series: (
              lineDataList.find((item) => item.name === '优惠券发放趋势')
                ?.data || []
            ).map((item) => item.count),
            fullDates: (
              lineDataList.find((item) => item.name === '优惠券发放趋势')
                ?.data || []
            ).map((item) => item.date),
          },
        },
        {
          label: '订单量趋势',
          value: 'orderTrend',
          data: {
            xAxis: (
              lineDataList.find((item) => item.name === '订单量趋势')?.data ||
              []
            ).map((item) => {
              const dateObj = new Date(item.date);
              return `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
            }),
            series: (
              lineDataList.find((item) => item.name === '订单量趋势')?.data ||
              []
            ).map((item) => item.count),
            fullDates: (
              lineDataList.find((item) => item.name === '订单量趋势')?.data ||
              []
            ).map((item) => item.date),
          },
        },
        {
          label: '库存趋势',
          value: 'stockTrend',
          data: {
            xAxis: (
              lineDataList.find((item) => item.name === '库存趋势')?.data || []
            ).map((item) => {
              const dateObj = new Date(item.date);
              return `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
            }),
            series: (
              lineDataList.find((item) => item.name === '库存趋势')?.data || []
            ).map((item) => item.count),
            fullDates: (
              lineDataList.find((item) => item.name === '库存趋势')?.data || []
            ).map((item) => item.date),
          },
        },
      ].filter((item) => item.data.xAxis.length > 0);

      // 默认折线图数据
      const joinTrendData =
        lineDataList.find((item) => item.name === '活动参与趋势')?.data || [];
      statsData.value.lineData = joinTrendData.map((item) => ({
        date: `${new Date(item.date).getMonth() + 1}/${new Date(item.date).getDate()}`,
        fullDate: item.date,
        value: item.count,
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

// 类型标签转换函数 - 使用系统字典配置
const getRuleTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.RULE_CONFIG_TYPE, String(type));
  return dict ? dict.label : type;
};

const getConfigTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.ACTIVITY_CONFIG_TYPE, String(type));
  return dict ? dict.label : type;
};

const getCouponPackageTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.PACKAGE_CONFIG_TYPE, String(type));
  return dict ? dict.label : type;
};

const getActivityTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.POINT_ACTIVITY_TYPE, String(type));
  return dict ? dict.label : type;
};

const getPrizeTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.PRIZE_MGMT_TYPE, String(type));
  return dict ? dict.label : type;
};

const getCouponTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.COUPON_MGMT_TYPE, String(type));
  return dict ? dict.label : type;
};

const getCardTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.CARD_CONFIG_TYPE, String(type));
  return dict ? dict.label : type;
};

const getExchangeCategoryLabel = (type) => {
  // 兑换类目暂无对应字典，使用硬编码映射
  const map = { 0: '数码产品', 1: '生活用品' };
  return map[type] || type;
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

  // 组装饼图选项数据 - 支持切换
  pieChartOptions.value = [
    {
      label: '规则类型占比',
      value: 'ruleType',
      data: [
        { name: '积分规则', value: 45, type: 'point' },
        { name: '抽奖规则', value: 30, type: 'lottery' },
        { name: '优惠券规则', value: 25, type: 'coupon' },
      ],
    },
    {
      label: '配置类型占比',
      value: 'configType',
      data: [
        { name: '系统配置', value: 60, type: 'system' },
        { name: '自定义配置', value: 40, type: 'custom' },
      ],
    },
    {
      label: '券包类型占比',
      value: 'couponPackageType',
      data: [
        { name: '新人券包', value: 35, type: 'newUser' },
        { name: '活动券包', value: 45, type: 'activity' },
        { name: '会员券包', value: 20, type: 'vip' },
      ],
    },
  ];

  // 默认饼图数据
  statsData.value.pieData = pieChartOptions.value[0].data;

  // 组装柱状图选项数据 - 支持切换
  barChartOptions.value = [
    {
      label: '活动类型分布',
      value: 'activityType',
      data: [
        { name: '积分活动', value: 12, type: 'point' },
        { name: '抽奖活动', value: 8, type: 'lottery' },
        { name: '优惠券活动', value: 5, type: 'coupon' },
      ],
    },
    {
      label: '奖品类型分布',
      value: 'prizeType',
      data: [
        { name: '实物奖品', value: 15, type: 'physical' },
        { name: '虚拟奖品', value: 25, type: 'virtual' },
        { name: '优惠券', value: 30, type: 'coupon' },
      ],
    },
    {
      label: '优惠券类型分布',
      value: 'couponType',
      data: [
        { name: '满减券', value: 20, type: 'fullReduction' },
        { name: '折扣券', value: 15, type: 'discount' },
        { name: '兑换券', value: 10, type: 'exchange' },
      ],
    },
    {
      label: '卡种类型分布',
      value: 'cardType',
      data: [
        { name: '月卡', value: 8, type: 'month' },
        { name: '季卡', value: 5, type: 'quarter' },
        { name: '年卡', value: 3, type: 'year' },
      ],
    },
    {
      label: '兑换类目分布',
      value: 'exchangeCategory',
      data: [
        { name: '数码产品', value: 12, type: 'digital' },
        { name: '生活用品', value: 18, type: 'daily' },
        { name: '食品', value: 25, type: 'food' },
      ],
    },
  ];

  // 默认柱状图数据
  statsData.value.barData = barChartOptions.value[0].data;

  // 组装折线图选项数据 - 支持切换
  const joinTrend = generateTrendData();
  const lotteryTrend = generateTrendData();
  const couponSendTrend = generateTrendData();
  const orderTrend = generateTrendData();
  const stockTrend = generateTrendData();

  lineChartOptions.value = [
    {
      label: '活动参与趋势',
      value: 'joinTrend',
      data: {
        xAxis: joinTrend.map((item) => item.date),
        series: joinTrend.map((item) => item.value),
        fullDates: joinTrend.map((item) => item.fullDate),
      },
    },
    {
      label: '抽奖量趋势',
      value: 'lotteryTrend',
      data: {
        xAxis: lotteryTrend.map((item) => item.date),
        series: lotteryTrend.map((item) => item.value),
        fullDates: lotteryTrend.map((item) => item.fullDate),
      },
    },
    {
      label: '优惠券发放趋势',
      value: 'couponSendTrend',
      data: {
        xAxis: couponSendTrend.map((item) => item.date),
        series: couponSendTrend.map((item) => item.value),
        fullDates: couponSendTrend.map((item) => item.fullDate),
      },
    },
    {
      label: '订单量趋势',
      value: 'orderTrend',
      data: {
        xAxis: orderTrend.map((item) => item.date),
        series: orderTrend.map((item) => item.value),
        fullDates: orderTrend.map((item) => item.fullDate),
      },
    },
    {
      label: '库存趋势',
      value: 'stockTrend',
      data: {
        xAxis: stockTrend.map((item) => item.date),
        series: stockTrend.map((item) => item.value),
        fullDates: stockTrend.map((item) => item.fullDate),
      },
    },
  ];

  // 默认折线图数据
  statsData.value.lineData = joinTrend;
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

// 处理卡片点击 - 打开钻取弹窗并筛选
const handleCardClick = async (cardType) => {
  console.log('卡片钻取:', cardType);

  // 打开钻取明细弹窗
  if (drillDownDialogRef.value) {
    drillDownDialogRef.value.open({
      drillType: cardType,
      drillValue: cardType,
      drillName: '',
      reportCycle: activeName.value,
    });
  }

  // 同时调用表格筛选
  await nextTick();
  const currentTable = getCurrentTableRef();
  if (currentTable) {
    currentTable.handleStatsFilter('card', cardType);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理饼图点击 - 打开钻取弹窗
const handlePieClick = async (drillInfo) => {
  console.log('饼图钻取:', drillInfo);

  // 打开钻取明细弹窗
  if (drillDownDialogRef.value) {
    drillDownDialogRef.value.open({
      drillType: drillInfo.type,
      drillValue: drillInfo.value,
      drillName: drillInfo.name,
      reportCycle: activeName.value,
    });
  }

  // 同时调用表格筛选
  await nextTick();
  const currentTable = getCurrentTableRef();
  if (currentTable) {
    currentTable.handleStatsFilter('pie', drillInfo.value);
  }
};

// 处理柱状图点击 - 打开钻取弹窗
const handleBarClick = async (drillInfo) => {
  console.log('柱状图钻取:', drillInfo);

  // 打开钻取明细弹窗
  if (drillDownDialogRef.value) {
    drillDownDialogRef.value.open({
      drillType: drillInfo.type,
      drillValue: drillInfo.value,
      drillName: drillInfo.name,
      reportCycle: activeName.value,
    });
  }

  // 同时调用表格筛选
  await nextTick();
  const currentTable = getCurrentTableRef();
  if (currentTable) {
    currentTable.handleStatsFilter('bar', drillInfo.value);
  }

};

// 处理折线图点击 - 打开钻取弹窗
const handleLineClick = async (drillInfo) => {
  console.log('折线图钻取:', drillInfo);

  // 打开钻取明细弹窗
  if (drillDownDialogRef.value) {
    drillDownDialogRef.value.open({
      drillType: drillInfo.type,
      drillValue: drillInfo.value,
      drillName: drillInfo.name,
      reportCycle: activeName.value,
    });
  }

  // 同时调用表格筛选
  await nextTick();
  const currentTable = getCurrentTableRef();
  if (currentTable) {
    currentTable.handleStatsFilter('line', drillInfo.value);
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

// 获取当前激活的tableRef（根据当前激活的标签页）
const getCurrentTableRef = () => {
  // 找到当前激活标签页的索引
  const activeIndex = reportCycleTabs.findIndex(
    (t) => t.label === activeName.value,
  );
  if (activeIndex === -1) return null;

  // 如果tableRef是数组，返回对应索引的表格实例
  if (Array.isArray(tableRef.value)) {
    return tableRef.value[activeIndex] &&
      typeof tableRef.value[activeIndex].handleStatsFilter === 'function'
      ? tableRef.value[activeIndex]
      : null;
  }
  // 否则直接返回
  return tableRef.value &&
    typeof tableRef.value.handleStatsFilter === 'function'
    ? tableRef.value
    : null;
};

// 报表周期标签列表 - 作为el-tabs的标签页
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

// 生成tabArray，使用报表周期作为标签
const tabArray = ref(
  reportCycleTabs.map((tab) => ({
    label: tab.label,
    value: tab.value,
    components: Table,
    showSecondary: true,
    secondShow: false,
  })),
);

// 当前激活的标签（默认第一个）
const activeName = ref(reportCycleTabs[0].label);

const secondShow = ref(false);

// 处理标签切换
const tabChange = (tabName) => {
  // 找到对应的报表周期值
  const tab = reportCycleTabs.find((t) => t.label === tabName);
  const currentTable = getCurrentTableRef();
  if (tab && currentTable) {
    // 调用表格的筛选方法，传入报表周期值
    currentTable.handleStatsFilter('reportCycle', tab.value);
  }
};

// 组件挂载时获取统计数据
onMounted(() => {
  fetchStatsData();
  // 默认筛选第一个报表周期 - 使用更长的延迟确保组件已完全渲染
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
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <MarketOpReportStats
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

    <!-- 钻取明细弹窗 -->
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
