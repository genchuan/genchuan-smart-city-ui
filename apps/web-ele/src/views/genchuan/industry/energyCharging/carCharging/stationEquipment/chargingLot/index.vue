<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { ElMessage } from 'element-plus';

import { getChargingLotChart } from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingLot';

import ChargingLotStats from './components/ChargingLotStats.vue';
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
  barData: [],
});

// 获取统计数据
const fetchStatsData = async () => {
  try {
    const response = await getChargingLotChart();
    if (response) {
      const data = response;

      // 组装卡片数据
      statsData.value.cards = [
        {
          title: '总车位数',
          value: data.totalCount || 0,
          color: '#4A90E2',
          status: 'all',
        },
        {
          title: '空闲车位数',
          value: data.idleCount || 0,
          color: '#50E3C2',
          status: '空闲',
        },
        {
          title: '占用车位数',
          value: data.occupiedCount || 0,
          color: '#FF9F40',
          status: '占用',
        },
      ];

      // 组装饼图数据
      statsData.value.pieData = (data.statusRatio || []).map((item) => ({
        name: item.status,
        value: item.count,
      }));

      // 组装柱状图数据
      statsData.value.barData = (data.stationLotList || []).map((item) => ({
        stationId: item.stationId,
        stationName: item.stationName,
        totalCount: item.totalCount,
        idleCount: item.idleCount,
        occupyCount: item.occupiedCount,
        maintainCount: item.maintainCount,
      }));
    }
  } catch (error) {
    ElMessage.error('获取统计数据失败');
    console.error(error);
  }
};

// 处理卡片点击 - 钻取筛选
const handleCardClick = async (status) => {
  // 通过ref调用table组件的方法进行筛选
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('status', status);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理饼图点击 - 钻取筛选
const handlePieClick = async (statusName) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('status', statusName);
  } else {
    console.warn('tableRef not ready or handleStatsFilter not available');
  }
};

// 处理柱状图点击 - 钻取筛选
const handleBarClick = async (stationId) => {
  await nextTick();
  if (tableRef.value && typeof tableRef.value.handleStatsFilter === 'function') {
    tableRef.value.handleStatsFilter('station', stationId);
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
    label: '充电车位',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('充电车位');
const secondShow = ref(false);

// 组件挂载时获取统计数据
onMounted(() => {
  fetchStatsData();
});
</script>
<template>
  <div class="common-index">
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <ChargingLotStats
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
      <el-tab-pane label="充电车位" name="充电车位">
        <Table
          ref="tableRef"
          :second-show="false"
          :show-stats="showStatsValue"
          :toggle-stats="toggleStats"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
