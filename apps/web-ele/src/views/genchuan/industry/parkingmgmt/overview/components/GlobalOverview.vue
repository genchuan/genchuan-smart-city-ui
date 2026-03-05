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
import type { FormInstance } from 'element-plus';
import { Filter, FullScreen, Refresh, Setting, VideoPause, VideoPlay,} from '@element-plus/icons-vue';
import GlobalNormalMap from '#/views/genchuan/industry/parkingmgmt/overview/components/GlobalNormalMap.vue';
import ChartLine1 from "#/views/genchuan/industry/templatesstatchart/ChartLine1.vue";
import ChartLine2 from "#/views/genchuan/industry/templatesstatchart/ChartLine2.vue";
import ChartLine3 from "#/views/genchuan/industry/templatesstatchart/ChartLine3-desc.vue";
import ChartLine4 from "#/views/genchuan/industry/templatesstatchart/ChartLine4.vue";
import ChartLine5 from "#/views/genchuan/industry/templatesstatchart/ChartLine5.vue";
import ChartLine6 from "#/views/genchuan/industry/templatesstatchart/ChartLine6.vue";
import ChartPie1 from '#/views/genchuan/industry/templatesstatchart/ChartPie1.vue';
import ChartPie2 from '#/views/genchuan/industry/templatesstatchart/ChartPie2.vue';
import ChartPie3 from '#/views/genchuan/industry/templatesstatchart/ChartPie3.vue';
import ChartPie5 from '#/views/genchuan/industry/templatesstatchart/ChartPie5-desc.vue';
import ChartPie6 from '#/views/genchuan/industry/templatesstatchart/ChartPie6.vue';
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
  fetchParkingVehicleList,
  fetchParkingVehicleDetail,
  fetchParkingVehicleIndicators,
  fetchParkingVehicleTrend,
  trackParkingVehicle,
  urgeVehicleLeave,
  fetchOperationIndicators,
  fetchOperationTypeRatio,
  fetchOperationRegionRatio,
  fetchOperationNewTrend,
  fetchOperationCompleteTrend,
  fetchTradeIndicators,
  fetchTradePayTypeRatio,
  fetchTradeRegionRatio,
  fetchTradeCountTrend,
  fetchTradeAmountTrend,
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
  fetchDeviceDistributionList,
  fetchDeviceDistributionTypeCount,
  fetchDeviceDistributionParkingCount,
  fetchDeviceDistributionDetail,
  submitDeviceMaintenance,
  fetchTerminalDeviceList,
  fetchTerminalDeviceIndicators,
  fetchTerminalDeviceTypeRatio,
  fetchTerminalDeviceStatusRatio,
  fetchTerminalDeviceOnlineRateTrend7d,
  fetchTerminalDeviceFaultTrend,
  fetchTerminalDeviceDetail,
  submitTerminalDeviceMaintenance,
  fetchMaintainTrendList,
  fetchMaintainTrendIndicators,
  fetchMaintainTrendNewTrend,
  fetchMaintainTrendCompletedTrend,
  fetchMaintainTrendFaultTrend,
  fetchMaintainTrendDeviceTypeCount,
  fetchMaintainTrendFaultTypeCount,
  fetchMaintainTrendFaultTypeRatio,
  fetchMaintainTrendStatusRatio,
  fetchMaintainTrendDetail,
  fetchFaultTraceDetail,
  fetchWorkOrderDetail,
  fetchComplianceList,
  fetchComplianceIndicators,
  fetchComplianceRateTrend,
  fetchComplianceNonCompliantTrend,
  fetchComplianceRegionRateCompare,
  fetchComplianceTypeRateCompare,
  fetchComplianceTypeRatio,
  fetchComplianceNonCompliantItemRatio,
  fetchComplianceRegionDistributionRatio,
  fetchComplianceDetail,
  fetchNonCompliantTraceDetail,
  handleNonCompliantItem,
} from '#/api/genchuan/industry/parkingmgmt/overview/GlobalOverview.ts';

const pageContainerRef = ref(null);
const router = useRouter();
const instance = getCurrentInstance();
const currentFullscreenPanel = ref<HTMLElement | null>(null);

const normalMapRef = ref<InstanceType<typeof GlobalNormalMap> | null>(null); // 第一个地图
const heatmapMapRef = ref<InstanceType<typeof GlobalHeatmapMap> | null>(null); // 第二个地图

// 地图加载状态
const normalMapLoading = ref(true);
const heatmapLoading = ref(false);

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
// 时间戳格式化
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
      deviceChartRefreshKey.value++;
      tradeChartRefreshKey.value++;
      operationChartRefreshKey.value++;
      parkResourceDistributionChartRefreshKey.value++;
      deviceDistributionChartRefreshKey.value++;
      parkingSpaceChartRefreshKey.value++;
      tradeTrendChartRefreshKey.value++;
      supplyDemandChartRefreshKey.value++;
      parkAreaDistributionChartRefreshKey.value++;
      terminalDeviceChartRefreshKey.value++;
      maintainTrendChartRefreshKey.value++;
      complianceChartRefreshKey.value++;
    }, 300);
  } else if (currentFullscreenPanel.value) {
    currentFullscreenPanel.value.style = '';
    nextTick(() => {
      deviceChartRefreshKey.value++;
      tradeChartRefreshKey.value++;
      operationChartRefreshKey.value++;
      parkResourceDistributionChartRefreshKey.value++;
      deviceDistributionChartRefreshKey.value++;
      parkingSpaceChartRefreshKey.value++;
      tradeTrendChartRefreshKey.value++;
      supplyDemandChartRefreshKey.value++;
      parkAreaDistributionChartRefreshKey.value++;
      terminalDeviceChartRefreshKey.value++;
      maintainTrendChartRefreshKey.value++;
      complianceChartRefreshKey.value++;
    });
    currentFullscreenPanel.value = null;
  }
};

const handleTabChange = () => {
  nextTick(() => {
    setTimeout(() => {
      deviceChartRefreshKey.value++;
      tradeChartRefreshKey.value++;
      operationChartRefreshKey.value++;
      parkResourceDistributionChartRefreshKey.value++;
      deviceDistributionChartRefreshKey.value++;
      parkingSpaceChartRefreshKey.value++;
      tradeTrendChartRefreshKey.value++;
      supplyDemandChartRefreshKey.value++;
      parkAreaDistributionChartRefreshKey.value++;
      terminalDeviceChartRefreshKey.value++;
      maintainTrendChartRefreshKey.value++;
      complianceChartRefreshKey.value++;
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
    rotateSpeed: 0.05,
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
    rotateSpeed: 0.05,
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

// 图表通用类型
interface ChartRatioData {
  legend: string[];
  series: { data: number[]; name: string }[];
}
interface ChartLineData {
  xAxis: string[];
  series: {
    data: number[];
    name: string
  }[];
}
interface ChartBarData {
  xAxis: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

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

// 通行交易TS类型定义
interface TradeIndicators {
  tbTradeStatTotalCount: number; // 交易总笔数
  tbTradeStatTotalAmount: number; // 交易总金额
  tbTradeStatAverageAmount: number; // 平均单笔金额
  tbTradeStatPayCompleteRate: number; // 支付完成率
  sysPayTypeName: string; // 热门支付方式
  tbTradeStatChainGrowth: number; // 环比增长
  tbTradeStatPeakHour: string; // 高峰时段
  tbTradeStatUnfinishedCount: number; // 未完成交易数
  tbRegionTradeRate: string; // 区域交易占比
}

// 运维服务TS类型定义
interface OperationIndicators {
  tbOperationStatWorkorderTotal: number; // 工单总数
  tbOperationStatCompletedCount: number; // 已完成数
  tbOperationStatAverageDuration: number; // 平均处置时长
  tbOperationStatCompletionRate: number; // 处置完成率
  sysWorkorderTypeName: string; // 热门工单类型
  tbOperationStatOvertimeCount: number; // 超时工单数
  tbOperationStatSatisfactionRate: number; // 客户满意度
  tbOperationStatChainChange: number; // 环比工单变化
  tbRegionOperationRate: string; // 区域工单分布
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

// 在停车辆实时监控TS类型定义
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
interface ParkingVehicleRow {
  tbVehicleLicensePlate: string; // 车牌号码
  tbParkingName: string; // 停车场名称
  tbParkingSpaceSpaceNo: string; // 泊位编号
  tbParkingRecordEntryTime: number; // 入场时间戳
  tbParkingRecordExpectedExitTime: number; // 预计离场时间戳
  tbParkingRecordParkingDuration: number; // 停车时长(分钟)
  tbParkingRecordRecordId: string; // 记录ID
  sysPayStatusName: '已支付' | '未支付'; // 支付状态
  tbParkingSpaceType: string; // 车位类型
  tbRegionName: string; // 区域归属
  vehicleLongitude: number; // 经度
  vehicleLatitude: number; // 纬度
  lotId: string; // 停车场ID
}
interface ParkingVehicleDetail {
  tbParkingRecordRecordId: string;
  tbVehicleLicensePlate: string;
  tbParkingName: string;
  tbParkingSpaceSpaceNo: string;
  tbParkingRecordEntryTime: number;
  tbParkingRecordExpectedExitTime: number;
  tbParkingRecordParkingDuration: number;
  sysPayStatusName: string;
  tbParkingSpaceType: string;
  tbRegionName: string;
  // 停车记录
  parkingRecord: {
    entryTime: number;
    expectedExitTime: number;
    actualExitTime: number | null;
    parkingDuration: number;
    totalFee: number;
    discountFee: number;
    finalFee: number;
  };
  // 支付明细
  paymentDetail: {
    payMethod: string;
    payTime: number | null;
    payAmount: number;
    payStatus: string;
    invoiceStatus: string;
    transactionNo?: string; // 交易流水号
  };
  // 泊位位置
  spaceLocation: {
    longitude: number;
    latitude: number;
    floor: string;
    zone: string;
    spaceNo: string;
  };
  // 车辆信息
  vehicleInfo: {
    vehicleType: string;
    vehicleColor: string;
    vehicleBrand: string;
    ownerName: string;
    ownerPhone: string;
  };
}
interface ParkingVehicleIndicators {
  totalVehicleCount: number; // 在停车辆总数
  regionVehicleCount: number; // 各区域在停数
  unpaidVehicleCount: number; // 未支付车辆数
  averageParkingDuration: number; // 平均停车时长（分钟）
}

// 终端设备分布明细TS类型定义
interface DeviceDistributionRow {
  tbDeviceName: string;
  tbDeviceDeviceNo: string;
  sysDeviceTypeName: string;
  tbParkingName: string;
  tbDeviceInstallPosition: string;
  sysDeviceStatusName: string;
  tbDeviceInstallTime: number;
  tbDeviceDeviceId: string;
}
interface DeviceDistributionDetail {
  tbDeviceDeviceId: string;
  tbDeviceName: string;
  tbDeviceDeviceNo: string;
  sysDeviceTypeName: string;
  tbParkingName: string;
  tbDeviceInstallPosition: string;
  sysDeviceStatusName: string;
  tbDeviceInstallTime: number;
  // 弹窗展示字段
  tbDeviceOnlineDuration: number; // 在线时长（小时）
  tbDeviceFaultTime: number; // 最近故障时间
  sysUserUserName: string; // 负责人
  // 运行数据
  operationData: {
    tbDeviceUptime: number; // 设备运行率
    tbDeviceResponseTime: number; // 平均响应时间
    tbDeviceLastMaintainTime: number; // 最近维护时间
    tbDeviceNextMaintainTime: number; // 下次维护时间
  };
  // 运维记录
  maintenanceRecords: {
    time: number;
    type: string;
    content: string;
    operator: string;
    status: string;
  }[];
}
interface MaintenanceForm {
  maintenanceType: '巡检' | '维修';
  maintenanceContent: string;
}

// 终端设备TS类型定义
interface TerminalDeviceRow {
  tbDeviceName: string; // 设备名称
  tbDeviceDeviceNo: string; // 设备编号
  sysDeviceTypeName: string; // 设备类型
  tbParkingName: string; // 所属停车场
  sysDeviceStatusName: string; // 运行状态
  tbDeviceOnlineDuration: number; // 在线时长（分钟）
  tbDeviceLastCommTime: number; // 最后通信时间戳
  tbDeviceDeviceId: string; // 设备ID
}
interface TerminalDeviceIndicators {
  deviceTotalCount: number; // 设备总数
  deviceOnlineCount: number; // 在线数
  deviceNormalCount: number; // 正常运行数
  deviceFaultCount: number; // 故障数
  deviceInspectCount: number; // 待巡检数
}
interface TerminalDeviceDetail {
  tbDeviceDeviceId: string;
  tbDeviceName: string;
  tbDeviceDeviceNo: string;
  tbParkingName: string;
  sysDeviceTypeName: string;
  sysDeviceStatusName: string;
  // 弹窗展示字段
  tbDeviceFaultCount: number; // 故障次数
  tbDeviceMaintainCount: number; // 累计运维次数
  tbDeviceNextInspectTime: number; // 下次巡检时间戳
  // 设备参数
  deviceParams: {
    paramName: string;
    paramValue: string;
  }[];
  // 运行日志
  runLogs: {
    logTime: number | string;
    logContent: string;
    logLevel: string;
  }[];
  // 运维记录
  maintainRecords: {
    maintainTime: number | string;
    maintainType: string;
    maintainContent: string;
  }[];
  // 故障记录
  faultRecords: {
    faultTime: number | string;
    faultContent: string;
    handleStatus: string;
  }[];
}
interface TerminalDeviceMaintenanceForm {
  maintenanceType: string; // 运维类型：巡检/维修/校准
  maintenanceContent?: string; // 运维内容（可选）
}

// 设备运维趋势TS类型定义
interface MaintainTrendRow {
  tbMaintainTrendPeriod: string;
  tbMaintainTrendDate: string;
  tbMaintainTrendNewCount: number;
  tbMaintainTrendCompletedCount: number;
  tbMaintainTrendAverageDuration: number;
  tbMaintainTrendFaultDeviceCount: number;
  tbMaintainTrendId: string;
}
interface MaintainTrendIndicators {
  totalNewCount: number; // 新增工单数
  totalCompletedCount: number; // 完成数
  completionRate: number; // 完成率
  averageDuration: number; // 平均处置时长
  unfinishedCount: number; // 未完成数
}
interface MaintainTrendDetail {
  tbMaintainTrendId: string;
  tbMaintainTrendPeriod: string;
  tbMaintainTrendDate: string;
  // 弹窗展示字段
  tbMaintainTrendCompletionRate: number; // 工单完成率
  tbMaintainTrendChainGrowth: number; // 环比工单增长
  sysFaultTypeName: string; // 热门故障类型
  tbMaintainTrendUnfinishedCount: number; // 未完成工单数
  // 工单明细
  workOrderDetails: {
    orderNo: string;
    deviceType: string;
    faultType: string;
    status: string;
    duration: number;
  }[];
  // 故障分布
  faultDistribution: ChartRatioData;
  // 处置情况
  disposalSituation: {
    completedRate: number;
    avgDuration: number;
    urgentCount: number;
    normalCount: number;
  };
  // 故障设备追溯列表
  faultDeviceList: {
    deviceId: string;
    deviceName: string;
    deviceType: string;
    faultType: string;
    faultTime: number;
  }[];
}
interface FaultTraceRow {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  faultType: string;
  faultTime: number;
  workOrderNo: string;
  workOrderStatus: string;
  handler: string;
  handleTime: number | null;
}
interface WorkOrderDetail {
  orderNo: string;
  orderStatus: string;
  deviceName: string;
  deviceType: string;
  faultType: string;
  reportTime: number;
  reportPerson: string;
  handler: string;
  handleTime: number;
  handleResult: string;
  handleDuration: number;
  faultDescription: string;
  handleSteps: string;
  partsUsed: string;
  cost: number;
}

// 运维收费合规TS类型定义
interface ComplianceRow {
  tbCompliancePeriod: string;
  sysComplianceTypeName: string;
  tbComplianceTotalCheck: number;
  tbComplianceCompliantCount: number;
  tbComplianceNonCompliantCount: number;
  tbComplianceCompliantRate: number;
  sysNonCompliantItemName: string;
  tbComplianceId: string;
}
interface ComplianceIndicators {
  totalCompliantRate: number; // 总合规率
  operationCompliantRate: number; // 运维合规率
  chargeCompliantRate: number; // 收费合规率
  nonCompliantCount: number; // 不合规数
  handledRate: number; // 处理完成率
}
interface ComplianceDetail {
  tbComplianceId: string;
  tbCompliancePeriod: string;
  sysComplianceTypeName: string;
  // 弹窗展示字段
  tbComplianceChainCompliantChange: number; // 环比合规率变化
  tbRegionKeyMonitorName: string; // 重点监控区域
  tbComplianceHandledCount: number; // 不合规处理完成数
  tbComplianceHandledRate: number; // 处理完成率
  // 合规检查明细
  checkDetails: {
    checkNo: string;
    checkItem: string;
    checkResult: string;
    checkTime: number;
  }[];
  // 不合规项详情
  nonCompliantDetails: {
    item: string;
    description: string;
    severity: string;
    responsible: string;
    deadline: number;
  }[];
  // 处理记录
  handleRecords: {
    recordNo: string;
    handleItem: string;
    handlePerson: string;
    handleTime: number;
    handleResult: string;
    remark: string;
  }[];
  // 不合规追溯列表
  nonCompliantTraceList: {
    recordId: string;
    nonCompliantItem: string;
    relatedParking: string;
    checkTime: number;
    status: string;
    workOrderNo: string | null;
  }[];
}
interface NonCompliantTraceRow {
  recordId: string;
  nonCompliantItem: string;
  relatedParking: string;
  checkTime: number;
  checkPerson: string;
  description: string;
  severity: string;
  status: string;
  workOrderNo: string | null;
  handlePerson: string | null;
  handleTime: number | null;
  handleResult: string | null;
}
interface HandleForm {
  handleSolution: string;
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

// 通行交易响应式数据
const tradeIndicators = ref<TradeIndicators>({
  tbTradeStatTotalCount: 0,
  tbTradeStatTotalAmount: 0,
  tbTradeStatAverageAmount: 0,
  tbTradeStatPayCompleteRate: 0,
  sysPayTypeName: '',
  tbTradeStatChainGrowth: 0,
  tbTradeStatPeakHour: '',
  tbTradeStatUnfinishedCount: 0,
  tbRegionTradeRate: '',
});
const tradePayTypeRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '支付方式占比(%)', data: [] }],
});
const tradeRegionRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '区域交易占比(%)', data: [] }],
});
const tradeCountTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '交易笔数', data: [] }],
});
const tradeAmountTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '交易金额(元)', data: [] }],
});
// 通行交易视图切换相关
const tradeChartRefreshKey = ref(0);
const activeTradeView = ref('卡片');
const tradeViewBtnList = ref(['卡片', '饼图', '折线图']);

// 运维服务响应式数据
const operationIndicators = ref<OperationIndicators>({
  tbOperationStatWorkorderTotal: 0,
  tbOperationStatCompletedCount: 0,
  tbOperationStatAverageDuration: 0,
  tbOperationStatCompletionRate: 0,
  sysWorkorderTypeName: '',
  tbOperationStatOvertimeCount: 0,
  tbOperationStatSatisfactionRate: 0,
  tbOperationStatChainChange: 0,
  tbRegionOperationRate: '',
});
const operationTypeRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '工单类型占比(%)', data: [] }],
});
const operationRegionRatio = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '区域工单分布占比(%)', data: [] }],
});
const operationNewTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '工单新增数', data: [] }],
});
const operationCompleteTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '工单完成数', data: [] }],
});
// 运维服务视图切换相关
const operationChartRefreshKey = ref(0);
const activeOperationView = ref('卡片');
const operationViewBtnList = ref(['卡片', '饼图', '折线图']);

// 停车资源分布明细响应式数据
const parkResourceDistributionList = ref<ParkResourceDistributionRow[]>([]);
const parkResourceDistributionIndicators = ref<ParkResourceDistributionIndicators>({
  totalParkCount: 0,
  runningParkCount: 0,
  totalSpaceCount: 0,
  availableSpaceCount: 0,
});
const parkResourceDistributionAreaCountData = ref<ChartBarData>({
  xAxis: [],
  series: [{ name: '停车场数量', data: [] }],
});
const parkResourceDistributionTypeCountData = ref<ChartBarData>({
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
const tradeTrendTimeCountCompare = ref<ChartBarData>({
  xAxis: [],
  series: [{ name: '交易笔数', data: [] }],
});
const tradeTrendRegionAmountCompare = ref<ChartBarData>({
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

// 在停车辆实时监控响应式数据
const parkingVehicleList = ref<ParkingVehicleRow[]>([]);
const parkingVehicleIndicators = ref<ParkingVehicleIndicators>({
  totalVehicleCount: 0,
  regionVehicleCount: 0,
  unpaidVehicleCount: 0,
  averageParkingDuration: 0,
});
const parkingVehicleTrendData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '在停车辆数', data: [] }],
});
// 在停车辆实时监控视图切换相关
const activeParkingMonitorView = ref('地图'); // 默认显示地图
const parkingMonitorViewBtnList = ref(['地图', '列表']);
// 在停车辆实时监控弹窗相关
const parkingVehicleDetailDialogVisible = ref(false);
const parkingVehicleDetailSelectedRow = ref<ParkingVehicleDetail>({
  tbParkingRecordRecordId: '',
  tbVehicleLicensePlate: '',
  tbParkingName: '',
  tbParkingSpaceSpaceNo: '',
  tbParkingRecordEntryTime: 0,
  tbParkingRecordExpectedExitTime: 0,
  tbParkingRecordParkingDuration: 0,
  sysPayStatusName: '',
  tbParkingSpaceType: '',
  tbRegionName: '',
  parkingRecord: {
    entryTime: 0,
    expectedExitTime: 0,
    actualExitTime: null,
    parkingDuration: 0,
    totalFee: 0,
    discountFee: 0,
    finalFee: 0,
  },
  paymentDetail: {
    payMethod: '',
    payTime: null,
    payAmount: 0,
    payStatus: '',
    invoiceStatus: '',
    transactionNo: '',
  },
  spaceLocation: {
    longitude: 0,
    latitude: 0,
    floor: '',
    zone: '',
    spaceNo: '',
  },
  vehicleInfo: {
    vehicleType: '',
    vehicleColor: '',
    vehicleBrand: '',
    ownerName: '',
    ownerPhone: '',
  },
});
// 在停车辆详情视图切换
const activeParkingVehicleDetailView = ref('车辆信息');
const parkingVehicleDetailViewBtnList = ref(['车辆信息', '停车记录', '支付明细', '泊位位置']);
// 催离表单
const urgeForm = ref({
  urgeReason: '',
  urgeMethod: '短信通知',
  remark: '',
});
const urgeFormRules = {
  urgeReason: [{ required: true, message: '催离原因不能为空', trigger: 'blur' }],
  urgeMethod: [{ required: true, message: '请选择催离方式', trigger: 'change' }],
};
const urgeFormRef = ref<FormInstance>();

// 终端设备分布明细响应式数据
const deviceDistributionList = ref<DeviceDistributionRow[]>([]);
const deviceDistributionTypeCountData = ref<ChartBarData>({
  xAxis: [],
  series: [{ name: '设备数量', data: [] }],
});
const deviceDistributionParkingCountData = ref<ChartBarData>({
  xAxis: [],
  series: [{ name: '设备数量', data: [] }],
});
// 终端设备分布明细视图切换相关
const deviceDistributionChartRefreshKey = ref(0);
const activeDeviceDistributionView = ref('列表'); // 默认显示列表
const deviceDistributionViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);
// 终端设备分布明细弹窗相关
const deviceDistributionDetailDialogVisible = ref(false);
const deviceMaintenanceDialogVisible = ref(false);
const activeDeviceDistributionDetailView = ref('基本信息');
const deviceDistributionDetailViewBtnList = ref(['基本信息', '运行数据', '运维记录']);
const deviceDistributionDetailSelectedRow = ref<DeviceDistributionDetail>({
  tbDeviceDeviceId: '',
  tbDeviceName: '',
  tbDeviceDeviceNo: '',
  sysDeviceTypeName: '',
  tbParkingName: '',
  tbDeviceInstallPosition: '',
  sysDeviceStatusName: '',
  tbDeviceInstallTime: 0,
  tbDeviceOnlineDuration: 0,
  tbDeviceFaultTime: 0,
  sysUserUserName: '',
  operationData: {
    tbDeviceUptime: 0,
    tbDeviceResponseTime: 0,
    tbDeviceLastMaintainTime: 0,
    tbDeviceNextMaintainTime: 0,
  },
  maintenanceRecords: []
});
// 运维表单
const maintenanceForm = ref<MaintenanceForm>({
  maintenanceType: '巡检',
  maintenanceContent: '',
});
const maintenanceFormRules = {
  maintenanceType: [{ required: true, message: '请选择运维类型', trigger: 'change' }],
};
const maintenanceFormRef = ref<FormInstance>();
const maintainingDeviceId = ref(''); // 当前正在运维的设备ID

// 终端设备响应式数据
const terminalDeviceList = ref<TerminalDeviceRow[]>([]);
const terminalDeviceIndicators = ref<TerminalDeviceIndicators>({
  deviceTotalCount: 0,
  deviceOnlineCount: 0,
  deviceNormalCount: 0,
  deviceFaultCount: 0,
  deviceInspectCount: 0,
});
const terminalDeviceTypeRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '设备类型占比(%)', data: [] }],
});
const terminalDeviceStatusRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '运行状态占比(%)', data: [] }],
});
const terminalDeviceOnlineRateTrend7d = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '设备在线率(%)', data: [] }],
});
const terminalDeviceFaultTrend = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '故障发生次数', data: [] }],
});
// 终端设备视图切换相关
const terminalDeviceChartRefreshKey = ref(0);
const activeTerminalDeviceView = ref('卡片');
const terminalDeviceViewBtnList = ref(['卡片', '折线图', '饼图', '列表']);
// 终端设备弹窗相关
const terminalDeviceDetailDialogVisible = ref(false);
const terminalDeviceMaintenanceDialogVisible = ref(false);
const activeTerminalDeviceDetailView = ref('设备参数');
const terminalDeviceDetailViewBtnList = ref(['设备参数', '运行日志', '运维记录', '故障记录']);
const terminalDeviceDetailSelectedRow = ref<TerminalDeviceDetail>({
  tbDeviceDeviceId: '',
  tbDeviceName: '',
  tbDeviceDeviceNo: '',
  tbParkingName: '',
  sysDeviceTypeName: '',
  sysDeviceStatusName: '',
  tbDeviceFaultCount: 0,
  tbDeviceMaintainCount: 0,
  tbDeviceNextInspectTime: 0,
  deviceParams: [],
  runLogs: [],
  maintainRecords: [],
  faultRecords: []
});
const terminalDeviceMaintenanceForm = ref<TerminalDeviceMaintenanceForm>({
  maintenanceType: '巡检',
  maintenanceContent: ''
});
const terminalDeviceMaintenanceFormRules = {
  maintenanceType: [{ required: true, message: '请选择运维类型', trigger: 'change' }],
};
const terminalDeviceMaintenanceFormRef = ref<FormInstance>();
const maintainingTerminalDeviceId = ref(''); // 当前正在运维的设备ID

// 设备运维趋势响应式数据
const maintainTrendList = ref<MaintainTrendRow[]>([]);
const maintainTrendIndicators = ref<MaintainTrendIndicators>({
  totalNewCount: 0,
  totalCompletedCount: 0,
  completionRate: 0,
  averageDuration: 0,
  unfinishedCount: 0,
});
const maintainTrendNewTrendData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '工单新增数', data: [] }],
});
const maintainTrendCompletedTrendData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '工单完成数', data: [] }],
});
const maintainTrendFaultTrendData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '故障设备数', data: [] }],
});
const maintainTrendDeviceTypeCountData = ref<ChartBarData>({
  xAxis: [],
  series: [{ name: '工单数量', data: [] }],
});
const maintainTrendFaultTypeCountData = ref<ChartBarData>({
  xAxis: [],
  series: [{ name: '工单数量', data: [] }],
});
const maintainTrendFaultTypeRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '故障类型占比(%)', data: [] }],
});
const maintainTrendStatusRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '工单状态占比(%)', data: [] }],
});
// 设备运维趋势视图切换相关
const maintainTrendChartRefreshKey = ref(0);
const activeMaintainTrendView = ref('卡片');
const maintainTrendViewBtnList = ref(['卡片', '折线图', '柱状图', '饼图', '列表']);
// 设备运维趋势弹窗相关
const maintainTrendDetailDialogVisible = ref(false);
const faultTraceDialogVisible = ref(false);
const activeMaintainTrendDetailView = ref('工单明细');
const maintainTrendDetailViewBtnList = ref(['工单明细', '故障分布', '处置情况']);
const maintainTrendDetailSelectedRow = ref<MaintainTrendDetail>({
  tbMaintainTrendId: '',
  tbMaintainTrendPeriod: '',
  tbMaintainTrendDate: '',
  tbMaintainTrendCompletionRate: 0,
  tbMaintainTrendChainGrowth: 0,
  sysFaultTypeName: '',
  tbMaintainTrendUnfinishedCount: 0,
  workOrderDetails: [],
  faultDistribution: {
    legend: [],
    series: [{ name: '故障分布', data: [] }]
  },
  disposalSituation: {
    completedRate: 0,
    avgDuration: 0,
    urgentCount: 0,
    normalCount: 0,
  },
  faultDeviceList: []
});
const faultTraceList = ref<FaultTraceRow[]>([]);
const currentTraceFaultType = ref('');
// 工单详情弹窗相关
const workOrderDetailDialogVisible = ref(false);
const workOrderDetailSelectedRow = ref<WorkOrderDetail>({
  orderNo: '',
  orderStatus: '',
  deviceName: '',
  deviceType: '',
  faultType: '',
  reportTime: 0,
  reportPerson: '',
  handler: '',
  handleTime: 0,
  handleResult: '',
  handleDuration: 0,
  faultDescription: '',
  handleSteps: '',
  partsUsed: '',
  cost: 0,
});

// 运维收费合规响应式数据
const complianceList = ref<ComplianceRow[]>([]);
const complianceIndicators = ref<ComplianceIndicators>({
  totalCompliantRate: 0,
  operationCompliantRate: 0,
  chargeCompliantRate: 0,
  nonCompliantCount: 0,
  handledRate: 0,
});
const complianceRateTrendData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '合规率(%)', data: [] }],
});
const complianceNonCompliantTrendData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '不合规数', data: [] }],
});
const complianceRegionRateCompareData = ref<ChartBarData>({
  xAxis: [],
  series: [{ name: '合规率(%)', data: [] }],
});
const complianceTypeRateCompareData = ref<ChartBarData>({
  xAxis: [],
  series: [{ name: '合规率(%)', data: [] }],
});
const complianceTypeRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '合规类型占比(%)', data: [] }],
});
const complianceNonCompliantItemRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '不合规项占比(%)', data: [] }],
});
const complianceRegionDistributionRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '区域不合规分布占比(%)', data: [] }],
});
// 运维收费合规视图切换相关
const complianceChartRefreshKey = ref(0);
const activeComplianceView = ref('卡片');
const complianceViewBtnList = ref(['卡片', '折线图', '柱状图', '饼图', '列表']);
// 运维收费合规弹窗相关
const complianceDetailDialogVisible = ref(false);
const nonCompliantTraceDialogVisible = ref(false);
const complianceHandleDialogVisible = ref(false);
const activeComplianceDetailView = ref('合规检查明细');
const complianceDetailViewBtnList = ref(['合规检查明细', '不合规项详情', '处理记录']);
const complianceDetailSelectedRow = ref<ComplianceDetail>({
  tbComplianceId: '',
  tbCompliancePeriod: '',
  sysComplianceTypeName: '',
  tbComplianceChainCompliantChange: 0,
  tbRegionKeyMonitorName: '',
  tbComplianceHandledCount: 0,
  tbComplianceHandledRate: 0,
  checkDetails: [],
  nonCompliantDetails: [],
  handleRecords: [],
  nonCompliantTraceList: []
});
const nonCompliantTraceList = ref<NonCompliantTraceRow[]>([]);
const currentTraceNonCompliantItem = ref('');
const handleForm = ref<HandleForm>({
  handleSolution: ''
});
const handleFormRules = {
  handleSolution: [{ required: true, message: '处理方案不能为空', trigger: 'blur' }]
};
const handleFormRef = ref<FormInstance>();
const currentHandleComplianceId = ref('');
const currentHandleNonCompliantItem = ref('');


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

// 通行交易接口请求方法
const getTradeIndicatorsData = async () => {
  try {
    tradeIndicators.value = (await fetchTradeIndicators()) as TradeIndicators;
  } catch (error: any) {
    ElMessage.error(`交易核心指标加载失败：${error.message}`);
  }
};
const getTradePayTypeRatioData = async () => {
  try {
    tradePayTypeRatio.value = (await fetchTradePayTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`支付方式占比加载失败：${error.message}`);
  }
};
const getTradeRegionRatioData = async () => {
  try {
    tradeRegionRatio.value = (await fetchTradeRegionRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`区域交易占比加载失败：${error.message}`);
  }
};
const getTradeCountTrendData = async () => {
  try {
    tradeCountTrend.value = (await fetchTradeCountTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`交易笔数趋势加载失败：${error.message}`);
  }
};
const getTradeAmountTrendData = async () => {
  try {
    tradeAmountTrend.value = (await fetchTradeAmountTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`交易金额趋势加载失败：${error.message}`);
  }
};

// 运维服务接口请求方法
const getOperationIndicatorsData = async () => {
  try {
    operationIndicators.value = (await fetchOperationIndicators()) as OperationIndicators;
  } catch (error: any) {
    ElMessage.error(`运维服务核心指标加载失败：${error.message}`);
  }
};
const getOperationTypeRatioData = async () => {
  try {
    operationTypeRatio.value = (await fetchOperationTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`工单类型占比加载失败：${error.message}`);
  }
};
const getOperationRegionRatioData = async () => {
  try {
    operationRegionRatio.value = (await fetchOperationRegionRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`区域工单分布占比加载失败：${error.message}`);
  }
};
const getOperationNewTrendData = async () => {
  try {
    operationNewTrend.value = (await fetchOperationNewTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`工单新增趋势加载失败：${error.message}`);
  }
};
const getOperationCompleteTrendData = async () => {
  try {
    operationCompleteTrend.value = (await fetchOperationCompleteTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`工单完成趋势加载失败：${error.message}`);
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
      (await fetchParkResourceDistributionAreaCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`各区域停车场数量加载失败：${error.message}`);
  }
};
const getParkResourceDistributionTypeCountData = async () => {
  try {
    parkResourceDistributionTypeCountData.value =
      (await fetchParkResourceDistributionTypeCount()) as ChartBarData;
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
      (await fetchTradeTrendTimeCountCompare()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`各时段交易笔数对比加载失败：${error.message}`);
  }
};
const getTradeTrendRegionAmountCompareData = async () => {
  try {
    tradeTrendRegionAmountCompare.value =
      (await fetchTradeTrendRegionAmountCompare()) as ChartBarData;
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
      (await fetchParkAreaDistributionAreaCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`各区域停车场数量加载失败：${error.message}`);
  }
};
const getParkAreaDistributionAreaSpaceCountData = async () => {
  try {
    parkAreaDistributionAreaSpaceCountData.value =
      (await fetchParkAreaDistributionAreaSpaceCount()) as ChartBarData;
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

// 在停车辆实时监控接口请求方法
const getParkingVehicleListData = async () => {
  try {
    parkingVehicleList.value = (await fetchParkingVehicleList()) as ParkingVehicleRow[];
  } catch (error: any) {
    ElMessage.error(`在停车辆列表加载失败：${error.message}`);
    parkingVehicleList.value = [];
  }
};
const getParkingVehicleIndicatorsData = async () => {
  try {
    parkingVehicleIndicators.value =
      (await fetchParkingVehicleIndicators()) as ParkingVehicleIndicators;
  } catch (error: any) {
    ElMessage.error(`在停车辆核心指标加载失败：${error.message}`);
  }
};
const getParkingVehicleTrendData = async () => {
  try {
    parkingVehicleTrendData.value =
      (await fetchParkingVehicleTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`在停车辆趋势数据加载失败：${error.message}`);
  }
};
const getParkingVehicleDetailData = async (recordId: string) => {
  try {
    parkingVehicleDetailSelectedRow.value = {
      ...parkingVehicleDetailSelectedRow.value,
      ...(await fetchParkingVehicleDetail(recordId)),
    };
  } catch (error: any) {
    ElMessage.warning(`在停车辆详情加载失败：${error.message}`);
  }
};
const trackParkingVehicleData = async (row: ParkingVehicleRow) => {
  try {
    const res = await trackParkingVehicle({
      recordId: row.tbParkingRecordRecordId,
      longitude: row.vehicleLongitude,
      latitude: row.vehicleLatitude,
    });

    if (res.success) {
      // 调用地图组件的聚焦方法
      if (normalMapRef.value && typeof normalMapRef.value.focusOnSpace === 'function') {
        normalMapRef.value.focusOnSpace({
          longitude: row.vehicleLongitude,
          latitude: row.vehicleLatitude,
          spaceNo: row.tbParkingSpaceSpaceNo,
        });
      }
      tipDialogContent.value = res.message;
      tipDialogVisible.value = true;
    } else {
      tipDialogContent.value = res.message || '追踪失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `追踪失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};
const urgeVehicleLeaveData = async () => {
  try {
    await urgeFormRef.value?.validate();
    const res = await urgeVehicleLeave(
      parkingVehicleDetailSelectedRow.value.tbParkingRecordRecordId,
      urgeForm.value
    );

    if (res.success) {
      tipDialogContent.value = res.message;
      tipDialogVisible.value = true;

      // 关闭弹窗
      parkingVehicleDetailDialogVisible.value = false;
      urgeForm.value = {
        urgeReason: '',
        urgeMethod: '短信通知',
        remark: '',
      };
      urgeFormRef.value?.resetFields();
      // 刷新列表数据
      await getParkingVehicleListData();
      await getParkingVehicleIndicatorsData();
    } else {
      tipDialogContent.value = res.message || '催离操作失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `催离操作失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

// 终端设备分布明细接口请求方法
const getDeviceDistributionListData = async () => {
  try {
    deviceDistributionList.value = (await fetchDeviceDistributionList()) as DeviceDistributionRow[];
  } catch (error: any) {
    ElMessage.error(`终端设备分布明细列表加载失败：${error.message}`);
    deviceDistributionList.value = [];
  }
};
const getDeviceDistributionTypeCountData = async () => {
  try {
    deviceDistributionTypeCountData.value =
      (await fetchDeviceDistributionTypeCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`各类型设备数量加载失败：${error.message}`);
  }
};
const getDeviceDistributionParkingCountData = async () => {
  try {
    deviceDistributionParkingCountData.value =
      (await fetchDeviceDistributionParkingCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`各停车场设备数量加载失败：${error.message}`);
  }
};
const getDeviceDistributionDetailData = async (deviceId: string) => {
  try {
    deviceDistributionDetailSelectedRow.value = {
      ...deviceDistributionDetailSelectedRow.value,
      ...(await fetchDeviceDistributionDetail(deviceId)),
    };
  } catch (error: any) {
    ElMessage.warning(`终端设备分布明细详情加载失败：${error.message}`);
  }
};
const submitDeviceMaintenanceData = async (deviceId: string, formData: MaintenanceForm) => {
  try {
    await maintenanceFormRef.value?.validate();
    const res = await submitDeviceMaintenance(deviceId, formData);

    if (res.success) {
      tipDialogContent.value = res.message;
      tipDialogVisible.value = true;
      deviceMaintenanceDialogVisible.value = false;
      maintenanceForm.value.maintenanceContent = '';
      maintenanceFormRef.value?.resetFields();
      // 刷新数据
      await getDeviceDistributionListData();
    } else {
      tipDialogContent.value = res.message || '提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

// 终端设备接口请求方法
const getTerminalDeviceListData = async () => {
  try {
    terminalDeviceList.value = (await fetchTerminalDeviceList()) as TerminalDeviceRow[];
  } catch (error: any) {
    ElMessage.error(`终端设备列表加载失败：${error.message}`);
    terminalDeviceList.value = [];
  }
};
const getTerminalDeviceIndicatorsData = async () => {
  try {
    terminalDeviceIndicators.value = (await fetchTerminalDeviceIndicators()) as TerminalDeviceIndicators;
  } catch (error: any) {
    ElMessage.error(`终端设备核心指标加载失败：${error.message}`);
  }
};
const getTerminalDeviceTypeRatioData = async () => {
  try {
    terminalDeviceTypeRatioData.value = (await fetchTerminalDeviceTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`终端设备类型占比加载失败：${error.message}`);
  }
};
const getTerminalDeviceStatusRatioData = async () => {
  try {
    terminalDeviceStatusRatioData.value = (await fetchTerminalDeviceStatusRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`终端设备运行状态占比加载失败：${error.message}`);
  }
};
const getTerminalDeviceOnlineRateTrend7dData = async () => {
  try {
    terminalDeviceOnlineRateTrend7d.value = (await fetchTerminalDeviceOnlineRateTrend7d()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`终端设备在线率变化趋势加载失败：${error.message}`);
  }
};
const getTerminalDeviceFaultTrendData = async () => {
  try {
    terminalDeviceFaultTrend.value = (await fetchTerminalDeviceFaultTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`终端设备故障发生趋势加载失败：${error.message}`);
  }
};
const getTerminalDeviceDetailData = async (deviceId: string) => {
  try {
    terminalDeviceDetailSelectedRow.value = {
      ...terminalDeviceDetailSelectedRow.value,
      ...(await fetchTerminalDeviceDetail(deviceId)),
    };
  } catch (error: any) {
    ElMessage.warning(`终端设备详情加载失败：${error.message}`);
  }
};
const submitTerminalDeviceMaintenanceData = async (deviceId: string, maintenanceData: TerminalDeviceMaintenanceForm) => {
  try {
    await terminalDeviceMaintenanceFormRef.value?.validate();
    const res = await submitTerminalDeviceMaintenance(deviceId, maintenanceData);
    if (res.success) {
      tipDialogContent.value = res.message;
      tipDialogVisible.value = true;
      terminalDeviceMaintenanceDialogVisible.value = false;
      terminalDeviceMaintenanceForm.value = {
        maintenanceType: '巡检',
        maintenanceContent: ''
      };
      terminalDeviceMaintenanceFormRef.value?.resetFields();
      // 刷新数据
      await getTerminalDeviceListData();
      await getTerminalDeviceIndicatorsData();
      await getTerminalDeviceStatusRatioData();
    } else {
      tipDialogContent.value = res.message || '运维工单提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `运维工单提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

// 设备运维趋势接口请求方法
const getMaintainTrendListData = async () => {
  try {
    maintainTrendList.value = (await fetchMaintainTrendList()) as MaintainTrendRow[];
  } catch (error: any) {
    ElMessage.error(`设备运维趋势列表加载失败：${error.message}`);
    maintainTrendList.value = [];
  }
};
const getMaintainTrendIndicatorsData = async () => {
  try {
    maintainTrendIndicators.value =
      (await fetchMaintainTrendIndicators()) as MaintainTrendIndicators;
  } catch (error: any) {
    ElMessage.error(`设备运维趋势核心指标加载失败：${error.message}`);
  }
};
const getMaintainTrendNewTrendData = async () => {
  try {
    maintainTrendNewTrendData.value =
      (await fetchMaintainTrendNewTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`工单新增趋势加载失败：${error.message}`);
  }
};
const getMaintainTrendCompletedTrendData = async () => {
  try {
    maintainTrendCompletedTrendData.value =
      (await fetchMaintainTrendCompletedTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`工单完成趋势加载失败：${error.message}`);
  }
};
const getMaintainTrendFaultTrendData = async () => {
  try {
    maintainTrendFaultTrendData.value =
      (await fetchMaintainTrendFaultTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`故障设备数趋势加载失败：${error.message}`);
  }
};
const getMaintainTrendDeviceTypeCountData = async () => {
  try {
    maintainTrendDeviceTypeCountData.value =
      (await fetchMaintainTrendDeviceTypeCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`各类型设备工单数量加载失败：${error.message}`);
  }
};
const getMaintainTrendFaultTypeCountData = async () => {
  try {
    maintainTrendFaultTypeCountData.value =
      (await fetchMaintainTrendFaultTypeCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`各故障类型工单数量加载失败：${error.message}`);
  }
};
const getMaintainTrendFaultTypeRatioData = async () => {
  try {
    maintainTrendFaultTypeRatioData.value =
      (await fetchMaintainTrendFaultTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`故障类型占比加载失败：${error.message}`);
  }
};
const getMaintainTrendStatusRatioData = async () => {
  try {
    maintainTrendStatusRatioData.value =
      (await fetchMaintainTrendStatusRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`工单状态占比加载失败：${error.message}`);
  }
};
const getMaintainTrendDetailData = async (maintainTrendId: string) => {
  try {
    maintainTrendDetailSelectedRow.value = {
      ...maintainTrendDetailSelectedRow.value,
      ...(await fetchMaintainTrendDetail(maintainTrendId)),
    };
  } catch (error: any) {
    ElMessage.warning(`设备运维趋势详情加载失败：${error.message}`);
  }
};
const getFaultTraceData = async (faultType: string) => {
  try {
    faultTraceList.value = (await fetchFaultTraceDetail(faultType)) as FaultTraceRow[];
    currentTraceFaultType.value = faultType;
  } catch (error: any) {
    ElMessage.warning(`故障追溯数据加载失败：${error.message}`);
    faultTraceList.value = [];
  }
};
const getWorkOrderDetailData = async (orderNo: string) => {
  try {
    workOrderDetailSelectedRow.value = {
      ...workOrderDetailSelectedRow.value,
      ...(await fetchWorkOrderDetail(orderNo)),
    };
  } catch (error: any) {
    ElMessage.warning(`工单详情加载失败：${error.message}`);
  }
};

// 运维收费合规接口请求方法
const getComplianceListData = async () => {
  try {
    complianceList.value = (await fetchComplianceList()) as ComplianceRow[];
  } catch (error: any) {
    ElMessage.error(`运维收费合规列表加载失败：${error.message}`);
    complianceList.value = [];
  }
};
const getComplianceIndicatorsData = async () => {
  try {
    complianceIndicators.value =
      (await fetchComplianceIndicators()) as ComplianceIndicators;
  } catch (error: any) {
    ElMessage.error(`运维收费合规核心指标加载失败：${error.message}`);
  }
};
const getComplianceRateTrendData = async () => {
  try {
    complianceRateTrendData.value =
      (await fetchComplianceRateTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`合规率变化趋势加载失败：${error.message}`);
  }
};
const getComplianceNonCompliantTrendData = async () => {
  try {
    complianceNonCompliantTrendData.value =
      (await fetchComplianceNonCompliantTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`不合规数变化趋势加载失败：${error.message}`);
  }
};
const getComplianceRegionRateCompareData = async () => {
  try {
    complianceRegionRateCompareData.value =
      (await fetchComplianceRegionRateCompare()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`各区域合规率对比加载失败：${error.message}`);
  }
};
const getComplianceTypeRateCompareData = async () => {
  try {
    complianceTypeRateCompareData.value =
      (await fetchComplianceTypeRateCompare()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`各合规类型合规率对比加载失败：${error.message}`);
  }
};
const getComplianceTypeRatioData = async () => {
  try {
    complianceTypeRatioData.value =
      (await fetchComplianceTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`合规类型占比加载失败：${error.message}`);
  }
};
const getComplianceNonCompliantItemRatioData = async () => {
  try {
    complianceNonCompliantItemRatioData.value =
      (await fetchComplianceNonCompliantItemRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`不合规项占比加载失败：${error.message}`);
  }
};
const getComplianceRegionDistributionRatioData = async () => {
  try {
    complianceRegionDistributionRatioData.value =
      (await fetchComplianceRegionDistributionRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`区域不合规分布占比加载失败：${error.message}`);
  }
};
const getComplianceDetailData = async (complianceId: string) => {
  try {
    complianceDetailSelectedRow.value = {
      ...complianceDetailSelectedRow.value,
      ...(await fetchComplianceDetail(complianceId)),
    };
  } catch (error: any) {
    ElMessage.warning(`运维收费合规详情加载失败：${error.message}`);
  }
};
const getNonCompliantTraceData = async (nonCompliantItem: string) => {
  try {
    nonCompliantTraceList.value = (await fetchNonCompliantTraceDetail(nonCompliantItem)) as NonCompliantTraceRow[];
    currentTraceNonCompliantItem.value = nonCompliantItem;
  } catch (error: any) {
    ElMessage.warning(`不合规追溯数据加载失败：${error.message}`);
    nonCompliantTraceList.value = [];
  }
};
const handleNonCompliantItemData = async () => {
  try {
    await handleFormRef.value?.validate();
    const res = await handleNonCompliantItem(
      currentHandleComplianceId.value,
      currentHandleNonCompliantItem.value,
      handleForm.value.handleSolution
    );
    if (res.success) {
      tipDialogContent.value = res.message;
      tipDialogVisible.value = true;
      // 关闭处理弹窗
      complianceHandleDialogVisible.value = false;
      handleForm.value.handleSolution = '';
      handleFormRef.value?.resetFields();
      // 刷新详情数据
      await getComplianceDetailData(currentHandleComplianceId.value);
    } else {
      tipDialogContent.value = res.message || '处理提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `处理提交失败：${error.message}`;
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

// 通行交易视图切换方法
const changeTradeView = (viewName: string) => {
  activeTradeView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '饼图' || viewName === '折线图') &&
  nextTick(() => tradeChartRefreshKey.value++);
};
// 通行交易数据刷新方法
const refreshTradeData = async () => {
  await Promise.all([
    getTradeIndicatorsData(),
    getTradePayTypeRatioData(),
    getTradeRegionRatioData(),
    getTradeCountTrendData(),
    getTradeAmountTrendData(),
  ]);
  tradeChartRefreshKey.value++;
  ElMessage.success('通行交易数据刷新成功');
};

// 运维服务视图切换方法
const changeOperationView = (viewName: string) => {
  activeOperationView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '饼图' || viewName === '折线图') &&
  nextTick(() => operationChartRefreshKey.value++);
};
// 运维服务数据刷新方法
const refreshOperationData = async () => {
  await Promise.all([
    getOperationIndicatorsData(),
    getOperationTypeRatioData(),
    getOperationRegionRatioData(),
    getOperationNewTrendData(),
    getOperationCompleteTrendData(),
  ]);
  operationChartRefreshKey.value++;
  ElMessage.success('运维服务数据刷新成功');
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

// 在停车辆实时监控视图切换
const changeParkingMonitorView = (viewName: string) => {
  activeParkingMonitorView.value = viewName;
  nextTick(() => {
    if (viewName === '列表') {
      // 加载列表数据
      getParkingVehicleListData();
    }
  });
};
// 在停车辆详情视图切换
const changeParkingVehicleDetailView = (viewName: string) => {
  activeParkingVehicleDetailView.value = viewName;
};
// 在停车辆实时监控弹窗方法
const openParkingVehicleDetailDialog = async (row: ParkingVehicleRow) => {
  await getParkingVehicleDetailData(row.tbParkingRecordRecordId);
  parkingVehicleDetailDialogVisible.value = true;
};
const closeParkingVehicleDetailDialog = () => {
  parkingVehicleDetailDialogVisible.value = false;
  activeParkingVehicleDetailView.value = '车辆信息';
  parkingVehicleDetailSelectedRow.value = {
    tbParkingRecordRecordId: '',
    tbVehicleLicensePlate: '',
    tbParkingName: '',
    tbParkingSpaceSpaceNo: '',
    tbParkingRecordEntryTime: 0,
    tbParkingRecordExpectedExitTime: 0,
    tbParkingRecordParkingDuration: 0,
    sysPayStatusName: '',
    tbParkingSpaceType: '',
    tbRegionName: '',
    parkingRecord: {
      entryTime: 0,
      expectedExitTime: 0,
      actualExitTime: null,
      parkingDuration: 0,
      totalFee: 0,
      discountFee: 0,
      finalFee: 0,
    },
    paymentDetail: {
      payMethod: '',
      payTime: null,
      payAmount: 0,
      payStatus: '',
      invoiceStatus: '',
      transactionNo: '',
    },
    spaceLocation: {
      longitude: 0,
      latitude: 0,
      floor: '',
      zone: '',
      spaceNo: '',
    },
    vehicleInfo: {
      vehicleType: '',
      vehicleColor: '',
      vehicleBrand: '',
      ownerName: '',
      ownerPhone: '',
    },
  };
  urgeForm.value = {
    urgeReason: '',
    urgeMethod: '短信通知',
    remark: '',
  };
  urgeFormRef.value?.resetFields();
};
// 在停车辆实时监控数据刷新
const refreshParkingVehicleData = async () => {
  await Promise.all([
    getParkingVehicleListData(),
    getParkingVehicleIndicatorsData(),
    getParkingVehicleTrendData(),
  ]);
  ElMessage.success('在停车辆数据刷新成功');
};

// 终端设备分布明细视图切换
const changeDeviceDistributionView = (viewName: string) => {
  activeDeviceDistributionView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '柱状图' || viewName === '饼图') &&
  nextTick(() => deviceDistributionChartRefreshKey.value++);
};
const changeDeviceDistributionDetailView = (viewName: string) => {
  activeDeviceDistributionDetailView.value = viewName;
};
// 终端设备分布明细弹窗方法
const openDeviceDistributionDetailDialog = async (row: DeviceDistributionRow) => {
  await getDeviceDistributionDetailData(row.tbDeviceDeviceId);
  deviceDistributionDetailDialogVisible.value = true;
};
const closeDeviceDistributionDetailDialog = () => {
  deviceDistributionDetailDialogVisible.value = false;
  deviceDistributionDetailSelectedRow.value = {
    tbDeviceDeviceId: '',
    tbDeviceName: '',
    tbDeviceDeviceNo: '',
    sysDeviceTypeName: '',
    tbParkingName: '',
    tbDeviceInstallPosition: '',
    sysDeviceStatusName: '',
    tbDeviceInstallTime: 0,
    tbDeviceOnlineDuration: 0,
    tbDeviceFaultTime: 0,
    sysUserUserName: '',
    operationData: {
      tbDeviceUptime: 0,
      tbDeviceResponseTime: 0,
      tbDeviceLastMaintainTime: 0,
      tbDeviceNextMaintainTime: 0,
    },
    maintenanceRecords: []
  };
  activeDeviceDistributionDetailView.value = '基本信息';
};
const openDeviceMaintenanceDialog = (row: DeviceDistributionRow) => {
  maintainingDeviceId.value = row.tbDeviceDeviceId;
  deviceMaintenanceDialogVisible.value = true;
};
const closeDeviceMaintenanceDialog = () => {
  deviceMaintenanceDialogVisible.value = false;
  maintenanceForm.value = {
    maintenanceType: '巡检',
    maintenanceContent: '',
  };
  maintenanceFormRef.value?.resetFields();
  maintainingDeviceId.value = '';
};
// 终端设备分布明细数据刷新
const refreshDeviceDistributionData = async () => {
  await Promise.all([
    getDeviceDistributionListData(),
    getDeviceDistributionTypeCountData(),
    getDeviceDistributionParkingCountData(),
  ]);
  deviceDistributionChartRefreshKey.value++;
  ElMessage.success('终端设备分布明细数据刷新成功');
};

// 终端设备视图切换
const changeTerminalDeviceView = (viewName: string) => {
  activeTerminalDeviceView.value = viewName;
  viewName === '卡片' && nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '折线图' || viewName === '饼图') && nextTick(() => terminalDeviceChartRefreshKey.value++);
};
const changeTerminalDeviceDetailView = (viewName: string) => {
  activeTerminalDeviceDetailView.value = viewName;
};
// 终端设备弹窗方法
const openTerminalDeviceDetailDialog = async (row: TerminalDeviceRow) => {
  await getTerminalDeviceDetailData(row.tbDeviceDeviceId);
  terminalDeviceDetailDialogVisible.value = true;
};
const closeTerminalDeviceDetailDialog = () => {
  terminalDeviceDetailDialogVisible.value = false;
  terminalDeviceDetailSelectedRow.value = {
    tbDeviceDeviceId: '',
    tbDeviceName: '',
    tbDeviceDeviceNo: '',
    tbParkingName: '',
    sysDeviceTypeName: '',
    sysDeviceStatusName: '',
    tbDeviceFaultCount: 0,
    tbDeviceMaintainCount: 0,
    tbDeviceNextInspectTime: 0,
    deviceParams: [],
    runLogs: [],
    maintainRecords: [],
    faultRecords: []
  };
  activeTerminalDeviceDetailView.value = '设备参数';
};
const openTerminalDeviceMaintenanceDialog = (row: TerminalDeviceRow) => {
  maintainingTerminalDeviceId.value = row.tbDeviceDeviceId;
  terminalDeviceMaintenanceDialogVisible.value = true;
};
const closeTerminalDeviceMaintenanceDialog = () => {
  terminalDeviceMaintenanceDialogVisible.value = false;
  terminalDeviceMaintenanceForm.value = {
    maintenanceType: '巡检',
    maintenanceContent: ''
  };
  terminalDeviceMaintenanceFormRef.value?.resetFields();
  maintainingTerminalDeviceId.value = '';
};
// 终端设备数据刷新
const refreshTerminalDeviceData = async () => {
  await Promise.all([
    getTerminalDeviceListData(),
    getTerminalDeviceIndicatorsData(),
    getTerminalDeviceTypeRatioData(),
    getTerminalDeviceStatusRatioData(),
    getTerminalDeviceOnlineRateTrend7dData(),
    getTerminalDeviceFaultTrendData(),
  ]);
  terminalDeviceChartRefreshKey.value++;
  ElMessage.success('终端设备数据刷新成功');
};

// 设备运维趋势视图切换
const changeMaintainTrendView = (viewName: string) => {
  activeMaintainTrendView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '折线图' || viewName === '柱状图' || viewName === '饼图') &&
  nextTick(() => maintainTrendChartRefreshKey.value++);
};
const changeMaintainTrendDetailView = (viewName: string) => {
  activeMaintainTrendDetailView.value = viewName;
};
// 设备运维趋势弹窗方法
const openMaintainTrendDetailDialog = async (row: MaintainTrendRow) => {
  await getMaintainTrendDetailData(row.tbMaintainTrendId);
  maintainTrendDetailDialogVisible.value = true;
};
const closeMaintainTrendDetailDialog = () => {
  maintainTrendDetailDialogVisible.value = false;
  maintainTrendDetailSelectedRow.value = {
    tbMaintainTrendId: '',
    tbMaintainTrendPeriod: '',
    tbMaintainTrendDate: '',
    tbMaintainTrendCompletionRate: 0,
    tbMaintainTrendChainGrowth: 0,
    sysFaultTypeName: '',
    tbMaintainTrendUnfinishedCount: 0,
    workOrderDetails: [],
    faultDistribution: {
      legend: [],
      series: [{ name: '故障分布', data: [] }]
    },
    disposalSituation: {
      completedRate: 0,
      avgDuration: 0,
      urgentCount: 0,
      normalCount: 0,
    },
    faultDeviceList: []
  };
  activeMaintainTrendDetailView.value = '工单明细';
};
const openFaultTraceDialog = async (faultType: string) => {
  await getFaultTraceData(faultType);
  faultTraceDialogVisible.value = true;
};
const closeFaultTraceDialog = () => {
  faultTraceDialogVisible.value = false;
  faultTraceList.value = [];
  currentTraceFaultType.value = '';
};
const openWorkOrderDetailDialog = async (orderNo: string) => {
  await getWorkOrderDetailData(orderNo);
  workOrderDetailDialogVisible.value = true;
};
const closeWorkOrderDetailDialog = () => {
  workOrderDetailDialogVisible.value = false;
  workOrderDetailSelectedRow.value = {
    orderNo: '',
    orderStatus: '',
    deviceName: '',
    deviceType: '',
    faultType: '',
    reportTime: 0,
    reportPerson: '',
    handler: '',
    handleTime: 0,
    handleResult: '',
    handleDuration: 0,
    faultDescription: '',
    handleSteps: '',
    partsUsed: '',
    cost: 0,
  };
};
// 设备运维趋势数据刷新
const refreshMaintainTrendData = async () => {
  await Promise.all([
    getMaintainTrendListData(),
    getMaintainTrendIndicatorsData(),
    getMaintainTrendNewTrendData(),
    getMaintainTrendCompletedTrendData(),
    getMaintainTrendFaultTrendData(),
    getMaintainTrendDeviceTypeCountData(),
    getMaintainTrendFaultTypeCountData(),
    getMaintainTrendFaultTypeRatioData(),
    getMaintainTrendStatusRatioData(),
  ]);
  maintainTrendChartRefreshKey.value++;
  ElMessage.success('设备运维趋势数据刷新成功');
};

// 运维收费合规视图切换
const changeComplianceView = (viewName: string) => {
  activeComplianceView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initNumberAnimations, 300));
  (viewName === '折线图' || viewName === '柱状图' || viewName === '饼图') &&
  nextTick(() => complianceChartRefreshKey.value++);
};
const changeComplianceDetailView = (viewName: string) => {
  activeComplianceDetailView.value = viewName;
};
// 运维收费合规弹窗方法
const openComplianceDetailDialog = async (row: ComplianceRow) => {
  await getComplianceDetailData(row.tbComplianceId);
  complianceDetailDialogVisible.value = true;
};
const closeComplianceDetailDialog = () => {
  complianceDetailDialogVisible.value = false;
  complianceDetailSelectedRow.value = {
    tbComplianceId: '',
    tbCompliancePeriod: '',
    sysComplianceTypeName: '',
    tbComplianceChainCompliantChange: 0,
    tbRegionKeyMonitorName: '',
    tbComplianceHandledCount: 0,
    tbComplianceHandledRate: 0,
    checkDetails: [],
    nonCompliantDetails: [],
    handleRecords: [],
    nonCompliantTraceList: []
  };
  activeComplianceDetailView.value = '合规检查明细';
};
const openNonCompliantTraceDialog = async (nonCompliantItem: string) => {
  await getNonCompliantTraceData(nonCompliantItem);
  nonCompliantTraceDialogVisible.value = true;
};
const closeNonCompliantTraceDialog = () => {
  nonCompliantTraceDialogVisible.value = false;
  nonCompliantTraceList.value = [];
  currentTraceNonCompliantItem.value = '';
};
const openComplianceHandleDialog = (complianceId: string, nonCompliantItem: string) => {
  currentHandleComplianceId.value = complianceId;
  currentHandleNonCompliantItem.value = nonCompliantItem;
  complianceHandleDialogVisible.value = true;
};
const closeComplianceHandleDialog = () => {
  complianceHandleDialogVisible.value = false;
  handleForm.value.handleSolution = '';
  handleFormRef.value?.resetFields();
  currentHandleComplianceId.value = '';
  currentHandleNonCompliantItem.value = '';
};
// 运维收费合规数据刷新
const refreshComplianceData = async () => {
  await Promise.all([
    getComplianceListData(),
    getComplianceIndicatorsData(),
    getComplianceRateTrendData(),
    getComplianceNonCompliantTrendData(),
    getComplianceRegionRateCompareData(),
    getComplianceTypeRateCompareData(),
    getComplianceTypeRatioData(),
    getComplianceNonCompliantItemRatioData(),
    getComplianceRegionDistributionRatioData(),
  ]);
  complianceChartRefreshKey.value++;
  ElMessage.success('运维收费合规数据刷新成功');
};


onMounted(async () => {
  await initMapData();
  resetOrbitConfigForm();
  await Promise.all([
    getParkDeviceIndicatorsData(),
    getParkDeviceTypeRatioData(),
    getParkDeviceStatusRatioData(),
    getParkDeviceOnlineRateTrend7dData(),
    getTradeIndicatorsData(),
    getTradePayTypeRatioData(),
    getTradeRegionRatioData(),
    getTradeCountTrendData(),
    getTradeAmountTrendData(),
    getOperationIndicatorsData(),
    getOperationTypeRatioData(),
    getOperationRegionRatioData(),
    getOperationNewTrendData(),
    getOperationCompleteTrendData(),
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
    getParkingVehicleIndicatorsData(),
    getParkingVehicleTrendData(),
    getParkingVehicleListData(),
    getDeviceDistributionListData(),
    getDeviceDistributionTypeCountData(),
    getDeviceDistributionParkingCountData(),
    getTerminalDeviceListData(),
    getTerminalDeviceIndicatorsData(),
    getTerminalDeviceTypeRatioData(),
    getTerminalDeviceStatusRatioData(),
    getTerminalDeviceOnlineRateTrend7dData(),
    getTerminalDeviceFaultTrendData(),
    getMaintainTrendListData(),
    getMaintainTrendIndicatorsData(),
    getMaintainTrendNewTrendData(),
    getMaintainTrendCompletedTrendData(),
    getMaintainTrendFaultTrendData(),
    getMaintainTrendDeviceTypeCountData(),
    getMaintainTrendFaultTypeCountData(),
    getMaintainTrendFaultTypeRatioData(),
    getMaintainTrendStatusRatioData(),
    getComplianceListData(),
    getComplianceIndicatorsData(),
    getComplianceRateTrendData(),
    getComplianceNonCompliantTrendData(),
    getComplianceRegionRateCompareData(),
    getComplianceTypeRateCompareData(),
    getComplianceTypeRatioData(),
    getComplianceNonCompliantItemRatioData(),
    getComplianceRegionDistributionRatioData(),
  ]);
  setTimeout(() => {
    deviceChartRefreshKey.value++;
    tradeChartRefreshKey.value++;
    operationChartRefreshKey.value++;
    parkResourceDistributionChartRefreshKey.value++;
    deviceDistributionChartRefreshKey.value++;
    parkingSpaceChartRefreshKey.value++;
    tradeTrendChartRefreshKey.value++;
    supplyDemandChartRefreshKey.value++;
    parkAreaDistributionChartRefreshKey.value++;
    terminalDeviceChartRefreshKey.value++;
    maintainTrendChartRefreshKey.value++;
    complianceChartRefreshKey.value++;
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
              <div
                v-if="activeDeviceView === '饼图'"
                class="view-content"
                style="
                  display: flex;
                  flex-direction: column;
                  width: 100%;
                  height: 100%;
                  gap: 10px;
                "
              >
                <div style="flex: 1; width: 100%;">
                  <ChartPie3
                    :data="parkDeviceTypeRatio"
                    title="设备类型占比"
                    :key="deviceChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    flex: 1;
                    width: 100%;
                    padding-top: 10px;
                    border-top: 0.3vh solid #02a6b5;
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
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in tradeViewBtnList"
                      :key="item"
                      :type="activeTradeView === item ? 'primary' : ''"
                      plain
                      @click="changeTradeView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <button class="control-btn" @click="refreshTradeData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                </div>
              </div>
              <!-- 卡片视图 -->
              <div v-if="activeTradeView === '卡片'" class="view-content">
                <div class="indicator-cards4">
                  <div class="indicator-card4 card1">
                    <div class="indicator-title">交易总笔数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ tradeIndicators.tbTradeStatTotalCount }}</span>
                    </div>
                    <div class="indicator-unit">笔</div>
                  </div>
                  <div class="indicator-card4 card2">
                    <div class="indicator-title">交易总金额</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatNumber(tradeIndicators.tbTradeStatTotalAmount) }}</span>
                    </div>
                    <div class="indicator-unit">元</div>
                  </div>
                  <div class="indicator-card4 card3">
                    <div class="indicator-title">支付完成率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(tradeIndicators.tbTradeStatPayCompleteRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card4 card4">
                    <div class="indicator-title">环比增长</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(tradeIndicators.tbTradeStatChainGrowth) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                </div>
              </div>
              <!-- 饼图视图 -->
              <div
                v-if="activeTradeView === '饼图'"
                class="view-content"
                style="
                  display: flex;
                  flex-direction: column;
                  width: 100%;
                  height: 100%;
                  gap: 10px;
                "
              >
                <div style="flex: 1; width: 100%;">
                  <ChartPie2
                    :data="tradePayTypeRatio"
                    title="支付方式占比"
                    :key="tradeChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    flex: 1;
                    width: 100%;
                    padding-top: 10px;
                    border-top: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartPie3
                    :data="tradeRegionRatio"
                    title="区域交易占比"
                    :key="tradeChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 折线图视图 -->
              <div
                v-if="activeTradeView === '折线图'"
                class="view-content"
                style="
                  display: flex;
                  flex-direction: column;
                  width: 100%;
                  height: 100%;
                  gap: 10px;
                "
              >
                <div style="flex: 1; width: 100%;">
                  <ChartLine4
                    :data="tradeCountTrend"
                    title="统计周期内交易笔数趋势"
                    :key="tradeChartRefreshKey"
                    style="width: 100%; height: 100%;"
                  />
                </div>
                <div
                  style="
                    flex: 1;
                    width: 100%;
                    padding-top: 10px;
                    border-top: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartLine2
                    :data="tradeAmountTrend"
                    title="统计周期内交易金额趋势"
                    :key="tradeChartRefreshKey"
                    style="width: 100%; height: 100%;"
                  />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="运维服务指标" name="tab3">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in operationViewBtnList"
                      :key="item"
                      :type="activeOperationView === item ? 'primary' : ''"
                      plain
                      @click="changeOperationView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <button class="control-btn" @click="refreshOperationData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                </div>
              </div>
              <!-- 卡片视图 -->
              <div v-if="activeOperationView === '卡片'" class="view-content">
                <div class="indicator-cards4">
                  <div class="indicator-card4 card1">
                    <div class="indicator-title">工单总数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ operationIndicators.tbOperationStatWorkorderTotal }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card4 card2">
                    <div class="indicator-title">已完成数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ operationIndicators.tbOperationStatCompletedCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card4 card3">
                    <div class="indicator-title">处置完成率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(operationIndicators.tbOperationStatCompletionRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card4 card4">
                    <div class="indicator-title">平均处置时长</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(operationIndicators.tbOperationStatAverageDuration) }}</span>
                    </div>
                    <div class="indicator-unit">小时</div>
                  </div>
                  <div class="indicator-card4 card5">
                    <div class="indicator-title">满意度</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(operationIndicators.tbOperationStatSatisfactionRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                </div>
              </div>
              <!-- 饼图视图 -->
              <div
                v-if="activeOperationView === '饼图'"
                class="view-content"
                style="
                  display: flex;
                  flex-direction: column;
                  width: 100%;
                  height: 100%;
                  gap: 10px;
                "
              >
                <div style="flex: 1; width: 100%;">
                  <ChartPie3
                    :data="operationTypeRatio"
                    title="工单类型占比"
                    :key="operationChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    flex: 1;
                    width: 100%;
                    padding-top: 10px;
                    border-top: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartPie2
                    :data="operationRegionRatio"
                    title="区域工单分布占比"
                    :key="operationChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 折线图视图 -->
              <div
                v-if="activeOperationView === '折线图'"
                class="view-content"
                style="
                  display: flex;
                  flex-direction: column;
                  width: 100%;
                  height: 100%;
                  gap: 10px;
                "
              >
                <div style="flex: 1; width: 100%;">
                  <ChartLine4
                    :data="operationNewTrend"
                    title="统计周期内工单新增趋势"
                    :key="operationChartRefreshKey"
                    style="width: 100%; height: 100%;"
                  />
                </div>
                <div
                  style="
                    flex: 1;
                    width: 100%;
                    padding-top: 10px;
                    border-top: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartLine2
                    :data="operationCompleteTrend"
                    title="统计周期内工单完成趋势"
                    :key="operationChartRefreshKey"
                    style="width: 100%; height: 100%;"
                  />
                </div>
              </div>
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
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in parkingMonitorViewBtnList"
                      :key="item"
                      :type="activeParkingMonitorView === item ? 'primary' : ''"
                      plain
                      @click="changeParkingMonitorView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
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
                  <button class="control-btn" @click="refreshParkingVehicleData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
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
              <!-- 地图视图 -->
              <div v-if="activeParkingMonitorView === '地图'" class="view-content">
                <!-- 卡片叠加层 -->
                <div class="stats-overlay1">
                  <div class="stats-cards1">
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">在停车辆总数</div>
                        <div class="stat-value">{{ parkingVehicleIndicators.totalVehicleCount || 0 }} 辆</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">各区域在停数</div>
                        <div class="stat-value">{{ parkingVehicleIndicators.regionVehicleCount || 0 }} 辆</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">未支付车辆数</div>
                        <div class="stat-value">{{ parkingVehicleIndicators.unpaidVehicleCount || 0 }} 辆</div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-content">
                        <div class="stat-title">平均停车时长</div>
                        <div class="stat-value">{{ parkingVehicleIndicators.averageParkingDuration || 0 }} 分钟</div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 地图 -->
                <div style="flex: 1; width: 100%; height: 100%;">
                  <GlobalNormalMap
                    v-if="!normalMapLoading && topMiddleActiveTab === 'tab1'"
                    ref="normalMapRef"
                    id-name="parkingMap_normal"
                    :geometries-array="geometriesArray"
                    :orbit-config="orbitConfigData"
                  />
                </div>
                <!-- 折线图叠加层 -->
                <div class="chart-overlay1">
                  <div class="chart-cards1">
                    <div class="chart-card">
                      <ChartLine2
                        :data="parkingVehicleTrendData"
                        title="近2小时在停车辆变化趋势"
                        :key="parkAreaDistributionChartRefreshKey"
                        style="width:100%;height:100%"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 列表视图 -->
              <div v-if="activeParkingMonitorView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="parkingVehicleList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openParkingVehicleDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="tbVehicleLicensePlate"
                      label="车牌号码"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="tbParkingName"
                      label="停车场名称"
                      align="center"
                      min-width="150"
                    />
                    <ElTableColumn
                      prop="tbParkingSpaceSpaceNo"
                      label="泊位编号"
                      align="center"
                      width="100"
                    />
                    <ElTableColumn
                      prop="tbParkingRecordEntryTime"
                      label="入场时间"
                      align="center"
                      width="160"
                    >
                      <template #default="scope">
                        {{ formatTimeStamp(scope.row.tbParkingRecordEntryTime) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbParkingRecordExpectedExitTime"
                      label="预计离场时间"
                      align="center"
                      width="160"
                    >
                      <template #default="scope">
                        {{ formatTimeStamp(scope.row.tbParkingRecordExpectedExitTime) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbParkingRecordParkingDuration"
                      label="停车时长(分钟)"
                      align="center"
                      width="120"
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
                          @click.stop="trackParkingVehicleData(scope.row)"
                        >
                          追踪
                        </ElButton>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
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
                  <button class="control-btn" @click="refreshParkAreaDistributionData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
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
                    <button class="control-btn" @click="refreshParkingSpaceData">
                      <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                    </button>
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
                      display: flex;
                      flex-direction: column;
                      width: 100%;
                      height: 100%;
                      gap: 10px;
                    "
                  >
                    <div style="flex: 1; width: 100%;">
                      <ChartPie3
                        :data="parkingSpaceTypeRatio"
                        title="泊位类型占比"
                        :key="parkingSpaceChartRefreshKey"
                      />
                    </div>
                    <div
                      style="
                        flex: 1;
                        width: 100%;
                        padding-top: 10px;
                        border-top: 0.3vh solid #02a6b5;
                      "
                    >
                      <ChartPie2
                        :data="parkingSpaceStatusRatio"
                        title="使用状态占比"
                        :key="parkingSpaceChartRefreshKey"
                      />
                    </div>
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
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in terminalDeviceViewBtnList"
                      :key="item"
                      :type="activeTerminalDeviceView === item ? 'primary' : ''"
                      plain
                      @click="changeTerminalDeviceView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <button class="control-btn" @click="refreshTerminalDeviceData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
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
              <div v-if="activeTerminalDeviceView === '卡片'" class="view-content">
                <div class="indicator-cards4">
                  <div class="indicator-card4 card1">
                    <div class="indicator-title">设备总数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ terminalDeviceIndicators.deviceTotalCount }}</span>
                    </div>
                    <div class="indicator-unit">台</div>
                  </div>
                  <div class="indicator-card4 card2">
                    <div class="indicator-title">在线数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ terminalDeviceIndicators.deviceOnlineCount }}</span>
                    </div>
                    <div class="indicator-unit">台</div>
                  </div>
                  <div class="indicator-card4 card3">
                    <div class="indicator-title">正常运行数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ terminalDeviceIndicators.deviceNormalCount }}</span>
                    </div>
                    <div class="indicator-unit">台</div>
                  </div>
                  <div class="indicator-card4 card4">
                    <div class="indicator-title">故障数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ terminalDeviceIndicators.deviceFaultCount }}</span>
                    </div>
                    <div class="indicator-unit">台</div>
                  </div>
                  <div class="indicator-card4 card5">
                    <div class="indicator-title">待巡检数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ terminalDeviceIndicators.deviceInspectCount }}</span>
                    </div>
                    <div class="indicator-unit">台</div>
                  </div>
                </div>
              </div>
              <!-- 折线图视图 -->
              <div v-if="activeTerminalDeviceView === '折线图'" class="view-content">
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                    gap: 10px;
                  "
                >
                  <div style="flex: 1; width: 100%;">
                    <ChartLine4
                      :data="terminalDeviceOnlineRateTrend7d"
                      title="近7日设备在线率变化趋势"
                      :key="terminalDeviceChartRefreshKey"
                    />
                  </div>
                  <div
                    style="
                      flex: 1;
                      width: 100%;
                      padding-top: 10px;
                      border-top: 0.3vh solid #02a6b5;
                    "
                  >
                    <ChartLine2
                      :data="terminalDeviceFaultTrend"
                      title="近7日故障发生趋势"
                      :key="terminalDeviceChartRefreshKey"
                    />
                  </div>
                </div>
              </div>
              <!-- 饼图视图 -->
              <div v-if="activeTerminalDeviceView === '饼图'" class="view-content">
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                    gap: 10px;
                  "
                >
                  <div style="flex: 1; width: 100%;">
                    <ChartPie2
                      :data="terminalDeviceTypeRatioData"
                      title="设备类型占比"
                      :key="terminalDeviceChartRefreshKey"
                    />
                  </div>
                  <div
                    style="
                      flex: 1;
                      width: 100%;
                      padding-top: 10px;
                      border-top: 0.3vh solid #02a6b5;
                    "
                  >
                    <ChartPie3
                      :data="terminalDeviceStatusRatioData"
                      title="运行状态占比"
                      :key="terminalDeviceChartRefreshKey"
                    />
                  </div>
                </div>
              </div>
              <!-- 列表视图 -->
              <div v-if="activeTerminalDeviceView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="terminalDeviceList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openTerminalDeviceDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="tbDeviceName"
                      label="设备名称"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="tbDeviceDeviceNo"
                      label="设备编号"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="sysDeviceTypeName"
                      label="设备类型"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="tbParkingName"
                      label="所属停车场"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="sysDeviceStatusName"
                      label="运行状态"
                      align="center"
                      width="100"
                    >
                      <template #default="scope">
                        <ElTag
                          :type="scope.row.sysDeviceStatusName === '在线' ? 'success' :
                     scope.row.sysDeviceStatusName === '离线' ? 'warning' :
                     scope.row.sysDeviceStatusName === '故障' ? 'danger' : 'info'"
                        >
                          {{ scope.row.sysDeviceStatusName || '-' }}
                        </ElTag>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbDeviceOnlineDuration"
                      label="在线时长(分钟)"
                      align="center"
                      width="120"
                    />
                    <ElTableColumn
                      prop="tbDeviceLastCommTime"
                      label="最后通信时间"
                      align="center"
                      width="160"
                    >
                      <template #default="scope">
                        {{ formatTimeStamp(scope.row.tbDeviceLastCommTime) }}
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
                          type="primary"
                          size="small"
                          plain
                          @click.stop="openTerminalDeviceMaintenanceDialog(scope.row)"
                        >
                          运维
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
                  <button class="control-btn" @click="refreshTradeTrendData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
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
                  <ChartLine4
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
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in maintainTrendViewBtnList"
                      :key="item"
                      :type="activeMaintainTrendView === item ? 'primary' : ''"
                      plain
                      @click="changeMaintainTrendView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <button class="control-btn" @click="refreshMaintainTrendData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
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
              <div v-if="activeMaintainTrendView === '卡片'" class="view-content">
                <div class="indicator-cards5">
                  <div class="indicator-card5 card1">
                    <div class="indicator-title">新增工单数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ maintainTrendIndicators.totalNewCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card5 card2">
                    <div class="indicator-title">完成数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ maintainTrendIndicators.totalCompletedCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card5 card3">
                    <div class="indicator-title">完成率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(maintainTrendIndicators.completionRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card5 card4">
                    <div class="indicator-title">平均处置时长</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(maintainTrendIndicators.averageDuration) }}</span>
                    </div>
                    <div class="indicator-unit">分钟</div>
                  </div>
                  <div class="indicator-card5 card5">
                    <div class="indicator-title">未完成数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ maintainTrendIndicators.unfinishedCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                </div>
              </div>
              <!-- 折线图视图 -->
              <div v-if="activeMaintainTrendView === '折线图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 31%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartLine6
                    :data="maintainTrendNewTrendData"
                    title="工单新增趋势"
                    :key="maintainTrendChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 31%;
                    height: 100%;
                    padding-left: 0.5vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartLine5
                    :data="maintainTrendCompletedTrendData"
                    title="工单完成趋势"
                    :key="maintainTrendChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 31%;
                    height: 100%;
                    padding-left: 0.5vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartLine6
                    :data="maintainTrendFaultTrendData"
                    title="故障设备数趋势"
                    :key="maintainTrendChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 柱状图视图 -->
              <div v-if="activeMaintainTrendView === '柱状图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <VerticalBar3
                    :x-axis="maintainTrendDeviceTypeCountData.xAxis"
                    :series="maintainTrendDeviceTypeCountData.series"
                    unit="个"
                    title="各类型设备工单数量对比"
                    :key="maintainTrendChartRefreshKey"
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
                    :x-axis="maintainTrendFaultTypeCountData.xAxis"
                    :series="maintainTrendFaultTypeCountData.series"
                    unit="个"
                    title="各故障类型工单数量对比"
                    :key="maintainTrendChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 饼图视图 -->
              <div v-if="activeMaintainTrendView === '饼图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartPie1
                    :data="maintainTrendFaultTypeRatioData"
                    title="故障类型占比"
                    :key="maintainTrendChartRefreshKey"
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
                    :data="maintainTrendStatusRatioData"
                    title="工单状态占比"
                    :key="maintainTrendChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 列表视图 -->
              <div v-if="activeMaintainTrendView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="maintainTrendList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openMaintainTrendDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="tbMaintainTrendPeriod"
                      label="统计周期"
                      align="center"
                    />
                    <ElTableColumn
                      prop="tbMaintainTrendDate"
                      label="日期"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="tbMaintainTrendNewCount"
                      label="工单新增数"
                      align="center"
                    />
                    <ElTableColumn
                      prop="tbMaintainTrendCompletedCount"
                      label="工单完成数"
                      align="center"
                    />
                    <ElTableColumn
                      prop="tbMaintainTrendAverageDuration"
                      label="平均处置时长"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="tbMaintainTrendFaultDeviceCount"
                      label="故障设备数"
                      align="center"
                    />
                  </ElTable>
                </div>
              </div>
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
                  <button class="control-btn" @click="refreshParkResourceDistributionData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
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
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in deviceDistributionViewBtnList"
                      :key="item"
                      :type="activeDeviceDistributionView === item ? 'primary' : ''"
                      plain
                      @click="changeDeviceDistributionView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <button class="control-btn" @click="refreshDeviceDistributionData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
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
              <div v-if="activeDeviceDistributionView === '卡片'" class="view-content-low">
                <div class="indicator-cards3">
                  <div class="indicator-card3 card1">
                    <div class="indicator-title">设备总数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ parkDeviceIndicators.tbDeviceTotalCount }}</span>
                    </div>
                    <div class="indicator-unit">台</div>
                  </div>
                  <div class="indicator-card3 card2">
                    <div class="indicator-title">在线数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ parkDeviceIndicators.tbDeviceOnlineCount }}</span>
                    </div>
                    <div class="indicator-unit">台</div>
                  </div>
                  <div class="indicator-card3 card3">
                    <div class="indicator-title">正常运行数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ parkDeviceIndicators.tbDeviceNormalCount }}</span>
                    </div>
                    <div class="indicator-unit">台</div>
                  </div>
                  <div class="indicator-card3 card4">
                    <div class="indicator-title">故障数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ parkDeviceIndicators.tbDeviceFaultCount }}</span>
                    </div>
                    <div class="indicator-unit">台</div>
                  </div>
                </div>
              </div>
              <!-- 柱状图视图 -->
              <div v-if="activeDeviceDistributionView === '柱状图'" class="view-content-low">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <VerticalBar2
                    :x-axis="deviceDistributionTypeCountData.xAxis"
                    :series="deviceDistributionTypeCountData.series"
                    unit="台"
                    title="各类型设备数量对比"
                    :key="deviceDistributionChartRefreshKey"
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
                    :x-axis="deviceDistributionParkingCountData.xAxis"
                    :series="deviceDistributionParkingCountData.series"
                    unit="台"
                    title="各停车场设备数量对比"
                    :key="deviceDistributionChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 饼图视图 -->
              <div v-if="activeDeviceDistributionView === '饼图'" class="view-content-low">
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
                    :key="deviceDistributionChartRefreshKey"
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
                    title="运行状态占比"
                    :key="deviceDistributionChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 列表视图 -->
              <div v-if="activeDeviceDistributionView === '列表'" class="view-content-low">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="deviceDistributionList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openDeviceDistributionDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="tbDeviceName"
                      label="设备名称"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="tbDeviceDeviceNo"
                      label="设备编号"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="sysDeviceTypeName"
                      label="设备类型"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="tbParkingName"
                      label="所属停车场"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="tbDeviceInstallPosition"
                      label="安装位置"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="sysDeviceStatusName"
                      label="运行状态"
                      align="center"
                      width="100"
                    >
                      <template #default="scope">
                        <ElTag
                          :type="scope.row.sysDeviceStatusName === '正常运行' || scope.row.sysDeviceStatusName === '在线' ? 'success' :
                           scope.row.sysDeviceStatusName === '故障' ? 'danger' :
                           scope.row.sysDeviceStatusName === '离线' ? 'warning' : 'info'"
                        >
                          {{ scope.row.sysDeviceStatusName || '-' }}
                        </ElTag>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="tbDeviceInstallTime"
                      label="安装时间"
                      align="center"
                      width="120"
                    >
                      <template #default="scope">
                        {{ formatTimeStamp(scope.row.tbDeviceInstallTime) }}
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
                          type="primary"
                          size="small"
                          plain
                          @click.stop="openDeviceMaintenanceDialog(scope.row)"
                        >
                          运维
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
                  <button class="control-btn" @click="refreshSupplyDemandData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
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
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in complianceViewBtnList"
                      :key="item"
                      :type="activeComplianceView === item ? 'primary' : ''"
                      plain
                      @click="changeComplianceView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <button class="control-btn" @click="refreshComplianceData">
                    <el-icon color="#409eff" size="16"><Refresh /></el-icon>
                  </button>
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
              <div v-if="activeComplianceView === '卡片'" class="view-content">
                <div class="indicator-cards5">
                  <div class="indicator-card5 card1">
                    <div class="indicator-title">总合规率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(complianceIndicators.totalCompliantRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card5 card2">
                    <div class="indicator-title">运维合规率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(complianceIndicators.operationCompliantRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card5 card3">
                    <div class="indicator-title">收费合规率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(complianceIndicators.chargeCompliantRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card5 card4">
                    <div class="indicator-title">不合规数</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ complianceIndicators.nonCompliantCount }}</span>
                    </div>
                    <div class="indicator-unit">个</div>
                  </div>
                  <div class="indicator-card5 card5">
                    <div class="indicator-title">处理完成率</div>
                    <div class="indicator-value">
                      <span class="number-animate">{{ formatDecimal(complianceIndicators.handledRate) }}</span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                </div>
              </div>
              <!-- 折线图视图 -->
              <div v-if="activeComplianceView === '折线图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartLine4
                    :data="complianceRateTrendData"
                    title="统计周期内合规率变化趋势"
                    :key="complianceChartRefreshKey"
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
                    :data="complianceNonCompliantTrendData"
                    title="统计周期内不合规数变化趋势"
                    :key="complianceChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 柱状图视图 -->
              <div v-if="activeComplianceView === '柱状图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 49%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <VerticalBar3
                    :x-axis="complianceRegionRateCompareData.xAxis"
                    :series="complianceRegionRateCompareData.series"
                    unit="%"
                    title="各区域合规率对比"
                    :key="complianceChartRefreshKey"
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
                    :x-axis="complianceTypeRateCompareData.xAxis"
                    :series="complianceTypeRateCompareData.series"
                    unit="%"
                    title="各合规类型合规率对比"
                    :key="complianceChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 饼图视图 -->
              <div v-if="activeComplianceView === '饼图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 32%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartPie6
                    :data="complianceTypeRatioData"
                    title="合规类型占比"
                    :key="complianceChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 32%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartPie6
                    :data="complianceNonCompliantItemRatioData"
                    title="不合规项占比"
                    :key="complianceChartRefreshKey"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 32%;
                    height: 100%;
                    padding-left: 0.3vw;
                    vertical-align: top;
                    border-left: 0.3vh solid #02a6b5;
                  "
                >
                  <ChartPie6
                    :data="complianceRegionDistributionRatioData"
                    title="区域不合规分布占比"
                    :key="complianceChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 列表视图 -->
              <div v-if="activeComplianceView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="complianceList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openComplianceDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="tbCompliancePeriod"
                      label="统计周期"
                      align="center"
                      min-width="80"
                    />
                    <ElTableColumn
                      prop="sysComplianceTypeName"
                      label="合规类型"
                      align="center"
                    />
                    <ElTableColumn
                      prop="tbComplianceTotalCheck"
                      label="总检查数"
                      align="center"
                    />
                    <ElTableColumn
                      prop="tbComplianceCompliantCount"
                      label="合规数"
                      align="center"
                    />
                    <ElTableColumn
                      prop="tbComplianceNonCompliantCount"
                      label="不合规数"
                      align="center"
                    />
                    <ElTableColumn
                      prop="tbComplianceCompliantRate"
                      label="合规率(%)"
                      align="center"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.tbComplianceCompliantRate) }}
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="sysNonCompliantItemName"
                      label="主要不合规项"
                      align="center"
                      min-width="150"
                    >
                      <template #default="scope">
                        <span
                          @click.stop="openNonCompliantTraceDialog(scope.row.sysNonCompliantItemName)"
                          style="color:#409eff;cursor:pointer;text-decoration: underline;"
                        >
                          {{ scope.row.sysNonCompliantItemName }}
                        </span>
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

      <!-- 停车资源分布明细详情弹窗 -->
      <el-dialog
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
      </el-dialog>

      <!-- 泊位车位详情弹窗 -->
      <el-dialog
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
      </el-dialog>
      <!-- 释放泊位弹窗 -->
      <el-dialog
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
      </el-dialog>

      <!-- 通行交易趋势详情弹窗 -->
      <el-dialog
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
      </el-dialog>
      <!-- 时段级趋势数据弹窗 -->
      <el-dialog
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
      </el-dialog>

      <!-- 供需运营态势详情弹窗 -->
      <el-dialog
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
      </el-dialog>
      <!-- 供需分析报告弹窗 -->
      <el-dialog
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
      </el-dialog>

      <!-- 区域停车资源分布详情弹窗 -->
      <el-dialog
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
      </el-dialog>

      <!-- 在停车辆详情弹窗 -->
      <el-dialog
        v-model="parkingVehicleDetailDialogVisible"
        width="70%"
        :close-on-click-modal="false"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="在停车辆详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in parkingVehicleDetailViewBtnList"
                :key="item"
                :type="activeParkingVehicleDetailView === item ? 'primary' : ''"
                plain
                @click="changeParkingVehicleDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <div class="view-content" style="padding:0; height: 60vh; overflow-y: auto;">
          <!-- 车辆信息视图 -->
          <div v-if="activeParkingVehicleDetailView === '车辆信息'" class="view-content" style="padding:0;">
            <div style="display: flex; gap: 20px;">
              <div style="flex: 2;">
                <ElDescriptions bordered :column="2" class="desc-detail" title="基础信息">
                  <ElDescriptionsItem label="记录ID">
                    {{ parkingVehicleDetailSelectedRow.tbParkingRecordRecordId || '-' }}
                  </ElDescriptionsItem>
                  <ElDescriptionsItem label="车牌号码">
                    {{ parkingVehicleDetailSelectedRow.tbVehicleLicensePlate || '-' }}
                  </ElDescriptionsItem>
                  <ElDescriptionsItem label="支付状态">
                    <ElTag :type="parkingVehicleDetailSelectedRow.sysPayStatusName === '已支付' ? 'success' : 'warning'">
                      {{ parkingVehicleDetailSelectedRow.sysPayStatusName || '-' }}
                    </ElTag>
                  </ElDescriptionsItem>
                  <ElDescriptionsItem label="车位类型">
                    {{ parkingVehicleDetailSelectedRow.tbParkingSpaceType || '-' }}
                  </ElDescriptionsItem>
                  <ElDescriptionsItem label="区域归属">
                    {{ parkingVehicleDetailSelectedRow.tbRegionName || '-' }}
                  </ElDescriptionsItem>
                </ElDescriptions>
              </div>
              <div style="flex: 1;">
                <ElDescriptions bordered :column="1" class="desc-detail" title="车辆信息">
                  <ElDescriptionsItem label="车辆类型">
                    {{ parkingVehicleDetailSelectedRow.vehicleInfo.vehicleType || '-' }}
                  </ElDescriptionsItem>
                  <ElDescriptionsItem label="车辆颜色">
                    {{ parkingVehicleDetailSelectedRow.vehicleInfo.vehicleColor || '-' }}
                  </ElDescriptionsItem>
                  <ElDescriptionsItem label="车辆品牌">
                    {{ parkingVehicleDetailSelectedRow.vehicleInfo.vehicleBrand || '-' }}
                  </ElDescriptionsItem>
                  <ElDescriptionsItem label="车主姓名">
                    {{ parkingVehicleDetailSelectedRow.vehicleInfo.ownerName || '-' }}
                  </ElDescriptionsItem>
                  <ElDescriptionsItem label="联系电话">
                    {{ parkingVehicleDetailSelectedRow.vehicleInfo.ownerPhone || '-' }}
                  </ElDescriptionsItem>
                </ElDescriptions>
              </div>
            </div>
          </div>
          <!-- 停车记录视图 -->
          <div v-if="activeParkingVehicleDetailView === '停车记录'" class="view-content" style="padding:0;">
            <ElDescriptions bordered :column="2" class="desc-detail" title="停车记录详情">
              <ElDescriptionsItem label="停车场名称">
                {{ parkingVehicleDetailSelectedRow.tbParkingName || '-' }}
              </ElDescriptionsItem>
              <ElDescriptionsItem label="泊位编号">
                {{ parkingVehicleDetailSelectedRow.tbParkingSpaceSpaceNo || '-' }}
              </ElDescriptionsItem>
              <ElDescriptionsItem label="入场时间">
                {{ formatTimeStamp(parkingVehicleDetailSelectedRow.tbParkingRecordEntryTime) }}
              </ElDescriptionsItem>
              <ElDescriptionsItem label="预计离场时间">
                {{ formatTimeStamp(parkingVehicleDetailSelectedRow.tbParkingRecordExpectedExitTime) }}
              </ElDescriptionsItem>
              <ElDescriptionsItem label="停车时长">
                {{ parkingVehicleDetailSelectedRow.tbParkingRecordParkingDuration || 0 }} 分钟
              </ElDescriptionsItem>
              <ElDescriptionsItem label="停车费总额">
                {{ parkingVehicleDetailSelectedRow.parkingRecord.totalFee || 0 }} 元
              </ElDescriptionsItem>
              <ElDescriptionsItem label="优惠金额">
                {{ parkingVehicleDetailSelectedRow.parkingRecord.discountFee || 0 }} 元
              </ElDescriptionsItem>
              <ElDescriptionsItem label="实际支付金额">
          <span style="color: #67c23a; font-weight: bold;">
            {{ parkingVehicleDetailSelectedRow.parkingRecord.finalFee || 0 }} 元
          </span>
              </ElDescriptionsItem>
            </ElDescriptions>
          </div>
          <!-- 支付明细视图 -->
          <div v-if="activeParkingVehicleDetailView === '支付明细'" class="view-content" style="padding:0;">
            <ElDescriptions bordered :column="2" class="desc-detail" title="支付明细">
              <ElDescriptionsItem label="支付方式">
                {{ parkingVehicleDetailSelectedRow.paymentDetail.payMethod || '-' }}
              </ElDescriptionsItem>
              <ElDescriptionsItem label="支付时间">
                {{ formatTimeStamp(parkingVehicleDetailSelectedRow.paymentDetail.payTime) }}
              </ElDescriptionsItem>
              <ElDescriptionsItem label="支付金额">
                <span style="color: #409eff; font-weight: bold;">
                  {{ parkingVehicleDetailSelectedRow.paymentDetail.payAmount || 0 }} 元
                </span>
              </ElDescriptionsItem>
              <ElDescriptionsItem label="支付状态">
                <ElTag :type="parkingVehicleDetailSelectedRow.paymentDetail.payStatus === '已支付' ? 'success' : 'warning'">
                  {{ parkingVehicleDetailSelectedRow.paymentDetail.payStatus || '-' }}
                </ElTag>
              </ElDescriptionsItem>
              <ElDescriptionsItem label="发票状态">
                <ElTag :type="parkingVehicleDetailSelectedRow.paymentDetail.invoiceStatus === '已开票' ? 'success' : 'info'">
                  {{ parkingVehicleDetailSelectedRow.paymentDetail.invoiceStatus || '-' }}
                </ElTag>
              </ElDescriptionsItem>
              <ElDescriptionsItem label="交易流水号">
                {{ parkingVehicleDetailSelectedRow.paymentDetail.transactionNo || '暂无' }}
              </ElDescriptionsItem>
            </ElDescriptions>
          </div>
          <!-- 泊位位置视图 -->
          <div v-if="activeParkingVehicleDetailView === '泊位位置'" class="view-content" style="padding:0;">
            <ElDescriptions bordered :column="2" class="desc-detail" title="泊位位置信息">
              <ElDescriptionsItem label="所在楼层">
                {{ parkingVehicleDetailSelectedRow.spaceLocation.floor || '-' }}
              </ElDescriptionsItem>
              <ElDescriptionsItem label="区域">
                {{ parkingVehicleDetailSelectedRow.spaceLocation.zone || '-' }}
              </ElDescriptionsItem>
              <ElDescriptionsItem label="泊位编号">
                <span style="color: #e6a23c; font-weight: bold;">
                  {{ parkingVehicleDetailSelectedRow.spaceLocation.spaceNo || '-' }}
                </span>
              </ElDescriptionsItem>
              <ElDescriptionsItem label="经度">
                {{ parkingVehicleDetailSelectedRow.spaceLocation.longitude || 0 }}
              </ElDescriptionsItem>
              <ElDescriptionsItem label="纬度">
                {{ parkingVehicleDetailSelectedRow.spaceLocation.latitude || 0 }}
              </ElDescriptionsItem>
              <ElDescriptionsItem label="泊位状态">
                <ElTag type="success">使用中</ElTag>
              </ElDescriptionsItem>
              <ElDescriptionsItem label="车位类型">
                {{ parkingVehicleDetailSelectedRow.tbParkingSpaceType || '-' }}
              </ElDescriptionsItem>
            </ElDescriptions>
          </div>
        </div>
        <!-- 催离操作表单（始终显示） -->
        <div style="padding: 15px; background: #f5f7fa; border-radius: 4px;">
          <h3 style="margin: 0 0 15px 0; color: #409eff;">催离操作</h3>
          <el-form
            ref="urgeFormRef"
            :model="urgeForm"
            :rules="urgeFormRules"
            label-width="100px"
            style="width: 100%;"
          >
            <el-form-item label="催离原因" prop="urgeReason">
              <el-input
                v-model="urgeForm.urgeReason"
                type="textarea"
                :rows="2"
                placeholder="请输入催离原因"
              />
            </el-form-item>
            <el-form-item label="催离方式" prop="urgeMethod">
              <el-radio-group v-model="urgeForm.urgeMethod" placeholder="请选择催离方式">
                <el-radio label="短信通知" value="短信通知" />
                <el-radio label="语音播报" value="语音播报" />
                <el-radio label="人工联系" value="人工联系" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="urgeForm.remark"
                type="textarea"
                :rows="2"
                placeholder="可输入备注信息"
              />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <ElButton plain @click="closeParkingVehicleDetailDialog">关闭</ElButton>
          <ElButton type="primary" @click="urgeVehicleLeaveData">确认催离</ElButton>
        </template>
      </el-dialog>

      <!-- 终端设备分布明细详情弹窗 -->
      <el-dialog
        v-model="deviceDistributionDetailDialogVisible"
        width="60%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="终端设备分布明细详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in deviceDistributionDetailViewBtnList"
                :key="item"
                :type="activeDeviceDistributionDetailView === item ? 'primary' : ''"
                plain
                @click="changeDeviceDistributionDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <!-- 基本信息视图 -->
        <div v-if="activeDeviceDistributionDetailView === '基本信息'" class="view-content" style="padding:0;">
          <ElDescriptions bordered :column="2" class="desc-detail">
            <ElDescriptionsItem label="设备ID" span="2">
              {{ deviceDistributionDetailSelectedRow.tbDeviceDeviceId || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="设备名称">
              {{ deviceDistributionDetailSelectedRow.tbDeviceName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="设备编号">
              {{ deviceDistributionDetailSelectedRow.tbDeviceDeviceNo || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="设备类型">
              {{ deviceDistributionDetailSelectedRow.sysDeviceTypeName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="所属停车场">
              {{ deviceDistributionDetailSelectedRow.tbParkingName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="安装位置">
              {{ deviceDistributionDetailSelectedRow.tbDeviceInstallPosition || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="运行状态">
              <ElTag
                :type="deviceDistributionDetailSelectedRow.sysDeviceStatusName === '正常运行' || deviceDistributionDetailSelectedRow.sysDeviceStatusName === '在线' ? 'success' :
                 deviceDistributionDetailSelectedRow.sysDeviceStatusName === '故障' ? 'danger' :
                 deviceDistributionDetailSelectedRow.sysDeviceStatusName === '离线' ? 'warning' : 'info'"
              >
                {{ deviceDistributionDetailSelectedRow.sysDeviceStatusName || '-' }}
              </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="安装时间">
              {{ formatTimeStamp(deviceDistributionDetailSelectedRow.tbDeviceInstallTime) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="在线时长">
              {{ deviceDistributionDetailSelectedRow.tbDeviceOnlineDuration || 0 }} 小时
            </ElDescriptionsItem>
            <ElDescriptionsItem label="最近故障时间">
              {{ formatTimeStamp(deviceDistributionDetailSelectedRow.tbDeviceFaultTime) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="负责人">
              {{ deviceDistributionDetailSelectedRow.sysUserUserName || '-' }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>
        <!-- 运行数据视图 -->
        <div v-if="activeDeviceDistributionDetailView === '运行数据'" class="view-content" style="padding:0;">
          <ElDescriptions bordered :column="2" class="desc-detail">
            <ElDescriptionsItem label="设备运行率">
              {{ formatDecimal(deviceDistributionDetailSelectedRow.operationData.tbDeviceUptime) }}%
            </ElDescriptionsItem>
            <ElDescriptionsItem label="平均响应时间">
              {{ deviceDistributionDetailSelectedRow.operationData.tbDeviceResponseTime }} 毫秒
            </ElDescriptionsItem>
            <ElDescriptionsItem label="最近维护时间">
              {{ formatTimeStamp(deviceDistributionDetailSelectedRow.operationData.tbDeviceLastMaintainTime) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="下次维护时间">
              {{ formatTimeStamp(deviceDistributionDetailSelectedRow.operationData.tbDeviceNextMaintainTime) }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>
        <!-- 运维记录视图 -->
        <div v-if="activeDeviceDistributionDetailView === '运维记录'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="deviceDistributionDetailSelectedRow.maintenanceRecords"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="time"
                label="运维时间"
                align="center"
                width="180"
              >
                <template #default="scope">
                  {{ formatTimeStamp(scope.row.time) }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="type"
                label="运维类型"
                align="center"
                width="100"
              >
                <template #default="scope">
                  <ElTag :type="scope.row.type === '巡检' ? 'success' : 'warning'">
                    {{ scope.row.type || '-' }}
                  </ElTag>
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="content"
                label="运维内容"
                align="center"
                min-width="200"
              />
              <ElTableColumn
                prop="operator"
                label="操作人"
                align="center"
                width="100"
              />
              <ElTableColumn
                prop="status"
                label="状态"
                align="center"
                width="100"
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
        <template #footer>
          <ElButton plain @click="closeDeviceDistributionDetailDialog">关闭</ElButton>
        </template>
      </el-dialog>
      <!-- 运维工单弹窗 -->
      <el-dialog
        v-model="deviceMaintenanceDialogVisible"
        width="40%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="park-dialog"
        center
        destroy-on-close
        title="提交运维工单"
      >
        <el-form
          ref="maintenanceFormRef"
          :model="maintenanceForm"
          :rules="maintenanceFormRules"
          label-width="80px"
          style="width: 100%;"
        >
          <el-form-item label="运维类型" prop="maintenanceType">
            <el-radio-group
              v-model="maintenanceForm.maintenanceType"
              placeholder="请选择运维类型"
              style="width: 100%;"
            >
              <el-radio label="巡检" value="巡检" />
              <el-radio label="维修" value="维修" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="运维内容">
            <el-input
              v-model="maintenanceForm.maintenanceContent"
              type="textarea"
              :rows="4"
              placeholder="请输入运维内容（可选）"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <ElButton plain @click="closeDeviceMaintenanceDialog">取消</ElButton>
          <ElButton type="primary" @click="submitDeviceMaintenanceData(maintainingDeviceId, maintenanceForm)">提交</ElButton>
        </template>
      </el-dialog>

      <!-- 终端设备详情弹窗 -->
      <el-dialog
        v-model="terminalDeviceDetailDialogVisible"
        width="60%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="终端设备详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in terminalDeviceDetailViewBtnList"
                :key="item"
                :type="activeTerminalDeviceDetailView === item ? 'primary' : ''"
                plain
                @click="changeTerminalDeviceDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <!-- 设备参数视图 -->
        <div v-if="activeTerminalDeviceDetailView === '设备参数'" class="view-content" style="padding:0;">
          <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 20px; height:400px; width: 100%;">
            <div style="flex: 1;">
              <ElDescriptions bordered :column="3" class="desc-detail" title="基本信息">
                <ElDescriptionsItem label="设备ID">
                  {{ terminalDeviceDetailSelectedRow.tbDeviceDeviceId || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="设备名称">
                  {{ terminalDeviceDetailSelectedRow.tbDeviceName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="设备编号">
                  {{ terminalDeviceDetailSelectedRow.tbDeviceDeviceNo || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="所属停车场">
                  {{ terminalDeviceDetailSelectedRow.tbParkingName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="设备类型">
                  {{ terminalDeviceDetailSelectedRow.sysDeviceTypeName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="运行状态">
                  <ElTag :type="terminalDeviceDetailSelectedRow.sysDeviceStatusName === '在线' ? 'success' : 'warning'">
                    {{ terminalDeviceDetailSelectedRow.sysDeviceStatusName || '-' }}
                  </ElTag>
                </ElDescriptionsItem>
                <ElDescriptionsItem label="故障次数">
                  {{ terminalDeviceDetailSelectedRow.tbDeviceFaultCount || 0 }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="累计运维次数">
                  {{ terminalDeviceDetailSelectedRow.tbDeviceMaintainCount || 0 }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="下次巡检时间">
                  {{ formatTimeStamp(terminalDeviceDetailSelectedRow.tbDeviceNextInspectTime) }}
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
            <div style="flex: 1;">
              <h3>设备参数</h3>
              <ElTable
                :data="terminalDeviceDetailSelectedRow.deviceParams"
                border
                size="small"
                width="100%"
                height="200"
                table-layout="fixed"
              >
                <ElTableColumn
                  prop="paramName"
                  label="参数名称"
                  align="center"
                  width="150"
                />
                <ElTableColumn
                  prop="paramValue"
                  label="参数值"
                  align="center"
                  min-width="200"
                />
              </ElTable>
            </div>
          </div>
        </div>
        <!-- 运行日志视图 -->
        <div v-if="activeTerminalDeviceDetailView === '运行日志'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="terminalDeviceDetailSelectedRow.runLogs"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="logTime"
                label="日志时间"
                align="center"
                width="180"
              >
                <template #default="scope">
                  {{ formatTimeStamp(scope.row.logTime) }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="logContent"
                label="日志内容"
                align="center"
                min-width="300"
              />
              <ElTableColumn
                prop="logLevel"
                label="日志级别"
                align="center"
                width="100"
              >
                <template #default="scope">
                  <ElTag :type="scope.row.logLevel === 'ERROR' ? 'danger' : 'info'">
                    {{ scope.row.logLevel || '-' }}
                  </ElTag>
                </template>
              </ElTableColumn>
            </ElTable>
          </div>
        </div>
        <!-- 运维记录视图 -->
        <div v-if="activeTerminalDeviceDetailView === '运维记录'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="terminalDeviceDetailSelectedRow.maintainRecords"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="maintainTime"
                label="运维时间"
                align="center"
                width="180"
              >
                <template #default="scope">
                  {{ formatTimeStamp(scope.row.maintainTime) }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="maintainType"
                label="运维类型"
                align="center"
                width="120"
              />
              <ElTableColumn
                prop="maintainContent"
                label="运维内容"
                align="center"
                min-width="300"
              />
            </ElTable>
          </div>
        </div>
        <!-- 故障记录视图 -->
        <div v-if="activeTerminalDeviceDetailView === '故障记录'" class="view-content" style="padding:0;">
          <div style="height:400px;">
            <ElTable
              :data="terminalDeviceDetailSelectedRow.faultRecords"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="faultTime"
                label="故障时间"
                align="center"
                width="180"
              >
                <template #default="scope">
                  {{ formatTimeStamp(scope.row.faultTime) }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="faultContent"
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
          <ElButton plain @click="closeTerminalDeviceDetailDialog">关闭</ElButton>
        </template>
      </el-dialog>
      <!-- 终端设备运维弹窗 -->
      <el-dialog
        v-model="terminalDeviceMaintenanceDialogVisible"
        width="40%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="park-dialog"
        center
        destroy-on-close
        title="设备运维"
      >
        <el-form
          ref="terminalDeviceMaintenanceFormRef"
          :model="terminalDeviceMaintenanceForm"
          :rules="terminalDeviceMaintenanceFormRules"
          label-width="100px"
          style="width: 100%;"
        >
          <el-form-item label="运维类型" prop="maintenanceType">
            <el-radio-group
              v-model="terminalDeviceMaintenanceForm.maintenanceType"
              placeholder="请选择运维类型"
              style="width: 100%;"
            >
              <el-radio label="巡检" value="巡检" />
              <el-radio label="维修" value="维修" />
              <el-radio label="校准" value="校准" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="运维内容">
            <el-input
              v-model="terminalDeviceMaintenanceForm.maintenanceContent"
              type="textarea"
              :rows="4"
              placeholder="请输入运维内容（可选）"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <ElButton plain @click="closeTerminalDeviceMaintenanceDialog">取消</ElButton>
          <ElButton type="primary" @click="submitTerminalDeviceMaintenanceData(maintainingTerminalDeviceId, terminalDeviceMaintenanceForm)">提交</ElButton>
        </template>
      </el-dialog>

      <!-- 设备运维趋势详情弹窗 -->
      <el-dialog
        v-model="maintainTrendDetailDialogVisible"
        width="60%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="设备运维趋势详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in maintainTrendDetailViewBtnList"
                :key="item"
                :type="activeMaintainTrendDetailView === item ? 'primary' : ''"
                plain
                @click="changeMaintainTrendDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <!-- 工单明细视图 -->
        <div v-if="activeMaintainTrendDetailView === '工单明细'" class="view-content" style="padding:0;">
          <div style="display: flex; gap: 20px; margin-bottom: 20px; height:400px; width: 100%;">
            <div style="flex: 1;">
              <ElTable
                  :data="maintainTrendDetailSelectedRow.workOrderDetails"
                  border
                  size="small"
                  width="100%"
                  height="100%"
                  table-layout="fixed"
                >
                  <ElTableColumn
                    prop="orderNo"
                    label="工单编号"
                    align="center"
                    width="120"
                  >
                    <template #default="scope">
                  <span
                    @click="openWorkOrderDetailDialog(scope.row.orderNo)"
                    style="color:#409eff;cursor:pointer;text-decoration: underline;"
                  >
                    {{ scope.row.orderNo }}
                  </span>
                    </template>
                  </ElTableColumn>
                  <ElTableColumn
                    prop="deviceType"
                    label="设备类型"
                    align="center"
                    width="120"
                  />
                  <ElTableColumn
                    prop="faultType"
                    label="故障类型"
                    align="center"
                    width="120"
                  >
                    <template #default="scope">
                  <span
                    @click="openFaultTraceDialog(scope.row.faultType)"
                    style="color:#409eff;cursor:pointer;text-decoration: underline;"
                  >
                    {{ scope.row.faultType }}
                  </span>
                    </template>
                  </ElTableColumn>
                  <ElTableColumn
                    prop="status"
                    label="状态"
                    align="center"
                    width="100"
                  >
                    <template #default="scope">
                      <ElTag :type="scope.row.status === '已完成' ? 'success' :
                         scope.row.status === '处理中' ? 'warning' :
                         scope.row.status === '待处理' ? 'danger' : 'info'">
                        {{ scope.row.status || '-' }}
                      </ElTag>
                    </template>
                  </ElTableColumn>
                  <ElTableColumn
                    prop="duration"
                    label="处置时长(分钟)"
                    align="center"
                    width="120"
                  />
                </ElTable>
            </div>
            <div style="flex: 1;">
              <ElDescriptions bordered :column="2" class="desc-detail">
                <ElDescriptionsItem label="统计周期">
                  {{ maintainTrendDetailSelectedRow.tbMaintainTrendPeriod || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="日期">
                  {{ maintainTrendDetailSelectedRow.tbMaintainTrendDate || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="工单完成率">
                  {{ formatDecimal(maintainTrendDetailSelectedRow.tbMaintainTrendCompletionRate) }}%
                </ElDescriptionsItem>
                <ElDescriptionsItem label="环比工单增长">
                  {{ formatDecimal(maintainTrendDetailSelectedRow.tbMaintainTrendChainGrowth) }}%
                </ElDescriptionsItem>
                <ElDescriptionsItem label="完成率">
                  {{ formatDecimal(maintainTrendDetailSelectedRow.disposalSituation.completedRate) }}%
                </ElDescriptionsItem>
                <ElDescriptionsItem label="平均处置时长">
                  {{ formatDecimal(maintainTrendDetailSelectedRow.disposalSituation.avgDuration) }} 分钟
                </ElDescriptionsItem>
                <ElDescriptionsItem label="紧急工单数">
                  {{ maintainTrendDetailSelectedRow.disposalSituation.urgentCount || 0 }} 个
                </ElDescriptionsItem>
                <ElDescriptionsItem label="普通工单数">
                  {{ maintainTrendDetailSelectedRow.disposalSituation.normalCount || 0 }} 个
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
          </div>
        </div>
        <!-- 故障分布视图 -->
        <div v-if="activeMaintainTrendDetailView === '故障分布'" class="view-content" style="padding:0;">
          <div style="flex: 1;">
            <ChartPie5
              :data="maintainTrendDetailSelectedRow.faultDistribution"
              title="故障分布"
              :key="maintainTrendChartRefreshKey"
            />
          </div>
        </div>
        <!-- 处置情况视图 -->
        <div v-if="activeMaintainTrendDetailView === '处置情况'" class="view-content" style="padding:0;">
          <div style="display: flex; gap: 20px; width: 100%;">
            <div style="flex: 1;">
              <ElDescriptions bordered :column="1" class="desc-detail" title="处置概况">
                <ElDescriptionsItem label="工单总数">
                  {{ maintainTrendDetailSelectedRow.workOrderDetails.length || 0 }} 个
                </ElDescriptionsItem>
                <ElDescriptionsItem label="已完成数">
                  {{ maintainTrendDetailSelectedRow.workOrderDetails.filter(item => item.status === '已完成').length || 0 }} 个
                </ElDescriptionsItem>
                <ElDescriptionsItem label="处理中数">
                  {{ maintainTrendDetailSelectedRow.workOrderDetails.filter(item => item.status === '处理中').length || 0 }} 个
                </ElDescriptionsItem>
                <ElDescriptionsItem label="待处理数">
                  {{ maintainTrendDetailSelectedRow.workOrderDetails.filter(item => item.status === '待处理').length || 0 }} 个
                </ElDescriptionsItem>
                <ElDescriptionsItem label="平均处置时长">
                  {{ formatDecimal(maintainTrendDetailSelectedRow.disposalSituation.avgDuration) }} 分钟
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
            <div style="flex: 2;">
              <h3>故障设备列表</h3>
              <div style="height:300px;">
                <ElTable
                  :data="maintainTrendDetailSelectedRow.faultDeviceList"
                  border
                  size="small"
                  width="100%"
                  height="100%"
                  table-layout="fixed"
                >
                  <ElTableColumn
                    prop="deviceId"
                    label="设备ID"
                    align="center"
                    width="120"
                  />
                  <ElTableColumn
                    prop="deviceName"
                    label="设备名称"
                    align="center"
                    min-width="150"
                  />
                  <ElTableColumn
                    prop="deviceType"
                    label="设备类型"
                    align="center"
                    width="120"
                  />
                  <ElTableColumn
                    prop="faultType"
                    label="故障类型"
                    align="center"
                    width="120"
                  >
                    <template #default="scope">
                      <span
                        @click="openFaultTraceDialog(scope.row.faultType)"
                        style="color:#409eff;cursor:pointer;text-decoration: underline;"
                      >
                        {{ scope.row.faultType }}
                      </span>
                    </template>
                  </ElTableColumn>
                  <ElTableColumn
                    prop="faultTime"
                    label="故障时间"
                    align="center"
                    width="180"
                  >
                    <template #default="scope">
                      {{ formatTimeStamp(scope.row.faultTime) }}
                    </template>
                  </ElTableColumn>
                </ElTable>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeMaintainTrendDetailDialog">关闭</ElButton>
        </template>
      </el-dialog>
      <!-- 故障追溯弹窗 -->
      <el-dialog
        v-model="faultTraceDialogVisible"
        width="60%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        :title="`故障追溯 - ${currentTraceFaultType}`"
      >
        <div class="view-content" style="padding:0; height: 60vh; overflow-y: auto;">
          <div style="height:400px;">
            <ElTable
              :data="faultTraceList"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="deviceId"
                label="设备ID"
                align="center"
              />
              <ElTableColumn
                prop="deviceName"
                label="设备名称"
                align="center"
                min-width="150"
              />
              <ElTableColumn
                prop="deviceType"
                label="设备类型"
                align="center"
              />
              <ElTableColumn
                prop="faultType"
                label="故障类型"
                align="center"
              />
              <ElTableColumn
                prop="faultTime"
                label="故障时间"
                align="center"
                min-width="150"
              >
                <template #default="scope">
                  {{ formatTimeStamp(scope.row.faultTime) }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="workOrderNo"
                label="关联工单"
                align="center"
              >
                <template #default="scope">
                  <span
                    @click="openWorkOrderDetailDialog(scope.row.orderNo)"
                    style="color:#409eff;cursor:pointer;text-decoration: underline;"
                  >
                    {{ scope.row.orderNo }}
                  </span>
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="workOrderStatus"
                label="工单状态"
                align="center"
              >
                <template #default="scope">
                  <ElTag :type="scope.row.workOrderStatus === '已完成' ? 'success' :
                             scope.row.workOrderStatus === '处理中' ? 'warning' :
                             scope.row.workOrderStatus === '待处理' ? 'danger' : 'info'">
                    {{ scope.row.workOrderStatus || '-' }}
                  </ElTag>
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="handler"
                label="处理人"
                align="center"
              />
              <ElTableColumn
                prop="handleTime"
                label="处理时间"
                align="center"
                min-width="150"
              >
                <template #default="scope">
                  {{ scope.row.handleTime ? formatTimeStamp(scope.row.handleTime) : '-' }}
                </template>
              </ElTableColumn>
            </ElTable>
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeFaultTraceDialog">关闭</ElButton>
        </template>
      </el-dialog>
      <!-- 工单详情弹窗 -->
      <el-dialog
        v-model="workOrderDetailDialogVisible"
        width="50%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        :title="`工单详情 - ${workOrderDetailSelectedRow.orderNo}`"
      >
        <div class="view-content" style="padding:0; height: 60vh; overflow-y: auto;">
          <ElDescriptions bordered :column="2" class="desc-detail">
            <ElDescriptionsItem label="工单编号" span="2">
              {{ workOrderDetailSelectedRow.orderNo || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="工单状态" span="2">
              <ElTag :type="workOrderDetailSelectedRow.orderStatus === '已完成' ? 'success' :
                         workOrderDetailSelectedRow.orderStatus === '处理中' ? 'warning' :
                         workOrderDetailSelectedRow.orderStatus === '待处理' ? 'danger' : 'info'">
                {{ workOrderDetailSelectedRow.orderStatus || '-' }}
              </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem label="设备名称">
              {{ workOrderDetailSelectedRow.deviceName || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="设备类型">
              {{ workOrderDetailSelectedRow.deviceType || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="故障类型">
              {{ workOrderDetailSelectedRow.faultType || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="上报时间">
              {{ formatTimeStamp(workOrderDetailSelectedRow.reportTime) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="上报人">
              {{ workOrderDetailSelectedRow.reportPerson || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="处理人">
              {{ workOrderDetailSelectedRow.handler || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="处理时间">
              {{ formatTimeStamp(workOrderDetailSelectedRow.handleTime) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="处理时长">
              {{ workOrderDetailSelectedRow.handleDuration || 0 }} 分钟
            </ElDescriptionsItem>
            <ElDescriptionsItem label="处理结果" span="2">
              {{ workOrderDetailSelectedRow.handleResult || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="故障描述" span="2">
              {{ workOrderDetailSelectedRow.faultDescription || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="处理步骤" span="2">
              {{ workOrderDetailSelectedRow.handleSteps || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="使用备件">
              {{ workOrderDetailSelectedRow.partsUsed || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="维修费用">
              {{ workOrderDetailSelectedRow.cost || 0 }} 元
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>
        <template #footer>
          <ElButton plain @click="closeWorkOrderDetailDialog">关闭</ElButton>
        </template>
      </el-dialog>

      <!-- 运维收费合规详情弹窗 -->
      <el-dialog
        v-model="complianceDetailDialogVisible"
        width="70%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        title="运维收费合规详情"
      >
        <div class="header-actions" style="margin-bottom:10px;">
          <div class="actions-right">
            <div class="view-btn-group">
              <ElButton
                v-for="item in complianceDetailViewBtnList"
                :key="item"
                :type="activeComplianceDetailView === item ? 'primary' : ''"
                plain
                @click="changeComplianceDetailView(item)"
                class="view-btn"
              >
                {{ item }}
              </ElButton>
            </div>
          </div>
        </div>
        <!-- 合规检查明细视图 -->
        <div v-if="activeComplianceDetailView === '合规检查明细'" class="view-content" style="padding:0;">
          <div style="display: flex; gap: 20px; margin-bottom: 20px; width: 100%;">
            <div style="flex: 1;">
              <ElDescriptions bordered :column="2" class="desc-detail">
                <ElDescriptionsItem label="统计周期" span="2">
                  {{ complianceDetailSelectedRow.tbCompliancePeriod || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="合规类型" span="2">
                  {{ complianceDetailSelectedRow.sysComplianceTypeName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="环比合规率变化">
                  {{ formatDecimal(complianceDetailSelectedRow.tbComplianceChainCompliantChange) }}%
                </ElDescriptionsItem>
                <ElDescriptionsItem label="重点监控区域">
                  {{ complianceDetailSelectedRow.tbRegionKeyMonitorName || '-' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem label="不合规处理完成数">
                  {{ complianceDetailSelectedRow.tbComplianceHandledCount || 0 }} 个
                </ElDescriptionsItem>
                <ElDescriptionsItem label="处理完成率">
                  {{ formatDecimal(complianceDetailSelectedRow.tbComplianceHandledRate) }}%
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
            <div style="flex: 1; height:300px;">
              <ElTable
                :data="complianceDetailSelectedRow.checkDetails"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
              >
                <ElTableColumn
                  prop="checkNo"
                  label="检查编号"
                  align="center"
                  width="120"
                />
                <ElTableColumn
                  prop="checkItem"
                  label="检查项目"
                  align="center"
                  min-width="150"
                />
                <ElTableColumn
                  prop="checkResult"
                  label="检查结果"
                  align="center"
                  width="100"
                >
                  <template #default="scope">
                    <ElTag :type="scope.row.checkResult === '合规' ? 'success' : 'danger'">
                      {{ scope.row.checkResult || '-' }}
                    </ElTag>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="checkTime"
                  label="检查时间"
                  align="center"
                  width="180"
                >
                  <template #default="scope">
                    {{ formatTimeStamp(scope.row.checkTime) }}
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
        </div>
        <!-- 不合规项详情视图 -->
        <div v-if="activeComplianceDetailView === '不合规项详情'" class="view-content" style="padding:0;">
          <div style="height:300px; width: 100%;">
            <ElTable
              :data="complianceDetailSelectedRow.nonCompliantDetails"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="item"
                label="不合规项"
                align="center"
                min-width="150"
              >
                <template #default="scope">
                  <span
                    @click="openNonCompliantTraceDialog(scope.row.item)"
                    style="color:#409eff;cursor:pointer;text-decoration: underline;"
                  >
                    {{ scope.row.item }}
                  </span>
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="description"
                label="问题描述"
                align="center"
                min-width="200"
              />
              <ElTableColumn
                prop="severity"
                label="严重程度"
                align="center"
              >
                <template #default="scope">
                  <ElTag :type="scope.row.severity === '高' ? 'danger' :
                             scope.row.severity === '中' ? 'warning' : 'success'">
                    {{ scope.row.severity || '-' }}
                  </ElTag>
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="responsible"
                label="责任部门"
                align="center"
              />
              <ElTableColumn
                prop="deadline"
                label="整改期限"
                align="center"
              >
                <template #default="scope">
                  {{ formatTimeStamp(scope.row.deadline) }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                label="操作"
                align="center"
                fixed="right"
              >
                <template #default="scope">
                  <ElButton
                    type="primary"
                    size="small"
                    plain
                    @click="openComplianceHandleDialog(complianceDetailSelectedRow.tbComplianceId, scope.row.item)"
                  >
                    处理
                  </ElButton>
                </template>
              </ElTableColumn>
            </ElTable>
          </div>
        </div>
        <!-- 处理记录视图 -->
        <div v-if="activeComplianceDetailView === '处理记录'" class="view-content" style="padding:0;">
          <div style="display: flex; gap: 20px; margin-bottom: 20px; width: 100%;">
            <div style="height:300px; flex: 1;">
              <h3>处理记录：</h3>
              <ElTable
                :data="complianceDetailSelectedRow.handleRecords"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
              >
                <ElTableColumn
                  prop="recordNo"
                  label="记录编号"
                  align="center"
                />
                <ElTableColumn
                  prop="handleItem"
                  label="处理事项"
                  align="center"
                  min-width="120"
                />
                <ElTableColumn
                  prop="handlePerson"
                  label="处理人"
                  align="center"
                />
                <ElTableColumn
                  prop="handleTime"
                  label="处理时间"
                  align="center"
                >
                  <template #default="scope">
                    {{ formatTimeStamp(scope.row.handleTime) }}
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="handleResult"
                  label="处理结果"
                  align="center"
                >
                  <template #default="scope">
                    <ElTag :type="scope.row.handleResult === '已处理' ? 'success' :
                               scope.row.handleResult === '处理中' ? 'warning' : 'danger'">
                      {{ scope.row.handleResult || '-' }}
                    </ElTag>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="remark"
                  label="备注"
                  align="center"
                  min-width="150"
                />
              </ElTable>
            </div>
            <div style="height:300px; flex: 1;">
              <h3>不合规追溯列表：</h3>
              <ElTable
                :data="complianceDetailSelectedRow.nonCompliantTraceList"
                border
                size="small"
                width="100%"
                height="100%"
                table-layout="fixed"
              >
                <ElTableColumn
                  prop="recordId"
                  label="记录ID"
                  align="center"
                />
                <ElTableColumn
                  prop="nonCompliantItem"
                  label="不合规项"
                  align="center"
                >
                  <template #default="scope">
                    <span
                      @click="openNonCompliantTraceDialog(scope.row.nonCompliantItem)"
                      style="color:#409eff;cursor:pointer;text-decoration: underline;"
                    >
                      {{ scope.row.nonCompliantItem }}
                    </span>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="relatedParking"
                  label="关联停车场"
                  align="center"
                />
                <ElTableColumn
                  prop="checkTime"
                  label="检查时间"
                  align="center"
                >
                  <template #default="scope">
                    {{ formatTimeStamp(scope.row.checkTime) }}
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="status"
                  label="状态"
                  align="center"
                >
                  <template #default="scope">
                    <ElTag :type="scope.row.status === '已处理' ? 'success' :
                               scope.row.status === '处理中' ? 'warning' : 'danger'">
                      {{ scope.row.status || '-' }}
                    </ElTag>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="workOrderNo"
                  label="关联工单"
                  align="center"
                >
                  <template #default="scope">
                    {{ scope.row.workOrderNo || '暂无' }}
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeComplianceDetailDialog">关闭</ElButton>
        </template>
      </el-dialog>
      <!-- 不合规追溯弹窗 -->
      <el-dialog
        v-model="nonCompliantTraceDialogVisible"
        width="70%"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        class="park-dialog"
        center
        destroy-on-close
        :title="`不合规追溯 - ${currentTraceNonCompliantItem}`"
      >
        <div class="view-content" style="padding:0; height: 60vh; overflow-y: auto;">
          <div style="height:400px;">
            <ElTable
              :data="nonCompliantTraceList"
              border
              size="small"
              width="100%"
              height="100%"
              table-layout="fixed"
            >
              <ElTableColumn
                prop="recordId"
                label="记录ID"
                align="center"
              />
              <ElTableColumn
                prop="nonCompliantItem"
                label="不合规项"
                align="center"
              />
              <ElTableColumn
                prop="relatedParking"
                label="关联停车场"
                align="center"
              />
              <ElTableColumn
                prop="checkTime"
                label="检查时间"
                align="center"
              >
                <template #default="scope">
                  {{ formatTimeStamp(scope.row.checkTime) }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="checkPerson"
                label="检查人员"
                align="center"
              />
              <ElTableColumn
                prop="description"
                label="问题描述"
                align="center"
                min-width="200"
              />
              <ElTableColumn
                prop="severity"
                label="严重程度"
                align="center"
              >
                <template #default="scope">
                  <ElTag :type="scope.row.severity === '高' ? 'danger' :
                             scope.row.severity === '中' ? 'warning' : 'success'">
                    {{ scope.row.severity || '-' }}
                  </ElTag>
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="status"
                label="状态"
                align="center"
              >
                <template #default="scope">
                  <ElTag :type="scope.row.status === '已处理' ? 'success' :
                             scope.row.status === '处理中' ? 'warning' : 'danger'">
                    {{ scope.row.status || '-' }}
                  </ElTag>
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="workOrderNo"
                label="关联工单"
                align="center"
              >
                <template #default="scope">
                  {{ scope.row.workOrderNo || '暂无' }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="handlePerson"
                label="处理人"
                align="center"
              />
              <ElTableColumn
                prop="handleTime"
                label="处理时间"
                align="center"
              >
                <template #default="scope">
                  {{ scope.row.handleTime ? formatTimeStamp(scope.row.handleTime) : '-' }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="handleResult"
                label="处理结果"
                align="center"
                min-width="150"
              />
            </ElTable>
          </div>
        </div>
        <template #footer>
          <ElButton plain @click="closeNonCompliantTraceDialog">关闭</ElButton>
        </template>
      </el-dialog>
      <!-- 不合规项处理弹窗 -->
      <el-dialog
        v-model="complianceHandleDialogVisible"
        width="40%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="park-dialog"
        center
        destroy-on-close
        :title="`不合规项处理 - ${currentHandleNonCompliantItem}`"
      >
        <el-form
          ref="handleFormRef"
          :model="handleForm"
          :rules="handleFormRules"
          label-width="100px"
          style="width: 100%;"
        >
          <el-form-item label="处理方案" prop="handleSolution">
            <el-input
              v-model="handleForm.handleSolution"
              type="textarea"
              :rows="6"
              placeholder="请输入详细的处理方案，包括整改措施、责任人、完成时限等"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <ElButton plain @click="closeComplianceHandleDialog">取消</ElButton>
          <ElButton type="primary" @click="handleNonCompliantItemData">确认提交</ElButton>
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
@import '../../../templatesstyle/global-data-map';
@import '../../../templatesstyle/table1';
@import '../../../templatesstyle/table2-rank';
@import '../../../templatesstyle/table3';
@import '../../../templatesstyle/table4';
@import '../../../templatesstyle/indicator-cards3';
@import '../../../templatesstyle/indicator-cards4';
@import '../../../templatesstyle/indicator-cards5';
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
</style>
