<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { ElMessage } from 'element-plus';

import { getOrderRefundChart } from '#/api/genchuan/industry/energyCharging/carCharging/chargingOrder/orderRefund';

import OrderRefundStats from './components/OrderRefundStats.vue';
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
    const response = await getOrderRefundChart({
      startTime: '1970-01-01',
      endTime: '3000-01-01',
    });
    if (response) {
      const data = response;

      // 组装卡片数据
      statsData.value.cards = [
        {
          title: '总退款申请数',
          value: data.cardData?.totalRefundCount || 0,
          color: '#4A90E2',
          type: 'all',
        },
        {
          title: '已完成退款数',
          value: data.pieData?.find((item) => item.name === '已完成')?.value || 0,
          color: '#50E3C2',
          type: 'completed',
        },
        {
          title: '待审核数',
          value: data.pieData?.find((item) => item.name === '待审核')?.value || 0,
          color: '#FF9F40',
          type: 'pending',
        },
        {
          title: '驳回数',
          value: data.pieData?.find((item) => item.name === '已驳回')?.value || 0,
          color: '#FF6B8B',
          type: 'rejected',
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
        applyCount: item.applyCount,
        completeCount: item.completeCount,
      }));
    }
  } catch (error) {
    ElMessage.error('获取统计数据失败');
    console.error(error);
  }
};

// 处理卡片点击 - 钻取筛选
const handleCardClick = async (type) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('status', type);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理饼图点击 - 钻取筛选
const handlePieClick = async (statusName) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('refundStatus', statusName);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理折线图点击 - 钻取筛选
const handleLineClick = async (date) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('date', date);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

const tableRef = ref(null);

// 使用computed确保showStats是响应式的
const showStatsValue = computed(() => showStats.value);

const activeName = ref('订单退款');

// 组件挂载时获取统计数据
onMounted(() => {
  fetchStatsData();
});
</script>

<template>
  <div class="common-index">
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <OrderRefundStats
      v-if="showStats"
      :data="statsData"
      @card-click="handleCardClick"
      @pie-click="handlePieClick"
      @line-click="handleLineClick"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane label="订单退款" name="订单退款">
        <Table
          ref="tableRef"
          :show-stats="showStatsValue"
          :toggle-stats="toggleStats"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
