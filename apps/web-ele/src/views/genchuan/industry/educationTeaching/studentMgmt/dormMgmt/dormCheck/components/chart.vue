<script setup>
import {ref, computed, onMounted} from 'vue';
import {ElSelect, ElOption, ElDatePicker} from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import {
  getDormCheckChart,
  getDormCheckCount,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/dormMgmt/dormCheck/data.js';

const loading = ref(true);
const chartData = ref({});
const classStats = ref({});
const selectedDate = ref(new Date());

const cardList = computed(() => {
  const total = chartData.value.totalCheck || 0;
  const normal = chartData.value.normalCount || 0;
  const abnormal = chartData.value.abnormalCount || 0;
  const inRate = chartData.value.inRate || 0;
  const warning = chartData.value.warningCount || 0;
  return [
    {title: '总考勤人数', value: total, color: '#409EFF', status: 'total'},
    {title: '正常考勤人数', value: normal, color: '#67C23A', status: 'normal'},
    {title: '异常考勤人数', value: abnormal, color: '#F56C6C', status: 'abnormal'},
    {title: '整体在寝率', value: inRate, color: '#E6A23C', suffix: '%', status: 'inRate'},
    {title: '预警人数', value: warning, color: '#e63c3c', status: 'warning'},
  ];
});

const barOptions = computed(() => [
  {
    title: '各班级异常人数',
    type: 'abnormalCount',
    getData: () => ({
      xData: classStats.value.labels || [],
      seriesData: [{name: '异常人数', data: classStats.value.abnormalCount || []}],
    }),
    yName: '异常人数',
  },
  {
    title: '各班级在寝率',
    type: 'inRate',
    getData: () => ({
      xData: classStats.value.labels || [],
      seriesData: [{name: '在寝率(%)', data: classStats.value.inRate || []}],
    }),
    yName: '在寝率(%)',
  },
]);

const activeBarIndex = ref(0);
const currentBarData = computed(() => barOptions.value[activeBarIndex.value]?.getData() || {
  xData: [],
  seriesData: []
});
const currentBarTitle = computed(() => barOptions.value[activeBarIndex.value]?.title || '');
const currentYName = computed(() => barOptions.value[activeBarIndex.value]?.yName || '');

const handleBarChange = (index) => {
  activeBarIndex.value = index;
};

// ========== 核心修改：所有点击改为派发自定义事件 ==========
const handleCardClick = (cardInfo) => {
  let filterType = null;
  let filterValue = null;
  switch (cardInfo.status) {
    case 'normal':
      filterType = 'checkStatus';
      filterValue = '正常';
      break;
    case 'abnormal':
      filterType = 'checkStatus';
      filterValue = '异常';
      break;
    case 'total':
    case 'inRate':
    case 'warning':
    default:
      return;
  }
  window.dispatchEvent(new CustomEvent('dorm-check-chart-filter', {
    detail: {type: filterType, value: filterValue}
  }));
};

const handleBarClick = (className) => {
  window.dispatchEvent(new CustomEvent('dorm-check-chart-filter', {
    detail: {type: 'className', value: className}
  }));
};

// 日期变化时重新加载数据（原逻辑，不影响筛选）
const handleDateChange = () => {
  loadData();
};

// 加载数据（保持不变）
const loadData = async () => {
  loading.value = true;
  try {
    const formattedDate = selectedDate.value
      ? new Date(selectedDate.value).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);
    const [chartRes, classRes] = await Promise.allSettled([
      getDormCheckChart({checkTime: formattedDate}),
      getDormCheckCount({}),
    ]);
    if (chartRes.status === 'fulfilled') chartData.value = chartRes.value;
    else {
      console.warn('考勤看板接口失败，使用模拟数据', chartRes.reason);
      chartData.value = {
        totalCheck: 1200,
        normalCount: 1110,
        abnormalCount: 90,
        inRate: 92.5,
        warningCount: 15,
        abnormalStats: [
          {type: '晚归', count: 10},
          {type: '未归', count: 5},
          {type: '迟到', count: 75},
        ],
      };
    }
    if (classRes.status === 'fulfilled') classStats.value = classRes.value;
    else {
      console.warn('班级统计接口失败，使用模拟数据', classRes.reason);
      classStats.value = {
        labels: ['高一1班', '高一2班', '高一3班', '高二1班'],
        abnormalCount: [3, 5, 2, 4],
        inRate: [95.0, 92.5, 97.0, 93.0],
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
    <div class="box-left-m">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <div class="chart-area bar-chart-container">
      <div class="chart-select-wrapper">
        <el-select v-model="activeBarIndex" size="small" @change="handleBarChange">
          <el-option v-for="(opt, idx) in barOptions" :key="idx" :label="opt.title" :value="idx"/>
        </el-select>
      </div>

      <div class="date-range-wrapper">
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="选择日期"
          size="small"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="handleDateChange"
        />
      </div>

      <Bar
        :title="currentBarTitle"
        :x-data="currentBarData.xData"
        :series-data="currentBarData.seriesData"
        :y-name="currentYName"
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

  .box-left-m {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr);
    min-width: 360px;
    max-width: 400px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }

  .chart-area {
    position: relative;
    flex: 1.5;
    min-width: 280px;
    height: 100%;
    margin-top: 12px;
  }

  .chart-select-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }

  .bar-chart-container {
    position: relative;
  }

  .date-range-wrapper {
    position: absolute;
    top: 8px;
    left: 10px;
    z-index: 10;
  }

  :deep(.el-date-editor) {
    --el-date-editor-width: 130px;

    .el-input__wrapper {
      padding: 0 8px;
    }

    .el-range__icon {
      margin-right: 2px;
    }
  }
}
</style>
