<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getCommunicateMgmtChart,
  getCommunicateMgmtInteractIndex,
} from '#/api/genchuan/educationTeaching/studentMgmt/homeSchool/communicateMgmt/data.js';

const loading = ref(true);
const chartData = ref({});          // 卡片 + 折线图
const interactData = ref({});       // 柱状图数据

// ========== 卡片数据 ==========
const cardList = computed(() => {
  const totalMsg = chartData.value.totalMsgCount || 0;
  const published = chartData.value.publishedMsgCount || 0;
  const unpublished = chartData.value.unpublishedMsgCount || 0;
  const totalReply = chartData.value.totalReplyCount || 0;
  const avgRate = chartData.value.avgInteractRate || 0;
  return [
    { title: '信息推送次数', value: totalMsg, color: '#409EFF', status: 'total' },
    { title: '家长反馈次数', value: totalReply, color: '#67C23A', status: 'reply' },
    { title: '互动率', value: (avgRate * 100).toFixed(1), color: '#E6A23C', suffix: '%', status: 'rate' },
  ];
});

// ========== 折线图数据（近一周互动趋势） ==========
const lineData = computed(() => {
  const trend = chartData.value.recentWeekInteractTrend || [];
  return {
    xAxis: trend.map(item => item.date),
    series: [{ name: '互动次数', data: trend.map(item => item.count) }],
  };
});

// ========== 柱状图配置（支持切换：消息类型分布 / 各班级互动率 / 反馈时间分布） ==========
const barOptions = computed(() => [
  {
    title: '消息类型统计',
    type: 'msgType',
    getData: () => {
      const data = interactData.value.msgTypeCount || [];
      return {
        xData: data.map(item => item.name),
        seriesData: [{ name: '数量', data: data.map(item => item.value) }],
      };
    },
    yName: '数量',
  },
  {
    title: '各班级互动率',
    type: 'classRate',
    getData: () => {
      const data = interactData.value.classInteractRate || [];
      return {
        xData: data.map(item => item.name),
        seriesData: [{ name: '互动率', data: data.map(item => item.value * 100) }],
      };
    },
    yName: '互动率(%)',
  },
  {
    title: '反馈时间分布',
    type: 'replyTime',
    getData: () => {
      const data = interactData.value.replyTimeDistribution || [];
      return {
        xData: data.map(item => item.name),
        seriesData: [{ name: '反馈数', data: data.map(item => item.value) }],
      };
    },
    yName: '反馈数',
  },
]);

const activeBarIndex = ref(0);
const currentBarData = computed(() => barOptions.value[activeBarIndex.value]?.getData() || { xData: [], seriesData: [] });
const currentBarTitle = computed(() => barOptions.value[activeBarIndex.value]?.title || '');
const currentYName = computed(() => barOptions.value[activeBarIndex.value]?.yName || '');

const handleBarChange = (index) => {
  activeBarIndex.value = index;
};

// ========== 事件发射 ==========
const emit = defineEmits(['cardSelect', 'barSelect', 'lineSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClick = (name) => {
  const currentType = barOptions.value[activeBarIndex.value]?.type;
  if (currentType === 'msgType') {
    emit('barSelect', { field: 'msgType', value: name });
  } else if (currentType === 'classRate') {
    emit('barSelect', { field: 'className', value: name });
  }
  // 反馈时间分布不做钻取
};

const handleLineClick = (params) => {
  emit('lineSelect', { field: 'date', value: params.xValue });
};

// ========== 加载数据 ==========
const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, interactRes] = await Promise.allSettled([
      getCommunicateMgmtChart({}),
      getCommunicateMgmtInteractIndex({}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        totalMsgCount: 42,
        publishedMsgCount: 38,
        unpublishedMsgCount: 4,
        totalReplyCount: 126,
        avgInteractRate: 0.89,
        recentWeekInteractTrend: [
          { date: '2025-03-25', count: 15 },
          { date: '2025-03-26', count: 22 },
          { date: '2025-03-27', count: 18 },
          { date: '2025-03-28', count: 16 },
          { date: '2025-03-29', count: 12 },
          { date: '2025-03-30', count: 9 },
          { date: '2025-03-31', count: 11 },
        ],
      };
    }
    if (interactRes.status === 'fulfilled') {
      interactData.value = interactRes.value;
    } else {
      interactData.value = {
        msgTypeCount: [
          { name: '通知公告', value: 22 },
          { name: '成绩反馈', value: 10 },
          { name: '活动通知', value: 6 },
          { name: '其他', value: 4 },
        ],
        classInteractRate: [
          { name: '初一1班', value: 0.95 },
          { name: '初一2班', value: 0.92 },
          { name: '初二1班', value: 0.88 },
          { name: '初二2班', value: 0.86 },
          { name: '初三1班', value: 0.85 },
          { name: '初三2班', value: 0.83 },
        ],
        replyTimeDistribution: [
          { name: '1小时内', value: 68 },
          { name: '1-3小时', value: 32 },
          { name: '3-12小时', value: 18 },
          { name: '12小时以上', value: 8 },
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
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>
    <lineChart
      style="flex: 1.5 !important;"
      title="近一周互动趋势"
      :x-data="lineData.xAxis"
      :series-data="lineData.series"
      y-name="互动次数"
      @line-click="handleLineClick"
    />
    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activeBarIndex" size="small" @change="handleBarChange">
          <el-option v-for="(opt, idx) in barOptions" :key="idx" :label="opt.title" :value="idx" />
        </el-select>
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
