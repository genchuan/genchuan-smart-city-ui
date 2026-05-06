<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';

import { ElMessage } from 'element-plus';

import { getCardOrderChart } from '#/api/genchuan/industry/chargePark/marketOp/cardMgmt/cardOrder';
import CardOrderStats from './components/CardOrderStats.vue';
import Table from './table/index.vue';

import '#/genchuan-components/page/index.scss';

// 控制统计组件显示/隐藏的状态
const showStats = ref(false);
const isStatsLoaded = ref(false);

// 切换统计组件显示/隐藏状态
const toggleStats = () => {
  showStats.value = !showStats.value;
  if (showStats.value && !isStatsLoaded.value) {
    fetchStatsData();
  }
};

// 统计数据
const statsData = ref({
  cards: [],
  barData: [],
  lineData: [],
});

// 获取支付状态标签文本
function getPayStatusLabel(payStatus) {
  const dict = getDictObj(DICT_TYPE.CARD_ORDER_PAY_STATUS, String(payStatus));
  return dict ? dict.label : payStatus;
}

// 获取统计数据 - 从API获取
const fetchStatsData = async () => {
  try {
    const response = await getCardOrderChart();
    console.log('统计接口返回数据:', response);
    if (!response) {
      throw new Error('获取统计数据失败');
    }

    // 组装卡片数据
    statsData.value.cards = [
      {
        title: '今日订单量',
        value: response.todayOrderCount || 0,
        color: '#4A90E2',
        type: 'todayOrder',
      },
      {
        title: '今日营收',
        value: '¥' + (response.todayRevenue || 0).toFixed(2),
        color: '#50E3C2',
        type: 'todayRevenue',
      },
    ];

    // 组装柱状图数据 - 支付状态分布
    // 将支付状态代码映射为字典标签
    statsData.value.barData = (response.payStatusCountList || []).map((item) => ({
      payStatus: item.payStatus,
      payStatusName: getPayStatusLabel(item.payStatus),
      count: item.count,
    }));

    // 组装折线图数据 - 订单量趋势
    statsData.value.lineData = (response.trendList || []).map((item) => ({
      date: item.date,
      fullDate: item.date,
      count: item.count,
    }));

    // 数据加载完成后显示统计组件
    isStatsLoaded.value = true;
    showStats.value = true;
  } catch (error) {
    ElMessage.error('获取统计数据失败');
    console.error('获取统计数据失败:', error);
    // 即使失败也显示统计组件（显示空数据）
    isStatsLoaded.value = true;
    showStats.value = true;
  }
};

// 获取表格组件实例（处理v-for中的ref数组情况）
const getTableComponent = () => {
  // 在v-for中使用ref时，tableRef可能是数组
  const tableComponent = Array.isArray(tableRef.value)
    ? tableRef.value[0]
    : tableRef.value;
  return tableComponent;
};

// 处理卡片点击 - 钻取筛选
const handleCardClick = async (cardType, value) => {
  await nextTick();
  const tableComponent = getTableComponent();
  if (
    tableComponent &&
    typeof tableComponent.handleStatsFilter === 'function'
  ) {
    tableComponent.handleStatsFilter('card', cardType, value);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理柱状图点击 - 钻取筛选支付状态
const handleBarClick = async (payStatus) => {
  await nextTick();
  const tableComponent = getTableComponent();
  if (
    tableComponent &&
    typeof tableComponent.handleStatsFilter === 'function'
  ) {
    tableComponent.handleStatsFilter('payStatus', payStatus);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理折线图点击 - 钻取跳转对应日期的订单明细
const handleLineClick = async (date) => {
  await nextTick();
  const tableComponent = getTableComponent();
  if (
    tableComponent &&
    typeof tableComponent.handleStatsFilter === 'function'
  ) {
    tableComponent.handleStatsFilter('date', date);
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
    label: '卡种订单',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('卡种订单');
const secondShow = ref(false);

// 组件挂载时获取统计数据
onMounted(() => {
  console.log('组件挂载，开始获取统计数据');
  fetchStatsData();
});

// 监听 statsData 变化，确保图表能正确渲染
watch(
  () => statsData.value,
  (newVal) => {
    console.log('statsData 变化:', newVal);
  },
  { deep: true }
);
</script>
<template>
  <div class="common-index">
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <CardOrderStats
      v-if="showStats && isStatsLoaded"
      :data="statsData"
      @card-click="handleCardClick"
      @bar-click="handleBarClick"
      @line-click="handleLineClick"
    />
    <!-- 箭头图标已屏蔽 -->
    <!--
    <div class="icon-change">
      <el-icon
        class="tabel-tab-icon"
        v-if="secondShow"
        @click="changeArrowStatus"
      >
        <ArrowDown />
      </el-icon>
      <el-icon
        class="tabel-tab-icon"
        v-if="!secondShow"
        @click="changeArrowStatus"
      >
        <ArrowUp />
      </el-icon>
    </div>
    -->
    <el-tabs
      v-model="activeName"
      class="common-tabs"
      type="card"
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
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
