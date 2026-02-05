<script setup lang="ts">
import {getCurrentInstance, nextTick, onMounted, onUnmounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {Filter, FullScreen, Refresh} from '@element-plus/icons-vue';
import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElSwitch,
  ElTable,
  ElTableColumn,
  ElTabPane,
  ElTabs,
  ElTag,
  ElDescriptions,
  ElDescriptionsItem,
  ElTimeline,
  ElTimelineItem,
  ElProgress,
  ElRadio,
  ElRadioGroup,
  type FormInstance
} from 'element-plus';
import screenFull from 'screenfull';

import {
  fetchRegionCooperationList,
  fetchRegionCooperationIndicators,
  fetchRegionCooperationAreaCount,
  fetchRegionCooperationTaskTypeCount,
  fetchRegionCooperationCompletionRateTrend,
  fetchRegionCooperationDetail,
  fetchRegionCooperationTrack,
  submitRegionCooperationAction,
  fetchDepartmentCooperationList,
  fetchDepartmentCooperationIndicators,
  fetchDepartmentCooperationDeptCount,
  fetchDepartmentCooperationTypeCount,
  fetchDepartmentCooperationDeptRatio,
  fetchDepartmentCooperationTypeRatio,
  fetchDepartmentCooperationDetail,
  submitCooperationResponse,
  submitCooperationFeedback,
  fetchIndustryCooperationList,
  fetchIndustryCooperationIndicators,
  fetchIndustryCooperationIndustryCount,
  fetchIndustryCooperationSceneCount,
  fetchIndustryCooperationIndustryRatio,
  fetchIndustryCooperationSceneRatio,
  fetchIndustryCooperationDetail,
  submitIndustryCooperationAssist,
  submitIndustryCooperationEvaluate,
  fetchLevelCooperationList,
  fetchLevelCooperationIndicators,
  fetchLevelCooperationLevelCount,
  fetchLevelCooperationUnitCount,
  fetchLevelCooperationStatusRatio,
  fetchLevelCooperationDetail,
  submitLevelCooperationFeedback,
  fetchGovEnterpriseCooperationList,
  fetchGovEnterpriseCooperationIndicators,
  fetchGovEnterpriseCooperationDeptCount,
  fetchGovEnterpriseCooperationEntTypeCount,
  fetchGovEnterpriseCooperationItemRatio,
  fetchGovEnterpriseCooperationSatisfactionRatio,
  fetchGovEnterpriseCooperationDetail,
  submitCooperationTracking,
  submitCooperationEvaluation,
  fetchMaintainerDynamicList,
  fetchMaintainerDynamicIndicators,
  fetchMaintainerDynamicDeptTaskCount,
  fetchMaintainerDynamicAreaTaskCount,
  fetchMaintainerDynamicDetail,
  submitMaintainerDispatchTask,
  fetchSpecialCooperationList,
  fetchSpecialCooperationIndicators,
  fetchSpecialCooperationSceneCount,
  fetchSpecialCooperationUnitCount,
  fetchSpecialCooperationSceneRatio,
  fetchSpecialCooperationStatusRatio,
  fetchSpecialCooperationDetail,
  submitExecutionProgress,
  submitReviewConclusion,
  fetchEfficiencyEvaluationList,
  fetchEfficiencyEvaluationIndicators,
  fetchEfficiencyEvaluationTypeCompare,
  fetchEfficiencyEvaluationAreaCompare,
  fetchEfficiencyEvaluationTrend,
  fetchEfficiencyEvaluationRecurrenceRatio,
  fetchEfficiencyEvaluationDetail,
  submitOptimizationPlan,
} from '#/api/genchuan/industry/parkingmgmt/overview/SynergyLinkage.ts';

import ChartLine1 from '#/views/genchuan/industry/templatesstatchart/ChartLine1.vue';
import ChartLine2 from '#/views/genchuan/industry/templatesstatchart/ChartLine2.vue';
import ChartPie1 from '#/views/genchuan/industry/templatesstatchart/ChartPie1.vue';
import ChartPie2 from '#/views/genchuan/industry/templatesstatchart/ChartPie2.vue';
import VerticalBar1 from '#/views/genchuan/industry/templatesstatchart/VerticalBar1.vue';
import VerticalBar2 from '#/views/genchuan/industry/templatesstatchart/VerticalBar2.vue';

const pageContainerRef = ref<HTMLElement | null>(null);
const router = useRouter();
const instance = getCurrentInstance();
const currentFullscreenPanel = ref<HTMLElement | null>(null);

// 标签页激活状态
const topLeftActiveTab = ref('tab1');

const tipDialogVisible = ref(false);
const tipDialogContent = ref('');

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

// 时间戳格式化方法
const formatNumber = (num: number) => {
  return num.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
};
const formatDecimal = (num: number) => num.toFixed(1);
const formatCompleteRate = (rate: number) => {
  return `${(rate * 100).toFixed(1)}%`;
};
const formatSpecialCoopTimeStamp = (timeStamp: any) => {
  if (!timeStamp) return '-';
  const date = new Date(Number(timeStamp));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  if (!currentFullscreenPanel.value) return;
  if (screenFull.isFullscreen) {
    setTimeout(() => {
      crossRegionCoopChartRefreshKey.value++;
      coopAnalysisChartRefreshKey.value++;
      govCoopChartRefreshKey.value++;
      specialCoopChartRefreshKey.value++;
      coopEfficiencyChartRefreshKey.value++;
    }, 300);
  }
  else {
    currentFullscreenPanel.value.style = '';
    nextTick(() => {
      crossRegionCoopChartRefreshKey.value++;
      coopAnalysisChartRefreshKey.value++;
      govCoopChartRefreshKey.value++;
      specialCoopChartRefreshKey.value++;
      coopEfficiencyChartRefreshKey.value++;
    });
    currentFullscreenPanel.value = null;
  }
};

// 图表通用类型
interface ChartRatioData {
  legend: string[];
  series: {
    name: string;
    data: {
      name: string;
      value: number;
    }[];
  }[];
}
interface ChartLineData {
  xAxis: string[];
  series: {
    name: string;
    data: number[];
  }[];
}
interface ChartBarData {
  xAxis: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

// 区域协同TS类型定义
interface RegionCooperationRow {
  bizCrossRegionCoopCrossRegionCoopId: string;
  launchAreaName: string;
  cooperateAreaName: string;
  sysTaskTypeName: string;
  sysCooperationStatusName: string;
  bizCrossRegionCoopCreateTime: string;
}
interface RegionCooperationIndicators {
  totalCooperationCount: number; // 跨区域协同总数
  completedCount: number; // 已完成数
  averageCompletionRate: number; // 平均完成率(%)
}
interface RegionCooperationDetail {
  bizCrossRegionCoopCrossRegionCoopId: string;
  launchAreaName: string;
  cooperateAreaName: string;
  sysTaskTypeName: string;
  sysCooperationStatusName: string;
  bizCrossRegionCoopCreateTime: string;
  // 详情字段
  bizCrossRegionCoopCompletionRate: number; // 完成率(%)
  bizCrossRegionCoopAverageCoopDuration: number; // 平均协同时长(小时)
  bizCrossRegionCoopCompleteTime: string; // 完成时间
  sysUserUserName: string; // 负责人
  // 协同完整信息
  cooperationInfo: {
    cooperationContent: string;
    cooperationStandard: string;
    cooperationCycle: string;
    cooperationContact: string;
  };
  // 任务分工
  taskDivision: {
    area: string;
    task: string;
    person: string;
    status: string;
  }[];
  // 进度日志
  progressLogs: {
    time: string;
    content: string;
    operator: string;
  }[];
}
interface RegionCooperationTrack {
  bizCrossRegionCoopCrossRegionCoopId: string;
  launchAreaName: string;
  cooperateAreaName: string;
  // 协同进度时间轴
  progressTimeline: {
    time: string;
    stage: string;
    status: string;
  }[];
  // 各区域反馈结果
  areaFeedbackResults: {
    area: string;
    feedback: string;
    time: string;
    status: string;
  }[];
}
interface RegionCooperationActionForm {
  actionContent: string;
}

// 部门协同TS类型定义
interface DepartmentCooperationRow {
  bizCrossDepartmentCoopCrossDepartmentCoopId: string;
  sysDeptDeptName: string;
  sysCooperationTypeName: string;
  bizCrossDepartmentCoopCoopTask: string;
  bizCrossDepartmentCoopResponseDuration: number;
  sysCooperationStatusName: string;
}
interface DepartmentCooperationIndicators {
  totalCooperationCount: number; // 跨部门协同总数
  responseRate: number; // 响应率(%)
  satisfactionRate: number; // 群众满意度(%)
}
interface DepartmentCooperationDetail {
  bizCrossDepartmentCoopCrossDepartmentCoopId: string;
  sysDeptDeptName: string;
  sysCooperationTypeName: string;
  bizCrossDepartmentCoopCoopTask: string;
  bizCrossDepartmentCoopResponseDuration: number;
  sysCooperationStatusName: string;
  // 详情字段
  bizCrossDepartmentCoopDisposalDuration: number; // 处置时长(小时)
  sysSatisfactionName: string; // 群众满意度
  bizCrossDepartmentCoopCompleteTime: string; // 完成时间
  bizCrossDepartmentCoopFeedbackResult: string; // 反馈结果
  // 任务要求
  taskRequirements: {
    item: string;
    value: string;
  }[];
  // 部门分工
  departmentDivision: {
    deptName: string;
    task: string;
    person: string;
  }[];
}
interface CooperationResponseForm {
  responseContent: string;
}
interface CooperationFeedbackForm {
  feedbackResult: string;
  evidenceFiles: File[];
}

// 行业协同TS类型定义
interface IndustryCooperationRow {
  bizCrossIndustryCoopCrossIndustryCoopId: string;
  sysIndustryIndustryName: string;
  sysCoopSceneName: string;
  bizCrossIndustryCoopProblemDesc: string;
  bizCrossIndustryCoopCreateTime: string;
  sysEffectLevelName: string;
  sysCooperationStatusName: string;
}
interface IndustryCooperationIndicators {
  totalCooperationCount: number; // 跨行业协同总数
  problemSolveRate: number; // 问题解决率(%)
  satisfactionRate: number; // 群众满意度(%)
}
interface IndustryCooperationDetail {
  bizCrossIndustryCoopCrossIndustryCoopId: string;
  sysIndustryIndustryName: string;
  sysCoopSceneName: string;
  bizCrossIndustryCoopProblemDesc: string;
  bizCrossIndustryCoopCreateTime: string;
  sysEffectLevelName: string;
  sysCooperationStatusName: string;
  // 详情字段
  bizCrossIndustryCoopProblemSolveRate: number; // 问题解决率
  sysSatisfactionName: string; // 群众满意度
  bizCrossIndustryCoopCompleteTime: string; // 完成时间
  sysResponsibleUnitName: string; // 责任主体
  // 行业需求
  industryRequirements: {
    item: string;
    value: string;
  }[];
  // 配合要求
  cooperationRequirements: {
    item: string;
    value: string;
  }[];
}
interface IndustryCooperationAssistForm {
  assistContent: string;
}
interface IndustryCooperationEvaluateForm {
  evaluateResult: string;
  score: number | null;
}

// 层级协同TS类型定义
interface LevelCooperationRow {
  bizCrossLevelCoopCrossLevelCoopId: string;
  issueLevelName: string; // 下达层级
  receiveLevelName: string; // 接收层级
  bizCrossLevelCoopInstructionContent: string;
  sysInstructionStatusName: string;
  bizCrossLevelCoopIssueTime: string;
  currentUserLevel: string; // 当前用户层级
}
interface LevelCooperationIndicators {
  totalCooperationCount: number; // 跨层级协同总数
  instructionCompleteRate: number; // 指令完成率(%)
  averageFeedbackDuration: number; // 平均反馈时长(天)
}
interface LevelCooperationDetail {
  bizCrossLevelCoopCrossLevelCoopId: string;
  issueLevelName: string;
  receiveLevelName: string;
  bizCrossLevelCoopInstructionContent: string;
  sysInstructionStatusName: string;
  bizCrossLevelCoopIssueTime: string;
  currentUserLevel: string;
  // 详情字段
  bizCrossLevelCoopAverageFeedbackDuration: number; // 平均反馈时长
  sysResponsibleUnitName: string; // 责任单位
  bizCrossLevelCoopFeedbackResult: string; // 反馈结果
  bizCrossLevelCoopCompleteTime: string; // 完成时间
  // 层级分工
  levelDivision: {
    levelName: string;
    task: string;
    person: string;
  }[];
  // 反馈记录
  feedbackRecords: {
    time: string;
    level: string;
    content: string;
  }[];
  // 流转时间轴
  flowTimeline: {
    time: string;
    level: string;
    action: string;
    status: string;
  }[];
}
interface LevelCooperationFeedbackForm {
  feedbackContent: string;
  evidenceFiles: File[];
}

// 运维人员动态TS类型定义
interface MaintainerDynamicRow {
  sysMaintainUserMaintainUserId: string; // 人员ID
  sysUserUserName: string; // 人员姓名
  sysDeptDeptName: string; // 所属部门
  sysAreaAreaName: string; // 负责区域
  sysOnDutyStatusName: string; // 当前状态
  bizCoopStatCurrentCoopTaskCount: number; // 当前协同任务数
}

interface MaintainerDynamicIndicators {
  totalMaintainerCount: number; // 总运维人数
  onDutyCount: number; // 在岗人数
  totalCoopTaskCount: number; // 当前协同任务总数
}

interface MaintainerDynamicDetail {
  sysMaintainUserMaintainUserId: string;
  sysUserUserName: string;
  sysDeptDeptName: string;
  sysAreaAreaName: string;
  sysOnDutyStatusName: string;
  bizCoopStatCurrentCoopTaskCount: number;
  // 详情字段
  bizCoopStatCompletedCoopTaskCount: number; // 已完成协同任务数
  bizCoopStatCoopResponseDuration: number; // 协同响应时长
  sysCooperationTypeName: string; // 擅长协同类型
  bizCoopStatLatestCoopTime: string; // 最近协同时间
  // 基础信息
  contactPhone: string; // 联系方式（脱敏）
  email: string; // 邮箱
  skillTags: string[]; // 技能标签
  // 协同历史
  cooperationHistory: {
    taskId: string;
    taskName: string;
    status: string;
    time: string;
  }[];
}

interface DispatchTaskForm {
  taskDetail: string; // 协同任务详情
  coopTarget: string; // 指定协同对象
}

// 政企协同TS类型定义
interface GovEnterpriseCooperationRow {
  bizGovernmentEnterpriseCoopGovEnterpriseCoopId: string;
  sysDeptDeptName: string;
  sysMerchantMerchantName: string;
  sysEnterpriseTypeName: string;
  sysCooperationItemName: string;
  sysCooperationStatusName: string;
}
interface GovEnterpriseCooperationIndicators {
  totalCooperationCount: number; // 政企协同总数
  responseRate: number; // 响应率(%)
  satisfactionRate: number; // 满意度(%)
}
interface GovEnterpriseCooperationDetail {
  bizGovernmentEnterpriseCoopGovEnterpriseCoopId: string;
  sysDeptDeptName: string;
  sysMerchantMerchantName: string;
  sysEnterpriseTypeName: string;
  sysCooperationItemName: string;
  sysCooperationStatusName: string;
  // 详情字段
  bizGovernmentEnterpriseCoopProgressFeedback: string; // 进度反馈
  sysSatisfactionName: string; // 满意度评价
  bizGovernmentEnterpriseCoopCompleteTime: string; // 完成时间
  bizGovernmentEnterpriseCoopCoopCycle: string; // 协同周期
  // 协同详情
  cooperationDetail: {
    launchTime: string;
    expectedCompleteTime: string;
    contactPerson: string;
    contactPhone: string;
    cooperationContent: string;
  };
  // 责任分工
  responsibilityDivision: {
    department: string;
    task: string;
    person: string;
    phone: string;
  }[];
  // 执行计划
  executionPlan: {
    stage: string;
    task: string;
    startTime: string;
    endTime: string;
    status: string;
  }[];
  // 协同进度时间轴
  progressTimeline: {
    time: string;
    content: string;
    operator: string;
  }[];
  // 双方反馈记录
  feedbackRecords: {
    time: string;
    sender: string;
    content: string;
    type: string;
  }[];
}
interface CooperationTrackingForm {
  trackingContent: string;
}
interface CooperationEvaluationForm {
  satisfactionLevel: number; // 1-5星
  evaluationContent: string;
}

// 专属协同TS类型定义
interface SpecialCooperationRow {
  bizSpecialCoopSpecialCoopId: string;
  sysCoopSceneName: string;
  sysResponsibleUnitName: string;
  bizSpecialCoopCoopRule: string;
  bizSpecialCoopResponsibilityDivision: string;
  sysCooperationStatusName: string;
}
interface SpecialCooperationIndicators {
  totalCooperationCount: number; // 专属协同总数
  completionRate: number; // 完成率(%)
  averageCooperationCycle: number; // 平均协同周期(天)
}
interface SpecialCooperationDetail {
  bizSpecialCoopSpecialCoopId: string;
  sysCoopSceneName: string;
  sysResponsibleUnitName: string;
  bizSpecialCoopCoopRule: string;
  bizSpecialCoopResponsibilityDivision: string;
  sysCooperationStatusName: string;
  // 详情字段
  bizSpecialCoopAverageCoopCycle: number; // 平均协同周期
  bizSpecialCoopCoopResult: string; // 协同结果
  bizSpecialCoopCompleteTime: string; // 完成时间
  bizSpecialCoopReviewConclusion: string; // 复盘结论
  // 协同配置详情
  cooperationConfig: {
    item: string;
    value: string;
  }[];
  // 场景要求
  sceneRequirements: {
    item: string;
    value: string;
  }[];
  // 责任清单
  responsibilityList: {
    unit: string;
    task: string;
    person: string;
  }[];
  // 执行进展时间轴
  executionProgress: {
    time: string;
    content: string;
  }[];
}
interface ExecutionProgressForm {
  progressContent: string;
  evidenceFiles: File[];
}
interface ReviewConclusionForm {
  reviewConclusion: string;
  optimizationSuggestions: string;
}

// 协同效率评估TS类型定义
interface EfficiencyEvaluationRow {
  bizCoopEfficiencyCoopEfficiencyId: string;
  sysCooperationTypeName: string;
  sysAreaAreaName: string;
  sysStatCycleName: string;
  bizCoopEfficiencyAverageResponseDuration: number;
  bizCoopEfficiencyAverageDisposalDuration: number;
  bizCoopEfficiencyEffectivenessRate: number;
}

interface EfficiencyEvaluationIndicators {
  averageResponseDuration: number; // 平均响应时长(小时)
  averageDisposalDuration: number; // 平均处置时长(小时)
  effectivenessRate: number; // 成效达标率(%)
}

interface EfficiencyEvaluationDetail {
  bizCoopEfficiencyCoopEfficiencyId: string;
  sysCooperationTypeName: string;
  sysAreaAreaName: string;
  sysStatCycleName: string;
  bizCoopEfficiencyAverageResponseDuration: number;
  bizCoopEfficiencyAverageDisposalDuration: number;
  bizCoopEfficiencyEffectivenessRate: number;
  // 详情字段
  bizCoopEfficiencyCoopCost: number; // 协同成本
  bizCoopEfficiencyProblemRecurrenceRate: number; // 问题复发率(%)
  bizCoopEfficiencyEfficiencyBottleneck: string; // 效率瓶颈
  bizCoopEfficiencyOptimizationSuggestion: string; // 优化建议
  // 效率评估明细
  efficiencyDetails: {
    item: string;
    value: string;
    standard: string;
    status: string;
  }[];
  // 数据来源
  dataSources: {
    source: string;
    type: string;
    frequency: string;
  }[];
  // 计算逻辑
  calculationLogic: {
    item: string;
    logic: string;
  }[];
}

interface OptimizationPlanForm {
  optimizationPlan: string;
  optimizationDeadline: string;
}


// 区域协同响应式数据
const regionCooperationList = ref<RegionCooperationRow[]>([]);
const regionCooperationIndicators = ref<RegionCooperationIndicators>({
  totalCooperationCount: 0,
  completedCount: 0,
  averageCompletionRate: 0,
});
const regionCooperationAreaCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '协同数量', data: [] }],
});
const regionCooperationTaskTypeCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '协同数量', data: [] }],
});
const regionCooperationCompletionRateTrendData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '协同完成率趋势(%)', data: [] }],
});
// 区域协同视图切换相关
const regionCooperationChartRefreshKey = ref(0);
const activeRegionCooperationView = ref('折线图');
const regionCooperationViewBtnList = ref(['卡片', '柱状图', '折线图', '列表']);
// 区域协同弹窗相关
const regionCooperationDetailDialogVisible = ref(false);
const regionCooperationTrackDialogVisible = ref(false);
const regionCooperationActionDialogVisible = ref(false);
const activeRegionCooperationDetailView = ref('协同信息');
const regionCooperationDetailViewBtnList = ref(['协同信息', '任务分工', '进度日志']);
const regionCooperationDetailSelectedRow = ref<RegionCooperationDetail>({
  bizCrossRegionCoopCrossRegionCoopId: '',
  launchAreaName: '',
  cooperateAreaName: '',
  sysTaskTypeName: '',
  sysCooperationStatusName: '',
  bizCrossRegionCoopCreateTime: '',
  bizCrossRegionCoopCompletionRate: 0,
  bizCrossRegionCoopAverageCoopDuration: 0,
  bizCrossRegionCoopCompleteTime: '',
  sysUserUserName: '',
  cooperationInfo: {
    cooperationContent: '',
    cooperationStandard: '',
    cooperationCycle: '',
    cooperationContact: '',
  },
  taskDivision: [],
  progressLogs: []
});
const regionCooperationTrackSelectedRow = ref<RegionCooperationTrack>({
  bizCrossRegionCoopCrossRegionCoopId: '',
  launchAreaName: '',
  cooperateAreaName: '',
  progressTimeline: [],
  areaFeedbackResults: []
});
// 协同操作表单
const regionCooperationActionForm = ref<RegionCooperationActionForm>({
  actionContent: ''
});
const regionCooperationActionFormRules = {
  actionContent: [{ required: true, message: '协同操作内容不能为空', trigger: 'blur' }]
};
const regionCooperationActionFormRef = ref<FormInstance>();

// 运维人员动态响应式数据
const maintainerDynamicList = ref<MaintainerDynamicRow[]>([]);
const maintainerDynamicIndicators = ref<MaintainerDynamicIndicators>({
  totalMaintainerCount: 0,
  onDutyCount: 0,
  totalCoopTaskCount: 0,
});
const maintainerDynamicDeptTaskData = ref<ChartBarData>({ xAxis: [], series: [] });
const maintainerDynamicAreaTaskData = ref<ChartBarData>({ xAxis: [], series: [] });
// 运维人员动态视图切换相关
const maintainerDynamicChartRefreshKey = ref(0);
const activeMaintainerDynamicView = ref('柱状图');
const maintainerDynamicViewBtnList = ref(['卡片', '柱状图', '列表']);
// 运维人员动态弹窗相关
const maintainerDynamicDetailDialogVisible = ref(false);
const maintainerDynamicDispatchDialogVisible = ref(false);
const activeMaintainerDynamicDetailView = ref('人员基础信息');
const maintainerDynamicDetailViewBtnList = ref(['人员基础信息', '协同历史', '技能标签']);
const maintainerDynamicDetailSelectedRow = ref<MaintainerDynamicDetail>({
  sysMaintainUserMaintainUserId: '',
  sysUserUserName: '',
  sysDeptDeptName: '',
  sysAreaAreaName: '',
  sysOnDutyStatusName: '',
  bizCoopStatCurrentCoopTaskCount: 0,
  bizCoopStatCompletedCoopTaskCount: 0,
  bizCoopStatCoopResponseDuration: 0,
  sysCooperationTypeName: '',
  bizCoopStatLatestCoopTime: '',
  contactPhone: '',
  email: '',
  skillTags: [],
  cooperationHistory: []
});
// 调度表单
const dispatchTaskForm = ref<DispatchTaskForm>({
  taskDetail: '',
  coopTarget: ''
});
const dispatchTaskFormRules = {
  taskDetail: [{ required: true, message: '协同任务详情不能为空', trigger: 'blur' }],
  coopTarget: [{ required: true, message: '指定协同对象不能为空', trigger: 'blur' }]
};
const dispatchTaskFormRef = ref<FormInstance>();

// 政企协同响应式数据
const govEnterpriseCooperationList = ref<GovEnterpriseCooperationRow[]>([]);
const govEnterpriseCooperationIndicators = ref<GovEnterpriseCooperationIndicators>({
  totalCooperationCount: 0,
  responseRate: 0,
  satisfactionRate: 0,
});
const govEnterpriseCooperationDeptCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '协同数量', data: [] }],
});
const govEnterpriseCooperationEntTypeCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '协同数量', data: [] }],
});
const govEnterpriseCooperationItemRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '协同事项占比(%)', data: [] }],
});
const govEnterpriseCooperationSatisfactionRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '满意度占比(%)', data: [] }],
});
// 政企协同视图切换相关
const govEnterpriseCooperationChartRefreshKey = ref(0);
const activeGovEnterpriseCooperationView = ref('列表');
const govEnterpriseCooperationViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);
// 政企协同弹窗相关
const govEnterpriseCooperationDetailDialogVisible = ref(false);
const govEnterpriseCooperationTrackingDialogVisible = ref(false);
const govEnterpriseCooperationEvaluationDialogVisible = ref(false);
const activeGovEnterpriseCooperationDetailView = ref('协同详情');
const govEnterpriseCooperationDetailViewBtnList = ref(['协同详情', '责任分工', '执行计划']);
const govEnterpriseCooperationTrackingView = ref('进度时间轴');
const govEnterpriseCooperationTrackingViewBtnList = ref(['进度时间轴', '反馈记录']);
const govEnterpriseCooperationDetailSelectedRow = ref<GovEnterpriseCooperationDetail>({
  bizGovernmentEnterpriseCoopGovEnterpriseCoopId: '',
  sysDeptDeptName: '',
  sysMerchantMerchantName: '',
  sysEnterpriseTypeName: '',
  sysCooperationItemName: '',
  sysCooperationStatusName: '',
  bizGovernmentEnterpriseCoopProgressFeedback: '',
  sysSatisfactionName: '',
  bizGovernmentEnterpriseCoopCompleteTime: '',
  bizGovernmentEnterpriseCoopCoopCycle: '',
  cooperationDetail: {
    launchTime: '',
    expectedCompleteTime: '',
    contactPerson: '',
    contactPhone: '',
    cooperationContent: ''
  },
  responsibilityDivision: [],
  executionPlan: [],
  progressTimeline: [],
  feedbackRecords: []
});
// 跟踪表单
const cooperationTrackingForm = ref<CooperationTrackingForm>({
  trackingContent: ''
});
const cooperationTrackingFormRules = {
  trackingContent: [{ required: true, message: '跟踪内容不能为空', trigger: 'blur' }]
};
const cooperationTrackingFormRef = ref<FormInstance>();
// 评价表单
const cooperationEvaluationForm = ref<CooperationEvaluationForm>({
  satisfactionLevel: 5,
  evaluationContent: ''
});
const cooperationEvaluationFormRules = {
  satisfactionLevel: [{ required: true, message: '请选择满意度等级', trigger: 'blur' }]
};
const cooperationEvaluationFormRef = ref<FormInstance>();

// 专属协同响应式数据
const specialCooperationList = ref<SpecialCooperationRow[]>([]);
const specialCooperationIndicators = ref<SpecialCooperationIndicators>({
  totalCooperationCount: 0,
  completionRate: 0,
  averageCooperationCycle: 0,
});
const specialCooperationSceneCountData = ref<ChartBarData>({
  xAxis: [],
  series: [{ name: '协同数量', data: [] }],
});
const specialCooperationUnitCountData = ref<ChartBarData>({
  xAxis: [],
  series: [{ name: '协同数量', data: [] }],
});
const specialCooperationSceneRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '协同场景占比(%)', data: [] }],
});
const specialCooperationStatusRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '协同状态占比(%)', data: [] }],
});
// 专属协同视图切换相关
const specialCooperationChartRefreshKey = ref(0);
const activeSpecialCooperationView = ref('饼图');
const specialCooperationViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);
// 专属协同弹窗相关
const specialCooperationDetailDialogVisible = ref(false);
const specialCooperationExecuteDialogVisible = ref(false);
const specialCooperationReviewDialogVisible = ref(false);
const activeSpecialCooperationDetailView = ref('协同详情');
const specialCooperationDetailViewBtnList = ref(['协同详情', '协同配置', '场景要求', '责任清单']);
const specialCooperationDetailSelectedRow = ref<SpecialCooperationDetail>({
  bizSpecialCoopSpecialCoopId: '',
  sysCoopSceneName: '',
  sysResponsibleUnitName: '',
  bizSpecialCoopCoopRule: '',
  bizSpecialCoopResponsibilityDivision: '',
  sysCooperationStatusName: '',
  bizSpecialCoopAverageCoopCycle: 0,
  bizSpecialCoopCoopResult: '',
  bizSpecialCoopCompleteTime: '',
  bizSpecialCoopReviewConclusion: '',
  cooperationConfig: [],
  sceneRequirements: [],
  responsibilityList: [],
  executionProgress: []
});
// 执行表单
const executionProgressForm = ref<ExecutionProgressForm>({
  progressContent: '',
  evidenceFiles: []
});
const executionProgressFormRules = {
  progressContent: [{ required: true, message: '执行进展不能为空', trigger: 'blur' }]
};
const executionProgressFormRef = ref<FormInstance>();
// 复盘表单
const reviewConclusionForm = ref<ReviewConclusionForm>({
  reviewConclusion: '',
  optimizationSuggestions: ''
});
const reviewConclusionFormRules = {
  reviewConclusion: [{ required: true, message: '复盘结论不能为空', trigger: 'blur' }]
};
const reviewConclusionFormRef = ref<FormInstance>();

// 协同效率评估响应式数据
const efficiencyEvaluationList = ref<EfficiencyEvaluationRow[]>([]);
const efficiencyEvaluationIndicators = ref<EfficiencyEvaluationIndicators>({
  averageResponseDuration: 0,
  averageDisposalDuration: 0,
  effectivenessRate: 0,
});
const efficiencyEvaluationTypeCompareData = ref<ChartBarData>({
  xAxis: [],
  series: [{ name: '平均处置时长(小时)', data: [] }],
});
const efficiencyEvaluationAreaCompareData = ref<ChartBarData>({
  xAxis: [],
  series: [{ name: '平均响应时长(小时)', data: [] }],
});
const efficiencyEvaluationTrendData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '综合效率评分', data: [] }],
});
const efficiencyEvaluationRecurrenceRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '问题复发率占比(%)', data: [] }],
});
// 协同效率评估视图切换相关
const efficiencyEvaluationChartRefreshKey = ref(0);
const activeEfficiencyEvaluationView = ref('折线图');
const efficiencyEvaluationViewBtnList = ref(['卡片', '柱状图', '折线图', '饼图', '列表']);
// 协同效率评估弹窗相关
const efficiencyEvaluationDetailDialogVisible = ref(false);
const efficiencyEvaluationOptimizeDialogVisible = ref(false);
const activeEfficiencyEvaluationDetailView = ref('效率评估');
const efficiencyEvaluationDetailViewBtnList = ref(['效率评估', '评估明细', '数据来源', '计算逻辑']);
const efficiencyEvaluationDetailSelectedRow = ref<EfficiencyEvaluationDetail>({
  bizCoopEfficiencyCoopEfficiencyId: '',
  sysCooperationTypeName: '',
  sysAreaAreaName: '',
  sysStatCycleName: '',
  bizCoopEfficiencyAverageResponseDuration: 0,
  bizCoopEfficiencyAverageDisposalDuration: 0,
  bizCoopEfficiencyEffectivenessRate: 0,
  bizCoopEfficiencyCoopCost: 0,
  bizCoopEfficiencyProblemRecurrenceRate: 0,
  bizCoopEfficiencyEfficiencyBottleneck: '',
  bizCoopEfficiencyOptimizationSuggestion: '',
  efficiencyDetails: [],
  dataSources: [],
  calculationLogic: []
});
// 优化方案表单
const optimizationPlanForm = ref<OptimizationPlanForm>({
  optimizationPlan: '',
  optimizationDeadline: ''
});
const optimizationPlanFormRules = {
  optimizationPlan: [{ required: true, message: '优化方案不能为空', trigger: 'blur' }],
  optimizationDeadline: [{ required: true, message: '优化时限不能为空', trigger: 'blur' }]
};
const optimizationPlanFormRef = ref<FormInstance>();

// 部门协同响应式数据
const departmentCooperationList = ref<DepartmentCooperationRow[]>([]);
const departmentCooperationIndicators = ref<DepartmentCooperationIndicators>({
  totalCooperationCount: 0,
  responseRate: 0,
  satisfactionRate: 0,
});
const departmentCooperationDeptCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '协同数量', data: [] }],
});
const departmentCooperationTypeCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '协同数量', data: [] }],
});
const departmentCooperationDeptRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '协同部门占比(%)', data: [] }],
});
const departmentCooperationTypeRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '协同类型占比(%)', data: [] }],
});
// 部门协同视图切换相关
const departmentCooperationChartRefreshKey = ref(0);
const activeDepartmentCooperationView = ref('卡片');
const departmentCooperationViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);
// 部门协同弹窗相关
const departmentCooperationDetailDialogVisible = ref(false);
const departmentCooperationResponseDialogVisible = ref(false);
const departmentCooperationFeedbackDialogVisible = ref(false);
const activeDepartmentCooperationDetailView = ref('协同详情');
const departmentCooperationDetailViewBtnList = ref(['协同详情', '任务要求', '部门分工']);
const departmentCooperationDetailSelectedRow = ref<DepartmentCooperationDetail>({
  bizCrossDepartmentCoopCrossDepartmentCoopId: '',
  sysDeptDeptName: '',
  sysCooperationTypeName: '',
  bizCrossDepartmentCoopCoopTask: '',
  bizCrossDepartmentCoopResponseDuration: 0,
  sysCooperationStatusName: '',
  bizCrossDepartmentCoopDisposalDuration: 0,
  sysSatisfactionName: '',
  bizCrossDepartmentCoopCompleteTime: '',
  bizCrossDepartmentCoopFeedbackResult: '',
  taskRequirements: [],
  departmentDivision: []
});
// 响应表单
const cooperationResponseForm = ref<CooperationResponseForm>({
  responseContent: ''
});
const cooperationResponseFormRules = {
  responseContent: [{ required: true, message: '响应内容不能为空', trigger: 'blur' }]
};
const cooperationResponseFormRef = ref<FormInstance>();
// 反馈表单
const cooperationFeedbackForm = ref<CooperationFeedbackForm>({
  feedbackResult: '',
  evidenceFiles: []
});
const cooperationFeedbackFormRules = {
  feedbackResult: [{ required: true, message: '反馈结果不能为空', trigger: 'blur' }]
};
const cooperationFeedbackFormRef = ref<FormInstance>();

// 行业协同响应式数据
const industryCooperationList = ref<IndustryCooperationRow[]>([]);
const industryCooperationIndicators = ref<IndustryCooperationIndicators>({
  totalCooperationCount: 0,
  problemSolveRate: 0,
  satisfactionRate: 0,
});
const industryCooperationIndustryCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '协同数量', data: [] }],
});
const industryCooperationSceneCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '协同数量', data: [] }],
});
const industryCooperationIndustryRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '协同行业占比(%)', data: [] }],
});
const industryCooperationSceneRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '协同场景占比(%)', data: [] }],
});
// 行业协同视图切换相关
const industryCooperationChartRefreshKey = ref(0);
const activeIndustryCooperationView = ref('卡片');
const industryCooperationViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);
// 行业协同弹窗相关
const industryCooperationDetailDialogVisible = ref(false);
const industryCooperationAssistDialogVisible = ref(false);
const industryCooperationEvaluateDialogVisible = ref(false);
const activeIndustryCooperationDetailView = ref('协同详情');
const industryCooperationDetailViewBtnList = ref(['协同详情', '行业需求', '配合要求']);
const industryCooperationDetailSelectedRow = ref<IndustryCooperationDetail>({
  bizCrossIndustryCoopCrossIndustryCoopId: '',
  sysIndustryIndustryName: '',
  sysCoopSceneName: '',
  bizCrossIndustryCoopProblemDesc: '',
  bizCrossIndustryCoopCreateTime: '',
  sysEffectLevelName: '',
  sysCooperationStatusName: '',
  bizCrossIndustryCoopProblemSolveRate: 0,
  sysSatisfactionName: '',
  bizCrossIndustryCoopCompleteTime: '',
  sysResponsibleUnitName: '',
  industryRequirements: [],
  cooperationRequirements: []
});
// 配合表单
const industryCooperationAssistForm = ref<IndustryCooperationAssistForm>({
  assistContent: ''
});
const industryCooperationAssistFormRules = {
  assistContent: [{ required: true, message: '配合内容不能为空', trigger: 'blur' }]
};
const industryCooperationAssistFormRef = ref<FormInstance>();
// 评估表单
const industryCooperationEvaluateForm = ref<IndustryCooperationEvaluateForm>({
  evaluateResult: '',
  score: null
});
const industryCooperationEvaluateFormRules = {
  evaluateResult: [{ required: true, message: '评估结果不能为空', trigger: 'blur' }]
};
const industryCooperationEvaluateFormRef = ref<FormInstance>();

// 层级协同响应式数据
const levelCooperationList = ref<LevelCooperationRow[]>([]);
const levelCooperationIndicators = ref<LevelCooperationIndicators>({
  totalCooperationCount: 0,
  instructionCompleteRate: 0,
  averageFeedbackDuration: 0,
});
const levelCooperationLevelCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '协同数量', data: [] }],
});
const levelCooperationUnitCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '协同数量', data: [] }],
});
const levelCooperationStatusRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '指令状态占比(%)', data: [] }],
});
// 层级协同视图切换相关
const levelCooperationChartRefreshKey = ref(0);
const activeLevelCooperationView = ref('卡片');
const levelCooperationViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);
// 层级协同弹窗相关
const levelCooperationDetailDialogVisible = ref(false);
const levelCooperationFeedbackDialogVisible = ref(false);
const levelCooperationTrackDialogVisible = ref(false);
const activeLevelCooperationDetailView = ref('指令详情');
const levelCooperationDetailViewBtnList = ref(['指令详情', '层级分工', '反馈记录']);
const levelCooperationDetailSelectedRow = ref<LevelCooperationDetail>({
  bizCrossLevelCoopCrossLevelCoopId: '',
  issueLevelName: '',
  receiveLevelName: '',
  bizCrossLevelCoopInstructionContent: '',
  sysInstructionStatusName: '',
  bizCrossLevelCoopIssueTime: '',
  currentUserLevel: '',
  bizCrossLevelCoopAverageFeedbackDuration: 0,
  sysResponsibleUnitName: '',
  bizCrossLevelCoopFeedbackResult: '',
  bizCrossLevelCoopCompleteTime: '',
  levelDivision: [],
  feedbackRecords: [],
  flowTimeline: []
});
// 反馈表单
const levelCooperationFeedbackForm = ref<LevelCooperationFeedbackForm>({
  feedbackContent: '',
  evidenceFiles: []
});
const levelCooperationFeedbackFormRules = {
  feedbackContent: [{ required: true, message: '反馈内容不能为空', trigger: 'blur' }]
};
const levelCooperationFeedbackFormRef = ref<FormInstance>();


// 区域协同接口请求方法
const getRegionCooperationListData = async () => {
  try {
    regionCooperationList.value = (await fetchRegionCooperationList()) as RegionCooperationRow[];
  } catch (error: any) {
    ElMessage.error(`区域协同列表加载失败：${error.message}`);
    regionCooperationList.value = [];
  }
};
const getRegionCooperationIndicatorsData = async () => {
  try {
    regionCooperationIndicators.value =
      (await fetchRegionCooperationIndicators()) as RegionCooperationIndicators;
  } catch (error: any) {
    ElMessage.error(`区域协同核心指标加载失败：${error.message}`);
  }
};
const getRegionCooperationAreaCountData = async () => {
  try {
    regionCooperationAreaCountData.value =
      (await fetchRegionCooperationAreaCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`不同区域协同数加载失败：${error.message}`);
  }
};
const getRegionCooperationTaskTypeCountData = async () => {
  try {
    regionCooperationTaskTypeCountData.value =
      (await fetchRegionCooperationTaskTypeCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`不同任务类型协同数加载失败：${error.message}`);
  }
};
const getRegionCooperationCompletionRateTrendData = async () => {
  try {
    regionCooperationCompletionRateTrendData.value =
      (await fetchRegionCooperationCompletionRateTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`协同完成率趋势加载失败：${error.message}`);
  }
};
const getRegionCooperationDetailData = async (cooperationId: string) => {
  try {
    regionCooperationDetailSelectedRow.value = {
      ...regionCooperationDetailSelectedRow.value,
      ...(await fetchRegionCooperationDetail(cooperationId)),
    };
  } catch (error: any) {
    ElMessage.warning(`区域协同详情加载失败：${error.message}`);
  }
};
const getRegionCooperationTrackData = async (cooperationId: string) => {
  try {
    regionCooperationTrackSelectedRow.value = {
      ...regionCooperationTrackSelectedRow.value,
      ...(await fetchRegionCooperationTrack(cooperationId)),
    };
  } catch (error: any) {
    ElMessage.warning(`区域协同跟踪数据加载失败：${error.message}`);
  }
};
const submitRegionCooperationActionData = async (cooperationId: string) => {
  try {
    await regionCooperationActionFormRef.value?.validate();
    const res = await submitRegionCooperationAction(cooperationId, regionCooperationActionForm.value.actionContent);
    if (res.success) {
      // 更新协同状态
      regionCooperationDetailSelectedRow.value.sysCooperationStatusName = res.cooperationStatus;
      tipDialogContent.value = '协同操作提交成功';
      tipDialogVisible.value = true;
      regionCooperationActionDialogVisible.value = false;
      regionCooperationActionForm.value.actionContent = '';
      regionCooperationActionFormRef.value?.resetFields();
      // 刷新列表数据
      getRegionCooperationListData();
    } else {
      tipDialogContent.value = '协同操作提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `协同操作提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

// 运维人员动态接口请求方法
const getMaintainerDynamicListData = async () => {
  try {
    maintainerDynamicList.value = (await fetchMaintainerDynamicList()) as MaintainerDynamicRow[];
  } catch (error: any) {
    ElMessage.error(`运维人员动态列表加载失败：${error.message}`);
    maintainerDynamicList.value = [];
  }
};
const getMaintainerDynamicIndicatorsData = async () => {
  try {
    maintainerDynamicIndicators.value =
      (await fetchMaintainerDynamicIndicators()) as MaintainerDynamicIndicators;
  } catch (error: any) {
    ElMessage.error(`运维人员动态核心指标加载失败：${error.message}`);
  }
};
const getMaintainerDynamicDeptTaskData = async () => {
  try {
    maintainerDynamicDeptTaskData.value =
      (await fetchMaintainerDynamicDeptTaskCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`部门协同任务数加载失败：${error.message}`);
  }
};
const getMaintainerDynamicAreaTaskData = async () => {
  try {
    maintainerDynamicAreaTaskData.value =
      (await fetchMaintainerDynamicAreaTaskCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`区域协同任务数加载失败：${error.message}`);
  }
};
const getMaintainerDynamicDetailData = async (maintainerId: string) => {
  try {
    maintainerDynamicDetailSelectedRow.value = {
      ...maintainerDynamicDetailSelectedRow.value,
      ...(await fetchMaintainerDynamicDetail(maintainerId)),
    };
  } catch (error: any) {
    ElMessage.warning(`运维人员详情加载失败：${error.message}`);
  }
};
const submitDispatchTaskData = async (maintainerId: string) => {
  try {
    await dispatchTaskFormRef.value?.validate();
    const res = await submitMaintainerDispatchTask(
      maintainerId,
      dispatchTaskForm.value.taskDetail,
      dispatchTaskForm.value.coopTarget
    );
    if (res.success) {
      // 更新当前协同任务数
      maintainerDynamicDetailSelectedRow.value.bizCoopStatCurrentCoopTaskCount = res.updatedTaskCount;
      tipDialogContent.value = '调度任务提交成功';
      tipDialogVisible.value = true;
      maintainerDynamicDispatchDialogVisible.value = false;
      dispatchTaskForm.value.taskDetail = '';
      dispatchTaskForm.value.coopTarget = '';
      dispatchTaskFormRef.value?.resetFields();
      // 刷新列表数据
      getMaintainerDynamicListData();
      getMaintainerDynamicIndicatorsData();
    } else {
      tipDialogContent.value = '调度任务提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `调度任务提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

// 协同效率评估接口请求方法
const getEfficiencyEvaluationListData = async () => {
  try {
    efficiencyEvaluationList.value = (await fetchEfficiencyEvaluationList()) as EfficiencyEvaluationRow[];
  } catch (error: any) {
    ElMessage.error(`协同效率评估列表加载失败：${error.message}`);
    efficiencyEvaluationList.value = [];
  }
};
const getEfficiencyEvaluationIndicatorsData = async () => {
  try {
    efficiencyEvaluationIndicators.value =
      (await fetchEfficiencyEvaluationIndicators()) as EfficiencyEvaluationIndicators;
  } catch (error: any) {
    ElMessage.error(`协同效率评估核心指标加载失败：${error.message}`);
  }
};
const getEfficiencyEvaluationTypeCompareData = async () => {
  try {
    efficiencyEvaluationTypeCompareData.value =
      (await fetchEfficiencyEvaluationTypeCompare()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`不同类型协同效率对比加载失败：${error.message}`);
  }
};
const getEfficiencyEvaluationAreaCompareData = async () => {
  try {
    efficiencyEvaluationAreaCompareData.value =
      (await fetchEfficiencyEvaluationAreaCompare()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`不同区域协同效率对比加载失败：${error.message}`);
  }
};
const getEfficiencyEvaluationTrendData = async () => {
  try {
    efficiencyEvaluationTrendData.value =
      (await fetchEfficiencyEvaluationTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`协同效率趋势数据加载失败：${error.message}`);
  }
};
const getEfficiencyEvaluationRecurrenceRatioData = async () => {
  try {
    efficiencyEvaluationRecurrenceRatioData.value =
      (await fetchEfficiencyEvaluationRecurrenceRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`问题复发率占比加载失败：${error.message}`);
  }
};
const getEfficiencyEvaluationDetailData = async (efficiencyId: string) => {
  try {
    efficiencyEvaluationDetailSelectedRow.value = {
      ...efficiencyEvaluationDetailSelectedRow.value,
      ...(await fetchEfficiencyEvaluationDetail(efficiencyId)),
    };
  } catch (error: any) {
    ElMessage.warning(`协同效率评估详情加载失败：${error.message}`);
  }
};
const submitOptimizationPlanData = async (efficiencyId: string) => {
  try {
    await optimizationPlanFormRef.value?.validate();
    const res = await submitOptimizationPlan(
      efficiencyId,
      optimizationPlanForm.value.optimizationPlan,
      optimizationPlanForm.value.optimizationDeadline
    );
    if (res.success) {
      tipDialogContent.value = '优化方案提交成功';
      tipDialogVisible.value = true;
      efficiencyEvaluationOptimizeDialogVisible.value = false;
      optimizationPlanForm.value.optimizationPlan = '';
      optimizationPlanForm.value.optimizationDeadline = '';
      optimizationPlanFormRef.value?.resetFields();
      // 刷新列表数据
      getEfficiencyEvaluationListData();
    } else {
      tipDialogContent.value = '优化方案提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `优化方案提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

// 政企协同接口请求方法
const getGovEnterpriseCooperationListData = async () => {
  try {
    govEnterpriseCooperationList.value = (await fetchGovEnterpriseCooperationList()) as GovEnterpriseCooperationRow[];
  } catch (error: any) {
    ElMessage.error(`政企协同列表加载失败：${error.message}`);
    govEnterpriseCooperationList.value = [];
  }
};
const getGovEnterpriseCooperationIndicatorsData = async () => {
  try {
    govEnterpriseCooperationIndicators.value =
      (await fetchGovEnterpriseCooperationIndicators()) as GovEnterpriseCooperationIndicators;
  } catch (error: any) {
    ElMessage.error(`政企协同核心指标加载失败：${error.message}`);
  }
};
const getGovEnterpriseCooperationDeptCountData = async () => {
  try {
    govEnterpriseCooperationDeptCountData.value =
      (await fetchGovEnterpriseCooperationDeptCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`政府部门协同数加载失败：${error.message}`);
  }
};
const getGovEnterpriseCooperationEntTypeCountData = async () => {
  try {
    govEnterpriseCooperationEntTypeCountData.value =
      (await fetchGovEnterpriseCooperationEntTypeCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`企业类型协同数加载失败：${error.message}`);
  }
};
const getGovEnterpriseCooperationItemRatioData = async () => {
  try {
    govEnterpriseCooperationItemRatioData.value =
      (await fetchGovEnterpriseCooperationItemRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`协同事项占比加载失败：${error.message}`);
  }
};
const getGovEnterpriseCooperationSatisfactionRatioData = async () => {
  try {
    govEnterpriseCooperationSatisfactionRatioData.value =
      (await fetchGovEnterpriseCooperationSatisfactionRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`满意度占比加载失败：${error.message}`);
  }
};
const getGovEnterpriseCooperationDetailData = async (cooperationId: string) => {
  try {
    govEnterpriseCooperationDetailSelectedRow.value = {
      ...govEnterpriseCooperationDetailSelectedRow.value,
      ...(await fetchGovEnterpriseCooperationDetail(cooperationId)),
    };
  } catch (error: any) {
    ElMessage.warning(`政企协同详情加载失败：${error.message}`);
  }
};
const submitTrackingData = async (cooperationId: string) => {
  try {
    await cooperationTrackingFormRef.value?.validate();
    const res = await submitCooperationTracking(cooperationId, cooperationTrackingForm.value.trackingContent);
    if (res.success) {
      tipDialogContent.value = '跟踪记录提交成功';
      tipDialogVisible.value = true;
      govEnterpriseCooperationTrackingDialogVisible.value = false;
      cooperationTrackingForm.value.trackingContent = '';
      cooperationTrackingFormRef.value?.resetFields();
      // 刷新详情数据
      await getGovEnterpriseCooperationDetailData(cooperationId);
    } else {
      tipDialogContent.value = '跟踪记录提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `跟踪记录提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};
const submitEvaluationData = async (cooperationId: string) => {
  try {
    await cooperationEvaluationFormRef.value?.validate();
    const res = await submitCooperationEvaluation(
      cooperationId,
      cooperationEvaluationForm.value.satisfactionLevel,
      cooperationEvaluationForm.value.evaluationContent
    );
    if (res.success) {
      // 更新协同状态和满意度
      govEnterpriseCooperationDetailSelectedRow.value.sysCooperationStatusName = res.cooperationStatus;
      govEnterpriseCooperationDetailSelectedRow.value.sysSatisfactionName =
        cooperationEvaluationForm.value.satisfactionLevel === 5 ? '非常满意' :
          cooperationEvaluationForm.value.satisfactionLevel === 4 ? '满意' :
            cooperationEvaluationForm.value.satisfactionLevel === 3 ? '基本满意' :
              cooperationEvaluationForm.value.satisfactionLevel === 2 ? '一般' : '不满意';

      tipDialogContent.value = '评价提交成功';
      tipDialogVisible.value = true;
      govEnterpriseCooperationEvaluationDialogVisible.value = false;
      cooperationEvaluationForm.value.satisfactionLevel = 5;
      cooperationEvaluationForm.value.evaluationContent = '';
      cooperationEvaluationFormRef.value?.resetFields();
      // 刷新列表数据
      getGovEnterpriseCooperationListData();
    } else {
      tipDialogContent.value = '评价提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `评价提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

// 专属协同接口请求方法
const getSpecialCooperationListData = async () => {
  try {
    specialCooperationList.value = (await fetchSpecialCooperationList()) as SpecialCooperationRow[];
  } catch (error: any) {
    ElMessage.error(`专属协同列表加载失败：${error.message}`);
    specialCooperationList.value = [];
  }
};
const getSpecialCooperationIndicatorsData = async () => {
  try {
    specialCooperationIndicators.value =
      (await fetchSpecialCooperationIndicators()) as SpecialCooperationIndicators;
  } catch (error: any) {
    ElMessage.error(`专属协同核心指标加载失败：${error.message}`);
  }
};
const getSpecialCooperationSceneCountData = async () => {
  try {
    specialCooperationSceneCountData.value =
      (await fetchSpecialCooperationSceneCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`不同场景协同数加载失败：${error.message}`);
  }
};
const getSpecialCooperationUnitCountData = async () => {
  try {
    specialCooperationUnitCountData.value =
      (await fetchSpecialCooperationUnitCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`不同责任单位协同数加载失败：${error.message}`);
  }
};
const getSpecialCooperationSceneRatioData = async () => {
  try {
    specialCooperationSceneRatioData.value =
      (await fetchSpecialCooperationSceneRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`协同场景占比加载失败：${error.message}`);
  }
};
const getSpecialCooperationStatusRatioData = async () => {
  try {
    specialCooperationStatusRatioData.value =
      (await fetchSpecialCooperationStatusRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`协同状态占比加载失败：${error.message}`);
  }
};
const getSpecialCooperationDetailData = async (cooperationId: string) => {
  try {
    specialCooperationDetailSelectedRow.value = {
      ...specialCooperationDetailSelectedRow.value,
      ...(await fetchSpecialCooperationDetail(cooperationId)),
    };
  } catch (error: any) {
    ElMessage.warning(`专属协同详情加载失败：${error.message}`);
  }
};
const submitExecutionProgressData = async (cooperationId: string) => {
  try {
    await executionProgressFormRef.value?.validate();
    const res = await submitExecutionProgress(
      cooperationId,
      executionProgressForm.value.progressContent,
      executionProgressForm.value.evidenceFiles
    );
    if (res.success) {
      // 更新协同状态
      specialCooperationDetailSelectedRow.value.sysCooperationStatusName = res.cooperationStatus;
      tipDialogContent.value = '执行进展提交成功';
      tipDialogVisible.value = true;
      specialCooperationExecuteDialogVisible.value = false;
      executionProgressForm.value.progressContent = '';
      executionProgressForm.value.evidenceFiles = [];
      executionProgressFormRef.value?.resetFields();
      // 刷新列表数据
      getSpecialCooperationListData();
    } else {
      tipDialogContent.value = '执行进展提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `执行进展提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};
const submitReviewConclusionData = async (cooperationId: string) => {
  try {
    await reviewConclusionFormRef.value?.validate();
    const res = await submitReviewConclusion(
      cooperationId,
      reviewConclusionForm.value.reviewConclusion,
      reviewConclusionForm.value.optimizationSuggestions
    );
    if (res.success) {
      // 更新协同状态
      specialCooperationDetailSelectedRow.value.sysCooperationStatusName = res.cooperationStatus;
      tipDialogContent.value = '复盘结论提交成功';
      tipDialogVisible.value = true;
      specialCooperationReviewDialogVisible.value = false;
      reviewConclusionForm.value.reviewConclusion = '';
      reviewConclusionForm.value.optimizationSuggestions = '';
      reviewConclusionFormRef.value?.resetFields();
      // 刷新列表数据
      getSpecialCooperationListData();
    } else {
      tipDialogContent.value = '复盘结论提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `复盘结论提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

// 部门协同接口请求方法
const getDepartmentCooperationListData = async () => {
  try {
    departmentCooperationList.value = (await fetchDepartmentCooperationList()) as DepartmentCooperationRow[];
  } catch (error: any) {
    ElMessage.error(`部门协同列表加载失败：${error.message}`);
    departmentCooperationList.value = [];
  }
};
const getDepartmentCooperationIndicatorsData = async () => {
  try {
    departmentCooperationIndicators.value =
      (await fetchDepartmentCooperationIndicators()) as DepartmentCooperationIndicators;
  } catch (error: any) {
    ElMessage.error(`部门协同核心指标加载失败：${error.message}`);
  }
};
const getDepartmentCooperationDeptCountData = async () => {
  try {
    departmentCooperationDeptCountData.value =
      (await fetchDepartmentCooperationDeptCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`不同部门协同数加载失败：${error.message}`);
  }
};
const getDepartmentCooperationTypeCountData = async () => {
  try {
    departmentCooperationTypeCountData.value =
      (await fetchDepartmentCooperationTypeCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`不同类型协同数加载失败：${error.message}`);
  }
};
const getDepartmentCooperationDeptRatioData = async () => {
  try {
    departmentCooperationDeptRatioData.value =
      (await fetchDepartmentCooperationDeptRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`协同部门占比加载失败：${error.message}`);
  }
};
const getDepartmentCooperationTypeRatioData = async () => {
  try {
    departmentCooperationTypeRatioData.value =
      (await fetchDepartmentCooperationTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`协同类型占比加载失败：${error.message}`);
  }
};
const getDepartmentCooperationDetailData = async (cooperationId: string) => {
  try {
    departmentCooperationDetailSelectedRow.value = {
      ...departmentCooperationDetailSelectedRow.value,
      ...(await fetchDepartmentCooperationDetail(cooperationId)),
    };
  } catch (error: any) {
    ElMessage.warning(`部门协同详情加载失败：${error.message}`);
  }
};
const submitResponseData = async (cooperationId: string) => {
  try {
    await cooperationResponseFormRef.value?.validate();
    const res = await submitCooperationResponse(cooperationId, cooperationResponseForm.value.responseContent);
    if (res.success) {
      // 更新协同状态
      departmentCooperationDetailSelectedRow.value.sysCooperationStatusName = res.cooperationStatus;
      tipDialogContent.value = '响应提交成功';
      tipDialogVisible.value = true;
      departmentCooperationResponseDialogVisible.value = false;
      cooperationResponseForm.value.responseContent = '';
      cooperationResponseFormRef.value?.resetFields();
      // 刷新列表数据
      getDepartmentCooperationListData();
    } else {
      tipDialogContent.value = '响应提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `响应提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};
const submitFeedbackData = async (cooperationId: string) => {
  try {
    await cooperationFeedbackFormRef.value?.validate();
    const res = await submitCooperationFeedback(cooperationId, cooperationFeedbackForm.value.feedbackResult, cooperationFeedbackForm.value.evidenceFiles);
    if (res.success) {
      // 更新协同状态
      departmentCooperationDetailSelectedRow.value.sysCooperationStatusName = res.cooperationStatus;
      tipDialogContent.value = '反馈提交成功';
      tipDialogVisible.value = true;
      departmentCooperationFeedbackDialogVisible.value = false;
      cooperationFeedbackForm.value.feedbackResult = '';
      cooperationFeedbackForm.value.evidenceFiles = [];
      cooperationFeedbackFormRef.value?.resetFields();
      // 刷新列表数据
      getDepartmentCooperationListData();
    } else {
      tipDialogContent.value = '反馈提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `反馈提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

// 行业协同接口请求方法
const getIndustryCooperationListData = async () => {
  try {
    industryCooperationList.value = (await fetchIndustryCooperationList()) as IndustryCooperationRow[];
  } catch (error: any) {
    ElMessage.error(`行业协同列表加载失败：${error.message}`);
    industryCooperationList.value = [];
  }
};
const getIndustryCooperationIndicatorsData = async () => {
  try {
    industryCooperationIndicators.value =
      (await fetchIndustryCooperationIndicators()) as IndustryCooperationIndicators;
  } catch (error: any) {
    ElMessage.error(`行业协同核心指标加载失败：${error.message}`);
  }
};
const getIndustryCooperationIndustryCountData = async () => {
  try {
    industryCooperationIndustryCountData.value =
      (await fetchIndustryCooperationIndustryCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`不同行业协同数加载失败：${error.message}`);
  }
};
const getIndustryCooperationSceneCountData = async () => {
  try {
    industryCooperationSceneCountData.value =
      (await fetchIndustryCooperationSceneCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`不同场景协同数加载失败：${error.message}`);
  }
};
const getIndustryCooperationIndustryRatioData = async () => {
  try {
    industryCooperationIndustryRatioData.value =
      (await fetchIndustryCooperationIndustryRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`协同行业占比加载失败：${error.message}`);
  }
};
const getIndustryCooperationSceneRatioData = async () => {
  try {
    industryCooperationSceneRatioData.value =
      (await fetchIndustryCooperationSceneRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`协同场景占比加载失败：${error.message}`);
  }
};
const getIndustryCooperationDetailData = async (cooperationId: string) => {
  try {
    industryCooperationDetailSelectedRow.value = {
      ...industryCooperationDetailSelectedRow.value,
      ...(await fetchIndustryCooperationDetail(cooperationId)),
    };
  } catch (error: any) {
    ElMessage.warning(`行业协同详情加载失败：${error.message}`);
  }
};
const submitAssistData = async (cooperationId: string) => {
  try {
    await industryCooperationAssistFormRef.value?.validate();
    const res = await submitIndustryCooperationAssist(cooperationId, industryCooperationAssistForm.value.assistContent);
    if (res.success) {
      // 更新协同状态
      industryCooperationDetailSelectedRow.value.sysCooperationStatusName = res.cooperationStatus;
      tipDialogContent.value = '配合提交成功';
      tipDialogVisible.value = true;
      industryCooperationAssistDialogVisible.value = false;
      industryCooperationAssistForm.value.assistContent = '';
      industryCooperationAssistFormRef.value?.resetFields();
      // 刷新列表数据
      getIndustryCooperationListData();
    } else {
      tipDialogContent.value = '配合提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `配合提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};
const submitEvaluateData = async (cooperationId: string) => {
  try {
    await industryCooperationEvaluateFormRef.value?.validate();
    const res = await submitIndustryCooperationEvaluate(cooperationId, industryCooperationEvaluateForm.value.evaluateResult, industryCooperationEvaluateForm.value.score);
    if (res.success) {
      // 更新协同状态
      industryCooperationDetailSelectedRow.value.sysCooperationStatusName = res.cooperationStatus;
      tipDialogContent.value = '评估提交成功';
      tipDialogVisible.value = true;
      industryCooperationEvaluateDialogVisible.value = false;
      industryCooperationEvaluateForm.value.evaluateResult = '';
      industryCooperationEvaluateForm.value.score = null;
      industryCooperationEvaluateFormRef.value?.resetFields();
      // 刷新列表数据
      getIndustryCooperationListData();
    } else {
      tipDialogContent.value = '评估提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `评估提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

// 层级协同接口请求方法
const getLevelCooperationListData = async () => {
  try {
    levelCooperationList.value = (await fetchLevelCooperationList()) as LevelCooperationRow[];
  } catch (error: any) {
    ElMessage.error(`层级协同列表加载失败：${error.message}`);
    levelCooperationList.value = [];
  }
};
const getLevelCooperationIndicatorsData = async () => {
  try {
    levelCooperationIndicators.value =
      (await fetchLevelCooperationIndicators()) as LevelCooperationIndicators;
  } catch (error: any) {
    ElMessage.error(`层级协同核心指标加载失败：${error.message}`);
  }
};
const getLevelCooperationLevelCountData = async () => {
  try {
    levelCooperationLevelCountData.value =
      (await fetchLevelCooperationLevelCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`不同层级协同数加载失败：${error.message}`);
  }
};
const getLevelCooperationUnitCountData = async () => {
  try {
    levelCooperationUnitCountData.value =
      (await fetchLevelCooperationUnitCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`不同责任单位协同数加载失败：${error.message}`);
  }
};
const getLevelCooperationStatusRatioData = async () => {
  try {
    levelCooperationStatusRatioData.value =
      (await fetchLevelCooperationStatusRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`指令状态占比加载失败：${error.message}`);
  }
};
const getLevelCooperationDetailData = async (cooperationId: string) => {
  try {
    levelCooperationDetailSelectedRow.value = {
      ...levelCooperationDetailSelectedRow.value,
      ...(await fetchLevelCooperationDetail(cooperationId)),
    };
  } catch (error: any) {
    ElMessage.warning(`层级协同详情加载失败：${error.message}`);
  }
};
const submitLevelFeedbackData = async (cooperationId: string) => {
  try {
    await levelCooperationFeedbackFormRef.value?.validate();
    const res = await submitLevelCooperationFeedback(cooperationId, levelCooperationFeedbackForm.value.feedbackContent, levelCooperationFeedbackForm.value.evidenceFiles);
    if (res.success) {
      // 更新指令状态
      levelCooperationDetailSelectedRow.value.sysInstructionStatusName = res.instructionStatus;
      tipDialogContent.value = '反馈提交成功';
      tipDialogVisible.value = true;
      levelCooperationFeedbackDialogVisible.value = false;
      levelCooperationFeedbackForm.value.feedbackContent = '';
      levelCooperationFeedbackForm.value.evidenceFiles = [];
      levelCooperationFeedbackFormRef.value?.resetFields();
      // 刷新列表数据
      getLevelCooperationListData();
    } else {
      tipDialogContent.value = '反馈提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `反馈提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};


// 区域协同视图切换
const changeRegionCooperationView = (viewName: string) => {
  activeRegionCooperationView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '柱状图' || viewName === '折线图') &&
  nextTick(() => regionCooperationChartRefreshKey.value++);
};
const changeRegionCooperationDetailView = (viewName: string) => {
  activeRegionCooperationDetailView.value = viewName;
};
// 区域协同弹窗方法
const openRegionCooperationDetailDialog = async (row: RegionCooperationRow) => {
  await getRegionCooperationDetailData(row.bizCrossRegionCoopCrossRegionCoopId);
  regionCooperationDetailDialogVisible.value = true;
};
const closeRegionCooperationDetailDialog = () => {
  regionCooperationDetailDialogVisible.value = false;
  regionCooperationDetailSelectedRow.value = {
    bizCrossRegionCoopCrossRegionCoopId: '',
    launchAreaName: '',
    cooperateAreaName: '',
    sysTaskTypeName: '',
    sysCooperationStatusName: '',
    bizCrossRegionCoopCreateTime: '',
    bizCrossRegionCoopCompletionRate: 0,
    bizCrossRegionCoopAverageCoopDuration: 0,
    bizCrossRegionCoopCompleteTime: '',
    sysUserUserName: '',
    cooperationInfo: {
      cooperationContent: '',
      cooperationStandard: '',
      cooperationCycle: '',
      cooperationContact: '',
    },
    taskDivision: [],
    progressLogs: []
  };
  activeRegionCooperationDetailView.value = '协同信息';
};
const openRegionCooperationTrackDialog = async (row: RegionCooperationRow) => {
  await getRegionCooperationTrackData(row.bizCrossRegionCoopCrossRegionCoopId);
  regionCooperationTrackDialogVisible.value = true;
};
const closeRegionCooperationTrackDialog = () => {
  regionCooperationTrackDialogVisible.value = false;
  regionCooperationTrackSelectedRow.value = {
    bizCrossRegionCoopCrossRegionCoopId: '',
    launchAreaName: '',
    cooperateAreaName: '',
    progressTimeline: [],
    areaFeedbackResults: []
  };
};
const openRegionCooperationActionDialog = () => {
  regionCooperationActionDialogVisible.value = true;
};
const closeRegionCooperationActionDialog = () => {
  regionCooperationActionDialogVisible.value = false;
  regionCooperationActionForm.value.actionContent = '';
  regionCooperationActionFormRef.value?.resetFields();
};
// 区域协同数据刷新
const refreshRegionCooperationData = async () => {
  await Promise.all([
    getRegionCooperationListData(),
    getRegionCooperationIndicatorsData(),
    getRegionCooperationAreaCountData(),
    getRegionCooperationTaskTypeCountData(),
    getRegionCooperationCompletionRateTrendData(),
  ]);
  regionCooperationChartRefreshKey.value++;
  ElMessage.success('区域协同数据刷新成功');
};
const getCooperationStatusType = (status: string) => {
  switch(status) {
    case '待响应': return 'warning';
    case '响应中': return 'info';
    case '反馈中': return 'primary';
    case '已完成': return 'success';
    default: return 'info';
  }
};
// Timeline 时间线组件辅助方法
const getTimelineItemType = (status: string) => {
  switch(status) {
    case '已完成': return 'success';
    case '进行中': return 'primary';
    case '未开始': return 'info';
    default: return '';
  }
};
const getTimelineItemColor = (status: string) => {
  switch(status) {
    case '已完成': return '#67C23A';
    case '进行中': return '#409EFF';
    case '未开始': return '#909399';
    default: return '#E6A23C';
  }
};
const getTimelineItemIcon = (status: string) => {
  switch(status) {
    case '已完成': return 'Check';
    case '进行中': return 'Loading';
    case '未开始': return 'Clock';
    default: return 'Warning';
  }
};
const getTimelineStatusTagType = (status: string) => {
  switch(status) {
    case '已完成': return 'success';
    case '进行中': return 'info';
    case '未开始': return 'warning';
    default: return 'info';
  }
};

// 部门协同视图切换
const changeDepartmentCooperationView = (viewName: string) => {
  activeDepartmentCooperationView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '柱状图' || viewName === '饼图') &&
  nextTick(() => departmentCooperationChartRefreshKey.value++);
};
const changeDepartmentCooperationDetailView = (viewName: string) => {
  activeDepartmentCooperationDetailView.value = viewName;
};
// 部门协同弹窗方法
const openDepartmentCooperationDetailDialog = async (row: DepartmentCooperationRow) => {
  await getDepartmentCooperationDetailData(row.bizCrossDepartmentCoopCrossDepartmentCoopId);
  departmentCooperationDetailDialogVisible.value = true;
};
const closeDepartmentCooperationDetailDialog = () => {
  departmentCooperationDetailDialogVisible.value = false;
  departmentCooperationDetailSelectedRow.value = {
    bizCrossDepartmentCoopCrossDepartmentCoopId: '',
    sysDeptDeptName: '',
    sysCooperationTypeName: '',
    bizCrossDepartmentCoopCoopTask: '',
    bizCrossDepartmentCoopResponseDuration: 0,
    sysCooperationStatusName: '',
    bizCrossDepartmentCoopDisposalDuration: 0,
    sysSatisfactionName: '',
    bizCrossDepartmentCoopCompleteTime: '',
    bizCrossDepartmentCoopFeedbackResult: '',
    taskRequirements: [],
    departmentDivision: []
  };
  activeDepartmentCooperationDetailView.value = '协同详情';
};
const openDepartmentCooperationResponseDialog = () => {
  departmentCooperationResponseDialogVisible.value = true;
};
const closeDepartmentCooperationResponseDialog = () => {
  departmentCooperationResponseDialogVisible.value = false;
  cooperationResponseForm.value.responseContent = '';
  cooperationResponseFormRef.value?.resetFields();
};
const openDepartmentCooperationFeedbackDialog = () => {
  departmentCooperationFeedbackDialogVisible.value = true;
};
const closeDepartmentCooperationFeedbackDialog = () => {
  departmentCooperationFeedbackDialogVisible.value = false;
  cooperationFeedbackForm.value.feedbackResult = '';
  cooperationFeedbackForm.value.evidenceFiles = [];
  cooperationFeedbackFormRef.value?.resetFields();
};
const handleFileExceed = () => {
  ElMessage.warning('最多只能上传3个文件');
};
const handleBeforeUpload = (file: File) => {
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error('上传文件大小不能超过10MB');
    return false;
  }
  return true;
};
// 部门协同数据刷新
const refreshDepartmentCooperationData = async () => {
  await Promise.all([
    getDepartmentCooperationListData(),
    getDepartmentCooperationIndicatorsData(),
    getDepartmentCooperationDeptCountData(),
    getDepartmentCooperationTypeCountData(),
    getDepartmentCooperationDeptRatioData(),
    getDepartmentCooperationTypeRatioData(),
  ]);
  departmentCooperationChartRefreshKey.value++;
  ElMessage.success('部门协同数据刷新成功');
};

// 行业协同视图切换
const changeIndustryCooperationView = (viewName: string) => {
  activeIndustryCooperationView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '柱状图' || viewName === '饼图') &&
  nextTick(() => industryCooperationChartRefreshKey.value++);
};
const changeIndustryCooperationDetailView = (viewName: string) => {
  activeIndustryCooperationDetailView.value = viewName;
};
// 行业协同弹窗方法
const openIndustryCooperationDetailDialog = async (row: IndustryCooperationRow) => {
  await getIndustryCooperationDetailData(row.bizCrossIndustryCoopCrossIndustryCoopId);
  industryCooperationDetailDialogVisible.value = true;
};
const closeIndustryCooperationDetailDialog = () => {
  industryCooperationDetailDialogVisible.value = false;
  industryCooperationDetailSelectedRow.value = {
    bizCrossIndustryCoopCrossIndustryCoopId: '',
    sysIndustryIndustryName: '',
    sysCoopSceneName: '',
    bizCrossIndustryCoopProblemDesc: '',
    bizCrossIndustryCoopCreateTime: '',
    sysEffectLevelName: '',
    sysCooperationStatusName: '',
    bizCrossIndustryCoopProblemSolveRate: 0,
    sysSatisfactionName: '',
    bizCrossIndustryCoopCompleteTime: '',
    sysResponsibleUnitName: '',
    industryRequirements: [],
    cooperationRequirements: []
  };
  activeIndustryCooperationDetailView.value = '协同详情';
};
const openIndustryCooperationAssistDialog = () => {
  industryCooperationAssistDialogVisible.value = true;
};
const closeIndustryCooperationAssistDialog = () => {
  industryCooperationAssistDialogVisible.value = false;
  industryCooperationAssistForm.value.assistContent = '';
  industryCooperationAssistFormRef.value?.resetFields();
};
const openIndustryCooperationEvaluateDialog = () => {
  industryCooperationEvaluateDialogVisible.value = true;
};
const closeIndustryCooperationEvaluateDialog = () => {
  industryCooperationEvaluateDialogVisible.value = false;
  industryCooperationEvaluateForm.value.evaluateResult = '';
  industryCooperationEvaluateForm.value.score = null;
  industryCooperationEvaluateFormRef.value?.resetFields();
};
// 行业协同数据刷新
const refreshIndustryCooperationData = async () => {
  await Promise.all([
    getIndustryCooperationListData(),
    getIndustryCooperationIndicatorsData(),
    getIndustryCooperationIndustryCountData(),
    getIndustryCooperationSceneCountData(),
    getIndustryCooperationIndustryRatioData(),
    getIndustryCooperationSceneRatioData(),
  ]);
  industryCooperationChartRefreshKey.value++;
  ElMessage.success('行业协同数据刷新成功');
};
const getIndustryCooperationStatusType = (status: string) => {
  switch(status) {
    case '待配合': return 'warning';
    case '配合中': return 'info';
    case '待评估': return 'primary';
    case '已完成': return 'success';
    default: return 'info';
  }
};

// 层级协同视图切换
const changeLevelCooperationView = (viewName: string) => {
  activeLevelCooperationView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '柱状图' || viewName === '饼图') &&
  nextTick(() => levelCooperationChartRefreshKey.value++);
};
const changeLevelCooperationDetailView = (viewName: string) => {
  activeLevelCooperationDetailView.value = viewName;
};
// 层级协同弹窗方法
const openLevelCooperationDetailDialog = async (row: LevelCooperationRow) => {
  await getLevelCooperationDetailData(row.bizCrossLevelCoopCrossLevelCoopId);
  levelCooperationDetailDialogVisible.value = true;
};
const closeLevelCooperationDetailDialog = () => {
  levelCooperationDetailDialogVisible.value = false;
  levelCooperationDetailSelectedRow.value = {
    bizCrossLevelCoopCrossLevelCoopId: '',
    issueLevelName: '',
    receiveLevelName: '',
    bizCrossLevelCoopInstructionContent: '',
    sysInstructionStatusName: '',
    bizCrossLevelCoopIssueTime: '',
    currentUserLevel: '',
    bizCrossLevelCoopAverageFeedbackDuration: 0,
    sysResponsibleUnitName: '',
    bizCrossLevelCoopFeedbackResult: '',
    bizCrossLevelCoopCompleteTime: '',
    levelDivision: [],
    feedbackRecords: [],
    flowTimeline: []
  };
  activeLevelCooperationDetailView.value = '指令详情';
};
const openLevelCooperationFeedbackDialog = () => {
  levelCooperationFeedbackDialogVisible.value = true;
};
const closeLevelCooperationFeedbackDialog = () => {
  levelCooperationFeedbackDialogVisible.value = false;
  levelCooperationFeedbackForm.value.feedbackContent = '';
  levelCooperationFeedbackForm.value.evidenceFiles = [];
  levelCooperationFeedbackFormRef.value?.resetFields();
};
const openLevelCooperationTrackDialog = async (row: LevelCooperationRow) => {
  await getLevelCooperationDetailData(row.bizCrossLevelCoopCrossLevelCoopId);
  levelCooperationTrackDialogVisible.value = true;
};
const closeLevelCooperationTrackDialog = () => {
  levelCooperationTrackDialogVisible.value = false;
};
// 层级协同数据刷新
const refreshLevelCooperationData = async () => {
  await Promise.all([
    getLevelCooperationListData(),
    getLevelCooperationIndicatorsData(),
    getLevelCooperationLevelCountData(),
    getLevelCooperationUnitCountData(),
    getLevelCooperationStatusRatioData(),
  ]);
  levelCooperationChartRefreshKey.value++;
  ElMessage.success('层级协同数据刷新成功');
};
const getInstructionStatusType = (status: string) => {
  switch(status) {
    case '已下发': return 'warning';
    case '已接收': return 'info';
    case '已反馈': return 'primary';
    case '已完成': return 'success';
    default: return 'info';
  }
};
const getLevelTimelineItemType = (status: string) => {
  switch(status) {
    case '已下发': return 'warning';
    case '已接收': return 'info';
    case '已反馈': return 'primary';
    case '已完成': return 'success';
    default: return 'info';
  }
};
const getEffectLevelType = (level: string) => {
  switch(level) {
    case '高成效': return 'success';
    case '中成效': return 'warning';
    case '低成效': return 'danger';
    default: return 'info';
  }
};

// 政企协同视图切换
const changeGovEnterpriseCooperationView = (viewName: string) => {
  activeGovEnterpriseCooperationView.value = viewName;
  (viewName === '柱状图' || viewName === '饼图') &&
  nextTick(() => govEnterpriseCooperationChartRefreshKey.value++);
};
const changeGovEnterpriseCooperationDetailView = (viewName: string) => {
  activeGovEnterpriseCooperationDetailView.value = viewName;
};
const changeGovEnterpriseCooperationTrackingView = (viewName: string) => {
  govEnterpriseCooperationTrackingView.value = viewName;
};
// 政企协同弹窗方法
const openGovEnterpriseCooperationDetailDialog = async (row: GovEnterpriseCooperationRow) => {
  await getGovEnterpriseCooperationDetailData(row.bizGovernmentEnterpriseCoopGovEnterpriseCoopId);
  govEnterpriseCooperationDetailDialogVisible.value = true;
};
const closeGovEnterpriseCooperationDetailDialog = () => {
  govEnterpriseCooperationDetailDialogVisible.value = false;
  govEnterpriseCooperationDetailSelectedRow.value = {
    bizGovernmentEnterpriseCoopGovEnterpriseCoopId: '',
    sysDeptDeptName: '',
    sysMerchantMerchantName: '',
    sysEnterpriseTypeName: '',
    sysCooperationItemName: '',
    sysCooperationStatusName: '',
    bizGovernmentEnterpriseCoopProgressFeedback: '',
    sysSatisfactionName: '',
    bizGovernmentEnterpriseCoopCompleteTime: '',
    bizGovernmentEnterpriseCoopCoopCycle: '',
    cooperationDetail: {
      launchTime: '',
      expectedCompleteTime: '',
      contactPerson: '',
      contactPhone: '',
      cooperationContent: ''
    },
    responsibilityDivision: [],
    executionPlan: [],
    progressTimeline: [],
    feedbackRecords: []
  };
  activeGovEnterpriseCooperationDetailView.value = '协同详情';
};
const openGovEnterpriseCooperationTrackingDialog = async (row: GovEnterpriseCooperationRow) => {
  // 获取跟踪数据
  await getGovEnterpriseCooperationDetailData(row.bizGovernmentEnterpriseCoopGovEnterpriseCoopId);
  govEnterpriseCooperationTrackingDialogVisible.value = true;
};
const closeGovEnterpriseCooperationTrackingDialog = () => {
  govEnterpriseCooperationTrackingDialogVisible.value = false;
  cooperationTrackingForm.value.trackingContent = '';
  cooperationTrackingFormRef.value?.resetFields();
  govEnterpriseCooperationTrackingView.value = '进度时间轴';
};
const openGovEnterpriseCooperationEvaluationDialog = (row: GovEnterpriseCooperationRow) => {
  // 先获取当前行的详情数据
  getGovEnterpriseCooperationDetailData(row.bizGovernmentEnterpriseCoopGovEnterpriseCoopId)
    .then(() => {
      govEnterpriseCooperationEvaluationDialogVisible.value = true;
    })
    .catch((error) => {
      ElMessage.error(`获取协同信息失败：${error.message}`);
    });
};
const closeGovEnterpriseCooperationEvaluationDialog = () => {
  govEnterpriseCooperationEvaluationDialogVisible.value = false;
  cooperationEvaluationForm.value.satisfactionLevel = 5;
  cooperationEvaluationForm.value.evaluationContent = '';
  cooperationEvaluationFormRef.value?.resetFields();
};
// 政企协同数据刷新
const refreshGovEnterpriseCooperationData = async () => {
  await Promise.all([
    getGovEnterpriseCooperationListData(),
    getGovEnterpriseCooperationIndicatorsData(),
    getGovEnterpriseCooperationDeptCountData(),
    getGovEnterpriseCooperationEntTypeCountData(),
    getGovEnterpriseCooperationItemRatioData(),
    getGovEnterpriseCooperationSatisfactionRatioData(),
  ]);
  govEnterpriseCooperationChartRefreshKey.value++;
  ElMessage.success('政企协同数据刷新成功');
};

// 专属协同视图切换
const changeSpecialCooperationView = (viewName: string) => {
  activeSpecialCooperationView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '柱状图' || viewName === '饼图') &&
  nextTick(() => specialCooperationChartRefreshKey.value++);
};
const changeSpecialCooperationDetailView = (viewName: string) => {
  activeSpecialCooperationDetailView.value = viewName;
};
// 专属协同弹窗方法
const openSpecialCooperationDetailDialog = async (row: SpecialCooperationRow) => {
  await getSpecialCooperationDetailData(row.bizSpecialCoopSpecialCoopId);
  specialCooperationDetailDialogVisible.value = true;
};
const closeSpecialCooperationDetailDialog = () => {
  specialCooperationDetailDialogVisible.value = false;
  specialCooperationDetailSelectedRow.value = {
    bizSpecialCoopSpecialCoopId: '',
    sysCoopSceneName: '',
    sysResponsibleUnitName: '',
    bizSpecialCoopCoopRule: '',
    bizSpecialCoopResponsibilityDivision: '',
    sysCooperationStatusName: '',
    bizSpecialCoopAverageCoopCycle: 0,
    bizSpecialCoopCoopResult: '',
    bizSpecialCoopCompleteTime: '',
    bizSpecialCoopReviewConclusion: '',
    cooperationConfig: [],
    sceneRequirements: [],
    responsibilityList: [],
    executionProgress: []
  };
  activeSpecialCooperationDetailView.value = '协同详情';
};
const openSpecialCooperationExecuteDialog = () => {
  specialCooperationExecuteDialogVisible.value = true;
};
const closeSpecialCooperationExecuteDialog = () => {
  specialCooperationExecuteDialogVisible.value = false;
  executionProgressForm.value.progressContent = '';
  executionProgressForm.value.evidenceFiles = [];
  executionProgressFormRef.value?.resetFields();
};
const openSpecialCooperationReviewDialog = () => {
  specialCooperationReviewDialogVisible.value = true;
};
const closeSpecialCooperationReviewDialog = () => {
  specialCooperationReviewDialogVisible.value = false;
  reviewConclusionForm.value.reviewConclusion = '';
  reviewConclusionForm.value.optimizationSuggestions = '';
  reviewConclusionFormRef.value?.resetFields();
};
// 专属协同数据刷新
const refreshSpecialCooperationData = async () => {
  await Promise.all([
    getSpecialCooperationListData(),
    getSpecialCooperationIndicatorsData(),
    getSpecialCooperationSceneCountData(),
    getSpecialCooperationUnitCountData(),
    getSpecialCooperationSceneRatioData(),
    getSpecialCooperationStatusRatioData(),
  ]);
  specialCooperationChartRefreshKey.value++;
  ElMessage.success('专属协同数据刷新成功');
};
const getSpecialCooperationStatusType = (status: string) => {
  switch(status) {
    case '待执行': return 'warning';
    case '执行中': return 'info';
    case '已完成': return 'success';
    case '待复盘': return 'primary';
    case '已复盘': return '';
    default: return 'info';
  }
};

// 运维人员动态视图切换
const changeMaintainerDynamicView = (viewName: string) => {
  activeMaintainerDynamicView.value = viewName;
  if (viewName === '卡片') {
    nextTick(() => {
      // 初始化数字动画
      const elements = document.querySelectorAll('.maintainer-dynamic-number-animate');
      elements.forEach((el) => {
        const value = Number.parseFloat(el.dataset.value);
        animateValue(el, 0, value, 1500);
      });
    });
  }
  if (viewName === '柱状图') {
    nextTick(() => {
      maintainerDynamicChartRefreshKey.value++;
    });
  }
};
const changeMaintainerDynamicDetailView = (viewName: string) => {
  activeMaintainerDynamicDetailView.value = viewName;
};
// 运维人员动态弹窗方法
const openMaintainerDynamicDetailDialog = async (row: MaintainerDynamicRow) => {
  await getMaintainerDynamicDetailData(row.sysMaintainUserMaintainUserId);
  maintainerDynamicDetailDialogVisible.value = true;
};
const closeMaintainerDynamicDetailDialog = () => {
  maintainerDynamicDetailDialogVisible.value = false;
  maintainerDynamicDetailSelectedRow.value = {
    sysMaintainUserMaintainUserId: '',
    sysUserUserName: '',
    sysDeptDeptName: '',
    sysAreaAreaName: '',
    sysOnDutyStatusName: '',
    bizCoopStatCurrentCoopTaskCount: 0,
    bizCoopStatCompletedCoopTaskCount: 0,
    bizCoopStatCoopResponseDuration: 0,
    sysCooperationTypeName: '',
    bizCoopStatLatestCoopTime: '',
    contactPhone: '',
    email: '',
    skillTags: [],
    cooperationHistory: []
  };
  activeMaintainerDynamicDetailView.value = '人员基础信息';
};
const openMaintainerDynamicDispatchDialog = (row: MaintainerDynamicRow) => {
  maintainerDynamicDetailSelectedRow.value.sysMaintainUserMaintainUserId = row.sysMaintainUserMaintainUserId;
  maintainerDynamicDetailSelectedRow.value.sysUserUserName = row.sysUserUserName;
  maintainerDynamicDispatchDialogVisible.value = true;
};
const closeMaintainerDynamicDispatchDialog = () => {
  maintainerDynamicDispatchDialogVisible.value = false;
  dispatchTaskForm.value.taskDetail = '';
  dispatchTaskForm.value.coopTarget = '';
  dispatchTaskFormRef.value?.resetFields();
};
// 联系方式展示（脱敏）
const showContactInfo = (row: MaintainerDynamicRow) => {
  tipDialogContent.value = `联系方式：138****5678`;
  tipDialogVisible.value = true;
};
// 获取状态标签类型
const getOnDutyStatusType = (status: string) => {
  switch(status) {
    case '在岗': return 'success';
    case '待命': return 'warning';
    case '休息': return 'info';
    default: return 'info';
  }
};
// 运维人员动态数据刷新
const refreshMaintainerDynamicData = async () => {
  await Promise.all([
    getMaintainerDynamicListData(),
    getMaintainerDynamicIndicatorsData(),
    getMaintainerDynamicDeptTaskData(),
    getMaintainerDynamicAreaTaskData(),
  ]);
  maintainerDynamicChartRefreshKey.value++;
  ElMessage.success('运维人员动态数据刷新成功');
};

// 协同效率评估视图切换
const changeEfficiencyEvaluationView = (viewName: string) => {
  activeEfficiencyEvaluationView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '柱状图' || viewName === '折线图' || viewName === '饼图') &&
  nextTick(() => efficiencyEvaluationChartRefreshKey.value++);
};
const changeEfficiencyEvaluationDetailView = (viewName: string) => {
  activeEfficiencyEvaluationDetailView.value = viewName;
};
// 协同效率评估弹窗方法
const openEfficiencyEvaluationDetailDialog = async (row: EfficiencyEvaluationRow) => {
  await getEfficiencyEvaluationDetailData(row.bizCoopEfficiencyCoopEfficiencyId);
  efficiencyEvaluationDetailDialogVisible.value = true;
};
const closeEfficiencyEvaluationDetailDialog = () => {
  efficiencyEvaluationDetailDialogVisible.value = false;
  efficiencyEvaluationDetailSelectedRow.value = {
    bizCoopEfficiencyCoopEfficiencyId: '',
    sysCooperationTypeName: '',
    sysAreaAreaName: '',
    sysStatCycleName: '',
    bizCoopEfficiencyAverageResponseDuration: 0,
    bizCoopEfficiencyAverageDisposalDuration: 0,
    bizCoopEfficiencyEffectivenessRate: 0,
    bizCoopEfficiencyCoopCost: 0,
    bizCoopEfficiencyProblemRecurrenceRate: 0,
    bizCoopEfficiencyEfficiencyBottleneck: '',
    bizCoopEfficiencyOptimizationSuggestion: '',
    efficiencyDetails: [],
    dataSources: [],
    calculationLogic: []
  };
  activeEfficiencyEvaluationDetailView.value = '效率评估';
};
const openEfficiencyEvaluationOptimizeDialog = () => {
  efficiencyEvaluationOptimizeDialogVisible.value = true;
};
const closeEfficiencyEvaluationOptimizeDialog = () => {
  efficiencyEvaluationOptimizeDialogVisible.value = false;
  optimizationPlanForm.value.optimizationPlan = '';
  optimizationPlanForm.value.optimizationDeadline = '';
  optimizationPlanFormRef.value?.resetFields();
};
// 协同效率评估数据刷新
const refreshEfficiencyEvaluationData = async () => {
  await Promise.all([
    getEfficiencyEvaluationListData(),
    getEfficiencyEvaluationIndicatorsData(),
    getEfficiencyEvaluationTypeCompareData(),
    getEfficiencyEvaluationAreaCompareData(),
    getEfficiencyEvaluationTrendData(),
    getEfficiencyEvaluationRecurrenceRatioData(),
  ]);
  efficiencyEvaluationChartRefreshKey.value++;
  ElMessage.success('协同效率评估数据刷新成功');
};
const getEfficiencyStatusType = (status: string) => {
  switch(status) {
    case '达标': return 'success';
    case '未达标': return 'danger';
    default: return 'info';
  }
};


onMounted(async () => {
  await Promise.all([
    getRegionCooperationListData(),
    getRegionCooperationIndicatorsData(),
    getRegionCooperationAreaCountData(),
    getRegionCooperationTaskTypeCountData(),
    getRegionCooperationCompletionRateTrendData(),
    getMaintainerDynamicListData(),
    getMaintainerDynamicIndicatorsData(),
    getMaintainerDynamicDeptTaskData(),
    getMaintainerDynamicAreaTaskData(),
    getGovEnterpriseCooperationListData(),
    getGovEnterpriseCooperationIndicatorsData(),
    getGovEnterpriseCooperationDeptCountData(),
    getGovEnterpriseCooperationEntTypeCountData(),
    getGovEnterpriseCooperationItemRatioData(),
    getGovEnterpriseCooperationSatisfactionRatioData(),
    getEfficiencyEvaluationListData(),
    getEfficiencyEvaluationIndicatorsData(),
    getEfficiencyEvaluationTypeCompareData(),
    getEfficiencyEvaluationAreaCompareData(),
    getEfficiencyEvaluationTrendData(),
    getEfficiencyEvaluationRecurrenceRatioData(),
    getDepartmentCooperationListData(),
    getDepartmentCooperationIndicatorsData(),
    getDepartmentCooperationDeptCountData(),
    getDepartmentCooperationTypeCountData(),
    getDepartmentCooperationDeptRatioData(),
    getDepartmentCooperationTypeRatioData(),
    getIndustryCooperationListData(),
    getIndustryCooperationIndicatorsData(),
    getIndustryCooperationIndustryCountData(),
    getIndustryCooperationSceneCountData(),
    getIndustryCooperationIndustryRatioData(),
    getIndustryCooperationSceneRatioData(),
    getLevelCooperationListData(),
    getLevelCooperationIndicatorsData(),
    getLevelCooperationLevelCountData(),
    getLevelCooperationUnitCountData(),
    getLevelCooperationStatusRatioData(),
    getSpecialCooperationListData(),
    getSpecialCooperationIndicatorsData(),
    getSpecialCooperationSceneCountData(),
    getSpecialCooperationUnitCountData(),
    getSpecialCooperationSceneRatioData(),
    getSpecialCooperationStatusRatioData(),
  ]);
  setTimeout(() => {
    regionCooperationChartRefreshKey.value++;
    maintainerDynamicChartRefreshKey.value++;
    govEnterpriseCooperationChartRefreshKey.value++;
    specialCooperationChartRefreshKey.value++;
    efficiencyEvaluationChartRefreshKey.value++;
    departmentCooperationChartRefreshKey.value++;
    industryCooperationChartRefreshKey.value++;
    levelCooperationChartRefreshKey.value++;
  }, 200);
  screenFull.on('change', handleFullscreenChange);
});

onUnmounted(() => {
  screenFull.off('change', handleFullscreenChange);
  currentFullscreenPanel.value = null;
});
</script>

<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="mainbox">
      <div class="top">
        <div class="panel top-left" ref="topLeftPanel">
          <el-tabs v-model="topLeftActiveTab" class="common-tabs">
            <el-tab-pane label="区域协同" name="tab1">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in regionCooperationViewBtnList"
                      :key="item"
                      :type="activeRegionCooperationView === item ? 'primary' : ''"
                      plain
                      @click="changeRegionCooperationView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <button class="control-btn" @click="refreshRegionCooperationData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('topLeftPanel')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <!-- 卡片视图 -->
              <div v-if="activeRegionCooperationView === '卡片'" class="view-content">
                <div class="indicator-cards3">
                  <div class="indicator-card3 card1">
                    <div class="indicator-title">跨区域协同总数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ regionCooperationIndicators.totalCooperationCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card2">
                    <div class="indicator-title">已完成数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ regionCooperationIndicators.completedCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card3">
                    <div class="indicator-title">平均完成率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(regionCooperationIndicators.averageCompletionRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card4">
                    <div class="indicator-title">平均协同时长</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(3.2) }}</span>
                    </div>
                    <div class="indicator-unit">小时</div>
                  </div>
                </div>
              </div>
              <!-- 柱状图视图 -->
              <div v-if="activeRegionCooperationView === '柱状图'" class="view-content">
                <div
                  style="
        display: inline-block;
        width: 49%;
        height: 100%;
        vertical-align: top;
      "
                >
                  <VerticalBar2
                    :x-axis="regionCooperationAreaCountData.xAxis"
                    :series="regionCooperationAreaCountData.series"
                    unit="个"
                    title="不同区域协同数对比"
                    :key="regionCooperationChartRefreshKey"
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
                    :x-axis="regionCooperationTaskTypeCountData.xAxis"
                    :series="regionCooperationTaskTypeCountData.series"
                    unit="个"
                    title="不同任务类型协同数对比"
                    :key="regionCooperationChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 折线图视图 -->
              <div v-if="activeRegionCooperationView === '折线图'" class="view-content">
                <div style="width:100%;height:100%;padding:0.3vw 0.2vw 1.2vw 0.2vw;" :key="regionCooperationChartRefreshKey">
                  <ChartLine2
                    :data="regionCooperationCompletionRateTrendData"
                    title="近周期协同完成率趋势"
                    y-axis-name="协同完成率(%)"
                    style="width:100%;height:100%;"
                  />
                </div>
              </div>
              <!-- 列表视图 -->
              <div v-if="activeRegionCooperationView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="regionCooperationList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openRegionCooperationDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="bizCrossRegionCoopCrossRegionCoopId"
                      label="协同ID"
                      align="center"
                      min-width="140"
                    />
                    <ElTableColumn
                      prop="launchAreaName"
                      label="发起区域"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="cooperateAreaName"
                      label="配合区域"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="sysTaskTypeName"
                      label="任务类型"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="sysCooperationStatusName"
                      label="协同状态"
                      align="center"
                      width="100"
                    >
                      <template #default="scope">
                        <ElTag :type="getCooperationStatusType(scope.row.sysCooperationStatusName)">
                          {{ scope.row.sysCooperationStatusName || '-' }}
                        </ElTag>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="bizCrossRegionCoopCreateTime"
                      label="发起时间"
                      align="center"
                      width="140"
                    />
                    <ElTableColumn
                      label="操作"
                      align="center"
                      width="160"
                      fixed="right"
                    >
                      <template #default="scope">
                        <ElButton
                          type="info"
                          size="small"
                          plain
                          @click.stop="openRegionCooperationTrackDialog(scope.row)"
                        >
                          跟踪
                        </ElButton>
                        <ElButton
                          type="success"
                          size="small"
                          plain
                          @click.stop="openRegionCooperationActionDialog()"
                          :disabled="scope.row.sysCooperationStatusName !== '待协同'"
                        >
                          协同
                        </ElButton>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="部门协同" name="tab2">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in departmentCooperationViewBtnList"
                      :key="item"
                      :type="activeDepartmentCooperationView === item ? 'primary' : ''"
                      plain
                      @click="changeDepartmentCooperationView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <button class="control-btn" @click="refreshDepartmentCooperationData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('departmentCooperationPanelRef')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <!-- 卡片视图 -->
              <div v-if="activeDepartmentCooperationView === '卡片'" class="view-content">
                <div class="indicator-cards3">
                  <div class="indicator-card3 card1">
                    <div class="indicator-title">跨部门协同总数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ departmentCooperationIndicators.totalCooperationCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card2">
                    <div class="indicator-title">响应率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(departmentCooperationIndicators.responseRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card3">
                    <div class="indicator-title">群众满意度</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(departmentCooperationIndicators.satisfactionRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card4">
                    <div class="indicator-title">平均响应时长</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(2.8) }}</span>
                    </div>
                    <div class="indicator-unit">小时</div>
                  </div>
                </div>
              </div>
              <!-- 柱状图视图 -->
              <div v-if="activeDepartmentCooperationView === '柱状图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <VerticalBar2
                    :x-axis="departmentCooperationDeptCountData.xAxis"
                    :series="departmentCooperationDeptCountData.series"
                    unit="个"
                    title="不同部门协同数对比"
                    :key="departmentCooperationChartRefreshKey"
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
                    :x-axis="departmentCooperationTypeCountData.xAxis"
                    :series="departmentCooperationTypeCountData.series"
                    unit="个"
                    title="不同类型协同数对比"
                    :key="departmentCooperationChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 饼图视图 -->
              <div v-if="activeDepartmentCooperationView === '饼图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartPie1
                    :data="departmentCooperationDeptRatioData"
                    title="协同部门占比"
                    :key="departmentCooperationChartRefreshKey"
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
                    :data="departmentCooperationTypeRatioData"
                    title="协同类型占比"
                    :key="departmentCooperationChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 列表视图 -->
              <div v-if="activeDepartmentCooperationView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="departmentCooperationList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openDepartmentCooperationDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="bizCrossDepartmentCoopCrossDepartmentCoopId"
                      label="协同ID"
                      align="center"
                      min-width="140"
                    />
                    <ElTableColumn
                      prop="sysDeptDeptName"
                      label="协同部门"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="sysCooperationTypeName"
                      label="协同类型"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="bizCrossDepartmentCoopCoopTask"
                      label="任务内容"
                      align="center"
                      min-width="180"
                    />
                    <ElTableColumn
                      prop="bizCrossDepartmentCoopResponseDuration"
                      label="响应时长(小时)"
                      align="center"
                      width="120"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.bizCrossDepartmentCoopResponseDuration) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="sysCooperationStatusName"
                      label="协同状态"
                      align="center"
                      width="100"
                    >
                      <template #default="scope">
                        <ElTag :type="getCooperationStatusType(scope.row.sysCooperationStatusName)">
                          {{ scope.row.sysCooperationStatusName || '-' }}
                        </ElTag>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      label="操作"
                      align="center"
                      width="160"
                      fixed="right"
                    >
                      <template #default="scope">
                        <ElButton
                          v-if="scope.row.sysCooperationStatusName === '待响应'"
                          type="success"
                          size="small"
                          plain
                          @click.stop="openDepartmentCooperationResponseDialog()"
                        >
                          响应
                        </ElButton>
                        <ElButton
                          v-if="scope.row.sysCooperationStatusName === '响应中'"
                          type="success"
                          size="small"
                          plain
                          @click.stop="openDepartmentCooperationFeedbackDialog()"
                        >
                          反馈
                        </ElButton>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="行业协同" name="tab3">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in industryCooperationViewBtnList"
                      :key="item"
                      :type="activeIndustryCooperationView === item ? 'primary' : ''"
                      plain
                      @click="changeIndustryCooperationView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <button class="control-btn" @click="refreshIndustryCooperationData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('industryCooperationPanelRef')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <!-- 卡片视图 -->
              <div v-if="activeIndustryCooperationView === '卡片'" class="view-content">
                <div class="indicator-cards3">
                  <div class="indicator-card3 card1">
                    <div class="indicator-title">跨行业协同总数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ industryCooperationIndicators.totalCooperationCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card2">
                    <div class="indicator-title">问题解决率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(industryCooperationIndicators.problemSolveRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card3">
                    <div class="indicator-title">群众满意度</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(industryCooperationIndicators.satisfactionRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card4">
                    <div class="indicator-title">平均处理时长</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(3.2) }}</span>
                    </div>
                    <div class="indicator-unit">天</div>
                  </div>
                </div>
              </div>
              <!-- 柱状图视图 -->
              <div v-if="activeIndustryCooperationView === '柱状图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <VerticalBar2
                    :x-axis="industryCooperationIndustryCountData.xAxis"
                    :series="industryCooperationIndustryCountData.series"
                    unit="个"
                    title="不同行业协同数对比"
                    :key="industryCooperationChartRefreshKey"
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
                    :x-axis="industryCooperationSceneCountData.xAxis"
                    :series="industryCooperationSceneCountData.series"
                    unit="个"
                    title="不同场景协同数对比"
                    :key="industryCooperationChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 饼图视图 -->
              <div v-if="activeIndustryCooperationView === '饼图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartPie1
                    :data="industryCooperationIndustryRatioData"
                    title="协同行业占比"
                    :key="industryCooperationChartRefreshKey"
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
                    :data="industryCooperationSceneRatioData"
                    title="协同场景占比"
                    :key="industryCooperationChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 列表视图 -->
              <div v-if="activeIndustryCooperationView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="industryCooperationList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openIndustryCooperationDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="bizCrossIndustryCoopCrossIndustryCoopId"
                      label="协同ID"
                      align="center"
                      min-width="140"
                    />
                    <ElTableColumn
                      prop="sysIndustryIndustryName"
                      label="协同行业"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="sysCoopSceneName"
                      label="协同场景"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="bizCrossIndustryCoopProblemDesc"
                      label="问题描述"
                      align="center"
                      min-width="180"
                    />
                    <ElTableColumn
                      prop="bizCrossIndustryCoopCreateTime"
                      label="发起时间"
                      align="center"
                      width="120"
                    />
                    <ElTableColumn
                      prop="sysEffectLevelName"
                      label="成效等级"
                      align="center"
                      width="100"
                    >
                      <template #default="scope">
                        <ElTag :type="getEffectLevelType(scope.row.sysEffectLevelName)">
                          {{ scope.row.sysEffectLevelName || '-' }}
                        </ElTag>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="sysCooperationStatusName"
                      label="协同状态"
                      align="center"
                      width="100"
                    >
                      <template #default="scope">
                        <ElTag :type="getIndustryCooperationStatusType(scope.row.sysCooperationStatusName)">
                          {{ scope.row.sysCooperationStatusName || '-' }}
                        </ElTag>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      label="操作"
                      align="center"
                      width="160"
                      fixed="right"
                    >
                      <template #default="scope">
                        <ElButton
                          v-if="scope.row.sysCooperationStatusName === '待配合'"
                          type="success"
                          size="small"
                          plain
                          @click.stop="openIndustryCooperationAssistDialog()"
                        >
                          配合
                        </ElButton>
                        <ElButton
                          v-if="scope.row.sysCooperationStatusName === '待评估'"
                          type="warning"
                          size="small"
                          plain
                          @click.stop="openIndustryCooperationEvaluateDialog()"
                        >
                          评估
                        </ElButton>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="层级协同" name="tab4">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in levelCooperationViewBtnList"
                      :key="item"
                      :type="activeLevelCooperationView === item ? 'primary' : ''"
                      plain
                      @click="changeLevelCooperationView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <button class="control-btn" @click="refreshLevelCooperationData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('levelCooperationPanelRef')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <!-- 卡片视图 -->
              <div v-if="activeLevelCooperationView === '卡片'" class="view-content">
                <div class="indicator-cards3">
                  <div class="indicator-card3 card1">
                    <div class="indicator-title">跨层级协同总数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ levelCooperationIndicators.totalCooperationCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card2">
                    <div class="indicator-title">指令完成率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(levelCooperationIndicators.instructionCompleteRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card3">
                    <div class="indicator-title">平均反馈时长</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(levelCooperationIndicators.averageFeedbackDuration) }}</span>
                    </div>
                    <div class="indicator-unit">天</div>
                  </div>
                  <div class="indicator-card3 card4">
                    <div class="indicator-title">平均流转时长</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(1.8) }}</span>
                    </div>
                    <div class="indicator-unit">天</div>
                  </div>
                </div>
              </div>
              <!-- 柱状图视图 -->
              <div v-if="activeLevelCooperationView === '柱状图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <VerticalBar2
                    :x-axis="levelCooperationLevelCountData.xAxis"
                    :series="levelCooperationLevelCountData.series"
                    unit="个"
                    title="不同层级协同数对比"
                    :key="levelCooperationChartRefreshKey"
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
                    :x-axis="levelCooperationUnitCountData.xAxis"
                    :series="levelCooperationUnitCountData.series"
                    unit="个"
                    title="不同责任单位协同数对比"
                    :key="levelCooperationChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 饼图视图 -->
              <div v-if="activeLevelCooperationView === '饼图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartPie1
                    :data="levelCooperationStatusRatioData"
                    title="指令状态占比"
                    :key="levelCooperationChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 列表视图 -->
              <div v-if="activeLevelCooperationView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="levelCooperationList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openLevelCooperationDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="bizCrossLevelCoopCrossLevelCoopId"
                      label="协同ID"
                      align="center"
                      min-width="140"
                    />
                    <ElTableColumn
                      prop="issueLevelName"
                      label="下达层级"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="receiveLevelName"
                      label="接收层级"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="bizCrossLevelCoopInstructionContent"
                      label="指令内容"
                      align="center"
                      min-width="180"
                    />
                    <ElTableColumn
                      prop="sysInstructionStatusName"
                      label="指令状态"
                      align="center"
                      width="100"
                    >
                      <template #default="scope">
                        <ElTag :type="getInstructionStatusType(scope.row.sysInstructionStatusName)">
                          {{ scope.row.sysInstructionStatusName || '-' }}
                        </ElTag>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="bizCrossLevelCoopIssueTime"
                      label="下发时间"
                      align="center"
                      width="120"
                    />
                    <ElTableColumn
                      label="操作"
                      align="center"
                      width="160"
                      fixed="right"
                    >
                      <template #default="scope">
                        <ElButton
                          v-if="scope.row.currentUserLevel === scope.row.receiveLevelName"
                          type="success"
                          size="small"
                          plain
                          @click.stop="openLevelCooperationFeedbackDialog()"
                          :disabled="scope.row.sysInstructionStatusName !== '已下发' && scope.row.sysInstructionStatusName !== '已接收'"
                        >
                          反馈
                        </ElButton>
                        <ElButton
                          type="warning"
                          size="small"
                          plain
                          @click.stop="openLevelCooperationTrackDialog(scope.row)"
                        >
                          跟踪
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
        <div class="panel top-right" ref="topRightPanel">
          <div class="header-actions">
            <div class="actions-left"><p>运维人员动态</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton
                  v-for="item in maintainerDynamicViewBtnList"
                  :key="item"
                  :type="activeMaintainerDynamicView === item ? 'primary' : ''"
                  plain
                  @click="changeMaintainerDynamicView(item)"
                  class="view-btn"
                >{{ item }}</ElButton>
              </div>
              <button class="control-btn" @click="refreshMaintainerDynamicData">
                <el-icon color="#409eff" size="16"><Refresh /></el-icon>
              </button>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('topRightPanel')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <!-- 卡片视图 -->
          <div v-if="activeMaintainerDynamicView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1" style="cursor: default">
                <div class="indicator-title">总运维人数</div>
                <div class="indicator-value">
                  <span
                    :data-value="maintainerDynamicIndicators.totalMaintainerCount"
                    class="maintainer-dynamic-number-animate"
                  >
                    {{ maintainerDynamicIndicators.totalMaintainerCount }}
                  </span>
                </div>
                <div class="indicator-unit">人</div>
              </div>
              <div class="indicator-card1 card2" style="cursor: default">
                <div class="indicator-title">在岗人数</div>
                <div class="indicator-value">
                  <span
                    :data-value="maintainerDynamicIndicators.onDutyCount"
                    class="maintainer-dynamic-number-animate"
                  >
                    {{ maintainerDynamicIndicators.onDutyCount }}
                  </span>
                </div>
                <div class="indicator-unit">人</div>
              </div>
              <div class="indicator-card1 card3" style="cursor: default">
                <div class="indicator-title">协同任务总数</div>
                <div class="indicator-value">
                  <span
                    :data-value="maintainerDynamicIndicators.totalCoopTaskCount"
                    class="maintainer-dynamic-number-animate"
                  >
                    {{ maintainerDynamicIndicators.totalCoopTaskCount }}
                  </span>
                </div>
                <div class="indicator-unit">个</div>
              </div>
            </div>
          </div>
          <!-- 柱状图视图 -->
          <div v-if="activeMaintainerDynamicView === '柱状图'" class="view-content" style="box-sizing: border-box;width: 100%;height: 100%;padding: 0.3vw 0.2vw 0.8vw 0.2vw;">
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;vertical-align: top;" :key="maintainerDynamicChartRefreshKey">
              <VerticalBar1
                :x-axis="maintainerDynamicDeptTaskData.xAxis"
                :series="maintainerDynamicDeptTaskData.series"
                unit="个"
                title="各部门协同任务数对比"
                :base-font-scale="1"
                :active-indices="[]"
                style="width:100%;height:100%;"
              />
            </div>
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;padding-left: 0.3vw;vertical-align: top;border-left: 0.3vh solid #02a6b5;" :key="maintainerDynamicChartRefreshKey">
              <VerticalBar2
                :x-axis="maintainerDynamicAreaTaskData.xAxis"
                :series="maintainerDynamicAreaTaskData.series"
                unit="个"
                title="不同区域协同任务数对比"
                :base-font-scale="1"
                :active-indices="[]"
                style="width:100%;height:100%;"
              />
            </div>
          </div>
          <!-- 列表视图 -->
          <div v-if="activeMaintainerDynamicView === '列表'" class="view-content">
            <div class="table-box4">
              <ElTable
                class="table4"
                :data="maintainerDynamicList"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
                highlight-current-row
                @row-click="(row) => openMaintainerDynamicDetailDialog(row)"
              >
                <ElTableColumn prop="sysMaintainUserMaintainUserId" label="人员ID" align="center" />
                <ElTableColumn prop="sysUserUserName" label="人员姓名" align="center" />
                <ElTableColumn prop="sysDeptDeptName" label="所属部门" align="center" />
                <ElTableColumn prop="sysAreaAreaName" label="负责区域" align="center" />
                <ElTableColumn prop="sysOnDutyStatusName" label="当前状态" align="center">
                  <template #default="scope">
                    <ElTag :type="getOnDutyStatusType(scope.row.sysOnDutyStatusName)">
                      {{ scope.row.sysOnDutyStatusName }}
                    </ElTag>
                  </template>
                </ElTableColumn>
                <ElTableColumn prop="bizCoopStatCurrentCoopTaskCount" label="当前协同任务数" align="center" />
                <ElTableColumn label="操作" align="center" width="180" fixed="right">
                  <template #default="scope">
                    <ElButton
                      type="primary"
                      size="small"
                      plain
                      @click.stop="openMaintainerDynamicDispatchDialog(scope.row)"
                    >
                      调度
                    </ElButton>
                    <ElButton
                      type="info"
                      size="small"
                      plain
                      @click.stop="showContactInfo(scope.row)"
                    >
                      联系
                    </ElButton>
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
      </div>
      <div class="bottom">
        <div class="panel bottom-left" ref="bottomLeftPanel">
          <div class="header-actions">
            <div class="actions-left"><p>政企协同视图</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton
                  v-for="item in govEnterpriseCooperationViewBtnList"
                  :key="item"
                  :type="activeGovEnterpriseCooperationView === item ? 'primary' : ''"
                  plain
                  @click="changeGovEnterpriseCooperationView(item)"
                  class="view-btn"
                >
                  {{ item }}
                </ElButton>
              </div>
              <button class="control-btn" @click="refreshGovEnterpriseCooperationData">
                <el-icon color="#409eff" size="16"><Refresh /></el-icon>
              </button>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button
                class="panel-fullscreen-btn"
                @click="togglePanelFullscreen('govEnterpriseCooperationPanelRef')"
              >
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <!-- 卡片视图 -->
          <div v-if="activeGovEnterpriseCooperationView === '卡片'" class="view-content">
            <div class="indicator-cards3">
              <div class="indicator-card3 card1">
                <div class="indicator-title">政企协同总数</div>
                <div class="indicator-value">
                  <span class="number-animate">{{ govEnterpriseCooperationIndicators.totalCooperationCount }}</span>
                </div>
                <div class="indicator-unit">个</div>
              </div>
              <div class="indicator-card3 card2">
                <div class="indicator-title">响应率</div>
                <div class="indicator-value">
                  <span class="number-animate">{{ formatDecimal(govEnterpriseCooperationIndicators.responseRate) }}</span>
                </div>
                <div class="indicator-unit">%</div>
              </div>
              <div class="indicator-card3 card3">
                <div class="indicator-title">满意度</div>
                <div class="indicator-value">
                  <span class="number-animate">{{ formatDecimal(govEnterpriseCooperationIndicators.satisfactionRate) }}</span>
                </div>
                <div class="indicator-unit">%</div>
              </div>
              <div class="indicator-card3 card4">
                <div class="indicator-title">平均协同周期</div>
                <div class="indicator-value">
                  <span class="number-animate">{{ formatDecimal(2.3) }}</span>
                </div>
                <div class="indicator-unit">天</div>
              </div>
            </div>
          </div>
          <!-- 柱状图视图 -->
          <div v-if="activeGovEnterpriseCooperationView === '柱状图'" class="view-content">
            <div
              style="
                display: inline-block;
                width: 49%;
                height: 100%;
                vertical-align: top;
              "
            >
              <VerticalBar2
                :x-axis="govEnterpriseCooperationDeptCountData.xAxis"
                :series="govEnterpriseCooperationDeptCountData.series"
                unit="个"
                title="不同政府部门协同数对比"
                :key="govEnterpriseCooperationChartRefreshKey"
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
                :x-axis="govEnterpriseCooperationEntTypeCountData.xAxis"
                :series="govEnterpriseCooperationEntTypeCountData.series"
                unit="个"
                title="不同企业类型协同数对比"
                :key="govEnterpriseCooperationChartRefreshKey"
              />
            </div>
          </div>
          <!-- 饼图视图 -->
          <div v-if="activeGovEnterpriseCooperationView === '饼图'" class="view-content">
            <div
              style="
                display: inline-block;
                width: 49%;
                height: 100%;
                vertical-align: top;
              "
            >
              <ChartPie1
                :data="govEnterpriseCooperationItemRatioData"
                title="协同事项占比"
                :key="govEnterpriseCooperationChartRefreshKey"
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
                :data="govEnterpriseCooperationSatisfactionRatioData"
                title="满意度占比"
                :key="govEnterpriseCooperationChartRefreshKey"
              />
            </div>
          </div>
          <!-- 列表视图 -->
          <div v-if="activeGovEnterpriseCooperationView === '列表'" class="view-content">
            <div class="table-box4">
              <ElTable
                class="table4"
                :data="govEnterpriseCooperationList"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
                highlight-current-row
                @row-click="(row) => openGovEnterpriseCooperationDetailDialog(row)"
              >
                <ElTableColumn
                  prop="bizGovernmentEnterpriseCoopGovEnterpriseCoopId"
                  label="协同ID"
                  align="center"
                  min-width="140"
                />
                <ElTableColumn
                  prop="sysDeptDeptName"
                  label="政府部门"
                  align="center"
                  min-width="120"
                />
                <ElTableColumn
                  prop="sysMerchantMerchantName"
                  label="企业名称"
                  align="center"
                  min-width="120"
                />
                <ElTableColumn
                  prop="sysEnterpriseTypeName"
                  label="企业类型"
                  align="center"
                  min-width="100"
                />
                <ElTableColumn
                  prop="sysCooperationItemName"
                  label="协同事项"
                  align="center"
                  min-width="150"
                />
                <ElTableColumn
                  prop="sysCooperationStatusName"
                  label="协同状态"
                  align="center"
                  width="100"
                >
                  <template #default="scope">
                    <ElTag :type="getCooperationStatusType(scope.row.sysCooperationStatusName)">
                      {{ scope.row.sysCooperationStatusName || '-' }}
                    </ElTag>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  label="操作"
                  align="center"
                  width="160"
                  fixed="right"
                >
                  <template #default="scope">
                    <ElButton
                      type="primary"
                      size="small"
                      plain
                      @click.stop="openGovEnterpriseCooperationTrackingDialog(scope.row)"
                    >
                      跟踪
                    </ElButton>
                    <ElButton
                      type="success"
                      size="small"
                      plain
                      @click.stop="openGovEnterpriseCooperationEvaluationDialog(scope.row)"
                      :disabled="scope.row.sysCooperationStatusName !== '已完成'"
                    >
                      评价
                    </ElButton>
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-middle" ref="bottomMiddlePanel">
          <div class="header-actions">
            <div class="actions-left"><p>专属协同视图</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton
                  v-for="item in specialCooperationViewBtnList"
                  :key="item"
                  :type="activeSpecialCooperationView === item ? 'primary' : ''"
                  plain
                  @click="changeSpecialCooperationView(item)"
                  class="view-btn"
                >
                  {{ item }}
                </ElButton>
              </div>
              <button class="control-btn" @click="refreshSpecialCooperationData">
                <el-icon color="#409eff" size="16"><Refresh /></el-icon>
              </button>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button
                class="panel-fullscreen-btn"
                @click="togglePanelFullscreen('bottomMiddlePanel')"
              >
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <!-- 卡片视图 -->
          <div v-if="activeSpecialCooperationView === '卡片'" class="view-content">
            <div class="indicator-cards3">
              <div class="indicator-card3 card1">
                <div class="indicator-title">专属协同总数</div>
                <div class="indicator-value">
                  <span class="number-animate">{{ specialCooperationIndicators.totalCooperationCount }}</span>
                </div>
                <div class="indicator-unit">个</div>
              </div>
              <div class="indicator-card3 card2">
                <div class="indicator-title">完成率</div>
                <div class="indicator-value">
                  <span class="number-animate">{{ formatDecimal(specialCooperationIndicators.completionRate) }}</span>
                </div>
                <div class="indicator-unit">%</div>
              </div>
              <div class="indicator-card3 card3">
                <div class="indicator-title">平均协同周期</div>
                <div class="indicator-value">
                  <span class="number-animate">{{ formatDecimal(specialCooperationIndicators.averageCooperationCycle) }}</span>
                </div>
                <div class="indicator-unit">天</div>
              </div>
              <div class="indicator-card3 card4">
                <div class="indicator-title">平均执行时长</div>
                <div class="indicator-value">
                  <span class="number-animate">{{ formatDecimal(3.8) }}</span>
                </div>
                <div class="indicator-unit">小时</div>
              </div>
            </div>
          </div>
          <!-- 柱状图视图 -->
          <div v-if="activeSpecialCooperationView === '柱状图'" class="view-content">
            <div
              style="
        display: inline-block;
        width: 49%;
        height: 100%;
        vertical-align: top;
      "
            >
              <VerticalBar2
                :x-axis="specialCooperationSceneCountData.xAxis"
                :series="specialCooperationSceneCountData.series"
                unit="个"
                title="不同场景协同数对比"
                :key="specialCooperationChartRefreshKey"
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
                :x-axis="specialCooperationUnitCountData.xAxis"
                :series="specialCooperationUnitCountData.series"
                unit="个"
                title="不同责任单位协同数对比"
                :key="specialCooperationChartRefreshKey"
              />
            </div>
          </div>

          <!-- 饼图视图 -->
          <div v-if="activeSpecialCooperationView === '饼图'" class="view-content">
            <div
              style="
        display: inline-block;
        width: 49%;
        height: 100%;
        vertical-align: top;
      "
            >
              <ChartPie1
                :data="specialCooperationSceneRatioData"
                title="协同场景占比"
                :key="specialCooperationChartRefreshKey"
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
                :data="specialCooperationStatusRatioData"
                title="协同状态占比"
                :key="specialCooperationChartRefreshKey"
              />
            </div>
          </div>
          <!-- 列表视图 -->
          <div v-if="activeSpecialCooperationView === '列表'" class="view-content">
            <div class="table-box4">
              <ElTable
                class="table4"
                :data="specialCooperationList"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
                highlight-current-row
                @row-click="(row) => openSpecialCooperationDetailDialog(row)"
              >
                <ElTableColumn
                  prop="bizSpecialCoopSpecialCoopId"
                  label="协同ID"
                  align="center"
                  min-width="140"
                />
                <ElTableColumn
                  prop="sysCoopSceneName"
                  label="协同场景"
                  align="center"
                  min-width="100"
                />
                <ElTableColumn
                  prop="sysResponsibleUnitName"
                  label="责任单位"
                  align="center"
                  min-width="100"
                />
                <ElTableColumn
                  prop="bizSpecialCoopCoopRule"
                  label="协同规则"
                  align="center"
                  min-width="120"
                />
                <ElTableColumn
                  prop="bizSpecialCoopResponsibilityDivision"
                  label="责任分工"
                  align="center"
                  min-width="180"
                />
                <ElTableColumn
                  prop="sysCooperationStatusName"
                  label="协同状态"
                  align="center"
                  width="100"
                >
                  <template #default="scope">
                    <ElTag :type="getSpecialCooperationStatusType(scope.row.sysCooperationStatusName)">
                      {{ scope.row.sysCooperationStatusName || '-' }}
                    </ElTag>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  label="操作"
                  align="center"
                  width="160"
                  fixed="right"
                >
                  <template #default="scope">
                    <ElButton
                      v-if="scope.row.sysCooperationStatusName === '待执行' || scope.row.sysCooperationStatusName === '执行中'"
                      type="success"
                      size="small"
                      plain
                      @click.stop="openSpecialCooperationExecuteDialog()"
                    >
                      执行
                    </ElButton>
                    <ElButton
                      v-if="scope.row.sysCooperationStatusName === '待复盘'"
                      type="warning"
                      size="small"
                      plain
                      @click.stop="openSpecialCooperationReviewDialog()"
                    >
                      复盘
                    </ElButton>
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-right" ref="bottomRightPanel">
          <div class="header-actions">
            <div class="actions-left"><p>协同效率评估</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton
                  v-for="item in efficiencyEvaluationViewBtnList"
                  :key="item"
                  :type="activeEfficiencyEvaluationView === item ? 'primary' : ''"
                  plain
                  @click="changeEfficiencyEvaluationView(item)"
                  class="view-btn"
                >
                  {{ item }}
                </ElButton>
              </div>
              <button class="control-btn" @click="refreshEfficiencyEvaluationData">
                <el-icon color="#409eff" size="16"><Refresh /></el-icon>
              </button>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button
                class="panel-fullscreen-btn"
                @click="togglePanelFullscreen('bottomRightPanel')"
              >
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <!-- 卡片视图 -->
          <div v-if="activeEfficiencyEvaluationView === '卡片'" class="view-content">
            <div class="indicator-cards3">
              <div class="indicator-card3 card1">
                <div class="indicator-title">平均响应时长</div>
                <div class="indicator-value">
                  <span class="number-animate">{{ formatDecimal(efficiencyEvaluationIndicators.averageResponseDuration) }}</span>
                </div>
                <div class="indicator-unit">小时</div>
              </div>
              <div class="indicator-card3 card2">
                <div class="indicator-title">平均处置时长</div>
                <div class="indicator-value">
                  <span class="number-animate">{{ formatDecimal(efficiencyEvaluationIndicators.averageDisposalDuration) }}</span>
                </div>
                <div class="indicator-unit">小时</div>
              </div>
              <div class="indicator-card3 card3">
                <div class="indicator-title">成效达标率</div>
                <div class="indicator-value">
                  <span class="number-animate">{{ formatDecimal(efficiencyEvaluationIndicators.effectivenessRate) }}</span>
                </div>
                <div class="indicator-unit">%</div>
              </div>
              <div class="indicator-card3 card4">
                <div class="indicator-title">综合效率评分</div>
                <div class="indicator-value">
                  <span class="number-animate">{{ formatDecimal(89.5) }}</span>
                </div>
                <div class="indicator-unit">分</div>
              </div>
            </div>
          </div>
          <!-- 柱状图视图 -->
          <div v-if="activeEfficiencyEvaluationView === '柱状图'" class="view-content">
            <div
              style="
        display: inline-block;
        width: 49%;
        height: 100%;
        vertical-align: top;
      "
            >
              <VerticalBar2
                :x-axis="efficiencyEvaluationTypeCompareData.xAxis"
                :series="efficiencyEvaluationTypeCompareData.series"
                unit="小时"
                title="不同类型协同效率对比"
                :key="efficiencyEvaluationChartRefreshKey"
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
                :x-axis="efficiencyEvaluationAreaCompareData.xAxis"
                :series="efficiencyEvaluationAreaCompareData.series"
                unit="小时"
                title="不同区域协同效率对比"
                :key="efficiencyEvaluationChartRefreshKey"
              />
            </div>
          </div>

          <!-- 折线图视图 -->
          <div v-if="activeEfficiencyEvaluationView === '折线图'" class="view-content">
            <div class="view-content" style="box-sizing: border-box;width:100%;height:100%;padding:0.3vw;" :key="efficiencyEvaluationChartRefreshKey">
              <ChartLine1
                :data="efficiencyEvaluationTrendData"
                title="协同效率近周期趋势"
                y-axis-name="综合效率评分"
                :key="efficiencyEvaluationChartRefreshKey"
                style="width:100%;height:100%;"
              />
            </div>
          </div>
          <!-- 饼图视图 -->
          <div v-if="activeEfficiencyEvaluationView === '饼图'" class="view-content">
            <div
              style="
        display: inline-block;
        width: 100%;
        height: 100%;
        vertical-align: top;
      "
            >
              <ChartPie1
                :data="efficiencyEvaluationRecurrenceRatioData"
                title="问题复发率占比"
                :key="efficiencyEvaluationChartRefreshKey"
              />
            </div>
          </div>
          <!-- 列表视图 -->
          <div v-if="activeEfficiencyEvaluationView === '列表'" class="view-content">
            <div class="table-box4">
              <ElTable
                class="table4"
                :data="efficiencyEvaluationList"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
                highlight-current-row
                @row-click="(row) => openEfficiencyEvaluationDetailDialog(row)"
              >
                <ElTableColumn
                  prop="bizCoopEfficiencyCoopEfficiencyId"
                  label="评估ID"
                  align="center"
                  min-width="140"
                />
                <ElTableColumn
                  prop="sysCooperationTypeName"
                  label="协同类型"
                  align="center"
                  min-width="120"
                />
                <ElTableColumn
                  prop="sysAreaAreaName"
                  label="区域名称"
                  align="center"
                  min-width="100"
                />
                <ElTableColumn
                  prop="sysStatCycleName"
                  label="统计周期"
                  align="center"
                  min-width="100"
                />
                <ElTableColumn
                  prop="bizCoopEfficiencyAverageResponseDuration"
                  label="平均响应时长(小时)"
                  align="center"
                  width="120"
                >
                  <template #default="scope">
                    {{ formatDecimal(scope.row.bizCoopEfficiencyAverageResponseDuration) }}
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="bizCoopEfficiencyAverageDisposalDuration"
                  label="平均处置时长(小时)"
                  align="center"
                  width="120"
                >
                  <template #default="scope">
                    {{ formatDecimal(scope.row.bizCoopEfficiencyAverageDisposalDuration) }}
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="bizCoopEfficiencyEffectivenessRate"
                  label="成效达标率"
                  align="center"
                  width="100"
                >
                  <template #default="scope">
                    {{ formatDecimal(scope.row.bizCoopEfficiencyEffectivenessRate) }}%
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  label="操作"
                  align="center"
                  width="100"
                  fixed="right"
                >
                  <template #default="scope">
                    <ElButton
                      type="warning"
                      size="small"
                      plain
                      @click.stop="openEfficiencyEvaluationOptimizeDialog()"
                    >
                      优化
                    </ElButton>
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
      </div>

      <!-- 区域协同详情弹窗 -->
      <el-dialog
        v-model="regionCooperationDetailDialogVisible"
        width="40%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="区域协同详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in regionCooperationDetailViewBtnList"
                :key="item"
                :type="activeRegionCooperationDetailView === item ? 'primary' : ''"
                plain
                @click="changeRegionCooperationDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <!-- 协同信息视图 -->
        <div v-if="activeRegionCooperationDetailView === '协同信息'" class="view-content" style="padding:0;">
          <ElDescriptions bordered :column="2" class="desc-detail">
            <ElDescriptionsItem label="协同ID" span="2">
              {{ regionCooperationDetailSelectedRow.bizCrossRegionCoopCrossRegionCoopId || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="发起区域">
              {{ regionCooperationDetailSelectedRow.launchAreaName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="配合区域">
              {{ regionCooperationDetailSelectedRow.cooperateAreaName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="任务类型">
              {{ regionCooperationDetailSelectedRow.sysTaskTypeName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同状态">
              <ElTag :type="getCooperationStatusType(regionCooperationDetailSelectedRow.sysCooperationStatusName)">
                {{ regionCooperationDetailSelectedRow.sysCooperationStatusName || '-' }}
              </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="完成率(%)">
              {{ formatDecimal(regionCooperationDetailSelectedRow.bizCrossRegionCoopCompletionRate) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="平均协同时长(小时)">
              {{ formatDecimal(regionCooperationDetailSelectedRow.bizCrossRegionCoopAverageCoopDuration) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="发起时间">
              {{ regionCooperationDetailSelectedRow.bizCrossRegionCoopCreateTime || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="完成时间">
              {{ regionCooperationDetailSelectedRow.bizCrossRegionCoopCompleteTime || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="负责人">
              {{ regionCooperationDetailSelectedRow.sysUserUserName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同内容" span="2">
              {{ regionCooperationDetailSelectedRow.cooperationInfo.cooperationContent || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同标准" span="2">
              {{ regionCooperationDetailSelectedRow.cooperationInfo.cooperationStandard || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同周期">
              {{ regionCooperationDetailSelectedRow.cooperationInfo.cooperationCycle || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="联系人">
              {{ regionCooperationDetailSelectedRow.cooperationInfo.cooperationContact || '-' }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>
        <!-- 任务分工视图 -->
        <div v-if="activeRegionCooperationDetailView === '任务分工'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="regionCooperationDetailSelectedRow.taskDivision"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="area"
                label="区域/部门"
                align="center"
                width="120"
              />
              <ElTableColumn
                prop="task"
                label="任务内容"
                align="center"
                min-width="200"
              />
              <ElTableColumn
                prop="person"
                label="负责人"
                align="center"
                width="100"
              />
              <ElTableColumn
                prop="status"
                label="状态"
                align="center"
                width="100"
              >
                <template #default="scope">
                  <ElTag :type="scope.row.status === '已完成' ? 'success' : scope.row.status === '进行中' ? 'info' : 'warning'">
                    {{ scope.row.status || '-' }}
                  </ElTag>
                </template>
              </ElTableColumn>
            </ElTable>
          </div>
        </div>
        <!-- 进度日志视图 -->
        <div v-if="activeRegionCooperationDetailView === '进度日志'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="regionCooperationDetailSelectedRow.progressLogs"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="time"
                label="时间"
                align="center"
                width="180"
              />
              <ElTableColumn
                prop="content"
                label="内容"
                align="center"
                min-width="250"
              />
              <ElTableColumn
                prop="operator"
                label="操作人"
                align="center"
                width="100"
              />
            </ElTable>
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeRegionCooperationDetailDialog">关闭</ElButton>
        </template>
      </el-dialog>
      <!-- 区域协同跟踪弹窗 -->
      <el-dialog
        v-model="regionCooperationTrackDialogVisible"
        width="45%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="区域协同跟踪"
      >
        <template #title>
          <span>{{ regionCooperationTrackSelectedRow.launchAreaName }} → {{ regionCooperationTrackSelectedRow.cooperateAreaName }} 协同跟踪</span>
        </template>
        <div class="view-content" style="padding:0; display: flex; gap: 20px;">
          <!-- 协同进度时间轴 -->
          <div style="flex: 1;">
            <el-timeline>
              <el-timeline-item
                v-for="(item, index) in regionCooperationTrackSelectedRow.progressTimeline"
                :key="index"
                :timestamp="item.time"
                :type="getTimelineItemType(item.status)"
                :color="getTimelineItemColor(item.status)"
                placement="top"
                :icon="getTimelineItemIcon(item.status)"
              >
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: bold; margin-right: 20px;">{{ item.stage }}</span>
                  <el-tag :type="getTimelineStatusTagType(item.status)">
                    {{ item.status }}
                  </el-tag>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
          <!-- 各区域反馈结果 -->
          <div style="flex: 2;">
            <h4>各区域反馈结果：</h4>
            <ElTable
                :data="regionCooperationTrackSelectedRow.areaFeedbackResults"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
              >
                <ElTableColumn
                  prop="area"
                  label="区域"
                  align="center"
                />
                <ElTableColumn
                  prop="feedback"
                  label="反馈结果"
                  align="center"
                  min-width="120"
                />
                <ElTableColumn
                  prop="time"
                  label="反馈时间"
                  align="center"
                />
                <ElTableColumn
                  prop="status"
                  label="状态"
                  align="center"
                >
                  <template #default="scope">
                    <ElTag :type="scope.row.status === '已确认' ? 'success' : 'info'">
                      {{ scope.row.status || '-' }}
                    </ElTag>
                  </template>
                </ElTableColumn>
              </ElTable>
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeRegionCooperationTrackDialog">关闭</ElButton>
        </template>
      </el-dialog>
      <!-- 区域协同操作弹窗 -->
      <el-dialog
        v-model="regionCooperationActionDialogVisible"
        width="40%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="park-dialog"
        center
        destroy-on-close
        title="协同操作"
      >
        <el-form
          ref="regionCooperationActionFormRef"
          :model="regionCooperationActionForm"
          :rules="regionCooperationActionFormRules"
          label-width="80px"
          style="width: 100%;"
        >
          <el-form-item label="协同操作" prop="actionContent" required>
            <el-input
              v-model="regionCooperationActionForm.actionContent"
              type="textarea"
              :rows="6"
              placeholder="请输入协同操作内容（必填）"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <ElButton plain @click="closeRegionCooperationActionDialog">取消</ElButton>
          <ElButton type="primary" @click="submitRegionCooperationActionData(regionCooperationDetailSelectedRow.bizCrossRegionCoopCrossRegionCoopId)">确认</ElButton>
        </template>
      </el-dialog>

      <!-- 部门协同详情弹窗 -->
      <el-dialog
        v-model="departmentCooperationDetailDialogVisible"
        width="40%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="部门协同详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in departmentCooperationDetailViewBtnList"
                :key="item"
                :type="activeDepartmentCooperationDetailView === item ? 'primary' : ''"
                plain
                @click="changeDepartmentCooperationDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <!-- 协同详情视图 -->
        <div v-if="activeDepartmentCooperationDetailView === '协同详情'" class="view-content" style="padding:0;">
          <ElDescriptions bordered :column="2" class="desc-detail">
            <ElDescriptionsItem label="协同ID" span="2">
              {{ departmentCooperationDetailSelectedRow.bizCrossDepartmentCoopCrossDepartmentCoopId || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同部门">
              {{ departmentCooperationDetailSelectedRow.sysDeptDeptName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同类型">
              {{ departmentCooperationDetailSelectedRow.sysCooperationTypeName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同状态">
              <ElTag :type="getCooperationStatusType(departmentCooperationDetailSelectedRow.sysCooperationStatusName)">
                {{ departmentCooperationDetailSelectedRow.sysCooperationStatusName || '-' }}
              </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="任务内容" span="2">
              {{ departmentCooperationDetailSelectedRow.bizCrossDepartmentCoopCoopTask || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="响应时长(小时)">
              {{ formatDecimal(departmentCooperationDetailSelectedRow.bizCrossDepartmentCoopResponseDuration) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="处置时长(小时)">
              {{ formatDecimal(departmentCooperationDetailSelectedRow.bizCrossDepartmentCoopDisposalDuration) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="群众满意度">
              {{ departmentCooperationDetailSelectedRow.sysSatisfactionName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="完成时间">
              {{ departmentCooperationDetailSelectedRow.bizCrossDepartmentCoopCompleteTime || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="反馈结果" span="2">
              {{ departmentCooperationDetailSelectedRow.bizCrossDepartmentCoopFeedbackResult || '-' }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>
        <!-- 任务要求视图 -->
        <div v-if="activeDepartmentCooperationDetailView === '任务要求'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="departmentCooperationDetailSelectedRow.taskRequirements"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="item"
                label="项目"
                align="center"
                width="120"
              />
              <ElTableColumn
                prop="value"
                label="要求"
                align="center"
                min-width="300"
              />
            </ElTable>
          </div>
        </div>
        <!-- 部门分工视图 -->
        <div v-if="activeDepartmentCooperationDetailView === '部门分工'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="departmentCooperationDetailSelectedRow.departmentDivision"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="deptName"
                label="部门"
                align="center"
                width="120"
              />
              <ElTableColumn
                prop="task"
                label="任务"
                align="center"
                min-width="200"
              />
              <ElTableColumn
                prop="person"
                label="负责人"
                align="center"
                width="100"
              />
            </ElTable>
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeDepartmentCooperationDetailDialog">关闭</ElButton>
        </template>
      </el-dialog>
      <!-- 协同响应弹窗 -->
      <el-dialog
        v-model="departmentCooperationResponseDialogVisible"
        width="40%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="park-dialog"
        center
        destroy-on-close
        title="协同响应"
      >
        <el-form
          ref="cooperationResponseFormRef"
          :model="cooperationResponseForm"
          :rules="cooperationResponseFormRules"
          label-width="80px"
          style="width: 100%;"
        >
          <el-form-item label="响应内容" prop="responseContent" required>
            <el-input
              v-model="cooperationResponseForm.responseContent"
              type="textarea"
              :rows="6"
              placeholder="请输入响应内容（必填）"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <ElButton plain @click="closeDepartmentCooperationResponseDialog">取消</ElButton>
          <ElButton type="primary" @click="submitResponseData(departmentCooperationDetailSelectedRow.bizCrossDepartmentCoopCrossDepartmentCoopId)">确认</ElButton>
        </template>
      </el-dialog>
      <!-- 协同反馈弹窗 -->
      <el-dialog
        v-model="departmentCooperationFeedbackDialogVisible"
        width="40%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="park-dialog"
        center
        destroy-on-close
        title="协同反馈"
      >
        <el-form
          ref="cooperationFeedbackFormRef"
          :model="cooperationFeedbackForm"
          :rules="cooperationFeedbackFormRules"
          label-width="80px"
          style="width: 100%;"
        >
          <el-form-item label="反馈结果" prop="feedbackResult" required>
            <el-input
              v-model="cooperationFeedbackForm.feedbackResult"
              type="textarea"
              :rows="6"
              placeholder="请输入反馈结果（必填）"
            />
          </el-form-item>
          <el-form-item label="佐证材料">
            <el-upload
              v-model:file-list="cooperationFeedbackForm.evidenceFiles"
              action="#"
              multiple
              :limit="3"
              :on-exceed="handleFileExceed"
              :before-upload="handleBeforeUpload"
            >
              <ElButton type="primary">上传文件</ElButton>
              <template #tip>
                <div class="el-upload__tip">
                  支持上传图片、文档等格式，最多3个文件
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <ElButton plain @click="closeDepartmentCooperationFeedbackDialog">取消</ElButton>
          <ElButton type="primary" @click="submitFeedbackData(departmentCooperationDetailSelectedRow.bizCrossDepartmentCoopCrossDepartmentCoopId)">确认</ElButton>
        </template>
      </el-dialog>

      <!-- 行业协同详情弹窗 -->
      <el-dialog
        v-model="industryCooperationDetailDialogVisible"
        width="40%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="行业协同详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in industryCooperationDetailViewBtnList"
                :key="item"
                :type="activeIndustryCooperationDetailView === item ? 'primary' : ''"
                plain
                @click="changeIndustryCooperationDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <!-- 协同详情视图 -->
        <div v-if="activeIndustryCooperationDetailView === '协同详情'" class="view-content" style="padding:0;">
          <ElDescriptions bordered :column="2" class="desc-detail">
            <ElDescriptionsItem label="协同ID" span="2">
              {{ industryCooperationDetailSelectedRow.bizCrossIndustryCoopCrossIndustryCoopId || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同行业">
              {{ industryCooperationDetailSelectedRow.sysIndustryIndustryName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同场景">
              {{ industryCooperationDetailSelectedRow.sysCoopSceneName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同状态">
              <ElTag :type="getIndustryCooperationStatusType(industryCooperationDetailSelectedRow.sysCooperationStatusName)">
                {{ industryCooperationDetailSelectedRow.sysCooperationStatusName || '-' }}
              </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="问题描述" span="2">
              {{ industryCooperationDetailSelectedRow.bizCrossIndustryCoopProblemDesc || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="问题解决率">
              {{ formatDecimal(industryCooperationDetailSelectedRow.bizCrossIndustryCoopProblemSolveRate) }}%
            </ElDescriptionsItem>
            <ElDescriptionsItem label="群众满意度">
              {{ industryCooperationDetailSelectedRow.sysSatisfactionName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="责任主体">
              {{ industryCooperationDetailSelectedRow.sysResponsibleUnitName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="发起时间">
              {{ industryCooperationDetailSelectedRow.bizCrossIndustryCoopCreateTime || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="完成时间">
              {{ industryCooperationDetailSelectedRow.bizCrossIndustryCoopCompleteTime || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="成效等级">
              <ElTag :type="getEffectLevelType(industryCooperationDetailSelectedRow.sysEffectLevelName)">
                {{ industryCooperationDetailSelectedRow.sysEffectLevelName || '-' }}
              </ElTag>
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>
        <!-- 行业需求视图 -->
        <div v-if="activeIndustryCooperationDetailView === '行业需求'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="industryCooperationDetailSelectedRow.industryRequirements"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="item"
                label="需求项目"
                align="center"
                width="120"
              />
              <ElTableColumn
                prop="value"
                label="需求内容"
                align="center"
                min-width="300"
              />
            </ElTable>
          </div>
        </div>
        <!-- 配合要求视图 -->
        <div v-if="activeIndustryCooperationDetailView === '配合要求'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="industryCooperationDetailSelectedRow.cooperationRequirements"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="item"
                label="要求项目"
                align="center"
                width="120"
              />
              <ElTableColumn
                prop="value"
                label="要求内容"
                align="center"
                min-width="300"
              />
            </ElTable>
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeIndustryCooperationDetailDialog">关闭</ElButton>
        </template>
      </el-dialog>
      <!-- 协同配合弹窗 -->
      <el-dialog
        v-model="industryCooperationAssistDialogVisible"
        width="40%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="park-dialog"
        center
        destroy-on-close
        title="协同配合"
      >
        <el-form
          ref="industryCooperationAssistFormRef"
          :model="industryCooperationAssistForm"
          :rules="industryCooperationAssistFormRules"
          label-width="80px"
          style="width: 100%;"
        >
          <el-form-item label="配合内容" prop="assistContent" required>
            <el-input
              v-model="industryCooperationAssistForm.assistContent"
              type="textarea"
              :rows="6"
              placeholder="请输入配合内容（必填）"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <ElButton plain @click="closeIndustryCooperationAssistDialog">取消</ElButton>
          <ElButton type="primary" @click="submitAssistData(industryCooperationDetailSelectedRow.bizCrossIndustryCoopCrossIndustryCoopId)">确认</ElButton>
        </template>
      </el-dialog>
      <!-- 协同评估弹窗 -->
      <el-dialog
        v-model="industryCooperationEvaluateDialogVisible"
        width="40%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="park-dialog"
        center
        destroy-on-close
        title="协同评估"
      >
        <el-form
          ref="industryCooperationEvaluateFormRef"
          :model="industryCooperationEvaluateForm"
          :rules="industryCooperationEvaluateFormRules"
          label-width="80px"
          style="width: 100%;"
        >
          <el-form-item label="评估结果" prop="evaluateResult" required>
            <el-input
              v-model="industryCooperationEvaluateForm.evaluateResult"
              type="textarea"
              :rows="6"
              placeholder="请输入评估结果（必填）"
            />
          </el-form-item>
          <el-form-item label="打分">
            <el-input-number
              v-model="industryCooperationEvaluateForm.score"
              :min="0"
              :max="100"
              :step="1"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <ElButton plain @click="closeIndustryCooperationEvaluateDialog">取消</ElButton>
          <ElButton type="primary" @click="submitEvaluateData(industryCooperationDetailSelectedRow.bizCrossIndustryCoopCrossIndustryCoopId)">确认</ElButton>
        </template>
      </el-dialog>

      <!-- 层级协同详情弹窗 -->
      <el-dialog
        v-model="levelCooperationDetailDialogVisible"
        width="40%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="层级协同详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in levelCooperationDetailViewBtnList"
                :key="item"
                :type="activeLevelCooperationDetailView === item ? 'primary' : ''"
                plain
                @click="changeLevelCooperationDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <!-- 指令详情视图 -->
        <div v-if="activeLevelCooperationDetailView === '指令详情'" class="view-content" style="padding:0;">
          <ElDescriptions bordered :column="2" class="desc-detail">
            <ElDescriptionsItem label="协同ID" span="2">
              {{ levelCooperationDetailSelectedRow.bizCrossLevelCoopCrossLevelCoopId || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="下达层级">
              {{ levelCooperationDetailSelectedRow.issueLevelName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="接收层级">
              {{ levelCooperationDetailSelectedRow.receiveLevelName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="指令状态">
              <ElTag :type="getInstructionStatusType(levelCooperationDetailSelectedRow.sysInstructionStatusName)">
                {{ levelCooperationDetailSelectedRow.sysInstructionStatusName || '-' }}
              </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="指令内容" span="2">
              {{ levelCooperationDetailSelectedRow.bizCrossLevelCoopInstructionContent || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="平均反馈时长">
              {{ formatDecimal(levelCooperationDetailSelectedRow.bizCrossLevelCoopAverageFeedbackDuration) }}天
            </ElDescriptionsItem>
            <ElDescriptionsItem label="责任单位">
              {{ levelCooperationDetailSelectedRow.sysResponsibleUnitName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="反馈结果">
              {{ levelCooperationDetailSelectedRow.bizCrossLevelCoopFeedbackResult || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="下发时间">
              {{ levelCooperationDetailSelectedRow.bizCrossLevelCoopIssueTime || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="完成时间">
              {{ levelCooperationDetailSelectedRow.bizCrossLevelCoopCompleteTime || '-' }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>
        <!-- 层级分工视图 -->
        <div v-if="activeLevelCooperationDetailView === '层级分工'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="levelCooperationDetailSelectedRow.levelDivision"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="levelName"
                label="层级"
                align="center"
                width="120"
              />
              <ElTableColumn
                prop="task"
                label="任务"
                align="center"
                min-width="200"
              />
              <ElTableColumn
                prop="person"
                label="负责人"
                align="center"
                width="100"
              />
            </ElTable>
          </div>
        </div>
        <!-- 反馈记录视图 -->
        <div v-if="activeLevelCooperationDetailView === '反馈记录'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="levelCooperationDetailSelectedRow.feedbackRecords"
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
                width="140"
              />
              <ElTableColumn
                prop="level"
                label="反馈层级"
                align="center"
                width="100"
              />
              <ElTableColumn
                prop="content"
                label="反馈内容"
                align="center"
                min-width="200"
              />
            </ElTable>
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeLevelCooperationDetailDialog">关闭</ElButton>
        </template>
      </el-dialog>
      <!-- 层级反馈弹窗 -->
      <el-dialog
        v-model="levelCooperationFeedbackDialogVisible"
        width="40%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="park-dialog"
        center
        destroy-on-close
        title="层级反馈"
      >
        <el-form
          ref="levelCooperationFeedbackFormRef"
          :model="levelCooperationFeedbackForm"
          :rules="levelCooperationFeedbackFormRules"
          label-width="80px"
          style="width: 100%;"
        >
          <el-form-item label="反馈内容" prop="feedbackContent" required>
            <el-input
              v-model="levelCooperationFeedbackForm.feedbackContent"
              type="textarea"
              :rows="6"
              placeholder="请输入反馈内容（必填）"
            />
          </el-form-item>
          <el-form-item label="上传凭证">
            <el-upload
              v-model:file-list="levelCooperationFeedbackForm.evidenceFiles"
              action="#"
              multiple
              :limit="3"
              :on-exceed="handleFileExceed"
              :before-upload="handleBeforeUpload"
            >
              <ElButton type="primary">上传文件</ElButton>
              <template #tip>
                <div class="el-upload__tip">
                  支持上传图片、文档等格式，最多3个文件
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <ElButton plain @click="closeLevelCooperationFeedbackDialog">取消</ElButton>
          <ElButton type="primary" @click="submitLevelFeedbackData(levelCooperationDetailSelectedRow.bizCrossLevelCoopCrossLevelCoopId)">确认</ElButton>
        </template>
      </el-dialog>
      <!-- 层级跟踪弹窗 -->
      <el-dialog
        v-model="levelCooperationTrackDialogVisible"
        width="50%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="指令流转跟踪"
      >
        <div class="view-content" style="padding:20px;">
          <ElTimeline>
            <ElTimelineItem
              v-for="(item, index) in levelCooperationDetailSelectedRow.flowTimeline"
              :key="index"
              :timestamp="item.time"
              placement="top"
              :type="getLevelTimelineItemType(item.status)"
            >
              <div style="display: flex; align-items: center;">
                <div style="margin-right: 20px; min-width: 80px;">
                  <ElTag :type="getInstructionStatusType(item.status)" size="small">
                    {{ item.status }}
                  </ElTag>
                </div>
                <div>
                  <div style="font-weight: bold;">{{ item.level }} - {{ item.action }}</div>
                  <div style="color: #666; margin-top: 5px;">时间：{{ item.time }}</div>
                </div>
              </div>
            </ElTimelineItem>
          </ElTimeline>
        </div>
        <template #footer>
          <ElButton plain @click="closeLevelCooperationTrackDialog">关闭</ElButton>
        </template>
      </el-dialog>

      <!-- 政企协同详情弹窗 -->
      <el-dialog
        v-model="govEnterpriseCooperationDetailDialogVisible"
        width="45%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="政企协同详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in govEnterpriseCooperationDetailViewBtnList"
                :key="item"
                :type="activeGovEnterpriseCooperationDetailView === item ? 'primary' : ''"
                plain
                @click="changeGovEnterpriseCooperationDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <!-- 协同详情视图 -->
        <div v-if="activeGovEnterpriseCooperationDetailView === '协同详情'" class="view-content" style="padding:0;">
          <ElDescriptions bordered :column="2" class="desc-detail">
            <ElDescriptionsItem label="协同ID" span="2">
              {{ govEnterpriseCooperationDetailSelectedRow.bizGovernmentEnterpriseCoopGovEnterpriseCoopId || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="政府部门">
              {{ govEnterpriseCooperationDetailSelectedRow.sysDeptDeptName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="企业名称">
              {{ govEnterpriseCooperationDetailSelectedRow.sysMerchantMerchantName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="企业类型">
              {{ govEnterpriseCooperationDetailSelectedRow.sysEnterpriseTypeName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同事项" span="2">
              {{ govEnterpriseCooperationDetailSelectedRow.sysCooperationItemName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同状态">
              <ElTag :type="getCooperationStatusType(govEnterpriseCooperationDetailSelectedRow.sysCooperationStatusName)">
                {{ govEnterpriseCooperationDetailSelectedRow.sysCooperationStatusName || '-' }}
              </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="进度反馈">
              {{ govEnterpriseCooperationDetailSelectedRow.bizGovernmentEnterpriseCoopProgressFeedback || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="满意度评价">
              {{ govEnterpriseCooperationDetailSelectedRow.sysSatisfactionName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="完成时间">
              {{ govEnterpriseCooperationDetailSelectedRow.bizGovernmentEnterpriseCoopCompleteTime || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同周期">
              {{ govEnterpriseCooperationDetailSelectedRow.bizGovernmentEnterpriseCoopCoopCycle || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="发起时间">
              {{ govEnterpriseCooperationDetailSelectedRow.cooperationDetail?.launchTime || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="预计完成">
              {{ govEnterpriseCooperationDetailSelectedRow.cooperationDetail?.expectedCompleteTime || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="联系人">
              {{ govEnterpriseCooperationDetailSelectedRow.cooperationDetail?.contactPerson || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="联系电话">
              {{ govEnterpriseCooperationDetailSelectedRow.cooperationDetail?.contactPhone || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同内容" span="2">
              {{ govEnterpriseCooperationDetailSelectedRow.cooperationDetail?.cooperationContent || '-' }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>
        <!-- 责任分工视图 -->
        <div v-if="activeGovEnterpriseCooperationDetailView === '责任分工'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="govEnterpriseCooperationDetailSelectedRow.responsibilityDivision"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="department"
                label="部门"
                align="center"
                width="120"
              />
              <ElTableColumn
                prop="task"
                label="任务"
                align="center"
                min-width="180"
              />
              <ElTableColumn
                prop="person"
                label="负责人"
                align="center"
                width="100"
              />
              <ElTableColumn
                prop="phone"
                label="联系电话"
                align="center"
                width="120"
              />
            </ElTable>
          </div>
        </div>
        <!-- 执行计划视图 -->
        <div v-if="activeGovEnterpriseCooperationDetailView === '执行计划'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="govEnterpriseCooperationDetailSelectedRow.executionPlan"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="stage"
                label="阶段"
                align="center"
                width="100"
              />
              <ElTableColumn
                prop="task"
                label="任务内容"
                align="center"
                min-width="180"
              />
              <ElTableColumn
                prop="startTime"
                label="开始时间"
                align="center"
                width="100"
              />
              <ElTableColumn
                prop="endTime"
                label="结束时间"
                align="center"
                width="100"
              />
              <ElTableColumn
                prop="status"
                label="状态"
                align="center"
                width="80"
              >
                <template #default="scope">
                  <ElTag :type="scope.row.status === '已完成' ? 'success' : scope.row.status === '进行中' ? 'primary' : 'info'">
                    {{ scope.row.status }}
                  </ElTag>
                </template>
              </ElTableColumn>
            </ElTable>
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeGovEnterpriseCooperationDetailDialog">关闭</ElButton>
        </template>
      </el-dialog>
      <!-- 协同跟踪弹窗 -->
      <el-dialog
        v-model="govEnterpriseCooperationTrackingDialogVisible"
        width="45%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="park-dialog"
        center
        destroy-on-close
        title="协同跟踪"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in govEnterpriseCooperationTrackingViewBtnList"
                :key="item"
                :type="govEnterpriseCooperationTrackingView === item ? 'primary' : ''"
                plain
                @click="changeGovEnterpriseCooperationTrackingView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <!-- 进度时间轴视图 -->
        <div v-if="govEnterpriseCooperationTrackingView === '进度时间轴'" class="view-content" style="padding:0;">
          <el-timeline>
              <el-timeline-item
                v-for="(item, index) in govEnterpriseCooperationDetailSelectedRow.progressTimeline"
                :key="index"
                :timestamp="item.time"
                placement="top"
              >
                <el-card>
                  <p>{{ item.content }}</p>
                  <p style="color:#888;font-size:12px;">操作人：{{ item.operator }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
        </div>
        <!-- 反馈记录视图 -->
        <div v-if="govEnterpriseCooperationTrackingView === '反馈记录'" class="view-content" style="padding:0;">
          <div style="height:300px;overflow-y:auto;width:100%;">
            <ElTable
              :data="govEnterpriseCooperationDetailSelectedRow.feedbackRecords"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="time"
                label="时间"
                align="center"
                width="140"
              />
              <ElTableColumn
                prop="sender"
                label="发送方"
                align="center"
                width="80"
              />
              <ElTableColumn
                prop="content"
                label="内容"
                align="center"
                min-width="180"
              />
              <ElTableColumn
                prop="type"
                label="类型"
                align="center"
                width="80"
              />
            </ElTable>
          </div>
        </div>
        <el-form
          ref="cooperationTrackingFormRef"
          :model="cooperationTrackingForm"
          :rules="cooperationTrackingFormRules"
          label-width="80px"
          style="width: 100%;margin-top:20px;"
        >
          <el-form-item label="跟踪记录" prop="trackingContent" required>
            <el-input
              v-model="cooperationTrackingForm.trackingContent"
              type="textarea"
              :rows="3"
              placeholder="请输入跟踪记录内容（必填）"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <ElButton plain @click="closeGovEnterpriseCooperationTrackingDialog">取消</ElButton>
          <ElButton type="primary" @click="submitTrackingData(govEnterpriseCooperationDetailSelectedRow.bizGovernmentEnterpriseCoopGovEnterpriseCoopId)">提交</ElButton>
        </template>
      </el-dialog>
      <!-- 协同评价弹窗 -->
      <el-dialog
        v-model="govEnterpriseCooperationEvaluationDialogVisible"
        width="40%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="park-dialog"
        center
        destroy-on-close
        title="协同评价"
      >
        <el-form
          ref="cooperationEvaluationFormRef"
          :model="cooperationEvaluationForm"
          :rules="cooperationEvaluationFormRules"
          label-width="80px"
          style="width: 100%;"
        >
          <el-form-item label="满意度" prop="satisfactionLevel" required>
            <el-rate
              v-model="cooperationEvaluationForm.satisfactionLevel"
              :max="5"
              show-text
              :texts="['非常不满意', '不满意', '一般', '满意', '非常满意']"
            />
          </el-form-item>
          <el-form-item label="评价意见">
            <el-input
              v-model="cooperationEvaluationForm.evaluationContent"
              type="textarea"
              :rows="4"
              placeholder="请输入评价意见（可选）"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <ElButton plain @click="closeGovEnterpriseCooperationEvaluationDialog">取消</ElButton>
          <ElButton type="primary" @click="submitEvaluationData(govEnterpriseCooperationDetailSelectedRow.bizGovernmentEnterpriseCoopGovEnterpriseCoopId)">确认</ElButton>
        </template>
      </el-dialog>

      <!-- 专属协同详情弹窗 -->
      <ElDialog
        v-model="specialCooperationDetailDialogVisible"
        width="50%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="专属协同详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in specialCooperationDetailViewBtnList"
                :key="item"
                :type="activeSpecialCooperationDetailView === item ? 'primary' : ''"
                plain
                @click="changeSpecialCooperationDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <!-- 协同详情视图 -->
        <div v-if="activeSpecialCooperationDetailView === '协同详情'" class="view-content" style="padding:0;">
          <ElDescriptions bordered :column="2" class="desc-detail">
            <ElDescriptionsItem label="协同ID" span="2">
              {{ specialCooperationDetailSelectedRow.bizSpecialCoopSpecialCoopId || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同场景">
              {{ specialCooperationDetailSelectedRow.sysCoopSceneName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="责任单位">
              {{ specialCooperationDetailSelectedRow.sysResponsibleUnitName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同状态">
              <ElTag :type="getSpecialCooperationStatusType(specialCooperationDetailSelectedRow.sysCooperationStatusName)">
                {{ specialCooperationDetailSelectedRow.sysCooperationStatusName || '-' }}
              </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同规则" span="2">
              {{ specialCooperationDetailSelectedRow.bizSpecialCoopCoopRule || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="责任分工" span="2">
              {{ specialCooperationDetailSelectedRow.bizSpecialCoopResponsibilityDivision || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="平均协同周期">
              {{ formatDecimal(specialCooperationDetailSelectedRow.bizSpecialCoopAverageCoopCycle) }} 天
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同结果">
              {{ specialCooperationDetailSelectedRow.bizSpecialCoopCoopResult || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="完成时间">
              {{ specialCooperationDetailSelectedRow.bizSpecialCoopCompleteTime || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="复盘结论">
              {{ specialCooperationDetailSelectedRow.bizSpecialCoopReviewConclusion || '-' }}
            </ElDescriptionsItem>
          </ElDescriptions>
          <!-- 执行进展时间轴 -->
          <div v-if="specialCooperationDetailSelectedRow.executionProgress.length > 0" style="margin-top: 20px;">
            <div style="font-size: 14px; color: #409eff; margin-bottom: 10px; font-weight: bold;">执行进展</div>
            <el-timeline>
              <el-timeline-item
                v-for="(item, index) in specialCooperationDetailSelectedRow.executionProgress"
                :key="index"
                :timestamp="item.time"
                placement="top"
              >
                {{ item.content }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <!-- 协同配置视图 -->
        <div v-if="activeSpecialCooperationDetailView === '协同配置'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="specialCooperationDetailSelectedRow.cooperationConfig"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="item"
                label="项目"
                align="center"
                width="120"
              />
              <ElTableColumn
                prop="value"
                label="配置内容"
                align="center"
                min-width="300"
              />
            </ElTable>
          </div>
        </div>
        <!-- 场景要求视图 -->
        <div v-if="activeSpecialCooperationDetailView === '场景要求'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="specialCooperationDetailSelectedRow.sceneRequirements"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="item"
                label="要求项目"
                align="center"
                width="120"
              />
              <ElTableColumn
                prop="value"
                label="具体要求"
                align="center"
                min-width="300"
              />
            </ElTable>
          </div>
        </div>
        <!-- 责任清单视图 -->
        <div v-if="activeSpecialCooperationDetailView === '责任清单'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="specialCooperationDetailSelectedRow.responsibilityList"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="unit"
                label="责任单位"
                align="center"
                width="120"
              />
              <ElTableColumn
                prop="task"
                label="任务内容"
                align="center"
                min-width="200"
              />
              <ElTableColumn
                prop="person"
                label="负责人"
                align="center"
                width="100"
              />
            </ElTable>
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeSpecialCooperationDetailDialog">关闭</ElButton>
        </template>
      </ElDialog>
      <!-- 协同执行弹窗 -->
      <ElDialog
        v-model="specialCooperationExecuteDialogVisible"
        width="40%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="park-dialog"
        center
        destroy-on-close
        title="协同执行"
      >
        <el-form
          ref="executionProgressFormRef"
          :model="executionProgressForm"
          :rules="executionProgressFormRules"
          label-width="80px"
          style="width: 100%;"
        >
          <el-form-item label="执行进展" prop="progressContent" required>
            <el-input
              v-model="executionProgressForm.progressContent"
              type="textarea"
              :rows="6"
              placeholder="请输入执行进展（必填）"
            />
          </el-form-item>
          <el-form-item label="执行凭证">
            <el-upload
              v-model:file-list="executionProgressForm.evidenceFiles"
              action="#"
              multiple
              :limit="3"
              :on-exceed="handleFileExceed"
              :before-upload="handleBeforeUpload"
            >
              <ElButton type="primary">上传文件</ElButton>
              <template #tip>
                <div class="el-upload__tip">
                  支持上传图片、文档等格式，最多3个文件
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <ElButton plain @click="closeSpecialCooperationExecuteDialog">取消</ElButton>
          <ElButton type="primary" @click="submitExecutionProgressData(specialCooperationDetailSelectedRow.bizSpecialCoopSpecialCoopId)">确认</ElButton>
        </template>
      </ElDialog>
      <!-- 协同复盘弹窗 -->
      <ElDialog
        v-model="specialCooperationReviewDialogVisible"
        width="40%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="park-dialog"
        center
        destroy-on-close
        title="协同复盘"
      >
        <el-form
          ref="reviewConclusionFormRef"
          :model="reviewConclusionForm"
          :rules="reviewConclusionFormRules"
          label-width="80px"
          style="width: 100%;"
        >
          <el-form-item label="复盘结论" prop="reviewConclusion" required>
            <el-input
              v-model="reviewConclusionForm.reviewConclusion"
              type="textarea"
              :rows="6"
              placeholder="请输入复盘结论（必填）"
            />
          </el-form-item>
          <el-form-item label="优化建议">
            <el-input
              v-model="reviewConclusionForm.optimizationSuggestions"
              type="textarea"
              :rows="4"
              placeholder="请输入优化建议（可选）"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <ElButton plain @click="closeSpecialCooperationReviewDialog">取消</ElButton>
          <ElButton type="primary" @click="submitReviewConclusionData(specialCooperationDetailSelectedRow.bizSpecialCoopSpecialCoopId)">保存</ElButton>
        </template>
      </ElDialog>

      <!-- 协同效率评估详情弹窗 -->
      <ElDialog
        v-model="efficiencyEvaluationDetailDialogVisible"
        width="50%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="协同效率评估详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in efficiencyEvaluationDetailViewBtnList"
                :key="item"
                :type="activeEfficiencyEvaluationDetailView === item ? 'primary' : ''"
                plain
                @click="changeEfficiencyEvaluationDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <!-- 效率评估视图 -->
        <div v-if="activeEfficiencyEvaluationDetailView === '效率评估'" class="view-content" style="padding:0;">
          <ElDescriptions bordered :column="2" class="desc-detail">
            <ElDescriptionsItem label="评估ID" span="2">
              {{ efficiencyEvaluationDetailSelectedRow.bizCoopEfficiencyCoopEfficiencyId || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同类型">
              {{ efficiencyEvaluationDetailSelectedRow.sysCooperationTypeName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="区域名称">
              {{ efficiencyEvaluationDetailSelectedRow.sysAreaAreaName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="统计周期">
              {{ efficiencyEvaluationDetailSelectedRow.sysStatCycleName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="平均响应时长">
              {{ formatDecimal(efficiencyEvaluationDetailSelectedRow.bizCoopEfficiencyAverageResponseDuration) }} 小时
            </ElDescriptionsItem>
            <ElDescriptionsItem label="平均处置时长">
              {{ formatDecimal(efficiencyEvaluationDetailSelectedRow.bizCoopEfficiencyAverageDisposalDuration) }} 小时
            </ElDescriptionsItem>
            <ElDescriptionsItem label="成效达标率">
              {{ formatDecimal(efficiencyEvaluationDetailSelectedRow.bizCoopEfficiencyEffectivenessRate) }}%
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同成本">
              {{ formatNumber(efficiencyEvaluationDetailSelectedRow.bizCoopEfficiencyCoopCost) }} 元
            </ElDescriptionsItem>
            <ElDescriptionsItem label="问题复发率">
              {{ formatDecimal(efficiencyEvaluationDetailSelectedRow.bizCoopEfficiencyProblemRecurrenceRate) }}%
            </ElDescriptionsItem>
            <ElDescriptionsItem label="效率瓶颈" span="2">
              {{ efficiencyEvaluationDetailSelectedRow.bizCoopEfficiencyEfficiencyBottleneck || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="优化建议" span="2">
              {{ efficiencyEvaluationDetailSelectedRow.bizCoopEfficiencyOptimizationSuggestion || '-' }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>
        <!-- 评估明细视图 -->
        <div v-if="activeEfficiencyEvaluationDetailView === '评估明细'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="efficiencyEvaluationDetailSelectedRow.efficiencyDetails"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="item"
                label="评估项目"
                align="center"
                width="120"
              />
              <ElTableColumn
                prop="value"
                label="实际值"
                align="center"
                width="100"
              />
              <ElTableColumn
                prop="standard"
                label="标准值"
                align="center"
                width="100"
              />
              <ElTableColumn
                prop="status"
                label="达标状态"
                align="center"
                width="100"
              >
                <template #default="scope">
                  <ElTag :type="getEfficiencyStatusType(scope.row.status)">
                    {{ scope.row.status || '-' }}
                  </ElTag>
                </template>
              </ElTableColumn>
            </ElTable>
          </div>
        </div>
        <!-- 数据来源视图 -->
        <div v-if="activeEfficiencyEvaluationDetailView === '数据来源'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="efficiencyEvaluationDetailSelectedRow.dataSources"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="source"
                label="数据源"
                align="center"
                width="120"
              />
              <ElTableColumn
                prop="type"
                label="数据类型"
                align="center"
                width="120"
              />
              <ElTableColumn
                prop="frequency"
                label="更新频率"
                align="center"
                width="120"
              />
            </ElTable>
          </div>
        </div>
        <!-- 计算逻辑视图 -->
        <div v-if="activeEfficiencyEvaluationDetailView === '计算逻辑'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="efficiencyEvaluationDetailSelectedRow.calculationLogic"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="item"
                label="计算项目"
                align="center"
                width="120"
              />
              <ElTableColumn
                prop="logic"
                label="计算逻辑"
                align="center"
                min-width="300"
              />
            </ElTable>
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeEfficiencyEvaluationDetailDialog">关闭</ElButton>
        </template>
      </ElDialog>
      <!-- 协同效率优化弹窗 -->
      <ElDialog
        v-model="efficiencyEvaluationOptimizeDialogVisible"
        width="40%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="park-dialog"
        center
        destroy-on-close
        title="协同效率优化"
      >
        <el-form
          ref="optimizationPlanFormRef"
          :model="optimizationPlanForm"
          :rules="optimizationPlanFormRules"
          label-width="80px"
          style="width: 100%;"
        >
          <el-form-item label="优化方案" prop="optimizationPlan" required>
            <el-input
              v-model="optimizationPlanForm.optimizationPlan"
              type="textarea"
              :rows="6"
              placeholder="请输入优化方案（必填）"
            />
          </el-form-item>
          <el-form-item label="优化时限" prop="optimizationDeadline" required>
            <ElInput
              v-model="optimizationPlanForm.optimizationDeadline"
              type="datetime-local"
              placeholder="请选择优化时限"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <ElButton plain @click="closeEfficiencyEvaluationOptimizeDialog">取消</ElButton>
          <ElButton type="primary" @click="submitOptimizationPlanData(efficiencyEvaluationDetailSelectedRow.bizCoopEfficiencyCoopEfficiencyId)">提交</ElButton>
        </template>
      </ElDialog>

      <!-- 运维人员详情弹窗 -->
      <ElDialog
        v-model="maintainerDynamicDetailDialogVisible"
        width="45%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="运维人员详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in maintainerDynamicDetailViewBtnList"
                :key="item"
                :type="activeMaintainerDynamicDetailView === item ? 'primary' : ''"
                plain
                @click="changeMaintainerDynamicDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>

        <!-- 人员基础信息视图 -->
        <div v-if="activeMaintainerDynamicDetailView === '人员基础信息'" class="view-content" style="padding:0;">
          <ElDescriptions bordered :column="2" class="desc-detail">
            <ElDescriptionsItem label="人员ID" span="2">
              {{ maintainerDynamicDetailSelectedRow.sysMaintainUserMaintainUserId || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="人员姓名">
              {{ maintainerDynamicDetailSelectedRow.sysUserUserName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="所属部门">
              {{ maintainerDynamicDetailSelectedRow.sysDeptDeptName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="负责区域">
              {{ maintainerDynamicDetailSelectedRow.sysAreaAreaName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="当前状态">
              <ElTag :type="getOnDutyStatusType(maintainerDynamicDetailSelectedRow.sysOnDutyStatusName)">
                {{ maintainerDynamicDetailSelectedRow.sysOnDutyStatusName || '-' }}
              </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="当前协同任务数">
              {{ maintainerDynamicDetailSelectedRow.bizCoopStatCurrentCoopTaskCount || 0 }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="已完成协同任务数">
              {{ maintainerDynamicDetailSelectedRow.bizCoopStatCompletedCoopTaskCount || 0 }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="协同响应时长(小时)">
              {{ formatDecimal(maintainerDynamicDetailSelectedRow.bizCoopStatCoopResponseDuration) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="擅长协同类型">
              {{ maintainerDynamicDetailSelectedRow.sysCooperationTypeName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="最近协同时间">
              {{ maintainerDynamicDetailSelectedRow.bizCoopStatLatestCoopTime || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="联系方式">
              {{ maintainerDynamicDetailSelectedRow.contactPhone || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="邮箱">
              {{ maintainerDynamicDetailSelectedRow.email || '-' }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>

        <!-- 协同历史视图 -->
        <div v-if="activeMaintainerDynamicDetailView === '协同历史'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="maintainerDynamicDetailSelectedRow.cooperationHistory"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn prop="taskId" label="任务ID" align="center" width="120" />
              <ElTableColumn prop="taskName" label="任务名称" align="center" min-width="200" />
              <ElTableColumn prop="status" label="状态" align="center" width="100">
                <template #default="scope">
                  <ElTag :type="scope.row.status === '已完成' ? 'success' : 'warning'">
                    {{ scope.row.status }}
                  </ElTag>
                </template>
              </ElTableColumn>
              <ElTableColumn prop="time" label="时间" align="center" width="120" />
            </ElTable>
          </div>
        </div>

        <!-- 技能标签视图 -->
        <div v-if="activeMaintainerDynamicDetailView === '技能标签'" class="view-content" style="padding:0;">
          <div style="height:400px; padding: 20px;">
            <div v-if="maintainerDynamicDetailSelectedRow.skillTags.length > 0">
              <el-tag
                v-for="(tag, index) in maintainerDynamicDetailSelectedRow.skillTags"
                :key="index"
                type="info"
                style="margin: 5px;"
              >
                {{ tag }}
              </el-tag>
            </div>
            <div v-else style="text-align: center; color: #999; line-height: 200px;">
              暂无技能标签
            </div>
          </div>
        </div>

        <template #footer>
          <ElButton plain @click="closeMaintainerDynamicDetailDialog">关闭</ElButton>
        </template>
      </ElDialog>

      <!-- 调度任务弹窗 -->
      <ElDialog
        v-model="maintainerDynamicDispatchDialogVisible"
        width="45%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="park-dialog"
        center
        destroy-on-close
        title="调度任务"
      >
        <div style="margin-bottom: 15px; font-size: 14px;">
          调度人员：{{ maintainerDynamicDetailSelectedRow.sysUserUserName }}
        </div>
        <el-form
          ref="dispatchTaskFormRef"
          :model="dispatchTaskForm"
          :rules="dispatchTaskFormRules"
          label-width="120px"
          style="width: 100%;"
        >
          <el-form-item label="协同任务详情" prop="taskDetail" required>
            <el-input
              v-model="dispatchTaskForm.taskDetail"
              type="textarea"
              :rows="4"
              placeholder="请输入协同任务详情（必填）"
            />
          </el-form-item>
          <el-form-item label="指定协同对象" prop="coopTarget" required>
            <el-input
              v-model="dispatchTaskForm.coopTarget"
              placeholder="请输入指定协同对象（必填）"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <ElButton plain @click="closeMaintainerDynamicDispatchDialog">取消</ElButton>
          <ElButton type="primary" @click="submitDispatchTaskData(maintainerDynamicDetailSelectedRow.sysMaintainUserMaintainUserId)">确认</ElButton>
        </template>
      </ElDialog>

      <el-dialog
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
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../templatesstyle/table1';
@import '../../../templatesstyle/table2-rank';
@import '../../../templatesstyle/table3';
@import '../../../templatesstyle/table4';
@import '../../../templatesstyle/indicator-cards1';
@import '../../../templatesstyle/indicator-cards3';
@import '../../../templatesstyle/common';

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
.top-right { flex: 1; }
.bottom { display: flex; gap: 0.6vw; height: 46%; overflow: hidden !important; }
.bottom-left { flex: 1; }
.bottom-middle { flex: 1; }
.bottom-right { flex: 1; }

.content-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 1vw;
  color: #00ffd0;
}
</style>
