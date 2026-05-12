<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElSelect, ElOption, ElDatePicker } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import {
  getCommunicateMgmtChart,
  getCommunicateMgmtInteractIndex,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/homeSchool/communicateMgmt/data.js';

const loading = ref(true);
const chartData = ref({});          // 卡片数据
const interactData = ref({});       // 柱状图数据

// 时间范围选择器绑定的值（数组格式 [startDate, endDate]）
const timeRange = ref([]);

// 获取默认时间范围（最近30天，结束时间为当天）
const getDefaultTimeRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  return [start, end];
};

// 格式化单个日期时间为后端要求的格式（带 T 分隔，如 "2023-01-01T00:00:00"）
// isEnd: 是否为结束时间（结束时间用 23:59:59，起始用 00:00:00）
const formatDateTime = (date, isEnd = false) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const time = isEnd ? '23:59:59' : '00:00:00';
  return `${year}-${month}-${day}T${time}`;
};

// 生成 timeRange 字符串（格式："起始时间,结束时间"）
const getTimeRangeParam = () => {
  if (timeRange.value && timeRange.value.length === 2) {
    const startStr = formatDateTime(timeRange.value[0], false);
    const endStr = formatDateTime(timeRange.value[1], true);
    return `${startStr},${endStr}`;
  }
  const [defaultStart, defaultEnd] = getDefaultTimeRange();
  return `${formatDateTime(defaultStart, false)},${formatDateTime(defaultEnd, true)}`;
};

// 日期范围变化时重新加载数据
const handleDateRangeChange = () => {
  loadData();
};

// ========== 卡片数据 ==========
const cardList = computed(() => {
  const totalMsg = chartData.value.totalMsgCount || 0;
  const published = chartData.value.publishedMsgCount || 0;
  const unpublished = chartData.value.unpublishedMsgCount || 0;
  const totalReply = chartData.value.totalReplyCount || 0;
  // 后端返回的 avgInteractRate 已经是百分比数值（如 76.75），直接显示并添加 % 后缀
  const avgRate = chartData.value.avgInteractRate || 0;
  return [
    {title: '信息推送次数', value: totalMsg, color: '#409EFF', status: 'total'},
    {title: '家长反馈次数', value: totalReply, color: '#67C23A', status: 'reply'},
    {title: '互动率', value: avgRate.toFixed(1), color: '#E6A23C', suffix: '%', status: 'rate'},
  ];
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
        seriesData: [{name: '数量', data: data.map(item => item.value)}],
      };
    },
    yName: '数量',
  },
  {
    title: '各班级互动率',
    type: 'classRate',
    getData: () => {
      const data = interactData.value.classInteractRate || [];
      // 互动率后端可能返回小数（如 0.95）或百分比数（95），统一转换为百分比展示
      return {
        xData: data.map(item => item.name),
        seriesData: [{
          name: '互动率', data: data.map(item => {
            const val = item.value;
            return val <= 1 ? val * 100 : val;
          })
        }],
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
        seriesData: [{name: '反馈数', data: data.map(item => item.value)}],
      };
    },
    yName: '反馈数',
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

// ========== 事件发射 ==========
const emit = defineEmits(['cardSelect', 'barSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClick = (name) => {
  const currentType = barOptions.value[activeBarIndex.value]?.type;
  if (currentType === 'msgType') {
    emit('barSelect', {field: 'msgType', value: name});
  } else if (currentType === 'classRate') {
    emit('barSelect', {field: 'className', value: name});
  }
  // 反馈时间分布不做钻取
};

// ========== 加载数据 ==========
const loadData = async () => {
  loading.value = true;
  try {
    const timeRangeParam = getTimeRangeParam();
    const [chartRes, interactRes] = await Promise.allSettled([
      getCommunicateMgmtChart({timeRange: timeRangeParam}),
      getCommunicateMgmtInteractIndex({timeRange: timeRangeParam}),
    ]);
    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      console.warn('看板接口失败，使用模拟数据', chartRes.reason);
      chartData.value = {
        totalMsgCount: 42,
        publishedMsgCount: 38,
        unpublishedMsgCount: 4,
        totalReplyCount: 126,
        avgInteractRate: 0.89,
        recentWeekInteractTrend: [
          {date: '2025-03-25', count: 15},
          {date: '2025-03-26', count: 22},
          {date: '2025-03-27', count: 18},
          {date: '2025-03-28', count: 16},
          {date: '2025-03-29', count: 12},
          {date: '2025-03-30', count: 9},
          {date: '2025-03-31', count: 11},
        ],
      };
    }
    if (interactRes.status === 'fulfilled') {
      interactData.value = interactRes.value;
    } else {
      console.warn('核心指标接口失败，使用模拟数据', interactRes.reason);
      interactData.value = {
        msgTypeCount: [
          {name: '通知公告', value: 22},
          {name: '成绩反馈', value: 10},
          {name: '活动通知', value: 6},
          {name: '其他', value: 4},
        ],
        classInteractRate: [
          {name: '初一1班', value: 0.95},
          {name: '初一2班', value: 0.92},
          {name: '初二1班', value: 0.88},
          {name: '初二2班', value: 0.86},
          {name: '初三1班', value: 0.85},
          {name: '初三2班', value: 0.83},
        ],
        replyTimeDistribution: [
          {name: '1小时内', value: 68},
          {name: '1-3小时', value: 32},
          {name: '3-12小时', value: 18},
          {name: '12小时以上', value: 8},
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
  timeRange.value = getDefaultTimeRange();
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

    <div class="chart-area bar-chart-container">
      <!-- 柱状图切换下拉框 -->
      <div class="chart-select-wrapper">
        <el-select v-model="activeBarIndex" size="small" @change="handleBarChange">
          <el-option v-for="(opt, idx) in barOptions" :key="idx" :label="opt.title" :value="idx"/>
        </el-select>
      </div>

      <!-- 时间范围选择器（紧凑样式，位于右上角） -->
      <div class="date-range-wrapper">
        <el-date-picker
          v-model="timeRange"
          type="daterange"
          range-separator="-"
          start-placeholder="起始"
          end-placeholder="结束"
          size="small"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :shortcuts="[
            { text: '近7天', value: () => { const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 7); return [start, end]; } },
            { text: '近30天', value: () => { const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 30); return [start, end]; } },
            { text: '近90天', value: () => { const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 90); return [start, end]; } }
          ]"
          @change="handleDateRangeChange"
        />
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

  /* 柱状图容器特殊样式，用于绝对定位日期选择器 */
  .bar-chart-container {
    position: relative;
  }

  .date-range-wrapper {
    position: absolute;
    top: 8px;
    left: 10px;
    z-index: 10;
  }

  /* 紧凑的时间选择器样式 */
  :deep(.el-date-editor) {
    --el-date-editor-width: 240px;

    .el-range__icon {
      margin-right: 2px;
    }

    .el-range-separator {
      padding: 0 4px;
    }

    .el-range__close-icon {
      margin-left: 2px;
    }
  }
}
</style>
