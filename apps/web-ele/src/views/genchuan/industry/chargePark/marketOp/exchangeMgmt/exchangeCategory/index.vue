<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { ElMessage } from 'element-plus';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

import ExchangeCategoryStats from './components/ExchangeCategoryStats.vue';
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
});

// 获取统计数据 - 模拟数据
const fetchStatsData = async () => {
  try {
    // 模拟统计数据
    // 实际项目中应该从API获取数据
    const mockData = {
      // 总类目数和总商品数
      totalCategory: 6,
      totalGoods: 56,
      // 类目商品分布
      categoryDistribution: [
        { id: 1, name: '数码配件', value: 12 },
        { id: 2, name: '生活用品', value: 8 },
        { id: 3, name: '食品饮料', value: 15 },
        { id: 4, name: '虚拟商品', value: 5 },
        { id: 5, name: '汽车用品', value: 10 },
        { id: 6, name: '充电服务', value: 6 },
      ],
    };

    // 组装卡片数据
    statsData.value.cards = [
      {
        title: '总类目数',
        value: mockData.totalCategory,
        color: '#4A90E2',
        type: 'totalCategory',
      },
      {
        title: '总商品数',
        value: mockData.totalGoods,
        color: '#50E3C2',
        type: 'totalGoods',
      },
    ];

    // 组装柱状图数据 - 类目商品分布
    statsData.value.barData = mockData.categoryDistribution;
  } catch (error) {
    ElMessage.error('获取统计数据失败');
    console.error(error);
  }
};

// 处理卡片点击 - 钻取筛选
const handleCardClick = async (card) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('card', card.type);
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
    label: '兑换类目',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('兑换类目');
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
    <ExchangeCategoryStats
      v-if="showStats"
      :data="statsData"
      @card-click="handleCardClick"
      @bar-click="handleBarClick"
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
