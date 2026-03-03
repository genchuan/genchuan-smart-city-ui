<script setup>
import { reactive, watch } from 'vue';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';
import LineChart from '#/components/stats/lineChart.vue';

// 导入所有需要的接口
import {
  getGarbageCollectionCardPending,
  getGarbageCollectionPendingByArea,
  getGarbageCollectionPendingByGarbageType,
  getGarbageCollectionTimePeriodPendingColumn,
  getGarbageCollectionCardExecuting,
  getGarbageCollectionTrendDailyVolume,
  getGarbageCollectionCardCompleted,
  getGarbageCollectionCompletionRateTrend,
  getGarbageCollectionVolumeComparison,
  getGarbageCollectionCompletedVolumeByGarbageType,
  getGarbageCollectionCompletedVolumeByArea,
  getGarbageAbnormalCard,
  getGarbageAbnormalTypeCircle,
  getGarbageAbnormalAreaCircle,
  getGarbageAbnormalColumn,
  getGarbageAbnormalReviewCard,
  getGarbageAbnormalReviewResultCircle,
  getGarbageAbnormalAvgHandleColumn,
  getGarbageAbnormalTypeCircleForReview,
} from '#/api/genchuan/industry/urbanmanagement/environmentalSanitation/sanitationSceneMgmt/garbageCollection/data';

const props = defineProps({
  activeName: { type: String, required: true },
  dataList: { type: Array, required: true }
});

// 格式化日期时间为 YYYY-MM-DD HH:MM:SS
const formatDateTime = (date, type) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const time = type === 'start' ? '00:00:00' : '23:59:59';
  return `${year}-${month}-${day} ${time}`;
};

// 获取默认时间范围（最近7天）
const getDefaultTimeRange = () => {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  return {
    startTime: formatDateTime(sevenDaysAgo, 'start'),
    endTime: formatDateTime(today, 'end')
  };
};

// ---------- 异常待处置专用状态 ----------
const abnormalState = reactive({
  card: { toHandleTotal: 0, highPriorityTotal: 0, timeoutTotal: 0 },
  pieType: [],
  pieArea: [],
  column: { x: [], series: [] }
});

const fetchAbnormalData = async () => {
  try {
    const [cardRes, pieTypeRes, pieAreaRes, columnRes] = await Promise.all([
      getGarbageAbnormalCard(),
      getGarbageAbnormalTypeCircle(),
      getGarbageAbnormalAreaCircle(),
      getGarbageAbnormalColumn()
    ]);
    if (cardRes) {
      abnormalState.card = {
        toHandleTotal: cardRes.toHandleTotal || 0,
        highPriorityTotal: cardRes.highPriorityTotal || 0,
        timeoutTotal: cardRes.timeoutTotal || 0
      };
    }
    if (Array.isArray(pieTypeRes)) {
      abnormalState.pieType = pieTypeRes.map(item => ({ name: item.name, value: Number(item.value) || 0 }));
    }
    if (Array.isArray(pieAreaRes)) {
      abnormalState.pieArea = pieAreaRes.map(item => ({ name: item.name, value: Number(item.value) || 0 }));
    }
    if (Array.isArray(columnRes)) {
      abnormalState.column.x = columnRes.map(item => item.name);
      abnormalState.column.series = columnRes.map(item => item.value);
    }
  } catch (error) {
    console.error('获取异常待处置数据失败:', error);
  }
};

// ---------- 处置待复核专用状态 ----------
const reviewState = reactive({
  card: { reviewTotal: 0, passedCount: 0, returnCount: 0 },
  pieReviewResult: [],
  pieAbnormalType: [],
  columnAvgHandle: { x: [], series: [] }
});

const fetchReviewData = async () => {
  try {
    const [cardRes, pieReviewRes, pieTypeRes, columnRes] = await Promise.all([
      getGarbageAbnormalReviewCard(),
      getGarbageAbnormalReviewResultCircle(),
      getGarbageAbnormalTypeCircleForReview(),
      getGarbageAbnormalAvgHandleColumn()
    ]);

    if (cardRes) {
      reviewState.card = {
        reviewTotal: cardRes.reviewTotal || 0,
        passedCount: cardRes.passedCount || 0,
        returnCount: cardRes.returnCount || 0
      };
    }

    if (Array.isArray(pieReviewRes)) {
      reviewState.pieReviewResult = pieReviewRes.map(item => ({ name: item.name, value: Number(item.value) || 0 }));
    }

    if (Array.isArray(pieTypeRes)) {
      reviewState.pieAbnormalType = pieTypeRes.map(item => ({ name: item.name, value: Number(item.value) || 0 }));
    }

    if (Array.isArray(columnRes)) {
      reviewState.columnAvgHandle.x = columnRes.map(item => item.name);
      reviewState.columnAvgHandle.series = columnRes.map(item => item.avgHandleHours || 0);
    }
  } catch (error) {
    console.error('获取处置待复核数据失败:', error);
  }
};

// ---------- 计划待执行专用状态 ----------
const pendingState = reactive({
  card: { totalPending: 0, areaCount: 0, typeCount: 0 },
  pieArea: [],
  pieType: [],
  column: { x: [], series: [] }
});

const fetchPendingData = async () => {
  try {
    const [cardRes, areaPieRes, typePieRes, columnRes] = await Promise.all([
      getGarbageCollectionCardPending(),
      getGarbageCollectionPendingByArea(),
      getGarbageCollectionPendingByGarbageType(),
      getGarbageCollectionTimePeriodPendingColumn()
    ]);

    if (cardRes) {
      pendingState.card = {
        totalPending: cardRes.totalPendingCount || 0,
        areaCount: Array.isArray(cardRes.areaPendingCountMap) ? cardRes.areaPendingCountMap.length : 0,
        typeCount: Array.isArray(cardRes.garbageTypePendingCountMap) ? cardRes.garbageTypePendingCountMap.length : 0
      };
    }

    if (Array.isArray(areaPieRes)) {
      pendingState.pieArea = areaPieRes.map(item => ({ name: item.name, value: Number(item.value) || 0 }));
    }

    if (Array.isArray(typePieRes)) {
      pendingState.pieType = typePieRes.map(item => ({ name: item.name, value: Number(item.value) || 0 }));
    }

    if (Array.isArray(columnRes)) {
      pendingState.column.x = columnRes.map(item => item.timePeriod);
      pendingState.column.series = columnRes.map(item => item.count || 0);
    }
  } catch (error) {
    console.error('获取计划待执行数据失败:', error);
  }
};

// ---------- 作业进行中专用状态 ----------
const executingState = reactive({
  card: { currentTaskCount: 0, normalRunningCount: 0, abnormalCount: 0 },
  trend: { x: [], series: [] }
});

const fetchExecutingData = async () => {
  try {
    const [cardRes, trendRes] = await Promise.all([
      getGarbageCollectionCardExecuting(),
      getGarbageCollectionTrendDailyVolume()
    ]);

    if (cardRes) {
      executingState.card = {
        currentTaskCount: cardRes.currentTaskCount || 0,
        normalRunningCount: cardRes.normalRunningCount || 0,
        abnormalCount: cardRes.abnormalCount || 0
      };
    }

    if (Array.isArray(trendRes)) {
      executingState.trend.x = trendRes.map(item => item.timePoint);
      executingState.trend.series = trendRes.map(item => item.collectedVolume || 0);
    }
  } catch (error) {
    console.error('获取作业进行中数据失败:', error);
  }
};

// ---------- 已完成专用状态 ----------
const completedState = reactive({
  card: { completedTaskCount: 0, totalCollectedVolume: 0, averageCompletionRate: 0, abnormalCompleteRate: 0 },
  pieArea: [],
  pieType: [],
  barComparison: {x: [], series: []},
  trendCompletion: {x: [], series: []}
});

const fetchCompletedData = async () => {
  try {
    const {startTime, endTime} = getDefaultTimeRange();

    const [
      cardRes,
      trendRes,
      comparisonRes,
      pieTypeRes,
      pieAreaRes
    ] = await Promise.all([
      getGarbageCollectionCardCompleted(),
      getGarbageCollectionCompletionRateTrend({startTime, endTime}),
      getGarbageCollectionVolumeComparison({dimension: 'day', startTime, endTime}),
      getGarbageCollectionCompletedVolumeByGarbageType(),
      getGarbageCollectionCompletedVolumeByArea()
    ]);

    if (cardRes) {
      completedState.card = {
        completedTaskCount: cardRes.completedTaskCount || 0,
        totalCollectedVolume: cardRes.totalCollectedVolume || 0,
        averageCompletionRate: cardRes.averageCompletionRate || 0,
        abnormalCompleteRate: cardRes.abnormalCompleteRate || 0
      };
    }

    if (Array.isArray(trendRes)) {
      completedState.trendCompletion.x = trendRes.map(item => item.date);
      completedState.trendCompletion.series = trendRes.map(item => item.completionRate || 0);
    }

    if (Array.isArray(comparisonRes)) {
      completedState.barComparison.x = comparisonRes.map(item => item.timeDimension);
      completedState.barComparison.series = comparisonRes.map(item => item.collectedVolume || 0);
    }

    if (Array.isArray(pieTypeRes)) {
      completedState.pieType = pieTypeRes.map(item => ({
        name: item.name,
        value: Number(item.value) || 0
      }));
    }

    if (Array.isArray(pieAreaRes)) {
      completedState.pieArea = pieAreaRes.map(item => ({
        name: item.name,
        value: Number(item.value) || 0
      }));
    }
  } catch (error) {
    console.error('获取已完成数据失败:', error);
  }
};

// 监听 activeName，分别调用对应数据获取函数
watch(() => props.activeName, (newVal) => {
  if (newVal === '异常待处置') {
    fetchAbnormalData();
  } else if (newVal === '处置待复核') {
    fetchReviewData();
  } else if (newVal === '计划待执行') {
    fetchPendingData();
  } else if (newVal === '作业进行中') {
    fetchExecutingData();
  } else if (newVal === '已完成') {
    fetchCompletedData();
  }
}, {immediate: true});
</script>

<template>
  <div class="chart2-box">
    <!-- 计划待执行 -->
    <template v-if="activeName === '计划待执行'">
      <div class="chart-box-left">
        <Indicator
          class="left-card"
          title="待执行计划总数"
          :value="pendingState.card.totalPending"
          color="#409EFF"
        />
        <Indicator
          class="left-card"
          title="区域数"
          :value="pendingState.card.areaCount"
          color="#13ce66"
        />
        <Indicator
          class="left-card"
          title="品类数"
          :value="pendingState.card.typeCount"
          color="#67C23A"
        />
      </div>
      <Pie
        style="flex:1"
        title-text="待执行区域分布"
        :data="pendingState.pieArea"
      />
      <Pie
        style="flex:1"
        title-text="待执行品类分布"
        :data="pendingState.pieType"
      />
      <Bar
        style="flex:1"
        title="不同时段待执行数量"
        :x-data="pendingState.column.x"
        :series-data="[{ name: '计划数', data: pendingState.column.series }]"
      />
    </template>

    <!-- 作业进行中 -->
    <template v-else-if="activeName === '作业进行中'">
      <div class="chart-box-left">
        <Indicator
          class="left-card"
          title="当前作业任务数"
          :value="executingState.card.currentTaskCount"
          color="#409EFF"
        />
        <Indicator
          class="left-card"
          title="正常运行数"
          :value="executingState.card.normalRunningCount"
          color="#13ce66"
        />
        <Indicator
          class="left-card"
          title="异常标记数"
          :value="executingState.card.abnormalCount"
          color="#F56C6C"
        />
      </div>
      <LineChart
        style="flex:1"
        title="当日收运量实时增长"
        :x-data="executingState.trend.x"
        :series-data="[{ name: '收运量(吨)', data: executingState.trend.series }]"
        y-name="吨"
        :smooth="true"
      />
    </template>

    <!-- 异常待处置 -->
    <template v-else-if="activeName === '异常待处置'">
      <div class="chart-box-left">
        <Indicator
          class="left-card"
          title="待处置异常总数"
          :value="abnormalState.card.toHandleTotal"
          color="#409EFF"
        />
        <Indicator
          class="left-card"
          title="高优先级数"
          :value="abnormalState.card.highPriorityTotal"
          color="#E6A23C"
        />
        <Indicator
          class="left-card"
          title="超时未处理数"
          :value="abnormalState.card.timeoutTotal"
          color="#F56C6C"
        />
      </div>
      <Pie
        style="flex:1"
        title-text="异常类型占比"
        :data="abnormalState.pieType"
      />
      <Pie
        style="flex:1"
        title-text="异常区域分布"
        :data="abnormalState.pieArea"
      />
      <Bar
        style="flex:1"
        title="责任人异常数量"
        :x-data="abnormalState.column.x"
        :series-data="[{ name: '异常数', data: abnormalState.column.series }]"
      />
    </template>

    <!-- 处置待复核 -->
    <template v-else-if="activeName === '处置待复核'">
      <div class="chart-box-left">
        <Indicator
          class="left-card"
          title="待复核总数"
          :value="reviewState.card.reviewTotal"
          color="#409EFF"
        />
        <Indicator
          class="left-card"
          title="已通过数"
          :value="reviewState.card.passedCount"
          color="#67C23A"
        />
        <Indicator
          class="left-card"
          title="已退回数"
          :value="reviewState.card.returnCount"
          color="#F56C6C"
        />
      </div>
      <Pie
        style="flex:1"
        title-text="复核结果占比"
        :data="reviewState.pieReviewResult"
      />
      <Pie
        style="flex:1"
        title-text="异常类型占比"
        :data="reviewState.pieAbnormalType"
      />
      <Bar
        style="flex:1"
        title="异常处置平均时长对比(小时)"
        :x-data="reviewState.columnAvgHandle.x"
        :series-data="[{ name: '平均时长', data: reviewState.columnAvgHandle.series }]"
      />
    </template>

    <!-- 已完成 -->
    <template v-else-if="activeName === '已完成'">
      <div class="box-left">
        <Indicator
          class="left-card"
          title="已完成任务数"
          :value="completedState.card.completedTaskCount"
          color="#409EFF"
        />
        <Indicator
          class="left-card"
          title="总收运量"
          :value="completedState.card.totalCollectedVolume + '吨'"
          color="#13ce66"
        />
        <Indicator
          class="left-card"
          title="平均完成率"
          :value="completedState.card.averageCompletionRate + '%'"
          color="#67C23A"
        />
        <Indicator
          class="left-card"
          title="异常办结率"
          :value="completedState.card.abnormalCompleteRate + '%'"
          color="#F56C6C"
        />
      </div>
      <Pie
        style="flex:1"
        title-text="区域收运量占比"
        :data="completedState.pieArea"
      />
      <Pie
        style="flex:1"
        title-text="品类收运量占比"
        :data="completedState.pieType"
      />
      <Bar
        style="flex:1"
        title="按日收运量对比"
        :x-data="completedState.barComparison.x"
        :series-data="[{ name: '收运量(吨)', data: completedState.barComparison.series }]"
      />
      <LineChart
        style="flex:1"
        title="收运完成率趋势"
        :x-data="completedState.trendCompletion.x"
        :series-data="[{ name: '完成率', data: completedState.trendCompletion.series }]"
        y-name="%"
        :smooth="true"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.chart2-box {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  width: 100%;

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

  .chart-box-left {
    display: flex;
    flex: 0 0 max(280px, min(25vw, 320px));
    flex-direction: column;
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin: 0;
  }
}
</style>
