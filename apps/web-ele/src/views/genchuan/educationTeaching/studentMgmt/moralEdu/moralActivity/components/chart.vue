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
        seriesData: [{ name: '活动数量', data: activityCountList }]
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
        seriesData: [{ name: '参与人数', data: joinCountList }]
      };
    },
    yName: '参与人数',
  },
]);

const activeBarIndex = ref(0);
const currentBarData = computed(() => barOptions.value[activeBarIndex.value]?.getData() || { xData: [], seriesData: [] });
const currentBarTitle = computed(() => barOptions.value[activeBarIndex.value]?.title || '');
const currentYName = computed(() => barOptions.value[activeBarIndex.value]?.yName || '');

const handleBarChange = (index) => {
  activeBarIndex.value = index;
};

// ========== 折线图配置 ==========
const lineOptions = computed(() => [
  {
    title: '月度活动数量趋势',
    type: 'monthCount',
    getData: () => {
      const monthTrend = trendData.value.monthTrend || [];
      return {
        xData: monthTrend.map(item => item.month),
        seriesData: [{ name: '活动数量', data: monthTrend.map(item => item.count) }]
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
        xData: joinTrend.map(item => item.month),
        seriesData: [{ name: '参与人数', data: joinTrend.map(item => item.count) }]
      };
    },
    yName: '参与人数',
  },
]);

const activeLineIndex = ref(0);
const currentLineData = computed(() => lineOptions.value[activeLineIndex.value]?.getData() || { xData: [], seriesData: [] });
const currentLineTitle = computed(() => lineOptions.value[activeLineIndex.value]?.title || '');
const currentLineYName = computed(() => lineOptions.value[activeLineIndex.value]?.yName || '');

const handleLineChange = (index) => {
  activeLineIndex.value = index;
};

// ========== 饼图配置（状态分布、类型分布） ==========
const pieOptions = computed(() => [
  {
    title: '活动状态分布',
    type: 'status',
    getData: () => {
      const status = overviewData.value.statusCount || { unPublishCount: 0, processingCount: 0, finishedCount: 0 };
      return [
        { name: '未发布', value: status.unPublishCount || 0 },
        { name: '进行中', value: status.processingCount || 0 },
        { name: '已结束', value: status.finishedCount || 0 },
      ];
    },
  },
  {
    title: '活动类型分布',
    type: 'activityType',
    getData: () => {
      const typeCount = overviewData.value.activityTypeCount || { partyCount: 0, volunteerCount: 0, otherCount: 0 };
      return [
        { name: '党团活动', value: typeCount.partyCount || 0 },
        { name: '志愿活动', value: typeCount.volunteerCount || 0 },
        { name: '其他', value: typeCount.otherCount || 0 },
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
  emit('barSelect', { field: 'activityType', value: typeName });
};

// 折线图点击：筛选对应月份的活动记录
const handleLineClick = (month) => {
  emit('barSelect', { field: 'month', value: month });
};

// 饼图点击：根据当前饼图类型发射筛选事件
const handlePieClick = (item) => {
  const currentType = pieOptions.value[activePieIndex.value]?.type;
  if (currentType === 'status') {
    emit('barSelect', { field: 'status', value: item.name });
  } else if (currentType === 'activityType') {
    emit('barSelect', { field: 'activityType', value: item.name });
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
      overviewData.value = chartRes.value;
      trendData.value = chartRes.value; // 复用返回的 trend 数据
    } else {
      console.warn('图表总览接口失败，使用模拟数据');
      overviewData.value = {
        statusCount: { unPublishCount: 2, processingCount: 3, finishedCount: 10 },
        activityTypeCount: { partyCount: 5, volunteerCount: 7, otherCount: 3 },
        monthTrend: [
          { month: '2025-01', count: 2 },
          { month: '2025-02', count: 4 },
          { month: '2025-03', count: 9 },
        ],
        joinTrend: [
          { month: '2025-01', count: 80 },
          { month: '2025-02', count: 150 },
          { month: '2025-03', count: 300 },
        ],
      };
      trendData.value = overviewData.value;
    }
  } catch (error) {
    console.error('加载图表数据失败', error);
    // 全部使用模拟数据
    chartData.value = {
      typeList: ['党团活动', '志愿活动', '其他'],
      activityCountList: [5, 7, 3],
      joinCountList: [200, 280, 50],
    };
    overviewData.value = {
      statusCount: { unPublishCount: 2, processingCount: 3, finishedCount: 10 },
      activityTypeCount: { partyCount: 5, volunteerCount: 7, otherCount: 3 },
      monthTrend: [
        { month: '2025-01', count: 2 },
        { month: '2025-02', count: 4 },
        { month: '2025-03', count: 9 },
      ],
      joinTrend: [
        { month: '2025-01', count: 80 },
        { month: '2025-02', count: 150 },
        { month: '2025-03', count: 300 },
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
