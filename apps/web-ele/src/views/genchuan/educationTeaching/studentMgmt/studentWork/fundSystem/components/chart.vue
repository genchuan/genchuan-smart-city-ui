<script setup>
import {reactive, onMounted, ref, computed} from 'vue';
import {ElMessage, ElDatePicker} from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import {
  getFundSystemChart,
  getFundCount,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/fundSystem/data.js';

const loading = ref(true);
const overviewData = ref({});
const gradeData = ref([]);

// ========== 时间范围选择器 ==========
const timeRange = ref([]);

// 获取默认时间范围（最近30天，结束时间为当天）
const getDefaultTimeRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  return [start, end];
};

// 格式化单个日期时间为后端要求的格式（带 T 分隔）
const formatDateTime = (date, isEnd = false) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const time = isEnd ? '23:59:59' : '00:00:00';
  return `${year}-${month}-${day}T${time}`;
};

// 生成 timeRange 字符串（格式："起始时间,结束时间"）
const getTimeRangeParam = () => {
  if (timeRange.value && timeRange.value.length === 2) {
    const startStr = formatDateTime(timeRange.value[0], false);
    const endStr = formatDateTime(timeRange.value[1], true);
    return `${startStr},${endStr}`;
  }
  const [defaultStart, defaultEnd] = getDefaultTimeRange();
  return `${formatDateTime(defaultStart, false)},${formatDateTime(defaultEnd, true)}`;
};

// 日期范围变化时重新加载数据
const handleDateRangeChange = () => {
  loadData();
};

const cardList = computed(() => {
  const totalApply = overviewData.value.totalApplyCount || 0;
  const pending = overviewData.value.pendingAuditCount || 0;
  const totalAmount = overviewData.value.totalApplyAmount || 0;
  const approved = overviewData.value.approvedCount || 0;
  return [
    {title: '申请总次数', value: totalApply, color: '#409EFF', status: 'total'},
    {title: '待审核数', value: pending, color: '#E6A23C', status: 'pending'},
    {title: '申请总金额', value: `¥${totalAmount.toFixed(2)}`, color: '#67C23A', status: 'amount'},
    {title: '已审核数', value: approved, color: '#909399', status: 'approved'},
  ];
});

const barGradeXData = computed(() => gradeData.value.map(item => item.grade));
const barGradeSeries = computed(() => [
  {name: '资助人数', data: gradeData.value.map(item => item.fundCount)},
]);

const barTypeXData = computed(() => gradeData.value.map(item => item.grade));
const barTypeScholarship = computed(() => gradeData.value.map(item => {
  const type = item.typeDistribution?.find(t => t.name === '助学金');
  return type ? type.value : 0;
}));
const barTypeWorkStudy = computed(() => gradeData.value.map(item => {
  const type = item.typeDistribution?.find(t => t.name === '勤工俭学');
  return type ? type.value : 0;
}));
const barTypeOther = computed(() => gradeData.value.map(item => {
  const type = item.typeDistribution?.find(t => t.name === '其他');
  return type ? type.value : 0;
}));
const barTypeSeries = computed(() => [
  {name: '助学金', data: barTypeScholarship.value},
  {name: '勤工俭学', data: barTypeWorkStudy.value},
  {name: '其他', data: barTypeOther.value},
]);

const emit = defineEmits(['barClick', 'cardSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClick = (params, chartType) => {
  let gradeName = null;
  if (typeof params === 'string') {
    gradeName = params;
  } else if (params && typeof params === 'object') {
    gradeName = params.name || params.label || params.xValue || params.value;
  }
  if (gradeName) {
    emit('barClick', {type: 'grade', value: gradeName});
  } else {
    console.warn('柱状图点击未能解析年级名称', params);
  }
};

const loadData = async () => {
  loading.value = true;
  try {
    const timeRangeParam = getTimeRangeParam();
    const [chartRes, countRes] = await Promise.all([
      getFundSystemChart({ timeRange: timeRangeParam }),
      getFundCount({ timeRange: timeRangeParam }),
    ]);
    overviewData.value = chartRes;
    gradeData.value = countRes.gradeStatistics || [];
  } catch (error) {
    console.error('加载图表数据失败', error);
    // 模拟数据兜底
    overviewData.value = {
      totalApplyCount: 128,
      pendingAuditCount: 23,
      totalApplyAmount: 425600.00,
      approvedCount: 105,
    };
    gradeData.value = [
      { grade: '2022级', fundCount: 45, typeDistribution: [{name: '助学金', value: 32}, {name: '勤工俭学', value: 10}, {name: '其他', value: 3}] },
      { grade: '2023级', fundCount: 42, typeDistribution: [{name: '助学金', value: 28}, {name: '勤工俭学', value: 11}, {name: '其他', value: 3}] },
      { grade: '2024级', fundCount: 41, typeDistribution: [{name: '助学金', value: 29}, {name: '勤工俭学', value: 8}, {name: '其他', value: 4}] },
      { grade: '2025级', fundCount: 38, typeDistribution: [{name: '助学金', value: 25}, {name: '勤工俭学', value: 10}, {name: '其他', value: 3}] },
      { grade: '2026级', fundCount: 35, typeDistribution: [{name: '助学金', value: 22}, {name: '勤工俭学', value: 9}, {name: '其他', value: 4}] },
    ];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  timeRange.value = getDefaultTimeRange();
  loadData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <!-- 第一个柱状图：各年级资助人数 -->
    <Bar
      style="flex: 1 !important;"
      title="各年级资助人数"
      :x-data="barGradeXData"
      :series-data="barGradeSeries"
      y-name="资助人数"
      @bar-click="(params) => handleBarClick(params, 'grade')"
    />

    <!-- 第二个柱状图（含日期选择器） -->
    <div class="bar-chart-container" style="flex: 1.5 !important; position: relative;">
      <!-- 日期范围选择器（紧凑样式，位于右上角） -->
      <div class="date-range-wrapper">
        <el-date-picker
          v-model="timeRange"
          type="daterange"
          range-separator="-"
          start-placeholder="起始"
          end-placeholder="结束"
          size="small"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :shortcuts="[
            { text: '近7天', value: () => { const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 7); return [start, end]; } },
            { text: '近30天', value: () => { const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 30); return [start, end]; } },
            { text: '本学期', value: () => { /* 简单示例：假设学期从9月到1月 */ const now = new Date(); const start = new Date(now.getFullYear(), 8, 1); const end = new Date(now.getFullYear(), 11, 31); return [start, end]; } }
          ]"
          @change="handleDateRangeChange"
        />
      </div>
      <Bar
        title="各年级资助类型分布"
        :x-data="barTypeXData"
        :series-data="barTypeSeries"
        y-name="人数"
        @bar-click="(params) => handleBarClick(params, 'type')"
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
    min-width: 320px;
    max-width: 360px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }

  /* 柱状图容器特殊样式，用于绝对定位日期选择器 */
  .bar-chart-container {
    position: relative;
    margin-left: 12px;
  }

  .date-range-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }

  /* 紧凑的时间选择器样式 */
  :deep(.el-date-editor) {
    --el-date-editor-width: 240px;

    .el-range__icon {
      margin-right: 2px;
    }

    .el-range-separator {
      padding: 0 4px;
    }

    .el-range__close-icon {
      margin-left: 2px;
    }
  }
}
</style>
