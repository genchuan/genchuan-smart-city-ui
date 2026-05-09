<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';

import { ElMessage } from 'element-plus';

import { getExchangeCategoryChart } from '#/api/genchuan/industry/chargePark/marketOp/exchangeMgmt/exchangeCategory';
import ExchangeCategoryStats from './components/ExchangeCategoryStats.vue';
import Table from './table/index.vue';

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
  pieData: [],
  barData: [],
});

// 获取类目状态标签文本
function getCategoryStatusLabel(status) {
  const dict = getDictObj(DICT_TYPE.EXCHANGE_CATEGORY_STATUS, String(status));
  return dict ? dict.label : status;
}

// 获取适用范围标签文本
function getCategoryScopeLabel(scope) {
  const dict = getDictObj(DICT_TYPE.EXCHANGE_CATEGORY_SCOPE, String(scope));
  return dict ? dict.label : scope;
}

// 获取统计数据 - 从API获取
const fetchStatsData = async () => {
  try {
    const response = await getExchangeCategoryChart();
    if (response) {
      // 组装卡片数据
      statsData.value.cards = [
        {
          title: '类目总数',
          value: response.categoryCount || 0,
          color: '#4A90E2',
          type: 'categoryCount',
        },
        {
          title: '商品总数',
          value: response.productCount || 0,
          color: '#50E3C2',
          type: 'productCount',
        },
      ];

      // 组装饼图数据 - 类目状态分布
      statsData.value.pieData = (response.statusCountList || []).map(
        (item) => ({
          name: getCategoryStatusLabel(item.status),
          value: item.count,
          status: item.status,
        }),
      );

      // 组装柱状图数据 - 类目适用范围分布
      statsData.value.barData = (response.scopeCountList || []).map((item) => ({
        name: getCategoryScopeLabel(item.scope),
        value: item.count,
        scope: item.scope,
      }));
    }
  } catch (error) {
    ElMessage.error('获取统计数据失败');
    console.error('获取统计数据失败:', error);
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
const handleCardClick = async (card) => {
  await nextTick();
  const tableComponent = getTableComponent();
  if (
    tableComponent &&
    typeof tableComponent.handleStatsFilter === 'function'
  ) {
    tableComponent.handleStatsFilter('card', card.type);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理饼图点击 - 钻取筛选类目状态
const handlePieClick = async (status) => {
  await nextTick();
  const tableComponent = getTableComponent();
  if (
    tableComponent &&
    typeof tableComponent.handleStatsFilter === 'function'
  ) {
    tableComponent.handleStatsFilter('status', status);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理柱状图点击 - 钻取筛选适用范围
const handleBarClick = async (scope) => {
  await nextTick();
  const tableComponent = getTableComponent();
  if (
    tableComponent &&
    typeof tableComponent.handleStatsFilter === 'function'
  ) {
    tableComponent.handleStatsFilter('scope', scope);
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

// 设置表格组件ref的函数
const setTableRef = (el) => {
  if (el) {
    tableRef.value = el;
  }
};

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
      @pie-click="handlePieClick"
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
          :ref="setTableRef"
          :second-show="item.secondShow"
          :show-stats="showStatsValue"
          :toggle-stats="toggleStats"
          :key="item.label"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
