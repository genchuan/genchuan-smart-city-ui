<script setup>
import { reactive, onMounted } from 'vue';
import { getUserChartDashboard } from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationVehicleMgmt/sanitationWorker/data.js';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';

const state = reactive({
  loading: false,
  // 五个核心卡片
  cardList: [],
  // 三个圆环图
  pieData: {
    jobType: [],           // 岗位类型占比
    personStatus: [],      // 人员状态占比
    teamDistribution: [],  // 所属班组分布占比
  },
  // 两个柱状图
  barData: {
    teamCount: {           // 不同班组人员数量对比
      x: [],
      series: [],
    },
    jobScore: {            // 不同岗位平均考核得分对比
      x: [],
      series: [],
    },
  },
});

// 通用数值转换（处理字符串或数字）
const toNumber = (val) => {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'string') return parseFloat(val) || 0;
  return Number(val) || 0;
};

// 获取图表数据
const fetchChartData = async () => {
  state.loading = true;
  try {
    const res = await getUserChartDashboard();
    console.log('环卫人员仪表盘接口返回:', res);

    // 接口返回已解包，直接使用 res（无外层 code/data）
    if (res && typeof res === 'object') {
      // 卡片数据映射
      state.cardList = [
        { title: '总人员数', value: toNumber(res.totalUserCount), color: '#409EFF' },
        { title: '在岗人数', value: toNumber(res.onDutyCount), color: '#67C23A' },
        { title: '全勤人数', value: toNumber(res.fullAttendanceCount), color: '#E6A23C' },
        { title: '考核优秀人数', value: toNumber(res.excellentAssessmentCount), color: '#F56C6C' },
        { title: '待排班人数', value: toNumber(res.pendingScheduleCount), color: '#909399' },
      ];

      // 圆环图数据
      state.pieData.jobType = Array.isArray(res.positionTypeDistribution) ? res.positionTypeDistribution : [];
      state.pieData.personStatus = Array.isArray(res.userStatusDistribution) ? res.userStatusDistribution : [];
      state.pieData.teamDistribution = Array.isArray(res.teamDistribution) ? res.teamDistribution : [];

      // 柱状图1：不同班组人员数量对比
      const teamCountList = Array.isArray(res.userCountByTeam) ? res.userCountByTeam : [];
      state.barData.teamCount.x = teamCountList.map(item => item.name || '');
      state.barData.teamCount.series = teamCountList.map(item => toNumber(item.value));

      // 柱状图2：不同岗位平均考核得分对比
      const scoreList = Array.isArray(res.avgAssessmentScoreByPosition) ? res.avgAssessmentScoreByPosition : [];
      state.barData.jobScore.x = scoreList.map(item => item.name || '');
      state.barData.jobScore.series = scoreList.map(item => toNumber(item.value));
    } else {
      console.error('接口返回数据格式异常', res);
    }
  } catch (error) {
    console.error('请求环卫人员仪表盘数据失败:', error);
  } finally {
    state.loading = false;
  }
};

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div class="chart-box" v-loading="state.loading" element-loading-text="加载中...">
    <!-- 左侧卡片区域：五个指标卡片，网格布局 -->
    <div class="box-left-m" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>

    <!-- 三个圆环图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="岗位类型占比"
      :data="state.pieData.jobType"
    />
    <Pie
      style="flex: 1 !important;"
      title-text="人员状态占比"
      :data="state.pieData.personStatus"
    />
    <Pie
      style="flex: 1 !important;"
      title-text="所属班组分布占比"
      :data="state.pieData.teamDistribution"
    />

    <!-- 两个柱状图 -->
    <Bar
      style="flex: 1 !important;"
      title="不同班组人员数量对比"
      :x-data="state.barData.teamCount.x"
      :series-data="[{ name: '人员数量', data: state.barData.teamCount.series }]"
    />
    <Bar
      style="flex: 1 !important;"
      title="不同岗位平均考核得分对比"
      :x-data="state.barData.jobScore.x"
      :series-data="[{ name: '考核得分', data: state.barData.jobScore.series }]"
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
</style>
