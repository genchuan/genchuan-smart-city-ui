<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';

import { ElMessage } from 'element-plus';

import { getOrderAlarmChart } from '#/api/genchuan/industry/energyCharging/carCharging/faultAlarm/orderAlarm';

import OrderAlarmStats from './components/OrderAlarmStats.vue';
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
  pieData: [],
  lineData: [],
});

// 获取统计数据
const fetchStatsData = async () => {
  try {
    const params = {
      startTime: '1970-01-01 00:00:00',
      endTime: '3000-01-01 23:59:59',
    };
    const response = await getOrderAlarmChart(params);
    if (response) {
      const data = response;

      // 组装卡片数据
      statsData.value.cards = [
        {
          title: '总订单告警数',
          value: data.totalCount || 0,
          color: '#4A90E2',
          status: 'all',
        },
        {
          title: '处理中',
          value: data.cardData?.handlingCount || 0,
          color: '#A17FE0',
          status: 'handling',
        },
        {
          title: '处理完成数',
          value: data.cardData?.completedCount || 0,
          color: '#50E3C2',
          status: 'completed',
        },
      ];

      // 组装饼图数据
      statsData.value.pieData = (data.pieData || []).map((item) => ({
        name: item.name,
        value: item.value,
      }));

      // 组装折线图数据
      statsData.value.lineData = (data.lineData || []).map((item) => ({
        date: item.date,
        alarmCount: item.alarmCount,
        handleCount: item.handleCount,
      }));
    }
  } catch (error) {
    ElMessage.error('获取统计数据失败');
    console.error(error);
  }
};

// 处理卡片点击 - 钻取筛选
const handleCardClick = async (status) => {
  // 等待表格组件准备好
  await nextTick();
  // 使用setTimeout确保表格组件已完全挂载
  setTimeout(() => {
    if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
      tableRef.value.handleStatsFilter('status', status);
    } else {
      console.warn('tableRef not ready or handleStatsFilter not available');
    }
  }, 100);
};

// 处理饼图点击 - 钻取筛选
const handlePieClick = async (abnormalTypeName) => {
  await nextTick();
  setTimeout(() => {
    if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
      tableRef.value.handleStatsFilter('abnormalType', abnormalTypeName);
    } else {
      console.warn('tableRef not ready or handleStatsFilter not available');
    }
  }, 100);
};

// 处理折线图点击 - 钻取筛选
const handleLineClick = async (date) => {
  await nextTick();
  setTimeout(() => {
    if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
      tableRef.value.handleStatsFilter('date', date);
    } else {
      console.warn('tableRef not ready or handleStatsFilter not available');
    }
  }, 100);
};

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

// 使用ref存储表格组件实例
const tableRef = ref(null);

// 设置表格组件ref的函数
const setTableRef = (el) => {
  if (el) {
    tableRef.value = el;
  }
};

// 使用computed确保showStats是响应式的
const showStatsValue = computed(() => showStats.value);

const tabArray = ref([
  {
    label: '订单告警',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('订单告警');
const secondShow = ref(false);

const tabChange = (name) => {
  activeName.value = name;
};

// 组件挂载时获取统计数据
onMounted(() => {
  fetchStatsData();
});
</script>
<template>
  <div class="common-index">
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <OrderAlarmStats
      v-if="showStats"
      :data="statsData"
      @card-click="handleCardClick"
      @pie-click="handlePieClick"
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
        <Table
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
