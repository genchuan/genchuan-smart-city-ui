<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue';

import {
  Filter,
  FullScreen, Refresh,
  Setting,
  VideoPause,
  VideoPlay,
} from '@element-plus/icons-vue';
import {ElButton, ElMessage, ElTable, ElTableColumn, ElTag} from 'element-plus';
import screenFull from 'screenfull';

import {
  fetchParkingLotGeometries,
} from '#/api/genchuan/industry/parkingmgmt/overview/GlobalSituationOverview.ts';
import {
  fetchParkDeviceIndicators,
  fetchParkDeviceTypeRatio,
  fetchParkDeviceStatusRatio,
  fetchParkDeviceOnlineRateTrend7d
} from '#/api/genchuan/industry/parkingmgmt/overview/GlobalOverview.ts';
import MapCommon from './GlobalDataMap.vue';

import { useRouter } from 'vue-router';
import ChartPie2 from "#/views/genchuan/industry/templatesstatchart/ChartPie2.vue";
import ChartLine1 from "#/views/genchuan/industry/templatesstatchart/ChartLine1.vue";
import ChartPie1 from "#/views/genchuan/industry/templatesstatchart/ChartPie1.vue";
import ChartLine2 from "#/views/genchuan/industry/templatesstatchart/ChartLine2.vue";
const router = useRouter();

const pageContainerRef = ref(null);
const mapCommonRef = ref(null);
const geometriesArray = ref([]);
const currentFullscreenPanel = ref(null);

// 标签页激活状态
const topLeftActiveTab = ref('tab1');
const topMiddleActiveTab = ref('tab1');
const topRightActiveTab = ref('tab1');
const bottomLeftActiveTab = ref('tab1');
const bottomMiddleActiveTab = ref('tab1');
const bottomRightActiveTab = ref('tab1');

// 筛选相关
const filterDrawerVisible = ref(false);
const filterForm = ref({
  timeRange: 'all',
  deviceTypes: [],
  deviceStatuses: [],
  parkTypes: [],
  berthStatuses: [],
  alertLevels: [],
});

// 地图环绕配置相关
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

// 地图数据筛选逻辑
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

// 筛选方法
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

// 全屏相关
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

const map = ref(null);

const togglePanelFullscreen = (panelRef) => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }
  const panel = {
    map: map.value,
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

// 地图环绕动画
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

// 初始化地图数据
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

// 环绕配置相关方法
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

// ========== 资源设备相关 ==========
// TS类型定义
interface ParkDeviceIndicators {
  tbDeviceTotalCount: number; // 设备总数
  tbDeviceOnlineCount: number; // 在线设备数
  tbDeviceNormalCount: number; // 正常运行数
  tbDeviceFaultCount: number; // 故障设备数
  tbDeviceIntactRate: number; // 设备完好率
  tbDeviceNewCount7d?: number; // 近7日新增设备数
  tbDeviceRepairCount7d?: number; // 近7日故障修复数
  sysFaultTypeName?: string; // 热门故障类型
  tbDeviceCoverageRate?: number; // 设备覆盖度
}

interface ChartRatioData {
  legend: string[];
  series: { data: number[]; name: string }[];
}

interface ChartLineData {
  xAxis: string[];
  series: { data: number[]; name: string }[];
}

// 响应式数据
const parkDeviceIndicators = ref<ParkDeviceIndicators>({
  tbDeviceTotalCount: 0,
  tbDeviceOnlineCount: 0,
  tbDeviceNormalCount: 0,
  tbDeviceFaultCount: 0,
  tbDeviceIntactRate: 0,
});
const parkDeviceTypeRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '设备类型占比(%)', data: [] }],
});
const parkDeviceStatusRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '设备运行状态占比(%)', data: [] }],
});
const parkDeviceOnlineRateTrend7d = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '设备在线率(%)', data: [] }],
});

// 视图切换相关
const deviceChartRefreshKey = ref(0);
const activeDeviceView = ref('卡片');
const deviceViewBtnList = ref(['卡片', '饼图', '折线图']);

// 格式化方法
const formatNumber = (num: number) =>
  num.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
const formatDecimal = (num: number) => num.toFixed(1);

// 数字动画方法
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
    const currentValue = progress * (end - start) + start;

    element.textContent = Number.isInteger(end)
      ? formatNumber(Math.floor(currentValue))
      : formatDecimal(currentValue);

    if (progress < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
};

const initNumberAnimations = () => {
  document
    .querySelectorAll('.number-animate')
    .forEach((el) => {
      const targetEl = el as HTMLElement;
      const rawText = (targetEl.textContent || '0').replace(/[^\d.-]/g, '');
      const endValue = Number(rawText) || 0;
      animateValue(
        targetEl,
        0,
        endValue,
        1500,
      );
    });
};

// 接口请求方法
const getParkDeviceIndicatorsData = async () => {
  try {
    parkDeviceIndicators.value =
      (await fetchParkDeviceIndicators()) as ParkDeviceIndicators;
  } catch (error: any) {
    ElMessage.error(`设备核心指标加载失败：${error.message}`);
  }
};

const getParkDeviceTypeRatioData = async () => {
  try {
    parkDeviceTypeRatio.value =
      (await fetchParkDeviceTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`设备类型占比加载失败：${error.message}`);
  }
};

const getParkDeviceStatusRatioData = async () => {
  try {
    parkDeviceStatusRatio.value =
      (await fetchParkDeviceStatusRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`设备运行状态占比加载失败：${error.message}`);
  }
};

const getParkDeviceOnlineRateTrend7dData = async () => {
  try {
    parkDeviceOnlineRateTrend7d.value =
      (await fetchParkDeviceOnlineRateTrend7d()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`设备在线率趋势加载失败：${error.message}`);
  }
};

// 视图切换方法
const changeDeviceView = (viewName: string) => {
  activeDeviceView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '饼图' || viewName === '折线图') &&
  nextTick(() => deviceChartRefreshKey.value++);
};

// 数据刷新方法
const refreshDeviceData = async () => {
  await Promise.all([
    getParkDeviceIndicatorsData(),
    getParkDeviceTypeRatioData(),
    getParkDeviceStatusRatioData(),
    getParkDeviceOnlineRateTrend7dData(),
  ]);
  deviceChartRefreshKey.value++;
  ElMessage.success('资源设备数据刷新成功');
};

// 初始化资源设备数据
const initDeviceData = async () => {
  await Promise.all([
    getParkDeviceIndicatorsData(),
    getParkDeviceTypeRatioData(),
    getParkDeviceStatusRatioData(),
    getParkDeviceOnlineRateTrend7dData(),
  ]);
  setTimeout(() => {
    deviceChartRefreshKey.value++;
  }, 200);
};

onMounted(async () => {
  await initMapData();
  await initDeviceData();
  resetOrbitConfigForm();
});

onUnmounted(() => {
  if (currentFullscreenPanel.value) {
    screenFull.off('change', handleFullscreenChange);
  }
});
</script>

<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="mainbox">
      <div class="top">
        <div class="panel top-left">
          <el-tabs v-model="topLeftActiveTab" class="common-tabs">
            <el-tab-pane label="资源设备" name="tab1">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in deviceViewBtnList"
                      :key="item"
                      :type="activeDeviceView === item ? 'primary' : ''"
                      plain
                      @click="changeDeviceView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <button class="control-btn" @click="refreshDeviceData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('map')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>

              <!-- 卡片视图 -->
              <div v-if="activeDeviceView === '卡片'" class="view-content">
                <div class="indicator-cards4">
                  <div class="indicator-card4 card1">
                    <div class="indicator-title">设备总数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ parkDeviceIndicators.tbDeviceTotalCount }}</span>
                    </div>
                    <div class="indicator-unit">台</div>
                  </div>
                  <div class="indicator-card4 card2">
                    <div class="indicator-title">在线设备数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ parkDeviceIndicators.tbDeviceOnlineCount }}</span>
                    </div>
                    <div class="indicator-unit">台</div>
                  </div>
                  <div class="indicator-card4 card3">
                    <div class="indicator-title">正常运行数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ parkDeviceIndicators.tbDeviceNormalCount }}</span>
                    </div>
                    <div class="indicator-unit">台</div>
                  </div>
                  <div class="indicator-card4 card4">
                    <div class="indicator-title">设备完好率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(parkDeviceIndicators.tbDeviceIntactRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card4 card5">
                    <div class="indicator-title">故障设备数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ parkDeviceIndicators.tbDeviceFaultCount }}</span>
                    </div>
                    <div class="indicator-unit">台</div>
                  </div>
                </div>
              </div>

              <!-- 饼图视图 -->
              <div v-if="activeDeviceView === '饼图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartPie1
                    :data="parkDeviceTypeRatio"
                    title="设备类型占比"
                    :key="deviceChartRefreshKey"
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
                    :data="parkDeviceStatusRatio"
                    title="设备运行状态占比"
                    :key="deviceChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 折线图视图 -->
              <div v-if="activeDeviceView === '折线图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartLine1
                    :data="parkDeviceOnlineRateTrend7d"
                    title="近7日设备在线率变化趋势"
                    :key="deviceChartRefreshKey"
                  />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="通行交易" name="tab2">
              <div class="content-placeholder"><p>通行交易</p></div>
            </el-tab-pane>
            <el-tab-pane label="运维服务" name="tab3">
              <div class="content-placeholder"><p>运维服务</p></div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel top-middle">
          <el-tabs v-model="topMiddleActiveTab" class="common-tabs">
            <el-tab-pane label="停车资源分布" name="tab1">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <button class="control-btn" @click="handleOrbitAnimation">
                    <el-icon color="#409eff" size="16">
                      <VideoPause v-if="mapCommonRef?.orbitStatus?.playing" />
                      <VideoPlay v-else />
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
              <!-- 筛选抽屉 -->
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
              <!-- 地图组件 -->
              <div style="flex: 1; width: 100%; height: calc(100% - 2vh)">
                <MapCommon
                  ref="mapCommonRef"
                  id-name="parkingMap"
                  :geometries-array="geometriesArray"
                  :orbit-config="orbitConfigData"
                />
              </div>
              <!-- 地图环绕配置弹窗 -->
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
            </el-tab-pane>
            <el-tab-pane label="在停车辆实时监控" name="tab2">
              <div class="content-placeholder"><p>在停车辆实时监控</p></div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel top-right">
          <el-tabs v-model="topRightActiveTab" class="common-tabs">
            <el-tab-pane label="泊位车位" name="tab1">
              <div class="content-placeholder"><p>泊位车位</p></div>
            </el-tab-pane>
            <el-tab-pane label="终端设备" name="tab2">
              <div class="content-placeholder"><p>终端设备</p></div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
      </div>
      <div class="bottom">
        <div class="panel bottom-left">
          <el-tabs v-model="bottomLeftActiveTab" class="common-tabs">
            <el-tab-pane label="通行交易" name="tab1">
              <div class="content-placeholder"><p>通行交易</p></div>
            </el-tab-pane>
            <el-tab-pane label="设备运维" name="tab2">
              <div class="content-placeholder"><p>设备运维</p></div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-middle">
          <el-tabs v-model="bottomMiddleActiveTab" class="common-tabs">
            <el-tab-pane label="停车资源分布明细" name="tab1">
              <div class="content-placeholder"><p>停车资源分布明细</p></div>
            </el-tab-pane>
            <el-tab-pane label="终端设备分布明细" name="tab2">
              <div class="content-placeholder"><p>终端设备分布明细</p></div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-right">
          <el-tabs v-model="bottomRightActiveTab" class="common-tabs">
            <el-tab-pane label="供需运营态势" name="tab1">
              <div class="content-placeholder"><p>供需运营态势</p></div>
            </el-tab-pane>
            <el-tab-pane label="运维收费合规" name="tab2">
              <div class="content-placeholder"><p>运维收费合规</p></div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../templatesstyle/common';
@import '../../../templatesstyle/global-data-map';
@import '../../../templatesstyle/indicator-cards3';
@import '../../../templatesstyle/indicator-cards4';

// 最外层容器
.page-container {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  padding: 0 20px;
  overflow: hidden;
  color: #fff;
  background: url('../../images/bg.jpg');
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
}

.top {
  display: flex;
  gap: 0.6vw;
  height: 60%;
}

.top-left {
  flex: 2;
}

.top-middle {
  flex: 5;
}

.top-right {
  flex: 2;
}

.bottom {
  display: flex;
  gap: 0.6vw;
  height: 36%;
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

.content-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 1vw;
  color: #00ffd0;
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
