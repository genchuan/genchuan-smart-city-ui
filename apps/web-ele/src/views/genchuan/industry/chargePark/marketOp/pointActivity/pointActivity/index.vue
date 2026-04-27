<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';
import { ElMessage } from 'element-plus';

import {
  getPointActivityChart,
} from '#/api/genchuan/industry/chargePark/marketOp/pointActivity/pointActivity';

import PointActivityStats from './components/PointActivityStats.vue';
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
  barData: [],
  lineData: [],
});

// 获取统计数据 - 从API获取
const fetchStatsData = async () => {
  try {
    const response = await getPointActivityChart();
    if (!response) {
      throw new Error('获取统计数据失败');
    }

    // 组装卡片数据
    statsData.value.cards = [
      {
        title: '总活动数',
        value: response.activityCount || 0,
        color: '#4A90E2',
        type: 'all',
      },
      {
        title: '累计参与用户数',
        value: response.userCount || 0,
        color: '#50E3C2',
        type: 'users',
      },
    ];

    // 组装柱状图数据 - 活动类型分布
    // 将类型代码映射为字典标签
    statsData.value.barData = (response.typeCountList || []).map(item => ({
      type: item.type,
      typeName: getTypeLabel(item.type),
      count: item.count,
    }));

    // 组装折线图数据 - 活动参与趋势
    statsData.value.lineData = (response.trendList || []).map(item => ({
      date: item.date,
      userCount: item.count,
    }));
  } catch (error) {
    ElMessage.error('获取统计数据失败');
    console.error(error);
  }
};

// 获取活动类型标签文本
function getTypeLabel(type) {
  const dict = getDictObj(DICT_TYPE.POINT_ACTIVITY_TYPE, String(type));
  return dict ? dict.label : type;
}

// 获取表格组件实例（处理v-for中的ref数组情况）
const getTableComponent = () => {
  // 在v-for中使用ref时，tableRef可能是数组
  const tableComponent = Array.isArray(tableRef.value) ? tableRef.value[0] : tableRef.value;
  return tableComponent;
};

// 处理卡片点击 - 钻取筛选
const handleCardClick = async (cardType) => {
  await nextTick();
  const tableComponent = getTableComponent();
  if (tableComponent && typeof tableComponent.handleStatsFilter === 'function') {
    tableComponent.handleStatsFilter('card', cardType);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理柱状图点击 - 钻取筛选活动类型
const handleBarClick = async (type) => {
  await nextTick();
  const tableComponent = getTableComponent();
  if (tableComponent && typeof tableComponent.handleStatsFilter === 'function') {
    tableComponent.handleStatsFilter('type', type);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理折线图点击 - 钻取跳转对应日期的参与用户明细
const handleLineClick = async (date) => {
  await nextTick();
  const tableComponent = getTableComponent();
  if (tableComponent && typeof tableComponent.handleStatsFilter === 'function') {
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
    label: '积分活动',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('积分活动');
const secondShow = ref(false);

// 组件挂载时获取统计数据
onMounted(() => {
  fetchStatsData();
});
</script>
<template>
  <div class="common-index">
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <PointActivityStats
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
