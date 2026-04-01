<script setup>
import {reactive, onMounted, ref, computed} from 'vue';
import {ElSelect, ElOption} from 'element-plus';
import {
  getUserChartDashboard
} from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationVehicleMgmt/sanitationWorker/data.js';
import Indicator from '#/genchuan-components/stats/indicator.vue';
import Pie from '#/genchuan-components/stats/pie.vue';
import Bar from '#/genchuan-components/stats/bar.vue';

const state = reactive({
  loading: false,
  // 五个核心卡片
  cardList: [],
  // 三个圆环图（原始数据，用于切换）
  pieData: {
    jobType: [],           // 岗位类型占比
    personStatus: [],      // 人员状态占比
    teamDistribution: [],  // 所属班组分布占比
  },
  // 两个柱状图（原始数据，用于切换）
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

// 圆环图选项（基于原始数据生成）
const pieOptions = computed(() => [
  {
    title: '岗位类型占比',
    data: state.pieData.jobType,
  },
  {
    title: '人员状态占比',
    data: state.pieData.personStatus,
  },
  {
    title: '所属班组分布占比',
    data: state.pieData.teamDistribution,
  },
]);

// 柱状图选项（基于原始数据生成）
const barOptions = computed(() => [
  {
    title: '不同班组人员数量对比',
    xData: state.barData.teamCount.x,
    seriesData: [{name: '人员数量', data: state.barData.teamCount.series}],
  },
  {
    title: '不同岗位平均考核得分对比',
    xData: state.barData.jobScore.x,
    seriesData: [{name: '考核得分', data: state.barData.jobScore.series}],
  },
]);

// 当前选中的圆环图索引和数据
const activePieIndex = ref(0);
const currentPieData = computed(() => pieOptions.value[activePieIndex.value] || pieOptions.value[0]);

// 切换圆环图
const handlePieChange = (index) => {
  activePieIndex.value = index;
};

// 当前选中的柱状图索引和数据
const activeBarIndex = ref(0);
const currentBar = computed(() => barOptions.value[activeBarIndex.value] || barOptions.value[0]);

// 切换柱状图
const handleBarChange = (index) => {
  activeBarIndex.value = index;
};

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
        {title: '总人员数', value: toNumber(res.totalUserCount), color: '#409EFF'},
        {title: '在岗人数', value: toNumber(res.onDutyCount), color: '#67C23A'},
        {title: '全勤人数', value: toNumber(res.fullAttendanceCount), color: '#E6A23C'},
        {title: '考核优秀人数', value: toNumber(res.excellentAssessmentCount), color: '#F56C6C'},
        {title: '待排班人数', value: toNumber(res.pendingScheduleCount), color: '#909399'},
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

    <!-- 圆环图区域（带下拉切换） -->
    <div class="pie-chart-area">
      <div class="pie-select-wrapper">
        <el-select
          v-model="activePieIndex"
          size="small"
          @change="handlePieChange"
        >
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
      />
    </div>

    <!-- 柱状图区域（带下拉切换） -->
    <div class="bar-chart-area">
      <div class="bar-select-wrapper">
        <el-select
          v-model="activeBarIndex"
          size="small"
          @change="handleBarChange"
        >
          <el-option
            v-for="(opt, idx) in barOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>
      <Bar
        style="flex: 1 !important;"
        :title="currentBar.title"
        :x-data="currentBar.xData"
        :series-data="currentBar.seriesData"
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

/* 圆环图区域样式 */
.pie-chart-area {
  position: relative;
  flex: 1;
  min-width: 280px;
  height: 100%;
  margin-top: 10px;
}

.pie-select-wrapper {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
}

/* 柱状图区域样式 */
.bar-chart-area {
  position: relative;
  flex: 1.5;
  min-width: 300px;
  height: 100%;
  margin-top: 10px;
}

.bar-select-wrapper {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
}
</style>
