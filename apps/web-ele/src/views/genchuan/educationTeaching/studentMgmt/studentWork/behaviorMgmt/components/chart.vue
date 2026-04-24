<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage, ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getBehaviorMgmtChart,
  getAttendanceCount,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/behaviorMgmt/data.js';

const loading = ref(true);
const overviewData = ref({});
const classData = ref([]);

// 卡片列表
const cardList = computed(() => {
  const totalLeave = overviewData.value.totalLeaveCount || 0;
  const pending = overviewData.value.pendingAuditCount || 0;
  const abnormal = overviewData.value.attendanceAbnormalCount || 0;
  const synced = overviewData.value.syncCount || 0;
  return [
    {title: '请假总次数', value: totalLeave, color: '#409EFF', status: 'totalLeave'},
    {title: '待审批数', value: pending, color: '#E6A23C', status: 'pending'},
    {title: '考勤异常人数', value: abnormal, color: '#F56C6C', status: 'abnormal'},
    {title: '已同步数', value: synced, color: '#67C23A', status: 'synced'},
  ];
});

// 请假类型分布饼图：将后端返回的 {name, count} 转换为 {name, value}（Pie组件需要value）
const leaveTypePieData = computed(() => {
  const distribution = overviewData.value.leaveTypeDistribution || [];
  return distribution.map(item => ({
    name: item.name,
    value: item.count
  }));
});

// 每日请假趋势（折线图数据）：后端返回 {name, count}，直接使用 name 作为 x 轴，count 作为数据
const dailyTrendXData = computed(() => {
  const trend = overviewData.value.dailyLeaveTrend || [];
  return trend.map(item => item.name);
});
const dailyTrendSeries = computed(() => [
  {name: '请假人数', data: (overviewData.value.dailyLeaveTrend || []).map(item => item.count)},
]);

// 班级分组柱状图数据
const classBarXData = computed(() => classData.value.map(item => item.className));
const classBarSeries = computed(() => [
  {name: '请假次数', data: classData.value.map(item => item.leaveCount)},
  {name: '考勤异常人数', data: classData.value.map(item => item.abnormalCount)},
]);

// 图表切换选项
const chartOptions = computed(() => [
  {
    type: 'line',
    title: '每日请假趋势',
    xData: dailyTrendXData.value,
    seriesData: dailyTrendSeries.value,
    yName: '请假人数',
  },
  {
    type: 'bar',
    title: '各班级请假次数与考勤异常人数对比',
    xData: classBarXData.value,
    seriesData: classBarSeries.value,
    yName: '数量',
  },
]);

const activeChartIndex = ref(0);
const currentChart = computed(() => chartOptions.value[activeChartIndex.value] || chartOptions.value[0]);

// 切换图表
const handleChartChange = (index) => {
  activeChartIndex.value = index;
};

const emit = defineEmits(['cardClick', 'pieClick', 'barClick', 'lineClick']);

// 卡片点击
const handleCardClick = (cardInfo) => {
  emit('cardClick', cardInfo.status);
};

// 饼图点击
const handlePieClick = (item) => {
  emit('pieClick', {type: 'leaveType', value: item.name});
};

// 柱状图点击（班级筛选）
const handleBarClick = (params) => {
  let className = null;
  if (typeof params === 'string') {
    className = params;
  } else if (params && typeof params === 'object') {
    className = params.name || params.className;
  }
  if (className) {
    emit('barClick', {className});
  } else {
    console.warn('柱状图点击未能获取班级名称', params);
  }
};

// 折线图点击（日期筛选）
const handleTrendClick = (params) => {
  emit('lineClick', {date: params.name});
};

const loadChartData = async () => {
  loading.value = true;
  try {
    const [overviewRes, classRes] = await Promise.allSettled([
      getBehaviorMgmtChart({}),
      getAttendanceCount({}),
    ]);
    if (overviewRes.status === 'fulfilled') {
      overviewData.value = overviewRes.value;
    } else {
      // 模拟数据字段与后端一致：使用 name/count
      overviewData.value = {
        totalLeaveCount: 86,
        pendingAuditCount: 12,
        attendanceAbnormalCount: 5,
        syncCount: 74,
        leaveTypeDistribution: [
          {name: '事假', count: 45},
          {name: '病假', count: 32},
          {name: '其他', count: 9},
        ],
        dailyLeaveTrend: [
          {name: '03-01', count: 3},
          {name: '03-02', count: 5},
          {name: '03-03', count: 2},
        ],
      };
    }
    if (classRes.status === 'fulfilled') {
      classData.value = classRes.value.classStatistics || [];
    } else {
      classData.value = [
        {className: '计算机1班', leaveCount: 12, abnormalCount: 1},
        {className: '计算机2班', leaveCount: 15, abnormalCount: 2},
        {className: '软件1班', leaveCount: 9, abnormalCount: 0},
        {className: '软件2班', leaveCount: 8, abnormalCount: 1},
        {className: '电子1班', leaveCount: 10, abnormalCount: 1},
      ];
    }
  } catch (error) {
    console.error('加载图表数据失败', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadChartData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <!-- 看板卡片区 -->
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <!-- 请假类型分布饼图（固定） -->
    <Pie
      style="flex: 1 !important;"
      title-text="请假类型分布"
      :data="leaveTypePieData"
      @pie-click="handlePieClick"
    />

    <!-- 图表切换区域（折线图/柱状图） -->
    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select
          v-model="activeChartIndex"
          size="small"
          @change="handleChartChange"
        >
          <el-option
            v-for="(opt, idx) in chartOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>

      <!-- 动态渲染当前图表组件 -->
      <lineChart
        v-if="currentChart.type === 'line'"
        :title="currentChart.title"
        :x-data="currentChart.xData"
        :series-data="currentChart.seriesData"
        :y-name="currentChart.yName"
        @line-click="handleTrendClick"
      />
      <Bar
        v-else
        :title="currentChart.title"
        :x-data="currentChart.xData"
        :series-data="currentChart.seriesData"
        :y-name="currentChart.yName"
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
}

/* 图表切换区域样式 */
.chart-area {
  position: relative;
  flex: 1.5;
  min-width: 300px;
  display: flex;
  flex-direction: column;
}

.chart-select-wrapper {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
}
</style>
