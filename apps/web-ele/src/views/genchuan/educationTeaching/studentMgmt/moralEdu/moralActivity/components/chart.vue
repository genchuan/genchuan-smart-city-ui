<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Bar from '#/genchuan-components/stats/barClick.vue';
import LineChart from '#/genchuan-components/stats/lineChartClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import {
  getMoralActivityCount,
  getMoralActivityChart,
} from '#/api/genchuan/educationTeaching/studentMgmt/moralEdu/moralActivity/data.js';

const loading = ref(true);
const chartData = ref({});       // 柱状图数据（活动类型数量/参与人数）
const trendData = ref({});       // 折线图数据（月度趋势）
const overviewData = ref({});    // 饼图数据（状态分布、类型分布）

// ========== 柱状图配置 ==========
const barOptions = computed(() => [
  {
    title: '各类型活动数量',
    type: 'activityCount',
    getData: () => {
      const typeList = chartData.value.typeList || [];
      const activityCountList = chartData.value.activityCountList || [];
      return {
        xData: typeList,
        seriesData: [{name: '活动数量', data: activityCountList}]
      };
    },
    yName: '活动数量',
  },
  {
    title: '各类型参与人数',
    type: 'joinCount',
    getData: () => {
      const typeList = chartData.value.typeList || [];
      const joinCountList = chartData.value.joinCountList || [];
      return {
        xData: typeList,
        seriesData: [{name: '参与人数', data: joinCountList}]
      };
    },
    yName: '参与人数',
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

// ========== 折线图配置（适配后端字段 date, totalCount） ==========
const lineOptions = computed(() => [
  {
    title: '月度活动数量趋势',
    type: 'monthCount',
    getData: () => {
      const monthTrend = trendData.value.monthTrend || [];
      return {
        xData: monthTrend.map(item => item.date),
        seriesData: [{name: '活动数量', data: monthTrend.map(item => item.totalCount)}]
      };
    },
    yName: '活动数量',
  },
  {
    title: '月度参与人数趋势',
    type: 'joinCount',
    getData: () => {
      const joinTrend = trendData.value.joinTrend || [];
      return {
        xData: joinTrend.map(item => item.date),
        seriesData: [{name: '参与人数', data: joinTrend.map(item => item.totalCount)}]
      };
    },
    yName: '参与人数',
  },
]);

const activeLineIndex = ref(0);
const currentLineData = computed(() => lineOptions.value[activeLineIndex.value]?.getData() || {
  xData: [],
  seriesData: []
});
const currentLineTitle = computed(() => lineOptions.value[activeLineIndex.value]?.title || '');
const currentLineYName = computed(() => lineOptions.value[activeLineIndex.value]?.yName || '');

const handleLineChange = (index) => {
  activeLineIndex.value = index;
};

// ========== 饼图配置（适配后端 statusCount 和 activityTypeCount 的键名） ==========
const pieOptions = computed(() => [
  {
    title: '活动状态分布',
    type: 'status',
    getData: () => {
      const status = overviewData.value.statusCount || {ongoing: 0, ended: 0, unpublished: 0};
      return [
        {name: '未发布', value: status.unpublished || 0},
        {name: '进行中', value: status.ongoing || 0},
        {name: '已结束', value: status.ended || 0},
      ];
    },
  },
  {
    title: '活动类型分布',
    type: 'activityType',
    getData: () => {
      const typeCount = overviewData.value.activityTypeCount || {
        party_league: 0,
        volunteer: 0,
        other: 0
      };
      return [
        {name: '党团活动', value: typeCount.party_league || 0},
        {name: '志愿活动', value: typeCount.volunteer || 0},
        {name: '其他', value: typeCount.other || 0},
      ];
    },
  },
]);

const activePieIndex = ref(0);
const currentPieData = computed(() => pieOptions.value[activePieIndex.value]?.getData() || []);
const currentPieTitle = computed(() => pieOptions.value[activePieIndex.value]?.title || '');

const handlePieChange = (index) => {
  activePieIndex.value = index;
};

// ========== 事件发射 ==========
const emit = defineEmits(['barSelect']);

// 柱状图点击：筛选对应类型的活动记录
const handleBarClick = (typeName) => {
  emit('barSelect', {field: 'activityType', value: typeName});
};

// 折线图点击：筛选对应月份的活动记录
const handleLineClick = (month) => {
  emit('barSelect', {field: 'month', value: month});
};

// 饼图点击：根据当前饼图类型发射筛选事件
const handlePieClick = (item) => {
  const currentType = pieOptions.value[activePieIndex.value]?.type;
  if (currentType === 'status') {
    emit('barSelect', {field: 'status', value: item.name});
  } else if (currentType === 'activityType') {
    emit('barSelect', {field: 'activityType', value: item.name});
  }
};

// ========== 加载数据 ==========
const loadData = async () => {
  loading.value = true;
  try {
    const [countRes, chartRes] = await Promise.allSettled([
      getMoralActivityCount({}),
      getMoralActivityChart({})
    ]);
    if (countRes.status === 'fulfilled') {
      chartData.value = countRes.value;
    } else {
      console.warn('活动数量统计接口失败，使用模拟数据');
      chartData.value = {
        typeList: ['党团活动', '志愿活动', '其他'],
        activityCountList: [5, 7, 3],
        joinCountList: [200, 280, 50],
      };
    }
    if (chartRes.status === 'fulfilled') {
      // 直接使用后端返回的数据结构，字段已适配
      overviewData.value = chartRes.value;
      trendData.value = chartRes.value; // 复用返回的 trend 数据
    } else {
      console.warn('图表总览接口失败，使用模拟数据');
      // 模拟数据字段与后端保持一致
      overviewData.value = {
        statusCount: {ongoing: 3, ended: 5, unpublished: 2},
        activityTypeCount: {party_league: 4, volunteer: 3, other: 3},
        monthTrend: [
          {date: '2025-03', totalCount: 2},
          {date: '2025-04', totalCount: 1},
          {date: '2025-06', totalCount: 1},
        ],
        joinTrend: [
          {date: '2025-03', totalCount: 1},
          {date: '2025-04', totalCount: 1},
          {date: '2025-05', totalCount: 1},
        ],
      };
      trendData.value = overviewData.value;
    }
  } catch (error) {
    console.error('加载图表数据失败', error);
    // 全部使用模拟数据（后端字段格式）
    chartData.value = {
      typeList: ['党团活动', '志愿活动', '其他'],
      activityCountList: [5, 7, 3],
      joinCountList: [200, 280, 50],
    };
    overviewData.value = {
      statusCount: {ongoing: 3, ended: 5, unpublished: 2},
      activityTypeCount: {party_league: 4, volunteer: 3, other: 3},
      monthTrend: [
        {date: '2025-03', totalCount: 2},
        {date: '2025-04', totalCount: 1},
        {date: '2025-06', totalCount: 1},
      ],
      joinTrend: [
        {date: '2025-03', totalCount: 1},
        {date: '2025-04', totalCount: 1},
        {date: '2025-05', totalCount: 1},
      ],
    };
    trendData.value = overviewData.value;
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
    <!-- 饼图区域 -->
    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activePieIndex" size="small" @change="handlePieChange">
          <el-option
            v-for="(opt, idx) in pieOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>
      <Pie
        :title-text="currentPieTitle"
        :data="currentPieData"
        @pie-click="handlePieClick"
      />
    </div>

    <!-- 柱状图区域 -->
    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activeBarIndex" size="small" @change="handleBarChange">
          <el-option
            v-for="(opt, idx) in barOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
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

    <!-- 折线图区域 -->
    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activeLineIndex" size="small" @change="handleLineChange">
          <el-option
            v-for="(opt, idx) in lineOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>
      <LineChart
        :title="currentLineTitle"
        :x-data="currentLineData.xData"
        :series-data="currentLineData.seriesData"
        :y-name="currentLineYName"
        @line-click="handleLineClick"
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
