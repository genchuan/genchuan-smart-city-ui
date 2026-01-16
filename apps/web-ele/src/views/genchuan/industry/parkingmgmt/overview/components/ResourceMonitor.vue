<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Filter, FullScreen, Setting, VideoPause, VideoPlay } from '@element-plus/icons-vue';
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElSwitch, ElTable, ElTableColumn, ElTabPane, ElTabs, ElTag } from 'element-plus';
import screenFull from 'screenfull';

import {
  fetchCarTrackGeometries, fetchCarTrackIndicators, fetchCarTrackSingleTrend, fetchMaintainDeptOnDutyCompare,
  fetchMaintainStaffGeometries, fetchMaintainStaffIndicators, fetchParkingResourceGeometries, fetchParkPanoramaIndicators,
  fetchParkPanoramaResourceTypeRatio, fetchParkPanoramaSpaceTypeRatio, fetchParkResourceAreaCompare, fetchParkResourceAreaRatio,
  fetchParkResourceIndicators, fetchParkResourceList, fetchParkResourceTrend, fetchParkResourceTypeCompare, fetchSparePartIndicators,
  fetchSparePartInOutTrend, fetchSparePartList, fetchSparePartTypeRatio, fetchTerminalDeviceIndicators, fetchTerminalDeviceList,
  fetchTerminalDeviceOnlineRateTrend, fetchTerminalDeviceStatusRatio, fetchTerminalDeviceTypeRatio
} from '#/api/genchuan/industry/parkingmgmt/overview/ResourceMonitor.ts';
import ChartLine1 from '#/views/genchuan/industry/templatesstatchart/ChartLine1.vue';
import ChartLine2 from '#/views/genchuan/industry/templatesstatchart/ChartLine2.vue';
import ChartPie1 from '#/views/genchuan/industry/templatesstatchart/ChartPie1.vue';
import ChartPie2 from '#/views/genchuan/industry/templatesstatchart/ChartPie2.vue';
import VerticalBar2 from '#/views/genchuan/industry/templatesstatchart/VerticalBar2.vue';
import VerticalBar3 from '#/views/genchuan/industry/templatesstatchart/VerticalBar3.vue';

import MapCommon2 from './ResourceMonitorMap2.vue';
import MapCommon3 from './ResourceMonitorMap3.vue';
import MapCommon4 from './ResourceMonitorMap4.vue';

const mapCommon2Ref = ref<InstanceType<typeof MapCommon2> | null>(null);
const mapCommon3Ref = ref<InstanceType<typeof MapCommon3> | null>(null);
const mapCommon4Ref = ref<InstanceType<typeof MapCommon4> | null>(null);
const mapCommon3Ref_Top = ref<InstanceType<typeof MapCommon3> | null>(null);
const mapCommon4Ref_Top = ref<InstanceType<typeof MapCommon4> | null>(null);

const maintainStaffGeometries = ref<any[]>([]);
const parkResourceGeometries = ref<any[]>([]);
const carTrackGeometries = ref<any[]>([]);
const map = ref<any>(null);

const maintainStaffIndicatorData = ref({ totalStaffCount: 0, onDutyCount: 0, taskCount: 0 });
const parkPanoramaIndicatorData = ref({ totalResourceCount: 0, availableResourceCount: 0, normalOperateCount: 0, normalOperateRate: 0 });
const carTrackIndicatorData = ref({ todayPassCarCount: 0, abnormalCarCount: 0 });
const maintainDeptCompareData = ref({ xAxis: [], series: [] });
const carTrackSingleTrendData = ref({ xAxis: [], series: [] });
const parkResourceTypeRatioData = ref({ legend: [], series: [] });
const parkSpaceTypeRatioData = ref({ legend: [], series: [] });

const map2Loading = ref(true);
const map3Loading = ref(true);
const map4Loading = ref(true);

const getStoredOrbitConfig = () => {
  const stored = localStorage.getItem('parkingMapOrbitConfig');
  if (stored) {
    try { return JSON.parse(stored); }
    catch (error) { console.warn('读取本地存储的地图配置失败，使用默认值:', error); }
  }
  return { center: { lat: 24.58, lng: 117.65 }, rotateSpeed: 0.1, pitch: 40, zoom: 12, loop: true };
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

const handleOrbitAnimation2 = () => {
  if (mapCommon2Ref.value && typeof mapCommon2Ref.value.toggleOrbitAnimation === 'function') mapCommon2Ref.value.toggleOrbitAnimation();
  else ElMessage.warning('运维人员地图环绕功能暂未初始化完成');
};

const handleOrbitAnimation3 = () => {
  const targetRef = mapCommon3Ref_Top.value || mapCommon3Ref.value;
  if (targetRef && typeof targetRef.toggleOrbitAnimation === 'function') targetRef.toggleOrbitAnimation();
  else ElMessage.warning('资源全景地图环绕功能暂未初始化完成');
};

const handleOrbitAnimation4 = () => {
  const targetRef = mapCommon4Ref_Top.value || mapCommon4Ref.value;
  if (targetRef && typeof targetRef.toggleOrbitAnimation === 'function') targetRef.toggleOrbitAnimation();
  else ElMessage.warning('车辆轨迹地图环绕功能暂未初始化完成');
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
    [mapCommon2Ref.value, mapCommon3Ref.value, mapCommon4Ref.value, mapCommon3Ref_Top.value, mapCommon4Ref_Top.value].forEach(ref => {
      ref && (ref.stopOrbitAnimation(), ref.startOrbitAnimation());
    });
    orbitConfigDialogVisible.value = false;
    ElMessage.success('地图环绕配置已生效（已持久化，刷新不丢失）');
  } catch { ElMessage.error('配置校验失败，请检查输入'); }
};

const resetToDefaultConfig = () => {
  const defaultConfig = { center: { lat: 24.58, lng: 117.65 }, rotateSpeed: 0.1, pitch: 40, zoom: 12, loop: true };
  orbitConfigData.value = defaultConfig;
  orbitConfigForm.value = { centerLat: defaultConfig.center.lat, centerLng: defaultConfig.center.lng, rotateSpeed: defaultConfig.rotateSpeed, pitch: defaultConfig.pitch, zoom: defaultConfig.zoom, loop: defaultConfig.loop };
  localStorage.removeItem('parkingMapOrbitConfig');
  [mapCommon2Ref.value, mapCommon3Ref.value, mapCommon4Ref.value, mapCommon3Ref_Top.value, mapCommon4Ref_Top.value].forEach(ref => {
    ref && (ref.stopOrbitAnimation(), ref.startOrbitAnimation());
  });
  ElMessage.success('已恢复默认配置');
};

const initAllMapData = async () => {
  try {
    const maintainData = await fetchMaintainStaffGeometries({});
    maintainStaffGeometries.value = maintainData.map((item) => ({ ...item, latitude: item.maintainLatitude, longitude: item.maintainLongitude }));
    map2Loading.value = false;

    parkResourceGeometries.value = await fetchParkingResourceGeometries({});
    map3Loading.value = false;

    const carTrackData = await fetchCarTrackGeometries({});
    carTrackGeometries.value = carTrackData.map((item) => ({ ...item, latitude: item.carLatitude, longitude: item.carLongitude }));
    map4Loading.value = false;
  } catch (error) {
    console.error('地图数据加载失败：', error);
    ElMessage.error('地图数据加载失败，请刷新重试');
    maintainStaffGeometries.value = [];
    parkResourceGeometries.value = [];
    carTrackGeometries.value = [];
    map2Loading.value = false;
    map3Loading.value = false;
    map4Loading.value = false;
  }
};

const getMaintainStaffIndicatorData = async () => { try { maintainStaffIndicatorData.value = await fetchMaintainStaffIndicators({}); } catch { maintainStaffIndicatorData.value = { totalStaffCount: 0, onDutyCount: 0, taskCount: 0 }; } };
const getMaintainDeptCompareData = async () => { try { maintainDeptCompareData.value = await fetchMaintainDeptOnDutyCompare({}); } catch { maintainDeptCompareData.value = { xAxis: [], series: [] }; } };
const getParkPanoramaIndicatorData = async () => { try { parkPanoramaIndicatorData.value = await fetchParkPanoramaIndicators({}); } catch { parkPanoramaIndicatorData.value = { totalResourceCount: 0, availableResourceCount: 0, normalOperateCount: 0, normalOperateRate: 0 }; } };
const getParkResourceTypeRatioData = async () => { try { parkResourceTypeRatioData.value = await fetchParkPanoramaResourceTypeRatio({}); } catch { parkResourceTypeRatioData.value = { legend: [], series: [] }; } };
const getParkSpaceTypeRatioData = async () => { try { parkSpaceTypeRatioData.value = await fetchParkPanoramaSpaceTypeRatio({}); } catch { parkSpaceTypeRatioData.value = { legend: [], series: [] }; } };
const getCarTrackIndicatorData = async () => { try { carTrackIndicatorData.value = await fetchCarTrackIndicators({}); } catch { carTrackIndicatorData.value = { todayPassCarCount: 0, abnormalCarCount: 0 }; } };
const getCarTrackSingleTrendData = async () => { try { carTrackSingleTrendData.value = await fetchCarTrackSingleTrend({}); } catch { carTrackSingleTrendData.value = { xAxis: [], series: [] }; } };

const pageContainerRef = ref<HTMLElement | null>(null);
const router = useRouter();
const topLeftActiveTab = ref('tab1');
const topMiddleActiveTab = ref('tab1');
const topRightActiveTab = ref('tab1');
const bottomMiddleActiveTab = ref('tab1');

const terminalDevicePanelRef = ref<HTMLElement | null>(null);
const terminalDeviceList = ref<any[]>([]);
const terminalDeviceIndicators = ref({ totalDeviceCount: 0, onlineDeviceCount: 0, faultDeviceCount: 0 });
const terminalDeviceOnlineRateData = ref({ xAxis: [], series: [] });
const terminalDeviceTypeRatioData = ref({ legend: [], series: [] });
const terminalDeviceStatusRatioData = ref({ legend: [], series: [] });
const terminalDeviceBaseFontScale = ref(1);
const terminalDeviceActiveIndices = ref([]);
const terminalDeviceChartRefreshKey = ref(0);
const activeTerminalDeviceView = ref('卡片');
const terminalDeviceViewBtnList = ref(['卡片', '饼图', '列表', '折线图']);

const sparePartPanelRef = ref<HTMLElement | null>(null);
const sparePartList = ref<any[]>([]);
const sparePartIndicators = ref({ totalPartTypeCount: 0, enoughStockCount: 0, lackStockCount: 0 });
const sparePartInOutTrendData = ref({ xAxis: [], series: [] });
const sparePartTypeRatioData = ref({ legend: [], series: [] });
const sparePartBaseFontScale = ref(1);
const sparePartActiveIndices = ref([]);
const sparePartChartRefreshKey = ref(0);
const activeSparePartView = ref('卡片');
const sparePartViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);

const parkResourcePanelRef = ref<HTMLElement | null>(null);
const parkMap2Ref = ref<HTMLElement | null>(null);
const parkMap3Ref = ref<HTMLElement | null>(null);
const parkMap4Ref = ref<HTMLElement | null>(null);

const parkResourceList = ref<any[]>([]);
const parkResourceIndicators = ref({ avgTurnoverRate: 0, avgUtilizationRate: 0 });
const parkResourceTrendData = ref({ xAxis: [], series: [] });
const parkResourceAreaRatioData = ref({ legend: [], series: [] });
const parkResourceAreaCompareData = ref({ xAxis: [], series: [] });
const parkResourceTypeCompareData = ref({ xAxis: [], series: [] });
const parkResourceBaseFontScale = ref(1);
const parkResourceActiveIndices = ref([]);
const parkResourceChartRefreshKey = ref(0);
const activeParkResourceView = ref('柱状图');
const parkResourceViewBtnList = ref(['卡片', '柱状图', '列表', '折线图', '饼图']);

const topMainChartRefreshKey = ref(0);
const handleTabChange = () => {
  nextTick(() => {
    setTimeout(() => {
      topMainChartRefreshKey.value += 1;
      terminalDeviceChartRefreshKey.value += 1;
      sparePartChartRefreshKey.value += 1;
      parkResourceChartRefreshKey.value += 1;
    }, 100);
  });
};

const changeTerminalDeviceView = (viewName: string) => {
  activeTerminalDeviceView.value = viewName;
  viewName === '卡片' && nextTick(() => initTerminalDeviceNumberAnimations());
  (viewName === '饼图' || viewName === '折线图') && nextTick(() => terminalDeviceChartRefreshKey.value += 1);
};
const changeSparePartView = (viewName: string) => {
  activeSparePartView.value = viewName;
  viewName === '卡片' && nextTick(() => initSparePartNumberAnimations());
  (viewName === '柱状图' || viewName === '饼图') && nextTick(() => sparePartChartRefreshKey.value += 1);
};
const changeParkResourceView = (viewName: string) => {
  activeParkResourceView.value = viewName;
  viewName === '卡片' && nextTick(() => initParkResourceNumberAnimations());
  (viewName === '柱状图' || viewName === '折线图' || viewName === '饼图') && nextTick(() => parkResourceChartRefreshKey.value += 1);
};

const currentFullscreenPanel = ref<HTMLElement | null>(null);
const panelMap = { terminal: terminalDevicePanelRef, spare: sparePartPanelRef, parkMap2: parkMap2Ref, parkMap3: parkMap3Ref, parkMap4: parkMap4Ref, parkResource: parkResourcePanelRef };

const handleFullscreenChange = () => {
  if (!screenFull.isFullscreen && currentFullscreenPanel.value) {
    currentFullscreenPanel.value.style.width = '';
    currentFullscreenPanel.value.style.height = '';
    currentFullscreenPanel.value.style.overflow = 'hidden';
    switch (currentFullscreenPanel.value) {
      case parkResourcePanelRef.value: parkResourceChartRefreshKey.value += 1; break;
      case sparePartPanelRef.value: sparePartChartRefreshKey.value += 1; break;
      case terminalDevicePanelRef.value: terminalDeviceChartRefreshKey.value += 1; break;
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

const getTerminalDeviceListData = async () => { try { terminalDeviceList.value = await fetchTerminalDeviceList(); } catch { ElMessage.error('故障/离线设备数据加载失败'); terminalDeviceList.value = []; } };
const getTerminalDeviceIndicatorData = async () => { try { terminalDeviceIndicators.value = await fetchTerminalDeviceIndicators(); nextTick(() => initTerminalDeviceNumberAnimations()); } catch { terminalDeviceIndicators.value = { totalDeviceCount: 0, onlineDeviceCount: 0, faultDeviceCount: 0 }; } };
const getTerminalDeviceOnlineRateTrendData = async () => { try { terminalDeviceOnlineRateData.value = await fetchTerminalDeviceOnlineRateTrend(); } catch { terminalDeviceOnlineRateData.value = { xAxis: [], series: [{ name: '设备在线率(%)', data: [] }] }; } };
const getTerminalDeviceTypeRatioData = async () => { try { terminalDeviceTypeRatioData.value = await fetchTerminalDeviceTypeRatio(); } catch { terminalDeviceTypeRatioData.value = { legend: [], series: [{ name: '设备类型占比', data: [] }] }; } };
const getTerminalDeviceStatusRatioData = async () => { try { terminalDeviceStatusRatioData.value = await fetchTerminalDeviceStatusRatio(); } catch { terminalDeviceStatusRatioData.value = { legend: [], series: [{ name: '设备运行状态占比', data: [] }] }; } };

const getSparePartListData = async () => { try { sparePartList.value = await fetchSparePartList(); } catch { ElMessage.error('备品备件库存数据加载失败'); sparePartList.value = []; } };
const getSparePartIndicatorData = async () => { try { sparePartIndicators.value = await fetchSparePartIndicators(); nextTick(() => initSparePartNumberAnimations()); } catch { sparePartIndicators.value = { totalPartTypeCount: 0, enoughStockCount: 0, lackStockCount: 0 }; } };
const getSparePartInOutTrendData = async () => { try { sparePartInOutTrendData.value = await fetchSparePartInOutTrend(); } catch { sparePartInOutTrendData.value = { xAxis: [], series: [{ name: '入库数量(件)', data: [] }, { name: '出库数量(件)', data: [] }] }; } };
const getSparePartTypeRatioData = async () => { try { sparePartTypeRatioData.value = await fetchSparePartTypeRatio(); } catch { sparePartTypeRatioData.value = { legend: [], series: [{ name: '备件类型占比', data: [] }] }; } };

const getParkResourceListData = async () => { try { parkResourceList.value = await fetchParkResourceList(); } catch { ElMessage.error('停车资源效能数据加载失败'); parkResourceList.value = []; } };
const getParkResourceIndicatorData = async () => { try { parkResourceIndicators.value = await fetchParkResourceIndicators(); nextTick(() => initParkResourceNumberAnimations()); } catch { parkResourceIndicators.value = { avgTurnoverRate: 0, avgUtilizationRate: 0 }; } };
const getParkResourceTrendData = async () => { try { parkResourceTrendData.value = await fetchParkResourceTrend(); } catch { parkResourceTrendData.value = { xAxis: [], series: [{ name: '泊位周转率(次/日)', data: [] }, { name: '资源利用率(%)', data: [] }] }; } };
const getParkResourceAreaRatioData = async () => { try { parkResourceAreaRatioData.value = await fetchParkResourceAreaRatio(); } catch { parkResourceAreaRatioData.value = { legend: [], series: [{ name: '区域资源效能占比', data: [] }] }; } };
const getParkResourceAreaCompareData = async () => { try { parkResourceAreaCompareData.value = await fetchParkResourceAreaCompare(); } catch { parkResourceAreaCompareData.value = { xAxis: [], series: [{ name: '区域平均利用率(%)', data: [] }] }; } };
const getParkResourceTypeCompareData = async () => { try { parkResourceTypeCompareData.value = await fetchParkResourceTypeCompare(); } catch { parkResourceTypeCompareData.value = { xAxis: [], series: [{ name: '类型平均利用率(%)', data: [] }] }; } };

const getDeviceStatusTagType = (val: string) => { switch (val) { case 'abnormal': return 'info'; case 'fault': return 'danger'; case 'offline': return 'warning'; case 'online': return 'success'; default: return ''; } };
const getDeviceStatusName = (val: string) => { switch (val) { case 'abnormal': return '通讯异常'; case 'fault': return '故障告警'; case 'offline': return '设备离线'; case 'online': return '在线运行'; default: return '未知状态'; } };
const getDeviceTypeName = (val: string) => { switch (val) { case 'barrier': return '道闸设备'; case 'camera': return '监控摄像头'; case 'charging': return '充电桩'; case 'screen': return '车位引导屏'; case 'sensor': return '地磁传感器'; default: return '未知类型'; } };
const formatDeviceTimeStamp = (timeStamp: any) => {
  if (!timeStamp) return '-';
  const d = new Date(Number(timeStamp));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
const formatMonitorData = (data: any) => data ? `电压:${data.voltage}V | 信号:${data.signalStrength}dBm` : '-';

const getSparePartStockStatusTag = (current: number, min: number) => { if (current >= min) return 'success'; if (current > 0) return 'warning'; return 'danger'; };
const getSparePartStockStatusName = (current: number, min: number) => { if (current >= min) return '库存充足'; if (current > 0) return '库存预警'; return '库存缺货'; };
const formatSparePartTimeStamp = (timeStamp: any) => formatDeviceTimeStamp(timeStamp);

const getAreaName = (val: string) => { switch (val) { case 'culture': return '文旅区'; case 'economic': return '经开区'; case 'highTech': return '高新区'; case 'main': return '主城区'; case 'suburb': return '周边区县'; default: return '未知区域'; } };
const getParkTypeTag = (val: string) => {
  switch (val) {
    case 'business': return { name: '商业车场', type: 'success' };
    case 'community': return { name: '小区车场', type: 'danger' };
    case 'park': return { name: '园区车场', type: 'warning' };
    case 'public': return { name: '公共车场', type: 'primary' };
    case 'tourism': return { name: '文旅车场', type: 'info' };
    default: return { name: '未知类型', type: '' };
  }
};
const formatPercent = (val: number) => (val ? `${val.toFixed(1)}%` : '0.0%');
const formatTurnover = (val: number) => val ? `${val.toFixed(1)}次/日` : '0.0次/日';
const formatParkTimeStamp = (timeStamp: any) => formatDeviceTimeStamp(timeStamp);

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

const initTerminalDeviceNumberAnimations = () => { document.querySelectorAll('.terminal-device-number-animate').forEach((el) => animateValue(el, 0, Number.parseFloat(el.dataset.value || 0), 1500)); };
const initSparePartNumberAnimations = () => { document.querySelectorAll('.spare-part-number-animate').forEach((el) => animateValue(el, 0, Number.parseFloat(el.dataset.value || 0), 1500)); };
const initParkResourceNumberAnimations = () => { document.querySelectorAll('.park-resource-number-animate').forEach((el) => animateValue(el, 0, Number.parseFloat(el.dataset.value || 0), 1500)); };

onMounted(async () => {
  await initAllMapData();
  resetOrbitConfigForm();
  await Promise.all([
    getTerminalDeviceListData(), getTerminalDeviceIndicatorData(), getTerminalDeviceOnlineRateTrendData(), getTerminalDeviceTypeRatioData(), getTerminalDeviceStatusRatioData(),
    getSparePartListData(), getSparePartIndicatorData(), getSparePartInOutTrendData(), getSparePartTypeRatioData(),
    getParkResourceListData(), getParkResourceIndicatorData(), getParkResourceTrendData(), getParkResourceAreaRatioData(), getParkResourceAreaCompareData(), getParkResourceTypeCompareData(),
    getMaintainStaffIndicatorData(), getMaintainDeptCompareData(), getParkPanoramaIndicatorData(), getParkResourceTypeRatioData(), getParkSpaceTypeRatioData(),
    getCarTrackIndicatorData(), getCarTrackSingleTrendData()
  ]);
  setTimeout(() => {
    terminalDeviceChartRefreshKey.value += 1;
    sparePartChartRefreshKey.value += 1;
    parkResourceChartRefreshKey.value += 1;
  }, 200);
});

onUnmounted(() => {
  [mapCommon2Ref.value, mapCommon3Ref.value, mapCommon4Ref.value, mapCommon3Ref_Top.value, mapCommon4Ref_Top.value].forEach(ref => ref && ref.stopOrbitAnimation());
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
            <ElTabPane label="资源全景监控" name="tab1">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <button class="control-btn" @click="handleOrbitAnimation3">
                    <el-icon color="#409eff" size="16">
                      <VideoPause v-if="mapCommon3Ref_Top?.orbitStatus?.playing" />
                      <VideoPlay v-else />
                    </el-icon>
                  </button>
                  <button class="control-btn" @click="orbitConfigDialogVisible = true">
                    <el-icon color="#409eff" size="16"><Setting /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('parkMap3')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div style="flex: 1; width: 100%; height: calc(100% - 2vh);position: relative;">
                <div class="stats-overlay1">
                  <div class="stats-cards1">
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">总资源数</div>
                        <div class="stat-value">{{ parkPanoramaIndicatorData.totalResourceCount || 0 }} 个</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">可用资源数</div>
                        <div class="stat-value">{{ parkPanoramaIndicatorData.availableResourceCount || 0 }} 个</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">正常运营率</div>
                        <div class="stat-value">{{ parkPanoramaIndicatorData.normalOperateRate || 0 }} %</div>
                      </div>
                    </div>
                  </div>
                </div>
                <MapCommon3 v-if="!map3Loading && topMiddleActiveTab === 'tab1'" ref="mapCommon3Ref_Top" id-name="parkingMap3_top" :geometries-array="parkResourceGeometries" :orbit-config="orbitConfigData" />
                <div class="chart-overlay2">
                  <div class="chart-cards2">
                    <div class="chart-card">
                      <ChartPie1 :key="topMainChartRefreshKey" :data="parkResourceTypeRatioData" title="资源类型占比" :base-font-scale="parkResourceBaseFontScale" :active-indices="parkResourceActiveIndices" style="width:100%;height:100%"/>
                    </div>
                    <div class="chart-card">
                      <ChartPie2 :key="topMainChartRefreshKey" :data="parkSpaceTypeRatioData" title="车位类型占比" :base-font-scale="parkResourceBaseFontScale" :active-indices="parkResourceActiveIndices" style="width:100%;height:100%"/>
                    </div>
                  </div>
                </div>
              </div>
            </ElTabPane>
            <ElTabPane label="车辆轨迹监控" name="tab2">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <button class="control-btn" @click="handleOrbitAnimation4">
                    <el-icon color="#409eff" size="16">
                      <VideoPause v-if="mapCommon4Ref_Top?.orbitStatus?.playing" />
                      <VideoPlay v-else />
                    </el-icon>
                  </button>
                  <button class="control-btn" @click="orbitConfigDialogVisible = true">
                    <el-icon color="#409eff" size="16"><Setting /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('parkMap4')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div style="flex: 1; width: 100%; height: calc(100% - 2vh);position: relative;">
                <div class="stats-overlay1">
                  <div class="stats-cards1">
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">当日通行车辆数</div>
                        <div class="stat-value">{{ carTrackIndicatorData.todayPassCarCount || 0 }} 辆</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">异常通行车辆数</div>
                        <div class="stat-value">{{ carTrackIndicatorData.abnormalCarCount || 0 }} 辆</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">正常通行率</div>
                        <div class="stat-value">{{ carTrackIndicatorData.todayPassCarCount > 0 ? (((carTrackIndicatorData.todayPassCarCount - carTrackIndicatorData.abnormalCarCount)/carTrackIndicatorData.todayPassCarCount)*100).toFixed(1) : 100 }} %</div>
                      </div>
                    </div>
                  </div>
                </div>
                <MapCommon4 v-if="!map4Loading && topMiddleActiveTab === 'tab2'" ref="mapCommon4Ref_Top" id-name="parkingMap4_top" :geometries-array="carTrackGeometries" :orbit-config="orbitConfigData" />
                <div class="chart-overlay2">
                  <div class="chart-cards2">
                    <div class="chart-card">
                      <ChartLine2 :key="topMainChartRefreshKey" :data="carTrackSingleTrendData" title="单车辆通行时段趋势" y-axis-name="(辆)" :base-font-scale="parkResourceBaseFontScale" style="width:100%;height:100%"/>
                    </div>
                  </div>
                </div>
              </div>
            </ElTabPane>
            <ElTabPane label="运维人员动态" name="tab3">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <button class="control-btn" @click="handleOrbitAnimation2">
                    <el-icon color="#409eff" size="16">
                      <VideoPause v-if="mapCommon2Ref?.orbitStatus?.playing" />
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
                <div class="stats-overlay1">
                  <div class="stats-cards1">
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">总运维人数</div>
                        <div class="stat-value">{{ maintainStaffIndicatorData.totalStaffCount || 0 }} 人</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">在岗人数</div>
                        <div class="stat-value">{{ maintainStaffIndicatorData.onDutyCount || 0 }} 人</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">当前任务数</div>
                        <div class="stat-value">{{ maintainStaffIndicatorData.taskCount || 0 }} 个</div>
                      </div>
                    </div>
                  </div>
                </div>
                <MapCommon2 v-if="!map2Loading && topMiddleActiveTab === 'tab3'" ref="mapCommon2Ref" id-name="parkingMap2" :geometries-array="maintainStaffGeometries" :orbit-config="orbitConfigData" />
                <div class="chart-overlay2">
                  <div class="chart-cards2">
                    <div class="chart-card">
                      <VerticalBar2 :key="topMainChartRefreshKey" :x-axis="maintainDeptCompareData.xAxis" :series="maintainDeptCompareData.series" unit="人" title="各部门在岗人数对比" :base-font-scale="parkResourceBaseFontScale" :active-indices="parkResourceActiveIndices" style="width:100%;height:100%"/>
                    </div>
                  </div>
                </div>
              </div>
            </ElTabPane>
            <ElTabPane label="关键岗位人员" name="tab4">
              <div class="view-content">
                <div class="content-placeholder">关键岗位人员</div>
              </div>
            </ElTabPane>
          </ElTabs>
          <div class="panel-footer"></div>
        </div>
      </div>
      <div class="bottom">
        <div class="panel bottom-left" ref="parkMap3Ref">
          <ElTabs v-model="topLeftActiveTab" class="custom-tabs top-left-tabs" @tab-change="handleTabChange">
            <ElTabPane label="终端设备状态" name="tab1">
              <div class="header-actions">
                <div class="actions-left"></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton v-for="item in terminalDeviceViewBtnList" :key="item" :type="activeTerminalDeviceView === item ? 'primary' : ''" plain @click="changeTerminalDeviceView(item)" class="view-btn">{{ item }}</ElButton>
                  </div>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('terminal')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div v-if="activeTerminalDeviceView === '卡片'" class="view-content">
                <div class="indicator-cards1">
                  <div class="indicator-card1 card1" style="cursor: default">
                    <div class="indicator-title">总设备数</div>
                    <div class="indicator-value"><span :data-value="terminalDeviceIndicators.totalDeviceCount" class="terminal-device-number-animate">{{ terminalDeviceIndicators.totalDeviceCount }}</span></div>
                    <div class="indicator-unit">台</div>
                  </div>
                  <div class="indicator-card1 card2" style="cursor: default">
                    <div class="indicator-title">在线设备数</div>
                    <div class="indicator-value"><span :data-value="terminalDeviceIndicators.onlineDeviceCount" class="terminal-device-number-animate">{{ terminalDeviceIndicators.onlineDeviceCount }}</span></div>
                    <div class="indicator-unit">台</div>
                  </div>
                  <div class="indicator-card1 card3" style="cursor: default">
                    <div class="indicator-title">故障设备数</div>
                    <div class="indicator-value"><span :data-value="terminalDeviceIndicators.faultDeviceCount" class="terminal-device-number-animate">{{ terminalDeviceIndicators.faultDeviceCount }}</span></div>
                    <div class="indicator-unit">台</div>
                  </div>
                </div>
              </div>
              <div v-if="activeTerminalDeviceView === '饼图'" class="view-content" style="box-sizing: border-box; width: 100%; height: 100%;" :key="terminalDeviceChartRefreshKey">
                <div style="box-sizing: border-box; display: inline-block; width: 49%; height: 100%; vertical-align: top">
                  <ChartPie1 :data="terminalDeviceTypeRatioData" title="设备类型占比" :base-font-scale="terminalDeviceBaseFontScale" :active-indices="terminalDeviceActiveIndices" style="width:100%;height:100%"/>
                </div>
                <div style="box-sizing: border-box; display: inline-block; width: 49%; height: 100%; padding-left: 0.3vw; vertical-align: top; border-left: 0.3vh solid #02a6b5">
                  <ChartPie2 :data="terminalDeviceStatusRatioData" title="设备运行状态占比" :base-font-scale="terminalDeviceBaseFontScale" :active-indices="terminalDeviceActiveIndices" style="width:100%;height:100%"/>
                </div>
              </div>
              <div v-if="activeTerminalDeviceView === '列表'" class="view-content">
                <div class="table-box3">
                  <ElTable class="table3" :data="terminalDeviceList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row>
                    <ElTableColumn prop="deviceExtendId" label="设备ID" align="center" />
                    <ElTableColumn prop="deviceCode" label="设备编码" align="center" min-width="120px" />
                    <ElTableColumn prop="deviceType" label="设备类型" align="center" min-width="100px"><template #default="scope">{{ getDeviceTypeName(scope.row.deviceType) }}</template></ElTableColumn>
                    <ElTableColumn prop="status" label="运行状态" align="center" min-width="120px"><template #default="scope"><ElTag :type="getDeviceStatusTagType(scope.row.status)">{{ getDeviceStatusName(scope.row.status) }}</ElTag></template></ElTableColumn>
                    <ElTableColumn prop="responsiblePerson" label="责任人" align="center" min-width="100px" />
                    <ElTableColumn prop="monitorId" label="监控记录ID" align="center" />
                    <ElTableColumn prop="monitorData" label="核心监控数据" align="center" min-width="180px"><template #default="scope">{{ formatMonitorData(scope.row.monitorData) }}</template></ElTableColumn>
                    <ElTableColumn prop="updateTime" label="更新时间" align="center" min-width="120px"><template #default="scope">{{ formatDeviceTimeStamp(scope.row.updateTime) }}</template></ElTableColumn>
                    <ElTableColumn prop="assetId" label="所属资产" align="center" />
                    <ElTableColumn prop="installPosition" label="安装位置" align="center" min-width="200px" />
                  </ElTable>
                </div>
              </div>
              <div v-if="activeTerminalDeviceView === '折线图'" class="view-content" style="box-sizing: border-box; width: 100%; height: 100%; padding: 0.3vw" :key="terminalDeviceChartRefreshKey">
                <ChartLine1 :data="terminalDeviceOnlineRateData" title="近24小时设备在线率趋势" y-axis-name="设备在线率(%)" :base-font-scale="terminalDeviceBaseFontScale" style="width:100%;height:100%"/>
              </div>
            </ElTabPane>
            <ElTabPane label="充电桩状态视图" name="tab2">
              <div class="view-content"><div class="content-placeholder">充电桩状态视图</div></div>
            </ElTabPane>
          </ElTabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-middle" ref="parkResourcePanelRef">
          <ElTabs v-model="bottomMiddleActiveTab" class="custom-tabs top-left-tabs" @tab-change="handleTabChange">
            <ElTabPane label="停车资源效能" name="tab1">
              <div class="header-actions">
                <div class="actions-left"></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton v-for="item in parkResourceViewBtnList" :key="item" :type="activeParkResourceView === item ? 'primary' : ''" plain @click="changeParkResourceView(item)" class="view-btn">{{ item }}</ElButton>
                  </div>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('parkResource')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div v-if="activeParkResourceView === '卡片'" class="view-content">
                <div class="indicator-cards1">
                  <div class="indicator-card1 card1" style="cursor: default">
                    <div class="indicator-title">平均泊位周转率</div>
                    <div class="indicator-value"><span :data-value="parkResourceIndicators.avgTurnoverRate" class="park-resource-number-animate">{{ parkResourceIndicators.avgTurnoverRate }}</span></div>
                    <div class="indicator-unit">次/日</div>
                  </div>
                  <div class="indicator-card1 card2" style="cursor: default">
                    <div class="indicator-title">平均资源利用率</div>
                    <div class="indicator-value"><span :data-value="parkResourceIndicators.avgUtilizationRate" class="park-resource-number-animate">{{ parkResourceIndicators.avgUtilizationRate }}</span></div>
                    <div class="indicator-unit">%</div>
                  </div>
                </div>
              </div>
              <div v-if="activeParkResourceView === '柱状图'" class="view-content" style="box-sizing: border-box; display: flex; flex-direction: column; width: 100%; height: 100%; padding: 0.3vw 0.2vw" :key="parkResourceChartRefreshKey">
                <div style="box-sizing: border-box; width: 100%; height: calc(50% - 4px)"><VerticalBar3 :x-axis="parkResourceAreaCompareData.xAxis" :series="parkResourceAreaCompareData.series" unit="%" title="区域资源利用率对比" :base-font-scale="parkResourceBaseFontScale" :active-indices="parkResourceActiveIndices" style="width:100%;height:100%"/></div>
                <div style="box-sizing: border-box; width: 100%; height: calc(50% - 4px); marginTop: 8px"><VerticalBar3 :x-axis="parkResourceTypeCompareData.xAxis" :series="parkResourceTypeCompareData.series" unit="%" title="车场类型利用率对比" :base-font-scale="parkResourceBaseFontScale" :active-indices="parkResourceActiveIndices" style="width:100%;height:100%"/></div>
              </div>
              <div v-if="activeParkResourceView === '列表'" class="view-content">
                <div class="table-box1">
                  <ElTable class="table1" :data="parkResourceList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row>
                    <ElTableColumn prop="lotId" label="车场ID" align="center" />
                    <ElTableColumn prop="lotName" label="车场名称" align="center" min-width="140px" />
                    <ElTableColumn prop="parkingSpaceTurnoverRate" label="泊位周转率" align="center" min-width="120px"><template #default="scope">{{ formatTurnover(scope.row.parkingSpaceTurnoverRate) }}</template></ElTableColumn>
                    <ElTableColumn prop="resourceUtilizationRate" label="资源利用率" align="center" min-width="120px"><template #default="scope">{{ formatPercent(scope.row.resourceUtilizationRate) }}</template></ElTableColumn>
                    <ElTableColumn prop="peakTimePeriodUtilizationRate" label="高峰时段使用率" align="center" min-width="140px"><template #default="scope">{{ formatPercent(scope.row.peakTimePeriodUtilizationRate) }}</template></ElTableColumn>
                    <ElTableColumn prop="areaCode" label="所属区域" align="center" min-width="100%"><template #default="scope">{{ getAreaName(scope.row.areaCode) }}</template></ElTableColumn>
                    <ElTableColumn prop="parkType" label="车场类型" align="center" min-width="120px"><template #default="scope"><ElTag :type="getParkTypeTag(scope.row.parkType).type">{{ getParkTypeTag(scope.row.parkType).name }}</ElTag></template></ElTableColumn>
                    <ElTableColumn prop="statTime" label="统计时间" align="center" min-width="120px"><template #default="scope">{{ formatParkTimeStamp(scope.row.statTime) }}</template></ElTableColumn>
                  </ElTable>
                </div>
              </div>
              <div v-if="activeParkResourceView === '折线图'" class="view-content" style="box-sizing: border-box; width:100%;height:100%;padding:0.3vw" :key="parkResourceChartRefreshKey">
                <ChartLine1 :data="parkResourceTrendData" title="近周期资源效能趋势" y-axis-name="数值" :base-font-scale="parkResourceBaseFontScale" style="width:100%;height:100%"/>
              </div>
              <div v-if="activeParkResourceView === '饼图'" class="view-content" style="box-sizing: border-box; width:100%;height:100%;padding:0.3vw" :key="parkResourceChartRefreshKey">
                <ChartPie1 :data="parkResourceAreaRatioData" title="各区域资源效能占比" :base-font-scale="parkResourceBaseFontScale" :active-indices="parkResourceActiveIndices" style="width:100%;height:100%"/>
              </div>
            </ElTabPane>
            <ElTabPane label="设备资源效能" name="tab2">
              <div class="view-content"><div class="content-placeholder">设备资源效能</div></div>
            </ElTabPane>
          </ElTabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-right" ref="parkMap4Ref">
          <ElTabs v-model="topRightActiveTab" class="custom-tabs top-left-tabs" @tab-change="handleTabChange">
            <ElTabPane label="备品备件仓储" name="tab1">
              <div class="header-actions">
                <div class="actions-left"></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton v-for="item in sparePartViewBtnList" :key="item" :type="activeSparePartView === item ? 'primary' : ''" plain @click="changeSparePartView(item)" class="view-btn">{{ item }}</ElButton>
                  </div>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('spare')">
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <div v-if="activeSparePartView === '卡片'" class="view-content">
                <div class="indicator-cards1">
                  <div class="indicator-card1 card1" style="cursor: default">
                    <div class="indicator-title">总备件种类数</div>
                    <div class="indicator-value"><span :data-value="sparePartIndicators.totalPartTypeCount" class="spare-part-number-animate">{{ sparePartIndicators.totalPartTypeCount }}</span></div>
                    <div class="indicator-unit">种</div>
                  </div>
                  <div class="indicator-card1 card2" style="cursor: default">
                    <div class="indicator-title">库存充足数</div>
                    <div class="indicator-value"><span :data-value="sparePartIndicators.enoughStockCount" class="spare-part-number-animate">{{ sparePartIndicators.enoughStockCount }}</span></div>
                    <div class="indicator-unit">种</div>
                  </div>
                  <div class="indicator-card1 card3" style="cursor: default">
                    <div class="indicator-title">缺货备件数</div>
                    <div class="indicator-value"><span :data-value="sparePartIndicators.lackStockCount" class="spare-part-number-animate">{{ sparePartIndicators.lackStockCount }}</span></div>
                    <div class="indicator-unit">种</div>
                  </div>
                </div>
              </div>
              <div v-if="activeSparePartView === '柱状图'" class="view-content" style="box-sizing: border-box; width:100%;height:100%;padding:0.3vw" :key="sparePartChartRefreshKey">
                <VerticalBar3 :x-axis="sparePartInOutTrendData.xAxis" :series="sparePartInOutTrendData.series" unit="件" title="近30日备件出入库数量趋势" :base-font-scale="sparePartBaseFontScale" :active-indices="sparePartActiveIndices" style="width:100%;height:100%"/>
              </div>
              <div v-if="activeSparePartView === '饼图'" class="view-content" style="box-sizing: border-box; width:100%;height:100%;padding:0.3vw" :key="sparePartChartRefreshKey">
                <ChartPie1 :data="sparePartTypeRatioData" title="备件类型占比" :base-font-scale="sparePartBaseFontScale" :active-indices="sparePartActiveIndices" style="width:100%;height:100%"/>
              </div>
              <div v-if="activeSparePartView === '列表'" class="view-content">
                <div class="table-box3">
                  <ElTable class="table3" :data="sparePartList" border size="small" width="100%" height="100%" table-layout="fixed" highlight-current-row>
                    <ElTableColumn prop="sparePartId" label="备件ID" align="center" />
                    <ElTableColumn prop="partName" label="备件名称" align="center" min-width="120px" />
                    <ElTableColumn prop="model" label="型号" align="center" min-width="100px" />
                    <ElTableColumn prop="currentStock" label="当前库存" align="center" />
                    <ElTableColumn prop="minStock" label="最低库存阈值" align="center" />
                    <ElTableColumn label="库存状态" align="center" min-width="120px"><template #default="scope"><ElTag :type="getSparePartStockStatusTag(scope.row.currentStock, scope.row.minStock)">{{ getSparePartStockStatusName(scope.row.currentStock, scope.row.minStock) }}</ElTag></template></ElTableColumn>
                    <ElTableColumn prop="storageLocation" label="仓储位置" align="center" min-width="150px" />
                    <ElTableColumn prop="inId" label="入库记录ID" align="center" />
                    <ElTableColumn prop="inQuantity" label="入库数量" align="center" />
                    <ElTableColumn prop="inTime" label="入库时间" align="center" min-width="120px"><template #default="scope">{{ formatSparePartTimeStamp(scope.row.inTime) }}</template></ElTableColumn>
                    <ElTableColumn prop="outId" label="出库记录ID" align="center" />
                    <ElTableColumn prop="outQuantity" label="出库数量" align="center" />
                    <ElTableColumn prop="outTime" label="出库时间" align="center" min-width="120px"><template #default="scope">{{ formatSparePartTimeStamp(scope.row.outTime) }}</template></ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </ElTabPane>
            <ElTabPane label="物资调配跟踪" name="tab2">
              <div class="view-content"><div class="content-placeholder">物资调配跟踪</div></div>
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
@import '../../../templatesstyle/table3';
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

</style>
