<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { ElMessage } from 'element-plus';

import PointActivityStats from './components/PointActivityStats.vue';
import Table from './table/index.vue';

import '#/components/page/index.scss';

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
      // 总活动数和累计参与用户数
      totalActivityCount: 12,
      totalJoinUserCount: 2045,
      // 活动类型分布
      typeDistribution: [
        { type: '0', typeName: '签到', count: 4 },
        { type: '1', typeName: '消费', count: 4 },
        { type: '2', typeName: '邀请', count: 4 },
      ],
      // 近30天参与趋势
      dailyTrend: generateDailyTrendData(),
    };

    // 组装卡片数据
    statsData.value.cards = [
      {
        title: '总活动数',
        value: mockData.totalActivityCount,
        color: '#4A90E2',
        type: 'all',
      },
      {
        title: '累计参与用户数',
        value: mockData.totalJoinUserCount,
        color: '#50E3C2',
        type: 'users',
      },
    ];

    // 组装柱状图数据 - 活动类型分布
    statsData.value.barData = mockData.typeDistribution;

    // 组装折线图数据 - 活动参与趋势
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
    // 随机生成参与用户数 (50-200之间)
    const userCount = Math.floor(Math.random() * 150) + 50;
    data.push({
      date: dateStr,
      fullDate: date.toISOString().split('T')[0],
      userCount,
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

// 处理柱状图点击 - 钻取筛选活动类型
const handleBarClick = async (type) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('type', type);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理折线图点击 - 钻取跳转对应日期的参与用户明细
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
