<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getParentReplyChart,
  getParentReplyIndex,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/homeSchool/parentReply/data.js';

const loading = ref(true);
const chartData = ref({});          // 卡片 + 折线图
const indexData = ref({});          // 柱状图数据

// ========== 卡片数据 ==========
const cardList = computed(() => {
  const total = chartData.value.totalReplyCount || 0;
  const unread = chartData.value.unreadReplyCount || 0;
  const avgDuration = chartData.value.avgReplyDuration || 0;
  const finishRate = chartData.value.replyFinishRate || 0;
  return [
    { title: '回复总次数', value: total, color: '#409EFF', status: 'total' },
    { title: '未读回复数', value: unread, color: '#F56C6C', status: 'unread' },
    { title: '平均回复时长', value: avgDuration, color: '#E6A23C', suffix: '小时', status: 'duration' },
    { title: '回复完成率', value: (finishRate * 100).toFixed(1), color: '#67C23A', suffix: '%', status: 'rate' },
  ];
});

// ========== 折线图数据（近一周回复趋势） ==========
const lineData = computed(() => {
  const trend = chartData.value.recentWeekReplyTrend || [];
  return {
    xAxis: trend.map(item => item.date),
    series: [{ name: '回复次数', data: trend.map(item => item.count) }],
  };
});

// ========== 柱状图配置（支持切换：学生回复统计 / 班级回复率 / 回复时间分布） ==========
const barOptions = computed(() => [
  {
    title: '学生回复统计',
    type: 'student',
    getData: () => {
      const data = indexData.value.studentReplyCount || [];
      return {
        xData: data.map(item => item.name),
        seriesData: [{ name: '回复次数', data: data.map(item => item.value) }],
      };
    },
    yName: '回复次数',
  },
  {
    title: '班级回复率',
    type: 'class',
    getData: () => {
      const data = indexData.value.classReplyRate || [];
      return {
        xData: data.map(item => item.name),
        seriesData: [{ name: '回复率', data: data.map(item => item.value * 100) }],
      };
    },
    yName: '回复率(%)',
  },
  {
    title: '回复时间分布',
    type: 'time',
    getData: () => {
      const data = indexData.value.replyTimeDistribute || [];
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
  if (currentType === 'student') {
    emit('barSelect', { field: 'studentName', value: name });
  } else if (currentType === 'class') {
    emit('barSelect', { field: 'className', value: name });
  }
  // 回复时间分布不做钻取
};

const handleLineClick = (params) => {
  emit('lineSelect', { field: 'date', value: params.xValue });
};

// ========== 加载数据 ==========
const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, indexRes] = await Promise.allSettled([
      getParentReplyChart({}),
      getParentReplyIndex({}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        totalReplyCount: 126,
        unreadReplyCount: 8,
        avgReplyDuration: 2.5,
        replyFinishRate: 0.94,
        recentWeekReplyTrend: [
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
    if (indexRes.status === 'fulfilled') {
      indexData.value = indexRes.value;
    } else {
      indexData.value = {
        studentReplyCount: [
          { name: '张三', value: 5 },
          { name: '李四', value: 3 },
          { name: '王五', value: 2 },
        ],
        classReplyRate: [
          { name: '初一1班', value: 0.95 },
          { name: '初一2班', value: 0.92 },
          { name: '初二1班', value: 0.88 },
        ],
        replyTimeDistribute: [
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
    <!-- 卡片区（4个卡片） -->
    <div class="box-left">
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
      title="近一周回复趋势"
      :x-data="lineData.xAxis"
      :series-data="lineData.series"
      y-name="回复次数"
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

  .box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    min-width: 360px;
    max-width: 400px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
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
