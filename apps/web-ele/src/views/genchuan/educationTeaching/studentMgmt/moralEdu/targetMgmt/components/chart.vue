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

// 默认时间范围参数（毫秒时间戳）
const defaultStartTime = 1704067200000;
const defaultEndTime = 1798732799000;

const loading = ref(true);
const overviewData = ref({});
const indexData = ref({});

// 卡片数据
const cardList = computed(() => {
  const total = indexData.value.totalTargetCount || 0;
  const enabled = indexData.value.enabledTargetCount || 0;
  const warned = indexData.value.warnTargetCount || 0;
  const avg = indexData.value.avgScore || 0;
  return [
    {title: '指标总数', value: total, color: '#409EFF', status: 'total'},
    {title: '启用指标数', value: enabled, color: '#67C23A', status: 'enabled'},
    {title: '预警指标数', value: warned, color: '#F56C6C', status: 'warned'},
    {title: '平均得分', value: avg, color: '#E6A23C', status: 'avg', suffix: '分'},
  ];
});

// 柱状图配置（适配后端 evaluatorTypeCount 和 scoreTypeCount）
const barOptions = computed(() => [
  {
    title: '评价人类型分布',
    type: 'evaluatorType',
    getData: () => {
      const data = overviewData.value.evaluatorTypeCount || {};
      // 后端键名：teacher, parent, leader
      const xData = ['教职工', '家长', '领导'];
      const seriesData = [
        {name: '指标数量', data: [data.teacher || 0, data.parent || 0, data.leader || 0]}
      ];
      return {xData, seriesData};
    }
  },
  {
    title: '计分方式分布',
    type: 'scoreType',
    getData: () => {
      const data = overviewData.value.scoreTypeCount || {};
      // 后端键名已经是中文："累计赋分", "接口赋分"
      const xData = ['累计赋分', '接口赋分'];
      const seriesData = [
        {name: '指标数量', data: [data['累计赋分'] || 0, data['接口赋分'] || 0]}
      ];
      return {xData, seriesData};
    }
  }
]);

const activeBarIndex = ref(0);
const currentBarData = computed(() => barOptions.value[activeBarIndex.value]?.getData() || {
  xData: [],
  seriesData: []
});
const currentBarTitle = computed(() => barOptions.value[activeBarIndex.value]?.title || '');

const handleBarChange = (index) => {
  activeBarIndex.value = index;
};

// 饼图配置（适配 statusCount 和 scoreDistribution）
const pieOptions = computed(() => [
  {
    title: '状态分布',
    type: 'status',
    getData: () => {
      const status = overviewData.value.statusCount || {disable: 0, enable: 0};
      return [
        {name: '未启用', value: status.disable || 0},
        {name: '已启用', value: status.enable || 0}
      ];
    }
  },
  {
    title: '指标得分分布',
    type: 'scoreDistribution',
    getData: () => {
      const distributionArray = overviewData.value.scoreDistribution || [];
      if (!distributionArray.length) return [];
      const distObj = distributionArray[0];
      // 将对象转换为 { name: range, value: count } 数组
      return Object.entries(distObj).map(([range, count]) => ({
        name: range,
        value: count
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

// 事件发射
const emit = defineEmits(['barSelect', 'cardSelect', 'pieSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClickWrapper = (name) => {
  const currentType = barOptions.value[activeBarIndex.value]?.type;
  if (currentType === 'evaluatorType') {
    // 将中文名称映射回英文键名？根据实际筛选需求决定
    let value = name;
    if (name === '教职工') value = 'teacher';
    if (name === '家长') value = 'parent';
    if (name === '领导') value = 'leader';
    emit('barSelect', {field: 'evaluatorType', value});
  } else if (currentType === 'scoreType') {
    emit('barSelect', {field: 'scoreType', value: name});
  }
};

const handlePieClickWrapper = (item) => {
  const currentType = pieOptions.value[activePieIndex.value]?.type;
  if (currentType === 'status') {
    let status = '';
    if (item.name === '未启用') status = 'disable';
    if (item.name === '已启用') status = 'enable';
    if (status) emit('cardSelect', status);
  } else if (currentType === 'scoreDistribution') {
    emit('pieSelect', {range: item.name, count: item.value});
  }
};

// 加载数据（传递 startTime 和 endTime）
const loadData = async () => {
  loading.value = true;
  try {
    const chartParams = {
      startTime: defaultStartTime,
      endTime: defaultEndTime
    };
    const [chartRes, indexRes] = await Promise.allSettled([
      getTargetMgmtChart(chartParams),
      getTargetIndex()
    ]);
    if (chartRes.status === 'fulfilled') {
      overviewData.value = chartRes.value;
    } else {
      console.warn('分布接口失败，使用模拟数据');
      overviewData.value = {
        statusCount: {disable: 4, enable: 6},
        evaluatorTypeCount: {teacher: 5, parent: 2, leader: 3},
        scoreTypeCount: {"累计赋分": 8, "接口赋分": 2},
        scoreDistribution: [{"0-20": 1, "20-40": 2, "40-60": 3, "60-80": 2, "80-100": 2}]
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
    overviewData.value = {
      statusCount: {disable: 4, enable: 6},
      evaluatorTypeCount: {teacher: 5, parent: 2, leader: 3},
      scoreTypeCount: {"累计赋分": 8, "接口赋分": 2},
      scoreDistribution: [{"0-20": 1, "20-40": 2, "40-60": 3, "60-80": 2, "80-100": 2}]
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

  .bar-chart-area,
  .pie-chart-area {
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
