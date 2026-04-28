<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage, ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import {
  getHonorMgmtChart,
  getHonorCount,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/honorMgmt/data.js';

const mockClassData = [
  { name: '计算机1班', count: 45 },
  { name: '计算机2班', count: 42 },
  { name: '软件1班', count: 48 },
  { name: '软件2班', count: 50 },
  { name: '电子1班', count: 40 },
];
const mockTypeData = [
  { name: '优秀学生', count: 128 },
  { name: '奖学金', count: 86 },
  { name: '竞赛获奖', count: 92 },
  { name: '其他', count: 22 },
];

const loading = ref(true);
const overviewData = ref({});
const chartData = ref({class: [], type: []});

const activeDimension = ref('type');
const barTitleMap = {type: '各类型荣誉数量', class: '各班级荣誉数量'};
const barYName = '荣誉数量';

const currentBarData = computed(() => {
  const raw = chartData.value[activeDimension.value] || [];
  return {
    xData: raw.map(item => item.name),
    seriesData: [{name: '荣誉数量', data: raw.map(item => item.count)}]
  };
});

// 修改：使用后端实际字段名
const cardList = computed(() => {
  const total = overviewData.value.totalHonorCount || 0;
  const pending = overviewData.value.pendingAuditCount || 0;
  const todayPush = overviewData.value.todayPushCount || 0;
  const excellent = overviewData.value.excellentStudentCount || 0;
  return [
    {title: '荣誉记录总数', value: total, color: '#409EFF', status: 'total'},
    {title: '待审核数', value: pending, color: '#E6A23C', status: 'pending'},
    {title: '今日推送数', value: todayPush, color: '#67C23A', status: 'todayPush'},
    {title: '优秀学生数', value: excellent, color: '#F56C6C', status: 'excellent'},
  ];
});

const emit = defineEmits(['barSelect', 'cardSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClick = (name) => {
  if (activeDimension.value === 'class') {
    emit('barSelect', {field: 'className', value: name});
  } else {
    emit('barSelect', {field: 'honorType', value: name});
  }
};

const changeDimension = async (dimension) => {
  activeDimension.value = dimension;
  if (!chartData.value[dimension] || chartData.value[dimension].length === 0) {
    await fetchChartData(dimension);
  }
};

const fetchChartData = async (dimension) => {
  try {
    const data = await getHonorCount({dimension});
    chartData.value[dimension] = data;
  } catch (error) {
    console.warn(`获取${dimension}荣誉数量失败，使用模拟数据`, error);
    chartData.value[dimension] = dimension === 'class' ? mockClassData : mockTypeData;
  }
};

const loadAllChartData = async () => {
  loading.value = true;
  try {
    const [overviewRes, classRes, typeRes] = await Promise.allSettled([
      getHonorMgmtChart({}),
      getHonorCount({dimension: 'class'}),
      getHonorCount({dimension: 'type'}),
    ]);
    if (overviewRes.status === 'fulfilled') {
      overviewData.value = overviewRes.value;
    } else {
      // 使用后端字段名的模拟数据
      overviewData.value = {
        totalHonorCount: 328,
        pendingAuditCount: 12,
        todayPushCount: 8,
        excellentStudentCount: 128,
        scholarshipCount: 86,
        competitionCount: 92,
      };
    }
    chartData.value.class = classRes.status === 'fulfilled' ? classRes.value : mockClassData;
    chartData.value.type = typeRes.status === 'fulfilled' ? typeRes.value : mockTypeData;
  } catch (error) {
    console.error('加载图表数据失败', error);
    overviewData.value = {
      totalHonorCount: 328,
      pendingAuditCount: 12,
      todayPushCount: 8,
      excellentStudentCount: 128,
      scholarshipCount: 86,
      competitionCount: 92,
    };
    chartData.value = {class: mockClassData, type: mockTypeData};
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadAllChartData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <div class="box-left">
      <Indicator class="left-card" v-for="item in cardList" :key="item.title" v-bind="item"
                 @click="handleCardClick"/>
    </div>
    <div class="chart-wrapper">
      <div class="bar-select-wrapper">
        <el-select v-model="activeDimension" size="small" @change="changeDimension">
          <el-option label="各类型荣誉数量" value="type"/>
          <el-option label="各班级荣誉数量" value="class"/>
        </el-select>
      </div>
      <Bar
        :title="barTitleMap[activeDimension]"
        :x-data="currentBarData.xData"
        :series-data="currentBarData.seriesData"
        :y-name="barYName"
        @bar-click="handleBarClick"
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

  .box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }

  .chart-wrapper {
    display: flex;
    flex-direction: column;
    min-width: 280px;
    position: relative;
    flex: 2;
  }

  .bar-select-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }
}
</style>
