<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Bar from '#/genchuan-components/stats/barClick.vue';
import LineChart from '#/genchuan-components/stats/lineChartClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import {
  getMoralResourceChart,
  getMoralResourceCount,
} from '#/api/genchuan/educationTeaching/studentMgmt/moralEdu/moralResource/data.js';

const loading = ref(true);
const chartData = ref({});
const typeCountData = ref({});

// ========== 饼图配置 ==========
const pieOptions = computed(() => [
  {
    title: '资源类型分布',
    type: 'resourceType',
    getData: () => {
      const typeCount = chartData.value.resourceTypeCount || {};
      return [
        { name: '课程', value: typeCount.courseCount || 0 },
        { name: '图书', value: typeCount.bookCount || 0 },
        { name: '专题包', value: typeCount.packageCount || 0 },
      ];
    },
  },
  {
    title: '学习完成率分布',
    type: 'learnRate',
    getData: () => {
      const typeList = typeCountData.value.typeList || [];
      const learnRateList = typeCountData.value.learnRateList || [];
      return typeList.map((name, idx) => ({ name, value: learnRateList[idx] || 0 }));
    },
  },
]);

const activePieIndex = ref(0);
const currentPieData = computed(() => pieOptions.value[activePieIndex.value]?.getData() || []);
const currentPieTitle = computed(() => pieOptions.value[activePieIndex.value]?.title || '');

const handlePieChange = (index) => {
  activePieIndex.value = index;
};

// ========== 柱状图配置 ==========
const barOptions = computed(() => [
  {
    title: '资源状态分布',
    type: 'status',
    getData: () => {
      const status = chartData.value.statusCount || {};
      return {
        xData: ['未上架', '已上架'],
        seriesData: [
          { name: '资源数量', data: [status.unOnlineCount || 0, status.onlineCount || 0] },
        ],
      };
    },
    yName: '资源数量',
  },
  {
    title: '资源类型分布',
    type: 'resourceTypeCount',
    getData: () => {
      const typeList = typeCountData.value.typeList || [];
      const countList = typeCountData.value.resourceCountList || [];
      return {
        xData: typeList,
        seriesData: [{ name: '资源数量', data: countList }],
      };
    },
    yName: '资源数量',
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
    title: '月度学习人数趋势',
    type: 'learnCount',
    getData: () => {
      const trend = chartData.value.learnTrend || [];
      // 按日期排序
      const sorted = [...trend].sort((a, b) => new Date(a.date) - new Date(b.date));
      return {
        xData: sorted.map(item => item.date),
        seriesData: [{ name: '学习人数', data: sorted.map(item => item.count) }],
      };
    },
    yName: '学习人数',
  },
  {
    title: '月度学习完成率趋势',
    type: 'learnRate',
    getData: () => {
      const trend = chartData.value.rateTrend || [];
      // 按日期排序
      const sorted = [...trend].sort((a, b) => new Date(a.date) - new Date(b.date));
      return {
        xData: sorted.map(item => item.date),
        seriesData: [{ name: '完成率(%)', data: sorted.map(item => item.rate) }],
      };
    },
    yName: '完成率(%)',
  },
]);

const activeLineIndex = ref(0);
const currentLineData = computed(() => lineOptions.value[activeLineIndex.value]?.getData() || { xData: [], seriesData: [] });
const currentLineTitle = computed(() => lineOptions.value[activeLineIndex.value]?.title || '');
const currentLineYName = computed(() => lineOptions.value[activeLineIndex.value]?.yName || '');

const handleLineChange = (index) => {
  activeLineIndex.value = index;
};

// ========== 事件发射 ==========
const emit = defineEmits(['barSelect', 'pieSelect', 'lineSelect']);

const handlePieClick = (item) => {
  const currentType = pieOptions.value[activePieIndex.value]?.type;
  if (currentType === 'resourceType') {
    emit('pieSelect', { field: 'resourceType', value: item.name });
  }
};

const handleBarClick = (name) => {
  const currentType = barOptions.value[activeBarIndex.value]?.type;
  if (currentType === 'status') {
    emit('barSelect', { field: 'status', value: name });
  } else if (currentType === 'resourceTypeCount') {
    emit('barSelect', { field: 'resourceType', value: name });
  }
};

const handleLineClick = (date) => {
  emit('lineSelect', { field: 'month', value: date });
};

// ========== 加载数据 ==========
const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, countRes] = await Promise.allSettled([
      getMoralResourceChart({}),
      getMoralResourceCount({}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      console.warn('图表总览接口失败，使用模拟数据');
      chartData.value = {
        statusCount: { unOnlineCount: 3, onlineCount: 17 },
        resourceTypeCount: { courseCount: 10, bookCount: 6, packageCount: 4 },
        learnTrend: [
          { date: '2025-07', count: 1 },
          { date: '2025-08', count: 8 },
          { date: '2025-09', count: 1 },
        ],
        rateTrend: [
          { date: '2025-07', rate: 58.2 },
          { date: '2025-08', rate: 81.53 },
          { date: '2025-09', rate: 65.3 },
        ],
      };
    }
    if (countRes.status === 'fulfilled') {
      typeCountData.value = countRes.value;
    } else {
      console.warn('资源数量统计接口失败，使用模拟数据');
      typeCountData.value = {
        typeList: ['课程', '图书', '专题包'],
        resourceCountList: [10, 6, 4],
        learnRateList: [85.5, 78.0, 90.0],
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
    <!-- 饼图区域 -->
    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activePieIndex" size="small" @change="handlePieChange">
          <el-option v-for="(opt, idx) in pieOptions" :key="idx" :label="opt.title" :value="idx" />
        </el-select>
      </div>
      <Pie :title-text="currentPieTitle" :data="currentPieData" @pie-click="handlePieClick" />
    </div>

    <!-- 柱状图区域 -->
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

    <!-- 折线图区域 -->
    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activeLineIndex" size="small" @change="handleLineChange">
          <el-option v-for="(opt, idx) in lineOptions" :key="idx" :label="opt.title" :value="idx" />
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
