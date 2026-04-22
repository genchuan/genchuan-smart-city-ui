<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { getCouponMgmtChart } from '#/api/genchuan/industry/chargePark/marketOp/couponActivity/couponMgmt';

import CouponMgmtStats from './components/CouponMgmtStats.vue';
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

// 静态统计数据 - 接口失败时使用
const staticStatsData = {
  typeDistribution: [
    { name: '满减', value: 3 },
    { name: '折扣', value: 2 },
    { name: '时长', value: 2 },
    { name: '立减', value: 1 },
  ],
  totalSendCount: 156,
  verifyRate: 68.5,
  trendData: [
    { date: '2025-03-01', sendCount: 5 },
    { date: '2025-03-02', sendCount: 8 },
    { date: '2025-03-03', sendCount: 12 },
    { date: '2025-03-04', sendCount: 6 },
    { date: '2025-03-05', sendCount: 10 },
    { date: '2025-03-06', sendCount: 15 },
    { date: '2025-03-07', sendCount: 7 },
    { date: '2025-03-08', sendCount: 9 },
    { date: '2025-03-09', sendCount: 11 },
    { date: '2025-03-10', sendCount: 14 },
    { date: '2025-03-11', sendCount: 6 },
    { date: '2025-03-12', sendCount: 8 },
    { date: '2025-03-13', sendCount: 13 },
    { date: '2025-03-14', sendCount: 5 },
    { date: '2025-03-15', sendCount: 9 },
    { date: '2025-03-16', sendCount: 12 },
    { date: '2025-03-17', sendCount: 7 },
    { date: '2025-03-18', sendCount: 10 },
    { date: '2025-03-19', sendCount: 8 },
    { date: '2025-03-20', sendCount: 11 },
    { date: '2025-03-21', sendCount: 6 },
    { date: '2025-03-22', sendCount: 9 },
    { date: '2025-03-23', sendCount: 14 },
    { date: '2025-03-24', sendCount: 7 },
    { date: '2025-03-25', sendCount: 10 },
    { date: '2025-03-26', sendCount: 5 },
    { date: '2025-03-27', sendCount: 8 },
    { date: '2025-03-28', sendCount: 12 },
    { date: '2025-03-29', sendCount: 6 },
    { date: '2025-03-30', sendCount: 9 },
  ],
};

// 组装统计数据
const assembleStatsData = (data) => {
  // 组装卡片数据
  statsData.value.cards = [
    {
      title: '总发放量',
      value: data.totalSendCount || 0,
      color: '#4A90E2',
      filterType: 'send',
      desc: '累计发放',
    },
    {
      title: '累计核销率',
      value: `${data.verifyRate || 0}%`,
      color: '#50E3C2',
      filterType: 'verify',
      desc: '核销占比',
    },
  ];

  // 组装柱状图数据 - 优惠券类型分布
  statsData.value.barData = (data.typeDistribution || []).map((item) => ({
    type: item.name,
    typeName: item.name,
    count: item.value,
  }));

  // 组装折线图数据 - 发放趋势
  statsData.value.lineData = (data.trendData || []).map((item) => ({
    date: item.date,
    sendCount: item.sendCount,
  }));
};

// 获取统计数据
const fetchStatsData = async () => {
  try {
    const response = await getCouponMgmtChart();
    if (response && response.code === 200 && response.data) {
      const data = response.data;

      // 检查数据是否为空
      const hasData = data.totalSendCount > 0 || (data.typeDistribution && data.typeDistribution.length > 0);

      if (hasData) {
        assembleStatsData(data);
      } else {
        // 接口返回数据为空，使用静态数据
        console.log('统计接口返回数据为空，使用静态数据');
        assembleStatsData(staticStatsData);
      }
    } else {
      // 接口返回异常，使用静态数据
      console.log('统计接口返回异常，使用静态数据');
      assembleStatsData(staticStatsData);
    }
  } catch (error) {
    // 接口调用失败，错误信息打印到控制台，使用静态数据
    console.error('获取统计数据失败，使用静态数据:', error);
    assembleStatsData(staticStatsData);
  }
};

// 处理卡片点击 - 钻取筛选
const handleCardClick = async (card) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('card', card.filterType);
  }
};

// 处理柱状图点击 - 钻取筛选
const handleBarClick = async (typeName) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('type', typeName);
  }
};

// 处理折线图点击 - 钻取筛选
const handleLineClick = async (date) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('date', date);
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
    label: '优惠券',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('优惠券');
const secondShow = ref(false);

// 组件挂载时获取统计数据
onMounted(() => {
  fetchStatsData();
});
</script>
<template>
  <div class="common-index">
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <CouponMgmtStats
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
        <Table
          ref="tableRef"
          :second-show="item.secondShow"
          :show-stats="showStatsValue"
          :toggle-stats="toggleStats"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
