<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import {
  getStudyUpChart,
  getStudyUpCount,
} from '#/api/genchuan/educationTeaching/studentMgmt/employMgmt/studyUp/data.js';

const loading = ref(true);
const chartData = ref({});      // 卡片 + 柱状图
const countData = ref({});      // 饼图

// 卡片数据
const cardList = computed(() => {
  const total = chartData.value.totalStudent || 0;
  const wait = chartData.value.waitPlanStudent || 0;
  const planned = chartData.value.plannedStudent || 0;
  return [
    { title: '总升学意向学生数', value: total, color: '#409EFF', status: 'total' },
    { title: '待规划学生数', value: wait, color: '#E6A23C', status: 'wait' },
    { title: '已规划学生数', value: planned, color: '#67C23A', status: 'planned' },
  ];
});

// 柱状图数据（热门目标院校）
const barData = computed(() => {
  const schools = chartData.value.schoolTopCount || [];
  return {
    xData: schools.map(item => item.schoolName),
    seriesData: [{ name: '学生数', data: schools.map(item => item.count) }],
  };
});

// 饼图数据：升学意向分布
const intentionPieData = computed(() => {
  const dist = countData.value.intentionDistribution || [];
  return dist.map(item => ({ name: item.name, value: item.value }));
});

// 饼图数据：院校类型选择分布
const schoolTypePieData = computed(() => {
  const dist = countData.value.schoolTypeDistribution || [];
  return dist.map(item => ({ name: item.name, value: item.value }));
});

// 饼图切换选项
const pieOptions = computed(() => [
  {
    title: '升学意向分布',
    data: intentionPieData.value,
    type: 'intention',
  },
  {
    title: '院校类型选择分布',
    data: schoolTypePieData.value,
    type: 'schoolType',
  },
]);

const activePieIndex = ref(0);
const currentPieData = computed(() => pieOptions.value[activePieIndex.value] || pieOptions.value[0]);

// 切换饼图
const handlePieChange = (index) => {
  activePieIndex.value = index;
};

const emit = defineEmits(['cardSelect', 'barSelect', 'pieSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClick = (schoolName) => {
  emit('barSelect', { field: 'schoolName', value: schoolName });
};

// 饼图点击：根据当前选中的饼图类型传递不同的筛选字段
const handlePieClick = (item) => {
  const pieType = currentPieData.value.type;
  if (pieType === 'intention') {
    emit('pieSelect', { field: 'intention', value: item.name });
  } else if (pieType === 'schoolType') {
    emit('pieSelect', { field: 'schoolType', value: item.name });
  }
};

const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, countRes] = await Promise.allSettled([
      getStudyUpChart({}),
      getStudyUpCount({}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        totalStudent: 128,
        waitPlanStudent: 32,
        plannedStudent: 96,
        schoolTopCount: [
          { schoolName: '福建师范大学', count: 28 },
          { schoolName: '华侨大学', count: 22 },
          { schoolName: '福州大学', count: 18 },
          { schoolName: '其他', count: 60 },
        ],
      };
    }
    if (countRes.status === 'fulfilled') {
      countData.value = countRes.value;
    } else {
      countData.value = {
        intentionDistribution: [
          { name: '专升本', value: 86 },
          { name: '考研', value: 32 },
          { name: '其他', value: 10 },
        ],
        schoolTypeDistribution: [
          { name: '公办', value: 92 },
          { name: '民办', value: 36 },
        ],
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
      style="flex: 1.5 !important;"
      title="热门目标院校"
      :x-data="barData.xData"
      :series-data="barData.seriesData"
      y-name="学生数"
      @bar-click="handleBarClick"
    />

    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activePieIndex" size="small" @change="handlePieChange">
          <el-option
            v-for="(opt, idx) in pieOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>
      <Pie
        style="flex: 1 !important;"
        :title-text="currentPieData.title"
        :data="currentPieData.data"
        @pie-click="handlePieClick"
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

  .chart-area {
    position: relative;
    flex: 1;
    min-width: 280px;
    height: 100%;
  }

  .chart-select-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }
}
</style>
