<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { ElMessage } from 'element-plus';

import ExchangeOrderStats from './components/ExchangeOrderStats.vue';
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
    // 实际项目中应该从API获取数据
    const mockData = {
      // 今日订单量和今日兑换量
      todayOrderCount: 15,
      todayExchangeCount: 8,
      // 类目订单分布
      categoryDistribution: [
        { categoryId: 1, name: '数码配件', value: 12 },
        { categoryId: 2, name: '生活用品', value: 8 },
        { categoryId: 3, name: '食品饮料', value: 15 },
        { categoryId: 4, name: '虚拟商品', value: 5 },
        { categoryId: 5, name: '汽车用品', value: 10 },
        { categoryId: 6, name: '充电服务', value: 6 },
      ],
      // 近30天订单量趋势
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
        title: '今日兑换量',
        value: mockData.todayExchangeCount,
        color: '#50E3C2',
        type: 'todayExchange',
      },
    ];

    // 组装柱状图数据 - 类目订单分布
    statsData.value.barData = mockData.categoryDistribution;

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
    const fullDateStr = date.toISOString().split('T')[0];
    // 随机生成订单数量 (5-20之间)
    const value = Math.floor(Math.random() * 16) + 5;
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
    tableRef.value.handleStatsFilter('card', cardType);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理柱状图点击 - 钻取筛选类目
const handleBarClick = async (categoryId) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('categoryId', categoryId);
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
    label: '兑换订单',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('兑换订单');
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
    <ExchangeOrderStats
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
