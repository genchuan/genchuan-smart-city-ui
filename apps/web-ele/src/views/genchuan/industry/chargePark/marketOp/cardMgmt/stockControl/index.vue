<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { ElMessage } from 'element-plus';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';

import StockControlStats from './components/StockControlStats.vue';
import Table from './table/index.vue';

import { getStockControlChart } from '#/api/genchuan/industry/chargePark/marketOp/cardMgmt/stockControl';

import '#/genchuan-components/page/index.scss';

// 控制统计组件显示/隐藏的状态
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
  barData: [],
  lineData: [],
});

// 获取卡种类型中文标签
const getCardTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.CARD_CONFIG_TYPE, String(type));
  return dict ? dict.label : type;
};

// 获取统计数据 - 从API获取
const fetchStatsData = async () => {
  try {
    const response = await getStockControlChart();
    if (response) {
      const {
        totalStock,
        warnStockCount,
        stockTrend,
        stockDistribution,
      } = response;

      // 组装卡片数据
      statsData.value.cards = [
        {
          title: '总库存',
          value: totalStock || 0,
          color: '#4A90E2',
          type: 'total',
        },
        {
          title: '预警库存数',
          value: warnStockCount || 0,
          color: '#FF6B8B',
          type: 'warn',
        },
      ];

      // 组装柱状图数据 - 卡种库存分布
      // 将type映射到字典中文标签
      statsData.value.barData = (stockDistribution || []).map((item) => ({
        cardId: item.cardId,
        cardName: getCardTypeLabel(item.type),
        currentStock: item.count,
        type: item.type,
      }));

      // 组装折线图数据 - 库存趋势
      statsData.value.lineData = (stockTrend || []).map((item) => {
        const dateObj = new Date(item.date);
        return {
          date: `${dateObj.getMonth() + 1}/${dateObj.getDate()}`,
          fullDate: item.date,
          stock: item.count,
        };
      });
    }
  } catch (error) {
    console.error('获取统计数据失败:', error);
    // 使用模拟数据作为后备
    useMockData();
  }
};

// 模拟数据（API失败时使用）
const useMockData = () => {
  const mockData = {
    totalStock: 345,
    warnStockCount: 2,
    cardDistribution: [
      { cardId: 1, cardName: '日卡 - 停车专用', currentStock: 50 },
      { cardId: 2, cardName: '周卡 - 充电优惠', currentStock: 20 },
      { cardId: 3, cardName: '月卡 - 充电通用', currentStock: 15 },
      { cardId: 4, cardName: '季卡 - 充停通用', currentStock: 80 },
      { cardId: 5, cardName: '年卡 - 充停通用', currentStock: 100 },
    ],
    dailyTrend: generateDailyTrendData(),
  };

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

  statsData.value.barData = mockData.cardDistribution;
  statsData.value.lineData = mockData.dailyTrend;
};

// 生成30天的模拟数据
const generateDailyTrendData = () => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    const stock = Math.floor(Math.random() * 50) + 300;
    data.push({
      date: dateStr,
      fullDate: date.toISOString().split('T')[0],
      stock,
    });
  }
  return data;
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
// cardType: 'total' | 'warn'
const handleCardClick = async (cardType) => {
  await nextTick();
  const tableComponent = getTableComponent();
  if (
    tableComponent &&
    typeof tableComponent.handleStatsFilter === 'function'
  ) {
    // 预警库存数卡片点击，传入status=2（预警库存状态）
    if (cardType === 'warn') {
      tableComponent.handleStatsFilter('status', '2');
    } else {
      tableComponent.handleStatsFilter('card', cardType);
    }
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理柱状图点击 - 钻取筛选卡种
// data: { cardId, cardName, currentStock, type }
const handleBarClick = async (data) => {
  await nextTick();
  const tableComponent = getTableComponent();
  if (
    tableComponent &&
    typeof tableComponent.handleStatsFilter === 'function'
  ) {
    // 传入cardId进行筛选
    tableComponent.handleStatsFilter('cardId', data.cardId);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理折线图点击 - 钻取跳转对应日期的库存明细
// date: 格式为 "M/D" 的日期字符串
const handleLineClick = async (date) => {
  await nextTick();
  const tableComponent = getTableComponent();
  if (
    tableComponent &&
    typeof tableComponent.handleStatsFilter === 'function'
  ) {
    // 找到对应的完整日期格式
    const lineDataItem = statsData.value.lineData.find(
      (item) => item.date === date
    );
    const fullDate = lineDataItem ? lineDataItem.fullDate : date;
    tableComponent.handleStatsFilter('date', fullDate);
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
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
