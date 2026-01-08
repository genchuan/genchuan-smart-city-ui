<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  ArrowLeft,
  Filter,
  FullScreen,
  Operation,
  Setting,
  VideoPause,
  VideoPlay,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import screenFull from 'screenfull';

import {
  fetchParkingCoreIndicators,
  fetchParkingCoreObjectList,
  fetchParkingFeatureSituation,
  fetchParkingGlobalTrendIndicators,
  fetchParkingLotGeometries,
  fetchParkingStatisticsDistribution,
  fetchRoadsideBerthCoreElements,
} from '#/api/genchuan/industry/parkingmgmt/overview/GlobalSituationOverview.js';
import ChartPie1 from '#/views/genchuan/industry/templatesstatchart/ChartPie1.vue';
import HorizontalBar1 from '#/views/genchuan/industry/templatesstatchart/HorizontalBar1.vue';
import VerticalBar1 from '#/views/genchuan/industry/templatesstatchart/VerticalBar1.vue';

import MapCommon from './GlobalDataMap.vue';

const router = useRouter();
const pageContainerRef = ref(null);
const mapCommonRef = ref(null);
const geometriesArray = ref([]);
const currentFullscreenPanel = ref(null);
const coreIndicatorData = ref({});
const trendIndicatorData = ref({});
const parkingCoreObjectList = ref([]);
const roadsideBerthList = ref([]);
const featureSituationData = ref({
  lotUtilizationRate: 0,
  revenueProportion: 0,
  maintenanceTimelinessRate: 0,
});
const statisticsData = ref({
  faultDevice: { labels: [], data: [] },
  chargeAbnormal: { labels: [], data: [] },
  feeEvasionRegion: { labels: [], data: [] },
});
const objectDetailVisible = ref(false);
const selectedParkingRow = ref({});
const elementDetailVisible = ref(false);
const selectedRoadsideRow = ref({});

const filterDrawerVisible = ref(false);
const filterForm = ref({
  timeRange: 'all',
  deviceTypes: [],
  deviceStatuses: [],
  parkTypes: [],
  berthStatuses: [],
  alertLevels: [],
});

const filterMapDataByConditions = (data, params = {}) => {
  let filteredData = [...data];

  if (params.timeRange && params.timeRange !== 'all') {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    filteredData = filteredData.filter((item) => {
      const createTime = Number(item.createTime);
      if (Number.isNaN(createTime)) {
        console.warn(`数据${item.berthNumber}：时间戳无效`);
        return false;
      }
      const createTimeStr = new Date(createTime).toLocaleString();
      let isMatch;

      switch (params.timeRange) {
        case '7days': {
          const sevenDaysAgo = todayStart - 7 * oneDay;
          isMatch = createTime >= sevenDaysAgo && createTime <= now.getTime();
          break;
        }
        case 'today': {
          isMatch = createTime >= todayStart && createTime <= now.getTime();
          break;
        }
        case 'yesterday': {
          const yesterdayStart = todayStart - oneDay;
          isMatch = createTime >= yesterdayStart && createTime < todayStart;
          break;
        }
        default: {
          isMatch = true;
        }
      }

      console.warn(
        `数据${item.berthNumber}：时间${createTimeStr}，是否匹配${params.timeRange}：${isMatch}`,
      );
      return isMatch;
    });
    console.warn(`时间筛选后数据数量：${filteredData.length}`);
  }

  if (params.parkTypes && params.parkTypes.trim() !== '') {
    const parkTypeList = params.parkTypes.split(',').filter(Boolean);
    if (parkTypeList.length > 0) {
      filteredData = filteredData.filter((item) =>
        parkTypeList.includes(item.lotType || '路侧'),
      );
    }
  }

  if (params.berthStatuses && params.berthStatuses.trim() !== '') {
    const berthStatusList = new Set(
      params.berthStatuses.split(',').filter(Boolean),
    );
    filteredData = filteredData.filter((item) =>
      berthStatusList.has(item.roadsideStatus),
    );
  }

  if (params.deviceTypes && params.deviceTypes.trim() !== '') {
    const deviceTypeList = params.deviceTypes.split(',').filter(Boolean);
    if (deviceTypeList.length > 0) {
      filteredData = filteredData.filter((item) =>
        deviceTypeList.includes(item.deviceType),
      );
    }
  }

  if (params.deviceStatuses && params.deviceStatuses.trim() !== '') {
    const deviceStatusList = new Set(
      params.deviceStatuses.split(',').filter(Boolean),
    );
    filteredData = filteredData.filter((item) =>
      deviceStatusList.has(item.deviceStatus),
    );
  }

  if (params.alertLevels && params.alertLevels.trim() !== '') {
    const alertLevelList = new Set(
      params.alertLevels.split(',').filter(Boolean),
    );
    filteredData = filteredData.filter((item) =>
      alertLevelList.has(item.alertLevel),
    );
  }

  return filteredData;
};

const getStoredOrbitConfig = () => {
  const stored = localStorage.getItem('parkingMapOrbitConfig');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.warn('读取本地存储的地图配置失败，使用默认值:', error);
    }
  }
  return {
    center: { lat: 24.58, lng: 117.65 },
    rotateSpeed: 0.1,
    pitch: 40,
    zoom: 12,
    loop: true,
  };
};

const saveOrbitConfigToLocal = (config) => {
  try {
    localStorage.setItem('parkingMapOrbitConfig', JSON.stringify(config));
  } catch (error) {
    console.error('保存地图配置到本地存储失败:', error);
    ElMessage.warning('配置暂无法持久化，刷新后会恢复默认值');
  }
};

const orbitConfigDialogVisible = ref(false);
const orbitConfigFormRef = ref(null);
const orbitConfigForm = ref({
  centerLat: getStoredOrbitConfig().center.lat,
  centerLng: getStoredOrbitConfig().center.lng,
  rotateSpeed: getStoredOrbitConfig().rotateSpeed,
  pitch: getStoredOrbitConfig().pitch,
  zoom: getStoredOrbitConfig().zoom,
  loop: getStoredOrbitConfig().loop,
});

const orbitConfigRules = ref({
  centerLat: [
    {
      required: true,
      type: 'number',
      min: -90,
      max: 90,
      message: '请输入有效的纬度（-90~90）',
      trigger: 'blur',
    },
  ],
  centerLng: [
    {
      required: true,
      type: 'number',
      min: -180,
      max: 180,
      message: '请输入有效的经度（-180~180）',
      trigger: 'blur',
    },
  ],
  rotateSpeed: [
    {
      required: true,
      type: 'number',
      min: 0.01,
      message: '旋转速度不能小于0.01',
      trigger: 'blur',
    },
  ],
  pitch: [
    {
      required: true,
      type: 'number',
      min: 0,
      max: 80,
      message: '俯仰角范围0~80',
      trigger: 'blur',
    },
  ],
  zoom: [
    {
      required: true,
      type: 'number',
      min: 1,
      max: 20,
      message: '缩放级别范围1~20',
      trigger: 'blur',
    },
  ],
});

const orbitConfigData = ref(getStoredOrbitConfig());

const isWarnDataAbnormal = computed(() => {
  const warnCount = coreIndicatorData.value.earlyWarningEvent || 0;
  return warnCount > 0;
});

const isFaultDataAbnormal = computed(() => {
  const faultRate = trendIndicatorData.value.deviceFaultRate || 0;
  return faultRate > 0.05;
});

const openMapFilterDrawer = () => {
  filterDrawerVisible.value = true;
};

const submitMapFilter = async () => {
  try {
    const filterParams = {
      timeRange: filterForm.value.timeRange,
      deviceTypes: filterForm.value.deviceTypes.join(','),
      deviceStatuses: filterForm.value.deviceStatuses.join(','),
      parkTypes: filterForm.value.parkTypes.join(','),
      berthStatuses: filterForm.value.berthStatuses.join(','),
      alertLevels: filterForm.value.alertLevels.join(','),
    };

    const rawData = await fetchParkingLotGeometries(filterParams);
    geometriesArray.value = filterMapDataByConditions(rawData, filterParams);

    ElMessage.success('筛选成功！地图数据已更新');
    filterDrawerVisible.value = false;
  } catch (error) {
    console.error('筛选失败：', error);
    ElMessage.error('筛选失败，请检查参数或重试！');
  }
};

const resetMapFilter = () => {
  filterForm.value = {
    timeRange: 'all',
    deviceTypes: [],
    deviceStatuses: [],
    parkTypes: [],
    berthStatuses: [],
    alertLevels: [],
  };
  ElMessage.info('筛选条件已重置为默认值');
};

const handleBack = () => {
  router.push('/');
};

const clickFullscreen = () => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }
  const targetEl = pageContainerRef.value;
  screenFull.isFullscreen ? screenFull.exit() : screenFull.request(targetEl);
};

const handleFullscreenChange = () => {
  if (!screenFull.isFullscreen && currentFullscreenPanel.value) {
    currentFullscreenPanel.value.style.width = '';
    currentFullscreenPanel.value.style.maxWidth = '';
    currentFullscreenPanel.value.style.overflow = 'hidden';
    window.dispatchEvent(new Event('resize'));
    screenFull.off('change', handleFullscreenChange);
    currentFullscreenPanel.value = null;
  }
};

const object = ref(null);
const map = ref(null);
const element = ref(null);

const togglePanelFullscreen = (panelRef) => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }
  const panel = {
    object: object.value,
    map: map.value,
    element: element.value,
  }[panelRef];

  if (!panel) {
    ElMessage.error('未找到面板元素');
    return;
  }

  if (currentFullscreenPanel.value) {
    screenFull.off('change', handleFullscreenChange);
  }
  currentFullscreenPanel.value = panel;

  if (screenFull.isFullscreen && document.fullscreenElement === panel) {
    screenFull.exit();
  } else {
    screenFull.on('change', handleFullscreenChange);
    screenFull.request(panel).catch((error) => {
      ElMessage.error(`全屏失败：${error.message}`);
    });
  }
};

const handleOrbitAnimation = () => {
  if (
    mapCommonRef.value &&
    typeof mapCommonRef.value.toggleOrbitAnimation === 'function'
  ) {
    mapCommonRef.value.toggleOrbitAnimation();
  } else {
    ElMessage.warning('地图环绕功能暂未初始化完成');
  }
};

const formatTimeStamp = (timeStamp) => {
  if (!timeStamp) return '';
  const date = new Date(Number(timeStamp));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const formatParkingTime = (minutes) => {
  if (!minutes || minutes === 0) return '0分钟';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}小时${m}分钟` : `${m}分钟`;
};

const formatOfflineTime = (minutes) => {
  if (!minutes || minutes === 0) return '0分钟';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}小时${m}分钟` : `${m}分钟`;
};

const getRoadsideStatusTagType = (status) => {
  switch (status) {
    case '占用': {
      return 'info';
    }
    case '故障': {
      return 'danger';
    }
    case '正常':
    case '空闲': {
      return 'success';
    }
    case '禁用': {
      return 'warning';
    }
    default: {
      return 'info';
    }
  }
};

const getLotStatusTagType = (status) => {
  switch (status) {
    case '暂停运营': {
      return 'warning';
    }
    case '正常': {
      return 'success';
    }
    case '维护': {
      return 'danger';
    }
    default: {
      return 'info';
    }
  }
};

const getDeviceStatusTagType = (status) => {
  switch (status) {
    case '在线': {
      return 'success';
    }
    case '故障': {
      return 'danger';
    }
    case '维护': {
      return 'warning';
    }
    default: {
      return 'info';
    }
  }
};

const handleObjectRowClick = (row) => {
  // eslint-disable-next-line unicorn/prefer-structured-clone
  selectedParkingRow.value = JSON.parse(JSON.stringify(row));
  objectDetailVisible.value = true;
};

const handleElementRowClick = (row) => {
  // eslint-disable-next-line unicorn/prefer-structured-clone
  selectedRoadsideRow.value = JSON.parse(JSON.stringify(row));
  elementDetailVisible.value = true;
};

const initMapData = async () => {
  try {
    const defaultParams = {
      timeRange: filterForm.value.timeRange,
    };
    const rawData = await fetchParkingLotGeometries(defaultParams);
    geometriesArray.value = filterMapDataByConditions(rawData, defaultParams);
  } catch (error) {
    console.error('地图数据加载失败：', error);
    ElMessage.error('地图数据加载失败，请刷新页面重试');
    geometriesArray.value = [];
  }
};

const activeObjectTab = ref('parkingLot');
const activeElementTab = ref('berth');

const loadParkingCoreObjectData = async () => {
  try {
    parkingCoreObjectList.value = await fetchParkingCoreObjectList({});
  } catch (error) {
    console.error('核心对象分布数据加载失败：', error);
    ElMessage.error('核心对象分布数据加载失败，请刷新页面重试');
    parkingCoreObjectList.value = [];
  }
};

const loadRoadsideBerthData = async () => {
  try {
    roadsideBerthList.value = await fetchRoadsideBerthCoreElements({});
  } catch (error) {
    console.error('路侧泊位核心要素数据加载失败：', error);
    ElMessage.error('路侧泊位核心要素数据加载失败，请刷新页面重试');
    roadsideBerthList.value = [];
  }
};

const fetchCoreIndicatorData = async () => {
  try {
    coreIndicatorData.value = await fetchParkingCoreIndicators({});
  } catch (error) {
    console.error('核心指标数据加载失败：', error);
    ElMessage.error('核心指标数据加载失败，请刷新页面重试');
    coreIndicatorData.value = {};
  }
};

const fetchTrendIndicatorData = async () => {
  try {
    trendIndicatorData.value = await fetchParkingGlobalTrendIndicators({});
  } catch (error) {
    console.error('全局态势趋势数据加载失败：', error);
    ElMessage.error('全局态势趋势数据加载失败，请刷新页面重试');
    trendIndicatorData.value = {};
  }
};

const loadParkingFeatureSituation = async () => {
  try {
    featureSituationData.value = await fetchParkingFeatureSituation({});
  } catch (error) {
    console.error('特色态势聚合数据加载失败：', error);
    ElMessage.error('特色态势聚合数据加载失败，请刷新页面重试');
  }
};

const loadParkingStatisticsData = async () => {
  try {
    statisticsData.value = await fetchParkingStatisticsDistribution({
      time_range: 'today',
    });
  } catch (error) {
    console.error('停车统计分布数据加载失败：', error);
    ElMessage.error('停车统计分布数据加载失败，请刷新页面重试');
    statisticsData.value = {
      faultDevice: { labels: [], data: [] },
      chargeAbnormal: { labels: [], data: [] },
      feeEvasionRegion: { labels: [], data: [] },
    };
  }
};

const resetOrbitConfigForm = () => {
  orbitConfigFormRef.value?.resetFields();
  const currentConfig = getStoredOrbitConfig();
  orbitConfigForm.value = {
    centerLat: currentConfig.center.lat,
    centerLng: currentConfig.center.lng,
    rotateSpeed: currentConfig.rotateSpeed,
    pitch: currentConfig.pitch,
    zoom: currentConfig.zoom,
    loop: currentConfig.loop,
  };
};

const submitOrbitConfig = async () => {
  try {
    await orbitConfigFormRef.value.validate();
    const newConfig = {
      center: {
        lat: orbitConfigForm.value.centerLat,
        lng: orbitConfigForm.value.centerLng,
      },
      rotateSpeed: orbitConfigForm.value.rotateSpeed,
      pitch: orbitConfigForm.value.pitch,
      zoom: orbitConfigForm.value.zoom,
      loop: orbitConfigForm.value.loop,
    };
    orbitConfigData.value = newConfig;
    saveOrbitConfigToLocal(newConfig);

    if (mapCommonRef.value) {
      mapCommonRef.value.stopOrbitAnimation();
      mapCommonRef.value.startOrbitAnimation();
    }
    orbitConfigDialogVisible.value = false;
    ElMessage.success('地图环绕配置已生效（已持久化，刷新不丢失）');
  } catch (error) {
    ElMessage.error('配置校验失败，请检查输入');
    console.error('配置校验失败：', error);
  }
};

const resetToDefaultConfig = () => {
  const defaultConfig = {
    center: { lat: 24.58, lng: 117.65 },
    rotateSpeed: 0.1,
    pitch: 40,
    zoom: 12,
    loop: true,
  };
  orbitConfigData.value = defaultConfig;
  orbitConfigForm.value = {
    centerLat: defaultConfig.center.lat,
    centerLng: defaultConfig.center.lng,
    rotateSpeed: defaultConfig.rotateSpeed,
    pitch: defaultConfig.pitch,
    zoom: defaultConfig.zoom,
    loop: defaultConfig.loop,
  };
  localStorage.removeItem('parkingMapOrbitConfig');
  if (mapCommonRef.value) {
    mapCommonRef.value.stopOrbitAnimation();
    mapCommonRef.value.startOrbitAnimation();
  }
  ElMessage.success('已恢复默认配置，刷新后生效');
};

let timeTimer = null;
let indicatorRefreshTimer = null;
let trendRefreshTimer = null;
let coreObjectRefreshTimer = null;
let roadsideBerthRefreshTimer = null;
let featureSituationRefreshTimer = null;
let statisticsRefreshTimer = null;

const updateShowTime = () => {
  const dt = new Date();
  const y = dt.getFullYear();
  const mt = dt.getMonth() + 1;
  const day = dt.getDate();
  const h = dt.getHours().toString().padStart(2, '0');
  const m = dt.getMinutes().toString().padStart(2, '0');
  const s = dt.getSeconds().toString().padStart(2, '0');

  const showTimeEl = document.querySelector('.showTime');
  if (showTimeEl) {
    showTimeEl.innerHTML = `当前时间：${y}年${mt}月${day}日 ${h}时${m}分${s}秒`;
  }
};

onMounted(async () => {
  await initMapData();
  await fetchCoreIndicatorData();
  await fetchTrendIndicatorData();
  await loadParkingCoreObjectData();
  await loadRoadsideBerthData();
  await loadParkingFeatureSituation();
  await loadParkingStatisticsData();

  resetOrbitConfigForm();

  updateShowTime();
  timeTimer = setInterval(updateShowTime, 1000);
  indicatorRefreshTimer = setInterval(() => fetchCoreIndicatorData(), 30_000);
  trendRefreshTimer = setInterval(() => fetchTrendIndicatorData(), 30_000);
  coreObjectRefreshTimer = setInterval(
    () => loadParkingCoreObjectData(),
    60_000,
  );
  roadsideBerthRefreshTimer = setInterval(
    () => loadRoadsideBerthData(),
    60_000,
  );
  featureSituationRefreshTimer = setInterval(
    () => loadParkingFeatureSituation(),
    30_000,
  );
  statisticsRefreshTimer = setInterval(
    () => loadParkingStatisticsData(),
    30_000,
  );
});

onUnmounted(() => {
  if (timeTimer) clearInterval(timeTimer);
  if (indicatorRefreshTimer) clearInterval(indicatorRefreshTimer);
  if (trendRefreshTimer) clearInterval(trendRefreshTimer);
  if (coreObjectRefreshTimer) clearInterval(coreObjectRefreshTimer);
  if (roadsideBerthRefreshTimer) clearInterval(roadsideBerthRefreshTimer);
  if (featureSituationRefreshTimer) clearInterval(featureSituationRefreshTimer);
  if (statisticsRefreshTimer) clearInterval(statisticsRefreshTimer);
  if (currentFullscreenPanel.value) {
    screenFull.off('change', handleFullscreenChange);
  }
});
</script>

<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="header-box">
      <button class="back-button" @click="handleBack">
        <el-icon color="#00ccff" :size="`${1.2}vw`"><ArrowLeft /></el-icon>
      </button>
      <span class="head-name">停车管理-全局态势总览</span>
      <div class="showTime h1-time"></div>
      <button class="fullScreenBut" @click="clickFullscreen">
        <el-icon color="#00ccff" :size="`${1.2}vw`"><FullScreen /></el-icon>
      </button>
    </div>
    <div class="mainbox">
      <div class="left">
        <div class="panel left-top" style="min-width: 3vw">
          <div class="header-actions">
            <div class="actions-left"><p>核心指标看板</p></div>
            <div class="actions-right">
              <el-icon style="font-size: 1vw; color: #409eff">
                <Operation />
              </el-icon>
            </div>
          </div>
          <div class="indicator-cards-4x3">
            <div class="indicator-card indicator-card1">
              <div class="indicator-title">全市停车场数</div>
              <div class="sub-indicators">
                <div class="sub-indicator-item">
                  <div class="sub-indicator-value">
                    {{ coreIndicatorData.citywideLot || 0 }}
                    <div class="unit">个</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="indicator-card indicator-card2">
              <div class="indicator-title">当日入场车次</div>
              <div class="sub-indicators">
                <div class="sub-indicator-item">
                  <div class="sub-indicator-value">
                    {{ coreIndicatorData.dailyEntryVehicle || 0 }}
                    <div class="unit">辆</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="indicator-card indicator-card3">
              <div class="indicator-title">当日收费总额</div>
              <div class="sub-indicators">
                <div class="sub-indicator-item">
                  <div class="sub-indicator-value">
                    {{ coreIndicatorData.dailyTotalChargeAmount || 0 }}
                    <div class="unit">元</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="indicator-card indicator-card4">
              <div class="indicator-title">总路侧泊位数</div>
              <div class="sub-indicators">
                <div class="sub-indicator-item">
                  <div class="sub-indicator-value">
                    {{ coreIndicatorData.totalRoadside || 0 }}
                    <div class="unit">个</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="indicator-card indicator-card5">
              <div class="indicator-title">设备在线率</div>
              <div class="sub-indicators">
                <div class="sub-indicator-item">
                  <div class="sub-indicator-value">
                    {{
                      (coreIndicatorData.deviceOnlineRate * 100 || 0).toFixed(2)
                    }}
                    <div class="unit">%</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="indicator-card indicator-card6">
              <div class="indicator-title">停车场开放率</div>
              <div class="sub-indicators">
                <div class="sub-indicator-item">
                  <div class="sub-indicator-value">
                    {{
                      (coreIndicatorData.lotOpeningRate * 100 || 0).toFixed(2)
                    }}
                    <div class="unit">%</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="indicator-card indicator-card7">
              <div class="indicator-title">故障设备数</div>
              <div class="sub-indicators">
                <div class="sub-indicator-item">
                  <div class="sub-indicator-value">
                    {{ coreIndicatorData.faultDevice || 0 }}
                    <div class="unit">台</div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="indicator-card indicator-card8"
              :class="{ 'pulse-danger': isWarnDataAbnormal }"
            >
              <div class="indicator-title">预警事件数</div>
              <div class="sub-indicators">
                <div class="sub-indicator-item">
                  <div class="sub-indicator-value">
                    {{ coreIndicatorData.earlyWarningEvent || 0 }}
                    <div class="unit">起</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="indicator-card indicator-card9">
              <div class="indicator-title">逃费订单数</div>
              <div class="sub-indicators">
                <div class="sub-indicator-item">
                  <div class="sub-indicator-value">
                    {{ coreIndicatorData.feeEvasionOrder || 0 }}
                    <div class="unit">单</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="indicator-card indicator-card-ratio1">
              <div class="indicator-title">全市停车场数</div>
              <div class="sub-indicators">
                <div
                  class="sub-indicator-item"
                  style="display: flex; flex-direction: column; gap: 0.5vh"
                >
                  <div class="ratio-item">
                    同比：{{
                      (
                        coreIndicatorData.yearOnYear?.citywideLot * 100 || 0
                      ).toFixed(2)
                    }}%
                  </div>
                  <div class="ratio-item">
                    环比：{{
                      (
                        coreIndicatorData.monthOnMonth?.citywideLot * 100 || 0
                      ).toFixed(2)
                    }}%
                  </div>
                </div>
              </div>
            </div>
            <div class="indicator-card indicator-card-ratio2">
              <div class="indicator-title">当日入场车次</div>
              <div class="sub-indicators">
                <div
                  class="sub-indicator-item"
                  style="display: flex; flex-direction: column; gap: 0.5vh"
                >
                  <div class="ratio-item">
                    同比：{{
                      (
                        coreIndicatorData.yearOnYear?.dailyEntryVehicle * 100 ||
                        0
                      ).toFixed(2)
                    }}%
                  </div>
                  <div class="ratio-item">
                    环比：{{
                      (
                        coreIndicatorData.monthOnMonth?.dailyEntryVehicle *
                          100 || 0
                      ).toFixed(2)
                    }}%
                  </div>
                </div>
              </div>
            </div>
            <div class="indicator-card indicator-card-ratio3">
              <div class="indicator-title">当日收费总额</div>
              <div class="sub-indicators">
                <div
                  class="sub-indicator-item"
                  style="display: flex; flex-direction: column; gap: 0.5vh"
                >
                  <div class="ratio-item">
                    同比：{{
                      (
                        coreIndicatorData.yearOnYear?.dailyTotalChargeAmount *
                          100 || 0
                      ).toFixed(2)
                    }}%
                  </div>
                  <div class="ratio-item">
                    环比：{{
                      (
                        coreIndicatorData.monthOnMonth?.dailyTotalChargeAmount *
                          100 || 0
                      ).toFixed(2)
                    }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
        <div
          class="panel left-bottom"
          style="min-width: 3vw; overflow: hidden"
          ref="object"
        >
          <div class="header-actions">
            <div class="actions-left"><p>核心对象分布</p></div>
            <div class="actions-right">
              <el-icon style="font-size: 1vw; color: #409eff">
                <Operation />
              </el-icon>
              <button
                class="panel-fullscreen-btn"
                @click="togglePanelFullscreen('object')"
              >
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div class="object-table">
            <el-tabs v-model="activeObjectTab" type="card" class="object-tabs">
              <el-tab-pane label="停车场" name="parkingLot">
                <el-table
                  :data="parkingCoreObjectList"
                  border
                  size="small"
                  width="100%"
                  height="100%"
                  class="core-object-table"
                  @row-click="handleObjectRowClick"
                >
                  <el-table-column prop="lotId" label="停车场ID" />
                  <el-table-column
                    prop="lotName"
                    label="停车场名称"
                    min-width="100px"
                  />
                  <el-table-column
                    prop="parkType"
                    label="停车场类型"
                    min-width="100px"
                  />
                  <el-table-column
                    prop="areaCode"
                    label="所属区域编码"
                    min-width="100px"
                  />
                  <el-table-column
                    prop="roadside"
                    label="路侧泊位数"
                    min-width="100px"
                  />
                  <el-table-column
                    prop="availableRoadside"
                    label="可用泊位数"
                    min-width="100px"
                  />
                  <el-table-column
                    prop="lotStatus"
                    label="停车场状态"
                    min-width="100px"
                  >
                    <template #default="scope">
                      <el-tag :type="getLotStatusTagType(scope.row.lotStatus)">
                        {{ scope.row.lotStatus }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="createTime"
                    label="创建时间"
                    min-width="100px"
                  >
                    <template #default="scope">
                      {{ formatTimeStamp(scope.row.createTime) }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="泊位" name="berth">
                <el-table
                  :data="parkingCoreObjectList"
                  border
                  size="small"
                  width="100%"
                  height="100%"
                  class="core-object-table"
                  @row-click="handleObjectRowClick"
                >
                  <el-table-column
                    prop="roadsideId"
                    label="路侧泊位ID"
                    min-width="100px"
                  />
                  <el-table-column
                    prop="lotId"
                    label="所属停车场ID"
                    min-width="100px"
                  />
                  <el-table-column prop="roadsideType" label="泊位类型" />
                  <el-table-column prop="roadside" label="总泊位数" />
                  <el-table-column
                    prop="availableRoadside"
                    label="可用泊位数"
                    min-width="100px"
                  />
                  <el-table-column prop="roadsideStatus" label="泊位状态">
                    <template #default="scope">
                      <el-tag
                        :type="
                          getRoadsideStatusTagType(scope.row.roadsideStatus)
                        "
                      >
                        {{ scope.row.roadsideStatus }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="areaCode"
                    label="所属区域编码"
                    min-width="100px"
                  />
                  <el-table-column
                    prop="createTime"
                    label="创建时间"
                    min-width="100px"
                  >
                    <template #default="scope">
                      {{ formatTimeStamp(scope.row.createTime) }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="设备" name="device">
                <el-table
                  :data="parkingCoreObjectList"
                  border
                  size="small"
                  width="100%"
                  height="100%"
                  class="core-object-table"
                  @row-click="handleObjectRowClick"
                >
                  <el-table-column prop="deviceId" label="设备ID" />
                  <el-table-column prop="deviceCode" label="设备编码" />
                  <el-table-column prop="deviceType" label="设备类型" />
                  <el-table-column
                    prop="lotId"
                    label="所属停车场ID"
                    min-width="100px"
                  />
                  <el-table-column
                    prop="roadsideId"
                    label="关联泊位ID"
                    min-width="100px"
                  />
                  <el-table-column prop="deviceStatus" label="设备状态">
                    <template #default="scope">
                      <el-tag
                        :type="getDeviceStatusTagType(scope.row.deviceStatus)"
                      >
                        {{ scope.row.deviceStatus }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="areaCode"
                    label="所属区域编码"
                    min-width="100px"
                  />
                  <el-table-column
                    prop="createTime"
                    label="创建时间"
                    min-width="100px"
                  >
                    <template #default="scope">
                      {{ formatTimeStamp(scope.row.createTime) }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="panel-footer"></div>
          <el-dialog
            v-model="objectDetailVisible"
            width="50%"
            class="object-dialog"
          >
            <div class="object-detail">
              <div class="detail-section">
                <div class="custom-detail-panel">
                  <div class="detail-panel-header">核心对象信息</div>
                  <div class="detail-panel-body">
                    <div class="detail-row">
                      <div class="detail-item">
                        <span class="detail-label">停车场ID：</span
                        ><span class="detail-value">{{
                          selectedParkingRow.lotId || '-'
                        }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">停车场名称：</span
                        ><span class="detail-value">{{
                          selectedParkingRow.lotName || '-'
                        }}</span>
                      </div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-item">
                        <span class="detail-label">停车场类型：</span
                        ><span class="detail-value">{{
                          selectedParkingRow.parkType || '-'
                        }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">区域编码：</span
                        ><span class="detail-value">{{
                          selectedParkingRow.areaCode || '-'
                        }}</span>
                      </div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-item">
                        <span class="detail-label">路侧泊位数：</span
                        ><span class="detail-value">{{
                          selectedParkingRow.roadside || 0
                        }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">可用泊位数：</span
                        ><span class="detail-value">{{
                          selectedParkingRow.availableRoadside || 0
                        }}</span>
                      </div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-item">
                        <span class="detail-label">停车场状态：</span
                        ><span class="detail-value"
                          ><el-tag
                            :type="
                              getLotStatusTagType(selectedParkingRow.lotStatus)
                            "
                            >{{ selectedParkingRow.lotStatus || '-' }}</el-tag
                          ></span
                        >
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">泊位ID：</span
                        ><span class="detail-value">{{
                          selectedParkingRow.roadsideId || '-'
                        }}</span>
                      </div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-item">
                        <span class="detail-label">泊位类型：</span
                        ><span class="detail-value">{{
                          selectedParkingRow.roadsideType || '-'
                        }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">泊位状态：</span
                        ><span class="detail-value"
                          ><el-tag
                            :type="
                              getRoadsideStatusTagType(
                                selectedParkingRow.roadsideStatus,
                              )
                            "
                            >{{
                              selectedParkingRow.roadsideStatus || '-'
                            }}</el-tag
                          ></span
                        >
                      </div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-item">
                        <span class="detail-label">设备ID：</span
                        ><span class="detail-value">{{
                          selectedParkingRow.deviceId || '-'
                        }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">设备编码：</span
                        ><span class="detail-value">{{
                          selectedParkingRow.deviceCode || '-'
                        }}</span>
                      </div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-item">
                        <span class="detail-label">设备类型：</span
                        ><span class="detail-value">{{
                          selectedParkingRow.deviceType || '-'
                        }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">设备状态：</span
                        ><span class="detail-value"
                          ><el-tag
                            :type="
                              getDeviceStatusTagType(
                                selectedParkingRow.deviceStatus,
                              )
                            "
                            >{{
                              selectedParkingRow.deviceStatus || '-'
                            }}</el-tag
                          ></span
                        >
                      </div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-item">
                        <span class="detail-label">创建时间：</span
                        ><span class="detail-value">{{
                          formatTimeStamp(selectedParkingRow.createTime) || '-'
                        }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">-</span
                        ><span class="detail-value">-</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <template #footer>
              <el-button @click="objectDetailVisible = false"> 关闭 </el-button>
            </template>
          </el-dialog>
        </div>
      </div>
      <div class="middle">
        <div class="panel middle-top" style="min-width: 3vw" ref="map">
          <div class="header-actions">
            <div class="actions-left"><p>全域数据地图</p></div>
            <div class="actions-right">
              <button class="control-btn" @click="handleOrbitAnimation">
                <el-icon color="#409eff" size="16">
                  <VideoPause
                    v-if="mapCommonRef?.orbitStatus?.playing"
                  /><VideoPlay v-else />
                </el-icon>
              </button>
              <button
                class="control-btn"
                @click="orbitConfigDialogVisible = true"
              >
                <el-icon color="#409eff" size="16"><Setting /></el-icon>
              </button>
              <button class="control-btn" @click="openMapFilterDrawer">
                <el-icon color="#409eff" size="16"><Filter /></el-icon>
              </button>
              <button
                class="panel-fullscreen-btn"
                @click="togglePanelFullscreen('map')"
              >
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div
            v-if="filterDrawerVisible"
            class="top-drawer-mask"
            @click="filterDrawerVisible = false"
          ></div>
          <transition name="top-drawer">
            <div v-if="filterDrawerVisible" class="top-drawer-container">
              <div class="filter-form-container">
                <el-form :model="filterForm" inline class="filter-form">
                  <el-form-item
                    label="时间范围："
                    prop="timeRange"
                    style="background-color: aliceblue"
                  >
                    <el-radio-group v-model="filterForm.timeRange">
                      <el-radio label="all">所有时间</el-radio>
                      <el-radio label="today">今日</el-radio>
                      <el-radio label="yesterday">昨日</el-radio>
                      <el-radio label="7days">近7日</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    label="停车场类型："
                    prop="parkTypes"
                    style="background-color: aliceblue"
                  >
                    <el-checkbox-group v-model="filterForm.parkTypes">
                      <el-checkbox label="路侧" />
                      <el-checkbox label="公共" />
                      <el-checkbox label="专用" />
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item
                    label="泊位状态："
                    prop="berthStatuses"
                    style="background-color: aliceblue"
                  >
                    <el-checkbox-group v-model="filterForm.berthStatuses">
                      <el-checkbox label="故障" />
                      <el-checkbox label="空闲" />
                      <el-checkbox label="占用" />
                      <el-checkbox label="禁用" />
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item
                    label="设备类型："
                    prop="deviceTypes"
                    style="background-color: aliceblue"
                  >
                    <el-checkbox-group v-model="filterForm.deviceTypes">
                      <el-checkbox label="道闸" />
                      <el-checkbox label="摄像头" />
                      <el-checkbox label="计费桩" />
                      <el-checkbox label="充电桩" />
                      <el-checkbox label="传感器" />
                      <el-checkbox label="边缘网关" />
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item
                    label="设备状态："
                    prop="deviceStatuses"
                    style="background-color: aliceblue"
                  >
                    <el-checkbox-group v-model="filterForm.deviceStatuses">
                      <el-checkbox label="故障" />
                      <el-checkbox label="在线" />
                      <el-checkbox label="离线" />
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item
                    label="预警等级："
                    prop="alertLevels"
                    style="background-color: aliceblue"
                  >
                    <el-checkbox-group v-model="filterForm.alertLevels">
                      <el-checkbox label="高" />
                      <el-checkbox label="中" />
                      <el-checkbox label="低" />
                    </el-checkbox-group>
                  </el-form-item>
                  <el-button @click="resetMapFilter">重置</el-button>
                </el-form>
                <div class="filter-btn-group">
                  <el-button type="primary" @click="submitMapFilter">
                    确定
                  </el-button>
                  <el-button @click="filterDrawerVisible = false">
                    取消
                  </el-button>
                </div>
              </div>
            </div>
          </transition>
          <div style="flex: 1; width: 100%; height: calc(100% - 2vh)">
            <MapCommon
              ref="mapCommonRef"
              id-name="parkingMap"
              :geometries-array="geometriesArray"
              :orbit-config="orbitConfigData"
            />
          </div>
          <div class="panel-footer"></div>
          <el-dialog
            v-model="orbitConfigDialogVisible"
            title="地图环绕配置"
            width="40%"
            @close="resetOrbitConfigForm"
          >
            <el-form
              :model="orbitConfigForm"
              label-width="150px"
              :rules="orbitConfigRules"
              ref="orbitConfigFormRef"
            >
              <el-form-item label="旋转中心点纬度" prop="centerLat">
                <el-input
                  v-model.number="orbitConfigForm.centerLat"
                  step="0.01"
                  precision="6"
                />
              </el-form-item>
              <el-form-item label="旋转中心点经度" prop="centerLng">
                <el-input
                  v-model.number="orbitConfigForm.centerLng"
                  step="0.01"
                  precision="6"
                />
              </el-form-item>
              <el-form-item label="旋转速度(度/帧)" prop="rotateSpeed">
                <el-input
                  v-model.number="orbitConfigForm.rotateSpeed"
                  min="0.01"
                  max="1"
                  step="0.01"
                />
              </el-form-item>
              <el-form-item label="地图俯仰角" prop="pitch">
                <el-input
                  v-model.number="orbitConfigForm.pitch"
                  min="0"
                  max="80"
                  step="1"
                />
              </el-form-item>
              <el-form-item label="地图缩放级别" prop="zoom">
                <el-input
                  v-model.number="orbitConfigForm.zoom"
                  min="1"
                  max="20"
                  step="1"
                />
              </el-form-item>
              <el-form-item label="是否循环旋转" prop="loop">
                <el-switch
                  v-model="orbitConfigForm.loop"
                  active-text="是"
                  inactive-text="否"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="text" @click="resetToDefaultConfig">
                  恢复默认配置
                </el-button>
              </el-form-item>
            </el-form>
            <template #footer>
              <el-button @click="orbitConfigDialogVisible = false">
                取消
              </el-button>
              <el-button type="primary" @click="submitOrbitConfig">
                确认配置
              </el-button>
            </template>
          </el-dialog>
        </div>
        <div class="panel middle-bottom" style="min-width: 3vw">
          <div class="middle-bottom-top">
            <div class="feature-cards-1x3">
              <div
                class="feature-card"
                :class="{
                  'pulse-danger': featureSituationData.lotUtilizationRate > 90,
                }"
              >
                <div class="feature-title">停车场使用率</div>
                <div class="feature-value">
                  {{ featureSituationData.lotUtilizationRate || 0
                  }}<span class="feature-unit">%</span>
                </div>
              </div>
              <div
                class="feature-card"
                :class="{
                  'pulse-danger': featureSituationData.revenueProportion > 80,
                }"
              >
                <div class="feature-title">收入贡献占比</div>
                <div class="feature-value">
                  {{ featureSituationData.revenueProportion || 0
                  }}<span class="feature-unit">%</span>
                </div>
              </div>
              <div
                class="feature-card"
                :class="{
                  'pulse-danger':
                    featureSituationData.maintenanceTimelinessRate < 85,
                }"
              >
                <div class="feature-title">维保及时率</div>
                <div class="feature-value">
                  {{ featureSituationData.maintenanceTimelinessRate || 0
                  }}<span class="feature-unit">%</span>
                </div>
              </div>
            </div>
          </div>
          <div
            class="middle-bottom-bottom"
            style="display: flex; height: 70%; padding-top: 1vh"
          >
            <div class="chart-item" style="flex: 3; height: 100%">
              <VerticalBar1
                :x-axis="statisticsData.faultDevice.labels || []"
                :series="[
                  {
                    name: '故障数量',
                    data: statisticsData.faultDevice.data || [],
                  },
                ]"
                title="故障设备分布"
                unit="台"
                :base-font-scale="1"
              />
            </div>
            <div class="chart-item" style="flex: 2; height: 100%">
              <ChartPie1
                :data="{
                  legend: statisticsData.chargeAbnormal.labels || [],
                  series: [
                    {
                      name: '异常订单数',
                      data: statisticsData.chargeAbnormal.data || [],
                    },
                  ],
                }"
                title="收费异常订单分布"
                :base-font-scale="1"
              />
            </div>
            <div class="chart-item" style="flex: 3; height: 100%">
              <HorizontalBar1
                :x-axis="statisticsData.feeEvasionRegion.labels || []"
                :series="[
                  {
                    name: '逃费订单数',
                    data: statisticsData.feeEvasionRegion.data || [],
                  },
                ]"
                title="逃费高发区域"
                unit="单"
                :base-font-scale="1"
              />
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
      </div>
      <div
        class="right"
        style="box-sizing: border-box; flex: 1; width: 100%; overflow: hidden"
      >
        <div class="panel right-top" style="min-width: 3vw">
          <div class="header-actions">
            <div class="actions-left"><p>全局态势趋势</p></div>
            <div class="actions-right">
              <el-icon style="font-size: 1vw; color: #409eff">
                <Operation />
              </el-icon>
            </div>
          </div>
          <div class="trend-cards-3x2">
            <div class="trend-card trend-card1">
              <div class="trend-title">入场车次</div>
              <div class="trend-value">
                {{ trendIndicatorData.entryVehicleCount || 0
                }}<span class="trend-unit">辆</span>
              </div>
            </div>
            <div class="trend-card trend-card2">
              <div class="trend-title">收费总额</div>
              <div class="trend-value">
                {{ trendIndicatorData.totalChargeAmount || 0
                }}<span class="trend-unit">元</span>
              </div>
            </div>
            <div class="trend-card trend-card3">
              <div class="trend-title">路侧泊位使用率</div>
              <div class="trend-value">
                {{
                  (
                    trendIndicatorData.roadsideUtilizationRate * 100 || 0
                  ).toFixed(2)
                }}<span class="trend-unit">%</span>
              </div>
            </div>
            <div
              class="trend-card trend-card4"
              :class="{ 'pulse-danger': isFaultDataAbnormal }"
            >
              <div class="trend-title">设备故障率</div>
              <div class="trend-value">
                {{ (trendIndicatorData.deviceFaultRate * 100 || 0).toFixed(2)
                }}<span class="trend-unit">%</span>
              </div>
            </div>
            <div class="trend-card trend-card5">
              <div class="trend-title">订单完成率</div>
              <div class="trend-value">
                {{
                  (trendIndicatorData.orderCompletionRate * 100 || 0).toFixed(
                    2,
                  )
                }}<span class="trend-unit">%</span>
              </div>
            </div>
            <div class="trend-card trend-card6">
              <div class="trend-title">逃费发生率</div>
              <div class="trend-value">
                {{ (trendIndicatorData.feeEvasionRate * 100 || 0).toFixed(2)
                }}<span class="trend-unit">%</span>
              </div>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
        <div
          class="panel right-bottom"
          style="
            box-sizing: border-box !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
          "
          ref="element"
        >
          <div class="header-actions">
            <div class="actions-left"><p>核心要素运行</p></div>
            <div class="actions-right">
              <el-icon style="font-size: 1vw; color: #409eff">
                <Operation />
              </el-icon>
              <button
                class="panel-fullscreen-btn"
                @click="togglePanelFullscreen('element')"
              >
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <div class="element-table">
            <el-tabs
              v-model="activeElementTab"
              type="card"
              class="element-tabs"
            >
              <el-tab-pane label="泊位" name="berth">
                <el-table
                  :data="roadsideBerthList"
                  border
                  size="small"
                  width="100%"
                  height="100%"
                  class="core-element-table"
                  @row-click="handleElementRowClick"
                >
                  <el-table-column prop="roadsideId" label="路侧泊位ID" />
                  <el-table-column prop="berthNumber" label="路侧泊位编号" />
                  <el-table-column prop="lotId" label="所属停车场ID" />
                  <el-table-column prop="roadsideStatus" label="实时状态">
                    <template #default="scope">
                      <el-tag
                        :type="
                          getRoadsideStatusTagType(scope.row.roadsideStatus)
                        "
                      >
                        {{ scope.row.roadsideStatus }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="parkingTime" label="占用时长">
                    <template #default="scope">
                      {{ formatParkingTime(scope.row.parkingTime) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="overtimeOccupationWarnId"
                    label="超时长占用预警"
                    min-width="90px"
                  >
                    <template #default="scope">
                      <el-tag
                        :type="
                          scope.row.overtimeOccupationWarnId === '是'
                            ? 'warning'
                            : 'success'
                        "
                      >
                        {{ scope.row.overtimeOccupationWarnId }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="nMVOccupationWarnId"
                    label="非机动车辆占用告警"
                    min-width="90px"
                  >
                    <template #default="scope">
                      <el-tag
                        :type="
                          scope.row.nMVOccupationWarnId === '是'
                            ? 'warning'
                            : 'success'
                        "
                      >
                        {{ scope.row.nMVOccupationWarnId }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="updateTime"
                    label="更新时间"
                    min-width="100px"
                  >
                    <template #default="scope">
                      {{ formatTimeStamp(scope.row.updateTime) }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="收费终端" name="paymentTerminal">
                <el-table
                  :data="roadsideBerthList"
                  border
                  size="small"
                  width="100%"
                  height="100%"
                  class="core-element-table"
                  @row-click="handleElementRowClick"
                >
                  <el-table-column prop="deviceId" label="设备ID" />
                  <el-table-column prop="deviceType" label="设备类型" />
                  <el-table-column prop="lotId" label="所属停车场ID" />
                  <el-table-column prop="roadsideId" label="关联泊位ID" />
                  <el-table-column prop="deviceStatus" label="设备状态">
                    <template #default="scope">
                      <el-tag
                        :type="getDeviceStatusTagType(scope.row.deviceStatus)"
                      >
                        {{ scope.row.deviceStatus }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="faultType" label="故障类型" />
                  <el-table-column prop="offlineDuration" label="离线时长">
                    <template #default="scope">
                      {{ formatOfflineTime(scope.row.offlineDuration) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="paymentSuccessRate" label="支付成功率">
                    <template #default="scope">
                      {{ scope.row.paymentSuccessRate }}%
                    </template>
                  </el-table-column>
                  <el-table-column prop="chargeAbnormal" label="收费异常次数" />
                  <el-table-column
                    prop="updateTime"
                    label="更新时间"
                    min-width="100px"
                  >
                    <template #default="scope">
                      {{ formatTimeStamp(scope.row.updateTime) }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="充电桩" name="chargingPile">
                <el-table
                  :data="roadsideBerthList"
                  border
                  size="small"
                  width="100%"
                  height="100%"
                  class="core-element-table"
                  @row-click="handleElementRowClick"
                >
                  <el-table-column prop="chargePileId" label="充电桩ID" />
                  <el-table-column prop="lotId" label="所属停车场ID" />
                  <el-table-column prop="roadsideId" label="关联泊位ID" />
                  <el-table-column
                    prop="chargePileStatus"
                    label="充电桩运行状态"
                  >
                    <template #default="scope">
                      <el-tag
                        v-if="scope.row.chargePileStatus"
                        :type="
                          scope.row.chargePileStatus === '充电中'
                            ? 'info'
                            : 'success'
                        "
                      >
                        {{ scope.row.chargePileStatus }}
                      </el-tag>
                      <span v-else>-</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="chargePilePower"
                    label="充电桩充电功率"
                  />
                  <el-table-column
                    prop="chargePileRemainingPower"
                    label="充电桩剩余电量"
                  />
                  <el-table-column prop="deviceId" label="关联设备ID" />
                  <el-table-column prop="deviceStatus" label="设备状态">
                    <template #default="scope">
                      <el-tag
                        :type="getDeviceStatusTagType(scope.row.deviceStatus)"
                      >
                        {{ scope.row.deviceStatus }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="updateTime"
                    label="更新时间"
                    min-width="100px"
                  >
                    <template #default="scope">
                      {{ formatTimeStamp(scope.row.updateTime) }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="panel-footer"></div>
          <el-dialog
            v-model="elementDetailVisible"
            width="50%"
            class="element-dialog"
          >
            <div class="element-detail">
              <div class="detail-section">
                <div class="custom-detail-panel">
                  <div class="detail-panel-header">核心要素信息</div>
                  <div class="detail-panel-body">
                    <div class="detail-row">
                      <div class="detail-item">
                        <span class="detail-label">路侧泊位ID：</span
                        ><span class="detail-value">{{
                          selectedRoadsideRow.roadsideId || '-'
                        }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">路侧泊位编号：</span
                        ><span class="detail-value">{{
                          selectedRoadsideRow.berthNumber || '-'
                        }}</span>
                      </div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-item">
                        <span class="detail-label">所属停车场ID：</span
                        ><span class="detail-value">{{
                          selectedRoadsideRow.lotId || '-'
                        }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">实时状态：</span
                        ><span class="detail-value"
                          ><el-tag
                            :type="
                              getRoadsideStatusTagType(
                                selectedRoadsideRow.roadsideStatus,
                              )
                            "
                            >{{
                              selectedRoadsideRow.roadsideStatus || '-'
                            }}</el-tag
                          ></span
                        >
                      </div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-item">
                        <span class="detail-label">占用时长：</span
                        ><span class="detail-value">{{
                          formatParkingTime(selectedRoadsideRow.parkingTime) ||
                          '0分钟'
                        }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">超时长占用预警：</span
                        ><span class="detail-value"
                          ><el-tag
                            :type="
                              selectedRoadsideRow.overtimeOccupationWarnId ===
                              '是'
                                ? 'warning'
                                : 'success'
                            "
                            >{{
                              selectedRoadsideRow.overtimeOccupationWarnId ||
                              '-'
                            }}</el-tag
                          ></span
                        >
                      </div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-item">
                        <span class="detail-label">非机动车辆占用告警：</span
                        ><span class="detail-value"
                          ><el-tag
                            :type="
                              selectedRoadsideRow.nMVOccupationWarnId === '是'
                                ? 'warning'
                                : 'success'
                            "
                            >{{
                              selectedRoadsideRow.nMVOccupationWarnId || '-'
                            }}</el-tag
                          ></span
                        >
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">设备ID：</span
                        ><span class="detail-value">{{
                          selectedRoadsideRow.deviceId || '-'
                        }}</span>
                      </div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-item">
                        <span class="detail-label">设备类型：</span
                        ><span class="detail-value">{{
                          selectedRoadsideRow.deviceType || '-'
                        }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">设备状态：</span
                        ><span class="detail-value"
                          ><el-tag
                            :type="
                              getDeviceStatusTagType(
                                selectedRoadsideRow.deviceStatus,
                              )
                            "
                            >{{
                              selectedRoadsideRow.deviceStatus || '-'
                            }}</el-tag
                          ></span
                        >
                      </div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-item">
                        <span class="detail-label">故障类型：</span
                        ><span class="detail-value">{{
                          selectedRoadsideRow.faultType || '-'
                        }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">离线时长：</span
                        ><span class="detail-value">{{
                          formatOfflineTime(
                            selectedRoadsideRow.offlineDuration,
                          ) || '0分钟'
                        }}</span>
                      </div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-item">
                        <span class="detail-label">支付成功率：</span
                        ><span class="detail-value"
                          >{{
                            selectedRoadsideRow.paymentSuccessRate || 0
                          }}%</span
                        >
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">收费异常次数：</span
                        ><span class="detail-value">{{
                          selectedRoadsideRow.chargeAbnormal || 0
                        }}</span>
                      </div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-item">
                        <span class="detail-label">充电桩ID：</span
                        ><span class="detail-value">{{
                          selectedRoadsideRow.chargePileId || '-'
                        }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">充电桩运行状态：</span
                        ><span class="detail-value"
                          ><el-tag
                            v-if="selectedRoadsideRow.chargePileStatus"
                            :type="
                              selectedRoadsideRow.chargePileStatus === '充电中'
                                ? 'info'
                                : 'success'
                            "
                            >{{ selectedRoadsideRow.chargePileStatus }}</el-tag
                          ><span v-else>-</span></span
                        >
                      </div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-item">
                        <span class="detail-label">充电桩充电功率：</span
                        ><span class="detail-value">{{
                          selectedRoadsideRow.chargePilePower || '-'
                        }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">充电桩剩余电量：</span
                        ><span class="detail-value">{{
                          selectedRoadsideRow.chargePileRemainingPower || '-'
                        }}</span>
                      </div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-item">
                        <span class="detail-label">更新时间：</span
                        ><span class="detail-value">{{
                          formatTimeStamp(selectedRoadsideRow.updateTime) || '-'
                        }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">-</span
                        ><span class="detail-value">-</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <template #footer>
              <el-button @click="elementDetailVisible = false">
                关闭
              </el-button>
            </template>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../templatesstyle/common.scss';
@import '../../templatesstyle/core-indicator-dashboard.scss';
@import '../../templatesstyle/global-data-map.scss';
@import '../../templatesstyle/global-posture-trend.scss';
@import '../../templatesstyle/core-object-distribution.scss';
@import '../../templatesstyle/posture-aggregation.scss';
@import '../../templatesstyle/core-elements-operation.scss';

.page-container {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  padding: 0 1vw;
  overflow-x: hidden !important;
  overflow-y: hidden;
  color: #fff;
  background: url('../images/bg.jpg') no-repeat;
  background-size: 100% 100%;
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
  gap: 0.6vw;
  width: 100%;
  height: 88vh;
  margin: 0 auto;
  overflow: hidden !important;
}

.left {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1.5%;
  overflow: hidden;
}

.left-top {
  height: 44%;
}

.left-bottom {
  height: 54.5%;
}

.middle {
  box-sizing: border-box;
  display: flex;
  flex: 2;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.middle-top {
  position: relative;
  flex: 1;
  height: 66%;
  padding: 0.2vw !important;
  margin-bottom: 1%;
  overflow: visible !important;
}

.middle-bottom {
  height: 33%;
}

.middle-bottom-top {
  height: 30%;
}

.middle-bottom-bottom {
  height: 70%;
}

.right {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1.5%;
}

.right-top {
  height: 44%;
}

.right-bottom {
  height: 54.5%;
}

::v-deep(.el-button--text.el-button--small) {
  font-size: 0.7vw;
}

::v-deep(.el-button--small.el-button--primary) {
  min-width: 5vw;
  max-width: 8vw;
  height: auto;
  padding: 0.3vw 0.8vw;
  font-size: 0.7vw;
  line-height: 1.2;
  border-radius: 0.3vw;
}

::v-deep(.el-button--small.el-button--primary:hover) {
  padding: 0.35vw 0.85vw;
}

::v-deep(.filter-form-container) {
  padding-left: 6vw !important;

  .el-form-item {
    margin-right: 3vw;

    .el-radio-group,
    .el-checkbox-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0 !important;
      align-items: center;
    }
  }
}
</style>
