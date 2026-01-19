<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, reactive, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { Filter, FullScreen, UploadFilled } from '@element-plus/icons-vue';
import { ElButton, ElForm, ElFormItem, ElMessage, ElMessageBox, ElTable, ElTableColumn, ElTag, ElDrawer, ElUpload, ElImage, ElDescriptions, ElDescriptionsItem } from 'element-plus';
import screenFull from 'screenfull';
import FlightGanttChart1 from "#/views/genchuan/industry/parkingmgmt/overview/components/FlightGanttChart1.vue";
import ChartPie1 from '#/views/genchuan/industry/templatesstatchart/ChartPie1.vue';
import ChartPie2 from '#/views/genchuan/industry/templatesstatchart/ChartPie2.vue';
import VerticalBar1 from '#/views/genchuan/industry/templatesstatchart/VerticalBar1.vue';
import VerticalBar2 from '#/views/genchuan/industry/templatesstatchart/VerticalBar2.vue';

import {
  fetchParkFaultList,fetchParkFaultIndicators,fetchParkFaultTypeRatio,fetchParkFaultEquipmentRatio,fetchParkFaultAreaCount,fetchParkFaultEquipmentCount,fetchParkFaultDetail,fetchParkFaultTrackInfo,submitParkFaultDispatch,
  fetchParkAlarmList,fetchParkAlarmIndicators,fetchParkAlarmLevelRatio,fetchParkAlarmTypeRatio,fetchParkAlarmStatusRatio,fetchParkAlarmAreaCount,fetchParkAlarmTypeCount,fetchParkAlarmDetail,submitParkAlarmDisposal,fetchParkAlarmTrackInfo,
  fetchParkDisposeTrackList,fetchParkDisposeTrackIndicators,fetchParkDisposeUserEfficiency,fetchParkDisposeTrackDetail,submitParkDisposeCooperate,submitParkDisposeUrge,
  fetchParkHiddenDangerList,fetchParkHiddenDangerIndicators,fetchParkHiddenDangerLevelRatio,fetchParkHiddenDangerTypeRatio,fetchParkHiddenDangerAreaCount,fetchParkHiddenDangerTypeCount,fetchParkHiddenDangerDetail,submitParkHiddenDangerRectify,submitParkHiddenDangerAccept,
  fetchParkAbnormalList, fetchParkAbnormalIndicators, fetchParkAbnormalTrend, fetchParkAbnormalAreaCount, fetchParkAbnormalTypeCount, fetchParkAbnormalDetail, submitParkAbnormalDispose, submitParkAbnormalRelieve,
  fetchParkComplianceWarningList,fetchParkComplianceWarningIndicators,fetchParkComplianceWarningViolationRatio,fetchParkComplianceWarningSubjectRatio,fetchParkComplianceWarningAreaCount,fetchParkComplianceWarningTypeCount,fetchParkComplianceWarningDetail,submitParkComplianceWarningRectify,submitParkComplianceWarningInspect
} from '#/api/genchuan/industry/parkingmgmt/overview/RiskWarning.ts';

const router = useRouter();
const instance = getCurrentInstance();
const currentFullscreenPanel = ref<HTMLElement | null>(null);

// TS类型定义
interface ParkAlarmDisposalLog { time: number | string; content: string; }
interface ParkAlarmRow {
  parkAlarmAlarmId: string; sysAlarmLevelName: string; sysAlarmTypeName: string; parkAlarmAlarmTime: number | string; tbAssetExtendName: string; tbAssetExtendAddress: string;
  sysDisposalStatusName: string; sysResponsibleUnitName: string; parkAlarmReceiveTime: number | string; parkAlarmDisposalDuration: number; parkMaintainWorkorderWorkorderNo: string;
  parkAlarmEvidence: string[]; parkAlarmDisposalLog: ParkAlarmDisposalLog[]; parkAlarmProgress: string;
}
interface ParkAlarmIndicators { totalCount: number; urgentCount: number; highCount: number; midCount: number; lowCount: number; undisposedCount: number; }

interface ParkHiddenDangerRectifyLog { time: number | string; content: string; }
interface ParkHiddenDangerRow {
  parkHiddenDangerHiddenDangerId: string; sysRiskLevelName: string; sysHiddenDangerTypeName: string; tbAssetExtendAddress: string; parkHiddenDangerInfluenceRange: string;
  sysRectificationProgressName: string; parkHiddenDangerRectificationDeadline: number | string; tbAssetExtendName: string; parkHiddenDangerDiscoverTime: number | string;
  sysUserUserName: string; parkHiddenDangerAcceptStatus: string; parkHiddenDangerEvidence: string[]; parkHiddenDangerRectifyRequire: string; parkHiddenDangerRectifyLog: ParkHiddenDangerRectifyLog[];
}
interface ParkHiddenDangerIndicators { totalCount: number; majorCount: number; importantCount: number; normalCount: number; lowCount: number; overdueUnRectifyCount: number; }
interface RectifyForm { rectifyScheme: string; rectifyFileList: any[]; }
interface AcceptForm { acceptResult: string; acceptOpinion: string; }
interface SubmitRectifyParams { parkHiddenDangerHiddenDangerId: string; rectifyScheme: string; rectifyEvidence: string[]; }
interface SubmitAcceptParams { parkHiddenDangerHiddenDangerId: string; acceptResult: string; acceptOpinion?: string; }

interface DisposeTrackLog { time: number | string; content: string; }
interface DisposeTrackRow {
  parkAlarmAlarmId: string; sysAlarmTypeName: string; sysMaintainUserUserName: string; parkMaintainWorkorderStartTime: number | string; sysDisposalProgressName: string;
  parkMaintainWorkorderWorkorderNo: string; parkMaintainWorkorderExpectedFinishTime: number | string; parkMaintainWorkorderLatestDynamic: string; parkMaintainWorkorderDispatchDuration: number;
  parkMaintainWorkorderDealTime: number; parkAlarmEvidence: string[]; disposeAllLog: DisposeTrackLog[];
}
interface DisposeTrackIndicators { avgDisposeDuration: number; overtimeCount: number; finishCount: number; disposingCount: number; }
interface SubmitCooperateParams { parkAlarmAlarmId: string; cooperateUser: string[]; cooperateReason: string; }
interface SubmitUrgeParams { parkAlarmAlarmId: string; parkMaintainWorkorderWorkorderNo: string; }
interface SubmitDisposeParams { parkAlarmAlarmId: string; disposalMeasure: string; disposalEvidence: string[]; }

interface ParkAbnormalDisposeLog { time: number | string; content: string; }
interface ParkAbnormalRow {
  parkAbnormalAbnormalId: string; sysAbnormalTypeName: string; parkAbnormalAbnormalReason: string; parkAbnormalAbnormalTime: number | string; tbAssetExtendAddress: string;
  sysAssociatedObjectTypeName: string; parkAbnormalRelieveStatus: string; tbAssetExtendName: string; sysUserUserName: string; parkAbnormalRelieveTime: number | string;
  parkAbnormalEvidence: string[]; parkAbnormalDisposeLog: ParkAbnormalDisposeLog[]; parkAbnormalDuration?: number;
}
interface ParkAbnormalIndicators { totalCount: number; unRelieveCount: number; deviceAbnormalCount: number; dataAbnormalCount: number; commAbnormalCount: number; }
interface AbnormalDisposeForm { disposeMeasure: string; disposeFileList: any[]; }
interface SubmitAbnormalDisposeParams { parkAbnormalAbnormalId: string; disposeMeasure: string; disposeEvidence: string[]; }
interface SubmitAbnormalRelieveParams { parkAbnormalAbnormalId: string; }

interface ChartRatioData { legend: string[]; series: { name: string; data: number[] }[]; }
interface ChartBarData { xAxis: string[]; series: { name: string; data: number[] }[]; }

// ========== 故障预警 TS类型定义 ==========
interface ParkFaultRepairLog { time: number | string; content: string; }
interface ParkFaultParts { name: string; count: number; unit: string; }
interface ParkFaultRow {
  parkFaultFaultId: string; sysFaultTypeName: string; sysEquipmentTypeName: string; tbDeviceExtendInstallPosition: string; parkFaultFaultTime: number | string;
  sysMaintenanceProgressName: string; tbDeviceExtendDeviceCode: string; parkFaultFaultLevel: string; sysMaintainUserUserName: string;
  parkMaintainWorkorderExpectedFinishTime: number | string; parkFaultEvidence: string[]; parkFaultRepairLog: ParkFaultRepairLog[]; parkFaultPartsList: ParkFaultParts[];
  parkMaintainWorkorderWorkorderNo: string; parkFaultDuration?: number;
}
interface ParkFaultIndicators { totalCount: number; unRepairCount: number; hardwareFaultCount: number; softwareFaultCount: number; commFaultCount: number; urgentCount: number; seriousCount: number; }
interface SubmitDispatchParams { parkFaultFaultId: string; maintainUser: string; maintainRequire?: string; }

// ========== 合规预警 TS类型定义 ==========
interface ParkComplianceWarningRectifyLog { time: number | string; content: string; }
interface ParkComplianceWarningRow {
  parkComplianceWarningWarningId: string; sysViolationTypeName: string; parkComplianceWarningViolationDetail: string; parkComplianceWarningWarningTime: number | string; tbAssetExtendAddress: string;
  sysRectificationStatusName: string; parkComplianceWarningComplianceStandard: string; sysResponsibleSubjectTypeName: string; parkComplianceWarningRectificationDeadline: number | string;
  parkComplianceWarningInspectionResult: string; parkComplianceWarningEvidence: string[]; parkComplianceWarningRectifyLog: ParkComplianceWarningRectifyLog[];
}
interface ParkComplianceWarningIndicators { totalCount: number; unRectifyCount: number; passRate: number; occupyViolationCount:number; fireViolationCount:number; chargeViolationCount:number; safeViolationCount:number; }
interface ComplianceRectifyForm { rectifyScheme: string; rectifyFileList: any[]; }
interface ComplianceInspectForm { inspectionResult: string; inspectionOpinion: string; }
interface SubmitComplianceRectifyParams { parkComplianceWarningWarningId: string; rectifyScheme: string; rectifyEvidence: string[]; }
interface SubmitComplianceInspectParams { parkComplianceWarningWarningId: string; inspectionResult: string; inspectionOpinion?: string; }

// 响应式数据
const parkAlarmList = ref<ParkAlarmRow[]>([]);
const parkAlarmIndicators = ref<ParkAlarmIndicators>({ totalCount:0, urgentCount:0, highCount:0, midCount:0, lowCount:0, undisposedCount:0 });
const parkAlarmLevelRatioData = ref<ChartRatioData>({ legend: [], series: [] });
const parkAlarmTypeRatioData = ref<ChartRatioData>({ legend: [], series: [] });
const parkAlarmStatusRatioData = ref<ChartRatioData>({ legend: [], series: [] });
const parkAlarmAreaData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkAlarmTypeData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkAlarmChartRefreshKey = ref(0);
const activeParkAlarmView = ref('卡片');
const parkAlarmViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);
const parkAlarmDrawerVisible = ref(false);
const parkAlarmDrawerType = ref('');
const parkAlarmSelectedRow = ref<ParkAlarmRow>({ parkAlarmAlarmId: '', sysAlarmLevelName: '', sysAlarmTypeName: '', parkAlarmAlarmTime:0, tbAssetExtendName:'', tbAssetExtendAddress:'', sysDisposalStatusName:'', sysResponsibleUnitName:'', parkAlarmReceiveTime:0, parkAlarmDisposalDuration:0, parkMaintainWorkorderWorkorderNo:'', parkAlarmEvidence:[], parkAlarmDisposalLog:[], parkAlarmProgress:'' });
const disposeFormRef = ref<any>(null);
const disposeForm = reactive({ disposalMeasure: '', disposeFileList: [] });
const disposeRules = reactive({ disposalMeasure: [{ required: true, message: '处置措施为必填项', trigger: ['blur','change'], whitespace: true },{ max:500, message:'处置措施最多输入500字', trigger:'blur'}] });

const parkHiddenDangerList = ref<ParkHiddenDangerRow[]>([]);
const parkHiddenDangerIndicators = ref<ParkHiddenDangerIndicators>({ totalCount:0, majorCount:0, importantCount:0, normalCount:0, lowCount:0, overdueUnRectifyCount:0 });
const parkHiddenDangerLevelRatioData = ref<ChartRatioData>({ legend: [], series: [] });
const parkHiddenDangerTypeRatioData = ref<ChartRatioData>({ legend: [], series: [] });
const parkHiddenDangerAreaData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkHiddenDangerTypeData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkHiddenDangerChartRefreshKey = ref(0);
const activeParkHiddenDangerView = ref('卡片');
const parkHiddenDangerViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);
const parkHiddenDangerDrawerVisible = ref(false);
const parkHiddenDangerDrawerType = ref('');
const parkHiddenDangerSelectedRow = ref<ParkHiddenDangerRow>({ parkHiddenDangerHiddenDangerId: '', sysRiskLevelName: '', sysHiddenDangerTypeName: '', tbAssetExtendAddress: '', parkHiddenDangerInfluenceRange: '', sysRectificationProgressName: '', parkHiddenDangerRectificationDeadline:0, tbAssetExtendName:'', parkHiddenDangerDiscoverTime:0, sysUserUserName:'', parkHiddenDangerAcceptStatus:'', parkHiddenDangerEvidence:[], parkHiddenDangerRectifyRequire:'', parkHiddenDangerRectifyLog:[] });
const rectifyFormRef = ref<any>(null);
const rectifyForm = reactive<RectifyForm>({ rectifyScheme: '', rectifyFileList: [] });
const rectifyRules = reactive({ rectifyScheme: [{ required: true, message: '整改方案为必填项', trigger: ['blur','change'], whitespace: true },{ max:500, message:'整改方案最多输入500字', trigger:'blur'}] });
const acceptFormRef = ref<any>(null);
const acceptForm = reactive<AcceptForm>({ acceptResult: '', acceptOpinion: '' });
const acceptRules = reactive({ acceptResult: [{ required: true, message: '验收结果为必填项，请选择', trigger: ['blur','change'], whitespace: true }] });

const disposeTrackList = ref<DisposeTrackRow[]>([]);
const disposeTrackIndicators = ref<DisposeTrackIndicators>({ avgDisposeDuration:0, overtimeCount:0, finishCount:0, disposingCount:0 });
const disposeUserEfficiencyData = ref<ChartBarData>({ xAxis: [], series: [] });
const disposeTrackChartRefreshKey = ref(0);
const activeDisposeTrackView = ref('卡片');
const disposeTrackViewBtnList = ref(['卡片', '甘特图', '柱状图', '列表']);
const disposeTrackDrawerVisible = ref(false);
const disposeTrackDrawerType = ref('');
const disposeTrackSelectedRow = ref<DisposeTrackRow>({ parkAlarmAlarmId:'', sysAlarmTypeName:'', sysMaintainUserUserName:'', parkMaintainWorkorderStartTime:0, sysDisposalProgressName:'', parkMaintainWorkorderWorkorderNo:'', parkMaintainWorkorderExpectedFinishTime:0, parkMaintainWorkorderLatestDynamic:'', parkMaintainWorkorderDispatchDuration:0, parkMaintainWorkorderDealTime:0, parkAlarmEvidence:[], disposeAllLog:[] });
const cooperateFormRef = ref<any>(null);
const cooperateForm = reactive({ cooperateUser: '', cooperateReason: '' });
const cooperateRules = reactive({ cooperateUser: [{ required: true, message: '协同人员为必填项', trigger: ['blur','change'], whitespace: true }], cooperateReason: [{ required: true, message: '协同理由为必填项', trigger: ['blur','change'], whitespace: true },{ max:300, message:'协同理由最多输入300字', trigger:'blur'}] });

const parkAbnormalList = ref<ParkAbnormalRow[]>([]);
const parkAbnormalIndicators = ref<ParkAbnormalIndicators>({ totalCount:0, unRelieveCount:0, deviceAbnormalCount:0, dataAbnormalCount:0, commAbnormalCount:0 });
const parkAbnormalTrendData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkAbnormalAreaData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkAbnormalTypeData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkAbnormalChartRefreshKey = ref(0);
const activeParkAbnormalView = ref('卡片');
const parkAbnormalViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);
const parkAbnormalDrawerVisible = ref(false);
const parkAbnormalDrawerType = ref('');
const parkAbnormalSelectedRow = ref<ParkAbnormalRow>({ parkAbnormalAbnormalId: '', sysAbnormalTypeName: '', parkAbnormalAbnormalReason: '', parkAbnormalAbnormalTime:0, tbAssetExtendAddress:'', sysAssociatedObjectTypeName:'', parkAbnormalRelieveStatus:'', tbAssetExtendName:'', sysUserUserName:'', parkAbnormalRelieveTime:null, parkAbnormalEvidence:[], parkAbnormalDisposeLog:[] });
const abnormalDisposeFormRef = ref<any>(null);
const abnormalDisposeForm = reactive<AbnormalDisposeForm>({ disposeMeasure: '', disposeFileList: [] });
const abnormalDisposeRules = reactive({ disposeMeasure: [{ required: true, message: '处置措施为必填项', trigger: ['blur','change'], whitespace: true },{ max:300, message:'处置措施最多输入300字', trigger:'blur'}] });

// ========== 故障预警 响应式数据 ==========
const parkFaultList = ref<ParkFaultRow[]>([]);
const parkFaultIndicators = ref<ParkFaultIndicators>({ totalCount:0, unRepairCount:0, hardwareFaultCount:0, softwareFaultCount:0, commFaultCount:0, urgentCount:0, seriousCount:0 });
const parkFaultTypeRatioData = ref<ChartRatioData>({ legend: [], series: [] });
const parkFaultEquipmentRatioData = ref<ChartRatioData>({ legend: [], series: [] });
const parkFaultAreaData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkFaultEquipmentData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkFaultChartRefreshKey = ref(0);
const activeParkFaultView = ref('卡片');
const parkFaultViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);
const parkFaultDrawerVisible = ref(false);
const parkFaultDrawerType = ref('');
const parkFaultSelectedRow = ref<ParkFaultRow>({ parkFaultFaultId: '', sysFaultTypeName: '', sysEquipmentTypeName: '', tbDeviceExtendInstallPosition: '', parkFaultFaultTime:0, sysMaintenanceProgressName: '', tbDeviceExtendDeviceCode: '', parkFaultFaultLevel: '', sysMaintainUserUserName: '', parkMaintainWorkorderExpectedFinishTime:0, parkFaultEvidence:[], parkFaultRepairLog:[], parkFaultPartsList:[], parkMaintainWorkorderWorkorderNo: '' });
const dispatchFormRef = ref<any>(null);
const dispatchForm = reactive({ maintainUser: '', maintainRequire: '' });
const dispatchRules = reactive({ maintainUser: [{ required: true, message: '维修人员为必填项', trigger: ['blur','change'], whitespace: true }], maintainRequire: [{ max:300, message:'维修要求最多输入300字', trigger:'blur'}] });

// ========== 合规预警 响应式数据 ==========
const parkComplianceWarningList = ref<ParkComplianceWarningRow[]>([]);
const parkComplianceWarningIndicators = ref<ParkComplianceWarningIndicators>({ totalCount:0, unRectifyCount:0, passRate:0, occupyViolationCount:0, fireViolationCount:0, chargeViolationCount:0, safeViolationCount:0 });
const parkComplianceWarningViolationRatioData = ref<ChartRatioData>({ legend: [], series: [] });
const parkComplianceWarningSubjectRatioData = ref<ChartRatioData>({ legend: [], series: [] });
const parkComplianceWarningAreaData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkComplianceWarningTypeData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkComplianceWarningChartRefreshKey = ref(0);
const activeParkComplianceWarningView = ref('卡片');
const parkComplianceWarningViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);
const parkComplianceWarningDrawerVisible = ref(false);
const parkComplianceWarningDrawerType = ref('');
const parkComplianceWarningSelectedRow = ref<ParkComplianceWarningRow>({ parkComplianceWarningWarningId: '', sysViolationTypeName: '', parkComplianceWarningViolationDetail: '', parkComplianceWarningWarningTime:0, tbAssetExtendAddress:'', sysRectificationStatusName:'', parkComplianceWarningComplianceStandard:'', sysResponsibleSubjectTypeName:'', parkComplianceWarningRectificationDeadline:0, parkComplianceWarningInspectionResult:'未核查', parkComplianceWarningEvidence:[], parkComplianceWarningRectifyLog:[] });
const complianceRectifyFormRef = ref<any>(null);
const complianceRectifyForm = reactive<ComplianceRectifyForm>({ rectifyScheme: '', rectifyFileList: [] });
const complianceRectifyRules = reactive({ rectifyScheme: [{ required: true, message: '整改方案为必填项', trigger: ['blur','change'], whitespace: true },{ max:500, message:'整改方案最多输入500字', trigger:'blur'}] });
const complianceInspectFormRef = ref<any>(null);
const complianceInspectForm = reactive<ComplianceInspectForm>({ inspectionResult: '', inspectionOpinion: '' });
const complianceInspectRules = reactive({ inspectionResult: [{ required: true, message: '核查结果为必填项，请选择', trigger: ['blur','change'], whitespace: true }] });

// 公共工具方法
const formatNumber = (num: number) => num.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
const formatDecimal = (num: number) => num.toFixed(1);
const formatTimeStamp = (timeStamp?: number | string) => {
  if (!timeStamp) return '-';
  const date = new Date(Number(timeStamp));
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
};

// 数字滚动动画
const animateValue = (element: HTMLElement, start: number, end: number, duration: number) => {
  if (!element) return;
  let startTimestamp: number | null = null;
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    element.textContent = formatNumber(Math.floor(progress * (end - start) + start));
    if (progress < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
};
const initParkAlarmNumberAnimations = () => { document.querySelectorAll('.park-alarm-number-animate').forEach(el => animateValue(el as HTMLElement, 0, Number((el as HTMLElement).textContent || 0), 1500)); };
const initParkHiddenDangerNumberAnimations = () => { document.querySelectorAll('.park-hidden-danger-number-animate').forEach(el => animateValue(el as HTMLElement, 0, Number((el as HTMLElement).textContent || 0), 1500)); };
const initDisposeTrackNumberAnimations = () => { document.querySelectorAll('.dispose-track-number-animate').forEach(el => animateValue(el as HTMLElement, 0, Number((el as HTMLElement).textContent || 0), 1500)); };
const initParkAbnormalNumberAnimations = () => { document.querySelectorAll('.park-abnormal-number-animate').forEach(el => animateValue(el as HTMLElement, 0, Number((el as HTMLElement).textContent || 0), 1500)); };

// 标签样式方法
const getAlarmLevelTagType = (val?: string) => { const map = {'紧急':'danger','高危':'warning','中危':'info','低危':'success'}; return map[val as keyof typeof map] || ''; };
const getDisposeStatusTagType = (val?: string) => { const map = {'未处置':'danger','处理中':'warning','已完成':'success','已驳回':'info'}; return map[val as keyof typeof map] || ''; };
const getRiskLevelTagType = (val?: string) => { const map = {'重大':'danger','较大':'warning','一般':'info','低危':'success'}; return map[val as keyof typeof map] || ''; };
const getRectifyProgressTagType = (val?: string) => { const map = {'未整改':'danger','整改中':'warning','已整改':'success'}; return map[val as keyof typeof map] || ''; };
const getAcceptStatusTagType = (val?: string) => { const map = {'待验收':'warning','已验收':'success','验收未通过':'danger'}; return map[val as keyof typeof map] || ''; };
const getDisposeProgressTagType = (val?: string) => { const map = {'待派单':'info','处理中':'warning','已完成':'success','已驳回':'info','超时处置':'danger'}; return map[val as keyof typeof map] || ''; };
const getAbnormalStatusTagType = (val?: string) => { const map = {'未解除':'danger','已解除':'success'}; return map[val as keyof typeof map] || ''; };
const getAbnormalTypeTagType = (val?: string) => { const map = {'设备异常':'warning','数据异常':'info','通讯异常':'danger','环境异常':'success','其他异常':'primary'}; return map[val as keyof typeof map] || ''; };

// ========== 故障预警 标签样式方法 ==========
const getFaultLevelTagType = (val?: string) => { const map = {'紧急':'danger','严重':'warning','一般':'info','轻微':'success'}; return map[val as keyof typeof map] || ''; };
const getMaintenanceProgressTagType = (val?: string) => { const map = {'未处理':'danger','待处理':'warning','处理中':'warning','已完成':'success','已驳回':'info'}; return map[val as keyof typeof map] || ''; };

// ========== 合规预警 标签样式方法 ==========
const getComplianceRectifyStatusTagType = (val?: string) => { const map = {'未整改':'danger','整改中':'warning','已整改':'success'}; return map[val as keyof typeof map] || ''; };
const getComplianceInspectResultTagType = (val?: string) => { const map = {'未核查':'info','通过':'success','未通过':'danger'}; return map[val as keyof typeof map] || ''; };

// ✅ 核心修改：完全对齐参考代码的面板全屏逻辑
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
  if (!screenFull.isFullscreen && currentFullscreenPanel.value) {
    currentFullscreenPanel.value.style = '';
    nextTick(() => {
      parkAlarmChartRefreshKey.value++;
      parkHiddenDangerChartRefreshKey.value++;
      parkAbnormalChartRefreshKey.value++;
      disposeTrackChartRefreshKey.value++;
    });
    currentFullscreenPanel.value = null;
  }
};

// 视图切换
const changeParkAlarmView = (viewName: string) => {
  activeParkAlarmView.value = viewName;
  viewName === '卡片' && nextTick(() => setTimeout(initParkAlarmNumberAnimations, 300));
  (viewName === '柱状图' || viewName === '饼图') && nextTick(() => parkAlarmChartRefreshKey.value++);
};
const changeParkHiddenDangerView = (viewName: string) => {
  activeParkHiddenDangerView.value = viewName;
  viewName === '卡片' && nextTick(() => setTimeout(initParkHiddenDangerNumberAnimations, 300));
  (viewName === '柱状图' || viewName === '饼图') && nextTick(() => parkHiddenDangerChartRefreshKey.value++);
};
const changeDisposeTrackView = (viewName: string) => {
  activeDisposeTrackView.value = viewName;
  viewName === '卡片' && nextTick(() => setTimeout(initDisposeTrackNumberAnimations, 300));
  (viewName === '甘特图' || viewName === '柱状图') && nextTick(() => disposeTrackChartRefreshKey.value++);
};
const changeParkAbnormalView = (viewName: string) => {
  activeParkAbnormalView.value = viewName;
  viewName === '卡片' && nextTick(() => setTimeout(initParkAbnormalNumberAnimations, 300));
  (viewName === '柱状图' || viewName === '饼图') && nextTick(() => parkAbnormalChartRefreshKey.value++);
};

// ========== 故障预警 视图切换方法 ==========
const changeParkFaultView = (viewName: string) => {
  activeParkFaultView.value = viewName;
  viewName === '卡片' && nextTick(() => setTimeout(() => { document.querySelectorAll('.park-fault-number-animate').forEach(el => animateValue(el as HTMLElement, 0, Number((el as HTMLElement).textContent || 0), 1500)); }, 300));
  (viewName === '柱状图' || viewName === '饼图') && nextTick(() => parkFaultChartRefreshKey.value++);
};

// ========== 合规预警 视图切换方法 ==========
const changeParkComplianceWarningView = (viewName: string) => {
  activeParkComplianceWarningView.value = viewName;
  viewName === '卡片' && nextTick(() => setTimeout(() => { document.querySelectorAll('.park-compliance-warning-number-animate').forEach(el => animateValue(el as HTMLElement, 0, Number((el as HTMLElement).textContent || 0), 1500)); }, 300));
  (viewName === '柱状图' || viewName === '饼图') && nextTick(() => parkComplianceWarningChartRefreshKey.value++);
};

// 接口请求方法
const getParkAlarmListData = async () => { try { parkAlarmList.value = await fetchParkAlarmList() as ParkAlarmRow[]; } catch (e:any) { ElMessage.error(`数据加载失败：${e.message}`); parkAlarmList.value = []; } };
const getParkAlarmIndicatorData = async () => { try { parkAlarmIndicators.value = await fetchParkAlarmIndicators() as ParkAlarmIndicators; } catch (e:any) { ElMessage.error(`指标加载失败：${e.message}`); } };
const getParkAlarmLevelRatioData = async () => { try { parkAlarmLevelRatioData.value = await fetchParkAlarmLevelRatio() as ChartRatioData; } catch (e:any) { ElMessage.error(`等级占比加载失败：${e.message}`); } };
const getParkAlarmTypeRatioData = async () => { try { parkAlarmTypeRatioData.value = await fetchParkAlarmTypeRatio() as ChartRatioData; } catch (e:any) { ElMessage.error(`类型占比加载失败：${e.message}`); } };
const getParkAlarmStatusRatioData = async () => { try { parkAlarmStatusRatioData.value = await fetchParkAlarmStatusRatio() as ChartRatioData; } catch (e:any) { ElMessage.error(`状态占比加载失败：${e.message}`); } };
const getParkAlarmAreaData = async () => { try { parkAlarmAreaData.value = await fetchParkAlarmAreaCount() as ChartBarData; } catch (e:any) { ElMessage.error(`区域数据加载失败：${e.message}`); } };
const getParkAlarmTypeData = async () => { try { parkAlarmTypeData.value = await fetchParkAlarmTypeCount() as ChartBarData; } catch (e:any) { ElMessage.error(`类型数据加载失败：${e.message}`); } };
const getParkAlarmDetailData = async (alarmId: string) => { try { parkAlarmSelectedRow.value = {...parkAlarmSelectedRow.value, ...await fetchParkAlarmDetail(alarmId)}; } catch (e:any) { ElMessage.warning(`详情加载失败：${e.message}`); } };
const getParkAlarmTrackInfoData = async (alarmId: string) => { try { parkAlarmSelectedRow.value = {...parkAlarmSelectedRow.value, ...await fetchParkAlarmTrackInfo(alarmId)}; } catch (e:any) { ElMessage.warning(`跟踪数据加载失败：${e.message}`); } };

const getParkHiddenDangerListData = async () => { try { parkHiddenDangerList.value = await fetchParkHiddenDangerList() as ParkHiddenDangerRow[]; } catch (e:any) { ElMessage.error(`隐患列表加载失败：${e.message}`); parkHiddenDangerList.value = []; } };
const getParkHiddenDangerIndicatorData = async () => { try { parkHiddenDangerIndicators.value = await fetchParkHiddenDangerIndicators() as ParkHiddenDangerIndicators; } catch (e:any) { ElMessage.error(`隐患指标加载失败：${e.message}`); } };
const getParkHiddenDangerLevelRatioData = async () => { try { parkHiddenDangerLevelRatioData.value = await fetchParkHiddenDangerLevelRatio() as ChartRatioData; } catch (e:any) { ElMessage.error(`隐患等级占比加载失败：${e.message}`); } };
const getParkHiddenDangerTypeRatioData = async () => { try { parkHiddenDangerTypeRatioData.value = await fetchParkHiddenDangerTypeRatio() as ChartRatioData; } catch (e:any) { ElMessage.error(`隐患类型占比加载失败：${e.message}`); } };
const getParkHiddenDangerAreaData = async () => { try { parkHiddenDangerAreaData.value = await fetchParkHiddenDangerAreaCount() as ChartBarData; } catch (e:any) { ElMessage.error(`隐患区域数据加载失败：${e.message}`); } };
const getParkHiddenDangerTypeData = async () => { try { parkHiddenDangerTypeData.value = await fetchParkHiddenDangerTypeCount() as ChartBarData; } catch (e:any) { ElMessage.error(`隐患类型数据加载失败：${e.message}`); } };
const getParkHiddenDangerDetailData = async (dangerId: string) => { try { parkHiddenDangerSelectedRow.value = {...parkHiddenDangerSelectedRow.value, ...await fetchParkHiddenDangerDetail(dangerId)}; } catch (e:any) { ElMessage.warning(`隐患详情加载失败：${e.message}`); } };

const getDisposeTrackListData = async () => { try { disposeTrackList.value = await fetchParkDisposeTrackList() as DisposeTrackRow[]; } catch (e:any) { ElMessage.error(`处置跟踪加载失败：${e.message}`); disposeTrackList.value = []; } };
const getDisposeTrackIndicatorData = async () => { try { disposeTrackIndicators.value = await fetchParkDisposeTrackIndicators() as DisposeTrackIndicators; } catch (e:any) { ElMessage.error(`处置指标加载失败：${e.message}`); } };
const getDisposeUserEfficiencyData = async () => { try { disposeUserEfficiencyData.value = await fetchParkDisposeUserEfficiency() as ChartBarData; } catch (e:any) { ElMessage.error(`效率数据加载失败：${e.message}`); } };
const getDisposeTrackDetailData = async (alarmId: string) => { try { disposeTrackSelectedRow.value = {...disposeTrackSelectedRow.value, ...await fetchParkDisposeTrackDetail(alarmId)}; } catch (e:any) { ElMessage.warning(`处置详情加载失败：${e.message}`); } };

const getParkAbnormalListData = async () => { try { parkAbnormalList.value = await fetchParkAbnormalList() as ParkAbnormalRow[]; } catch (e:any) { ElMessage.error(`异常列表加载失败：${e.message}`); parkAbnormalList.value = []; } };
const getParkAbnormalIndicatorData = async () => { try { parkAbnormalIndicators.value = await fetchParkAbnormalIndicators() as ParkAbnormalIndicators; } catch (e:any) { ElMessage.error(`异常指标加载失败：${e.message}`); } };
const getParkAbnormalTrendData = async () => { try { parkAbnormalTrendData.value = await fetchParkAbnormalTrend() as ChartBarData; } catch (e:any) { ElMessage.error(`异常趋势加载失败：${e.message}`); } };
const getParkAbnormalAreaData = async () => { try { parkAbnormalAreaData.value = await fetchParkAbnormalAreaCount() as ChartBarData; } catch (e:any) { ElMessage.error(`异常区域加载失败：${e.message}`); } };
const getParkAbnormalTypeData = async () => { try { parkAbnormalTypeData.value = await fetchParkAbnormalTypeCount() as ChartBarData; } catch (e:any) { ElMessage.error(`异常类型加载失败：${e.message}`); } };
const getParkAbnormalDetailData = async (abnormalId: string) => { try { parkAbnormalSelectedRow.value = {...parkAbnormalSelectedRow.value, ...await fetchParkAbnormalDetail(abnormalId)}; } catch (e:any) { ElMessage.warning(`异常详情加载失败：${e.message}`); } };

// ========== 故障预警 接口请求方法 ==========
const getParkFaultListData = async () => { try { parkFaultList.value = await fetchParkFaultList() as ParkFaultRow[]; } catch (e:any) { ElMessage.error(`故障列表加载失败：${e.message}`); parkFaultList.value = []; } };
const getParkFaultIndicatorData = async () => { try { parkFaultIndicators.value = await fetchParkFaultIndicators() as ParkFaultIndicators; } catch (e:any) { ElMessage.error(`故障指标加载失败：${e.message}`); } };
const getParkFaultTypeRatioData = async () => { try { parkFaultTypeRatioData.value = await fetchParkFaultTypeRatio() as ChartRatioData; } catch (e:any) { ElMessage.error(`故障类型占比加载失败：${e.message}`); } };
const getParkFaultEquipmentRatioData = async () => { try { parkFaultEquipmentRatioData.value = await fetchParkFaultEquipmentRatio() as ChartRatioData; } catch (e:any) { ElMessage.error(`设备类型占比加载失败：${e.message}`); } };
const getParkFaultAreaData = async () => { try { parkFaultAreaData.value = await fetchParkFaultAreaCount() as ChartBarData; } catch (e:any) { ElMessage.error(`区域故障数加载失败：${e.message}`); } };
const getParkFaultEquipmentData = async () => { try { parkFaultEquipmentData.value = await fetchParkFaultEquipmentCount() as ChartBarData; } catch (e:any) { ElMessage.error(`设备故障数加载失败：${e.message}`); } };
const getParkFaultDetailData = async (faultId: string) => { try { parkFaultSelectedRow.value = {...parkFaultSelectedRow.value, ...await fetchParkFaultDetail(faultId)}; } catch (e:any) { ElMessage.warning(`故障详情加载失败：${e.message}`); } };
const getParkFaultTrackInfoData = async (faultId: string) => { try { parkFaultSelectedRow.value = {...parkFaultSelectedRow.value, ...await fetchParkFaultTrackInfo(faultId)}; } catch (e:any) { ElMessage.warning(`故障跟踪数据加载失败：${e.message}`); } };

// ========== 合规预警 接口请求方法 ==========
const getParkComplianceWarningListData = async () => { try { parkComplianceWarningList.value = await fetchParkComplianceWarningList() as ParkComplianceWarningRow[]; } catch (e:any) { ElMessage.error(`合规预警列表加载失败：${e.message}`); parkComplianceWarningList.value = []; } };
const getParkComplianceWarningIndicatorData = async () => { try { parkComplianceWarningIndicators.value = await fetchParkComplianceWarningIndicators() as ParkComplianceWarningIndicators; } catch (e:any) { ElMessage.error(`合规预警指标加载失败：${e.message}`); } };
const getParkComplianceWarningViolationRatioData = async () => { try { parkComplianceWarningViolationRatioData.value = await fetchParkComplianceWarningViolationRatio() as ChartRatioData; } catch (e:any) { ElMessage.error(`违规类型占比加载失败：${e.message}`); } };
const getParkComplianceWarningSubjectRatioData = async () => { try { parkComplianceWarningSubjectRatioData.value = await fetchParkComplianceWarningSubjectRatio() as ChartRatioData; } catch (e:any) { ElMessage.error(`责任主体占比加载失败：${e.message}`); } };
const getParkComplianceWarningAreaData = async () => { try { parkComplianceWarningAreaData.value = await fetchParkComplianceWarningAreaCount() as ChartBarData; } catch (e:any) { ElMessage.error(`区域预警数加载失败：${e.message}`); } };
const getParkComplianceWarningTypeData = async () => { try { parkComplianceWarningTypeData.value = await fetchParkComplianceWarningTypeCount() as ChartBarData; } catch (e:any) { ElMessage.error(`违规类型预警数加载失败：${e.message}`); } };
const getParkComplianceWarningDetailData = async (warningId: string) => { try { parkComplianceWarningSelectedRow.value = {...parkComplianceWarningSelectedRow.value, ...await fetchParkComplianceWarningDetail(warningId)}; } catch (e:any) { ElMessage.warning(`合规预警详情加载失败：${e.message}`); } };

// 抽屉方法
const openParkAlarmDrawer = async (row: ParkAlarmRow, type:string) => {
  parkAlarmSelectedRow.value = JSON.parse(JSON.stringify(row)) as ParkAlarmRow;
  parkAlarmDrawerType.value = type;
  type === 'dispose' && (()=>{ disposeForm.disposalMeasure = ''; disposeForm.disposeFileList = []; })();
  type === 'detail' && await getParkAlarmDetailData(row.parkAlarmAlarmId);
  type === 'track' && await getParkAlarmTrackInfoData(row.parkAlarmAlarmId);
  parkAlarmDrawerVisible.value = true;
};
const closeParkAlarmDrawer = () => { parkAlarmDrawerVisible.value = false; parkAlarmSelectedRow.value = { parkAlarmAlarmId: '', sysAlarmLevelName: '', sysAlarmTypeName: '', parkAlarmAlarmTime:0, tbAssetExtendName:'', tbAssetExtendAddress:'', sysDisposalStatusName:'', sysResponsibleUnitName:'', parkAlarmReceiveTime:0, parkAlarmDisposalDuration:0, parkMaintainWorkorderWorkorderNo:'', parkAlarmEvidence:[], parkAlarmDisposalLog:[], parkAlarmProgress:'' }; };
const submitDisposeForm = async () => {
  disposeFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const params: SubmitDisposeParams = { parkAlarmAlarmId: parkAlarmSelectedRow.value.parkAlarmAlarmId, disposalMeasure: disposeForm.disposalMeasure.trim(), disposalEvidence: disposeForm.disposeFileList.map(item => item.url || '') };
      try {
        const res = await submitParkAlarmDisposal(params);
        if(res?.success){
          await ElMessageBox.alert('处置内容提交成功，处置人将收到提醒', '系统提示', { type: 'success' });
          parkAlarmList.value = parkAlarmList.value.map(item => item.parkAlarmAlarmId === params.parkAlarmAlarmId ? {...item, sysDisposalStatusName:'处理中', parkMaintainWorkorderWorkorderNo:res.parkMaintainWorkorderWorkorderNo, parkAlarmProgress:'处理中'} : item);
          closeParkAlarmDrawer();
        }
      } catch (e:any) { ElMessage.error(`提交失败：${e.message}`); }
    }
  });
};

const openParkHiddenDangerDrawer = async (row: ParkHiddenDangerRow, type:string) => {
  parkHiddenDangerSelectedRow.value = JSON.parse(JSON.stringify(row)) as ParkHiddenDangerRow;
  parkHiddenDangerDrawerType.value = type;
  type === 'rectify' && (()=>{ rectifyForm.rectifyScheme = ''; rectifyForm.rectifyFileList = []; })();
  type === 'accept' && (()=>{ acceptForm.acceptResult = ''; acceptForm.acceptOpinion = ''; })();
  type === 'detail' && await getParkHiddenDangerDetailData(row.parkHiddenDangerHiddenDangerId);
  parkHiddenDangerDrawerVisible.value = true;
};
const closeParkHiddenDangerDrawer = () => { parkHiddenDangerDrawerVisible.value = false; parkHiddenDangerSelectedRow.value = { parkHiddenDangerHiddenDangerId: '', sysRiskLevelName: '', sysHiddenDangerTypeName: '', tbAssetExtendAddress: '', parkHiddenDangerInfluenceRange: '', sysRectificationProgressName: '', parkHiddenDangerRectificationDeadline:0, tbAssetExtendName:'', parkHiddenDangerDiscoverTime:0, sysUserUserName:'', parkHiddenDangerAcceptStatus:'', parkHiddenDangerEvidence:[], parkHiddenDangerRectifyRequire:'', parkHiddenDangerRectifyLog:[] }; };
const submitRectifyForm = async () => {
  rectifyFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const params: SubmitRectifyParams = { parkHiddenDangerHiddenDangerId: parkHiddenDangerSelectedRow.value.parkHiddenDangerHiddenDangerId, rectifyScheme: rectifyForm.rectifyScheme.trim(), rectifyEvidence: rectifyForm.rectifyFileList.map(item => item.url || '') };
      try {
        const res = await submitParkHiddenDangerRectify(params);
        if(res?.success){
          await ElMessageBox.alert('整改方案提交成功，进入整改阶段', '系统提示', { type: 'success' });
          parkHiddenDangerList.value = parkHiddenDangerList.value.map(item => item.parkHiddenDangerHiddenDangerId === params.parkHiddenDangerHiddenDangerId ? {...item, sysRectificationProgressName:'整改中', parkHiddenDangerAcceptStatus:'待验收'} : item);
          closeParkHiddenDangerDrawer();
        }
      } catch (e:any) { ElMessage.error(`整改提交失败：${e.message}`); }
    }
  });
};
const submitAcceptForm = async () => {
  acceptFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const params: SubmitAcceptParams = { parkHiddenDangerHiddenDangerId: parkHiddenDangerSelectedRow.value.parkHiddenDangerHiddenDangerId, acceptResult: acceptForm.acceptResult, acceptOpinion: acceptForm.acceptOpinion?.trim() };
      try {
        const res = await submitParkHiddenDangerAccept(params);
        if(res?.success){
          const tipMsg = params.acceptResult === '通过' ? '验收通过，隐患闭环' : '验收未通过，需重新整改';
          await ElMessageBox.alert(tipMsg, '系统提示', { type: 'success' });
          parkHiddenDangerList.value = parkHiddenDangerList.value.map(item => item.parkHiddenDangerHiddenDangerId === params.parkHiddenDangerHiddenDangerId ? {...item, sysRectificationProgressName: params.acceptResult === '通过' ? '已整改' : '整改中', parkHiddenDangerAcceptStatus: params.acceptResult === '通过' ? '已验收' : '验收未通过'} : item);
          closeParkHiddenDangerDrawer();
        }
      } catch (e:any) { ElMessage.error(`验收提交失败：${e.message}`); }
    }
  });
};

const openDisposeTrackDrawer = async (row: DisposeTrackRow, type:string) => {
  disposeTrackSelectedRow.value = JSON.parse(JSON.stringify(row)) as DisposeTrackRow;
  disposeTrackDrawerType.value = type;
  type === 'cooperate' && (()=>{ cooperateForm.cooperateUser = ''; cooperateForm.cooperateReason = ''; })();
  type === 'detail' && await getDisposeTrackDetailData(row.parkAlarmAlarmId);
  disposeTrackDrawerVisible.value = true;
};
const closeDisposeTrackDrawer = () => { disposeTrackDrawerVisible.value = false; disposeTrackSelectedRow.value = { parkAlarmAlarmId:'', sysAlarmTypeName:'', sysMaintainUserUserName:'', parkMaintainWorkorderStartTime:0, sysDisposalProgressName:'', parkMaintainWorkorderWorkorderNo:'', parkMaintainWorkorderExpectedFinishTime:0, parkMaintainWorkorderLatestDynamic:'', parkMaintainWorkorderDispatchDuration:0, parkMaintainWorkorderDealTime:0, parkAlarmEvidence:[], disposeAllLog:[] }; };
const submitCooperateForm = async () => {
  cooperateFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const userList = cooperateForm.cooperateUser.split(',').map(item => item.trim()).filter(item => item);
      const params: SubmitCooperateParams = { parkAlarmAlarmId: disposeTrackSelectedRow.value.parkAlarmAlarmId, cooperateUser: userList, cooperateReason: cooperateForm.cooperateReason.trim() };
      try {
        const res = await submitParkDisposeCooperate(params);
        if(res?.success){
          await ElMessageBox.alert('协同请求提交成功，协同人员将收到提醒', '系统提示', { type: 'success' });
          closeDisposeTrackDrawer();
        }
      } catch (e:any) { ElMessage.error(`协同提交失败：${e.message}`); }
    }
  });
};
const submitUrgeHandle = async (row: DisposeTrackRow) => {
  const params: SubmitUrgeParams = { parkAlarmAlarmId: row.parkAlarmAlarmId, parkMaintainWorkorderWorkorderNo: row.parkMaintainWorkorderWorkorderNo };
  try {
    const res = await submitParkDisposeUrge(params);
    if(res?.success){
      await ElMessageBox.alert('催办消息已发送，处置人将收到提醒', '系统提示', { type: 'success' });
      disposeTrackList.value = disposeTrackList.value.map(item => item.parkAlarmAlarmId === row.parkAlarmAlarmId ? {...item, parkMaintainWorkorderLatestDynamic: `【催办提醒】${item.parkMaintainWorkorderLatestDynamic}`} : item);
    }
  } catch (e:any) { ElMessage.error(`催办失败：${e.message}`); }
};

const openParkAbnormalDrawer = async (row: ParkAbnormalRow, type:string) => {
  parkAbnormalSelectedRow.value = JSON.parse(JSON.stringify(row)) as ParkAbnormalRow;
  parkAbnormalDrawerType.value = type;
  type === 'dispose' && (()=>{ abnormalDisposeForm.disposeMeasure = ''; abnormalDisposeForm.disposeFileList = []; })();
  type === 'detail' && await getParkAbnormalDetailData(row.parkAbnormalAbnormalId);
  parkAbnormalDrawerVisible.value = true;
};
const closeParkAbnormalDrawer = () => {
  parkAbnormalDrawerVisible.value = false;
  parkAbnormalSelectedRow.value = { parkAbnormalAbnormalId: '', sysAbnormalTypeName: '', parkAbnormalAbnormalReason: '', parkAbnormalAbnormalTime:0, tbAssetExtendAddress:'', sysAssociatedObjectTypeName:'', parkAbnormalRelieveStatus:'', tbAssetExtendName:'', sysUserUserName:'', parkAbnormalRelieveTime:null, parkAbnormalEvidence:[], parkAbnormalDisposeLog:[] };
};
const submitAbnormalDisposeForm = async () => {
  abnormalDisposeFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const params: SubmitAbnormalDisposeParams = {
        parkAbnormalAbnormalId: parkAbnormalSelectedRow.value.parkAbnormalAbnormalId,
        disposeMeasure: abnormalDisposeForm.disposeMeasure.trim(),
        disposeEvidence: abnormalDisposeForm.disposeFileList.map(item => item.url || '')
      };
      try {
        const res = await submitParkAbnormalDispose(params);
        if(res?.success){
          await ElMessageBox.alert('处置方案提交成功，进入处置阶段', '系统提示', { type: 'success' });
          parkAbnormalList.value = parkAbnormalList.value.map(item => item.parkAbnormalAbnormalId === params.parkAbnormalAbnormalId ? {...item, parkAbnormalRelieveStatus:'处置中'} : item);
          closeParkAbnormalDrawer();
        }
      } catch (e:any) { ElMessage.error(`处置提交失败：${e.message}`); }
    }
  });
};
const submitAbnormalRelieveForm = async () => {
  try {
    const params: SubmitAbnormalRelieveParams = { parkAbnormalAbnormalId: parkAbnormalSelectedRow.value.parkAbnormalAbnormalId };
    const res = await submitParkAbnormalRelieve(params);
    if(res?.success){
      await ElMessageBox.alert('异常已成功解除，状态已更新', '系统提示', { type: 'success' });
      parkAbnormalList.value = parkAbnormalList.value.map(item => item.parkAbnormalAbnormalId === params.parkAbnormalAbnormalId ? {...item, parkAbnormalRelieveStatus:'已解除', parkAbnormalRelieveTime:new Date().getTime()} : item);
      closeParkAbnormalDrawer();
    }
  } catch (e:any) { ElMessage.error(`解除提交失败：${e.message}`); }
};

// ========== 故障预警 抽屉方法 ==========
const openParkFaultDrawer = async (row: ParkFaultRow, type:string) => {
  parkFaultSelectedRow.value = JSON.parse(JSON.stringify(row)) as ParkFaultRow;
  parkFaultDrawerType.value = type;
  type === 'dispatch' && (()=>{ dispatchForm.maintainUser = ''; dispatchForm.maintainRequire = ''; })();
  type === 'detail' && await getParkFaultDetailData(row.parkFaultFaultId);
  type === 'track' && await getParkFaultTrackInfoData(row.parkFaultFaultId);
  parkFaultDrawerVisible.value = true;
};
const closeParkFaultDrawer = () => { parkFaultDrawerVisible.value = false; parkFaultSelectedRow.value = { parkFaultFaultId: '', sysFaultTypeName: '', sysEquipmentTypeName: '', tbDeviceExtendInstallPosition: '', parkFaultFaultTime:0, sysMaintenanceProgressName: '', tbDeviceExtendDeviceCode: '', parkFaultFaultLevel: '', sysMaintainUserUserName: '', parkMaintainWorkorderExpectedFinishTime:0, parkFaultEvidence:[], parkFaultRepairLog:[], parkFaultPartsList:[], parkMaintainWorkorderWorkorderNo: '' }; };
const submitDispatchForm = async () => {
  dispatchFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const params: SubmitDispatchParams = { parkFaultFaultId: parkFaultSelectedRow.value.parkFaultFaultId, maintainUser: dispatchForm.maintainUser.trim(), maintainRequire: dispatchForm.maintainRequire?.trim() };
      try {
        const res = await submitParkFaultDispatch(params);
        if(res?.success){
          await ElMessageBox.alert('派单成功，已生成维修工单，维修人员将收到提醒', '系统提示', { type: 'success' });
          parkFaultList.value = parkFaultList.value.map(item => item.parkFaultFaultId === params.parkFaultFaultId ? {...item, sysMaintenanceProgressName:'待处理', parkMaintainWorkorderWorkorderNo:res.parkMaintainWorkorderWorkorderNo} : item);
          closeParkFaultDrawer();
        }
      } catch (e:any) { ElMessage.error(`派单提交失败：${e.message}`); }
    }
  });
};

// ========== 合规预警 抽屉方法 ==========
const openParkComplianceWarningDrawer = async (row: ParkComplianceWarningRow, type:string) => {
  parkComplianceWarningSelectedRow.value = JSON.parse(JSON.stringify(row)) as ParkComplianceWarningRow;
  parkComplianceWarningDrawerType.value = type;
  type === 'rectify' && (()=>{ complianceRectifyForm.rectifyScheme = ''; complianceRectifyForm.rectifyFileList = []; })();
  type === 'inspect' && (()=>{ complianceInspectForm.inspectionResult = ''; complianceInspectForm.inspectionOpinion = ''; })();
  type === 'detail' && await getParkComplianceWarningDetailData(row.parkComplianceWarningWarningId);
  parkComplianceWarningDrawerVisible.value = true;
};
const closeParkComplianceWarningDrawer = () => { parkComplianceWarningDrawerVisible.value = false; parkComplianceWarningSelectedRow.value = { parkComplianceWarningWarningId: '', sysViolationTypeName: '', parkComplianceWarningViolationDetail: '', parkComplianceWarningWarningTime:0, tbAssetExtendAddress:'', sysRectificationStatusName:'', parkComplianceWarningComplianceStandard:'', sysResponsibleSubjectTypeName:'', parkComplianceWarningRectificationDeadline:0, parkComplianceWarningInspectionResult:'未核查', parkComplianceWarningEvidence:[], parkComplianceWarningRectifyLog:[] }; };
const submitComplianceRectifyForm = async () => {
  complianceRectifyFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const params: SubmitComplianceRectifyParams = { parkComplianceWarningWarningId: parkComplianceWarningSelectedRow.value.parkComplianceWarningWarningId, rectifyScheme: complianceRectifyForm.rectifyScheme.trim(), rectifyEvidence: complianceRectifyForm.rectifyFileList.map(item => item.url || '') };
      try {
        const res = await submitParkComplianceWarningRectify(params);
        if(res?.success){
          await ElMessageBox.alert('整改方案提交成功，进入整改阶段', '系统提示', { type: 'success' });
          parkComplianceWarningList.value = parkComplianceWarningList.value.map(item => item.parkComplianceWarningWarningId === params.parkComplianceWarningWarningId ? {...item, sysRectificationStatusName:'整改中'} : item);
          closeParkComplianceWarningDrawer();
        }
      } catch (e:any) { ElMessage.error(`整改提交失败：${e.message}`); }
    }
  });
};
const submitComplianceInspectForm = async () => {
  complianceInspectFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const params: SubmitComplianceInspectParams = { parkComplianceWarningWarningId: parkComplianceWarningSelectedRow.value.parkComplianceWarningWarningId, inspectionResult: complianceInspectForm.inspectionResult, inspectionOpinion: complianceInspectForm.inspectionOpinion?.trim() };
      try {
        const res = await submitParkComplianceWarningInspect(params);
        if(res?.success){
          const tipMsg = params.inspectionResult === '通过' ? '核查通过，合规预警闭环完成' : '核查未通过，需重新整改';
          await ElMessageBox.alert(tipMsg, '系统提示', { type: 'success' });
          parkComplianceWarningList.value = parkComplianceWarningList.value.map(item => item.parkComplianceWarningWarningId === params.parkComplianceWarningWarningId ? {...item, sysRectificationStatusName: params.inspectionResult === '通过' ? '已整改' : '整改中', parkComplianceWarningInspectionResult: params.inspectionResult} : item);
          closeParkComplianceWarningDrawer();
        }
      } catch (e:any) { ElMessage.error(`核查提交失败：${e.message}`); }
    }
  });
};

// 生命周期
onMounted(async () => {
  await Promise.all([
    getParkAlarmListData(),getParkAlarmIndicatorData(),getParkAlarmLevelRatioData(),getParkAlarmTypeRatioData(),getParkAlarmStatusRatioData(),getParkAlarmAreaData(),getParkAlarmTypeData(),
    getParkHiddenDangerListData(),getParkHiddenDangerIndicatorData(),getParkHiddenDangerLevelRatioData(),getParkHiddenDangerTypeRatioData(),getParkHiddenDangerAreaData(),getParkHiddenDangerTypeData(),
    getDisposeTrackListData(),getDisposeTrackIndicatorData(),getDisposeUserEfficiencyData(),
    getParkAbnormalListData(),getParkAbnormalIndicatorData(),getParkAbnormalTrendData(),getParkAbnormalAreaData(),getParkAbnormalTypeData(),
    getParkFaultListData(),getParkFaultIndicatorData(),getParkFaultTypeRatioData(),getParkFaultEquipmentRatioData(),getParkFaultAreaData(),getParkFaultEquipmentData(),
    getParkComplianceWarningListData(),getParkComplianceWarningIndicatorData(),getParkComplianceWarningViolationRatioData(),getParkComplianceWarningSubjectRatioData(),getParkComplianceWarningAreaData(),getParkComplianceWarningTypeData()
  ]);
  setTimeout(() => { parkAlarmChartRefreshKey.value++; parkHiddenDangerChartRefreshKey.value++; parkAbnormalChartRefreshKey.value++; disposeTrackChartRefreshKey.value++; parkFaultChartRefreshKey.value++; parkComplianceWarningChartRefreshKey.value++; }, 200);
  screenFull.on('change', handleFullscreenChange);
});
onUnmounted(() => { screenFull.off('change', handleFullscreenChange); });
</script>

<template>
  <div class="page-container">
    <div class="mainbox">
      <div class="top">
        <div class="panel top-left" ref="parkAlarmPanelRef">
          <div class="header-actions">
            <div class="actions-left"><p>预警事件概览</p></div>
            <div class="actions-right">
              <div class="view-btn-group"><el-button v-for="item in parkAlarmViewBtnList" :key="item" :type="activeParkAlarmView === item ? 'primary' : ''" plain @click="changeParkAlarmView(item)" class="view-btn">{{ item }}</el-button></div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('parkAlarmPanelRef')"><el-icon color="#00ccff" size="16"><FullScreen /></el-icon></button>
            </div>
          </div>
          <div v-if="activeParkAlarmView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1"><div class="indicator-title">预警事件总数</div><div class="indicator-value"><span class="park-alarm-number-animate">{{ parkAlarmIndicators.totalCount }}</span></div><div class="indicator-unit">件</div></div>
              <div class="indicator-card1 card2"><div class="indicator-title">未处置预警数</div><div class="indicator-value"><span class="park-alarm-number-animate">{{ parkAlarmIndicators.undisposedCount }}</span></div><div class="indicator-unit">件</div></div>
              <div class="indicator-card1 card3"><div class="indicator-title">高危预警数</div><div class="indicator-value"><span class="park-alarm-number-animate">{{ parkAlarmIndicators.highCount }}</span></div><div class="indicator-unit">件</div></div>
            </div>
          </div>
          <div v-if="activeParkAlarmView === '柱状图'" class="view-content">
            <div style="width: 49%;height:100%;display:inline-block;vertical-align:top;"><VerticalBar2 :x-axis="parkAlarmAreaData.xAxis" :series="parkAlarmAreaData.series" unit="件" title="不同区域预警数对比" :key="parkAlarmChartRefreshKey" /></div>
            <div style="width: 49%;height:100%;display:inline-block;vertical-align:top;padding-left:0.3vw;border-left:0.3vh solid #02a6b5;"><VerticalBar1 :x-axis="parkAlarmTypeData.xAxis" :series="parkAlarmTypeData.series" unit="件" title="不同类型预警数对比" :key="parkAlarmChartRefreshKey" /></div>
          </div>
          <div v-if="activeParkAlarmView === '饼图'" class="view-content">
            <div style="width:32%;height:100%;display:inline-block;vertical-align:top;"><ChartPie1 :data="parkAlarmLevelRatioData" title="预警等级占比" :key="parkAlarmChartRefreshKey" /></div>
            <div style="width:32%;height:100%;display:inline-block;vertical-align:top;padding-left:0.3vw;border-left:0.3vh solid #02a6b5;"><ChartPie2 :data="parkAlarmTypeRatioData" title="预警类型占比" :key="parkAlarmChartRefreshKey" /></div>
            <div style="width:32%;height:100%;display:inline-block;vertical-align:top;padding-left:0.3vw;border-left:0.3vh solid #02a6b5;"><ChartPie2 :data="parkAlarmStatusRatioData" title="处置状态占比" :key="parkAlarmChartRefreshKey" /></div>
          </div>
          <div v-if="activeParkAlarmView === '列表'" class="view-content">
            <div class="table-box4">
              <el-table class="table4" :data="parkAlarmList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row>
                <el-table-column prop="parkAlarmAlarmId" label="预警ID" align="center" width="120" />
                <el-table-column prop="sysAlarmLevelName" label="预警等级" align="center" width="100"><template #default="scope"><el-tag :type="getAlarmLevelTagType(scope.row.sysAlarmLevelName)">{{ scope.row.sysAlarmLevelName || '-' }}</el-tag></template></el-table-column>
                <el-table-column prop="sysAlarmTypeName" label="预警类型" align="center" width="120" />
                <el-table-column prop="parkAlarmAlarmTime" label="预警时间" align="center" width="160"><template #default="scope">{{ formatTimeStamp(scope.row.parkAlarmAlarmTime) }}</template></el-table-column>
                <el-table-column prop="tbAssetExtendAddress" label="预警地址" align="center" min-width="180" />
                <el-table-column prop="sysDisposalStatusName" label="处置状态" align="center" width="120"><template #default="scope"><el-tag :type="getDisposeStatusTagType(scope.row.sysDisposalStatusName)">{{ scope.row.sysDisposalStatusName || '-' }}</el-tag></template></el-table-column>
                <el-table-column label="操作" align="center" width="200" fixed="right">
                  <template #default="scope">
                    <el-button type="primary" plain size="small" style="width:40px; margin:0 3px;" @click="openParkAlarmDrawer(scope.row, 'detail')">详情</el-button>
                    <el-button v-if="scope.row.sysDisposalStatusName === '未处置'" type="warning" plain size="small" style="width:40px; margin:0 3px;" @click="openParkAlarmDrawer(scope.row, 'dispose')">处置</el-button>
                    <span v-else style="display:inline-block;width:40px;"></span>
                    <el-button type="success" plain size="small" style="width:40px; margin:0 3px;" @click="openParkAlarmDrawer(scope.row, 'track')">跟踪</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>

        <div class="panel top-middle" ref="parkHiddenDangerPanelRef">
          <div class="header-actions">
            <div class="actions-left"><p>隐患预警视图</p></div>
            <div class="actions-right">
              <div class="view-btn-group"><el-button v-for="item in parkHiddenDangerViewBtnList" :key="item" :type="activeParkHiddenDangerView === item ? 'primary' : ''" plain @click="changeParkHiddenDangerView(item)" class="view-btn">{{ item }}</el-button></div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('parkHiddenDangerPanelRef')"><el-icon color="#00ccff" size="16"><FullScreen /></el-icon></button>
            </div>
          </div>
          <div v-if="activeParkHiddenDangerView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1"><div class="indicator-title">隐患总数</div><div class="indicator-value"><span class="park-hidden-danger-number-animate">{{ parkHiddenDangerIndicators.totalCount }}</span></div><div class="indicator-unit">件</div></div>
              <div class="indicator-card1 card2"><div class="indicator-title">到期未整改数</div><div class="indicator-value"><span class="park-hidden-danger-number-animate">{{ parkHiddenDangerIndicators.overdueUnRectifyCount }}</span></div><div class="indicator-unit">件</div></div>
              <div class="indicator-card1 card3"><div class="indicator-title">重大风险隐患数</div><div class="indicator-value"><span class="park-hidden-danger-number-animate">{{ parkHiddenDangerIndicators.majorCount }}</span></div><div class="indicator-unit">件</div></div>
            </div>
          </div>
          <div v-if="activeParkHiddenDangerView === '柱状图'" class="view-content">
            <div style="width: 49%;height:100%;display:inline-block;vertical-align:top;"><VerticalBar2 :x-axis="parkHiddenDangerAreaData.xAxis" :series="parkHiddenDangerAreaData.series" unit="件" title="不同区域隐患数对比" :key="parkHiddenDangerChartRefreshKey" /></div>
            <div style="width: 49%;height:100%;display:inline-block;vertical-align:top;padding-left:0.3vw;border-left:0.3vh solid #02a6b5;"><VerticalBar1 :x-axis="parkHiddenDangerTypeData.xAxis" :series="parkHiddenDangerTypeData.series" unit="件" title="不同类型隐患数对比" :key="parkHiddenDangerChartRefreshKey" /></div>
          </div>
          <div v-if="activeParkHiddenDangerView === '饼图'" class="view-content">
            <div style="width:32%;height:100%;display:inline-block;vertical-align:top;"><ChartPie1 :data="parkHiddenDangerLevelRatioData" title="隐患风险等级占比" :key="parkHiddenDangerChartRefreshKey" /></div>
            <div style="width:32%;height:100%;display:inline-block;vertical-align:top;padding-left:0.3vw;border-left:0.3vh solid #02a6b5;"><ChartPie2 :data="parkHiddenDangerTypeRatioData" title="隐患类型占比" :key="parkHiddenDangerChartRefreshKey" /></div>
            <div style="width:32%;height:100%;display:inline-block;vertical-align:top;padding-left:0.3vw;border-left:0.3vh solid #02a6b5;"><ChartPie2 :data="parkHiddenDangerLevelRatioData" title="风险占比趋势" :key="parkHiddenDangerChartRefreshKey" /></div>
          </div>
          <div v-if="activeParkHiddenDangerView === '列表'" class="view-content">
            <div class="table-box4">
              <el-table class="table4" :data="parkHiddenDangerList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row>
                <el-table-column prop="parkHiddenDangerHiddenDangerId" label="隐患ID" align="center" width="140" />
                <el-table-column prop="sysRiskLevelName" label="风险等级" align="center" width="100"><template #default="scope"><el-tag :type="getRiskLevelTagType(scope.row.sysRiskLevelName)">{{ scope.row.sysRiskLevelName || '-' }}</el-tag></template></el-table-column>
                <el-table-column prop="sysHiddenDangerTypeName" label="隐患类型" align="center" width="120" />
                <el-table-column prop="tbAssetExtendAddress" label="发生位置" align="center" min-width="180" />
                <el-table-column prop="parkHiddenDangerInfluenceRange" label="影响范围" align="center" min-width="150" />
                <el-table-column prop="sysRectificationProgressName" label="整改进度" align="center" width="120"><template #default="scope"><el-tag :type="getRectifyProgressTagType(scope.row.sysRectificationProgressName)">{{ scope.row.sysRectificationProgressName || '-' }}</el-tag></template></el-table-column>
                <el-table-column prop="parkHiddenDangerRectificationDeadline" label="整改期限" align="center" width="160"><template #default="scope">{{ formatTimeStamp(scope.row.parkHiddenDangerRectificationDeadline) }}</template></el-table-column>
                <el-table-column label="操作" align="center" width="200" fixed="right">
                  <template #default="scope">
                    <el-button type="primary" plain size="small" style="width:40px; margin:0 3px;" @click="openParkHiddenDangerDrawer(scope.row, 'detail')">详情</el-button>
                    <el-button v-if="scope.row.sysRectificationProgressName === '未整改'" type="warning" plain size="small" style="width:40px; margin:0 3px;" @click="openParkHiddenDangerDrawer(scope.row, 'rectify')">整改</el-button>
                    <span v-else style="display:inline-block;width:40px;"></span>
                    <el-button v-if="scope.row.parkHiddenDangerAcceptStatus === '待验收'" type="success" plain size="small" style="width:40px; margin:0 3px;" @click="openParkHiddenDangerDrawer(scope.row, 'accept')">验收</el-button>
                    <span v-else style="display:inline-block;width:40px;"></span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>

        <div class="panel top-right" ref="parkAbnormalPanelRef">
          <div class="header-actions">
            <div class="actions-left"><p>异常预警视图</p></div>
            <div class="actions-right">
              <div class="view-btn-group"><el-button v-for="item in parkAbnormalViewBtnList" :key="item" :type="activeParkAbnormalView === item ? 'primary' : ''" plain @click="changeParkAbnormalView(item)" class="view-btn">{{ item }}</el-button></div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('parkAbnormalPanelRef')"><el-icon color="#00ccff" size="16"><FullScreen /></el-icon></button>
            </div>
          </div>
          <div v-if="activeParkAbnormalView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1"><div class="indicator-title">异常事件总数</div><div class="indicator-value"><span class="park-abnormal-number-animate">{{ parkAbnormalIndicators.totalCount }}</span></div><div class="indicator-unit">件</div></div>
              <div class="indicator-card1 card2"><div class="indicator-title">未解除异常数</div><div class="indicator-value"><span class="park-abnormal-number-animate">{{ parkAbnormalIndicators.unRelieveCount }}</span></div><div class="indicator-unit">件</div></div>
              <div class="indicator-card1 card3"><div class="indicator-title">设备异常数</div><div class="indicator-value"><span class="park-abnormal-number-animate">{{ parkAbnormalIndicators.deviceAbnormalCount }}</span></div><div class="indicator-unit">件</div></div>
            </div>
          </div>
          <div v-if="activeParkAbnormalView === '柱状图'" class="view-content">
            <div style="width: 49%;height:100%;display:inline-block;vertical-align:top;"><VerticalBar2 :x-axis="parkAbnormalAreaData.xAxis" :series="parkAbnormalAreaData.series" unit="件" title="不同区域异常数对比" :key="parkAbnormalChartRefreshKey" /></div>
            <div style="width: 49%;height:100%;display:inline-block;vertical-align:top;padding-left:0.3vw;border-left:0.3vh solid #02a6b5;"><VerticalBar1 :x-axis="parkAbnormalTypeData.xAxis" :series="parkAbnormalTypeData.series" unit="件" title="不同类型异常数对比" :key="parkAbnormalChartRefreshKey" /></div>
          </div>
          <div v-if="activeParkAbnormalView === '饼图'" class="view-content">
            <div style="width:32%;height:100%;display:inline-block;vertical-align:top;"><ChartPie1 :data="{legend:['设备异常','数据异常','通讯异常','环境异常'],series:[{name:'异常类型',data:[parkAbnormalIndicators.deviceAbnormalCount,parkAbnormalIndicators.dataAbnormalCount,parkAbnormalIndicators.commAbnormalCount,(parkAbnormalIndicators.totalCount - parkAbnormalIndicators.deviceAbnormalCount - parkAbnormalIndicators.dataAbnormalCount - parkAbnormalIndicators.commAbnormalCount)]}]}" title="异常类型占比" :key="parkAbnormalChartRefreshKey" /></div>
            <div style="width:32%;height:100%;display:inline-block;vertical-align:top;padding-left:0.3vw;border-left:0.3vh solid #02a6b5;"><ChartPie2 :data="{legend:['未解除','已解除'],series:[{name:'异常状态',data:[parkAbnormalIndicators.unRelieveCount, parkAbnormalIndicators.totalCount - parkAbnormalIndicators.unRelieveCount]}]}" title="异常状态占比" :key="parkAbnormalChartRefreshKey" /></div>
            <div style="width:32%;height:100%;display:inline-block;vertical-align:top;padding-left:0.3vw;border-left:0.3vh solid #02a6b5;"><ChartPie2 :data="parkAbnormalTrendData" title="异常趋势变化" :key="parkAbnormalChartRefreshKey" /></div>
          </div>
          <div v-if="activeParkAbnormalView === '列表'" class="view-content">
            <div class="table-box4">
              <el-table class="table4" :data="parkAbnormalList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row>
                <el-table-column prop="parkAbnormalAbnormalId" label="异常ID" align="center" width="140" />
                <el-table-column prop="sysAbnormalTypeName" label="异常类型" align="center" width="120"><template #default="scope"><el-tag :type="getAbnormalTypeTagType(scope.row.sysAbnormalTypeName)">{{ scope.row.sysAbnormalTypeName || '-' }}</el-tag></template></el-table-column>
                <el-table-column prop="parkAbnormalAbnormalTime" label="异常时间" align="center" width="160"><template #default="scope">{{ formatTimeStamp(scope.row.parkAbnormalAbnormalTime) }}</template></el-table-column>
                <el-table-column prop="tbAssetExtendAddress" label="异常位置" align="center" min-width="180" />
                <el-table-column prop="parkAbnormalRelieveStatus" label="解除状态" align="center" width="120"><template #default="scope"><el-tag :type="getAbnormalStatusTagType(scope.row.parkAbnormalRelieveStatus)">{{ scope.row.parkAbnormalRelieveStatus || '-' }}</el-tag></template></el-table-column>
                <el-table-column label="操作" align="center" width="200" fixed="right">
                  <template #default="scope">
                    <el-button type="primary" plain size="small" style="width:40px; margin:0 3px;" @click="openParkAbnormalDrawer(scope.row, 'detail')">详情</el-button>
                    <el-button v-if="scope.row.parkAbnormalRelieveStatus === '未解除'" type="warning" plain size="small" style="width:40px; margin:0 3px;" @click="openParkAbnormalDrawer(scope.row, 'dispose')">处置</el-button>
                    <span v-else style="display:inline-block;width:40px;"></span>
                    <el-button v-if="scope.row.parkAbnormalRelieveStatus === '未解除'" type="success" plain size="small" style="width:40px; margin:0 3px;" @click="openParkAbnormalDrawer(scope.row, 'relieve')">解除</el-button>
                    <span v-else style="display:inline-block;width:40px;"></span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="panel bottom-left" ref="eventDisposalTrackingRef">
          <div class="header-actions">
            <div class="actions-left"><p>事件处置跟踪</p></div>
            <div class="actions-right">
              <div class="view-btn-group"><el-button v-for="item in disposeTrackViewBtnList" :key="item" :type="activeDisposeTrackView === item ? 'primary' : ''" plain @click="changeDisposeTrackView(item)" class="view-btn">{{ item }}</el-button></div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('eventDisposalTrackingRef')"><el-icon color="#00ccff" size="16"><FullScreen /></el-icon></button>
            </div>
          </div>
          <div v-if="activeDisposeTrackView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1"><div class="indicator-title">平均处置时长</div><div class="indicator-value">{{ formatDecimal(disposeTrackIndicators.avgDisposeDuration) }}</div><div class="indicator-unit">小时</div></div>
              <div class="indicator-card1 card2"><div class="indicator-title">超时处置数</div><div class="indicator-value"><span class="dispose-track-number-animate">{{ disposeTrackIndicators.overtimeCount }}</span></div><div class="indicator-unit">件</div></div>
              <div class="indicator-card1 card3"><div class="indicator-title">已完成处置数</div><div class="indicator-value"><span class="dispose-track-number-animate">{{ disposeTrackIndicators.finishCount }}</span></div><div class="indicator-unit">件</div></div>
            </div>
          </div>
          <div v-if="activeDisposeTrackView === '甘特图'" class="view-content"><FlightGanttChart1 title="各预警事件处置全流程时间轴" /></div>
          <div v-if="activeDisposeTrackView === '柱状图'" class="view-content"><VerticalBar1 :x-axis="disposeUserEfficiencyData.xAxis" :series="disposeUserEfficiencyData.series" unit="小时" title="不同处置人处置效率对比" :key="disposeTrackChartRefreshKey" /></div>
          <div v-if="activeDisposeTrackView === '列表'" class="view-content">
            <div class="table-box4">
              <el-table class="table4" :data="disposeTrackList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row>
                <el-table-column prop="parkAlarmAlarmId" label="预警ID" align="center" width="120" />
                <el-table-column prop="sysAlarmTypeName" label="预警类型" align="center" width="120" />
                <el-table-column prop="sysMaintainUserUserName" label="处置人" align="center" width="140" />
                <el-table-column prop="parkMaintainWorkorderStartTime" label="开始处置时间" align="center" width="160"><template #default="scope">{{ formatTimeStamp(scope.row.parkMaintainWorkorderStartTime) }}</template></el-table-column>
                <el-table-column prop="sysDisposalProgressName" label="处置状态" align="center" width="120"><template #default="scope"><el-tag :type="getDisposeProgressTagType(scope.row.sysDisposalProgressName)">{{ scope.row.sysDisposalProgressName || '-' }}</el-tag></template></el-table-column>
                <el-table-column prop="parkMaintainWorkorderWorkorderNo" label="关联工单号" align="center" width="140" />
                <el-table-column label="操作" align="center" width="220" fixed="right">
                  <template #default="scope">
                    <el-button type="primary" plain size="small" style="width:40px; margin:0 3px;" @click="openDisposeTrackDrawer(scope.row, 'detail')">详情</el-button>
                    <el-button type="warning" plain size="small" style="width:40px; margin:0 3px;" @click="openDisposeTrackDrawer(scope.row, 'cooperate')">协同</el-button>
                    <el-button type="danger" plain size="small" style="width:40px; margin:0 3px;" @click="submitUrgeHandle(scope.row)">催办</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="panel bottom-middle" ref="parkFaultPanelRef">
          <div class="header-actions">
            <div class="actions-left"><p>故障预警视图</p></div>
            <div class="actions-right">
              <div class="view-btn-group"><el-button v-for="item in parkFaultViewBtnList" :key="item" :type="activeParkFaultView === item ? 'primary' : ''" plain @click="changeParkFaultView(item)" class="view-btn">{{ item }}</el-button></div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('parkFaultPanelRef')"><el-icon color="#00ccff" size="16"><FullScreen /></el-icon></button>
            </div>
          </div>
          <div v-if="activeParkFaultView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1"><div class="indicator-title">故障事件总数</div><div class="indicator-value"><span class="park-fault-number-animate">{{ parkFaultIndicators.totalCount }}</span></div><div class="indicator-unit">件</div></div>
              <div class="indicator-card1 card2"><div class="indicator-title">未修复故障数</div><div class="indicator-value"><span class="park-fault-number-animate">{{ parkFaultIndicators.unRepairCount }}</span></div><div class="indicator-unit">件</div></div>
              <div class="indicator-card1 card3"><div class="indicator-title">紧急故障数</div><div class="indicator-value"><span class="park-fault-number-animate">{{ parkFaultIndicators.urgentCount }}</span></div><div class="indicator-unit">件</div></div>
            </div>
          </div>
          <div v-if="activeParkFaultView === '柱状图'" class="view-content">
            <div style="width: 49%;height:100%;display:inline-block;vertical-align:top;"><VerticalBar2 :x-axis="parkFaultAreaData.xAxis" :series="parkFaultAreaData.series" unit="件" title="不同区域故障数对比" :key="parkFaultChartRefreshKey" /></div>
            <div style="width: 49%;height:100%;display:inline-block;vertical-align:top;padding-left:0.3vw;border-left:0.3vh solid #02a6b5;"><VerticalBar1 :x-axis="parkFaultEquipmentData.xAxis" :series="parkFaultEquipmentData.series" unit="件" title="不同设备类型故障数对比" :key="parkFaultChartRefreshKey" /></div>
          </div>
          <div v-if="activeParkFaultView === '饼图'" class="view-content">
            <div style="width:32%;height:100%;display:inline-block;vertical-align:top;"><ChartPie1 :data="parkFaultTypeRatioData" title="故障类型占比" :key="parkFaultChartRefreshKey" /></div>
            <div style="width:32%;height:100%;display:inline-block;vertical-align:top;padding-left:0.3vw;border-left:0.3vh solid #02a6b5;"><ChartPie2 :data="parkFaultEquipmentRatioData" title="设备类型占比" :key="parkFaultChartRefreshKey" /></div>
            <div style="width:32%;height:100%;display:inline-block;vertical-align:top;padding-left:0.3vw;border-left:0.3vh solid #02a6b5;"><ChartPie2 :data="parkFaultTypeRatioData" title="故障等级占比" :key="parkFaultChartRefreshKey" /></div>
          </div>
          <div v-if="activeParkFaultView === '列表'" class="view-content">
            <div class="table-box4">
              <el-table class="table4" :data="parkFaultList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row>
                <el-table-column prop="parkFaultFaultId" label="故障ID" align="center" width="120" />
                <el-table-column prop="sysFaultTypeName" label="故障类型" align="center" width="120" />
                <el-table-column prop="sysEquipmentTypeName" label="设备类型" align="center" width="120" />
                <el-table-column prop="tbDeviceExtendInstallPosition" label="故障位置" align="center" min-width="180" />
                <el-table-column prop="parkFaultFaultTime" label="故障时间" align="center" width="160"><template #default="scope">{{ formatTimeStamp(scope.row.parkFaultFaultTime) }}</template></el-table-column>
                <el-table-column prop="sysMaintenanceProgressName" label="维修进度" align="center" width="120"><template #default="scope"><el-tag :type="getMaintenanceProgressTagType(scope.row.sysMaintenanceProgressName)">{{ scope.row.sysMaintenanceProgressName || '-' }}</el-tag></template></el-table-column>
                <el-table-column label="操作" align="center" width="200" fixed="right">
                  <template #default="scope">
                    <el-button type="primary" plain size="small" style="width:40px; margin:0 3px;" @click="openParkFaultDrawer(scope.row, 'detail')">详情</el-button>
                    <el-button v-if="scope.row.sysMaintenanceProgressName === '未处理'" type="warning" plain size="small" style="width:40px; margin:0 3px;" @click="openParkFaultDrawer(scope.row, 'dispatch')">派单</el-button>
                    <span v-else style="display:inline-block;width:40px;"></span>
                    <el-button type="success" plain size="small" style="width:40px; margin:0 3px;" @click="openParkFaultDrawer(scope.row, 'track')">跟踪</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="panel bottom-right" ref="parkComplianceWarningPanelRef">
          <div class="header-actions">
            <div class="actions-left"><p>合规预警视图</p></div>
            <div class="actions-right">
              <div class="view-btn-group"><el-button v-for="item in parkComplianceWarningViewBtnList" :key="item" :type="activeParkComplianceWarningView === item ? 'primary' : ''" plain @click="changeParkComplianceWarningView(item)" class="view-btn">{{ item }}</el-button></div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('parkComplianceWarningPanelRef')"><el-icon color="#00ccff" size="16"><FullScreen /></el-icon></button>
            </div>
          </div>
          <div v-if="activeParkComplianceWarningView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1"><div class="indicator-title">合规预警总数</div><div class="indicator-value"><span class="park-compliance-warning-number-animate">{{ parkComplianceWarningIndicators.totalCount }}</span></div><div class="indicator-unit">件</div></div>
              <div class="indicator-card1 card2"><div class="indicator-title">未整改预警数</div><div class="indicator-value"><span class="park-compliance-warning-number-animate">{{ parkComplianceWarningIndicators.unRectifyCount }}</span></div><div class="indicator-unit">件</div></div>
              <div class="indicator-card1 card3"><div class="indicator-title">核查通过率</div><div class="indicator-value">{{ formatDecimal(parkComplianceWarningIndicators.passRate) }}</div><div class="indicator-unit">%</div></div>
            </div>
          </div>
          <div v-if="activeParkComplianceWarningView === '柱状图'" class="view-content">
            <div style="width: 49%;height:100%;display:inline-block;vertical-align:top;"><VerticalBar2 :x-axis="parkComplianceWarningAreaData.xAxis" :series="parkComplianceWarningAreaData.series" unit="件" title="不同区域预警数对比" :key="parkComplianceWarningChartRefreshKey" /></div>
            <div style="width: 49%;height:100%;display:inline-block;vertical-align:top;padding-left:0.3vw;border-left:0.3vh solid #02a6b5;"><VerticalBar1 :x-axis="parkComplianceWarningTypeData.xAxis" :series="parkComplianceWarningTypeData.series" unit="件" title="不同违规类型预警数对比" :key="parkComplianceWarningChartRefreshKey" /></div>
          </div>
          <div v-if="activeParkComplianceWarningView === '饼图'" class="view-content">
            <div style="width:32%;height:100%;display:inline-block;vertical-align:top;"><ChartPie1 :data="parkComplianceWarningViolationRatioData" title="违规类型占比" :key="parkComplianceWarningChartRefreshKey" /></div>
            <div style="width:32%;height:100%;display:inline-block;vertical-align:top;padding-left:0.3vw;border-left:0.3vh solid #02a6b5;"><ChartPie2 :data="parkComplianceWarningSubjectRatioData" title="责任主体占比" :key="parkComplianceWarningChartRefreshKey" /></div>
            <div style="width:32%;height:100%;display:inline-block;vertical-align:top;padding-left:0.3vw;border-left:0.3vh solid #02a6b5;"><ChartPie2 :data="parkComplianceWarningViolationRatioData" title="违规风险占比" :key="parkComplianceWarningChartRefreshKey" /></div>
          </div>
          <div v-if="activeParkComplianceWarningView === '列表'" class="view-content">
            <div class="table-box4">
              <el-table class="table4" :data="parkComplianceWarningList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row>
                <el-table-column prop="parkComplianceWarningWarningId" label="合规预警ID" align="center" width="140" />
                <el-table-column prop="sysViolationTypeName" label="违规类型" align="center" width="120" />
                <el-table-column prop="parkComplianceWarningViolationDetail" label="违规详情" align="center" min-width="200" show-overflow-tooltip />
                <el-table-column prop="parkComplianceWarningWarningTime" label="发生时间" align="center" width="160"><template #default="scope">{{ formatTimeStamp(scope.row.parkComplianceWarningWarningTime) }}</template></el-table-column>
                <el-table-column prop="tbAssetExtendAddress" label="发生位置" align="center" min-width="180" />
                <el-table-column prop="sysRectificationStatusName" label="整改状态" align="center" width="120"><template #default="scope"><el-tag :type="getComplianceRectifyStatusTagType(scope.row.sysRectificationStatusName)">{{ scope.row.sysRectificationStatusName || '-' }}</el-tag></template></el-table-column>
                <el-table-column label="操作" align="center" width="200" fixed="right">
                  <template #default="scope">
                    <el-button type="primary" plain size="small" style="width:40px; margin:0 3px;" @click="openParkComplianceWarningDrawer(scope.row, 'detail')">详情</el-button>
                    <el-button v-if="scope.row.sysRectificationStatusName === '未整改'" type="warning" plain size="small" style="width:40px; margin:0 3px;" @click="openParkComplianceWarningDrawer(scope.row, 'rectify')">整改</el-button>
                    <span v-else style="display:inline-block;width:40px;"></span>
                    <el-button v-if="scope.row.sysRectificationStatusName === '整改中'" type="success" plain size="small" style="width:40px; margin:0 3px;" @click="openParkComplianceWarningDrawer(scope.row, 'inspect')">核查</el-button>
                    <span v-else style="display:inline-block;width:40px;"></span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <el-drawer v-model="parkAlarmDrawerVisible" direction="rtl" size="30%" :close-on-click-modal="false" class="park-alarm-drawer" teleport="#page-container">
    <template #title><span v-if="parkAlarmDrawerType === 'detail'">预警事件详情</span><span v-if="parkAlarmDrawerType === 'dispose'">预警事件处置</span><span v-if="parkAlarmDrawerType === 'track'">预警事件跟踪</span></template>
    <div v-if="parkAlarmDrawerType === 'detail'">
      <el-descriptions bordered :column="1" class="desc-detail">
        <el-descriptions-item label="预警ID">{{ parkAlarmSelectedRow.parkAlarmAlarmId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="预警等级"><el-tag :type="getAlarmLevelTagType(parkAlarmSelectedRow.sysAlarmLevelName)">{{ parkAlarmSelectedRow.sysAlarmLevelName || '-' }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="预警类型">{{ parkAlarmSelectedRow.sysAlarmTypeName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="预警时间">{{ formatTimeStamp(parkAlarmSelectedRow.parkAlarmAlarmTime) }}</el-descriptions-item>
        <el-descriptions-item label="责任单位">{{ parkAlarmSelectedRow.sysResponsibleUnitName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="接收时间">{{ formatTimeStamp(parkAlarmSelectedRow.parkAlarmReceiveTime) }}</el-descriptions-item>
        <el-descriptions-item label="处置时长">{{ parkAlarmSelectedRow.parkAlarmDisposalDuration || 0 }} 小时</el-descriptions-item>
        <el-descriptions-item label="关联资产">{{ parkAlarmSelectedRow.tbAssetExtendName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="预警地址">{{ parkAlarmSelectedRow.tbAssetExtendAddress || '-' }}</el-descriptions-item>
        <el-descriptions-item label="关联工单号">{{ parkAlarmSelectedRow.parkMaintainWorkorderWorkorderNo || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="关联证据"><div class="evidence-list"><el-image v-for="(url,idx) in parkAlarmSelectedRow.parkAlarmEvidence" :key="idx" :src="url" fit="cover" :preview-list="parkAlarmSelectedRow.parkAlarmEvidence" /></div></el-descriptions-item>
        <el-descriptions-item label="处置日志">
          <div class="log-list" v-if="parkAlarmSelectedRow.parkAlarmDisposalLog.length"><div class="log-item" v-for="(log,idx) in parkAlarmSelectedRow.parkAlarmDisposalLog" :key="idx"><span class="log-time">{{ formatTimeStamp(log.time) }}</span><span class="log-content">{{ log.content || '-' }}</span></div></div>
          <div class="empty-log" v-else>暂无处置日志</div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div v-if="parkAlarmDrawerType === 'dispose'">
      <el-form :model="disposeForm" :rules="disposeRules" label-width="100px" class="dispose-form" ref="disposeFormRef">
        <el-form-item label="处置措施" prop="disposalMeasure" class="form-item-required">
          <el-input v-model="disposeForm.disposalMeasure" :rows="6" type="textarea" placeholder="请输入处置措施" maxlength="500" show-word-limit clearable autofocus style="width:100%;" />
        </el-form-item>
        <el-form-item label="处置凭证">
          <el-upload v-model:file-list="disposeForm.disposeFileList" list-type="picture-card" :limit="3" :auto-upload="false" accept="image/*"><div><el-icon><UploadFilled /></el-icon></div></el-upload>
          <div>最多上传3张图片，支持jpg/png格式</div>
        </el-form-item>
        <div><el-button type="primary" @click="submitDisposeForm">确认提交</el-button><el-button plain @click="closeParkAlarmDrawer">取消</el-button></div>
      </el-form>
    </div>
    <div v-if="parkAlarmDrawerType === 'track'">
      <el-descriptions bordered :column="1" class="desc-track">
        <el-descriptions-item label="预警ID">{{ parkAlarmSelectedRow.parkAlarmAlarmId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="处置状态"><el-tag :type="getDisposeStatusTagType(parkAlarmSelectedRow.sysDisposalStatusName)">{{ parkAlarmSelectedRow.sysDisposalStatusName || '-' }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="处置进度">{{ parkAlarmSelectedRow.parkAlarmProgress || '-' }}</el-descriptions-item>
        <el-descriptions-item label="关联工单号">{{ parkAlarmSelectedRow.parkMaintainWorkorderWorkorderNo || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="处置时长">{{ parkAlarmSelectedRow.parkAlarmDisposalDuration || 0 }} 小时</el-descriptions-item>
        <el-descriptions-item label="最新处置记录"><div class="feedback-content">{{ parkAlarmSelectedRow.parkAlarmDisposalLog.length ? parkAlarmSelectedRow.parkAlarmDisposalLog[parkAlarmSelectedRow.parkAlarmDisposalLog.length-1].content : '暂无处置记录' }}</div></el-descriptions-item>
      </el-descriptions>
    </div>
  </el-drawer>

  <el-drawer v-model="parkHiddenDangerDrawerVisible" direction="rtl" size="30%" :close-on-click-modal="false" class="park-alarm-drawer" teleport="#page-container">
    <template #title><span v-if="parkHiddenDangerDrawerType === 'detail'">隐患详情</span><span v-if="parkHiddenDangerDrawerType === 'rectify'">隐患整改提交</span><span v-if="parkHiddenDangerDrawerType === 'accept'">隐患验收提交</span></template>
    <div v-if="parkHiddenDangerDrawerType === 'detail'">
      <el-descriptions bordered :column="1" class="desc-detail">
        <el-descriptions-item label="隐患ID">{{ parkHiddenDangerSelectedRow.parkHiddenDangerHiddenDangerId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="风险等级"><el-tag :type="getRiskLevelTagType(parkHiddenDangerSelectedRow.sysRiskLevelName)">{{ parkHiddenDangerSelectedRow.sysRiskLevelName || '-' }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="隐患类型">{{ parkHiddenDangerSelectedRow.sysHiddenDangerTypeName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="发现时间">{{ formatTimeStamp(parkHiddenDangerSelectedRow.parkHiddenDangerDiscoverTime) }}</el-descriptions-item>
        <el-descriptions-item label="整改责任人">{{ parkHiddenDangerSelectedRow.sysUserUserName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="发生位置">{{ parkHiddenDangerSelectedRow.tbAssetExtendAddress || '-' }}</el-descriptions-item>
        <el-descriptions-item label="影响范围">{{ parkHiddenDangerSelectedRow.parkHiddenDangerInfluenceRange || '-' }}</el-descriptions-item>
        <el-descriptions-item label="整改进度"><el-tag :type="getRectifyProgressTagType(parkHiddenDangerSelectedRow.sysRectificationProgressName)">{{ parkHiddenDangerSelectedRow.sysRectificationProgressName || '-' }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="验收状态"><el-tag :type="getAcceptStatusTagType(parkHiddenDangerSelectedRow.parkHiddenDangerAcceptStatus)">{{ parkHiddenDangerSelectedRow.parkHiddenDangerAcceptStatus || '-' }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="整改期限">{{ formatTimeStamp(parkHiddenDangerSelectedRow.parkHiddenDangerRectificationDeadline) }}</el-descriptions-item>
        <el-descriptions-item label="现场照片"><div class="evidence-list"><el-image v-for="(url,idx) in parkHiddenDangerSelectedRow.parkHiddenDangerEvidence" :key="idx" :src="url" fit="cover" :preview-list="parkHiddenDangerSelectedRow.parkHiddenDangerEvidence" /></div></el-descriptions-item>
        <el-descriptions-item label="整改要求"><div class="feedback-content">{{ parkHiddenDangerSelectedRow.parkHiddenDangerRectifyRequire || '-' }}</div></el-descriptions-item>
        <el-descriptions-item label="整改日志">
          <div class="log-list" v-if="parkHiddenDangerSelectedRow.parkHiddenDangerRectifyLog.length"><div class="log-item" v-for="(log,idx) in parkHiddenDangerSelectedRow.parkHiddenDangerRectifyLog" :key="idx"><span class="log-time">{{ formatTimeStamp(log.time) }}</span><span class="log-content">{{ log.content || '-' }}</span></div></div>
          <div class="empty-log" v-else>暂无整改日志</div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div v-if="parkHiddenDangerDrawerType === 'rectify'">
      <el-form :model="rectifyForm" :rules="rectifyRules" label-width="100px" class="dispose-form" ref="rectifyFormRef">
        <el-form-item label="整改方案" prop="rectifyScheme" class="form-item-required">
          <el-input v-model="rectifyForm.rectifyScheme" :rows="6" type="textarea" placeholder="请输入整改方案" maxlength="500" show-word-limit clearable autofocus style="width:100%;" />
        </el-form-item>
        <el-form-item label="整改凭证">
          <el-upload v-model:file-list="rectifyForm.rectifyFileList" list-type="picture-card" :limit="3" :auto-upload="false" accept="image/*"><div><el-icon><UploadFilled /></el-icon></div></el-upload>
          <div>最多上传3张图片，支持jpg/png格式</div>
        </el-form-item>
        <div><el-button type="primary" @click="submitRectifyForm">确认提交</el-button><el-button plain @click="closeParkHiddenDangerDrawer">取消</el-button></div>
      </el-form>
    </div>
    <div v-if="parkHiddenDangerDrawerType === 'accept'">
      <el-form :model="acceptForm" :rules="acceptRules" label-width="100px" class="dispose-form" ref="acceptFormRef">
        <el-form-item label="验收结果" prop="acceptResult" class="form-item-required">
          <el-radio-group v-model="acceptForm.acceptResult" style="width:100%;"><el-radio label="通过">通过</el-radio><el-radio label="未通过">未通过</el-radio></el-radio-group>
        </el-form-item>
        <el-form-item label="验收意见"><el-input v-model="acceptForm.acceptOpinion" :rows="4" type="textarea" placeholder="请输入验收意见（选填）" maxlength="300" show-word-limit clearable style="width:100%;" /></el-form-item>
        <div><el-button type="primary" @click="submitAcceptForm">确认提交</el-button><el-button plain @click="closeParkHiddenDangerDrawer">取消</el-button></div>
      </el-form>
    </div>
  </el-drawer>

  <el-drawer v-model="disposeTrackDrawerVisible" direction="rtl" size="30%" :close-on-click-modal="false" class="park-alarm-drawer" teleport="#page-container">
    <template #title><span v-if="disposeTrackDrawerType === 'detail'">处置跟踪详情</span><span v-if="disposeTrackDrawerType === 'cooperate'">协同处置申请</span></template>
    <div v-if="disposeTrackDrawerType === 'detail'">
      <el-descriptions bordered :column="1" class="desc-detail">
        <el-descriptions-item label="预警ID">{{ disposeTrackSelectedRow.parkAlarmAlarmId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="预警类型">{{ disposeTrackSelectedRow.sysAlarmTypeName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="处置人">{{ disposeTrackSelectedRow.sysMaintainUserUserName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="开始处置时间">{{ formatTimeStamp(disposeTrackSelectedRow.parkMaintainWorkorderStartTime) }}</el-descriptions-item>
        <el-descriptions-item label="处置状态"><el-tag :type="getDisposeProgressTagType(disposeTrackSelectedRow.sysDisposalProgressName)">{{ disposeTrackSelectedRow.sysDisposalProgressName || '-' }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="派单耗时">{{ disposeTrackSelectedRow.parkMaintainWorkorderDispatchDuration || 0 }} 小时</el-descriptions-item>
        <el-descriptions-item label="处置耗时">{{ disposeTrackSelectedRow.parkMaintainWorkorderDealTime || 0 }} 小时</el-descriptions-item>
        <el-descriptions-item label="预计完成时间">{{ formatTimeStamp(disposeTrackSelectedRow.parkMaintainWorkorderExpectedFinishTime) }}</el-descriptions-item>
        <el-descriptions-item label="关联工单号">{{ disposeTrackSelectedRow.parkMaintainWorkorderWorkorderNo || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="处置凭证"><div class="evidence-list"><el-image v-for="(url,idx) in disposeTrackSelectedRow.parkAlarmEvidence" :key="idx" :src="url" fit="cover" :preview-list="disposeTrackSelectedRow.parkAlarmEvidence" /></div></el-descriptions-item>
        <el-descriptions-item label="处置全流程日志">
          <div class="log-list" v-if="disposeTrackSelectedRow.disposeAllLog.length"><div class="log-item" v-for="(log,idx) in disposeTrackSelectedRow.disposeAllLog" :key="idx"><span class="log-time">{{ formatTimeStamp(log.time) }}</span><span class="log-content">{{ log.content || '-' }}</span></div></div>
          <div class="empty-log" v-else>暂无处置日志</div>
        </el-descriptions-item>
        <el-descriptions-item label="最新动态">{{ disposeTrackSelectedRow.parkMaintainWorkorderLatestDynamic || '-' }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div v-if="disposeTrackDrawerType === 'cooperate'">
      <el-form :model="cooperateForm" :rules="cooperateRules" label-width="100px" class="dispose-form" ref="cooperateFormRef">
        <el-form-item label="协同人员" prop="cooperateUser" class="form-item-required"><el-input v-model="cooperateForm.cooperateUser" placeholder="请输入协同人员，多个人员用英文逗号分隔" clearable style="width:100%;" /></el-form-item>
        <el-form-item label="协同理由" prop="cooperateReason" class="form-item-required"><el-input v-model="cooperateForm.cooperateReason" :rows="6" type="textarea" placeholder="请输入协同理由" maxlength="300" show-word-limit clearable autofocus style="width:100%;" /></el-form-item>
        <div><el-button type="primary" @click="submitCooperateForm">确认提交</el-button><el-button plain @click="closeDisposeTrackDrawer">取消</el-button></div>
      </el-form>
    </div>
  </el-drawer>

  <el-drawer v-model="parkAbnormalDrawerVisible" direction="rtl" size="30%" :close-on-click-modal="false" class="park-alarm-drawer" teleport="#page-container">
    <template #title>
      <span v-if="parkAbnormalDrawerType === 'detail'">异常事件详情</span>
      <span v-if="parkAbnormalDrawerType === 'dispose'">异常事件处置</span>
      <span v-if="parkAbnormalDrawerType === 'relieve'">异常事件解除</span>
    </template>
    <div v-if="parkAbnormalDrawerType === 'detail'">
      <el-descriptions bordered :column="1" class="desc-detail">
        <el-descriptions-item label="异常ID">{{ parkAbnormalSelectedRow.parkAbnormalAbnormalId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="异常类型"><el-tag :type="getAbnormalTypeTagType(parkAbnormalSelectedRow.sysAbnormalTypeName)">{{ parkAbnormalSelectedRow.sysAbnormalTypeName || '-' }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="异常原因"><div class="feedback-content">{{ parkAbnormalSelectedRow.parkAbnormalAbnormalReason || '-' }}</div></el-descriptions-item>
        <el-descriptions-item label="异常时间">{{ formatTimeStamp(parkAbnormalSelectedRow.parkAbnormalAbnormalTime) }}</el-descriptions-item>
        <el-descriptions-item label="责任运维">{{ parkAbnormalSelectedRow.sysUserUserName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="异常位置">{{ parkAbnormalSelectedRow.tbAssetExtendAddress || '-' }}</el-descriptions-item>
        <el-descriptions-item label="关联设备">{{ parkAbnormalSelectedRow.tbAssetExtendName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="设备类型">{{ parkAbnormalSelectedRow.sysAssociatedObjectTypeName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="解除状态"><el-tag :type="getAbnormalStatusTagType(parkAbnormalSelectedRow.parkAbnormalRelieveStatus)">{{ parkAbnormalSelectedRow.parkAbnormalRelieveStatus || '-' }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="解除时间">{{ formatTimeStamp(parkAbnormalSelectedRow.parkAbnormalRelieveTime) }}</el-descriptions-item>
        <el-descriptions-item label="异常时长">{{ parkAbnormalSelectedRow.parkAbnormalDuration || 0 }} 小时</el-descriptions-item>
        <el-descriptions-item label="现场凭证"><div class="evidence-list"><el-image v-for="(url,idx) in parkAbnormalSelectedRow.parkAbnormalEvidence" :key="idx" :src="url" fit="cover" :preview-list="parkAbnormalSelectedRow.parkAbnormalEvidence" /></div></el-descriptions-item>
        <el-descriptions-item label="处置日志">
          <div class="log-list" v-if="parkAbnormalSelectedRow.parkAbnormalDisposeLog.length"><div class="log-item" v-for="(log,idx) in parkAbnormalSelectedRow.parkAbnormalDisposeLog" :key="idx"><span class="log-time">{{ formatTimeStamp(log.time) }}</span><span class="log-content">{{ log.content || '-' }}</span></div></div>
          <div class="empty-log" v-else>暂无处置日志</div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div v-if="parkAbnormalDrawerType === 'dispose'">
      <el-form :model="abnormalDisposeForm" :rules="abnormalDisposeRules" label-width="100px" class="dispose-form" ref="abnormalDisposeFormRef">
        <el-form-item label="处置措施" prop="disposeMeasure" class="form-item-required">
          <el-input v-model="abnormalDisposeForm.disposeMeasure" :rows="6" type="textarea" placeholder="请输入处置措施" maxlength="300" show-word-limit clearable autofocus style="width:100%;" />
        </el-form-item>
        <el-form-item label="处置凭证">
          <el-upload v-model:file-list="abnormalDisposeForm.disposeFileList" list-type="picture-card" :limit="3" :auto-upload="false" accept="image/*"><div><el-icon><UploadFilled /></el-icon></div></el-upload>
          <div>最多上传3张图片，支持jpg/png格式</div>
        </el-form-item>
        <div><el-button type="primary" @click="submitAbnormalDisposeForm">确认提交</el-button><el-button plain @click="closeParkAbnormalDrawer">取消</el-button></div>
      </el-form>
    </div>
    <div v-if="parkAbnormalDrawerType === 'relieve'">
      <div class="feedback-content" style="padding:20px;text-align:center;margin:20px 0;">
        <p style="font-size:16px;margin-bottom:20px;">确认解除【{{parkAbnormalSelectedRow.parkAbnormalAbnormalId}}】该异常事件吗？</p>
        <p style="color:#eb5757;">解除后将更新异常状态为「已解除」，并记录解除时间</p>
      </div>
      <div style="text-align:center;">
        <el-button type="success" size="default" @click="submitAbnormalRelieveForm">确认解除</el-button>
        <el-button plain style="margin-left:20px;" @click="closeParkAbnormalDrawer">取消</el-button>
      </div>
    </div>
  </el-drawer>

  <!-- ========== 故障预警抽屉弹窗 ========== -->
  <el-drawer v-model="parkFaultDrawerVisible" direction="rtl" size="30%" :close-on-click-modal="false" class="park-alarm-drawer" teleport="#page-container">
    <template #title><span v-if="parkFaultDrawerType === 'detail'">故障事件详情</span><span v-if="parkFaultDrawerType === 'dispatch'">故障派单提交</span><span v-if="parkFaultDrawerType === 'track'">故障维修跟踪</span></template>
    <div v-if="parkFaultDrawerType === 'detail'">
      <el-descriptions bordered :column="1" class="desc-detail">
        <el-descriptions-item label="故障ID">{{ parkFaultSelectedRow.parkFaultFaultId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="故障类型">{{ parkFaultSelectedRow.sysFaultTypeName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="设备类型">{{ parkFaultSelectedRow.sysEquipmentTypeName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="设备编号">{{ parkFaultSelectedRow.tbDeviceExtendDeviceCode || '-' }}</el-descriptions-item>
        <el-descriptions-item label="故障等级"><el-tag :type="getFaultLevelTagType(parkFaultSelectedRow.parkFaultFaultLevel)">{{ parkFaultSelectedRow.parkFaultFaultLevel || '-' }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="故障位置">{{ parkFaultSelectedRow.tbDeviceExtendInstallPosition || '-' }}</el-descriptions-item>
        <el-descriptions-item label="故障时间">{{ formatTimeStamp(parkFaultSelectedRow.parkFaultFaultTime) }}</el-descriptions-item>
        <el-descriptions-item label="维修进度"><el-tag :type="getMaintenanceProgressTagType(parkFaultSelectedRow.sysMaintenanceProgressName)">{{ parkFaultSelectedRow.sysMaintenanceProgressName || '-' }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="维修人员">{{ parkFaultSelectedRow.sysMaintainUserUserName || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="预计修复时间">{{ formatTimeStamp(parkFaultSelectedRow.parkMaintainWorkorderExpectedFinishTime) }}</el-descriptions-item>
        <el-descriptions-item label="关联工单号">{{ parkFaultSelectedRow.parkMaintainWorkorderWorkorderNo || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="故障时长">{{ parkFaultSelectedRow.parkFaultDuration || 0 }} 小时</el-descriptions-item>
        <el-descriptions-item label="故障凭证"><div class="evidence-list"><el-image v-for="(url,idx) in parkFaultSelectedRow.parkFaultEvidence" :key="idx" :src="url" fit="cover" :preview-list="parkFaultSelectedRow.parkFaultEvidence" /></div></el-descriptions-item>
        <el-descriptions-item label="维修日志">
          <div class="log-list" v-if="parkFaultSelectedRow.parkFaultRepairLog.length"><div class="log-item" v-for="(log,idx) in parkFaultSelectedRow.parkFaultRepairLog" :key="idx"><span class="log-time">{{ formatTimeStamp(log.time) }}</span><span class="log-content">{{ log.content || '-' }}</span></div></div>
          <div class="empty-log" v-else>暂无维修日志</div>
        </el-descriptions-item>
        <el-descriptions-item label="配件使用清单">
          <div class="log-list" v-if="parkFaultSelectedRow.parkFaultPartsList.length"><div class="log-item" v-for="(item,idx) in parkFaultSelectedRow.parkFaultPartsList" :key="idx"><span class="log-content">{{ item.name }} × {{ item.count }} {{ item.unit }}</span></div></div>
          <div class="empty-log" v-else>暂无配件使用记录</div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div v-if="parkFaultDrawerType === 'dispatch'">
      <el-form :model="dispatchForm" :rules="dispatchRules" label-width="100px" class="dispose-form" ref="dispatchFormRef">
        <el-form-item label="维修人员" prop="maintainUser" class="form-item-required">
          <el-input v-model="dispatchForm.maintainUser" placeholder="请输入维修人员姓名/工号" clearable autofocus style="width:100%;" />
        </el-form-item>
        <el-form-item label="维修要求" prop="maintainRequire">
          <el-input v-model="dispatchForm.maintainRequire" :rows="4" type="textarea" placeholder="请输入维修要求（选填）" maxlength="300" show-word-limit clearable style="width:100%;" />
        </el-form-item>
        <div><el-button type="primary" @click="submitDispatchForm">确认派单</el-button><el-button plain @click="closeParkFaultDrawer">取消</el-button></div>
      </el-form>
    </div>
    <div v-if="parkFaultDrawerType === 'track'">
      <el-descriptions bordered :column="1" class="desc-detail">
        <el-descriptions-item label="故障ID">{{ parkFaultSelectedRow.parkFaultFaultId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="维修进度"><el-tag :type="getMaintenanceProgressTagType(parkFaultSelectedRow.sysMaintenanceProgressName)">{{ parkFaultSelectedRow.sysMaintenanceProgressName || '-' }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="关联工单号">{{ parkFaultSelectedRow.parkMaintainWorkorderWorkorderNo || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="维修人员">{{ parkFaultSelectedRow.sysMaintainUserUserName || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="预计修复时间">{{ formatTimeStamp(parkFaultSelectedRow.parkMaintainWorkorderExpectedFinishTime) }}</el-descriptions-item>
        <el-descriptions-item label="维修日志">
          <div class="log-list" v-if="parkFaultSelectedRow.parkFaultRepairLog.length"><div class="log-item" v-for="(log,idx) in parkFaultSelectedRow.parkFaultRepairLog" :key="idx"><span class="log-time">{{ formatTimeStamp(log.time) }}</span><span class="log-content">{{ log.content || '-' }}</span></div></div>
          <div class="empty-log" v-else>暂无维修日志</div>
        </el-descriptions-item>
        <el-descriptions-item label="配件使用清单">
          <div class="log-list" v-if="parkFaultSelectedRow.parkFaultPartsList.length"><div class="log-item" v-for="(item,idx) in parkFaultSelectedRow.parkFaultPartsList" :key="idx"><span class="log-content">{{ item.name }} × {{ item.count }} {{ item.unit }}</span></div></div>
          <div class="empty-log" v-else>暂无配件使用记录</div>
        </el-descriptions-item>
<!--        <el-descriptions-item label="最新动态">{{ parkFaultSelectedRow.parkFaultLatestDynamic || '-' }}</el-descriptions-item>-->
      </el-descriptions>
    </div>
  </el-drawer>

  <!-- ========== 合规预警抽屉弹窗 ========== -->
  <el-drawer v-model="parkComplianceWarningDrawerVisible" direction="rtl" size="30%" :close-on-click-modal="false" class="park-alarm-drawer" teleport="#page-container">
    <template #title><span v-if="parkComplianceWarningDrawerType === 'detail'">合规预警详情</span><span v-if="parkComplianceWarningDrawerType === 'rectify'">合规预警整改提交</span><span v-if="parkComplianceWarningDrawerType === 'inspect'">合规预警核查提交</span></template>
    <div v-if="parkComplianceWarningDrawerType === 'detail'">
      <el-descriptions bordered :column="1" class="desc-detail">
        <el-descriptions-item label="合规预警ID">{{ parkComplianceWarningSelectedRow.parkComplianceWarningWarningId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="违规类型">{{ parkComplianceWarningSelectedRow.sysViolationTypeName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="违规详情"><div class="feedback-content">{{ parkComplianceWarningSelectedRow.parkComplianceWarningViolationDetail || '-' }}</div></el-descriptions-item>
        <el-descriptions-item label="发生时间">{{ formatTimeStamp(parkComplianceWarningSelectedRow.parkComplianceWarningWarningTime) }}</el-descriptions-item>
        <el-descriptions-item label="发生位置">{{ parkComplianceWarningSelectedRow.tbAssetExtendAddress || '-' }}</el-descriptions-item>
        <el-descriptions-item label="整改状态"><el-tag :type="getComplianceRectifyStatusTagType(parkComplianceWarningSelectedRow.sysRectificationStatusName)">{{ parkComplianceWarningSelectedRow.sysRectificationStatusName || '-' }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="责任主体">{{ parkComplianceWarningSelectedRow.sysResponsibleSubjectTypeName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="合规标准"><div class="feedback-content">{{ parkComplianceWarningSelectedRow.parkComplianceWarningComplianceStandard || '-' }}</div></el-descriptions-item>
        <el-descriptions-item label="整改期限">{{ formatTimeStamp(parkComplianceWarningSelectedRow.parkComplianceWarningRectificationDeadline) }}</el-descriptions-item>
        <el-descriptions-item label="核查结果"><el-tag :type="getComplianceInspectResultTagType(parkComplianceWarningSelectedRow.parkComplianceWarningInspectionResult)">{{ parkComplianceWarningSelectedRow.parkComplianceWarningInspectionResult || '-' }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="违规证据"><div class="evidence-list"><el-image v-for="(url,idx) in parkComplianceWarningSelectedRow.parkComplianceWarningEvidence" :key="idx" :src="url" fit="cover" :preview-list="parkComplianceWarningSelectedRow.parkComplianceWarningEvidence" /></div></el-descriptions-item>
        <el-descriptions-item label="整改日志">
          <div class="log-list" v-if="parkComplianceWarningSelectedRow.parkComplianceWarningRectifyLog.length"><div class="log-item" v-for="(log,idx) in parkComplianceWarningSelectedRow.parkComplianceWarningRectifyLog" :key="idx"><span class="log-time">{{ formatTimeStamp(log.time) }}</span><span class="log-content">{{ log.content || '-' }}</span></div></div>
          <div class="empty-log" v-else>暂无整改日志</div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div v-if="parkComplianceWarningDrawerType === 'rectify'">
      <el-form :model="complianceRectifyForm" :rules="complianceRectifyRules" label-width="100px" class="dispose-form" ref="complianceRectifyFormRef">
        <el-form-item label="整改方案" prop="rectifyScheme" class="form-item-required">
          <el-input v-model="complianceRectifyForm.rectifyScheme" :rows="6" type="textarea" placeholder="请输入整改方案" maxlength="500" show-word-limit clearable autofocus style="width:100%;" />
        </el-form-item>
        <el-form-item label="整改凭证">
          <el-upload v-model:file-list="complianceRectifyForm.rectifyFileList" list-type="picture-card" :limit="3" :auto-upload="false" accept="image/*"><div><el-icon><UploadFilled /></el-icon></div></el-upload>
          <div>最多上传3张图片，支持jpg/png格式</div>
        </el-form-item>
        <div><el-button type="primary" @click="submitComplianceRectifyForm">确认提交</el-button><el-button plain @click="closeParkComplianceWarningDrawer">取消</el-button></div>
      </el-form>
    </div>
    <div v-if="parkComplianceWarningDrawerType === 'inspect'">
      <el-form :model="complianceInspectForm" :rules="complianceInspectRules" label-width="100px" class="dispose-form" ref="complianceInspectFormRef">
        <el-form-item label="核查结果" prop="inspectionResult" class="form-item-required">
          <el-radio-group v-model="complianceInspectForm.inspectionResult" style="width:100%;"><el-radio label="通过">通过</el-radio><el-radio label="未通过">未通过</el-radio></el-radio-group>
        </el-form-item>
        <el-form-item label="核查意见"><el-input v-model="complianceInspectForm.inspectionOpinion" :rows="4" type="textarea" placeholder="请输入核查意见（选填）" maxlength="300" show-word-limit clearable style="width:100%;" /></el-form-item>
        <div><el-button type="primary" @click="submitComplianceInspectForm">确认提交</el-button><el-button plain @click="closeParkComplianceWarningDrawer">取消</el-button></div>
      </el-form>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
@import '../../../templatesstyle/common';
@import '../../../templatesstyle/table4';
@import '../../../templatesstyle/indicator-cards1';

.page-container {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  padding: 0 20px;
  overflow: hidden;
  color: #fff;
  background: url('../../images/bg.jpg');
  background-size: 100% 100%;
}

.mainbox {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.6vw;
  height: 91vh;
  margin: 0 auto;
  overflow: hidden;
}

.top { display: flex; gap: 0.6vw; height: 60%; overflow: hidden; }
.top-left { flex: 1; }
.top-middle { flex: 1; }
.top-right { flex: 1; }
.bottom { display: flex; gap: 0.6vw;	height: 36%; overflow: hidden; }
.bottom-left { flex: 1; }
.bottom-middle { flex: 1; }
.bottom-right { flex: 1; }

.panel {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 0.5vw;
  background: url('../../images/line(1).png') rgb(255 255 255 / 4%);
  border: 0.2vh solid rgb(25 186 139 / 17%);
  overflow: hidden;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 0.2vw;
  margin-bottom: 0.5vw;
  .actions-left p { margin: 0; font-size: 0.9vw; font-weight: 500; color: #00ffd0; }
  .actions-right { display: flex; align-items: center; gap: 0.8vw; }
  .panel-fullscreen-btn { background: transparent; border: none; padding: 0; cursor: pointer; color: #00ccff; margin-right: 0.5vw; }
}

.view-content {
  box-sizing: border-box;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  > div { width: 100%; height: 100%; }
}

:deep(.view-btn) {
  padding: 0 0.4vw;
  font-size: 0.6vw;
  color: #fff;
  background-color: transparent;
  border-color: rgb(25 186 139 / 60%);
  &:hover { color: #00ffd0; border-color: #00ffd0; }
  &.el-button--primary { color: #afc2ff; background-color: rgb(0 204 255 / 20%); border-color: rgb(25 186 139 / 60%); }
}

:deep(.el-table) {
  width: 100% !important;
  table-layout: fixed !important;
  height: 100% !important;
  table { width: 100% !important; table-layout: fixed !important; }
  .el-table__body-wrapper { width: 100% !important; overflow-x: auto !important; }
}

:deep(.el-tag) {
  font-size: 0.7vw;
  &.el-tag--success { color: #2eb861; background: rgb(46 184 97 / 20%); border-color: rgb(46 184 97 / 50%); }
  &.el-tag--warning { color: #fad514; background: rgb(250 173 20 / 20%); border-color: rgb(250 173 20 / 50%); }
  &.el-tag--danger { color: #eb5757; background: rgb(235 87 87 / 20%); border-color: rgb(235 87 87 / 50%); }
  &.el-tag--info { color: #4299e1; background: rgb(66 153 225 / 20%); border-color: rgb(66 153 225 / 50%); }
  &.el-tag--primary { color: #9f7aea; background: rgb(159 122 234 / 20%); border-color: rgb(159 122 234 / 50%); }
}

:deep(.park-alarm-drawer) {
  --el-drawer-bg-color: #ffffff !important;
  --el-text-color-primary: #000000 !important;
  background: var(--el-drawer-bg-color) !important;
  color: var(--el-text-color-primary) !important;
  border-left: 0.2vh solid rgb(0 198 255 / 30%) !important;

  .el-drawer__header { border-bottom: 1px solid rgb(0 198 255 / 30%); padding: 0.5vw 0.8vw; }
  .el-drawer__title { font-size: 0.9vw; font-weight: 500; color: #000; }
  .el-drawer__close-btn { color: #000; &:hover { color: rgb(0 122 255 / 70%); } }
  .el-drawer__body { padding: 0.8vw; max-height: 90vh; overflow: auto; }

  .el-descriptions { width:100%; font-size:0.7vw; .el-descriptions__label { color:#000; font-weight:500; width:4vw; } }
  .evidence-list { display:flex; gap:0.5vw; flex-wrap:wrap; margin-top:0.5vw; }
  .evidence-list :deep(.el-image) { width:6vw; height:4.5vh; border-radius:0.2vw; }
  .log-list { margin-top:0.5vw; border:1px solid rgb(0 204 255 / 15%); border-radius:0.2vw; padding:0.5vw; }
  .log-item { display:flex; flex-direction:column; margin-bottom:0.5vh; padding-bottom:0.5vh; border-bottom:1px dashed rgb(0 204 255 / 15%); }
  .log-time { font-weight:500; color: rgb(0 82 103 / 80%); font-size:0.7vw; }
  .log-content { color:#000; font-size:0.7vw; }
  .empty-log { padding:0.5vw; text-align:center; color: rgb(0 0 0 / 60%); font-size:0.7vw; }
  .feedback-content { padding:0.5vw; border:1px solid rgb(0 204 255 / 15%); border-radius:0.2vw; min-height:8vh; color:#000; font-size:0.7vw; background: rgb(255 255 255 / 90%); }

  .dispose-form { width:100%; padding:10px 0; .el-form-item { margin-bottom:1vh; } .el-form-item__label { font-size:0.7vw; color:#000; font-weight:500; } }
  .form-item-required label::after { content:'*'; color:#eb5757; margin-left:0.2vw; }
}
</style>
