<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElTable, ElDrawer, ElDivider } from 'element-plus';
import { ArrowLeft, FullScreen, VideoPlay, Document } from '@element-plus/icons-vue';
import screenFull from 'screenfull';

import { fetchBerthFaultList, fetchAlertEventOverviewList, fetchHiddenDangerWarningList, fetchComplianceWarningList, fetchSpecialWarningList, fetchDisposalProgressTrackingList, fetchAbnormalWarningList, fetchAbnormalWarningDurationSummary, fetchDisposalProgressDurationSummary } from '#/api/genchuan/industry/parkingmgmt/overview/EventEarlyWarningTracking.ts';

interface FaultListItem {
  faultId: string;
  faultType: string;
  faultCode: string;
  areaCode: string;
  lotId: string;
  deviceId: string;
  deviceType: string;
  faultLocation: string;
  influenceRange: string;
  affectedUserCount: number;
  maintenanceProgress: string;
  maintainUserId: string;
  sparePartNeed: string;
  maintenanceDeadline: string;
  createTime: string;
}

interface AlertEventOverviewItem {
  alertId: string;
  alertLevel: string;
  alertType: string;
  areaCode: string;
  lotId: string;
  roadsideId: string;
  deviceId: string;
  alertContent: string;
  occurTime: string;
  disposalStatus: string;
  maintainUserId: string;
  userName: string;
  createTime: string;
}

interface HiddenDangerWarningItem {
  hiddenDangerId: string;
  hiddenDangerLevel: string;
  areaCode: string;
  lotId: string;
  roadsideId: string;
  hiddenDangerType: string;
  influenceRange: string;
  rectificationRequirement: string;
  rectificationDeadline: string;
  responsibleUnit: string;
  responsiblePerson: string;
  rectificationMeasure: string;
  rectificationStatus: string;
  createTime: string;
}

interface ComplianceWarningItem {
  complianceWarningId: string;
  violationDetail: string;
  complianceStandard: string;
  rectificationRequirement: string;
  punishmentSuggestion: string;
  rectificationDeadline: string;
  responsibleSubject: string;
  areaCode: string;
  lotId: string;
  warningTime: string;
  rectificationStatus: string;
  createTime: string;
}

interface SpecialWarningItem {
  specialWarningId: string;
  warningScene: string;
  alertType: string;
  areaCode: string;
  lotId: string;
  roadsideId: string;
  deviceId: string;
  alertContent: string;
  occurTime: string;
  disposalStatus: string;
  disposalMeasure: string;
  videoUrl: string;
  createTime: string;
}

interface DisposalProgressTrackingItem {
  alertId: string;
  alertContent: string;
  occurTime: string;
  dispatchTime: string;
  receiveTime: string;
  disposalTime: string;
  feedbackTime: string;
  acceptanceTime: string;
  closeTime: string;
  maintainUserId: string;
  disposalMeasure: string;
  disposalResult: string;
  attachmentUrl: string;
  updateTime: string;
}

interface AbnormalWarningItem {
  abnormalId: string;
  abnormalType: string;
  abnormalReason: string;
  influenceRange: string;
  relieveTime: string;
  relieveReason: string;
  areaCode: string;
  lotId: string;
  createTime: string;
}

interface AbnormalDurationSummary {
  avgAbnormalDuration: string;
  maxAbnormalDuration: string;
  minAbnormalDuration: string;
  totalAbnormalDuration: string;
}

interface DisposalProgressDurationSummary {
  occurToDispatchDuration: string;
  dispatchToReceiveDuration: string;
  receiveToDisposalDuration: string;
  disposalToFeedbackDuration: string;
  feedbackToAcceptanceDuration: string;
  acceptanceToCloseDuration: string;
  alertDisposalTotalDuration: string;
}

type DetailDataType = FaultListItem | AlertEventOverviewItem | HiddenDangerWarningItem | ComplianceWarningItem | SpecialWarningItem | DisposalProgressTrackingItem | AbnormalWarningItem | null;

const router = useRouter();
const pageContainerRef = ref<HTMLDivElement | null>(null);

const faultTableRef = ref<InstanceType<typeof ElTable> | null>(null);
const faultwarning = ref<HTMLDivElement | null>(null);
const faultList = ref<FaultListItem[]>([]);
const faultTableMaxHeight = ref<string>('');

const alertTableRef = ref<InstanceType<typeof ElTable> | null>(null);
const alertEventOverview = ref<HTMLDivElement | null>(null);
const alertEventList = ref<AlertEventOverviewItem[]>([]);
const alertTableMaxHeight = ref<string>('');

const hiddenDangerTableRef = ref<InstanceType<typeof ElTable> | null>(null);
const hiddenDangerWarning = ref<HTMLDivElement | null>(null);
const hiddenDangerList = ref<HiddenDangerWarningItem[]>([]);
const hiddenDangerTableMaxHeight = ref<string>('');

const complianceTableRef = ref<InstanceType<typeof ElTable> | null>(null);
const complianceWarning = ref<HTMLDivElement | null>(null);
const complianceList = ref<ComplianceWarningItem[]>([]);
const complianceTableMaxHeight = ref<string>('');

const specialTableRef = ref<InstanceType<typeof ElTable> | null>(null);
const specialWarning = ref<HTMLDivElement | null>(null);
const specialList = ref<SpecialWarningItem[]>([]);
const specialTableMaxHeight = ref<string>('');

const disposalTableRef = ref<InstanceType<typeof ElTable> | null>(null);
const disposalProgressTracking = ref<HTMLDivElement | null>(null);
const disposalProgressList = ref<DisposalProgressTrackingItem[]>([]);
const disposalTableMaxHeight = ref<string>('');

const abnormalTableRef = ref<InstanceType<typeof ElTable> | null>(null);
const abnormalWarning = ref<HTMLDivElement | null>(null);
const abnormalList = ref<AbnormalWarningItem[]>([]);
const abnormalTableMaxHeight = ref<string>('');

const abnormalDurationSummary = ref<AbnormalDurationSummary>({
  avgAbnormalDuration: '--',
  maxAbnormalDuration: '--',
  minAbnormalDuration: '--',
  totalAbnormalDuration: '--'
});
const disposalProgressDurationSummary = ref<DisposalProgressDurationSummary>({
  occurToDispatchDuration: '--',
  dispatchToReceiveDuration: '--',
  receiveToDisposalDuration: '--',
  disposalToFeedbackDuration: '--',
  feedbackToAcceptanceDuration: '--',
  acceptanceToCloseDuration: '--',
  alertDisposalTotalDuration: '--'
});

const drawerVisible = ref<boolean>(false);
const currentDetailData = ref<DetailDataType>(null);
const drawerTitle = ref<string>('详情信息');

let timeTimer: NodeJS.Timeout | null = null;
let faultRefreshTimer: NodeJS.Timeout | null = null;
let alertRefreshTimer: NodeJS.Timeout | null = null;
let hiddenDangerRefreshTimer: NodeJS.Timeout | null = null;
let complianceRefreshTimer: NodeJS.Timeout | null = null;
let specialRefreshTimer: NodeJS.Timeout | null = null;
let disposalRefreshTimer: NodeJS.Timeout | null = null;
let abnormalRefreshTimer: NodeJS.Timeout | null = null;
let abnormalSummaryTimer: NodeJS.Timeout | null = null;
let disposalSummaryTimer: NodeJS.Timeout | null = null;
const currentFullscreenPanel = ref<HTMLElement | null>(null);

const openDetailDrawer = (row: DetailDataType) => {
  currentDetailData.value = row;
  if (row && 'faultId' in row) drawerTitle.value = '故障预警详情';
  else if (row && 'alertId' in row && !('disposalMeasure' in row)) drawerTitle.value = '预警事件详情';
  else if (row && 'alertId' in row && 'disposalMeasure' in row) drawerTitle.value = '处置进度详情';
  else if (row && 'hiddenDangerId' in row) drawerTitle.value = '隐患预警详情';
  else if (row && 'complianceWarningId' in row) drawerTitle.value = '合规预警详情';
  else if (row && 'specialWarningId' in row) drawerTitle.value = '专项预警详情';
  else if (row && 'abnormalId' in row) drawerTitle.value = '异常预警详情';
  drawerVisible.value = true;
};

const handleBack = () => router.push('/');

const clickFullscreen = () => {
  if (!screenFull.isEnabled) return ElMessage.warning('您的浏览器不支持全屏功能');
  const targetEl = pageContainerRef.value;
  if(targetEl) {
    if(currentFullscreenPanel.value) screenFull.exit();
    screenFull.isFullscreen ? screenFull.exit() : screenFull.request(targetEl);
  }
};

// ========== 【核心修复1】全屏退出回调 - 双层NEXT-TICK确保DOM渲染完成再计算高度，根治高度计算错误 ==========
const handleFullscreenChange = () => {
  if (!screenFull.isFullscreen && currentFullscreenPanel.value) {
    currentFullscreenPanel.value.style.width = '';
    currentFullscreenPanel.value.style.maxWidth = '';
    currentFullscreenPanel.value.style.height = '';
    currentFullscreenPanel.value.style.maxHeight = '';
    currentFullscreenPanel.value.style.overflow = 'hidden';
    currentFullscreenPanel.value.style.margin = '';
    currentFullscreenPanel.value.style.padding = '';
    // 双层nextTick：等待浏览器完成DOM重绘+样式重置，再计算表格高度，拿到的是精准的面板高度
    nextTick(() => {
      nextTick(() => {
        initTableHeight();
      })
    })
    screenFull.off('change', handleFullscreenChange);
    currentFullscreenPanel.value = null;
  }
};

const updateShowTime = () => {
  const dt = new Date();
  const y = dt.getFullYear();
  const mt = dt.getMonth() + 1;
  const day = dt.getDate();
  const h = dt.getHours().toString().padStart(2, '0');
  const m = dt.getMinutes().toString().padStart(2, '0');
  const s = dt.getSeconds().toString().padStart(2, '0');
  const showTimeEl = document.querySelector('.showTime');
  showTimeEl && (showTimeEl.innerHTML = `当前时间：${y}年${mt}月${day}日 ${h}时${m}分${s}秒`);
};

const fetchFaultListData = async () => {
  try {
    faultList.value = await fetchBerthFaultList({});
    nextTick(() => faultTableRef.value?.doLayout());
  } catch (error) {
    console.error('获取故障预警列表失败:', error);
    ElMessage.error('故障列表数据加载失败，请重试');
  }
};

const fetchAlertEventListData = async () => {
  try {
    alertEventList.value = await fetchAlertEventOverviewList({});
    nextTick(() => alertTableRef.value?.doLayout());
  } catch (error) {
    console.error('获取预警事件概览列表失败:', error);
    ElMessage.error('预警事件列表数据加载失败，请重试');
  }
};

const fetchHiddenDangerListData = async () => {
  try {
    hiddenDangerList.value = await fetchHiddenDangerWarningList({});
    nextTick(() => hiddenDangerTableRef.value?.doLayout());
  } catch (error) {
    console.error('获取隐患预警列表失败:', error);
    ElMessage.error('隐患列表数据加载失败，请重试');
  }
};

const fetchComplianceListData = async () => {
  try {
    complianceList.value = await fetchComplianceWarningList({});
    nextTick(() => complianceTableRef.value?.doLayout());
  } catch (error) {
    console.error('获取合规预警列表失败:', error);
    ElMessage.error('合规列表数据加载失败，请重试');
  }
};

const fetchSpecialListData = async () => {
  try {
    specialList.value = await fetchSpecialWarningList({});
    nextTick(() => specialTableRef.value?.doLayout());
  } catch (error) {
    console.error('获取专项预警列表失败:', error);
    ElMessage.error('专项列表数据加载失败，请重试');
  }
};

const fetchDisposalProgressListData = async () => {
  try {
    disposalProgressList.value = await fetchDisposalProgressTrackingList({});
    nextTick(() => disposalTableRef.value?.doLayout());
  } catch (error) {
    console.error('获取处置进度追踪列表失败:', error);
    ElMessage.error('处置进度列表数据加载失败，请重试');
  }
};

const fetchAbnormalWarningListData = async () => {
  try {
    abnormalList.value = await fetchAbnormalWarningList({});
    nextTick(() => abnormalTableRef.value?.doLayout());
  } catch (error) {
    console.error('获取异常预警列表失败:', error);
    ElMessage.error('异常预警列表数据加载失败，请重试');
  }
};

const fetchAbnormalDurationSummaryData = async () => {
  try {
    abnormalDurationSummary.value = await fetchAbnormalWarningDurationSummary({});
  } catch (error) {
    console.error('获取异常时长统计数据失败:', error);
  }
};

const fetchDisposalProgressDurationSummaryData = async () => {
  try {
    disposalProgressDurationSummary.value = await fetchDisposalProgressDurationSummary({});
  } catch (error) {
    console.error('获取处置进度耗时统计数据失败:', error);
  }
};

const openVideoUrl = (url: string) => {
  url ? window.open(url, '_blank') : ElMessage.warning('暂无关联视频');
};

const openAttachmentUrl = (url: string) => {
  url ? window.open(url, '_blank') : ElMessage.warning('暂无处置凭证附件');
};

const getProgressTagType = (progress: string) => {
  switch (progress) {
    case '未维修': return 'danger';
    case '维修中': return 'warning';
    case '已修复': return 'success';
    default: return 'info';
  }
};

const getDisposalStatusTagType = (status: string) => {
  switch (status) {
    case '未处置': return 'danger';
    case '处置中': return 'warning';
    case '已办结': return 'success';
    case '超时': return 'info';
    default: return 'info';
  }
};

const getHiddenDangerLevelTagType = (level: string) => {
  switch (level) {
    case '一般': return 'info';
    case '较大': return 'warning';
    case '重大': return 'danger';
    default: return 'info';
  }
};

const getRectificationStatusTagType = (status: string) => {
  switch (status) {
    case '未整改': return 'danger';
    case '整改中': return 'warning';
    case '已完成': return 'success';
    case '验收通过': return 'info';
    default: return 'info';
  }
};

const getComplianceRectificationStatusTagType = (status: string) => {
  switch (status) {
    case '未整改': return 'danger';
    case '整改中': return 'warning';
    case '已完成': return 'success';
    default: return 'info';
  }
};

const getWarningSceneTagType = (scene: string) => {
  switch (scene) {
    case '泊位类': return 'info';
    case '设备类': return 'warning';
    case '收费类': return 'success';
    case '安全类': return 'danger';
    default: return 'info';
  }
};

const getDisposalResultTagType = (status: string) => {
  switch (status) {
    case '处置成功': return 'success';
    case '处置失败': return 'danger';
    case '处置中': return 'warning';
    default: return 'warning';
  }
};

const getDisposalProgressRowClass = (row: DisposalProgressTrackingItem) => {
  if (!row.dispatchTime) return 'progress-row-unassigned';
  if (row.dispatchTime && !row.receiveTime) return 'progress-row-dispatched';
  if (row.receiveTime && !row.disposalTime) return 'progress-row-received';
  if (row.disposalTime && !row.feedbackTime) return 'progress-row-disposing';
  if (row.feedbackTime && !row.acceptanceTime) return 'progress-row-feedback';
  if (row.acceptanceTime && !row.closeTime) return 'progress-row-acceptance';
  if (row.closeTime) return 'progress-row-closed';
  return '';
};

const getAbnormalTypeTagType = (type: string) => {
  switch (type) {
    case '数据异常': return 'data';
    case '收费异常': return 'charge';
    case '诱导信息异常': return 'guide';
    case '流程异常': return 'process';
    default: return 'data';
  }
};

const getAbnormalProgressRowClass = (row: AbnormalWarningItem) => {
  if (!row.relieveTime) return 'abnormal-row-unrelieved';
  if (row.relieveTime && row.relieveReason) return 'abnormal-row-relieved';
  return '';
};

// ========== 【核心修复2 重中之重】重写表格高度计算逻辑 - 处置/异常面板 专属精准高度计算，彻底解决表格高度变大遮挡 ==========
const initTableHeight = () => {
  nextTick(() => {
    // 第一步：强制清空所有表格高度缓存，防止残留
    faultTableMaxHeight.value = '';
    alertTableMaxHeight.value = '';
    hiddenDangerTableMaxHeight.value = '';
    complianceTableMaxHeight.value = '';
    specialTableMaxHeight.value = '';
    disposalTableMaxHeight.value = '';
    abnormalTableMaxHeight.value = '';

    const faultContainer = document.querySelector('.bottom-left2 .table-container');
    const alertContainer = document.querySelector('.top-middle .table-container');
    const hiddenDangerContainer = document.querySelector('.bottom-left1 .table-container');
    const complianceContainer = document.querySelector('.bottom-right1 .table-container');
    const specialContainer = document.querySelector('.bottom-right2 .table-container');

    faultContainer && (faultTableMaxHeight.value = `${faultContainer.clientHeight}px`);
    alertContainer && (alertTableMaxHeight.value = `${alertContainer.clientHeight}px`);
    hiddenDangerContainer && (hiddenDangerTableMaxHeight.value = `${hiddenDangerContainer.clientHeight}px`);
    complianceContainer && (complianceTableMaxHeight.value = `${complianceContainer.clientHeight}px`);
    specialContainer && (specialTableMaxHeight.value = `${specialContainer.clientHeight}px`);

    const disposalPanel = document.querySelector('.top-left.disposal-progress-tracking');
    const disposalHeader = document.querySelector('.top-left .header-actions');
    const disposalCard = document.querySelector('.top-left .progress-card-container');
    if (disposalPanel && disposalHeader && disposalCard) {
      const panelH = disposalPanel.clientHeight;
      const headerH = disposalHeader.clientHeight;
      const cardH = disposalCard.clientHeight;
      disposalTableMaxHeight.value = `${panelH - headerH - cardH - 46}px`;
    }

    const abnormalPanel = document.querySelector('.top-right.abnormal-warning-monitor');
    const abnormalHeader = document.querySelector('.top-right .header-actions');
    const abnormalCard = document.querySelector('.top-right .abnormal-duration-card');
    if (abnormalPanel && abnormalHeader && abnormalCard) {
      const panelH = abnormalPanel.clientHeight;
      const headerH = abnormalHeader.clientHeight;
      const cardH = abnormalCard.clientHeight;
      abnormalTableMaxHeight.value = `${panelH - headerH - cardH - 46}px`;
    }

    setTimeout(() => {
      faultTableRef.value?.doLayout()
      alertTableRef.value?.doLayout()
      hiddenDangerTableRef.value?.doLayout()
      complianceTableRef.value?.doLayout()
      specialTableRef.value?.doLayout()
      disposalTableRef.value?.doLayout()
      abnormalTableRef.value?.doLayout()
    }, 50);
  });
};

const togglePanelFullscreen = (panelRef: 'faultwarning' | 'alertEventOverview' | 'hiddenDangerWarning' | 'complianceWarning' | 'specialWarning' | 'disposalProgressTracking' | 'abnormalWarning') => {
  if (!screenFull.isEnabled) return ElMessage.warning('您的浏览器不支持全屏功能');
  const panel = {
    faultwarning: faultwarning.value,
    alertEventOverview: alertEventOverview.value,
    hiddenDangerWarning: hiddenDangerWarning.value,
    complianceWarning: complianceWarning.value,
    specialWarning: specialWarning.value,
    disposalProgressTracking: disposalProgressTracking.value,
    abnormalWarning: abnormalWarning.value
  }[panelRef];
  if (!panel) return ElMessage.error('未找到面板元素');

  screenFull.off('change', handleFullscreenChange);
  if (currentFullscreenPanel.value && currentFullscreenPanel.value !== panel) {
    screenFull.exit();
    currentFullscreenPanel.value.style = '';
  }
  currentFullscreenPanel.value = panel;

  if (screenFull.isFullscreen && document.fullscreenElement === panel) {
    screenFull.exit().catch((error) => ElMessage.error(`退出全屏失败：${error.message}`));
  } else {
    screenFull.on('change', handleFullscreenChange);
    screenFull.request(panel).catch((error) => ElMessage.error(`全屏失败：${error.message}`));
  }
};

onMounted(() => {
  updateShowTime();
  timeTimer = setInterval(updateShowTime, 1000);

  fetchFaultListData();
  fetchAlertEventListData();
  fetchHiddenDangerListData();
  fetchComplianceListData();
  fetchSpecialListData();
  fetchDisposalProgressListData();
  fetchAbnormalWarningListData();
  fetchAbnormalDurationSummaryData();
  fetchDisposalProgressDurationSummaryData();

  faultRefreshTimer = setInterval(fetchFaultListData, 30000);
  alertRefreshTimer = setInterval(fetchAlertEventListData, 30000);
  hiddenDangerRefreshTimer = setInterval(fetchHiddenDangerListData, 30000);
  complianceRefreshTimer = setInterval(fetchComplianceListData, 30000);
  specialRefreshTimer = setInterval(fetchSpecialListData, 30000);
  disposalRefreshTimer = setInterval(fetchDisposalProgressListData, 30000);
  abnormalRefreshTimer = setInterval(fetchAbnormalWarningListData, 30000);
  abnormalSummaryTimer = setInterval(fetchAbnormalDurationSummaryData, 30000);
  disposalSummaryTimer = setInterval(fetchDisposalProgressDurationSummaryData, 30000);

  initTableHeight();
  window.addEventListener('resize', initTableHeight);
});

onUnmounted(() => {
  timeTimer && clearInterval(timeTimer);
  faultRefreshTimer && clearInterval(faultRefreshTimer);
  alertRefreshTimer && clearInterval(alertRefreshTimer);
  hiddenDangerRefreshTimer && clearInterval(hiddenDangerRefreshTimer);
  complianceRefreshTimer && clearInterval(complianceRefreshTimer);
  specialRefreshTimer && clearInterval(specialRefreshTimer);
  disposalRefreshTimer && clearInterval(disposalRefreshTimer);
  abnormalRefreshTimer && clearInterval(abnormalRefreshTimer);
  abnormalSummaryTimer && clearInterval(abnormalSummaryTimer);
  disposalSummaryTimer && clearInterval(disposalSummaryTimer);

  window.removeEventListener('resize', initTableHeight);
  if(screenFull.isEnabled && screenFull.isFullscreen) screenFull.exit();
  currentFullscreenPanel.value && screenFull.off('change', handleFullscreenChange);
});
</script>

<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="header-box">
      <button class="back-button" @click="handleBack">
        <el-icon color="#00ccff" :size="`${1.2}vw`"><ArrowLeft /></el-icon>
      </button>
      <span class="head-name">停车管理-事件预警追踪</span>
      <div class="showTime h1-time"></div>
      <button class="fullScreenBut" @click="clickFullscreen">
        <el-icon color="#00ccff" :size="`${1.2}vw`"><FullScreen /></el-icon>
      </button>
    </div>
    <div class="mainbox">
      <div class="top">
        <div class="panel top-left disposal-progress-tracking" ref="disposalProgressTracking">
          <div class="header-actions">
            <div class="actions-left"><p>处置进度追踪</p></div>
            <div class="actions-right">
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('disposalProgressTracking')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div class="progress-card-container">
            <div class="disposal-duration-item">
              <span class="item-label">发生到派单耗时</span>
              <span class="item-value">{{ disposalProgressDurationSummary.occurToDispatchDuration }}</span>
            </div>
            <div class="disposal-duration-item">
              <span class="item-label">派单到接单耗时</span>
              <span class="item-value">{{ disposalProgressDurationSummary.dispatchToReceiveDuration }}</span>
            </div>
            <div class="disposal-duration-item">
              <span class="item-label">接单到处置耗时</span>
              <span class="item-value">{{ disposalProgressDurationSummary.receiveToDisposalDuration }}</span>
            </div>
            <div class="disposal-duration-item">
              <span class="item-label">处置到反馈耗时</span>
              <span class="item-value">{{ disposalProgressDurationSummary.disposalToFeedbackDuration }}</span>
            </div>
            <div class="disposal-duration-item">
              <span class="item-label">反馈到验收耗时</span>
              <span class="item-value">{{ disposalProgressDurationSummary.feedbackToAcceptanceDuration }}</span>
            </div>
            <div class="disposal-duration-item">
              <span class="item-label">验收到办结耗时</span>
              <span class="item-value">{{ disposalProgressDurationSummary.acceptanceToCloseDuration }}</span>
            </div>
            <div class="disposal-duration-item alertDisposalTotalDuration">
              <span class="item-label">预警处置总耗时</span>
              <span class="item-value">{{ disposalProgressDurationSummary.alertDisposalTotalDuration }}</span>
            </div>
          </div>
          <div class="disposal-progress-table">
            <el-table ref="disposalTableRef" :data="disposalProgressList" border size="small" :height="disposalTableMaxHeight" style="width: 100%; table-layout: fixed;" :empty-text="disposalProgressList.length === 0 ? '暂无漳州地区处置进度数据' : ''" :row-class-name="({row})=>getDisposalProgressRowClass(row)">
              <el-table-column prop="alertId" label="预警ID" min-width="120">
                <template #default="scope"><span class="link-text" @click="openDetailDrawer(scope.row)">{{ scope.row.alertId }}</span></template>
              </el-table-column>
              <el-table-column prop="occurTime" label="发生时间" min-width="125">
                <template #default="scope"><span class="progress-time-text">{{ scope.row.occurTime }}</span></template>
              </el-table-column>
              <el-table-column prop="alertContent" label="预警内容" min-width="200">
                <template #default="scope"><span class="alert-text">{{ scope.row.alertContent || '--' }}</span></template>
              </el-table-column>
              <el-table-column prop="disposalResult" label="处置结果" min-width="110">
                <template #default="scope"><span class="disposal-result-tag" :class="getDisposalResultTagType(scope.row.disposalResult)">{{ scope.row.disposalResult }}</span></template>
              </el-table-column>
              <el-table-column prop="disposalMeasure" label="处置措施" min-width="220">
                <template #default="scope"><span class="alert-text">{{ scope.row.disposalMeasure || '--' }}</span></template>
              </el-table-column>
              <el-table-column prop="maintainUserId" label="责任人ID" min-width="100">
                <template #default="scope"><span class="maintain-user-id">{{ scope.row.maintainUserId }}</span></template>
              </el-table-column>
              <el-table-column prop="attachmentUrl" label="处置凭证" min-width="120">
                <template #default="scope">
                  <span class="attachment-url-text" @click="openAttachmentUrl(scope.row.attachmentUrl)" v-if="scope.row.attachmentUrl">
                    <el-icon size="14"><Document /></el-icon> 查看凭证
                  </span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel top-middle" ref="alertEventOverview">
          <div class="header-actions">
            <div class="actions-left"><p>预警事件概览</p></div>
            <div class="actions-right">
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('alertEventOverview')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div class="table-container alert-event-overview-table" style="flex: 1; width: 100%; min-height: 0; box-sizing: border-box;">
            <el-table ref="alertTableRef" :data="alertEventList" border size="small" :max-height="alertTableMaxHeight" style="width: 100%; table-layout: fixed;" :empty-text="alertEventList.length === 0 ? '暂无漳州地区预警事件数据' : ''" :row-class-name="({ row }) => {
              if (row.disposalStatus === '未处置') return 'alert-row-untreated';
              if (row.disposalStatus === '处置中') return 'alert-row-disposing';
              if (row.disposalStatus === '已办结') return 'alert-row-completed';
              if (row.disposalStatus === '超时') return 'alert-row-timeout';
              return '';
            }">
              <el-table-column prop="alertId" label="预警ID" min-width="120">
                <template #default="scope"><span class="link-text" @click="openDetailDrawer(scope.row)">{{ scope.row.alertId }}</span></template>
              </el-table-column>
              <el-table-column prop="occurTime" label="发生时间" min-width="125" />
              <el-table-column prop="alertLevel" label="预警等级" min-width="100">
                <template #default="scope"><el-tag size="small" :class="`alert-level-tag ${scope.row.alertLevel === '紧急' ? 'red' : scope.row.alertLevel === '严重' ? 'orange' : scope.row.alertLevel === '一般' ? 'yellow' : 'blue'}`">{{ scope.row.alertLevel }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="alertType" label="预警类型" min-width="150">
                <template #default="scope"><el-tag size="small" class="alert-type-tag">{{ scope.row.alertType }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="areaCode" label="区域编码" min-width="100" />
              <el-table-column prop="userName" label="责任人姓名" min-width="100" />
              <el-table-column prop="disposalStatus" label="处置状态" min-width="130">
                <template #default="scope"><el-tag :type="getDisposalStatusTagType(scope.row.disposalStatus)" size="small" :class="`disposal-status-tag ${scope.row.disposalStatus === '未处置' ? 'untreated' : scope.row.disposalStatus === '处置中' ? 'disposing' : scope.row.disposalStatus === '已办结' ? 'completed' : 'timeout'}`">{{ scope.row.disposalStatus }}</el-tag></template>
              </el-table-column>
            </el-table>
          </div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel top-right abnormal-warning-monitor" ref="abnormalWarning">
          <div class="header-actions">
            <div class="actions-left"><p>异常预警视图</p></div>
            <div class="actions-right">
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('abnormalWarning')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div class="abnormal-duration-card">
            <div class="abnormal-duration-item">
              <span class="item-label">平均异常时长</span>
              <span class="item-value">{{ abnormalDurationSummary.avgAbnormalDuration }}</span>
            </div>
            <div class="abnormal-duration-item">
              <span class="item-label">最大异常时长</span>
              <span class="item-value">{{ abnormalDurationSummary.maxAbnormalDuration }}</span>
            </div>
            <div class="abnormal-duration-item">
              <span class="item-label">最小异常时长</span>
              <span class="item-value">{{ abnormalDurationSummary.minAbnormalDuration }}</span>
            </div>
            <div class="abnormal-duration-item totalAbnormalDuration">
              <span class="item-label">累计异常时长</span>
              <span class="item-value">{{ abnormalDurationSummary.totalAbnormalDuration }}</span>
            </div>
          </div>
          <div class="abnormal-warning-table">
            <el-table ref="abnormalTableRef" :data="abnormalList" border size="small" :height="abnormalTableMaxHeight" style="width: 100%; table-layout: fixed;" :empty-text="abnormalList.length === 0 ? '暂无漳州地区异常预警数据' : ''" :row-class-name="({row})=>getAbnormalProgressRowClass(row)">
              <el-table-column prop="abnormalId" label="异常ID" min-width="120">
                <template #default="scope"><span class="link-text" @click="openDetailDrawer(scope.row)">{{ scope.row.abnormalId }}</span></template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" min-width="125">
                <template #default="scope"><span class="time-text">{{ scope.row.createTime }}</span></template>
              </el-table-column>
              <el-table-column prop="abnormalType" label="异常类型" min-width="160">
                <template #default="scope"><span class="abnormal-type-tag" :class="getAbnormalTypeTagType(scope.row.abnormalType)">{{ scope.row.abnormalType }}</span></template>
              </el-table-column>
              <el-table-column prop="influenceRange" label="影响范围" min-width="180">
                <template #default="scope"><span class="influence-range-tag">{{ scope.row.influenceRange }}</span></template>
              </el-table-column>
              <el-table-column prop="relieveTime" label="解除时间" min-width="125">
                <template #default="scope"><span class="time-text">{{ scope.row.relieveTime || '--' }}</span></template>
              </el-table-column>
              <el-table-column prop="areaCode" label="区域编码" min-width="100">
                <template #default="scope"><span class="area-code-text">{{ scope.row.areaCode }}</span></template>
              </el-table-column>
              <el-table-column prop="lotId" label="停车场ID" min-width="100">
                <template #default="scope"><span class="lot-id-text">{{ scope.row.lotId }}</span></template>
              </el-table-column>
            </el-table>
          </div>
          <div class="panel-footer"></div>
        </div>
      </div>
      <div class="bottom">
        <div class="panel bottom-left1" ref="hiddenDangerWarning">
          <div class="header-actions">
            <div class="actions-left"><p>隐患预警视图</p></div>
            <div class="actions-right">
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('hiddenDangerWarning')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div class="table-container hidden-danger-warning-table" style="flex: 1; width: 100%; min-height: 0; box-sizing: border-box;">
            <el-table ref="hiddenDangerTableRef" :data="hiddenDangerList" border size="small" :max-height="hiddenDangerTableMaxHeight" style="width: 100%; table-layout: fixed;" :empty-text="hiddenDangerList.length === 0 ? '暂无漳州地区隐患预警数据' : ''" :row-class-name="({ row }) => {
              if (row.rectificationStatus === '未整改') return 'hidden-danger-row-untreated';
              if (row.rectificationStatus === '整改中') return 'hidden-danger-row-rectifying';
              if (row.rectificationStatus === '已完成') return 'hidden-danger-row-completed';
              if (row.rectificationStatus === '验收通过') return 'hidden-danger-row-accepted';
              return '';
            }">
              <el-table-column prop="hiddenDangerId" label="隐患ID" min-width="120">
                <template #default="scope"><span class="link-text" @click="openDetailDrawer(scope.row)">{{ scope.row.hiddenDangerId }}</span></template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" min-width="125" />
              <el-table-column prop="hiddenDangerLevel" label="风险等级" min-width="100">
                <template #default="scope"><el-tag size="small" :type="getHiddenDangerLevelTagType(scope.row.hiddenDangerLevel)" :class="`hidden-danger-level-tag ${scope.row.hiddenDangerLevel === '一般' ? 'general' : scope.row.hiddenDangerLevel === '较大' ? 'larger' : 'major'}`">{{ scope.row.hiddenDangerLevel }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="hiddenDangerType" label="隐患类型" min-width="150">
                <template #default="scope"><el-tag size="small" class="hidden-danger-type-tag">{{ scope.row.hiddenDangerType }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="areaCode" label="区域编码" min-width="100" />
              <el-table-column prop="responsiblePerson" label="责任人" min-width="100" />
              <el-table-column prop="rectificationStatus" label="整改进度" min-width="130">
                <template #default="scope"><el-tag :type="getRectificationStatusTagType(scope.row.rectificationStatus)" size="small" :class="`rectification-status-tag ${scope.row.rectificationStatus === '未整改' ? 'untreated' : scope.row.rectificationStatus === '整改中' ? 'rectifying' : scope.row.rectificationStatus === '已完成' ? 'completed' : 'accepted'}`">{{ scope.row.rectificationStatus }}</el-tag></template>
              </el-table-column>
            </el-table>
          </div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-left2" ref="faultwarning">
          <div class="header-actions">
            <div class="actions-left"><p>故障预警视图</p></div>
            <div class="actions-right">
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('faultwarning')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div class="table-container fault-warning-table" style="flex: 1; width: 100%; min-height: 0; box-sizing: border-box;">
            <el-table ref="faultTableRef" :data="faultList" border size="small" :max-height="faultTableMaxHeight" style="width: 100%; table-layout: fixed;" :empty-text="faultList.length === 0 ? '暂无漳州地区故障预警数据' : ''" :row-class-name="({ row }) => {
              if (row.maintenanceProgress === '未维修') return 'fault-row-danger';
              if (row.maintenanceProgress === '维修中') return 'fault-row-warning';
              if (row.maintenanceProgress === '已修复') return 'fault-row-success';
              return '';
            }">
              <el-table-column prop="faultId" label="故障ID" min-width="120">
                <template #default="scope"><span class="link-text" @click="openDetailDrawer(scope.row)">{{ scope.row.faultId }}</span></template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" min-width="125" />
              <el-table-column prop="faultType" label="故障类型" min-width="120">
                <template #default="scope"><el-tag size="small" class="fault-type-tag">{{ scope.row.faultType }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="areaCode" label="区域编码" min-width="100" />
              <el-table-column prop="affectedUserCount" label="受影响用户数" min-width="100">
                <template #default="scope"><span class="user-count">{{ scope.row.affectedUserCount }}</span></template>
              </el-table-column>
              <el-table-column prop="maintenanceProgress" label="维修进度" min-width="130">
                <template #default="scope"><el-tag :type="getProgressTagType(scope.row.maintenanceProgress)" size="small" class="progress-tag">{{ scope.row.maintenanceProgress }}</el-tag></template>
              </el-table-column>
            </el-table>
          </div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-right1" ref="complianceWarning">
          <div class="header-actions">
            <div class="actions-left"><p>合规预警视图</p></div>
            <div class="actions-right">
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('complianceWarning')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div class="table-container compliance-warning-table" style="flex: 1; width: 100%; min-height: 0; box-sizing: border-box;">
            <el-table ref="complianceTableRef" :data="complianceList" border size="small" :max-height="complianceTableMaxHeight" style="width: 100%; table-layout: fixed;" :empty-text="complianceList.length === 0 ? '暂无漳州地区合规预警数据' : ''" :row-class-name="({ row }) => {
              if (row.rectificationStatus === '未整改') return 'compliance-row-untreated';
              if (row.rectificationStatus === '整改中') return 'compliance-row-rectifying';
              if (row.rectificationStatus === '已完成') return 'compliance-row-completed';
              return '';
            }">
              <el-table-column prop="complianceWarningId" label="合规预警ID" min-width="130">
                <template #default="scope"><span class="link-text" @click="openDetailDrawer(scope.row)">{{ scope.row.complianceWarningId }}</span></template>
              </el-table-column>
              <el-table-column prop="warningTime" label="预警时间" min-width="125" />
              <el-table-column prop="violationDetail" label="违规详情" min-width="160">
                <template #default="scope"><el-tag size="small" class="violation-detail-tag">{{ scope.row.violationDetail }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="responsibleSubject" label="责任主体" min-width="100">
                <template #default="scope"><span class="responsible-subject">{{ scope.row.responsibleSubject }}</span></template>
              </el-table-column>
              <el-table-column prop="areaCode" label="区域编码" min-width="100" />
              <el-table-column prop="rectificationStatus" label="整改状态" min-width="130">
                <template #default="scope"><el-tag :type="getComplianceRectificationStatusTagType(scope.row.rectificationStatus)" size="small" class="rectification-status-tag">{{ scope.row.rectificationStatus }}</el-tag></template>
              </el-table-column>
            </el-table>
          </div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-right2" ref="specialWarning">
          <div class="header-actions">
            <div class="actions-left"><p>专项预警视图</p></div>
            <div class="actions-right">
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('specialWarning')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div class="table-container special-warning-table" style="flex: 1; width: 100%; min-height: 0; box-sizing: border-box;">
            <el-table ref="specialTableRef" :data="specialList" border size="small" :max-height="specialTableMaxHeight" style="width: 100%; table-layout: fixed;" :empty-text="specialList.length === 0 ? '暂无漳州地区专项预警数据' : ''" :row-class-name="({ row }) => {
              if (row.disposalStatus === '未处置') return 'special-row-untreated';
              if (row.disposalStatus === '处置中') return 'special-row-disposing';
              if (row.disposalStatus === '已办结') return 'special-row-completed';
              if (row.disposalStatus === '超时') return 'special-row-timeout';
              return '';
            }">
              <el-table-column prop="specialWarningId" label="专项预警ID" min-width="130">
                <template #default="scope"><span class="link-text" @click="openDetailDrawer(scope.row)">{{ scope.row.specialWarningId }}</span></template>
              </el-table-column>
              <el-table-column prop="occurTime" label="发生时间" min-width="125" />
              <el-table-column prop="warningScene" label="预警场景" min-width="120">
                <template #default="scope"><el-tag :type="getWarningSceneTagType(scope.row.warningScene)" size="small" class="special-scene-tag">{{ scope.row.warningScene }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="alertType" label="预警类型" min-width="120">
                <template #default="scope"><el-tag size="small" class="special-alert-type-tag">{{ scope.row.alertType }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="deviceId" label="设备ID" min-width="100">
                <template #default="scope"><span class="special-device-id">{{ scope.row.deviceId }}</span></template>
              </el-table-column>
              <el-table-column prop="disposalStatus" label="处置状态" min-width="130">
                <template #default="scope"><el-tag :type="getDisposalStatusTagType(scope.row.disposalStatus)" size="small" class="disposal-status-tag">{{ scope.row.disposalStatus }}</el-tag></template>
              </el-table-column>
            </el-table>
          </div>
          <div class="panel-footer"></div>
        </div>
      </div>
    </div>

    <el-drawer v-model="drawerVisible" :title="drawerTitle" direction="rtl" size="38%" :with-header="true" close-on-click-modal close-on-press-escape>
      <div class="detail-content" v-if="currentDetailData">
        <div v-if="currentDetailData && 'faultId' in currentDetailData">
          <el-divider content-position="left">基础信息</el-divider>
          <div class="detail-item"><label>故障ID：</label>{{ (currentDetailData as FaultListItem).faultId }}</div>
          <div class="detail-item"><label>故障类型：</label>{{ (currentDetailData as FaultListItem).faultType }}</div>
          <div class="detail-item"><label>故障码：</label>{{ (currentDetailData as FaultListItem).faultCode }}</div>
          <div class="detail-item"><label>区域编码：</label>{{ (currentDetailData as FaultListItem).areaCode }}</div>
          <div class="detail-item"><label>停车场ID：</label>{{ (currentDetailData as FaultListItem).lotId }}</div>
          <div class="detail-item"><label>设备类型：</label>{{ (currentDetailData as FaultListItem).deviceType}}</div>
          <el-divider content-position="left">详细信息</el-divider>
          <div class="detail-item long-text"><label>故障位置：</label>{{ (currentDetailData as FaultListItem).faultLocation }}</div>
          <div class="detail-item long-text"><label>影响范围：</label>{{ (currentDetailData as FaultListItem).influenceRange }}</div>
          <div class="detail-item"><label>受影响用户数：</label>{{ (currentDetailData as FaultListItem).affectedUserCount }} 人</div>
          <div class="detail-item"><label>维修责任人ID：</label>{{ (currentDetailData as FaultListItem).maintainUserId}}</div>
          <div class="detail-item"><label>维修截止时间：</label>{{ (currentDetailData as FaultListItem).maintenanceDeadline}}</div>
          <div class="detail-item"><label>维修进度：</label>{{ (currentDetailData as FaultListItem).maintenanceProgress}}</div>
        </div>

        <div v-else-if="currentDetailData && 'alertId' in currentDetailData && !('disposalMeasure' in currentDetailData)">
          <el-divider content-position="left">基本信息</el-divider>
          <div class="detail-item"><label>预警ID：</label>{{ (currentDetailData as AlertEventOverviewItem).alertId}}</div>
          <div class="detail-item"><label>预警等级：</label>{{ (currentDetailData as AlertEventOverviewItem).alertLevel}}</div>
          <div class="detail-item"><label>预警类型：</label>{{ (currentDetailData as AlertEventOverviewItem).alertType}}</div>
          <div class="detail-item"><label>区域编码：</label>{{ (currentDetailData as AlertEventOverviewItem).areaCode}}</div>
          <div class="detail-item"><label>停车场ID：</label>{{ (currentDetailData as AlertEventOverviewItem).lotId}}</div>
          <div class="detail-item"><label>路侧泊位ID：</label>{{ (currentDetailData as AlertEventOverviewItem).roadsideId}}</div>
          <div class="detail-item"><label>设备ID：</label>{{ (currentDetailData as AlertEventOverviewItem).deviceId}}</div>
          <el-divider content-position="left">详细信息</el-divider>
          <div class="detail-item long-text"><label>预警内容：</label>{{ (currentDetailData as AlertEventOverviewItem).alertContent}}</div>
          <div class="detail-item"><label>发生时间：</label>{{ (currentDetailData as AlertEventOverviewItem).occurTime}}</div>
          <div class="detail-item"><label>责任人ID：</label>{{ (currentDetailData as AlertEventOverviewItem).maintainUserId}}</div>
          <div class="detail-item"><label>责任人姓名：</label>{{ (currentDetailData as AlertEventOverviewItem).userName}}</div>
          <div class="detail-item"><label>处置状态：</label>{{ (currentDetailData as AlertEventOverviewItem).disposalStatus}}</div>
        </div>

        <div v-else-if="currentDetailData && 'alertId' in currentDetailData && 'disposalMeasure' in currentDetailData">
          <el-divider content-position="left">基础业务信息</el-divider>
          <div class="detail-item"><label>预警ID：</label>{{ (currentDetailData as DisposalProgressTrackingItem).alertId}}</div>
          <div class="detail-item"><label>责任人ID：</label>{{ (currentDetailData as DisposalProgressTrackingItem).maintainUserId}}</div>
          <div class="detail-item"><label>处置结果：</label>{{ (currentDetailData as DisposalProgressTrackingItem).disposalResult}}</div>
          <el-divider content-position="left">全流程时间节点</el-divider>
          <div class="detail-item"><label>发生时间：</label>{{ (currentDetailData as DisposalProgressTrackingItem).occurTime}}</div>
          <div class="detail-item"><label>派单时间：</label>{{ (currentDetailData as DisposalProgressTrackingItem).dispatchTime}}</div>
          <div class="detail-item"><label>接单时间：</label>{{ (currentDetailData as DisposalProgressTrackingItem).receiveTime}}</div>
          <div class="detail-item"><label>处置时间：</label>{{ (currentDetailData as DisposalProgressTrackingItem).disposalTime}}</div>
          <div class="detail-item"><label>反馈时间：</label>{{ (currentDetailData as DisposalProgressTrackingItem).feedbackTime}}</div>
          <div class="detail-item"><label>验收时间：</label>{{ (currentDetailData as DisposalProgressTrackingItem).receiveTime}}</div>
          <div class="detail-item"><label>办结时间：</label>{{ (currentDetailData as DisposalProgressTrackingItem).closeTime}}</div>
          <div class="detail-item"><label>更新时间：</label>{{ (currentDetailData as DisposalProgressTrackingItem).updateTime}}</div>
          <el-divider content-position="left">详细处置信息</el-divider>
          <div class="detail-item long-text"><label>预警内容：</label>{{ (currentDetailData as DisposalProgressTrackingItem).alertContent}}</div>
          <div class="detail-item long-text"><label>处置措施：</label>{{ (currentDetailData as DisposalProgressTrackingItem).disposalMeasure}}</div>
          <div class="detail-item">
            <label>处置凭证：</label>
            <span class="link-text" style="cursor: pointer;" @click="openAttachmentUrl((currentDetailData as DisposalProgressTrackingItem)?.attachmentUrl)" v-if="(currentDetailData as DisposalProgressTrackingItem)?.attachmentUrl">
              <el-icon size="14"><Document /></el-icon> 点击查看凭证附件
            </span>
            <span v-else>暂无处置凭证</span>
          </div>
        </div>

        <div v-else-if="currentDetailData && 'hiddenDangerId' in currentDetailData">
          <el-divider content-position="left">基础信息</el-divider>
          <div class="detail-item"><label>隐患ID：</label>{{ (currentDetailData as HiddenDangerWarningItem).hiddenDangerId}}</div>
          <div class="detail-item"><label>风险等级：</label>{{ (currentDetailData as HiddenDangerWarningItem).hiddenDangerLevel}}</div>
          <div class="detail-item"><label>隐患类型：</label>{{ (currentDetailData as HiddenDangerWarningItem).hiddenDangerType}}</div>
          <div class="detail-item"><label>区域编码：</label>{{ (currentDetailData as HiddenDangerWarningItem).areaCode}}</div>
          <div class="detail-item"><label>停车场ID：</label>{{ (currentDetailData as HiddenDangerWarningItem).lotId}}</div>
          <div class="detail-item"><label>路侧泊位ID：</label>{{ (currentDetailData as HiddenDangerWarningItem).roadsideId}}</div>
          <el-divider content-position="left">详细信息</el-divider>
          <div class="detail-item long-text"><label>影响范围：</label>{{ (currentDetailData as HiddenDangerWarningItem).influenceRange}}</div>
          <div class="detail-item long-text"><label>整改要求：</label>{{ (currentDetailData as HiddenDangerWarningItem).rectificationRequirement}}</div>
          <div class="detail-item"><label>整改截止时间：</label>{{ (currentDetailData as HiddenDangerWarningItem).rectificationDeadline}}</div>
          <div class="detail-item"><label>责任单位：</label>{{ (currentDetailData as HiddenDangerWarningItem).responsibleUnit}}</div>
          <div class="detail-item"><label>责任人：</label>{{ (currentDetailData as HiddenDangerWarningItem).responsiblePerson}}</div>
          <div class="detail-item long-text"><label>整改措施：</label>{{ (currentDetailData as HiddenDangerWarningItem).rectificationMeasure}}</div>
          <div class="detail-item"><label>整改进度：</label>{{ (currentDetailData as HiddenDangerWarningItem).rectificationStatus}}</div>
        </div>

        <div v-else-if="currentDetailData && 'complianceWarningId' in currentDetailData">
          <el-divider content-position="left">基础信息</el-divider>
          <div class="detail-item"><label>合规预警ID：</label>{{ (currentDetailData as ComplianceWarningItem).complianceWarningId}}</div>
          <div class="detail-item"><label>责任主体：</label>{{ (currentDetailData as ComplianceWarningItem).responsibleSubject}}</div>
          <div class="detail-item"><label>区域编码：</label>{{ (currentDetailData as ComplianceWarningItem).areaCode}}</div>
          <div class="detail-item"><label>停车场ID：</label>{{ (currentDetailData as ComplianceWarningItem).lotId}}</div>
          <div class="detail-item"><label>预警时间：</label>{{ (currentDetailData as ComplianceWarningItem).warningTime}}</div>
          <el-divider content-position="left">合规详情信息</el-divider>
          <div class="detail-item long-text"><label>违规详情：</label>{{ (currentDetailData as ComplianceWarningItem).violationDetail}}</div>
          <div class="detail-item long-text"><label>合规标准：</label>{{ (currentDetailData as ComplianceWarningItem).complianceStandard}}</div>
          <div class="detail-item long-text"><label>整改要求：</label>{{ (currentDetailData as ComplianceWarningItem).rectificationRequirement}}</div>
          <div class="detail-item long-text"><label>处罚建议：</label>{{ (currentDetailData as ComplianceWarningItem).punishmentSuggestion}}</div>
          <div class="detail-item"><label>整改期限：</label>{{ (currentDetailData as ComplianceWarningItem).rectificationDeadline}}</div>
          <div class="detail-item"><label>整改状态：</label>{{ (currentDetailData as ComplianceWarningItem).rectificationStatus}}</div>
        </div>

        <div v-else-if="currentDetailData && 'specialWarningId' in currentDetailData">
          <el-divider content-position="left">基础信息</el-divider>
          <div class="detail-item"><label>专项预警ID：</label>{{ (currentDetailData as SpecialWarningItem).specialWarningId}}</div>
          <div class="detail-item"><label>预警场景：</label>{{ (currentDetailData as SpecialWarningItem).warningScene}}</div>
          <div class="detail-item"><label>预警类型：</label>{{ (currentDetailData as SpecialWarningItem).alertType}}</div>
          <div class="detail-item"><label>区域编码：</label>{{ (currentDetailData as SpecialWarningItem).areaCode}}</div>
          <div class="detail-item"><label>停车场ID：</label>{{ (currentDetailData as SpecialWarningItem).lotId}}</div>
          <div class="detail-item"><label>路侧泊位ID：</label>{{ (currentDetailData as SpecialWarningItem).roadsideId}}</div>
          <div class="detail-item"><label>设备ID：</label>{{ (currentDetailData as SpecialWarningItem).deviceId}}</div>
          <el-divider content-position="left">详细信息</el-divider>
          <div class="detail-item long-text"><label>预警内容：</label>{{ (currentDetailData as SpecialWarningItem).alertContent}}</div>
          <div class="detail-item"><label>发生时间：</label>{{ (currentDetailData as SpecialWarningItem).occurTime}}</div>
          <div class="detail-item"><label>处置状态：</label>{{ (currentDetailData as SpecialWarningItem).disposalStatus}}</div>
          <div class="detail-item long-text"><label>处置措施：</label>{{ (currentDetailData as SpecialWarningItem).disposalMeasure}}</div>
          <div class="detail-item">
            <label>关联视频：</label>
            <span class="link-text" style="cursor: pointer;" @click="openVideoUrl((currentDetailData as SpecialWarningItem)?.videoUrl)">
              <el-icon size="14"><VideoPlay /></el-icon> 点击查看视频
            </span>
          </div>
        </div>

        <div v-else-if="currentDetailData && 'abnormalId' in currentDetailData">
          <el-divider content-position="left">基础异常信息</el-divider>
          <div class="detail-item"><label>异常ID：</label>{{ (currentDetailData as AbnormalWarningItem).abnormalId}}</div>
          <div class="detail-item"><label>异常类型：</label>{{ (currentDetailData as AbnormalWarningItem).abnormalType}}</div>
          <div class="detail-item"><label>区域编码：</label>{{ (currentDetailData as AbnormalWarningItem).areaCode}}</div>
          <div class="detail-item"><label>停车场ID：</label>{{ (currentDetailData as AbnormalWarningItem).lotId}}</div>
          <el-divider content-position="left">异常详细信息</el-divider>
          <div class="detail-item long-text"><label>异常原因：</label>{{ (currentDetailData as AbnormalWarningItem).abnormalReason}}</div>
          <div class="detail-item long-text"><label>影响范围：</label>{{ (currentDetailData as AbnormalWarningItem).influenceRange}}</div>
          <div class="detail-item long-text"><label>解除原因：</label>{{ (currentDetailData as AbnormalWarningItem).relieveReason}}</div>
          <div class="detail-item"><label>解除时间：</label>{{ (currentDetailData as AbnormalWarningItem).relieveTime}}</div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
@import '../../templatesstyle/common.scss';
@import '../../templatesstyle/fault-warning-view.scss';
@import '../../templatesstyle/alert-event-overview.scss';
@import '../../templatesstyle/hidden-danger-warning-view.scss';
@import '../../templatesstyle/compliance-warning-view.scss';
@import '../../templatesstyle/special-warning-view.scss';
@import '../../templatesstyle/disposal-progress-tracking.scss';
@import '../../templatesstyle/abnormal-warning-view.scss';

.page-container {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  padding: 0 1vw;
  overflow: hidden;
  color: #fff;
  background: url('../images/bg.jpg');
}

.header-box {
  position: relative;
  width: 100%;
  height: 10vh;
  font-size: 2.1vw;
  font-weight: bold;
  color: #0cf;
  background: url('../images/head_bg.png') no-repeat;
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
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 0.5vw;
  background: url('../images/line(1).png') rgb(255 255 255 / 4%);
  border: 0.2vh solid rgb(25 186 139 / 17%);
}

.mainbox {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.6vw;
  height: 92vh;
  padding: 0.6vw 0;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
}

.top { display: flex; gap: 0.6vw; height: 50%; width: 100%; overflow: hidden; }
.top-left { flex: 1; }
.top-middle { flex: 1; }
.top-right { flex: 1; }

.bottom { display: flex; gap: 0.6vw;	height: 46%; }
.bottom-left1 { flex: 1; }
.bottom-left2 { flex: 1; }
.bottom-right1 { flex: 1; }
.bottom-right2 { flex: 1; }

::v-deep(.el-tag) {
  &.el-tag--danger { background-color: rgba(255, 77, 109, 0.4); border-color: #ff4d6d; color: #fff; box-shadow: 0 0 0.5vw rgba(255, 77, 109, 0.5); }
  &.el-tag--warning { background-color: rgba(247, 147, 30, 0.4); border-color: #f7931e; color: #fff; box-shadow: 0 0 0.5vw rgba(247, 147, 30, 0.5); }
  &.el-tag--success { background-color: rgba(56, 176, 0, 0.4); border-color: #38b000; color: #fff; box-shadow: 0 0 0.5vw rgba(56, 176, 0, 0.5); }
  &.el-tag--info { background-color: rgba(0, 198, 255, 0.4); border-color: #00c6ff; color: #fff; box-shadow: 0 0 0.5vw rgba(0, 198, 255, 0.5); }
}

::v-deep .el-table .cell { overflow: hidden; text-overflow: ellipsis; }

.link-text {
  color: #409eff;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { color: #1677ff; text-decoration: underline; }
}

::v-deep .el-drawer { background-color: #1f2937; color: #fff; }
::v-deep .el-drawer__header { border-bottom: 1px solid #374151; color: #fff;}
::v-deep .el-divider__text { color: #94a3b8; }

.detail-content {
  padding: 0 10px;
  .detail-item {
    display: flex;
    padding: 8px 0;
    border-bottom: 1px solid #374151;
    label { min-width: 100px; color: #94a3b8; font-weight: 500; }
    &.long-text {
      flex-direction: column;
      label { margin-bottom: 4px; }
    }
  }
}
</style>
