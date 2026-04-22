<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { ElMessage } from 'element-plus';

import CardOrderStats from './components/CardOrderStats.vue';
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

// 获取统计数据 - 模拟数据
const fetchStatsData = async () => {
  try {
    // 模拟统计数据
    const mockData = {
      // 今日订单量和今日营收
      todayOrderCount: 156,
      todayRevenue: 25880.00,
      // 卡种类型分布
      cardTypeDistribution: [
        { cardId: 1, cardName: '日卡', count: 45 },
        { cardId: 2, cardName: '周卡', count: 38 },
        { cardId: 3, cardName: '月卡', count: 42 },
        { cardId: 4, cardName: '季卡', count: 18 },
        { cardId: 5, cardName: '年卡', count: 13 },
      ],
      // 近30天订单趋势
      dailyTrend: generateDailyTrendData(),
    };

    // 组装卡片数据
    statsData.value.cards = [
      {
        title: '今日订单量',
        value: mockData.todayOrderCount,
        color: '#4A90E2',
        type: 'todayOrder',
      },
      {
        title: '今日营收',
        value: '¥' + mockData.todayRevenue.toFixed(2),
        color: '#50E3C2',
        type: 'todayRevenue',
      },
    ];

    // 组装柱状图数据 - 卡种类型分布
    statsData.value.barData = mockData.cardTypeDistribution;

    // 组装折线图数据 - 订单量趋势
    statsData.value.lineData = mockData.dailyTrend;
  } catch (error) {
    ElMessage.error('获取统计数据失败');
    console.error(error);
  }
};

// 生成近30天的模拟数据
const generateDailyTrendData = () => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    const fullDate = date.toISOString().split('T')[0];
    // 随机生成订单量 (20-80之间)
    const count = Math.floor(Math.random() * 60) + 20;
    data.push({
      date: dateStr,
      fullDate: fullDate,
      count,
    });
  }
  return data;
};

// 处理卡片点击 - 钻取筛选
const handleCardClick = async (cardType, value) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('card', cardType, value);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理柱状图点击 - 钻取筛选卡种类型
const handleBarClick = async (cardId) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('cardType', cardId);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理折线图点击 - 钻取跳转对应日期的订单明细
const handleLineClick = async (date) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('date', date);
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
  fetchStatsData();
});
</script>
<template>
  <div class="common-index">
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <CardOrderStats
      v-if="showStats"
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
