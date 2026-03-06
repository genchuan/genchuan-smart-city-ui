<script setup lang="ts">
import { getCurrentInstance, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Filter, Refresh, FullScreen, Setting, VideoPause, VideoPlay, Picture } from '@element-plus/icons-vue';
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
  ElProgress,
  ElRadio,
  ElRadioGroup,
  type FormInstance
} from 'element-plus';
import screenFull from 'screenfull';
import ChartLine1 from '#/views/genchuan/industry/templatesstatchart/ChartLine1.vue';
import ChartLine2 from '#/views/genchuan/industry/templatesstatchart/ChartLine2.vue';
import ChartPie1 from '#/views/genchuan/industry/templatesstatchart/ChartPie1.vue';
import ChartPie2 from '#/views/genchuan/industry/templatesstatchart/ChartPie2.vue';
import ChartPie3 from '#/views/genchuan/industry/templatesstatchart/ChartPie3.vue';
import ChartPie4 from '#/views/genchuan/industry/templatesstatchart/ChartPie4.vue';
import VerticalBar2 from '#/views/genchuan/industry/templatesstatchart/VerticalBar2.vue';
import VerticalBar3 from '#/views/genchuan/industry/templatesstatchart/VerticalBar3.vue';
import VerticalBar4 from '#/views/genchuan/industry/templatesstatchart/VerticalBar4.vue';
import EmergencyResponseMap1 from './EmergencyResponseMap1.vue';
import EmergencyResponseMap2 from './EmergencyResponseMap2.vue';
import EmergencyResponseMap3 from './EmergencyResponseMap3.vue';
import EmergencyResponseMap4 from './EmergencyResponseMap4.vue';
import DotAnimationMap from './DotAnimationMap.vue';

import {
  fetchEmergencySituationMap, fetchEmergencyResourceDistributionMap, fetchSpecialEmergencyViewMap,
  fetchDispatchTaskList, fetchDispatchTaskIndicators, fetchDispatchTaskReceiverCompare,
  fetchDisposalProgressList, fetchDisposalProgressIndicators, fetchDisposalProgressTrend,
  fetchEmergencyPlanList, fetchEmergencyPlanIndicators, fetchEmergencyPlanTypeRatio,
  fetchEmergencySituationIndicators, fetchEmergencyTypeRatio, fetchEmergencyLevelRatio,
  fetchEmergencyResourceTypeCompare, fetchEmergencyResourceDeptCompare, fetchEmergencyResourceStatusRatio,
  fetchSceneSituationList,
  fetchSceneSituationDetail,
  contactScenePerson,
  submitDisposalInstruction,
  fetchSceneSituationIndicators,
  fetchSceneDisposalEffectCompare,
  fetchEmergencySituationList,
  fetchEmergencySituationDetail,
  dispatchEmergencyResource,
  fetchResourceDistributionList,
  fetchResourceDetail,
  dispatchResource,
  contactResourcePerson,
  fetchResourceDistributionIndicators,
  fetchSpecialEmergencyList,
  fetchSpecialEmergencyDetail,
  updateDisposalProgress,
  saveDisposalAssessment,
  fetchSpecialEmergencyIndicators,
  fetchSpecialEmergencyDisposalTrend,
  fetchDispatchPathMap,
  fetchResourceDispatchList,
  fetchResourceDispatchDetail,
  confirmResourceDispatch,
  feedbackResourceDispatch,
  fetchResourceDispatchIndicators,
  fetchResourceDispatchTypeCompare,
  fetchCooperationList,
  fetchCooperationDetail,
  respondToCooperation,
  feedbackCooperation,
  fetchCooperationIndicators,
  fetchCooperationTypeCompare,
  fetchCooperationDeptCompare,
  fetchCooperationTypeRatio,
  fetchCooperationStatusRatio,
} from '#/api/genchuan/industry/parkingmgmt/overview/EmergencyResponse.ts';


const pageContainerRef = ref<HTMLElement | null>(null);
const router = useRouter();
const instance = getCurrentInstance();
const currentFullscreenPanel = ref<HTMLElement | null>(null);

// 地图加载状态
const map1Loading = ref<boolean>(true);
const map2Loading = ref<boolean>(true);
const map3Loading = ref<boolean>(true);
const map4Loading = ref<boolean>(true); // 对应EmergencyResponseMap4（调度路径）
const dotMapLoading = ref<boolean>(true);

const topMainChartRefreshKey = ref<number>(0);
// 标签页激活状态
const topLeftActiveTab = ref<string>('tab1');
const topMiddleActiveTab = ref<string>('tab1');
const topRightActiveTab = ref<string>('tab1');
const bottomMiddleActiveTab = ref<string>('tab1');

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
const initDispatchTaskNumberAnimations = () => {
  document.querySelectorAll<HTMLElement>('.dispatch-task-number-animate').forEach((el) =>
    animateValue(el, 0, Number.parseFloat(el.dataset.value || '0'), 1500)
  );
};
const initDisposalProgressNumberAnimations = () => {
  document.querySelectorAll<HTMLElement>('.disposal-progress-number-animate').forEach((el) =>
    animateValue(el, 0, Number.parseFloat(el.dataset.value || '0'), 1500)
  );
};
const initEmergencyPlanNumberAnimations = () => {
  document.querySelectorAll<HTMLElement>('.emergency-plan-number-animate').forEach((el) =>
    animateValue(el, 0, Number.parseFloat(el.dataset.value || '0'), 1500)
  );
};
const initCooperationNumberAnimations = () => {
  document.querySelectorAll<HTMLElement>('.cooperation-number-animate').forEach((el) =>
    animateValue(el, 0, Number.parseFloat(el.dataset.value || '0'), 1500)
  );
};

// 时间戳格式化方法
const formatTimeStamp = (timeStamp: number | null | undefined) => {
  if (!timeStamp) return '-';
  const d = new Date(Number(timeStamp));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
// 格式化时长（分钟）
const formatDuration = (val: number | null | undefined) => val ? `${val} 分钟` : '-';

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
  // 进入全屏时：延迟刷新当前文件的图表
  if (screenFull.isFullscreen) {
    setTimeout(() => {
      topMainChartRefreshKey.value++;
      dispatchTaskChartRefreshKey.value++;
      emergencyPlanChartRefreshKey.value++;
      disposalProgressChartRefreshKey.value++;
      cooperationChartRefreshKey.value++;
      emergencySituationChartRefreshKey.value++;
      resourceDistributionChartRefreshKey.value++;
      specialEmergencyChartRefreshKey.value++;
      resourceDispatchChartRefreshKey.value++;
      sceneSituationChartRefreshKey.value++;
    }, 300);
  }
  // 退出全屏时：重置面板样式 + 刷新图表 + 清空当前全屏面板
  else {
    currentFullscreenPanel.value.style = '';
    nextTick(() => {
      topMainChartRefreshKey.value++;
      dispatchTaskChartRefreshKey.value++;
      emergencyPlanChartRefreshKey.value++;
      disposalProgressChartRefreshKey.value++;
      cooperationChartRefreshKey.value++;
      emergencySituationChartRefreshKey.value++;
      resourceDistributionChartRefreshKey.value++;
      specialEmergencyChartRefreshKey.value++;
      resourceDispatchChartRefreshKey.value++;
      sceneSituationChartRefreshKey.value++;
    });
    currentFullscreenPanel.value = null;
  }
};

const handleTabChange = () => {
  nextTick(() => {
    setTimeout(() => {
      topMainChartRefreshKey.value += 1;
      dispatchTaskChartRefreshKey.value += 1;
      emergencyPlanChartRefreshKey.value += 1;
      disposalProgressChartRefreshKey.value += 1;
      cooperationChartRefreshKey.value += 1;
      emergencySituationChartRefreshKey.value++;
      resourceDistributionChartRefreshKey.value++;
      specialEmergencyChartRefreshKey.value++;
      resourceDispatchChartRefreshKey.value++;
      sceneSituationChartRefreshKey.value++;
    }, 100);
  });
};

// 地图组件引用
const emergencyMap1Ref = ref<InstanceType<typeof EmergencyResponseMap1> | null>(null);
const emergencyMap2Ref = ref<InstanceType<typeof EmergencyResponseMap2> | null>(null);
const emergencyMap3Ref = ref<InstanceType<typeof EmergencyResponseMap3> | null>(null);
const emergencyMap4Ref = ref<InstanceType<typeof EmergencyResponseMap4> | null>(null);
// 地图数据
const emergencySituationData = ref<EmergencySituationItem[]>([]);
const emergencyResourceData = ref<EmergencySituationItem[]>([]);
const specialEmergencyData = ref<EmergencySituationItem[]>([]);
const dispatchPathData = ref<DispatchPathItem[]>([]);
// 地图环绕配置相关
// 获取本地存储的地图环绕配置
const getStoredOrbitConfig = (): OrbitConfig => {
  const stored = localStorage.getItem('parkingMapOrbitConfig');
  if (stored) {
    try { return JSON.parse(stored) as OrbitConfig; }
    catch (error) {
      console.warn('读取本地存储的地图配置失败，使用默认值:', error);
    }
  }
  return { center: { lat: 24.58, lng: 117.65 }, rotateSpeed: 0.05, pitch: 40, zoom: 16, loop: true };
};
// 保存地图环绕配置到本地存储
const saveOrbitConfigToLocal = (config: OrbitConfig) => {
  try { localStorage.setItem('parkingMapOrbitConfig', JSON.stringify(config)); }
  catch (error) {
    console.error('保存地图配置失败:', error);
    ElMessage.warning('配置暂无法持久化，刷新后恢复默认值');
  }
};
// 地图配置弹窗显隐状态
const orbitConfigDialogVisible = ref<boolean>(false);
const orbitConfigFormRef = ref<InstanceType<typeof ElForm> | null>(null);
const orbitConfigForm = ref<OrbitConfigForm>({
  centerLat: getStoredOrbitConfig().center.lat,
  centerLng: getStoredOrbitConfig().center.lng,
  rotateSpeed: getStoredOrbitConfig().rotateSpeed,
  pitch: getStoredOrbitConfig().pitch,
  zoom: getStoredOrbitConfig().zoom,
  loop: getStoredOrbitConfig().loop,
});
// 地图配置表单校验规则
const orbitConfigRules = ref({
  centerLat: [{ required: true, type: 'number', min: -90, max: 90, message: '请输入有效的纬度（-90~90）', trigger: 'blur' }],
  centerLng: [{ required: true, type: 'number', min: -180, max: 180, message: '请输入有效的经度（-180~180）', trigger: 'blur' }],
  rotateSpeed: [{ required: true, type: 'number', min: 0.01, message: '旋转速度不能小于0.01', trigger: 'blur' }],
  pitch: [{ required: true, type: 'number', min: 0, max: 80, message: '俯仰角范围0~80', trigger: 'blur' }],
  zoom: [{ required: true, type: 'number', min: 1, max: 20, message: '缩放级别范围1~20', trigger: 'blur' }],
});
// 地图环绕配置数据
const orbitConfigData = ref<OrbitConfig>(getStoredOrbitConfig());
// 应急态势地图环绕动画切换
const handleOrbitAnimation1 = () => {
  if (emergencyMap1Ref.value && typeof emergencyMap1Ref.value.toggleOrbitAnimation === 'function')
    emergencyMap1Ref.value.toggleOrbitAnimation();
  else
    ElMessage.warning('应急态势地图环绕功能暂未初始化完成');
};
// 资源分布地图环绕动画切换
const handleOrbitAnimation2 = () => {
  const targetRef = emergencyMap2Ref.value;
  if (targetRef && typeof targetRef.toggleOrbitAnimation === 'function')
    targetRef.toggleOrbitAnimation();
  else
    ElMessage.warning('资源分布地图环绕功能暂未初始化完成');
};
// 专项应急地图环绕动画切换
const handleOrbitAnimation3 = () => {
  const targetRef = emergencyMap3Ref.value;
  if (targetRef && typeof targetRef.toggleOrbitAnimation === 'function')
    targetRef.toggleOrbitAnimation();
  else
    ElMessage.warning('专项应急地图环绕功能暂未初始化完成');
};
// 调度路径地图环绕动画切换
const handleOrbitAnimation4 = () => {
  const targetRef = emergencyMap4Ref.value;
  if (targetRef && typeof targetRef.toggleOrbitAnimation === 'function')
    targetRef.toggleOrbitAnimation();
  else
    ElMessage.warning('调度路径地图环绕功能暂未初始化完成');
};
// 重置地图配置表单
const resetOrbitConfigForm = () => {
  orbitConfigFormRef.value?.resetFields();
  const currentConfig = getStoredOrbitConfig();
  orbitConfigForm.value = {
    centerLat: currentConfig.center.lat,
    centerLng: currentConfig.center.lng,
    rotateSpeed: currentConfig.rotateSpeed,
    pitch: currentConfig.pitch,
    zoom: currentConfig.zoom,
    loop: currentConfig.loop
  };
};
// 提交地图环绕配置
const submitOrbitConfig = async () => {
  try {
    await orbitConfigFormRef.value?.validate();
    const newConfig: OrbitConfig = {
      center: { lat: orbitConfigForm.value.centerLat, lng: orbitConfigForm.value.centerLng },
      rotateSpeed: orbitConfigForm.value.rotateSpeed,
      pitch: orbitConfigForm.value.pitch,
      zoom: orbitConfigForm.value.zoom,
      loop: orbitConfigForm.value.loop
    };
    orbitConfigData.value = newConfig;
    saveOrbitConfigToLocal(newConfig);
    [emergencyMap1Ref.value, emergencyMap2Ref.value, emergencyMap3Ref.value, emergencyMap4Ref.value].forEach(ref => {
      ref && (ref.stopOrbitAnimation(), ref.startOrbitAnimation());
    });
    orbitConfigDialogVisible.value = false;
    ElMessage.success('地图环绕配置已生效（已持久化，刷新不丢失）');
  } catch {
    ElMessage.error('配置校验失败，请检查输入');
  }
};
// 恢复地图默认配置
const resetToDefaultConfig = () => {
  const defaultConfig: OrbitConfig = { center: { lat: 24.58, lng: 117.65 }, rotateSpeed: 0.05, pitch: 40, zoom: 16, loop: true };
  orbitConfigData.value = defaultConfig;
  orbitConfigForm.value = {
    centerLat: defaultConfig.center.lat,
    centerLng: defaultConfig.center.lng,
    rotateSpeed: defaultConfig.rotateSpeed,
    pitch: defaultConfig.pitch,
    zoom: defaultConfig.zoom,
    loop: defaultConfig.loop
  };
  localStorage.removeItem('parkingMapOrbitConfig');
  [emergencyMap1Ref.value, emergencyMap2Ref.value, emergencyMap3Ref.value, emergencyMap4Ref.value].forEach(ref => {
    ref && (ref.stopOrbitAnimation(), ref.startOrbitAnimation());
  });
  ElMessage.success('已恢复默认配置');
};
// 初始化所有地图数据
const initAllMapData = async () => {
  try {
    emergencySituationData.value = await fetchEmergencySituationMap({});
    emergencyResourceData.value = await fetchEmergencyResourceDistributionMap({});
    specialEmergencyData.value = await fetchSpecialEmergencyViewMap({});
    dispatchPathData.value = await fetchDispatchPathMap({});

    await Promise.all([
      getEmergencySituationIndicatorData(),
      getEmergencyTypeRatioData(),
      getEmergencyLevelRatioData(),
      getResourceTypeCompareData(),
      getResourceDeptCompareData(),
      getResourceStatusRatioData(),
      getSpecialEmergencyIndicatorData(),
      getSpecialEmergencyTrendData()
    ]);

    map1Loading.value = false;
    map2Loading.value = false;
    map3Loading.value = false;
    map4Loading.value = false;
    dotMapLoading.value = false;
  } catch (error) {
    console.error('地图数据加载失败：', error);
    ElMessage.error('地图数据加载失败，请刷新重试');
    emergencySituationData.value = [];
    emergencyResourceData.value = [];
    specialEmergencyData.value = [];
    dispatchPathData.value = [];
    map1Loading.value = false;
    map2Loading.value = false;
    map3Loading.value = false;
    map4Loading.value = false;
    dotMapLoading.value = false;
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

// 地图环绕配置类型
interface OrbitConfig {
  center: {
    lat: number;
    lng: number;
  };
  rotateSpeed: number; // 旋转速度（度/帧）
  pitch: number; // 地图俯仰角
  zoom: number; // 地图缩放级别
  loop: boolean; // 是否循环旋转
}
interface OrbitConfigForm {
  centerLat: number; // 旋转中心点纬度
  centerLng: number; // 旋转中心点经度
  rotateSpeed: number; // 旋转速度（度/帧）
  pitch: number; // 地图俯仰角
  zoom: number; // 地图缩放级别
  loop: boolean; // 是否循环旋转
}

// 应急态势TS类型定义
interface EmergencySituationRow {
  taskEmergencyEmergencyId: string;
  sysEmergencyLevelName: string;
  sysEmergencyTypeName: string;
  taskEmergencyEmergencyTime: number;
  tbAssetExtendAddress: string;
  taskEmergencyAffectedVehicleCount: number;
  sysRescueProgressName: string;
}
interface EmergencySituationDetail {
  taskEmergencyEmergencyId: string;
  sysEmergencyLevelName: string;
  sysEmergencyTypeName: string;
  taskEmergencyEmergencyTime: 0;
  tbAssetExtendAddress: string;
  taskEmergencyAffectedVehicleCount: 0;
  sysRescueProgressName: string;
  // 弹窗展示字段
  tbAssetExtendName: string;
  taskEmergencyInfluenceRange: string;
  taskEmergencyResponseTime: 0;
  sysMaintainUserTeamName: string;
  // 事件详情
  eventDetail: {
    description: string;
    cause: string;
    severity: string;
    impactTime: string;
  };
  // 现场图片
  scenePhotos: string[];
  // 影响范围分析
  influenceAnalysis: {
    affectedParkingCount: number;
    affectedVehicleCount: number;
    estimatedLoss: string;
    trafficImpact: string;
    expectedRecoveryTime: string;
  };
  // 调度信息
  dispatchInfo: {
    dispatchedResources: {
      type: string;
      count: number;
      status: string;
    }[];
    cooperatingUnits: string[];
    coordinationMeasures: string;
  };
  // 救援进度
  rescueProgress: {
    currentStage: string;
    progressPercentage: number;
    completedTasks: string[];
    pendingTasks: string[];
    nextStep: string;
  };
}
interface DispatchForm {
  resourceType: string;
  resourceCount: number;
  urgencyLevel: string;
  instructions?: string;
  cooperatingUnits: string[];
}
interface EmergencySituationIndicators {
  totalEmergencyCount: number; // 应急事件总数
  levelEmergencyCount: {
    level1: number; // 一级应急事件数
    level2: number; // 二级应急事件数
    level3: number; // 三级应急事件数
    level4: number; // 四级应急事件数
  }; // 各等级应急数
  affectedVehicleTotal: number; // 受影响车辆数
}
interface EmergencySituationItem {
  // 贴合接口返回的地理数据结构，仅示例（可根据实际接口调整）
  id: string;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  type: string; // 应急事件类型
  level: string; // 应急事件等级
  status: string; // 应急事件状态
}

// 资源分布TS类型定义
interface ResourceDistributionRow {
  taskEmergencyResourceResourceId: string;
  sysResourceTypeName: string;
  taskEmergencyResourceResourceName: string;
  tbAssetExtendAddress: string;
  sysResourceStatusName: string;
  sysDeptDeptName: string;
}
interface ResourceDetail {
  taskEmergencyResourceResourceId: string;
  sysResourceTypeName: string;
  taskEmergencyResourceResourceName: string;
  tbAssetExtendAddress: string;
  sysResourceStatusName: string;
  sysDeptDeptName: string;
  // 弹窗展示字段
  taskEmergencyResourceQuantity: number;
  sysUserUserName: string;
  sysUserUserPhone: string;
  distanceToTarget: string;
  // 资源详情
  resourceDetail: {
    manufacturer: string;
    purchaseDate: number;
    warrantyPeriod: string;
    specifications: string;
    maintenanceRecord: string;
  };
  // 库存明细
  inventoryDetails: {
    itemId: string;
    itemName: string;
    quantity: number;
    status: string;
  }[];
  // 使用记录
  usageRecords: {
    time: number;
    eventId: string;
    duration: string;
    operator: string;
  }[];
}
interface ResourceDistributionIndicators {
  standbyCount: number; // 待命资源数
  inUseCount: number; // 使用中资源数
  underMaintenanceCount: number; // 维修中资源数
}
interface DispatchResourceForm {
  instruction?: string;
  estimatedArrivalTime: string;
}

// 专项应急TS类型定义
interface SpecialEmergencyRow {
  taskSpecialEmergencySpecialEmergencyId: string; // 专项应急ID
  sysEmergencyScenarioName: string; // 应急场景
  taskSpecialEmergencyTrappedVehicleCount: number; // 受困车辆数
  taskSpecialEmergencyEvacuationRoute: string; // 疏散通道
  tbAssetExtendAddress: string; // 安全出口
  sysDisposalProgressName: string; // 处置进度
}
interface SpecialEmergencyDetail {
  taskSpecialEmergencySpecialEmergencyId: string;
  sysEmergencyScenarioName: string;
  taskSpecialEmergencyTrappedVehicleCount: number;
  taskSpecialEmergencyEvacuationRoute: string;
  tbAssetExtendAddress: string;
  sysDisposalProgressName: string;
  // 弹窗展示字段
  taskSpecialEmergencyEvacuationProgress: number; // 疏散进度
  parkFaultRepairProgress: number; // 抢修进度
  sysUserUserName: string; // 现场负责人
  taskSpecialEmergencyExpectedFinishTime: number; // 预计完成时间
  // 详情信息
  disposalPlan: string; // 处置方案
  evacuationRoute: Array<{ // 疏散路线
    name: string;
    status: string;
    distance: string;
  }>;
  safetyExitDistribution: Array<{ // 安全出口分布
    name: string;
    location: string;
    capacity: string;
  }>;
}
interface SpecialEmergencyIndicators {
  trappedVehicleTotal: number; // 受困车辆数
  evacuatedVehicleCount: number; // 已疏散车辆数
  repairedDeviceCount: number; // 已修复设备数
}

// 资源调度TS类型定义
interface ResourceDispatchRow {
  taskResourceDispatchDispatchRecordId: string; // 调度记录ID
  taskEmergencyResourceResourceId: string; // 资源ID
  sysResourceTypeName: string; // 资源类型
  taskResourceDispatchDispatchQuantity: number; // 调配数量
  fromAddress: string; // 调出位置
  toAddress: string; // 调入位置
  sysDispatchStatusName: string; // 调度状态
  taskResourceDispatchDispatchTime: number | null; // 调度时间
  taskResourceDispatchEstimatedArrivalTime: number | null; // 预计到达时间
  taskResourceDispatchActualArrivalTime: number | null; // 实际到达时间
  sysUserUserName: string; // 接收人
}
interface ResourceDispatchDetail {
  taskResourceDispatchDispatchRecordId: string;
  taskEmergencyResourceResourceId: string;
  sysResourceTypeName: string;
  taskResourceDispatchDispatchQuantity: number;
  fromAddress: string;
  toAddress: string;
  sysDispatchStatusName: string;
  taskResourceDispatchDispatchTime: number | null;
  taskResourceDispatchEstimatedArrivalTime: number | null;
  taskResourceDispatchActualArrivalTime: number | null;
  sysUserUserName: string;
  // 弹窗展示字段
  resourceDetails: {
    name: string;
    model: string;
    quantity: number;
    status: string;
  }[];
  dispatchInstruction: string;
  dispatchTrack: {
    time: number;
    location: string;
    action: string;
  }[];
}
interface ResourceDispatchIndicators {
  transitingCount: number; // 在途资源数
  deliveredCount: number; // 已送达资源数
  abnormalCount: number; // 异常资源数
}
interface DispatchConfirmData {
  confirmNote: string; // 必填，标星
  receiveOpinion: string; // 可选
}
interface DispatchFeedbackData {
  feedbackContent: string; // 可选
}
interface DispatchPathItem {
  taskResourceDispatchDispatchRecordId: string; // 调度记录ID
  taskEmergencyResourceResourceId: string; // 资源ID
  sysResourceTypeName: string; // 资源类型
  taskResourceDispatchDispatchQuantity: number; // 调配数量
  tbAssetExtendAddress: string; // 调出/调入位置
  sysDispatchStatusName: string; // 调度状态
  taskResourceDispatchEstimatedArrivalTime: string | null; // 预计到达时间
  taskResourceDispatchActualArrivalTime: string | null; // 实际到达时间
  sysUserUserName: string; // 接收人
  startLongitude: number; // 起点经度
  startLatitude: number; // 起点纬度
  endLongitude: number; // 终点经度
  endLatitude: number; // 终点纬度
}

// 现场态势TS类型定义
interface SceneSituationRow {
  taskEmergencyEmergencyId: string;
  tbAssetExtendAddress: string;
  taskEmergencySceneSceneStatus: string;
  taskEmergencySceneAffectedBerthCount: number;
  taskEmergencySceneEvacuatedVehicleCount: number;
  taskEmergencySceneRepairBerthCount: number;
}
interface SceneSituationDetail {
  taskEmergencyEmergencyId: string;
  tbAssetExtendAddress: string;
  taskEmergencySceneSceneStatus: string;
  taskEmergencySceneAffectedBerthCount: number;
  taskEmergencySceneEvacuatedVehicleCount: number;
  taskEmergencySceneRepairBerthCount: number;
  // 弹窗展示字段
  sysUserUserName: string;
  sysUserUserPhone: string;
  taskEmergencySceneScenePhotos: string[];
  taskEmergencySceneDisposalSuggestion: string;
  // 现场完整态势
  sceneOverview: {
    affectedRange: string;
    startTime: number;
    emergencyLevel: string;
    weatherCondition: string;
    temperature: string;
    windSpeed: string;
  };
  // 实时数据
  realtimeData: {
    currentEvacuatedCount: number;
    currentRepairCount: number;
    remainingAffectedCount: number;
    evacuationProgress: number;
    repairProgress: number;
    currentPersonnelCount: number;
  };
  // 处置进展
  disposalProgress: {
    time: number;
    action: string;
    status: string;
  }[];
}
interface SceneSituationIndicators {
  evacuatedVehicleCount: number; // 已疏导车辆数
  repairBerthCount: number; // 已修复泊位数
  affectedRange: string; // 受影响范围
}

// 调度任务TS类型定义
interface DispatchTaskIndicators {
  pendingCount: number; // 待执行任务数
  executingCount: number; // 执行中任务数
  completedCount: number; // 已完成任务数
}
interface DispatchTaskRow {
  dispatchTaskId: string; // 调度任务ID
  taskContent: string; // 任务内容
  dispatchType: string; // 调度类型
  resourceId: string; // 资源ID
  address: string; // 目标位置
  userId: string; // 调度人ID
  maintainUserId: string; // 接收人ID
  taskStatus: string; // 任务状态
  dispatchTime: number | null; // 调度时间
  completeTime: number | null; // 完成时间
}

// 处置进度TS类型定义
interface DisposalProgressIndicators {
  avgAlarmDuration: number; // 平均接警时长
  avgReceiveDuration: number; // 平均接收时长
  avgArriveDuration: number; // 平均到场时长
  avgDisposeDuration: number; // 平均处置时长
  avgCloseDuration: number; // 平均结案时长
  timeoutDisposalCount: number; // 超时处置数
}
interface DisposalProgressRow {
  emergencyId: string; // 应急事件ID
  disposalStage: string; // 处置阶段
  stageStartTime: number | null; // 阶段开始时间
  stageEndTime: number | null; // 阶段结束时间
  responsibleUnit: string; // 责任单位
  disposalMeasure: string; // 处置措施
  arrivalDuration: number | null; // 到场时长
  disposalDuration: number | null; // 处置时长
}

// 应急方案TS类型定义
interface EmergencyPlanIndicators {
  launchedCount: number; // 已启动方案数
  executingCount: number; // 执行中方案数
}
interface EmergencyPlanRow {
  emergency_plan_id: string; // 应急方案ID
  plan_name: string; // 方案名称
  emergency_type: string; // 适配应急类型
  execution_step: string; // 执行步骤
  responsibility_division: string; // 责任分工
  resource_demand: string; // 资源需求
  plan_status: string; // 方案状态
  launch_time: number | null; // 启动时间
}

// 协同指挥TS类型定义
interface CooperationIndicators {
  totalCooperationCount: number; // 协同事件总数
  responseRate: number; // 响应率
  effectStandardCount: number; // 配合成效达标数
}
interface CooperationRow {
  taskCooperationCooperationId: string; // 协同ID
  sysCooperationTypeName: string; // 协同类型
  taskCooperationTaskContent: string; // 协同任务
  sysDeptDeptName: string; // 参与单位
  taskCooperationCreateTime: number | null; // 发起时间
  sysResponseStatusName: string; // 响应状态
}
interface CooperationDetail {
  taskCooperationCooperationId: string;
  sysCooperationTypeName: string;
  taskCooperationTaskContent: string;
  sysDeptDeptName: string;
  taskCooperationCreateTime: number | null;
  sysResponseStatusName: string;
  // 详情弹窗展示字段
  initiatingDept: string; // 发起单位
  cooperationLeader: string; // 协同负责人
  cooperationEffect: string; // 配合成效
  completeTime: number | null; // 完成时间
  // 参与单位
  participatingUnits: {
    deptName: string;
    contact: string;
    phone: string;
  }[];
  // 任务要求
  taskRequirements: string;
  // 反馈结果
  feedbackResults: {
    time: number;
    deptName: string;
    feedback: string;
    materials?: string[];
  }[];
}


// 应急态势响应式数据
const emergencySituationList = ref<EmergencySituationRow[]>([]);
const emergencySituationDetailSelectedRow = ref<EmergencySituationDetail>({
  taskEmergencyEmergencyId: '',
  sysEmergencyLevelName: '',
  sysEmergencyTypeName: '',
  taskEmergencyEmergencyTime: 0,
  tbAssetExtendAddress: '',
  taskEmergencyAffectedVehicleCount: 0,
  sysRescueProgressName: '',
  tbAssetExtendName: '',
  taskEmergencyInfluenceRange: '',
  taskEmergencyResponseTime: 0,
  sysMaintainUserTeamName: '',
  eventDetail: {
    description: '',
    cause: '',
    severity: '',
    impactTime: '',
  },
  scenePhotos: [],
  influenceAnalysis: {
    affectedParkingCount: 0,
    affectedVehicleCount: 0,
    estimatedLoss: '',
    trafficImpact: '',
    expectedRecoveryTime: '',
  },
  dispatchInfo: {
    dispatchedResources: [],
    cooperatingUnits: [],
    coordinationMeasures: '',
  },
  rescueProgress: {
    currentStage: '',
    progressPercentage: 0,
    completedTasks: [],
    pendingTasks: [],
    nextStep: '',
  },
});
const dispatchForm = ref<DispatchForm>({
  resourceType: '维修人员',
  resourceCount: 1,
  urgencyLevel: '一般',
  instructions: '',
  cooperatingUnits: ['交警支队'],
});
const dispatchFormRules = {
  resourceType: [{ required: true, message: '请选择资源类型', trigger: 'change' }],
  resourceCount: [
    { required: true, message: '请输入资源数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '资源数量至少为1', trigger: 'blur' }
  ],
  urgencyLevel: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
  cooperatingUnits: [{ required: true, message: '请至少选择一个协同单位', trigger: 'change' }],
};
// 应急态势视图切换相关
const emergencySituationChartRefreshKey = ref(0);
const activeEmergencySituationView = ref('地图');
const emergencySituationViewBtnList = ref(['地图', '列表']);
// 应急态势弹窗相关
const emergencySituationDetailDialogVisible = ref(false);
const emergencySituationDispatchDialogVisible = ref(false);
const activeEmergencySituationDetailView = ref('事件详情');
const emergencySituationDetailViewBtnList = ref(['事件详情', '影响分析', '调度信息', '救援进度']);
const dispatchFormRef = ref<FormInstance>();
const emergencySituationIndicatorData = ref<EmergencySituationIndicators>({
  totalEmergencyCount: 0,
  levelEmergencyCount: { level1:0, level2:0, level3:0, level4:0 },
  affectedVehicleTotal: 0
});
const emergencyTypeRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '应急事件类型占比', data: [] }]
});
const emergencyLevelRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '应急事件等级占比', data: [] }]
});

// 资源分布响应式数据
const resourceDistributionList = ref<ResourceDistributionRow[]>([]);
const resourceDetailSelectedRow = ref<ResourceDetail>({
  taskEmergencyResourceResourceId: '',
  sysResourceTypeName: '',
  taskEmergencyResourceResourceName: '',
  tbAssetExtendAddress: '',
  sysResourceStatusName: '',
  sysDeptDeptName: '',
  taskEmergencyResourceQuantity: 0,
  sysUserUserName: '',
  sysUserUserPhone: '',
  distanceToTarget: '',
  resourceDetail: {
    manufacturer: '',
    purchaseDate: 0,
    warrantyPeriod: '',
    specifications: '',
    maintenanceRecord: '',
  },
  inventoryDetails: [],
  usageRecords: []
});
const resourceDistributionIndicators = ref<ResourceDistributionIndicators>({
  standbyCount: 0,
  inUseCount: 0,
  underMaintenanceCount: 0
});
// 资源分布视图切换相关
const resourceDistributionChartRefreshKey = ref(0);
const activeResourceDistributionView = ref('地图');
const resourceDistributionViewBtnList = ref(['地图', '列表']);
// 资源分布弹窗相关
const resourceDetailDialogVisible = ref(false);
const resourceDispatchDialogVisible = ref(false);
const activeResourceDetailView = ref('资源详情');
const resourceDetailViewBtnList = ref(['资源详情', '库存明细', '使用记录']);
// 资源调度表单
const dispatchResourceForm = ref<DispatchResourceForm>({
  instruction: '',
  estimatedArrivalTime: ''
});
const dispatchResourceFormRules = ref({
  estimatedArrivalTime: [
    { required: true, message: '请选择预计送达时间', trigger: 'change' }
  ]
});
const resourceTypeCompareData = ref<ChartBarData>({ xAxis: [], series: [] });
const resourceDeptCompareData = ref<ChartBarData>({ xAxis: [], series: [] });
const resourceStatusRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '应急资源状态占比', data: [] }]
});

// 专项应急响应式数据
const specialEmergencyList = ref<SpecialEmergencyRow[]>([]);
const specialEmergencyDetailSelectedRow = ref<SpecialEmergencyDetail>({
  taskSpecialEmergencySpecialEmergencyId: '',
  sysEmergencyScenarioName: '',
  taskSpecialEmergencyTrappedVehicleCount: 0,
  taskSpecialEmergencyEvacuationRoute: '',
  tbAssetExtendAddress: '',
  sysDisposalProgressName: '',
  taskSpecialEmergencyEvacuationProgress: 0,
  parkFaultRepairProgress: 0,
  sysUserUserName: '',
  taskSpecialEmergencyExpectedFinishTime: 0,
  disposalPlan: '',
  evacuationRoute: [],
  safetyExitDistribution: []
});
// 专项应急视图切换相关
const specialEmergencyChartRefreshKey = ref(0);
const activeSpecialEmergencyView = ref('地图');
const specialEmergencyViewBtnList = ref(['地图', '列表']);
// 专项应急弹窗相关
const specialEmergencyDetailDialogVisible = ref(false);
const updateProgressDialogVisible = ref(false);
const assessmentDialogVisible = ref(false);
const activeSpecialEmergencyDetailView = ref('专项应急详情');
const specialEmergencyDetailViewBtnList = ref(['专项应急详情', '处置方案', '疏散路线', '安全出口分布']);
// 更新进度表单
const updateProgressForm = ref({
  progress: '',
  remark: ''
});
// 评估表单
const assessmentForm = ref({
  assessment: '',
  reportUrl: ''
});
const specialEmergencyIndicatorData = ref<SpecialEmergencyIndicators>({
  trappedVehicleTotal: 0,
  evacuatedVehicleCount: 0,
  repairedDeviceCount: 0
});
const specialEmergencyTrendData = ref<ChartLineData>({ xAxis: [], series: [] });

// 资源调度响应式数据
const resourceDispatchList = ref<ResourceDispatchRow[]>([]);
const resourceDispatchDetailSelectedRow = ref<ResourceDispatchDetail>({
  taskResourceDispatchDispatchRecordId: '',
  taskEmergencyResourceResourceId: '',
  sysResourceTypeName: '',
  taskResourceDispatchDispatchQuantity: 0,
  fromAddress: '',
  toAddress: '',
  sysDispatchStatusName: '',
  taskResourceDispatchDispatchTime: null,
  taskResourceDispatchEstimatedArrivalTime: null,
  taskResourceDispatchActualArrivalTime: null,
  sysUserUserName: '',
  resourceDetails: [],
  dispatchInstruction: '',
  dispatchTrack: [],
});
const resourceDispatchIndicators = ref<ResourceDispatchIndicators>({
  transitingCount: 0,
  deliveredCount: 0,
  abnormalCount: 0,
});
const resourceDispatchTypeCompareData = ref<ChartBarData>({ xAxis: [], series: [] });
// 资源调度视图切换相关
const resourceDispatchChartRefreshKey = ref(0);
const activeResourceDispatchView = ref('地图');
const resourceDispatchViewBtnList = ref(['地图', '列表']);
// 资源调度弹窗相关
const resourceDispatchDetailDialogVisible = ref(false);
const dispatchFeedbackDialogVisible = ref(false);
const dispatchFeedbackForm = ref<DispatchFeedbackData>({ feedbackContent: '' });

// 现场态势响应式数据
const sceneSituationList = ref<SceneSituationRow[]>([]);
const sceneSituationDetailSelectedRow = ref<SceneSituationDetail>({
  taskEmergencyEmergencyId: '',
  tbAssetExtendAddress: '',
  taskEmergencySceneSceneStatus: '',
  taskEmergencySceneAffectedBerthCount: 0,
  taskEmergencySceneEvacuatedVehicleCount: 0,
  taskEmergencySceneRepairBerthCount: 0,
  sysUserUserName: '',
  sysUserUserPhone: '',
  taskEmergencySceneScenePhotos: [],
  taskEmergencySceneDisposalSuggestion: '',
  sceneOverview: {
    affectedRange: '',
    startTime: 0,
    emergencyLevel: '',
    weatherCondition: '',
    temperature: '',
    windSpeed: '',
  },
  realtimeData: {
    currentEvacuatedCount: 0,
    currentRepairCount: 0,
    remainingAffectedCount: 0,
    evacuationProgress: 0,
    repairProgress: 0,
    currentPersonnelCount: 0,
  },
  disposalProgress: []
});
const sceneSituationIndicators = ref<SceneSituationIndicators>({
  evacuatedVehicleCount: 0,
  repairBerthCount: 0,
  affectedRange: ''
});
const sceneDisposalEffectCompareData = ref<ChartBarData>({ xAxis: [], series: [] });
const sceneSituationBaseFontScale = ref<number>(1);
// 现场态势视图切换相关
const sceneSituationChartRefreshKey = ref(0);
const activeSceneSituationView = ref('列表');
const sceneSituationViewBtnList = ref(['列表', '地图']);
// 现场态势弹窗相关
const sceneSituationDetailDialogVisible = ref(false);
const scenePhotoDialogVisible = ref(false);
const selectedPhotoUrl = ref('');
const activeSceneSituationDetailView = ref('现场态势');
const sceneSituationDetailViewBtnList = ref(['现场态势', '实时数据', '处置进展']);
const disposalInstructionOptions = ref([
  { label: '加快车辆疏导，扩大疏散范围', value: '加快车辆疏导，扩大疏散范围' },
  { label: '增派维修人员，优先修复核心泊位', value: '增派维修人员，优先修复核心泊位' },
  { label: '现场警戒，防止无关人员进入受影响区域', value: '现场警戒，防止无关人员进入受影响区域' },
  { label: '联系周边救援力量，请求支援', value: '联系周边救援力量，请求支援' },
  { label: '自定义指令', value: 'custom' }
]);
const selectedDisposalInstruction = ref<string>(''); // 选中的指令值
const customDisposalInstruction = ref<string>(''); // 自定义指令内容

// 指挥调度响应式数据
const dispatchTaskList = ref<DispatchTaskRow[]>([]);
const dispatchTaskIndicators = ref<DispatchTaskIndicators>({
  pendingCount: 0,
  executingCount: 0,
  completedCount: 0
});
const dispatchTaskReceiverCompareData = ref<ChartBarData>({ xAxis: [], series: [] });
const dispatchTaskBaseFontScale = ref<number>(1);
const dispatchTaskActiveIndices = ref<number[]>([]);
// 指挥调度视图切换相关
const dispatchTaskChartRefreshKey = ref<number>(0);
const activeDispatchTaskView = ref<string>('柱状图');
const dispatchTaskViewBtnList = ref<string[]>(['卡片', '柱状图', '列表']);

// 处置进度响应式数据
const disposalProgressList = ref<DisposalProgressRow[]>([]);
const disposalProgressIndicators = ref<DisposalProgressIndicators>({
  avgAlarmDuration:0,
  avgReceiveDuration:0,
  avgArriveDuration:0,
  avgDisposeDuration:0,
  avgCloseDuration:0,
  timeoutDisposalCount:0
});
const disposalProgressTrendData = ref<ChartLineData>({ xAxis: [], series: [] });
const disposalProgressBaseFontScale = ref<number>(1);
const disposalProgressActiveIndices = ref<number[]>([]);
// 处置进度视图切换相关
const disposalProgressChartRefreshKey = ref<number>(0);
const activeDisposalProgressView = ref<string>('折线图');
const disposalProgressViewBtnList = ref<string[]>(['卡片', '折线图', '列表']);

// 应急方案响应式数据
const emergencyPlanList = ref<EmergencyPlanRow[]>([]);
const emergencyPlanIndicators = ref<EmergencyPlanIndicators>({
  launchedCount: 0,
  executingCount: 0
});
const emergencyPlanTypeRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '方案适配应急类型占比', data: [] }]
});
const emergencyPlanBaseFontScale = ref<number>(1);
const emergencyPlanActiveIndices = ref<number[]>([]);
// 应急方案视图切换相关
const emergencyPlanChartRefreshKey = ref<number>(0);
const activeEmergencyPlanView = ref<string>('列表');
const emergencyPlanViewBtnList = ref<string[]>(['卡片', '饼图', '列表']);

// 协同指挥响应式数据
const cooperationList = ref<CooperationRow[]>([]);
const cooperationDetailSelectedRow = ref<CooperationDetail>({
  taskCooperationCooperationId: '',
  sysCooperationTypeName: '',
  taskCooperationTaskContent: '',
  sysDeptDeptName: '',
  taskCooperationCreateTime: null,
  sysResponseStatusName: '',
  initiatingDept: '',
  cooperationLeader: '',
  cooperationEffect: '',
  completeTime: null,
  participatingUnits: [],
  taskRequirements: '',
  feedbackResults: [],
});
const cooperationIndicators = ref<CooperationIndicators>({
  totalCooperationCount: 0,
  responseRate: 0,
  effectStandardCount: 0
});
const cooperationTypeCompareData = ref<ChartBarData>({ xAxis: [], series: [] });
const cooperationDeptCompareData = ref<ChartBarData>({ xAxis: [], series: [] });
const cooperationTypeRatioData = ref<ChartRatioData>({ legend: [], series: [] });
const cooperationStatusRatioData = ref<ChartRatioData>({ legend: [], series: [] });
const cooperationBaseFontScale = ref<number>(1);
const cooperationActiveIndices = ref<number[]>([]);
// 协同指挥视图切换相关
const cooperationChartRefreshKey = ref<number>(0);
const activeCooperationView = ref<string>('卡片');
const cooperationViewBtnList = ref<string[]>(['卡片', '柱状图', '饼图', '列表']);
// 协同指挥弹窗相关
const cooperationDetailDialogVisible = ref(false);
const cooperationResponseDialogVisible = ref(false);
const cooperationFeedbackDialogVisible = ref(false);
const responseForm = ref({
  responseResult: 'accept', // 'accept' or 'reject'
  reason: '',
});
const feedbackForm = ref({
  cooperationEffect: '',
  materials: [] as File[],
});


// 应急态势接口请求方法
const getEmergencySituationListData = async () => {
  try {
    emergencySituationList.value = (await fetchEmergencySituationList()) as EmergencySituationRow[];
  } catch (error: any) {
    ElMessage.error(`应急态势列表加载失败：${error.message}`);
    emergencySituationList.value = [];
  }
};
const getEmergencySituationDetailData = async (emergencyId: string) => {
  try {
    emergencySituationDetailSelectedRow.value = {
      ...emergencySituationDetailSelectedRow.value,
      ...(await fetchEmergencySituationDetail(emergencyId)),
    };
  } catch (error: any) {
    ElMessage.warning(`应急态势详情加载失败：${error.message}`);
  }
};
const dispatchEmergencyResourceData = async () => {
  try {
    await dispatchFormRef.value?.validate();
    const res = await dispatchEmergencyResource(
      emergencySituationDetailSelectedRow.value.taskEmergencyEmergencyId,
      dispatchForm.value
    );
    if (res.success) {
      tipDialogContent.value = res.message;
      tipDialogVisible.value = true;
      emergencySituationDispatchDialogVisible.value = false;
      dispatchForm.value = {
        resourceType: '维修人员',
        resourceCount: 1,
        urgencyLevel: '一般',
        instructions: '',
        cooperatingUnits: ['交警支队'],
      };
      dispatchFormRef.value?.resetFields();
      // 刷新列表数据
      await getEmergencySituationListData();
    }
  } catch (error: any) {
    ElMessage.error(`资源调度失败：${error.message}`);
  }
};
const getEmergencySituationIndicatorData = async () => {
  try {
    emergencySituationIndicatorData.value = await fetchEmergencySituationIndicators({});
  } catch (e) {
    console.error(e);
  }
};
const getEmergencyTypeRatioData = async () => {
  try {
    emergencyTypeRatioData.value = await fetchEmergencyTypeRatio({});
  } catch (e) {
    console.error(e);
  }
};
const getEmergencyLevelRatioData = async () => {
  try {
    emergencyLevelRatioData.value = await fetchEmergencyLevelRatio({});
  } catch (e) {
    console.error(e);
  }
};

// 资源分布接口请求方法
const getResourceDistributionListData = async () => {
  try {
    resourceDistributionList.value = (await fetchResourceDistributionList()) as ResourceDistributionRow[];
  } catch (error: any) {
    ElMessage.error(`资源分布列表加载失败：${error.message}`);
    resourceDistributionList.value = [];
  }
};
const getResourceDetailData = async (resourceId: string) => {
  try {
    resourceDetailSelectedRow.value = {
      ...resourceDetailSelectedRow.value,
      ...(await fetchResourceDetail(resourceId)),
    };
  } catch (error: any) {
    ElMessage.warning(`资源详情加载失败：${error.message}`);
  }
};
const dispatchResourceData = async () => {
  try {
    const res = await dispatchResource(
      resourceDetailSelectedRow.value.taskEmergencyResourceResourceId,
      {
        instruction: dispatchResourceForm.value.instruction,
        estimatedArrivalTime: dispatchResourceForm.value.estimatedArrivalTime
      }
    );
    if (res.success) {
      tipDialogContent.value = res.message;
      tipDialogVisible.value = true;
      // 关闭弹窗
      resourceDispatchDialogVisible.value = false;
      // 重置表单
      dispatchResourceForm.value = {
        instruction: '',
        estimatedArrivalTime: ''
      };
      // 更新资源状态
      const index = resourceDistributionList.value.findIndex(
        item => item.taskEmergencyResourceResourceId === resourceDetailSelectedRow.value.taskEmergencyResourceResourceId
      );
      if (index !== -1) {
        resourceDistributionList.value[index].sysResourceStatusName = '调度中';
      }
    }
  } catch (error: any) {
    ElMessage.error(`资源调度失败：${error.message}`);
  }
};
const contactResourcePersonData = async (resourceId: string) => {
  try {
    const res = await contactResourcePerson(resourceId);
    if (res.success) {
      const contactInfo = res.contactInfo;
      tipDialogContent.value = `资源负责人：${contactInfo.name}\n联系方式：${contactInfo.phone}\n职位：${contactInfo.position}`;
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    ElMessage.error(`联系负责人失败：${error.message}`);
  }
};
const getResourceDistributionIndicatorData = async () => {
  try {
    resourceDistributionIndicators.value = await fetchResourceDistributionIndicators();
  } catch {
    resourceDistributionIndicators.value = {
      standbyCount: 0,
      inUseCount: 0,
      underMaintenanceCount: 0
    };
  }
};
const getResourceTypeCompareData = async () => {
  try {
    resourceTypeCompareData.value = await fetchEmergencyResourceTypeCompare({});
  } catch (e) {
    console.error(e);
  }
};
const getResourceDeptCompareData = async () => {
  try {
    resourceDeptCompareData.value = await fetchEmergencyResourceDeptCompare({});
  } catch (e) {
    console.error(e);
  }
};
const getResourceStatusRatioData = async () => {
  try {
    resourceStatusRatioData.value = await fetchEmergencyResourceStatusRatio({});
  } catch (e) {
    console.error(e);
  }
};

// 专项应急视图接口请求方法
const getSpecialEmergencyListData = async () => {
  try {
    specialEmergencyList.value = (await fetchSpecialEmergencyList()) as SpecialEmergencyRow[];
  } catch (error: any) {
    ElMessage.error(`专项应急列表加载失败：${error.message}`);
    specialEmergencyList.value = [];
  }
};
const getSpecialEmergencyDetailData = async (specialEmergencyId: string) => {
  try {
    specialEmergencyDetailSelectedRow.value = {
      ...specialEmergencyDetailSelectedRow.value,
      ...(await fetchSpecialEmergencyDetail(specialEmergencyId)),
    };
  } catch (error: any) {
    ElMessage.warning(`专项应急详情加载失败：${error.message}`);
  }
};
const updateDisposalProgressData = async () => {
  if (!updateProgressForm.value.progress) {
    ElMessage.warning('请选择处置进度');
    return;
  }

  try {
    const res = await updateDisposalProgress(
      specialEmergencyDetailSelectedRow.value.taskSpecialEmergencySpecialEmergencyId,
      updateProgressForm.value
    );
    if (res.success) {
      tipDialogContent.value = res.message;
      tipDialogVisible.value = true;
      updateProgressDialogVisible.value = false;
      // 刷新列表数据
      await getSpecialEmergencyListData();
      // 刷新详情数据
      await getSpecialEmergencyDetailData(specialEmergencyDetailSelectedRow.value.taskSpecialEmergencySpecialEmergencyId);
    }
  } catch (error: any) {
    tipDialogContent.value = `更新进度失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};
const saveDisposalAssessmentData = async () => {
  try {
    const res = await saveDisposalAssessment(
      specialEmergencyDetailSelectedRow.value.taskSpecialEmergencySpecialEmergencyId,
      assessmentForm.value
    );
    if (res.success) {
      tipDialogContent.value = res.message;
      tipDialogVisible.value = true;
      assessmentDialogVisible.value = false;
      assessmentForm.value = { assessment: '', reportUrl: '' };
    }
  } catch (error: any) {
    ElMessage.error(`保存评估失败：${error.message}`);
  }
};
const getSpecialEmergencyIndicatorData = async () => {
  try {
    specialEmergencyIndicatorData.value = await fetchSpecialEmergencyIndicators({});
  } catch (e) {
    console.error(e);
  }
};
const getSpecialEmergencyTrendData = async () => {
  try {
    specialEmergencyTrendData.value = await fetchSpecialEmergencyDisposalTrend({});
  } catch (e) {
    console.error(e);
  }
};

// 资源调度接口请求方法
const getResourceDispatchListData = async () => {
  try {
    resourceDispatchList.value = (await fetchResourceDispatchList()) as ResourceDispatchRow[];
  } catch (error: any) {
    ElMessage.error(`资源调度列表加载失败：${error.message}`);
    resourceDispatchList.value = [];
  }
};
const getResourceDispatchDetailData = async (dispatchRecordId: string) => {
  try {
    resourceDispatchDetailSelectedRow.value = {
      ...resourceDispatchDetailSelectedRow.value,
      ...(await fetchResourceDispatchDetail(dispatchRecordId)),
    };
  } catch (error: any) {
    ElMessage.warning(`资源调度详情加载失败：${error.message}`);
  }
};
const getResourceDispatchIndicatorData = async () => {
  try {
    resourceDispatchIndicators.value = await fetchResourceDispatchIndicators();
  } catch {
    resourceDispatchIndicators.value = {
      transitingCount: 0,
      deliveredCount: 0,
      abnormalCount: 0,
    };
  }
};
const getResourceDispatchTypeCompareData = async () => {
  try {
    resourceDispatchTypeCompareData.value = await fetchResourceDispatchTypeCompare();
  } catch {
    resourceDispatchTypeCompareData.value = {
      xAxis: [],
      series: [],
    };
  }
};

// 现场态势接口请求方法
const getSceneSituationListData = async () => {
  try {
    sceneSituationList.value = (await fetchSceneSituationList()) as SceneSituationRow[];
  } catch (error: any) {
    ElMessage.error(`现场态势列表加载失败：${error.message}`);
    sceneSituationList.value = [];
  }
};
const getSceneSituationDetailData = async (emergencyId: string) => {
  try {
    sceneSituationDetailSelectedRow.value = {
      ...sceneSituationDetailSelectedRow.value,
      ...(await fetchSceneSituationDetail(emergencyId)),
    };
    // 重置指令选择
    selectedDisposalInstruction.value = '';
    customDisposalInstruction.value = '';
  } catch (error: any) {
    ElMessage.warning(`现场态势详情加载失败：${error.message}`);
  }
};
const contactScenePersonData = async (emergencyId: string) => {
  try {
    const res = await contactScenePerson(emergencyId);
    if (res.success) {
      // 无需弹窗，直接展示联系方式
      const contactInfo = res.contactInfo;
      tipDialogContent.value = `现场负责人：${contactInfo.name}\n联系方式：${contactInfo.phone}\n职位：${contactInfo.position}`;
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    ElMessage.error(`联系负责人失败：${error.message}`);
  }
};
const submitDisposalInstructionData = async () => {
  // 确定最终提交的指令内容
  let finalInstruction = '';
  if (selectedDisposalInstruction.value === 'custom') {
    if (!customDisposalInstruction.value.trim()) {
      ElMessage.warning('请输入自定义处置指令');
      return;
    }
    finalInstruction = customDisposalInstruction.value.trim();
  } else if (selectedDisposalInstruction.value) {
    finalInstruction = selectedDisposalInstruction.value;
  } else {
    ElMessage.warning('请选择或输入处置指令');
    return;
  }

  try {
    const res = await submitDisposalInstruction(
      sceneSituationDetailSelectedRow.value.taskEmergencyEmergencyId,
      finalInstruction
    );
    if (res.success) {
      tipDialogContent.value = res.message;
      tipDialogVisible.value = true;
      // 重置指令
      selectedDisposalInstruction.value = '';
      customDisposalInstruction.value = '';
      // 刷新数据
      await getSceneSituationListData();
    }
  } catch (error: any) {
    ElMessage.error(`下发指令失败：${error.message}`);
  }
};
const getSceneSituationIndicatorData = async () => {
  try {
    sceneSituationIndicators.value = await fetchSceneSituationIndicators();
  } catch {
    sceneSituationIndicators.value = {
      evacuatedVehicleCount: 0,
      repairBerthCount: 0,
      affectedRange: ''
    };
  }
};
const getSceneDisposalEffectCompareData = async () => {
  try {
    sceneDisposalEffectCompareData.value = await fetchSceneDisposalEffectCompare();
  } catch {
    sceneDisposalEffectCompareData.value = {
      xAxis: [],
      series: []
    };
  }
};

// 指挥调度接口请求方法
const getDispatchTaskListData = async () => {
  try {
    dispatchTaskList.value = await fetchDispatchTaskList();
  } catch {
    ElMessage.error('调度任务数据加载失败');
    dispatchTaskList.value = [];
  }
};
const getDispatchTaskIndicatorData = async () => {
  try {
    dispatchTaskIndicators.value = await fetchDispatchTaskIndicators();
    nextTick(() => initDispatchTaskNumberAnimations());
  } catch {
    dispatchTaskIndicators.value = { pendingCount: 0, executingCount: 0, completedCount: 0 };
  }
};
const getDispatchTaskReceiverCompareData = async () => {
  try {
    dispatchTaskReceiverCompareData.value = await fetchDispatchTaskReceiverCompare();
  } catch {
    dispatchTaskReceiverCompareData.value = {
      xAxis: [],
      series: [{ name: '已完成任务数', data: [] },{ name: '未完成任务数', data: [] }]
    };
  }
};
// 指挥调度数据刷新
const refreshDispatchTaskData = async () => {
  try {
    await Promise.all([
      getDispatchTaskListData(),
      getDispatchTaskIndicatorData(),
      getDispatchTaskReceiverCompareData(),
    ]);
    dispatchTaskChartRefreshKey.value++;
    ElMessage.success('指挥调度数据刷新成功');
  } catch (error: any) {
    ElMessage.error(`指挥调度数据刷新失败：${error.message}`);
  }
};

// 处置进度接口请求方法
const getDisposalProgressListData = async () => {
  try {
    disposalProgressList.value = await fetchDisposalProgressList();
  } catch {
    ElMessage.error('处置进度数据加载失败');
    disposalProgressList.value = [];
  }
};
const getDisposalProgressIndicatorData = async () => {
  try {
    disposalProgressIndicators.value = await fetchDisposalProgressIndicators();
    nextTick(() => initDisposalProgressNumberAnimations());
  } catch {
    disposalProgressIndicators.value = {
      avgAlarmDuration:0,
      avgReceiveDuration:0,
      avgArriveDuration:0,
      avgDisposeDuration:0,
      avgCloseDuration:0,
      timeoutDisposalCount:0
    };
  }
};
const getDisposalProgressTrendData = async () => {
  try {
    disposalProgressTrendData.value = await fetchDisposalProgressTrend();
  } catch {
    disposalProgressTrendData.value = {
      xAxis: [],
      series: [{ name: '平均到场时长(分钟)', data: [] },{ name: '平均处置时长(分钟)', data: [] }]
    };
  }
};
// 处置进度数据刷新
const refreshDisposalProgressData = async () => {
  try {
    await Promise.all([
      getDisposalProgressListData(),
      getDisposalProgressIndicatorData(),
      getDisposalProgressTrendData(),
    ]);
    disposalProgressChartRefreshKey.value++;
    ElMessage.success('处置进度数据刷新成功');
  } catch (error: any) {
    ElMessage.error(`处置进度数据刷新失败：${error.message}`);
  }
};

// 应急方案接口请求方法
const getEmergencyPlanListData = async () => {
  try {
    emergencyPlanList.value = await fetchEmergencyPlanList();
  } catch {
    ElMessage.error('应急方案数据加载失败');
    emergencyPlanList.value = [];
  }
};
const getEmergencyPlanIndicatorData = async () => {
  try {
    emergencyPlanIndicators.value = await fetchEmergencyPlanIndicators();
    nextTick(() => initEmergencyPlanNumberAnimations());
  } catch {
    emergencyPlanIndicators.value = { launchedCount: 0, executingCount: 0 };
  }
};
const getEmergencyPlanTypeRatioData = async () => {
  try {
    emergencyPlanTypeRatioData.value = await fetchEmergencyPlanTypeRatio();
  } catch {
    emergencyPlanTypeRatioData.value = {
      legend: [],
      series: [{ name: '方案适配应急类型占比', data: [] }]
    };
  }
};
// 应急方案数据刷新
const refreshEmergencyPlanData = async () => {
  try {
    await Promise.all([
      getEmergencyPlanListData(),
      getEmergencyPlanIndicatorData(),
      getEmergencyPlanTypeRatioData(),
    ]);
    emergencyPlanChartRefreshKey.value++;
    ElMessage.success('应急方案数据刷新成功');
  } catch (error: any) {
    ElMessage.error(`应急方案数据刷新失败：${error.message}`);
  }
};

// 协同指挥接口请求方法
const getCooperationListData = async () => {
  try {
    cooperationList.value = await fetchCooperationList();
  } catch (error: any) {
    ElMessage.error(`协同指挥列表加载失败：${error.message}`);
    cooperationList.value = [];
  }
};
const getCooperationDetailData = async (cooperationId: string) => {
  try {
    cooperationDetailSelectedRow.value = {
      ...cooperationDetailSelectedRow.value,
      ...(await fetchCooperationDetail(cooperationId)),
    };
  } catch (error: any) {
    ElMessage.warning(`协同指挥详情加载失败：${error.message}`);
  }
};
const respondToCooperationData = async () => {
  try {
    const res = await respondToCooperation(
      cooperationDetailSelectedRow.value.taskCooperationCooperationId,
      responseForm.value
    );
    if (res.success) {
      tipDialogContent.value = res.message;
      tipDialogVisible.value = true;
      cooperationResponseDialogVisible.value = false;
      // 重置表单
      responseForm.value = { responseResult: 'accept', reason: '' };
      // 刷新数据
      await getCooperationListData();
      await getCooperationIndicatorData();
    }
  } catch (error: any) {
    ElMessage.error(`响应协同失败：${error.message}`);
  }
};
const feedbackCooperationData = async () => {
  try {
    const res = await feedbackCooperation(
      cooperationDetailSelectedRow.value.taskCooperationCooperationId,
      feedbackForm.value
    );
    if (res.success) {
      tipDialogContent.value = res.message;
      tipDialogVisible.value = true;
      cooperationFeedbackDialogVisible.value = false;
      // 重置表单
      feedbackForm.value = { cooperationEffect: '', materials: [] };
      // 刷新数据
      await getCooperationListData();
      await getCooperationIndicatorData();
    }
  } catch (error: any) {
    ElMessage.error(`提交反馈失败：${error.message}`);
  }
};
const getCooperationIndicatorData = async () => {
  try {
    cooperationIndicators.value = await fetchCooperationIndicators();
    nextTick(() => initCooperationNumberAnimations());
  } catch {
    cooperationIndicators.value = {
      totalCooperationCount: 0,
      responseRate: 0,
      effectStandardCount: 0
    };
  }
};
const getCooperationTypeCompareData = async () => {
  try {
    cooperationTypeCompareData.value = await fetchCooperationTypeCompare();
  } catch {
    cooperationTypeCompareData.value = {
      xAxis: [],
      series: []
    };
  }
};
const getCooperationDeptCompareData = async () => {
  try {
    cooperationDeptCompareData.value = await fetchCooperationDeptCompare();
  } catch {
    cooperationDeptCompareData.value = {
      xAxis: [],
      series: []
    };
  }
};
const getCooperationTypeRatioData = async () => {
  try {
    cooperationTypeRatioData.value = await fetchCooperationTypeRatio();
  } catch {
    cooperationTypeRatioData.value = {
      legend: [],
      series: []
    };
  }
};
const getCooperationStatusRatioData = async () => {
  try {
    cooperationStatusRatioData.value = await fetchCooperationStatusRatio();
  } catch {
    cooperationStatusRatioData.value = {
      legend: [],
      series: []
    };
  }
};
// 协同指挥数据刷新
const refreshCooperationData = async () => {
  try {
    await Promise.all([
      getCooperationListData(),
      getCooperationIndicatorData(),
      getCooperationTypeCompareData(),
      getCooperationDeptCompareData(),
      getCooperationTypeRatioData(),
      getCooperationStatusRatioData(),
    ]);
    cooperationChartRefreshKey.value++;
    ElMessage.success('协同指挥数据刷新成功');
  } catch (error: any) {
    ElMessage.error(`协同指挥数据刷新失败：${error.message}`);
  }
};


// 应急态势视图切换
const changeEmergencySituationView = (viewName: string) => {
  activeEmergencySituationView.value = viewName;
  if (viewName === '列表') {
    nextTick(() => {
      getEmergencySituationListData();
    });
  }
};
const changeEmergencySituationDetailView = (viewName: string) => {
  activeEmergencySituationDetailView.value = viewName;
};
// 应急态势弹窗方法
const openEmergencySituationDetailDialog = async (row: EmergencySituationRow) => {
  await getEmergencySituationDetailData(row.taskEmergencyEmergencyId);
  emergencySituationDetailDialogVisible.value = true;
};
const closeEmergencySituationDetailDialog = () => {
  emergencySituationDetailDialogVisible.value = false;
  emergencySituationDetailSelectedRow.value = {
    taskEmergencyEmergencyId: '',
    sysEmergencyLevelName: '',
    sysEmergencyTypeName: '',
    taskEmergencyEmergencyTime: 0,
    tbAssetExtendAddress: '',
    taskEmergencyAffectedVehicleCount: 0,
    sysRescueProgressName: '',
    tbAssetExtendName: '',
    taskEmergencyInfluenceRange: '',
    taskEmergencyResponseTime: 0,
    sysMaintainUserTeamName: '',
    eventDetail: {
      description: '',
      cause: '',
      severity: '',
      impactTime: '',
    },
    scenePhotos: [],
    influenceAnalysis: {
      affectedParkingCount: 0,
      affectedVehicleCount: 0,
      estimatedLoss: '',
      trafficImpact: '',
      expectedRecoveryTime: '',
    },
    dispatchInfo: {
      dispatchedResources: [],
      cooperatingUnits: [],
      coordinationMeasures: '',
    },
    rescueProgress: {
      currentStage: '',
      progressPercentage: 0,
      completedTasks: [],
      pendingTasks: [],
      nextStep: '',
    },
  };
  activeEmergencySituationDetailView.value = '事件详情';
};
const openEmergencySituationDispatchDialog = (row: EmergencySituationRow) => {
  emergencySituationDetailSelectedRow.value.taskEmergencyEmergencyId = row.taskEmergencyEmergencyId;
  emergencySituationDispatchDialogVisible.value = true;
};
const closeEmergencySituationDispatchDialog = () => {
  emergencySituationDispatchDialogVisible.value = false;
  dispatchForm.value = {
    resourceType: '维修人员',
    resourceCount: 1,
    urgencyLevel: '一般',
    instructions: '',
    cooperatingUnits: ['交警支队'],
  };
  dispatchFormRef.value?.resetFields();
};
// 应急态势数据刷新
const refreshEmergencySituationData = async () => {
  try {
    await Promise.all([
      getEmergencySituationListData(),
      getEmergencySituationIndicatorData(),
      getEmergencyTypeRatioData(),
      getEmergencyLevelRatioData(),
    ]);
    emergencySituationChartRefreshKey.value++;
    ElMessage.success('应急态势数据刷新成功');
  } catch (error: any) {
    ElMessage.error(`应急态势数据刷新失败：${error.message}`);
  }
};

// 资源分布视图切换方法
const changeResourceDistributionView = (viewName: string) => {
  activeResourceDistributionView.value = viewName;
  if (viewName === '列表') {
    nextTick(() => {
      getResourceDistributionListData();
    });
  }
};
const changeResourceDetailView = (viewName: string) => {
  activeResourceDetailView.value = viewName;
};
// 资源分布弹窗方法
const openResourceDetailDialog = async (row: ResourceDistributionRow) => {
  await getResourceDetailData(row.taskEmergencyResourceResourceId);
  resourceDetailDialogVisible.value = true;
};
const closeResourceDetailDialog = () => {
  resourceDetailDialogVisible.value = false;
  resourceDetailSelectedRow.value = {
    taskEmergencyResourceResourceId: '',
    sysResourceTypeName: '',
    taskEmergencyResourceResourceName: '',
    tbAssetExtendAddress: '',
    sysResourceStatusName: '',
    sysDeptDeptName: '',
    taskEmergencyResourceQuantity: 0,
    sysUserUserName: '',
    sysUserUserPhone: '',
    distanceToTarget: '',
    resourceDetail: {
      manufacturer: '',
      purchaseDate: 0,
      warrantyPeriod: '',
      specifications: '',
      maintenanceRecord: '',
    },
    inventoryDetails: [],
    usageRecords: []
  };
  activeResourceDetailView.value = '资源详情';
};
const openResourceDispatchDialog = async (row: ResourceDistributionRow) => {
  await getResourceDetailData(row.taskEmergencyResourceResourceId);
  resourceDispatchDialogVisible.value = true;
};
const closeResourceDispatchDialog = () => {
  resourceDispatchDialogVisible.value = false;
  dispatchResourceForm.value = {
    instruction: '',
    estimatedArrivalTime: ''
  };
};
// 资源分布数据刷新
const refreshResourceDistributionData = async () => {
  try {
    await Promise.all([
      getResourceDistributionListData(),
      getResourceDistributionIndicatorData(),
      getResourceTypeCompareData(),
      getResourceDeptCompareData(),
      getResourceStatusRatioData(),
    ]);
    resourceDistributionChartRefreshKey.value++;
    ElMessage.success('资源分布数据刷新成功');
  } catch (error: any) {
    ElMessage.error(`资源分布数据刷新失败：${error.message}`);
  }
};

// 提交调度反馈
const feedbackDispatchData = async () => {
  try {
    const res = await feedbackResourceDispatch(
      resourceDispatchDetailSelectedRow.value.taskResourceDispatchDispatchRecordId,
      dispatchFeedbackForm.value
    );
    if (res.success) {
      // 显示成功提示弹窗
      tipDialogContent.value = '调度反馈提交成功！';
      tipDialogVisible.value = true;

      // 关闭反馈弹窗
      dispatchFeedbackDialogVisible.value = false;
      dispatchFeedbackForm.value = { feedbackContent: '' };

      // 刷新数据
      await getResourceDispatchListData();
    }
  } catch (error: any) {
    ElMessage.error(`反馈提交失败：${error.message}`);
  }
};
// 资源调度视图切换方法
const changeResourceDispatchView = (viewName: string) => {
  activeResourceDispatchView.value = viewName;
  if (viewName === '列表') {
    nextTick(() => {
      getResourceDispatchListData();
    });
  }
};
// 资源调度弹窗方法
const openResourceDispatchDetailDialog = async (row: ResourceDispatchRow) => {
  await getResourceDispatchDetailData(row.taskResourceDispatchDispatchRecordId);
  resourceDispatchDetailDialogVisible.value = true;
};
const closeResourceDispatchDetailDialog = () => {
  resourceDispatchDetailDialogVisible.value = false;
  resourceDispatchDetailSelectedRow.value = {
    taskResourceDispatchDispatchRecordId: '',
    taskEmergencyResourceResourceId: '',
    sysResourceTypeName: '',
    taskResourceDispatchDispatchQuantity: 0,
    fromAddress: '',
    toAddress: '',
    sysDispatchStatusName: '',
    taskResourceDispatchDispatchTime: null,
    taskResourceDispatchEstimatedArrivalTime: null,
    taskResourceDispatchActualArrivalTime: null,
    sysUserUserName: '',
    resourceDetails: [],
    dispatchInstruction: '',
    dispatchTrack: [],
  };
};
const openDispatchFeedbackDialog = (row: ResourceDispatchRow) => {
  // 设置当前操作的记录
  resourceDispatchDetailSelectedRow.value.taskResourceDispatchDispatchRecordId = row.taskResourceDispatchDispatchRecordId;

  // 打开反馈弹窗
  dispatchFeedbackDialogVisible.value = true;
};
// 资源调度数据刷新
const refreshResourceDispatchData = async () => {
  try {
    await Promise.all([
      getResourceDispatchListData(),
      getResourceDispatchIndicatorData(),
      getResourceDispatchTypeCompareData(),
    ]);
    resourceDispatchChartRefreshKey.value++;
    ElMessage.success('资源调度数据刷新成功');
  } catch (error: any) {
    ElMessage.error(`资源调度数据刷新失败：${error.message}`);
  }
};

// 专项应急视图切换方法
const changeSpecialEmergencyView = (viewName: string) => {
  activeSpecialEmergencyView.value = viewName;
  if (viewName === '列表') {
    nextTick(() => {
      getSpecialEmergencyListData();
    });
  }
};
const changeSpecialEmergencyDetailView = (viewName: string) => {
  activeSpecialEmergencyDetailView.value = viewName;
};
// 专项应急弹窗方法
const openSpecialEmergencyDetailDialog = async (row: SpecialEmergencyRow) => {
  await getSpecialEmergencyDetailData(row.taskSpecialEmergencySpecialEmergencyId);
  specialEmergencyDetailDialogVisible.value = true;
};
const closeSpecialEmergencyDetailDialog = () => {
  specialEmergencyDetailDialogVisible.value = false;
  specialEmergencyDetailSelectedRow.value = {
    taskSpecialEmergencySpecialEmergencyId: '',
    sysEmergencyScenarioName: '',
    taskSpecialEmergencyTrappedVehicleCount: 0,
    taskSpecialEmergencyEvacuationRoute: '',
    tbAssetExtendAddress: '',
    sysDisposalProgressName: '',
    taskSpecialEmergencyEvacuationProgress: 0,
    parkFaultRepairProgress: 0,
    sysUserUserName: '',
    taskSpecialEmergencyExpectedFinishTime: 0,
    disposalPlan: '',
    evacuationRoute: [],
    safetyExitDistribution: []
  };
  activeSpecialEmergencyDetailView.value = '专项应急详情';
};
const openUpdateProgressDialog = (row: SpecialEmergencyRow) => {
  specialEmergencyDetailSelectedRow.value.taskSpecialEmergencySpecialEmergencyId = row.taskSpecialEmergencySpecialEmergencyId;
  updateProgressForm.value = { progress: '', remark: '' };
  updateProgressDialogVisible.value = true;
};
const closeUpdateProgressDialog = () => {
  updateProgressDialogVisible.value = false;
  updateProgressForm.value = { progress: '', remark: '' };
};
const openAssessmentDialog = (row: SpecialEmergencyRow) => {
  specialEmergencyDetailSelectedRow.value.taskSpecialEmergencySpecialEmergencyId = row.taskSpecialEmergencySpecialEmergencyId;
  assessmentForm.value = { assessment: '', reportUrl: '' };
  assessmentDialogVisible.value = true;
};
const closeAssessmentDialog = () => {
  assessmentDialogVisible.value = false;
  assessmentForm.value = { assessment: '', reportUrl: '' };
};
const changeEmergencyPlanView = (viewName: string) => {
  activeEmergencyPlanView.value = viewName;
  viewName === '卡片' && nextTick(() => initEmergencyPlanNumberAnimations());
  viewName === '饼图' && nextTick(() => emergencyPlanChartRefreshKey.value += 1);
};
// 专项应急数据刷新
const refreshSpecialEmergencyData = async () => {
  try {
    await Promise.all([
      getSpecialEmergencyListData(),
      getSpecialEmergencyIndicatorData(),
      getSpecialEmergencyTrendData(),
    ]);
    specialEmergencyChartRefreshKey.value++;
    ElMessage.success('专项应急数据刷新成功');
  } catch (error: any) {
    ElMessage.error(`专项应急数据刷新失败：${error.message}`);
  }
};

// 现场态势视图切换方法
const changeSceneSituationView = (viewName: string) => {
  activeSceneSituationView.value = viewName;
  if (viewName === '列表') {
    nextTick(() => {
      getSceneSituationListData();
    });
  }
};
const changeSceneSituationDetailView = (viewName: string) => {
  activeSceneSituationDetailView.value = viewName;
};
// 现场态势弹窗方法
const openSceneSituationDetailDialog = async (row: SceneSituationRow) => {
  await getSceneSituationDetailData(row.taskEmergencyEmergencyId);
  sceneSituationDetailDialogVisible.value = true;
};
const closeSceneSituationDetailDialog = () => {
  sceneSituationDetailDialogVisible.value = false;
  sceneSituationDetailSelectedRow.value = {
    taskEmergencyEmergencyId: '',
    tbAssetExtendAddress: '',
    taskEmergencySceneSceneStatus: '',
    taskEmergencySceneAffectedBerthCount: 0,
    taskEmergencySceneEvacuatedVehicleCount: 0,
    taskEmergencySceneRepairBerthCount: 0,
    sysUserUserName: '',
    sysUserUserPhone: '',
    taskEmergencySceneScenePhotos: [],
    taskEmergencySceneDisposalSuggestion: '',
    sceneOverview: {
      affectedRange: '',
      startTime: 0,
      emergencyLevel: '',
      weatherCondition: '',
      temperature: '',
      windSpeed: '',
    },
    realtimeData: {
      currentEvacuatedCount: 0,
      currentRepairCount: 0,
      remainingAffectedCount: 0,
      evacuationProgress: 0,
      repairProgress: 0,
      currentPersonnelCount: 0,
    },
    disposalProgress: []
  };
  activeSceneSituationDetailView.value = '现场态势';
  // 重置指令
  selectedDisposalInstruction.value = '';
  customDisposalInstruction.value = '';
};
const openScenePhotoDialog = (photoUrl: string) => {
  selectedPhotoUrl.value = photoUrl;
  scenePhotoDialogVisible.value = true;
};
const closeScenePhotoDialog = () => {
  scenePhotoDialogVisible.value = false;
  selectedPhotoUrl.value = '';
};
// 现场态势数据刷新
const refreshSceneSituationData = async () => {
  try {
    await Promise.all([
      getSceneSituationListData(),
      getSceneSituationIndicatorData(),
      getSceneDisposalEffectCompareData(),
    ]);
    sceneSituationChartRefreshKey.value++;
    ElMessage.success('现场态势数据刷新成功');
  } catch (error: any) {
    ElMessage.error(`现场态势数据刷新失败：${error.message}`);
  }
};

// 调度任务视图切换方法
const changeDispatchTaskView = (viewName: string) => {
  activeDispatchTaskView.value = viewName;
  viewName === '卡片' && nextTick(() => initDispatchTaskNumberAnimations());
  viewName === '柱状图' && nextTick(() => dispatchTaskChartRefreshKey.value += 1);
};

// 处置进度视图切换方法
const changeDisposalProgressView = (viewName: string) => {
  activeDisposalProgressView.value = viewName;
  viewName === '卡片' && nextTick(() => initDisposalProgressNumberAnimations());
  viewName === '折线图' && nextTick(() => disposalProgressChartRefreshKey.value += 1);
};

// 协同指挥视图切换方法
const changeCooperationView = (viewName: string) => {
  activeCooperationView.value = viewName;
  viewName === '卡片' && nextTick(() => initCooperationNumberAnimations());
  (viewName === '柱状图' || viewName === '饼图') && nextTick(() => cooperationChartRefreshKey.value += 1);
  if (viewName === '列表') {
    nextTick(() => {
      getCooperationListData();
    });
  }
};
// 协同指挥弹窗方法
const openCooperationDetailDialog = async (row: CooperationRow) => {
  await getCooperationDetailData(row.taskCooperationCooperationId);
  cooperationDetailDialogVisible.value = true;
};
const closeCooperationDetailDialog = () => {
  cooperationDetailDialogVisible.value = false;
  cooperationDetailSelectedRow.value = {
    taskCooperationCooperationId: '',
    sysCooperationTypeName: '',
    taskCooperationTaskContent: '',
    sysDeptDeptName: '',
    taskCooperationCreateTime: null,
    sysResponseStatusName: '',
    initiatingDept: '',
    cooperationLeader: '',
    cooperationEffect: '',
    completeTime: null,
    participatingUnits: [],
    taskRequirements: '',
    feedbackResults: [],
  };
};
const openCooperationResponseDialog = () => {
  cooperationResponseDialogVisible.value = true;
};
const closeCooperationResponseDialog = () => {
  cooperationResponseDialogVisible.value = false;
  responseForm.value = { responseResult: 'accept', reason: '' };
};
const openCooperationFeedbackDialog = () => {
  cooperationFeedbackDialogVisible.value = true;
};
const closeCooperationFeedbackDialog = () => {
  cooperationFeedbackDialogVisible.value = false;
  feedbackForm.value = { cooperationEffect: '', materials: [] };
};


// 标签映射
const getDispatchStatusTag = (val: string) => {
  switch(val){
    case '在途': return 'primary';
    case '已送达': return 'success';
    case '异常': return 'danger';
    default: return '';
  }
};
const getDispatchTaskStatusTag = (val: string) => {
  switch(val){
    case 'pending':return 'warning';
    case 'executing':return 'primary';
    case 'completed':return 'success';
    default:return '';
  }
};
const getDispatchTaskStatusName = (val: string) => {
  switch(val){
    case 'pending':return '待执行';
    case 'executing':return '执行中';
    case 'completed':return '已完成';
    default:return '未知状态';
  }
};
const getDispatchTypeName = (val: string) => {
  switch(val){
    case 'traffic':return '交通疏导';
    case 'maintain':return '设备维修';
    case 'emergency':return '应急事故';
    case 'security':return '安全整治';
    default:return '未知类型';
  }
};
const getDisposalStageName = (val: string) => {
  switch(val){
    case 'receive':return '接警';
    case 'arrive':return '到场';
    case 'dispose':return '处置';
    case 'close':return '结案';
    default:return '未知阶段';
  }
};
const getPlanStatusTag = (val: string) => {
  switch(val){
    case 'launched':return 'primary';
    case 'executing':return 'warning';
    case 'completed':return 'success';
    default:return '';
  }
};
const getPlanStatusName = (val: string) => {
  switch(val){
    case 'launched':return '已启动';
    case 'executing':return '执行中';
    case 'completed':return '已完成';
    default:return '未知状态';
  }
};
const getEmergencyTypeName = (val: string) => {
  switch(val){
    case 'trafficJam':return '交通拥堵';
    case 'equipmentFault':return '设备故障';
    case 'carAccident':return '车辆事故';
    case 'fireHidden':return '消防隐患';
    case 'personHelp':return '人员求助';
    default:return '其他';
  }
};
const getResourceStatusTag = (val: string) => {
  switch(val) {
    case '待命': return 'success';
    case '使用中': return 'primary';
    case '维修中': return 'warning';
    case '调度中': return 'info';
    default: return '';
  }
};
// 协同指挥状态标签
const getCooperationStatusTag = (val: string) => {
  switch(val){
    case '待响应': return 'warning';
    case '已响应': return 'primary';
    case '已反馈': return 'info';
    case '已完成': return 'success';
    case '已拒绝': return 'danger';
    default: return '';
  }
};


// 页面挂载生命周期
onMounted(async () => {
  await initAllMapData();
  resetOrbitConfigForm();
  await Promise.all([
    getDispatchTaskListData(),
    getDispatchTaskIndicatorData(),
    getDispatchTaskReceiverCompareData(),
    getDisposalProgressListData(),
    getDisposalProgressIndicatorData(),
    getDisposalProgressTrendData(),
    getEmergencyPlanListData(),
    getEmergencyPlanIndicatorData(),
    getEmergencyPlanTypeRatioData(),
    getSceneSituationListData(),
    getSceneSituationIndicatorData(),
    getSceneDisposalEffectCompareData(),
    getEmergencySituationListData(),
    getResourceDistributionListData(),
    getResourceDistributionIndicatorData(),
    getSpecialEmergencyListData(),
    getResourceDispatchListData(),
    getResourceDispatchIndicatorData(),
    getResourceDispatchTypeCompareData(),
    getCooperationListData(),
    getCooperationIndicatorData(),
    getCooperationTypeCompareData(),
    getCooperationDeptCompareData(),
    getCooperationTypeRatioData(),
    getCooperationStatusRatioData(),
  ]);
  setTimeout(() => {
    dispatchTaskChartRefreshKey.value += 1;
    emergencyPlanChartRefreshKey.value += 1;
    disposalProgressChartRefreshKey.value += 1;
    cooperationChartRefreshKey.value += 1;
  }, 200);
  screenFull.on('change', handleFullscreenChange);
});

// 页面卸载生命周期
onUnmounted(() => {
  [emergencyMap1Ref.value, emergencyMap2Ref.value, emergencyMap3Ref.value, emergencyMap4Ref.value].forEach(ref => ref && ref.stopOrbitAnimation());
  screenFull.off('change', handleFullscreenChange);
  currentFullscreenPanel.value = null;
});
</script>

<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="mainbox">
      <div class="top">
        <div class="panel top-middle" ref="topMiddlePanel">
          <el-tabs v-model="topMiddleActiveTab" class="common-tabs" @tab-change="handleTabChange">
            <el-tab-pane label="应急态势" name="tab1">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in emergencySituationViewBtnList"
                      :key="item"
                      :type="activeEmergencySituationView === item ? 'primary' : ''"
                      plain
                      @click="changeEmergencySituationView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <button class="control-btn" @click="handleOrbitAnimation1">
                    <el-icon color="#409eff" size="16">
                      <VideoPause v-if="emergencyMap1Ref?.orbitStatus?.playing" />
                      <VideoPlay v-else />
                    </el-icon>
                  </button>
                  <button class="control-btn" @click="orbitConfigDialogVisible = true">
                    <el-icon color="#409eff" size="16"><Setting /></el-icon>
                  </button>
                  <button class="control-btn" @click="refreshEmergencySituationData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('topMiddlePanel')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div v-if="activeEmergencySituationView === '地图'" style="flex: 1; width: 100%; height: calc(100% - 2vh);position: relative;">
                <div class="stats-overlay1">
                  <div class="stats-cards1">
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">应急事件总数</div>
                        <div class="stat-value">{{ emergencySituationIndicatorData.totalEmergencyCount }} 起</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">各等级应急数</div>
                        <div class="stat-value">一{{ emergencySituationIndicatorData.levelEmergencyCount.level1 }}/二{{ emergencySituationIndicatorData.levelEmergencyCount.level2 }}/三{{ emergencySituationIndicatorData.levelEmergencyCount.level3 }}/四{{ emergencySituationIndicatorData.levelEmergencyCount.level4 }}</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">受影响车辆数</div>
                        <div class="stat-value">{{ emergencySituationIndicatorData.affectedVehicleTotal }} 辆</div>
                      </div>
                    </div>
                  </div>
                </div>
                <EmergencyResponseMap1 v-if="!map1Loading && topMiddleActiveTab === 'tab1'" ref="emergencyMap1Ref" id-name="parkingMap1" :geometries-array="emergencySituationData" :orbit-config="orbitConfigData" />
                <div class="chart-overlay2">
                  <div class="chart-cards2">
                    <div class="chart-card">
                      <ChartPie1
                        :key="topMainChartRefreshKey"
                        :data="emergencyTypeRatioData"
                        title="应急类型占比"
                        :base-font-scale="disposalProgressBaseFontScale"
                        :active-indices="disposalProgressActiveIndices"
                        style="width:100%;height:100%"
                      />
                    </div>
                    <div class="chart-card">
                      <ChartPie2
                        :key="topMainChartRefreshKey"
                        :data="emergencyLevelRatioData"
                        title="应急等级占比"
                        :base-font-scale="disposalProgressBaseFontScale"
                        :active-indices="disposalProgressActiveIndices"
                        style="width:100%;height:100%"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 列表视图 -->
              <div v-if="activeEmergencySituationView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="emergencySituationList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openEmergencySituationDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="taskEmergencyEmergencyId"
                      label="应急事件ID"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="sysEmergencyLevelName"
                      label="应急等级"
                      align="center"
                      width="100"
                    >
                      <template #default="scope">
                        <ElTag :type="scope.row.sysEmergencyLevelName === '一级' ? 'danger' :
                 scope.row.sysEmergencyLevelName === '二级' ? 'warning' :
                 scope.row.sysEmergencyLevelName === '三级' ? 'primary' : 'info'">
                          {{ scope.row.sysEmergencyLevelName || '-' }}
                        </ElTag>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="sysEmergencyTypeName"
                      label="应急类型"
                      align="center"
                      width="100"
                    />
                    <ElTableColumn
                      prop="taskEmergencyEmergencyTime"
                      label="发生时间"
                      align="center"
                      width="160"
                    >
                      <template #default="scope">
                        {{ formatTimeStamp(scope.row.taskEmergencyEmergencyTime) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbAssetExtendAddress"
                      label="发生位置"
                      align="center"
                      min-width="180"
                    />
                    <ElTableColumn
                      prop="taskEmergencyAffectedVehicleCount"
                      label="受影响车辆数"
                      align="center"
                      width="120"
                    />
                    <ElTableColumn
                      prop="sysRescueProgressName"
                      label="救援进度"
                      align="center"
                      width="100"
                    >
                      <template #default="scope">
                        <ElTag :type="scope.row.sysRescueProgressName === '已处置' ? 'success' :
                 scope.row.sysRescueProgressName === '处置中' ? 'warning' : 'danger'">
                          {{ scope.row.sysRescueProgressName || '-' }}
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
                          @click.stop="openEmergencySituationDispatchDialog(scope.row)"
                        >
                          调度
                        </ElButton>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="资源分布" name="tab2">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton v-for="item in resourceDistributionViewBtnList" :key="item"
                              :type="activeResourceDistributionView === item ? 'primary' : ''"
                              plain @click="changeResourceDistributionView(item)" class="view-btn">
                      {{ item }}
                    </ElButton>
                  </div>
                  <button class="control-btn" @click="handleOrbitAnimation2">
                    <el-icon color="#409eff" size="16">
                      <VideoPause v-if="emergencyMap2Ref?.orbitStatus?.playing" />
                      <VideoPlay v-else />
                    </el-icon>
                  </button>
                  <button class="control-btn" @click="orbitConfigDialogVisible = true">
                    <el-icon color="#409eff" size="16"><Setting /></el-icon>
                  </button>
                  <button class="control-btn" @click="refreshResourceDistributionData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('topMiddlePanel')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div v-if="activeResourceDistributionView === '地图'" style="flex: 1; width: 100%; height: calc(100% - 2vh);position: relative;">
                <!-- 统计数据卡片 -->
                <div class="stats-overlay1">
                  <div class="stats-cards1">
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">待命资源数</div>
                        <div class="stat-value">{{ resourceDistributionIndicators.standbyCount }} 个</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">使用中资源数</div>
                        <div class="stat-value">{{ resourceDistributionIndicators.inUseCount }} 个</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">维修中资源数</div>
                        <div class="stat-value">{{ resourceDistributionIndicators.underMaintenanceCount }} 个</div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 地图组件 -->
                <EmergencyResponseMap2 v-if="!map2Loading && topMiddleActiveTab === 'tab2'" ref="emergencyMap2Ref" id-name="parkingMap2" :geometries-array="emergencyResourceData" :orbit-config="orbitConfigData" />
                <!-- 图表 -->
                <div class="chart-overlay2">
                  <div class="chart-cards2">
                    <div class="chart-card" style="width:240px;height:190px;">
                      <VerticalBar3 :key="topMainChartRefreshKey" :x-axis="resourceTypeCompareData.xAxis" :series="resourceTypeCompareData.series" unit="个/支/套" title="不同类型资源数量对比" :base-font-scale="disposalProgressBaseFontScale" :active-indices="disposalProgressActiveIndices" style="width:100%;height:100%"/>
                    </div>
                    <div class="chart-card" style="width:240px;height:190px;">
                      <VerticalBar3 :key="topMainChartRefreshKey" :x-axis="resourceDeptCompareData.xAxis" :series="resourceDeptCompareData.series" unit="个/支/套" title="不同部门资源数量对比" :base-font-scale="disposalProgressBaseFontScale" :active-indices="disposalProgressActiveIndices" style="width:100%;height:100%"/>
                    </div>
                    <div class="chart-card" style="width:240px;height:190px;">
                      <ChartPie1 :key="topMainChartRefreshKey" :data="resourceStatusRatioData" title="资源状态占比" :base-font-scale="disposalProgressBaseFontScale" :active-indices="disposalProgressActiveIndices" style="width:100%;height:100%"/>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="activeResourceDistributionView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="resourceDistributionList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openResourceDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="taskEmergencyResourceResourceId"
                      label="资源ID"
                      align="center"
                    />
                    <ElTableColumn
                      prop="sysResourceTypeName"
                      label="资源类型"
                      align="center"
                    />
                    <ElTableColumn
                      prop="taskEmergencyResourceResourceName"
                      label="资源名称"
                      align="center"
                    />
                    <ElTableColumn
                      prop="tbAssetExtendAddress"
                      label="存储位置"
                      align="center"
                      min-width="180"
                    />
                    <ElTableColumn
                      prop="sysResourceStatusName"
                      label="资源状态"
                      align="center"
                    >
                      <template #default="scope">
                        <ElTag :type="getResourceStatusTag(scope.row.sysResourceStatusName)">
                          {{ scope.row.sysResourceStatusName || '-' }}
                        </ElTag>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="sysDeptDeptName"
                      label="所属部门"
                      align="center"
                    />
                    <ElTableColumn
                      label="操作"
                      align="center"
                      width="200"
                      fixed="right"
                    >
                      <template #default="scope">
                        <ElButton
                          type="warning"
                          size="small"
                          plain
                          @click.stop="openResourceDispatchDialog(scope.row)"
                          style="margin-left: 8px;"
                          :disabled="scope.row.sysResourceStatusName === '调度中' || scope.row.sysResourceStatusName === '使用中'"
                        >
                          调度
                        </ElButton>
                        <ElButton
                          type="success"
                          size="small"
                          plain
                          @click.stop="contactResourcePersonData(scope.row.taskEmergencyResourceResourceId)"
                          style="margin-left: 8px;"
                        >
                          联系
                        </ElButton>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="专项应急视图" name="tab3">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton v-for="item in specialEmergencyViewBtnList" :key="item"
                              :type="activeSpecialEmergencyView === item ? 'primary' : ''"
                              plain @click="changeSpecialEmergencyView(item)" class="view-btn">
                      {{ item }}
                    </ElButton>
                  </div>
                  <button class="control-btn" @click="handleOrbitAnimation3">
                    <el-icon color="#409eff" size="16">
                      <VideoPause v-if="emergencyMap3Ref?.orbitStatus?.playing" />
                      <VideoPlay v-else />
                    </el-icon>
                  </button>
                  <button class="control-btn" @click="orbitConfigDialogVisible = true">
                    <el-icon color="#409eff" size="16"><Setting /></el-icon>
                  </button>
                  <button class="control-btn" @click="refreshSpecialEmergencyData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('topMiddlePanel')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div v-if="activeSpecialEmergencyView === '地图'" style="flex: 1; width: 100%; height: calc(100% - 2vh);position: relative;">
                <div class="stats-overlay1">
                  <div class="stats-cards1">
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">受困车辆数</div>
                        <div class="stat-value">{{ specialEmergencyIndicatorData.trappedVehicleTotal }} 辆</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">已疏散车辆数</div>
                        <div class="stat-value">{{ specialEmergencyIndicatorData.evacuatedVehicleCount }} 辆</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">已修复设备数</div>
                        <div class="stat-value">{{ specialEmergencyIndicatorData.repairedDeviceCount }} 台</div>
                      </div>
                    </div>
                  </div>
                </div>
                <EmergencyResponseMap3 v-if="!map3Loading && topMiddleActiveTab === 'tab3'" ref="emergencyMap3Ref" id-name="parkingMap3" :geometries-array="specialEmergencyData" :orbit-config="orbitConfigData" />
                <div class="chart-overlay2">
                  <div class="chart-cards2">
                    <div class="chart-card" style="width:520px;">
                      <ChartLine2 :key="topMainChartRefreshKey" :data="specialEmergencyTrendData" title="处置进度时间趋势" y-axis-name="辆/台" :base-font-scale="disposalProgressBaseFontScale" style="width:100%;height:100%"/>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="activeSpecialEmergencyView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="specialEmergencyList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openSpecialEmergencyDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="taskSpecialEmergencySpecialEmergencyId"
                      label="专项应急ID"
                      align="center"
                    />
                    <ElTableColumn
                      prop="sysEmergencyScenarioName"
                      label="应急场景"
                      align="center"
                    />
                    <ElTableColumn
                      prop="taskSpecialEmergencyTrappedVehicleCount"
                      label="受困车辆数"
                      align="center"
                    />
                    <ElTableColumn
                      prop="taskSpecialEmergencyEvacuationRoute"
                      label="疏散通道"
                      align="center"
                      min-width="180"
                    />
                    <ElTableColumn
                      prop="tbAssetExtendAddress"
                      label="安全出口"
                      align="center"
                      min-width="180"
                    />
                    <ElTableColumn
                      prop="sysDisposalProgressName"
                      label="处置进度"
                      align="center"
                    >
                      <template #default="scope">
                        <ElTag :type="scope.row.sysDisposalProgressName === '已处置' ? 'success' :
                    scope.row.sysDisposalProgressName === '处置中' ? 'warning' : 'danger'">
                          {{ scope.row.sysDisposalProgressName || '-' }}
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
                          @click.stop="openUpdateProgressDialog(scope.row)"
                          style="margin-left: 8px;"
                        >
                          更新
                        </ElButton>
                        <ElButton
                          type="success"
                          size="small"
                          plain
                          @click.stop="openAssessmentDialog(scope.row)"
                          style="margin-left: 8px;"
                        >
                          评估
                        </ElButton>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="资源调度" name="tab4">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton v-for="item in resourceDispatchViewBtnList" :key="item"
                              :type="activeResourceDispatchView === item ? 'primary' : ''"
                              plain @click="changeResourceDispatchView(item)" class="view-btn">
                      {{ item }}
                    </ElButton>
                  </div>
                  <button class="control-btn" @click="handleOrbitAnimation4">
                    <el-icon color="#409eff" size="16">
                      <VideoPause v-if="emergencyMap4Ref?.orbitStatus?.playing" />
                      <VideoPlay v-else />
                    </el-icon>
                  </button>
                  <button class="control-btn" @click="orbitConfigDialogVisible = true">
                    <el-icon color="#409eff" size="16"><Setting /></el-icon>
                  </button>
                  <button class="control-btn" @click="refreshResourceDispatchData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('topMiddlePanel')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div v-if="activeResourceDispatchView === '地图'" style="flex: 1; width: 100%; height: calc(100% - 2vh);position: relative;">
                <!-- 统计数据卡片 -->
                <div class="stats-overlay1">
                  <div class="stats-cards1">
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">在途资源数</div>
                        <div class="stat-value">{{ resourceDispatchIndicators.transitingCount }} 个</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">已送达资源数</div>
                        <div class="stat-value">{{ resourceDispatchIndicators.deliveredCount }} 个</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">异常资源数</div>
                        <div class="stat-value">{{ resourceDispatchIndicators.abnormalCount }} 个</div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 地图组件 -->
                <EmergencyResponseMap4 v-if="!map4Loading && topMiddleActiveTab === 'tab4'" ref="emergencyMap4Ref" id-name="parkingMap4" :geometries-array="dispatchPathData" :orbit-config="orbitConfigData" />
                <!-- 柱状图 -->
                <div class="chart-overlay2">
                  <div class="chart-cards2">
                    <div class="chart-card" style="width: 520px;">
                      <VerticalBar4
                        :key="topMainChartRefreshKey"
                        :x-axis="resourceDispatchTypeCompareData.xAxis"
                        :series="resourceDispatchTypeCompareData.series"
                        unit="个"
                        title="不同资源类型调度量对比"
                        :base-font-scale="sceneSituationBaseFontScale"
                        :show-label="true"
                        :show-legend="true"
                        style="width:100%;height:100%"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="activeResourceDispatchView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="resourceDispatchList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openResourceDispatchDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="taskResourceDispatchDispatchRecordId"
                      label="调度记录ID"
                      align="center"
                    />
                    <ElTableColumn
                      prop="taskEmergencyResourceResourceId"
                      label="资源ID"
                      align="center"
                    />
                    <ElTableColumn
                      prop="sysResourceTypeName"
                      label="资源类型"
                      align="center"
                    />
                    <ElTableColumn
                      prop="taskResourceDispatchDispatchQuantity"
                      label="调配数量"
                      align="center"
                    />
                    <ElTableColumn
                      prop="fromAddress"
                      label="调出位置"
                      align="center"
                      min-width="150"
                    />
                    <ElTableColumn
                      prop="toAddress"
                      label="调入位置"
                      align="center"
                      min-width="150"
                    />
                    <ElTableColumn
                      prop="sysDispatchStatusName"
                      label="调度状态"
                      align="center"
                    >
                      <template #default="scope">
                        <ElTag :type="getDispatchStatusTag(scope.row.sysDispatchStatusName)">
                          {{ scope.row.sysDispatchStatusName || '-' }}
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
                          type="warning"
                          size="small"
                          plain
                          @click.stop="openDispatchFeedbackDialog(scope.row)"
                        >
                        反馈
                        </ElButton>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="现场态势" name="tab5">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton v-for="item in sceneSituationViewBtnList" :key="item"
                              :type="activeSceneSituationView === item ? 'primary' : ''"
                              plain @click="changeSceneSituationView(item)" class="view-btn">
                      {{ item }}
                    </ElButton>
                  </div>
                  <button class="control-btn" @click="refreshSceneSituationData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('topMiddlePanel')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div v-if="activeSceneSituationView === '地图'" style="flex: 1; width: 100%; height: calc(100% - 2vh);position: relative;">
                <!-- 统计数据卡片 -->
                <div class="stats-overlay1">
                  <div class="stats-cards1">
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">已疏导车辆数</div>
                        <div class="stat-value">{{ sceneSituationIndicators.evacuatedVehicleCount }} 辆</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">已修复泊位数</div>
                        <div class="stat-value">{{ sceneSituationIndicators.repairBerthCount }} 个</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">受影响范围</div>
                        <div class="stat-value">{{ sceneSituationIndicators.affectedRange }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 地图组件 -->
                <DotAnimationMap v-if="!dotMapLoading" id-name="parkingMap5"/>
                <!-- 柱状图 -->
                <div class="chart-overlay2">
                  <div class="chart-cards2">
                    <div class="chart-card" style="width: 520px;">
                      <VerticalBar4
                        :key="topMainChartRefreshKey"
                        :x-axis="sceneDisposalEffectCompareData.xAxis"
                        :series="sceneDisposalEffectCompareData.series"
                        unit="个/辆"
                        title="现场处置成效对比"
                        :base-font-scale="sceneSituationBaseFontScale"
                        :show-label="true"
                        :show-legend="true"
                        style="width:100%;height:100%"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="activeSceneSituationView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="sceneSituationList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openSceneSituationDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="taskEmergencyEmergencyId"
                      label="应急事件ID"
                      align="center"
                    />
                    <ElTableColumn
                      prop="tbAssetExtendAddress"
                      label="现场位置"
                      align="center"
                      min-width="180"
                    />
                    <ElTableColumn
                      prop="taskEmergencySceneSceneStatus"
                      label="现场状态"
                      align="center"
                    >
                      <template #default="scope">
                        <ElTag :type="scope.row.taskEmergencySceneSceneStatus === '已处置' ? 'success' :
                      scope.row.taskEmergencySceneSceneStatus === '处置中' ? 'warning' : 'danger'">
                          {{ scope.row.taskEmergencySceneSceneStatus || '-' }}
                        </ElTag>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="taskEmergencySceneAffectedBerthCount"
                      label="受影响泊位数"
                      align="center"
                    />
                    <ElTableColumn
                      prop="taskEmergencySceneEvacuatedVehicleCount"
                      label="已疏导车辆数"
                      align="center"
                    />
                    <ElTableColumn
                      prop="taskEmergencySceneRepairBerthCount"
                      label="已修复泊位数"
                      align="center"
                    />
                    <ElTableColumn
                      label="操作"
                      align="center"
                      width="160"
                      fixed="right"
                    >
                      <template #default="scope">
                        <ElButton
                          type="success"
                          size="small"
                          plain
                          @click.stop="contactScenePersonData(scope.row.taskEmergencyEmergencyId)"
                          style="margin-left: 8px;"
                        >
                          联系
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
        <div class="panel bottom-left" ref="bottomLeftPanel">
          <div class="header-actions">
            <div class="actions-left"><p>指挥调度</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton v-for="item in dispatchTaskViewBtnList" :key="item" :type="activeDispatchTaskView === item ? 'primary' : ''" plain @click="changeDispatchTaskView(item)" class="view-btn">{{ item }}</ElButton>
              </div>
              <button class="control-btn" @click="refreshDispatchTaskData">
                <el-icon color="#409eff" size="16"><Refresh /></el-icon>
              </button>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('bottomLeftPanel')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div v-if="activeDispatchTaskView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1" style="cursor: default">
                <div class="indicator-title">待执行任务数</div>
                <div class="indicator-value"><span :data-value="dispatchTaskIndicators.pendingCount" class="dispatch-task-number-animate">{{ dispatchTaskIndicators.pendingCount }}</span></div>
                <div class="indicator-unit">个</div>
              </div>
              <div class="indicator-card1 card2" style="cursor: default">
                <div class="indicator-title">执行中任务数</div>
                <div class="indicator-value"><span :data-value="dispatchTaskIndicators.executingCount" class="dispatch-task-number-animate">{{ dispatchTaskIndicators.executingCount }}</span></div>
                <div class="indicator-unit">个</div>
              </div>
              <div class="indicator-card1 card3" style="cursor: default">
                <div class="indicator-title">已完成任务数</div>
                <div class="indicator-value"><span :data-value="dispatchTaskIndicators.completedCount" class="dispatch-task-number-animate">{{ dispatchTaskIndicators.completedCount }}</span></div>
                <div class="indicator-unit">个</div>
              </div>
            </div>
          </div>
          <div v-if="activeDispatchTaskView === '柱状图'" class="view-content" style="box-sizing: border-box; width: 100%; height: 100%;padding:0.3vw" :key="dispatchTaskChartRefreshKey">
            <VerticalBar3 :x-axis="dispatchTaskReceiverCompareData.xAxis" :series="dispatchTaskReceiverCompareData.series" unit="个" title="不同接收人任务完成情况对比" :base-font-scale="dispatchTaskBaseFontScale" :active-indices="dispatchTaskActiveIndices" style="width:100%;height:100%"/>
          </div>
          <div v-if="activeDispatchTaskView === '列表'" class="view-content">
            <div class="table-box3">
              <ElTable class="table3" :data="dispatchTaskList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row>
                <ElTableColumn prop="dispatchTaskId" label="调度任务ID" align="center" />
                <ElTableColumn prop="taskContent" label="任务内容" align="center" min-width="200px" />
                <ElTableColumn prop="dispatchType" label="调度类型" align="center"><template #default="scope">{{ getDispatchTypeName(scope.row.dispatchType) }}</template></ElTableColumn>
                <ElTableColumn prop="resourceId" label="资源ID" align="center" />
                <ElTableColumn prop="address" label="目标位置" align="center" min-width="150px" />
                <ElTableColumn prop="userId" label="调度人ID" align="center" />
                <ElTableColumn prop="maintainUserId" label="接收人ID" align="center" />
                <ElTableColumn prop="taskStatus" label="任务状态" align="center"><template #default="scope"><ElTag :type="getDispatchTaskStatusTag(scope.row.taskStatus)">{{ getDispatchTaskStatusName(scope.row.taskStatus) }}</ElTag></template></ElTableColumn>
                <ElTableColumn prop="dispatchTime" label="调度时间" align="center"><template #default="scope">{{ formatTimeStamp(scope.row.dispatchTime) }}</template></ElTableColumn>
                <ElTableColumn prop="completeTime" label="完成时间" align="center"><template #default="scope">{{ formatTimeStamp(scope.row.completeTime) }}</template></ElTableColumn>
              </ElTable>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-middle" ref="bottomMiddlePanel">
          <div class="header-actions">
            <div class="actions-left"><p>现场处置进度</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton v-for="item in disposalProgressViewBtnList" :key="item" :type="activeDisposalProgressView === item ? 'primary' : ''" plain @click="changeDisposalProgressView(item)" class="view-btn">{{ item }}</ElButton>
              </div>
              <button class="control-btn" @click="refreshDisposalProgressData">
                <el-icon color="#409eff" size="16"><Refresh /></el-icon>
              </button>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('bottomMiddlePanel')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div v-if="activeDisposalProgressView === '卡片'" class="view-content">
            <div class="indicator-cards1">
              <div class="indicator-card1 card1" style="cursor: default">
                <div class="indicator-title">各阶段平均耗时</div>
                <div class="indicator-value"><span :data-value="(disposalProgressIndicators.avgAlarmDuration+disposalProgressIndicators.avgReceiveDuration+disposalProgressIndicators.avgArriveDuration+disposalProgressIndicators.avgDisposeDuration+disposalProgressIndicators.avgCloseDuration)/5" class="disposal-progress-number-animate">{{ ((disposalProgressIndicators.avgAlarmDuration+disposalProgressIndicators.avgReceiveDuration+disposalProgressIndicators.avgArriveDuration+disposalProgressIndicators.avgDisposeDuration+disposalProgressIndicators.avgCloseDuration)/5).toFixed(1) }}</span></div>
                <div class="indicator-unit">分钟</div>
              </div>
              <div class="indicator-card1 card2" style="cursor: default">
                <div class="indicator-title">超时处置数</div>
                <div class="indicator-value"><span :data-value="disposalProgressIndicators.timeoutDisposalCount" class="disposal-progress-number-animate">{{ disposalProgressIndicators.timeoutDisposalCount }}</span></div>
                <div class="indicator-unit">个</div>
              </div>
            </div>
          </div>
          <div v-if="activeDisposalProgressView === '折线图'" class="view-content" style="box-sizing: border-box; width:100%;height:100%;padding:0.3vw" :key="disposalProgressChartRefreshKey">
            <ChartLine1 :data="disposalProgressTrendData" title="处置进度时间趋势" y-axis-name="分钟" :base-font-scale="disposalProgressBaseFontScale" style="width:100%;height:100%"/>
          </div>
          <div v-if="activeDisposalProgressView === '列表'" class="view-content">
            <div class="table-box1">
              <ElTable class="table1" :data="disposalProgressList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row>
                <ElTableColumn prop="emergencyId" label="应急事件ID" align="center" />
                <ElTableColumn prop="disposalStage" label="处置阶段" align="center"><template #default="scope">{{ getDisposalStageName(scope.row.disposalStage) }}</template></ElTableColumn>
                <ElTableColumn prop="stageStartTime" label="阶段开始时间" align="center"><template #default="scope">{{ formatTimeStamp(scope.row.stageStartTime) }}</template></ElTableColumn>
                <ElTableColumn prop="stageEndTime" label="阶段结束时间" align="center"><template #default="scope">{{ formatTimeStamp(scope.row.stageEndTime) }}</template></ElTableColumn>
                <ElTableColumn prop="responsibleUnit" label="责任单位" align="center" min-width="120px" />
                <ElTableColumn prop="disposalMeasure" label="处置措施" align="center" min-width="200px" />
                <ElTableColumn prop="arrivalDuration" label="到场时长" align="center"><template #default="scope">{{ formatDuration(scope.row.arrivalDuration) }}</template></ElTableColumn>
                <ElTableColumn prop="disposalDuration" label="处置时长" align="center"><template #default="scope">{{ formatDuration(scope.row.disposalDuration) }}</template></ElTableColumn>
              </ElTable>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-right" ref="bottomRightPanel">
          <el-tabs v-model="topRightActiveTab" class="common-tabs" @tab-change="handleTabChange">
            <el-tab-pane label="应急方案" name="tab1">
              <div class="header-actions">
                <div class="actions-left"></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton v-for="item in emergencyPlanViewBtnList" :key="item" :type="activeEmergencyPlanView === item ? 'primary' : ''" plain @click="changeEmergencyPlanView(item)" class="view-btn">{{ item }}</ElButton>
                  </div>
                  <button class="control-btn" @click="refreshEmergencyPlanData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('bottomRightPanel')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div v-if="activeEmergencyPlanView === '卡片'" class="view-content">
                <div class="indicator-cards1">
                  <div class="indicator-card1 card1" style="cursor: default">
                    <div class="indicator-title">已启动方案数</div>
                    <div class="indicator-value"><span :data-value="emergencyPlanIndicators.launchedCount" class="emergency-plan-number-animate">{{ emergencyPlanIndicators.launchedCount }}</span></div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card1 card2" style="cursor: default">
                    <div class="indicator-title">执行中方案数</div>
                    <div class="indicator-value"><span :data-value="emergencyPlanIndicators.executingCount" class="emergency-plan-number-animate">{{ emergencyPlanIndicators.executingCount }}</span></div>
                    <div class="indicator-unit">个</div>
                  </div>
                </div>
              </div>
              <div v-if="activeEmergencyPlanView === '饼图'" class="view-content" style="box-sizing: border-box; width:100%;height:100%;padding:0.3vw" :key="emergencyPlanChartRefreshKey">
                <ChartPie3 :data="emergencyPlanTypeRatioData" title="方案适配应急类型占比" :base-font-scale="emergencyPlanBaseFontScale" :active-indices="emergencyPlanActiveIndices" style="width:100%;height:100%"/>
              </div>
              <div v-if="activeEmergencyPlanView === '列表'" class="view-content">
                <div class="table-box3">
                  <ElTable class="table3" :data="emergencyPlanList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row>
                    <ElTableColumn prop="emergency_plan_id" label="应急方案ID" align="center" />
                    <ElTableColumn prop="plan_name" label="方案名称" align="center" min-width="180px" />
                    <ElTableColumn prop="emergency_type" label="适配应急类型" align="center"><template #default="scope">{{ getEmergencyTypeName(scope.row.emergency_type) }}</template></ElTableColumn>
                    <ElTableColumn prop="execution_step" label="执行步骤" align="center" min-width="200px" />
                    <ElTableColumn prop="responsibility_division" label="责任分工" align="center" min-width="150px" />
                    <ElTableColumn prop="resource_demand" label="资源需求" align="center" min-width="150px" />
                    <ElTableColumn prop="plan_status" label="方案状态" align="center"><template #default="scope"><ElTag :type="getPlanStatusTag(scope.row.plan_status)">{{ getPlanStatusName(scope.row.plan_status) }}</ElTag></template></ElTableColumn>
                    <ElTableColumn prop="launch_time" label="启动时间" align="center"><template #default="scope">{{ formatTimeStamp(scope.row.launch_time) }}</template></ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="协同指挥" name="tab2">
              <div class="header-actions">
                <div class="actions-left"></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in cooperationViewBtnList"
                      :key="item"
                      :type="activeCooperationView === item ? 'primary' : ''"
                      plain
                      @click="changeCooperationView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <button class="control-btn" @click="refreshCooperationData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('bottomRightPanel')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <!-- 卡片视图 -->
              <div v-if="activeCooperationView === '卡片'" class="view-content">
                <div class="indicator-cards1">
                  <div class="indicator-card1 card1" style="cursor: default">
                    <div class="indicator-title">协同事件总数</div>
                    <div class="indicator-value">
          <span :data-value="cooperationIndicators.totalCooperationCount" class="cooperation-number-animate">
            {{ cooperationIndicators.totalCooperationCount }}
          </span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card1 card2" style="cursor: default">
                    <div class="indicator-title">响应率</div>
                    <div class="indicator-value">
          <span :data-value="cooperationIndicators.responseRate" class="cooperation-number-animate">
            {{ cooperationIndicators.responseRate.toFixed(1) }}
          </span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card1 card3" style="cursor: default">
                    <div class="indicator-title">配合成效达标数</div>
                    <div class="indicator-value">
          <span :data-value="cooperationIndicators.effectStandardCount" class="cooperation-number-animate">
            {{ cooperationIndicators.effectStandardCount }}
          </span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                </div>
              </div>
              <!-- 柱状图视图 -->
              <div v-if="activeCooperationView === '柱状图'" class="view-content" style="display: flex; flex-direction: column; height: 100%;">
                <div style="flex: 1; padding: 0.3vw;">
                  <VerticalBar3
                    :key="cooperationChartRefreshKey"
                    :x-axis="cooperationTypeCompareData.xAxis"
                    :series="cooperationTypeCompareData.series"
                    unit="个"
                    title="不同协同类型联动数对比"
                    :base-font-scale="cooperationBaseFontScale"
                    :active-indices="cooperationActiveIndices"
                    style="width:100%;height:100%"
                  />
                </div>
                <div style="flex: 1; padding: 0.3vw;">
                  <VerticalBar3
                    :key="cooperationChartRefreshKey"
                    :x-axis="cooperationDeptCompareData.xAxis"
                    :series="cooperationDeptCompareData.series"
                    unit="个"
                    title="不同参与单位联动数对比"
                    :base-font-scale="cooperationBaseFontScale"
                    :active-indices="cooperationActiveIndices"
                    style="width:100%;height:100%"
                  />
                </div>
              </div>
              <!-- 饼图视图 -->
              <div v-if="activeCooperationView === '饼图'" class="view-content" style="box-sizing: border-box; width:100%;height:100%;padding:0.3vw; display: flex; gap: 0.3vw;">
                <div style="flex: 1; height: 100%;">
                  <ChartPie4
                    :key="cooperationChartRefreshKey"
                    :data="cooperationTypeRatioData"
                    title="协同类型占比"
                    :base-font-scale="cooperationBaseFontScale"
                    :active-indices="cooperationActiveIndices"
                    style="width:100%;height:100%"
                  />
                </div>
                <div style="flex: 1; height: 100%;">
                  <ChartPie2
                    :key="cooperationChartRefreshKey"
                    :data="cooperationStatusRatioData"
                    title="响应状态占比"
                    :base-font-scale="cooperationBaseFontScale"
                    :active-indices="cooperationActiveIndices"
                    style="width:100%;height:100%"
                  />
                </div>
              </div>
              <!-- 列表视图 -->
              <div v-if="activeCooperationView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="cooperationList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openCooperationDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="taskCooperationCooperationId"
                      label="协同ID"
                      align="center"
                    />
                    <ElTableColumn
                      prop="sysCooperationTypeName"
                      label="协同类型"
                      align="center"
                    />
                    <ElTableColumn
                      prop="taskCooperationTaskContent"
                      label="协同任务"
                      align="center"
                      min-width="200px"
                    />
                    <ElTableColumn
                      prop="sysDeptDeptName"
                      label="参与单位"
                      align="center"
                    />
                    <ElTableColumn
                      prop="taskCooperationCreateTime"
                      label="发起时间"
                      align="center"
                    >
                      <template #default="scope">{{ formatTimeStamp(scope.row.taskCooperationCreateTime) }}</template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="sysResponseStatusName"
                      label="响应状态"
                      align="center"
                    >
                      <template #default="scope">
                        <ElTag :type="getCooperationStatusTag(scope.row.sysResponseStatusName)">
                          {{ scope.row.sysResponseStatusName || '-' }}
                        </ElTag>
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
                          v-if="scope.row.sysResponseStatusName === '待响应'"
                          type="primary"
                          size="small"
                          plain
                          @click.stop="openCooperationResponseDialog(scope.row)"
                          style="margin-left: 8px;"
                        >
                          响应
                        </ElButton>
                        <ElButton
                          v-if="scope.row.sysResponseStatusName === '已响应'"
                          type="success"
                          size="small"
                          plain
                          @click.stop="openCooperationFeedbackDialog(scope.row)"
                          style="margin-left: 8px;"
                        >
                          反馈
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
      <el-dialog v-model="orbitConfigDialogVisible" title="地图环绕配置" width="40%" @close="resetOrbitConfigForm">
        <ElForm :model="orbitConfigForm" label-width="150px" :rules="orbitConfigRules" ref="orbitConfigFormRef">
          <ElFormItem label="旋转中心点纬度" prop="centerLat"><ElInput v-model.number="orbitConfigForm.centerLat" step="0.01" precision="6"/></ElFormItem>
          <ElFormItem label="旋转中心点经度" prop="centerLng"><ElInput v-model.number="orbitConfigForm.centerLng" step="0.01" precision="6"/></ElFormItem>
          <ElFormItem label="旋转速度(度/帧)" prop="rotateSpeed"><ElInput v-model.number="orbitConfigForm.rotateSpeed" min="0.01" max="1" step="0.01"/></ElFormItem>
          <ElFormItem label="地图俯仰角" prop="pitch"><ElInput v-model.number="orbitConfigForm.pitch" min="0" max="80" step="1"/></ElFormItem>
          <ElFormItem label="地图缩放级别" prop="zoom"><ElInput v-model.number="orbitConfigForm.zoom" min="1" max="20" step="1"/></ElFormItem>
          <ElFormItem label="是否循环旋转" prop="loop"><ElSwitch v-model="orbitConfigForm.loop" active-text="是" inactive-text="否"/></ElFormItem>
          <ElFormItem><ElButton type="text" @click="resetToDefaultConfig">恢复默认配置</ElButton></ElFormItem>
        </ElForm>
        <template #footer>
          <ElButton @click="orbitConfigDialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="submitOrbitConfig">确认配置</ElButton>
        </template>
      </el-dialog>

      <!-- 应急态势详情弹窗 -->
      <el-dialog
        v-model="emergencySituationDetailDialogVisible"
        width="60%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="应急态势详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in emergencySituationDetailViewBtnList"
                :key="item"
                :type="activeEmergencySituationDetailView === item ? 'primary' : ''"
                plain
                @click="changeEmergencySituationDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <!-- 事件详情视图 -->
        <div v-if="activeEmergencySituationDetailView === '事件详情'" class="view-content" style="padding:0; height: 60vh; overflow-y: auto;">
          <div style="display: flex; gap: 20px; margin-bottom: 20px; width: 100%;">
            <div style="flex: 1;">
              <ElDescriptions bordered :column="2" class="desc-detail">
                <ElDescriptionsItem label="应急事件ID">
                  {{ emergencySituationDetailSelectedRow.taskEmergencyEmergencyId || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="应急等级">
                  <ElTag :type="emergencySituationDetailSelectedRow.sysEmergencyLevelName === '一级' ? 'danger' :
                   emergencySituationDetailSelectedRow.sysEmergencyLevelName === '二级' ? 'warning' :
                   emergencySituationDetailSelectedRow.sysEmergencyLevelName === '三级' ? 'primary' : 'info'">
                    {{ emergencySituationDetailSelectedRow.sysEmergencyLevelName || '-' }}
                  </ElTag>
                </ElDescriptionsItem>
                <ElDescriptionsItem label="应急类型">
                  {{ emergencySituationDetailSelectedRow.sysEmergencyTypeName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="发生时间">
                  {{ formatTimeStamp(emergencySituationDetailSelectedRow.taskEmergencyEmergencyTime) }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="发生位置">
                  {{ emergencySituationDetailSelectedRow.tbAssetExtendAddress || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="受影响车辆数">
                  {{ emergencySituationDetailSelectedRow.taskEmergencyAffectedVehicleCount || 0 }} 辆
                </ElDescriptionsItem>
                <ElDescriptionsItem label="救援进度">
                  <ElTag :type="emergencySituationDetailSelectedRow.sysRescueProgressName === '已处置' ? 'success' :
                   emergencySituationDetailSelectedRow.sysRescueProgressName === '处置中' ? 'warning' : 'danger'">
                    {{ emergencySituationDetailSelectedRow.sysRescueProgressName || '-' }}
                  </ElTag>
                </ElDescriptionsItem>
                <ElDescriptionsItem label="关联资产名称">
                  {{ emergencySituationDetailSelectedRow.tbAssetExtendName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="处置团队">
                  {{ emergencySituationDetailSelectedRow.sysMaintainUserTeamName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="事件描述">
                  {{ emergencySituationDetailSelectedRow.eventDetail.description || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="事件原因">
                  {{ emergencySituationDetailSelectedRow.eventDetail.cause || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="严重程度">
                  {{ emergencySituationDetailSelectedRow.eventDetail.severity || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="影响时长">
                  {{ emergencySituationDetailSelectedRow.eventDetail.impactTime || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="影响范围">
                  {{ emergencySituationDetailSelectedRow.taskEmergencyInfluenceRange || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="响应时间">
                  {{ formatTimeStamp(emergencySituationDetailSelectedRow.taskEmergencyResponseTime) }}
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
            <div style="flex: 1;">
              <div style="margin-top: 20px;">
                <strong>现场照片：</strong>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                  <div
                    v-for="(photo, index) in emergencySituationDetailSelectedRow.scenePhotos"
                    :key="index"
                    @click="openScenePhotoDialog(photo)"
                    style="width: 80px; height: 60px; cursor: pointer; border: 1px solid #ddd; border-radius: 4px; overflow: hidden;"
                  >
                    <div style="width: 100%; height: 100%; background: #f5f5f5; display: flex; align-items: center; justify-content: center;">
                      <el-icon size="24"><Picture /></el-icon>
                    </div>
                    <div style="font-size: 12px; text-align: center; padding: 4px;">照片{{ index + 1 }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 影响分析视图 -->
        <div v-if="activeEmergencySituationDetailView === '影响分析'" class="view-content" style="padding:0;">
          <div style="width: 100%;">
            <ElDescriptions bordered :column="3" class="desc-detail" title="影响范围分析">
              <ElDescriptionsItem label="受影响停车场数量">
                {{ emergencySituationDetailSelectedRow.influenceAnalysis.affectedParkingCount || 0 }} 个
              </ElDescriptionsItem>
              <ElDescriptionsItem label="受影响车辆总数">
                {{ emergencySituationDetailSelectedRow.influenceAnalysis.affectedVehicleCount || 0 }} 辆
              </ElDescriptionsItem>
              <ElDescriptionsItem label="预估经济损失">
                {{ emergencySituationDetailSelectedRow.influenceAnalysis.estimatedLoss || '-' }}
              </ElDescriptionsItem>
              <ElDescriptionsItem label="交通影响">
                {{ emergencySituationDetailSelectedRow.influenceAnalysis.trafficImpact || '-' }}
              </ElDescriptionsItem>
              <ElDescriptionsItem label="预计恢复时间">
                {{ emergencySituationDetailSelectedRow.influenceAnalysis.expectedRecoveryTime || '-' }}
              </ElDescriptionsItem>
            </ElDescriptions>
          </div>
        </div>
        <!-- 调度信息视图 -->
        <div v-if="activeEmergencySituationDetailView === '调度信息'" class="view-content" style="padding:0;">
          <div style="width: 100%;">
            <div style="margin-bottom: 20px;">
              <h3>已调度资源</h3>
              <ElTable
                :data="emergencySituationDetailSelectedRow.dispatchInfo.dispatchedResources"
                border
                size="small"
                width="100%"
                table-layout="fixed"
              >
                <ElTableColumn
                  prop="type"
                  label="资源类型"
                  align="center"
                />
                <ElTableColumn
                  prop="count"
                  label="数量"
                  align="center"
                />
                <ElTableColumn
                  prop="status"
                  label="状态"
                  align="center"
                >
                  <template #default="scope">
                    <ElTag :type="scope.row.status === '已到达' ? 'success' :
                     scope.row.status === '途中' ? 'warning' : 'info'">
                      {{ scope.row.status || '-' }}
                    </ElTag>
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
            <div>
              <ElDescriptions bordered :column="1" class="desc-detail" title="协同信息">
                <ElDescriptionsItem label="协同单位">
                  <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                    <el-tag v-for="(unit, index) in emergencySituationDetailSelectedRow.dispatchInfo.cooperatingUnits" :key="index">
                      {{ unit }}
                    </el-tag>
                  </div>
                </ElDescriptionsItem>
                <ElDescriptionsItem label="协同措施">
                  <el-tag>
                    {{ emergencySituationDetailSelectedRow.dispatchInfo.coordinationMeasures || '-' }}
                  </el-tag>
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
          </div>
        </div>
        <!-- 救援进度视图 -->
        <div v-if="activeEmergencySituationDetailView === '救援进度'" class="view-content" style="padding:0;">
          <div style="width: 100%;">
            <div style="display: flex; gap: 20px; margin-bottom: 20px;">
              <div style="flex: 1;">
                <ElDescriptions bordered :column="1" class="desc-detail" title="救援进度概览">
                  <ElDescriptionsItem label="当前阶段">
                    <el-tag>
                      {{ emergencySituationDetailSelectedRow.rescueProgress.currentStage || '-' }}
                    </el-tag>
                  </ElDescriptionsItem>
                  <ElDescriptionsItem label="进度百分比">
                    <el-progress
                      :percentage="emergencySituationDetailSelectedRow.rescueProgress.progressPercentage || 0"
                      :stroke-width="12"
                      style="flex: 1;"
                    />
                  </ElDescriptionsItem>
                  <ElDescriptionsItem label="下一步计划">
                    <el-tag>
                      {{ emergencySituationDetailSelectedRow.rescueProgress.nextStep || '-' }}
                    </el-tag>
                  </ElDescriptionsItem>
                </ElDescriptions>
              </div>
              <div style="flex: 1;">
                <div style="margin-bottom: 20px;">
                  <h3>已完成任务：</h3>
                  <ul style="margin: 0; padding-left: 20px;">
                    <el-tag v-for="(task, index) in emergencySituationDetailSelectedRow.rescueProgress.completedTasks" :key="index">
                      {{ task }}
                    </el-tag>
                  </ul>
                </div>
                <div>
                  <h3>待完成任务：</h3>
                  <ul style="margin: 0; padding-left: 20px;">
                    <el-tag v-for="(task, index) in emergencySituationDetailSelectedRow.rescueProgress.pendingTasks" :key="index">
                      {{ task }}
                    </el-tag>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeEmergencySituationDetailDialog">关闭</ElButton>
        </template>
      </el-dialog>
      <!-- 应急态势调度弹窗 -->
      <el-dialog
        v-model="emergencySituationDispatchDialogVisible"
        width="50%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="park-dialog"
        center
        destroy-on-close
        title="发起资源调度"
      >
        <el-form
          ref="dispatchFormRef"
          :model="dispatchForm"
          :rules="dispatchFormRules"
          label-width="120px"
          style="width: 100%;"
        >
          <el-form-item label="资源类型" prop="resourceType">
            <el-radio-group
              v-model="dispatchForm.resourceType"
              placeholder="请选择资源类型"
              style="width: 100%;"
            >
              <el-radio label="维修人员" value="维修人员" />
              <el-radio label="疏导人员" value="疏导人员" />
              <el-radio label="应急车辆" value="应急车辆" />
              <el-radio label="救援设备" value="救援设备" />
              <el-radio label="医疗人员" value="医疗人员" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="资源数量" prop="resourceCount">
            <el-input-number
              v-model="dispatchForm.resourceCount"
              :min="1"
              :max="50"
              style="width: 100%;"
            />
          </el-form-item>
          <el-form-item label="紧急程度" prop="urgencyLevel">
            <el-radio-group
              v-model="dispatchForm.urgencyLevel"
              placeholder="请选择紧急程度"
              style="width: 100%;"
            >
              <el-radio label="一般" value="一般" />
              <el-radio label="紧急" value="紧急" />
              <el-radio label="特急" value="特急" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="协同单位" prop="cooperatingUnits">
            <el-checkbox-group v-model="dispatchForm.cooperatingUnits">
              <div style="display: flex; gap: 8px; padding: 10px; border: 1px solid #dcdfe6; border-radius: 4px;">
                <el-checkbox label="交警支队" value="交警支队" />
                <el-checkbox label="消防救援大队" value="消防救援大队" />
                <el-checkbox label="医疗急救中心" value="医疗急救中心" />
                <el-checkbox label="市政工程处" value="市政工程处" />
                <el-checkbox label="电力公司" value="电力公司" />
              </div>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="调度指令">
            <el-input
              v-model="dispatchForm.instructions"
              type="textarea"
              :rows="4"
              placeholder="请输入调度指令（可选）"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <ElButton plain @click="closeEmergencySituationDispatchDialog">取消</ElButton>
          <ElButton type="primary" @click="dispatchEmergencyResourceData">确认调度</ElButton>
        </template>
      </el-dialog>

      <!-- 资源详情弹窗 -->
      <el-dialog
        v-model="resourceDetailDialogVisible"
        width="60%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="资源详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in resourceDetailViewBtnList"
                :key="item"
                :type="activeResourceDetailView === item ? 'primary' : ''"
                plain
                @click="changeResourceDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <!-- 资源详情视图 -->
        <div v-if="activeResourceDetailView === '资源详情'" class="view-content" style="padding:0;">
          <div style="display: flex; gap: 20px; margin-bottom: 20px; width: 100%;">
            <div style="flex: 1;">
              <ElDescriptions bordered :column="1" class="desc-detail" title="基本信息">
                <ElDescriptionsItem label="资源ID">
                  {{ resourceDetailSelectedRow.taskEmergencyResourceResourceId || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="资源类型">
                  {{ resourceDetailSelectedRow.sysResourceTypeName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="资源名称">
                  {{ resourceDetailSelectedRow.taskEmergencyResourceResourceName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="存储位置">
                  {{ resourceDetailSelectedRow.tbAssetExtendAddress || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="资源状态">
                  <ElTag :type="getResourceStatusTag(resourceDetailSelectedRow.sysResourceStatusName)">
                    {{ resourceDetailSelectedRow.sysResourceStatusName || '-' }}
                  </ElTag>
                </ElDescriptionsItem>
                <ElDescriptionsItem label="所属部门">
                  {{ resourceDetailSelectedRow.sysDeptDeptName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="资源数量">
                  {{ resourceDetailSelectedRow.taskEmergencyResourceQuantity || 0 }} 个
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
            <div style="flex: 1;">
              <ElDescriptions bordered :column="1" class="desc-detail" title="负责人信息">
                <ElDescriptionsItem label="负责人">
                  {{ resourceDetailSelectedRow.sysUserUserName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="联系方式">
                  {{ resourceDetailSelectedRow.sysUserUserPhone || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="距离目标事件">
                  {{ resourceDetailSelectedRow.distanceToTarget || '-' }}
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
            <div style="flex: 1;">
              <ElDescriptions bordered :column="1" class="desc-detail" title="资源详细信息">
                <ElDescriptionsItem label="生产厂家">
                  {{ resourceDetailSelectedRow.resourceDetail.manufacturer || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="采购日期">
                  {{ formatTimeStamp(resourceDetailSelectedRow.resourceDetail.purchaseDate) }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="保修期限">
                  {{ resourceDetailSelectedRow.resourceDetail.warrantyPeriod || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="规格参数">
                  {{ resourceDetailSelectedRow.resourceDetail.specifications || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="保养记录">
                  {{ resourceDetailSelectedRow.resourceDetail.maintenanceRecord || '-' }}
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
          </div>
        </div>
        <!-- 库存明细视图 -->
        <div v-if="activeResourceDetailView === '库存明细'" class="view-content" style="padding:0;">
          <div style=" width: 100%;">
            <ElTable
              :data="resourceDetailSelectedRow.inventoryDetails"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="itemId"
                label="物品ID"
                align="center"
              />
              <ElTableColumn
                prop="itemName"
                label="物品名称"
                align="center"
              />
              <ElTableColumn
                prop="quantity"
                label="数量"
                align="center"
              />
              <ElTableColumn
                prop="status"
                label="状态"
                align="center"
              >
                <template #default="scope">
                  <ElTag :type="scope.row.status === '完好' ? 'success' : 'warning'">
                    {{ scope.row.status || '-' }}
                  </ElTag>
                </template>
              </ElTableColumn>
            </ElTable>
          </div>
        </div>
        <!-- 使用记录视图 -->
        <div v-if="activeResourceDetailView === '使用记录'" class="view-content" style="padding:0;">
          <div style=" width: 100%;">
            <ElTable
              :data="resourceDetailSelectedRow.usageRecords"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="time"
                label="使用时间"
                align="center"
              >
                <template #default="scope">
                  {{ formatTimeStamp(scope.row.time) }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="eventId"
                label="应急事件ID"
                align="center"
              />
              <ElTableColumn
                prop="duration"
                label="使用时长"
                align="center"
              />
              <ElTableColumn
                prop="operator"
                label="操作人员"
                align="center"
              />
            </ElTable>
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeResourceDetailDialog">关闭</ElButton>
        </template>
      </el-dialog>
      <!-- 资源调度弹窗 -->
      <el-dialog
        v-model="resourceDispatchDialogVisible"
        width="40%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        center
        destroy-on-close
        title="资源调度"
      >
        <div style="padding: 20px;">
          <ElForm
            :model="dispatchResourceForm"
            :rules="dispatchResourceFormRules"
            label-width="120px"
            ref="dispatchResourceFormRef"
          >
            <ElFormItem label="资源ID">
              <div>{{ resourceDetailSelectedRow.taskEmergencyResourceResourceId }}</div>
            </ElFormItem>
            <ElFormItem label="资源名称">
              <div>{{ resourceDetailSelectedRow.taskEmergencyResourceResourceName }}</div>
            </ElFormItem>
            <ElFormItem label="存储位置">
              <div>{{ resourceDetailSelectedRow.tbAssetExtendAddress }}</div>
            </ElFormItem>
            <ElFormItem label="调度指令" prop="instruction">
              <ElInput
                v-model="dispatchResourceForm.instruction"
                type="textarea"
                :rows="3"
                placeholder="请输入调度指令（可选）"
              />
            </ElFormItem>
            <ElFormItem label="预计送达时间" prop="estimatedArrivalTime" required>
              <ElInput
                v-model="dispatchResourceForm.estimatedArrivalTime"
                type="datetime-local"
                placeholder="请选择预计送达时间"
              />
            </ElFormItem>
            <ElFormItem>
              <div style="color: #f56c6c; font-size: 12px;">
                注意：提交后资源状态将更新为"调度中"
              </div>
            </ElFormItem>
          </ElForm>
        </div>
        <template #footer>
          <ElButton plain @click="closeResourceDispatchDialog">取消</ElButton>
          <ElButton type="primary" @click="dispatchResourceData">确认调度</ElButton>
        </template>
      </el-dialog>

      <!-- 专项应急详情弹窗 -->
      <el-dialog
        v-model="specialEmergencyDetailDialogVisible"
        width="50%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="专项应急详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in specialEmergencyDetailViewBtnList"
                :key="item"
                :type="activeSpecialEmergencyDetailView === item ? 'primary' : ''"
                plain
                @click="changeSpecialEmergencyDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <!-- 专项应急详情视图 -->
        <div v-if="activeSpecialEmergencyDetailView === '专项应急详情'" class="view-content" style="padding:0;">
          <div style="display: flex; gap: 20px; margin-bottom: 20px; width: 100%;">
            <div style="flex: 1;">
              <ElDescriptions bordered :column="2" class="desc-detail" title="基本信息">
                <ElDescriptionsItem label="专项应急ID">
                  {{ specialEmergencyDetailSelectedRow.taskSpecialEmergencySpecialEmergencyId || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="应急场景">
                  {{ specialEmergencyDetailSelectedRow.sysEmergencyScenarioName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="受困车辆数">
                  {{ specialEmergencyDetailSelectedRow.taskSpecialEmergencyTrappedVehicleCount || 0 }} 辆
                </ElDescriptionsItem>
                <ElDescriptionsItem label="疏散通道">
                  {{ specialEmergencyDetailSelectedRow.taskSpecialEmergencyEvacuationRoute || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="安全出口">
                  {{ specialEmergencyDetailSelectedRow.tbAssetExtendAddress || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="处置进度">
                  <ElTag :type="specialEmergencyDetailSelectedRow.sysDisposalProgressName === '已处置' ? 'success' :
                    specialEmergencyDetailSelectedRow.sysDisposalProgressName === '处置中' ? 'warning' : 'danger'">
                    {{ specialEmergencyDetailSelectedRow.sysDisposalProgressName || '-' }}
                  </ElTag>
                </ElDescriptionsItem>
                <ElDescriptionsItem label="疏散进度">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <el-progress
                      :percentage="specialEmergencyDetailSelectedRow.taskSpecialEmergencyEvacuationProgress || 0"
                      :stroke-width="12"
                      style="flex: 1;"
                    />
                  </div>
                </ElDescriptionsItem>
                <ElDescriptionsItem label="抢修进度">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <el-progress
                      :percentage="specialEmergencyDetailSelectedRow.parkFaultRepairProgress || 0"
                      :stroke-width="12"
                      style="flex: 1;"
                    />
                  </div>
                </ElDescriptionsItem>
                <ElDescriptionsItem label="现场负责人">
                  {{ specialEmergencyDetailSelectedRow.sysUserUserName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="预计完成时间">
                  {{ formatTimeStamp(specialEmergencyDetailSelectedRow.taskSpecialEmergencyExpectedFinishTime) }}
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
          </div>
        </div>
        <!-- 处置方案视图 -->
        <div v-if="activeSpecialEmergencyDetailView === '处置方案'" class="view-content" style="padding:0;">
          <div style="padding: 15px; background: #f5f7fa; border-radius: 4px; width: 100%;">
            <h3 style="margin: 0 0 15px 0; color: #409eff;">处置方案</h3>
            <div style="white-space: pre-wrap; line-height: 1.6;">
              {{ specialEmergencyDetailSelectedRow.disposalPlan || '暂无处置方案' }}
            </div>
          </div>
        </div>
        <!-- 疏散路线视图 -->
        <div v-if="activeSpecialEmergencyDetailView === '疏散路线'" class="view-content" style="padding:0;">
          <div style="padding: 15px; background: #f5f7fa; border-radius: 4px; width: 100%;">
            <h3 style="margin: 0 0 15px 0; color: #409eff;">疏散路线</h3>
            <ElTable
              :data="specialEmergencyDetailSelectedRow.evacuationRoute"
              border
              size="small"
              width="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="name"
                label="通道名称"
                align="center"
              />
              <ElTableColumn
                prop="status"
                label="状态"
                align="center"
              >
                <template #default="scope">
                  <ElTag :type="scope.row.status === '通畅' ? 'success' : 'warning'">
                    {{ scope.row.status || '-' }}
                  </ElTag>
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="distance"
                label="距离"
                align="center"
              />
            </ElTable>
          </div>
        </div>
        <!-- 安全出口分布视图 -->
        <div v-if="activeSpecialEmergencyDetailView === '安全出口分布'" class="view-content" style="padding:0;">
          <div style="padding: 15px; background: #f5f7fa; border-radius: 4px; width: 100%;">
            <h3 style="margin: 0 0 15px 0; color: #409eff;">安全出口分布</h3>
            <ElTable
              :data="specialEmergencyDetailSelectedRow.safetyExitDistribution"
              border
              size="small"
              width="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="name"
                label="出口名称"
                align="center"
              />
              <ElTableColumn
                prop="location"
                label="位置"
                align="center"
              />
              <ElTableColumn
                prop="capacity"
                label="容量"
                align="center"
              />
            </ElTable>
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeSpecialEmergencyDetailDialog">取消</ElButton>
        </template>
      </el-dialog>
      <!-- 更新进度弹窗 -->
      <el-dialog
        v-model="updateProgressDialogVisible"
        width="40%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        center
        destroy-on-close
        title="更新处置进度"
      >
        <div style="padding: 0 20px;">
          <el-form :model="updateProgressForm" label-width="100px">
            <el-form-item label="处置进度" prop="progress" required>
              <el-radio-group v-model="updateProgressForm.progress" placeholder="请选择处置进度" style="width: 100%;">
                <el-radio label="待处置" value="待处置" />
                <el-radio label="处置中" value="处置中" />
                <el-radio label="已处置" value="已处置" />
                <el-radio label="已评估" value="已评估" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="进展说明" prop="remark">
              <el-input
                v-model="updateProgressForm.remark"
                type="textarea"
                :rows="3"
                placeholder="请输入进展说明（可选）"
              />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <ElButton plain @click="closeUpdateProgressDialog">取消</ElButton>
          <ElButton type="primary" @click="updateDisposalProgressData">确认</ElButton>
        </template>
      </el-dialog>
      <!-- 评估弹窗 -->
      <el-dialog
        v-model="assessmentDialogVisible"
        width="50%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        center
        destroy-on-close
        title="处置评估"
      >
        <div style="padding: 0 20px;">
          <el-form :model="assessmentForm" label-width="100px">
            <el-form-item label="处置评估" prop="assessment">
              <el-input
                v-model="assessmentForm.assessment"
                type="textarea"
                :rows="4"
                placeholder="请输入处置评估（可选）"
              />
            </el-form-item>
            <el-form-item label="评估报告" prop="reportUrl">
              <el-input
                v-model="assessmentForm.reportUrl"
                placeholder="请输入评估报告URL（可选）"
              />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <ElButton plain @click="closeAssessmentDialog">取消</ElButton>
          <ElButton type="primary" @click="saveDisposalAssessmentData">保存</ElButton>
        </template>
      </el-dialog>

      <!-- 资源调度详情弹窗 -->
      <el-dialog
        v-model="resourceDispatchDetailDialogVisible"
        width="60%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="资源调度详情"
      >
        <div class="view-content" style="padding:0; display: flex; gap: 20px;">
          <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 20px; width: 100%; flex: 1;">
            <div style="flex: 1;">
              <ElDescriptions bordered :column="2" class="desc-detail" title="调度信息">
                <ElDescriptionsItem label="调度记录ID">
                  {{ resourceDispatchDetailSelectedRow.taskResourceDispatchDispatchRecordId || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="资源ID">
                  {{ resourceDispatchDetailSelectedRow.taskEmergencyResourceResourceId || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="资源类型">
                  {{ resourceDispatchDetailSelectedRow.sysResourceTypeName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="调配数量">
                  {{ resourceDispatchDetailSelectedRow.taskResourceDispatchDispatchQuantity || 0 }} 个
                </ElDescriptionsItem>
                <ElDescriptionsItem label="调出位置">
                  {{ resourceDispatchDetailSelectedRow.fromAddress || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="调入位置">
                  {{ resourceDispatchDetailSelectedRow.toAddress || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="调度状态">
                  <ElTag :type="getDispatchStatusTag(resourceDispatchDetailSelectedRow.sysDispatchStatusName)">
                    {{ resourceDispatchDetailSelectedRow.sysDispatchStatusName || '-' }}
                  </ElTag>
                </ElDescriptionsItem>
                <ElDescriptionsItem label="接收人">
                  {{ resourceDispatchDetailSelectedRow.sysUserUserName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="调度时间">
                  {{ formatTimeStamp(resourceDispatchDetailSelectedRow.taskResourceDispatchDispatchTime) }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="预计到达时间">
                  {{ formatTimeStamp(resourceDispatchDetailSelectedRow.taskResourceDispatchEstimatedArrivalTime) }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="实际到达时间">
                  {{ formatTimeStamp(resourceDispatchDetailSelectedRow.taskResourceDispatchActualArrivalTime) || '-' }}
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
            <div style="flex: 1;">
              <h4 style="margin: 0 0 10px 0; color: #409eff;">资源明细</h4>
              <ElTable
                :data="resourceDispatchDetailSelectedRow.resourceDetails"
                border
                size="small"
                style="width: 100%;"
              >
                <ElTableColumn prop="name" label="资源名称" align="center" />
                <ElTableColumn prop="model" label="型号规格" align="center" />
                <ElTableColumn prop="quantity" label="数量" align="center" />
                <ElTableColumn prop="status" label="状态" align="center" />
              </ElTable>
            </div>
          </div>
          <div style="flex: 1;">
            <h4 style="color: #409eff;">调度轨迹</h4>
            <ElTable
              :data="resourceDispatchDetailSelectedRow.dispatchTrack"
              border
              size="small"
              style="width: 100%;"
            >
              <ElTableColumn prop="time" label="时间" align="center">
                <template #default="scope">
                  {{ formatTimeStamp(scope.row.time) }}
                </template>
              </ElTableColumn>
              <ElTableColumn prop="location" label="位置" align="center" />
              <ElTableColumn prop="action" label="动作" align="center" />
            </ElTable>
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeResourceDispatchDetailDialog">关闭</ElButton>
        </template>
      </el-dialog>
      <!-- 调度反馈弹窗 -->
      <el-dialog
        v-model="dispatchFeedbackDialogVisible"
        width="400px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center
        destroy-on-close
        title="调度反馈"
      >
        <ElForm :model="dispatchFeedbackForm" ref="dispatchFeedbackFormRef">
          <ElFormItem label="反馈内容" label-width="100px">
            <ElInput
              v-model="dispatchFeedbackForm.feedbackContent"
              type="textarea"
              :rows="4"
              placeholder="请输入调度反馈内容（如延迟原因等）"
            />
          </ElFormItem>
        </ElForm>
        <template #footer>
          <ElButton @click="dispatchFeedbackDialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="feedbackDispatchData">确认</ElButton>
        </template>
      </el-dialog>

      <!-- 现场态势详情弹窗 -->
      <el-dialog
        v-model="sceneSituationDetailDialogVisible"
        width="60%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="现场态势详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in sceneSituationDetailViewBtnList"
                :key="item"
                :type="activeSceneSituationDetailView === item ? 'primary' : ''"
                plain
                @click="changeSceneSituationDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <!-- 现场态势视图 -->
        <div v-if="activeSceneSituationDetailView === '现场态势'" class="view-content" style="padding:0;">
          <div style="display: flex; gap: 20px; margin-bottom: 20px; width: 100%;">
            <div style="flex: 2;">
              <ElDescriptions bordered :column="2" class="desc-detail" title="基本信息">
                <ElDescriptionsItem label="应急事件ID">
                  {{ sceneSituationDetailSelectedRow.taskEmergencyEmergencyId || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="现场位置">
                  {{ sceneSituationDetailSelectedRow.tbAssetExtendAddress || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="现场状态">
                  <ElTag :type="sceneSituationDetailSelectedRow.taskEmergencySceneSceneStatus === '已处置' ? 'success' :
                  sceneSituationDetailSelectedRow.taskEmergencySceneSceneStatus === '处置中' ? 'warning' : 'danger'">
                    {{ sceneSituationDetailSelectedRow.taskEmergencySceneSceneStatus || '-' }}
                  </ElTag>
                </ElDescriptionsItem>
                <ElDescriptionsItem label="受影响泊位数">
                  {{ sceneSituationDetailSelectedRow.taskEmergencySceneAffectedBerthCount || 0 }} 个
                </ElDescriptionsItem>
                <ElDescriptionsItem label="已疏导车辆数">
                  {{ sceneSituationDetailSelectedRow.taskEmergencySceneEvacuatedVehicleCount || 0 }} 辆
                </ElDescriptionsItem>
                <ElDescriptionsItem label="已修复泊位数">
                  {{ sceneSituationDetailSelectedRow.taskEmergencySceneRepairBerthCount || 0 }} 个
                </ElDescriptionsItem>
                <ElDescriptionsItem label="现场负责人">
                  {{ sceneSituationDetailSelectedRow.sysUserUserName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="联系方式">
                  {{ sceneSituationDetailSelectedRow.sysUserUserPhone || '-' }}
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
            <div style="flex: 1;">
              <ElDescriptions bordered :column="1" class="desc-detail" title="现场态势概览">
                <ElDescriptionsItem label="影响范围">
                  {{ sceneSituationDetailSelectedRow.sceneOverview.affectedRange || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="事件开始时间">
                  {{ formatTimeStamp(sceneSituationDetailSelectedRow.sceneOverview.startTime) }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="事件等级">
                  {{ sceneSituationDetailSelectedRow.sceneOverview.emergencyLevel || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="天气状况">
                  {{ sceneSituationDetailSelectedRow.sceneOverview.weatherCondition || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="温度">
                  {{ sceneSituationDetailSelectedRow.sceneOverview.temperature || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="风速">
                  {{ sceneSituationDetailSelectedRow.sceneOverview.windSpeed || '-' }}
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
            <div style="flex: 1;">
              <strong>现场照片：</strong>
              <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                <div
                  v-for="(photo, index) in sceneSituationDetailSelectedRow.taskEmergencySceneScenePhotos"
                  :key="index"
                  @click="openScenePhotoDialog(photo)"
                  style="width: 80px; height: 60px; cursor: pointer; border: 1px solid #ddd; border-radius: 4px; overflow: hidden;"
                >
                  <div style="width: 100%; height: 100%; background: #f5f5f5; display: flex; align-items: center; justify-content: center;">
                    <el-icon size="24"><Picture /></el-icon>
                  </div>
                  <div style="font-size: 12px; text-align: center; padding: 4px;">照片{{ index + 1 }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 实时数据视图 -->
        <div v-if="activeSceneSituationDetailView === '实时数据'" class="view-content" style="padding:0;">
          <div style="display: flex; gap: 20px; margin-bottom: 20px; width: 100%;">
            <div style="flex: 1;">
              <ElDescriptions bordered :column="1" class="desc-detail" title="实时数据监控">
                <ElDescriptionsItem label="当前疏导车辆数">
                  {{ sceneSituationDetailSelectedRow.realtimeData.currentEvacuatedCount || 0 }} 辆
                </ElDescriptionsItem>
                <ElDescriptionsItem label="当前修复泊位数">
                  {{ sceneSituationDetailSelectedRow.realtimeData.currentRepairCount || 0 }} 个
                </ElDescriptionsItem>
                <ElDescriptionsItem label="剩余受影响泊位数">
                  {{ sceneSituationDetailSelectedRow.realtimeData.remainingAffectedCount || 0 }} 个
                </ElDescriptionsItem>
                <ElDescriptionsItem label="当前在场人员数">
                  {{ sceneSituationDetailSelectedRow.realtimeData.currentPersonnelCount || 0 }} 人
                </ElDescriptionsItem>
                <ElDescriptionsItem label="疏导进度">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <el-progress
                      :percentage="sceneSituationDetailSelectedRow.realtimeData.evacuationProgress || 0"
                      :stroke-width="12"
                      style="flex: 1;"
                    />
                  </div>
                </ElDescriptionsItem>
                <ElDescriptionsItem label="修复进度">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <el-progress
                      :percentage="sceneSituationDetailSelectedRow.realtimeData.repairProgress || 0"
                      :stroke-width="12"
                      style="flex: 1;"
                    />
                  </div>
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
            <div style="flex: 1;">
              <div style="padding: 15px; background: #f5f7fa; border-radius: 4px;">
                <h3 style="margin: 0 0 15px 0; color: #409eff;">处置指令下发</h3>
                <div style="margin-bottom: 10px;">
                  <!-- Radio 选择指令 -->
                  <el-radio-group v-model="selectedDisposalInstruction" style="margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px;">
                    <el-radio
                      v-for="item in disposalInstructionOptions"
                      :key="item.value"
                      :label="item.value"
                      style="display: flex; align-items: center;"
                    >
                      {{ item.label }}
                    </el-radio>
                  </el-radio-group>
                  <!-- 自定义指令输入框（选中自定义时显示） -->
                  <el-input
                    v-if="selectedDisposalInstruction === 'custom'"
                    v-model="customDisposalInstruction"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入自定义处置指令"
                    style="margin-bottom: 15px;"
                  />
                </div>
                <!-- 提交按钮（跟随处置指令，放在实时数据视图内） -->
                <div style="text-align: right;">
                  <ElButton type="primary" @click="submitDisposalInstructionData">提交处置指令</ElButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 处置进展视图 -->
        <div v-if="activeSceneSituationDetailView === '处置进展'" class="view-content" style="padding:0; height: 50vh; overflow-y: auto;">
          <ElTable
            :data="sceneSituationDetailSelectedRow.disposalProgress"
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
            >
              <template #default="scope">
                {{ formatTimeStamp(scope.row.time) }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="action"
              label="处置动作"
              align="center"
            />
            <ElTableColumn
              prop="status"
              label="状态"
              align="center"
            >
              <template #default="scope">
                <ElTag :type="scope.row.status === '已完成' ? 'success' : 'warning'">
                  {{ scope.row.status || '-' }}
                </ElTag>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
        <template #footer>
          <ElButton plain @click="closeSceneSituationDetailDialog">取消</ElButton>
        </template>
      </el-dialog>
      <!-- 现场照片预览弹窗 -->
      <el-dialog
        v-model="scenePhotoDialogVisible"
        width="60%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        center
        destroy-on-close
        title="现场照片预览"
      >
        <div style="text-align: center;">
          <img
            :src="selectedPhotoUrl"
            style="max-width: 100%; max-height: 60vh; border-radius: 4px;"
            alt="现场照片"
          />
        </div>
        <template #footer>
          <ElButton plain @click="closeScenePhotoDialog">关闭</ElButton>
        </template>
      </el-dialog>

      <!-- 协同指挥详情弹窗 -->
      <el-dialog
        v-model="cooperationDetailDialogVisible"
        width="60%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="协同指挥详情"
      >
        <div class="view-content" style="padding:0;">
          <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 20px; width: 100%;">
            <div style="flex: 1;">
              <ElDescriptions bordered :column="3" class="desc-detail" title="协同基本信息">
                <ElDescriptionsItem label="协同ID">
                  {{ cooperationDetailSelectedRow.taskCooperationCooperationId || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="协同类型">
                  {{ cooperationDetailSelectedRow.sysCooperationTypeName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="协同任务">
                  {{ cooperationDetailSelectedRow.taskCooperationTaskContent || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="参与单位">
                  {{ cooperationDetailSelectedRow.sysDeptDeptName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="发起单位">
                  {{ cooperationDetailSelectedRow.initiatingDept || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="协同负责人">
                  {{ cooperationDetailSelectedRow.cooperationLeader || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="发起时间">
                  {{ formatTimeStamp(cooperationDetailSelectedRow.taskCooperationCreateTime) }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="响应状态">
                  <ElTag :type="getCooperationStatusTag(cooperationDetailSelectedRow.sysResponseStatusName)">
                    {{ cooperationDetailSelectedRow.sysResponseStatusName || '-' }}
                  </ElTag>
                </ElDescriptionsItem>
                <ElDescriptionsItem label="配合成效">
                  {{ cooperationDetailSelectedRow.cooperationEffect || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="完成时间">
                  {{ formatTimeStamp(cooperationDetailSelectedRow.completeTime) }}
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
            <div style="flex: 1;">
              <ElDescriptions bordered :column="3" class="desc-detail" title="参与单位信息">
                <template v-for="(unit, index) in cooperationDetailSelectedRow.participatingUnits" :key="index">
                  <ElDescriptionsItem :label="`单位${index + 1}`">
                    {{ unit.deptName }}
                  </ElDescriptionsItem>
                  <ElDescriptionsItem label="联系人">
                    {{ unit.contact }}
                  </ElDescriptionsItem>
                  <ElDescriptionsItem label="联系方式">
                    {{ unit.phone }}
                  </ElDescriptionsItem>
                </template>
              </ElDescriptions>
            </div>
            <div style="display: flex; gap: 20px; flex: 1;">
              <div style="flex: 1;">
                <h3 style="margin: 0 0 10px 0; color: #409eff;">任务要求</h3>
                <div style="padding: 15px; background: #f5f7fa; border-radius: 4px; white-space: pre-line;">
                  {{ cooperationDetailSelectedRow.taskRequirements || '暂无任务要求' }}
                </div>
              </div>
              <div style="flex: 1;">
                <h3 style="margin: 0 0 10px 0; color: #409eff;">反馈结果</h3>
                <ElTable
                  v-if="cooperationDetailSelectedRow.feedbackResults.length > 0"
                  :data="cooperationDetailSelectedRow.feedbackResults"
                  border
                  size="small"
                  width="100%"
                  table-layout="fixed"
                >
                  <ElTableColumn
                    prop="time"
                    label="反馈时间"
                    align="center"
                  >
                    <template #default="scope">{{ formatTimeStamp(scope.row.time) }}</template>
                  </ElTableColumn>
                  <ElTableColumn
                    prop="deptName"
                    label="反馈单位"
                    align="center"
                  />
                  <ElTableColumn
                    prop="feedback"
                    label="反馈内容"
                    align="center"
                    min-width="200px"
                  />
                </ElTable>
                <div v-else style="padding: 15px; background: #f5f7fa; border-radius: 4px; text-align: center;">
                  暂无反馈结果
                </div>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <div style="text-align: right;">
            <ElButton plain @click="closeCooperationDetailDialog">关闭</ElButton>
          </div>
        </template>
      </el-dialog>
      <!-- 响应协同弹窗 -->
      <el-dialog
        v-model="cooperationResponseDialogVisible"
        width="40%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        center
        destroy-on-close
        title="响应协同"
      >
        <ElForm :model="responseForm" label-width="80px">
          <ElFormItem label="响应结果" required>
            <el-radio-group v-model="responseForm.responseResult">
              <el-radio label="accept">接受</el-radio>
              <el-radio label="reject">拒绝</el-radio>
            </el-radio-group>
          </ElFormItem>
          <ElFormItem label="理由">
            <ElInput
              v-model="responseForm.reason"
              type="textarea"
              :rows="3"
              placeholder="请输入响应理由（可选）"
            />
          </ElFormItem>
        </ElForm>
        <template #footer>
          <ElButton plain @click="closeCooperationResponseDialog">取消</ElButton>
          <ElButton type="primary" @click="respondToCooperationData">确认</ElButton>
        </template>
      </el-dialog>
      <!-- 反馈协同弹窗 -->
      <el-dialog
        v-model="cooperationFeedbackDialogVisible"
        width="40%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        center
        destroy-on-close
        title="反馈协同"
      >
        <ElForm :model="feedbackForm" label-width="100px">
          <ElFormItem label="协同成效" required>
            <ElInput
              v-model="feedbackForm.cooperationEffect"
              type="textarea"
              :rows="4"
              placeholder="请输入协同成效（必填）"
            />
          </ElFormItem>
          <ElFormItem label="佐证材料">
            <el-upload
              v-model:file-list="feedbackForm.materials"
              multiple
              :limit="5"
              :on-exceed="() => ElMessage.warning('最多上传5个文件')"
            >
              <ElButton type="primary">点击上传</ElButton>
              <template #tip>
                <div class="el-upload__tip">支持上传图片、文档等文件，大小不超过10MB</div>
              </template>
            </el-upload>
          </ElFormItem>
        </ElForm>
        <template #footer>
          <ElButton plain @click="closeCooperationFeedbackDialog">取消</ElButton>
          <ElButton type="primary" @click="feedbackCooperationData">提交</ElButton>
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
@import '../../../templatesstyle/common';
@import '../../../templatesstyle/table1';
@import '../../../templatesstyle/global-data-map';
@import '../../../templatesstyle/table3';
@import '../../../templatesstyle/table4';
@import '../../../templatesstyle/indicator-cards1';
@import '../../../templatesstyle/stat-cards1';
@import '../../../templatesstyle/chart-cards2';

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
  padding: 0.3vw;
  overflow: hidden !important;
  background: url('../../images/line(1).png') rgb(255 255 255 / 4%);
  border: 0.2vh solid rgb(25 186 139 / 17%);
}

.mainbox {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.4vw;
  height: 91vh;
  margin: 0 auto;
  overflow: hidden !important;
}

.top {
  display: flex;
  gap: 0.4vw;
  height: 60%;
  overflow: hidden !important;
}
.top-middle { flex: 1; }

.bottom {
  display: flex;
  gap: 0.4vw;
  height: 38%;
  overflow: hidden !important;
}
.bottom-left, .bottom-middle, .bottom-right { flex: 1; }

:deep(.panel) {
  .el-tab-pane { display: flex; flex-direction: column; width: 100% !important; height: 100% !important; }
  .view-content { flex: 1; width: 100% !important; height: 100% !important; min-height: 0 !important; }
  .view-content > div { width: 100% !important; height: 100% !important; }
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
</style>
