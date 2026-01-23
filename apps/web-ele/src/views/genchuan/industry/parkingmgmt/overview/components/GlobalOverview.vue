<script setup lang="ts">
import {
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import { useRouter } from 'vue-router';
import screenFull from 'screenfull';
import {
  ElButton,
  ElTable,
  ElTableColumn,
  ElDialog,
  ElDescriptions,
  ElDescriptionsItem,
  ElTag,
  ElMessage,
} from 'element-plus';
import { Filter, FullScreen, Refresh, Setting, VideoPause, VideoPlay,} from '@element-plus/icons-vue';
import MapCommon from './GlobalDataMap.vue';
import ChartLine1 from "#/views/genchuan/industry/templatesstatchart/ChartLine1.vue";
import ChartLine2 from "#/views/genchuan/industry/templatesstatchart/ChartLine2.vue";
import ChartPie1 from '#/views/genchuan/industry/templatesstatchart/ChartPie1.vue';
import ChartPie2 from '#/views/genchuan/industry/templatesstatchart/ChartPie2.vue';
import ChartPie3 from '#/views/genchuan/industry/templatesstatchart/ChartPie3.vue';
import ChartPie5 from '#/views/genchuan/industry/templatesstatchart/ChartPie5-desc.vue';
import VerticalBar1 from '#/views/genchuan/industry/templatesstatchart/VerticalBar1.vue';
import VerticalBar2 from '#/views/genchuan/industry/templatesstatchart/VerticalBar2.vue';

import {
  fetchParkingLotGeometries,
} from '#/api/genchuan/industry/parkingmgmt/overview/GlobalSituationOverview.ts';
import {
  fetchParkDeviceIndicators,
  fetchParkDeviceTypeRatio,
  fetchParkDeviceStatusRatio,
  fetchParkDeviceOnlineRateTrend7d,
  fetchParkResourceDistributionList,
  fetchParkResourceDistributionIndicators,
  fetchParkResourceDistributionAreaCount,
  fetchParkResourceDistributionTypeCount,
  fetchParkResourceDistributionTypeRatio,
  fetchParkResourceDistributionStatusRatio,
  fetchParkResourceDistributionDetail,
  fetchParkingSpaceList,
  fetchParkingSpaceIndicators,
  fetchParkingSpaceUtilizationTrend,
  fetchParkingSpaceTypeRatio,
  fetchParkingSpaceStatusRatio,
  fetchParkingSpaceDetail,
  releaseParkingSpace,
} from '#/api/genchuan/industry/parkingmgmt/overview/GlobalOverview.ts';

const pageContainerRef = ref(null);
const mapCommonRef = ref(null);
const geometriesArray = ref([]);
const router = useRouter();
const instance = getCurrentInstance();
const currentFullscreenPanel = ref<HTMLElement | null>(null);

// 标签页激活状态
const topLeftActiveTab = ref('tab1');
const topMiddleActiveTab = ref('tab1');
const topRightActiveTab = ref('tab1');
const bottomLeftActiveTab = ref('tab1');
const bottomMiddleActiveTab = ref('tab1');
const bottomRightActiveTab = ref('tab1');

const tipDialogVisible = ref(false);
const tipDialogContent = ref('');

// 格式化方法
const formatNumber = (num: number) =>
  num.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
const formatDecimal = (num: number) => num.toFixed(1);
// 新增：时间戳格式化（复用文件2的方法）
const formatTimeStamp = (timeStamp?: number | string) => {
  if (!timeStamp) return '-';
  const date = new Date(Number(timeStamp));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};
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
  if (screenFull.isFullscreen && currentFullscreenPanel.value) {
    setTimeout(() => {
      parkResourceDistributionChartRefreshKey.value++;
      parkingSpaceChartRefreshKey.value++;
    }, 300);
  } else if (currentFullscreenPanel.value) {
    currentFullscreenPanel.value.style = '';
    nextTick(() => {
      parkResourceDistributionChartRefreshKey.value++;
      parkingSpaceChartRefreshKey.value++;
    });
    currentFullscreenPanel.value = null;
  }
};

// 地图筛选相关
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

// 资源设备TS类型定义
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

// 停车资源分布明细TS类型定义
interface ParkResourceDistributionRow {
  tbParkingName: string;
  tbRegionName: string;
  sysParkingTypeName: string;
  tbParkingSpaceTotalCount: number;
  tbParkingSpaceAvailableCount: number;
  sysOperationStatusName: string;
  tbParkingContactPhone: string;
  tbParkingId: string;
}
interface ParkResourceDistributionIndicators {
  totalParkCount: number; // 停车场总数
  runningParkCount: number; // 运营中数
  totalSpaceCount: number; // 总泊位数
  availableSpaceCount: number; // 可用泊位数
}
interface ParkResourceDistributionDetail {
  tbParkingParkingId: string;
  tbParkingName: string;
  tbRegionName: string;
  tbParkingContactPhone: string;
  sysParkingTypeName: string;
  sysOperationStatusName: string;
  // 弹窗展示字段
  tbParkingSaturationRate: number; // 饱和率
  tbParkingChargeStandard: string; // 收费标准
  tbParkingUpdateTime: number; // 最近更新时间
  // 泊位分布
  spaceDistribution: ChartRatioData;
  // 运营数据
  operationData: {
    tbParkingSpaceTotalCount: number;
    tbParkingSpaceAvailableCount: number;
    tbParkingSaturationRate: number;
    tbParkingAverageUtilization: number;
  };
  // 收费标准明细
  chargeDetails: {
    timeRange: string;
    fee: string;
  }[];
}

// 泊位车位TS类型定义
interface ParkingSpaceRow {
  tbParkingName: string;
  tbParkingSpaceSpaceNo: string;
  sysSpaceTypeName: string;
  sysSpaceStatusName: string;
  tbParkingRecordOccupyDuration: number;
  tbRegionName: string;
  tbParkingSpaceSpaceId: string;
}
interface ParkingSpaceIndicators {
  totalSpaceCount: number; // 总泊位数
  availableSpaceCount: number; // 空闲数
  occupiedSpaceCount: number; // 占用数
  faultSpaceCount: number; // 故障数
  utilizationRate: number; // 使用率
}
interface ParkingSpaceDetail {
  tbParkingSpaceSpaceId: string;
  tbParkingSpaceUseCount: number; // 累计使用次数
  tbParkingSpaceLastUseTime: number | string; // 最近使用时间
  tbParkingSpaceFaultRate: number; // 故障率
  usageRecords: {
    time: number | string;
    duration: number;
    carNo: string;
    status: string;
  }[]; // 使用记录
  faultRecords: {
    time: number | string;
    content: string;
    handleStatus: string;
  }[]; // 故障记录
}
interface ReleaseForm {
  releaseReason: string;
}


// 资源设备响应式数据
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
// 资源设备视图切换相关
const deviceChartRefreshKey = ref(0);
const activeDeviceView = ref('卡片');
const deviceViewBtnList = ref(['卡片', '饼图', '折线图']);

// 停车资源分布明细响应式数据
const parkResourceDistributionList = ref<ParkResourceDistributionRow[]>([]);
const parkResourceDistributionIndicators = ref<ParkResourceDistributionIndicators>({
  totalParkCount: 0,
  runningParkCount: 0,
  totalSpaceCount: 0,
  availableSpaceCount: 0,
});
const parkResourceDistributionAreaCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '停车场数量', data: [] }],
});
const parkResourceDistributionTypeCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '停车场数量', data: [] }],
});
const parkResourceDistributionTypeRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '停车场类型占比(%)', data: [] }],
});
const parkResourceDistributionStatusRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '运营状态占比(%)', data: [] }],
});
// 停车资源分布明细视图切换相关
const parkResourceDistributionChartRefreshKey = ref(0);
const activeParkResourceDistributionView = ref('卡片');
const parkResourceDistributionViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);
// 停车资源分布明细弹窗相关
const parkResourceDistributionDetailDialogVisible = ref(false);
const parkResourceDistributionDetailSelectedRow = ref<ParkResourceDistributionDetail>({
  tbParkingParkingId: '',
  tbParkingName: '',
  tbRegionName: '',
  tbParkingContactPhone: '',
  sysParkingTypeName: '',
  sysOperationStatusName: '',
  tbParkingSaturationRate: 0,
  tbParkingChargeStandard: '',
  tbParkingUpdateTime: 0,
  spaceDistribution: {
    legend: [],
    series: [{ name: '车位分布', data: [] }]
  },
  operationData: {
    tbParkingSpaceTotalCount: 0,
    tbParkingSpaceAvailableCount: 0,
    tbParkingSaturationRate: 0,
    tbParkingAverageUtilization: 0,
  },
  chargeDetails: []
});

// 泊位车位响应式数据
const parkingSpaceList = ref<ParkingSpaceRow[]>([]);
const parkingSpaceIndicators = ref<ParkingSpaceIndicators>({
  totalSpaceCount: 0,
  availableSpaceCount: 0,
  occupiedSpaceCount: 0,
  faultSpaceCount: 0,
  utilizationRate: 0,
});
const parkingSpaceUtilizationTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '泊位使用率(%)', data: [] }],
});
const parkingSpaceTypeRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '泊位类型占比(%)', data: [] }],
});
const parkingSpaceStatusRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '使用状态占比(%)', data: [] }],
});
// 泊位车位视图切换相关
const parkingSpaceChartRefreshKey = ref(0);
const activeParkingSpaceView = ref('卡片');
const parkingSpaceViewBtnList = ref(['卡片', '折线图', '饼图', '列表']);
// 泊位车位弹窗相关
const parkingSpaceDetailDialogVisible = ref(false);
const parkingSpaceReleaseDialogVisible = ref(false);
const activeParkingSpaceDetailView = ref('基本信息');
const parkingSpaceDetailViewBtnList = ref(['基本信息', '使用记录', '故障记录']);
const parkingSpaceDetailSelectedRow = ref<ParkingSpaceDetail>({
  tbParkingSpaceSpaceId: '',
  tbParkingSpaceUseCount: 0,
  tbParkingSpaceLastUseTime: '',
  tbParkingSpaceFaultRate: 0,
  usageRecords: [],
  faultRecords: []
});
const releaseForm = ref<ReleaseForm>({
  releaseReason: ''
});
const releaseFormRules = {
  releaseReason: [{ required: true, message: '释放原因不能为空', trigger: 'blur' }]
};
const releaseFormRef = ref<FormInstance>();
const releasingSpaceId = ref(''); // 当前正在释放的泊位ID


// 资源设备接口请求方法
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

// 停车资源分布明细接口请求方法
const getParkResourceDistributionListData = async () => {
  try {
    parkResourceDistributionList.value = (await fetchParkResourceDistributionList()) as ParkResourceDistributionRow[];
  } catch (error: any) {
    ElMessage.error(`停车资源分布明细列表加载失败：${error.message}`);
    parkResourceDistributionList.value = [];
  }
};
const getParkResourceDistributionIndicatorsData = async () => {
  try {
    parkResourceDistributionIndicators.value =
      (await fetchParkResourceDistributionIndicators()) as ParkResourceDistributionIndicators;
  } catch (error: any) {
    ElMessage.error(`停车资源分布明细核心指标加载失败：${error.message}`);
  }
};
const getParkResourceDistributionAreaCountData = async () => {
  try {
    parkResourceDistributionAreaCountData.value =
      (await fetchParkResourceDistributionAreaCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`各区域停车场数量加载失败：${error.message}`);
  }
};
const getParkResourceDistributionTypeCountData = async () => {
  try {
    parkResourceDistributionTypeCountData.value =
      (await fetchParkResourceDistributionTypeCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`各类型停车场数量加载失败：${error.message}`);
  }
};
const getParkResourceDistributionTypeRatioData = async () => {
  try {
    parkResourceDistributionTypeRatioData.value =
      (await fetchParkResourceDistributionTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`停车场类型占比加载失败：${error.message}`);
  }
};
const getParkResourceDistributionStatusRatioData = async () => {
  try {
    parkResourceDistributionStatusRatioData.value =
      (await fetchParkResourceDistributionStatusRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`运营状态占比加载失败：${error.message}`);
  }
};
const getParkResourceDistributionDetailData = async (parkingId: string) => {
  try {
    parkResourceDistributionDetailSelectedRow.value = {
      ...parkResourceDistributionDetailSelectedRow.value,
      ...(await fetchParkResourceDistributionDetail(parkingId)),
    };
  } catch (error: any) {
    ElMessage.warning(`停车资源分布明细详情加载失败：${error.message}`);
  }
};

// 泊位车位接口请求方法
const getParkingSpaceListData = async () => {
  try {
    parkingSpaceList.value = (await fetchParkingSpaceList()) as ParkingSpaceRow[];
  } catch (error: any) {
    ElMessage.error(`泊位车位列表加载失败：${error.message}`);
    parkingSpaceList.value = [];
  }
};
const getParkingSpaceIndicatorsData = async () => {
  try {
    parkingSpaceIndicators.value =
      (await fetchParkingSpaceIndicators()) as ParkingSpaceIndicators;
  } catch (error: any) {
    ElMessage.error(`泊位车位核心指标加载失败：${error.message}`);
  }
};
const getParkingSpaceUtilizationTrendData = async () => {
  try {
    parkingSpaceUtilizationTrend.value =
      (await fetchParkingSpaceUtilizationTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`泊位使用率趋势加载失败：${error.message}`);
  }
};
const getParkingSpaceTypeRatioData = async () => {
  try {
    parkingSpaceTypeRatio.value =
      (await fetchParkingSpaceTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`泊位类型占比加载失败：${error.message}`);
  }
};
const getParkingSpaceStatusRatioData = async () => {
  try {
    parkingSpaceStatusRatio.value =
      (await fetchParkingSpaceStatusRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`使用状态占比加载失败：${error.message}`);
  }
};
const getParkingSpaceDetailData = async (spaceId: string) => {
  try {
    parkingSpaceDetailSelectedRow.value = {
      ...parkingSpaceDetailSelectedRow.value,
      ...(await fetchParkingSpaceDetail(spaceId)),
    };
  } catch (error: any) {
    ElMessage.warning(`泊位详情加载失败：${error.message}`);
  }
};
const releaseParkingSpaceData = async (spaceId: string, releaseReason: string) => {
  try {
    await releaseFormRef.value?.validate();
    const res = await releaseParkingSpace(spaceId, releaseReason);
    if (res.success) {
      tipDialogContent.value = res.message;
      tipDialogVisible.value = true;
      parkingSpaceReleaseDialogVisible.value = false;
      releaseForm.value.releaseReason = '';
      releaseFormRef.value?.resetFields();
      // 刷新数据
      await getParkingSpaceListData();
      await getParkingSpaceIndicatorsData();
      await getParkingSpaceStatusRatioData();
    } else {
      tipDialogContent.value = res.message || '释放失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `释放失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};


// 资源设备视图切换方法
const changeDeviceView = (viewName: string) => {
  activeDeviceView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '饼图' || viewName === '折线图') &&
  nextTick(() => deviceChartRefreshKey.value++);
};
// 资源设备数据刷新方法
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

// 停车资源分布明细视图切换
const changeParkResourceDistributionView = (viewName: string) => {
  activeParkResourceDistributionView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '柱状图' || viewName === '饼图') &&
  nextTick(() => parkResourceDistributionChartRefreshKey.value++);
};
// 停车资源分布明细弹窗方法
const openParkResourceDistributionDetailDialog = async (row: ParkResourceDistributionRow) => {
  await getParkResourceDistributionDetailData(row.tbParkingId);
  parkResourceDistributionDetailDialogVisible.value = true;
};
const closeParkResourceDistributionDetailDialog = () => {
  parkResourceDistributionDetailDialogVisible.value = false;
  parkResourceDistributionDetailSelectedRow.value = {
    tbParkingParkingId: '',
    tbParkingName: '',
    tbRegionName: '',
    tbParkingContactPhone: '',
    sysParkingTypeName: '',
    sysOperationStatusName: '',
    tbParkingSaturationRate: 0,
    tbParkingChargeStandard: '',
    tbParkingUpdateTime: 0,
    spaceDistribution: {
      legend: [],
      series: [{ name: '车位分布', data: [] }]
    },
    operationData: {
      tbParkingSpaceTotalCount: 0,
      tbParkingSpaceAvailableCount: 0,
      tbParkingSaturationRate: 0,
      tbParkingAverageUtilization: 0,
    },
    chargeDetails: []
  };
};
// 停车资源分布明细刷新数据
const refreshParkResourceDistributionData = async () => {
  await Promise.all([
    getParkResourceDistributionListData(),
    getParkResourceDistributionIndicatorsData(),
    getParkResourceDistributionAreaCountData(),
    getParkResourceDistributionTypeCountData(),
    getParkResourceDistributionTypeRatioData(),
    getParkResourceDistributionStatusRatioData(),
  ]);
  parkResourceDistributionChartRefreshKey.value++;
  ElMessage.success('停车资源分布明细数据刷新成功');
};

// 泊位车位视图切换
const changeParkingSpaceView = (viewName: string) => {
  activeParkingSpaceView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '折线图' || viewName === '饼图') &&
  nextTick(() => parkingSpaceChartRefreshKey.value++);
};
const changeParkingSpaceDetailView = (viewName: string) => {
  activeParkingSpaceDetailView.value = viewName;
};
// 泊位车位弹窗方法
const openParkingSpaceDetailDialog = async (row: ParkingSpaceRow) => {
  await getParkingSpaceDetailData(row.tbParkingSpaceSpaceId);
  parkingSpaceDetailDialogVisible.value = true;
};
const closeParkingSpaceDetailDialog = () => {
  parkingSpaceDetailDialogVisible.value = false;
  parkingSpaceDetailSelectedRow.value = {
    tbParkingSpaceSpaceId: '',
    tbParkingSpaceUseCount: 0,
    tbParkingSpaceLastUseTime: '',
    tbParkingSpaceFaultRate: 0,
    usageRecords: [],
    faultRecords: []
  };
  activeParkingSpaceDetailView.value = '基本信息';
};
const openParkingSpaceReleaseDialog = (row: ParkingSpaceRow) => {
  if (row.sysSpaceStatusName === '占用' || row.sysSpaceStatusName === '故障') {
    releasingSpaceId.value = row.tbParkingSpaceSpaceId;
    parkingSpaceReleaseDialogVisible.value = true;
  } else {
    tipDialogContent.value = '只有占用或异常的泊位可以释放';
    tipDialogVisible.value = true;
  }
};
const closeParkingSpaceReleaseDialog = () => {
  parkingSpaceReleaseDialogVisible.value = false;
  releaseForm.value.releaseReason = '';
  releaseFormRef.value?.resetFields();
  releasingSpaceId.value = '';
};
// 泊位车位数据刷新
const refreshParkingSpaceData = async () => {
  await Promise.all([
    getParkingSpaceListData(),
    getParkingSpaceIndicatorsData(),
    getParkingSpaceUtilizationTrendData(),
    getParkingSpaceTypeRatioData(),
    getParkingSpaceStatusRatioData(),
  ]);
  parkingSpaceChartRefreshKey.value++;
  ElMessage.success('泊位车位数据刷新成功');
};


onMounted(async () => {
  await initMapData();
  resetOrbitConfigForm();
  await Promise.all([
    getParkDeviceIndicatorsData(),
    getParkDeviceTypeRatioData(),
    getParkDeviceStatusRatioData(),
    getParkDeviceOnlineRateTrend7dData(),
    getParkResourceDistributionListData(),
    getParkResourceDistributionIndicatorsData(),
    getParkResourceDistributionAreaCountData(),
    getParkResourceDistributionTypeCountData(),
    getParkResourceDistributionTypeRatioData(),
    getParkResourceDistributionStatusRatioData(),
    getParkingSpaceListData(),
    getParkingSpaceIndicatorsData(),
    getParkingSpaceUtilizationTrendData(),
    getParkingSpaceTypeRatioData(),
    getParkingSpaceStatusRatioData(),
  ]);
  setTimeout(() => {
    parkResourceDistributionChartRefreshKey.value++;
    parkingSpaceChartRefreshKey.value++;
  }, 200);
  screenFull.on('change', handleFullscreenChange);
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
        <div class="panel top-middle" ref="map">
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
        <div class="panel top-right" ref="parkingSpacePanelRef">
          <el-tabs v-model="topRightActiveTab" class="common-tabs">
            <el-tab-pane label="泊位车位" name="tab1">
                <div class="header-actions">
                  <div class="actions-left"><p></p></div>
                  <div class="actions-right">
                    <div class="view-btn-group">
                      <ElButton
                        v-for="item in parkingSpaceViewBtnList"
                        :key="item"
                        :type="activeParkingSpaceView === item ? 'primary' : ''"
                        plain
                        @click="changeParkingSpaceView(item)"
                        class="view-btn"
                      >
                        {{ item }}
                      </ElButton>
                    </div>
                    <el-icon color="#409eff" size="16" @click="refreshParkingSpaceData"><Refresh /></el-icon>
                    <el-icon color="#409eff" size="16"><Filter /></el-icon>
                    <button
                      class="panel-fullscreen-btn"
                      @click="togglePanelFullscreen('parkingSpacePanelRef')"
                    >
                      <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                    </button>
                  </div>
                </div>

                <!-- 卡片视图 -->
                <div v-if="activeParkingSpaceView === '卡片'" class="view-content">
                  <div class="indicator-cards3">
                    <div class="indicator-card3 card1">
                      <div class="indicator-title">总泊位数</div>
                      <div class="indicator-value">
                        <span class="number-animate">{{ parkingSpaceIndicators.totalSpaceCount }}</span>
                      </div>
                      <div class="indicator-unit">个</div>
                    </div>
                    <div class="indicator-card3 card2">
                      <div class="indicator-title">空闲数</div>
                      <div class="indicator-value">
                        <span class="number-animate">{{ parkingSpaceIndicators.availableSpaceCount }}</span>
                      </div>
                      <div class="indicator-unit">个</div>
                    </div>
                    <div class="indicator-card3 card3">
                      <div class="indicator-title">占用数</div>
                      <div class="indicator-value">
                        <span class="number-animate">{{ parkingSpaceIndicators.occupiedSpaceCount }}</span>
                      </div>
                      <div class="indicator-unit">个</div>
                    </div>
                    <div class="indicator-card3 card4">
                      <div class="indicator-title">故障数</div>
                      <div class="indicator-value">
                        <span class="number-animate">{{ parkingSpaceIndicators.faultSpaceCount }}</span>
                      </div>
                      <div class="indicator-unit">个</div>
                    </div>
                    <div class="indicator-card3 card5">
                      <div class="indicator-title">使用率</div>
                      <div class="indicator-value">
                        <span class="number-animate">{{ formatDecimal(parkingSpaceIndicators.utilizationRate) }}</span>
                      </div>
                      <div class="indicator-unit">%</div>
                    </div>
                  </div>
                </div>

                <!-- 折线图视图 -->
                <div v-if="activeParkingSpaceView === '折线图'" class="view-content">
                  <ChartLine1
                    :data="parkingSpaceUtilizationTrend"
                    title="近24小时泊位使用率变化趋势"
                    :key="parkingSpaceChartRefreshKey"
                  />
                </div>

                <!-- 饼图视图 -->
                <div v-if="activeParkingSpaceView === '饼图'" class="view-content">
                  <div
                    style="
          display: inline-block;
          width: 49%;
          height: 100%;
          vertical-align: top;
        "
                  >
                    <ChartPie1
                      :data="parkingSpaceTypeRatio"
                      title="泊位类型占比"
                      :key="parkingSpaceChartRefreshKey"
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
                      :data="parkingSpaceStatusRatio"
                      title="使用状态占比"
                      :key="parkingSpaceChartRefreshKey"
                    />
                  </div>
                </div>

                <!-- 列表视图 -->
                <div v-if="activeParkingSpaceView === '列表'" class="view-content">
                  <div class="table-box4">
                    <ElTable
                      class="table4"
                      :data="parkingSpaceList"
                      border
                      size="small"
                      width="100%"
                      height="100%"
                      table-layout="fixed"
                      highlight-current-row
                      @row-click="(row) => openParkingSpaceDetailDialog(row)"
                    >
                      <ElTableColumn
                        prop="tbParkingName"
                        label="停车场名称"
                        align="center"
                        min-width="120"
                      />
                      <ElTableColumn
                        prop="tbParkingSpaceSpaceNo"
                        label="泊位编号"
                        align="center"
                        min-width="100"
                      />
                      <ElTableColumn
                        prop="sysSpaceTypeName"
                        label="泊位类型"
                        align="center"
                        min-width="100"
                      />
                      <ElTableColumn
                        prop="sysSpaceStatusName"
                        label="使用状态"
                        align="center"
                        width="100"
                      >
                        <template #default="scope">
                          <ElTag
                            :type="scope.row.sysSpaceStatusName === '空闲' ? 'success' :
                       scope.row.sysSpaceStatusName === '占用' ? 'warning' :
                       scope.row.sysSpaceStatusName === '故障' ? 'danger' : 'info'"
                          >
                            {{ scope.row.sysSpaceStatusName || '-' }}
                          </ElTag>
                        </template>
                      </ElTableColumn>
                      <ElTableColumn
                        prop="tbParkingRecordOccupyDuration"
                        label="占用时长(分钟)"
                        align="center"
                        width="120"
                      >
                        <template #default="scope">
                          {{ scope.row.tbParkingRecordOccupyDuration || 0 }}
                        </template>
                      </ElTableColumn>
                      <ElTableColumn
                        prop="tbRegionName"
                        label="所属区域"
                        align="center"
                        min-width="100"
                      />
                      <ElTableColumn
                        label="操作"
                        align="center"
                        width="100"
                        fixed="right"
                      >
                        <template #default="scope">
                          <ElButton
                            type="primary"
                            size="small"
                            plain
                            @click.stop="openParkingSpaceReleaseDialog(scope.row)"
                            :disabled="scope.row.sysSpaceStatusName !== '占用' && scope.row.sysSpaceStatusName !== '故障'"
                          >
                            释放
                          </ElButton>
                        </template>
                      </ElTableColumn>
                    </ElTable>
                  </div>
                </div>
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
        <div class="panel bottom-middle" ref="parkResourcePanelRef">
          <el-tabs v-model="bottomMiddleActiveTab" class="common-tabs">
            <el-tab-pane label="停车资源分布明细" name="tab1">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in parkResourceDistributionViewBtnList"
                      :key="item"
                      :type="activeParkResourceDistributionView === item ? 'primary' : ''"
                      plain
                      @click="changeParkResourceDistributionView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <el-icon color="#409eff" size="16" @click="refreshParkResourceDistributionData"><Refresh /></el-icon>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('parkResourcePanelRef')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>

              <!-- 卡片视图 -->
              <div v-if="activeParkResourceDistributionView === '卡片'" class="view-content-low">
                <div class="indicator-cards3">
                  <div class="indicator-card3 card1">
                    <div class="indicator-title">停车场总数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ parkResourceDistributionIndicators.totalParkCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card2">
                    <div class="indicator-title">运营中数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ parkResourceDistributionIndicators.runningParkCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card3">
                    <div class="indicator-title">总泊位数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ parkResourceDistributionIndicators.totalSpaceCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card4">
                    <div class="indicator-title">可用泊位数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ parkResourceDistributionIndicators.availableSpaceCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                </div>
              </div>

              <!-- 柱状图视图 -->
              <div v-if="activeParkResourceDistributionView === '柱状图'" class="view-content-low">
                <div
                  style="
      display: inline-block;
      width: 49%;
      height: 100%;
      vertical-align: top;
    "
                >
                  <VerticalBar2
                    :x-axis="parkResourceDistributionAreaCountData.xAxis"
                    :series="parkResourceDistributionAreaCountData.series"
                    unit="个"
                    title="各区域停车场数量对比"
                    :key="parkResourceDistributionChartRefreshKey"
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
                    :x-axis="parkResourceDistributionTypeCountData.xAxis"
                    :series="parkResourceDistributionTypeCountData.series"
                    unit="个"
                    title="各类型停车场数量对比"
                    :key="parkResourceDistributionChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 饼图视图 -->
              <div v-if="activeParkResourceDistributionView === '饼图'" class="view-content-low">
                <div
                  style="
      display: inline-block;
      width: 49%;
      height: 100%;
      vertical-align: top;
    "
                >
                  <ChartPie1
                    :data="parkResourceDistributionTypeRatioData"
                    title="停车场类型占比"
                    :key="parkResourceDistributionChartRefreshKey"
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
                    :data="parkResourceDistributionStatusRatioData"
                    title="运营状态占比"
                    :key="parkResourceDistributionChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 列表视图 -->
              <div v-if="activeParkResourceDistributionView === '列表'" class="view-content-low">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="parkResourceDistributionList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openParkResourceDistributionDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="tbParkingName"
                      label="停车场名称"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="tbRegionName"
                      label="区域归属"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="sysParkingTypeName"
                      label="停车场类型"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="tbParkingSpaceTotalCount"
                      label="总泊位数"
                      align="center"
                      width="100"
                    />
                    <ElTableColumn
                      prop="tbParkingSpaceAvailableCount"
                      label="可用泊位数"
                      align="center"
                      width="100"
                    />
                    <ElTableColumn
                      prop="sysOperationStatusName"
                      label="运营状态"
                      align="center"
                      width="100"
                    >
                      <template #default="scope">
                        <ElTag :type="scope.row.sysOperationStatusName === '运营中' ? 'success' : 'warning'">
                          {{ scope.row.sysOperationStatusName || '-' }}
                        </ElTag>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbParkingContactPhone"
                      label="联系电话"
                      align="center"
                      width="120"
                    />
                  </ElTable>
                </div>
              </div>
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

      <!-- 停车资源分布明细详情弹窗 -->
      <ElDialog
        v-model="parkResourceDistributionDetailDialogVisible"
        width="60%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="停车资源分布明细详情"
      >
        <div class="view-content" style="padding:0; display: flex; flex-direction: column; gap: 2vw;">
          <!-- 基本信息和运营数据 -->
          <div style="display: flex; gap: 2vw;">
            <div style="flex: 3;">
              <h3>基本信息</h3>
              <ElDescriptions bordered :column="3" class="desc-detail">
                <ElDescriptionsItem label="停车场ID">
                  {{ parkResourceDistributionDetailSelectedRow.tbParkingParkingId || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="停车场名称">
                  {{ parkResourceDistributionDetailSelectedRow.tbParkingName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="区域归属">
                  {{ parkResourceDistributionDetailSelectedRow.tbRegionName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="停车场类型">
                  {{ parkResourceDistributionDetailSelectedRow.sysParkingTypeName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="运营状态">
                  <ElTag :type="parkResourceDistributionDetailSelectedRow.sysOperationStatusName === '运营中' ? 'success' : 'warning'">
                    {{ parkResourceDistributionDetailSelectedRow.sysOperationStatusName || '-' }}
                  </ElTag>
                </ElDescriptionsItem>
                <ElDescriptionsItem label="联系电话">
                  {{ parkResourceDistributionDetailSelectedRow.tbParkingContactPhone || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="饱和率(%)">
                  {{ formatDecimal(parkResourceDistributionDetailSelectedRow.tbParkingSaturationRate) }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="最近更新时间">
                  {{ formatTimeStamp(parkResourceDistributionDetailSelectedRow.tbParkingUpdateTime) }}
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
            <div style="flex: 1;">
              <h3>运营数据</h3>
              <ElDescriptions bordered :column="1" class="desc-detail">
                <ElDescriptionsItem label="总泊位数">
                  {{ parkResourceDistributionDetailSelectedRow.operationData.tbParkingSpaceTotalCount || 0 }} 个
                </ElDescriptionsItem>
                <ElDescriptionsItem label="可用泊位数">
                  {{ parkResourceDistributionDetailSelectedRow.operationData.tbParkingSpaceAvailableCount || 0 }} 个
                </ElDescriptionsItem>
                <ElDescriptionsItem label="饱和率(%)">
                  {{ formatDecimal(parkResourceDistributionDetailSelectedRow.operationData.tbParkingSaturationRate) }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="平均使用率(%)">
                  {{ formatDecimal(parkResourceDistributionDetailSelectedRow.operationData.tbParkingAverageUtilization) }}
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
          </div>
          <!-- 泊位分布和收费标准 -->
          <div style="display: flex; gap: 2vw;">
            <div style="flex: 1;">
              <h3>泊位分布</h3>
              <ElTable
                :data="parkResourceDistributionDetailSelectedRow.spaceDistribution.legend.map((item, index) => ({
            type: item,
            count: parkResourceDistributionDetailSelectedRow.spaceDistribution.series[0]?.data[index] || 0
          }))"
                border
                size="small"
                width="100%"
                table-layout="fixed"
              >
                <ElTableColumn
                  prop="type"
                  label="车位类型"
                  align="center"
                  width="120"
                />
                <ElTableColumn
                  prop="count"
                  label="数量"
                  align="center"
                  width="100"
                >
                  <template #default="scope">
                    {{ scope.row.count }} 个
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
            <div style="flex: 1;">
              <strong>收费标准：</strong>{{ parkResourceDistributionDetailSelectedRow.tbParkingChargeStandard || '-' }}
              <ElTable
                :data="parkResourceDistributionDetailSelectedRow.chargeDetails"
                border
                size="small"
                width="100%"
                table-layout="fixed"
              >
                <ElTableColumn
                  prop="timeRange"
                  label="时间段"
                  align="center"
                  width="150"
                />
                <ElTableColumn
                  prop="fee"
                  label="费用"
                  align="center"
                  width="150"
                />
              </ElTable>
            </div>
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeParkResourceDistributionDetailDialog">关闭</ElButton>
        </template>
      </ElDialog>

      <!-- 泊位车位详情弹窗 -->
      <ElDialog
        v-model="parkingSpaceDetailDialogVisible"
        width="40%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="泊位车位详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in parkingSpaceDetailViewBtnList"
                :key="item"
                :type="activeParkingSpaceDetailView === item ? 'primary' : ''"
                plain
                @click="changeParkingSpaceDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <!-- 基本信息视图 -->
        <div v-if="activeParkingSpaceDetailView === '基本信息'" class="view-content" style="padding:0;">
          <ElDescriptions bordered :column="2" class="desc-detail">
            <ElDescriptionsItem label="泊位ID" span="2">
              {{ parkingSpaceDetailSelectedRow.tbParkingSpaceSpaceId || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="累计使用次数" span="2">
              {{ parkingSpaceDetailSelectedRow.tbParkingSpaceUseCount || 0 }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="最近使用时间" span="2">
              {{ formatTimeStamp(parkingSpaceDetailSelectedRow.tbParkingSpaceLastUseTime) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="故障率" span="2">
              {{ formatDecimal(parkingSpaceDetailSelectedRow.tbParkingSpaceFaultRate) }}%
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>
        <!-- 使用记录视图 -->
        <div v-if="activeParkingSpaceDetailView === '使用记录'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="parkingSpaceDetailSelectedRow.usageRecords"
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
                width="180"
              >
                <template #default="scope">
                  {{ formatTimeStamp(scope.row.time) }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="duration"
                label="占用时长(分钟)"
                align="center"
                width="120"
              />
              <ElTableColumn
                prop="carNo"
                label="车牌号"
                align="center"
                width="120"
              />
              <ElTableColumn
                prop="status"
                label="状态"
                align="center"
                width="120"
              >
                <template #default="scope">
                  <ElTag :type="scope.row.status === '已完成' ? 'success' : 'info'">
                    {{ scope.row.status || '-' }}
                  </ElTag>
                </template>
              </ElTableColumn>
            </ElTable>
          </div>
        </div>
        <!-- 故障记录视图 -->
        <div v-if="activeParkingSpaceDetailView === '故障记录'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="parkingSpaceDetailSelectedRow.faultRecords"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="time"
                label="故障时间"
                align="center"
                width="180"
              >
                <template #default="scope">
                  {{ formatTimeStamp(scope.row.time) }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="content"
                label="故障内容"
                align="center"
                min-width="300"
              />
              <ElTableColumn
                prop="handleStatus"
                label="处理状态"
                align="center"
                width="120"
              >
                <template #default="scope">
                  <ElTag :type="scope.row.handleStatus === '已修复' ? 'success' : 'warning'">
                    {{ scope.row.handleStatus || '-' }}
                  </ElTag>
                </template>
              </ElTableColumn>
            </ElTable>
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeParkingSpaceDetailDialog">关闭</ElButton>
        </template>
      </ElDialog>
      <!-- 释放泊位弹窗 -->
      <ElDialog
        v-model="parkingSpaceReleaseDialogVisible"
        width="40%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="park-dialog"
        center
        destroy-on-close
        title="释放泊位"
      >
        <el-form
          ref="releaseFormRef"
          :model="releaseForm"
          :rules="releaseFormRules"
          label-width="80px"
          style="width: 100%;"
        >
          <el-form-item label="释放原因" prop="releaseReason">
            <el-input
              v-model="releaseForm.releaseReason"
              type="textarea"
              :rows="4"
              placeholder="请输入释放原因"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <ElButton plain @click="closeParkingSpaceReleaseDialog">取消</ElButton>
          <ElButton type="primary" @click="releaseParkingSpaceData(releasingSpaceId, releaseForm.releaseReason)">确认</ElButton>
        </template>
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../templatesstyle/common';
@import '../../../templatesstyle/global-data-map';
@import '../../../templatesstyle/table1';
@import '../../../templatesstyle/table2-rank';
@import '../../../templatesstyle/table3';
@import '../../../templatesstyle/table4';
@import '../../../templatesstyle/indicator-cards3';
@import '../../../templatesstyle/indicator-cards4';

// 最外层容器
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
  padding: 0.5vw;
  overflow: hidden !important;
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
  overflow: hidden !important;
}

.top {
  display: flex;
  gap: 0.6vw;
  height: 60%;
  overflow: hidden !important;
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
  overflow: hidden !important;
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
