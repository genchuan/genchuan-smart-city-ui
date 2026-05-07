<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';

import { ElMessage } from 'element-plus';

import { getCardConfigChart } from '#/api/genchuan/industry/chargePark/marketOp/cardMgmt/cardConfig';

import CardConfigStats from './components/CardConfigStats.vue';
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

// 获取卡种类型标签文本
function getCardTypeLabel(type) {
  const dict = getDictObj(DICT_TYPE.CARD_CONFIG_TYPE, String(type));
  return dict ? dict.label : type;
}

// 获取适用范围标签文本
function getScopeLabel(scope) {
  const dict = getDictObj(DICT_TYPE.CARD_CONFIG_SCOPE, String(scope));
  return dict ? dict.label : scope;
}

// 组装统计数据
const assembleStatsData = (data) => {
  // 组装卡片数据
  statsData.value.cards = [
    {
      title: '累计卡种销量',
      value: data.salesCount || 0,
      color: '#50E3C2',
      desc: '总销量',
      filterType: 'sale',
    },
    {
      title: '生效配置数',
      value: data.enableCount || 0,
      color: '#4A90E2',
      filterType: 'effective',
      status: '1', // 已生效状态
    },
  ];

  // 组装饼图数据 - 配置类型占比
  statsData.value.pieData = (data.typeRatio || []).map((item) => ({
    name: getCardTypeLabel(item.type),
    value: Math.round(item.rate * 100), // 将比率转换为百分比数值
    type: item.type,
  }));

  // 组装柱状图数据 - 适用范围分布
  statsData.value.barData = (data.scopeCountList || []).map((item) => ({
    scope: item.scope,
    scopeName: getScopeLabel(item.scope),
    count: item.count,
  }));
};

// 获取统计数据 - 从API获取
const fetchStatsData = async () => {
  try {
    const response = await getCardConfigChart();
    if (response) {
      assembleStatsData(response);
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
    // 生效配置数卡片，传入 status 进行筛选
    if (card.filterType === 'effective' && card.status) {
      tableComponent.handleStatsFilter('status', card.status);
    } else {
      tableComponent.handleStatsFilter('card', card.filterType);
    }
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理饼图点击 - 钻取筛选配置类型
const handlePieClick = async (type) => {
  await nextTick();
  const tableComponent = getTableComponent();
  if (
    tableComponent &&
    typeof tableComponent.handleStatsFilter === 'function'
  ) {
    tableComponent.handleStatsFilter('type', type);
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
    label: '卡种配置',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('卡种配置');
const secondShow = ref(false);

// 组件挂载时获取统计数据
onMounted(() => {
  fetchStatsData();
});
</script>
<template>
  <div class="common-index">
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <CardConfigStats
      v-if="showStats"
      :data="statsData"
      @card-click="handleCardClick"
      @pie-click="handlePieClick"
      @bar-click="handleBarClick"
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
    <el-tabs v-model="activeName" class="common-tabs" type="card">
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
