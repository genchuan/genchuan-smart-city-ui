<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Bar from '#/genchuan-components/stats/barClick.vue';
import BarHorizontal from '#/genchuan-components/stats/barHorizontal.vue';
import { getCompareMgmtChart } from '#/api/genchuan/industry/educationTeaching/studentMgmt/moralEdu/compareMgmt/data.js';

const loading = ref(true);
const chartData = ref({});

const cycleFilter = ref('月');
const cycleOptions = [
  { label: '周', value: '周' },
  { label: '月', value: '月' },
  { label: '学期', value: '学期' },
];
const cycleMap = { '周': 'week', '月': 'month', '学期': 'semester' };

const barHorizontalData = computed(() => {
  const rankList = [...(chartData.value.rankList || [])];
  const sortedDesc = rankList.sort((a, b) => b.total_score - a.total_score);
  const top4 = sortedDesc.slice(0, 3);
  const sortedAsc = top4.sort((a, b) => a.total_score - b.total_score);
  return {
    xData: sortedAsc.map(item => item.class_name),
    seriesData: [{ name: '总得分', data: sortedAsc.map(item => item.total_score) }],
  };
});

const barData = computed(() => {
  const rankList = chartData.value.rankList || [];
  return {
    xData: rankList.map(item => item.class_name),
    seriesData: [{ name: '总得分', data: rankList.map(item => item.total_score) }],
  };
});

// ========== 核心修改：柱状图点击改为派发自定义事件 ==========
const handleBarClick = (className) => {
  window.dispatchEvent(new CustomEvent('compare-chart-filter', {
    detail: { type: 'className', value: className }
  }));
};

const loadData = async () => {
  loading.value = true;
  try {
    const cycleEnum = cycleMap[cycleFilter.value];
    const res = await getCompareMgmtChart({ cycle: cycleEnum });
    chartData.value = res;
  } catch (error) {
    console.error('加载图表数据失败', error);
    chartData.value = {
      rankList: [
        { class_name: '高一(1)班', total_score: 92.5, rank_no: 1 },
        { class_name: '高一(3)班', total_score: 90.0, rank_no: 2 },
        { class_name: '高一(2)班', total_score: 88.0, rank_no: 3 },
        { class_name: '高二(1)班', total_score: 85.5, rank_no: 4 },
      ],
    };
  } finally {
    loading.value = false;
  }
};

const onCycleChange = () => {
  loadData();
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <div class="cycle-radio">
      <el-radio-group v-model="cycleFilter" @change="onCycleChange">
        <el-radio-button v-for="opt in cycleOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </el-radio-group>
    </div>

    <BarHorizontal
      style="flex: 1.5 !important;"
      title="班级德育得分排名"
      :x-data="barHorizontalData.xData"
      :series-data="barHorizontalData.seriesData"
      y-name="得分"
      @bar-click="handleBarClick"
    />

    <Bar
      style="flex: 2 !important;"
      title="各班级得分统计"
      :x-data="barData.xData"
      :series-data="barData.seriesData"
      y-name="得分"
      @bar-click="handleBarClick"
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
  position: relative;

  .cycle-radio {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }
}
</style>
