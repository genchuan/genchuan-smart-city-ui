<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { ElMessage } from 'element-plus';

import { getReceiveRecordChart } from '#/api/genchuan/industry/chargePark/marketOp/couponActivity/receiveRecord';

import ReceiveRecordStats from './components/ReceiveRecordStats.vue';
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
  lineData: [],
});

// 静态统计数据 - 接口失败时使用（按照接口返回格式）
const staticStatsData = {
  receiveCount: 36,
  verifyRate: 0.1111,
  trendList: [
    { date: '2026-04-21', count: 1 },
    { date: '2026-04-22', count: 35 },
    { date: '2026-04-23', count: 0 },
    { date: '2026-04-24', count: 0 },
    { date: '2026-04-25', count: 0 },
    { date: '2026-04-26', count: 0 },
    { date: '2026-04-27', count: 0 },
    { date: '2026-04-28', count: 0 },
  ],
};

// 组装统计数据
const assembleStatsData = (data) => {
  // 组装卡片数据
  statsData.value.cards = [
    {
      title: '总领用量',
      value: data.receiveCount || 0,
      color: '#4A90E2',
      type: 'total',
    },
    {
      title: '累计核销率',
      value: `${((data.verifyRate || 0) * 100).toFixed(2)}%`,
      color: '#50E3C2',
      type: 'verifyRate',
    },
  ];

  // 组装折线图数据 - 领用量趋势
  statsData.value.lineData = (data.trendList || []).map((item) => ({
    date: item.date,
    count: item.count,
  }));
};

// 获取统计数据
const fetchStatsData = async () => {
  try {
    const response = await getReceiveRecordChart();
    if (response && response.data) {
      const data = response.data;

      // 检查数据是否为空
      const hasData =
        data.receiveCount > 0 || (data.trendList && data.trendList.length > 0);

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
    console.error('获取统计数据失败，使用静态数据', error);
    assembleStatsData(staticStatsData);
  }
};

// 处理卡片点击 - 钻取筛选
const handleCardClick = async (type, value) => {
  await nextTick();
  const tableInstance = Array.isArray(tableRef.value) ? tableRef.value[0] : tableRef.value;
  if (tableInstance && typeof tableInstance.handleStatsFilter === 'function') {
    tableInstance.handleStatsFilter('card', type, value);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理折线图点击 - 钻取筛选
const handleLineClick = async (date) => {
  await nextTick();
  const tableInstance = Array.isArray(tableRef.value) ? tableRef.value[0] : tableRef.value;
  if (tableInstance && typeof tableInstance.handleStatsFilter === 'function') {
    tableInstance.handleStatsFilter('date', null, date);
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
    label: '领用记录',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('领用记录');
const secondShow = ref(false);

// 组件挂载时获取统计数据
onMounted(() => {
  fetchStatsData();
});
</script>
<template>
  <div class="common-index">
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <ReceiveRecordStats
      v-if="showStats"
      :data="statsData"
      @card-click="handleCardClick"
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
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
