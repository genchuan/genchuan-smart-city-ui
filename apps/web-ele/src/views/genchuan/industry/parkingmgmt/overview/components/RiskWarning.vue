<script setup lang="ts">
import {
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from 'vue';
import { useRouter } from 'vue-router';

import {
  Filter,
  FullScreen,
  Refresh,
  UploadFilled,
} from '@element-plus/icons-vue';
import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElForm,
  ElFormItem,
  ElImage,
  ElMessage,
  ElTable,
  ElTableColumn,
  ElTag,
  ElUpload,
} from 'element-plus';
import screenFull from 'screenfull';

import {
  fetchParkAbnormalAreaCount,
  fetchParkAbnormalDetail,
  fetchParkAbnormalIndicators,
  fetchParkAbnormalList,
  fetchParkAbnormalTrend,
  fetchParkAbnormalTypeCount,
  fetchParkAlarmAreaCount,
  fetchParkAlarmDetail,
  fetchParkAlarmIndicators,
  fetchParkAlarmLevelRatio,
  fetchParkAlarmList,
  fetchParkAlarmStatusRatio,
  fetchParkAlarmTrackInfo,
  fetchParkAlarmTypeCount,
  fetchParkAlarmTypeRatio,
  fetchParkComplianceWarningAreaCount,
  fetchParkComplianceWarningDetail,
  fetchParkComplianceWarningIndicators,
  fetchParkComplianceWarningList,
  fetchParkComplianceWarningSubjectRatio,
  fetchParkComplianceWarningTypeCount,
  fetchParkComplianceWarningViolationRatio,
  fetchParkDisposeTrackDetail,
  fetchParkDisposeTrackIndicators,
  fetchParkDisposeTrackList,
  fetchParkDisposeUserEfficiency,
  fetchParkFaultAreaCount,
  fetchParkFaultDetail,
  fetchParkFaultEquipmentCount,
  fetchParkFaultEquipmentRatio,
  fetchParkFaultIndicators,
  fetchParkFaultList,
  fetchParkFaultTrackInfo,
  fetchParkFaultTypeRatio,
  fetchParkHiddenDangerAreaCount,
  fetchParkHiddenDangerDetail,
  fetchParkHiddenDangerIndicators,
  fetchParkHiddenDangerLevelRatio,
  fetchParkHiddenDangerList,
  fetchParkHiddenDangerTypeCount,
  fetchParkHiddenDangerTypeRatio,
  submitParkAbnormalDispose,
  submitParkAbnormalRelieve,
  submitParkAlarmDisposal,
  submitParkComplianceWarningInspect,
  submitParkComplianceWarningRectify,
  submitParkDisposeCooperate,
  submitParkDisposeUrge,
  submitParkFaultDispatch,
  submitParkHiddenDangerAccept,
  submitParkHiddenDangerRectify,
} from '#/api/genchuan/industry/parkingmgmt/overview/RiskWarning.ts';
import FlightGanttChart1 from '#/views/genchuan/industry/parkingmgmt/overview/components/FlightGanttChart1.vue';
import ChartLine1 from '#/views/genchuan/industry/templatesstatchart/ChartLine1.vue';
import ChartPie1 from '#/views/genchuan/industry/templatesstatchart/ChartPie1.vue';
import ChartPie2 from '#/views/genchuan/industry/templatesstatchart/ChartPie2.vue';
import VerticalBar1 from '#/views/genchuan/industry/templatesstatchart/VerticalBar1.vue';
import VerticalBar2 from '#/views/genchuan/industry/templatesstatchart/VerticalBar2.vue';

const router = useRouter();
const instance = getCurrentInstance();
const currentFullscreenPanel = ref<HTMLElement | null>(null);

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
    element.textContent = formatNumber(
      Math.floor(progress * (end - start) + start),
    );
    if (progress < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
};
const initParkAlarmNumberAnimations = () => {
  document
    .querySelectorAll('.park-alarm-number-animate')
    .forEach((el) =>
      animateValue(
        el as HTMLElement,
        0,
        Number((el as HTMLElement).textContent || 0),
        1500,
      ),
    );
};
const initParkHiddenDangerNumberAnimations = () => {
  document
    .querySelectorAll('.park-hidden-danger-number-animate')
    .forEach((el) =>
      animateValue(
        el as HTMLElement,
        0,
        Number((el as HTMLElement).textContent || 0),
        1500,
      ),
    );
};
const initDisposeTrackNumberAnimations = () => {
  document
    .querySelectorAll('.dispose-track-number-animate')
    .forEach((el) =>
      animateValue(
        el as HTMLElement,
        0,
        Number((el as HTMLElement).textContent || 0),
        1500,
      ),
    );
};
const initParkAbnormalNumberAnimations = () => {
  document
    .querySelectorAll('.park-abnormal-number-animate')
    .forEach((el) =>
      animateValue(
        el as HTMLElement,
        0,
        Number((el as HTMLElement).textContent || 0),
        1500,
      ),
    );
};

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
      parkAlarmChartRefreshKey.value++;
      parkHiddenDangerChartRefreshKey.value++;
      parkAbnormalChartRefreshKey.value++;
      disposeTrackChartRefreshKey.value++;
      parkFaultChartRefreshKey.value++;
      parkComplianceWarningChartRefreshKey.value++;
    }, 300);
  } else if (currentFullscreenPanel.value) {
    currentFullscreenPanel.value.style = '';
    nextTick(() => {
      parkAlarmChartRefreshKey.value++;
      parkHiddenDangerChartRefreshKey.value++;
      parkAbnormalChartRefreshKey.value++;
      disposeTrackChartRefreshKey.value++;
      parkFaultChartRefreshKey.value++;
      parkComplianceWarningChartRefreshKey.value++;
    });
    currentFullscreenPanel.value = null;
  }
};

// TS类型定义
interface ParkAlarmDisposalLog {
  time: number | string;
  content: string;
}
interface ParkAlarmRow {
  parkAlarmAlarmId: string;
  sysAlarmLevelName: string;
  sysAlarmTypeName: string;
  parkAlarmAlarmTime: number | string;
  tbAssetExtendName: string;
  tbAssetExtendAddress: string;
  sysDisposalStatusName: string;
  sysResponsibleUnitName: string;
  parkAlarmReceiveTime: number | string;
  parkAlarmDisposalDuration: number;
  parkMaintainWorkorderWorkorderNo: string;
  parkAlarmEvidence: string[];
  parkAlarmDisposalLog: ParkAlarmDisposalLog[];
  parkAlarmProgress: string;
}
interface ParkAlarmIndicators {
  totalCount: number;
  urgentCount: number;
  highCount: number;
  midCount: number;
  lowCount: number;
  undisposedCount: number;
}

interface ParkHiddenDangerRectifyLog {
  time: number | string;
  content: string;
}
interface ParkHiddenDangerRow {
  parkHiddenDangerHiddenDangerId: string;
  sysRiskLevelName: string;
  sysHiddenDangerTypeName: string;
  tbAssetExtendAddress: string;
  parkHiddenDangerInfluenceRange: string;
  sysRectificationProgressName: string;
  parkHiddenDangerRectificationDeadline: number | string;
  tbAssetExtendName: string;
  parkHiddenDangerDiscoverTime: number | string;
  sysUserUserName: string;
  parkHiddenDangerAcceptStatus: string;
  parkHiddenDangerEvidence: string[];
  parkHiddenDangerRectifyRequire: string;
  parkHiddenDangerRectifyLog: ParkHiddenDangerRectifyLog[];
}
interface ParkHiddenDangerIndicators {
  totalCount: number;
  majorCount: number;
  importantCount: number;
  normalCount: number;
  lowCount: number;
  overdueUnRectifyCount: number;
}
interface RectifyForm {
  rectifyScheme: string;
  rectifyFileList: any[];
}
interface AcceptForm {
  acceptResult: string;
  acceptOpinion: string;
}
interface SubmitRectifyParams {
  parkHiddenDangerHiddenDangerId: string;
  rectifyScheme: string;
  rectifyEvidence: string[];
}
interface SubmitAcceptParams {
  parkHiddenDangerHiddenDangerId: string;
  acceptResult: string;
  acceptOpinion?: string;
}

interface DisposeTrackLog {
  time: number | string;
  content: string;
}
interface DisposeTrackRow {
  parkAlarmAlarmId: string;
  sysAlarmTypeName: string;
  sysMaintainUserUserName: string;
  parkMaintainWorkorderStartTime: number | string;
  sysDisposalProgressName: string;
  parkMaintainWorkorderWorkorderNo: string;
  parkMaintainWorkorderExpectedFinishTime: number | string;
  parkMaintainWorkorderLatestDynamic: string;
  parkMaintainWorkorderDispatchDuration: number;
  parkMaintainWorkorderDealTime: number;
  parkAlarmEvidence: string[];
  disposeAllLog: DisposeTrackLog[];
}
interface DisposeTrackIndicators {
  avgDisposeDuration: number;
  overtimeCount: number;
  finishCount: number;
  disposingCount: number;
}
interface SubmitCooperateParams {
  parkAlarmAlarmId: string;
  cooperateUser: string[];
  cooperateReason: string;
}
interface SubmitUrgeParams {
  parkAlarmAlarmId: string;
  parkMaintainWorkorderWorkorderNo: string;
}
interface SubmitDisposeParams {
  parkAlarmAlarmId: string;
  disposalMeasure: string;
  disposalEvidence: string[];
}

interface ParkAbnormalDisposeLog {
  time: number | string;
  content: string;
}
interface ParkAbnormalRow {
  parkAbnormalAbnormalId: string;
  sysAbnormalTypeName: string;
  parkAbnormalAbnormalReason: string;
  parkAbnormalAbnormalTime: number | string;
  tbAssetExtendAddress: string;
  sysAssociatedObjectTypeName: string;
  parkAbnormalRelieveStatus: string;
  tbAssetExtendName: string;
  sysUserUserName: string;
  parkAbnormalRelieveTime: number | string;
  parkAbnormalEvidence: string[];
  parkAbnormalDisposeLog: ParkAbnormalDisposeLog[];
  parkAbnormalDuration?: number;
}
interface ParkAbnormalIndicators {
  totalCount: number;
  unRelieveCount: number;
  deviceAbnormalCount: number;
  dataAbnormalCount: number;
  commAbnormalCount: number;
}
interface AbnormalDisposeForm {
  disposeMeasure: string;
  disposeFileList: any[];
}
interface SubmitAbnormalDisposeParams {
  parkAbnormalAbnormalId: string;
  disposeMeasure: string;
  disposeEvidence: string[];
}
interface SubmitAbnormalRelieveParams {
  parkAbnormalAbnormalId: string;
}

interface ChartRatioData {
  legend: string[];
  series: { data: number[]; name: string }[];
}
interface ChartBarData {
  xAxis: string[];
  series: { data: number[]; name: string }[];
}

interface ParkFaultRepairLog {
  time: number | string;
  content: string;
}
interface ParkFaultParts {
  name: string;
  count: number;
  unit: string;
}
interface ParkFaultRow {
  parkFaultFaultId: string;
  sysFaultTypeName: string;
  sysEquipmentTypeName: string;
  tbDeviceExtendInstallPosition: string;
  parkFaultFaultTime: number | string;
  sysMaintenanceProgressName: string;
  tbDeviceExtendDeviceCode: string;
  parkFaultFaultLevel: string;
  sysMaintainUserUserName: string;
  parkMaintainWorkorderExpectedFinishTime: number | string;
  parkFaultEvidence: string[];
  parkFaultRepairLog: ParkFaultRepairLog[];
  parkFaultPartsList: ParkFaultParts[];
  parkMaintainWorkorderWorkorderNo: string;
  parkFaultDuration?: number;
}
interface ParkFaultIndicators {
  totalCount: number;
  unRepairCount: number;
  hardwareFaultCount: number;
  softwareFaultCount: number;
  commFaultCount: number;
  urgentCount: number;
  seriousCount: number;
}
interface SubmitDispatchParams {
  parkFaultFaultId: string;
  maintainUser: string;
  maintainRequire?: string;
}

interface ParkComplianceWarningRectifyLog {
  time: number | string;
  content: string;
}
interface ParkComplianceWarningRow {
  parkComplianceWarningWarningId: string;
  sysViolationTypeName: string;
  parkComplianceWarningViolationDetail: string;
  parkComplianceWarningWarningTime: number | string;
  tbAssetExtendAddress: string;
  sysRectificationStatusName: string;
  parkComplianceWarningComplianceStandard: string;
  sysResponsibleSubjectTypeName: string;
  parkComplianceWarningRectificationDeadline: number | string;
  parkComplianceWarningInspectionResult: string;
  parkComplianceWarningEvidence: string[];
  parkComplianceWarningRectifyLog: ParkComplianceWarningRectifyLog[];
}
interface ParkComplianceWarningIndicators {
  totalCount: number;
  unRectifyCount: number;
  passRate: number;
  occupyViolationCount: number;
  fireViolationCount: number;
  chargeViolationCount: number;
  safeViolationCount: number;
}
interface ComplianceRectifyForm {
  rectifyScheme: string;
  rectifyFileList: any[];
}
interface ComplianceInspectForm {
  inspectionResult: string;
  inspectionOpinion: string;
}
interface SubmitComplianceRectifyParams {
  parkComplianceWarningWarningId: string;
  rectifyScheme: string;
  rectifyEvidence: string[];
}
interface SubmitComplianceInspectParams {
  parkComplianceWarningWarningId: string;
  inspectionResult: string;
  inspectionOpinion?: string;
}

// 响应式数据
const parkAlarmList = ref<ParkAlarmRow[]>([]);
const parkAlarmIndicators = ref<ParkAlarmIndicators>({
  totalCount: 0,
  urgentCount: 0,
  highCount: 0,
  midCount: 0,
  lowCount: 0,
  undisposedCount: 0,
});
const parkAlarmLevelRatioData = ref<ChartRatioData>({ legend: [], series: [] });
const parkAlarmTypeRatioData = ref<ChartRatioData>({ legend: [], series: [] });
const parkAlarmStatusRatioData = ref<ChartRatioData>({
  legend: [],
  series: [],
});
const parkAlarmAreaData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkAlarmTypeData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkAlarmChartRefreshKey = ref(0);
const activeParkAlarmView = ref('饼图');
const parkAlarmViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);
const parkAlarmDialogVisible = ref(false);
const parkAlarmDialogType = ref('');
const parkAlarmSelectedRow = ref<ParkAlarmRow>({
  parkAlarmAlarmId: '',
  sysAlarmLevelName: '',
  sysAlarmTypeName: '',
  parkAlarmAlarmTime: 0,
  tbAssetExtendName: '',
  tbAssetExtendAddress: '',
  sysDisposalStatusName: '',
  sysResponsibleUnitName: '',
  parkAlarmReceiveTime: 0,
  parkAlarmDisposalDuration: 0,
  parkMaintainWorkorderWorkorderNo: '',
  parkAlarmEvidence: [],
  parkAlarmDisposalLog: [],
  parkAlarmProgress: '',
});
const disposeFormRef = ref<any>(null);
const disposeForm = reactive({ disposalMeasure: '', disposeFileList: [] });
const disposeRules = reactive({
  disposalMeasure: [
    {
      required: true,
      message: '处置措施为必填项',
      trigger: ['blur', 'change'],
      whitespace: true,
    },
    { max: 500, message: '处置措施最多输入500字', trigger: 'blur' },
  ],
});

const parkHiddenDangerList = ref<ParkHiddenDangerRow[]>([]);
const parkHiddenDangerIndicators = ref<ParkHiddenDangerIndicators>({
  totalCount: 0,
  majorCount: 0,
  importantCount: 0,
  normalCount: 0,
  lowCount: 0,
  overdueUnRectifyCount: 0,
});
const parkHiddenDangerLevelRatioData = ref<ChartRatioData>({
  legend: [],
  series: [],
});
const parkHiddenDangerTypeRatioData = ref<ChartRatioData>({
  legend: [],
  series: [],
});
const parkHiddenDangerAreaData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkHiddenDangerTypeData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkHiddenDangerChartRefreshKey = ref(0);
const activeParkHiddenDangerView = ref('柱状图');
const parkHiddenDangerViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);
const parkHiddenDangerDialogVisible = ref(false);
const parkHiddenDangerDialogType = ref('');
const parkHiddenDangerSelectedRow = ref<ParkHiddenDangerRow>({
  parkHiddenDangerHiddenDangerId: '',
  sysRiskLevelName: '',
  sysHiddenDangerTypeName: '',
  tbAssetExtendAddress: '',
  parkHiddenDangerInfluenceRange: '',
  sysRectificationProgressName: '',
  parkHiddenDangerRectificationDeadline: 0,
  tbAssetExtendName: '',
  parkHiddenDangerDiscoverTime: 0,
  sysUserUserName: '',
  parkHiddenDangerAcceptStatus: '',
  parkHiddenDangerEvidence: [],
  parkHiddenDangerRectifyRequire: '',
  parkHiddenDangerRectifyLog: [],
});
const rectifyFormRef = ref<any>(null);
const rectifyForm = reactive<RectifyForm>({
  rectifyScheme: '',
  rectifyFileList: [],
});
const rectifyRules = reactive({
  rectifyScheme: [
    {
      required: true,
      message: '整改方案为必填项',
      trigger: ['blur', 'change'],
      whitespace: true,
    },
    { max: 500, message: '整改方案最多输入500字', trigger: 'blur' },
  ],
});
const acceptFormRef = ref<any>(null);
const acceptForm = reactive<AcceptForm>({
  acceptResult: '',
  acceptOpinion: '',
});
const acceptRules = reactive({
  acceptResult: [
    {
      required: true,
      message: '验收结果为必填项，请选择',
      trigger: ['blur', 'change'],
      whitespace: true,
    },
  ],
});

const disposeTrackList = ref<DisposeTrackRow[]>([]);
const disposeTrackIndicators = ref<DisposeTrackIndicators>({
  avgDisposeDuration: 0,
  overtimeCount: 0,
  finishCount: 0,
  disposingCount: 0,
});
const disposeUserEfficiencyData = ref<ChartBarData>({ xAxis: [], series: [] });
const disposeTrackChartRefreshKey = ref(0);
const activeDisposeTrackView = ref('甘特图');
const disposeTrackViewBtnList = ref(['卡片', '甘特图', '柱状图', '列表']);
const disposeTrackDialogVisible = ref(false);
const disposeTrackDialogType = ref('');
const disposeTrackSelectedRow = ref<DisposeTrackRow>({
  parkAlarmAlarmId: '',
  sysAlarmTypeName: '',
  sysMaintainUserUserName: '',
  parkMaintainWorkorderStartTime: 0,
  sysDisposalProgressName: '',
  parkMaintainWorkorderWorkorderNo: '',
  parkMaintainWorkorderExpectedFinishTime: 0,
  parkMaintainWorkorderLatestDynamic: '',
  parkMaintainWorkorderDispatchDuration: 0,
  parkMaintainWorkorderDealTime: 0,
  parkAlarmEvidence: [],
  disposeAllLog: [],
});
const cooperateFormRef = ref<any>(null);
const cooperateForm = reactive({ cooperateUser: '', cooperateReason: '' });
const cooperateRules = reactive({
  cooperateUser: [
    {
      required: true,
      message: '协同人员为必填项',
      trigger: ['blur', 'change'],
      whitespace: true,
    },
  ],
  cooperateReason: [
    {
      required: true,
      message: '协同理由为必填项',
      trigger: ['blur', 'change'],
      whitespace: true,
    },
    { max: 300, message: '协同理由最多输入300字', trigger: 'blur' },
  ],
});

const parkAbnormalList = ref<ParkAbnormalRow[]>([]);
const parkAbnormalIndicators = ref<ParkAbnormalIndicators>({
  totalCount: 0,
  unRelieveCount: 0,
  deviceAbnormalCount: 0,
  dataAbnormalCount: 0,
  commAbnormalCount: 0,
});
const parkAbnormalTrendData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkAbnormalAreaData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkAbnormalTypeData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkAbnormalChartRefreshKey = ref(0);
const activeParkAbnormalView = ref('折线图');
const parkAbnormalViewBtnList = ref(['卡片', '柱状图', '折线图', '列表']);
const parkAbnormalDialogVisible = ref(false);
const parkAbnormalDialogType = ref('');
const parkAbnormalSelectedRow = ref<ParkAbnormalRow>({
  parkAbnormalAbnormalId: '',
  sysAbnormalTypeName: '',
  parkAbnormalAbnormalReason: '',
  parkAbnormalAbnormalTime: 0,
  tbAssetExtendAddress: '',
  sysAssociatedObjectTypeName: '',
  parkAbnormalRelieveStatus: '',
  tbAssetExtendName: '',
  sysUserUserName: '',
  parkAbnormalRelieveTime: null,
  parkAbnormalEvidence: [],
  parkAbnormalDisposeLog: [],
});
const abnormalDisposeFormRef = ref<any>(null);
const abnormalDisposeForm = reactive<AbnormalDisposeForm>({
  disposeMeasure: '',
  disposeFileList: [],
});
const abnormalDisposeRules = reactive({
  disposeMeasure: [
    {
      required: true,
      message: '处置措施为必填项',
      trigger: ['blur', 'change'],
      whitespace: true,
    },
    { max: 300, message: '处置措施最多输入300字', trigger: 'blur' },
  ],
});

const parkFaultList = ref<ParkFaultRow[]>([]);
const parkFaultIndicators = ref<ParkFaultIndicators>({
  totalCount: 0,
  unRepairCount: 0,
  hardwareFaultCount: 0,
  softwareFaultCount: 0,
  commFaultCount: 0,
  urgentCount: 0,
  seriousCount: 0,
});
const parkFaultTypeRatioData = ref<ChartRatioData>({ legend: [], series: [] });
const parkFaultEquipmentRatioData = ref<ChartRatioData>({
  legend: [],
  series: [],
});
const parkFaultAreaData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkFaultEquipmentData = ref<ChartBarData>({ xAxis: [], series: [] });
const parkFaultChartRefreshKey = ref(0);
const activeParkFaultView = ref('列表');
const parkFaultViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);
const parkFaultDialogVisible = ref(false);
const parkFaultDialogType = ref('');
const parkFaultSelectedRow = ref<ParkFaultRow>({
  parkFaultFaultId: '',
  sysFaultTypeName: '',
  sysEquipmentTypeName: '',
  tbDeviceExtendInstallPosition: '',
  parkFaultFaultTime: 0,
  sysMaintenanceProgressName: '',
  tbDeviceExtendDeviceCode: '',
  parkFaultFaultLevel: '',
  sysMaintainUserUserName: '',
  parkMaintainWorkorderExpectedFinishTime: 0,
  parkFaultEvidence: [],
  parkFaultRepairLog: [],
  parkFaultPartsList: [],
  parkMaintainWorkorderWorkorderNo: '',
});
const dispatchFormRef = ref<any>(null);
const dispatchForm = reactive({ maintainUser: '', maintainRequire: '' });
const dispatchRules = reactive({
  maintainUser: [
    {
      required: true,
      message: '维修人员为必填项',
      trigger: ['blur', 'change'],
      whitespace: true,
    },
  ],
  maintainRequire: [
    { max: 300, message: '维修要求最多输入300字', trigger: 'blur' },
  ],
});

const parkComplianceWarningList = ref<ParkComplianceWarningRow[]>([]);
const parkComplianceWarningIndicators = ref<ParkComplianceWarningIndicators>({
  totalCount: 0,
  unRectifyCount: 0,
  passRate: 0,
  occupyViolationCount: 0,
  fireViolationCount: 0,
  chargeViolationCount: 0,
  safeViolationCount: 0,
});
const parkComplianceWarningViolationRatioData = ref<ChartRatioData>({
  legend: [],
  series: [],
});
const parkComplianceWarningSubjectRatioData = ref<ChartRatioData>({
  legend: [],
  series: [],
});
const parkComplianceWarningAreaData = ref<ChartBarData>({
  xAxis: [],
  series: [],
});
const parkComplianceWarningTypeData = ref<ChartBarData>({
  xAxis: [],
  series: [],
});
const parkComplianceWarningChartRefreshKey = ref(0);
const activeParkComplianceWarningView = ref('卡片');
const parkComplianceWarningViewBtnList = ref([
  '卡片',
  '柱状图',
  '饼图',
  '列表',
]);
const parkComplianceWarningDialogVisible = ref(false);
const parkComplianceWarningDialogType = ref('');
const parkComplianceWarningSelectedRow = ref<ParkComplianceWarningRow>({
  parkComplianceWarningWarningId: '',
  sysViolationTypeName: '',
  parkComplianceWarningViolationDetail: '',
  parkComplianceWarningWarningTime: 0,
  tbAssetExtendAddress: '',
  sysRectificationStatusName: '',
  parkComplianceWarningComplianceStandard: '',
  sysResponsibleSubjectTypeName: '',
  parkComplianceWarningRectificationDeadline: 0,
  parkComplianceWarningInspectionResult: '未核查',
  parkComplianceWarningEvidence: [],
  parkComplianceWarningRectifyLog: [],
});
const complianceRectifyFormRef = ref<any>(null);
const complianceRectifyForm = reactive<ComplianceRectifyForm>({
  rectifyScheme: '',
  rectifyFileList: [],
});
const complianceRectifyRules = reactive({
  rectifyScheme: [
    {
      required: true,
      message: '整改方案为必填项',
      trigger: ['blur', 'change'],
      whitespace: true,
    },
    { max: 500, message: '整改方案最多输入500字', trigger: 'blur' },
  ],
});
const complianceInspectFormRef = ref<any>(null);
const complianceInspectForm = reactive<ComplianceInspectForm>({
  inspectionResult: '',
  inspectionOpinion: '',
});
const complianceInspectRules = reactive({
  inspectionResult: [
    {
      required: true,
      message: '核查结果为必填项，请选择',
      trigger: ['blur', 'change'],
      whitespace: true,
    },
  ],
});

const tipDialogVisible = ref(false);
const tipDialogContent = ref('');
const confirmRelieveDialogVisible = ref(false);

// 接口请求方法
const getParkAlarmListData = async () => {
  try {
    parkAlarmList.value = (await fetchParkAlarmList()) as ParkAlarmRow[];
  } catch (error: any) {
    ElMessage.error(`数据加载失败：${error.message}`);
    parkAlarmList.value = [];
  }
};
const getParkAlarmIndicatorData = async () => {
  try {
    parkAlarmIndicators.value =
      (await fetchParkAlarmIndicators()) as ParkAlarmIndicators;
  } catch (error: any) {
    ElMessage.error(`指标加载失败：${error.message}`);
  }
};
const getParkAlarmLevelRatioData = async () => {
  try {
    parkAlarmLevelRatioData.value =
      (await fetchParkAlarmLevelRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`等级占比加载失败：${error.message}`);
  }
};
const getParkAlarmTypeRatioData = async () => {
  try {
    parkAlarmTypeRatioData.value =
      (await fetchParkAlarmTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`类型占比加载失败：${error.message}`);
  }
};
const getParkAlarmStatusRatioData = async () => {
  try {
    parkAlarmStatusRatioData.value =
      (await fetchParkAlarmStatusRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`状态占比加载失败：${error.message}`);
  }
};
const getParkAlarmAreaData = async () => {
  try {
    parkAlarmAreaData.value = (await fetchParkAlarmAreaCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`区域数据加载失败：${error.message}`);
  }
};
const getParkAlarmTypeData = async () => {
  try {
    parkAlarmTypeData.value = (await fetchParkAlarmTypeCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`类型数据加载失败：${error.message}`);
  }
};
const getParkAlarmDetailData = async (alarmId: string) => {
  try {
    parkAlarmSelectedRow.value = {
      ...parkAlarmSelectedRow.value,
      ...(await fetchParkAlarmDetail(alarmId)),
    };
  } catch (error: any) {
    ElMessage.warning(`详情加载失败：${error.message}`);
  }
};
const getParkAlarmTrackInfoData = async (alarmId: string) => {
  try {
    parkAlarmSelectedRow.value = {
      ...parkAlarmSelectedRow.value,
      ...(await fetchParkAlarmTrackInfo(alarmId)),
    };
  } catch (error: any) {
    ElMessage.warning(`跟踪数据加载失败：${error.message}`);
  }
};

const getParkHiddenDangerListData = async () => {
  try {
    parkHiddenDangerList.value =
      (await fetchParkHiddenDangerList()) as ParkHiddenDangerRow[];
  } catch (error: any) {
    ElMessage.error(`隐患列表加载失败：${error.message}`);
    parkHiddenDangerList.value = [];
  }
};
const getParkHiddenDangerIndicatorData = async () => {
  try {
    parkHiddenDangerIndicators.value =
      (await fetchParkHiddenDangerIndicators()) as ParkHiddenDangerIndicators;
  } catch (error: any) {
    ElMessage.error(`隐患指标加载失败：${error.message}`);
  }
};
const getParkHiddenDangerLevelRatioData = async () => {
  try {
    parkHiddenDangerLevelRatioData.value =
      (await fetchParkHiddenDangerLevelRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`隐患等级占比加载失败：${error.message}`);
  }
};
const getParkHiddenDangerTypeRatioData = async () => {
  try {
    parkHiddenDangerTypeRatioData.value =
      (await fetchParkHiddenDangerTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`隐患类型占比加载失败：${error.message}`);
  }
};
const getParkHiddenDangerAreaData = async () => {
  try {
    parkHiddenDangerAreaData.value =
      (await fetchParkHiddenDangerAreaCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`隐患区域数据加载失败：${error.message}`);
  }
};
const getParkHiddenDangerTypeData = async () => {
  try {
    parkHiddenDangerTypeData.value =
      (await fetchParkHiddenDangerTypeCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`隐患类型数据加载失败：${error.message}`);
  }
};
const getParkHiddenDangerDetailData = async (dangerId: string) => {
  try {
    parkHiddenDangerSelectedRow.value = {
      ...parkHiddenDangerSelectedRow.value,
      ...(await fetchParkHiddenDangerDetail(dangerId)),
    };
  } catch (error: any) {
    ElMessage.warning(`隐患详情加载失败：${error.message}`);
  }
};

const getDisposeTrackListData = async () => {
  try {
    disposeTrackList.value =
      (await fetchParkDisposeTrackList()) as DisposeTrackRow[];
  } catch (error: any) {
    ElMessage.error(`处置跟踪加载失败：${error.message}`);
    disposeTrackList.value = [];
  }
};
const getDisposeTrackIndicatorData = async () => {
  try {
    disposeTrackIndicators.value =
      (await fetchParkDisposeTrackIndicators()) as DisposeTrackIndicators;
  } catch (error: any) {
    ElMessage.error(`处置指标加载失败：${error.message}`);
  }
};
const getDisposeUserEfficiencyData = async () => {
  try {
    disposeUserEfficiencyData.value =
      (await fetchParkDisposeUserEfficiency()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`效率数据加载失败：${error.message}`);
  }
};
const getDisposeTrackDetailData = async (alarmId: string) => {
  try {
    disposeTrackSelectedRow.value = {
      ...disposeTrackSelectedRow.value,
      ...(await fetchParkDisposeTrackDetail(alarmId)),
    };
  } catch (error: any) {
    ElMessage.warning(`处置详情加载失败：${error.message}`);
  }
};

const getParkAbnormalListData = async () => {
  try {
    parkAbnormalList.value =
      (await fetchParkAbnormalList()) as ParkAbnormalRow[];
  } catch (error: any) {
    ElMessage.error(`异常列表加载失败：${error.message}`);
    parkAbnormalList.value = [];
  }
};
const getParkAbnormalIndicatorData = async () => {
  try {
    parkAbnormalIndicators.value =
      (await fetchParkAbnormalIndicators()) as ParkAbnormalIndicators;
  } catch (error: any) {
    ElMessage.error(`异常指标加载失败：${error.message}`);
  }
};
const getParkAbnormalTrendData = async () => {
  try {
    parkAbnormalTrendData.value =
      (await fetchParkAbnormalTrend()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`异常趋势加载失败：${error.message}`);
  }
};
const getParkAbnormalAreaData = async () => {
  try {
    parkAbnormalAreaData.value =
      (await fetchParkAbnormalAreaCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`异常区域加载失败：${error.message}`);
  }
};
const getParkAbnormalTypeData = async () => {
  try {
    parkAbnormalTypeData.value =
      (await fetchParkAbnormalTypeCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`异常类型加载失败：${error.message}`);
  }
};
const getParkAbnormalDetailData = async (abnormalId: string) => {
  try {
    parkAbnormalSelectedRow.value = {
      ...parkAbnormalSelectedRow.value,
      ...(await fetchParkAbnormalDetail(abnormalId)),
    };
  } catch (error: any) {
    ElMessage.warning(`异常详情加载失败：${error.message}`);
  }
};

const getParkFaultListData = async () => {
  try {
    parkFaultList.value = (await fetchParkFaultList()) as ParkFaultRow[];
  } catch (error: any) {
    ElMessage.error(`故障列表加载失败：${error.message}`);
    parkFaultList.value = [];
  }
};
const getParkFaultIndicatorData = async () => {
  try {
    parkFaultIndicators.value =
      (await fetchParkFaultIndicators()) as ParkFaultIndicators;
  } catch (error: any) {
    ElMessage.error(`故障指标加载失败：${error.message}`);
  }
};
const getParkFaultTypeRatioData = async () => {
  try {
    parkFaultTypeRatioData.value =
      (await fetchParkFaultTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`故障类型占比加载失败：${error.message}`);
  }
};
const getParkFaultEquipmentRatioData = async () => {
  try {
    parkFaultEquipmentRatioData.value =
      (await fetchParkFaultEquipmentRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`设备类型占比加载失败：${error.message}`);
  }
};
const getParkFaultAreaData = async () => {
  try {
    parkFaultAreaData.value = (await fetchParkFaultAreaCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`区域故障数加载失败：${error.message}`);
  }
};
const getParkFaultEquipmentData = async () => {
  try {
    parkFaultEquipmentData.value =
      (await fetchParkFaultEquipmentCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`设备故障数加载失败：${error.message}`);
  }
};
const getParkFaultDetailData = async (faultId: string) => {
  try {
    parkFaultSelectedRow.value = {
      ...parkFaultSelectedRow.value,
      ...(await fetchParkFaultDetail(faultId)),
    };
  } catch (error: any) {
    ElMessage.warning(`故障详情加载失败：${error.message}`);
  }
};
const getParkFaultTrackInfoData = async (faultId: string) => {
  try {
    parkFaultSelectedRow.value = {
      ...parkFaultSelectedRow.value,
      ...(await fetchParkFaultTrackInfo(faultId)),
    };
  } catch (error: any) {
    ElMessage.warning(`故障跟踪数据加载失败：${error.message}`);
  }
};

const getParkComplianceWarningListData = async () => {
  try {
    parkComplianceWarningList.value =
      (await fetchParkComplianceWarningList()) as ParkComplianceWarningRow[];
  } catch (error: any) {
    ElMessage.error(`合规预警列表加载失败：${error.message}`);
    parkComplianceWarningList.value = [];
  }
};
const getParkComplianceWarningIndicatorData = async () => {
  try {
    parkComplianceWarningIndicators.value =
      (await fetchParkComplianceWarningIndicators()) as ParkComplianceWarningIndicators;
  } catch (error: any) {
    ElMessage.error(`合规预警指标加载失败：${error.message}`);
  }
};
const getParkComplianceWarningViolationRatioData = async () => {
  try {
    parkComplianceWarningViolationRatioData.value =
      (await fetchParkComplianceWarningViolationRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`违规类型占比加载失败：${error.message}`);
  }
};
const getParkComplianceWarningSubjectRatioData = async () => {
  try {
    parkComplianceWarningSubjectRatioData.value =
      (await fetchParkComplianceWarningSubjectRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`责任主体占比加载失败：${error.message}`);
  }
};
const getParkComplianceWarningAreaData = async () => {
  try {
    parkComplianceWarningAreaData.value =
      (await fetchParkComplianceWarningAreaCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`区域预警数加载失败：${error.message}`);
  }
};
const getParkComplianceWarningTypeData = async () => {
  try {
    parkComplianceWarningTypeData.value =
      (await fetchParkComplianceWarningTypeCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`违规类型预警数加载失败：${error.message}`);
  }
};
const getParkComplianceWarningDetailData = async (warningId: string) => {
  try {
    parkComplianceWarningSelectedRow.value = {
      ...parkComplianceWarningSelectedRow.value,
      ...(await fetchParkComplianceWarningDetail(warningId)),
    };
  } catch (error: any) {
    ElMessage.warning(`合规预警详情加载失败：${error.message}`);
  }
};


// 标签样式方法
const getAlarmLevelTagType = (val?: string) => {
  const map = {
    '紧急': 'danger',
    '高危': 'warning',
    '中危': 'info',
    '低危': 'success',
  };
  return map[val as keyof typeof map] || '';
};
const getDisposeStatusTagType = (val?: string) => {
  const map = {
    '未处置': 'danger',
    '处理中': 'warning',
    '已完成': 'success',
    '已驳回': 'info',
  };
  return map[val as keyof typeof map] || '';
};
const getRiskLevelTagType = (val?: string) => {
  const map = {
    '重大': 'danger',
    '较大': 'warning',
    '一般': 'info',
    '低危': 'success',
  };
  return map[val as keyof typeof map] || '';
};
const getRectifyProgressTagType = (val?: string) => {
  const map = { '未整改': 'danger', '整改中': 'warning', '已整改': 'success' };
  return map[val as keyof typeof map] || '';
};
const getAcceptStatusTagType = (val?: string) => {
  const map = { '待验收': 'warning', '已验收': 'success', '验收未通过': 'danger' };
  return map[val as keyof typeof map] || '';
};
const getDisposeProgressTagType = (val?: string) => {
  const map = {
    '待派单': 'info',
    '处理中': 'warning',
    '已完成': 'success',
    '已驳回': 'info',
    '超时处置': 'danger',
  };
  return map[val as keyof typeof map] || '';
};
const getAbnormalStatusTagType = (val?: string) => {
  const map = { '未解除': 'danger', '已解除': 'success' };
  return map[val as keyof typeof map] || '';
};
const getAbnormalTypeTagType = (val?: string) => {
  const map = {
    '设备异常': 'warning',
    '数据异常': 'info',
    '通讯异常': 'danger',
    '环境异常': 'success',
    '其他异常': 'primary',
  };
  return map[val as keyof typeof map] || '';
};
const getFaultLevelTagType = (val?: string) => {
  const map = {
    '紧急': 'danger',
    '严重': 'warning',
    '一般': 'info',
    '轻微': 'success',
  };
  return map[val as keyof typeof map] || '';
};
const getMaintenanceProgressTagType = (val?: string) => {
  const map = {
    '未处理': 'danger',
    '待处理': 'warning',
    '处理中': 'warning',
    '已完成': 'success',
    '已驳回': 'info',
  };
  return map[val as keyof typeof map] || '';
};
const getComplianceRectifyStatusTagType = (val?: string) => {
  const map = { '未整改': 'danger', '整改中': 'warning', '已整改': 'success' };
  return map[val as keyof typeof map] || '';
};
const getComplianceInspectResultTagType = (val?: string) => {
  const map = { '未核查': 'info', '通过': 'success', '未通过': 'danger' };
  return map[val as keyof typeof map] || '';
};

// 视图切换
const changeParkAlarmView = (viewName: string) => {
  activeParkAlarmView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initParkAlarmNumberAnimations, 300));
  (viewName === '柱状图' || viewName === '饼图') &&
  nextTick(() => parkAlarmChartRefreshKey.value++);
};
const changeParkHiddenDangerView = (viewName: string) => {
  activeParkHiddenDangerView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initParkHiddenDangerNumberAnimations, 300));
  (viewName === '柱状图' || viewName === '饼图') &&
  nextTick(() => parkHiddenDangerChartRefreshKey.value++);
};
const changeDisposeTrackView = (viewName: string) => {
  activeDisposeTrackView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initDisposeTrackNumberAnimations, 300));
  (viewName === '甘特图' || viewName === '柱状图') &&
  nextTick(() => disposeTrackChartRefreshKey.value++);
};
const changeParkAbnormalView = (viewName: string) => {
  activeParkAbnormalView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initParkAbnormalNumberAnimations, 300));
  (viewName === '柱状图' || viewName === '折线图') &&
  nextTick(() => parkAbnormalChartRefreshKey.value++);
};
const changeParkFaultView = (viewName: string) => {
  activeParkFaultView.value = viewName;
  viewName === '卡片' &&
  nextTick(() =>
    setTimeout(() => {
      document
        .querySelectorAll('.park-fault-number-animate')
        .forEach((el) =>
          animateValue(
            el as HTMLElement,
            0,
            Number((el as HTMLElement).textContent || 0),
            1500,
          ),
        );
    }, 300),
  );
  (viewName === '柱状图' || viewName === '饼图') &&
  nextTick(() => parkFaultChartRefreshKey.value++);
};
const changeParkComplianceWarningView = (viewName: string) => {
  activeParkComplianceWarningView.value = viewName;
  viewName === '卡片' &&
  nextTick(() =>
    setTimeout(() => {
      document
        .querySelectorAll('.park-compliance-warning-number-animate')
        .forEach((el) =>
          animateValue(
            el as HTMLElement,
            0,
            Number((el as HTMLElement).textContent || 0),
            1500,
          ),
        );
    }, 300),
  );
  (viewName === '柱状图' || viewName === '饼图') &&
  nextTick(() => parkComplianceWarningChartRefreshKey.value++);
};

// 弹窗方法
const openParkAlarmDialog = async (row: ParkAlarmRow, type: string) => {
  parkAlarmSelectedRow.value = JSON.parse(JSON.stringify(row)) as ParkAlarmRow;
  parkAlarmDialogType.value = type;
  type === 'dispose' &&
    (() => {
      disposeForm.disposalMeasure = '';
      disposeForm.disposeFileList = [];
    })();
  type === 'detail' && (await getParkAlarmDetailData(row.parkAlarmAlarmId));
  type === 'track' && (await getParkAlarmTrackInfoData(row.parkAlarmAlarmId));
  parkAlarmDialogVisible.value = true;
};
const closeParkAlarmDialog = () => {
  parkAlarmDialogVisible.value = false;
  parkAlarmSelectedRow.value = {
    parkAlarmAlarmId: '',
    sysAlarmLevelName: '',
    sysAlarmTypeName: '',
    parkAlarmAlarmTime: 0,
    tbAssetExtendName: '',
    tbAssetExtendAddress: '',
    sysDisposalStatusName: '',
    sysResponsibleUnitName: '',
    parkAlarmReceiveTime: 0,
    parkAlarmDisposalDuration: 0,
    parkMaintainWorkorderWorkorderNo: '',
    parkAlarmEvidence: [],
    parkAlarmDisposalLog: [],
    parkAlarmProgress: '',
  };
};
const submitDisposeForm = async () => {
  disposeFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const params: SubmitDisposeParams = {
        parkAlarmAlarmId: parkAlarmSelectedRow.value.parkAlarmAlarmId,
        disposalMeasure: disposeForm.disposalMeasure.trim(),
        disposalEvidence: disposeForm.disposeFileList.map(
          (item) => item.url || '',
        ),
      };
      try {
        const res = await submitParkAlarmDisposal(params);
        if (res?.success) {
          tipDialogContent.value = '处置内容提交成功，处置人将收到提醒';
          tipDialogVisible.value = true;
          parkAlarmList.value = parkAlarmList.value.map((item) =>
            item.parkAlarmAlarmId === params.parkAlarmAlarmId
              ? {
                  ...item,
                  sysDisposalStatusName: '处理中',
                  parkMaintainWorkorderWorkorderNo:
                    res.parkMaintainWorkorderWorkorderNo,
                  parkAlarmProgress: '处理中',
                }
              : item,
          );
          closeParkAlarmDialog();
        }
      } catch (error: any) {
        ElMessage.error(`提交失败：${error.message}`);
      }
    }
  });
};

const openParkHiddenDangerDialog = async (
  row: ParkHiddenDangerRow,
  type: string,
) => {
  parkHiddenDangerSelectedRow.value = JSON.parse(
    JSON.stringify(row),
  ) as ParkHiddenDangerRow;
  parkHiddenDangerDialogType.value = type;
  type === 'rectify' &&
    (() => {
      rectifyForm.rectifyScheme = '';
      rectifyForm.rectifyFileList = [];
    })();
  type === 'accept' &&
    (() => {
      acceptForm.acceptResult = '';
      acceptForm.acceptOpinion = '';
    })();
  type === 'detail' &&
    (await getParkHiddenDangerDetailData(row.parkHiddenDangerHiddenDangerId));
  parkHiddenDangerDialogVisible.value = true;
};
const closeParkHiddenDangerDialog = () => {
  parkHiddenDangerDialogVisible.value = false;
  parkHiddenDangerSelectedRow.value = {
    parkHiddenDangerHiddenDangerId: '',
    sysRiskLevelName: '',
    sysHiddenDangerTypeName: '',
    tbAssetExtendAddress: '',
    parkHiddenDangerInfluenceRange: '',
    sysRectificationProgressName: '',
    parkHiddenDangerRectificationDeadline: 0,
    tbAssetExtendName: '',
    parkHiddenDangerDiscoverTime: 0,
    sysUserUserName: '',
    parkHiddenDangerAcceptStatus: '',
    parkHiddenDangerEvidence: [],
    parkHiddenDangerRectifyRequire: '',
    parkHiddenDangerRectifyLog: [],
  };
};
const submitRectifyForm = async () => {
  rectifyFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const params: SubmitRectifyParams = {
        parkHiddenDangerHiddenDangerId:
          parkHiddenDangerSelectedRow.value.parkHiddenDangerHiddenDangerId,
        rectifyScheme: rectifyForm.rectifyScheme.trim(),
        rectifyEvidence: rectifyForm.rectifyFileList.map(
          (item) => item.url || '',
        ),
      };
      try {
        const res = await submitParkHiddenDangerRectify(params);
        if (res?.success) {
          tipDialogContent.value = '整改方案提交成功，进入整改阶段';
          tipDialogVisible.value = true;
          parkHiddenDangerList.value = parkHiddenDangerList.value.map((item) =>
            item.parkHiddenDangerHiddenDangerId ===
            params.parkHiddenDangerHiddenDangerId
              ? {
                  ...item,
                  sysRectificationProgressName: '整改中',
                  parkHiddenDangerAcceptStatus: '待验收',
                }
              : item,
          );
          closeParkHiddenDangerDialog();
        }
      } catch (error: any) {
        ElMessage.error(`整改提交失败：${error.message}`);
      }
    }
  });
};
const submitAcceptForm = async () => {
  acceptFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const params: SubmitAcceptParams = {
        parkHiddenDangerHiddenDangerId:
          parkHiddenDangerSelectedRow.value.parkHiddenDangerHiddenDangerId,
        acceptResult: acceptForm.acceptResult,
        acceptOpinion: acceptForm.acceptOpinion?.trim(),
      };
      try {
        const res = await submitParkHiddenDangerAccept(params);
        if (res?.success) {
          tipDialogContent.value =
            params.acceptResult === '通过'
              ? '验收通过，消息发送成功'
              : '验收未通过，消息发送成功';
          tipDialogVisible.value = true;
          parkHiddenDangerList.value = parkHiddenDangerList.value.map((item) =>
            item.parkHiddenDangerHiddenDangerId ===
            params.parkHiddenDangerHiddenDangerId
              ? {
                  ...item,
                  sysRectificationProgressName:
                    params.acceptResult === '通过' ? '已整改' : '整改中',
                  parkHiddenDangerAcceptStatus:
                    params.acceptResult === '通过' ? '已验收' : '验收未通过',
                }
              : item,
          );
          closeParkHiddenDangerDialog();
        }
      } catch (error: any) {
        ElMessage.error(`验收提交失败：${error.message}`);
      }
    }
  });
};

const openDisposeTrackDialog = async (row: DisposeTrackRow, type: string) => {
  disposeTrackSelectedRow.value = JSON.parse(
    JSON.stringify(row),
  ) as DisposeTrackRow;
  disposeTrackDialogType.value = type;
  type === 'cooperate' &&
    (() => {
      cooperateForm.cooperateUser = '';
      cooperateForm.cooperateReason = '';
    })();
  type === 'detail' && (await getDisposeTrackDetailData(row.parkAlarmAlarmId));
  disposeTrackDialogVisible.value = true;
};
const closeDisposeTrackDialog = () => {
  disposeTrackDialogVisible.value = false;
  disposeTrackSelectedRow.value = {
    parkAlarmAlarmId: '',
    sysAlarmTypeName: '',
    sysMaintainUserUserName: '',
    parkMaintainWorkorderStartTime: 0,
    sysDisposalProgressName: '',
    parkMaintainWorkorderWorkorderNo: '',
    parkMaintainWorkorderExpectedFinishTime: 0,
    parkMaintainWorkorderLatestDynamic: '',
    parkMaintainWorkorderDispatchDuration: 0,
    parkMaintainWorkorderDealTime: 0,
    parkAlarmEvidence: [],
    disposeAllLog: [],
  };
};
const submitCooperateForm = async () => {
  cooperateFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const userList = cooperateForm.cooperateUser
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      const params: SubmitCooperateParams = {
        parkAlarmAlarmId: disposeTrackSelectedRow.value.parkAlarmAlarmId,
        cooperateUser: userList,
        cooperateReason: cooperateForm.cooperateReason.trim(),
      };
      try {
        const res = await submitParkDisposeCooperate(params);
        if (res?.success) {
          tipDialogContent.value = '协同请求提交成功，协同人员将收到提醒';
          tipDialogVisible.value = true;
          closeDisposeTrackDialog();
        }
      } catch (error: any) {
        ElMessage.error(`协同提交失败：${error.message}`);
      }
    }
  });
};
const submitUrgeHandle = async (row: DisposeTrackRow) => {
  const params: SubmitUrgeParams = {
    parkAlarmAlarmId: row.parkAlarmAlarmId,
    parkMaintainWorkorderWorkorderNo: row.parkMaintainWorkorderWorkorderNo,
  };
  try {
    const res = await submitParkDisposeUrge(params);
    if (res?.success) {
      tipDialogContent.value = '催办消息已发送，处置人将收到提醒';
      tipDialogVisible.value = true;
      disposeTrackList.value = disposeTrackList.value.map((item) =>
        item.parkAlarmAlarmId === row.parkAlarmAlarmId
          ? {
              ...item,
              parkMaintainWorkorderLatestDynamic: `【催办提醒】${item.parkMaintainWorkorderLatestDynamic}`,
            }
          : item,
      );
    }
  } catch (error: any) {
    ElMessage.error(`催办失败：${error.message}`);
  }
};

const openParkAbnormalDialog = async (row: ParkAbnormalRow, type: string) => {
  parkAbnormalSelectedRow.value = JSON.parse(
    JSON.stringify(row),
  ) as ParkAbnormalRow;
  parkAbnormalDialogType.value = type;
  type === 'dispose' &&
    (() => {
      abnormalDisposeForm.disposeMeasure = '';
      abnormalDisposeForm.disposeFileList = [];
    })();
  type === 'detail' &&
    (await getParkAbnormalDetailData(row.parkAbnormalAbnormalId));
  parkAbnormalDialogVisible.value = true;
};
const closeParkAbnormalDialog = () => {
  parkAbnormalDialogVisible.value = false;
  parkAbnormalSelectedRow.value = {
    parkAbnormalAbnormalId: '',
    sysAbnormalTypeName: '',
    parkAbnormalAbnormalReason: '',
    parkAbnormalAbnormalTime: 0,
    tbAssetExtendAddress: '',
    sysAssociatedObjectTypeName: '',
    parkAbnormalRelieveStatus: '',
    tbAssetExtendName: '',
    sysUserUserName: '',
    parkAbnormalRelieveTime: null,
    parkAbnormalEvidence: [],
    parkAbnormalDisposeLog: [],
  };
};
const submitAbnormalDisposeForm = async () => {
  abnormalDisposeFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const params: SubmitAbnormalDisposeParams = {
        parkAbnormalAbnormalId:
          parkAbnormalSelectedRow.value.parkAbnormalAbnormalId,
        disposeMeasure: abnormalDisposeForm.disposeMeasure.trim(),
        disposeEvidence: abnormalDisposeForm.disposeFileList.map(
          (item) => item.url || '',
        ),
      };
      try {
        const res = await submitParkAbnormalDispose(params);
        if (res?.success) {
          tipDialogContent.value = '处置方案提交成功，进入处置阶段';
          tipDialogVisible.value = true;
          parkAbnormalList.value = parkAbnormalList.value.map((item) =>
            item.parkAbnormalAbnormalId === params.parkAbnormalAbnormalId
              ? { ...item, parkAbnormalRelieveStatus: '处置中' }
              : item,
          );
          closeParkAbnormalDialog();
        }
      } catch (error: any) {
        ElMessage.error(`处置提交失败：${error.message}`);
      }
    }
  });
};

const handleConfirmRelieve = async () => {
  try {
    const params: SubmitAbnormalRelieveParams = {
      parkAbnormalAbnormalId:
        parkAbnormalSelectedRow.value.parkAbnormalAbnormalId,
    };
    const res = await submitParkAbnormalRelieve(params);
    if (res?.success) {
      tipDialogContent.value = '异常已成功解除，状态已更新';
      tipDialogVisible.value = true;
      parkAbnormalList.value = parkAbnormalList.value.map((item) =>
        item.parkAbnormalAbnormalId === params.parkAbnormalAbnormalId
          ? {
              ...item,
              parkAbnormalRelieveStatus: '已解除',
              parkAbnormalRelieveTime: Date.now(),
            }
          : item,
      );
      confirmRelieveDialogVisible.value = false;
      closeParkAbnormalDialog();
    }
  } catch (error: any) {
    ElMessage.error(`解除提交失败：${error.message}`);
  }
};

const openParkFaultDialog = async (row: ParkFaultRow, type: string) => {
  parkFaultSelectedRow.value = JSON.parse(JSON.stringify(row)) as ParkFaultRow;
  parkFaultDialogType.value = type;
  type === 'dispatch' &&
    (() => {
      dispatchForm.maintainUser = '';
      dispatchForm.maintainRequire = '';
    })();
  type === 'detail' && (await getParkFaultDetailData(row.parkFaultFaultId));
  type === 'track' && (await getParkFaultTrackInfoData(row.parkFaultFaultId));
  parkFaultDialogVisible.value = true;
};
const closeParkFaultDialog = () => {
  parkFaultDialogVisible.value = false;
  parkFaultSelectedRow.value = {
    parkFaultFaultId: '',
    sysFaultTypeName: '',
    sysEquipmentTypeName: '',
    tbDeviceExtendInstallPosition: '',
    parkFaultFaultTime: 0,
    sysMaintenanceProgressName: '',
    tbDeviceExtendDeviceCode: '',
    parkFaultFaultLevel: '',
    sysMaintainUserUserName: '',
    parkMaintainWorkorderExpectedFinishTime: 0,
    parkFaultEvidence: [],
    parkFaultRepairLog: [],
    parkFaultPartsList: [],
    parkMaintainWorkorderWorkorderNo: '',
  };
};
const submitDispatchForm = async () => {
  dispatchFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const params: SubmitDispatchParams = {
        parkFaultFaultId: parkFaultSelectedRow.value.parkFaultFaultId,
        maintainUser: dispatchForm.maintainUser.trim(),
        maintainRequire: dispatchForm.maintainRequire?.trim(),
      };
      try {
        const res = await submitParkFaultDispatch(params);
        if (res?.success) {
          tipDialogContent.value =
            '派单成功，已生成维修工单，维修人员将收到提醒';
          tipDialogVisible.value = true;
          parkFaultList.value = parkFaultList.value.map((item) =>
            item.parkFaultFaultId === params.parkFaultFaultId
              ? {
                  ...item,
                  sysMaintenanceProgressName: '待处理',
                  parkMaintainWorkorderWorkorderNo:
                    res.parkMaintainWorkorderWorkorderNo,
                }
              : item,
          );
          closeParkFaultDialog();
        }
      } catch (error: any) {
        ElMessage.error(`派单提交失败：${error.message}`);
      }
    }
  });
};

const openParkComplianceWarningDialog = async (
  row: ParkComplianceWarningRow,
  type: string,
) => {
  parkComplianceWarningSelectedRow.value = JSON.parse(
    JSON.stringify(row),
  ) as ParkComplianceWarningRow;
  parkComplianceWarningDialogType.value = type;
  type === 'rectify' &&
    (() => {
      complianceRectifyForm.rectifyScheme = '';
      complianceRectifyForm.rectifyFileList = [];
    })();
  type === 'inspect' &&
    (() => {
      complianceInspectForm.inspectionResult = '';
      complianceInspectForm.inspectionOpinion = '';
    })();
  type === 'detail' &&
    (await getParkComplianceWarningDetailData(
      row.parkComplianceWarningWarningId,
    ));
  parkComplianceWarningDialogVisible.value = true;
};
const closeParkComplianceWarningDialog = () => {
  parkComplianceWarningDialogVisible.value = false;
  parkComplianceWarningSelectedRow.value = {
    parkComplianceWarningWarningId: '',
    sysViolationTypeName: '',
    parkComplianceWarningViolationDetail: '',
    parkComplianceWarningWarningTime: 0,
    tbAssetExtendAddress: '',
    sysRectificationStatusName: '',
    parkComplianceWarningComplianceStandard: '',
    sysResponsibleSubjectTypeName: '',
    parkComplianceWarningRectificationDeadline: 0,
    parkComplianceWarningInspectionResult: '未核查',
    parkComplianceWarningEvidence: [],
    parkComplianceWarningRectifyLog: [],
  };
};
const submitComplianceRectifyForm = async () => {
  complianceRectifyFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const params: SubmitComplianceRectifyParams = {
        parkComplianceWarningWarningId:
          parkComplianceWarningSelectedRow.value.parkComplianceWarningWarningId,
        rectifyScheme: complianceRectifyForm.rectifyScheme.trim(),
        rectifyEvidence: complianceRectifyForm.rectifyFileList.map(
          (item) => item.url || '',
        ),
      };
      try {
        const res = await submitParkComplianceWarningRectify(params);
        if (res?.success) {
          tipDialogContent.value = '整改方案提交成功，进入整改阶段';
          tipDialogVisible.value = true;
          parkComplianceWarningList.value = parkComplianceWarningList.value.map(
            (item) =>
              item.parkComplianceWarningWarningId ===
              params.parkComplianceWarningWarningId
                ? { ...item, sysRectificationStatusName: '整改中' }
                : item,
          );
          closeParkComplianceWarningDialog();
        }
      } catch (error: any) {
        ElMessage.error(`整改提交失败：${error.message}`);
      }
    }
  });
};
const submitComplianceInspectForm = async () => {
  complianceInspectFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const params: SubmitComplianceInspectParams = {
        parkComplianceWarningWarningId:
          parkComplianceWarningSelectedRow.value.parkComplianceWarningWarningId,
        inspectionResult: complianceInspectForm.inspectionResult,
        inspectionOpinion: complianceInspectForm.inspectionOpinion?.trim(),
      };
      try {
        const res = await submitParkComplianceWarningInspect(params);
        if (res?.success) {
          tipDialogContent.value =
            params.inspectionResult === '通过'
              ? '核查通过，消息发送成功'
              : '核查未通过，消息发送成功';
          tipDialogVisible.value = true;
          parkComplianceWarningList.value = parkComplianceWarningList.value.map(
            (item) =>
              item.parkComplianceWarningWarningId ===
              params.parkComplianceWarningWarningId
                ? {
                    ...item,
                    sysRectificationStatusName:
                      params.inspectionResult === '通过' ? '已整改' : '整改中',
                    parkComplianceWarningInspectionResult:
                      params.inspectionResult,
                  }
                : item,
          );
          closeParkComplianceWarningDialog();
        }
      } catch (error: any) {
        ElMessage.error(`核查提交失败：${error.message}`);
      }
    }
  });
};

// 生命周期
onMounted(async () => {
  await Promise.all([
    getParkAlarmListData(),
    getParkAlarmIndicatorData(),
    getParkAlarmLevelRatioData(),
    getParkAlarmTypeRatioData(),
    getParkAlarmStatusRatioData(),
    getParkAlarmAreaData(),
    getParkAlarmTypeData(),
    getParkHiddenDangerListData(),
    getParkHiddenDangerIndicatorData(),
    getParkHiddenDangerLevelRatioData(),
    getParkHiddenDangerTypeRatioData(),
    getParkHiddenDangerAreaData(),
    getParkHiddenDangerTypeData(),
    getDisposeTrackListData(),
    getDisposeTrackIndicatorData(),
    getDisposeUserEfficiencyData(),
    getParkAbnormalListData(),
    getParkAbnormalIndicatorData(),
    getParkAbnormalTrendData(),
    getParkAbnormalAreaData(),
    getParkAbnormalTypeData(),
    getParkFaultListData(),
    getParkFaultIndicatorData(),
    getParkFaultTypeRatioData(),
    getParkFaultEquipmentRatioData(),
    getParkFaultAreaData(),
    getParkFaultEquipmentData(),
    getParkComplianceWarningListData(),
    getParkComplianceWarningIndicatorData(),
    getParkComplianceWarningViolationRatioData(),
    getParkComplianceWarningSubjectRatioData(),
    getParkComplianceWarningAreaData(),
    getParkComplianceWarningTypeData(),
  ]);
  setTimeout(() => {
    parkAlarmChartRefreshKey.value++;
    parkHiddenDangerChartRefreshKey.value++;
    parkAbnormalChartRefreshKey.value++;
    disposeTrackChartRefreshKey.value++;
    parkFaultChartRefreshKey.value++;
    parkComplianceWarningChartRefreshKey.value++;
  }, 200);
  screenFull.on('change', handleFullscreenChange);
});
onUnmounted(() => {
  screenFull.off('change', handleFullscreenChange);
});
</script>

<template>
  <div class="page-container">
    <div class="mainbox">
      <div class="top">
        <div class="panel top-left" ref="parkAlarmPanelRef">
          <div class="header-actions">
            <div class="actions-left"><p>预警事件概览</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton
                  v-for="item in parkAlarmViewBtnList"
                  :key="item"
                  :type="activeParkAlarmView === item ? 'primary' : ''"
                  plain
                  @click="changeParkAlarmView(item)"
                  class="view-btn"
                >
                  {{ item }}
                </ElButton>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <el-icon color="#409eff" size="16"><Refresh /></el-icon>
              <button
                class="panel-fullscreen-btn"
                @click="togglePanelFullscreen('parkAlarmPanelRef')"
              >
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div v-if="activeParkAlarmView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1">
                <div class="indicator-title">预警事件总数</div>
                <div class="indicator-value">
                  <span class="park-alarm-number-animate">{{
                    parkAlarmIndicators.totalCount
                  }}</span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
              <div class="indicator-card1 card2">
                <div class="indicator-title">
                  紧急预警 {{ parkAlarmIndicators.urgentCount }} 件
                </div>
                <div class="indicator-title">
                  高危预警 {{ parkAlarmIndicators.highCount }} 件
                </div>
                <div class="indicator-title">
                  中危预警 {{ parkAlarmIndicators.midCount }} 件
                </div>
                <div class="indicator-title">
                  低危预警 {{ parkAlarmIndicators.lowCount }} 件
                </div>
              </div>
              <div class="indicator-card1 card3">
                <div class="indicator-title">未处置预警数</div>
                <div class="indicator-value">
                  <span class="park-alarm-number-animate">{{
                    parkAlarmIndicators.undisposedCount
                  }}</span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
            </div>
          </div>
          <div v-if="activeParkAlarmView === '柱状图'" class="view-content">
            <div
              style="
                display: inline-block;
                width: 49%;
                height: 100%;
                vertical-align: top;
              "
            >
              <VerticalBar2
                :x-axis="parkAlarmAreaData.xAxis"
                :series="parkAlarmAreaData.series"
                unit="件"
                title="不同区域预警数对比"
                :key="parkAlarmChartRefreshKey"
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
                :x-axis="parkAlarmTypeData.xAxis"
                :series="parkAlarmTypeData.series"
                unit="件"
                title="不同类型预警数对比"
                :key="parkAlarmChartRefreshKey"
              />
            </div>
          </div>
          <div v-if="activeParkAlarmView === '饼图'" class="view-content">
            <div
              style="
                display: inline-block;
                width: 32%;
                height: 100%;
                vertical-align: top;
              "
            >
              <ChartPie1
                :data="parkAlarmLevelRatioData"
                title="预警等级占比"
                :key="parkAlarmChartRefreshKey"
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
                :data="parkAlarmTypeRatioData"
                title="预警类型占比"
                :key="parkAlarmChartRefreshKey"
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
                :data="parkAlarmStatusRatioData"
                title="处置状态占比"
                :key="parkAlarmChartRefreshKey"
              />
            </div>
          </div>
          <div v-if="activeParkAlarmView === '列表'" class="view-content">
            <div class="table-box4">
              <ElTable
                class="table4"
                :data="parkAlarmList"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
                highlight-current-row
                @row-click="(row) => openParkAlarmDialog(row, 'detail')"
              >
                <ElTableColumn
                  prop="parkAlarmAlarmId"
                  label="预警ID"
                  align="center"
                  width="120"
                />
                <ElTableColumn
                  prop="sysAlarmLevelName"
                  label="预警等级"
                  align="center"
                  width="100"
                >
                  <template #default="scope">
                    <ElTag
                      :type="getAlarmLevelTagType(scope.row.sysAlarmLevelName)"
                    >
                      {{ scope.row.sysAlarmLevelName || '-' }}
                    </ElTag>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="sysAlarmTypeName"
                  label="预警类型"
                  align="center"
                  width="120"
                />
                <ElTableColumn
                  prop="parkAlarmAlarmTime"
                  label="预警时间"
                  align="center"
                  width="160"
                >
                  <template #default="scope">
                    {{ formatTimeStamp(scope.row.parkAlarmAlarmTime) }}
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="tbAssetExtendAddress"
                  label="预警地址"
                  align="center"
                  min-width="180"
                />
                <ElTableColumn
                  prop="sysDisposalStatusName"
                  label="处置状态"
                  align="center"
                  width="120"
                >
                  <template #default="scope">
                    <ElTag
                      :type="
                        getDisposeStatusTagType(scope.row.sysDisposalStatusName)
                      "
                    >
                      {{ scope.row.sysDisposalStatusName || '-' }}
                    </ElTag>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  label="操作"
                  align="center"
                  width="130"
                  fixed="right"
                >
                  <template #default="scope">
                    <ElButton
                      v-if="scope.row.sysDisposalStatusName === '未处置'"
                      type="warning"
                      plain
                      size="small"
                      style="width: 40px; margin: 0 3px"
                      @click.stop="openParkAlarmDialog(scope.row, 'dispose')"
                    >
                      处置
                    </ElButton>
                    <span
                      v-else
                      style="display: inline-block; width: 43px"
                    ></span>
                    <ElButton
                      type="success"
                      plain
                      size="small"
                      style="width: 40px; margin: 0 3px"
                      @click.stop="openParkAlarmDialog(scope.row, 'track')"
                    >
                      跟踪
                    </ElButton>
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
        </div>

        <div class="panel top-middle" ref="parkHiddenDangerPanelRef">
          <div class="header-actions">
            <div class="actions-left"><p>隐患预警视图</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton
                  v-for="item in parkHiddenDangerViewBtnList"
                  :key="item"
                  :type="activeParkHiddenDangerView === item ? 'primary' : ''"
                  plain
                  @click="changeParkHiddenDangerView(item)"
                  class="view-btn"
                >
                  {{ item }}
                </ElButton>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <el-icon color="#409eff" size="16"><Refresh /></el-icon>
              <button
                class="panel-fullscreen-btn"
                @click="togglePanelFullscreen('parkHiddenDangerPanelRef')"
              >
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div
            v-if="activeParkHiddenDangerView === '卡片'"
            class="view-content"
          >
            <div class="indicator-cards1">
              <div class="indicator-card1 card1">
                <div class="indicator-title">隐患总数</div>
                <div class="indicator-value">
                  <span class="park-hidden-danger-number-animate">{{
                    parkHiddenDangerIndicators.totalCount
                  }}</span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
              <div class="indicator-card1 card2">
                <div class="indicator-title">
                  重大隐患 {{ parkHiddenDangerIndicators.majorCount }} 件
                </div>
                <div class="indicator-title">
                  较大隐患 {{ parkHiddenDangerIndicators.importantCount }} 件
                </div>
                <div class="indicator-title">
                  一般隐患 {{ parkHiddenDangerIndicators.normalCount }} 件
                </div>
                <div class="indicator-title">
                  低隐患 {{ parkHiddenDangerIndicators.lowCount }} 件
                </div>
              </div>
              <div class="indicator-card1 card3">
                <div class="indicator-title">到期未整改数</div>
                <div class="indicator-value">
                  <span class="park-hidden-danger-number-animate">{{
                    parkHiddenDangerIndicators.overdueUnRectifyCount
                  }}</span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
            </div>
          </div>
          <div
            v-if="activeParkHiddenDangerView === '柱状图'"
            class="view-content"
          >
            <div
              style="
                display: inline-block;
                width: 49%;
                height: 100%;
                vertical-align: top;
              "
            >
              <VerticalBar2
                :x-axis="parkHiddenDangerAreaData.xAxis"
                :series="parkHiddenDangerAreaData.series"
                unit="件"
                title="不同区域隐患数对比"
                :key="parkHiddenDangerChartRefreshKey"
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
                :x-axis="parkHiddenDangerTypeData.xAxis"
                :series="parkHiddenDangerTypeData.series"
                unit="件"
                title="不同类型隐患数对比"
                :key="parkHiddenDangerChartRefreshKey"
              />
            </div>
          </div>
          <div
            v-if="activeParkHiddenDangerView === '饼图'"
            class="view-content"
          >
            <div
              style="
                display: inline-block;
                width: 49%;
                height: 100%;
                vertical-align: top;
              "
            >
              <ChartPie1
                :data="parkHiddenDangerLevelRatioData"
                title="隐患风险等级占比"
                :key="parkHiddenDangerChartRefreshKey"
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
                :data="parkHiddenDangerTypeRatioData"
                title="隐患类型占比"
                :key="parkHiddenDangerChartRefreshKey"
              />
            </div>
          </div>
          <div
            v-if="activeParkHiddenDangerView === '列表'"
            class="view-content"
          >
            <div class="table-box4">
              <ElTable
                class="table4"
                :data="parkHiddenDangerList"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
                highlight-current-row
                @row-click="(row) => openParkHiddenDangerDialog(row, 'detail')"
              >
                <ElTableColumn
                  prop="parkHiddenDangerHiddenDangerId"
                  label="隐患ID"
                  align="center"
                  width="140"
                />
                <ElTableColumn
                  prop="sysRiskLevelName"
                  label="风险等级"
                  align="center"
                  width="100"
                >
                  <template #default="scope">
                    <ElTag
                      :type="getRiskLevelTagType(scope.row.sysRiskLevelName)"
                    >
                      {{ scope.row.sysRiskLevelName || '-' }}
                    </ElTag>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="sysHiddenDangerTypeName"
                  label="隐患类型"
                  align="center"
                  width="120"
                />
                <ElTableColumn
                  prop="tbAssetExtendAddress"
                  label="发生位置"
                  align="center"
                  min-width="180"
                />
                <ElTableColumn
                  prop="parkHiddenDangerInfluenceRange"
                  label="影响范围"
                  align="center"
                  min-width="150"
                />
                <ElTableColumn
                  prop="sysRectificationProgressName"
                  label="整改进度"
                  align="center"
                  width="120"
                >
                  <template #default="scope">
                    <ElTag
                      :type="
                        getRectifyProgressTagType(
                          scope.row.sysRectificationProgressName,
                        )
                      "
                    >
                      {{ scope.row.sysRectificationProgressName || '-' }}
                    </ElTag>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="parkHiddenDangerRectificationDeadline"
                  label="整改期限"
                  align="center"
                  width="160"
                >
                  <template #default="scope">
                    {{
                      formatTimeStamp(
                        scope.row.parkHiddenDangerRectificationDeadline,
                      )
                    }}
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  label="操作"
                  align="center"
                  width="130"
                  fixed="right"
                >
                  <template #default="scope">
                    <ElButton
                      v-if="scope.row.sysRectificationProgressName === '未整改'"
                      type="warning"
                      plain
                      size="small"
                      style="width: 40px; margin: 0 3px"
                      @click.stop="
                        openParkHiddenDangerDialog(scope.row, 'rectify')
                      "
                    >
                      整改
                    </ElButton>
                    <span
                      v-else
                      style="display: inline-block; width: 43px"
                    ></span>
                    <ElButton
                      v-if="scope.row.parkHiddenDangerAcceptStatus === '待验收'"
                      type="success"
                      plain
                      size="small"
                      style="width: 40px; margin: 0 3px"
                      @click.stop="
                        openParkHiddenDangerDialog(scope.row, 'accept')
                      "
                    >
                      验收
                    </ElButton>
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
        </div>

        <div class="panel top-right" ref="parkAbnormalPanelRef">
          <div class="header-actions">
            <div class="actions-left"><p>异常预警视图</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton
                  v-for="item in parkAbnormalViewBtnList"
                  :key="item"
                  :type="activeParkAbnormalView === item ? 'primary' : ''"
                  plain
                  @click="changeParkAbnormalView(item)"
                  class="view-btn"
                >
                  {{ item }}
                </ElButton>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <el-icon color="#409eff" size="16"><Refresh /></el-icon>
              <button
                class="panel-fullscreen-btn"
                @click="togglePanelFullscreen('parkAbnormalPanelRef')"
              >
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div v-if="activeParkAbnormalView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1">
                <div class="indicator-title">异常事件总数</div>
                <div class="indicator-value">
                  <span class="park-abnormal-number-animate">{{
                    parkAbnormalIndicators.totalCount
                  }}</span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
              <div class="indicator-card1 card2">
                <div class="indicator-title">未解除异常数</div>
                <div class="indicator-value">
                  <span class="park-abnormal-number-animate">{{
                    parkAbnormalIndicators.unRelieveCount
                  }}</span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
              <div class="indicator-card1 card3">
                <div class="indicator-title">
                  设备异常 {{ parkAbnormalIndicators.deviceAbnormalCount }} 件
                </div>
                <div class="indicator-title">
                  数据异常 {{ parkAbnormalIndicators.dataAbnormalCount }} 件
                </div>
                <div class="indicator-title">
                  通讯异常 {{ parkAbnormalIndicators.commAbnormalCount }} 件
                </div>
              </div>
            </div>
          </div>
          <div v-if="activeParkAbnormalView === '柱状图'" class="view-content">
            <div
              style="
                display: inline-block;
                width: 49%;
                height: 100%;
                vertical-align: top;
              "
            >
              <VerticalBar2
                :x-axis="parkAbnormalAreaData.xAxis"
                :series="parkAbnormalAreaData.series"
                unit="件"
                title="不同区域异常数对比"
                :key="parkAbnormalChartRefreshKey"
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
                :x-axis="parkAbnormalTypeData.xAxis"
                :series="parkAbnormalTypeData.series"
                unit="件"
                title="不同类型异常数对比"
                :key="parkAbnormalChartRefreshKey"
              />
            </div>
          </div>
          <div v-if="activeParkAbnormalView === '折线图'" class="view-content">
            <div
              style="
                display: inline-block;
                width: 100%;
                height: 100%;
                padding-left: 0.3vw;
                vertical-align: top;
              "
            >
              <ChartLine1
                :data="parkAbnormalTrendData"
                title="异常事件近周期变化趋势"
                :key="parkAbnormalChartRefreshKey"
              />
            </div>
          </div>
          <div v-if="activeParkAbnormalView === '列表'" class="view-content">
            <div class="table-box4">
              <ElTable
                class="table4"
                :data="parkAbnormalList"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
                highlight-current-row
                @row-click="(row) => openParkAbnormalDialog(row, 'detail')"
              >
                <ElTableColumn
                  prop="parkAbnormalAbnormalId"
                  label="异常ID"
                  align="center"
                  width="140"
                />
                <ElTableColumn
                  prop="sysAbnormalTypeName"
                  label="异常类型"
                  align="center"
                  width="120"
                >
                  <template #default="scope">
                    <ElTag
                      :type="
                        getAbnormalTypeTagType(scope.row.sysAbnormalTypeName)
                      "
                    >
                      {{ scope.row.sysAbnormalTypeName || '-' }}
                    </ElTag>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="parkAbnormalAbnormalTime"
                  label="异常时间"
                  align="center"
                  width="160"
                >
                  <template #default="scope">
                    {{ formatTimeStamp(scope.row.parkAbnormalAbnormalTime) }}
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="tbAssetExtendAddress"
                  label="异常位置"
                  align="center"
                  min-width="180"
                />
                <ElTableColumn
                  prop="parkAbnormalRelieveStatus"
                  label="解除状态"
                  align="center"
                  width="120"
                >
                  <template #default="scope">
                    <ElTag
                      :type="
                        getAbnormalStatusTagType(
                          scope.row.parkAbnormalRelieveStatus,
                        )
                      "
                    >
                      {{ scope.row.parkAbnormalRelieveStatus || '-' }}
                    </ElTag>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  label="操作"
                  align="center"
                  width="130"
                  fixed="right"
                >
                  <template #default="scope">
                    <ElButton
                      v-if="scope.row.parkAbnormalRelieveStatus === '未解除'"
                      type="warning"
                      plain
                      size="small"
                      style="width: 40px; margin: 0 3px"
                      @click.stop="openParkAbnormalDialog(scope.row, 'dispose')"
                    >
                      处置
                    </ElButton>
                    <span
                      v-else
                      style="display: inline-block; width: 43px"
                    ></span>
                    <ElButton
                      v-if="scope.row.parkAbnormalRelieveStatus === '未解除'"
                      type="success"
                      plain
                      size="small"
                      style="width: 40px; margin: 0 3px"
                      @click.stop="openParkAbnormalDialog(scope.row, 'relieve')"
                    >
                      解除
                    </ElButton>
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="panel bottom-left" ref="eventDisposalTrackingRef">
          <div class="header-actions">
            <div class="actions-left"><p>事件处置跟踪</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton
                  v-for="item in disposeTrackViewBtnList"
                  :key="item"
                  :type="activeDisposeTrackView === item ? 'primary' : ''"
                  plain
                  @click="changeDisposeTrackView(item)"
                  class="view-btn"
                >
                  {{ item }}
                </ElButton>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <el-icon color="#409eff" size="16"><Refresh /></el-icon>
              <button
                class="panel-fullscreen-btn"
                @click="togglePanelFullscreen('eventDisposalTrackingRef')"
              >
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div v-if="activeDisposeTrackView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1">
                <div class="indicator-title">平均处置时长</div>
                <div class="indicator-value">
                  {{ formatDecimal(disposeTrackIndicators.avgDisposeDuration) }}
                </div>
                <div class="indicator-unit">小时</div>
              </div>
              <div class="indicator-card1 card2">
                <div class="indicator-title">超时处置数</div>
                <div class="indicator-value">
                  <span class="dispose-track-number-animate">{{
                    disposeTrackIndicators.overtimeCount
                  }}</span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
              <div class="indicator-card1 card3">
                <div class="indicator-title">已完成处置数</div>
                <div class="indicator-value">
                  <span class="dispose-track-number-animate">{{
                    disposeTrackIndicators.finishCount
                  }}</span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
            </div>
          </div>
          <div v-if="activeDisposeTrackView === '甘特图'" class="view-content">
            <FlightGanttChart1
              title="各预警事件处置全流程时间轴"
              :key="disposeTrackChartRefreshKey"
              :refresh-key="disposeTrackChartRefreshKey"
            />
          </div>
          <div v-if="activeDisposeTrackView === '柱状图'" class="view-content">
            <VerticalBar1
              :x-axis="disposeUserEfficiencyData.xAxis"
              :series="disposeUserEfficiencyData.series"
              unit="小时"
              title="不同处置人处置效率对比"
              :key="disposeTrackChartRefreshKey"
            />
          </div>
          <div v-if="activeDisposeTrackView === '列表'" class="view-content">
            <div class="table-box4">
              <ElTable
                class="table4"
                :data="disposeTrackList"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
                highlight-current-row
                @row-click="(row) => openDisposeTrackDialog(row, 'detail')"
              >
                <ElTableColumn
                  prop="parkAlarmAlarmId"
                  label="预警ID"
                  align="center"
                  width="120"
                />
                <ElTableColumn
                  prop="sysAlarmTypeName"
                  label="预警类型"
                  align="center"
                  width="120"
                />
                <ElTableColumn
                  prop="sysMaintainUserUserName"
                  label="处置人"
                  align="center"
                  width="140"
                />
                <ElTableColumn
                  prop="parkMaintainWorkorderStartTime"
                  label="开始处置时间"
                  align="center"
                  width="160"
                >
                  <template #default="scope">
                    {{
                      formatTimeStamp(scope.row.parkMaintainWorkorderStartTime)
                    }}
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="sysDisposalProgressName"
                  label="处置状态"
                  align="center"
                  width="120"
                >
                  <template #default="scope">
                    <ElTag
                      :type="
                        getDisposeProgressTagType(
                          scope.row.sysDisposalProgressName,
                        )
                      "
                    >
                      {{ scope.row.sysDisposalProgressName || '-' }}
                    </ElTag>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="parkMaintainWorkorderWorkorderNo"
                  label="关联工单号"
                  align="center"
                  width="140"
                />
                <ElTableColumn
                  label="操作"
                  align="center"
                  width="130"
                  fixed="right"
                >
                  <template #default="scope">
                    <ElButton
                      type="warning"
                      plain
                      size="small"
                      style="width: 40px; margin: 0 3px"
                      @click.stop="
                        openDisposeTrackDialog(scope.row, 'cooperate')
                      "
                    >
                      协同
                    </ElButton>
                    <ElButton
                      type="danger"
                      plain
                      size="small"
                      style="width: 40px; margin: 0 3px"
                      @click.stop="submitUrgeHandle(scope.row)"
                    >
                      催办
                    </ElButton>
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
        </div>
        <div class="panel bottom-middle" ref="parkFaultPanelRef">
          <div class="header-actions">
            <div class="actions-left"><p>故障预警视图</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton
                  v-for="item in parkFaultViewBtnList"
                  :key="item"
                  :type="activeParkFaultView === item ? 'primary' : ''"
                  plain
                  @click="changeParkFaultView(item)"
                  class="view-btn"
                >
                  {{ item }}
                </ElButton>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <el-icon color="#409eff" size="16"><Refresh /></el-icon>
              <button
                class="panel-fullscreen-btn"
                @click="togglePanelFullscreen('parkFaultPanelRef')"
              >
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div v-if="activeParkFaultView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1">
                <div class="indicator-title">故障总数</div>
                <div class="indicator-value">
                  <span class="park-fault-number-animate">{{
                    parkFaultIndicators.totalCount
                  }}</span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
              <div class="indicator-card1 card2">
                <div class="indicator-title">
                  紧急故障 {{ parkFaultIndicators.urgentCount }} 件
                </div>
                <div class="indicator-title">
                  严重故障 {{ parkFaultIndicators.seriousCount }} 件
                </div>
                <div class="indicator-title">
                  硬件故障 {{ parkFaultIndicators.hardwareFaultCount }} 件
                </div>
                <div class="indicator-title">
                  软件故障 {{ parkFaultIndicators.softwareFaultCount }} 件
                </div>
                <div class="indicator-title">
                  通讯故障 {{ parkFaultIndicators.commFaultCount }} 件
                </div>
              </div>
              <div class="indicator-card1 card3">
                <div class="indicator-title">未修复故障数</div>
                <div class="indicator-value">
                  <span class="park-fault-number-animate">{{
                    parkFaultIndicators.unRepairCount
                  }}</span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
            </div>
          </div>
          <div v-if="activeParkFaultView === '柱状图'" class="view-content">
            <div
              style="
                display: inline-block;
                width: 49%;
                height: 100%;
                vertical-align: top;
              "
            >
              <VerticalBar2
                :x-axis="parkFaultAreaData.xAxis"
                :series="parkFaultAreaData.series"
                unit="件"
                title="不同区域故障数对比"
                :key="parkFaultChartRefreshKey"
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
                :x-axis="parkFaultEquipmentData.xAxis"
                :series="parkFaultEquipmentData.series"
                unit="件"
                title="不同设备类型故障数对比"
                :key="parkFaultChartRefreshKey"
              />
            </div>
          </div>
          <div v-if="activeParkFaultView === '饼图'" class="view-content">
            <div
              style="
                display: inline-block;
                width: 49%;
                height: 100%;
                vertical-align: top;
              "
            >
              <ChartPie1
                :data="parkFaultTypeRatioData"
                title="故障类型占比"
                :key="parkFaultChartRefreshKey"
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
                :data="parkFaultEquipmentRatioData"
                title="设备类型占比"
                :key="parkFaultChartRefreshKey"
              />
            </div>
          </div>
          <div v-if="activeParkFaultView === '列表'" class="view-content">
            <div class="table-box4">
              <ElTable
                class="table4"
                :data="parkFaultList"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
                highlight-current-row
                @row-click="(row) => openParkFaultDialog(row, 'detail')"
              >
                <ElTableColumn
                  prop="parkFaultFaultId"
                  label="故障ID"
                  align="center"
                  width="120"
                />
                <ElTableColumn
                  prop="sysFaultTypeName"
                  label="故障类型"
                  align="center"
                  width="120"
                />
                <ElTableColumn
                  prop="sysEquipmentTypeName"
                  label="设备类型"
                  align="center"
                  width="120"
                />
                <ElTableColumn
                  prop="tbDeviceExtendInstallPosition"
                  label="故障位置"
                  align="center"
                  min-width="180"
                />
                <ElTableColumn
                  prop="parkFaultFaultTime"
                  label="故障时间"
                  align="center"
                  width="160"
                >
                  <template #default="scope">
                    {{ formatTimeStamp(scope.row.parkFaultFaultTime) }}
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="sysMaintenanceProgressName"
                  label="维修进度"
                  align="center"
                  width="120"
                >
                  <template #default="scope">
                    <ElTag
                      :type="
                        getMaintenanceProgressTagType(
                          scope.row.sysMaintenanceProgressName,
                        )
                      "
                    >
                      {{ scope.row.sysMaintenanceProgressName || '-' }}
                    </ElTag>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  label="操作"
                  align="center"
                  width="130"
                  fixed="right"
                >
                  <template #default="scope">
                    <ElButton
                      v-if="scope.row.sysMaintenanceProgressName === '未处理'"
                      type="warning"
                      plain
                      size="small"
                      style="width: 40px; margin: 0 3px"
                      @click.stop="openParkFaultDialog(scope.row, 'dispatch')"
                    >
                      派单
                    </ElButton>
                    <span
                      v-else
                      style="display: inline-block; width: 43px"
                    ></span>
                    <ElButton
                      type="success"
                      plain
                      size="small"
                      style="width: 40px; margin: 0 3px"
                      @click.stop="openParkFaultDialog(scope.row, 'track')"
                    >
                      跟踪
                    </ElButton>
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
        </div>
        <div class="panel bottom-right" ref="parkComplianceWarningPanelRef">
          <div class="header-actions">
            <div class="actions-left"><p>合规预警视图</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton
                  v-for="item in parkComplianceWarningViewBtnList"
                  :key="item"
                  :type="
                    activeParkComplianceWarningView === item ? 'primary' : ''
                  "
                  plain
                  @click="changeParkComplianceWarningView(item)"
                  class="view-btn"
                >
                  {{ item }}
                </ElButton>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <el-icon color="#409eff" size="16"><Refresh /></el-icon>
              <button
                class="panel-fullscreen-btn"
                @click="togglePanelFullscreen('parkComplianceWarningPanelRef')"
              >
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div
            v-if="activeParkComplianceWarningView === '卡片'"
            class="view-content"
          >
            <div class="indicator-cards1">
              <div class="indicator-card1 card1">
                <div class="indicator-title">合规预警总数</div>
                <div class="indicator-value">
                  <span class="park-compliance-warning-number-animate">{{
                    parkComplianceWarningIndicators.totalCount
                  }}</span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
              <div class="indicator-card1 card2">
                <div class="indicator-title">未整改预警数</div>
                <div class="indicator-value">
                  <span class="park-compliance-warning-number-animate">{{
                    parkComplianceWarningIndicators.unRectifyCount
                  }}</span>
                </div>
                <div class="indicator-unit">件</div>
              </div>
              <div class="indicator-card1 card3">
                <div class="indicator-title">核查通过率</div>
                <div class="indicator-value">
                  {{ formatDecimal(parkComplianceWarningIndicators.passRate) }}
                </div>
                <div class="indicator-unit">%</div>
              </div>
            </div>
          </div>
          <div
            v-if="activeParkComplianceWarningView === '柱状图'"
            class="view-content"
          >
            <div
              style="
                display: inline-block;
                width: 49%;
                height: 100%;
                vertical-align: top;
              "
            >
              <VerticalBar2
                :x-axis="parkComplianceWarningAreaData.xAxis"
                :series="parkComplianceWarningAreaData.series"
                unit="件"
                title="不同区域预警数对比"
                :key="parkComplianceWarningChartRefreshKey"
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
                :x-axis="parkComplianceWarningTypeData.xAxis"
                :series="parkComplianceWarningTypeData.series"
                unit="件"
                title="不同违规类型预警数对比"
                :key="parkComplianceWarningChartRefreshKey"
              />
            </div>
          </div>
          <div
            v-if="activeParkComplianceWarningView === '饼图'"
            class="view-content"
          >
            <div
              style="
                display: inline-block;
                width: 49%;
                height: 100%;
                vertical-align: top;
              "
            >
              <ChartPie1
                :data="parkComplianceWarningViolationRatioData"
                title="违规类型占比"
                :key="parkComplianceWarningChartRefreshKey"
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
                :data="parkComplianceWarningSubjectRatioData"
                title="责任主体类型占比"
                :key="parkComplianceWarningChartRefreshKey"
              />
            </div>
          </div>
          <div
            v-if="activeParkComplianceWarningView === '列表'"
            class="view-content"
          >
            <div class="table-box4">
              <ElTable
                class="table4"
                :data="parkComplianceWarningList"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
                highlight-current-row
                @row-click="
                  (row) => openParkComplianceWarningDialog(row, 'detail')
                "
              >
                <ElTableColumn
                  prop="parkComplianceWarningWarningId"
                  label="合规预警ID"
                  align="center"
                />
                <ElTableColumn
                  prop="sysViolationTypeName"
                  label="违规类型"
                  align="center"
                />
                <ElTableColumn
                  prop="parkComplianceWarningViolationDetail"
                  label="违规详情"
                  align="center"
                  min-width="200"
                  show-overflow-tooltip
                />
                <ElTableColumn
                  prop="parkComplianceWarningWarningTime"
                  label="发生时间"
                  align="center"
                  min-width="130"
                >
                  <template #default="scope">
                    {{
                      formatTimeStamp(
                        scope.row.parkComplianceWarningWarningTime,
                      )
                    }}
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="tbAssetExtendAddress"
                  label="发生位置"
                  align="center"
                  min-width="180"
                />
                <ElTableColumn
                  prop="sysRectificationStatusName"
                  label="整改状态"
                  align="center"
                >
                  <template #default="scope">
                    <ElTag
                      :type="
                        getComplianceRectifyStatusTagType(
                          scope.row.sysRectificationStatusName,
                        )
                      "
                    >
                      {{ scope.row.sysRectificationStatusName || '-' }}
                    </ElTag>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  label="操作"
                  align="center"
                  width="130"
                  fixed="right"
                >
                  <template #default="scope">
                    <ElButton
                      v-if="scope.row.sysRectificationStatusName === '未整改'"
                      type="warning"
                      plain
                      size="small"
                      style="width: 40px; margin: 0 3px"
                      @click.stop="
                        openParkComplianceWarningDialog(scope.row, 'rectify')
                      "
                    >
                      整改
                    </ElButton>
                    <span
                      v-else
                      style="display: inline-block; width: 43px"
                    ></span>
                    <ElButton
                      v-if="scope.row.sysRectificationStatusName === '整改中'"
                      type="success"
                      plain
                      size="small"
                      style="width: 40px; margin: 0 3px"
                      @click.stop="
                        openParkComplianceWarningDialog(scope.row, 'inspect')
                      "
                    >
                      核查
                    </ElButton>
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ElDialog
    v-model="parkAlarmDialogVisible"
    width="620px"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    class="park-alarm-dialog"
    center
    destroy-on-close
  >
    <template #title>
      <span v-if="parkAlarmDialogType === 'detail'">预警事件详情</span
      ><span v-if="parkAlarmDialogType === 'dispose'">预警事件处置</span
      ><span v-if="parkAlarmDialogType === 'track'">预警事件跟踪</span>
    </template>
    <div v-if="parkAlarmDialogType === 'detail'">
      <ElDescriptions bordered :column="1" class="desc-detail">
        <ElDescriptionsItem label="预警ID">
          {{ parkAlarmSelectedRow.parkAlarmAlarmId || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="预警等级">
          <ElTag
            :type="getAlarmLevelTagType(parkAlarmSelectedRow.sysAlarmLevelName)"
          >
            {{ parkAlarmSelectedRow.sysAlarmLevelName || '-' }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="预警类型">
          {{ parkAlarmSelectedRow.sysAlarmTypeName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="预警时间">
          {{ formatTimeStamp(parkAlarmSelectedRow.parkAlarmAlarmTime) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="责任单位">
          {{ parkAlarmSelectedRow.sysResponsibleUnitName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="接收时间">
          {{ formatTimeStamp(parkAlarmSelectedRow.parkAlarmReceiveTime) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="处置时长">
          {{ parkAlarmSelectedRow.parkAlarmDisposalDuration || 0 }}
          小时
        </ElDescriptionsItem>
        <ElDescriptionsItem label="关联资产">
          {{ parkAlarmSelectedRow.tbAssetExtendName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="预警地址">
          {{ parkAlarmSelectedRow.tbAssetExtendAddress || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="关联工单号">
          {{ parkAlarmSelectedRow.parkMaintainWorkorderWorkorderNo || '暂无' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="关联证据">
          <div class="evidence-list">
            <ElImage
              v-for="(url, idx) in parkAlarmSelectedRow.parkAlarmEvidence"
              :key="idx"
              :src="url"
              fit="cover"
              :preview-list="parkAlarmSelectedRow.parkAlarmEvidence"
            />
          </div>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="处置日志">
          <div
            class="log-list"
            v-if="parkAlarmSelectedRow.parkAlarmDisposalLog.length > 0"
          >
            <div
              class="log-item"
              v-for="(log, idx) in parkAlarmSelectedRow.parkAlarmDisposalLog"
              :key="idx"
            >
              <span class="log-time">{{ formatTimeStamp(log.time) }}</span
              ><span class="log-content">{{ log.content || '-' }}</span>
            </div>
          </div>
          <div class="empty-log" v-else>暂无处置日志</div>
        </ElDescriptionsItem>
      </ElDescriptions>
    </div>
    <div v-if="parkAlarmDialogType === 'dispose'">
      <ElForm
        :model="disposeForm"
        :rules="disposeRules"
        label-width="100px"
        class="dispose-form"
        ref="disposeFormRef"
      >
        <ElFormItem
          label="处置措施"
          prop="disposalMeasure"
          class="form-item-required"
        >
          <el-input
            v-model="disposeForm.disposalMeasure"
            :rows="6"
            type="textarea"
            placeholder="请输入处置措施"
            maxlength="500"
            show-word-limit
            clearable
            autofocus
            style="width: 100%"
          />
        </ElFormItem>
        <ElFormItem label="处置凭证">
          <ElUpload
            v-model:file-list="disposeForm.disposeFileList"
            list-type="picture-card"
            :limit="3"
            :auto-upload="false"
            accept="image/*"
          >
            <div>
              <el-icon><UploadFilled /></el-icon>
            </div>
          </ElUpload>
          <div>最多上传3张图片，支持jpg/png格式</div>
        </ElFormItem>
        <div style="text-align: right">
          <ElButton type="primary" @click="submitDisposeForm">
            确认提交
          </ElButton>
          <ElButton plain @click="closeParkAlarmDialog">取消</ElButton>
        </div>
      </ElForm>
    </div>
    <div v-if="parkAlarmDialogType === 'track'">
      <ElDescriptions bordered :column="1" class="desc-track">
        <ElDescriptionsItem label="预警ID">
          {{ parkAlarmSelectedRow.parkAlarmAlarmId || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="处置状态">
          <ElTag
            :type="
              getDisposeStatusTagType(
                parkAlarmSelectedRow.sysDisposalStatusName,
              )
            "
          >
            {{ parkAlarmSelectedRow.sysDisposalStatusName || '-' }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="处置进度">
          {{ parkAlarmSelectedRow.parkAlarmProgress || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="关联工单号">
          {{ parkAlarmSelectedRow.parkMaintainWorkorderWorkorderNo || '暂无' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="处置时长">
          {{ parkAlarmSelectedRow.parkAlarmDisposalDuration || 0 }}
          小时
        </ElDescriptionsItem>
        <ElDescriptionsItem label="最新处置记录">
          <div class="feedback-content">
            {{
              parkAlarmSelectedRow.parkAlarmDisposalLog.length > 0
                ? parkAlarmSelectedRow.parkAlarmDisposalLog[
                    parkAlarmSelectedRow.parkAlarmDisposalLog.length - 1
                  ].content
                : '暂无处置记录'
            }}
          </div>
        </ElDescriptionsItem>
      </ElDescriptions>
    </div>
  </ElDialog>

  <ElDialog
    v-model="parkHiddenDangerDialogVisible"
    width="620px"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    class="park-alarm-dialog"
    center
    destroy-on-close
  >
    <template #title>
      <span v-if="parkHiddenDangerDialogType === 'detail'">隐患详情</span
      ><span v-if="parkHiddenDangerDialogType === 'rectify'">隐患整改提交</span
      ><span v-if="parkHiddenDangerDialogType === 'accept'">隐患验收提交</span>
    </template>
    <div v-if="parkHiddenDangerDialogType === 'detail'">
      <ElDescriptions bordered :column="1" class="desc-detail">
        <ElDescriptionsItem label="隐患ID">
          {{
            parkHiddenDangerSelectedRow.parkHiddenDangerHiddenDangerId || '-'
          }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="风险等级">
          <ElTag
            :type="
              getRiskLevelTagType(parkHiddenDangerSelectedRow.sysRiskLevelName)
            "
          >
            {{ parkHiddenDangerSelectedRow.sysRiskLevelName || '-' }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="隐患类型">
          {{ parkHiddenDangerSelectedRow.sysHiddenDangerTypeName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="发现时间">
          {{
            formatTimeStamp(
              parkHiddenDangerSelectedRow.parkHiddenDangerDiscoverTime,
            )
          }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="整改责任人">
          {{ parkHiddenDangerSelectedRow.sysUserUserName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="发生位置">
          {{ parkHiddenDangerSelectedRow.tbAssetExtendAddress || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="影响范围">
          {{
            parkHiddenDangerSelectedRow.parkHiddenDangerInfluenceRange || '-'
          }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="整改进度">
          <ElTag
            :type="
              getRectifyProgressTagType(
                parkHiddenDangerSelectedRow.sysRectificationProgressName,
              )
            "
          >
            {{
              parkHiddenDangerSelectedRow.sysRectificationProgressName || '-'
            }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="验收状态">
          <ElTag
            :type="
              getAcceptStatusTagType(
                parkHiddenDangerSelectedRow.parkHiddenDangerAcceptStatus,
              )
            "
          >
            {{
              parkHiddenDangerSelectedRow.parkHiddenDangerAcceptStatus || '-'
            }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="整改期限">
          {{
            formatTimeStamp(
              parkHiddenDangerSelectedRow.parkHiddenDangerRectificationDeadline,
            )
          }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="现场照片">
          <div class="evidence-list">
            <ElImage
              v-for="(
                url, idx
              ) in parkHiddenDangerSelectedRow.parkHiddenDangerEvidence"
              :key="idx"
              :src="url"
              fit="cover"
              :preview-list="
                parkHiddenDangerSelectedRow.parkHiddenDangerEvidence
              "
            />
          </div>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="整改要求">
          <div class="feedback-content">
            {{
              parkHiddenDangerSelectedRow.parkHiddenDangerRectifyRequire || '-'
            }}
          </div>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="整改日志">
          <div
            class="log-list"
            v-if="
              parkHiddenDangerSelectedRow.parkHiddenDangerRectifyLog.length > 0
            "
          >
            <div
              class="log-item"
              v-for="(
                log, idx
              ) in parkHiddenDangerSelectedRow.parkHiddenDangerRectifyLog"
              :key="idx"
            >
              <span class="log-time">{{ formatTimeStamp(log.time) }}</span
              ><span class="log-content">{{ log.content || '-' }}</span>
            </div>
          </div>
          <div class="empty-log" v-else>暂无整改日志</div>
        </ElDescriptionsItem>
      </ElDescriptions>
    </div>
    <div v-if="parkHiddenDangerDialogType === 'rectify'">
      <ElForm
        :model="rectifyForm"
        :rules="rectifyRules"
        label-width="100px"
        class="dispose-form"
        ref="rectifyFormRef"
      >
        <ElFormItem
          label="整改方案"
          prop="rectifyScheme"
          class="form-item-required"
        >
          <el-input
            v-model="rectifyForm.rectifyScheme"
            :rows="6"
            type="textarea"
            placeholder="请输入整改方案"
            maxlength="500"
            show-word-limit
            clearable
            autofocus
            style="width: 100%"
          />
        </ElFormItem>
        <ElFormItem label="整改凭证">
          <ElUpload
            v-model:file-list="rectifyForm.rectifyFileList"
            list-type="picture-card"
            :limit="3"
            :auto-upload="false"
            accept="image/*"
          >
            <div>
              <el-icon><UploadFilled /></el-icon>
            </div>
          </ElUpload>
          <div>最多上传3张图片，支持jpg/png格式</div>
        </ElFormItem>
        <div style="text-align: right">
          <ElButton type="primary" @click="submitRectifyForm">
            确认提交 </ElButton
          ><ElButton plain @click="closeParkHiddenDangerDialog">
            取消
          </ElButton>
        </div>
      </ElForm>
    </div>
    <div v-if="parkHiddenDangerDialogType === 'accept'">
      <ElForm
        :model="acceptForm"
        :rules="acceptRules"
        label-width="100px"
        class="dispose-form"
        ref="acceptFormRef"
      >
        <ElFormItem
          label="验收结果"
          prop="acceptResult"
          class="form-item-required"
        >
          <el-radio-group v-model="acceptForm.acceptResult" style="width: 100%">
            <el-radio label="通过">通过</el-radio
            ><el-radio label="未通过">未通过</el-radio>
          </el-radio-group>
        </ElFormItem>
        <ElFormItem label="验收意见">
          <el-input
            v-model="acceptForm.acceptOpinion"
            :rows="4"
            type="textarea"
            placeholder="请输入验收意见（选填）"
            maxlength="300"
            show-word-limit
            clearable
            style="width: 100%"
          />
        </ElFormItem>
        <div style="text-align: right">
          <ElButton type="primary" @click="submitAcceptForm">
            确认提交 </ElButton
          ><ElButton plain @click="closeParkHiddenDangerDialog">
            取消
          </ElButton>
        </div>
      </ElForm>
    </div>
  </ElDialog>

  <ElDialog
    v-model="disposeTrackDialogVisible"
    width="620px"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    class="park-alarm-dialog"
    center
    destroy-on-close
  >
    <template #title>
      <span v-if="disposeTrackDialogType === 'detail'">处置跟踪详情</span
      ><span v-if="disposeTrackDialogType === 'cooperate'">协同处置申请</span>
    </template>
    <div v-if="disposeTrackDialogType === 'detail'">
      <ElDescriptions bordered :column="1" class="desc-detail">
        <ElDescriptionsItem label="预警ID">
          {{ disposeTrackSelectedRow.parkAlarmAlarmId || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="预警类型">
          {{ disposeTrackSelectedRow.sysAlarmTypeName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="处置人">
          {{ disposeTrackSelectedRow.sysMaintainUserUserName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="开始处置时间">
          {{
            formatTimeStamp(
              disposeTrackSelectedRow.parkMaintainWorkorderStartTime,
            )
          }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="处置状态">
          <ElTag
            :type="
              getDisposeProgressTagType(
                disposeTrackSelectedRow.sysDisposalProgressName,
              )
            "
          >
            {{ disposeTrackSelectedRow.sysDisposalProgressName || '-' }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="派单耗时">
          {{
            disposeTrackSelectedRow.parkMaintainWorkorderDispatchDuration || 0
          }}
          小时
        </ElDescriptionsItem>
        <ElDescriptionsItem label="处置耗时">
          {{ disposeTrackSelectedRow.parkMaintainWorkorderDealTime || 0 }}
          小时
        </ElDescriptionsItem>
        <ElDescriptionsItem label="预计完成时间">
          {{
            formatTimeStamp(
              disposeTrackSelectedRow.parkMaintainWorkorderExpectedFinishTime,
            )
          }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="关联工单号">
          {{
            disposeTrackSelectedRow.parkMaintainWorkorderWorkorderNo || '暂无'
          }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="处置凭证">
          <div class="evidence-list">
            <ElImage
              v-for="(url, idx) in disposeTrackSelectedRow.parkAlarmEvidence"
              :key="idx"
              :src="url"
              fit="cover"
              :preview-list="disposeTrackSelectedRow.parkAlarmEvidence"
            />
          </div>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="处置全流程日志">
          <div
            class="log-list"
            v-if="disposeTrackSelectedRow.disposeAllLog.length > 0"
          >
            <div
              class="log-item"
              v-for="(log, idx) in disposeTrackSelectedRow.disposeAllLog"
              :key="idx"
            >
              <span class="log-time">{{ formatTimeStamp(log.time) }}</span
              ><span class="log-content">{{ log.content || '-' }}</span>
            </div>
          </div>
          <div class="empty-log" v-else>暂无处置日志</div>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="最新动态">
          {{
            disposeTrackSelectedRow.parkMaintainWorkorderLatestDynamic || '-'
          }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </div>
    <div v-if="disposeTrackDialogType === 'cooperate'">
      <ElForm
        :model="cooperateForm"
        :rules="cooperateRules"
        label-width="100px"
        class="dispose-form"
        ref="cooperateFormRef"
      >
        <ElFormItem
          label="协同人员"
          prop="cooperateUser"
          class="form-item-required"
        >
          <el-input
            v-model="cooperateForm.cooperateUser"
            placeholder="请输入协同人员，多个人员用英文逗号分隔"
            clearable
            style="width: 100%"
          />
        </ElFormItem>
        <ElFormItem
          label="协同理由"
          prop="cooperateReason"
          class="form-item-required"
        >
          <el-input
            v-model="cooperateForm.cooperateReason"
            :rows="6"
            type="textarea"
            placeholder="请输入协同理由"
            maxlength="300"
            show-word-limit
            clearable
            autofocus
            style="width: 100%"
          />
        </ElFormItem>
        <div style="text-align: right">
          <ElButton type="primary" @click="submitCooperateForm">
            确认提交 </ElButton
          ><ElButton plain @click="closeDisposeTrackDialog">取消</ElButton>
        </div>
      </ElForm>
    </div>
  </ElDialog>

  <ElDialog
    v-model="parkAbnormalDialogVisible"
    width="620px"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    class="park-alarm-dialog"
    center
    destroy-on-close
  >
    <template #title>
      <span v-if="parkAbnormalDialogType === 'detail'">异常事件详情</span>
      <span v-if="parkAbnormalDialogType === 'dispose'">异常事件处置</span>
      <span v-if="parkAbnormalDialogType === 'relieve'">异常事件解除</span>
    </template>
    <div v-if="parkAbnormalDialogType === 'detail'">
      <ElDescriptions bordered :column="1" class="desc-detail">
        <ElDescriptionsItem label="异常ID">
          {{ parkAbnormalSelectedRow.parkAbnormalAbnormalId || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="异常类型">
          <ElTag
            :type="
              getAbnormalTypeTagType(
                parkAbnormalSelectedRow.sysAbnormalTypeName,
              )
            "
          >
            {{ parkAbnormalSelectedRow.sysAbnormalTypeName || '-' }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="异常原因">
          <div class="feedback-content">
            {{ parkAbnormalSelectedRow.parkAbnormalAbnormalReason || '-' }}
          </div>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="异常时间">
          {{
            formatTimeStamp(parkAbnormalSelectedRow.parkAbnormalAbnormalTime)
          }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="责任运维">
          {{ parkAbnormalSelectedRow.sysUserUserName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="异常位置">
          {{ parkAbnormalSelectedRow.tbAssetExtendAddress || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="关联设备">
          {{ parkAbnormalSelectedRow.tbAssetExtendName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="设备类型">
          {{ parkAbnormalSelectedRow.sysAssociatedObjectTypeName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="解除状态">
          <ElTag
            :type="
              getAbnormalStatusTagType(
                parkAbnormalSelectedRow.parkAbnormalRelieveStatus,
              )
            "
          >
            {{ parkAbnormalSelectedRow.parkAbnormalRelieveStatus || '-' }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="解除时间">
          {{ formatTimeStamp(parkAbnormalSelectedRow.parkAbnormalRelieveTime) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="异常时长">
          {{ parkAbnormalSelectedRow.parkAbnormalDuration || 0 }}
          小时
        </ElDescriptionsItem>
        <ElDescriptionsItem label="现场凭证">
          <div class="evidence-list">
            <ElImage
              v-for="(url, idx) in parkAbnormalSelectedRow.parkAbnormalEvidence"
              :key="idx"
              :src="url"
              fit="cover"
              :preview-list="parkAbnormalSelectedRow.parkAbnormalEvidence"
            />
          </div>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="处置日志">
          <div
            class="log-list"
            v-if="parkAbnormalSelectedRow.parkAbnormalDisposeLog.length > 0"
          >
            <div
              class="log-item"
              v-for="(
                log, idx
              ) in parkAbnormalSelectedRow.parkAbnormalDisposeLog"
              :key="idx"
            >
              <span class="log-time">{{ formatTimeStamp(log.time) }}</span
              ><span class="log-content">{{ log.content || '-' }}</span>
            </div>
          </div>
          <div class="empty-log" v-else>暂无处置日志</div>
        </ElDescriptionsItem>
      </ElDescriptions>
    </div>
    <div v-if="parkAbnormalDialogType === 'dispose'">
      <ElForm
        :model="abnormalDisposeForm"
        :rules="abnormalDisposeRules"
        label-width="100px"
        class="dispose-form"
        ref="abnormalDisposeFormRef"
      >
        <ElFormItem
          label="处置措施"
          prop="disposeMeasure"
          class="form-item-required"
        >
          <el-input
            v-model="abnormalDisposeForm.disposeMeasure"
            :rows="6"
            type="textarea"
            placeholder="请输入处置措施"
            maxlength="300"
            show-word-limit
            clearable
            autofocus
            style="width: 100%"
          />
        </ElFormItem>
        <ElFormItem label="处置凭证">
          <ElUpload
            v-model:file-list="abnormalDisposeForm.disposeFileList"
            list-type="picture-card"
            :limit="3"
            :auto-upload="false"
            accept="image/*"
          >
            <div>
              <el-icon><UploadFilled /></el-icon>
            </div>
          </ElUpload>
          <div>最多上传3张图片，支持jpg/png格式</div>
        </ElFormItem>
        <div style="text-align: right">
          <ElButton type="primary" @click="submitAbnormalDisposeForm">
            确认提交 </ElButton
          ><ElButton plain @click="closeParkAbnormalDialog">取消</ElButton>
        </div>
      </ElForm>
    </div>
    <div v-if="parkAbnormalDialogType === 'relieve'">
      <div
        class="feedback-content"
        style="padding: 20px; margin: 20px 0; text-align: center"
      >
        <p style="margin-bottom: 20px; font-size: 16px">
          确认解除【{{
            parkAbnormalSelectedRow.parkAbnormalAbnormalId
          }}】该异常事件吗？
        </p>
        <p style="color: #eb5757">
          解除后将更新异常状态为「已解除」，并记录解除时间
        </p>
      </div>
      <div style="text-align: right">
        <ElButton
          type="success"
          size="default"
          @click="confirmRelieveDialogVisible = true"
        >
          确认解除
        </ElButton>
        <ElButton
          plain
          style="margin-left: 20px"
          @click="closeParkAbnormalDialog"
        >
          取消
        </ElButton>
      </div>
    </div>
  </ElDialog>

  <ElDialog
    v-model="parkFaultDialogVisible"
    width="620px"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    class="park-alarm-dialog"
    center
    destroy-on-close
  >
    <template #title>
      <span v-if="parkFaultDialogType === 'detail'">故障事件详情</span
      ><span v-if="parkFaultDialogType === 'dispatch'">故障派单提交</span
      ><span v-if="parkFaultDialogType === 'track'">故障维修跟踪</span>
    </template>
    <div v-if="parkFaultDialogType === 'detail'">
      <ElDescriptions bordered :column="1" class="desc-detail">
        <ElDescriptionsItem label="故障ID">
          {{ parkFaultSelectedRow.parkFaultFaultId || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="故障类型">
          {{ parkFaultSelectedRow.sysFaultTypeName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="设备类型">
          {{ parkFaultSelectedRow.sysEquipmentTypeName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="设备编号">
          {{ parkFaultSelectedRow.tbDeviceExtendDeviceCode || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="故障等级">
          <ElTag
            :type="
              getFaultLevelTagType(parkFaultSelectedRow.parkFaultFaultLevel)
            "
          >
            {{ parkFaultSelectedRow.parkFaultFaultLevel || '-' }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="故障位置">
          {{ parkFaultSelectedRow.tbDeviceExtendInstallPosition || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="故障时间">
          {{ formatTimeStamp(parkFaultSelectedRow.parkFaultFaultTime) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="维修进度">
          <ElTag
            :type="
              getMaintenanceProgressTagType(
                parkFaultSelectedRow.sysMaintenanceProgressName,
              )
            "
          >
            {{ parkFaultSelectedRow.sysMaintenanceProgressName || '-' }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="维修人员">
          {{ parkFaultSelectedRow.sysMaintainUserUserName || '暂无' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="预计修复时间">
          {{
            formatTimeStamp(
              parkFaultSelectedRow.parkMaintainWorkorderExpectedFinishTime,
            )
          }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="关联工单号">
          {{ parkFaultSelectedRow.parkMaintainWorkorderWorkorderNo || '暂无' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="故障时长">
          {{ parkFaultSelectedRow.parkFaultDuration || 0 }}
          小时
        </ElDescriptionsItem>
        <ElDescriptionsItem label="故障凭证">
          <div class="evidence-list">
            <ElImage
              v-for="(url, idx) in parkFaultSelectedRow.parkFaultEvidence"
              :key="idx"
              :src="url"
              fit="cover"
              :preview-list="parkFaultSelectedRow.parkFaultEvidence"
            />
          </div>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="维修日志">
          <div
            class="log-list"
            v-if="parkFaultSelectedRow.parkFaultRepairLog.length > 0"
          >
            <div
              class="log-item"
              v-for="(log, idx) in parkFaultSelectedRow.parkFaultRepairLog"
              :key="idx"
            >
              <span class="log-time">{{ formatTimeStamp(log.time) }}</span
              ><span class="log-content">{{ log.content || '-' }}</span>
            </div>
          </div>
          <div class="empty-log" v-else>暂无维修日志</div>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="配件使用清单">
          <div
            class="log-list"
            v-if="parkFaultSelectedRow.parkFaultPartsList.length > 0"
          >
            <div
              class="log-item"
              v-for="(item, idx) in parkFaultSelectedRow.parkFaultPartsList"
              :key="idx"
            >
              <span class="log-content"
                >{{ item.name }} × {{ item.count }} {{ item.unit }}</span
              >
            </div>
          </div>
          <div class="empty-log" v-else>暂无配件使用记录</div>
        </ElDescriptionsItem>
      </ElDescriptions>
    </div>
    <div v-if="parkFaultDialogType === 'dispatch'">
      <ElForm
        :model="dispatchForm"
        :rules="dispatchRules"
        label-width="100px"
        class="dispose-form"
        ref="dispatchFormRef"
      >
        <ElFormItem
          label="维修人员"
          prop="maintainUser"
          class="form-item-required"
        >
          <el-input
            v-model="dispatchForm.maintainUser"
            placeholder="请输入维修人员姓名/工号"
            clearable
            autofocus
            style="width: 100%"
          />
        </ElFormItem>
        <ElFormItem label="维修要求" prop="maintainRequire">
          <el-input
            v-model="dispatchForm.maintainRequire"
            :rows="4"
            type="textarea"
            placeholder="请输入维修要求（选填）"
            maxlength="300"
            show-word-limit
            clearable
            style="width: 100%"
          />
        </ElFormItem>
        <div style="text-align: right">
          <ElButton type="primary" @click="submitDispatchForm">
            确认派单 </ElButton
          ><ElButton plain @click="closeParkFaultDialog">取消</ElButton>
        </div>
      </ElForm>
    </div>
    <div v-if="parkFaultDialogType === 'track'">
      <ElDescriptions bordered :column="1" class="desc-detail">
        <ElDescriptionsItem label="故障ID">
          {{ parkFaultSelectedRow.parkFaultFaultId || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="维修进度">
          <ElTag
            :type="
              getMaintenanceProgressTagType(
                parkFaultSelectedRow.sysMaintenanceProgressName,
              )
            "
          >
            {{ parkFaultSelectedRow.sysMaintenanceProgressName || '-' }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="关联工单号">
          {{ parkFaultSelectedRow.parkMaintainWorkorderWorkorderNo || '暂无' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="维修人员">
          {{ parkFaultSelectedRow.sysMaintainUserUserName || '暂无' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="预计修复时间">
          {{
            formatTimeStamp(
              parkFaultSelectedRow.parkMaintainWorkorderExpectedFinishTime,
            )
          }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="维修日志">
          <div
            class="log-list"
            v-if="parkFaultSelectedRow.parkFaultRepairLog.length > 0"
          >
            <div
              class="log-item"
              v-for="(log, idx) in parkFaultSelectedRow.parkFaultRepairLog"
              :key="idx"
            >
              <span class="log-time">{{ formatTimeStamp(log.time) }}</span
              ><span class="log-content">{{ log.content || '-' }}</span>
            </div>
          </div>
          <div class="empty-log" v-else>暂无维修日志</div>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="配件使用清单">
          <div
            class="log-list"
            v-if="parkFaultSelectedRow.parkFaultPartsList.length > 0"
          >
            <div
              class="log-item"
              v-for="(item, idx) in parkFaultSelectedRow.parkFaultPartsList"
              :key="idx"
            >
              <span class="log-content"
                >{{ item.name }} × {{ item.count }} {{ item.unit }}</span
              >
            </div>
          </div>
          <div class="empty-log" v-else>暂无配件使用记录</div>
        </ElDescriptionsItem>
      </ElDescriptions>
    </div>
  </ElDialog>

  <ElDialog
    v-model="parkComplianceWarningDialogVisible"
    width="620px"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    class="park-alarm-dialog"
    center
    destroy-on-close
  >
    <template #title>
      <span v-if="parkComplianceWarningDialogType === 'detail'"
        >合规预警详情</span
      ><span v-if="parkComplianceWarningDialogType === 'rectify'"
        >合规预警整改提交</span
      ><span v-if="parkComplianceWarningDialogType === 'inspect'"
        >合规预警核查提交</span
      >
    </template>
    <div v-if="parkComplianceWarningDialogType === 'detail'">
      <ElDescriptions bordered :column="1" class="desc-detail">
        <ElDescriptionsItem label="合规预警ID">
          {{
            parkComplianceWarningSelectedRow.parkComplianceWarningWarningId ||
            '-'
          }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="违规类型">
          {{ parkComplianceWarningSelectedRow.sysViolationTypeName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="违规详情">
          <div class="feedback-content">
            {{
              parkComplianceWarningSelectedRow.parkComplianceWarningViolationDetail ||
              '-'
            }}
          </div>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="发生时间">
          {{
            formatTimeStamp(
              parkComplianceWarningSelectedRow.parkComplianceWarningWarningTime,
            )
          }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="发生位置">
          {{ parkComplianceWarningSelectedRow.tbAssetExtendAddress || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="整改状态">
          <ElTag
            :type="
              getComplianceRectifyStatusTagType(
                parkComplianceWarningSelectedRow.sysRectificationStatusName,
              )
            "
          >
            {{
              parkComplianceWarningSelectedRow.sysRectificationStatusName || '-'
            }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="责任主体">
          {{
            parkComplianceWarningSelectedRow.sysResponsibleSubjectTypeName ||
            '-'
          }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="合规标准">
          <div class="feedback-content">
            {{
              parkComplianceWarningSelectedRow.parkComplianceWarningComplianceStandard ||
              '-'
            }}
          </div>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="整改期限">
          {{
            formatTimeStamp(
              parkComplianceWarningSelectedRow.parkComplianceWarningRectificationDeadline,
            )
          }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="核查结果">
          <ElTag
            :type="
              getComplianceInspectResultTagType(
                parkComplianceWarningSelectedRow.parkComplianceWarningInspectionResult,
              )
            "
          >
            {{
              parkComplianceWarningSelectedRow.parkComplianceWarningInspectionResult ||
              '-'
            }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="违规证据">
          <div class="evidence-list">
            <ElImage
              v-for="(
                url, idx
              ) in parkComplianceWarningSelectedRow.parkComplianceWarningEvidence"
              :key="idx"
              :src="url"
              fit="cover"
              :preview-list="
                parkComplianceWarningSelectedRow.parkComplianceWarningEvidence
              "
            />
          </div>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="整改日志">
          <div
            class="log-list"
            v-if="
              parkComplianceWarningSelectedRow.parkComplianceWarningRectifyLog
                .length > 0
            "
          >
            <div
              class="log-item"
              v-for="(
                log, idx
              ) in parkComplianceWarningSelectedRow.parkComplianceWarningRectifyLog"
              :key="idx"
            >
              <span class="log-time">{{ formatTimeStamp(log.time) }}</span
              ><span class="log-content">{{ log.content || '-' }}</span>
            </div>
          </div>
          <div class="empty-log" v-else>暂无整改日志</div>
        </ElDescriptionsItem>
      </ElDescriptions>
    </div>
    <div v-if="parkComplianceWarningDialogType === 'rectify'">
      <ElForm
        :model="complianceRectifyForm"
        :rules="complianceRectifyRules"
        label-width="100px"
        class="dispose-form"
        ref="complianceRectifyFormRef"
      >
        <ElFormItem
          label="整改方案"
          prop="rectifyScheme"
          class="form-item-required"
        >
          <el-input
            v-model="complianceRectifyForm.rectifyScheme"
            :rows="6"
            type="textarea"
            placeholder="请输入整改方案"
            maxlength="500"
            show-word-limit
            clearable
            autofocus
            style="width: 100%"
          />
        </ElFormItem>
        <ElFormItem label="整改凭证">
          <ElUpload
            v-model:file-list="complianceRectifyForm.rectifyFileList"
            list-type="picture-card"
            :limit="3"
            :auto-upload="false"
            accept="image/*"
          >
            <div>
              <el-icon><UploadFilled /></el-icon>
            </div>
          </ElUpload>
          <div>最多上传3张图片，支持jpg/png格式</div>
        </ElFormItem>
        <div style="text-align: right">
          <ElButton type="primary" @click="submitComplianceRectifyForm">
            确认提交 </ElButton
          ><ElButton plain @click="closeParkComplianceWarningDialog">
            取消
          </ElButton>
        </div>
      </ElForm>
    </div>
    <div v-if="parkComplianceWarningDialogType === 'inspect'">
      <ElForm
        :model="complianceInspectForm"
        :rules="complianceInspectRules"
        label-width="100px"
        class="dispose-form"
        ref="complianceInspectFormRef"
      >
        <ElFormItem
          label="核查结果"
          prop="inspectionResult"
          class="form-item-required"
        >
          <el-radio-group
            v-model="complianceInspectForm.inspectionResult"
            style="width: 100%"
          >
            <el-radio label="通过">通过</el-radio
            ><el-radio label="未通过">未通过</el-radio>
          </el-radio-group>
        </ElFormItem>
        <ElFormItem label="核查意见">
          <el-input
            v-model="complianceInspectForm.inspectionOpinion"
            :rows="4"
            type="textarea"
            placeholder="请输入核查意见（选填）"
            maxlength="300"
            show-word-limit
            clearable
            style="width: 100%"
          />
        </ElFormItem>
        <div style="text-align: right">
          <ElButton type="primary" @click="submitComplianceInspectForm">
            确认提交 </ElButton
          ><ElButton plain @click="closeParkComplianceWarningDialog">
            取消
          </ElButton>
        </div>
      </ElForm>
    </div>
  </ElDialog>

  <ElDialog
    v-model="confirmRelieveDialogVisible"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
    destroy-on-close
    top="5vh"
  >
    <template #title><span>异常解除确认</span></template>
    <div
      class="feedback-content"
      style="padding: 20px; margin: 20px 0; text-align: center"
    >
      <p style="margin-bottom: 20px; font-size: 16px">
        确认解除【{{
          parkAbnormalSelectedRow.parkAbnormalAbnormalId
        }}】该异常事件吗？
      </p>
      <p style="color: #eb5757">
        解除后将更新异常状态为「已解除」，并记录解除时间
      </p>
    </div>
    <div style="text-align: right">
      <ElButton type="success" size="default" @click="handleConfirmRelieve">
        确认解除
      </ElButton>
      <ElButton
        plain
        style="margin-left: 20px"
        @click="confirmRelieveDialogVisible = false"
      >
        取消
      </ElButton>
    </div>
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

.top {
  display: flex;
  gap: 0.6vw;
  height: 48%;
  overflow: hidden;
}

.top-left {
  flex: 1;
}

.top-middle {
  flex: 1;
}

.top-right {
  flex: 1;
}

.bottom {
  display: flex;
  gap: 0.6vw;
  height: 48%;
  overflow: hidden;
}

.bottom-left {
  flex: 1;
}

.bottom-middle {
  flex: 1;
}

.bottom-right {
  flex: 1;
}

.panel {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 0.5vw;
  overflow: hidden;
  background: url('../../images/line(1).png') rgb(255 255 255 / 4%);
  border: 0.2vh solid rgb(25 186 139 / 17%);
}

.header-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 0.2vw;
  margin-bottom: 0.5vw;

  .actions-left p {
    margin: 0;
    font-size: 0.9vw;
    font-weight: 500;
    color: #00ffd0;
  }

  .actions-right {
    display: flex;
    gap: 0.8vw;
    align-items: center;
  }

  .panel-fullscreen-btn {
    padding: 0;
    margin-right: 0.5vw;
    color: #0cf;
    cursor: pointer;
    background: transparent;
    border: none;
  }
}

.view-content {
  box-sizing: border-box;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;

  > div {
    width: 100%;
    height: 100%;
  }
}

:deep(.view-btn) {
  padding: 0 0.4vw;
  font-size: 0.6vw;
  color: #fff;
  background-color: transparent;
  border-color: rgb(25 186 139 / 60%);

  &:hover {
    color: #00ffd0;
    border-color: #00ffd0;
  }

  &.el-button--primary {
    color: #afc2ff;
    background-color: rgb(0 204 255 / 20%);
    border-color: rgb(25 186 139 / 60%);
  }
}

:deep(.el-table) {
  width: 100% !important;
  height: 100% !important;
  table-layout: fixed !important;

  table {
    width: 100% !important;
    table-layout: fixed !important;
  }

  .el-table__body-wrapper {
    width: 100% !important;
    overflow-x: auto !important;
  }
}

:deep(.el-tag) {
  font-size: 0.7vw;

  &.el-tag--success {
    color: #2eb861;
    background: rgb(46 184 97 / 20%);
    border-color: rgb(46 184 97 / 50%);
  }

  &.el-tag--warning {
    color: #fad514;
    background: rgb(250 173 20 / 20%);
    border-color: rgb(250 173 20 / 50%);
  }

  &.el-tag--danger {
    color: #eb5757;
    background: rgb(235 87 87 / 20%);
    border-color: rgb(235 87 87 / 50%);
  }

  &.el-tag--info {
    color: #4299e1;
    background: rgb(66 153 225 / 20%);
    border-color: rgb(66 153 225 / 50%);
  }

  &.el-tag--primary {
    color: #9f7aea;
    background: rgb(159 122 234 / 20%);
    border-color: rgb(159 122 234 / 50%);
  }
}

:deep(.el-table__row) {
  cursor: pointer;
}

:deep(.park-alarm-dialog) {
  --el-dialog-bg-color: #fff !important;
  --el-text-color-primary: #000 !important;

  color: var(--el-text-color-primary) !important;
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
    color: #000;
  }

  .el-dialog__headerbtn {
    top: 12px;
    right: 20px;
  }

  .el-dialog__close {
    font-size: 18px;
    color: #000;

    &:hover {
      color: rgb(0 122 255 / 70%);
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
      color: #000;
    }
  }

  .evidence-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5vw;
    margin-top: 0.5vw;
  }

  .evidence-list :deep(.el-image) {
    width: 6vw;
    height: 4.5vh;
    border-radius: 0.2vw;
  }

  .log-list {
    padding: 0.5vw;
    margin-top: 0.5vw;
    border: 1px solid rgb(0 204 255 / 15%);
    border-radius: 0.2vw;
  }

  .log-item {
    display: flex;
    flex-direction: column;
    padding-bottom: 0.5vh;
    margin-bottom: 0.5vh;
    border-bottom: 1px dashed rgb(0 204 255 / 15%);
  }

  .log-time {
    font-size: 0.7vw;
    font-weight: 500;
    color: rgb(0 82 103 / 80%);
  }

  .log-content {
    font-size: 0.7vw;
    color: #000;
  }

  .empty-log {
    padding: 0.5vw;
    font-size: 0.7vw;
    color: rgb(0 0 0 / 60%);
    text-align: center;
  }

  .feedback-content {
    min-height: 8vh;
    padding: 0.5vw;
    font-size: 0.7vw;
    color: #000;
    background: rgb(255 255 255 / 90%);
    border: 1px solid rgb(0 204 255 / 15%);
    border-radius: 0.2vw;
  }

  .dispose-form {
    width: 100%;
    padding: 10px 0;

    .el-form-item {
      margin-bottom: 1vh;
    }

    .el-form-item__label {
      font-size: 0.7vw;
      font-weight: 500;
      color: #000;
    }
  }

  .form-item-required label::after {
    margin-left: 0.2vw;
    color: #eb5757;
    content: '*';
  }
}
</style>
