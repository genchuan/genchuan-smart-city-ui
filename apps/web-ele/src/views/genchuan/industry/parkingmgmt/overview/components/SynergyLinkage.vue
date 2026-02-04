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
  fetchCoopAreaCount,
  fetchCoopAreaRatio,
  fetchCoopCoreIndicators,
  fetchCoopEfficiencyAreaCount,
  fetchCoopEfficiencyIndicators,
  fetchCoopEfficiencyList,
  fetchCoopEfficiencyRecurrenceRatio,
  fetchCoopEfficiencyTrendData,
  fetchCoopEfficiencyTypeCount,
  fetchCoopIndustryRatio,
  fetchCoopItemTypeRatio,
  fetchCoopTrendData,
  fetchCoopTypeCount,
  fetchRegionCooperationList,
  fetchRegionCooperationIndicators,
  fetchRegionCooperationAreaCount,
  fetchRegionCooperationTaskTypeCount,
  fetchRegionCooperationCompletionRateTrend,
  fetchRegionCooperationDetail,
  fetchRegionCooperationTrack,
  submitRegionCooperationAction,
  fetchEnterpriseTypeCoopCount,
  fetchGovDeptCoopCount,
  fetchGovEnterpriseCoopIndicators,
  fetchGovEnterpriseCoopList,
  fetchHighFrequencyCoopTop10,
  fetchSatisfactionLevelRatio,
  fetchSpecialCoopDeptCount,
  fetchSpecialCoopIndicators,
  fetchSpecialCoopList,
  fetchSpecialCoopSceneCount,
  fetchSpecialCoopSceneRatio,
  fetchSpecialCoopStatusRatio,
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
} from '#/api/genchuan/industry/parkingmgmt/overview/SynergyLinkage.ts';

import ChartLine1 from '#/views/genchuan/industry/templatesstatchart/ChartLine1.vue';
import ChartPie1 from '#/views/genchuan/industry/templatesstatchart/ChartPie1.vue';
import ChartPie2 from '#/views/genchuan/industry/templatesstatchart/ChartPie2.vue';
import ChartPie4 from '#/views/genchuan/industry/templatesstatchart/ChartPie4.vue';
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

// 数字滚动动画方法
const animateValue = (element: HTMLElement, start: number, end: number, duration: number) => {
  let startTimestamp: number | null = null;
  const isInteger = Number.isInteger(end);
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentValue = progress * (end - start) + start;
    element.textContent = isInteger ? currentValue.toFixed(0) : currentValue.toFixed(1);
    if (progress < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
};
const initCrossRegionCoopNumberAnimations = () => {
  const elements = document.querySelectorAll('.cross-region-coop-number-animate');
  elements.forEach((el) => {
    const value = Number.parseFloat(el.dataset.value);
    animateValue(el, 0, value, 1500);
  });
};
const initGovCoopNumberAnimations = () => {
  const elements = document.querySelectorAll('.gov-coop-number-animate');
  elements.forEach((el) => {
    const value = Number.parseFloat(el.dataset.value);
    animateValue(el, 0, value, 1500);
  });
};
const initSpecialCoopNumberAnimations = () => {
  const elements = document.querySelectorAll('.special-coop-number-animate');
  elements.forEach((el) => {
    const value = Number.parseFloat(el.dataset.value);
    animateValue(el, 0, value, 1500);
  });
};
const initCoopAnalysisNumberAnimations = () => {
  const elements = document.querySelectorAll('.coop-analysis-number-animate');
  elements.forEach((el) => {
    const value = Number.parseFloat(el.dataset.value);
    animateValue(el, 0, value, 1500);
  });
};
const initCoopEfficiencyNumberAnimations = () => {
  const elements = document.querySelectorAll('.coop-efficiency-number-animate');
  elements.forEach((el) => {
    const value = Number.parseFloat(el.dataset.value);
    animateValue(el, 0, value, 1500);
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

// 协同统计分析TS类型定义
interface CoopAnalysisIndicators {
  totalCoopCount: number; // 协同事项总数
  avgHandleCycle: number; // 平均处理周期
  finishRate: number; // 协同完成率
  highPriorityRate: number; // 高优协同占比
}
interface HighFreqCoopRow {
  rank: number; // 排名
  coopStatId: string; // 协同统计ID
  coopType: string; // 协同类型
  coopCount: number; // 协同事件数量
  top10CoopItem: string; // 协同事项
}

// 政企协同视图TS类型定义
interface GovCoopIndicators {
  totalCount: number; // 政企协同总数
  responseRate: number; // 政企响应率
  satisfactionRate: number; // 政企满意度
}
interface GovCoopRow {
  govEnterpriseCoopId: string; // 政企协同ID
  coopItem: string; // 协同事项
  govDepartment: string; // 政府部门
  merchantId: string; // 企业ID
  progressFeedback: string; // 进度反馈
  satisfactionEvaluation: string; // 满意度评价
}

// 专属协同视图TS类型定义
interface SpecialCoopIndicators {
  totalCount: number; // 专属协同总数
  completeRate: number; // 协同完成率
  averageCycle: number; // 平均协同周期
}
interface SpecialCoopRow {
  specialCoopId: string; // 专属协同ID
  coopScene: string; // 协同场景
  coopRule: string; // 协同规则
  responsibilityDivision: string; // 责任分工
  coopResult: string; // 协同结果
  completeTime: number | null; // 完成时间
}

// 协同效率评估TS类型定义
interface CoopEfficiencyIndicators {
  avgResponseDuration: number; // 平均响应时长
  avgDisposalDuration: number; // 平均处置时长
  avgEffectAchievementRate: number; // 平均成效达标率
}
interface CoopEfficiencyRow {
  coopEfficiencyId: string; // 协同效率评估ID
  coopType: string; // 协同类型
  responseDuration: number; // 响应时长(小时)
  disposalDuration: number; // 处置时长(小时)
  collaborationCost: number; // 协同成本
  effectAchievementRate: number; // 成效达标率
  problemRecurrenceRate: number; // 问题复发率
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
const activeRegionCooperationView = ref('卡片');
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

// 协同统计分析响应式数据
const highFreqCoopTop10List = ref<HighFreqCoopRow[]>([]);
const coopAnalysisIndicators = ref<CoopAnalysisIndicators>({
  totalCoopCount: 0,
  avgHandleCycle: 0,
  finishRate: 0,
  highPriorityRate: 0
});
const coopAnalysisTypeData = ref<ChartBarData>({ xAxis: [], series: [] });
const coopAnalysisAreaData = ref<ChartBarData>({ xAxis: [], series: [] });
const coopAnalysisIndustryRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '行业协同占比', data: [] }]
});
const coopAnalysisAreaRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '区域协同占比', data: [] }]
});
const coopAnalysisTrendData = ref<ChartLineData>({ xAxis: [], series: [] });
const coopAnalysisBaseFontScale = ref<number>(1);
const coopAnalysisActiveIndices = ref<number[]>([]);
const coopAnalysisChartRefreshKey = ref<number>(0);
const activeCoopAnalysisView = ref<string>('列表');
const coopAnalysisViewBtnList = ref<string[]>(['卡片', '柱状图', '饼图', '折线图', '列表']);

// 政企协同视图响应式数据
const govCoopList = ref<GovCoopRow[]>([]);
const govCoopIndicators = ref<GovCoopIndicators>({
  totalCount: 0,
  responseRate: 0,
  satisfactionRate: 0
});
const govCoopDeptData = ref<ChartBarData>({ xAxis: [], series: [] });
const govCoopEntTypeData = ref<ChartBarData>({ xAxis: [], series: [] });
const govCoopItemRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '协同事项占比', data: [] }]
});
const govCoopSatisfactionRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '满意度占比', data: [] }]
});
const govCoopBaseFontScale = ref<number>(1);
const govCoopActiveIndices = ref<number[]>([]);
const govCoopChartRefreshKey = ref<number>(0);
const activeGovCoopView = ref<string>('饼图');
const govCoopViewBtnList = ref<string[]>(['卡片', '柱状图', '饼图', '列表']);

// 专属协同视图响应式数据
const specialCoopList = ref<SpecialCoopRow[]>([]);
const specialCoopIndicators = ref<SpecialCoopIndicators>({
  totalCount: 0,
  completeRate: 0,
  averageCycle: 0
});
const specialCoopSceneData = ref<ChartBarData>({ xAxis: [], series: [] });
const specialCoopDeptData = ref<ChartBarData>({ xAxis: [], series: [] });
const specialCoopSceneRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '协同场景占比', data: [] }]
});
const specialCoopStatusRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '协同状态占比', data: [] }]
});
const specialCoopBaseFontScale = ref<number>(1);
const specialCoopActiveIndices = ref<number[]>([]);
const specialCoopChartRefreshKey = ref<number>(0);
const activeSpecialCoopView = ref<string>('卡片');
const specialCoopViewBtnList = ref<string[]>(['卡片', '柱状图', '饼图', '列表']);

// 协同效率评估响应式数据
const coopEfficiencyList = ref<CoopEfficiencyRow[]>([]);
const coopEfficiencyIndicators = ref<CoopEfficiencyIndicators>({
  avgResponseDuration: 0,
  avgDisposalDuration: 0,
  avgEffectAchievementRate: 0
});
const coopEfficiencyTypeData = ref<ChartBarData>({ xAxis: [], series: [] });
const coopEfficiencyAreaData = ref<ChartBarData>({ xAxis: [], series: [] });
const coopEfficiencyRecurrenceRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '问题复发率占比', data: [] }]
});
const coopEfficiencyTrendData = ref<ChartLineData>({ xAxis: [], series: [] });
const coopEfficiencyBaseFontScale = ref<number>(1);
const coopEfficiencyActiveIndices = ref<number[]>([]);
const coopEfficiencyChartRefreshKey = ref<number>(0);
const activeCoopEfficiencyView = ref<string>('折线图');
const coopEfficiencyViewBtnList = ref<string[]>(['卡片', '柱状图', '饼图', '折线图', '列表']);

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

// 协同统计分析接口请求方法
const getHighFreqCoopTop10Data = async () => {
  try {
    highFreqCoopTop10List.value = await fetchHighFrequencyCoopTop10();
  } catch {
    ElMessage.error('高频协同事项TOP10数据加载失败');
    highFreqCoopTop10List.value = [];
  }
};
const getCoopAnalysisIndicatorData = async () => {
  try {
    coopAnalysisIndicators.value = await fetchCoopCoreIndicators();
    nextTick(() => initCoopAnalysisNumberAnimations());
  } catch {
    coopAnalysisIndicators.value = { totalCoopCount: 0, avgHandleCycle: 0, finishRate: 0, highPriorityRate: 0 };
  }
};
const getCoopAnalysisTypeCountData = async () => {
  try {
    coopAnalysisTypeData.value = await fetchCoopTypeCount();
  } catch {
    coopAnalysisTypeData.value = { xAxis: [], series: [{ name: '协同事项数', data: [] }] };
  }
};
const getCoopAnalysisAreaCountData = async () => {
  try {
    coopAnalysisAreaData.value = await fetchCoopAreaCount();
  } catch {
    coopAnalysisAreaData.value = { xAxis: [], series: [{ name: '协同事项数', data: [] }] };
  }
};
const getCoopAnalysisIndustryRatioData = async () => {
  try {
    coopAnalysisIndustryRatioData.value = await fetchCoopIndustryRatio();
  } catch {
    coopAnalysisIndustryRatioData.value = { legend: [], series: [{ name: '行业协同占比', data: [] }] };
  }
};
const getCoopAnalysisAreaRatioData = async () => {
  try {
    coopAnalysisAreaRatioData.value = await fetchCoopAreaRatio();
  } catch {
    coopAnalysisAreaRatioData.value = { legend: [], series: [{ name: '区域协同占比', data: [] }] };
  }
};
const getCoopAnalysisTrendData = async () => {
  try {
    coopAnalysisTrendData.value = await fetchCoopTrendData();
  } catch {
    coopAnalysisTrendData.value = { xAxis: [], series: [{ name: '协同事件数', data: [] }] };
  }
};

// 协同效率评估接口请求方法
const getCoopEfficiencyListData = async () => {
  try {
    coopEfficiencyList.value = await fetchCoopEfficiencyList();
  } catch {
    ElMessage.error('协同效率评估数据加载失败');
    coopEfficiencyList.value = [];
  }
};
const getCoopEfficiencyIndicatorData = async () => {
  try {
    coopEfficiencyIndicators.value = await fetchCoopEfficiencyIndicators();
    nextTick(() => initCoopEfficiencyNumberAnimations());
  } catch {
    coopEfficiencyIndicators.value = { avgResponseDuration: 0, avgDisposalDuration: 0, avgEffectAchievementRate: 0 };
  }
};
const getCoopEfficiencyTypeCountData = async () => {
  try {
    coopEfficiencyTypeData.value = await fetchCoopEfficiencyTypeCount();
  } catch {
    coopEfficiencyTypeData.value = { xAxis: [], series: [{ name: '平均处置时长(小时)', data: [] }] };
  }
};
const getCoopEfficiencyAreaCountData = async () => {
  try {
    coopEfficiencyAreaData.value = await fetchCoopEfficiencyAreaCount();
  } catch {
    coopEfficiencyAreaData.value = { xAxis: [], series: [{ name: '平均响应时长(小时)', data: [] }] };
  }
};
const getCoopEfficiencyRecurrenceRatioData = async () => {
  try {
    coopEfficiencyRecurrenceRatioData.value = await fetchCoopEfficiencyRecurrenceRatio();
  } catch {
    coopEfficiencyRecurrenceRatioData.value = { legend: [], series: [{ name: '问题复发率占比', data: [] }] };
  }
};
const getCoopEfficiencyTrendData = async () => {
  try {
    coopEfficiencyTrendData.value = await fetchCoopEfficiencyTrendData();
  } catch {
    coopEfficiencyTrendData.value = { xAxis: [], series: [{ name: '综合效率评分', data: [] }] };
  }
};
const getCoopTypeTagType = (val: string) => {
  switch (val) {
    case 'high': return 'danger';
    case 'low': return 'success';
    case 'medium': return 'warning';
    default: return '';
  }
};
const getCoopTypeName = (val: string) => {
  switch (val) {
    case 'high': return '高优先级';
    case 'low': return '低优先级';
    case 'medium': return '中优先级';
    default: return '未知类型';
  }
};

// 政企协同视图接口请求方法
const getGovCoopListData = async () => {
  try {
    govCoopList.value = await fetchGovEnterpriseCoopList();
  } catch {
    ElMessage.error('政企协同数据加载失败');
    govCoopList.value = [];
  }
};
const getGovCoopIndicatorData = async () => {
  try {
    govCoopIndicators.value = await fetchGovEnterpriseCoopIndicators();
    nextTick(() => initGovCoopNumberAnimations());
  } catch {
    govCoopIndicators.value = { totalCount: 0, responseRate: 0, satisfactionRate: 0 };
  }
};
const getGovCoopDeptCountData = async () => {
  try {
    govCoopDeptData.value = await fetchGovDeptCoopCount();
  } catch {
    govCoopDeptData.value = { xAxis: [], series: [{ name: '协同事项数', data: [] }] };
  }
};
const getGovCoopEntTypeCountData = async () => {
  try {
    govCoopEntTypeData.value = await fetchEnterpriseTypeCoopCount();
  } catch {
    govCoopEntTypeData.value = { xAxis: [], series: [{ name: '协同事项数', data: [] }] };
  }
};
const getGovCoopItemRatioData = async () => {
  try {
    govCoopItemRatioData.value = await fetchCoopItemTypeRatio();
  } catch {
    govCoopItemRatioData.value = { legend: [], series: [{ name: '协同事项占比', data: [] }] };
  }
};
const getGovCoopSatisfactionRatioData = async () => {
  try {
    govCoopSatisfactionRatioData.value = await fetchSatisfactionLevelRatio();
  } catch {
    govCoopSatisfactionRatioData.value = { legend: [], series: [{ name: '满意度占比', data: [] }] };
  }
};
const getGovCoopSatisfactionTagType = (val: string) => {
  switch (val) {
    case '一般': return 'danger';
    case '基本满意': return 'warning';
    case '满意': return 'info';
    case '非常满意': return 'success';
    default: return '';
  }
};
const handleGovCoopRowClick = (row: any) => {
  govCoopSelectedRow.value = JSON.parse(JSON.stringify(row));
  govCoopDetailDialogVisible.value = true;
};

// 专属协同视图接口请求方法
const getSpecialCoopListData = async () => {
  try {
    specialCoopList.value = await fetchSpecialCoopList();
  } catch {
    ElMessage.error('专属协同数据加载失败');
    specialCoopList.value = [];
  }
};
const getSpecialCoopIndicatorData = async () => {
  try {
    specialCoopIndicators.value = await fetchSpecialCoopIndicators();
    nextTick(() => initSpecialCoopNumberAnimations());
  } catch {
    specialCoopIndicators.value = { totalCount: 0, completeRate: 0, averageCycle: 0 };
  }
};
const getSpecialCoopSceneCountData = async () => {
  try {
    specialCoopSceneData.value = await fetchSpecialCoopSceneCount();
  } catch {
    specialCoopSceneData.value = { xAxis: [], series: [{ name: '协同完成数', data: [] }] };
  }
};
const getSpecialCoopDeptCountData = async () => {
  try {
    specialCoopDeptData.value = await fetchSpecialCoopDeptCount();
  } catch {
    specialCoopDeptData.value = { xAxis: [], series: [{ name: '协同事项数', data: [] }] };
  }
};
const getSpecialCoopSceneRatioData = async () => {
  try {
    specialCoopSceneRatioData.value = await fetchSpecialCoopSceneRatio();
  } catch {
    specialCoopSceneRatioData.value = { legend: [], series: [{ name: '协同场景占比', data: [] }] };
  }
};
const getSpecialCoopStatusRatioData = async () => {
  try {
    specialCoopStatusRatioData.value = await fetchSpecialCoopStatusRatio();
  } catch {
    specialCoopStatusRatioData.value = { legend: [], series: [{ name: '协同状态占比', data: [] }] };
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

// 协同统计分析视图切换方法
const changeCoopAnalysisView = (viewName: string) => {
  activeCoopAnalysisView.value = viewName;
  if (viewName === '卡片') nextTick(() => initCoopAnalysisNumberAnimations());
  if (viewName === '柱状图' || viewName === '饼图' || viewName === '折线图') {
    nextTick(() => {
      coopAnalysisChartRefreshKey.value += 1;
    });
  }
};

// 协同效率评估视图切换方法
const changeCoopEfficiencyView = (viewName: string) => {
  activeCoopEfficiencyView.value = viewName;
  if (viewName === '卡片') nextTick(() => initCoopEfficiencyNumberAnimations());
  if (viewName === '柱状图' || viewName === '饼图' || viewName === '折线图') {
    nextTick(() => {
      coopEfficiencyChartRefreshKey.value += 1;
    });
  }
};

// 政企协同视图视图切换方法
const changeGovCoopView = (viewName: string) => {
  activeGovCoopView.value = viewName;
  if (viewName === '卡片') nextTick(() => initGovCoopNumberAnimations());
  if (viewName === '柱状图' || viewName === '饼图') {
    nextTick(() => {
      govCoopChartRefreshKey.value += 1;
    });
  }
};

// 专属协同视图视图切换方法
const changeSpecialCoopView = (viewName: string) => {
  activeSpecialCoopView.value = viewName;
  if (viewName === '卡片') nextTick(() => initSpecialCoopNumberAnimations());
  if (viewName === '柱状图' || viewName === '饼图') {
    nextTick(() => {
      specialCoopChartRefreshKey.value += 1;
    });
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

const getCooperationStatusType = (status: string) => {
  switch(status) {
    case '待响应': return 'warning';
    case '响应中': return 'info';
    case '反馈中': return 'primary';
    case '已完成': return 'success';
    default: return 'info';
  }
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

const getEffectLevelType = (level: string) => {
  switch(level) {
    case '高成效': return 'success';
    case '中成效': return 'warning';
    case '低成效': return 'danger';
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
    getCoopAnalysisIndicatorData(),
    getCoopAnalysisTypeCountData(),
    getCoopAnalysisAreaCountData(),
    getCoopAnalysisIndustryRatioData(),
    getCoopAnalysisAreaRatioData(),
    getCoopAnalysisTrendData(),
    getHighFreqCoopTop10Data(),
    getGovCoopListData(),
    getGovCoopIndicatorData(),
    getGovCoopDeptCountData(),
    getGovCoopEntTypeCountData(),
    getGovCoopItemRatioData(),
    getGovCoopSatisfactionRatioData(),
    getSpecialCoopListData(),
    getSpecialCoopIndicatorData(),
    getSpecialCoopSceneCountData(),
    getSpecialCoopDeptCountData(),
    getSpecialCoopSceneRatioData(),
    getSpecialCoopStatusRatioData(),
    getCoopEfficiencyListData(),
    getCoopEfficiencyIndicatorData(),
    getCoopEfficiencyTypeCountData(),
    getCoopEfficiencyAreaCountData(),
    getCoopEfficiencyRecurrenceRatioData(),
    getCoopEfficiencyTrendData(),
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
  ]);
  setTimeout(() => {
    regionCooperationChartRefreshKey.value++;
    coopAnalysisChartRefreshKey.value += 1;
    govCoopChartRefreshKey.value += 1;
    specialCoopChartRefreshKey.value += 1;
    coopEfficiencyChartRefreshKey.value += 1;
    departmentCooperationChartRefreshKey.value++;
    industryCooperationChartRefreshKey.value++;
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
                  <el-icon color="#409eff" size="16" @click="refreshRegionCooperationData"><Refresh /></el-icon>
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
                  <ChartLine1
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
                  <el-icon color="#409eff" size="16" @click="refreshDepartmentCooperationData"><Refresh /></el-icon>
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
                  <el-icon color="#409eff" size="16" @click="refreshIndustryCooperationData"><Refresh /></el-icon>
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
            <el-tab-pane label="层级协同" name="tab4" />
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel top-right" ref="topRightPanel">
          <div class="header-actions">
            <div class="actions-left"><p>协同统计分析</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton
                  v-for="item in coopAnalysisViewBtnList"
                  :key="item"
                  :type="activeCoopAnalysisView === item ? 'primary' : ''"
                  plain
                  @click="changeCoopAnalysisView(item)"
                  class="view-btn"
                >{{ item }}</ElButton>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('topRightPanel')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div v-if="activeCoopAnalysisView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1" style="cursor: default">
                <div class="indicator-title">协同事项总数</div>
                <div class="indicator-value">
                  <span :data-value="coopAnalysisIndicators.totalCoopCount" class="coop-analysis-number-animate">
                    {{ coopAnalysisIndicators.totalCoopCount }}
                  </span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
              <div class="indicator-card1 card2" style="cursor: default">
                <div class="indicator-title">平均处理周期</div>
                <div class="indicator-value">
                  <span :data-value="coopAnalysisIndicators.avgHandleCycle" class="coop-analysis-number-animate">
                    {{ coopAnalysisIndicators.avgHandleCycle }}
                  </span>
                </div>
                <div class="indicator-unit">天</div>
              </div>
              <div class="indicator-card1 card3" style="cursor: default">
                <div class="indicator-title">协同完成率</div>
                <div class="indicator-value">
                  <span :data-value="coopAnalysisIndicators.finishRate * 100" class="coop-analysis-number-animate">
                    {{ (coopAnalysisIndicators.finishRate * 100).toFixed(1) }}
                  </span>
                </div>
                <div class="indicator-unit">%</div>
              </div>
              <div class="indicator-card1 card4" style="cursor: default">
                <div class="indicator-title">高优协同占比</div>
                <div class="indicator-value">
                  <span :data-value="coopAnalysisIndicators.highPriorityRate * 100" class="coop-analysis-number-animate">
                    {{ (coopAnalysisIndicators.highPriorityRate * 100).toFixed(1) }}
                  </span>
                </div>
                <div class="indicator-unit">%</div>
              </div>
            </div>
          </div>
          <div v-if="activeCoopAnalysisView === '柱状图'" class="view-content" style="box-sizing: border-box;width: 100%;height: 100%;padding: 0.3vw 0.2vw 0.8vw 0.2vw;">
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;vertical-align: top;" :key="coopAnalysisChartRefreshKey">
              <VerticalBar1
                :x-axis="coopAnalysisTypeData.xAxis"
                :series="coopAnalysisTypeData.series"
                unit="件"
                title="类型协同数对比"
                :base-font-scale="coopAnalysisBaseFontScale"
                :active-indices="coopAnalysisActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;padding-left: 0.3vw;vertical-align: top;border-left: 0.3vh solid #02a6b5;" :key="coopAnalysisChartRefreshKey">
              <VerticalBar2
                :x-axis="coopAnalysisAreaData.xAxis"
                :series="coopAnalysisAreaData.series"
                unit="件"
                title="区域协同数对比"
                :base-font-scale="coopAnalysisBaseFontScale"
                :active-indices="coopAnalysisActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
          </div>
          <div v-if="activeCoopAnalysisView === '饼图'" class="view-content" style="box-sizing: border-box;width: 100%;height: 100%;padding: 0.3vw 0.2vw 0.8vw 0.2vw;">
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;vertical-align: top;" :key="coopAnalysisChartRefreshKey">
              <ChartPie2
                :data="coopAnalysisIndustryRatioData"
                title="行业协同占比"
                :base-font-scale="coopAnalysisBaseFontScale"
                :active-indices="coopAnalysisActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;padding-left: 0.3vw;vertical-align: top;border-left: 0.3vh solid #02a6b5;" :key="coopAnalysisChartRefreshKey">
              <ChartPie4
                :data="coopAnalysisAreaRatioData"
                title="区域协同占比"
                :base-font-scale="coopAnalysisBaseFontScale"
                :active-indices="coopAnalysisActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
          </div>
          <div v-if="activeCoopAnalysisView === '折线图'" class="view-content" style="box-sizing: border-box;width:100%;height:100%;padding:0.3vw;" :key="coopAnalysisChartRefreshKey">
            <ChartLine1
              :data="coopAnalysisTrendData"
              title="协同事件近周期趋势"
              y-axis-name="协同事件数"
              :base-font-scale="coopAnalysisBaseFontScale"
              style="width:100%;height:100%;"
            />
          </div>
          <div v-if="activeCoopAnalysisView === '列表'" class="view-content">
            <div class="rank-box">
              <ElTable
                :data="highFreqCoopTop10List"
                border
                size="small"
                style="width: 100%; height: 100%"
                row-class-name="rank-row"
              >
                <ElTableColumn prop="rank" label="排名" width="80" align="center">
                  <template #default="scope"><div class="rank-tag">{{ scope.row.rank }}</div></template>
                </ElTableColumn>
                <ElTableColumn prop="coopStatId" label="协同统计ID" />
                <ElTableColumn prop="coopType" label="协同类型">
                  <template #default="scope"><ElTag :type="getCoopTypeTagType(scope.row.coopType)">{{ getCoopTypeName(scope.row.coopType) }}</ElTag></template>
                </ElTableColumn>
                <ElTableColumn prop="coopCount" label="协同事件数量">
                  <template #default="scope">{{ formatNumber(scope.row.coopCount) }}</template>
                </ElTableColumn>
                <ElTableColumn prop="top10CoopItem" label="协同事项" min-width="150" />
              </ElTable>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="panel bottom-left" ref="bottomLeftPanel">
          <div class="header-actions">
            <div class="actions-left"><p>政企协同视图</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton
                  v-for="item in govCoopViewBtnList"
                  :key="item"
                  :type="activeGovCoopView === item ? 'primary' : ''"
                  plain
                  @click="changeGovCoopView(item)"
                  class="view-btn"
                >{{ item }}</ElButton>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('bottomLeftPanel')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div v-if="activeGovCoopView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1" style="cursor: default">
                <div class="indicator-title">政企协同总数</div>
                <div class="indicator-value">
                  <span :data-value="govCoopIndicators.totalCount" class="gov-coop-number-animate">
                    {{ govCoopIndicators.totalCount }}
                  </span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
              <div class="indicator-card1 card2" style="cursor: default">
                <div class="indicator-title">政企响应率</div>
                <div class="indicator-value">
                  <span :data-value="govCoopIndicators.responseRate * 100" class="gov-coop-number-animate">
                    {{ (govCoopIndicators.responseRate * 100).toFixed(1) }}
                  </span>
                </div>
                <div class="indicator-unit">%</div>
              </div>
              <div class="indicator-card1 card3" style="cursor: default">
                <div class="indicator-title">政企满意度</div>
                <div class="indicator-value">
                  <span :data-value="govCoopIndicators.satisfactionRate" class="gov-coop-number-animate">
                    {{ govCoopIndicators.satisfactionRate.toFixed(1) }}
                  </span>
                </div>
                <div class="indicator-unit">%</div>
              </div>
            </div>
          </div>
          <div v-if="activeGovCoopView === '柱状图'" class="view-content" style="box-sizing: border-box;width: 100%;height: 100%;padding: 0.3vw 0.2vw 0.8vw 0.2vw;">
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;vertical-align: top;" :key="govCoopChartRefreshKey">
              <VerticalBar2
                :x-axis="govCoopDeptData.xAxis"
                :series="govCoopDeptData.series"
                unit="件"
                title="政府部门协同数对比"
                :base-font-scale="govCoopBaseFontScale"
                :active-indices="govCoopActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;padding-left: 0.3vw;vertical-align: top;border-left: 0.3vh solid #02a6b5;" :key="govCoopChartRefreshKey">
              <VerticalBar1
                :x-axis="govCoopEntTypeData.xAxis"
                :series="govCoopEntTypeData.series"
                unit="件"
                title="企业类型协同数对比"
                :base-font-scale="govCoopBaseFontScale"
                :active-indices="govCoopActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
          </div>
          <div v-if="activeGovCoopView === '饼图'" class="view-content" style="box-sizing: border-box;width: 100%;height: 100%;padding: 0.3vw 0.2vw 0.8vw 0.2vw;">
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;vertical-align: top;" :key="govCoopChartRefreshKey">
              <ChartPie1
                :data="govCoopItemRatioData"
                title="协同事项类型占比"
                :base-font-scale="govCoopBaseFontScale"
                :active-indices="govCoopActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;padding-left: 0.3vw;vertical-align: top;border-left: 0.3vh solid #02a6b5;" :key="govCoopChartRefreshKey">
              <ChartPie2
                :data="govCoopSatisfactionRatioData"
                title="满意度评价占比"
                :base-font-scale="govCoopBaseFontScale"
                :active-indices="govCoopActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
          </div>
          <div v-if="activeGovCoopView === '列表'" class="view-content">
            <div class="table-box1">
              <ElTable
                class="table1"
                :data="govCoopList"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
                highlight-current-row
                @row-click="handleGovCoopRowClick"
              >
                <ElTableColumn prop="govEnterpriseCoopId" label="政企协同ID" align="center" />
                <ElTableColumn prop="coopItem" label="协同事项" align="center" min-width="120px" />
                <ElTableColumn prop="govDepartment" label="政府部门" align="center" min-width="100px" />
                <ElTableColumn prop="merchantId" label="企业ID" align="center" />
                <ElTableColumn prop="progressFeedback" label="进度反馈" align="center" min-width="180px" />
                <ElTableColumn label="满意度评价" align="center" min-width="100px">
                  <template #default="scope"><ElTag :type="getGovCoopSatisfactionTagType(scope.row.satisfactionEvaluation)">{{ scope.row.satisfactionEvaluation }}</ElTag></template>
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
                  v-for="item in specialCoopViewBtnList"
                  :key="item"
                  :type="activeSpecialCoopView === item ? 'primary' : ''"
                  plain
                  @click="changeSpecialCoopView(item)"
                  class="view-btn"
                >{{ item }}</ElButton>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('bottomMiddlePanel')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div v-if="activeSpecialCoopView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1" style="cursor: default">
                <div class="indicator-title">专属协同总数</div>
                <div class="indicator-value">
                  <span :data-value="specialCoopIndicators.totalCount" class="special-coop-number-animate">
                    {{ specialCoopIndicators.totalCount }}
                  </span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
              <div class="indicator-card1 card2" style="cursor: default">
                <div class="indicator-title">协同完成率</div>
                <div class="indicator-value">
                  <span :data-value="specialCoopIndicators.completeRate * 100" class="special-coop-number-animate">
                    {{ (specialCoopIndicators.completeRate * 100).toFixed(1) }}
                  </span>
                </div>
                <div class="indicator-unit">%</div>
              </div>
              <div class="indicator-card1 card3" style="cursor: default">
                <div class="indicator-title">平均协同周期</div>
                <div class="indicator-value">
                  <span :data-value="specialCoopIndicators.averageCycle" class="special-coop-number-animate">
                    {{ specialCoopIndicators.averageCycle }}
                  </span>
                </div>
                <div class="indicator-unit">天</div>
              </div>
            </div>
          </div>
          <div v-if="activeSpecialCoopView === '柱状图'" class="view-content" style="box-sizing: border-box;width: 100%;height: 100%;padding: 0.3vw 0.2vw 0.8vw 0.2vw;">
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;vertical-align: top;" :key="specialCoopChartRefreshKey">
              <VerticalBar1
                :x-axis="specialCoopSceneData.xAxis"
                :series="specialCoopSceneData.series"
                unit="件"
                title="场景协同数对比"
                :base-font-scale="specialCoopBaseFontScale"
                :active-indices="specialCoopActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;padding-left: 0.3vw;vertical-align: top;border-left: 0.3vh solid #02a6b5;" :key="specialCoopChartRefreshKey">
              <VerticalBar2
                :x-axis="specialCoopDeptData.xAxis"
                :series="specialCoopDeptData.series"
                unit="件"
                title="责任单位协同数对比"
                :base-font-scale="specialCoopBaseFontScale"
                :active-indices="specialCoopActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
          </div>
          <div v-if="activeSpecialCoopView === '饼图'" class="view-content" style="box-sizing: border-box;width: 100%;height: 100%;padding: 0.3vw 0.2vw 0.8vw 0.2vw;">
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;vertical-align: top;" :key="specialCoopChartRefreshKey">
              <ChartPie1
                :data="specialCoopSceneRatioData"
                title="协同场景占比"
                :base-font-scale="specialCoopBaseFontScale"
                :active-indices="specialCoopActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;padding-left: 0.3vw;vertical-align: top;border-left: 0.3vh solid #02a6b5;" :key="specialCoopChartRefreshKey">
              <ChartPie2
                :data="specialCoopStatusRatioData"
                title="协同状态占比"
                :base-font-scale="specialCoopBaseFontScale"
                :active-indices="specialCoopActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
          </div>
          <div v-if="activeSpecialCoopView === '列表'" class="view-content">
            <div class="table-box1">
              <ElTable
                class="table1"
                :data="specialCoopList"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
                highlight-current-row
              >
                <ElTableColumn prop="specialCoopId" label="专属协同ID" align="center" />
                <ElTableColumn prop="coopScene" label="协同场景" align="center" min-width="160px" />
                <ElTableColumn prop="coopRule" label="协同规则" align="center" min-width="180px" />
                <ElTableColumn prop="responsibilityDivision" label="责任分工" align="center" min-width="200px" />
                <ElTableColumn prop="coopResult" label="协同结果" align="center" min-width="180px" />
                <ElTableColumn prop="completeTime" label="完成时间" align="center" min-width="120px">
                  <template #default="scope">{{ formatSpecialCoopTimeStamp(scope.row.completeTime) }}</template>
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
                  v-for="item in coopEfficiencyViewBtnList"
                  :key="item"
                  :type="activeCoopEfficiencyView === item ? 'primary' : ''"
                  plain
                  @click="changeCoopEfficiencyView(item)"
                  class="view-btn"
                >{{ item }}</ElButton>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('bottomRightPanel')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div v-if="activeCoopEfficiencyView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1" style="cursor: default">
                <div class="indicator-title">平均响应时长</div>
                <div class="indicator-value">
                  <span :data-value="coopEfficiencyIndicators.avgResponseDuration" class="coop-efficiency-number-animate">
                    {{ coopEfficiencyIndicators.avgResponseDuration }}
                  </span>
                </div>
                <div class="indicator-unit">小时</div>
              </div>
              <div class="indicator-card1 card2" style="cursor: default">
                <div class="indicator-title">平均处置时长</div>
                <div class="indicator-value">
                  <span :data-value="coopEfficiencyIndicators.avgDisposalDuration" class="coop-efficiency-number-animate">
                    {{ coopEfficiencyIndicators.avgDisposalDuration }}
                  </span>
                </div>
                <div class="indicator-unit">小时</div>
              </div>
              <div class="indicator-card1 card3" style="cursor: default">
                <div class="indicator-title">平均成效达标率</div>
                <div class="indicator-value">
                  <span :data-value="coopEfficiencyIndicators.avgEffectAchievementRate * 100" class="coop-efficiency-number-animate">
                    {{ (coopEfficiencyIndicators.avgEffectAchievementRate * 100).toFixed(1) }}
                  </span>
                </div>
                <div class="indicator-unit">%</div>
              </div>
            </div>
          </div>
          <div v-if="activeCoopEfficiencyView === '柱状图'" class="view-content" style="box-sizing: border-box;width: 100%;height: 100%;padding: 0.3vw 0.2vw 0.8vw 0.2vw;">
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;vertical-align: top;" :key="coopEfficiencyChartRefreshKey">
              <VerticalBar1
                :x-axis="coopEfficiencyTypeData.xAxis"
                :series="coopEfficiencyTypeData.series"
                unit="小时"
                title="类型协同效率对比"
                :base-font-scale="coopEfficiencyBaseFontScale"
                :active-indices="coopEfficiencyActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
            <div style="box-sizing: border-box;display: inline-block;width: 49%;height: 100%;padding-left: 0.3vw;vertical-align: top;border-left: 0.3vh solid #02a6b5;" :key="coopEfficiencyChartRefreshKey">
              <VerticalBar2
                :x-axis="coopEfficiencyAreaData.xAxis"
                :series="coopEfficiencyAreaData.series"
                unit="小时"
                title="区域协同效率对比"
                :base-font-scale="coopEfficiencyBaseFontScale"
                :active-indices="coopEfficiencyActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
          </div>
          <div v-if="activeCoopEfficiencyView === '饼图'" class="view-content" style="box-sizing: border-box;width: 100%;height: 100%;padding: 0.3vw 0.2vw 0.8vw 0.2vw;">
            <div style="box-sizing: border-box;display: inline-block;width: 100%;height: 100%;vertical-align: top;" :key="coopEfficiencyChartRefreshKey">
              <ChartPie2
                :data="coopEfficiencyRecurrenceRatioData"
                title="问题复发率占比"
                :base-font-scale="coopEfficiencyBaseFontScale"
                :active-indices="coopEfficiencyActiveIndices"
                style="width:100%;height:100%;"
              />
            </div>
          </div>
          <div v-if="activeCoopEfficiencyView === '折线图'" class="view-content" style="box-sizing: border-box;width:100%;height:100%;padding:0.3vw;" :key="coopEfficiencyChartRefreshKey">
            <ChartLine1
              :data="coopEfficiencyTrendData"
              title="协同效率趋势"
              y-axis-name="综合效率评分"
              :base-font-scale="coopEfficiencyBaseFontScale"
              style="width:100%;height:100%;"
            />
          </div>
          <div v-if="activeCoopEfficiencyView === '列表'" class="view-content">
            <div class="table-box1">
              <ElTable
                class="table1"
                :data="coopEfficiencyList"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
                highlight-current-row
              >
                <ElTableColumn prop="coopEfficiencyId" label="协同效率评估ID" align="center" />
                <ElTableColumn prop="coopType" label="协同类型" align="center">
                  <template #default="scope"><ElTag :type="getCoopTypeTagType(scope.row.coopType)">{{ getCoopTypeName(scope.row.coopType) }}</ElTag></template>
                </ElTableColumn>
                <ElTableColumn prop="responseDuration" label="响应时长(小时)" align="center" min-width="100px">
                  <template #default="scope">{{ scope.row.responseDuration.toFixed(1) }}</template>
                </ElTableColumn>
                <ElTableColumn prop="disposalDuration" label="处置时长(小时)" align="center" min-width="100px">
                  <template #default="scope">{{ scope.row.disposalDuration.toFixed(1) }}</template>
                </ElTableColumn>
                <ElTableColumn prop="collaborationCost" label="协同成本" align="center" min-width="100px">
                  <template #default="scope">{{ formatNumber(scope.row.collaborationCost) }}</template>
                </ElTableColumn>
                <ElTableColumn prop="effectAchievementRate" label="成效达标率" align="center" min-width="100px">
                  <template #default="scope">{{ (scope.row.effectAchievementRate * 100).toFixed(1) }}%</template>
                </ElTableColumn>
                <ElTableColumn prop="problemRecurrenceRate" label="问题复发率" align="center" min-width="100px">
                  <template #default="scope">{{ (scope.row.problemRecurrenceRate * 100).toFixed(1) }}%</template>
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
