<script setup>
import {ref, computed, onMounted, watch} from 'vue';
import {ElSelect, ElOption} from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import {
  getDormAssignChart,
  getDormAssignIndex,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/enrollMgmt/dormAssign/data.js';

const loading = ref(true);
const chartData = ref({});
const indexData = ref({});

// 年份选择器相关
const currentYear = ref(new Date().getFullYear()); // 默认当前年份
const yearOptions = () => {
  const current = new Date().getFullYear();
  const years = [];
  for (let i = current - 5; i <= current + 2; i++) {
    years.push({label: `${i}年`, value: i});
  }
  return years;
};

// 监听年份变化，重新加载数据
watch(currentYear, () => {
  loadData();
});

const cardList = computed(() => {
  const total = indexData.value.totalStudentCount || 0;
  const assigned = indexData.value.assignedCount || 0;
  const emptyBed = indexData.value.emptyBedCount || 0;
  const rate = indexData.value.assignRate || 0;
  return [
    {title: '分配人数', value: assigned, color: '#409EFF', status: 'assigned'},
    {title: '空余床位', value: emptyBed, color: '#E6A23C', status: 'empty'},
    {title: '分配完成率', value: `${rate}%`, color: '#67C23A', status: 'rate'},
  ];
});

const barData = computed(() => {
  const buildingList = chartData.value.buildingList || [];
  const assignCountList = chartData.value.buildingAssignCountList || [];
  const bedCountList = chartData.value.buildingBedCountList || [];
  return {
    xData: buildingList,
    seriesData: [
      {name: '已分配人数', data: assignCountList},
      {name: '总床位数', data: bedCountList},
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
      getDormAssignChart({year: currentYear.value}),
      getDormAssignIndex({year: currentYear.value}),
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
      <Indicator class="left-card" v-for="item in cardList" :key="item.title" v-bind="item"
                 @click="handleCardClick"/>
    </div>

    <!-- 柱状图区域（含年份选择器） -->
    <div class="bar-chart-container" style="flex: 2 !important; position: relative;">
      <!-- 年份选择器（紧凑样式，位于右上角） -->
      <div class="year-select-wrapper">
        <el-select v-model="currentYear" size="small">
          <el-option
            v-for="opt in yearOptions()"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </div>
      <Bar
        title="新生宿舍分配进度统计"
        :x-data="barData.xData"
        :series-data="barData.seriesData"
        y-name="人数"
        @bar-click="(name) => emit('barSelect', { field: 'building', value: name })"
      />
    </div>
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

  /* 柱状图容器特殊样式，用于绝对定位年份选择器 */
  .bar-chart-container {
    position: relative;
    flex: 2;
    min-width: 280px;
    margin-left: 12px;
  }

  .year-select-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }

  /* 紧凑的年份选择器样式 */
  :deep(.el-select) {
    width: 100px;
  }
}
</style>
