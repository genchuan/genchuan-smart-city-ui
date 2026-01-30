<script setup lang="ts">
import { getCurrentInstance, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Filter, FullScreen, Setting, VideoPause, VideoPlay } from '@element-plus/icons-vue';
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElSwitch, ElTable, ElTableColumn, ElTabPane, ElTabs, ElTag } from 'element-plus';
import screenFull from 'screenfull';
import ChartLine1 from '#/views/genchuan/industry/templatesstatchart/ChartLine1.vue';
import ChartLine2 from '#/views/genchuan/industry/templatesstatchart/ChartLine2.vue';
import ChartPie1 from '#/views/genchuan/industry/templatesstatchart/ChartPie1.vue';
import ChartPie2 from '#/views/genchuan/industry/templatesstatchart/ChartPie2.vue';
import VerticalBar2 from '#/views/genchuan/industry/templatesstatchart/VerticalBar2.vue';
import VerticalBar3 from '#/views/genchuan/industry/templatesstatchart/VerticalBar3.vue';
import VerticalBar4 from '#/views/genchuan/industry/templatesstatchart/VerticalBar4.vue';
import EmergencyResponseMap1 from './EmergencyResponseMap1.vue';
import EmergencyResponseMap2 from './EmergencyResponseMap2.vue';
import EmergencyResponseMap3 from './EmergencyResponseMap3.vue';
import DotAnimationMap from './DotAnimationMap.vue';

import {
  fetchEmergencySituationMap, fetchEmergencyResourceDistributionMap, fetchSpecialEmergencyViewMap,
  fetchDispatchTaskList, fetchDispatchTaskIndicators, fetchDispatchTaskReceiverCompare,
  fetchDisposalProgressList, fetchDisposalProgressIndicators, fetchDisposalProgressTrend,
  fetchEmergencyPlanList, fetchEmergencyPlanIndicators, fetchEmergencyPlanTypeRatio,
  fetchEmergencySituationIndicators, fetchEmergencyTypeRatio, fetchEmergencyLevelRatio,
  fetchEmergencyResourceTypeCompare, fetchEmergencyResourceDeptCompare, fetchEmergencyResourceStatusRatio,
  fetchSpecialEmergencyIndicators, fetchSpecialEmergencyDisposalTrend,
  fetchSceneSituationList,
  fetchSceneSituationDetail,
  contactScenePerson,
  submitDisposalInstruction,
  fetchSceneSituationIndicators,
  fetchSceneDisposalEffectCompare,
} from '#/api/genchuan/industry/parkingmgmt/overview/EmergencyResponse.ts';


const pageContainerRef = ref<HTMLElement | null>(null);
const router = useRouter();
const instance = getCurrentInstance();
const currentFullscreenPanel = ref<HTMLElement | null>(null);

// 地图加载状态
const map1Loading = ref<boolean>(true);
const map2Loading = ref<boolean>(true);
const map3Loading = ref<boolean>(true);
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

// 时间戳格式化方法
const formatTimeStamp = (timeStamp: number | null | undefined) => {
  if (!timeStamp) return '-';
  const d = new Date(Number(timeStamp));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
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
  // 进入全屏时：延迟刷新当前文件的图表
  if (screenFull.isFullscreen) {
    setTimeout(() => {
      topMainChartRefreshKey.value++;
      dispatchTaskChartRefreshKey.value++;
      emergencyPlanChartRefreshKey.value++;
      disposalProgressChartRefreshKey.value++;
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
    }, 100);
  });
};

// 地图组件引用
const emergencyMap1Ref = ref<InstanceType<typeof EmergencyResponseMap1> | null>(null);
const emergencyMap2Ref = ref<InstanceType<typeof EmergencyResponseMap2> | null>(null);
const emergencyMap3Ref = ref<InstanceType<typeof EmergencyResponseMap3> | null>(null);
// 地图数据
const emergencySituationData = ref<EmergencySituationItem[]>([]);
const emergencyResourceData = ref<EmergencySituationItem[]>([]);
const specialEmergencyData = ref<EmergencySituationItem[]>([]);
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
  return { center: { lat: 24.58, lng: 117.65 }, rotateSpeed: 0.1, pitch: 40, zoom: 16, loop: true };
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
    [emergencyMap1Ref.value, emergencyMap2Ref.value, emergencyMap3Ref.value].forEach(ref => {
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
  const defaultConfig: OrbitConfig = { center: { lat: 24.58, lng: 117.65 }, rotateSpeed: 0.1, pitch: 40, zoom: 16, loop: true };
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
  [emergencyMap1Ref.value, emergencyMap2Ref.value, emergencyMap3Ref.value].forEach(ref => {
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
    dotMapLoading.value = false;
  } catch (error) {
    console.error('地图数据加载失败：', error);
    ElMessage.error('地图数据加载失败，请刷新重试');
    emergencySituationData.value = [];
    emergencyResourceData.value = [];
    specialEmergencyData.value = [];
    map1Loading.value = false;
    map2Loading.value = false;
    map3Loading.value = false;
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

// 专项应急TS类型定义
interface SpecialEmergencyIndicators {
  trappedVehicleTotal: number; // 受困车辆数
  evacuatedVehicleCount: number; // 已疏散车辆数
  repairedDeviceCount: number; // 已修复设备数
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


// 应急态势响应式数据
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
const resourceTypeCompareData = ref<ChartBarData>({ xAxis: [], series: [] });
const resourceDeptCompareData = ref<ChartBarData>({ xAxis: [], series: [] });
const resourceStatusRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '应急资源状态占比', data: [] }]
});

// 专项应急视图响应式数据
const specialEmergencyIndicatorData = ref<SpecialEmergencyIndicators>({
  trappedVehicleTotal: 0,
  evacuatedVehicleCount: 0,
  repairedDeviceCount: 0
});
const specialEmergencyTrendData = ref<ChartLineData>({ xAxis: [], series: [] });

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

// 现场态势响应式数据
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
const activeSceneSituationView = ref('地图');
const sceneSituationViewBtnList = ref(['地图', '列表']);
// 现场态势弹窗相关
const sceneSituationDetailDialogVisible = ref(false);
const scenePhotoDialogVisible = ref(false);
const selectedPhotoUrl = ref('');
const activeSceneSituationDetailView = ref('现场态势');
const sceneSituationDetailViewBtnList = ref(['现场态势', '实时数据', '处置进展']);
const disposalInstruction = ref('');


// 应急态势接口请求方法
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
  if (!disposalInstruction.value.trim()) {
    ElMessage.warning('请输入处置指令');
    return;
  }
  try {
    const res = await submitDisposalInstruction(
      sceneSituationDetailSelectedRow.value.taskEmergencyEmergencyId,
      disposalInstruction.value
    );
    if (res.success) {
      tipDialogContent.value = res.message;
      tipDialogVisible.value = true;
      disposalInstruction.value = '';
      // 可以刷新数据
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

// 应急方案视图切换方法
const changeEmergencyPlanView = (viewName: string) => {
  activeEmergencyPlanView.value = viewName;
  viewName === '卡片' && nextTick(() => initEmergencyPlanNumberAnimations());
  viewName === '饼图' && nextTick(() => emergencyPlanChartRefreshKey.value += 1);
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
  disposalInstruction.value = '';
};
const openScenePhotoDialog = (photoUrl: string) => {
  selectedPhotoUrl.value = photoUrl;
  scenePhotoDialogVisible.value = true;
};
const closeScenePhotoDialog = () => {
  scenePhotoDialogVisible.value = false;
  selectedPhotoUrl.value = '';
};


// 标签映射
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

// 格式化时长（分钟）
const formatDuration = (val: number | null | undefined) => val ? `${val} 分钟` : '-';

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
  ]);
  setTimeout(() => {
    dispatchTaskChartRefreshKey.value += 1;
    emergencyPlanChartRefreshKey.value += 1;
    disposalProgressChartRefreshKey.value += 1;
  }, 200);
  screenFull.on('change', handleFullscreenChange);
});

// 页面卸载生命周期
onUnmounted(() => {
  [emergencyMap1Ref.value, emergencyMap2Ref.value, emergencyMap3Ref.value].forEach(ref => ref && ref.stopOrbitAnimation());
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
                  <button class="control-btn" @click="handleOrbitAnimation1">
                    <el-icon color="#409eff" size="16">
                      <VideoPause v-if="emergencyMap1Ref?.orbitStatus?.playing" />
                      <VideoPlay v-else />
                    </el-icon>
                  </button>
                  <button class="control-btn" @click="orbitConfigDialogVisible = true">
                    <el-icon color="#409eff" size="16"><Setting /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('topMiddlePanel')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div style="flex: 1; width: 100%; height: calc(100% - 2vh);position: relative;">
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
                      <ChartPie1 :key="topMainChartRefreshKey" :data="emergencyTypeRatioData" title="应急类型占比" :base-font-scale="disposalProgressBaseFontScale" :active-indices="disposalProgressActiveIndices" style="width:100%;height:100%"/>
                    </div>
                    <div class="chart-card">
                      <ChartPie2 :key="topMainChartRefreshKey" :data="emergencyLevelRatioData" title="应急等级占比" :base-font-scale="disposalProgressBaseFontScale" :active-indices="disposalProgressActiveIndices" style="width:100%;height:100%"/>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="资源分布" name="tab2">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <button class="control-btn" @click="handleOrbitAnimation2">
                    <el-icon color="#409eff" size="16">
                      <VideoPause v-if="emergencyMap2Ref?.orbitStatus?.playing" />
                      <VideoPlay v-else />
                    </el-icon>
                  </button>
                  <button class="control-btn" @click="orbitConfigDialogVisible = true">
                    <el-icon color="#409eff" size="16"><Setting /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('topMiddlePanel')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div style="flex: 1; width: 100%; height: calc(100% - 2vh);position: relative;">
                <EmergencyResponseMap2 v-if="!map2Loading && topMiddleActiveTab === 'tab2'" ref="emergencyMap2Ref" id-name="parkingMap2" :geometries-array="emergencyResourceData" :orbit-config="orbitConfigData" />
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
            </el-tab-pane>
            <el-tab-pane label="专项应急视图" name="tab3">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <button class="control-btn" @click="handleOrbitAnimation3">
                    <el-icon color="#409eff" size="16">
                      <VideoPause v-if="emergencyMap3Ref?.orbitStatus?.playing" />
                      <VideoPlay v-else />
                    </el-icon>
                  </button>
                  <button class="control-btn" @click="orbitConfigDialogVisible = true">
                    <el-icon color="#409eff" size="16"><Setting /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('topMiddlePanel')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div style="flex: 1; width: 100%; height: calc(100% - 2vh);position: relative;">
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
            </el-tab-pane>
            <el-tab-pane label="资源调度" name="tab4">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('topMiddlePanel')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div class="view-content"><div class="content-placeholder">资源调度</div></div>
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
                          type="primary"
                          size="small"
                          plain
                          @click.stop="openSceneSituationDetailDialog(scope.row)"
                        >
                          查看
                        </ElButton>
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
                <ChartPie1 :data="emergencyPlanTypeRatioData" title="方案适配应急类型占比" :base-font-scale="emergencyPlanBaseFontScale" :active-indices="emergencyPlanActiveIndices" style="width:100%;height:100%"/>
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
              <div class="view-content"><div class="content-placeholder">协同指挥</div></div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
      </div>
      <ElDialog v-model="orbitConfigDialogVisible" title="地图环绕配置" width="40%" @close="resetOrbitConfigForm">
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
      </ElDialog>

      <!-- 现场态势详情弹窗 -->
      <el-dialog
        v-model="sceneSituationDetailDialogVisible"
        width="70%"
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
        <div v-if="activeSceneSituationDetailView === '现场态势'" class="view-content" style="padding:0; height: 50vh; overflow-y: auto;">
          <div style="display: flex; gap: 20px; margin-bottom: 20px;">
            <div style="flex: 2;">
              <ElDescriptions bordered :column="1" class="desc-detail" title="基本信息">
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
              </ElDescriptions>
            </div>
            <div style="flex: 1;">
              <ElDescriptions bordered :column="1" class="desc-detail" title="负责人信息">
                <ElDescriptionsItem label="现场负责人">
                  {{ sceneSituationDetailSelectedRow.sysUserUserName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="联系方式">
                  {{ sceneSituationDetailSelectedRow.sysUserUserPhone || '-' }}
                </ElDescriptionsItem>
              </ElDescriptions>
              <div style="margin-top: 20px;">
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
          <div style="margin-top: 20px;">
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
        </div>
        <!-- 实时数据视图 -->
        <div v-if="activeSceneSituationDetailView === '实时数据'" class="view-content" style="padding:0; height: 50vh; overflow-y: auto;">
          <ElDescriptions bordered :column="2" class="desc-detail" title="实时数据监控">
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
                <span>{{ sceneSituationDetailSelectedRow.realtimeData.evacuationProgress || 0 }}%</span>
                <el-progress
                  :percentage="sceneSituationDetailSelectedRow.realtimeData.evacuationProgress || 0"
                  :stroke-width="12"
                  style="flex: 1;"
                />
              </div>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="修复进度">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span>{{ sceneSituationDetailSelectedRow.realtimeData.repairProgress || 0 }}%</span>
                <el-progress
                  :percentage="sceneSituationDetailSelectedRow.realtimeData.repairProgress || 0"
                  :stroke-width="12"
                  style="flex: 1;"
                />
              </div>
            </ElDescriptionsItem>
          </ElDescriptions>
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
              width="180"
            >
              <template #default="scope">
                {{ formatTimeStamp(scope.row.time) }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="action"
              label="处置动作"
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
                <ElTag :type="scope.row.status === '已完成' ? 'success' : 'warning'">
                  {{ scope.row.status || '-' }}
                </ElTag>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
        <!-- 处置指令下发 -->
        <div style="margin-top: 20px; padding: 15px; background: #f5f7fa; border-radius: 4px;">
          <h3 style="margin: 0 0 15px 0; color: #409eff;">处置指令下发</h3>
          <div style="margin-bottom: 10px;">
            <strong>处置建议：</strong>
            <div style="margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border: 1px solid #ddd;">
              {{ sceneSituationDetailSelectedRow.taskEmergencySceneDisposalSuggestion || '-' }}
            </div>
          </div>
          <el-input
            v-model="disposalInstruction"
            type="textarea"
            :rows="3"
            placeholder="请输入处置指令"
            style="margin-bottom: 15px;"
          />
        </div>
        <template #footer>
          <ElButton plain @click="closeSceneSituationDetailDialog">取消</ElButton>
          <ElButton type="primary" @click="submitDisposalInstructionData">提交</ElButton>
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
