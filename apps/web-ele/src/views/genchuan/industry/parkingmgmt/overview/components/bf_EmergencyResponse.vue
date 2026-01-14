<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { ArrowLeft, FullScreen, VideoPlay } from '@element-plus/icons-vue';
import {
  ElDivider,
  ElDrawer,
  ElMessage,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';
import screenFull from 'screenfull';

import {
  fetchEmergencySituationList,
  fetchEmergencyResourceDistributionList,
  fetchCommandDispatchBoardList,
  fetchEmergencyDisposalProgressList,
  fetchResourceDispatchViewList,
  fetchFieldSituationViewList,
  fetchEmergencyPlanViewList,
  fetchCrossDomainCooperationCommandList,
  fetchSpecialEmergencyViewList,
  fetchEmergencyDrillViewList,
} from '#/api/genchuan/industry/parkingmgmt/overview/EmergencyCommandView.ts';

// 1.应急态势视图 - 严格14个字段 无多无漏
interface EmergencySituationItem {
  emergencyId: string;
  emergencyLevel: string;
  emergencyType: string;
  address: string;
  longitude: string;
  latitude: string;
  influenceRange: string;
  developmentTrend: string;
  affectedVehicleCount: number;
  lossSituation: string;
  rescueProgress: string;
  responsibleUnit: string;
  occurTime: string;
  createTime: string;
}

// 2.应急资源分布 - 严格12个字段 无多无漏
interface EmergencyResourceDistributionItem {
  resourceId: string;
  resourceType: string;
  resourceName: string;
  address: string;
  longitude: string;
  latitude: string;
  resourceStatus: string;
  specification: string;
  belongDepartment: string;
  supplyChannel: string;
  distance: string;
  updateTime: string;
}

// 3.指挥调度看板 - 严格13个字段 无多无漏
interface CommandDispatchBoardItem {
  dispatchTaskId: string;
  taskContent: string;
  dispatchType: string;
  resourceId: string;
  address: string;
  userId: string;
  maintainUserId: string;
  taskStatus: string;
  dispatchTime: string;
  executeTime: string;
  completeTime: string;
  feedbackContent: string;
  createTime: string;
}

// 4.应急处置进度 - 严格13个字段 无多无漏
interface EmergencyDisposalProgressItem {
  emergencyId: string;
  disposalStage: string;
  disposalMeasure: string;
  stageStartTime: string;
  stageEndTime: string;
  responsibleUnit: string;
  keyNode: string;
  resourceInput: string;
  phasedAchievement: string;
  arrivalDuration: string;
  disposalDuration: string;
  controlDuration: string;
  updateTime: string;
}

// 5.资源调度视图 - 严格13个字段 无多无漏
interface ResourceDispatchViewItem {
  dispatchRecordId: string;
  resourceId: string;
  resourceType: string;
  dispatchPath: string;
  estimatedArrivalTime: string;
  dispatchQuantity: number;
  receiver: string;
  dispatchStatus: string;
  userId: string;
  transportMode: string;
  realTimeLocation: string;
  abnormalInfo: string;
  createTime: string;
}

// 6.现场态势视图 - 严格11个字段 无多无漏
interface FieldSituationViewItem {
  emergencyId: string;
  address: string;
  videoUrl: string;
  deviceId: string;
  fieldPersonLocation: string;
  fieldData: string;
  damageDegree: string;
  affectedBerthCount: number;
  evacuatedVehicleCount: number;
  repairBerthCount: number;
  updateTime: string;
}

// 7.应急方案视图 - 严格12个字段 无多无漏
interface EmergencyPlanViewItem {
  emergencyPlanId: string;
  planName: string;
  emergencyType: string;
  executionStep: string;
  responsibilityDivision: string;
  resourceDemand: string;
  mattersNeedingAttention: string;
  riskPrompt: string;
  relatedLaw: string;
  planStatus: string;
  launchTime: string;
  updateTime: string;
}

// 8.跨域协同指挥 - 严格11个字段 无多无漏
interface CrossDomainCooperationCommandItem {
  cooperationId: string;
  cooperationType: string;
  taskContent: string;
  participantUnit: string;
  responseStatus: string;
  cooperationEffect: string;
  instructionFlow: string;
  communicationRecord: string;
  startTime: string;
  completeTime: string;
  createTime: string;
}

// 9.专项应急视图 - 严格12个字段 无多无漏
interface SpecialEmergencyViewItem {
  specialEmergencyId: string;
  emergencyScene: string;
  evacuationRoute: string;
  address: string;
  trappedVehicleCount: number;
  evacuationProgress: string;
  congestionRange: string;
  congestionReason: string;
  lotId: string;
  dredgePath: string;
  repairProgress: string;
  createTime: string;
}

// 10.应急演练视图 - 严格12个字段 无多无漏
interface EmergencyDrillViewItem {
  drillId: string;
  drillSubject: string;
  participantUnit: string;
  participantPerson: string;
  drillStatus: string;
  executionSituation: string;
  problemRectification: string;
  scoreResult: string;
  drillPlanId: string;
  startTime: string;
  endTime: string;
  createTime: string;
}

// 联合详情类型
type DetailDataType =
  | EmergencySituationItem
  | EmergencyResourceDistributionItem
  | CommandDispatchBoardItem
  | EmergencyDisposalProgressItem
  | ResourceDispatchViewItem
  | FieldSituationViewItem
  | EmergencyPlanViewItem
  | CrossDomainCooperationCommandItem
  | SpecialEmergencyViewItem
  | EmergencyDrillViewItem
  | null;

// 响应式变量声明
const router = useRouter();
const pageContainerRef = ref<HTMLElement | null>(null);
const currentFullscreenPanel = ref<HTMLElement | null>(null);

const emergencySituationList = ref<EmergencySituationItem[]>([]);
const emergencyResourceList = ref<EmergencyResourceDistributionItem[]>([]);
const commandDispatchList = ref<CommandDispatchBoardItem[]>([]);
const emergencyDisposalList = ref<EmergencyDisposalProgressItem[]>([]);
const resourceDispatchList = ref<ResourceDispatchViewItem[]>([]);
const emergencySituationTableRef = ref<InstanceType<typeof ElTable> | null>(
  null,
);
const emergencyResourceTableRef = ref<InstanceType<typeof ElTable> | null>(
  null,
);
const commandDispatchTableRef = ref<InstanceType<typeof ElTable> | null>(null);
const emergencyDisposalTableRef = ref<InstanceType<typeof ElTable> | null>(
  null,
);
const resourceDispatchTableRef = ref<InstanceType<typeof ElTable> | null>(null);

const fieldSituationList = ref<FieldSituationViewItem[]>([]);
const emergencyPlanList = ref<EmergencyPlanViewItem[]>([]);
const crossDomainCooperationList = ref<CrossDomainCooperationCommandItem[]>([]);
const specialEmergencyList = ref<SpecialEmergencyViewItem[]>([]);
const emergencyDrillList = ref<EmergencyDrillViewItem[]>([]);
const fieldSituationTableRef = ref<InstanceType<typeof ElTable> | null>(null);
const emergencyPlanTableRef = ref<InstanceType<typeof ElTable> | null>(null);
const crossDomainCooperationTableRef = ref<InstanceType<typeof ElTable> | null>(
  null,
);
const specialEmergencyTableRef = ref<InstanceType<typeof ElTable> | null>(null);
const emergencyDrillTableRef = ref<InstanceType<typeof ElTable> | null>(null);

const tableMaxHeight = ref<string>('');
const leftActiveTab = ref('tab1');
const rightActiveTab = ref('tabA');
const drawerVisible = ref<boolean>(false);
const currentDetailData = ref<DetailDataType>(null);
const drawerTitle = ref<string>('详情信息');

// 定时器声明
let timeTimer: NodeJS.Timeout | null = null;
let emergencySituationTimer: NodeJS.Timeout | null = null;
let emergencyResourceTimer: NodeJS.Timeout | null = null;
let commandDispatchTimer: NodeJS.Timeout | null = null;
let emergencyDisposalTimer: NodeJS.Timeout | null = null;
let resourceDispatchTimer: NodeJS.Timeout | null = null;
let fieldSituationTimer: NodeJS.Timeout | null = null;
let emergencyPlanTimer: NodeJS.Timeout | null = null;
let crossDomainCooperationTimer: NodeJS.Timeout | null = null;
let specialEmergencyTimer: NodeJS.Timeout | null = null;
let emergencyDrillTimer: NodeJS.Timeout | null = null;

// 返回首页
const handleBack = () => {
  router.push('/');
};

// 整体全屏
const clickFullscreen = () => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }
  const targetEl = pageContainerRef.value;
  if (targetEl) {
    screenFull.isFullscreen ? screenFull.exit() : screenFull.request(targetEl);
  }
};

// 更新当前时间
const updateShowTime = () => {
  const dt = new Date();
  const y = dt.getFullYear();
  const mt = dt.getMonth() + 1;
  const day = dt.getDate();
  const h = dt.getHours().toString().padStart(2, '0');
  const m = dt.getMinutes().toString().padStart(2, '0');
  const s = dt.getSeconds().toString().padStart(2, '0');
  const showTimeEl = document.querySelector('.showTime');
  showTimeEl &&
    (showTimeEl.innerHTML = `${y}年${mt}月${day}日 ${h}时${m}分${s}秒`);
};

// 打开详情抽屉-精准匹配标题
const openDetailDrawer = (row: DetailDataType) => {
  currentDetailData.value = row;
  if (row && 'emergencyId' in row && !('disposalStage' in row))
    drawerTitle.value = '应急事件详情';
  else if (row && 'resourceId' in row && !('dispatchRecordId' in row))
    drawerTitle.value = '应急资源详情';
  else if (row && 'dispatchTaskId' in row) drawerTitle.value = '指挥调度详情';
  else if (row && 'disposalStage' in row)
    drawerTitle.value = '应急处置进度详情';
  else if (row && 'dispatchRecordId' in row) drawerTitle.value = '资源调度详情';
  else if (row && 'videoUrl' in row) drawerTitle.value = '现场态势详情';
  else if (row && 'emergencyPlanId' in row) drawerTitle.value = '应急方案详情';
  else if (row && 'cooperationId' in row)
    drawerTitle.value = '跨域协同指挥详情';
  else if (row && 'specialEmergencyId' in row)
    drawerTitle.value = '专项应急详情';
  else if (row && 'drillId' in row) drawerTitle.value = '应急演练详情';
  drawerVisible.value = true;
};

// 打开视频/附件
const openVideoUrl = (url: string) => {
  url ? window.open(url, '_blank') : ElMessage.warning('暂无关联视频');
};
const openAttachmentUrl = (url: string) => {
  url ? window.open(url, '_blank') : ElMessage.warning('暂无相关附件');
};

// 标签颜色映射
const getEmergencyLevelTagType = (level: string) => {
  switch (level) {
    case '重大':
      return 'danger';
    case '较大':
      return 'warning';
    case '一般':
      return 'info';
    case '特别重大':
      return 'danger';
    default:
      return 'info';
  }
};
const getStatusTagType = (status: string) => {
  switch (status) {
    case '已完成':
    case '已送达':
    case '已启用':
    case '已响应':
      return 'success';
    case '执行中':
    case '在途':
    case '抢修中':
    case '进行中':
      return 'warning';
    case '未完成':
    case '异常':
    case '在途异常':
    case '损坏':
    case '短缺':
    case '拒绝':
      return 'danger';
    default:
      return 'info';
  }
};

// 表格高度自适应
const initTableHeight = () => {
  nextTick(() => {
    tableMaxHeight.value = '';
    const panelContainer = document.querySelector('.panel .el-tabs__content');
    if (panelContainer) {
      tableMaxHeight.value = `${panelContainer.clientHeight - 20}px`;
      setTimeout(() => {
        emergencySituationTableRef.value?.doLayout();
        emergencyResourceTableRef.value?.doLayout();
        commandDispatchTableRef.value?.doLayout();
        emergencyDisposalTableRef.value?.doLayout();
        resourceDispatchTableRef.value?.doLayout();
        fieldSituationTableRef.value?.doLayout();
        emergencyPlanTableRef.value?.doLayout();
        crossDomainCooperationTableRef.value?.doLayout();
        specialEmergencyTableRef.value?.doLayout();
        emergencyDrillTableRef.value?.doLayout();
      }, 50);
    }
  });
};

// 面板全屏切换
const handleFullscreenChange = () => {
  if (!screenFull.isFullscreen && currentFullscreenPanel.value) {
    currentFullscreenPanel.value.style = '';
    nextTick(() => {
      nextTick(() => {
        initTableHeight();
      });
    });
    screenFull.off('change', handleFullscreenChange);
    currentFullscreenPanel.value = null;
  }
};

const togglePanelFullscreen = (panelRef: string) => {
  if (!screenFull.isEnabled)
    return ElMessage.warning('您的浏览器不支持全屏功能');
  const panel = document.querySelector(`.${panelRef}`);
  if (!panel) return ElMessage.error('未找到面板元素');
  screenFull.off('change', handleFullscreenChange);
  if (currentFullscreenPanel.value && currentFullscreenPanel.value !== panel) {
    screenFull.exit();
    currentFullscreenPanel.value.style = '';
  }
  currentFullscreenPanel.value = panel as HTMLElement;
  if (screenFull.isFullscreen && document.fullscreenElement === panel) {
    screenFull
      .exit()
      .catch((error) => ElMessage.error(`退出全屏失败：${error.message}`));
  } else {
    screenFull.on('change', handleFullscreenChange);
    screenFull
      .request(panel)
      .catch((error) => ElMessage.error(`全屏失败：${error.message}`));
  }
};

// 接口请求方法-完整保留 字段精准映射
const fetchEmergencySituationData = async () => {
  try {
    emergencySituationList.value = await fetchEmergencySituationList({});
    nextTick(() => emergencySituationTableRef.value?.doLayout());
  } catch (error) {
    console.error('应急态势视图请求失败:', error);
    ElMessage.error('应急态势数据加载失败');
  }
};
const fetchEmergencyResourceData = async () => {
  try {
    emergencyResourceList.value = await fetchEmergencyResourceDistributionList(
      {},
    );
    nextTick(() => emergencyResourceTableRef.value?.doLayout());
  } catch (error) {
    console.error('应急资源分布请求失败:', error);
    ElMessage.error('应急资源数据加载失败');
  }
};
const fetchCommandDispatchData = async () => {
  try {
    commandDispatchList.value = await fetchCommandDispatchBoardList({});
    nextTick(() => commandDispatchTableRef.value?.doLayout());
  } catch (error) {
    console.error('指挥调度看板请求失败:', error);
    ElMessage.error('指挥调度数据加载失败');
  }
};
const fetchEmergencyDisposalData = async () => {
  try {
    emergencyDisposalList.value = await fetchEmergencyDisposalProgressList({});
    nextTick(() => emergencyDisposalTableRef.value?.doLayout());
  } catch (error) {
    console.error('应急处置进度请求失败:', error);
    ElMessage.error('处置进度数据加载失败');
  }
};
const fetchResourceDispatchData = async () => {
  try {
    resourceDispatchList.value = await fetchResourceDispatchViewList({});
    nextTick(() => resourceDispatchTableRef.value?.doLayout());
  } catch (error) {
    console.error('资源调度视图请求失败:', error);
    ElMessage.error('资源调度数据加载失败');
  }
};
const fetchFieldSituationData = async () => {
  try {
    fieldSituationList.value = await fetchFieldSituationViewList({});
    nextTick(() => fieldSituationTableRef.value?.doLayout());
  } catch (error) {
    console.error('现场态势视图请求失败:', error);
    ElMessage.error('现场态势数据加载失败');
  }
};
const fetchEmergencyPlanData = async () => {
  try {
    emergencyPlanList.value = await fetchEmergencyPlanViewList({});
    nextTick(() => emergencyPlanTableRef.value?.doLayout());
  } catch (error) {
    console.error('应急方案视图请求失败:', error);
    ElMessage.error('应急方案数据加载失败');
  }
};
const fetchCrossDomainCooperationData = async () => {
  try {
    crossDomainCooperationList.value =
      await fetchCrossDomainCooperationCommandList({});
    nextTick(() => crossDomainCooperationTableRef.value?.doLayout());
  } catch (error) {
    console.error('跨域协同指挥请求失败:', error);
    ElMessage.error('跨域协同数据加载失败');
  }
};
const fetchSpecialEmergencyData = async () => {
  try {
    specialEmergencyList.value = await fetchSpecialEmergencyViewList({});
    nextTick(() => specialEmergencyTableRef.value?.doLayout());
  } catch (error) {
    console.error('专项应急视图请求失败:', error);
    ElMessage.error('专项应急数据加载失败');
  }
};
const fetchEmergencyDrillData = async () => {
  try {
    emergencyDrillList.value = await fetchEmergencyDrillViewList({});
    nextTick(() => emergencyDrillTableRef.value?.doLayout());
  } catch (error) {
    console.error('应急演练视图请求失败:', error);
    ElMessage.error('应急演练数据加载失败');
  }
};

// 生命周期钩子
onMounted(() => {
  updateShowTime();
  timeTimer = setInterval(updateShowTime, 1000);

  fetchEmergencySituationData();
  fetchEmergencyResourceData();
  fetchCommandDispatchData();
  fetchEmergencyDisposalData();
  fetchResourceDispatchData();
  fetchFieldSituationData();
  fetchEmergencyPlanData();
  fetchCrossDomainCooperationData();
  fetchSpecialEmergencyData();
  fetchEmergencyDrillData();

  emergencySituationTimer = setInterval(fetchEmergencySituationData, 30000);
  emergencyResourceTimer = setInterval(fetchEmergencyResourceData, 30000);
  commandDispatchTimer = setInterval(fetchCommandDispatchData, 30000);
  emergencyDisposalTimer = setInterval(fetchEmergencyDisposalData, 30000);
  resourceDispatchTimer = setInterval(fetchResourceDispatchData, 30000);
  fieldSituationTimer = setInterval(fetchFieldSituationData, 30000);
  emergencyPlanTimer = setInterval(fetchEmergencyPlanData, 30000);
  crossDomainCooperationTimer = setInterval(
    fetchCrossDomainCooperationData,
    30000,
  );
  specialEmergencyTimer = setInterval(fetchSpecialEmergencyData, 30000);
  emergencyDrillTimer = setInterval(fetchEmergencyDrillData, 30000);

  initTableHeight();
  window.addEventListener('resize', initTableHeight);
});

onUnmounted(() => {
  timeTimer && clearInterval(timeTimer);
  emergencySituationTimer && clearInterval(emergencySituationTimer);
  emergencyResourceTimer && clearInterval(emergencyResourceTimer);
  commandDispatchTimer && clearInterval(commandDispatchTimer);
  emergencyDisposalTimer && clearInterval(emergencyDisposalTimer);
  resourceDispatchTimer && clearInterval(resourceDispatchTimer);
  fieldSituationTimer && clearInterval(fieldSituationTimer);
  emergencyPlanTimer && clearInterval(emergencyPlanTimer);
  crossDomainCooperationTimer && clearInterval(crossDomainCooperationTimer);
  specialEmergencyTimer && clearInterval(specialEmergencyTimer);
  emergencyDrillTimer && clearInterval(emergencyDrillTimer);

  window.removeEventListener('resize', initTableHeight);
  if (screenFull.isEnabled && screenFull.isFullscreen) screenFull.exit();
  currentFullscreenPanel.value &&
    screenFull.off('change', handleFullscreenChange);
});
</script>

<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="mainbox">
      <!-- 左侧面板 -->
      <div class="panel left left-panel">
        <el-tabs v-model="leftActiveTab" class="custom-tabs">
          <el-tab-pane label="应急态势视图" name="tab1">
            <ElTable
              ref="emergencySituationTableRef"
              :data="emergencySituationList"
              border
              size="small"
              :height="tableMaxHeight"
              style="width: 100%; table-layout: fixed"
              :empty-text="
                emergencySituationList.length === 0 ? '暂无应急态势数据' : ''
              "
            >
              <el-table-column prop="emergencyId" label="事件ID" min-width="120"
                ><template #default="scope"
                  ><span
                    class="link-text"
                    @click="openDetailDrawer(scope.row)"
                    >{{ scope.row.emergencyId }}</span
                  ></template
                ></el-table-column
              >
              <el-table-column
                prop="emergencyLevel"
                label="事件等级"
                min-width="100"
                ><template #default="scope"
                  ><el-tag
                    :type="getEmergencyLevelTagType(scope.row.emergencyLevel)"
                    size="small"
                    >{{ scope.row.emergencyLevel }}</el-tag
                  ></template
                ></el-table-column
              >
              <el-table-column
                prop="emergencyType"
                label="事件类型"
                min-width="120"
              />
              <el-table-column
                prop="address"
                label="事发地址"
                min-width="180"
                show-overflow-tooltip
              />
              <el-table-column
                prop="occurTime"
                label="发生时间"
                min-width="125"
              />
              <el-table-column
                prop="rescueProgress"
                label="救援进度"
                min-width="120"
              />
            </ElTable>
          </el-tab-pane>
          <el-tab-pane label="应急资源分布" name="tab2">
            <ElTable
              ref="emergencyResourceTableRef"
              :data="emergencyResourceList"
              border
              size="small"
              :height="tableMaxHeight"
              style="width: 100%; table-layout: fixed"
              :empty-text="
                emergencyResourceList.length === 0 ? '暂无应急资源数据' : ''
              "
            >
              <el-table-column prop="resourceId" label="资源ID" min-width="120"
                ><template #default="scope"
                  ><span
                    class="link-text"
                    @click="openDetailDrawer(scope.row)"
                    >{{ scope.row.resourceId }}</span
                  ></template
                ></el-table-column
              >
              <el-table-column
                prop="resourceType"
                label="资源类型"
                min-width="100"
              />
              <el-table-column
                prop="resourceName"
                label="资源名称"
                min-width="150"
                show-overflow-tooltip
              />
              <el-table-column
                prop="resourceStatus"
                label="资源状态"
                min-width="100"
                ><template #default="scope"
                  ><el-tag
                    :type="getStatusTagType(scope.row.resourceStatus)"
                    size="small"
                    >{{ scope.row.resourceStatus }}</el-tag
                  ></template
                ></el-table-column
              >
              <el-table-column prop="distance" label="距离" min-width="80" />
            </ElTable>
          </el-tab-pane>
          <el-tab-pane label="指挥调度看板" name="tab3">
            <ElTable
              ref="commandDispatchTableRef"
              :data="commandDispatchList"
              border
              size="small"
              :height="tableMaxHeight"
              style="width: 100%; table-layout: fixed"
              :empty-text="
                commandDispatchList.length === 0 ? '暂无调度任务数据' : ''
              "
            >
              <el-table-column
                prop="dispatchTaskId"
                label="调度ID"
                min-width="120"
                ><template #default="scope"
                  ><span
                    class="link-text"
                    @click="openDetailDrawer(scope.row)"
                    >{{ scope.row.dispatchTaskId }}</span
                  ></template
                ></el-table-column
              >
              <el-table-column
                prop="dispatchType"
                label="派单类型"
                min-width="100"
              />
              <el-table-column
                prop="taskStatus"
                label="任务状态"
                min-width="100"
                ><template #default="scope"
                  ><el-tag
                    :type="getStatusTagType(scope.row.taskStatus)"
                    size="small"
                    >{{ scope.row.taskStatus }}</el-tag
                  ></template
                ></el-table-column
              >
              <el-table-column
                prop="dispatchTime"
                label="派单时间"
                min-width="125"
              />
              <el-table-column
                prop="address"
                label="调度地址"
                min-width="180"
                show-overflow-tooltip
              />
            </ElTable>
          </el-tab-pane>
          <el-tab-pane label="应急处置进度" name="tab4">
            <ElTable
              ref="emergencyDisposalTableRef"
              :data="emergencyDisposalList"
              border
              size="small"
              :height="tableMaxHeight"
              style="width: 100%; table-layout: fixed"
              :empty-text="
                emergencyDisposalList.length === 0 ? '暂无处置进度数据' : ''
              "
            >
              <el-table-column prop="emergencyId" label="事件ID" min-width="120"
                ><template #default="scope"
                  ><span
                    class="link-text"
                    @click="openDetailDrawer(scope.row)"
                    >{{ scope.row.emergencyId }}</span
                  ></template
                ></el-table-column
              >
              <el-table-column
                prop="disposalStage"
                label="处置阶段"
                min-width="100"
              />
              <el-table-column
                prop="arrivalDuration"
                label="到场时长"
                min-width="100"
              />
              <el-table-column
                prop="responsibleUnit"
                label="责任单位"
                min-width="150"
                show-overflow-tooltip
              />
              <el-table-column
                prop="updateTime"
                label="更新时间"
                min-width="125"
              />
            </ElTable>
          </el-tab-pane>
          <el-tab-pane label="资源调度视图" name="tab5">
            <ElTable
              ref="resourceDispatchTableRef"
              :data="resourceDispatchList"
              border
              size="small"
              :height="tableMaxHeight"
              style="width: 100%; table-layout: fixed"
              :empty-text="
                resourceDispatchList.length === 0 ? '暂无资源调度数据' : ''
              "
            >
              <el-table-column
                prop="dispatchRecordId"
                label="调度记录ID"
                min-width="130"
                ><template #default="scope"
                  ><span
                    class="link-text"
                    @click="openDetailDrawer(scope.row)"
                    >{{ scope.row.dispatchRecordId }}</span
                  ></template
                ></el-table-column
              >
              <el-table-column
                prop="resourceType"
                label="资源类型"
                min-width="100"
              />
              <el-table-column
                prop="dispatchStatus"
                label="调度状态"
                min-width="100"
                ><template #default="scope"
                  ><el-tag
                    :type="getStatusTagType(scope.row.dispatchStatus)"
                    size="small"
                    >{{ scope.row.dispatchStatus }}</el-tag
                  ></template
                ></el-table-column
              >
              <el-table-column
                prop="estimatedArrivalTime"
                label="预计到达"
                min-width="125"
              />
              <el-table-column
                prop="realTimeLocation"
                label="实时位置"
                min-width="150"
                show-overflow-tooltip
              />
            </ElTable>
          </el-tab-pane>
        </el-tabs>
        <div class="panel-footer"></div>
      </div>
      <!-- 右侧面板 -->
      <div class="panel right right-panel">
        <el-tabs v-model="rightActiveTab" class="custom-tabs">
          <el-tab-pane label="现场态势视图" name="tabA">
            <ElTable
              ref="fieldSituationTableRef"
              :data="fieldSituationList"
              border
              size="small"
              :height="tableMaxHeight"
              style="width: 100%; table-layout: fixed"
              :empty-text="
                fieldSituationList.length === 0 ? '暂无现场态势数据' : ''
              "
            >
              <el-table-column prop="emergencyId" label="事件ID" min-width="120"
                ><template #default="scope"
                  ><span
                    class="link-text"
                    @click="openDetailDrawer(scope.row)"
                    >{{ scope.row.emergencyId }}</span
                  ></template
                ></el-table-column
              >
              <el-table-column
                prop="damageDegree"
                label="损坏程度"
                min-width="100"
              />
              <el-table-column
                prop="affectedBerthCount"
                label="受影响泊位"
                min-width="100"
              />
              <el-table-column
                prop="evacuatedVehicleCount"
                label="疏散车辆数"
                min-width="100"
              />
              <el-table-column
                prop="updateTime"
                label="更新时间"
                min-width="125"
              />
            </ElTable>
          </el-tab-pane>
          <el-tab-pane label="应急方案视图" name="tabB">
            <ElTable
              ref="emergencyPlanTableRef"
              :data="emergencyPlanList"
              border
              size="small"
              :height="tableMaxHeight"
              style="width: 100%; table-layout: fixed"
              :empty-text="
                emergencyPlanList.length === 0 ? '暂无应急方案数据' : ''
              "
            >
              <el-table-column
                prop="emergencyPlanId"
                label="方案ID"
                min-width="130"
                ><template #default="scope"
                  ><span
                    class="link-text"
                    @click="openDetailDrawer(scope.row)"
                    >{{ scope.row.emergencyPlanId }}</span
                  ></template
                ></el-table-column
              >
              <el-table-column
                prop="planName"
                label="方案名称"
                min-width="180"
                show-overflow-tooltip
              />
              <el-table-column
                prop="emergencyType"
                label="适配类型"
                min-width="120"
              />
              <el-table-column
                prop="planStatus"
                label="方案状态"
                min-width="100"
                ><template #default="scope"
                  ><el-tag
                    :type="getStatusTagType(scope.row.planStatus)"
                    size="small"
                    >{{ scope.row.planStatus }}</el-tag
                  ></template
                ></el-table-column
              >
            </ElTable>
          </el-tab-pane>
          <el-tab-pane label="跨域协同指挥" name="tabC">
            <ElTable
              ref="crossDomainCooperationTableRef"
              :data="crossDomainCooperationList"
              border
              size="small"
              :height="tableMaxHeight"
              style="width: 100%; table-layout: fixed"
              :empty-text="
                crossDomainCooperationList.length === 0
                  ? '暂无协同指挥数据'
                  : ''
              "
            >
              <el-table-column
                prop="cooperationId"
                label="协同ID"
                min-width="120"
                ><template #default="scope"
                  ><span
                    class="link-text"
                    @click="openDetailDrawer(scope.row)"
                    >{{ scope.row.cooperationId }}</span
                  ></template
                ></el-table-column
              >
              <el-table-column
                prop="cooperationType"
                label="协同类型"
                min-width="100"
              />
              <el-table-column
                prop="responseStatus"
                label="响应状态"
                min-width="100"
                ><template #default="scope"
                  ><el-tag
                    :type="getStatusTagType(scope.row.responseStatus)"
                    size="small"
                    >{{ scope.row.responseStatus }}</el-tag
                  ></template
                ></el-table-column
              >
              <el-table-column
                prop="startTime"
                label="开始时间"
                min-width="125"
              />
            </ElTable>
          </el-tab-pane>
          <el-tab-pane label="专项应急视图" name="tabD">
            <ElTable
              ref="specialEmergencyTableRef"
              :data="specialEmergencyList"
              border
              size="small"
              :height="tableMaxHeight"
              style="width: 100%; table-layout: fixed"
              :empty-text="
                specialEmergencyList.length === 0 ? '暂无专项应急数据' : ''
              "
            >
              <el-table-column
                prop="specialEmergencyId"
                label="专项ID"
                min-width="130"
                ><template #default="scope"
                  ><span
                    class="link-text"
                    @click="openDetailDrawer(scope.row)"
                    >{{ scope.row.specialEmergencyId }}</span
                  ></template
                ></el-table-column
              >
              <el-table-column
                prop="emergencyScene"
                label="应急场景"
                min-width="120"
              />
              <el-table-column
                prop="evacuationProgress"
                label="疏散进度"
                min-width="100"
              />
              <el-table-column
                prop="repairProgress"
                label="抢修进度"
                min-width="100"
              />
              <el-table-column
                prop="address"
                label="地址"
                min-width="180"
                show-overflow-tooltip
              />
            </ElTable>
          </el-tab-pane>
          <el-tab-pane label="应急演练视图" name="tabE">
            <ElTable
              ref="emergencyDrillTableRef"
              :data="emergencyDrillList"
              border
              size="small"
              :height="tableMaxHeight"
              style="width: 100%; table-layout: fixed"
              :empty-text="
                emergencyDrillList.length === 0 ? '暂无应急演练数据' : ''
              "
            >
              <el-table-column prop="drillId" label="演练ID" min-width="120"
                ><template #default="scope"
                  ><span
                    class="link-text"
                    @click="openDetailDrawer(scope.row)"
                    >{{ scope.row.drillId }}</span
                  ></template
                ></el-table-column
              >
              <el-table-column
                prop="drillSubject"
                label="演练科目"
                min-width="150"
              />
              <el-table-column
                prop="drillStatus"
                label="演练状态"
                min-width="100"
                ><template #default="scope"
                  ><el-tag
                    :type="getStatusTagType(scope.row.drillStatus)"
                    size="small"
                    >{{ scope.row.drillStatus }}</el-tag
                  ></template
                ></el-table-column
              >
              <el-table-column
                prop="scoreResult"
                label="演练评分"
                min-width="80"
              />
              <el-table-column
                prop="startTime"
                label="开始时间"
                min-width="125"
              />
            </ElTable>
          </el-tab-pane>
        </el-tabs>
        <div class="panel-footer"></div>
      </div>
    </div>

    <!-- 详情抽屉-字段精准渲染 过滤--空值 -->
    <ElDrawer
      v-model="drawerVisible"
      :title="drawerTitle"
      direction="rtl"
      size="38%"
      :with-header="true"
      close-on-click-modal
      close-on-press-escape
    >
      <div class="detail-content" v-if="currentDetailData">
        <div
          v-for="item in [currentDetailData]"
          :key="item"
          class="detail-wrap"
        >
          <ElDivider content-position="left">基础信息</ElDivider>
          <template v-for="(val, key) in item" :key="key">
            <div
              class="detail-item"
              v-if="typeof val !== 'object' && val !== '--' && val"
            >
              <label
                >{{
                  key === 'emergencyId'
                    ? '事件ID'
                    : key === 'resourceId'
                      ? '资源ID'
                      : key === 'dispatchTaskId'
                        ? '调度ID'
                        : key === 'dispatchRecordId'
                          ? '调度记录ID'
                          : key === 'emergencyPlanId'
                            ? '方案ID'
                            : key === 'cooperationId'
                              ? '协同ID'
                              : key === 'specialEmergencyId'
                                ? '专项应急ID'
                                : key === 'drillId'
                                  ? '演练ID'
                                  : key
                }}：</label
              >
              <span
                v-if="key === 'videoUrl'"
                class="link-text"
                @click="openVideoUrl(val)"
                ><el-icon size="14"><VideoPlay /></el-icon> 点击查看视频</span
              >
              <span v-else>{{ val }}</span>
            </div>
          </template>
        </div>
      </div>
    </ElDrawer>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../templatesstyle/common';
@import '../../../templatesstyle/core-indicator-dashboard';
@import '../../../templatesstyle/global-data-map';
@import '../../../templatesstyle/global-posture-trend';
@import '../../../templatesstyle/core-object-distribution';
@import '../../../templatesstyle/posture-aggregation';
@import '../../../templatesstyle/core-elements-operation';

.general-stat-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6vw;
  align-items: center;
  justify-content: center;
  height: auto;
}

.general-stat-item {
  display: flex;
  flex: 0 0 8.4vw;
  flex-direction: column;
  justify-content: space-between;
  height: 12vh;
  padding-top: 1vh;
  background: linear-gradient(
    135deg,
    rgb(120 45 180 / 80%) 0%,
    rgb(145 75 201 / 60%) 50%,
    rgb(100 30 150 / 70%) 100%
  );
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  border: 1px solid transparent;
  border-radius: 12px;
  box-shadow:
    0 4px 12px rgb(0 0 0 / 30%),
    inset 0 1px 0 rgb(255 255 255 / 15%),
    inset 0 -1px 0 rgb(0 0 0 / 20%);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    background: linear-gradient(
      135deg,
      rgb(130 55 190 / 90%) 0%,
      rgb(155 85 211 / 70%) 50%,
      rgb(110 40 160 / 80%) 100%
    );
    transform: translateY(-2px) scale(1.02);
  }

  .stat-title {
    font-size: 0.84vw;
    color: #e9d5ff;
    text-align: center;
    letter-spacing: 0.05vw;
    text-shadow: 0 1px 2px rgb(0 0 0 / 50%);
  }

  .stat-value {
    font-size: 1.2vw;
    font-weight: 700;
    color: #e4cbf3;
    text-align: center;
    text-shadow: 0 2px 4px rgb(0 0 0 / 40%);
  }

  .stat-unit {
    margin-right: 1vw;
    margin-bottom: 1vh;
    font-size: 0.8vw;
    color: #bbb8b8;
    text-align: right;
    text-shadow: 0 1px 2px rgb(0 0 0 / 30%);
    opacity: 0.9;
  }
}

.page-container {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  padding: 0 1vw;
  overflow-x: hidden !important;
  overflow-y: hidden;
  color: #fff;
  background: url('../../images/bg.jpg') no-repeat;
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

  .back-button,
  .fullScreenBut {
    position: absolute;
    top: 50%;
    cursor: pointer;
    outline: none;
    background: transparent;
    border: none;
    transform: translateY(-50%);
  }

  .back-button {
    left: 2vw;
  }

  .fullScreenBut {
    right: 2vw;
  }

  .head-name {
    position: absolute;
    left: 50%;
    display: inline-block;
    line-height: 9vh;
    white-space: nowrap;
    transform: translateX(-50%);
  }

  .showTime {
    position: absolute;
    top: 50%;
    right: 6vw;
    font-size: 0.9vw;
    color: #99d9ff;
    transform: translateY(-50%);
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
  background: url('../../images/line(1).png') rgb(255 255 255 / 4%);
  border: 0.2vh solid rgb(25 186 139 / 17%);

  .custom-tabs {
    flex: 1;
    width: 100%;
    height: 100%;
  }
}

.mainbox {
  box-sizing: border-box;
  display: flex;
  gap: 0.6vw;
  width: 100%;
  height: 88vh;
  margin: 0 auto;
  overflow: hidden !important;
}

.left,
.right {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1.5%;
  overflow: hidden;
}

// Vue3 深度作用选择器 表格样式完全生效
:deep(.el-button--text.el-button--small) {
  font-size: 0.7vw;
}

:deep(.el-button--small.el-button--primary) {
  min-width: 5vw;
  max-width: 8vw;
  height: auto;
  padding: 0.3vw 0.8vw;
  font-size: 0.7vw;
  line-height: 1.2;
  border-radius: 0.3vw;

  &:hover {
    padding: 0.35vw 0.85vw;
  }
}

:deep(.custom-tabs) {
  --el-tabs-header-background-color: transparent;
  --el-tabs-indicator-color: #0cf;
  --el-tabs-border-color: rgb(25 186 139 / 40%);

  .el-tabs__header {
    padding: 0 0.5vw;
    margin: 0 0 0.5vw;
    border-bottom: 1px solid var(--el-tabs-border-color);

    .el-tabs__nav {
      .el-tabs__item {
        padding: 0.4vw 0.7vw;
        margin: 0 0.05vw;
        font-size: 0.95vw;
        font-weight: 600;
        color: #99d9ff;
        transition: all 0.2s ease;

        &:hover {
          color: #0cf;
          transform: scale(1.02);
        }

        &.is-active {
          font-weight: bold;
          color: #0cf;
          text-shadow:
            0 0 0.3vw #0cf,
            0 0 0.6vw #00ccff80;
        }
      }
    }
  }

  .el-tabs__content {
    width: 100%;
    height: calc(100% - 2.2vw);
    overflow: hidden;

    .el-tab-pane {
      width: 100%;
      height: 100%;
      overflow: hidden auto;
      color: #e6f7ff;

      &::-webkit-scrollbar {
        width: 0.2vw;
        height: 0.2vw;
      }

      &::-webkit-scrollbar-thumb {
        background: rgb(0 204 255 / 50%);
        border-radius: 0.2vw;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }
    }
  }

  .el-tabs__active-bar {
    height: 0.18vw !important;
    background-color: #0cf !important;
  }
}
// el-table 完整深色适配样式
:deep(.el-table) {
  --el-table-header-text-color: #0cf;
  --el-table-row-hover-bg-color: rgb(0 204 255 / 10%);
  --el-table-text-color: #e6f7ff;
  --el-table-border-color: rgb(25 186 139 / 30%);
  --el-table-bg-color: transparent;

  color: #e6f7ff;
  background: transparent;
  border-color: var(--el-table-border-color);

  .el-table__inner-wrapper {
    background: transparent;
  }

  .el-table__header-wrapper,
  .el-table__body-wrapper {
    .el-table__cell {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-color: var(--el-table-border-color);
    }
  }

  .el-table__header .el-table__cell {
    font-weight: 600;
    color: #0cf;
    background: rgb(0 30 60 / 50%);
  }

  .el-table__body tr {
    background: transparent;

    &:hover > td {
      background: rgb(0 204 255 / 10%) !important;
    }
  }

  .el-table__empty-text {
    color: #99d9ff;
  }
}
// 标签样式
:deep(.el-tag) {
  &.el-tag--danger {
    color: #fff;
    background-color: rgb(255 77 109 / 40%);
    border-color: #ff4d6d;
    box-shadow: 0 0 0.5vw rgb(255 77 109 / 50%);
  }

  &.el-tag--warning {
    color: #fff;
    background-color: rgb(247 147 30 / 40%);
    border-color: #f7931e;
    box-shadow: 0 0 0.5vw rgb(247 147 30 / 50%);
  }

  &.el-tag--success {
    color: #fff;
    background-color: rgb(56 176 0 / 40%);
    border-color: #38b000;
    box-shadow: 0 0 0.5vw rgb(56 176 0 / 50%);
  }

  &.el-tag--info {
    color: #fff;
    background-color: rgb(0 198 255 / 40%);
    border-color: #00c6ff;
    box-shadow: 0 0 0.5vw rgb(0 198 255 / 50%);
  }
}
// 抽屉样式
:deep(.el-drawer) {
  color: #fff;
  background-color: #1f2937;
}

:deep(.el-drawer__header) {
  color: #fff;
  border-bottom: 1px solid #374151;
}

:deep(.el-divider__text) {
  color: #94a3b8;
}

// 通用样式
.link-text {
  color: #409eff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #1677ff;
    text-decoration: underline;
  }
}

.detail-content {
  max-height: 80vh;
  padding: 0 10px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 3px;
  }

  .detail-item {
    display: flex;
    padding: 8px 0;
    border-bottom: 1px solid #374151;

    label {
      min-width: 120px;
      font-weight: 500;
      color: #94a3b8;
    }
  }
}
</style>
