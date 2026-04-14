<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import {
  getTargetMgmtChart,
  getTargetIndex,
} from '#/api/genchuan/educationTeaching/studentMgmt/moralEdu/targetMgmt/data.js';

const loading = ref(true);
const overviewData = ref({});
const indexData = ref({});

// ========== 卡片数据 ==========
const cardList = computed(() => {
  const total = indexData.value.totalTargetCount || 0;
  const enabled = indexData.value.enabledTargetCount || 0;
  const warned = indexData.value.warnTargetCount || 0;
  const avg = indexData.value.avgScore || 0;
  return [
    { title: '指标总数', value: total, color: '#409EFF', status: 'total' },
    { title: '启用指标数', value: enabled, color: '#67C23A', status: 'enabled' },
    { title: '预警指标数', value: warned, color: '#F56C6C', status: 'warned' },
    { title: '平均得分', value: avg, color: '#E6A23C', status: 'avg', suffix: '分' },
  ];
});

// ========== 柱状图配置（带下拉切换） ==========
const barOptions = computed(() => [
  {
    title: '评价人类型分布',
    type: 'evaluatorType',
    getData: () => {
      const map = { teacherCount: '教职工', parentCount: '家长', leaderCount: '领导' };
      const data = overviewData.value.evaluatorTypeCount || {};
      return {
        xData: Object.keys(map).map(key => map[key]),
        seriesData: [{ name: '指标数量', data: Object.keys(map).map(key => data[key] || 0) }]
      };
    }
  },
  {
    title: '计分方式分布',
    type: 'scoreType',
    getData: () => {
      const map = { accumulateCount: '累计赋分', apiCount: '接口赋分' };
      const data = overviewData.value.scoreTypeCount || {};
      return {
        xData: Object.keys(map).map(key => map[key]),
        seriesData: [{ name: '指标数量', data: Object.keys(map).map(key => data[key] || 0) }]
      };
    }
  }
]);

const activeBarIndex = ref(0);
const currentBarData = computed(() => barOptions.value[activeBarIndex.value]?.getData() || { xData: [], seriesData: [] });
const currentBarTitle = computed(() => barOptions.value[activeBarIndex.value]?.title || '');

const handleBarChange = (index) => {
  activeBarIndex.value = index;
};

// ========== 饼图配置（带下拉切换） ==========
const pieOptions = computed(() => [
  {
    title: '状态分布',
    type: 'status',
    getData: () => {
      const status = overviewData.value.statusCount || { unEnableCount: 0, enabledCount: 0 };
      return [
        { name: '未启用', value: status.unEnableCount || 0 },
        { name: '已启用', value: status.enabledCount || 0 }
      ];
    }
  },
  {
    title: '指标得分分布',
    type: 'scoreDistribution',
    getData: () => {
      const distribution = overviewData.value.scoreDistribution || [];
      return distribution.map(item => ({
        name: item.range,
        value: item.count
      }));
    }
  }
]);

const activePieIndex = ref(0);
const currentPieData = computed(() => pieOptions.value[activePieIndex.value]?.getData() || []);
const currentPieTitle = computed(() => pieOptions.value[activePieIndex.value]?.title || '');

const handlePieChange = (index) => {
  activePieIndex.value = index;
};

// ========== 事件发射 ==========
const emit = defineEmits(['barSelect', 'cardSelect', 'pieSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClickWrapper = (name) => {
  const currentType = barOptions.value[activeBarIndex.value]?.type;
  if (currentType === 'evaluatorType') {
    emit('barSelect', { field: 'evaluatorType', value: name });
  } else if (currentType === 'scoreType') {
    emit('barSelect', { field: 'scoreType', value: name });
  }
};

const handlePieClickWrapper = (item) => {
  const currentType = pieOptions.value[activePieIndex.value]?.type;
  if (currentType === 'status') {
    // 状态分布点击：传递状态筛选
    let status = '';
    if (item.name === '未启用') status = '未启用';
    if (item.name === '已启用') status = '已启用';
    if (status) emit('cardSelect', status === '未启用' ? 'unEnabled' : 'enabled');
  } else if (currentType === 'scoreDistribution') {
    // 得分分布点击：传递区间（可选，需求未要求，但保留事件）
    emit('pieSelect', { range: item.name, count: item.value });
  }
};

// ========== 加载数据 ==========
const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, indexRes] = await Promise.allSettled([
      getTargetMgmtChart({}),
      getTargetIndex()
    ]);
    if (chartRes.status === 'fulfilled') {
      overviewData.value = chartRes.value;
    } else {
      console.warn('分布接口失败，使用模拟数据');
      overviewData.value = {
        statusCount: { unEnableCount: 2, enabledCount: 8 },
        evaluatorTypeCount: { teacherCount: 5, parentCount: 2, leaderCount: 3 },
        scoreTypeCount: { accumulateCount: 6, apiCount: 4 },
        scoreDistribution: [
          { range: '0-20', count: 1 },
          { range: '20-40', count: 2 },
          { range: '40-60', count: 3 },
          { range: '60-80', count: 2 },
          { range: '80-100', count: 2 }
        ]
      };
    }
    if (indexRes.status === 'fulfilled') {
      indexData.value = indexRes.value;
    } else {
      console.warn('核心指标接口失败，使用模拟数据');
      indexData.value = {
        totalTargetCount: 10,
        enabledTargetCount: 8,
        warnTargetCount: 1,
        avgScore: 78.5
      };
    }
  } catch (error) {
    console.error('加载图表数据失败', error);
    // 全部使用模拟数据
    overviewData.value = {
      statusCount: { unEnableCount: 2, enabledCount: 8 },
      evaluatorTypeCount: { teacherCount: 5, parentCount: 2, leaderCount: 3 },
      scoreTypeCount: { accumulateCount: 6, apiCount: 4 },
      scoreDistribution: [
        { range: '0-20', count: 1 }, { range: '20-40', count: 2 },
        { range: '40-60', count: 3 }, { range: '60-80', count: 2 },
        { range: '80-100', count: 2 }
      ]
    };
    indexData.value = {
      totalTargetCount: 10,
      enabledTargetCount: 8,
      warnTargetCount: 1,
      avgScore: 78.5
    };
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
    <!-- 左侧卡片区 -->
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <!-- 柱状图区域（带下拉选择器） -->
    <div class="bar-chart-area">
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
        style="flex: 1 !important;"
        :title="currentBarTitle"
        :x-data="currentBarData.xData"
        :series-data="currentBarData.seriesData"
        y-name="指标数量"
        @bar-click="handleBarClickWrapper"
      />
    </div>

    <!-- 饼图区域（带下拉选择器） -->
    <div class="pie-chart-area">
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
        style="flex: 1 !important;"
        :title-text="currentPieTitle"
        :data="currentPieData"
        @pie-click="handlePieClickWrapper"
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
    min-width: 280px;
    max-width: 320px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }

  // 柱状图与饼图容器统一样式
  .bar-chart-area,
  .pie-chart-area {
    position: relative;
    flex: 1;
    min-width: 280px;
    height: 100%;
  }

  // 下拉选择器绝对定位（右上角）
  .chart-select-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }
}
</style>
