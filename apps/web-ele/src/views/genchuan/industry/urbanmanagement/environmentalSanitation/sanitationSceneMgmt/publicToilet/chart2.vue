<script setup>
import { ref, watch } from 'vue';
import {
  getCleaningPendingChart,
  getConsumablePendingChart,
  getComplaintPendingChart,
  getCleaningSummaryChart,
  getFacilityRepairPendingChart   // 新增
} from '#/api/genchuan/industry/urbanmanagement/environmentalSanitation/sanitationSceneMgmt/publicToilet/data.js';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';
import LineChart from '#/components/stats/lineChart.vue';

const props = defineProps({
  activeName: { type: String, required: true },
});

// 各状态数据（直接存储接口返回的对象）
const pendingCleaningData = ref(null);      // 保洁待执行
const pendingConsumableData = ref(null);    // 物资待补充
const pendingComplaintData = ref(null);     // 投诉待处置
const pendingFacilityData = ref(null);      // 设施待维修（新增）
const completedData = ref(null);             // 已完成

const loading = ref(false);

// 通用数值转换（处理字符串或数字）
const toNumber = (val) => {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'string') return parseFloat(val) || 0;
  return Number(val) || 0;
};

// 根据 activeName 获取数据
const fetchData = async () => {
  loading.value = true;
  try {
    if (props.activeName === '保洁待执行') {
      const res = await getCleaningPendingChart();
      pendingCleaningData.value = res;
    } else if (props.activeName === '物资待补充') {
      const res = await getConsumablePendingChart();
      pendingConsumableData.value = res;
    } else if (props.activeName === '投诉待处置') {
      const res = await getComplaintPendingChart();
      pendingComplaintData.value = res;
    } else if (props.activeName === '设施待维修') {
      const res = await getFacilityRepairPendingChart();
      pendingFacilityData.value = res;
    } else if (props.activeName === '已完成') {
      const res = await getCleaningSummaryChart();
      completedData.value = res;
    }
  } catch (error) {
    console.error('获取图表数据失败:', error);
  } finally {
    loading.value = false;
  }
};

watch(() => props.activeName, fetchData, { immediate: true });
</script>

<template>
  <div class="chart2-box" v-loading="loading" element-loading-text="加载中...">
    <!-- 保洁待执行 -->
    <template v-if="activeName === '保洁待执行' && pendingCleaningData">
      <div class="chart-box-left">
        <Indicator class="left-card" title="待执行保洁计划数" :value="toNumber(pendingCleaningData.pendingCount)" color="#409EFF" />
        <Indicator class="left-card" title="按区域待执行数" :value="toNumber(pendingCleaningData.pendingByArea)" color="#13ce66" />
        <Indicator class="left-card" title="按人员分配数" :value="toNumber(pendingCleaningData.assignedByCleaner)" color="#67C23A" />
      </div>
      <Pie style="flex:1" title-text="保洁频次分布" :data="pendingCleaningData.frequencyDistribution || []" />
      <Pie style="flex:1" title-text="区域分布" :data="pendingCleaningData.areaDistribution || []" />
      <Bar style="flex:1" title="不同时段保洁计划数量对比"
           :x-data="(pendingCleaningData.planCountByTimeSlot || []).map(item => item.name)"
           :series-data="[{ name: '计划数', data: (pendingCleaningData.planCountByTimeSlot || []).map(item => toNumber(item.value)) }]" />
    </template>

    <!-- 物资待补充 -->
    <template v-else-if="activeName === '物资待补充' && pendingConsumableData">
      <div class="chart-box-left">
        <Indicator class="left-card" title="待补充物资总数" :value="toNumber(pendingConsumableData.pendingTotal)" color="#409EFF" />
        <Indicator class="left-card" title="高预警物资数" :value="toNumber(pendingConsumableData.highWarningCount)" color="#E6A23C" />
        <Indicator class="left-card" title="各区域待补充数" :value="toNumber(pendingConsumableData.pendingAreaCount)" color="#F56C6C" />
      </div>
      <Pie style="flex:1" title-text="物资类型占比" :data="pendingConsumableData.typeDistribution || []" />
      <Pie style="flex:1" title-text="预警状态占比" :data="pendingConsumableData.warningDistribution || []" />
      <Bar style="flex:1" title="不同物资缺口数量对比"
           :x-data="(pendingConsumableData.gapByConsumable || []).map(item => item.name)"
           :series-data="[{ name: '缺口数', data: (pendingConsumableData.gapByConsumable || []).map(item => toNumber(item.value)) }]" />
    </template>

    <!-- 投诉待处置 -->
    <template v-else-if="activeName === '投诉待处置' && pendingComplaintData">
      <div class="chart-box-left">
        <Indicator class="left-card" title="待处置投诉总数" :value="toNumber(pendingComplaintData.pendingTotal)" color="#409EFF" />
        <Indicator class="left-card" title="按类型投诉数" :value="toNumber(pendingComplaintData.typeCount)" color="#13ce66" />
        <Indicator class="left-card" title="超时未处理数" :value="toNumber(pendingComplaintData.timeoutUnHandledCount)" color="#F56C6C" />
      </div>
      <Pie style="flex:1" title-text="投诉类型占比" :data="pendingComplaintData.typeDistribution || []" />
      <Pie style="flex:1" title-text="区域分布占比" :data="pendingComplaintData.areaDistribution || []" />
      <Bar style="flex:1" title="不同区域投诉数量对比"
           :x-data="(pendingComplaintData.complaintCountByArea || []).map(item => item.name)"
           :series-data="[{ name: '投诉数', data: (pendingComplaintData.complaintCountByArea || []).map(item => toNumber(item.value)) }]" />
    </template>

    <!-- 设施待维修（使用接口数据） -->
    <template v-else-if="activeName === '设施待维修' && pendingFacilityData">
      <div class="chart-box-left">
        <Indicator class="left-card" title="待维修设施总数" :value="toNumber(pendingFacilityData.toRepairTotal)" color="#409EFF" />
        <!-- “按类型维修数”取设施类型的种类数，也可根据实际需求调整 -->
        <Indicator class="left-card" title="按类型维修数" :value="pendingFacilityData.facilityTypeRatio?.length || 0" color="#13ce66" />
        <Indicator class="left-card" title="已派单数" :value="toNumber(pendingFacilityData.dispatchedTotal)" color="#67C23A" />
      </div>
      <Pie style="flex:1" title-text="设施类型占比" :data="pendingFacilityData.facilityTypeRatio || []" />
      <Pie style="flex:1" title-text="维修状态占比" :data="pendingFacilityData.repairStatusRatio || []" />
      <Bar style="flex:1" title="不同区域设施损坏数量对比"
           :x-data="(pendingFacilityData.damageCountByArea || []).map(item => item.name || '未知')"
           :series-data="[{ name: '损坏数', data: (pendingFacilityData.damageCountByArea || []).map(item => toNumber(item.value)) }]" />
    </template>

    <!-- 已完成 -->
    <template v-else-if="activeName === '已完成' && completedData">
      <div class="box-left">
        <Indicator class="left-card" title="已完成任务总数" :value="toNumber(completedData.completedTotal)" color="#409EFF" />
        <Indicator class="left-card" title="保洁达标率" :value="toNumber(completedData.cleaningQualifiedRate).toFixed(1) + '%'" color="#67C23A" />
        <Indicator class="left-card" title="投诉办结率" :value="toNumber(completedData.complaintFinishRate).toFixed(1) + '%'" color="#E6A23C" />
        <Indicator class="left-card" title="设施完好率" :value="toNumber(completedData.facilityGoodRate).toFixed(1) + '%'" color="#F56C6C" />
      </div>
      <Pie style="flex:1" title-text="任务类型占比" :data="completedData.taskTypeDistribution || []" />
      <Pie style="flex:1" title-text="区域完成量占比" :data="completedData.areaCompletionDistribution || []" />
      <Bar style="flex:1" title="按日/周/月任务完成量对比"
           :x-data="(completedData.completionCountByPeriod || []).map(item => item.name)"
           :series-data="[{ name: '完成量', data: (completedData.completionCountByPeriod || []).map(item => toNumber(item.value)) }]" />
      <LineChart style="flex:1" title="保洁达标率趋势"
                 :x-data="(completedData.cleaningQualifiedTrend || []).map(item => item.name)"
                 :series-data="[{ name: '达标率', data: (completedData.cleaningQualifiedTrend || []).map(item => toNumber(item.value)) }]"
                 y-name="%" :smooth="true" />
    </template>

    <!-- 默认占位（当无数据时） -->
    <template v-else>
      <div class="placeholder">暂无数据</div>
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

  .placeholder {
    width: 100%;
    text-align: center;
    padding: 50px 0;
    color: #999;
    font-size: 16px;
  }
}
</style>
