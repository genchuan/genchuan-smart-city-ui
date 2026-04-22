<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { ElMessage } from 'element-plus';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

import StockControlStats from './components/StockControlStats.vue';
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
      // 总库存和预警库存数
      totalStock: 345,
      warnStockCount: 2,
      // 卡种库存分布
      cardDistribution: [
        { cardId: 1, cardName: '日卡 - 停车专用', currentStock: 50 },
        { cardId: 2, cardName: '周卡 - 充电优惠', currentStock: 20 },
        { cardId: 3, cardName: '月卡 - 充电通用', currentStock: 15 },
        { cardId: 4, cardName: '季卡 - 充停通用', currentStock: 80 },
        { cardId: 5, cardName: '年卡 - 充停通用', currentStock: 100 },
      ],
      // 近30天库存趋势
      dailyTrend: generateDailyTrendData(),
    };

    // 组装卡片数据
    statsData.value.cards = [
      {
        title: '总库存',
        value: mockData.totalStock,
        color: '#4A90E2',
        type: 'total',
      },
      {
        title: '预警库存数',
        value: mockData.warnStockCount,
        color: '#FF6B8B',
        type: 'warn',
      },
    ];

    // 组装柱状图数据 - 卡种库存分布
    statsData.value.barData = mockData.cardDistribution;

    // 组装折线图数据 - 库存趋势
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
    // 随机生成库存数量 (300-350之间)
    const stock = Math.floor(Math.random() * 50) + 300;
    data.push({
      date: dateStr,
      fullDate: date.toISOString().split('T')[0],
      stock,
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

// 处理柱状图点击 - 钻取筛选卡种
const handleBarClick = async (cardId) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('cardId', cardId);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理折线图点击 - 钻取跳转对应日期的库存明细
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
    label: '库存管控',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('库存管控');
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
    <StockControlStats
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
