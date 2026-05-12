<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Bar from '#/genchuan-components/stats/barClick.vue';
import BarHorizontal from '#/genchuan-components/stats/barHorizontal.vue';
import { getCompareMgmtChart } from '#/api/genchuan/industry/educationTeaching/studentMgmt/moralEdu/compareMgmt/data.js';

const loading = ref(true);
const chartData = ref({});

// 周期筛选（前端中文值）
const cycleFilter = ref('月');
const cycleOptions = [
  { label: '周', value: '周' },
  { label: '月', value: '月' },
  { label: '学期', value: '学期' },
];

// 周期中文 -> 英文映射（用于接口请求）
const cycleMap = {
  '周': 'week',
  '月': 'month',
  '学期': 'semester',
};

// ========== 横向条形图（班级德育得分排名 - 只展示前3名）==========
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

// ========== 柱状图（各班级得分统计）==========
// 数据源改为 chartData.rankList，直接使用后端返回的班级和得分
const barData = computed(() => {
  const rankList = chartData.value.rankList || [];
  // 按排名顺序展示（rank_no 越小排名越前），也可按得分排序，这里保持后端返回的顺序
  const classList = rankList.map(item => item.class_name);
  const scoreList = rankList.map(item => item.total_score);
  return {
    xData: classList,
    seriesData: [{ name: '总得分', data: scoreList }],
  };
});

const emit = defineEmits(['barSelect']);

// 柱状图点击（筛选班级）
const handleBarClick = (className) => {
  emit('barSelect', { field: 'className', value: className });
};

// 加载图表数据
const loadData = async () => {
  loading.value = true;
  try {
    // 将前端中文周期转换为后端英文枚举
    const cycleEnum = cycleMap[cycleFilter.value];
    const res = await getCompareMgmtChart({ cycle: cycleEnum });
    chartData.value = res;
  } catch (error) {
    console.error('加载图表数据失败', error);
    // 使用模拟数据（仅用于降级）
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

// 周期变化时重新加载数据
const onCycleChange = () => {
  loadData();
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <!-- 周期筛选单选框（置于顶部右侧） -->
    <div class="cycle-radio">
      <el-radio-group v-model="cycleFilter" @change="onCycleChange">
        <el-radio-button
          v-for="opt in cycleOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-radio-group>
    </div>

    <!-- 横向条形图：班级德育得分排名 -->
    <BarHorizontal
      style="flex: 1.5 !important;"
      title="班级德育得分排名"
      :x-data="barHorizontalData.xData"
      :series-data="barHorizontalData.seriesData"
      y-name="得分"
      @bar-click="handleBarClick"
    />

    <!-- 柱状图：各班级得分统计 -->
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
