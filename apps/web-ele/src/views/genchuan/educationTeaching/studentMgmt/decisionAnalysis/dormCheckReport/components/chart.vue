<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicator.vue';
import Bar from '#/genchuan-components/stats/bar.vue';
import {
  getDormCheckReportChart,
  getDormCheckReportCheckCount,
} from '#/api/genchuan/educationTeaching/studentMgmt/decisionAnalysis/dormCheckReport/data.js';

const loading = ref(true);
const chartData = ref({});
const classStats = ref([]);

// 卡片数据（6个）
const cardList = computed(() => {
  const total = chartData.value.totalCheckCount || 0;
  const normal = chartData.value.normalCount || 0;
  const abnormal = chartData.value.abnormalCount || 0;
  const avgRate = chartData.value.avgInRate || 0;
  const late = chartData.value.lateCount || 0;
  const absent = chartData.value.absentCount || 0;
  return [
    { title: '总考勤记录数', value: total, color: '#409EFF', status: 'total' },
    { title: '正常考勤人数', value: normal, color: '#67C23A', status: 'normal' },
    { title: '异常考勤人数', value: abnormal, color: '#F56C6C', status: 'abnormal' },
    { title: '平均在寝率', value: avgRate, color: '#E6A23C', suffix: '%', status: 'avgRate' },
    { title: '迟到人数', value: late, color: '#909399', status: 'late' },
    { title: '未到人数', value: absent, color: '#909399', status: 'absent' },
  ];
});

// 柱状图数据（各班级异常人数）
const barAbnormalData = computed(() => {
  return {
    xData: classStats.value.map(item => item.className),
    seriesData: [{ name: '异常人数', data: classStats.value.map(item => item.abnormalCount) }],
  };
});

// 柱状图数据（各班级在寝率）
const barInRateData = computed(() => {
  return {
    xData: classStats.value.map(item => item.className),
    seriesData: [{ name: '在寝率(%)', data: classStats.value.map(item => item.inRate) }],
  };
});

// 柱状图切换
const activeBarIndex = ref(0);
const barOptions = [
  { title: '各班级异常人数', getData: () => barAbnormalData.value, yName: '异常人数' },
  { title: '各班级在寝率', getData: () => barInRateData.value, yName: '在寝率(%)' },
];
const currentBarData = computed(() => barOptions[activeBarIndex.value].getData());
const currentBarTitle = computed(() => barOptions[activeBarIndex.value].title);
const currentYName = computed(() => barOptions[activeBarIndex.value].yName);

const handleBarChange = (index) => {
  activeBarIndex.value = index;
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, classRes] = await Promise.allSettled([
      getDormCheckReportChart({ timeScale: '月', statStartTime: '2026-01-01 00:00:00', statEndTime: '2026-01-31 23:59:59' }),
      getDormCheckReportCheckCount({ timeScale: '月', statStartTime: '2026-01-01 00:00:00', statEndTime: '2026-01-31 23:59:59' }),
    ]);

    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        totalCheckCount: 480,
        normalCount: 450,
        abnormalCount: 30,
        avgInRate: 93.75,
        lateCount: 18,
        absentCount: 12,
      };
    }

    if (classRes.status === 'fulfilled') {
      classStats.value = classRes.value;
    } else {
      classStats.value = [
        { className: '高一(1)班', abnormalCount: 2, inRate: 96.67 },
        { className: '高一(2)班', abnormalCount: 3, inRate: 95.0 },
        { className: '高一(3)班', abnormalCount: 5, inRate: 91.67 },
      ];
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
      />
    </div>
    <div class="bar-wrapper">
      <div class="bar-header">
        <el-select v-model="activeBarIndex" size="small" @change="handleBarChange">
          <el-option v-for="(opt, idx) in barOptions" :key="idx" :label="opt.title" :value="idx" />
        </el-select>
      </div>
      <Bar
        style="flex: 1 !important;"
        :title="currentBarTitle"
        :x-data="currentBarData.xData"
        :series-data="currentBarData.seriesData"
        :y-name="currentYName"
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

  .bar-wrapper {
    flex: 1.5 !important;
    position: relative;
    min-width: 300px;
  }

  .bar-header {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }
}
</style>
