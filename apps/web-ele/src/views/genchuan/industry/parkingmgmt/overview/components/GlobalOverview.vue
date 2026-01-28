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
import GlobalNormalMap from '#/views/genchuan/industry/parkingmgmt/overview/components/GlobalNormalMap.vue';
import ChartLine1 from "#/views/genchuan/industry/templatesstatchart/ChartLine1.vue";
import ChartLine2 from "#/views/genchuan/industry/templatesstatchart/ChartLine2.vue";
import ChartLine3 from "#/views/genchuan/industry/templatesstatchart/ChartLine3-desc.vue";
import ChartPie1 from '#/views/genchuan/industry/templatesstatchart/ChartPie1.vue';
import ChartPie2 from '#/views/genchuan/industry/templatesstatchart/ChartPie2.vue';
import ChartPie3 from '#/views/genchuan/industry/templatesstatchart/ChartPie3.vue';
import ChartPie5 from '#/views/genchuan/industry/templatesstatchart/ChartPie5-desc.vue';
import VerticalBar1 from '#/views/genchuan/industry/templatesstatchart/VerticalBar1.vue';
import VerticalBar2 from '#/views/genchuan/industry/templatesstatchart/VerticalBar2.vue';
import VerticalBar3 from '#/views/genchuan/industry/templatesstatchart/VerticalBar3.vue';
import Heatmap1 from '#/views/genchuan/industry/templatesstatchart/Heatmap1.vue';
import GlobalHeatmapMap from '#/views/genchuan/industry/parkingmgmt/overview/components/GlobalHeatmapMap.vue';

import {
  fetchTradeTrendList,
  fetchTradeTrendIndicators,
  fetchTradeTrendCountTrend,
  fetchTradeTrendAmountTrend,
  fetchTradeTrendTimeCountCompare,
  fetchTradeTrendRegionAmountCompare,
  fetchTradeTrendPayMethodRatio,
  fetchTradeTrendRegionTradeRatio,
  fetchTradeTrendDetail,
  fetchTradeTrendTimeTrend,
  fetchSupplyDemandList,
  fetchSupplyDemandIndicators,
  fetchSupplyDemandTrend,
  fetchSupplyDemandBalanceRatio,
  fetchSupplyDemandRegionRatio,
  fetchSupplyDemandDetail,
  fetchSupplyDemandAnalysis,
  exportSupplyDemandAnalysisReport,
  fetchParkAreaDistributionList,
  fetchParkAreaDistributionDetail,
  fetchParkAreaDistributionIndicators,
  fetchParkAreaDistributionAreaCount,
  fetchParkAreaDistributionAreaSpaceCount,
  fetchParkingLotGeometries,
} from '#/api/genchuan/industry/parkingmgmt/overview/GlobalOverview.ts';
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
const router = useRouter();
const instance = getCurrentInstance();
const currentFullscreenPanel = ref<HTMLElement | null>(null);

const normalMapRef = ref<InstanceType<typeof GlobalNormalMap> | null>(null); // 第一个地图
const heatmapMapRef = ref<InstanceType<typeof GlobalHeatmapMap> | null>(null); // 第二个地图

// 新增地图加载状态（参考参考代码的 mapLoading 逻辑）
const normalMapLoading = ref(true);
const heatmapLoading = ref(false); // 第二个地图默认不加载，切换Tab时加载

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
      tradeTrendChartRefreshKey.value++;
      supplyDemandChartRefreshKey.value++;
      parkAreaDistributionChartRefreshKey.value++;
    }, 300);
  } else if (currentFullscreenPanel.value) {
    currentFullscreenPanel.value.style = '';
    nextTick(() => {
      parkResourceDistributionChartRefreshKey.value++;
      parkingSpaceChartRefreshKey.value++;
      tradeTrendChartRefreshKey.value++;
      supplyDemandChartRefreshKey.value++;
      parkAreaDistributionChartRefreshKey.value++;
    });
    currentFullscreenPanel.value = null;
  }
};

const handleTabChange = () => {
  nextTick(() => {
    setTimeout(() => {
      parkResourceDistributionChartRefreshKey.value++;
      parkingSpaceChartRefreshKey.value++;
      tradeTrendChartRefreshKey.value++;
      supplyDemandChartRefreshKey.value++;
      parkAreaDistributionChartRefreshKey.value++;
    }, 100);
  });
};

// 地图环绕动画
const handleOrbitAnimation = () => {
  let targetRef = null;
  // 根据当前激活的Tab判断操作哪个地图
  if (topMiddleActiveTab.value === 'tab1') { // 第一个Tab（在停车辆）
    targetRef = normalMapRef.value;
  } else if (topMiddleActiveTab.value === 'tab2') { // 第二个Tab（停车资源）
    targetRef = heatmapMapRef.value;
  }

  if (targetRef && typeof targetRef.toggleOrbitAnimation === 'function') {
    targetRef.toggleOrbitAnimation();
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

    [normalMapRef.value].forEach(ref => {
      ref && (ref.stopOrbitAnimation(), ref.startOrbitAnimation());
    });

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

  [normalMapRef.value].forEach(ref => {
    ref && (ref.stopOrbitAnimation(), ref.startOrbitAnimation());
  });

  ElMessage.success('已恢复默认配置');
};

//缓存原始车辆数据（只加载一次）
const originalGeometriesData = ref<VehicleData[]>([]);

// 修改初始化地图数据函数：移除筛选逻辑，直接使用原始数据
const initMapData = async () => {
  try {
    // 只请求一次接口，缓存原始数据
    const rawData = await fetchParkingLotGeometries();
    originalGeometriesData.value = rawData;
    geometriesArray.value = rawData;
    normalMapLoading.value = false; // 第一个地图加载完成
  } catch (error) {
    console.error('地图数据加载失败：', error);
    ElMessage.error('地图数据加载失败，请刷新页面重试');
    geometriesArray.value = [];
    originalGeometriesData.value = [];
    normalMapLoading.value = false;
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

// 通行交易趋势TS类型定义
interface TradeTrendRow {
  tbTradeTrendPeriod: string;
  tbTradeTrendTime: string;
  tbTradeTrendCount: number;
  tbTradeTrendAmount: number;
  tbTradeTrendPayRate: number;
  tbTradeTrendAverageDuration: number;
  tbTradeTrendId: string;
}
interface TradeTrendIndicators {
  totalCount: number; // 总笔数
  totalAmount: number; // 总金额
  payRate: number; // 支付完成率
  chainCountGrowth: number; // 环比增长
}
interface TradeTrendDetail {
  tbTradeTrendId: string;
  tbTradeTrendPeriod: string;
  tbTradeTrendTime: string;
  tbTradeTrendChainCountGrowth: number; // 环比增长笔数
  tbTradeTrendChainAmountGrowth: number; // 环比增长金额
  tbTradeTrendPeakPeriod: string; // 高峰交易时段
  tbRegionTradeContributionRate: string; // 区域贡献占比
  tradeDetail: {
    tbTradeTrendCount: number;
    tbTradeTrendAmount: number;
    tbTradeTrendPayRate: number;
    tbTradeTrendAverageDuration: number;
  };
  payMethodDistribution: ChartRatioData; // 支付方式分布
  regionDistribution: ChartRatioData; // 区域分布
}
interface TradeTrendTimeTrend {
  tbTradeTrendId: string;
  tbTradeTrendPeriod: string;
  tbTradeTrendTime: string;
  xAxis: string[];
  series: { data: number[]; name: string }[];
}

// 供需运营态势TS类型定义
interface SupplyDemandRow {
  period: string;
  tbRegionName: string;
  tbParkingCount: number;
  tbParkingSpaceTotalCount: number;
  tbParkingRecordCurrentCount: number;
  tbSupplyDemandGapCount: number;
  tbSupplyDemandBalanceRate: number;
  tbRegionId: string;
}
interface SupplyDemandIndicators {
  globalBalanceRate: number; // 全局供需平衡率
  totalGapCount: number; // 总缺口数
  peakGapCount: number; // 高峰缺口数
  hotUnbalanceRegionCount: number; // 热门失衡区域数
}
interface SupplyDemandDetail {
  tbRegionId: string;
  tbRegionName: string;
  tbSupplyDemandPeakGap: number; // 高峰供需缺口
  tbRegionHotUnbalanceName: string; // 门供需失衡区域
  tbSupplyDemandChainBalanceChange: number; // 环比平衡率变化
  tbSupplyDemandOptimizeSuggest: string; // 建议优化方向
  regionDetails: {
    tbParkingCount: number;
    tbParkingSpaceTotalCount: number;
    tbParkingRecordCurrentCount: number;
    tbSupplyDemandGapCount: number;
    tbSupplyDemandBalanceRate: number;
  };
  peakTimeDistribution: ChartLineData;
  parkingSupplyDemand: {
    name: string;
    total: number;
    current: number;
    gap: number;
    rate: number;
  }[];
}
interface SupplyDemandAnalysis {
  tbRegionId: string;
  tbRegionName: string;
  analysisTime: number | string;
  analysisContent: string;
  optimizationSuggestions: string[];
  predictedEffect: string;
}

// 停车资源分布TS类型定义
interface ParkAreaDistributionRow {
  tbRegionName: string;
  tbParkingCount: number;
  tbParkingSpaceTotalCount: number;
  tbParkingSpaceAvailableCount: number;
  sysOperationStatusName: string;
  tbRegionParkingDensity: number;
  tbRegionRegionId: string;
}

interface ParkAreaDistributionIndicators {
  totalParkCount: number; // 全域停车场总数
  totalSpaceCount: number; // 总泊位数
  availableSpaceCount: number; // 可用泊位数
  runningParkCount: number; // 运营中停车场数
}

interface ParkAreaDistributionDetail {
  tbRegionRegionId: string;
  tbRegionName: string;
  tbRegionSaturationRate: number; // 饱和率
  tbParkingNewCount: number; // 新增停车场数
  tbParkingHotName: string; // 热门停车场
  // 区域停车场清单
  regionParkingList: {
    parkingName: string;
    parkingType: string;
    totalSpaces: number;
    availableSpaces: number;
    operationStatus: string;
  }[];
  // 泊位分布明细
  spaceDistributionDetail: ChartRatioData;
  // 运营数据
  operationData: {
    avgUtilizationRate: number;
    avgTurnoverRate: number;
    peakUtilizationRate: number;
  };
}

// 新增：车辆数据类型（匹配文件1）
interface VehicleData {
  tbVehicleLicensePlate: string; // 车牌
  sysPayStatusName: '已支付' | '未支付'; // 支付状态
  tbParkingRecordEntryTime: number; // 入场时间戳
  tbParkingRecordExpectedExitTime: number; // 预计离场时间戳
  vehicleLongitude: number; // 经度
  vehicleLatitude: number; // 纬度
  lotId: string; // 停车场ID
  lotName: string; // 停车场名称
}
const geometriesArray = ref<VehicleData[]>([]);

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
const activeParkResourceDistributionView = ref('饼图');
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

// 通行交易趋势响应式数据
const tradeTrendList = ref<TradeTrendRow[]>([]);
const tradeTrendIndicators = ref<TradeTrendIndicators>({
  totalCount: 0,
  totalAmount: 0,
  payRate: 0,
  chainCountGrowth: 0,
});
const tradeTrendCountTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '交易笔数', data: [] }],
});
const tradeTrendAmountTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '交易金额', data: [] }],
});
const tradeTrendTimeCountCompare = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '交易笔数', data: [] }],
});
const tradeTrendRegionAmountCompare = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '交易金额', data: [] }],
});
const tradeTrendPayMethodRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '支付方式占比(%)', data: [] }],
});
const tradeTrendRegionTradeRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '区域交易占比(%)', data: [] }],
});
// 通行交易趋势视图切换相关
const tradeTrendChartRefreshKey = ref(0);
const activeTradeTrendView = ref('折线图');
const tradeTrendViewBtnList = ref(['卡片', '折线图', '柱状图', '饼图', '列表']);
// 通行交易趋势弹窗相关
const tradeTrendDetailDialogVisible = ref(false);
const tradeTrendTimeTrendDialogVisible = ref(false);
const activeTradeTrendDetailView = ref('明细');
const tradeTrendDetailViewBtnList = ref(['明细', '分布']);
const tradeTrendDetailSelectedRow = ref<TradeTrendDetail>({
  tbTradeTrendId: '',
  tbTradeTrendPeriod: '',
  tbTradeTrendTime: '',
  tbTradeTrendChainCountGrowth: 0,
  tbTradeTrendChainAmountGrowth: 0,
  tbTradeTrendPeakPeriod: '',
  tbRegionTradeContributionRate: '',
  tradeDetail: {
    tbTradeTrendCount: 0,
    tbTradeTrendAmount: 0,
    tbTradeTrendPayRate: 0,
    tbTradeTrendAverageDuration: 0,
  },
  payMethodDistribution: {
    legend: [],
    series: [{ name: '支付方式分布(%)', data: [] }]
  },
  regionDistribution: {
    legend: [],
    series: [{ name: '区域分布(%)', data: [] }]
  }
});
const tradeTrendTimeTrendSelectedRow = ref<TradeTrendTimeTrend>({
  tbTradeTrendId: '',
  tbTradeTrendPeriod: '',
  tbTradeTrendTime: '',
  xAxis: [],
  series: [{ name: '时段交易笔数', data: [] }]
});

// 供需运营态势响应式数据
const supplyDemandList = ref<SupplyDemandRow[]>([]);
const supplyDemandIndicators = ref<SupplyDemandIndicators>({
  globalBalanceRate: 0,
  totalGapCount: 0,
  peakGapCount: 0,
  hotUnbalanceRegionCount: 0,
});
const supplyDemandTrendData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '区域泊位数', data: [] }, { name: '在停车辆数', data: [] }]
});
const supplyDemandBalanceRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '供需平衡状态占比(%)', data: [] }],
});
const supplyDemandRegionRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '区域供需贡献占比(%)', data: [] }],
});
// 供需运营态势视图切换相关
const supplyDemandChartRefreshKey = ref(0);
const activeSupplyDemandView = ref('热力图');
const supplyDemandViewBtnList = ref(['卡片', '折线图', '热力图', '饼图', '列表']);
// 供需运营态势弹窗相关
const supplyDemandDetailDialogVisible = ref(false);
const supplyDemandAnalysisDialogVisible = ref(false);
const activeSupplyDemandDetailView = ref('区域供需明细');
const supplyDemandDetailViewBtnList = ref(['区域供需明细', '高峰时段分布', '停车场供需情况']);
const supplyDemandDetailSelectedRow = ref<SupplyDemandDetail>({
  tbRegionId: '',
  tbRegionName: '',
  tbSupplyDemandPeakGap: 0,
  tbRegionHotUnbalanceName: '',
  tbSupplyDemandChainBalanceChange: 0,
  tbSupplyDemandOptimizeSuggest: '',
  regionDetails: {
    tbParkingCount: 0,
    tbParkingSpaceTotalCount: 0,
    tbParkingRecordCurrentCount: 0,
    tbSupplyDemandGapCount: 0,
    tbSupplyDemandBalanceRate: 0,
  },
  peakTimeDistribution: {
    xAxis: [],
    series: [{ name: '时段缺口数', data: [] }]
  },
  parkingSupplyDemand: []
});
const supplyDemandAnalysisSelectedRow = ref<SupplyDemandAnalysis>({
  tbRegionId: '',
  tbRegionName: '',
  analysisTime: '',
  analysisContent: '',
  optimizationSuggestions: [],
  predictedEffect: ''
});

// 停车资源分布响应式数据
const parkAreaDistributionList = ref<ParkAreaDistributionRow[]>([]);
const parkAreaDistributionIndicators = ref<ParkAreaDistributionIndicators>({
  totalParkCount: 0,
  totalSpaceCount: 0,
  availableSpaceCount: 0,
  runningParkCount: 0,
});
const parkAreaDistributionAreaCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '停车场数量', data: [] }],
});
const parkAreaDistributionAreaSpaceCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '泊位数', data: [] }],
});
// 停车资源分布视图切换相关
const parkAreaDistributionChartRefreshKey = ref(0);
const activeParkAreaDistributionView = ref('地图'); // 默认显示地图
const parkAreaDistributionViewBtnList = ref(['地图', '列表']);
// 停车资源分布弹窗相关
const parkAreaDistributionDetailDialogVisible = ref(false);
const parkAreaDistributionDetailSelectedRow = ref<ParkAreaDistributionDetail>({
  tbRegionRegionId: '',
  tbRegionName: '',
  tbRegionSaturationRate: 0,
  tbParkingNewCount: 0,
  tbParkingHotName: '',
  regionParkingList: [],
  spaceDistributionDetail: {
    legend: [],
    series: [{ name: '泊位分布', data: [] }]
  },
  operationData: {
    avgUtilizationRate: 0,
    avgTurnoverRate: 0,
    peakUtilizationRate: 0
  }
});

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

// 通行交易趋势接口请求方法
const getTradeTrendListData = async () => {
  try {
    tradeTrendList.value = (await fetchTradeTrendList()) as TradeTrendRow[];
  } catch (error: any) {
    ElMessage.error(`通行交易趋势列表加载失败：${error.message}`);
    tradeTrendList.value = [];
  }
};
const getTradeTrendIndicatorsData = async () => {
  try {
    tradeTrendIndicators.value =
      (await fetchTradeTrendIndicators()) as TradeTrendIndicators;
  } catch (error: any) {
    ElMessage.error(`通行交易趋势核心指标加载失败：${error.message}`);
  }
};
const getTradeTrendCountTrendData = async () => {
  try {
    tradeTrendCountTrend.value =
      (await fetchTradeTrendCountTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`交易笔数趋势加载失败：${error.message}`);
  }
};
const getTradeTrendAmountTrendData = async () => {
  try {
    tradeTrendAmountTrend.value =
      (await fetchTradeTrendAmountTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`交易金额趋势加载失败：${error.message}`);
  }
};
const getTradeTrendTimeCountCompareData = async () => {
  try {
    tradeTrendTimeCountCompare.value =
      (await fetchTradeTrendTimeCountCompare()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`各时段交易笔数对比加载失败：${error.message}`);
  }
};
const getTradeTrendRegionAmountCompareData = async () => {
  try {
    tradeTrendRegionAmountCompare.value =
      (await fetchTradeTrendRegionAmountCompare()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`各区域交易金额对比加载失败：${error.message}`);
  }
};
const getTradeTrendPayMethodRatioData = async () => {
  try {
    tradeTrendPayMethodRatio.value =
      (await fetchTradeTrendPayMethodRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`支付方式占比加载失败：${error.message}`);
  }
};
const getTradeTrendRegionTradeRatioData = async () => {
  try {
    tradeTrendRegionTradeRatio.value =
      (await fetchTradeTrendRegionTradeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`区域交易占比加载失败：${error.message}`);
  }
};
const getTradeTrendDetailData = async (tradeTrendId: string) => {
  try {
    tradeTrendDetailSelectedRow.value = {
      ...tradeTrendDetailSelectedRow.value,
      ...(await fetchTradeTrendDetail(tradeTrendId)),
    };
  } catch (error: any) {
    ElMessage.warning(`通行交易趋势详情加载失败：${error.message}`);
  }
};
const getTradeTrendTimeTrendData = async (tradeTrendId: string) => {
  try {
    tradeTrendTimeTrendSelectedRow.value = {
      ...tradeTrendTimeTrendSelectedRow.value,
      ...(await fetchTradeTrendTimeTrend(tradeTrendId)),
    };
  } catch (error: any) {
    ElMessage.warning(`时段级趋势数据加载失败：${error.message}`);
  }
};

// 供需运营态势接口请求方法
const getSupplyDemandListData = async () => {
  try {
    supplyDemandList.value = (await fetchSupplyDemandList()) as SupplyDemandRow[];
  } catch (error: any) {
    ElMessage.error(`供需运营态势列表加载失败：${error.message}`);
    supplyDemandList.value = [];
  }
};
const getSupplyDemandIndicatorsData = async () => {
  try {
    supplyDemandIndicators.value =
      (await fetchSupplyDemandIndicators()) as SupplyDemandIndicators;
  } catch (error: any) {
    ElMessage.error(`供需运营态势核心指标加载失败：${error.message}`);
  }
};
const getSupplyDemandTrendData = async () => {
  try {
    supplyDemandTrendData.value =
      (await fetchSupplyDemandTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`供需趋势对比加载失败：${error.message}`);
  }
};
const getSupplyDemandBalanceRatioData = async () => {
  try {
    supplyDemandBalanceRatioData.value =
      (await fetchSupplyDemandBalanceRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`供需平衡状态占比加载失败：${error.message}`);
  }
};
const getSupplyDemandRegionRatioData = async () => {
  try {
    supplyDemandRegionRatioData.value =
      (await fetchSupplyDemandRegionRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`区域供需贡献占比加载失败：${error.message}`);
  }
};
const getSupplyDemandDetailData = async (regionId: string) => {
  try {
    supplyDemandDetailSelectedRow.value = {
      ...supplyDemandDetailSelectedRow.value,
      ...(await fetchSupplyDemandDetail(regionId)),
    };
  } catch (error: any) {
    ElMessage.warning(`供需运营态势详情加载失败：${error.message}`);
  }
};
const getSupplyDemandAnalysisData = async (regionId: string) => {
  try {
    supplyDemandAnalysisSelectedRow.value = {
      ...supplyDemandAnalysisSelectedRow.value,
      ...(await fetchSupplyDemandAnalysis(regionId)),
    };
  } catch (error: any) {
    ElMessage.warning(`供需分析报告加载失败：${error.message}`);
  }
};

// 停车资源分布接口请求方法
const getParkAreaDistributionListData = async () => {
  try {
    parkAreaDistributionList.value = (await fetchParkAreaDistributionList()) as ParkAreaDistributionRow[];
  } catch (error: any) {
    ElMessage.error(`停车资源分布列表加载失败：${error.message}`);
    parkAreaDistributionList.value = [];
  }
};

const getParkAreaDistributionIndicatorsData = async () => {
  try {
    parkAreaDistributionIndicators.value =
      (await fetchParkAreaDistributionIndicators()) as ParkAreaDistributionIndicators;
  } catch (error: any) {
    ElMessage.error(`停车资源分布核心指标加载失败：${error.message}`);
  }
};

const getParkAreaDistributionAreaCountData = async () => {
  try {
    parkAreaDistributionAreaCountData.value =
      (await fetchParkAreaDistributionAreaCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`各区域停车场数量加载失败：${error.message}`);
  }
};

const getParkAreaDistributionAreaSpaceCountData = async () => {
  try {
    parkAreaDistributionAreaSpaceCountData.value =
      (await fetchParkAreaDistributionAreaSpaceCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`各区域泊位数加载失败：${error.message}`);
  }
};

const getParkAreaDistributionDetailData = async (regionId: string) => {
  try {
    parkAreaDistributionDetailSelectedRow.value = {
      ...parkAreaDistributionDetailSelectedRow.value,
      ...(await fetchParkAreaDistributionDetail(regionId)),
    };
  } catch (error: any) {
    ElMessage.warning(`停车资源分布详情加载失败：${error.message}`);
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

// 通行交易趋势视图切换
const changeTradeTrendView = (viewName: string) => {
  activeTradeTrendView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '折线图' || viewName === '柱状图' || viewName === '饼图') &&
  nextTick(() => tradeTrendChartRefreshKey.value++);
};
const changeTradeTrendDetailView = (viewName: string) => {
  activeTradeTrendDetailView.value = viewName;
};
// 通行交易趋势弹窗方法
const openTradeTrendDetailDialog = async (row: TradeTrendRow) => {
  await getTradeTrendDetailData(row.tbTradeTrendId);
  tradeTrendDetailDialogVisible.value = true;
};
const closeTradeTrendDetailDialog = () => {
  tradeTrendDetailDialogVisible.value = false;
  tradeTrendDetailSelectedRow.value = {
    tbTradeTrendId: '',
    tbTradeTrendPeriod: '',
    tbTradeTrendTime: '',
    tbTradeTrendChainCountGrowth: 0,
    tbTradeTrendChainAmountGrowth: 0,
    tbTradeTrendPeakPeriod: '',
    tbRegionTradeContributionRate: '',
    tradeDetail: {
      tbTradeTrendCount: 0,
      tbTradeTrendAmount: 0,
      tbTradeTrendPayRate: 0,
      tbTradeTrendAverageDuration: 0,
    },
    payMethodDistribution: {
      legend: [],
      series: [{ name: '支付方式分布(%)', data: [] }]
    },
    regionDistribution: {
      legend: [],
      series: [{ name: '区域分布(%)', data: [] }]
    }
  };
  activeTradeTrendDetailView.value = '明细';
};
const openTradeTrendTimeTrendDialog = async (row: TradeTrendRow) => {
  await getTradeTrendTimeTrendData(row.tbTradeTrendId);
  tradeTrendTimeTrendDialogVisible.value = true;
};
const closeTradeTrendTimeTrendDialog = () => {
  tradeTrendTimeTrendDialogVisible.value = false;
  tradeTrendTimeTrendSelectedRow.value = {
    tbTradeTrendId: '',
    tbTradeTrendPeriod: '',
    tbTradeTrendTime: '',
    xAxis: [],
    series: [{ name: '时段交易笔数', data: [] }]
  };
};
// 通行交易趋势数据刷新
const refreshTradeTrendData = async () => {
  await Promise.all([
    getTradeTrendListData(),
    getTradeTrendIndicatorsData(),
    getTradeTrendCountTrendData(),
    getTradeTrendAmountTrendData(),
    getTradeTrendTimeCountCompareData(),
    getTradeTrendRegionAmountCompareData(),
    getTradeTrendPayMethodRatioData(),
    getTradeTrendRegionTradeRatioData(),
  ]);
  tradeTrendChartRefreshKey.value++;
  ElMessage.success('通行交易趋势数据刷新成功');
};

// 供需运营态势视图切换
const changeSupplyDemandView = (viewName: string) => {
  activeSupplyDemandView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '折线图' || viewName === '热力图' || viewName === '饼图') &&
  nextTick(() => supplyDemandChartRefreshKey.value++);
};
const changeSupplyDemandDetailView = (viewName: string) => {
  activeSupplyDemandDetailView.value = viewName;
};
// 供需运营态势弹窗方法
const openSupplyDemandDetailDialog = async (row: SupplyDemandRow) => {
  await getSupplyDemandDetailData(row.tbRegionId);
  supplyDemandDetailDialogVisible.value = true;
};
const closeSupplyDemandDetailDialog = () => {
  supplyDemandDetailDialogVisible.value = false;
  supplyDemandDetailSelectedRow.value = {
    tbRegionId: '',
    tbRegionName: '',
    tbSupplyDemandPeakGap: 0,
    tbRegionHotUnbalanceName: '',
    tbSupplyDemandChainBalanceChange: 0,
    tbSupplyDemandOptimizeSuggest: '',
    regionDetails: {
      tbParkingCount: 0,
      tbParkingSpaceTotalCount: 0,
      tbParkingRecordCurrentCount: 0,
      tbSupplyDemandGapCount: 0,
      tbSupplyDemandBalanceRate: 0,
    },
    peakTimeDistribution: {
      xAxis: [],
      series: [{ name: '时段缺口数', data: [] }]
    },
    parkingSupplyDemand: []
  };
  activeSupplyDemandDetailView.value = '区域供需明细';
};
const openSupplyDemandAnalysisDialog = async (row: SupplyDemandRow) => {
  await getSupplyDemandAnalysisData(row.tbRegionId);
  supplyDemandAnalysisDialogVisible.value = true;
};
const closeSupplyDemandAnalysisDialog = () => {
  supplyDemandAnalysisDialogVisible.value = false;
  supplyDemandAnalysisSelectedRow.value = {
    tbRegionId: '',
    tbRegionName: '',
    analysisTime: '',
    analysisContent: '',
    optimizationSuggestions: [],
    predictedEffect: ''
  };
};
// 导出分析报告为PDF
const exportAnalysisReport = async () => {
  try {
    const result = await exportSupplyDemandAnalysisReport(supplyDemandAnalysisSelectedRow.value.tbRegionId);
    if (result.success) {
      tipDialogContent.value = result.message;
      tipDialogVisible.value = true;
      // 关闭分析弹窗
      supplyDemandAnalysisDialogVisible.value = false;
    } else {
      tipDialogContent.value = result.message || '导出失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `导出失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};
// 供需运营态势数据刷新
const refreshSupplyDemandData = async () => {
  await Promise.all([
    getSupplyDemandListData(),
    getSupplyDemandIndicatorsData(),
    getSupplyDemandTrendData(),
    getSupplyDemandBalanceRatioData(),
    getSupplyDemandRegionRatioData(),
  ]);
  supplyDemandChartRefreshKey.value++;
  ElMessage.success('供需运营态势数据刷新成功');
};

// 停车资源分布视图切换
const changeParkAreaDistributionView = (viewName: string) => {
  activeParkAreaDistributionView.value = viewName;
  nextTick(() => parkAreaDistributionChartRefreshKey.value++);
};

// 停车资源分布弹窗方法
const openParkAreaDistributionDetailDialog = async (row: ParkAreaDistributionRow) => {
  await getParkAreaDistributionDetailData(row.tbRegionRegionId);
  parkAreaDistributionDetailDialogVisible.value = true;
};

const closeParkAreaDistributionDetailDialog = () => {
  parkAreaDistributionDetailDialogVisible.value = false;
  parkAreaDistributionDetailSelectedRow.value = {
    tbRegionRegionId: '',
    tbRegionName: '',
    tbRegionSaturationRate: 0,
    tbParkingNewCount: 0,
    tbParkingHotName: '',
    regionParkingList: [],
    spaceDistributionDetail: {
      legend: [],
      series: [{ name: '泊位分布', data: [] }]
    },
    operationData: {
      avgUtilizationRate: 0,
      avgTurnoverRate: 0,
      peakUtilizationRate: 0
    }
  };
};

// 停车资源分布数据刷新
const refreshParkAreaDistributionData = async () => {
  await Promise.all([
    getParkAreaDistributionListData(),
    getParkAreaDistributionIndicatorsData(),
    getParkAreaDistributionAreaCountData(),
    getParkAreaDistributionAreaSpaceCountData(),
  ]);
  parkAreaDistributionChartRefreshKey.value++;
  ElMessage.success('停车资源分布数据刷新成功');
};

// 查看热门停车场（跳转至停车场详情）
const viewHotParking = () => {
  // 这里可以跳转到停车场详情弹窗，根据需求实现
  ElMessage.info('跳转至停车场详情功能待实现');
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
    getTradeTrendListData(),
    getTradeTrendIndicatorsData(),
    getTradeTrendCountTrendData(),
    getTradeTrendAmountTrendData(),
    getTradeTrendTimeCountCompareData(),
    getTradeTrendRegionAmountCompareData(),
    getTradeTrendPayMethodRatioData(),
    getTradeTrendRegionTradeRatioData(),
    getSupplyDemandListData(),
    getSupplyDemandIndicatorsData(),
    getSupplyDemandTrendData(),
    getSupplyDemandBalanceRatioData(),
    getSupplyDemandRegionRatioData(),
    getParkAreaDistributionListData(),
    getParkAreaDistributionIndicatorsData(),
    getParkAreaDistributionAreaCountData(),
    getParkAreaDistributionAreaSpaceCountData(),
  ]);
  setTimeout(() => {
    parkResourceDistributionChartRefreshKey.value++;
    parkingSpaceChartRefreshKey.value++;
    tradeTrendChartRefreshKey.value++;
    supplyDemandChartRefreshKey.value++;
    parkAreaDistributionChartRefreshKey.value++;
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
          <el-tabs v-model="topLeftActiveTab" class="common-tabs" @tab-change="handleTabChange">
            <el-tab-pane label="资源设备指标" name="tab1">
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
            <el-tab-pane label="通行交易指标" name="tab2">
              <div class="content-placeholder"><p>通行交易</p></div>
            </el-tab-pane>
            <el-tab-pane label="运维服务指标" name="tab3">
              <div class="content-placeholder"><p>运维服务</p></div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel top-middle" ref="topMiddle">
          <el-tabs v-model="topMiddleActiveTab" class="common-tabs" @tab-change="handleTabChange">
            <el-tab-pane label="在停车辆实时监控" name="tab1">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <button class="control-btn" @click="handleOrbitAnimation">
                    <el-icon color="#409eff" size="16">
                      <VideoPause v-if="normalMapRef?.orbitStatus?.playing" />
                      <VideoPlay v-else />
                    </el-icon>
                  </button>
                  <button
                    class="control-btn"
                    @click="orbitConfigDialogVisible = true"
                  >
                    <el-icon color="#409eff" size="16"><Setting /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('topMiddle')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <!-- 地图组件 -->
              <div style="flex: 1; width: 100%; height: calc(100% - 2vh)">
                <GlobalNormalMap
                  v-if="!normalMapLoading && topMiddleActiveTab === 'tab1'"
                  ref="normalMapRef"
                  id-name="parkingMap_normal"
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
            <el-tab-pane label="停车资源分布" name="tab2">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in parkAreaDistributionViewBtnList"
                      :key="item"
                      :type="activeParkAreaDistributionView === item ? 'primary' : ''"
                      plain
                      @click="changeParkAreaDistributionView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <el-icon color="#409eff" size="16" @click="refreshParkAreaDistributionData"><Refresh /></el-icon>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('topMiddle')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <!-- 地图视图 -->
              <div v-if="activeParkAreaDistributionView === '地图'" class="view-content">
                <!-- 卡片叠加层 -->
                <div class="stats-overlay1">
                  <div class="stats-cards1">
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">全域停车场总数</div>
                        <div class="stat-value">{{ parkAreaDistributionIndicators.totalParkCount || 0 }} 个</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">总泊位数</div>
                        <div class="stat-value">{{ parkAreaDistributionIndicators.totalSpaceCount || 0 }} 个</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">可用泊位数</div>
                        <div class="stat-value">{{ parkAreaDistributionIndicators.availableSpaceCount || 0 }} 个</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">运营中停车场数</div>
                        <div class="stat-value">{{ parkAreaDistributionIndicators.runningParkCount || 0 }} 个</div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 地图 -->
                <div style="width: 100%; height: 100%;" v-if="!heatmapLoading && topMiddleActiveTab === 'tab2'">
                  <GlobalHeatmapMap
                    ref="heatmapMapRef"
                    id="parkingMap_heat"
                    :orbit-config="orbitConfigData"
                  />
                </div>
                <!-- 柱状图叠加层 -->
                <div class="chart-overlay1">
                  <div class="chart-cards1">
                    <div class="chart-card">
                      <VerticalBar2
                        :x-axis="parkAreaDistributionAreaCountData.xAxis"
                        :series="parkAreaDistributionAreaCountData.series"
                        unit="个"
                        title="各区域停车场数量对比"
                        :key="parkAreaDistributionChartRefreshKey"
                        style="width:100%;height:100%"
                      />
                    </div>
                    <div class="chart-card">
                      <VerticalBar1
                        :x-axis="parkAreaDistributionAreaSpaceCountData.xAxis"
                        :series="parkAreaDistributionAreaSpaceCountData.series"
                        unit="个"
                        title="各区域泊位数对比"
                        :key="parkAreaDistributionChartRefreshKey"
                        style="width:100%;height:100%"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 列表视图 -->
              <div v-if="activeParkAreaDistributionView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="parkAreaDistributionList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openParkAreaDistributionDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="tbRegionName"
                      label="区域名称"
                      align="center"
                    />
                    <ElTableColumn
                      prop="tbParkingCount"
                      label="停车场总数"
                      align="center"
                    />
                    <ElTableColumn
                      prop="tbParkingSpaceTotalCount"
                      label="总泊位数"
                      align="center"
                    >
                      <template #default="scope">
                        {{ formatNumber(scope.row.tbParkingSpaceTotalCount) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbParkingSpaceAvailableCount"
                      label="可用泊位数"
                      align="center"
                    >
                      <template #default="scope">
                        {{ formatNumber(scope.row.tbParkingSpaceAvailableCount) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="sysOperationStatusName"
                      label="运营状态"
                      align="center"
                    >
                      <template #default="scope">
                        <ElTag :type="scope.row.sysOperationStatusName === '运营良好' ? 'success' : 'warning'">
                          {{ scope.row.sysOperationStatusName || '-' }}
                        </ElTag>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbRegionParkingDensity"
                      label="覆盖密度"
                      align="center"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbRegionParkingDensity) }}
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel top-right" ref="parkingSpacePanelRef">
          <el-tabs v-model="topRightActiveTab" class="common-tabs" @tab-change="handleTabChange">
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
                  <div class="indicator-cards4">
                    <div class="indicator-card4 card1">
                      <div class="indicator-title">总泊位数</div>
                      <div class="indicator-value">
                        <span class="number-animate">{{ parkingSpaceIndicators.totalSpaceCount }}</span>
                      </div>
                      <div class="indicator-unit">个</div>
                    </div>
                    <div class="indicator-card4 card2">
                      <div class="indicator-title">空闲数</div>
                      <div class="indicator-value">
                        <span class="number-animate">{{ parkingSpaceIndicators.availableSpaceCount }}</span>
                      </div>
                      <div class="indicator-unit">个</div>
                    </div>
                    <div class="indicator-card4 card3">
                      <div class="indicator-title">占用数</div>
                      <div class="indicator-value">
                        <span class="number-animate">{{ parkingSpaceIndicators.occupiedSpaceCount }}</span>
                      </div>
                      <div class="indicator-unit">个</div>
                    </div>
                    <div class="indicator-card4 card4">
                      <div class="indicator-title">故障数</div>
                      <div class="indicator-value">
                        <span class="number-animate">{{ parkingSpaceIndicators.faultSpaceCount }}</span>
                      </div>
                      <div class="indicator-unit">个</div>
                    </div>
                    <div class="indicator-card4 card5">
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
        <div class="panel bottom-left" ref="tradeTrendPanelRef">
          <el-tabs v-model="bottomLeftActiveTab" class="common-tabs" @tab-change="handleTabChange">
            <el-tab-pane label="通行交易趋势" name="tab1">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in tradeTrendViewBtnList"
                      :key="item"
                      :type="activeTradeTrendView === item ? 'primary' : ''"
                      plain
                      @click="changeTradeTrendView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <el-icon color="#409eff" size="16" @click="refreshTradeTrendData"><Refresh /></el-icon>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('tradeTrendPanelRef')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <!-- 卡片视图 -->
              <div v-if="activeTradeTrendView === '卡片'" class="view-content">
                <div class="indicator-cards3">
                  <div class="indicator-card3 card1">
                    <div class="indicator-title">总笔数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ tradeTrendIndicators.totalCount }}</span>
                    </div>
                    <div class="indicator-unit">笔</div>
                  </div>
                  <div class="indicator-card3 card2">
                    <div class="indicator-title">总金额</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatNumber(tradeTrendIndicators.totalAmount) }}</span>
                    </div>
                    <div class="indicator-unit">元</div>
                  </div>
                  <div class="indicator-card3 card3">
                    <div class="indicator-title">支付完成率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(tradeTrendIndicators.payRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card4">
                    <div class="indicator-title">环比增长</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(tradeTrendIndicators.chainCountGrowth) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                </div>
              </div>
              <!-- 折线图视图 -->
              <div v-if="activeTradeTrendView === '折线图'" class="view-content">
                <div
                  style="
            display: inline-block;
            width: 49%;
            height: 100%;
            vertical-align: top;
          "
                >
                  <ChartLine1
                    :data="tradeTrendCountTrend"
                    title="交易笔数趋势"
                    :key="tradeTrendChartRefreshKey"
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
                  <ChartLine2
                    :data="tradeTrendAmountTrend"
                    title="交易金额趋势"
                    :key="tradeTrendChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 柱状图视图 -->
              <div v-if="activeTradeTrendView === '柱状图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <VerticalBar3
                    :x-axis="tradeTrendTimeCountCompare.xAxis"
                    :series="tradeTrendTimeCountCompare.series"
                    unit="笔"
                    title="各时段交易笔数对比"
                    :key="tradeTrendChartRefreshKey"
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
                    :x-axis="tradeTrendRegionAmountCompare.xAxis"
                    :series="tradeTrendRegionAmountCompare.series"
                    unit="元"
                    title="各区域交易金额对比"
                    :key="tradeTrendChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 饼图视图 -->
              <div v-if="activeTradeTrendView === '饼图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartPie1
                    :data="tradeTrendPayMethodRatio"
                    title="支付方式占比"
                    :key="tradeTrendChartRefreshKey"
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
                    :data="tradeTrendRegionTradeRatio"
                    title="区域交易占比"
                    :key="tradeTrendChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 列表视图 -->
              <div v-if="activeTradeTrendView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="tradeTrendList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openTradeTrendDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="tbTradeTrendPeriod"
                      label="统计周期"
                      align="center"
                      min-width="80"
                    >
                      <template #default="scope">
          <span
            v-if="scope.row.tbTradeTrendPeriod === '日'"
            style="color:#409eff;cursor:pointer;text-decoration: underline;"
            @click.stop="openTradeTrendTimeTrendDialog(scope.row)"
          >
            {{ scope.row.tbTradeTrendPeriod }}
          </span>
                        <span v-else>
            {{ scope.row.tbTradeTrendPeriod }}
          </span>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbTradeTrendTime"
                      label="日期/时段"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="tbTradeTrendCount"
                      label="交易笔数"
                      align="center"
                      width="100"
                    />
                    <ElTableColumn
                      prop="tbTradeTrendAmount"
                      label="交易金额"
                      align="center"
                      width="100"
                    >
                      <template #default="scope">
                        {{ formatNumber(scope.row.tbTradeTrendAmount) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbTradeTrendPayRate"
                      label="支付完成率(%)"
                      align="center"
                      width="120"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbTradeTrendPayRate) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbTradeTrendAverageDuration"
                      label="平均停车时长"
                      align="center"
                      width="120"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbTradeTrendAverageDuration) }}
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="设备运维趋势" name="tab2">
              <div class="content-placeholder"><p>设备运维趋势</p></div>
            </el-tab-pane>
          </el-tabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-middle" ref="parkResourcePanelRef">
          <el-tabs v-model="bottomMiddleActiveTab" class="common-tabs" @tab-change="handleTabChange">
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
        <div class="panel bottom-right" ref="bottomRight">
          <el-tabs v-model="bottomRightActiveTab" class="common-tabs" @tab-change="handleTabChange">
            <el-tab-pane label="供需运营态势" name="tab1">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in supplyDemandViewBtnList"
                      :key="item"
                      :type="activeSupplyDemandView === item ? 'primary' : ''"
                      plain
                      @click="changeSupplyDemandView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <el-icon color="#409eff" size="16" @click="refreshSupplyDemandData"><Refresh /></el-icon>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('bottomRight')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <!-- 卡片视图 -->
              <div v-if="activeSupplyDemandView === '卡片'" class="view-content">
                <div class="indicator-cards3">
                  <div class="indicator-card3 card1">
                    <div class="indicator-title">全局供需平衡率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(supplyDemandIndicators.globalBalanceRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card3 card2">
                    <div class="indicator-title">总缺口数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ supplyDemandIndicators.totalGapCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card3">
                    <div class="indicator-title">高峰缺口数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ supplyDemandIndicators.peakGapCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card3 card4">
                    <div class="indicator-title">热门失衡区域数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ supplyDemandIndicators.hotUnbalanceRegionCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                </div>
              </div>
              <!-- 折线图视图 -->
              <div v-if="activeSupplyDemandView === '折线图'" class="view-content">
                <ChartLine1
                  :data="supplyDemandTrendData"
                  title="区域泊位数与在停车辆数趋势对比"
                  :key="supplyDemandChartRefreshKey"
                />
              </div>
              <!-- 热力图视图 -->
              <div v-if="activeSupplyDemandView === '热力图'" class="view-content">
                <div style="width: 100%; height: 100%; box-sizing: border-box;">
                  <Heatmap1 :key="supplyDemandChartRefreshKey" />
                </div>
              </div>
              <!-- 饼图视图 -->
              <div v-if="activeSupplyDemandView === '饼图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartPie1
                    :data="supplyDemandBalanceRatioData"
                    title="供需平衡状态占比"
                    :key="supplyDemandChartRefreshKey"
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
                    :data="supplyDemandRegionRatioData"
                    title="区域供需贡献占比"
                    :key="supplyDemandChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 列表视图 -->
              <div v-if="activeSupplyDemandView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="supplyDemandList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openSupplyDemandDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="period"
                      label="统计周期"
                      align="center"
                      width="100"
                    />
                    <ElTableColumn
                      prop="tbRegionName"
                      label="区域名称"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="tbParkingCount"
                      label="停车场总数"
                      align="center"
                      width="100"
                    />
                    <ElTableColumn
                      prop="tbParkingSpaceTotalCount"
                      label="泊位数"
                      align="center"
                      width="100"
                    />
                    <ElTableColumn
                      prop="tbParkingRecordCurrentCount"
                      label="在停车辆数"
                      align="center"
                      width="100"
                    />
                    <ElTableColumn
                      prop="tbSupplyDemandGapCount"
                      label="需求缺口数"
                      align="center"
                      width="100"
                    >
                      <template #default="scope">
                        <span :style="{ color: scope.row.tbSupplyDemandGapCount >= 0 ? '#67c23a' : '#f56c6c' }">
                          {{ scope.row.tbSupplyDemandGapCount }}
                        </span>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbSupplyDemandBalanceRate"
                      label="供需平衡率(%)"
                      align="center"
                      width="120"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbSupplyDemandBalanceRate) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      label="操作"
                      align="center"
                      width="120"
                      fixed="right"
                    >
                      <template #default="scope">
                        <ElButton
                          type="primary"
                          size="small"
                          plain
                          @click.stop="openSupplyDemandAnalysisDialog(scope.row)"
                        >
                          分析
                        </ElButton>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
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

      <!-- 通行交易趋势详情弹窗 -->
      <ElDialog
        v-model="tradeTrendDetailDialogVisible"
        width="50%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="通行交易趋势详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in tradeTrendDetailViewBtnList"
                :key="item"
                :type="activeTradeTrendDetailView === item ? 'primary' : ''"
                plain
                @click="changeTradeTrendDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <!-- 明细视图 -->
        <div v-if="activeTradeTrendDetailView === '明细'" class="view-content" style="padding:0;">
          <ElDescriptions bordered :column="2" class="desc-detail">
            <ElDescriptionsItem label="统计周期" span="2">
              {{ tradeTrendDetailSelectedRow.tbTradeTrendPeriod || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="日期/时段" span="2">
              {{ tradeTrendDetailSelectedRow.tbTradeTrendTime || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="环比增长笔数(%)">
              {{ formatDecimal(tradeTrendDetailSelectedRow.tbTradeTrendChainCountGrowth) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="环比增长金额(%)">
              {{ formatDecimal(tradeTrendDetailSelectedRow.tbTradeTrendChainAmountGrowth) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="高峰交易时段">
              {{ tradeTrendDetailSelectedRow.tbTradeTrendPeakPeriod || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="区域贡献占比">
              {{ tradeTrendDetailSelectedRow.tbRegionTradeContributionRate || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="交易笔数" span="2">
              {{ tradeTrendDetailSelectedRow.tradeDetail.tbTradeTrendCount || 0 }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="交易金额" span="2">
              {{ formatNumber(tradeTrendDetailSelectedRow.tradeDetail.tbTradeTrendAmount) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="支付完成率(%)" span="2">
              {{ formatDecimal(tradeTrendDetailSelectedRow.tradeDetail.tbTradeTrendPayRate) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="平均停车时长" span="2">
              {{ formatDecimal(tradeTrendDetailSelectedRow.tradeDetail.tbTradeTrendAverageDuration) }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>
        <!-- 分布视图 -->
        <div v-if="activeTradeTrendDetailView === '分布'" class="view-content" style="padding:0; display: flex; gap: 0.6vw;">
          <div style="flex: 1;">
            <ChartPie5
              :data="tradeTrendDetailSelectedRow.payMethodDistribution"
              title="支付方式分布"
              :key="tradeTrendChartRefreshKey"
            />
          </div>
          <div style="flex: 1;">
            <ChartPie5
              :data="tradeTrendDetailSelectedRow.regionDistribution"
              title="区域分布"
              :key="tradeTrendChartRefreshKey"
            />
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeTradeTrendDetailDialog">关闭</ElButton>
        </template>
      </ElDialog>
      <!-- 时段级趋势数据弹窗 -->
      <ElDialog
        v-model="tradeTrendTimeTrendDialogVisible"
        width="40%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
      >
        <template #title>
          <span>{{ tradeTrendTimeTrendSelectedRow.tbTradeTrendTime }} - 时段交易笔数趋势</span>
        </template>
        <div class="view-content" style="padding:0;height:400px;">
          <ChartLine3
            :data="tradeTrendTimeTrendSelectedRow"
            title="时段交易笔数趋势"
            :key="tradeTrendChartRefreshKey"
          />
        </div>
        <template #footer>
          <ElButton plain @click="closeTradeTrendTimeTrendDialog">关闭</ElButton>
        </template>
      </ElDialog>

      <!-- 供需运营态势详情弹窗 -->
      <ElDialog
        v-model="supplyDemandDetailDialogVisible"
        width="50%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="供需运营态势详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in supplyDemandDetailViewBtnList"
                :key="item"
                :type="activeSupplyDemandDetailView === item ? 'primary' : ''"
                plain
                @click="changeSupplyDemandDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <!-- 区域供需明细视图 -->
        <div v-if="activeSupplyDemandDetailView === '区域供需明细'" class="view-content" style="padding:0;">
          <ElDescriptions bordered :column="2" class="desc-detail">
            <ElDescriptionsItem label="区域ID" span="2">
              {{ supplyDemandDetailSelectedRow.tbRegionId || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="区域名称" span="2">
              {{ supplyDemandDetailSelectedRow.tbRegionName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="高峰供需缺口">
              {{ supplyDemandDetailSelectedRow.tbSupplyDemandPeakGap }} 个
            </ElDescriptionsItem>
            <ElDescriptionsItem label="门供需失衡区域">
              {{ supplyDemandDetailSelectedRow.tbRegionHotUnbalanceName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="环比平衡率变化(%)">
              {{ formatDecimal(supplyDemandDetailSelectedRow.tbSupplyDemandChainBalanceChange) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="建议优化方向" span="2">
              {{ supplyDemandDetailSelectedRow.tbSupplyDemandOptimizeSuggest || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="停车场总数">
              {{ supplyDemandDetailSelectedRow.regionDetails.tbParkingCount || 0 }} 个
            </ElDescriptionsItem>
            <ElDescriptionsItem label="总泊位数">
              {{ supplyDemandDetailSelectedRow.regionDetails.tbParkingSpaceTotalCount || 0 }} 个
            </ElDescriptionsItem>
            <ElDescriptionsItem label="在停车辆数">
              {{ supplyDemandDetailSelectedRow.regionDetails.tbParkingRecordCurrentCount || 0 }} 辆
            </ElDescriptionsItem>
            <ElDescriptionsItem label="需求缺口数">
        <span :style="{ color: supplyDemandDetailSelectedRow.regionDetails.tbSupplyDemandGapCount >= 0 ? '#67c23a' : '#f56c6c' }">
          {{ supplyDemandDetailSelectedRow.regionDetails.tbSupplyDemandGapCount || 0 }} 个
        </span>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="供需平衡率(%)">
              {{ formatDecimal(supplyDemandDetailSelectedRow.regionDetails.tbSupplyDemandBalanceRate) }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>
        <!-- 高峰时段分布视图 -->
        <div v-if="activeSupplyDemandDetailView === '高峰时段分布'" class="view-content" style="padding:0;">
          <ChartLine3
            :data="supplyDemandDetailSelectedRow.peakTimeDistribution"
            title="高峰时段供需缺口分布"
            :key="supplyDemandChartRefreshKey"
          />
        </div>
        <!-- 停车场供需情况视图 -->
        <div v-if="activeSupplyDemandDetailView === '停车场供需情况'" class="view-content" style="padding:0;">
          <ElTable
            :data="supplyDemandDetailSelectedRow.parkingSupplyDemand"
            border
            size="small"
            width="100%"
            height="100%"
            table-layout="fixed"
          >
            <ElTableColumn
              prop="name"
              label="停车场名称"
              align="center"
              min-width="120"
            />
            <ElTableColumn
              prop="total"
              label="总泊位数"
              align="center"
            />
            <ElTableColumn
              prop="current"
              label="在停车辆数"
              align="center"
            />
            <ElTableColumn
              prop="gap"
              label="缺口数"
              align="center"
            >
              <template #default="scope">
          <span :style="{ color: scope.row.gap >= 0 ? '#67c23a' : '#f56c6c' }">
            {{ scope.row.gap }}
          </span>
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="rate"
              label="使用率(%)"
              align="center"
            >
              <template #default="scope">
                {{ formatDecimal(scope.row.rate) }}
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
        <template #footer>
          <ElButton plain @click="closeSupplyDemandDetailDialog">关闭</ElButton>
        </template>
      </ElDialog>
      <!-- 供需分析报告弹窗 -->
      <ElDialog
        v-model="supplyDemandAnalysisDialogVisible"
        width="50%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="区域供需优化分析报告"
      >
        <div class="view-content" style="padding:0;">
          <ElDescriptions bordered :column="1" class="desc-detail">
            <ElDescriptionsItem label="区域名称">
              {{ supplyDemandAnalysisSelectedRow.tbRegionName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="分析时间">
              {{ formatTimeStamp(supplyDemandAnalysisSelectedRow.analysisTime) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="分析内容" span="1">
              <div style="white-space: pre-wrap; max-height: 200px; overflow-y: auto;">
                {{ supplyDemandAnalysisSelectedRow.analysisContent || '-' }}
              </div>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="优化建议" span="1">
              <ul style="margin: 0; padding-left: 20px;">
                <li v-for="(suggestion, index) in supplyDemandAnalysisSelectedRow.optimizationSuggestions" :key="index">
                  {{ suggestion }}
                </li>
              </ul>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="预期效果">
              {{ supplyDemandAnalysisSelectedRow.predictedEffect || '-' }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>

        <template #footer>
          <ElButton plain @click="closeSupplyDemandAnalysisDialog">关闭</ElButton>
          <ElButton type="primary" @click="exportAnalysisReport">导出报告</ElButton>
        </template>
      </ElDialog>

      <!-- 区域停车资源分布详情弹窗 -->
      <ElDialog
        v-model="parkAreaDistributionDetailDialogVisible"
        width="60%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="区域停车资源详情"
      >
        <div class="view-content" style="display: flex; padding:0;">
          <div style="display: flex; flex-direction: column; gap: 20px; flex: 1;">
            <div style="flex: 1;">
              <ChartPie5
                :data="parkAreaDistributionDetailSelectedRow.spaceDistributionDetail"
                title="泊位分布"
                :key="parkAreaDistributionChartRefreshKey"
              />
            </div>
            <div style="flex: 1;">
              <ElDescriptions bordered :column="2" class="desc-detail">
                <ElDescriptionsItem label="区域ID" span="2">
                  {{ parkAreaDistributionDetailSelectedRow.tbRegionRegionId || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="区域名称">
                  {{ parkAreaDistributionDetailSelectedRow.tbRegionName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="饱和率(%)">
                  {{ formatDecimal(parkAreaDistributionDetailSelectedRow.tbRegionSaturationRate) }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="新增停车场数">
                  {{ parkAreaDistributionDetailSelectedRow.tbParkingNewCount || 0 }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="热门停车场">
              <span @click="viewHotParking" style="color:#409eff;cursor:pointer;">
                {{ parkAreaDistributionDetailSelectedRow.tbParkingHotName || '-' }}
                <i class="el-icon-arrow-right" style="font-size:12px;"></i>
              </span>
                </ElDescriptionsItem>
                <ElDescriptionsItem label="平均使用率(%)">
                  {{ formatDecimal(parkAreaDistributionDetailSelectedRow.operationData.avgUtilizationRate) }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="平均周转率">
                  {{ formatDecimal(parkAreaDistributionDetailSelectedRow.operationData.avgTurnoverRate) }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="高峰时段使用率(%)">
                  {{ formatDecimal(parkAreaDistributionDetailSelectedRow.operationData.peakUtilizationRate) }}
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
          </div>
          <div style="flex: 1;">
            <ElTable
              :data="parkAreaDistributionDetailSelectedRow.regionParkingList"
              border
              size="small"
              width="100%"
              table-layout="fixed"
              style="margin-bottom: 20px;"
            >
              <ElTableColumn
                prop="parkingName"
                label="停车场名称"
                align="center"
                min-width="150"
              />
              <ElTableColumn
                prop="parkingType"
                label="停车场类型"
                align="center"
                width="120"
              />
              <ElTableColumn
                prop="totalSpaces"
                label="总泊位数"
                align="center"
                width="100"
              />
              <ElTableColumn
                prop="availableSpaces"
                label="可用泊位数"
                align="center"
                width="100"
              />
              <ElTableColumn
                prop="operationStatus"
                label="运营状态"
                align="center"
                width="100"
              >
                <template #default="scope">
                  <ElTag :type="scope.row.operationStatus === '运营中' ? 'success' : 'warning'">
                    {{ scope.row.operationStatus || '-' }}
                  </ElTag>
                </template>
              </ElTableColumn>
            </ElTable>
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeParkAreaDistributionDetailDialog">关闭</ElButton>
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
@import '../../../templatesstyle/stat-cards1';
@import '../../../templatesstyle/chart-cards1';

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
