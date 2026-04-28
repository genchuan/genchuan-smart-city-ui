<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { ElMessage } from 'element-plus';

import ReceiveRecordStats from './components/ReceiveRecordStats.vue';
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
  lineData: [],
});

// 获取统计数据（模拟数据，实际应从API获取）
const fetchStatsData = async () => {
  try {
    // TODO: 替换为实际API调用
    // const response = await getReceiveRecordStats();

    // 模拟统计数据
    const mockData = {
      totalReceiveCount: 8560,
      verifyRate: '68.5%',
      trendData: [],
    };

    // 生成近30天的模拟数据
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      mockData.trendData.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 150) + 200,
      });
    }

    // 组装卡片数据
    statsData.value.cards = [
      {
        title: '总领用量',
        value: mockData.totalReceiveCount,
        color: '#4A90E2',
        type: 'total',
      },
      {
        title: '累计核销率',
        value: mockData.verifyRate,
        color: '#50E3C2',
        type: 'verifyRate',
      },
    ];

    // 组装折线图数据
    statsData.value.lineData = mockData.trendData;
  } catch (error) {
    ElMessage.error('获取统计数据失败');
    console.error(error);
  }
};

// 处理卡片点击 - 钻取筛选
const handleCardClick = async (type, value) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('card', type, value);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理折线图点击 - 钻取筛选
const handleLineClick = async (date) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('date', null, date);
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
