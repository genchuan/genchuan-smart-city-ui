<script setup lang="ts">
import {
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import { useRouter } from 'vue-router';
import screenFull from 'screenfull';
import {
  ElButton,
  ElTable,
  ElTableColumn,
  ElDialog,
  ElDescriptions,
  ElDescriptionsItem,
  ElTag,
  ElMessage,
} from 'element-plus';
import { Filter, FullScreen, Refresh } from '@element-plus/icons-vue';
import VerticalBar1 from '#/views/genchuan/industry/templatesstatchart/VerticalBar1.vue';
import ChartLine1 from '#/views/genchuan/industry/templatesstatchart/ChartLine1.vue';
import ChartLine2 from '#/views/genchuan/industry/templatesstatchart/ChartLine2.vue';
import ChartLine3 from '#/views/genchuan/industry/templatesstatchart/ChartLine3-desc.vue';
import VerticalBar2 from '#/views/genchuan/industry/templatesstatchart/VerticalBar2.vue';
import ChartPie1 from '#/views/genchuan/industry/templatesstatchart/ChartPie1.vue';
import ChartPie2 from '#/views/genchuan/industry/templatesstatchart/ChartPie2.vue';
import ChartPie3 from '#/views/genchuan/industry/templatesstatchart/ChartPie3.vue';
import ChartPie5 from '#/views/genchuan/industry/templatesstatchart/ChartPie5-desc.vue';

// 导入资源运行API
import {
  fetchParkResourceRunList,
  fetchParkResourceRunIndicators,
  fetchParkResourceRunUtilizationTrend,
  fetchParkResourceRunTurnoverTrend,
  fetchParkResourceRunRegionRatio,
  fetchParkResourceRunTimeRatio,
  fetchParkResourceRunDetail,
  fetchParkResourceRunTurnoverTimeTrend,
  fetchParkResourceList,
  fetchParkResourceIndicators,
  fetchParkResourceAreaCount,
  fetchParkResourceTypeSpaceCount,
  fetchParkResourceDetail,
  fetchParkServiceQualityList,
  fetchParkServiceQualityIndicators,
  fetchParkServiceQualityPaySuccessRateTrend,
  fetchParkServiceQualitySatisfactionTrend,
  fetchParkServiceQualityRegionCompare,
  fetchParkServiceQualityTimeEntryCompare,
  fetchParkServiceQualityDetail,
  fetchParkServiceQualityEvaluationDetail,
  fetchBusinessFlowEfficiencyList,
  fetchBusinessFlowEfficiencyIndicators,
  fetchBusinessFlowDurationTrend,
  fetchBusinessFlowCompletionRateTrend,
  fetchBusinessFlowTypeDuration,
  fetchBusinessFlowLinkDuration,
  fetchBusinessFlowEfficiencyDetail,
  fetchBusinessFlowBottleneckLinkTrend,
  fetchBusinessQualityList,
  fetchBusinessQualityIndicators,
  fetchBusinessQualityBillingAccuracyTrend,
  fetchBusinessQualityComplianceRateTrend,
  fetchBusinessQualityAbnormalTypeRatio,
  fetchBusinessQualityTypeDistributionRatio,
  fetchBusinessQualityDetail,
  fetchBusinessQualityAbnormalOrderList,
  submitBusinessQualityRectification,
  fetchResourceDevelopmentList,
  fetchResourceDevelopmentIndicators,
  fetchResourceDevelopmentNewTrend,
  fetchResourceDevelopmentPlanCompletionTrend,
  fetchResourceDevelopmentTypeCount,
  fetchResourceDevelopmentRegionCount,
  fetchResourceDevelopmentTypeRatio,
  fetchResourceDevelopmentFocusRegionRatio,
  fetchResourceDevelopmentDetail,
  fetchResourceDevelopmentMonthlyNewTrend,
  submitResourceDevelopmentPlanAdjustment,
  fetchDeviceRunList,
  fetchDeviceRunIndicators,
  fetchDeviceRunOnlineRateTrend,
  fetchDeviceRunFaultTrend,
  fetchDeviceRunTypeRatio,
  fetchDeviceRunEfficiencyRatio,
  fetchDeviceRunDetail,
  submitDeviceMaintenanceOrder,
  fetchSupportResourceList,
  fetchSupportResourceIndicators,
  fetchSupportResourceTypeRatio,
  fetchSupportResourceRegionRatio,
  fetchSupportResourceTypeCount,
  fetchSupportResourceParkingCount,
  fetchSupportResourceDetail,
  submitSupportMaintainRequest,
  fetchComplaintList,
  fetchComplaintIndicators,
  fetchComplaintTypeRatio,
  fetchComplaintResultRatio,
  fetchComplaintSourceRatio,
  fetchComplaintNewTrend,
  fetchComplaintProcessTrend,
  fetchComplaintDetail,
  submitComplaintProcess,
  submitComplaintReview,
  fetchMaintainEfficiencyList,
  fetchMaintainEfficiencyIndicators,
  fetchMaintainEfficiencyHandleDurationTrend,
  fetchMaintainEfficiencyCompletionRateTrend,
  fetchMaintainEfficiencyWorkorderTypeRatio,
  fetchMaintainEfficiencyLevelRatio,
  fetchMaintainEfficiencyReworkReasonRatio,
  fetchMaintainEfficiencyDetail,
  fetchMaintainEfficiencyWorkorderTrackList,
  submitMaintainEfficiencyReview,
  fetchServiceDevelopmentList,
  fetchServiceDevelopmentIndicators,
  fetchServiceDevelopmentUserGrowthTrend,
  fetchServiceDevelopmentServiceUtilizationTrend,
  fetchServiceDevelopmentTypeCompare,
  fetchServiceDevelopmentRegionCoverageCompare,
  fetchServiceDevelopmentTypeRatio,
  fetchServiceDevelopmentHighUtilizationRatio,
  fetchServiceDevelopmentDetail,
  fetchServiceDevelopmentUserGrowthTrendDetail,
  submitServiceDevelopmentOptimization,
} from '#/api/genchuan/industry/parkingmgmt/overview/IndexAnalysis.ts';

const pageContainerRef = ref<HTMLElement | null>(null);
const router = useRouter();
const instance = getCurrentInstance();
const currentFullscreenPanel = ref<HTMLElement | null>(null);

// 标签页激活状态
const topLeftActiveTab = ref('tab1');
const topMiddleActiveTab = ref('tab1');
const topRightActiveTab = ref('tab1');
const bottomLeftActiveTab = ref('tab1');
const bottomMiddleActiveTab = ref('tab1');
const bottomRightActiveTab = ref('tab1');

const tipDialogVisible = ref(false);
const tipDialogContent = ref('');

// 公共工具方法
const formatNumber = (num: number) =>
  num.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
const formatDecimal = (num: number) => num.toFixed(1);
const formatTimeStamp = (timeStamp?: number | string) => {
  if (!timeStamp) return '-';
  const date = new Date(Number(timeStamp));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const animateValue = (
  element: HTMLElement,
  start: number,
  end: number,
  duration: number,
) => {
  if (!element) return;
  let startTimestamp: null | number = null;
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;

    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentValue = progress * (end - start) + start;

    element.textContent = Number.isInteger(end)
      ? formatNumber(Math.floor(currentValue))
      : formatDecimal(currentValue);

    if (progress < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
};

const initNumberAnimations = () => {
  document
    .querySelectorAll('.number-animate')
    .forEach((el) => {
      const targetEl = el as HTMLElement;
      const rawText = (targetEl.textContent || '0').replace(/[^\d.-]/g, '');
      const endValue = Number(rawText) || 0;
      animateValue(
        targetEl,
        0,
        endValue,
        1500,
      );
    });
};

// 全屏方法
const togglePanelFullscreen = (panelRefName: string) => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }
  const panel = instance?.refs[panelRefName];
  if (!panel) {
    ElMessage.error('未找到面板元素');
    return;
  }
  if (screenFull.isFullscreen && document.fullscreenElement === panel) {
    screenFull.exit();
  } else {
    screenFull.request(panel);
  }
  currentFullscreenPanel.value = panel as HTMLElement;
};

const handleFullscreenChange = () => {
  if (screenFull.isFullscreen && currentFullscreenPanel.value) {
    setTimeout(() => {
      resourceRunChartRefreshKey.value++;
    }, 300);
  } else if (currentFullscreenPanel.value) {
    currentFullscreenPanel.value.style = '';
    nextTick(() => {
      resourceRunChartRefreshKey.value++;
    });
    currentFullscreenPanel.value = null;
  }
};

// 资源运行TS类型定义
interface ParkResourceRunRow {
  tbParkingName: string;
  tbRegionName: string;
  tbParkingSpaceTotalCount: number;
  tbParkingOperationDailyUtilizationRate: number;
  tbParkingOperationTurnoverRate: number;
  tbParkingOperationPeakUtilizationRate: number;
  tbParkingParkingId: string;
}

interface ParkResourceRunIndicators {
  totalSpaceCount: number;
  averageUtilizationRate: number;
  averageTurnoverRate: number;
  peakAverageUtilizationRate: number;
}

interface ChartRatioData {
  legend: string[];
  series: { data: number[]; name: string }[];
}

interface ChartLineData {
  xAxis: string[];
  series: { data: number[]; name: string }[];
}

interface ParkResourceRunDetail {
  tbParkingParkingId: string;
  tbParkingName: string;
  tbRegionName: string;
  tbParkingOperationChainUtilizationChange: number;
  tbParkingOperationMonthlyMaxUtilization: number;
  tbParkingOperationPeakHour: string;
  runDetail: {
    tbParkingSpaceTotalCount: number;
    tbParkingOperationDailyUtilizationRate: number;
    tbParkingOperationTurnoverRate: number;
    tbParkingOperationPeakUtilizationRate: number;
  };
  timeDistribution: ChartLineData;
  abnormalRecords: {
    time: number | string;
    content: string;
    handleStatus: string;
  }[];
}

interface ParkResourceRunTurnoverTimeTrend {
  tbParkingParkingId: string;
  tbParkingName: string;
  xAxis: string[];
  series: { data: number[]; name: string }[];
}

// 停车资源TS类型定义
interface ParkResourceRow {
  tbParkingName: string;
  tbRegionName: string;
  sysParkingTypeName: string;
  tbParkingSpaceTotalCount: number;
  tbParkingSpaceAvailableCount: number;
  sysOperationStatusName: string;
  tbParkingId: string;
}

interface ParkResourceIndicators {
  totalParkCount: number; // 停车场总数
  totalSpaceCount: number; // 总泊位数
  availableSpaceCount: number; // 可用泊位数
  runningParkCount: number; // 运营中停车场数
}

interface ParkResourceDetail {
  tbParkingId: string;
  tbParkingName: string;
  tbRegionName: string;
  sysParkingTypeName: string;
  tbParkingSpaceTotalCount: number;
  tbParkingSpaceAvailableCount: number;
  sysOperationStatusName: string;
  tbParkingSaturationRate: number; // 饱和率
  tbParkingOperationYears: number; // 运营年限
  tbParkingNewEnergyRatio: number; // 新能源车位占比
  tbParkingCode: string; // 资源编码
  spaceDistribution: ChartRatioData; // 车位分布
  operationQualifications: {
    name: string;
    status: string;
    expireTime: string;
  }[]; // 运营资质
}

// 服务质量TS类型定义
interface ParkServiceQualityRow {
  tbServiceQualityPeriod: string;
  tbServiceQualityAverageEntryTime: number;
  tbServiceQualityAveragePayTime: number;
  tbServiceQualityPaySuccessRate: number;
  tbServiceQualityComplaintRate: number;
  tbServiceQualitySatisfactionRate: number;
  tbServiceQualityId: string;
}

interface ParkServiceQualityIndicators {
  averageEntryTime: number; // 平均入场时长(秒)
  paySuccessRate: number; // 缴费成功率(%)
  satisfactionRate: number; // 用户满意度(%)
  complaintRate: number; // 投诉率(%)
}

interface ParkServiceQualityDetail {
  tbServiceQualityId: string;
  tbServiceQualityPeriod: string;
  tbServiceQualityChainChangeRate: number; // 环比变化率(%)
  tbServiceQualityIndustryAverageCompare: number; // 行业均值对比(%)
  tbServiceQualityBestServiceHour: string; // 最优服务时段
  tbServiceQualityAbnormalCount: number; // 异常服务次数
  detail: {
    tbServiceQualityAverageEntryTime: number;
    tbServiceQualityAveragePayTime: number;
    tbServiceQualityPaySuccessRate: number;
    tbServiceQualityComplaintRate: number;
    tbServiceQualitySatisfactionRate: number;
  };
  abnormalRecords: {
    time: number | string;
    content: string;
    handleStatus: string;
  }[];
  evaluationSummary: {
    positive: number;
    negative: number;
    neutral: number;
    keyWords: string[];
  };
}

interface ParkServiceQualityEvaluationDetail {
  tbServiceQualityId: string;
  tbServiceQualityPeriod: string;
  evaluationList: {
    time: number | string;
    userName: string;
    score: number;
    content: string;
    handleStatus: string;
  }[];
}

// 业务流转效率TS类型定义
interface BusinessFlowEfficiencyRow {
  sysBusinessTypeName: string;
  tbBusinessFlowPeriod: string;
  tbBusinessFlowAverageFlowDuration: number;
  tbBusinessFlowCompletionRate: number;
  tbBusinessFlowBottleneckRatio: number;
  tbBusinessFlowOvertimeRate: number;
  tbBusinessFlowId: string;
}

interface BusinessFlowEfficiencyIndicators {
  averageFlowDuration: number; // 平均流转时长(小时)
  averageCompletionRate: number; // 平均完成率(%)
  averageOvertimeRate: number; // 平均超时率(%)
  coreBottleneckRatio: number; // 核心瓶颈环节占比(%)
}

interface BusinessFlowEfficiencyDetail {
  tbBusinessFlowId: string;
  sysBusinessTypeName: string;
  tbBusinessFlowPeriod: string;
  tbBusinessFlowChainDurationChange: number; // 环比流转时长变化
  tbBusinessFlowCoreBottleneck: string; // 核心瓶颈环节
  tbBusinessFlowBestFlowHour: string; // 最优流转时段
  tbBusinessFlowStandardDuration: number; // 标准流转时长
  flowDetail: {
    tbBusinessFlowAverageFlowDuration: number;
    tbBusinessFlowCompletionRate: number;
    tbBusinessFlowBottleneckRatio: number;
    tbBusinessFlowOvertimeRate: number;
  };
  bottleneckAnalysis: {
    linkName: string;
    bottleneckRatio: number;
    averageDuration: number;
    standardDuration: number;
    reason: string;
  };
  optimizationSuggestion: {
    content: string;
    expectedEffect: string;
    status: string;
  }[];
  trendData: ChartLineData;
}

interface BusinessFlowBottleneckLinkTrend {
  tbBusinessFlowId: string;
  sysBusinessTypeName: string;
  xAxis: string[];
  series: { data: number[]; name: string }[];
}

// 业务质量TS类型定义
interface BusinessQualityRow {
  sysBusinessTypeName: string;
  tbBusinessQualityPeriod: string;
  tbBusinessQualityBillingAccuracy: number;
  tbBusinessQualityOrderSuccessRate: number;
  tbBusinessQualityAbnormalOrderCount: number;
  tbBusinessQualityComplianceRate: number;
  tbBusinessQualityId: string;
}

interface BusinessQualityIndicators {
  billingAccuracy: number; // 计费准确率(%)
  orderSuccessRate: number; // 订单成功率(%)
  complianceRate: number; // 合规率(%)
  abnormalOrderCount: number; // 异常订单数
}

interface BusinessQualityDetail {
  tbBusinessQualityId: string;
  sysBusinessTypeName: string;
  tbBusinessQualityPeriod: string;
  tbBusinessQualityBillingAccuracy: number;
  tbBusinessQualityOrderSuccessRate: number;
  tbBusinessQualityAbnormalOrderCount: number;
  tbBusinessQualityComplianceRate: number;
  // 输出字段
  tbBusinessQualityAbnormalRate: number; // 异常率(%)
  tbBusinessQualityChainAccuracyChange: number; // 环比准确率变化(%)
  sysAbnormalTypeName: string; // 主要异常类型
  tbBusinessQualityRectificationCount: number; // 整改完成数
  // 异常订单清单
  abnormalOrderList: {
    orderNo: string;
    abnormalType: string;
    abnormalTime: number | string;
    handleStatus: string;
  }[];
  // 合规检查记录
  complianceCheckRecords: {
    checkTime: number | string;
    checkItem: string;
    checkResult: string;
    checkPerson: string;
  }[];
}

interface BusinessQualityAbnormalOrderList {
  tbBusinessQualityId: string;
  sysBusinessTypeName: string;
  abnormalOrderList: {
    orderNo: string;
    abnormalType: string;
    abnormalTime: number | string;
    abnormalReason: string;
    handleStatus: string;
    handlePerson: string;
  }[];
}

interface RectificationForm {
  rectificationPlan: string;
}

// 资源发展TS类型定义
interface ResourceDevelopmentRow {
  sysResourceTypeName: string;
  tbResourceDevelopmentPeriod: string;
  tbResourceDevelopmentNewCount: number;
  tbResourceDevelopmentExpansionCount: number;
  tbResourceDevelopmentOptimizationCount: number;
  tbResourceDevelopmentPlanCompletionRate: number;
  developmentId: string;
}

interface ResourceDevelopmentIndicators {
  totalNewCount: number; // 新增资源总数
  totalExpansionCount: number; // 扩容总数
  totalOptimizationCount: number; // 优化总数
  averagePlanCompletionRate: number; // 规划达成率
}

interface ResourceDevelopmentDetail {
  developmentId: string;
  sysResourceTypeName: string;
  tbResourceDevelopmentPeriod: string;
  tbResourceDevelopmentYearOnYearGrowth: number; // 同比增长率(%)
  tbResourceDevelopmentTotalAccumulated: number; // 累计资源总量
  tbRegionName: string; // 重点发展区域
  tbResourceDevelopmentDevelopmentGap: number; // 发展缺口
  developmentDetail: {
    tbResourceDevelopmentNewCount: number;
    tbResourceDevelopmentExpansionCount: number;
    tbResourceDevelopmentOptimizationCount: number;
    tbResourceDevelopmentPlanCompletionRate: number;
  };
  regionDistribution: ChartRatioData; // 区域分布
  planDetails: {
    period: string;
    planCount: number;
    actualCount: number;
    completionRate: number;
  }[];
}

interface ResourceDevelopmentMonthlyNewTrend {
  developmentId: string;
  sysResourceTypeName: string;
  xAxis: string[];
  series: { data: number[]; name: string }[];
}

interface PlanAdjustmentForm {
  planContent: string;
}

// 设备运行TS类型定义
interface DeviceRunRow {
  tbDeviceName: string;
  sysDeviceTypeName: string;
  tbParkingName: string;
  tbDeviceOperationOnlineRate: number;
  tbDeviceOperationDailyRunningHours: number;
  tbDeviceOperationFaultRate: number;
  tbDeviceDeviceId: string;
}

interface DeviceRunIndicators {
  totalDeviceCount: number; // 设备总数
  averageOnlineRate: number; // 平均在线率
  averageRunningHours: number; // 平均运行时长
  averageFaultRate: number; // 整体故障率
}

interface DeviceRunDetail {
  tbDeviceDeviceId: string;
  tbDeviceName: string;
  sysDeviceTypeName: string;
  tbParkingName: string;
  tbDeviceOperationMonthlyFaultCount: number; // 本月故障次数
  tbDeviceMaintainNextTime: string; // 下次维护时间
  sysEfficiencyLevelName: string; // 运行效能等级
  runDetail: {
    tbDeviceOperationOnlineRate: number;
    tbDeviceOperationDailyRunningHours: number;
    tbDeviceOperationFaultRate: number;
  };
  operationLogs: {
    time: number | string;
    content: string;
    type: string;
  }[];
  faultRecords: {
    time: number | string;
    content: string;
    handleStatus: string;
  }[];
  maintenanceHistory: {
    time: string;
    content: string;
    maintainer: string;
  }[];
}

interface MaintenanceForm {
  maintenanceType: string;
  description: string;
}

// 支撑资源TS类型定义
interface SupportResourceRow {
  tbSupportResourceName: string;
  sysSupportTypeName: string;
  tbParkingName: string;
  tbSupportResourceQuantity: number;
  tbSupportResourceAvailableQuantity: number;
  tbSupportResourceIntactRate: number;
  tbSupportResourceId: string;
}

interface SupportResourceIndicators {
  totalResourceCount: number; // 支撑资源总数
  averageIntactRate: number; // 平均完好率
  coreTypeResourceCount: number; // 核心类型资源数
  maintainingResourceCount: number; // 维护中资源数
}

interface SupportResourceDetail {
  tbSupportResourceId: string;
  tbSupportResourceName: string;
  sysSupportTypeName: string;
  tbParkingName: string;
  tbSupportResourceQuantity: number;
  tbSupportResourceAvailableQuantity: number;
  tbSupportResourceIntactRate: number;
  tbSupportMaintainMonthlyCount: number; // 本月维护次数
  tbSupportResourceMaintainCycle: string; // 维护周期
  tbSupportResourceCoverageRatio: number; // 覆盖车位比
  resourceConfig: { name: string; value: string }[]; // 资源配置明细
  maintainRecords: {
    time: number | string;
    content: string;
    maintainer: string;
    status: string;
  }[]; // 维护记录
  usageStatistics: ChartLineData; // 使用统计
}

interface MaintainForm {
  maintainPlan: string;
}

// 投诉处理TS类型定义
interface ComplaintRow {
  tbComplaintComplaintNo: string;
  sysComplaintTypeName: string;
  tbComplaintSubmitTime: number | string;
  tbComplaintProcessDuration: number | null;
  sysComplaintResultName: string;
  tbComplaintUserSatisfaction: number | null;
  tbComplaintId: string;
}

interface ComplaintIndicators {
  totalComplaintCount: number; // 投诉总数
  processedCount: number; // 已处理数
  processCompletionRate: number; // 处理完成率
  averageProcessDuration: number; // 平均处理时长(小时)
  overallSatisfaction: number; // 整体满意度(分)
}

interface ComplaintDetail {
  tbComplaintId: string;
  tbComplaintComplaintNo: string;
  sysComplaintTypeName: string;
  tbComplaintSubmitTime: number | string;
  tbComplaintProcessDuration: number | null;
  sysComplaintResultName: string;
  tbComplaintUserSatisfaction: number | null;
  tbComplaintSource: string; // 投诉来源
  sysUserUserName: string; // 处理责任人
  sysReviewStatusName: string; // 复盘状态
  complaintContent: {
    title: string;
    content: string;
    attachments: string[];
  }; // 投诉内容
  processRecords: {
    time: number | string;
    operator: string;
    action: string;
    content: string;
  }[]; // 处理过程
  userFeedback: {
    satisfaction: number;
    comment: string;
    feedbackTime: number | string;
  }; // 用户反馈
}

interface ComplaintProcessForm {
  processPlan: string;
}

interface ComplaintReviewForm {
  reviewOpinion: string;
}

// 运维处置效率TS类型定义
interface MaintainEfficiencyRow {
  sysWorkorderTypeName: string;
  tbMaintainEfficiencyPeriod: string;
  tbMaintainEfficiencyAverageHandleDuration: number;
  tbMaintainEfficiencyCompletionRate: number;
  tbMaintainEfficiencyReworkRate: number;
  tbMaintainEfficiencyOneTimeSolveRate: number;
  tbMaintainEfficiencyId: string;
}

interface MaintainEfficiencyIndicators {
  averageHandleDuration: number; // 平均处置时长(小时)
  completionRate: number; // 处置完成率(%)
  oneTimeSolveRate: number; // 一次性解决率(%)
  reworkRate: number; // 返工率(%)
}

interface MaintainEfficiencyDetail {
  tbMaintainEfficiencyId: string;
  tbMaintainEfficiencyChainDurationChange: number; // 环比处置时长变化
  sysWorkorderTypeName: string; // 高频工单类型
  sysEfficiencyLevelName: string; // 处置效率等级
  tbMaintainEfficiencyOvertimeCount: number; // 超时工单数
  detail: {
    tbMaintainEfficiencyAverageHandleDuration: number;
    tbMaintainEfficiencyCompletionRate: number;
    tbMaintainEfficiencyReworkRate: number;
    tbMaintainEfficiencyOneTimeSolveRate: number;
  };
}

interface MaintainEfficiencyWorkorderTrack {
  tbMaintainEfficiencyId: string;
  sysWorkorderTypeName: string;
  workorderList: {
    workorderNo: string;
    createTime: number | string;
    handlePerson: string;
    handleStatus: string;
    handleDuration: number;
    isOvertime: boolean;
  }[];
}

interface ReviewForm {
  reviewOpinion: string;
}

// 服务发展TS类型定义
interface ServiceDevelopmentRow {
  sysServiceTypeName: string;
  tbServiceDevelopmentPeriod: string;
  tbServiceDevelopmentNewServiceCount: number;
  tbServiceDevelopmentCoverageRegionCount: number;
  tbServiceDevelopmentUserGrowthRate: number;
  tbServiceDevelopmentServiceUtilizationRate: number;
  tbServiceDevelopmentId: string;
}

interface ServiceDevelopmentIndicators {
  newServiceCount: number; // 新增服务数
  coverageRegionCount: number; // 覆盖区域数
  userGrowthRate: number; // 用户增长率
  serviceUtilizationRate: number; // 服务使用率
}

interface ServiceDevelopmentDetail {
  tbServiceDevelopmentId: string;
  sysServiceTypeName: string;
  tbServiceDevelopmentPeriod: string;
  tbServiceDevelopmentYearOnYearGrowth: number; // 同比增长率
  tbServiceDevelopmentTotalUserCount: number; // 累计服务用户数
  tbServiceDevelopmentOptimizationDemandCount: number; // 服务优化需求数
  detail: {
    tbServiceDevelopmentNewServiceCount: number;
    tbServiceDevelopmentCoverageRegionCount: number;
    tbServiceDevelopmentUserGrowthRate: number;
    tbServiceDevelopmentServiceUtilizationRate: number;
  };
  userFeedback: {
    time: number | string;
    userName: string;
    content: string;
    score: number;
  }[];
  coverageRegionDetail: {
    regionName: string;
    coverageRate: number;
    userCount: number;
  }[];
}

interface ServiceDevelopmentUserGrowthTrendDetail {
  tbServiceDevelopmentId: string;
  sysServiceTypeName: string;
  xAxis: string[];
  series: { data: number[]; name: string }[];
}

interface ServiceOptimizationForm {
  optimizationPlan: string;
}


// 资源运行响应式数据
const parkResourceRunList = ref<ParkResourceRunRow[]>([]);
const parkResourceRunIndicators = ref<ParkResourceRunIndicators>({
  totalSpaceCount: 0,
  averageUtilizationRate: 0,
  averageTurnoverRate: 0,
  peakAverageUtilizationRate: 0,
});
const parkResourceRunUtilizationTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '全域使用率(%)', data: [] }],
});
const parkResourceRunTurnoverTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '重点停车场周转率', data: [] }],
});
const parkResourceRunRegionRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '区域使用率占比(%)', data: [] }],
});
const parkResourceRunTimeRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '时段使用率分布(%)', data: [] }],
});
// 资源运行视图切换相关
const resourceRunChartRefreshKey = ref(0);
const activeResourceRunView = ref('饼图');
const resourceRunViewBtnList = ref(['卡片', '饼图', '折线图', '列表']);
// 资源运行弹窗相关
const resourceRunDetailDialogVisible = ref(false);
const resourceRunTurnoverDialogVisible = ref(false);
const activeResourceRunDetailView = ref('明细');
const resourceRunDetailViewBtnList = ref(['明细', '趋势', '异常']);
const parkResourceRunDetailSelectedRow = ref<ParkResourceRunDetail>({
  tbParkingParkingId: '',
  tbParkingName: '',
  tbRegionName: '',
  tbParkingOperationChainUtilizationChange: 0,
  tbParkingOperationMonthlyMaxUtilization: 0,
  tbParkingOperationPeakHour: '',
  runDetail: {
    tbParkingSpaceTotalCount: 0,
    tbParkingOperationDailyUtilizationRate: 0,
    tbParkingOperationTurnoverRate: 0,
    tbParkingOperationPeakUtilizationRate: 0,
  },
  timeDistribution: {
    xAxis: [],
    series: [{ name: '时段使用率(%)', data: [] }],
  },
  abnormalRecords: [],
});
const parkResourceRunTurnoverSelectedRow = ref<ParkResourceRunTurnoverTimeTrend>({
  tbParkingParkingId: '',
  tbParkingName: '',
  xAxis: [],
  series: [{ name: '时段周转率', data: [] }],
});

// 停车资源响应式数据
const parkResourceList = ref<ParkResourceRow[]>([]);
const parkResourceIndicators = ref<ParkResourceIndicators>({
  totalParkCount: 0,
  totalSpaceCount: 0,
  availableSpaceCount: 0,
  runningParkCount: 0,
});
const parkResourceAreaCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '停车场数量', data: [] }],
});
const parkResourceTypeSpaceCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '泊位数', data: [] }],
});
// 停车资源视图切换相关
const parkResourceChartRefreshKey = ref(0);
const activeParkResourceView = ref('卡片');
const parkResourceViewBtnList = ref(['卡片', '柱状图', '列表']);
// 停车资源弹窗相关
const parkResourceDetailDialogVisible = ref(false);
const parkResourceDetailSelectedRow = ref<ParkResourceDetail>({
  tbParkingId: '',
  tbParkingName: '',
  tbRegionName: '',
  sysParkingTypeName: '',
  tbParkingSpaceTotalCount: 0,
  tbParkingSpaceAvailableCount: 0,
  sysOperationStatusName: '',
  tbParkingSaturationRate: 0,
  tbParkingOperationYears: 0,
  tbParkingNewEnergyRatio: 0,
  tbParkingCode: '',
  spaceDistribution: {
    legend: [],
    series: [{ name: '车位分布', data: [] }]
  },
  operationQualifications: []
});

// 服务质量响应式数据
const parkServiceQualityList = ref<ParkServiceQualityRow[]>([]);
const parkServiceQualityIndicators = ref<ParkServiceQualityIndicators>({
  averageEntryTime: 0,
  paySuccessRate: 0,
  satisfactionRate: 0,
  complaintRate: 0,
});
const parkServiceQualityPaySuccessRateTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '缴费成功率(%)', data: [] }],
});
const parkServiceQualitySatisfactionTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '用户满意度(%)', data: [] }],
});
const parkServiceQualityRegionCompare = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '用户满意度(%)', data: [] }],
});
const parkServiceQualityTimeEntryCompare = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '平均入场时长(秒)', data: [] }],
});
// 服务质量视图切换相关
const serviceQualityChartRefreshKey = ref(0);
const activeServiceQualityView = ref('柱状图');
const serviceQualityViewBtnList = ref(['卡片', '折线图', '柱状图', '列表']);
// 服务质量弹窗相关
const serviceQualityDetailDialogVisible = ref(false);
const serviceQualityEvaluationDialogVisible = ref(false);
const activeServiceQualityDetailView = ref('明细');
const serviceQualityDetailViewBtnList = ref(['明细', '异常', '评价']);
const parkServiceQualityDetailSelectedRow = ref<ParkServiceQualityDetail>({
  tbServiceQualityId: '',
  tbServiceQualityPeriod: '',
  tbServiceQualityChainChangeRate: 0,
  tbServiceQualityIndustryAverageCompare: 0,
  tbServiceQualityBestServiceHour: '',
  tbServiceQualityAbnormalCount: 0,
  detail: {
    tbServiceQualityAverageEntryTime: 0,
    tbServiceQualityAveragePayTime: 0,
    tbServiceQualityPaySuccessRate: 0,
    tbServiceQualityComplaintRate: 0,
    tbServiceQualitySatisfactionRate: 0,
  },
  abnormalRecords: [],
  evaluationSummary: {
    positive: 0,
    negative: 0,
    neutral: 0,
    keyWords: []
  }
});
const parkServiceQualityEvaluationSelectedRow = ref<ParkServiceQualityEvaluationDetail>({
  tbServiceQualityId: '',
  tbServiceQualityPeriod: '',
  evaluationList: []
});

// 业务流转效率响应式数据
const businessFlowEfficiencyList = ref<BusinessFlowEfficiencyRow[]>([]);
const businessFlowEfficiencyIndicators = ref<BusinessFlowEfficiencyIndicators>({
  averageFlowDuration: 0,
  averageCompletionRate: 0,
  averageOvertimeRate: 0,
  coreBottleneckRatio: 0,
});
const businessFlowDurationTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '流转时长(小时)', data: [] }],
});
const businessFlowCompletionRateTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '完成率(%)', data: [] }],
});
const businessFlowTypeDurationData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '流转时长(小时)', data: [] }],
});
const businessFlowLinkDurationData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '流转时长(小时)', data: [] }],
});
// 业务流转效率视图切换相关
const businessFlowChartRefreshKey = ref(0);
const activeBusinessFlowView = ref('列表');
const businessFlowViewBtnList = ref(['卡片', '折线图', '柱状图', '列表']);
// 业务流转效率弹窗相关
const businessFlowDetailDialogVisible = ref(false);
const businessFlowBottleneckDialogVisible = ref(false);
const activeBusinessFlowDetailView = ref('明细');
const businessFlowDetailViewBtnList = ref(['明细', '瓶颈', '趋势']);
const businessFlowDetailSelectedRow = ref<BusinessFlowEfficiencyDetail>({
  tbBusinessFlowId: '',
  sysBusinessTypeName: '',
  tbBusinessFlowPeriod: '',
  tbBusinessFlowChainDurationChange: 0,
  tbBusinessFlowCoreBottleneck: '',
  tbBusinessFlowBestFlowHour: '',
  tbBusinessFlowStandardDuration: 0,
  flowDetail: {
    tbBusinessFlowAverageFlowDuration: 0,
    tbBusinessFlowCompletionRate: 0,
    tbBusinessFlowBottleneckRatio: 0,
    tbBusinessFlowOvertimeRate: 0,
  },
  bottleneckAnalysis: {
    linkName: '',
    bottleneckRatio: 0,
    averageDuration: 0,
    standardDuration: 0,
    reason: '',
  },
  optimizationSuggestion: [],
  trendData: {
    xAxis: [],
    series: [{ name: '流转时长(小时)', data: [] }]
  }
});
const businessFlowBottleneckSelectedRow = ref<BusinessFlowBottleneckLinkTrend>({
  tbBusinessFlowId: '',
  sysBusinessTypeName: '',
  xAxis: [],
  series: [{ name: '瓶颈环节流转时长(小时)', data: [] }]
});

// 业务质量响应式数据
const businessQualityList = ref<BusinessQualityRow[]>([]);
const businessQualityIndicators = ref<BusinessQualityIndicators>({
  billingAccuracy: 0,
  orderSuccessRate: 0,
  complianceRate: 0,
  abnormalOrderCount: 0,
});
const businessQualityBillingAccuracyTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '计费准确率(%)', data: [] }],
});
const businessQualityComplianceRateTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '合规率(%)', data: [] }],
});
const businessQualityAbnormalTypeRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '异常类型占比(%)', data: [] }],
});
const businessQualityTypeDistributionRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '业务类型质量分布(%)', data: [] }],
});
// 业务质量视图切换相关
const businessQualityChartRefreshKey = ref(0);
const activeBusinessQualityView = ref('折线图');
const businessQualityViewBtnList = ref(['卡片', '折线图', '饼图', '列表']);
// 业务质量弹窗相关
const businessQualityDetailDialogVisible = ref(false);
const businessQualityAbnormalOrderDialogVisible = ref(false);
const businessQualityRectificationDialogVisible = ref(false);
const activeBusinessQualityDetailView = ref('明细');
const businessQualityDetailViewBtnList = ref(['明细', '异常订单', '合规记录']);
const businessQualityDetailSelectedRow = ref<BusinessQualityDetail>({
  tbBusinessQualityId: '',
  sysBusinessTypeName: '',
  tbBusinessQualityPeriod: '',
  tbBusinessQualityBillingAccuracy: 0,
  tbBusinessQualityOrderSuccessRate: 0,
  tbBusinessQualityAbnormalOrderCount: 0,
  tbBusinessQualityComplianceRate: 0,
  tbBusinessQualityAbnormalRate: 0,
  tbBusinessQualityChainAccuracyChange: 0,
  sysAbnormalTypeName: '',
  tbBusinessQualityRectificationCount: 0,
  abnormalOrderList: [],
  complianceCheckRecords: []
});
const businessQualityAbnormalOrderSelectedRow = ref<BusinessQualityAbnormalOrderList>({
  tbBusinessQualityId: '',
  sysBusinessTypeName: '',
  abnormalOrderList: []
});
// 整改表单
const rectificationForm = ref<RectificationForm>({
  rectificationPlan: ''
});
const rectificationFormRules = {
  rectificationPlan: [{ required: true, message: '整改方案不能为空', trigger: 'blur' }]
};
const rectificationFormRef = ref<FormInstance>();

// 资源发展响应式数据
const resourceDevelopmentList = ref<ResourceDevelopmentRow[]>([]);
const resourceDevelopmentIndicators = ref<ResourceDevelopmentIndicators>({
  totalNewCount: 0,
  totalExpansionCount: 0,
  totalOptimizationCount: 0,
  averagePlanCompletionRate: 0,
});
const resourceDevelopmentNewTrendData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '资源新增趋势', data: [] }],
});
const resourceDevelopmentPlanCompletionTrendData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '规划达成率趋势(%)', data: [] }],
});
const resourceDevelopmentTypeCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '发展数量', data: [] }],
});
const resourceDevelopmentRegionCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '发展数量', data: [] }],
});
const resourceDevelopmentTypeRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '资源发展类型占比(%)', data: [] }],
});
const resourceDevelopmentFocusRegionRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '重点发展区域占比(%)', data: [] }],
});
// 资源发展视图切换相关
const resourceDevelopmentChartRefreshKey = ref(0);
const activeResourceDevelopmentView = ref('列表');
const resourceDevelopmentViewBtnList = ref(['卡片', '折线图', '柱状图', '饼图', '列表']);
// 资源发展弹窗相关
const resourceDevelopmentDetailDialogVisible = ref(false);
const resourceDevelopmentMonthlyDialogVisible = ref(false);
const resourceDevelopmentPlanDialogVisible = ref(false);
const activeResourceDevelopmentDetailView = ref('明细');
const resourceDevelopmentDetailViewBtnList = ref(['明细', '区域分布', '规划明细']);
const resourceDevelopmentDetailSelectedRow = ref<ResourceDevelopmentDetail>({
  developmentId: '',
  sysResourceTypeName: '',
  tbResourceDevelopmentPeriod: '',
  tbResourceDevelopmentYearOnYearGrowth: 0,
  tbResourceDevelopmentTotalAccumulated: 0,
  tbRegionName: '',
  tbResourceDevelopmentDevelopmentGap: 0,
  developmentDetail: {
    tbResourceDevelopmentNewCount: 0,
    tbResourceDevelopmentExpansionCount: 0,
    tbResourceDevelopmentOptimizationCount: 0,
    tbResourceDevelopmentPlanCompletionRate: 0,
  },
  regionDistribution: {
    legend: [],
    series: [{ name: '区域分布数量', data: [] }]
  },
  planDetails: []
});
const resourceDevelopmentMonthlySelectedRow = ref<ResourceDevelopmentMonthlyNewTrend>({
  developmentId: '',
  sysResourceTypeName: '',
  xAxis: [],
  series: [{ name: '月度新增数量', data: [] }]
});
// 规划调整表单
const planAdjustmentForm = ref<PlanAdjustmentForm>({
  planContent: ''
});
const planAdjustmentFormRules = {
  planContent: [{ required: true, message: '规划内容不能为空', trigger: 'blur' }]
};
const planAdjustmentFormRef = ref<FormInstance>();

// 设备运行响应式数据
const deviceRunList = ref<DeviceRunRow[]>([]);
const deviceRunIndicators = ref<DeviceRunIndicators>({
  totalDeviceCount: 0,
  averageOnlineRate: 0,
  averageRunningHours: 0,
  averageFaultRate: 0,
});
const deviceRunOnlineRateTrendData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '设备在线率(%)', data: [] }],
});
const deviceRunFaultTrendData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '故障发生趋势(%)', data: [] }],
});
const deviceRunTypeRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '设备类型分布占比(%)', data: [] }],
});
const deviceRunEfficiencyRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '运行效能等级占比(%)', data: [] }],
});
// 设备运行视图切换相关
const deviceRunChartRefreshKey = ref(0);
const activeDeviceRunView = ref('卡片');
const deviceRunViewBtnList = ref(['卡片', '折线图', '饼图', '列表']);
// 设备运行弹窗相关
const deviceRunDetailDialogVisible = ref(false);
const deviceRunMaintenanceDialogVisible = ref(false);
const activeDeviceRunDetailView = ref('运行日志');
const deviceRunDetailViewBtnList = ref(['运行日志', '故障记录', '维护历史']);
const deviceRunDetailSelectedRow = ref<DeviceRunDetail>({
  tbDeviceDeviceId: '',
  tbDeviceName: '',
  sysDeviceTypeName: '',
  tbParkingName: '',
  tbDeviceOperationMonthlyFaultCount: 0,
  tbDeviceMaintainNextTime: '',
  sysEfficiencyLevelName: '',
  runDetail: {
    tbDeviceOperationOnlineRate: 0,
    tbDeviceOperationDailyRunningHours: 0,
    tbDeviceOperationFaultRate: 0,
  },
  operationLogs: [],
  faultRecords: [],
  maintenanceHistory: []
});
// 运维表单
const maintenanceForm = ref<MaintenanceForm>({
  maintenanceType: '巡检',
  description: ''
});
const maintenanceFormRules = {
  maintenanceType: [{ required: true, message: '请选择运维类型', trigger: 'blur' }],
  description: [{ required: true, message: '请填写运维描述', trigger: 'blur' }]
};
const maintenanceFormRef = ref<FormInstance>();
const maintenanceTypeOptions = [
  { label: '巡检', value: '巡检' },
  { label: '维修', value: '维修' }
];

// 支撑资源响应式数据
const supportResourceList = ref<SupportResourceRow[]>([]);
const supportResourceIndicators = ref<SupportResourceIndicators>({
  totalResourceCount: 0,
  averageIntactRate: 0,
  coreTypeResourceCount: 0,
  maintainingResourceCount: 0,
});
const supportResourceTypeRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '类型占比(%)', data: [] }],
});
const supportResourceRegionRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '区域分布占比(%)', data: [] }],
});
const supportResourceTypeCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '资源数量', data: [] }],
});
const supportResourceParkingCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '资源数量', data: [] }],
});
// 支撑资源视图切换相关
const supportResourceChartRefreshKey = ref(0);
const activeSupportResourceView = ref('卡片');
const supportResourceViewBtnList = ref(['卡片', '饼图', '柱状图', '列表']);
// 支撑资源弹窗相关
const supportResourceDetailDialogVisible = ref(false);
const supportResourceMaintainDialogVisible = ref(false);
const activeSupportResourceDetailView = ref('配置明细');
const supportResourceDetailViewBtnList = ref(['配置明细', '维护记录', '使用统计']);
const supportResourceDetailSelectedRow = ref<SupportResourceDetail>({
  tbSupportResourceId: '',
  tbSupportResourceName: '',
  sysSupportTypeName: '',
  tbParkingName: '',
  tbSupportResourceQuantity: 0,
  tbSupportResourceAvailableQuantity: 0,
  tbSupportResourceIntactRate: 0,
  tbSupportMaintainMonthlyCount: 0,
  tbSupportResourceMaintainCycle: '',
  tbSupportResourceCoverageRatio: 0,
  resourceConfig: [],
  maintainRecords: [],
  usageStatistics: {
    xAxis: [],
    series: [{ name: '使用次数', data: [] }]
  }
});
// 维护表单
const maintainForm = ref<MaintainForm>({
  maintainPlan: ''
});
const maintainFormRules = {
  maintainPlan: [{ required: true, message: '维护需求不能为空', trigger: 'blur' }]
};
const maintainFormRef = ref<FormInstance>();

// 投诉处理响应式数据
const complaintList = ref<ComplaintRow[]>([]);
const complaintIndicators = ref<ComplaintIndicators>({
  totalComplaintCount: 0,
  processedCount: 0,
  processCompletionRate: 0,
  averageProcessDuration: 0,
  overallSatisfaction: 0,
});
const complaintTypeRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '投诉类型占比(%)', data: [] }],
});
const complaintResultRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '处理结果占比(%)', data: [] }],
});
const complaintSourceRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '投诉来源占比(%)', data: [] }],
});
const complaintNewTrendData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '投诉新增数', data: [] }],
});
const complaintProcessTrendData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '处理完成率(%)', data: [] }],
});
// 投诉处理视图切换相关
const complaintChartRefreshKey = ref(0);
const activeComplaintView = ref('卡片');
const complaintViewBtnList = ref(['卡片', '饼图', '折线图', '列表']);
// 投诉处理弹窗相关
const complaintDetailDialogVisible = ref(false);
const complaintProcessDialogVisible = ref(false);
const complaintReviewDialogVisible = ref(false);
const activeComplaintDetailView = ref('投诉内容');
const complaintDetailViewBtnList = ref(['投诉内容', '处理过程', '用户反馈']);
const complaintDetailSelectedRow = ref<ComplaintDetail>({
  tbComplaintId: '',
  tbComplaintComplaintNo: '',
  sysComplaintTypeName: '',
  tbComplaintSubmitTime: '',
  tbComplaintProcessDuration: null,
  sysComplaintResultName: '',
  tbComplaintUserSatisfaction: null,
  tbComplaintSource: '',
  sysUserUserName: '',
  sysReviewStatusName: '',
  complaintContent: {
    title: '',
    content: '',
    attachments: []
  },
  processRecords: [],
  userFeedback: {
    satisfaction: 0,
    comment: '',
    feedbackTime: ''
  }
});
// 处理表单
const complaintProcessForm = ref<ComplaintProcessForm>({
  processPlan: ''
});
const complaintProcessFormRules = {
  processPlan: [{ required: true, message: '处理方案不能为空', trigger: 'blur' }]
};
const complaintProcessFormRef = ref<FormInstance>();
// 复盘表单
const complaintReviewForm = ref<ComplaintReviewForm>({
  reviewOpinion: ''
});
const complaintReviewFormRef = ref<FormInstance>();

// 运维处置效率响应式数据
const maintainEfficiencyList = ref<MaintainEfficiencyRow[]>([]);
const maintainEfficiencyIndicators = ref<MaintainEfficiencyIndicators>({
  averageHandleDuration: 0,
  completionRate: 0,
  oneTimeSolveRate: 0,
  reworkRate: 0,
});
const maintainEfficiencyHandleDurationTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '处置时长(小时)', data: [] }],
});
const maintainEfficiencyCompletionRateTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '完成率(%)', data: [] }],
});
const maintainEfficiencyWorkorderTypeRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '工单类型占比(%)', data: [] }],
});
const maintainEfficiencyLevelRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '处置效率等级占比(%)', data: [] }],
});
const maintainEfficiencyReworkReasonRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '返工原因占比(%)', data: [] }],
});
// 运维处置效率视图切换相关
const maintainEfficiencyChartRefreshKey = ref(0);
const activeMaintainEfficiencyView = ref('卡片');
const maintainEfficiencyViewBtnList = ref(['卡片', '折线图', '饼图', '列表']);
// 运维处置效率弹窗相关
const maintainEfficiencyDetailDialogVisible = ref(false);
const maintainEfficiencyTrackDialogVisible = ref(false);
const maintainEfficiencyReviewDialogVisible = ref(false);
const maintainEfficiencyDetailSelectedRow = ref<MaintainEfficiencyDetail>({
  tbMaintainEfficiencyId: '',
  tbMaintainEfficiencyChainDurationChange: 0,
  sysWorkorderTypeName: '',
  sysEfficiencyLevelName: '',
  tbMaintainEfficiencyOvertimeCount: 0,
  detail: {
    tbMaintainEfficiencyAverageHandleDuration: 0,
    tbMaintainEfficiencyCompletionRate: 0,
    tbMaintainEfficiencyReworkRate: 0,
    tbMaintainEfficiencyOneTimeSolveRate: 0,
  }
});
const maintainEfficiencyTrackSelectedRow = ref<MaintainEfficiencyWorkorderTrack>({
  tbMaintainEfficiencyId: '',
  sysWorkorderTypeName: '',
  workorderList: []
});
// 复盘表单
const reviewForm = ref<ReviewForm>({
  reviewOpinion: ''
});
const reviewFormRules = {
  reviewOpinion: [{ required: false, message: '请输入效率优化意见', trigger: 'blur' }]
};
const reviewFormRef = ref<FormInstance>();

// 服务发展响应式数据
const serviceDevelopmentList = ref<ServiceDevelopmentRow[]>([]);
const serviceDevelopmentIndicators = ref<ServiceDevelopmentIndicators>({
  newServiceCount: 0,
  coverageRegionCount: 0,
  userGrowthRate: 0,
  serviceUtilizationRate: 0,
});
const serviceDevelopmentUserGrowthTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '用户增长率(%)', data: [] }],
});
const serviceDevelopmentServiceUtilizationTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '服务使用率(%)', data: [] }],
});
const serviceDevelopmentTypeCompareData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '服务数量', data: [] }],
});
const serviceDevelopmentRegionCoverageCompareData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '覆盖区域数', data: [] }],
});
const serviceDevelopmentTypeRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '服务类型占比(%)', data: [] }],
});
const serviceDevelopmentHighUtilizationRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '高使用率服务占比(%)', data: [] }],
});
// 服务发展视图切换相关
const serviceDevelopmentChartRefreshKey = ref(0);
const activeServiceDevelopmentView = ref('卡片');
const serviceDevelopmentViewBtnList = ref(['卡片', '折线图', '柱状图', '饼图', '列表']);
// 服务发展弹窗相关
const serviceDevelopmentDetailDialogVisible = ref(false);
const serviceDevelopmentUserGrowthDialogVisible = ref(false);
const serviceDevelopmentOptimizationDialogVisible = ref(false);
const activeServiceDevelopmentDetailView = ref('明细');
const serviceDevelopmentDetailViewBtnList = ref(['明细', '用户反馈', '覆盖区域']);
const serviceDevelopmentDetailSelectedRow = ref<ServiceDevelopmentDetail>({
  tbServiceDevelopmentId: '',
  sysServiceTypeName: '',
  tbServiceDevelopmentPeriod: '',
  tbServiceDevelopmentYearOnYearGrowth: 0,
  tbServiceDevelopmentTotalUserCount: 0,
  tbServiceDevelopmentOptimizationDemandCount: 0,
  detail: {
    tbServiceDevelopmentNewServiceCount: 0,
    tbServiceDevelopmentCoverageRegionCount: 0,
    tbServiceDevelopmentUserGrowthRate: 0,
    tbServiceDevelopmentServiceUtilizationRate: 0,
  },
  userFeedback: [],
  coverageRegionDetail: []
});
const serviceDevelopmentUserGrowthSelectedRow = ref<ServiceDevelopmentUserGrowthTrendDetail>({
  tbServiceDevelopmentId: '',
  sysServiceTypeName: '',
  xAxis: [],
  series: [{ name: '月度用户增长率(%)', data: [] }]
});
// 优化表单
const optimizationForm = ref<ServiceOptimizationForm>({
  optimizationPlan: ''
});
const optimizationFormRules = {
  optimizationPlan: [{ required: true, message: '优化建议不能为空', trigger: 'blur' }]
};
const optimizationFormRef = ref<FormInstance>();


// 资源运行接口请求方法
const getParkResourceRunListData = async () => {
  try {
    parkResourceRunList.value = (await fetchParkResourceRunList()) as ParkResourceRunRow[];
  } catch (error: any) {
    ElMessage.error(`资源运行列表加载失败：${error.message}`);
    parkResourceRunList.value = [];
  }
};

const getParkResourceRunIndicatorsData = async () => {
  try {
    parkResourceRunIndicators.value =
      (await fetchParkResourceRunIndicators()) as ParkResourceRunIndicators;
  } catch (error: any) {
    ElMessage.error(`核心指标加载失败：${error.message}`);
  }
};

const getParkResourceRunUtilizationTrendData = async () => {
  try {
    parkResourceRunUtilizationTrend.value =
      (await fetchParkResourceRunUtilizationTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`使用率趋势加载失败：${error.message}`);
  }
};

const getParkResourceRunTurnoverTrendData = async () => {
  try {
    parkResourceRunTurnoverTrend.value =
      (await fetchParkResourceRunTurnoverTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`周转率趋势加载失败：${error.message}`);
  }
};

const getParkResourceRunRegionRatioData = async () => {
  try {
    parkResourceRunRegionRatio.value =
      (await fetchParkResourceRunRegionRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`区域使用率占比加载失败：${error.message}`);
  }
};

const getParkResourceRunTimeRatioData = async () => {
  try {
    parkResourceRunTimeRatio.value =
      (await fetchParkResourceRunTimeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`时段使用率分布加载失败：${error.message}`);
  }
};

const getParkResourceRunDetailData = async (parkingId: string) => {
  try {
    parkResourceRunDetailSelectedRow.value = {
      ...parkResourceRunDetailSelectedRow.value,
      ...(await fetchParkResourceRunDetail(parkingId)),
    };
  } catch (error: any) {
    ElMessage.warning(`资源运行详情加载失败：${error.message}`);
  }
};

const getParkResourceRunTurnoverTimeTrendData = async (parkingId: string) => {
  try {
    parkResourceRunTurnoverSelectedRow.value = {
      ...parkResourceRunTurnoverSelectedRow.value,
      ...(await fetchParkResourceRunTurnoverTimeTrend(parkingId)),
    };
  } catch (error: any) {
    ElMessage.warning(`周转率时段趋势加载失败：${error.message}`);
  }
};

// 停车资源接口请求方法
const getParkResourceListData = async () => {
  try {
    parkResourceList.value = (await fetchParkResourceList()) as ParkResourceRow[];
  } catch (error: any) {
    ElMessage.error(`停车资源列表加载失败：${error.message}`);
    parkResourceList.value = [];
  }
};

const getParkResourceIndicatorsData = async () => {
  try {
    parkResourceIndicators.value =
      (await fetchParkResourceIndicators()) as ParkResourceIndicators;
  } catch (error: any) {
    ElMessage.error(`停车资源核心指标加载失败：${error.message}`);
  }
};

const getParkResourceAreaCountData = async () => {
  try {
    parkResourceAreaCountData.value =
      (await fetchParkResourceAreaCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`各区域停车场数量加载失败：${error.message}`);
  }
};

const getParkResourceTypeSpaceCountData = async () => {
  try {
    parkResourceTypeSpaceCountData.value =
      (await fetchParkResourceTypeSpaceCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`各类型泊位数加载失败：${error.message}`);
  }
};

const getParkResourceDetailData = async (parkingId: string) => {
  try {
    parkResourceDetailSelectedRow.value = {
      ...parkResourceDetailSelectedRow.value,
      ...(await fetchParkResourceDetail(parkingId)),
    };
  } catch (error: any) {
    ElMessage.warning(`停车资源详情加载失败：${error.message}`);
  }
};

// 服务质量接口请求方法
const getParkServiceQualityListData = async () => {
  try {
    parkServiceQualityList.value = (await fetchParkServiceQualityList()) as ParkServiceQualityRow[];
  } catch (error: any) {
    ElMessage.error(`服务质量列表加载失败：${error.message}`);
    parkServiceQualityList.value = [];
  }
};

const getParkServiceQualityIndicatorsData = async () => {
  try {
    parkServiceQualityIndicators.value =
      (await fetchParkServiceQualityIndicators()) as ParkServiceQualityIndicators;
  } catch (error: any) {
    ElMessage.error(`服务质量核心指标加载失败：${error.message}`);
  }
};

const getParkServiceQualityPaySuccessRateTrendData = async () => {
  try {
    parkServiceQualityPaySuccessRateTrend.value =
      (await fetchParkServiceQualityPaySuccessRateTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`缴费成功率趋势加载失败：${error.message}`);
  }
};

const getParkServiceQualitySatisfactionTrendData = async () => {
  try {
    parkServiceQualitySatisfactionTrend.value =
      (await fetchParkServiceQualitySatisfactionTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`用户满意度趋势加载失败：${error.message}`);
  }
};

const getParkServiceQualityRegionCompareData = async () => {
  try {
    parkServiceQualityRegionCompare.value =
      (await fetchParkServiceQualityRegionCompare()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`各区域服务质量指标对比加载失败：${error.message}`);
  }
};

const getParkServiceQualityTimeEntryCompareData = async () => {
  try {
    parkServiceQualityTimeEntryCompare.value =
      (await fetchParkServiceQualityTimeEntryCompare()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`各时段平均入场时长对比加载失败：${error.message}`);
  }
};

const getParkServiceQualityDetailData = async (serviceQualityId: string) => {
  try {
    parkServiceQualityDetailSelectedRow.value = {
      ...parkServiceQualityDetailSelectedRow.value,
      ...(await fetchParkServiceQualityDetail(serviceQualityId)),
    };
  } catch (error: any) {
    ElMessage.warning(`服务质量详情加载失败：${error.message}`);
  }
};

const getParkServiceQualityEvaluationDetailData = async (serviceQualityId: string) => {
  try {
    parkServiceQualityEvaluationSelectedRow.value = {
      ...parkServiceQualityEvaluationSelectedRow.value,
      ...(await fetchParkServiceQualityEvaluationDetail(serviceQualityId)),
    };
  } catch (error: any) {
    ElMessage.warning(`用户评价明细加载失败：${error.message}`);
  }
};

// 业务流转效率接口请求方法
const getBusinessFlowEfficiencyListData = async () => {
  try {
    businessFlowEfficiencyList.value = (await fetchBusinessFlowEfficiencyList()) as BusinessFlowEfficiencyRow[];
  } catch (error: any) {
    ElMessage.error(`业务流转效率列表加载失败：${error.message}`);
    businessFlowEfficiencyList.value = [];
  }
};

const getBusinessFlowEfficiencyIndicatorsData = async () => {
  try {
    businessFlowEfficiencyIndicators.value =
      (await fetchBusinessFlowEfficiencyIndicators()) as BusinessFlowEfficiencyIndicators;
  } catch (error: any) {
    ElMessage.error(`业务流转效率核心指标加载失败：${error.message}`);
  }
};

const getBusinessFlowDurationTrendData = async () => {
  try {
    businessFlowDurationTrend.value =
      (await fetchBusinessFlowDurationTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`流转时长趋势加载失败：${error.message}`);
  }
};

const getBusinessFlowCompletionRateTrendData = async () => {
  try {
    businessFlowCompletionRateTrend.value =
      (await fetchBusinessFlowCompletionRateTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`完成率趋势加载失败：${error.message}`);
  }
};

const getBusinessFlowTypeDurationData = async () => {
  try {
    businessFlowTypeDurationData.value =
      (await fetchBusinessFlowTypeDuration()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`各业务类型流转时长加载失败：${error.message}`);
  }
};

const getBusinessFlowLinkDurationData = async () => {
  try {
    businessFlowLinkDurationData.value =
      (await fetchBusinessFlowLinkDuration()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`各环节流转时长加载失败：${error.message}`);
  }
};

const getBusinessFlowEfficiencyDetailData = async (flowId: string) => {
  try {
    businessFlowDetailSelectedRow.value = {
      ...businessFlowDetailSelectedRow.value,
      ...(await fetchBusinessFlowEfficiencyDetail(flowId)),
    };
  } catch (error: any) {
    ElMessage.warning(`业务流转效率详情加载失败：${error.message}`);
  }
};

const getBusinessFlowBottleneckLinkTrendData = async (flowId: string) => {
  try {
    businessFlowBottleneckSelectedRow.value = {
      ...businessFlowBottleneckSelectedRow.value,
      ...(await fetchBusinessFlowBottleneckLinkTrend(flowId)),
    };
  } catch (error: any) {
    ElMessage.warning(`瓶颈环节流转时长趋势加载失败：${error.message}`);
  }
};

// 业务质量接口请求方法
const getBusinessQualityListData = async () => {
  try {
    businessQualityList.value = (await fetchBusinessQualityList()) as BusinessQualityRow[];
  } catch (error: any) {
    ElMessage.error(`业务质量列表加载失败：${error.message}`);
    businessQualityList.value = [];
  }
};

const getBusinessQualityIndicatorsData = async () => {
  try {
    businessQualityIndicators.value =
      (await fetchBusinessQualityIndicators()) as BusinessQualityIndicators;
  } catch (error: any) {
    ElMessage.error(`业务质量核心指标加载失败：${error.message}`);
  }
};

const getBusinessQualityBillingAccuracyTrendData = async () => {
  try {
    businessQualityBillingAccuracyTrend.value =
      (await fetchBusinessQualityBillingAccuracyTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`计费准确率趋势加载失败：${error.message}`);
  }
};

const getBusinessQualityComplianceRateTrendData = async () => {
  try {
    businessQualityComplianceRateTrend.value =
      (await fetchBusinessQualityComplianceRateTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`合规率趋势加载失败：${error.message}`);
  }
};

const getBusinessQualityAbnormalTypeRatioData = async () => {
  try {
    businessQualityAbnormalTypeRatio.value =
      (await fetchBusinessQualityAbnormalTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`异常类型占比加载失败：${error.message}`);
  }
};

const getBusinessQualityTypeDistributionRatioData = async () => {
  try {
    businessQualityTypeDistributionRatio.value =
      (await fetchBusinessQualityTypeDistributionRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`业务类型质量分布加载失败：${error.message}`);
  }
};

const getBusinessQualityDetailData = async (qualityId: string) => {
  try {
    businessQualityDetailSelectedRow.value = {
      ...businessQualityDetailSelectedRow.value,
      ...(await fetchBusinessQualityDetail(qualityId)),
    };
  } catch (error: any) {
    ElMessage.warning(`业务质量详情加载失败：${error.message}`);
  }
};

const getBusinessQualityAbnormalOrderListData = async (qualityId: string) => {
  try {
    businessQualityAbnormalOrderSelectedRow.value = {
      ...businessQualityAbnormalOrderSelectedRow.value,
      ...(await fetchBusinessQualityAbnormalOrderList(qualityId)),
    };
  } catch (error: any) {
    ElMessage.warning(`异常订单详情加载失败：${error.message}`);
  }
};

const submitRectificationData = async (qualityId: string) => {
  try {
    await rectificationFormRef.value?.validate();
    const res = await submitBusinessQualityRectification(qualityId, rectificationForm.value.rectificationPlan);
    if (res.success) {
      // 更新整改完成数
      businessQualityDetailSelectedRow.value.tbBusinessQualityRectificationCount = res.rectificationCount;
      tipDialogContent.value = '整改方案提交成功';
      tipDialogVisible.value = true;
      businessQualityRectificationDialogVisible.value = false;
      rectificationForm.value.rectificationPlan = '';
      rectificationFormRef.value?.resetFields();
    } else {
      tipDialogContent.value = '整改方案提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `整改方案提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

// 资源发展接口请求方法
const getResourceDevelopmentListData = async () => {
  try {
    resourceDevelopmentList.value = (await fetchResourceDevelopmentList()) as ResourceDevelopmentRow[];
  } catch (error: any) {
    ElMessage.error(`资源发展列表加载失败：${error.message}`);
    resourceDevelopmentList.value = [];
  }
};

const getResourceDevelopmentIndicatorsData = async () => {
  try {
    resourceDevelopmentIndicators.value =
      (await fetchResourceDevelopmentIndicators()) as ResourceDevelopmentIndicators;
  } catch (error: any) {
    ElMessage.error(`资源发展核心指标加载失败：${error.message}`);
  }
};

const getResourceDevelopmentNewTrendData = async () => {
  try {
    resourceDevelopmentNewTrendData.value =
      (await fetchResourceDevelopmentNewTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`资源新增趋势加载失败：${error.message}`);
  }
};

const getResourceDevelopmentPlanCompletionTrendData = async () => {
  try {
    resourceDevelopmentPlanCompletionTrendData.value =
      (await fetchResourceDevelopmentPlanCompletionTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`规划达成率趋势加载失败：${error.message}`);
  }
};

const getResourceDevelopmentTypeCountData = async () => {
  try {
    resourceDevelopmentTypeCountData.value =
      (await fetchResourceDevelopmentTypeCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`各类型资源发展数量加载失败：${error.message}`);
  }
};

const getResourceDevelopmentRegionCountData = async () => {
  try {
    resourceDevelopmentRegionCountData.value =
      (await fetchResourceDevelopmentRegionCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`各区域资源发展数量加载失败：${error.message}`);
  }
};

const getResourceDevelopmentTypeRatioData = async () => {
  try {
    resourceDevelopmentTypeRatioData.value =
      (await fetchResourceDevelopmentTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`资源发展类型占比加载失败：${error.message}`);
  }
};

const getResourceDevelopmentFocusRegionRatioData = async () => {
  try {
    resourceDevelopmentFocusRegionRatioData.value =
      (await fetchResourceDevelopmentFocusRegionRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`重点发展区域占比加载失败：${error.message}`);
  }
};

const getResourceDevelopmentDetailData = async (developmentId: string) => {
  try {
    resourceDevelopmentDetailSelectedRow.value = {
      ...resourceDevelopmentDetailSelectedRow.value,
      ...(await fetchResourceDevelopmentDetail(developmentId)),
    };
  } catch (error: any) {
    ElMessage.warning(`资源发展详情加载失败：${error.message}`);
  }
};

const getResourceDevelopmentMonthlyNewTrendData = async (developmentId: string) => {
  try {
    resourceDevelopmentMonthlySelectedRow.value = {
      ...resourceDevelopmentMonthlySelectedRow.value,
      ...(await fetchResourceDevelopmentMonthlyNewTrend(developmentId)),
    };
  } catch (error: any) {
    ElMessage.warning(`月度新增趋势加载失败：${error.message}`);
  }
};

const submitPlanAdjustmentData = async (developmentId: string) => {
  try {
    await planAdjustmentFormRef.value?.validate();
    const res = await submitResourceDevelopmentPlanAdjustment(developmentId, planAdjustmentForm.value.planContent);
    if (res.success) {
      tipDialogContent.value = '规划调整成功';
      tipDialogVisible.value = true;
      resourceDevelopmentPlanDialogVisible.value = false;
      planAdjustmentForm.value.planContent = '';
      planAdjustmentFormRef.value?.resetFields();
    } else {
      tipDialogContent.value = '规划调整失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `规划调整失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

// 设备运行接口请求方法
const getDeviceRunListData = async () => {
  try {
    deviceRunList.value = (await fetchDeviceRunList()) as DeviceRunRow[];
  } catch (error: any) {
    ElMessage.error(`设备运行列表加载失败：${error.message}`);
    deviceRunList.value = [];
  }
};

const getDeviceRunIndicatorsData = async () => {
  try {
    deviceRunIndicators.value =
      (await fetchDeviceRunIndicators()) as DeviceRunIndicators;
  } catch (error: any) {
    ElMessage.error(`设备运行核心指标加载失败：${error.message}`);
  }
};

const getDeviceRunOnlineRateTrendData = async () => {
  try {
    deviceRunOnlineRateTrendData.value =
      (await fetchDeviceRunOnlineRateTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`设备在线率趋势加载失败：${error.message}`);
  }
};

const getDeviceRunFaultTrendData = async () => {
  try {
    deviceRunFaultTrendData.value =
      (await fetchDeviceRunFaultTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`故障发生趋势加载失败：${error.message}`);
  }
};

const getDeviceRunTypeRatioData = async () => {
  try {
    deviceRunTypeRatioData.value =
      (await fetchDeviceRunTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`设备类型分布占比加载失败：${error.message}`);
  }
};

const getDeviceRunEfficiencyRatioData = async () => {
  try {
    deviceRunEfficiencyRatioData.value =
      (await fetchDeviceRunEfficiencyRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`运行效能等级占比加载失败：${error.message}`);
  }
};

const getDeviceRunDetailData = async (deviceId: string) => {
  try {
    deviceRunDetailSelectedRow.value = {
      ...deviceRunDetailSelectedRow.value,
      ...(await fetchDeviceRunDetail(deviceId)),
    };
  } catch (error: any) {
    ElMessage.warning(`设备运行详情加载失败：${error.message}`);
  }
};

const submitMaintenanceOrderData = async (deviceId: string) => {
  try {
    await maintenanceFormRef.value?.validate();
    const res = await submitDeviceMaintenanceOrder(
      deviceId,
      maintenanceForm.value.maintenanceType,
      maintenanceForm.value.description
    );
    if (res.success) {
      tipDialogContent.value = `运维工单生成成功，工单号：${res.orderId}`;
      tipDialogVisible.value = true;
      deviceRunMaintenanceDialogVisible.value = false;
      maintenanceForm.value.maintenanceType = '巡检';
      maintenanceForm.value.description = '';
      maintenanceFormRef.value?.resetFields();
    } else {
      tipDialogContent.value = '运维工单生成失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `运维工单生成失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

// 支撑资源接口请求方法
const getSupportResourceListData = async () => {
  try {
    supportResourceList.value = (await fetchSupportResourceList()) as SupportResourceRow[];
  } catch (error: any) {
    ElMessage.error(`支撑资源列表加载失败：${error.message}`);
    supportResourceList.value = [];
  }
};

const getSupportResourceIndicatorsData = async () => {
  try {
    supportResourceIndicators.value =
      (await fetchSupportResourceIndicators()) as SupportResourceIndicators;
  } catch (error: any) {
    ElMessage.error(`支撑资源核心指标加载失败：${error.message}`);
  }
};

const getSupportResourceTypeRatioData = async () => {
  try {
    supportResourceTypeRatio.value =
      (await fetchSupportResourceTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`支撑资源类型占比加载失败：${error.message}`);
  }
};

const getSupportResourceRegionRatioData = async () => {
  try {
    supportResourceRegionRatio.value =
      (await fetchSupportResourceRegionRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`各区域支撑资源分布加载失败：${error.message}`);
  }
};

const getSupportResourceTypeCountData = async () => {
  try {
    supportResourceTypeCountData.value =
      (await fetchSupportResourceTypeCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`各类型支撑资源数量加载失败：${error.message}`);
  }
};

const getSupportResourceParkingCountData = async () => {
  try {
    supportResourceParkingCountData.value =
      (await fetchSupportResourceParkingCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`各停车场支撑资源配置加载失败：${error.message}`);
  }
};

const getSupportResourceDetailData = async (resourceId: string) => {
  try {
    supportResourceDetailSelectedRow.value = {
      ...supportResourceDetailSelectedRow.value,
      ...(await fetchSupportResourceDetail(resourceId)),
    };
  } catch (error: any) {
    ElMessage.warning(`支撑资源详情加载失败：${error.message}`);
  }
};

const submitMaintainData = async (resourceId: string) => {
  try {
    await maintainFormRef.value?.validate();
    const res = await submitSupportMaintainRequest(resourceId, maintainForm.value.maintainPlan);
    if (res.success) {
      tipDialogContent.value = `维护工单已生成，工单号：${res.orderNo}`;
      tipDialogVisible.value = true;
      supportResourceMaintainDialogVisible.value = false;
      maintainForm.value.maintainPlan = '';
      maintainFormRef.value?.resetFields();
    } else {
      tipDialogContent.value = '维护工单生成失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `维护工单生成失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

// 投诉处理接口请求方法
const getComplaintListData = async () => {
  try {
    complaintList.value = (await fetchComplaintList()) as ComplaintRow[];
  } catch (error: any) {
    ElMessage.error(`投诉处理列表加载失败：${error.message}`);
    complaintList.value = [];
  }
};

const getComplaintIndicatorsData = async () => {
  try {
    complaintIndicators.value =
      (await fetchComplaintIndicators()) as ComplaintIndicators;
  } catch (error: any) {
    ElMessage.error(`投诉处理核心指标加载失败：${error.message}`);
  }
};

const getComplaintTypeRatioData = async () => {
  try {
    complaintTypeRatio.value =
      (await fetchComplaintTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`投诉类型占比加载失败：${error.message}`);
  }
};

const getComplaintResultRatioData = async () => {
  try {
    complaintResultRatio.value =
      (await fetchComplaintResultRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`处理结果占比加载失败：${error.message}`);
  }
};

const getComplaintSourceRatioData = async () => {
  try {
    complaintSourceRatio.value =
      (await fetchComplaintSourceRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`投诉来源占比加载失败：${error.message}`);
  }
};

const getComplaintNewTrendData = async () => {
  try {
    complaintNewTrendData.value =
      (await fetchComplaintNewTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`投诉新增趋势加载失败：${error.message}`);
  }
};

const getComplaintProcessTrendData = async () => {
  try {
    complaintProcessTrendData.value =
      (await fetchComplaintProcessTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`处理完成趋势加载失败：${error.message}`);
  }
};

const getComplaintDetailData = async (complaintId: string) => {
  try {
    complaintDetailSelectedRow.value = {
      ...complaintDetailSelectedRow.value,
      ...(await fetchComplaintDetail(complaintId)),
    };
  } catch (error: any) {
    ElMessage.warning(`投诉处理详情加载失败：${error.message}`);
  }
};

const submitComplaintProcessData = async (complaintId: string) => {
  try {
    await complaintProcessFormRef.value?.validate();
    const res = await submitComplaintProcess(complaintId, complaintProcessForm.value.processPlan);
    if (res.success) {
      tipDialogContent.value = `处理方案已提交，预计处理时长${res.processDuration}小时`;
      tipDialogVisible.value = true;
      complaintProcessDialogVisible.value = false;
      complaintProcessForm.value.processPlan = '';
      complaintProcessFormRef.value?.resetFields();
      // 刷新列表数据
      await getComplaintListData();
    } else {
      tipDialogContent.value = '处理方案提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `处理方案提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

const submitComplaintReviewData = async (complaintId: string) => {
  try {
    const res = await submitComplaintReview(complaintId, complaintReviewForm.value.reviewOpinion);
    if (res.success) {
      tipDialogContent.value = '复盘意见已保存';
      tipDialogVisible.value = true;
      complaintReviewDialogVisible.value = false;
      complaintReviewForm.value.reviewOpinion = '';
      complaintReviewFormRef.value?.resetFields();
    } else {
      tipDialogContent.value = '复盘意见保存失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `复盘意见保存失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

// 运维处置效率接口请求方法
const getMaintainEfficiencyListData = async () => {
  try {
    maintainEfficiencyList.value = (await fetchMaintainEfficiencyList()) as MaintainEfficiencyRow[];
  } catch (error: any) {
    ElMessage.error(`运维处置效率列表加载失败：${error.message}`);
    maintainEfficiencyList.value = [];
  }
};

const getMaintainEfficiencyIndicatorsData = async () => {
  try {
    maintainEfficiencyIndicators.value =
      (await fetchMaintainEfficiencyIndicators()) as MaintainEfficiencyIndicators;
  } catch (error: any) {
    ElMessage.error(`运维处置效率核心指标加载失败：${error.message}`);
  }
};

const getMaintainEfficiencyHandleDurationTrendData = async () => {
  try {
    maintainEfficiencyHandleDurationTrend.value =
      (await fetchMaintainEfficiencyHandleDurationTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`处置时长趋势加载失败：${error.message}`);
  }
};

const getMaintainEfficiencyCompletionRateTrendData = async () => {
  try {
    maintainEfficiencyCompletionRateTrend.value =
      (await fetchMaintainEfficiencyCompletionRateTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`完成率趋势加载失败：${error.message}`);
  }
};

const getMaintainEfficiencyWorkorderTypeRatioData = async () => {
  try {
    maintainEfficiencyWorkorderTypeRatio.value =
      (await fetchMaintainEfficiencyWorkorderTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`工单类型占比加载失败：${error.message}`);
  }
};

const getMaintainEfficiencyLevelRatioData = async () => {
  try {
    maintainEfficiencyLevelRatio.value =
      (await fetchMaintainEfficiencyLevelRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`处置效率等级占比加载失败：${error.message}`);
  }
};

const getMaintainEfficiencyReworkReasonRatioData = async () => {
  try {
    maintainEfficiencyReworkReasonRatio.value =
      (await fetchMaintainEfficiencyReworkReasonRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`返工原因占比加载失败：${error.message}`);
  }
};

const getMaintainEfficiencyDetailData = async (maintainId: string) => {
  try {
    maintainEfficiencyDetailSelectedRow.value = {
      ...maintainEfficiencyDetailSelectedRow.value,
      ...(await fetchMaintainEfficiencyDetail(maintainId)),
    };
  } catch (error: any) {
    ElMessage.warning(`运维处置效率详情加载失败：${error.message}`);
  }
};

const getMaintainEfficiencyWorkorderTrackListData = async (maintainId: string) => {
  try {
    maintainEfficiencyTrackSelectedRow.value = {
      ...maintainEfficiencyTrackSelectedRow.value,
      ...(await fetchMaintainEfficiencyWorkorderTrackList(maintainId)),
    };
  } catch (error: any) {
    ElMessage.warning(`高频工单跟踪列表加载失败：${error.message}`);
  }
};

const submitMaintainEfficiencyReviewData = async (maintainId: string) => {
  try {
    await reviewFormRef.value?.validate();
    const res = await submitMaintainEfficiencyReview(maintainId, reviewForm.value.reviewOpinion);
    if (res.success) {
      tipDialogContent.value = '效率优化意见提交成功';
      tipDialogVisible.value = true;
      maintainEfficiencyReviewDialogVisible.value = false;
      reviewForm.value.reviewOpinion = '';
      reviewFormRef.value?.resetFields();
    } else {
      tipDialogContent.value = '效率优化意见提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `效率优化意见提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

// 服务发展接口请求方法
const getServiceDevelopmentListData = async () => {
  try {
    serviceDevelopmentList.value = (await fetchServiceDevelopmentList()) as ServiceDevelopmentRow[];
  } catch (error: any) {
    ElMessage.error(`服务发展列表加载失败：${error.message}`);
    serviceDevelopmentList.value = [];
  }
};

const getServiceDevelopmentIndicatorsData = async () => {
  try {
    serviceDevelopmentIndicators.value =
      (await fetchServiceDevelopmentIndicators()) as ServiceDevelopmentIndicators;
  } catch (error: any) {
    ElMessage.error(`服务发展核心指标加载失败：${error.message}`);
  }
};

const getServiceDevelopmentUserGrowthTrendData = async () => {
  try {
    serviceDevelopmentUserGrowthTrend.value =
      (await fetchServiceDevelopmentUserGrowthTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`用户增长趋势加载失败：${error.message}`);
  }
};

const getServiceDevelopmentServiceUtilizationTrendData = async () => {
  try {
    serviceDevelopmentServiceUtilizationTrend.value =
      (await fetchServiceDevelopmentServiceUtilizationTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`服务使用率趋势加载失败：${error.message}`);
  }
};

const getServiceDevelopmentTypeCompareData = async () => {
  try {
    serviceDevelopmentTypeCompareData.value =
      (await fetchServiceDevelopmentTypeCompare()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`各类型服务发展数量对比加载失败：${error.message}`);
  }
};

const getServiceDevelopmentRegionCoverageCompareData = async () => {
  try {
    serviceDevelopmentRegionCoverageCompareData.value =
      (await fetchServiceDevelopmentRegionCoverageCompare()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`各区域服务覆盖对比加载失败：${error.message}`);
  }
};

const getServiceDevelopmentTypeRatioData = async () => {
  try {
    serviceDevelopmentTypeRatio.value =
      (await fetchServiceDevelopmentTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`服务类型占比加载失败：${error.message}`);
  }
};

const getServiceDevelopmentHighUtilizationRatioData = async () => {
  try {
    serviceDevelopmentHighUtilizationRatio.value =
      (await fetchServiceDevelopmentHighUtilizationRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`高使用率服务占比加载失败：${error.message}`);
  }
};

const getServiceDevelopmentDetailData = async (serviceDevelopmentId: string) => {
  try {
    serviceDevelopmentDetailSelectedRow.value = {
      ...serviceDevelopmentDetailSelectedRow.value,
      ...(await fetchServiceDevelopmentDetail(serviceDevelopmentId)),
    };
  } catch (error: any) {
    ElMessage.warning(`服务发展详情加载失败：${error.message}`);
  }
};

const getServiceDevelopmentUserGrowthTrendDetailData = async (serviceDevelopmentId: string) => {
  try {
    serviceDevelopmentUserGrowthSelectedRow.value = {
      ...serviceDevelopmentUserGrowthSelectedRow.value,
      ...(await fetchServiceDevelopmentUserGrowthTrendDetail(serviceDevelopmentId)),
    };
  } catch (error: any) {
    ElMessage.warning(`用户增长趋势详情加载失败：${error.message}`);
  }
};

const submitOptimizationData = async (serviceDevelopmentId: string) => {
  try {
    await optimizationFormRef.value?.validate();
    const res = await submitServiceDevelopmentOptimization(serviceDevelopmentId, optimizationForm.value.optimizationPlan);
    if (res.success) {
      tipDialogContent.value = '优化建议提交成功';
      tipDialogVisible.value = true;
      serviceDevelopmentOptimizationDialogVisible.value = false;
      optimizationForm.value.optimizationPlan = '';
      optimizationFormRef.value?.resetFields();
    } else {
      tipDialogContent.value = '优化建议提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `优化建议提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};


// 资源运行视图切换
const changeResourceRunView = (viewName: string) => {
  activeResourceRunView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '饼图' || viewName === '折线图') &&
  nextTick(() => resourceRunChartRefreshKey.value++);
};
const changeResourceRunDetailView = (viewName: string) => {
  activeResourceRunDetailView.value = viewName;
};
// 资源运行弹窗方法
const openResourceRunDetailDialog = async (row: ParkResourceRunRow) => {
  await getParkResourceRunDetailData(row.tbParkingParkingId);
  resourceRunDetailDialogVisible.value = true;
};
const closeResourceRunDetailDialog = () => {
  resourceRunDetailDialogVisible.value = false;
  parkResourceRunDetailSelectedRow.value = {
    tbParkingParkingId: '',
    tbParkingName: '',
    tbRegionName: '',
    tbParkingOperationChainUtilizationChange: 0,
    tbParkingOperationMonthlyMaxUtilization: 0,
    tbParkingOperationPeakHour: '',
    runDetail: {
      tbParkingSpaceTotalCount: 0,
      tbParkingOperationDailyUtilizationRate: 0,
      tbParkingOperationTurnoverRate: 0,
      tbParkingOperationPeakUtilizationRate: 0,
    },
    timeDistribution: {
      xAxis: [],
      series: [{ name: '时段使用率(%)', data: [] }],
    },
    abnormalRecords: [],
  };
  activeResourceRunDetailView.value = '明细';
};
const openResourceRunTurnoverDialog = async (row: ParkResourceRunRow) => {
  await getParkResourceRunTurnoverTimeTrendData(row.tbParkingParkingId);
  resourceRunTurnoverDialogVisible.value = true;
};
const closeResourceRunTurnoverDialog = () => {
  resourceRunTurnoverDialogVisible.value = false;
  parkResourceRunTurnoverSelectedRow.value = {
    tbParkingParkingId: '',
    tbParkingName: '',
    xAxis: [],
    series: [{ name: '时段周转率', data: [] }],
  };
};
// 资源运行数据刷新
const refreshResourceRunData = async () => {
  await Promise.all([
    getParkResourceRunListData(),
    getParkResourceRunIndicatorsData(),
    getParkResourceRunUtilizationTrendData(),
    getParkResourceRunTurnoverTrendData(),
    getParkResourceRunRegionRatioData(),
    getParkResourceRunTimeRatioData(),
  ]);
  resourceRunChartRefreshKey.value++;
  ElMessage.success('数据刷新成功');
};

// 停车资源视图切换
const changeParkResourceView = (viewName: string) => {
  activeParkResourceView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  viewName === '柱状图' &&
  nextTick(() => parkResourceChartRefreshKey.value++);
};
// 停车资源弹窗方法
const openParkResourceDetailDialog = async (row: ParkResourceRow) => {
  await getParkResourceDetailData(row.tbParkingId);
  parkResourceDetailDialogVisible.value = true;
};
const closeParkResourceDetailDialog = () => {
  parkResourceDetailDialogVisible.value = false;
  parkResourceDetailSelectedRow.value = {
    tbParkingId: '',
    tbParkingName: '',
    tbRegionName: '',
    sysParkingTypeName: '',
    tbParkingSpaceTotalCount: 0,
    tbParkingSpaceAvailableCount: 0,
    sysOperationStatusName: '',
    tbParkingSaturationRate: 0,
    tbParkingOperationYears: 0,
    tbParkingNewEnergyRatio: 0,
    tbParkingCode: '',
    spaceDistribution: {
      legend: [],
      series: [{ name: '车位分布', data: [] }]
    },
    operationQualifications: []
  };
};
// 停车资源刷新数据
const refreshParkResourceData = async () => {
  await Promise.all([
    getParkResourceListData(),
    getParkResourceIndicatorsData(),
    getParkResourceAreaCountData(),
    getParkResourceTypeSpaceCountData(),
  ]);
  parkResourceChartRefreshKey.value++;
  ElMessage.success('停车资源数据刷新成功');
};

// 服务质量视图切换
const changeServiceQualityView = (viewName: string) => {
  activeServiceQualityView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '折线图' || viewName === '柱状图') &&
  nextTick(() => serviceQualityChartRefreshKey.value++);
};
const changeServiceQualityDetailView = (viewName: string) => {
  activeServiceQualityDetailView.value = viewName;
};
// 服务质量弹窗方法
const openServiceQualityDetailDialog = async (row: ParkServiceQualityRow) => {
  await getParkServiceQualityDetailData(row.tbServiceQualityId);
  serviceQualityDetailDialogVisible.value = true;
};
const closeServiceQualityDetailDialog = () => {
  serviceQualityDetailDialogVisible.value = false;
  parkServiceQualityDetailSelectedRow.value = {
    tbServiceQualityId: '',
    tbServiceQualityPeriod: '',
    tbServiceQualityChainChangeRate: 0,
    tbServiceQualityIndustryAverageCompare: 0,
    tbServiceQualityBestServiceHour: '',
    tbServiceQualityAbnormalCount: 0,
    detail: {
      tbServiceQualityAverageEntryTime: 0,
      tbServiceQualityAveragePayTime: 0,
      tbServiceQualityPaySuccessRate: 0,
      tbServiceQualityComplaintRate: 0,
      tbServiceQualitySatisfactionRate: 0,
    },
    abnormalRecords: [],
    evaluationSummary: {
      positive: 0,
      negative: 0,
      neutral: 0,
      keyWords: []
    }
  };
  activeServiceQualityDetailView.value = '明细';
};
const openServiceQualityEvaluationDialog = async (row: ParkServiceQualityRow) => {
  await getParkServiceQualityEvaluationDetailData(row.tbServiceQualityId);
  serviceQualityEvaluationDialogVisible.value = true;
};
const closeServiceQualityEvaluationDialog = () => {
  serviceQualityEvaluationDialogVisible.value = false;
  parkServiceQualityEvaluationSelectedRow.value = {
    tbServiceQualityId: '',
    tbServiceQualityPeriod: '',
    evaluationList: []
  };
};
// 服务质量数据刷新
const refreshServiceQualityData = async () => {
  await Promise.all([
    getParkServiceQualityListData(),
    getParkServiceQualityIndicatorsData(),
    getParkServiceQualityPaySuccessRateTrendData(),
    getParkServiceQualitySatisfactionTrendData(),
    getParkServiceQualityRegionCompareData(),
    getParkServiceQualityTimeEntryCompareData(),
  ]);
  serviceQualityChartRefreshKey.value++;
  ElMessage.success('服务质量数据刷新成功');
};

// 业务流转效率视图切换
const changeBusinessFlowView = (viewName: string) => {
  activeBusinessFlowView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '折线图' || viewName === '柱状图') &&
  nextTick(() => businessFlowChartRefreshKey.value++);
};
const changeBusinessFlowDetailView = (viewName: string) => {
  activeBusinessFlowDetailView.value = viewName;
};
// 业务流转效率弹窗方法
const openBusinessFlowDetailDialog = async (row: BusinessFlowEfficiencyRow) => {
  await getBusinessFlowEfficiencyDetailData(row.tbBusinessFlowId);
  businessFlowDetailDialogVisible.value = true;
};
const closeBusinessFlowDetailDialog = () => {
  businessFlowDetailDialogVisible.value = false;
  businessFlowDetailSelectedRow.value = {
    tbBusinessFlowId: '',
    sysBusinessTypeName: '',
    tbBusinessFlowPeriod: '',
    tbBusinessFlowChainDurationChange: 0,
    tbBusinessFlowCoreBottleneck: '',
    tbBusinessFlowBestFlowHour: '',
    tbBusinessFlowStandardDuration: 0,
    flowDetail: {
      tbBusinessFlowAverageFlowDuration: 0,
      tbBusinessFlowCompletionRate: 0,
      tbBusinessFlowBottleneckRatio: 0,
      tbBusinessFlowOvertimeRate: 0,
    },
    bottleneckAnalysis: {
      linkName: '',
      bottleneckRatio: 0,
      averageDuration: 0,
      standardDuration: 0,
      reason: '',
    },
    optimizationSuggestion: [],
    trendData: {
      xAxis: [],
      series: [{ name: '流转时长(小时)', data: [] }]
    }
  };
  activeBusinessFlowDetailView.value = '明细';
};
const openBusinessFlowBottleneckDialog = async (row: BusinessFlowEfficiencyRow) => {
  await getBusinessFlowBottleneckLinkTrendData(row.tbBusinessFlowId);
  businessFlowBottleneckDialogVisible.value = true;
};
const closeBusinessFlowBottleneckDialog = () => {
  businessFlowBottleneckDialogVisible.value = false;
  businessFlowBottleneckSelectedRow.value = {
    tbBusinessFlowId: '',
    sysBusinessTypeName: '',
    xAxis: [],
    series: [{ name: '瓶颈环节流转时长(小时)', data: [] }]
  };
};
// 业务流转效率数据刷新
const refreshBusinessFlowData = async () => {
  await Promise.all([
    getBusinessFlowEfficiencyListData(),
    getBusinessFlowEfficiencyIndicatorsData(),
    getBusinessFlowDurationTrendData(),
    getBusinessFlowCompletionRateTrendData(),
    getBusinessFlowTypeDurationData(),
    getBusinessFlowLinkDurationData(),
  ]);
  businessFlowChartRefreshKey.value++;
  ElMessage.success('业务流转效率数据刷新成功');
};

// 业务质量视图切换
const changeBusinessQualityView = (viewName: string) => {
  activeBusinessQualityView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '折线图' || viewName === '饼图') &&
  nextTick(() => businessQualityChartRefreshKey.value++);
};
const changeBusinessQualityDetailView = (viewName: string) => {
  activeBusinessQualityDetailView.value = viewName;
};
// 业务质量弹窗方法
const openBusinessQualityDetailDialog = async (row: BusinessQualityRow) => {
  await getBusinessQualityDetailData(row.tbBusinessQualityId);
  businessQualityDetailDialogVisible.value = true;
};
const closeBusinessQualityDetailDialog = () => {
  businessQualityDetailDialogVisible.value = false;
  businessQualityDetailSelectedRow.value = {
    tbBusinessQualityId: '',
    sysBusinessTypeName: '',
    tbBusinessQualityPeriod: '',
    tbBusinessQualityBillingAccuracy: 0,
    tbBusinessQualityOrderSuccessRate: 0,
    tbBusinessQualityAbnormalOrderCount: 0,
    tbBusinessQualityComplianceRate: 0,
    tbBusinessQualityAbnormalRate: 0,
    tbBusinessQualityChainAccuracyChange: 0,
    sysAbnormalTypeName: '',
    tbBusinessQualityRectificationCount: 0,
    abnormalOrderList: [],
    complianceCheckRecords: []
  };
  activeBusinessQualityDetailView.value = '明细';
};
const openBusinessQualityAbnormalOrderDialog = async (row: BusinessQualityRow) => {
  await getBusinessQualityAbnormalOrderListData(row.tbBusinessQualityId);
  businessQualityAbnormalOrderDialogVisible.value = true;
};
const closeBusinessQualityAbnormalOrderDialog = () => {
  businessQualityAbnormalOrderDialogVisible.value = false;
  businessQualityAbnormalOrderSelectedRow.value = {
    tbBusinessQualityId: '',
    sysBusinessTypeName: '',
    abnormalOrderList: []
  };
};
const openBusinessQualityRectificationDialog = () => {
  businessQualityRectificationDialogVisible.value = true;
};
const closeBusinessQualityRectificationDialog = () => {
  businessQualityRectificationDialogVisible.value = false;
  rectificationForm.value.rectificationPlan = '';
  rectificationFormRef.value?.resetFields();
};
// 业务质量数据刷新
const refreshBusinessQualityData = async () => {
  await Promise.all([
    getBusinessQualityListData(),
    getBusinessQualityIndicatorsData(),
    getBusinessQualityBillingAccuracyTrendData(),
    getBusinessQualityComplianceRateTrendData(),
    getBusinessQualityAbnormalTypeRatioData(),
    getBusinessQualityTypeDistributionRatioData(),
  ]);
  businessQualityChartRefreshKey.value++;
  ElMessage.success('业务质量数据刷新成功');
};

// 资源发展视图切换
const changeResourceDevelopmentView = (viewName: string) => {
  activeResourceDevelopmentView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '折线图' || viewName === '柱状图' || viewName === '饼图') &&
  nextTick(() => resourceDevelopmentChartRefreshKey.value++);
};
const changeResourceDevelopmentDetailView = (viewName: string) => {
  activeResourceDevelopmentDetailView.value = viewName;
};
// 资源发展弹窗方法
const openResourceDevelopmentDetailDialog = async (row: ResourceDevelopmentRow) => {
  await getResourceDevelopmentDetailData(row.developmentId);
  resourceDevelopmentDetailDialogVisible.value = true;
};
const closeResourceDevelopmentDetailDialog = () => {
  resourceDevelopmentDetailDialogVisible.value = false;
  resourceDevelopmentDetailSelectedRow.value = {
    developmentId: '',
    sysResourceTypeName: '',
    tbResourceDevelopmentPeriod: '',
    tbResourceDevelopmentYearOnYearGrowth: 0,
    tbResourceDevelopmentTotalAccumulated: 0,
    tbRegionName: '',
    tbResourceDevelopmentDevelopmentGap: 0,
    developmentDetail: {
      tbResourceDevelopmentNewCount: 0,
      tbResourceDevelopmentExpansionCount: 0,
      tbResourceDevelopmentOptimizationCount: 0,
      tbResourceDevelopmentPlanCompletionRate: 0,
    },
    regionDistribution: {
      legend: [],
      series: [{ name: '区域分布数量', data: [] }]
    },
    planDetails: []
  };
  activeResourceDevelopmentDetailView.value = '明细';
};
const openResourceDevelopmentMonthlyDialog = async (row: ResourceDevelopmentRow) => {
  await getResourceDevelopmentMonthlyNewTrendData(row.developmentId);
  resourceDevelopmentMonthlyDialogVisible.value = true;
};
const closeResourceDevelopmentMonthlyDialog = () => {
  resourceDevelopmentMonthlyDialogVisible.value = false;
  resourceDevelopmentMonthlySelectedRow.value = {
    developmentId: '',
    sysResourceTypeName: '',
    xAxis: [],
    series: [{ name: '月度新增数量', data: [] }]
  };
};
const openResourceDevelopmentPlanDialog = () => {
  resourceDevelopmentPlanDialogVisible.value = true;
};
const closeResourceDevelopmentPlanDialog = () => {
  resourceDevelopmentPlanDialogVisible.value = false;
  planAdjustmentForm.value.planContent = '';
  planAdjustmentFormRef.value?.resetFields();
};
// 资源发展数据刷新
const refreshResourceDevelopmentData = async () => {
  await Promise.all([
    getResourceDevelopmentListData(),
    getResourceDevelopmentIndicatorsData(),
    getResourceDevelopmentNewTrendData(),
    getResourceDevelopmentPlanCompletionTrendData(),
    getResourceDevelopmentTypeCountData(),
    getResourceDevelopmentRegionCountData(),
    getResourceDevelopmentTypeRatioData(),
    getResourceDevelopmentFocusRegionRatioData(),
  ]);
  resourceDevelopmentChartRefreshKey.value++;
  ElMessage.success('资源发展数据刷新成功');
};

// 设备运行视图切换
const changeDeviceRunView = (viewName: string) => {
  activeDeviceRunView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '折线图' || viewName === '饼图') &&
  nextTick(() => deviceRunChartRefreshKey.value++);
};
const changeDeviceRunDetailView = (viewName: string) => {
  activeDeviceRunDetailView.value = viewName;
};
// 设备运行弹窗方法
const openDeviceRunDetailDialog = async (row: DeviceRunRow) => {
  await getDeviceRunDetailData(row.tbDeviceDeviceId);
  deviceRunDetailDialogVisible.value = true;
};
const closeDeviceRunDetailDialog = () => {
  deviceRunDetailDialogVisible.value = false;
  deviceRunDetailSelectedRow.value = {
    tbDeviceDeviceId: '',
    tbDeviceName: '',
    sysDeviceTypeName: '',
    tbParkingName: '',
    tbDeviceOperationMonthlyFaultCount: 0,
    tbDeviceMaintainNextTime: '',
    sysEfficiencyLevelName: '',
    runDetail: {
      tbDeviceOperationOnlineRate: 0,
      tbDeviceOperationDailyRunningHours: 0,
      tbDeviceOperationFaultRate: 0,
    },
    operationLogs: [],
    faultRecords: [],
    maintenanceHistory: []
  };
  activeDeviceRunDetailView.value = '运行日志';
};
const openDeviceRunMaintenanceDialog = () => {
  deviceRunMaintenanceDialogVisible.value = true;
};
const closeDeviceRunMaintenanceDialog = () => {
  deviceRunMaintenanceDialogVisible.value = false;
  maintenanceForm.value.maintenanceType = '巡检';
  maintenanceForm.value.description = '';
  maintenanceFormRef.value?.resetFields();
};
// 设备运行数据刷新
const refreshDeviceRunData = async () => {
  await Promise.all([
    getDeviceRunListData(),
    getDeviceRunIndicatorsData(),
    getDeviceRunOnlineRateTrendData(),
    getDeviceRunFaultTrendData(),
    getDeviceRunTypeRatioData(),
    getDeviceRunEfficiencyRatioData(),
  ]);
  deviceRunChartRefreshKey.value++;
  ElMessage.success('设备运行数据刷新成功');
};

// 支撑资源视图切换
const changeSupportResourceView = (viewName: string) => {
  activeSupportResourceView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '饼图' || viewName === '柱状图') &&
  nextTick(() => supportResourceChartRefreshKey.value++);
};
const changeSupportResourceDetailView = (viewName: string) => {
  activeSupportResourceDetailView.value = viewName;
};
// 支撑资源弹窗方法
const openSupportResourceDetailDialog = async (row: SupportResourceRow) => {
  await getSupportResourceDetailData(row.tbSupportResourceId);
  supportResourceDetailDialogVisible.value = true;
};
const closeSupportResourceDetailDialog = () => {
  supportResourceDetailDialogVisible.value = false;
  supportResourceDetailSelectedRow.value = {
    tbSupportResourceId: '',
    tbSupportResourceName: '',
    sysSupportTypeName: '',
    tbParkingName: '',
    tbSupportResourceQuantity: 0,
    tbSupportResourceAvailableQuantity: 0,
    tbSupportResourceIntactRate: 0,
    tbSupportMaintainMonthlyCount: 0,
    tbSupportResourceMaintainCycle: '',
    tbSupportResourceCoverageRatio: 0,
    resourceConfig: [],
    maintainRecords: [],
    usageStatistics: {
      xAxis: [],
      series: [{ name: '使用次数', data: [] }]
    }
  };
  activeSupportResourceDetailView.value = '配置明细';
};
const openSupportResourceMaintainDialog = (row: SupportResourceRow) => {
  supportResourceMaintainDialogVisible.value = true;
};
const closeSupportResourceMaintainDialog = () => {
  supportResourceMaintainDialogVisible.value = false;
  maintainForm.value.maintainPlan = '';
  maintainFormRef.value?.resetFields();
};
// 支撑资源数据刷新
const refreshSupportResourceData = async () => {
  await Promise.all([
    getSupportResourceListData(),
    getSupportResourceIndicatorsData(),
    getSupportResourceTypeRatioData(),
    getSupportResourceRegionRatioData(),
    getSupportResourceTypeCountData(),
    getSupportResourceParkingCountData(),
  ]);
  supportResourceChartRefreshKey.value++;
  ElMessage.success('支撑资源数据刷新成功');
};

// 投诉处理视图切换
const changeComplaintView = (viewName: string) => {
  activeComplaintView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '饼图' || viewName === '折线图') &&
  nextTick(() => complaintChartRefreshKey.value++);
};
const changeComplaintDetailView = (viewName: string) => {
  activeComplaintDetailView.value = viewName;
};
// 投诉处理弹窗方法
const openComplaintDetailDialog = async (row: ComplaintRow) => {
  await getComplaintDetailData(row.tbComplaintId);
  complaintDetailDialogVisible.value = true;
};
const closeComplaintDetailDialog = () => {
  complaintDetailDialogVisible.value = false;
  complaintDetailSelectedRow.value = {
    tbComplaintId: '',
    tbComplaintComplaintNo: '',
    sysComplaintTypeName: '',
    tbComplaintSubmitTime: '',
    tbComplaintProcessDuration: null,
    sysComplaintResultName: '',
    tbComplaintUserSatisfaction: null,
    tbComplaintSource: '',
    sysUserUserName: '',
    sysReviewStatusName: '',
    complaintContent: {
      title: '',
      content: '',
      attachments: []
    },
    processRecords: [],
    userFeedback: {
      satisfaction: 0,
      comment: '',
      feedbackTime: ''
    }
  };
  activeComplaintDetailView.value = '投诉内容';
};
const openComplaintProcessDialog = (row: ComplaintRow) => {
  if (row.sysComplaintResultName === '待处理' || row.sysComplaintResultName === '处理中') {
    complaintProcessDialogVisible.value = true;
  } else {
    tipDialogContent.value = '该投诉已处理完成，无法再次处理';
    tipDialogVisible.value = true;
  }
};
const closeComplaintProcessDialog = () => {
  complaintProcessDialogVisible.value = false;
  complaintProcessForm.value.processPlan = '';
  complaintProcessFormRef.value?.resetFields();
};
const openComplaintReviewDialog = (row: ComplaintRow) => {
  if (row.sysComplaintResultName === '已处理') {
    complaintReviewDialogVisible.value = true;
  } else {
    tipDialogContent.value = '该投诉尚未处理完成，无法进行复盘';
    tipDialogVisible.value = true;
  }
};
const closeComplaintReviewDialog = () => {
  complaintReviewDialogVisible.value = false;
  complaintReviewForm.value.reviewOpinion = '';
  complaintReviewFormRef.value?.resetFields();
};
// 投诉处理数据刷新
const refreshComplaintData = async () => {
  await Promise.all([
    getComplaintListData(),
    getComplaintIndicatorsData(),
    getComplaintTypeRatioData(),
    getComplaintResultRatioData(),
    getComplaintSourceRatioData(),
    getComplaintNewTrendData(),
    getComplaintProcessTrendData(),
  ]);
  complaintChartRefreshKey.value++;
  ElMessage.success('投诉处理数据刷新成功');
};

// 运维处置效率视图切换
const changeMaintainEfficiencyView = (viewName: string) => {
  activeMaintainEfficiencyView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '折线图' || viewName === '饼图') &&
  nextTick(() => maintainEfficiencyChartRefreshKey.value++);
};
// 运维处置效率弹窗方法
const openMaintainEfficiencyDetailDialog = async (row: MaintainEfficiencyRow) => {
  await getMaintainEfficiencyDetailData(row.tbMaintainEfficiencyId);
  maintainEfficiencyDetailDialogVisible.value = true;
};
const closeMaintainEfficiencyDetailDialog = () => {
  maintainEfficiencyDetailDialogVisible.value = false;
  maintainEfficiencyDetailSelectedRow.value = {
    tbMaintainEfficiencyId: '',
    tbMaintainEfficiencyChainDurationChange: 0,
    sysWorkorderTypeName: '',
    sysEfficiencyLevelName: '',
    tbMaintainEfficiencyOvertimeCount: 0,
    detail: {
      tbMaintainEfficiencyAverageHandleDuration: 0,
      tbMaintainEfficiencyCompletionRate: 0,
      tbMaintainEfficiencyReworkRate: 0,
      tbMaintainEfficiencyOneTimeSolveRate: 0,
    }
  };
};
const openMaintainEfficiencyTrackDialog = async (row: MaintainEfficiencyRow) => {
  await getMaintainEfficiencyWorkorderTrackListData(row.tbMaintainEfficiencyId);
  maintainEfficiencyTrackDialogVisible.value = true;
};
const closeMaintainEfficiencyTrackDialog = () => {
  maintainEfficiencyTrackDialogVisible.value = false;
  maintainEfficiencyTrackSelectedRow.value = {
    tbMaintainEfficiencyId: '',
    sysWorkorderTypeName: '',
    workorderList: []
  };
};
const openMaintainEfficiencyReviewDialog = (row: MaintainEfficiencyRow) => {
  maintainEfficiencyReviewDialogVisible.value = true;
};
const closeMaintainEfficiencyReviewDialog = () => {
  maintainEfficiencyReviewDialogVisible.value = false;
  reviewForm.value.reviewOpinion = '';
  reviewFormRef.value?.resetFields();
};
// 运维处置效率数据刷新
const refreshMaintainEfficiencyData = async () => {
  await Promise.all([
    getMaintainEfficiencyListData(),
    getMaintainEfficiencyIndicatorsData(),
    getMaintainEfficiencyHandleDurationTrendData(),
    getMaintainEfficiencyCompletionRateTrendData(),
    getMaintainEfficiencyWorkorderTypeRatioData(),
    getMaintainEfficiencyLevelRatioData(),
    getMaintainEfficiencyReworkReasonRatioData(),
  ]);
  maintainEfficiencyChartRefreshKey.value++;
  ElMessage.success('运维处置效率数据刷新成功');
};

// 服务发展视图切换
const changeServiceDevelopmentView = (viewName: string) => {
  activeServiceDevelopmentView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '折线图' || viewName === '柱状图' || viewName === '饼图') &&
  nextTick(() => serviceDevelopmentChartRefreshKey.value++);
};
const changeServiceDevelopmentDetailView = (viewName: string) => {
  activeServiceDevelopmentDetailView.value = viewName;
};
// 服务发展弹窗方法
const openServiceDevelopmentDetailDialog = async (row: ServiceDevelopmentRow) => {
  await getServiceDevelopmentDetailData(row.tbServiceDevelopmentId);
  serviceDevelopmentDetailDialogVisible.value = true;
};
const closeServiceDevelopmentDetailDialog = () => {
  serviceDevelopmentDetailDialogVisible.value = false;
  serviceDevelopmentDetailSelectedRow.value = {
    tbServiceDevelopmentId: '',
    sysServiceTypeName: '',
    tbServiceDevelopmentPeriod: '',
    tbServiceDevelopmentYearOnYearGrowth: 0,
    tbServiceDevelopmentTotalUserCount: 0,
    tbServiceDevelopmentOptimizationDemandCount: 0,
    detail: {
      tbServiceDevelopmentNewServiceCount: 0,
      tbServiceDevelopmentCoverageRegionCount: 0,
      tbServiceDevelopmentUserGrowthRate: 0,
      tbServiceDevelopmentServiceUtilizationRate: 0,
    },
    userFeedback: [],
    coverageRegionDetail: []
  };
  activeServiceDevelopmentDetailView.value = '明细';
};
const openServiceDevelopmentUserGrowthDialog = async (row: ServiceDevelopmentRow) => {
  await getServiceDevelopmentUserGrowthTrendDetailData(row.tbServiceDevelopmentId);
  serviceDevelopmentUserGrowthDialogVisible.value = true;
};
const closeServiceDevelopmentUserGrowthDialog = () => {
  serviceDevelopmentUserGrowthDialogVisible.value = false;
  serviceDevelopmentUserGrowthSelectedRow.value = {
    tbServiceDevelopmentId: '',
    sysServiceTypeName: '',
    xAxis: [],
    series: [{ name: '月度用户增长率(%)', data: [] }]
  };
};
const openServiceDevelopmentOptimizationDialog = () => {
  serviceDevelopmentOptimizationDialogVisible.value = true;
};
const closeServiceDevelopmentOptimizationDialog = () => {
  serviceDevelopmentOptimizationDialogVisible.value = false;
  optimizationForm.value.optimizationPlan = '';
  optimizationFormRef.value?.resetFields();
};
// 服务发展数据刷新
const refreshServiceDevelopmentData = async () => {
  await Promise.all([
    getServiceDevelopmentListData(),
    getServiceDevelopmentIndicatorsData(),
    getServiceDevelopmentUserGrowthTrendData(),
    getServiceDevelopmentServiceUtilizationTrendData(),
    getServiceDevelopmentTypeCompareData(),
    getServiceDevelopmentRegionCoverageCompareData(),
    getServiceDevelopmentTypeRatioData(),
    getServiceDevelopmentHighUtilizationRatioData(),
  ]);
  serviceDevelopmentChartRefreshKey.value++;
  ElMessage.success('服务发展数据刷新成功');
};


// 生命周期
onMounted(async () => {
  await Promise.all([
    getParkResourceRunListData(),
    getParkResourceRunIndicatorsData(),
    getParkResourceRunUtilizationTrendData(),
    getParkResourceRunTurnoverTrendData(),
    getParkResourceRunRegionRatioData(),
    getParkResourceRunTimeRatioData(),
    getParkResourceListData(),
    getParkResourceIndicatorsData(),
    getParkResourceAreaCountData(),
    getParkResourceTypeSpaceCountData(),
    getParkServiceQualityListData(),
    getParkServiceQualityIndicatorsData(),
    getParkServiceQualityPaySuccessRateTrendData(),
    getParkServiceQualitySatisfactionTrendData(),
    getParkServiceQualityRegionCompareData(),
    getParkServiceQualityTimeEntryCompareData(),
    getBusinessFlowEfficiencyListData(),
    getBusinessFlowEfficiencyIndicatorsData(),
    getBusinessFlowDurationTrendData(),
    getBusinessFlowCompletionRateTrendData(),
    getBusinessFlowTypeDurationData(),
    getBusinessFlowLinkDurationData(),
    getBusinessQualityListData(),
    getBusinessQualityIndicatorsData(),
    getBusinessQualityBillingAccuracyTrendData(),
    getBusinessQualityComplianceRateTrendData(),
    getBusinessQualityAbnormalTypeRatioData(),
    getBusinessQualityTypeDistributionRatioData(),
    getResourceDevelopmentListData(),
    getResourceDevelopmentIndicatorsData(),
    getResourceDevelopmentNewTrendData(),
    getResourceDevelopmentPlanCompletionTrendData(),
    getResourceDevelopmentTypeCountData(),
    getResourceDevelopmentRegionCountData(),
    getResourceDevelopmentTypeRatioData(),
    getResourceDevelopmentFocusRegionRatioData(),
    getDeviceRunListData(),
    getDeviceRunIndicatorsData(),
    getDeviceRunOnlineRateTrendData(),
    getDeviceRunFaultTrendData(),
    getDeviceRunTypeRatioData(),
    getDeviceRunEfficiencyRatioData(),
    getSupportResourceListData(),
    getSupportResourceIndicatorsData(),
    getSupportResourceTypeRatioData(),
    getSupportResourceRegionRatioData(),
    getSupportResourceTypeCountData(),
    getSupportResourceParkingCountData(),
    getComplaintListData(),
    getComplaintIndicatorsData(),
    getComplaintTypeRatioData(),
    getComplaintResultRatioData(),
    getComplaintSourceRatioData(),
    getComplaintNewTrendData(),
    getComplaintProcessTrendData(),
    getMaintainEfficiencyListData(),
    getMaintainEfficiencyIndicatorsData(),
    getMaintainEfficiencyHandleDurationTrendData(),
    getMaintainEfficiencyCompletionRateTrendData(),
    getMaintainEfficiencyWorkorderTypeRatioData(),
    getMaintainEfficiencyLevelRatioData(),
    getMaintainEfficiencyReworkReasonRatioData(),
    getServiceDevelopmentListData(),
    getServiceDevelopmentIndicatorsData(),
    getServiceDevelopmentUserGrowthTrendData(),
    getServiceDevelopmentServiceUtilizationTrendData(),
    getServiceDevelopmentTypeCompareData(),
    getServiceDevelopmentRegionCoverageCompareData(),
    getServiceDevelopmentTypeRatioData(),
    getServiceDevelopmentHighUtilizationRatioData(),
  ]);
  setTimeout(() => {
    resourceRunChartRefreshKey.value++;
    parkResourceChartRefreshKey.value++;
    serviceQualityChartRefreshKey.value++;
    businessFlowChartRefreshKey.value++;
    businessQualityChartRefreshKey.value++;
    resourceDevelopmentChartRefreshKey.value++;
    deviceRunChartRefreshKey.value++;
    supportResourceChartRefreshKey.value++;
    complaintChartRefreshKey.value++;
    maintainEfficiencyChartRefreshKey.value++;
  }, 200);
  screenFull.on('change', handleFullscreenChange);
});

onUnmounted(() => {
  screenFull.off('change', handleFullscreenChange);
});
</script>

<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="mainbox">
      <div class="top">
        <div class="panel top-left" ref="resourceRunPanelRef">
          <el-tabs v-model="topLeftActiveTab" class="common-tabs">
            <el-tab-pane label="资源运行" name="tab1">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in resourceRunViewBtnList"
                      :key="item"
                      :type="activeResourceRunView === item ? 'primary' : ''"
                      plain
                      @click="changeResourceRunView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <el-icon color="#409eff" size="16" @click="refreshResourceRunData"><Refresh /></el-icon>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('resourceRunPanelRef')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>

              <!-- 卡片视图 -->
              <div v-if="activeResourceRunView === '卡片'" class="view-content">
                <div class="indicator-cards3">
                  <div class="indicator-card3 card1">
                    <div class="indicator-title">全域泊位数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ parkResourceRunIndicators.totalSpaceCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card2">
                    <div class="indicator-title">平均使用率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(parkResourceRunIndicators.averageUtilizationRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card3">
                    <div class="indicator-title">平均周转率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(parkResourceRunIndicators.averageTurnoverRate) }}</span>
                    </div>
                    <div class="indicator-unit">次/天</div>
                  </div>
                  <div class="indicator-card3 card4">
                    <div class="indicator-title">高峰时段平均使用率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(parkResourceRunIndicators.peakAverageUtilizationRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                </div>
              </div>

              <!-- 饼图视图 -->
              <div v-if="activeResourceRunView === '饼图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartPie1
                    :data="parkResourceRunRegionRatio"
                    title="各区域使用率占比"
                    :key="resourceRunChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartPie2
                    :data="parkResourceRunTimeRatio"
                    title="各时段使用率分布"
                    :key="resourceRunChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 折线图视图 -->
              <div v-if="activeResourceRunView === '折线图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartLine1
                    :data="parkResourceRunUtilizationTrend"
                    title="近30天全域使用率趋势"
                    :key="resourceRunChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartLine2
                    :data="parkResourceRunTurnoverTrend"
                    title="重点停车场周转率趋势"
                    :key="resourceRunChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 列表视图 -->
              <div v-if="activeResourceRunView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="parkResourceRunList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openResourceRunDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="tbParkingName"
                      label="停车场名称"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="tbRegionName"
                      label="区域归属"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="tbParkingSpaceTotalCount"
                      label="总泊位数"
                      align="center"
                    />
                    <ElTableColumn
                      prop="tbParkingOperationDailyUtilizationRate"
                      label="日均使用率(%)"
                      align="center"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbParkingOperationDailyUtilizationRate) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbParkingOperationTurnoverRate"
                      label="周转率"
                      align="center"
                    >
                      <template #default="scope">
                        <span @click.stop="openResourceRunTurnoverDialog(scope.row)" style="color:#409eff;cursor:pointer;">
                          {{ formatDecimal(scope.row.tbParkingOperationTurnoverRate) }}
                          <i class="el-icon-arrow-right" style="font-size:12px;"></i>
                        </span>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbParkingOperationPeakUtilizationRate"
                      label="高峰时段使用率(%)"
                      align="center"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbParkingOperationPeakUtilizationRate) }}
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="设备运行" name="tab2">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in deviceRunViewBtnList"
                      :key="item"
                      :type="activeDeviceRunView === item ? 'primary' : ''"
                      plain
                      @click="changeDeviceRunView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <el-icon color="#409eff" size="16" @click="refreshDeviceRunData"><Refresh /></el-icon>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('resourceRunPanelRef')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>

              <!-- 卡片视图 -->
              <div v-if="activeDeviceRunView === '卡片'" class="view-content">
                <div class="indicator-cards3">
                  <div class="indicator-card3 card1">
                    <div class="indicator-title">设备总数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ deviceRunIndicators.totalDeviceCount }}</span>
                    </div>
                    <div class="indicator-unit">台</div>
                  </div>
                  <div class="indicator-card3 card2">
                    <div class="indicator-title">平均在线率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(deviceRunIndicators.averageOnlineRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card3">
                    <div class="indicator-title">平均运行时长</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(deviceRunIndicators.averageRunningHours) }}</span>
                    </div>
                    <div class="indicator-unit">小时</div>
                  </div>
                  <div class="indicator-card3 card4">
                    <div class="indicator-title">整体故障率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(deviceRunIndicators.averageFaultRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                </div>
              </div>

              <!-- 折线图视图 -->
              <div v-if="activeDeviceRunView === '折线图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartLine1
                    :data="deviceRunOnlineRateTrendData"
                    title="近30天设备在线率趋势"
                    :key="deviceRunChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartLine2
                    :data="deviceRunFaultTrendData"
                    title="故障发生趋势"
                    :key="deviceRunChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 饼图视图 -->
              <div v-if="activeDeviceRunView === '饼图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartPie1
                    :data="deviceRunTypeRatioData"
                    title="设备类型分布占比"
                    :key="deviceRunChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartPie2
                    :data="deviceRunEfficiencyRatioData"
                    title="运行效能等级占比"
                    :key="deviceRunChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 列表视图 -->
              <div v-if="activeDeviceRunView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="deviceRunList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openDeviceRunDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="tbDeviceName"
                      label="设备名称"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="sysDeviceTypeName"
                      label="设备类型"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="tbParkingName"
                      label="所属停车场"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="tbDeviceOperationOnlineRate"
                      label="在线率(%)"
                      align="center"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbDeviceOperationOnlineRate) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbDeviceOperationDailyRunningHours"
                      label="日均运行时长(小时)"
                      align="center"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbDeviceOperationDailyRunningHours) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbDeviceOperationFaultRate"
                      label="故障率(%)"
                      align="center"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbDeviceOperationFaultRate) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      label="操作"
                      align="center"
                      width="100"
                      fixed="right"
                    >
                      <template #default="scope">
                        <ElButton type="primary" size="small" plain @click.stop="openDeviceRunMaintenanceDialog()">
                          运维
                        </ElButton>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel top-middle" ref="parkResourcePanelRef">
          <el-tabs v-model="topMiddleActiveTab" class="common-tabs">
            <el-tab-pane label="停车资源" name="tab1">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in parkResourceViewBtnList"
                      :key="item"
                      :type="activeParkResourceView === item ? 'primary' : ''"
                      plain
                      @click="changeParkResourceView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <el-icon color="#409eff" size="16" @click="refreshParkResourceData"><Refresh /></el-icon>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('parkResourcePanelRef')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>

              <!-- 卡片视图 -->
              <div v-if="activeParkResourceView === '卡片'" class="view-content">
                <div class="indicator-cards3">
                  <div class="indicator-card3 card1">
                    <div class="indicator-title">停车场总数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ parkResourceIndicators.totalParkCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card2">
                    <div class="indicator-title">总泊位数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ parkResourceIndicators.totalSpaceCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card3">
                    <div class="indicator-title">可用泊位数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ parkResourceIndicators.availableSpaceCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card4">
                    <div class="indicator-title">运营中停车场数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ parkResourceIndicators.runningParkCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                </div>
              </div>

              <!-- 柱状图视图 -->
              <div v-if="activeParkResourceView === '柱状图'" class="view-content">
                <div
                  style="
                  display: inline-block;
                  width: 49%;
                  height: 100%;
                  vertical-align: top;
                "
                >
                  <VerticalBar2
                    :x-axis="parkResourceAreaCountData.xAxis"
                    :series="parkResourceAreaCountData.series"
                    unit="个"
                    title="各区域停车场数量对比"
                    :key="parkResourceChartRefreshKey"
                  />
                </div>
                <div
                  style="
                display: inline-block;
                width: 49%;
                height: 100%;
                padding-left: 0.3vw;
                vertical-align: top;
                border-left: 0.3vh solid #02a6b5;
              "
                >
                  <VerticalBar1
                    :x-axis="parkResourceTypeSpaceCountData.xAxis"
                    :series="parkResourceTypeSpaceCountData.series"
                    unit="个"
                    title="各类型泊位数对比"
                    :key="parkResourceChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 列表视图 -->
              <div v-if="activeParkResourceView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="parkResourceList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openParkResourceDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="tbParkingName"
                      label="停车场名称"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="tbRegionName"
                      label="区域归属"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="sysParkingTypeName"
                      label="停车场类型"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="tbParkingSpaceTotalCount"
                      label="总泊位数"
                      align="center"
                    />
                    <ElTableColumn
                      prop="tbParkingSpaceAvailableCount"
                      label="可用泊位数"
                      align="center"
                    />
                    <ElTableColumn
                      prop="sysOperationStatusName"
                      label="运营状态"
                      align="center"
                    >
                      <template #default="scope">
                        <ElTag :type="scope.row.sysOperationStatusName === '运营中' ? 'success' : 'warning'">
                          {{ scope.row.sysOperationStatusName || '-' }}
                        </ElTag>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="支撑资源" name="tab2">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in supportResourceViewBtnList"
                      :key="item"
                      :type="activeSupportResourceView === item ? 'primary' : ''"
                      plain
                      @click="changeSupportResourceView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <el-icon color="#409eff" size="16" @click="refreshSupportResourceData"><Refresh /></el-icon>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('parkResourcePanelRef')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>

              <!-- 卡片视图 -->
              <div v-if="activeSupportResourceView === '卡片'" class="view-content">
                <div class="indicator-cards3">
                  <div class="indicator-card3 card1">
                    <div class="indicator-title">支撑资源总数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ supportResourceIndicators.totalResourceCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card2">
                    <div class="indicator-title">平均完好率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(supportResourceIndicators.averageIntactRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card3">
                    <div class="indicator-title">核心类型资源数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ supportResourceIndicators.coreTypeResourceCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card4">
                    <div class="indicator-title">维护中资源数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ supportResourceIndicators.maintainingResourceCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                </div>
              </div>

              <!-- 饼图视图 -->
              <div v-if="activeSupportResourceView === '饼图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartPie1
                    :data="supportResourceTypeRatio"
                    title="支撑资源类型占比"
                    :key="supportResourceChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartPie2
                    :data="supportResourceRegionRatio"
                    title="各区域支撑资源分布占比"
                    :key="supportResourceChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 柱状图视图 -->
              <div v-if="activeSupportResourceView === '柱状图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <VerticalBar2
                    :x-axis="supportResourceTypeCountData.xAxis"
                    :series="supportResourceTypeCountData.series"
                    unit="个"
                    title="各类型支撑资源数量对比"
                    :key="supportResourceChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <VerticalBar1
                    :x-axis="supportResourceParkingCountData.xAxis"
                    :series="supportResourceParkingCountData.series"
                    unit="个"
                    title="各停车场支撑资源配置对比"
                    :key="supportResourceChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 列表视图 -->
              <div v-if="activeSupportResourceView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="supportResourceList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openSupportResourceDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="tbSupportResourceName"
                      label="资源名称"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="sysSupportTypeName"
                      label="资源类型"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="tbParkingName"
                      label="所属停车场"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="tbSupportResourceQuantity"
                      label="数量"
                      align="center"
                    />
                    <ElTableColumn
                      prop="tbSupportResourceAvailableQuantity"
                      label="可用数量"
                      align="center"
                    />
                    <ElTableColumn
                      prop="tbSupportResourceIntactRate"
                      label="完好率(%)"
                      align="center"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbSupportResourceIntactRate) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      label="操作"
                      align="center"
                      width="100"
                      fixed="right"
                    >
                      <template #default="scope">
                        <ElButton type="primary" size="small" plain @click.stop="openSupportResourceMaintainDialog(scope.row)">
                          维护
                        </ElButton>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel top-right" ref="serviceQualityPanelRef">
          <el-tabs v-model="topRightActiveTab" class="common-tabs">
            <el-tab-pane label="基础服务" name="tab1">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in serviceQualityViewBtnList"
                      :key="item"
                      :type="activeServiceQualityView === item ? 'primary' : ''"
                      plain
                      @click="changeServiceQualityView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <el-icon color="#409eff" size="16" @click="refreshServiceQualityData"><Refresh /></el-icon>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('serviceQualityPanelRef')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>

              <!-- 卡片视图 -->
              <div v-if="activeServiceQualityView === '卡片'" class="view-content">
                <div class="indicator-cards3">
                  <div class="indicator-card3 card1">
                    <div class="indicator-title">平均入场时长</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(parkServiceQualityIndicators.averageEntryTime) }}</span>
                    </div>
                    <div class="indicator-unit">秒</div>
                  </div>
                  <div class="indicator-card3 card2">
                    <div class="indicator-title">缴费成功率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(parkServiceQualityIndicators.paySuccessRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card3">
                    <div class="indicator-title">用户满意度</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(parkServiceQualityIndicators.satisfactionRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card4">
                    <div class="indicator-title">投诉率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(parkServiceQualityIndicators.complaintRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                </div>
              </div>

              <!-- 折线图视图 -->
              <div v-if="activeServiceQualityView === '折线图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartLine1
                    :data="parkServiceQualityPaySuccessRateTrend"
                    title="缴费成功率趋势"
                    :key="serviceQualityChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartLine2
                    :data="parkServiceQualitySatisfactionTrend"
                    title="用户满意度趋势"
                    :key="serviceQualityChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 柱状图视图 -->
              <div v-if="activeServiceQualityView === '柱状图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <VerticalBar2
                    :x-axis="parkServiceQualityRegionCompare.xAxis"
                    :series="parkServiceQualityRegionCompare.series"
                    unit="%"
                    title="各区域服务质量指标对比"
                    :key="serviceQualityChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <VerticalBar1
                    :x-axis="parkServiceQualityTimeEntryCompare.xAxis"
                    :series="parkServiceQualityTimeEntryCompare.series"
                    unit="秒"
                    title="各时段平均入场时长对比"
                    :key="serviceQualityChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 列表视图 -->
              <div v-if="activeServiceQualityView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="parkServiceQualityList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openServiceQualityDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="tbServiceQualityPeriod"
                      label="统计周期"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="tbServiceQualityAverageEntryTime"
                      label="平均入场时长(秒)"
                      align="center"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbServiceQualityAverageEntryTime) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbServiceQualityAveragePayTime"
                      label="平均缴费时长(秒)"
                      align="center"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbServiceQualityAveragePayTime) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbServiceQualityPaySuccessRate"
                      label="缴费成功率(%)"
                      align="center"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbServiceQualityPaySuccessRate) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbServiceQualityComplaintRate"
                      label="投诉率(%)"
                      align="center"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbServiceQualityComplaintRate) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbServiceQualitySatisfactionRate"
                      label="用户满意度(%)"
                      align="center"
                    >
                      <template #default="scope">
                        <span @click.stop="openServiceQualityEvaluationDialog(scope.row)" style="color:#409eff;cursor:pointer;">
                          {{ formatDecimal(scope.row.tbServiceQualitySatisfactionRate) }}
                          <i class="el-icon-arrow-right" style="font-size:12px;"></i>
                        </span>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="投诉处理" name="tab2">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in complaintViewBtnList"
                      :key="item"
                      :type="activeComplaintView === item ? 'primary' : ''"
                      plain
                      @click="changeComplaintView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <el-icon color="#409eff" size="16" @click="refreshComplaintData"><Refresh /></el-icon>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('serviceQualityPanelRef')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>

              <!-- 卡片视图 -->
              <div v-if="activeComplaintView === '卡片'" class="view-content">
                <div class="indicator-cards4">
                  <div class="indicator-card4 card1">
                    <div class="indicator-title">投诉总数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ complaintIndicators.totalComplaintCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card4 card2">
                    <div class="indicator-title">已处理数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ complaintIndicators.processedCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card4 card3">
                    <div class="indicator-title">处理完成率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(complaintIndicators.processCompletionRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card4 card4">
                    <div class="indicator-title">平均处理时长</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(complaintIndicators.averageProcessDuration) }}</span>
                    </div>
                    <div class="indicator-unit">小时</div>
                  </div>
                  <div class="indicator-card4 card5">
                    <div class="indicator-title">整体满意度</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(complaintIndicators.overallSatisfaction) }}</span>
                    </div>
                    <div class="indicator-unit">分</div>
                  </div>
                </div>
              </div>

              <!-- 饼图视图 -->
              <div v-if="activeComplaintView === '饼图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 32%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartPie1
                    :data="complaintTypeRatio"
                    title="投诉类型占比"
                    :key="complaintChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 32%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartPie2
                    :data="complaintResultRatio"
                    title="处理结果占比"
                    :key="complaintChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 32%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartPie3
                    :data="complaintSourceRatio"
                    title="投诉来源占比"
                    :key="complaintChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 折线图视图 -->
              <div v-if="activeComplaintView === '折线图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartLine1
                    :data="complaintNewTrendData"
                    title="近30天投诉新增趋势"
                    :key="complaintChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartLine2
                    :data="complaintProcessTrendData"
                    title="处理完成趋势"
                    :key="complaintChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 列表视图 -->
              <div v-if="activeComplaintView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="complaintList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openComplaintDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="tbComplaintComplaintNo"
                      label="投诉编号"
                      align="center"
                      min-width="140"
                    />
                    <ElTableColumn
                      prop="sysComplaintTypeName"
                      label="投诉类型"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="tbComplaintSubmitTime"
                      label="提交时间"
                      align="center"
                    >
                      <template #default="scope">
                        {{ formatTimeStamp(scope.row.tbComplaintSubmitTime) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbComplaintProcessDuration"
                      label="处理时长(小时)"
                      align="center"
                    >
                      <template #default="scope">
                        {{ scope.row.tbComplaintProcessDuration ? formatDecimal(scope.row.tbComplaintProcessDuration) : '-' }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="sysComplaintResultName"
                      label="处理结果"
                      align="center"
                    >
                      <template #default="scope">
                        <ElTag :type="scope.row.sysComplaintResultName === '已处理' ? 'success' : scope.row.sysComplaintResultName === '处理中' ? 'warning' : 'danger'">
                          {{ scope.row.sysComplaintResultName || '-' }}
                        </ElTag>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbComplaintUserSatisfaction"
                      label="用户满意度(分)"
                      align="center"
                    >
                      <template #default="scope">
                        {{ scope.row.tbComplaintUserSatisfaction ? formatDecimal(scope.row.tbComplaintUserSatisfaction) : '-' }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      label="操作"
                      align="center"
                      width="150"
                      fixed="right"
                    >
                      <template #default="scope">
                        <ElButton type="primary" size="small" plain @click.stop="openComplaintProcessDialog(scope.row)">
                          处理
                        </ElButton>
                        <ElButton type="warning" size="small" plain @click.stop="openComplaintReviewDialog(scope.row)">
                          复盘
                        </ElButton>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
      </div>
      <div class="bottom">
        <div class="panel bottom-left" ref="businessFlowPanelRef">
          <el-tabs v-model="bottomLeftActiveTab" class="common-tabs">
            <el-tab-pane label="业务流转效率" name="tab1">
                <div class="header-actions">
                  <div class="actions-left"><p></p></div>
                  <div class="actions-right">
                    <div class="view-btn-group">
                      <ElButton
                        v-for="item in businessFlowViewBtnList"
                        :key="item"
                        :type="activeBusinessFlowView === item ? 'primary' : ''"
                        plain
                        @click="changeBusinessFlowView(item)"
                        class="view-btn"
                      >
                        {{ item }}
                      </ElButton>
                    </div>
                    <el-icon color="#409eff" size="16" @click="refreshBusinessFlowData"><Refresh /></el-icon>
                    <el-icon color="#409eff" size="16"><Filter /></el-icon>
                    <button
                      class="panel-fullscreen-btn"
                      @click="togglePanelFullscreen('businessFlowPanelRef')"
                    >
                      <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                    </button>
                  </div>
                </div>

                <!-- 卡片视图 -->
                <div v-if="activeBusinessFlowView === '卡片'" class="view-content">
                  <div class="indicator-cards3">
                    <div class="indicator-card3 card1">
                      <div class="indicator-title">平均流转时长</div>
                      <div class="indicator-value">
                        <span class="number-animate">{{ formatDecimal(businessFlowEfficiencyIndicators.averageFlowDuration) }}</span>
                      </div>
                      <div class="indicator-unit">小时</div>
                    </div>
                    <div class="indicator-card3 card2">
                      <div class="indicator-title">平均完成率</div>
                      <div class="indicator-value">
                        <span class="number-animate">{{ formatDecimal(businessFlowEfficiencyIndicators.averageCompletionRate) }}</span>
                      </div>
                      <div class="indicator-unit">%</div>
                    </div>
                    <div class="indicator-card3 card3">
                      <div class="indicator-title">平均超时率</div>
                      <div class="indicator-value">
                        <span class="number-animate">{{ formatDecimal(businessFlowEfficiencyIndicators.averageOvertimeRate) }}</span>
                      </div>
                      <div class="indicator-unit">%</div>
                    </div>
                    <div class="indicator-card3 card4">
                      <div class="indicator-title">核心瓶颈环节占比</div>
                      <div class="indicator-value">
                        <span class="number-animate">{{ formatDecimal(businessFlowEfficiencyIndicators.coreBottleneckRatio) }}</span>
                      </div>
                      <div class="indicator-unit">%</div>
                    </div>
                  </div>
                </div>

                <!-- 折线图视图 -->
                <div v-if="activeBusinessFlowView === '折线图'" class="view-content">
                  <div
                    style="
                      display: inline-block;
                      width: 49%;
                      height: 100%;
                      vertical-align: top;
                    "
                  >
                    <ChartLine1
                      :data="businessFlowDurationTrend"
                      title="流转时长趋势"
                      :key="businessFlowChartRefreshKey"
                    />
                  </div>
                  <div
                    style="
                      display: inline-block;
                      width: 49%;
                      height: 100%;
                      padding-left: 0.3vw;
                      vertical-align: top;
                      border-left: 0.3vh solid #02a6b5;
                    "
                  >
                    <ChartLine2
                      :data="businessFlowCompletionRateTrend"
                      title="完成率趋势"
                      :key="businessFlowChartRefreshKey"
                    />
                  </div>
                </div>

                <!-- 柱状图视图 -->
                <div v-if="activeBusinessFlowView === '柱状图'" class="view-content">
                  <div
                    style="
                      display: inline-block;
                      width: 49%;
                      height: 100%;
                      vertical-align: top;
                    "
                  >
                    <VerticalBar2
                      :x-axis="businessFlowTypeDurationData.xAxis"
                      :series="businessFlowTypeDurationData.series"
                      unit="小时"
                      title="各业务类型流转时长对比"
                      :key="businessFlowChartRefreshKey"
                    />
                  </div>
                  <div
                    style="
                      display: inline-block;
                      width: 49%;
                      height: 100%;
                      padding-left: 0.3vw;
                      vertical-align: top;
                      border-left: 0.3vh solid #02a6b5;
                    "
                  >
                    <VerticalBar1
                      :x-axis="businessFlowLinkDurationData.xAxis"
                      :series="businessFlowLinkDurationData.series"
                      unit="小时"
                      title="各环节流转时长对比"
                      :key="businessFlowChartRefreshKey"
                    />
                  </div>
                </div>

                <!-- 列表视图 -->
                <div v-if="activeBusinessFlowView === '列表'" class="view-content">
                  <div class="table-box4">
                    <ElTable
                      class="table4"
                      :data="businessFlowEfficiencyList"
                      border
                      size="small"
                      width="100%"
                      height="100%"
                      table-layout="fixed"
                      highlight-current-row
                      @row-click="(row) => openBusinessFlowDetailDialog(row)"
                    >
                      <ElTableColumn
                        prop="sysBusinessTypeName"
                        label="业务类型"
                        align="center"
                        min-width="120"
                      />
                      <ElTableColumn
                        prop="tbBusinessFlowPeriod"
                        label="统计周期"
                        align="center"
                        min-width="100"
                      />
                      <ElTableColumn
                        prop="tbBusinessFlowAverageFlowDuration"
                        label="平均流转时长(小时)"
                        align="center"
                      >
                        <template #default="scope">
                          {{ formatDecimal(scope.row.tbBusinessFlowAverageFlowDuration) }}
                        </template>
                      </ElTableColumn>
                      <ElTableColumn
                        prop="tbBusinessFlowCompletionRate"
                        label="流转完成率(%)"
                        align="center"
                      >
                        <template #default="scope">
                          {{ formatDecimal(scope.row.tbBusinessFlowCompletionRate) }}
                        </template>
                      </ElTableColumn>
                      <ElTableColumn
                        prop="tbBusinessFlowBottleneckRatio"
                        label="瓶颈环节占比(%)"
                        align="center"
                      >
                        <template #default="scope">
                          <span @click.stop="openBusinessFlowBottleneckDialog(scope.row)" style="color:#409eff;cursor:pointer;">
                            {{ formatDecimal(scope.row.tbBusinessFlowBottleneckRatio) }}
                            <i class="el-icon-arrow-right" style="font-size:12px;"></i>
                          </span>
                        </template>
                      </ElTableColumn>
                      <ElTableColumn
                        prop="tbBusinessFlowOvertimeRate"
                        label="超时率(%)"
                        align="center"
                      >
                        <template #default="scope">
                          {{ formatDecimal(scope.row.tbBusinessFlowOvertimeRate) }}
                        </template>
                      </ElTableColumn>
                    </ElTable>
                  </div>
                </div>
              </el-tab-pane>
            <el-tab-pane label="运维处置效率" name="tab2">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in maintainEfficiencyViewBtnList"
                      :key="item"
                      :type="activeMaintainEfficiencyView === item ? 'primary' : ''"
                      plain
                      @click="changeMaintainEfficiencyView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <el-icon color="#409eff" size="16" @click="refreshMaintainEfficiencyData"><Refresh /></el-icon>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('businessFlowPanelRef')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>

              <!-- 卡片视图 -->
              <div v-if="activeMaintainEfficiencyView === '卡片'" class="view-content">
                <div class="indicator-cards3">
                  <div class="indicator-card3 card1">
                    <div class="indicator-title">平均处置时长</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(maintainEfficiencyIndicators.averageHandleDuration) }}</span>
                    </div>
                    <div class="indicator-unit">小时</div>
                  </div>
                  <div class="indicator-card3 card2">
                    <div class="indicator-title">处置完成率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(maintainEfficiencyIndicators.completionRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card3">
                    <div class="indicator-title">一次性解决率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(maintainEfficiencyIndicators.oneTimeSolveRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card4">
                    <div class="indicator-title">返工率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(maintainEfficiencyIndicators.reworkRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                </div>
              </div>

              <!-- 折线图视图 -->
              <div v-if="activeMaintainEfficiencyView === '折线图'" class="view-content">
                <div
                  style="
        display: inline-block;
        width: 49%;
        height: 100%;
        vertical-align: top;
      "
                >
                  <ChartLine1
                    :data="maintainEfficiencyHandleDurationTrend"
                    title="处置时长趋势"
                    :key="maintainEfficiencyChartRefreshKey"
                  />
                </div>
                <div
                  style="
        display: inline-block;
        width: 49%;
        height: 100%;
        padding-left: 0.3vw;
        vertical-align: top;
        border-left: 0.3vh solid #02a6b5;
      "
                >
                  <ChartLine2
                    :data="maintainEfficiencyCompletionRateTrend"
                    title="完成率趋势"
                    :key="maintainEfficiencyChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 饼图视图 -->
              <div v-if="activeMaintainEfficiencyView === '饼图'" class="view-content">
                <div
                  style="
        display: inline-block;
        width: 32%;
        height: 100%;
        vertical-align: top;
      "
                >
                  <ChartPie1
                    :data="maintainEfficiencyWorkorderTypeRatio"
                    title="工单类型占比"
                    :key="maintainEfficiencyChartRefreshKey"
                  />
                </div>
                <div
                  style="
        display: inline-block;
        width: 32%;
        height: 100%;
        padding-left: 0.3vw;
        vertical-align: top;
        border-left: 0.3vh solid #02a6b5;
      "
                >
                  <ChartPie2
                    :data="maintainEfficiencyLevelRatio"
                    title="处置效率等级占比"
                    :key="maintainEfficiencyChartRefreshKey"
                  />
                </div>
                <div
                  style="
        display: inline-block;
        width: 32%;
        height: 100%;
        padding-left: 0.3vw;
        vertical-align: top;
        border-left: 0.3vh solid #02a6b5;
      "
                >
                  <ChartPie3
                    :data="maintainEfficiencyReworkReasonRatio"
                    title="返工原因占比"
                    :key="maintainEfficiencyChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 列表视图 -->
              <div v-if="activeMaintainEfficiencyView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="maintainEfficiencyList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openMaintainEfficiencyDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="sysWorkorderTypeName"
                      label="工单类型"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="tbMaintainEfficiencyPeriod"
                      label="统计周期"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="tbMaintainEfficiencyAverageHandleDuration"
                      label="平均处置时长(小时)"
                      align="center"
                      width="140"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbMaintainEfficiencyAverageHandleDuration) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbMaintainEfficiencyCompletionRate"
                      label="处置完成率(%)"
                      align="center"
                      width="120"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbMaintainEfficiencyCompletionRate) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbMaintainEfficiencyReworkRate"
                      label="返工率(%)"
                      align="center"
                      width="100"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbMaintainEfficiencyReworkRate) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbMaintainEfficiencyOneTimeSolveRate"
                      label="一次性解决率(%)"
                      align="center"
                      width="120"
                    >
                      <template #default="scope">
            <span @click.stop="openMaintainEfficiencyTrackDialog(scope.row)" style="color:#409eff;cursor:pointer;">
              {{ formatDecimal(scope.row.tbMaintainEfficiencyOneTimeSolveRate) }}
              <i class="el-icon-arrow-right" style="font-size:12px;"></i>
            </span>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      label="操作"
                      align="center"
                      width="100"
                      fixed="right"
                    >
                      <template #default="scope">
                        <ElButton type="primary" size="small" plain @click.stop="openMaintainEfficiencyReviewDialog(scope.row)">
                          复盘
                        </ElButton>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-middle" ref="businessQualityPanelRef">
          <el-tabs v-model="bottomMiddleActiveTab" class="common-tabs">
            <el-tab-pane label="业务质量" name="tab1">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in businessQualityViewBtnList"
                      :key="item"
                      :type="activeBusinessQualityView === item ? 'primary' : ''"
                      plain
                      @click="changeBusinessQualityView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <el-icon color="#409eff" size="16" @click="refreshBusinessQualityData"><Refresh /></el-icon>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('businessQualityPanelRef')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>

              <!-- 卡片视图 -->
              <div v-if="activeBusinessQualityView === '卡片'" class="view-content">
                <div class="indicator-cards3">
                  <div class="indicator-card3 card1">
                    <div class="indicator-title">计费准确率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(businessQualityIndicators.billingAccuracy) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card2">
                    <div class="indicator-title">订单成功率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(businessQualityIndicators.orderSuccessRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card3">
                    <div class="indicator-title">合规率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(businessQualityIndicators.complianceRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card4">
                    <div class="indicator-title">异常订单数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ businessQualityIndicators.abnormalOrderCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                </div>
              </div>

              <!-- 折线图视图 -->
              <div v-if="activeBusinessQualityView === '折线图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartLine1
                    :data="businessQualityBillingAccuracyTrend"
                    title="计费准确率趋势"
                    :key="businessQualityChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartLine2
                    :data="businessQualityComplianceRateTrend"
                    title="合规率趋势"
                    :key="businessQualityChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 饼图视图 -->
              <div v-if="activeBusinessQualityView === '饼图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartPie1
                    :data="businessQualityAbnormalTypeRatio"
                    title="异常类型占比"
                    :key="businessQualityChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartPie2
                    :data="businessQualityTypeDistributionRatio"
                    title="业务类型质量分布"
                    :key="businessQualityChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 列表视图 -->
              <div v-if="activeBusinessQualityView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="businessQualityList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openBusinessQualityDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="sysBusinessTypeName"
                      label="业务类型"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="tbBusinessQualityPeriod"
                      label="统计周期"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="tbBusinessQualityBillingAccuracy"
                      label="计费准确率(%)"
                      align="center"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbBusinessQualityBillingAccuracy) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbBusinessQualityOrderSuccessRate"
                      label="订单成功率(%)"
                      align="center"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbBusinessQualityOrderSuccessRate) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbBusinessQualityAbnormalOrderCount"
                      label="异常订单数"
                      align="center"
                    >
                      <template #default="scope">
                        <span @click.stop="openBusinessQualityAbnormalOrderDialog(scope.row)" style="color:#409eff;cursor:pointer;">
                          {{ scope.row.tbBusinessQualityAbnormalOrderCount }}
                          <i class="el-icon-arrow-right" style="font-size:12px;"></i>
                        </span>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbBusinessQualityComplianceRate"
                      label="合规率(%)"
                      align="center"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbBusinessQualityComplianceRate) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      label="操作"
                      align="center"
                      width="100"
                      fixed="right"
                    >
                      <template #default="scope">
                        <ElButton type="primary" size="small" plain @click.stop="openBusinessQualityRectificationDialog()">
                          整改
                        </ElButton>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="合规整改" name="tab2">
              <div class="view-content"><div class="content-placeholder">合规整改</div></div>
            </el-tab-pane>
            <el-tab-pane label="设备安全" name="tab3">
              <div class="view-content"><div class="content-placeholder">设备安全</div></div>
            </el-tab-pane>
            <el-tab-pane label="运营风险" name="tab4">
              <div class="view-content"><div class="content-placeholder">运营风险</div></div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-right" ref="resourceDevelopmentPanelRef">
          <el-tabs v-model="bottomRightActiveTab" class="common-tabs">
            <el-tab-pane label="资源发展" name="tab1">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in resourceDevelopmentViewBtnList"
                      :key="item"
                      :type="activeResourceDevelopmentView === item ? 'primary' : ''"
                      plain
                      @click="changeResourceDevelopmentView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <el-icon color="#409eff" size="16" @click="refreshResourceDevelopmentData"><Refresh /></el-icon>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('resourceDevelopmentPanelRef')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>

              <!-- 卡片视图 -->
              <div v-if="activeResourceDevelopmentView === '卡片'" class="view-content">
                <div class="indicator-cards3">
                  <div class="indicator-card3 card1">
                    <div class="indicator-title">新增资源总数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ resourceDevelopmentIndicators.totalNewCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card2">
                    <div class="indicator-title">扩容总数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ resourceDevelopmentIndicators.totalExpansionCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card3">
                    <div class="indicator-title">优化总数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ resourceDevelopmentIndicators.totalOptimizationCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card4">
                    <div class="indicator-title">规划达成率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(resourceDevelopmentIndicators.averagePlanCompletionRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                </div>
              </div>

              <!-- 折线图视图 -->
              <div v-if="activeResourceDevelopmentView === '折线图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartLine1
                    :data="resourceDevelopmentNewTrendData"
                    title="统计周期内资源新增趋势"
                    :key="resourceDevelopmentChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartLine2
                    :data="resourceDevelopmentPlanCompletionTrendData"
                    title="规划达成率趋势"
                    :key="resourceDevelopmentChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 柱状图视图 -->
              <div v-if="activeResourceDevelopmentView === '柱状图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <VerticalBar2
                    :x-axis="resourceDevelopmentTypeCountData.xAxis"
                    :series="resourceDevelopmentTypeCountData.series"
                    unit="个"
                    title="各类型资源发展数量对比"
                    :key="resourceDevelopmentChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <VerticalBar1
                    :x-axis="resourceDevelopmentRegionCountData.xAxis"
                    :series="resourceDevelopmentRegionCountData.series"
                    unit="个"
                    title="各区域资源发展数量对比"
                    :key="resourceDevelopmentChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 饼图视图 -->
              <div v-if="activeResourceDevelopmentView === '饼图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartPie1
                    :data="resourceDevelopmentTypeRatioData"
                    title="资源发展类型占比"
                    :key="resourceDevelopmentChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartPie2
                    :data="resourceDevelopmentFocusRegionRatioData"
                    title="重点发展区域占比"
                    :key="resourceDevelopmentChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 列表视图 -->
              <div v-if="activeResourceDevelopmentView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="resourceDevelopmentList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openResourceDevelopmentDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="sysResourceTypeName"
                      label="资源类型"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="tbResourceDevelopmentPeriod"
                      label="统计周期"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="tbResourceDevelopmentNewCount"
                      label="新增数量"
                      align="center"
                    >
                      <template #default="scope">
                        <span @click.stop="openResourceDevelopmentMonthlyDialog(scope.row)" style="color:#409eff;cursor:pointer;">
                          {{ scope.row.tbResourceDevelopmentNewCount }}
                          <i class="el-icon-arrow-right" style="font-size:12px;"></i>
                        </span>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbResourceDevelopmentExpansionCount"
                      label="扩容数量"
                      align="center"
                    />
                    <ElTableColumn
                      prop="tbResourceDevelopmentOptimizationCount"
                      label="优化数量"
                      align="center"
                    />
                    <ElTableColumn
                      prop="tbResourceDevelopmentPlanCompletionRate"
                      label="规划达成率(%)"
                      align="center"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbResourceDevelopmentPlanCompletionRate) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      label="操作"
                      align="center"
                      width="100"
                      fixed="right"
                    >
                      <template #default="scope">
                        <ElButton type="primary" size="small" plain @click.stop="openResourceDevelopmentPlanDialog()">
                          规划
                        </ElButton>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="服务发展" name="tab2">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in serviceDevelopmentViewBtnList"
                      :key="item"
                      :type="activeServiceDevelopmentView === item ? 'primary' : ''"
                      plain
                      @click="changeServiceDevelopmentView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <el-icon color="#409eff" size="16" @click="refreshServiceDevelopmentData"><Refresh /></el-icon>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('serviceDevelopmentPanelRef')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>

              <!-- 卡片视图 -->
              <div v-if="activeServiceDevelopmentView === '卡片'" class="view-content">
                <div class="indicator-cards3">
                  <div class="indicator-card3 card1">
                    <div class="indicator-title">新增服务数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ serviceDevelopmentIndicators.newServiceCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card2">
                    <div class="indicator-title">覆盖区域数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ serviceDevelopmentIndicators.coverageRegionCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card3">
                    <div class="indicator-title">用户增长率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(serviceDevelopmentIndicators.userGrowthRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card4">
                    <div class="indicator-title">服务使用率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(serviceDevelopmentIndicators.serviceUtilizationRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                </div>
              </div>

              <!-- 折线图视图 -->
              <div v-if="activeServiceDevelopmentView === '折线图'" class="view-content">
                <div
                  style="
        display: inline-block;
        width: 49%;
        height: 100%;
        vertical-align: top;
      "
                >
                  <ChartLine1
                    :data="serviceDevelopmentUserGrowthTrend"
                    title="用户增长趋势"
                    :key="serviceDevelopmentChartRefreshKey"
                  />
                </div>
                <div
                  style="
        display: inline-block;
        width: 49%;
        height: 100%;
        padding-left: 0.3vw;
        vertical-align: top;
        border-left: 0.3vh solid #02a6b5;
      "
                >
                  <ChartLine2
                    :data="serviceDevelopmentServiceUtilizationTrend"
                    title="服务使用率趋势"
                    :key="serviceDevelopmentChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 柱状图视图 -->
              <div v-if="activeServiceDevelopmentView === '柱状图'" class="view-content">
                <div
                  style="
        display: inline-block;
        width: 49%;
        height: 100%;
        vertical-align: top;
      "
                >
                  <VerticalBar2
                    :x-axis="serviceDevelopmentTypeCompareData.xAxis"
                    :series="serviceDevelopmentTypeCompareData.series"
                    unit="个"
                    title="各类型服务发展数量对比"
                    :key="serviceDevelopmentChartRefreshKey"
                  />
                </div>
                <div
                  style="
        display: inline-block;
        width: 49%;
        height: 100%;
        padding-left: 0.3vw;
        vertical-align: top;
        border-left: 0.3vh solid #02a6b5;
      "
                >
                  <VerticalBar1
                    :x-axis="serviceDevelopmentRegionCoverageCompareData.xAxis"
                    :series="serviceDevelopmentRegionCoverageCompareData.series"
                    unit="个"
                    title="各区域服务覆盖对比"
                    :key="serviceDevelopmentChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 饼图视图 -->
              <div v-if="activeServiceDevelopmentView === '饼图'" class="view-content">
                <div
                  style="
        display: inline-block;
        width: 49%;
        height: 100%;
        vertical-align: top;
      "
                >
                  <ChartPie1
                    :data="serviceDevelopmentTypeRatio"
                    title="服务类型占比"
                    :key="serviceDevelopmentChartRefreshKey"
                  />
                </div>
                <div
                  style="
        display: inline-block;
        width: 49%;
        height: 100%;
        padding-left: 0.3vw;
        vertical-align: top;
        border-left: 0.3vh solid #02a6b5;
      "
                >
                  <ChartPie2
                    :data="serviceDevelopmentHighUtilizationRatio"
                    title="高使用率服务占比"
                    :key="serviceDevelopmentChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 列表视图 -->
              <div v-if="activeServiceDevelopmentView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="serviceDevelopmentList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openServiceDevelopmentDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="sysServiceTypeName"
                      label="服务类型"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="tbServiceDevelopmentPeriod"
                      label="统计周期"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="tbServiceDevelopmentNewServiceCount"
                      label="新增服务数量"
                      align="center"
                      width="120"
                    />
                    <ElTableColumn
                      prop="tbServiceDevelopmentCoverageRegionCount"
                      label="服务覆盖区域数"
                      align="center"
                      width="140"
                    />
                    <ElTableColumn
                      prop="tbServiceDevelopmentUserGrowthRate"
                      label="用户增长率(%)"
                      align="center"
                      width="120"
                    >
                      <template #default="scope">
            <span @click.stop="openServiceDevelopmentUserGrowthDialog(scope.row)" style="color:#409eff;cursor:pointer;">
              {{ formatDecimal(scope.row.tbServiceDevelopmentUserGrowthRate) }}
              <i class="el-icon-arrow-right" style="font-size:12px;"></i>
            </span>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbServiceDevelopmentServiceUtilizationRate"
                      label="服务使用率(%)"
                      align="center"
                      width="120"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbServiceDevelopmentServiceUtilizationRate) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      label="操作"
                      align="center"
                      width="100"
                      fixed="right"
                    >
                      <template #default="scope">
                        <ElButton type="primary" size="small" plain @click.stop="openServiceDevelopmentOptimizationDialog()">
                          优化
                        </ElButton>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
      </div>
    </div>

    <!-- 资源运行详情弹窗 -->
    <ElDialog
      v-model="resourceRunDetailDialogVisible"
      width="40%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
      title="停车场运行详情"
    >
      <div class="header-actions" style="margin-bottom:10px;">
        <div class="actions-right">
          <div class="view-btn-group">
            <ElButton
              v-for="item in resourceRunDetailViewBtnList"
              :key="item"
              :type="activeResourceRunDetailView === item ? 'primary' : ''"
              plain
              @click="changeResourceRunDetailView(item)"
              class="view-btn"
            >
              {{ item }}
            </ElButton>
          </div>
        </div>
      </div>
      <!-- 明细视图 -->
      <div v-if="activeResourceRunDetailView === '明细'" class="view-content" style="padding:0;">
        <ElDescriptions bordered :column="2" class="desc-detail">
          <ElDescriptionsItem label="资源ID" span="2">
            {{ parkResourceRunDetailSelectedRow.tbParkingParkingId || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="停车场名称">
            {{ parkResourceRunDetailSelectedRow.tbParkingName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="区域归属">
            {{ parkResourceRunDetailSelectedRow.tbRegionName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="环比使用率变化(%)">
            {{ formatDecimal(parkResourceRunDetailSelectedRow.tbParkingOperationChainUtilizationChange) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="本月最高使用率(%)">
            {{ formatDecimal(parkResourceRunDetailSelectedRow.tbParkingOperationMonthlyMaxUtilization) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="高峰时段">
            {{ parkResourceRunDetailSelectedRow.tbParkingOperationPeakHour || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="总泊位数" span="2">
            {{ parkResourceRunDetailSelectedRow.runDetail.tbParkingSpaceTotalCount || 0 }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="日均使用率(%)" span="2">
            {{ formatDecimal(parkResourceRunDetailSelectedRow.runDetail.tbParkingOperationDailyUtilizationRate) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="周转率" span="2">
            {{ formatDecimal(parkResourceRunDetailSelectedRow.runDetail.tbParkingOperationTurnoverRate) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="高峰时段使用率(%)" span="2">
            {{ formatDecimal(parkResourceRunDetailSelectedRow.runDetail.tbParkingOperationPeakUtilizationRate) }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>
      <!-- 趋势视图 -->
      <div v-if="activeResourceRunDetailView === '趋势'" class="view-content" style="padding:0;">
        <ChartLine3
          :data="parkResourceRunDetailSelectedRow.timeDistribution"
          title="时段使用率分布趋势"
          :key="resourceRunChartRefreshKey"
        />
      </div>
      <!-- 异常视图 -->
      <div v-if="activeResourceRunDetailView === '异常'" class="view-content" style="padding:0;">
        <div style="height:400px;">
          <ElTable
            :data="parkResourceRunDetailSelectedRow.abnormalRecords"
            border
            size="small"
            width="100%"
            height="100%"
            table-layout="fixed"
          >
            <ElTableColumn
              prop="time"
              label="异常时间"
              align="center"
              width="180"
            >
              <template #default="scope">
                {{ formatTimeStamp(scope.row.time) }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="content"
              label="异常内容"
              align="center"
              min-width="300"
            />
            <ElTableColumn
              prop="handleStatus"
              label="处理状态"
              align="center"
              width="120"
            >
              <template #default="scope">
                <ElTag :type="scope.row.handleStatus === '已处理' ? 'success' : 'warning'">
                  {{ scope.row.handleStatus || '-' }}
                </ElTag>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
      </div>
      <template #footer>
        <ElButton plain @click="closeResourceRunDetailDialog">关闭</ElButton>
      </template>
    </ElDialog>
    <!-- 周转率时段级趋势弹窗 -->
    <ElDialog
      v-model="resourceRunTurnoverDialogVisible"
      width="40%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
    >
      <template #title>
        <span>{{ parkResourceRunTurnoverSelectedRow.tbParkingName }} - 时段周转率趋势</span>
      </template>
      <div class="view-content" style="padding:0;height:400px;">
        <ChartLine3
          :data="parkResourceRunTurnoverSelectedRow"
          title="时段周转率趋势"
          :key="resourceRunChartRefreshKey"
        />
      </div>
      <template #footer>
        <ElButton plain @click="closeResourceRunTurnoverDialog">关闭</ElButton>
      </template>
    </ElDialog>

    <!-- 停车资源详情弹窗 -->
    <ElDialog
      v-model="parkResourceDetailDialogVisible"
      width="60%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
      title="停车场资源详情"
    >
      <div class="view-content" style="padding:0; display: flex">
        <div style="flex: 1">
          <ElDescriptions bordered :column="1" class="desc-detail">
            <ElDescriptionsItem label="资源编码" span="2">
              {{ parkResourceDetailSelectedRow.tbParkingCode || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="停车场名称">
              {{ parkResourceDetailSelectedRow.tbParkingName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="区域归属">
              {{ parkResourceDetailSelectedRow.tbRegionName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="停车场类型">
              {{ parkResourceDetailSelectedRow.sysParkingTypeName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="运营状态">
              <ElTag :type="parkResourceDetailSelectedRow.sysOperationStatusName === '运营中' ? 'success' : 'warning'">
                {{ parkResourceDetailSelectedRow.sysOperationStatusName || '-' }}
              </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="饱和率(%)">
              {{ formatDecimal(parkResourceDetailSelectedRow.tbParkingSaturationRate) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="运营年限(年)">
              {{ parkResourceDetailSelectedRow.tbParkingOperationYears || 0 }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="新能源车位占比(%)">
              {{ formatDecimal(parkResourceDetailSelectedRow.tbParkingNewEnergyRatio) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="总泊位数" span="2">
              {{ parkResourceDetailSelectedRow.tbParkingSpaceTotalCount || 0 }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="可用泊位数" span="2">
              {{ parkResourceDetailSelectedRow.tbParkingSpaceAvailableCount || 0 }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>
        <!-- 车位分布 -->
        <div style="flex: 1;">
          <ChartPie5
            :data="parkResourceDetailSelectedRow.spaceDistribution"
            title="车位分布"
            :key="parkResourceChartRefreshKey"
          />
        </div>
        <!-- 运营资质 -->
        <div style="flex: 1">
          <h4>运营资质：</h4>
          <ElTable
            :data="parkResourceDetailSelectedRow.operationQualifications"
            border
            size="small"
            width="100%"
            table-layout="fixed"
          >
            <ElTableColumn
              prop="name"
              label="资质名称"
              align="center"
              min-width="120"
            />
            <ElTableColumn
              prop="status"
              label="状态"
              align="center"
              width="120"
            >
              <template #default="scope">
                <ElTag :type="scope.row.status === '有效' ? 'success' : 'warning'">
                  {{ scope.row.status || '-' }}
                </ElTag>
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="expireTime"
              label="到期时间"
              align="center"
              width="120"
            />
          </ElTable>
        </div>
      </div>
      <template #footer>
        <ElButton plain @click="closeParkResourceDetailDialog">关闭</ElButton>
      </template>
    </ElDialog>

    <!-- 服务质量详情弹窗 -->
    <ElDialog
      v-model="serviceQualityDetailDialogVisible"
      width="40%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
      title="服务质量详情"
    >
      <div class="header-actions" style="margin-bottom:10px;">
        <div class="actions-right">
          <div class="view-btn-group">
            <ElButton
              v-for="item in serviceQualityDetailViewBtnList"
              :key="item"
              :type="activeServiceQualityDetailView === item ? 'primary' : ''"
              plain
              @click="changeServiceQualityDetailView(item)"
              class="view-btn"
            >
              {{ item }}
            </ElButton>
          </div>
        </div>
      </div>
      <!-- 明细视图 -->
      <div v-if="activeServiceQualityDetailView === '明细'" class="view-content" style="padding:0;">
        <ElDescriptions bordered :column="2" class="desc-detail">
          <ElDescriptionsItem label="统计周期" span="2">
            {{ parkServiceQualityDetailSelectedRow.tbServiceQualityPeriod || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="环比变化率(%)">
            {{ formatDecimal(parkServiceQualityDetailSelectedRow.tbServiceQualityChainChangeRate) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="行业均值对比(%)">
            {{ formatDecimal(parkServiceQualityDetailSelectedRow.tbServiceQualityIndustryAverageCompare) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="最优服务时段">
            {{ parkServiceQualityDetailSelectedRow.tbServiceQualityBestServiceHour || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="异常服务次数">
            {{ parkServiceQualityDetailSelectedRow.tbServiceQualityAbnormalCount || 0 }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="平均入场时长(秒)" span="2">
            {{ formatDecimal(parkServiceQualityDetailSelectedRow.detail.tbServiceQualityAverageEntryTime) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="平均缴费时长(秒)" span="2">
            {{ formatDecimal(parkServiceQualityDetailSelectedRow.detail.tbServiceQualityAveragePayTime) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="缴费成功率(%)" span="2">
            {{ formatDecimal(parkServiceQualityDetailSelectedRow.detail.tbServiceQualityPaySuccessRate) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="投诉率(%)" span="2">
            {{ formatDecimal(parkServiceQualityDetailSelectedRow.detail.tbServiceQualityComplaintRate) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="用户满意度(%)" span="2">
            {{ formatDecimal(parkServiceQualityDetailSelectedRow.detail.tbServiceQualitySatisfactionRate) }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>
      <!-- 异常视图 -->
      <div v-if="activeServiceQualityDetailView === '异常'" class="view-content" style="padding:0;">
        <div style="height:400px;">
          <ElTable
            :data="parkServiceQualityDetailSelectedRow.abnormalRecords"
            border
            size="small"
            width="100%"
            height="100%"
            table-layout="fixed"
          >
            <ElTableColumn
              prop="time"
              label="异常时间"
              align="center"
              width="180"
            >
              <template #default="scope">
                {{ formatTimeStamp(scope.row.time) }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="content"
              label="异常内容"
              align="center"
              min-width="300"
            />
            <ElTableColumn
              prop="handleStatus"
              label="处理状态"
              align="center"
              width="120"
            >
              <template #default="scope">
                <ElTag :type="scope.row.handleStatus === '已处理' ? 'success' : 'warning'">
                  {{ scope.row.handleStatus || '-' }}
                </ElTag>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
      </div>
      <!-- 评价视图 -->
      <div v-if="activeServiceQualityDetailView === '评价'" class="view-content" style="padding:0; display: flex;">
        <div style="flex: 1;">
          <ElDescriptions bordered :column="1" class="desc-detail">
            <ElDescriptionsItem label="好评占比(%)">
              {{ parkServiceQualityDetailSelectedRow.evaluationSummary.positive || 0 }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="中评占比(%)">
              {{ parkServiceQualityDetailSelectedRow.evaluationSummary.neutral || 0 }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="差评占比(%)">
              {{ parkServiceQualityDetailSelectedRow.evaluationSummary.negative || 0 }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>
        <div style="flex: 2; margin-left: 3vw;">
          <h4>关键词：</h4>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <ElTag v-for="(item, index) in parkServiceQualityDetailSelectedRow.evaluationSummary.keyWords" :key="index" type="info">
              {{ item }}
            </ElTag>
          </div>
        </div>
      </div>
      <template #footer>
        <ElButton plain @click="closeServiceQualityDetailDialog">关闭</ElButton>
      </template>
    </ElDialog>
    <!-- 用户评价明细弹窗 -->
    <ElDialog
      v-model="serviceQualityEvaluationDialogVisible"
      width="60%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
    >
      <template #title>
        <span>{{ parkServiceQualityEvaluationSelectedRow.tbServiceQualityPeriod }} - 用户评价明细</span>
      </template>
      <div class="view-content" style="padding:0;height:400px;">
        <ElTable
          :data="parkServiceQualityEvaluationSelectedRow.evaluationList"
          border
          size="small"
          width="100%"
          height="100%"
          table-layout="fixed"
        >
          <ElTableColumn
            prop="time"
            label="评价时间"
            align="center"
            width="180"
          >
            <template #default="scope">
              {{ formatTimeStamp(scope.row.time) }}
            </template>
          </ElTableColumn>
          <ElTableColumn
            prop="userName"
            label="用户名称"
            align="center"
            width="100"
          />
          <ElTableColumn
            prop="score"
            label="评分"
            align="center"
            width="80"
          >
            <template #default="scope">
              <ElTag :type="scope.row.score >= 4 ? 'success' : scope.row.score <= 2 ? 'danger' : 'warning'">
                {{ scope.row.score }}分
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn
            prop="content"
            label="评价内容"
            align="center"
            min-width="300"
          />
          <ElTableColumn
            prop="handleStatus"
            label="处理状态"
            align="center"
            width="120"
          >
            <template #default="scope">
              <ElTag :type="scope.row.handleStatus === '已处理' ? 'success' : scope.row.handleStatus === '已回复' ? 'info' : 'warning'">
                {{ scope.row.handleStatus || '-' }}
              </ElTag>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
      <template #footer>
        <ElButton plain @click="closeServiceQualityEvaluationDialog">关闭</ElButton>
      </template>
    </ElDialog>

    <!-- 业务流转效率详情弹窗 -->
    <ElDialog
      v-model="businessFlowDetailDialogVisible"
      width="50%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
      title="业务流转效率详情"
    >
      <div class="header-actions" style="margin-bottom:10px;">
        <div class="actions-right">
          <div class="view-btn-group">
            <ElButton
              v-for="item in businessFlowDetailViewBtnList"
              :key="item"
              :type="activeBusinessFlowDetailView === item ? 'primary' : ''"
              plain
              @click="changeBusinessFlowDetailView(item)"
              class="view-btn"
            >
              {{ item }}
            </ElButton>
          </div>
        </div>
      </div>
      <!-- 明细视图 -->
      <div v-if="activeBusinessFlowDetailView === '明细'" class="view-content" style="padding:0;">
        <ElDescriptions bordered :column="2" class="desc-detail">
          <ElDescriptionsItem label="业务ID" span="2">
            {{ businessFlowDetailSelectedRow.tbBusinessFlowId || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="业务类型">
            {{ businessFlowDetailSelectedRow.sysBusinessTypeName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="统计周期">
            {{ businessFlowDetailSelectedRow.tbBusinessFlowPeriod || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="环比流转时长变化(小时)">
            {{ formatDecimal(businessFlowDetailSelectedRow.tbBusinessFlowChainDurationChange) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="核心瓶颈环节">
            {{ businessFlowDetailSelectedRow.tbBusinessFlowCoreBottleneck || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="最优流转时段">
            {{ businessFlowDetailSelectedRow.tbBusinessFlowBestFlowHour || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="标准流转时长(小时)">
            {{ formatDecimal(businessFlowDetailSelectedRow.tbBusinessFlowStandardDuration) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="平均流转时长(小时)">
            {{ formatDecimal(businessFlowDetailSelectedRow.flowDetail.tbBusinessFlowAverageFlowDuration) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="流转完成率(%)" span="2">
            {{ formatDecimal(businessFlowDetailSelectedRow.flowDetail.tbBusinessFlowCompletionRate) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="瓶颈环节占比(%)" span="2">
            {{ formatDecimal(businessFlowDetailSelectedRow.flowDetail.tbBusinessFlowBottleneckRatio) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="超时率(%)" span="2">
            {{ formatDecimal(businessFlowDetailSelectedRow.flowDetail.tbBusinessFlowOvertimeRate) }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>
      <!-- 瓶颈视图 -->
      <div v-if="activeBusinessFlowDetailView === '瓶颈'" class="view-content" style="padding:0; display: flex; gap: 0.6vw;">
        <div style="flex: 1">
          <ElDescriptions bordered :column="1" class="desc-detail">
            <ElDescriptionsItem label="核心瓶颈环节">
              {{ businessFlowDetailSelectedRow.bottleneckAnalysis.linkName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="瓶颈占比(%)">
              {{ formatDecimal(businessFlowDetailSelectedRow.bottleneckAnalysis.bottleneckRatio) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="平均耗时(小时)">
              {{ formatDecimal(businessFlowDetailSelectedRow.bottleneckAnalysis.averageDuration) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="标准耗时(小时)">
              {{ formatDecimal(businessFlowDetailSelectedRow.bottleneckAnalysis.standardDuration) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="瓶颈原因">
              {{ businessFlowDetailSelectedRow.bottleneckAnalysis.reason || '-' }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>
        <div style="flex: 1">
          <h4>优化建议：</h4>
          <ElTable
            :data="businessFlowDetailSelectedRow.optimizationSuggestion"
            border
            size="small"
            width="100%"
            table-layout="fixed"
          >
            <ElTableColumn
              prop="content"
              label="建议内容"
              align="center"
              min-width="300"
            />
            <ElTableColumn
              prop="expectedEffect"
              label="预期效果"
              align="center"
              min-width="200"
            />
            <ElTableColumn
              prop="status"
              label="状态"
              align="center"
              width="120"
            >
              <template #default="scope">
                <ElTag :type="scope.row.status === '待实施' ? 'warning' : 'info'">
                  {{ scope.row.status || '-' }}
                </ElTag>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
      </div>
      <!-- 趋势视图 -->
      <div v-if="activeBusinessFlowDetailView === '趋势'" class="view-content" style="padding:0;">
        <ChartLine3
          :data="businessFlowDetailSelectedRow.trendData"
          title="流转时长趋势"
          :key="businessFlowChartRefreshKey"
        />
      </div>
      <template #footer>
        <ElButton plain @click="closeBusinessFlowDetailDialog">关闭</ElButton>
      </template>
    </ElDialog>
    <!-- 瓶颈环节流转时长趋势弹窗 -->
    <ElDialog
      v-model="businessFlowBottleneckDialogVisible"
      width="40%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
    >
      <template #title>
        <span>{{ businessFlowBottleneckSelectedRow.sysBusinessTypeName }} - 瓶颈环节流转时长趋势</span>
      </template>
      <div class="view-content" style="padding:0;height:400px;">
        <ChartLine3
          :data="businessFlowBottleneckSelectedRow"
          title="瓶颈环节流转时长趋势"
          :key="businessFlowChartRefreshKey"
        />
      </div>
      <template #footer>
        <ElButton plain @click="closeBusinessFlowBottleneckDialog">关闭</ElButton>
      </template>
    </ElDialog>

    <!-- 业务质量详情弹窗 -->
    <ElDialog
      v-model="businessQualityDetailDialogVisible"
      width="40%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
      title="业务质量详情"
    >
      <div class="header-actions" style="margin-bottom:10px;">
        <div class="actions-right">
          <div class="view-btn-group">
            <ElButton
              v-for="item in businessQualityDetailViewBtnList"
              :key="item"
              :type="activeBusinessQualityDetailView === item ? 'primary' : ''"
              plain
              @click="changeBusinessQualityDetailView(item)"
              class="view-btn"
            >
              {{ item }}
            </ElButton>
          </div>
        </div>
      </div>
      <!-- 明细视图 -->
      <div v-if="activeBusinessQualityDetailView === '明细'" class="view-content" style="padding:0;">
        <ElDescriptions bordered :column="2" class="desc-detail">
          <ElDescriptionsItem label="业务类型" span="2">
            {{ businessQualityDetailSelectedRow.sysBusinessTypeName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="统计周期" span="2">
            {{ businessQualityDetailSelectedRow.tbBusinessQualityPeriod || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="计费准确率(%)">
            {{ formatDecimal(businessQualityDetailSelectedRow.tbBusinessQualityBillingAccuracy) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="订单成功率(%)">
            {{ formatDecimal(businessQualityDetailSelectedRow.tbBusinessQualityOrderSuccessRate) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="异常订单数">
            {{ businessQualityDetailSelectedRow.tbBusinessQualityAbnormalOrderCount || 0 }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="合规率(%)">
            {{ formatDecimal(businessQualityDetailSelectedRow.tbBusinessQualityComplianceRate) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="异常率(%)">
            {{ formatDecimal(businessQualityDetailSelectedRow.tbBusinessQualityAbnormalRate) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="环比准确率变化(%)">
            {{ formatDecimal(businessQualityDetailSelectedRow.tbBusinessQualityChainAccuracyChange) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="主要异常类型">
            {{ businessQualityDetailSelectedRow.sysAbnormalTypeName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="整改完成数">
            {{ businessQualityDetailSelectedRow.tbBusinessQualityRectificationCount || 0 }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>
      <!-- 异常订单视图 -->
      <div v-if="activeBusinessQualityDetailView === '异常订单'" class="view-content" style="padding:0;">
        <div style="height:400px;">
          <ElTable
            :data="businessQualityDetailSelectedRow.abnormalOrderList"
            border
            size="small"
            width="100%"
            height="100%"
            table-layout="fixed"
          >
            <ElTableColumn
              prop="orderNo"
              label="订单编号"
              align="center"
              width="180"
            />
            <ElTableColumn
              prop="abnormalType"
              label="异常类型"
              align="center"
              width="120"
            />
            <ElTableColumn
              prop="abnormalTime"
              label="异常时间"
              align="center"
              width="180"
            >
              <template #default="scope">
                {{ formatTimeStamp(scope.row.abnormalTime) }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="handleStatus"
              label="处理状态"
              align="center"
              width="120"
            >
              <template #default="scope">
                <ElTag :type="scope.row.handleStatus === '已处理' ? 'success' : 'warning'">
                  {{ scope.row.handleStatus || '-' }}
                </ElTag>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
      </div>
      <!-- 合规记录视图 -->
      <div v-if="activeBusinessQualityDetailView === '合规记录'" class="view-content" style="padding:0;">
        <div style="height:400px;">
          <ElTable
            :data="businessQualityDetailSelectedRow.complianceCheckRecords"
            border
            size="small"
            width="100%"
            height="100%"
            table-layout="fixed"
          >
            <ElTableColumn
              prop="checkTime"
              label="检查时间"
              align="center"
              width="180"
            >
              <template #default="scope">
                {{ formatTimeStamp(scope.row.checkTime) }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="checkItem"
              label="检查项"
              align="center"
              min-width="200"
            />
            <ElTableColumn
              prop="checkResult"
              label="检查结果"
              align="center"
              width="120"
            >
              <template #default="scope">
                <ElTag :type="scope.row.checkResult === '合格' ? 'success' : 'danger'">
                  {{ scope.row.checkResult || '-' }}
                </ElTag>
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="checkPerson"
              label="检查人"
              align="center"
              width="120"
            />
          </ElTable>
        </div>
      </div>

      <template #footer>
        <ElButton plain @click="closeBusinessQualityDetailDialog">关闭</ElButton>
      </template>
    </ElDialog>
    <!-- 异常订单详情弹窗 -->
    <ElDialog
      v-model="businessQualityAbnormalOrderDialogVisible"
      width="60%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
    >
      <template #title>
        <span>{{ businessQualityAbnormalOrderSelectedRow.sysBusinessTypeName }} - 异常订单详情</span>
      </template>
      <div class="view-content" style="padding:0;height:400px;">
        <ElTable
          :data="businessQualityAbnormalOrderSelectedRow.abnormalOrderList"
          border
          size="small"
          width="100%"
          height="100%"
          table-layout="fixed"
        >
          <ElTableColumn
            prop="orderNo"
            label="订单编号"
            align="center"
            width="180"
          />
          <ElTableColumn
            prop="abnormalType"
            label="异常类型"
            align="center"
            width="120"
          />
          <ElTableColumn
            prop="abnormalTime"
            label="异常时间"
            align="center"
            width="180"
          >
            <template #default="scope">
              {{ formatTimeStamp(scope.row.abnormalTime) }}
            </template>
          </ElTableColumn>
          <ElTableColumn
            prop="abnormalReason"
            label="异常原因"
            align="center"
            min-width="200"
          />
          <ElTableColumn
            prop="handleStatus"
            label="处理状态"
            align="center"
            width="120"
          >
            <template #default="scope">
              <ElTag :type="scope.row.handleStatus === '已处理' ? 'success' : 'warning'">
                {{ scope.row.handleStatus || '-' }}
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn
            prop="handlePerson"
            label="处理人"
            align="center"
            width="120"
          />
        </ElTable>
      </div>
      <template #footer>
        <ElButton plain @click="closeBusinessQualityAbnormalOrderDialog">关闭</ElButton>
      </template>
    </ElDialog>
    <!-- 整改方案弹窗 -->
    <ElDialog
      v-model="businessQualityRectificationDialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="park-dialog"
      center
      destroy-on-close
      title="整改方案"
    >
      <el-form
        ref="rectificationFormRef"
        :model="rectificationForm"
        :rules="rectificationFormRules"
        label-width="80px"
        style="width: 100%;"
      >
        <el-form-item label="整改方案" prop="rectificationPlan">
          <el-input
            v-model="rectificationForm.rectificationPlan"
            type="textarea"
            :rows="6"
            placeholder="请输入整改方案"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <ElButton plain @click="closeBusinessQualityRectificationDialog">取消</ElButton>
        <ElButton type="primary" @click="submitRectificationData(businessQualityDetailSelectedRow.tbBusinessQualityId)">确认</ElButton>
      </template>
    </ElDialog>

    <!-- 资源发展详情弹窗 -->
    <ElDialog
      v-model="resourceDevelopmentDetailDialogVisible"
      width="40%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
      title="资源发展详情"
    >
      <div class="header-actions" style="margin-bottom:10px;">
        <div class="actions-right">
          <div class="view-btn-group">
            <ElButton
              v-for="item in resourceDevelopmentDetailViewBtnList"
              :key="item"
              :type="activeResourceDevelopmentDetailView === item ? 'primary' : ''"
              plain
              @click="changeResourceDevelopmentDetailView(item)"
              class="view-btn"
            >
              {{ item }}
            </ElButton>
          </div>
        </div>
      </div>
      <!-- 明细视图 -->
      <div v-if="activeResourceDevelopmentDetailView === '明细'" class="view-content" style="padding:0;">
        <ElDescriptions bordered :column="2" class="desc-detail">
          <ElDescriptionsItem label="发展ID" span="2">
            {{ resourceDevelopmentDetailSelectedRow.developmentId || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="资源类型">
            {{ resourceDevelopmentDetailSelectedRow.sysResourceTypeName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="统计周期">
            {{ resourceDevelopmentDetailSelectedRow.tbResourceDevelopmentPeriod || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="同比增长率(%)">
            {{ formatDecimal(resourceDevelopmentDetailSelectedRow.tbResourceDevelopmentYearOnYearGrowth) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="累计资源总量">
            {{ resourceDevelopmentDetailSelectedRow.tbResourceDevelopmentTotalAccumulated }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="重点发展区域">
            {{ resourceDevelopmentDetailSelectedRow.tbRegionName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="发展缺口">
            {{ resourceDevelopmentDetailSelectedRow.tbResourceDevelopmentDevelopmentGap }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="新增数量" span="2">
            {{ resourceDevelopmentDetailSelectedRow.developmentDetail.tbResourceDevelopmentNewCount || 0 }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="扩容数量" span="2">
            {{ resourceDevelopmentDetailSelectedRow.developmentDetail.tbResourceDevelopmentExpansionCount || 0 }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="优化数量" span="2">
            {{ resourceDevelopmentDetailSelectedRow.developmentDetail.tbResourceDevelopmentOptimizationCount || 0 }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="规划达成率(%)" span="2">
            {{ formatDecimal(resourceDevelopmentDetailSelectedRow.developmentDetail.tbResourceDevelopmentPlanCompletionRate) }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>
      <!-- 区域分布视图 -->
      <div v-if="activeResourceDevelopmentDetailView === '区域分布'" class="view-content" style="padding:0;">
        <ChartPie5
          :data="resourceDevelopmentDetailSelectedRow.regionDistribution"
          title="区域分布"
          :key="resourceDevelopmentChartRefreshKey"
        />
      </div>
      <!-- 规划明细视图 -->
      <div v-if="activeResourceDevelopmentDetailView === '规划明细'" class="view-content" style="padding:0;">
        <div style="height:400px;">
          <ElTable
            :data="resourceDevelopmentDetailSelectedRow.planDetails"
            border
            size="small"
            width="100%"
            height="100%"
            table-layout="fixed"
          >
            <ElTableColumn
              prop="period"
              label="统计周期"
              align="center"
              width="120"
            />
            <ElTableColumn
              prop="planCount"
              label="计划数量"
              align="center"
              width="100"
            />
            <ElTableColumn
              prop="actualCount"
              label="实际数量"
              align="center"
              width="100"
            />
            <ElTableColumn
              prop="completionRate"
              label="完成率(%)"
              align="center"
              width="120"
            >
              <template #default="scope">
                {{ formatDecimal(scope.row.completionRate) }}
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
      </div>
      <template #footer>
        <ElButton plain @click="closeResourceDevelopmentDetailDialog">关闭</ElButton>
      </template>
    </ElDialog>
    <!-- 月度新增趋势弹窗 -->
    <ElDialog
      v-model="resourceDevelopmentMonthlyDialogVisible"
      width="40%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
    >
      <template #title>
        <span>{{ resourceDevelopmentMonthlySelectedRow.sysResourceTypeName }} - 月度新增趋势</span>
      </template>
      <div class="view-content" style="padding:0;height:400px;">
        <ChartLine3
          :data="resourceDevelopmentMonthlySelectedRow"
          title="月度新增趋势"
          :key="resourceDevelopmentChartRefreshKey"
        />
      </div>
      <template #footer>
        <ElButton plain @click="closeResourceDevelopmentMonthlyDialog">关闭</ElButton>
      </template>
    </ElDialog>
    <!-- 发展规划调整弹窗 -->
    <ElDialog
      v-model="resourceDevelopmentPlanDialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="park-dialog"
      center
      destroy-on-close
      title="下周期发展规划调整"
    >
      <el-form
        ref="planAdjustmentFormRef"
        :model="planAdjustmentForm"
        :rules="planAdjustmentFormRules"
        label-width="80px"
        style="width: 100%;"
      >
        <el-form-item label="规划内容" prop="planContent">
          <el-input
            v-model="planAdjustmentForm.planContent"
            type="textarea"
            :rows="6"
            placeholder="请输入下周期发展规划内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <ElButton plain @click="closeResourceDevelopmentPlanDialog">取消</ElButton>
        <ElButton type="primary" @click="submitPlanAdjustmentData(resourceDevelopmentDetailSelectedRow.developmentId)">保存</ElButton>
      </template>
    </ElDialog>

    <!-- 设备运行详情弹窗 -->
    <ElDialog
      v-model="deviceRunDetailDialogVisible"
      width="40%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
      title="设备运行详情"
    >
      <div class="header-actions" style="margin-bottom:10px;">
        <div class="actions-right">
          <div class="view-btn-group">
            <ElButton
              v-for="item in deviceRunDetailViewBtnList"
              :key="item"
              :type="activeDeviceRunDetailView === item ? 'primary' : ''"
              plain
              @click="changeDeviceRunDetailView(item)"
              class="view-btn"
            >
              {{ item }}
            </ElButton>
          </div>
        </div>
      </div>
      <!-- 运行日志视图 -->
      <div v-if="activeDeviceRunDetailView === '运行日志'" class="view-content" style="padding:0;">
        <ElDescriptions bordered :column="2" class="desc-detail">
          <ElDescriptionsItem label="设备ID" span="2">
            {{ deviceRunDetailSelectedRow.tbDeviceDeviceId || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="设备名称">
            {{ deviceRunDetailSelectedRow.tbDeviceName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="设备类型">
            {{ deviceRunDetailSelectedRow.sysDeviceTypeName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="所属停车场">
            {{ deviceRunDetailSelectedRow.tbParkingName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="本月故障次数">
            {{ deviceRunDetailSelectedRow.tbDeviceOperationMonthlyFaultCount || 0 }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="下次维护时间">
            {{ deviceRunDetailSelectedRow.tbDeviceMaintainNextTime || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="运行效能等级">
            <ElTag :type="deviceRunDetailSelectedRow.sysEfficiencyLevelName === '高效' ? 'success' : deviceRunDetailSelectedRow.sysEfficiencyLevelName === '良好' ? 'info' : 'warning'">
              {{ deviceRunDetailSelectedRow.sysEfficiencyLevelName || '-' }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="在线率(%)" span="2">
            {{ formatDecimal(deviceRunDetailSelectedRow.runDetail.tbDeviceOperationOnlineRate) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="日均运行时长(小时)" span="2">
            {{ formatDecimal(deviceRunDetailSelectedRow.runDetail.tbDeviceOperationDailyRunningHours) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="故障率(%)" span="2">
            {{ formatDecimal(deviceRunDetailSelectedRow.runDetail.tbDeviceOperationFaultRate) }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>
      <!-- 故障记录视图 -->
      <div v-if="activeDeviceRunDetailView === '故障记录'" class="view-content" style="padding:0;">
        <div style="height:400px;">
          <ElTable
            :data="deviceRunDetailSelectedRow.faultRecords"
            border
            size="small"
            width="100%"
            height="100%"
            table-layout="fixed"
          >
            <ElTableColumn
              prop="time"
              label="故障时间"
              align="center"
              width="180"
            >
              <template #default="scope">
                {{ formatTimeStamp(scope.row.time) }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="content"
              label="故障内容"
              align="center"
              min-width="300"
            />
            <ElTableColumn
              prop="handleStatus"
              label="处理状态"
              align="center"
              width="120"
            >
              <template #default="scope">
                <ElTag :type="scope.row.handleStatus === '已修复' ? 'success' : 'warning'">
                  {{ scope.row.handleStatus || '-' }}
                </ElTag>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
      </div>
      <!-- 维护历史视图 -->
      <div v-if="activeDeviceRunDetailView === '维护历史'" class="view-content" style="padding:0;">
        <div style="height:400px;">
          <ElTable
            :data="deviceRunDetailSelectedRow.maintenanceHistory"
            border
            size="small"
            width="100%"
            height="100%"
            table-layout="fixed"
          >
            <ElTableColumn
              prop="time"
              label="维护时间"
              align="center"
              width="120"
            />
            <ElTableColumn
              prop="content"
              label="维护内容"
              align="center"
              min-width="300"
            />
            <ElTableColumn
              prop="maintainer"
              label="维护人"
              align="center"
              width="120"
            />
          </ElTable>
        </div>
      </div>
      <template #footer>
        <ElButton plain @click="closeDeviceRunDetailDialog">关闭</ElButton>
      </template>
    </ElDialog>
    <!-- 设备运维弹窗 -->
    <ElDialog
      v-model="deviceRunMaintenanceDialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="park-dialog"
      center
      destroy-on-close
      title="设备运维"
    >
      <el-form
        ref="maintenanceFormRef"
        :model="maintenanceForm"
        :rules="maintenanceFormRules"
        label-width="80px"
        style="width: 100%;"
      >
        <el-form-item label="运维类型" prop="maintenanceType">
          <el-radio-group v-model="maintenanceForm.maintenanceType">
            <el-radio
              v-for="item in maintenanceTypeOptions"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="运维描述" prop="description">
          <el-input
            v-model="maintenanceForm.description"
            type="textarea"
            :rows="6"
            placeholder="请填写运维描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <ElButton plain @click="closeDeviceRunMaintenanceDialog">取消</ElButton>
        <ElButton type="primary" @click="submitMaintenanceOrderData(deviceRunDetailSelectedRow.tbDeviceDeviceId)">确认</ElButton>
      </template>
    </ElDialog>

    <!-- 支撑资源详情弹窗 -->
    <ElDialog
      v-model="supportResourceDetailDialogVisible"
      width="50%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
      title="支撑资源详情"
    >
      <div class="header-actions" style="margin-bottom:10px;">
        <div class="actions-right">
          <div class="view-btn-group">
            <ElButton
              v-for="item in supportResourceDetailViewBtnList"
              :key="item"
              :type="activeSupportResourceDetailView === item ? 'primary' : ''"
              plain
              @click="changeSupportResourceDetailView(item)"
              class="view-btn"
            >
              {{ item }}
            </ElButton>
          </div>
        </div>
      </div>
      <!-- 配置明细视图 -->
      <div v-if="activeSupportResourceDetailView === '配置明细'" class="view-content" style="padding:0; display: flex;">
        <div style="flex: 1;">
          <ElDescriptions bordered :column="2" class="desc-detail">
            <ElDescriptionsItem label="资源ID" span="2">
              {{ supportResourceDetailSelectedRow.tbSupportResourceId || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="资源名称">
              {{ supportResourceDetailSelectedRow.tbSupportResourceName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="资源类型">
              {{ supportResourceDetailSelectedRow.sysSupportTypeName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="所属停车场">
              {{ supportResourceDetailSelectedRow.tbParkingName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="本月维护次数">
              {{ supportResourceDetailSelectedRow.tbSupportMaintainMonthlyCount || 0 }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="维护周期">
              {{ supportResourceDetailSelectedRow.tbSupportResourceMaintainCycle || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="覆盖车位比(%)">
              {{ formatDecimal(supportResourceDetailSelectedRow.tbSupportResourceCoverageRatio) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="数量" span="2">
              {{ supportResourceDetailSelectedRow.tbSupportResourceQuantity || 0 }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="可用数量" span="2">
              {{ supportResourceDetailSelectedRow.tbSupportResourceAvailableQuantity || 0 }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="完好率(%)" span="2">
              {{ formatDecimal(supportResourceDetailSelectedRow.tbSupportResourceIntactRate) }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>
        <div style="flex: 1; margin-left: 1vw;">
          <h4>资源配置明细：</h4>
          <ElTable
            :data="supportResourceDetailSelectedRow.resourceConfig"
            border
            size="small"
            width="100%"
            table-layout="fixed"
          >
            <ElTableColumn
              prop="name"
              label="配置项"
              align="center"
              min-width="120"
            />
            <ElTableColumn
              prop="value"
              label="配置值"
              align="center"
              min-width="200"
            />
          </ElTable>
        </div>
      </div>
      <!-- 维护记录视图 -->
      <div v-if="activeSupportResourceDetailView === '维护记录'" class="view-content" style="padding:0;">
        <div style="height:400px;">
          <ElTable
            :data="supportResourceDetailSelectedRow.maintainRecords"
            border
            size="small"
            width="100%"
            height="100%"
            table-layout="fixed"
          >
            <ElTableColumn
              prop="time"
              label="维护时间"
              align="center"
              width="180"
            >
              <template #default="scope">
                {{ formatTimeStamp(scope.row.time) }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="content"
              label="维护内容"
              align="center"
              min-width="300"
            />
            <ElTableColumn
              prop="maintainer"
              label="维护人"
              align="center"
              width="120"
            />
            <ElTableColumn
              prop="status"
              label="状态"
              align="center"
              width="120"
            >
              <template #default="scope">
                <ElTag :type="scope.row.status === '已完成' ? 'success' : 'warning'">
                  {{ scope.row.status || '-' }}
                </ElTag>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
      </div>
      <!-- 使用统计视图 -->
      <div v-if="activeSupportResourceDetailView === '使用统计'" class="view-content" style="padding:0;">
        <ChartLine3
          :data="supportResourceDetailSelectedRow.usageStatistics"
          title="本周使用统计"
          :key="supportResourceChartRefreshKey"
        />
      </div>
      <template #footer>
        <ElButton plain @click="closeSupportResourceDetailDialog">关闭</ElButton>
      </template>
    </ElDialog>
    <!-- 维护需求弹窗 -->
    <ElDialog
      v-model="supportResourceMaintainDialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="park-dialog"
      center
      destroy-on-close
      title="维护需求"
    >
      <el-form
        ref="maintainFormRef"
        :model="maintainForm"
        :rules="maintainFormRules"
        label-width="80px"
        style="width: 100%;"
      >
        <el-form-item label="维护需求" prop="maintainPlan">
          <el-input
            v-model="maintainForm.maintainPlan"
            type="textarea"
            :rows="6"
            placeholder="请输入维护需求"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <ElButton plain @click="closeSupportResourceMaintainDialog">取消</ElButton>
        <ElButton type="primary" @click="submitMaintainData(supportResourceList[0]?.tbSupportResourceId)">确认</ElButton>
      </template>
    </ElDialog>

    <!-- 投诉处理详情弹窗 -->
    <ElDialog
      v-model="complaintDetailDialogVisible"
      width="50%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
      title="投诉处理详情"
    >
      <div class="header-actions" style="margin-bottom:10px;">
        <div class="actions-right">
          <div class="view-btn-group">
            <ElButton
              v-for="item in complaintDetailViewBtnList"
              :key="item"
              :type="activeComplaintDetailView === item ? 'primary' : ''"
              plain
              @click="changeComplaintDetailView(item)"
              class="view-btn"
            >
              {{ item }}
            </ElButton>
          </div>
        </div>
      </div>
      <!-- 投诉内容视图 -->
      <div v-if="activeComplaintDetailView === '投诉内容'" class="view-content" style="padding:0;">
        <ElDescriptions bordered :column="2" class="desc-detail">
          <ElDescriptionsItem label="投诉ID" span="2">
            {{ complaintDetailSelectedRow.tbComplaintId || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="投诉编号">
            {{ complaintDetailSelectedRow.tbComplaintComplaintNo || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="投诉类型">
            {{ complaintDetailSelectedRow.sysComplaintTypeName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="投诉来源">
            {{ complaintDetailSelectedRow.tbComplaintSource || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="处理责任人">
            {{ complaintDetailSelectedRow.sysUserUserName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="复盘状态">
            <ElTag :type="complaintDetailSelectedRow.sysReviewStatusName === '已复盘' ? 'success' : 'warning'">
              {{ complaintDetailSelectedRow.sysReviewStatusName || '-' }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="提交时间" span="2">
            {{ formatTimeStamp(complaintDetailSelectedRow.tbComplaintSubmitTime) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="处理时长(小时)" span="2">
            {{ complaintDetailSelectedRow.tbComplaintProcessDuration ? formatDecimal(complaintDetailSelectedRow.tbComplaintProcessDuration) : '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="处理结果" span="2">
            <ElTag :type="complaintDetailSelectedRow.sysComplaintResultName === '已处理' ? 'success' : 'warning'">
              {{ complaintDetailSelectedRow.sysComplaintResultName || '-' }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="用户满意度(分)" span="2">
            {{ complaintDetailSelectedRow.tbComplaintUserSatisfaction ? formatDecimal(complaintDetailSelectedRow.tbComplaintUserSatisfaction) : '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="投诉标题" span="2">
            {{ complaintDetailSelectedRow.complaintContent.title || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="投诉内容" span="2">
            {{ complaintDetailSelectedRow.complaintContent.content || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="附件" span="2">
            <div v-if="complaintDetailSelectedRow.complaintContent.attachments && complaintDetailSelectedRow.complaintContent.attachments.length > 0">
          <span v-for="(item, index) in complaintDetailSelectedRow.complaintContent.attachments" :key="index" style="margin-right: 8px;">
            {{ item }}
          </span>
            </div>
            <span v-else>-</span>
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>
      <!-- 处理过程视图 -->
      <div v-if="activeComplaintDetailView === '处理过程'" class="view-content" style="padding:0;">
        <div style="height:400px;">
          <ElTable
            :data="complaintDetailSelectedRow.processRecords"
            border
            size="small"
            width="100%"
            height="100%"
            table-layout="fixed"
          >
            <ElTableColumn
              prop="time"
              label="处理时间"
              align="center"
              width="180"
            >
              <template #default="scope">
                {{ formatTimeStamp(scope.row.time) }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="operator"
              label="处理人"
              align="center"
              width="120"
            />
            <ElTableColumn
              prop="action"
              label="处理动作"
              align="center"
              width="120"
            />
            <ElTableColumn
              prop="content"
              label="处理内容"
              align="center"
              min-width="300"
            />
          </ElTable>
        </div>
      </div>
      <!-- 用户反馈视图 -->
      <div v-if="activeComplaintDetailView === '用户反馈'" class="view-content" style="padding:0;">
        <ElDescriptions bordered :column="1" class="desc-detail">
          <ElDescriptionsItem label="满意度评分(分)">
            {{ complaintDetailSelectedRow.userFeedback.satisfaction ? formatDecimal(complaintDetailSelectedRow.userFeedback.satisfaction) : '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="用户评价">
            {{ complaintDetailSelectedRow.userFeedback.comment || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="反馈时间">
            {{ formatTimeStamp(complaintDetailSelectedRow.userFeedback.feedbackTime) }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>
      <template #footer>
        <ElButton plain @click="closeComplaintDetailDialog">关闭</ElButton>
      </template>
    </ElDialog>
    <!-- 处理方案弹窗 -->
    <ElDialog
      v-model="complaintProcessDialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="park-dialog"
      center
      destroy-on-close
      title="处理方案"
    >
      <el-form
        ref="complaintProcessFormRef"
        :model="complaintProcessForm"
        :rules="complaintProcessFormRules"
        label-width="80px"
        style="width: 100%;"
      >
        <el-form-item label="处理方案" prop="processPlan">
          <el-input
            v-model="complaintProcessForm.processPlan"
            type="textarea"
            :rows="6"
            placeholder="请输入处理方案"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <ElButton plain @click="closeComplaintProcessDialog">取消</ElButton>
        <ElButton type="primary" @click="submitComplaintProcessData(complaintList[0]?.tbComplaintId)">确认</ElButton>
      </template>
    </ElDialog>
    <!-- 复盘意见弹窗 -->
    <ElDialog
      v-model="complaintReviewDialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="park-dialog"
      center
      destroy-on-close
      title="复盘意见"
    >
      <el-form
        ref="complaintReviewFormRef"
        :model="complaintReviewForm"
        label-width="80px"
        style="width: 100%;"
      >
        <el-form-item label="复盘意见">
          <el-input
            v-model="complaintReviewForm.reviewOpinion"
            type="textarea"
            :rows="6"
            placeholder="请输入复盘意见（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <ElButton plain @click="closeComplaintReviewDialog">取消</ElButton>
        <ElButton type="primary" @click="submitComplaintReviewData(complaintList[0]?.tbComplaintId)">保存</ElButton>
      </template>
    </ElDialog>

    <!-- 运维处置效率详情弹窗 -->
    <ElDialog
      v-model="maintainEfficiencyDetailDialogVisible"
      width="40%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
      title="运维处置效率详情"
    >
      <div class="view-content" style="padding:0;">
        <ElDescriptions bordered :column="2" class="desc-detail">
          <ElDescriptionsItem label="环比处置时长变化(小时)" span="2">
            {{ formatDecimal(maintainEfficiencyDetailSelectedRow.tbMaintainEfficiencyChainDurationChange) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="高频工单类型">
            {{ maintainEfficiencyDetailSelectedRow.sysWorkorderTypeName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="处置效率等级">
            {{ maintainEfficiencyDetailSelectedRow.sysEfficiencyLevelName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="超时工单数" span="2">
            {{ maintainEfficiencyDetailSelectedRow.tbMaintainEfficiencyOvertimeCount || 0 }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="平均处置时长(小时)" span="2">
            {{ formatDecimal(maintainEfficiencyDetailSelectedRow.detail.tbMaintainEfficiencyAverageHandleDuration) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="处置完成率(%)" span="2">
            {{ formatDecimal(maintainEfficiencyDetailSelectedRow.detail.tbMaintainEfficiencyCompletionRate) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="返工率(%)" span="2">
            {{ formatDecimal(maintainEfficiencyDetailSelectedRow.detail.tbMaintainEfficiencyReworkRate) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="一次性解决率(%)" span="2">
            {{ formatDecimal(maintainEfficiencyDetailSelectedRow.detail.tbMaintainEfficiencyOneTimeSolveRate) }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>
      <template #footer>
        <ElButton plain @click="closeMaintainEfficiencyDetailDialog">关闭</ElButton>
      </template>
    </ElDialog>
    <!-- 高频工单跟踪弹窗 -->
    <ElDialog
      v-model="maintainEfficiencyTrackDialogVisible"
      width="45%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
    >
      <template #title>
        <span>{{ maintainEfficiencyTrackSelectedRow.sysWorkorderTypeName }} - 工单跟踪处置情况</span>
      </template>
      <div class="view-content" style="padding:0;height:400px;">
        <ElTable
          :data="maintainEfficiencyTrackSelectedRow.workorderList"
          border
          size="small"
          width="100%"
          height="100%"
          table-layout="fixed"
        >
          <ElTableColumn
            prop="workorderNo"
            label="工单编号"
            align="center"
            width="180"
          />
          <ElTableColumn
            prop="createTime"
            label="创建时间"
            align="center"
            width="180"
          >
            <template #default="scope">
              {{ formatTimeStamp(scope.row.createTime) }}
            </template>
          </ElTableColumn>
          <ElTableColumn
            prop="handlePerson"
            label="处置人"
            align="center"
            width="100"
          />
          <ElTableColumn
            prop="handleDuration"
            label="处置时长(小时)"
            align="center"
            width="120"
          >
            <template #default="scope">
              {{ formatDecimal(scope.row.handleDuration) }}
            </template>
          </ElTableColumn>
          <ElTableColumn
            prop="isOvertime"
            label="是否超时"
            align="center"
            width="100"
          >
            <template #default="scope">
              <ElTag :type="scope.row.isOvertime ? 'danger' : 'success'">
                {{ scope.row.isOvertime ? '是' : '否' }}
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn
            prop="handleStatus"
            label="处置状态"
            align="center"
            width="120"
          >
            <template #default="scope">
              <ElTag :type="scope.row.handleStatus === '已完成' ? 'success' : 'warning'">
                {{ scope.row.handleStatus || '-' }}
              </ElTag>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
      <template #footer>
        <ElButton plain @click="closeMaintainEfficiencyTrackDialog">关闭</ElButton>
      </template>
    </ElDialog>
    <!-- 效率优化意见复盘弹窗 -->
    <ElDialog
      v-model="maintainEfficiencyReviewDialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="park-dialog"
      center
      destroy-on-close
      title="效率优化意见"
    >
      <el-form
        ref="reviewFormRef"
        :model="reviewForm"
        :rules="reviewFormRules"
        label-width="80px"
        style="width: 100%;"
      >
        <el-form-item label="优化意见" prop="reviewOpinion">
          <el-input
            v-model="reviewForm.reviewOpinion"
            type="textarea"
            :rows="6"
            placeholder="请输入效率优化意见（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <ElButton plain @click="closeMaintainEfficiencyReviewDialog">取消</ElButton>
        <ElButton type="primary" @click="submitMaintainEfficiencyReviewData(maintainEfficiencyDetailSelectedRow.tbMaintainEfficiencyId)">保存</ElButton>
      </template>
    </ElDialog>

    <!-- 服务发展详情弹窗 -->
    <ElDialog
      v-model="serviceDevelopmentDetailDialogVisible"
      width="40%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
      title="服务发展详情"
    >
      <div class="header-actions" style="margin-bottom:10px;">
        <div class="actions-right">
          <div class="view-btn-group">
            <ElButton
              v-for="item in serviceDevelopmentDetailViewBtnList"
              :key="item"
              :type="activeServiceDevelopmentDetailView === item ? 'primary' : ''"
              plain
              @click="changeServiceDevelopmentDetailView(item)"
              class="view-btn"
            >
              {{ item }}
            </ElButton>
          </div>
        </div>
      </div>
      <!-- 明细视图 -->
      <div v-if="activeServiceDevelopmentDetailView === '明细'" class="view-content" style="padding:0;">
        <ElDescriptions bordered :column="2" class="desc-detail">
          <ElDescriptionsItem label="服务ID" span="2">
            {{ serviceDevelopmentDetailSelectedRow.tbServiceDevelopmentId || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="服务类型">
            {{ serviceDevelopmentDetailSelectedRow.sysServiceTypeName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="统计周期">
            {{ serviceDevelopmentDetailSelectedRow.tbServiceDevelopmentPeriod || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="同比增长率(%)">
            {{ formatDecimal(serviceDevelopmentDetailSelectedRow.tbServiceDevelopmentYearOnYearGrowth) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="累计服务用户数">
            {{ formatNumber(serviceDevelopmentDetailSelectedRow.tbServiceDevelopmentTotalUserCount) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="服务优化需求数">
            {{ serviceDevelopmentDetailSelectedRow.tbServiceDevelopmentOptimizationDemandCount || 0 }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="新增服务数量" span="2">
            {{ serviceDevelopmentDetailSelectedRow.detail.tbServiceDevelopmentNewServiceCount || 0 }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="覆盖区域数" span="2">
            {{ serviceDevelopmentDetailSelectedRow.detail.tbServiceDevelopmentCoverageRegionCount || 0 }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="用户增长率(%)" span="2">
            {{ formatDecimal(serviceDevelopmentDetailSelectedRow.detail.tbServiceDevelopmentUserGrowthRate) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="服务使用率(%)" span="2">
            {{ formatDecimal(serviceDevelopmentDetailSelectedRow.detail.tbServiceDevelopmentServiceUtilizationRate) }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>
      <!-- 用户反馈视图 -->
      <div v-if="activeServiceDevelopmentDetailView === '用户反馈'" class="view-content" style="padding:0;">
        <div style="height:400px;">
          <ElTable
            :data="serviceDevelopmentDetailSelectedRow.userFeedback"
            border
            size="small"
            width="100%"
            height="100%"
            table-layout="fixed"
          >
            <ElTableColumn
              prop="time"
              label="反馈时间"
              align="center"
              width="180"
            >
              <template #default="scope">
                {{ formatTimeStamp(scope.row.time) }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="userName"
              label="用户名称"
              align="center"
              width="100"
            />
            <ElTableColumn
              prop="content"
              label="反馈内容"
              align="center"
              min-width="300"
            />
            <ElTableColumn
              prop="score"
              label="评分"
              align="center"
              width="80"
            >
              <template #default="scope">
                <ElTag :type="scope.row.score >= 4 ? 'success' : scope.row.score <= 2 ? 'danger' : 'warning'">
                  {{ scope.row.score }}分
                </ElTag>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
      </div>
      <!-- 覆盖区域视图 -->
      <div v-if="activeServiceDevelopmentDetailView === '覆盖区域'" class="view-content" style="padding:0;">
        <div style="height:400px;">
          <ElTable
            :data="serviceDevelopmentDetailSelectedRow.coverageRegionDetail"
            border
            size="small"
            width="100%"
            height="100%"
            table-layout="fixed"
          >
            <ElTableColumn
              prop="regionName"
              label="区域名称"
              align="center"
              width="120"
            />
            <ElTableColumn
              prop="coverageRate"
              label="覆盖率(%)"
              align="center"
              width="120"
            >
              <template #default="scope">
                {{ formatDecimal(scope.row.coverageRate) }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="userCount"
              label="用户数"
              align="center"
              width="120"
            />
          </ElTable>
        </div>
      </div>
      <template #footer>
        <ElButton plain @click="closeServiceDevelopmentDetailDialog">关闭</ElButton>
      </template>
    </ElDialog>
    <!-- 用户增长趋势弹窗 -->
    <ElDialog
      v-model="serviceDevelopmentUserGrowthDialogVisible"
      width="40%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
    >
      <template #title>
        <span>{{ serviceDevelopmentUserGrowthSelectedRow.sysServiceTypeName }} - 月度用户增长趋势</span>
      </template>
      <div class="view-content" style="padding:0;height:400px;">
        <ChartLine3
          :data="serviceDevelopmentUserGrowthSelectedRow"
          title="月度用户增长趋势"
          :key="serviceDevelopmentChartRefreshKey"
        />
      </div>
      <template #footer>
        <ElButton plain @click="closeServiceDevelopmentUserGrowthDialog">关闭</ElButton>
      </template>
    </ElDialog>
    <!-- 服务优化建议弹窗 -->
    <ElDialog
      v-model="serviceDevelopmentOptimizationDialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="park-dialog"
      center
      destroy-on-close
      title="服务优化建议"
    >
      <el-form
        ref="optimizationFormRef"
        :model="optimizationForm"
        :rules="optimizationFormRules"
        label-width="80px"
        style="width: 100%;"
      >
        <el-form-item label="优化建议" prop="optimizationPlan">
          <el-input
            v-model="optimizationForm.optimizationPlan"
            type="textarea"
            :rows="6"
            placeholder="请输入服务优化建议"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <ElButton plain @click="closeServiceDevelopmentOptimizationDialog">取消</ElButton>
        <ElButton type="primary" @click="submitOptimizationData(serviceDevelopmentDetailSelectedRow.tbServiceDevelopmentId)">保存</ElButton>
      </template>
    </ElDialog>

    <ElDialog
      v-model="tipDialogVisible"
      width="460px"
      style="background-color: lightgoldenrodyellow"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      center
      destroy-on-close
      top="5vh"
    >
      <div
        style="
        padding-bottom: 10px;
        font-size: 15px;
        color: #333;
        text-align: center;
      "
      >
        {{ tipDialogContent }}
      </div>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../templatesstyle/common';
@import '../../../templatesstyle/table1';
@import '../../../templatesstyle/table2-rank';
@import '../../../templatesstyle/table3';
@import '../../../templatesstyle/table4';
@import '../../../templatesstyle/indicator-cards3';
@import '../../../templatesstyle/indicator-cards4';

@keyframes blink {
  0%,100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.page-container {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  padding: 0 20px;
  overflow: hidden !important;
  color: #fff;
  background: url('../../images/bg.jpg');
  background-size: 100% 100%;
}

.header-box {
  position: relative;
  width: 100%;
  height: 10vh;
  font-size: 2.1vw;
  font-weight: bold;
  color: #0cf;
  background: url('../../images/head_bg.png') no-repeat;
  background-size: 100% 100%;
  .head-name {
    position: absolute;
    left: 50%;
    display: inline-block;
    line-height: 9vh;
    white-space: nowrap;
    transform: translateX(-50%);
  }
}

.panel {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 0.5vw;
  overflow: hidden !important;
  background: url('../../images/line(1).png') rgb(255 255 255 / 4%);
  border: 0.2vh solid rgb(25 186 139 / 17%);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1vh 1.2vw;
  border-bottom: 1px solid rgb(0 204 255 / 10%);
  h2 {
    display: flex;
    align-items: center;
    margin: 0;
    font-size: 1.1vw;
    font-weight: 600;
    color: #ffb800;
  }
}

.panel-body {
  flex: 1;
  height: calc(100% - 6vh);
  padding: 1.2vw;
  overflow: hidden;
}

.mainbox {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.6vw;
  height: 91vh;
  margin: 0 auto;
  overflow: hidden !important;
}

.top { display: flex; gap: 0.6vw; height: 50%; overflow: hidden !important; }
.top-left { flex: 1; }
.top-middle { flex: 1; }
.top-right { flex: 1; }
.bottom { display: flex; gap: 0.6vw; height: 46%; overflow: hidden !important; }
.bottom-left { flex: 1; }
.bottom-middle { flex: 1; }
.bottom-right { flex: 1; }

.header-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 0.2vw;
  .actions-left p {
    margin: 0;
    font-size: 0.9vw;
    font-weight: 500;
    color: #00ffd0;
  }
  .view-btn-group { display: flex; margin-right: 0.5vw; }
  :deep(.view-btn) {
    padding: 0 0.4vw;
    font-size: 0.6vw;
    color: #fff;
    background-color: transparent;
    border-color: rgb(25 186 139 / 60%);
    &:hover { color: #00ffd0; border-color: #00ffd0; }
    &.el-button--primary {
      color: #afc2ff;
      background-color: rgb(0 204 255 / 20%);
      border-color: rgb(25 186 139 / 60%);
    }
  }
  .panel-fullscreen-btn {
    margin-right: 0.5vw;
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 0;
  }
}

.view-content {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
  overflow: hidden !important;
  padding: 0.2vw !important;
  box-sizing: border-box !important;
}

.content-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 1vw;
  color: #00ffd0;
}

.blink-animation { animation: blink 1.5s infinite; }

:deep(.panel) {
  .el-tab-pane { display: flex; flex-direction: column; width: 100% !important; height: 100% !important; }
  .view-content { flex: 1; width: 100% !important; height: 100% !important; min-height: 300px !important; }
  .view-content > div { width: 100% !important; height: 100% !important; }
}

// 弹窗样式
:deep(.park-dialog) {
  --el-dialog-bg-color: #fff !important;
  --el-text-color-primary: #000 !important;
  --el-text-color-regular: #000 !important;
  --el-text-color-secondary: #000 !important;
  --el-button-text-color: #000 !important;

  color: #000 !important;
  background: var(--el-dialog-bg-color) !important;
  border-radius: 8px !important;
  box-shadow: 0 5px 20px rgb(0 0 0 / 10%) !important;

  .el-dialog__header {
    padding: 12px 20px;
    border-bottom: 1px solid rgb(0 198 255 / 30%);
  }

  .el-dialog__title {
    font-size: 0.9vw;
    font-weight: 500;
    color: #000 !important;
  }

  .el-dialog__headerbtn {
    top: 12px;
    right: 20px;
  }

  .el-dialog__close {
    font-size: 18px;
    color: #000 !important;

    &:hover {
      color: rgb(0 122 255 / 70%) !important;
    }
  }

  .el-dialog__body {
    max-height: 70vh;
    padding: 20px;
    overflow-y: auto;
  }

  .el-descriptions {
    width: 100%;
    font-size: 0.7vw;

    .el-descriptions__label {
      width: 4vw;
      font-weight: 500;
      color: #000 !important;
    }
  }

  // 新增：覆盖按钮文字颜色（包括默认/hover/active状态）
  .el-button {
    --el-button-text-color: #000 !important;
    --el-button-hover-text-color: #000 !important;
    --el-button-active-text-color: #000 !important;
    color: #000 !important;
  }

  // 新增：覆盖输入框、下拉框等表单元素文字颜色
  .el-input, .el-select, .el-input__inner, .el-select__input {
    color: #000 !important;
  }
}

:deep(.el-descriptions) {
  .el-descriptions__cell {
    border: 1px solid rgba(246, 177, 177, 0.5) !important;
    padding-left: 1vw;
    padding-top: 1.2vh;
  }
}

:deep(.el-table__row) {
  cursor: pointer;
}
</style>
