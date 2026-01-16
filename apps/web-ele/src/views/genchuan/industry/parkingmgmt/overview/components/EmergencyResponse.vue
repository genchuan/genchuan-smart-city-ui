<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Filter, FullScreen, Setting, VideoPause, VideoPlay } from '@element-plus/icons-vue';
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElSwitch, ElTable, ElTableColumn, ElTabPane, ElTabs, ElTag } from 'element-plus';
import screenFull from 'screenfull';

import {
  fetchEmergencySituationMap, fetchEmergencyResourceDistributionMap, fetchSpecialEmergencyViewMap,
  fetchDispatchTaskList, fetchDispatchTaskIndicators, fetchDispatchTaskReceiverCompare,
  fetchDisposalProgressList, fetchDisposalProgressIndicators, fetchDisposalProgressTrend,
  fetchEmergencyPlanList, fetchEmergencyPlanIndicators, fetchEmergencyPlanTypeRatio,
  fetchEmergencySituationIndicators, fetchEmergencyTypeRatio, fetchEmergencyLevelRatio,
  fetchEmergencyResourceTypeCompare, fetchEmergencyResourceDeptCompare, fetchEmergencyResourceStatusRatio,
  fetchSpecialEmergencyIndicators, fetchSpecialEmergencyDisposalTrend
} from '#/api/genchuan/industry/parkingmgmt/overview/EmergencyResponse.ts';

import ChartLine1 from '#/views/genchuan/industry/templatesstatchart/ChartLine1.vue';
import ChartLine2 from '#/views/genchuan/industry/templatesstatchart/ChartLine2.vue';
import ChartPie1 from '#/views/genchuan/industry/templatesstatchart/ChartPie1.vue';
import ChartPie2 from '#/views/genchuan/industry/templatesstatchart/ChartPie2.vue';
import VerticalBar2 from '#/views/genchuan/industry/templatesstatchart/VerticalBar2.vue';
import VerticalBar3 from '#/views/genchuan/industry/templatesstatchart/VerticalBar3.vue';

import EmergencyResponseMap1 from './EmergencyResponseMap1.vue';
import EmergencyResponseMap2 from './EmergencyResponseMap2.vue';
import EmergencyResponseMap3 from './EmergencyResponseMap3.vue';

const emergencyMap1Ref = ref<InstanceType<typeof EmergencyResponseMap1> | null>(null);
const emergencyMap2Ref = ref<InstanceType<typeof EmergencyResponseMap2> | null>(null);
const emergencyMap3Ref = ref<InstanceType<typeof EmergencyResponseMap3> | null>(null);

const emergencySituationData = ref<any[]>([]);
const emergencyResourceData = ref<any[]>([]);
const specialEmergencyData = ref<any[]>([]);

const emergencySituationIndicatorData = ref({
  totalEmergencyCount: 0,
  levelEmergencyCount: { level1:0, level2:0, level3:0, level4:0 },
  affectedVehicleTotal: 0
});
const emergencyTypeRatioData = ref({ legend: [], series: [{ name: '应急事件类型占比', data: [] }] });
const emergencyLevelRatioData = ref({ legend: [], series: [{ name: '应急事件等级占比', data: [] }] });

const resourceTypeCompareData = ref({ xAxis: [], series: [] });
const resourceDeptCompareData = ref({ xAxis: [], series: [] });
const resourceStatusRatioData = ref({ legend: [], series: [{ name: '应急资源状态占比', data: [] }] });

const specialEmergencyIndicatorData = ref({
  trappedVehicleTotal: 0,
  evacuatedVehicleCount: 0,
  repairedDeviceCount: 0
});
const specialEmergencyTrendData = ref({ xAxis: [], series: [] });

const map1Loading = ref(true);
const map2Loading = ref(true);
const map3Loading = ref(true);

const getStoredOrbitConfig = () => {
  const stored = localStorage.getItem('parkingMapOrbitConfig');
  if (stored) {
    try { return JSON.parse(stored); }
    catch (error) { console.warn('读取本地存储的地图配置失败，使用默认值:', error); }
  }
  return { center: { lat: 24.58, lng: 117.65 }, rotateSpeed: 0.1, pitch: 40, zoom: 18, loop: true };
};

const saveOrbitConfigToLocal = (config: any) => {
  try { localStorage.setItem('parkingMapOrbitConfig', JSON.stringify(config)); }
  catch (error) {
    console.error('保存地图配置失败:', error);
    ElMessage.warning('配置暂无法持久化，刷新后恢复默认值');
  }
};

const orbitConfigDialogVisible = ref(false);
const orbitConfigFormRef = ref<any>(null);
const orbitConfigForm = ref({
  centerLat: getStoredOrbitConfig().center.lat,
  centerLng: getStoredOrbitConfig().center.lng,
  rotateSpeed: getStoredOrbitConfig().rotateSpeed,
  pitch: getStoredOrbitConfig().pitch,
  zoom: getStoredOrbitConfig().zoom,
  loop: getStoredOrbitConfig().loop,
});

const orbitConfigRules = ref({
  centerLat: [{ required: true, type: 'number', min: -90, max: 90, message: '请输入有效的纬度（-90~90）', trigger: 'blur' }],
  centerLng: [{ required: true, type: 'number', min: -180, max: 180, message: '请输入有效的经度（-180~180）', trigger: 'blur' }],
  rotateSpeed: [{ required: true, type: 'number', min: 0.01, message: '旋转速度不能小于0.01', trigger: 'blur' }],
  pitch: [{ required: true, type: 'number', min: 0, max: 80, message: '俯仰角范围0~80', trigger: 'blur' }],
  zoom: [{ required: true, type: 'number', min: 1, max: 20, message: '缩放级别范围1~20', trigger: 'blur' }],
});

const orbitConfigData = ref(getStoredOrbitConfig());

const handleOrbitAnimation1 = () => {
  if (emergencyMap1Ref.value && typeof emergencyMap1Ref.value.toggleOrbitAnimation === 'function') emergencyMap1Ref.value.toggleOrbitAnimation();
  else ElMessage.warning('应急态势地图环绕功能暂未初始化完成');
};

const handleOrbitAnimation2 = () => {
  const targetRef = emergencyMap2Ref.value;
  if (targetRef && typeof targetRef.toggleOrbitAnimation === 'function') targetRef.toggleOrbitAnimation();
  else ElMessage.warning('资源分布地图环绕功能暂未初始化完成');
};

const handleOrbitAnimation3 = () => {
  const targetRef = emergencyMap3Ref.value;
  if (targetRef && typeof targetRef.toggleOrbitAnimation === 'function') targetRef.toggleOrbitAnimation();
  else ElMessage.warning('专项应急地图环绕功能暂未初始化完成');
};

const resetOrbitConfigForm = () => {
  orbitConfigFormRef.value?.resetFields();
  const currentConfig = getStoredOrbitConfig();
  orbitConfigForm.value = {
    centerLat: currentConfig.center.lat, centerLng: currentConfig.center.lng,
    rotateSpeed: currentConfig.rotateSpeed, pitch: currentConfig.pitch, zoom: currentConfig.zoom, loop: currentConfig.loop
  };
};

const submitOrbitConfig = async () => {
  try {
    await orbitConfigFormRef.value.validate();
    const newConfig = {
      center: { lat: orbitConfigForm.value.centerLat, lng: orbitConfigForm.value.centerLng },
      rotateSpeed: orbitConfigForm.value.rotateSpeed, pitch: orbitConfigForm.value.pitch, zoom: orbitConfigForm.value.zoom, loop: orbitConfigForm.value.loop
    };
    orbitConfigData.value = newConfig;
    saveOrbitConfigToLocal(newConfig);
    [emergencyMap1Ref.value, emergencyMap2Ref.value, emergencyMap3Ref.value].forEach(ref => {
      ref && (ref.stopOrbitAnimation(), ref.startOrbitAnimation());
    });
    orbitConfigDialogVisible.value = false;
    ElMessage.success('地图环绕配置已生效（已持久化，刷新不丢失）');
  } catch { ElMessage.error('配置校验失败，请检查输入'); }
};

const resetToDefaultConfig = () => {
  const defaultConfig = { center: { lat: 24.58, lng: 117.65 }, rotateSpeed: 0.1, pitch: 40, zoom: 18, loop: true };
  orbitConfigData.value = defaultConfig;
  orbitConfigForm.value = { centerLat: defaultConfig.center.lat, centerLng: defaultConfig.center.lng, rotateSpeed: defaultConfig.rotateSpeed, pitch: defaultConfig.pitch, zoom: defaultConfig.zoom, loop: defaultConfig.loop };
  localStorage.removeItem('parkingMapOrbitConfig');
  [emergencyMap1Ref.value, emergencyMap2Ref.value, emergencyMap3Ref.value].forEach(ref => {
    ref && (ref.stopOrbitAnimation(), ref.startOrbitAnimation());
  });
  ElMessage.success('已恢复默认配置');
};

const initAllMapData = async () => {
  try {
    emergencySituationData.value = await fetchEmergencySituationMap({});
    emergencyResourceData.value = await fetchEmergencyResourceDistributionMap({});
    specialEmergencyData.value = await fetchSpecialEmergencyViewMap({});

    await Promise.all([
      getEmergencySituationIndicatorData(), getEmergencyTypeRatioData(), getEmergencyLevelRatioData(),
      getResourceTypeCompareData(), getResourceDeptCompareData(), getResourceStatusRatioData(),
      getSpecialEmergencyIndicatorData(), getSpecialEmergencyTrendData()
    ]);

    map1Loading.value = false;
    map2Loading.value = false;
    map3Loading.value = false;
  } catch (error) {
    console.error('地图数据加载失败：', error);
    ElMessage.error('地图数据加载失败，请刷新重试');
    emergencySituationData.value = [];
    emergencyResourceData.value = [];
    specialEmergencyData.value = [];
    map1Loading.value = false;
    map2Loading.value = false;
    map3Loading.value = false;
  }
};

const getEmergencySituationIndicatorData = async () => { try { emergencySituationIndicatorData.value = await fetchEmergencySituationIndicators({}); } catch (e) { console.error(e) } };
const getEmergencyTypeRatioData = async () => { try { emergencyTypeRatioData.value = await fetchEmergencyTypeRatio({}); } catch (e) { console.error(e) } };
const getEmergencyLevelRatioData = async () => { try { emergencyLevelRatioData.value = await fetchEmergencyLevelRatio({}); } catch (e) { console.error(e) } };

const getResourceTypeCompareData = async () => { try { resourceTypeCompareData.value = await fetchEmergencyResourceTypeCompare({}); } catch (e) { console.error(e) } };
const getResourceDeptCompareData = async () => { try { resourceDeptCompareData.value = await fetchEmergencyResourceDeptCompare({}); } catch (e) { console.error(e) } };
const getResourceStatusRatioData = async () => { try { resourceStatusRatioData.value = await fetchEmergencyResourceStatusRatio({}); } catch (e) { console.error(e) } };

const getSpecialEmergencyIndicatorData = async () => { try { specialEmergencyIndicatorData.value = await fetchSpecialEmergencyIndicators({}); } catch (e) { console.error(e) } };
const getSpecialEmergencyTrendData = async () => { try { specialEmergencyTrendData.value = await fetchSpecialEmergencyDisposalTrend({}); } catch (e) { console.error(e) } };

const pageContainerRef = ref<HTMLElement | null>(null);
const router = useRouter();
const topLeftActiveTab = ref('tab1');
const topMiddleActiveTab = ref('tab1');
const topRightActiveTab = ref('tab1');
const bottomMiddleActiveTab = ref('tab1');

const terminalDevicePanelRef = ref<HTMLElement | null>(null);
const dispatchTaskList = ref<any[]>([]);
const dispatchTaskIndicators = ref({ pendingCount: 0, executingCount: 0, completedCount: 0 });
const dispatchTaskReceiverCompareData = ref({ xAxis: [], series: [] });
const dispatchTaskBaseFontScale = ref(1);
const dispatchTaskActiveIndices = ref([]);
const dispatchTaskChartRefreshKey = ref(0);
const activeDispatchTaskView = ref('卡片');
const dispatchTaskViewBtnList = ref(['卡片', '柱状图', '列表']);

const parkResourcePanelRef = ref<HTMLElement | null>(null);
const disposalProgressList = ref<any[]>([]);
const disposalProgressIndicators = ref({ avgAlarmDuration:0,avgReceiveDuration:0,avgArriveDuration:0,avgDisposeDuration:0,avgCloseDuration:0,timeoutDisposalCount:0 });
const disposalProgressTrendData = ref({ xAxis: [], series: [] });
const disposalProgressBaseFontScale = ref(1);
const disposalProgressActiveIndices = ref([]);
const disposalProgressChartRefreshKey = ref(0);
const activeDisposalProgressView = ref('卡片');
const disposalProgressViewBtnList = ref(['卡片', '折线图', '列表']);

const sparePartPanelRef = ref<HTMLElement | null>(null);
const emergencyPlanList = ref<any[]>([]);
const emergencyPlanIndicators = ref({ launchedCount: 0, executingCount: 0 });
const emergencyPlanTypeRatioData = ref({ legend: [], series: [] });
const emergencyPlanBaseFontScale = ref(1);
const emergencyPlanActiveIndices = ref([]);
const emergencyPlanChartRefreshKey = ref(0);
const activeEmergencyPlanView = ref('卡片');
const emergencyPlanViewBtnList = ref(['卡片', '饼图', '列表']);

const parkMap2Ref = ref<HTMLElement | null>(null);
const parkMap3Ref = ref<HTMLElement | null>(null);
const parkMap4Ref = ref<HTMLElement | null>(null);
const topMainChartRefreshKey = ref(0);

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

const changeDispatchTaskView = (viewName: string) => {
  activeDispatchTaskView.value = viewName;
  viewName === '卡片' && nextTick(() => initDispatchTaskNumberAnimations());
  viewName === '柱状图' && nextTick(() => dispatchTaskChartRefreshKey.value += 1);
};
const changeDisposalProgressView = (viewName: string) => {
  activeDisposalProgressView.value = viewName;
  viewName === '卡片' && nextTick(() => initDisposalProgressNumberAnimations());
  viewName === '折线图' && nextTick(() => disposalProgressChartRefreshKey.value += 1);
};
const changeEmergencyPlanView = (viewName: string) => {
  activeEmergencyPlanView.value = viewName;
  viewName === '卡片' && nextTick(() => initEmergencyPlanNumberAnimations());
  viewName === '饼图' && nextTick(() => emergencyPlanChartRefreshKey.value += 1);
};

const currentFullscreenPanel = ref<HTMLElement | null>(null);
const panelMap = { dispatchTask: terminalDevicePanelRef, emergencyPlan: sparePartPanelRef, parkMap2: parkMap2Ref, parkMap3: parkMap3Ref, parkMap4: parkMap4Ref, disposalProgress: parkResourcePanelRef };

const handleFullscreenChange = () => {
  if (!screenFull.isFullscreen && currentFullscreenPanel.value) {
    currentFullscreenPanel.value.style.width = '';
    currentFullscreenPanel.value.style.height = '';
    currentFullscreenPanel.value.style.overflow = 'hidden';
    switch (currentFullscreenPanel.value) {
      case parkResourcePanelRef.value: disposalProgressChartRefreshKey.value += 1; break;
      case sparePartPanelRef.value: emergencyPlanChartRefreshKey.value += 1; break;
      case terminalDevicePanelRef.value: dispatchTaskChartRefreshKey.value += 1; break;
    }
    screenFull.off('change', handleFullscreenChange);
    currentFullscreenPanel.value = null;
  }
};

const togglePanelFullscreen = (panelKey) => {
  if (!screenFull.isEnabled) { ElMessage.warning('您的浏览器不支持全屏功能'); return; }
  const panelRefObj = panelMap[panelKey];
  const panel = panelRefObj?.value;
  if (!panel) { ElMessage.error('未找到面板元素'); return; }
  if (currentFullscreenPanel.value) screenFull.off('change', handleFullscreenChange);
  currentFullscreenPanel.value = panel;
  if (screenFull.isFullscreen && document.fullscreenElement === panel) {
    screenFull.exit().catch((error) => ElMessage.error(`退出全屏失败: ${error.message}`));
  } else {
    screenFull.on('change', handleFullscreenChange);
    screenFull.request(panel).catch((error) => {
      ElMessage.error(`全屏失败：${error.message}`);
      screenFull.off('change', handleFullscreenChange);
      currentFullscreenPanel.value = null;
    });
  }
};

const getDispatchTaskListData = async () => { try { dispatchTaskList.value = await fetchDispatchTaskList(); } catch { ElMessage.error('调度任务数据加载失败'); dispatchTaskList.value = []; } };
const getDispatchTaskIndicatorData = async () => { try { dispatchTaskIndicators.value = await fetchDispatchTaskIndicators(); nextTick(() => initDispatchTaskNumberAnimations()); } catch { dispatchTaskIndicators.value = { pendingCount: 0, executingCount: 0, completedCount: 0 }; } };
const getDispatchTaskReceiverCompareData = async () => { try { dispatchTaskReceiverCompareData.value = await fetchDispatchTaskReceiverCompare(); } catch { dispatchTaskReceiverCompareData.value = { xAxis: [], series: [{ name: '已完成任务数', data: [] },{ name: '未完成任务数', data: [] }] }; } };

const getDisposalProgressListData = async () => { try { disposalProgressList.value = await fetchDisposalProgressList(); } catch { ElMessage.error('处置进度数据加载失败'); disposalProgressList.value = []; } };
const getDisposalProgressIndicatorData = async () => { try { disposalProgressIndicators.value = await fetchDisposalProgressIndicators(); nextTick(() => initDisposalProgressNumberAnimations()); } catch { disposalProgressIndicators.value = { avgAlarmDuration:0,avgReceiveDuration:0,avgArriveDuration:0,avgDisposeDuration:0,avgCloseDuration:0,timeoutDisposalCount:0 }; } };
const getDisposalProgressTrendData = async () => { try { disposalProgressTrendData.value = await fetchDisposalProgressTrend(); } catch { disposalProgressTrendData.value = { xAxis: [], series: [{ name: '平均到场时长(分钟)', data: [] },{ name: '平均处置时长(分钟)', data: [] }] }; } };

const getEmergencyPlanListData = async () => { try { emergencyPlanList.value = await fetchEmergencyPlanList(); } catch { ElMessage.error('应急方案数据加载失败'); emergencyPlanList.value = []; } };
const getEmergencyPlanIndicatorData = async () => { try { emergencyPlanIndicators.value = await fetchEmergencyPlanIndicators(); nextTick(() => initEmergencyPlanNumberAnimations()); } catch { emergencyPlanIndicators.value = { launchedCount: 0, executingCount: 0 }; } };
const getEmergencyPlanTypeRatioData = async () => { try { emergencyPlanTypeRatioData.value = await fetchEmergencyPlanTypeRatio(); } catch { emergencyPlanTypeRatioData.value = { legend: [], series: [{ name: '方案适配应急类型占比', data: [] }] }; } };

const formatTimeStamp = (timeStamp: any) => {
  if (!timeStamp) return '-';
  const d = new Date(Number(timeStamp));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
const getDispatchTaskStatusTag = (val: string) => { switch(val){case 'pending':return 'warning';case 'executing':return 'primary';case 'completed':return 'success';default:return ''} };
const getDispatchTaskStatusName = (val: string) => { switch(val){case 'pending':return '待执行';case 'executing':return '执行中';case 'completed':return '已完成';default:return '未知状态'} };
const getDispatchTypeName = (val: string) => { switch(val){case 'traffic':return '交通疏导';case 'maintain':return '设备维修';case 'emergency':return '应急事故';case 'security':return '安全整治';default:return '未知类型'} };
const getDisposalStageName = (val: string) => { switch(val){case 'receive':return '接警';case 'arrive':return '到场';case 'dispose':return '处置';case 'close':return '结案';default:return '未知阶段'} };
const getPlanStatusTag = (val: string) => { switch(val){case 'launched':return 'primary';case 'executing':return 'warning';case 'completed':return 'success';default:return ''} };
const getPlanStatusName = (val: string) => { switch(val){case 'launched':return '已启动';case 'executing':return '执行中';case 'completed':return '已完成';default:return '未知状态'} };
const getEmergencyTypeName = (val: string) => { switch(val){case 'trafficJam':return '交通拥堵';case 'equipmentFault':return '设备故障';case 'carAccident':return '车辆事故';case 'fireHidden':return '消防隐患';case 'personHelp':return '人员求助';default:return '其他'} };
const formatDuration = (val: number) => val ? `${val} 分钟` : '-';

const animateValue = (element: any, start: number, end: number, duration: number) => {
  let startTimestamp = null;
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
const initDispatchTaskNumberAnimations = () => { document.querySelectorAll('.dispatch-task-number-animate').forEach((el) => animateValue(el, 0, Number.parseFloat(el.dataset.value || 0), 1500)); };
const initDisposalProgressNumberAnimations = () => { document.querySelectorAll('.disposal-progress-number-animate').forEach((el) => animateValue(el, 0, Number.parseFloat(el.dataset.value || 0), 1500)); };
const initEmergencyPlanNumberAnimations = () => { document.querySelectorAll('.emergency-plan-number-animate').forEach((el) => animateValue(el, 0, Number.parseFloat(el.dataset.value || 0), 1500)); };

onMounted(async () => {
  await initAllMapData();
  resetOrbitConfigForm();
  await Promise.all([
    getDispatchTaskListData(), getDispatchTaskIndicatorData(), getDispatchTaskReceiverCompareData(),
    getDisposalProgressListData(), getDisposalProgressIndicatorData(), getDisposalProgressTrendData(),
    getEmergencyPlanListData(), getEmergencyPlanIndicatorData(), getEmergencyPlanTypeRatioData()
  ]);
  setTimeout(() => {
    dispatchTaskChartRefreshKey.value += 1;
    emergencyPlanChartRefreshKey.value += 1;
    disposalProgressChartRefreshKey.value += 1;
  }, 200);
});

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
        <div class="panel top-middle" ref="parkMap2Ref">
          <ElTabs v-model="topMiddleActiveTab" class="custom-tabs top-left-tabs" @tab-change="handleTabChange">
            <ElTabPane label="应急态势" name="tab1">
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
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('parkMap2')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div style="flex: 1; width: 100%; height: calc(100% - 2vh);position: relative;">
                <div class="force-stats-overlay1">
                  <div class="force-stats-cards">
                    <div class="force-stat-card">
                      <div class="stat-content">
                        <div class="stat-title">应急事件总数</div>
                        <div class="stat-value">{{ emergencySituationIndicatorData.totalEmergencyCount }} 起</div>
                      </div>
                    </div>
                    <div class="force-stat-card">
                      <div class="stat-content">
                        <div class="stat-title">各等级应急数</div>
                        <div class="stat-value">一{{ emergencySituationIndicatorData.levelEmergencyCount.level1 }}/二{{ emergencySituationIndicatorData.levelEmergencyCount.level2 }}/三{{ emergencySituationIndicatorData.levelEmergencyCount.level3 }}/四{{ emergencySituationIndicatorData.levelEmergencyCount.level4 }}</div>
                      </div>
                    </div>
                    <div class="force-stat-card">
                      <div class="stat-content">
                        <div class="stat-title">受影响车辆数</div>
                        <div class="stat-value">{{ emergencySituationIndicatorData.affectedVehicleTotal }} 辆</div>
                      </div>
                    </div>
                  </div>
                </div>
                <EmergencyResponseMap1 v-if="!map1Loading && topMiddleActiveTab === 'tab1'" ref="emergencyMap1Ref" id-name="parkingMap3_top" :geometries-array="emergencySituationData" :orbit-config="orbitConfigData" />
                <div class="force-stats-overlay2">
                  <div class="force-stats-cards">
                    <div class="force-stat-card2 chart-card">
                      <ChartPie1 :key="topMainChartRefreshKey" :data="emergencyTypeRatioData" title="应急类型占比" :base-font-scale="disposalProgressBaseFontScale" :active-indices="disposalProgressActiveIndices" style="width:100%;height:100%"/>
                    </div>
                    <div class="force-stat-card2 chart-card">
                      <ChartPie2 :key="topMainChartRefreshKey" :data="emergencyLevelRatioData" title="应急等级占比" :base-font-scale="disposalProgressBaseFontScale" :active-indices="disposalProgressActiveIndices" style="width:100%;height:100%"/>
                    </div>
                  </div>
                </div>
              </div>
            </ElTabPane>
            <ElTabPane label="资源分布" name="tab2">
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
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('parkMap2')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div style="flex: 1; width: 100%; height: calc(100% - 2vh);position: relative;">
                <EmergencyResponseMap2 v-if="!map2Loading && topMiddleActiveTab === 'tab2'" ref="emergencyMap2Ref" id-name="parkingMap4_top" :geometries-array="emergencyResourceData" :orbit-config="orbitConfigData" />
                <div class="force-stats-overlay2">
                  <div class="force-stats-cards">
                    <div class="force-stat-card2 chart-card" style="width:240px;height:190px;">
                      <VerticalBar3 :key="topMainChartRefreshKey" :x-axis="resourceTypeCompareData.xAxis" :series="resourceTypeCompareData.series" unit="个/支/套" title="不同类型资源数量对比" :base-font-scale="disposalProgressBaseFontScale" :active-indices="disposalProgressActiveIndices" style="width:100%;height:100%"/>
                    </div>
                    <div class="force-stat-card2 chart-card" style="width:240px;height:190px;">
                      <VerticalBar3 :key="topMainChartRefreshKey" :x-axis="resourceDeptCompareData.xAxis" :series="resourceDeptCompareData.series" unit="个/支/套" title="不同部门资源数量对比" :base-font-scale="disposalProgressBaseFontScale" :active-indices="disposalProgressActiveIndices" style="width:100%;height:100%"/>
                    </div>
                    <div class="force-stat-card2 chart-card" style="width:240px;height:190px;">
                      <ChartPie1 :key="topMainChartRefreshKey" :data="resourceStatusRatioData" title="资源状态占比" :base-font-scale="disposalProgressBaseFontScale" :active-indices="disposalProgressActiveIndices" style="width:100%;height:100%"/>
                    </div>
                  </div>
                </div>
              </div>
            </ElTabPane>
            <ElTabPane label="专项应急视图" name="tab3">
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
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('parkMap2')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div style="flex: 1; width: 100%; height: calc(100% - 2vh);position: relative;">
                <div class="force-stats-overlay1">
                  <div class="force-stats-cards">
                    <div class="force-stat-card">
                      <div class="stat-content">
                        <div class="stat-title">受困车辆数</div>
                        <div class="stat-value">{{ specialEmergencyIndicatorData.trappedVehicleTotal }} 辆</div>
                      </div>
                    </div>
                    <div class="force-stat-card">
                      <div class="stat-content">
                        <div class="stat-title">已疏散车辆数</div>
                        <div class="stat-value">{{ specialEmergencyIndicatorData.evacuatedVehicleCount }} 辆</div>
                      </div>
                    </div>
                    <div class="force-stat-card">
                      <div class="stat-content">
                        <div class="stat-title">已修复设备数</div>
                        <div class="stat-value">{{ specialEmergencyIndicatorData.repairedDeviceCount }} 台</div>
                      </div>
                    </div>
                  </div>
                </div>
                <EmergencyResponseMap3 v-if="!map3Loading && topMiddleActiveTab === 'tab3'" ref="emergencyMap3Ref" id-name="parkingMap2" :geometries-array="specialEmergencyData" :orbit-config="orbitConfigData" />
                <div class="force-stats-overlay2">
                  <div class="force-stats-cards">
                    <div class="force-stat-card2 chart-card" style="width:520px;">
                      <ChartLine2 :key="topMainChartRefreshKey" :data="specialEmergencyTrendData" title="处置进度时间趋势" y-axis-name="辆/台" :base-font-scale="disposalProgressBaseFontScale" style="width:100%;height:100%"/>
                    </div>
                  </div>
                </div>
              </div>
            </ElTabPane>
          </ElTabs>
          <div class="panel-footer"></div>
        </div>
      </div>
      <div class="bottom">
        <div class="panel bottom-left" ref="parkMap3Ref">
          <ElTabs v-model="topLeftActiveTab" class="custom-tabs top-left-tabs" @tab-change="handleTabChange">
            <ElTabPane label="指挥调度" name="tab1">
              <div class="header-actions">
                <div class="actions-left"></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton v-for="item in dispatchTaskViewBtnList" :key="item" :type="activeDispatchTaskView === item ? 'primary' : ''" plain @click="changeDispatchTaskView(item)" class="view-btn">{{ item }}</ElButton>
                  </div>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('parkMap3')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div v-if="activeDispatchTaskView === '卡片'" class="view-content">
                <div class="indicator-cards">
                  <div class="indicator-card normal total-card" style="cursor: default">
                    <div class="indicator-title">待执行任务数</div>
                    <div class="indicator-value"><span :data-value="dispatchTaskIndicators.pendingCount" class="dispatch-task-number-animate">{{ dispatchTaskIndicators.pendingCount }}</span></div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card normal rate-card" style="cursor: default">
                    <div class="indicator-title">执行中任务数</div>
                    <div class="indicator-value"><span :data-value="dispatchTaskIndicators.executingCount" class="dispatch-task-number-animate">{{ dispatchTaskIndicators.executingCount }}</span></div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card normal satisfaction-card" style="cursor: default">
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
                <div class="gov-enterprise-table-box">
                  <ElTable class="gov-enterprise-coop-table" :data="dispatchTaskList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row>
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
            </ElTabPane>
            <ElTabPane label="资源调度" name="tab2">
              <div class="view-content"><div class="content-placeholder">资源调度</div></div>
            </ElTabPane>
          </ElTabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-middle" ref="parkResourcePanelRef">
          <ElTabs v-model="bottomMiddleActiveTab" class="custom-tabs top-left-tabs" @tab-change="handleTabChange">
            <ElTabPane label="处置进度" name="tab1">
              <div class="header-actions">
                <div class="actions-left"></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton v-for="item in disposalProgressViewBtnList" :key="item" :type="activeDisposalProgressView === item ? 'primary' : ''" plain @click="changeDisposalProgressView(item)" class="view-btn">{{ item }}</ElButton>
                  </div>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('disposalProgress')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div v-if="activeDisposalProgressView === '卡片'" class="view-content">
                <div class="indicator-cards">
                  <div class="indicator-card normal total-card" style="cursor: default">
                    <div class="indicator-title">各阶段平均耗时</div>
                    <div class="indicator-value"><span :data-value="(disposalProgressIndicators.avgAlarmDuration+disposalProgressIndicators.avgReceiveDuration+disposalProgressIndicators.avgArriveDuration+disposalProgressIndicators.avgDisposeDuration+disposalProgressIndicators.avgCloseDuration)/5" class="disposal-progress-number-animate">{{ ((disposalProgressIndicators.avgAlarmDuration+disposalProgressIndicators.avgReceiveDuration+disposalProgressIndicators.avgArriveDuration+disposalProgressIndicators.avgDisposeDuration+disposalProgressIndicators.avgCloseDuration)/5).toFixed(1) }}</span></div>
                    <div class="indicator-unit">分钟</div>
                  </div>
                  <div class="indicator-card normal rate-card" style="cursor: default">
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
                <div class="gov-enterprise-table-box">
                  <ElTable class="gov-enterprise-coop-table" :data="disposalProgressList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row>
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
            </ElTabPane>
            <ElTabPane label="现场态势" name="tab2">
              <div class="view-content"><div class="content-placeholder">现场态势</div></div>
            </ElTabPane>
          </ElTabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-right" ref="parkMap4Ref">
          <ElTabs v-model="topRightActiveTab" class="custom-tabs top-left-tabs" @tab-change="handleTabChange">
            <ElTabPane label="应急方案" name="tab1">
              <div class="header-actions">
                <div class="actions-left"></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton v-for="item in emergencyPlanViewBtnList" :key="item" :type="activeEmergencyPlanView === item ? 'primary' : ''" plain @click="changeEmergencyPlanView(item)" class="view-btn">{{ item }}</ElButton>
                  </div>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('parkMap4')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div v-if="activeEmergencyPlanView === '卡片'" class="view-content">
                <div class="indicator-cards">
                  <div class="indicator-card normal total-card" style="cursor: default">
                    <div class="indicator-title">已启动方案数</div>
                    <div class="indicator-value"><span :data-value="emergencyPlanIndicators.launchedCount" class="emergency-plan-number-animate">{{ emergencyPlanIndicators.launchedCount }}</span></div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card normal rate-card" style="cursor: default">
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
                <div class="gov-enterprise-table-box">
                  <ElTable class="gov-enterprise-coop-table" :data="emergencyPlanList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row>
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
            </ElTabPane>
            <ElTabPane label="协同指挥" name="tab2">
              <div class="view-content"><div class="content-placeholder">协同指挥</div></div>
            </ElTabPane>
          </ElTabs>
          <div class="panel-footer"></div>
        </div>
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
  </div>
</template>

<style lang="scss" scoped>
@import '../../../templatesstyle/common';
@import '../../../templatesstyle/table1';
@import '../../../templatesstyle/global-data-map';

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

:deep(.top-left-tabs) {
  width: 100%;
  height: 100%;
  padding: 0 !important;
  margin: 0 !important;
  .el-tabs__item { margin: 0 0.1vw !important; font-size: 0.85vw !important; color: #b6e1ad !important; }
  .el-tabs__item.is-active { font-weight: 600; color: #0cf !important; }
  .el-tabs__active-bar { height: 0.15vw !important; background: #0cf !important; }
  .el-tab-pane { width: 100%; height: calc(100% - 30px) !important; padding: 0 !important; }
}

:deep(.panel) {
  .el-tab-pane { display: flex; flex-direction: column; width: 100% !important; height: 100% !important; }
  .view-content { flex: 1; width: 100% !important; height: 100% !important; min-height: 0 !important; }
  .view-content > div { width: 100% !important; height: 100% !important; }
}

.view-content {
  box-sizing: border-box !important;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
  overflow: hidden !important;
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

.indicator-cards {
  box-sizing: border-box;
  display: flex;
  gap: 0.6vw;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.indicator-card {
  display: flex;
  flex: 0 0 8.4vw;
  flex-direction: column;
  justify-content: center;
  padding: 5vh 0;
  background: rgb(0 30 60 / 60%);
  border: 0.1vw solid transparent;
  border-radius: 8px;
  transition: all 0.3s;
  &:hover { transform: translateY(-5px); }
  .indicator-title { margin-top: 0.1vh; font-size: 1vw; font-weight: bold; text-align: center; letter-spacing: 0.1vw; }
  .indicator-value { margin: 0.3vw 0; font-size: 1.6vw; font-weight: bold; text-align: center; transition: all 0.3s; }
  .indicator-unit { font-size: 0.7vw; text-align: center; letter-spacing: 0.05vw; opacity: 0.9; }
}

.indicator-card.total-card { border-color: #0cf; box-shadow: 0 5px 15px rgb(0 204 255 / 30%); &:hover { box-shadow: 0 5px 20px rgb(0 204 255 / 50%); } }
.indicator-card.rate-card { border-color: #13ce66; box-shadow: 0 5px 15px rgb(19 206 102 / 30%); &:hover { box-shadow: 0 5px 20px rgb(19 206 102 / 50%); } }
.indicator-card.satisfaction-card { border-color: #ffc107; box-shadow: 0 5px 15px rgb(255 193 7 / 30%); &:hover { box-shadow: 0 5px 20px rgb(255 193 7 / 50%); } }

.header-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 0.2vw;
  .actions-left p { margin: 0; font-size: 0.9vw; font-weight: 500; color: #00ffd0; }
  .view-btn-group { display: flex; margin-right: 0.5vw; }
  :deep(.view-btn) { padding: 0 0.4vw; font-size: 0.6vw; color: #fff; background-color: transparent; border-color: rgb(25 186 139 / 60%); &:hover { color: #00ffd0; border-color: #00ffd0; } &.el-button--primary { color: #afc2ff; background-color: rgb(0 204 255 / 20%); border-color: rgb(25 186 139 / 60%); } }
  .panel-fullscreen-btn { margin-right: 0.5vw; cursor: pointer; background: transparent; border: none; }
}

.gov-enterprise-table-box {
  width: 100%;
  height: 100%;
  overflow: auto !important;
}
:deep(.gov-enterprise-coop-table) {
  --el-table-text-color: #fff;
  --el-table-header-text-color: #00ffd0;
  --el-table-border-color: rgb(25 186 139 / 30%);
  --el-table-row-hover-bg-color: rgb(0 204 255 / 10%);
  width: 100%;
  height: 100%;
  font-size: 0.7vw;
  table-layout: fixed;
  th, td { white-space: nowrap; border-color: rgb(25 186 139 / 30%) !important; }
}

.force-stats-overlay1 {
  position: absolute;
  top: 2vh;
  left: 0.5vw;
  z-index: 999;
  display: flex;
  flex-direction: column;
  width: 120px;
}
.force-stats-overlay1 .force-stats-cards {
  display: flex;
  flex-direction: column;
  gap: 0.5vw;
  width: 100%;
}

.force-stats-overlay2 {
  position: absolute;
  bottom: 3.6vh;
  right: 0.5vw;
  z-index: 999;
  display: flex;
  flex-direction: row;
  gap: 0.8vw;
}
.force-stats-overlay2 .force-stats-cards {
  display: flex;
  gap: 0.8vw;
  width: 100%;
}

.force-stat-card {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5vw;
  cursor: pointer;
  background: rgb(0 30 60 / 70%);
  border: 1px solid rgb(0 204 255 / 30%);
  border-radius: 8px;
  transition: all 0.3s ease;
  height: 60px;
}

.force-stat-card2 {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0.5vw;
  cursor: pointer;
  background: rgb(0 30 60 / 80%);
  border: 1px solid rgb(0 204 255 / 30%);
  border-radius: 8px;
  transition: all 0.3s ease;
  width: 280px;
  height: 200px;
}

.chart-card { padding: 0.3vw !important; }
.stat-content { flex: 1; overflow: hidden; }
.stat-title { padding-bottom: 0.5vh; font-size: 0.7vw; color: rgb(255 255 255 / 70%); }
.stat-value { font-size: 0.8vw; color: rgb(0 204 255 / 80%); }
</style>
