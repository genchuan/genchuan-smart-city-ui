<script setup>
import { ref, computed, onMounted } from 'vue';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import {
  getDormAssignChart,
  getDormAssignIndex,
} from '#/api/genchuan/educationTeaching/studentMgmt/enrollMgmt/dormAssign/data.js';

const loading = ref(true);
const chartData = ref({});
const indexData = ref({});

const cardList = computed(() => {
  const total = indexData.value.totalStudentCount || 0;
  const assigned = indexData.value.assignedCount || 0;
  const emptyBed = indexData.value.emptyBedCount || 0;
  const rate = indexData.value.assignRate || 0;
  return [
    { title: '分配人数', value: assigned, color: '#409EFF', status: 'assigned' },
    { title: '空余床位', value: emptyBed, color: '#E6A23C', status: 'empty' },
    { title: '分配完成率', value: `${rate}%`, color: '#67C23A', status: 'rate' },
  ];
});

const barData = computed(() => {
  const buildingList = chartData.value.buildingList || [];
  const assignCountList = chartData.value.buildingAssignCountList || [];
  const bedCountList = chartData.value.buildingBedCountList || [];
  return {
    xData: buildingList,
    seriesData: [
      { name: '已分配人数', data: assignCountList },
      { name: '总床位数', data: bedCountList },
    ],
  };
});

const emit = defineEmits(['cardSelect', 'barSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, indexRes] = await Promise.allSettled([
      getDormAssignChart({ year: 2025 }),
      getDormAssignIndex({ year: 2025 }),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        waitAssignCount: 40,
        finishedCount: 280,
        totalCount: 320,
        progress: 87.5,
        buildingList: ['1号楼', '2号楼', '3号楼', '4号楼'],
        buildingAssignCountList: [80, 75, 65, 60],
        buildingBedCountList: [90, 80, 75, 75],
      };
    }
    if (indexRes.status === 'fulfilled') {
      indexData.value = indexRes.value;
    } else {
      indexData.value = {
        totalStudentCount: 320,
        assignedCount: 280,
        assignRate: 87.5,
        emptyBedCount: 60,
      };
    }
  } catch (error) {
    console.error('加载图表数据失败', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <div class="chart-box-left">
      <Indicator class="left-card" v-for="item in cardList" :key="item.title" v-bind="item" @click="handleCardClick" />
    </div>
    <Bar
      style="flex: 2 !important;"
      title="新生宿舍分配进度统计"
      :x-data="barData.xData"
      :series-data="barData.seriesData"
      y-name="人数"
    />
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  padding-left: 15px;
  padding-right: 15px;
  width: 100% !important;

  .chart-box-left {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin: 0;
  }
}
</style>
