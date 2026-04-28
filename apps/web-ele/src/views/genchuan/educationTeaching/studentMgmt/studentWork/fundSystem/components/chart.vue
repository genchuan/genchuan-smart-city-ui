<script setup>
import {reactive, onMounted, ref, computed} from 'vue';
import {ElMessage} from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import {
  getFundSystemChart,
  getFundCount,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/fundSystem/data.js';

const loading = ref(true);
const overviewData = ref({});
const gradeData = ref([]);

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
    // ✅ 修正：移除 timeRange 参数，后端不需要传参
    const [chartRes, countRes] = await Promise.all([
      getFundSystemChart({}),
      getFundCount({}),
    ]);
    overviewData.value = chartRes;
    gradeData.value = countRes.gradeStatistics || [];
  } catch (error) {
    console.error('加载图表数据失败', error);
    // 依然保留模拟数据兜底
    overviewData.value = {
      totalApplyCount: 128,
      pendingAuditCount: 23,
      totalApplyAmount: 425600.00,
      approvedCount: 105,
    };
    gradeData.value = [
      {
        grade: '2022级',
        fundCount: 45,
        typeDistribution: [{name: '助学金', value: 32}, {
          name: '勤工俭学',
          value: 10
        }, {name: '其他', value: 3}]
      },
      {
        grade: '2023级',
        fundCount: 42,
        typeDistribution: [{name: '助学金', value: 28}, {
          name: '勤工俭学',
          value: 11
        }, {name: '其他', value: 3}]
      },
      {
        grade: '2024级',
        fundCount: 41,
        typeDistribution: [{name: '助学金', value: 29}, {name: '勤工俭学', value: 8}, {
          name: '其他',
          value: 4
        }]
      },
      {
        grade: '2025级',
        fundCount: 38,
        typeDistribution: [{name: '助学金', value: 25}, {
          name: '勤工俭学',
          value: 10
        }, {name: '其他', value: 3}]
      },
      {
        grade: '2026级',
        fundCount: 35,
        typeDistribution: [{name: '助学金', value: 22}, {name: '勤工俭学', value: 9}, {
          name: '其他',
          value: 4
        }]
      },
    ];
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
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <Bar
      style="flex: 1 !important;"
      title="各年级资助人数"
      :x-data="barGradeXData"
      :series-data="barGradeSeries"
      y-name="资助人数"
      @bar-click="(params) => handleBarClick(params, 'grade')"
    />
    <Bar
      style="flex: 1.5 !important;"
      title="各年级资助类型分布"
      :x-data="barTypeXData"
      :series-data="barTypeSeries"
      y-name="人数"
      @bar-click="(params) => handleBarClick(params, 'type')"
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
}
</style>
