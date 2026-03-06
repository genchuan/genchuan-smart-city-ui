<script setup lang="ts">
import {getCurrentInstance, nextTick, onMounted, onUnmounted, ref} from 'vue';
import { useRouter } from 'vue-router';
import { Filter, FullScreen, Setting, VideoPause, VideoPlay } from '@element-plus/icons-vue';
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
  ElDescriptions,
  ElDescriptionsItem,
  ElTabPane,
  ElTabs,
  ElTag
} from 'element-plus';
import screenFull from 'screenfull';

import {
  fetchCarTrackGeometries, fetchCarTrackIndicators, fetchCarTrackSingleTrend, fetchMaintainDeptOnDutyCompare,
  fetchMaintainStaffGeometries, fetchMaintainStaffIndicators, fetchParkingResourceGeometries, fetchParkPanoramaIndicators,
  fetchParkPanoramaResourceTypeRatio, fetchParkPanoramaSpaceTypeRatio, fetchParkResourceAreaCompare, fetchParkResourceAreaRatio,
  fetchParkResourceIndicators, fetchParkResourceList, fetchParkResourceTrend, fetchParkResourceTypeCompare, fetchSparePartIndicators,
  fetchSparePartInOutTrend, fetchSparePartList, fetchSparePartTypeRatio,
  fetchTerminalDeviceList,
  fetchTerminalDeviceIndicators,
  fetchTerminalDeviceOnlineTrend,
  fetchTerminalDeviceTypeRatio,
  fetchTerminalDeviceStatusRatio,
  fetchTerminalDeviceAreaFaultCount,
  fetchTerminalDeviceTypeFaultCount,
  fetchTerminalDeviceDetail,
  submitDeviceDisposal,
  submitDeviceMaintenance,
  fetchDeviceResourceEfficiencyList,
  fetchDeviceResourceEfficiencyIndicators,
  fetchDeviceResourceEfficiencyTypeCompare,
  fetchDeviceResourceEfficiencyTrend,
  fetchDeviceResourceEfficiencyAreaRatio,
  fetchDeviceResourceEfficiencyDetail,
  submitDeviceMaintenanceOrder,
  fetchKeyPersonnelList,
  fetchKeyPersonnelIndicators,
  fetchKeyPersonnelAreaCount,
  fetchKeyPersonnelRoleRatio,
  fetchKeyPersonnelDetail,
  submitDispatchTask,
  submitPersonnelMessage,
} from '#/api/genchuan/industry/parkingmgmt/overview/ResourceMonitor.ts';
import ChartLine1 from '#/views/genchuan/industry/templatesstatchart/ChartLine1.vue';
import ChartLine2 from '#/views/genchuan/industry/templatesstatchart/ChartLine2.vue';
import ChartPie1 from '#/views/genchuan/industry/templatesstatchart/ChartPie1.vue';
import ChartPie2 from '#/views/genchuan/industry/templatesstatchart/ChartPie2.vue';
import VerticalBar1 from '#/views/genchuan/industry/templatesstatchart/VerticalBar1.vue';
import VerticalBar2 from '#/views/genchuan/industry/templatesstatchart/VerticalBar2.vue';
import VerticalBar3 from '#/views/genchuan/industry/templatesstatchart/VerticalBar3.vue';
import MapCommon2 from './ResourceMonitorMap2.vue';
import MapCommon3 from './ResourceMonitorMap3.vue';
import MapCommon4 from './ResourceMonitorMap4.vue';


const pageContainerRef = ref<HTMLElement | null>(null);
const router = useRouter();
const instance = getCurrentInstance();
const currentFullscreenPanel = ref<HTMLElement | null>(null);

// 地图加载状态
const map2Loading = ref<boolean>(true);
const map3Loading = ref<boolean>(true);
const map4Loading = ref<boolean>(true);
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
const initSparePartNumberAnimations = () => {
  document.querySelectorAll<HTMLElement>('.spare-part-number-animate').forEach((el) =>
    animateValue(el, 0, Number.parseFloat(el.dataset.value || '0'), 1500)
  );
};
const initParkResourceNumberAnimations = () => {
  document.querySelectorAll<HTMLElement>('.park-resource-number-animate').forEach((el) =>
    animateValue(el, 0, Number.parseFloat(el.dataset.value || '0'), 1500)
  );
};
const initDeviceResourceEfficiencyNumberAnimations = () => {
  const elements = document.querySelectorAll('.device-resource-efficiency-number-animate');
  elements.forEach((el) => {
    const value = Number.parseFloat(el.dataset.value);
    animateValue(el, 0, value, 1500);
  });
};
const initKeyPersonnelNumberAnimations = () => {
  const elements = document.querySelectorAll('.key-personnel-number-animate');
  elements.forEach((el) => {
    const value = Number.parseFloat(el.dataset.value);
    animateValue(el, 0, value, 1500);
  });
};
const initTerminalDeviceNumberAnimations = () => {
  const elements = document.querySelectorAll('.terminal-device-number-animate');
  elements.forEach((el) => {
    const value = Number.parseFloat(el.dataset.value);
    animateValue(el, 0, value, 1500);
  });
};

// 时间戳格式化方法
const formatNumber = (num: number) => {
  return num.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
};
const formatDecimal = (num: number) => num.toFixed(1);

// 格式化设备时间戳
const formatDeviceTimeStamp = (timeStamp: any): string => {
  if (!timeStamp) return '-';
  const d = new Date(Number(timeStamp));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
// 格式化监控数据
const formatMonitorData = (data: any): string => data ? `电压:${data.voltage}V | 信号:${data.signalStrength}dBm` : '-';
// 格式化备件时间戳
const formatSparePartTimeStamp = (timeStamp: any): string => formatDeviceTimeStamp(timeStamp);

// 地图组件引用
const mapCommon2Ref = ref<MapComponentInstance | null>(null);
const mapCommon3Ref = ref<MapComponentInstance | null>(null);
const mapCommon4Ref = ref<MapComponentInstance | null>(null);
const mapCommon3Ref_Top = ref<MapComponentInstance | null>(null);
const mapCommon4Ref_Top = ref<MapComponentInstance | null>(null);
// 地图数据
const maintainStaffGeometries = ref<MaintainStaffGeometryItem[]>([]);
const parkResourceGeometries = ref<ParkResourceGeometryItem[]>([]);
const carTrackGeometries = ref<CarTrackGeometryItem[]>([]);
const map = ref<any>(null);
// 地图环绕配置相关
// 获取存储的环绕配置
const getStoredOrbitConfig = (): OrbitConfig => {
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
    pitch: 0,
    zoom: 12,
    loop: true
  };
};
// 保存环绕配置到本地存储
const saveOrbitConfigToLocal = (config: OrbitConfig) => {
  try {
    localStorage.setItem('parkingMapOrbitConfig', JSON.stringify(config));
  } catch (error) {
    console.error('保存地图配置失败:', error);
    ElMessage.warning('配置暂无法持久化，刷新后恢复默认值');
  }
};
// 环绕配置弹窗可见性
const orbitConfigDialogVisible = ref<boolean>(false);
// 环绕配置表单引用
const orbitConfigFormRef = ref<FormInstance | null>(null);
// 环绕配置表单数据
const orbitConfigForm = ref({
  centerLat: getStoredOrbitConfig().center.lat,
  centerLng: getStoredOrbitConfig().center.lng,
  rotateSpeed: getStoredOrbitConfig().rotateSpeed,
  pitch: getStoredOrbitConfig().pitch,
  zoom: getStoredOrbitConfig().zoom,
  loop: getStoredOrbitConfig().loop,
});
// 环绕配置验证规则
const orbitConfigRules = ref({
  centerLat: [{
    required: true,
    type: 'number',
    min: -90,
    max: 90,
    message: '请输入有效的纬度（-90~90）',
    trigger: 'blur'
  }],
  centerLng: [{
    required: true,
    type: 'number',
    min: -180,
    max: 180,
    message: '请输入有效的经度（-180~180）',
    trigger: 'blur'
  }],
  rotateSpeed: [{
    required: true,
    type: 'number',
    min: 0.01,
    message: '旋转速度不能小于0.01',
    trigger: 'blur'
  }],
  pitch: [{
    required: true,
    type: 'number',
    min: 0,
    max: 80,
    message: '俯仰角范围0~80',
    trigger: 'blur'
  }],
  zoom: [{
    required: true,
    type: 'number',
    min: 1,
    max: 20,
    message: '缩放级别范围1~20',
    trigger: 'blur'
  }],
});
// 当前环绕配置数据
const orbitConfigData = ref<OrbitConfig>(getStoredOrbitConfig());

// ========== TS 类型定义 ==========
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

// 设备资源效能TS类型定义
interface DeviceResourceEfficiencyRow {
  id: string; // ID
  sysEquipmentTypeName: string; // 设备类型
  sysAreaAreaName: string; // 区域名称
  sysStatCycleName: string; // 统计周期
  parkDeviceEfficiencyDeviceOperationEfficiency: number; // 设备运行效率
  parkDeviceEfficiencyFaultRepairRate: number; // 故障修复率
  parkDeviceEfficiencyAverageFaultFreeDuration: number; // 平均无故障运行时长
}
interface DeviceResourceEfficiencyIndicators {
  avgOperationEfficiency: number; // 设备平均运行效率
  avgFaultFreeDuration: number; // 平均无故障时长
  avgFaultRepairRate: number; // 平均故障修复率
}
interface DeviceResourceEfficiencyDetail {
  id: string;
  sysEquipmentTypeName: string;
  sysAreaAreaName: string;
  sysStatCycleName: string;
  parkDeviceEfficiencyDeviceOperationEfficiency: number;
  parkDeviceEfficiencyFaultRepairRate: number;
  parkDeviceEfficiencyAverageFaultFreeDuration: number;
  // 详情字段
  parkDeviceEfficiencyYoyGrowthRate: number; // 同比增长率
  parkDeviceEfficiencyMomGrowthRate: number; // 环比增长率
  parkDeviceEfficiencyLowEfficiencyCount: number; // 低效设备数量
  parkDeviceEfficiencyMaintenanceSuggestion: string; // 维护建议
  // 效能计算明细
  efficiencyCalculationDetails: {
    item: string;
    value: string;
    standard: string;
  }[];
  // 设备故障记录
  faultRecords: {
    faultTime: string;
    faultType: string;
    repairTime: string;
    status: string;
  }[];
  // 运行日志
  operationLogs: {
    time: string;
    operation: string;
    operator: string;
    result: string;
  }[];
}
interface MaintenanceOrderForm {
  maintenanceType: string; // 维护类型
  maintenanceTime: string; // 维护时间
}
// 维护类型选项
const maintenanceTypeOptions = [
  { label: '预防性维护', value: 'preventive' },
  { label: '故障修复', value: 'repair' },
  { label: '定期检查', value: 'inspection' },
  { label: '软件升级', value: 'upgrade' },
  { label: '硬件更换', value: 'replacement' },
];

// 关键岗位人员TS类型定义
interface KeyPersonnelRow {
  sysUserUserId: string;
  sysUserUserName: string;
  sysRoleRoleName: string;
  sysAreaAreaName: string;
  sysOnlineStatusName: string;
  sysMerchantMerchantName: string;
}
interface KeyPersonnelIndicators {
  totalPersonnelCount: number; // 各岗位人员总数
  onlinePersonnelCount: number; // 在线人数
}
interface KeyPersonnelDetail {
  sysUserUserId: string;
  sysUserUserName: string;
  sysUserUserPhone: string;
  sysUserOnDutyTime: string;
  taskAllTableTaskName: string;
  sysOperationLogOperateTime: string;
  // 详情字段
  sysRoleRoleName: string;
  sysAreaAreaName: string;
  sysOnlineStatusName: string;
  sysMerchantMerchantName: string;
  // 权限范围
  permissionScope: {
    scope: string;
    value: string;
  }[];
  // 操作日志
  operationLogs: {
    time: string;
    operation: string;
    result: string;
  }[];
}
interface DispatchTaskForm {
  taskContent: string;
  deadline: string;
}
interface PersonnelMessageForm {
  messageContent: string;
}

// 运维人员相关类型
interface MaintainStaffGeometryItem {
  maintainLatitude: number; // 运维人员纬度
  maintainLongitude: number; // 运维人员经度
  latitude: number; // 纬度
  longitude: number; // 经度
  [key: string]: any; // 其他字段
}
interface MaintainStaffIndicatorData {
  totalStaffCount: number; // 总运维人数
  onDutyCount: number; // 在岗人数
  taskCount: number; // 任务数量
}

// 资源全景相关类型
interface ParkResourceGeometryItem {
  [key: string]: any; // 资源几何数据字段
}
interface ParkPanoramaIndicatorData {
  totalResourceCount: number; // 总资源数
  availableResourceCount: number; // 可用资源数
  normalOperateCount: number; // 正常运营数
  normalOperateRate: number; // 正常运营率
}

// 车辆轨迹相关类型
interface CarTrackGeometryItem {
  carLatitude: number; // 车辆纬度
  carLongitude: number; // 车辆经度
  latitude: number; // 纬度
  longitude: number; // 经度
  [key: string]: any; // 其他字段
}
interface CarTrackIndicatorData {
  todayPassCarCount: number; // 今日通行车辆数
  abnormalCarCount: number; // 异常车辆数
}

// 终端设备状态TS类型定义
interface TerminalDeviceRow {
  tbDeviceExtendDeviceCode: string;
  sysEquipmentTypeName: string;
  tbAssetExtendName: string;
  sysOperationStatusName: string;
  parkDeviceMonitorDataContent: string;
  sysAreaAreaName: string;
}
interface TerminalDeviceIndicators {
  totalDeviceCount: number; // 总设备数
  onlineDeviceCount: number; // 在线设备数
  faultDeviceCount: number; // 故障设备数
}
interface TerminalDeviceDetail {
  tbDeviceExtendDeviceCode: string;
  tbDeviceExtendOfflineTime: string;
  sysFaultTypeName: string;
  sysMaintainUserUserName: string;
  tbDeviceExtendNextMaintainTime: string;
  // 详情字段
  sysEquipmentTypeName: string;
  tbAssetExtendName: string;
  sysOperationStatusName: string;
  parkDeviceMonitorDataContent: string;
  sysAreaAreaName: string;
  // 监控日志
  monitorLogs: {
    time: string;
    data: string;
    status: string;
  }[];
  // 故障记录
  faultRecords: {
    time: string;
    type: string;
    duration: string;
    result: string;
  }[];
}
interface DeviceDisposalForm {
  disposalMeasures: string;
  disposalEvidence: File[];
}
interface DeviceMaintenanceForm {
  maintenanceType: string;
  maintenanceTime: string;
}

// 备品备件相关类型
interface SparePartRow {
  sparePartId: string; // 备件ID
  partType: string; // 备件类型
  partName: string; // 备件名称
  partCode: string; // 备件编码
  currentStock: number; // 当前库存
  minimumStock: number; // 最低库存
  unit: string; // 单位
  warehouseArea: string; // 仓库区域
  lastUpdateTime: number; // 最后更新时间
}
interface SparePartIndicators {
  totalPartTypeCount: number; // 备件类型总数
  enoughStockCount: number; // 库存充足数
  lackStockCount: number; // 库存不足数
}

// 停车资源效能相关类型
interface ParkResourceRow {
  parkingId: string; // 停车场ID
  parkingName: string; // 停车场名称
  parkingType: string; // 停车场类型
  areaCode: string; // 区域代码
  turnoverRate: number; // 周转率
  utilizationRate: number; // 利用率
  totalSpaces: number; // 总车位数
  availableSpaces: number; // 可用车位数
  lastUpdateTime: number; // 最后更新时间
}
interface ParkResourceIndicators {
  avgTurnoverRate: number; // 平均周转率
  avgUtilizationRate: number; // 平均利用率
}

// 地图组件实例类型
interface MapComponentInstance {
  toggleOrbitAnimation: () => void;
  stopOrbitAnimation: () => void;
  startOrbitAnimation: () => void;
}
// 地图环绕配置类型
interface OrbitConfig {
  center: {
    lat: number; // 中心点纬度
    lng: number; // 中心点经度
  };
  rotateSpeed: number; // 旋转速度
  pitch: number; // 俯仰角
  zoom: number; // 缩放级别
  loop: boolean; // 是否循环
}
// 表单实例类型
interface FormInstance {
  validate: () => Promise<boolean>;
  resetFields: () => void;
  [key: string]: any;
}

// ========== 响应式数据定义 ==========
// 设备资源效能响应式数据
const deviceResourceEfficiencyList = ref<DeviceResourceEfficiencyRow[]>([]);
const deviceResourceEfficiencyIndicators = ref<DeviceResourceEfficiencyIndicators>({
  avgOperationEfficiency: 0,
  avgFaultFreeDuration: 0,
  avgFaultRepairRate: 0,
});
const deviceResourceEfficiencyTypeCompareData = ref<ChartBarData>({ xAxis: [], series: [] });
const deviceResourceEfficiencyTrendData = ref<ChartLineData>({ xAxis: [], series: [] });
const deviceResourceEfficiencyAreaRatioData = ref<ChartRatioData>({ legend: [], series: [] });
// 设备资源效能视图切换相关
const deviceResourceEfficiencyChartRefreshKey = ref(0);
const activeDeviceResourceEfficiencyView = ref('卡片');
const deviceResourceEfficiencyViewBtnList = ref(['卡片', '柱状图', '折线图', '饼图', '列表']);
// 设备资源效能弹窗相关
const deviceResourceEfficiencyDetailDialogVisible = ref(false);
const deviceResourceEfficiencyMaintenanceDialogVisible = ref(false);
const activeDeviceResourceEfficiencyDetailView = ref('效能计算明细');
const deviceResourceEfficiencyDetailViewBtnList = ref(['效能计算明细', '设备故障记录', '运行日志']);
const deviceResourceEfficiencyDetailSelectedRow = ref<DeviceResourceEfficiencyDetail>({
  id: '',
  sysEquipmentTypeName: '',
  sysAreaAreaName: '',
  sysStatCycleName: '',
  parkDeviceEfficiencyDeviceOperationEfficiency: 0,
  parkDeviceEfficiencyFaultRepairRate: 0,
  parkDeviceEfficiencyAverageFaultFreeDuration: 0,
  parkDeviceEfficiencyYoyGrowthRate: 0,
  parkDeviceEfficiencyMomGrowthRate: 0,
  parkDeviceEfficiencyLowEfficiencyCount: 0,
  parkDeviceEfficiencyMaintenanceSuggestion: '',
  efficiencyCalculationDetails: [],
  faultRecords: [],
  operationLogs: []
});
// 维护工单表单
const maintenanceOrderForm = ref<MaintenanceOrderForm>({
  maintenanceType: '',
  maintenanceTime: ''
});
const maintenanceOrderFormRules = {
  maintenanceType: [{ required: true, message: '维护类型不能为空', trigger: 'blur' }],
  maintenanceTime: [{ required: true, message: '维护时间不能为空', trigger: 'blur' }]
};
const maintenanceOrderFormRef = ref<FormInstance>();

// 关键岗位人员响应式数据
const keyPersonnelList = ref<KeyPersonnelRow[]>([]);
const keyPersonnelIndicators = ref<KeyPersonnelIndicators>({
  totalPersonnelCount: 0,
  onlinePersonnelCount: 0,
});
const keyPersonnelAreaCountData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '人员数量', data: [] }],
});
const keyPersonnelRoleRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '岗位角色占比(%)', data: [] }],
});
// 关键岗位人员视图切换相关
const keyPersonnelChartRefreshKey = ref(0);
const activeKeyPersonnelView = ref('卡片');
const keyPersonnelViewBtnList = ref(['卡片', '柱状图', '饼图', '列表']);
// 关键岗位人员弹窗相关
const keyPersonnelDetailDialogVisible = ref(false);
const keyPersonnelDispatchDialogVisible = ref(false);
const keyPersonnelMessageDialogVisible = ref(false);
const activeKeyPersonnelDetailView = ref('人员详情');
const keyPersonnelDetailViewBtnList = ref(['人员详情', '权限范围', '操作日志']);
const keyPersonnelDetailSelectedRow = ref<KeyPersonnelDetail>({
  sysUserUserId: '',
  sysUserUserName: '',
  sysUserUserPhone: '',
  sysUserOnDutyTime: '',
  taskAllTableTaskName: '',
  sysOperationLogOperateTime: '',
  sysRoleRoleName: '',
  sysAreaAreaName: '',
  sysOnlineStatusName: '',
  sysMerchantMerchantName: '',
  permissionScope: [],
  operationLogs: []
});
// 调度表单
const dispatchTaskForm = ref<DispatchTaskForm>({
  taskContent: '',
  deadline: ''
});
const dispatchTaskFormRules = {
  taskContent: [{ required: true, message: '任务内容不能为空', trigger: 'blur' }],
  deadline: [{ required: true, message: '完成时限不能为空', trigger: 'blur' }]
};
const dispatchTaskFormRef = ref<FormInstance>();
// 留言表单
const personnelMessageForm = ref<PersonnelMessageForm>({
  messageContent: ''
});
const personnelMessageFormRules = {
  messageContent: [{ required: true, message: '留言内容不能为空', trigger: 'blur' }]
};
const personnelMessageFormRef = ref<FormInstance>();

// 终端设备状态响应式数据
const terminalDeviceList = ref<TerminalDeviceRow[]>([]);
const terminalDeviceIndicators = ref<TerminalDeviceIndicators>({
  totalDeviceCount: 0,
  onlineDeviceCount: 0,
  faultDeviceCount: 0,
});
const terminalDeviceOnlineTrendData = ref<ChartLineData>({
  xAxis: [],
  series: [{ name: '在线率(%)', data: [] }],
});
const terminalDeviceTypeRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '设备类型占比(%)', data: [] }],
});
const terminalDeviceStatusRatioData = ref<ChartRatioData>({
  legend: [],
  series: [{ name: '运行状态占比(%)', data: [] }],
});
const terminalDeviceAreaFaultCountData = ref<ChartBarData>({
  xAxis: [],
  series: [{ name: '故障数量', data: [] }],
});
const terminalDeviceTypeFaultCountData = ref<ChartBarData>({
  xAxis: [],
  series: [{ name: '故障数量', data: [] }],
});
// 终端设备状态视图切换相关
const terminalDeviceChartRefreshKey = ref(0);
const activeTerminalDeviceView = ref('卡片');
const terminalDeviceViewBtnList = ref(['卡片', '折线图', '饼图', '柱状图', '列表']);
// 终端设备状态弹窗相关
const terminalDeviceDetailDialogVisible = ref(false);
const terminalDeviceDisposalDialogVisible = ref(false);
const terminalDeviceMaintenanceDialogVisible = ref(false);
const activeTerminalDeviceDetailView = ref('设备详情');
const terminalDeviceDetailViewBtnList = ref(['设备详情', '监控日志', '故障记录']);
const terminalDeviceDetailSelectedRow = ref<TerminalDeviceDetail>({
  tbDeviceExtendDeviceCode: '',
  tbDeviceExtendOfflineTime: '',
  sysFaultTypeName: '',
  sysMaintainUserUserName: '',
  tbDeviceExtendNextMaintainTime: '',
  sysEquipmentTypeName: '',
  tbAssetExtendName: '',
  sysOperationStatusName: '',
  parkDeviceMonitorDataContent: '',
  sysAreaAreaName: '',
  monitorLogs: [],
  faultRecords: []
});
// 处置表单
const deviceDisposalForm = ref<DeviceDisposalForm>({
  disposalMeasures: '',
  disposalEvidence: []
});
const deviceDisposalFormRules = {
  disposalMeasures: [{ required: true, message: '处置措施不能为空', trigger: 'blur' }]
};
const deviceDisposalFormRef = ref<FormInstance>();
// 维护表单
const deviceMaintenanceForm = ref<DeviceMaintenanceForm>({
  maintenanceType: '',
  maintenanceTime: ''
});
const deviceMaintenanceFormRules = {
  maintenanceType: [{ required: true, message: '维护类型不能为空', trigger: 'blur' }],
  maintenanceTime: [{ required: true, message: '维护时间不能为空', trigger: 'blur' }]
};
const deviceMaintenanceFormRef = ref<FormInstance>();

// 运维人员指标数据
const maintainStaffIndicatorData = ref<MaintainStaffIndicatorData>({
  totalStaffCount: 0,
  onDutyCount: 0,
  taskCount: 0
});

// 资源全景指标数据
const parkPanoramaIndicatorData = ref<ParkPanoramaIndicatorData>({
  totalResourceCount: 0,
  availableResourceCount: 0,
  normalOperateCount: 0,
  normalOperateRate: 0
});

// 车辆轨迹指标数据
const carTrackIndicatorData = ref<CarTrackIndicatorData>({
  todayPassCarCount: 0,
  abnormalCarCount: 0
});

// 部门对比数据
const maintainDeptCompareData = ref<ChartBarData>({
  xAxis: [],
  series: []
});

// 车辆轨迹趋势数据
const carTrackSingleTrendData = ref<ChartLineData>({
  xAxis: [],
  series: []
});

// 资源类型占比数据
const parkResourceTypeRatioData = ref<ChartRatioData>({
  legend: [],
  series: []
});

// 空间类型占比数据
const parkSpaceTypeRatioData = ref<ChartRatioData>({
  legend: [],
  series: []
});


// ========== 备品备件相关响应式数据 ==========
const sparePartPanelRef = ref<HTMLElement | null>(null);
const sparePartList = ref<SparePartRow[]>([]);
const sparePartIndicators = ref<SparePartIndicators>({
  totalPartTypeCount: 0,
  enoughStockCount: 0,
  lackStockCount: 0
});
const sparePartInOutTrendData = ref<ChartLineData>({
  xAxis: [],
  series: []
});
const sparePartTypeRatioData = ref<ChartRatioData>({
  legend: [],
  series: []
});
const sparePartBaseFontScale = ref<number>(1);
const sparePartActiveIndices = ref<number[]>([]);
const sparePartChartRefreshKey = ref<number>(0);
const activeSparePartView = ref<string>('卡片');
const sparePartViewBtnList = ref<string[]>(['卡片', '柱状图', '饼图', '列表']);

// ========== 停车资源相关响应式数据 ==========
const parkResourcePanelRef = ref<HTMLElement | null>(null);
const parkMap2Ref = ref<HTMLElement | null>(null);
const parkMap3Ref = ref<HTMLElement | null>(null);
const parkMap4Ref = ref<HTMLElement | null>(null);
const parkResourceList = ref<ParkResourceRow[]>([]);
const parkResourceIndicators = ref<ParkResourceIndicators>({
  avgTurnoverRate: 0,
  avgUtilizationRate: 0
});
const parkResourceTrendData = ref<ChartLineData>({
  xAxis: [],
  series: []
});
const parkResourceAreaRatioData = ref<ChartRatioData>({
  legend: [],
  series: []
});
const parkResourceAreaCompareData = ref<ChartBarData>({
  xAxis: [],
  series: []
});
const parkResourceTypeCompareData = ref<ChartBarData>({
  xAxis: [],
  series: []
});
const parkResourceBaseFontScale = ref<number>(1);
const parkResourceActiveIndices = ref<number[]>([]);
const parkResourceChartRefreshKey = ref<number>(0);
const activeParkResourceView = ref<string>('柱状图');
const parkResourceViewBtnList = ref<string[]>(['卡片', '柱状图', '列表', '折线图', '饼图']);


// ========== 方法定义 ==========
// 处理运维人员地图环绕动画
const handleOrbitAnimation2 = () => {
  if (mapCommon2Ref.value && typeof mapCommon2Ref.value.toggleOrbitAnimation === 'function') {
    mapCommon2Ref.value.toggleOrbitAnimation();
  } else {
    ElMessage.warning('运维人员地图环绕功能暂未初始化完成');
  }
};
// 处理资源全景地图环绕动画
const handleOrbitAnimation3 = () => {
  const targetRef = mapCommon3Ref_Top.value || mapCommon3Ref.value;
  if (targetRef && typeof targetRef.toggleOrbitAnimation === 'function') {
    targetRef.toggleOrbitAnimation();
  } else {
    ElMessage.warning('资源全景地图环绕功能暂未初始化完成');
  }
};
// 处理车辆轨迹地图环绕动画
const handleOrbitAnimation4 = () => {
  const targetRef = mapCommon4Ref_Top.value || mapCommon4Ref.value;
  if (targetRef && typeof targetRef.toggleOrbitAnimation === 'function') {
    targetRef.toggleOrbitAnimation();
  } else {
    ElMessage.warning('车辆轨迹地图环绕功能暂未初始化完成');
  }
};
// 重置环绕配置表单
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
// 提交环绕配置
const submitOrbitConfig = async () => {
  try {
    await orbitConfigFormRef.value?.validate();
    const newConfig: OrbitConfig = {
      center: {
        lat: orbitConfigForm.value.centerLat,
        lng: orbitConfigForm.value.centerLng
      },
      rotateSpeed: orbitConfigForm.value.rotateSpeed,
      pitch: orbitConfigForm.value.pitch,
      zoom: orbitConfigForm.value.zoom,
      loop: orbitConfigForm.value.loop
    };
    orbitConfigData.value = newConfig;
    saveOrbitConfigToLocal(newConfig);

    // 重启所有地图的环绕动画
    [mapCommon2Ref.value, mapCommon3Ref.value, mapCommon4Ref.value, mapCommon3Ref_Top.value, mapCommon4Ref_Top.value].forEach(ref => {
      ref && (ref.stopOrbitAnimation(), ref.startOrbitAnimation());
    });

    orbitConfigDialogVisible.value = false;
    ElMessage.success('地图环绕配置已生效（已持久化，刷新不丢失）');
  } catch {
    ElMessage.error('配置校验失败，请检查输入');
  }
};
// 重置为默认配置
const resetToDefaultConfig = () => {
  const defaultConfig: OrbitConfig = {
    center: { lat: 24.58, lng: 117.65 },
    rotateSpeed: 0.05,
    pitch: 0,
    zoom: 12,
    loop: true
  };
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

  // 重启所有地图的环绕动画
  [mapCommon2Ref.value, mapCommon3Ref.value, mapCommon4Ref.value, mapCommon3Ref_Top.value, mapCommon4Ref_Top.value].forEach(ref => {
    ref && (ref.stopOrbitAnimation(), ref.startOrbitAnimation());
  });

  ElMessage.success('已恢复默认配置');
};

// ========== 数据获取方法 ==========
// 设备资源效能接口请求方法
const getDeviceResourceEfficiencyListData = async () => {
  try {
    deviceResourceEfficiencyList.value = (await fetchDeviceResourceEfficiencyList()) as DeviceResourceEfficiencyRow[];
  } catch (error: any) {
    ElMessage.error(`设备资源效能列表加载失败：${error.message}`);
    deviceResourceEfficiencyList.value = [];
  }
};
const getDeviceResourceEfficiencyIndicatorsData = async () => {
  try {
    deviceResourceEfficiencyIndicators.value =
      (await fetchDeviceResourceEfficiencyIndicators()) as DeviceResourceEfficiencyIndicators;
  } catch (error: any) {
    ElMessage.error(`设备资源效能核心指标加载失败：${error.message}`);
  }
};
const getDeviceResourceEfficiencyTypeCompareData = async () => {
  try {
    deviceResourceEfficiencyTypeCompareData.value =
      (await fetchDeviceResourceEfficiencyTypeCompare()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`不同设备类型运行效率对比加载失败：${error.message}`);
  }
};
const getDeviceResourceEfficiencyTrendData = async () => {
  try {
    deviceResourceEfficiencyTrendData.value =
      (await fetchDeviceResourceEfficiencyTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`设备故障修复率趋势加载失败：${error.message}`);
  }
};
const getDeviceResourceEfficiencyAreaRatioData = async () => {
  try {
    deviceResourceEfficiencyAreaRatioData.value =
      (await fetchDeviceResourceEfficiencyAreaRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`各区域设备效能占比加载失败：${error.message}`);
  }
};
const getDeviceResourceEfficiencyDetailData = async (efficiencyId: string) => {
  try {
    deviceResourceEfficiencyDetailSelectedRow.value = {
      ...deviceResourceEfficiencyDetailSelectedRow.value,
      ...(await fetchDeviceResourceEfficiencyDetail(efficiencyId)),
    };
  } catch (error: any) {
    ElMessage.warning(`设备资源效能详情加载失败：${error.message}`);
  }
};
const submitMaintenanceOrderData = async (efficiencyId: string) => {
  try {
    await maintenanceOrderFormRef.value?.validate();
    const res = await submitDeviceMaintenanceOrder(
      efficiencyId,
      maintenanceOrderForm.value.maintenanceType,
      maintenanceOrderForm.value.maintenanceTime
    );
    if (res.success) {
      tipDialogContent.value = `维护工单提交成功，工单号：${res.orderId}`;
      tipDialogVisible.value = true;
      deviceResourceEfficiencyMaintenanceDialogVisible.value = false;
      maintenanceOrderForm.value.maintenanceType = '';
      maintenanceOrderForm.value.maintenanceTime = '';
      maintenanceOrderFormRef.value?.resetFields();
      // 刷新列表数据
      getDeviceResourceEfficiencyListData();
    } else {
      tipDialogContent.value = '维护工单提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `维护工单提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

// 关键岗位人员接口请求方法
const getKeyPersonnelListData = async () => {
  try {
    keyPersonnelList.value = (await fetchKeyPersonnelList()) as KeyPersonnelRow[];
  } catch (error: any) {
    ElMessage.error(`关键岗位人员列表加载失败：${error.message}`);
    keyPersonnelList.value = [];
  }
};
const getKeyPersonnelIndicatorsData = async () => {
  try {
    keyPersonnelIndicators.value =
      (await fetchKeyPersonnelIndicators()) as KeyPersonnelIndicators;
  } catch (error: any) {
    ElMessage.error(`关键岗位人员核心指标加载失败：${error.message}`);
  }
};
const getKeyPersonnelAreaCountData = async () => {
  try {
    keyPersonnelAreaCountData.value =
      (await fetchKeyPersonnelAreaCount()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`不同负责范围人员数量加载失败：${error.message}`);
  }
};
const getKeyPersonnelRoleRatioData = async () => {
  try {
    keyPersonnelRoleRatioData.value =
      (await fetchKeyPersonnelRoleRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`岗位角色占比加载失败：${error.message}`);
  }
};
const getKeyPersonnelDetailData = async (userId: string) => {
  try {
    keyPersonnelDetailSelectedRow.value = {
      ...keyPersonnelDetailSelectedRow.value,
      ...(await fetchKeyPersonnelDetail(userId)),
    };
  } catch (error: any) {
    ElMessage.warning(`关键岗位人员详情加载失败：${error.message}`);
  }
};
const submitDispatchTaskData = async (userId: string) => {
  try {
    await dispatchTaskFormRef.value?.validate();
    const res = await submitDispatchTask(userId, dispatchTaskForm.value.taskContent, dispatchTaskForm.value.deadline);
    if (res.success) {
      // 更新任务名称
      keyPersonnelDetailSelectedRow.value.taskAllTableTaskName = res.taskName;
      tipDialogContent.value = '调度任务分配成功';
      tipDialogVisible.value = true;
      keyPersonnelDispatchDialogVisible.value = false;
      dispatchTaskForm.value.taskContent = '';
      dispatchTaskForm.value.deadline = '';
      dispatchTaskFormRef.value?.resetFields();
      // 刷新列表数据
      getKeyPersonnelListData();
    } else {
      tipDialogContent.value = '调度任务分配失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `调度任务分配失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};
const submitPersonnelMessageData = async (userId: string) => {
  try {
    await personnelMessageFormRef.value?.validate();
    const res = await submitPersonnelMessage(userId, personnelMessageForm.value.messageContent);
    if (res.success) {
      tipDialogContent.value = '留言发送成功';
      tipDialogVisible.value = true;
      keyPersonnelMessageDialogVisible.value = false;
      personnelMessageForm.value.messageContent = '';
      personnelMessageFormRef.value?.resetFields();
    } else {
      tipDialogContent.value = '留言发送失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `留言发送失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

// 终端设备状态接口请求方法
const getTerminalDeviceListData = async () => {
  try {
    terminalDeviceList.value = (await fetchTerminalDeviceList()) as TerminalDeviceRow[];
  } catch (error: any) {
    ElMessage.error(`终端设备状态列表加载失败：${error.message}`);
    terminalDeviceList.value = [];
  }
};
const getTerminalDeviceIndicatorsData = async () => {
  try {
    terminalDeviceIndicators.value =
      (await fetchTerminalDeviceIndicators()) as TerminalDeviceIndicators;
  } catch (error: any) {
    ElMessage.error(`终端设备状态核心指标加载失败：${error.message}`);
  }
};
const getTerminalDeviceOnlineTrendData = async () => {
  try {
    terminalDeviceOnlineTrendData.value =
      (await fetchTerminalDeviceOnlineTrend()) as ChartLineData;
  } catch (error: any) {
    ElMessage.error(`在线率趋势数据加载失败：${error.message}`);
  }
};
const getTerminalDeviceTypeRatioData = async () => {
  try {
    terminalDeviceTypeRatioData.value =
      (await fetchTerminalDeviceTypeRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`设备类型占比加载失败：${error.message}`);
  }
};
const getTerminalDeviceStatusRatioData = async () => {
  try {
    terminalDeviceStatusRatioData.value =
      (await fetchTerminalDeviceStatusRatio()) as ChartRatioData;
  } catch (error: any) {
    ElMessage.error(`运行状态占比加载失败：${error.message}`);
  }
};
const getTerminalDeviceAreaFaultCountData = async () => {
  try {
    terminalDeviceAreaFaultCountData.value =
      (await fetchTerminalDeviceAreaFaultCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`区域故障数对比加载失败：${error.message}`);
  }
};
const getTerminalDeviceTypeFaultCountData = async () => {
  try {
    terminalDeviceTypeFaultCountData.value =
      (await fetchTerminalDeviceTypeFaultCount()) as ChartBarData;
  } catch (error: any) {
    ElMessage.error(`设备类型故障数对比加载失败：${error.message}`);
  }
};
const getTerminalDeviceDetailData = async (deviceCode: string) => {
  try {
    terminalDeviceDetailSelectedRow.value = {
      ...terminalDeviceDetailSelectedRow.value,
      ...(await fetchTerminalDeviceDetail(deviceCode)),
    };
  } catch (error: any) {
    ElMessage.warning(`终端设备详情加载失败：${error.message}`);
  }
};
const submitDisposalData = async (deviceCode: string) => {
  try {
    await deviceDisposalFormRef.value?.validate();
    const res = await submitDeviceDisposal(deviceCode, deviceDisposalForm.value.disposalMeasures, deviceDisposalForm.value.disposalEvidence);
    if (res.success) {
      // 更新设备状态
      terminalDeviceDetailSelectedRow.value.sysOperationStatusName = res.deviceStatus;
      tipDialogContent.value = '设备处置提交成功';
      tipDialogVisible.value = true;
      terminalDeviceDisposalDialogVisible.value = false;
      deviceDisposalForm.value.disposalMeasures = '';
      deviceDisposalForm.value.disposalEvidence = [];
      deviceDisposalFormRef.value?.resetFields();
      // 刷新列表数据
      getTerminalDeviceListData();
    } else {
      tipDialogContent.value = '设备处置提交失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `设备处置提交失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};
const submitMaintenanceData = async (deviceCode: string) => {
  try {
    await deviceMaintenanceFormRef.value?.validate();
    const res = await submitDeviceMaintenance(deviceCode, deviceMaintenanceForm.value.maintenanceType, deviceMaintenanceForm.value.maintenanceTime);
    if (res.success) {
      tipDialogContent.value = `维护工单生成成功，工单号：${res.workOrderNo}`;
      tipDialogVisible.value = true;
      terminalDeviceMaintenanceDialogVisible.value = false;
      deviceMaintenanceForm.value.maintenanceType = '';
      deviceMaintenanceForm.value.maintenanceTime = '';
      deviceMaintenanceFormRef.value?.resetFields();
    } else {
      tipDialogContent.value = '维护工单生成失败';
      tipDialogVisible.value = true;
    }
  } catch (error: any) {
    tipDialogContent.value = `维护工单生成失败：${error.message}`;
    tipDialogVisible.value = true;
  }
};

// 初始化所有地图数据
const initAllMapData = async () => {
  try {
    // 获取运维人员地图数据
    const maintainData = await fetchMaintainStaffGeometries({});
    maintainStaffGeometries.value = maintainData.map((item: any) => ({
      ...item,
      latitude: item.maintainLatitude,
      longitude: item.maintainLongitude
    }));
    map2Loading.value = false;

    // 获取停车资源地图数据
    parkResourceGeometries.value = await fetchParkingResourceGeometries({});
    map3Loading.value = false;

    // 获取车辆轨迹地图数据
    const carTrackData = await fetchCarTrackGeometries({});
    carTrackGeometries.value = carTrackData.map((item: any) => ({
      ...item,
      latitude: item.carLatitude,
      longitude: item.carLongitude
    }));
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

// 获取运维人员指标数据
const getMaintainStaffIndicatorData = async () => {
  try {
    maintainStaffIndicatorData.value = await fetchMaintainStaffIndicators({});
  } catch {
    maintainStaffIndicatorData.value = { totalStaffCount: 0, onDutyCount: 0, taskCount: 0 };
  }
};

// 获取部门对比数据
const getMaintainDeptCompareData = async () => {
  try {
    maintainDeptCompareData.value = await fetchMaintainDeptOnDutyCompare({});
  } catch {
    maintainDeptCompareData.value = { xAxis: [], series: [] };
  }
};

// 获取资源全景指标数据
const getParkPanoramaIndicatorData = async () => {
  try {
    parkPanoramaIndicatorData.value = await fetchParkPanoramaIndicators({});
  } catch {
    parkPanoramaIndicatorData.value = { totalResourceCount: 0, availableResourceCount: 0, normalOperateCount: 0, normalOperateRate: 0 };
  }
};

// 获取资源类型占比数据
const getParkResourceTypeRatioData = async () => {
  try {
    parkResourceTypeRatioData.value = await fetchParkPanoramaResourceTypeRatio({});
  } catch {
    parkResourceTypeRatioData.value = { legend: [], series: [] };
  }
};

// 获取空间类型占比数据
const getParkSpaceTypeRatioData = async () => {
  try {
    parkSpaceTypeRatioData.value = await fetchParkPanoramaSpaceTypeRatio({});
  } catch {
    parkSpaceTypeRatioData.value = { legend: [], series: [] };
  }
};

// 获取车辆轨迹指标数据
const getCarTrackIndicatorData = async () => {
  try {
    carTrackIndicatorData.value = await fetchCarTrackIndicators({});
  } catch {
    carTrackIndicatorData.value = { todayPassCarCount: 0, abnormalCarCount: 0 };
  }
};

// 获取车辆轨迹趋势数据
const getCarTrackSingleTrendData = async () => {
  try {
    carTrackSingleTrendData.value = await fetchCarTrackSingleTrend({});
  } catch {
    carTrackSingleTrendData.value = { xAxis: [], series: [] };
  }
};


// 获取备品备件列表数据
const getSparePartListData = async () => {
  try {
    sparePartList.value = await fetchSparePartList();
  } catch {
    ElMessage.error('备品备件库存数据加载失败');
    sparePartList.value = [];
  }
};
// 获取备品备件指标数据
const getSparePartIndicatorData = async () => {
  try {
    sparePartIndicators.value = await fetchSparePartIndicators();
    nextTick(() => initSparePartNumberAnimations());
  } catch {
    sparePartIndicators.value = { totalPartTypeCount: 0, enoughStockCount: 0, lackStockCount: 0 };
  }
};
// 获取备品备件出入库趋势数据
const getSparePartInOutTrendData = async () => {
  try {
    sparePartInOutTrendData.value = await fetchSparePartInOutTrend();
  } catch {
    sparePartInOutTrendData.value = { xAxis: [], series: [{ name: '入库数量(件)', data: [] }, { name: '出库数量(件)', data: [] }] };
  }
};
// 获取备品备件类型占比数据
const getSparePartTypeRatioData = async () => {
  try {
    sparePartTypeRatioData.value = await fetchSparePartTypeRatio();
  } catch {
    sparePartTypeRatioData.value = { legend: [], series: [{ name: '备件类型占比', data: [] }] };
  }
};

// 获取停车资源列表数据
const getParkResourceListData = async () => {
  try {
    parkResourceList.value = await fetchParkResourceList();
  } catch {
    ElMessage.error('停车资源效能数据加载失败');
    parkResourceList.value = [];
  }
};
// 获取停车资源指标数据
const getParkResourceIndicatorData = async () => {
  try {
    parkResourceIndicators.value = await fetchParkResourceIndicators();
    nextTick(() => initParkResourceNumberAnimations());
  } catch {
    parkResourceIndicators.value = { avgTurnoverRate: 0, avgUtilizationRate: 0 };
  }
};
// 获取停车资源趋势数据
const getParkResourceTrendData = async () => {
  try {
    parkResourceTrendData.value = await fetchParkResourceTrend();
  } catch {
    parkResourceTrendData.value = { xAxis: [], series: [{ name: '泊位周转率(次/日)', data: [] }, { name: '资源利用率(%)', data: [] }] };
  }
};
// 获取停车资源区域占比数据
const getParkResourceAreaRatioData = async () => {
  try {
    parkResourceAreaRatioData.value = await fetchParkResourceAreaRatio();
  } catch {
    parkResourceAreaRatioData.value = { legend: [], series: [{ name: '区域资源效能占比', data: [] }] };
  }
};
// 获取停车资源区域对比数据
const getParkResourceAreaCompareData = async () => {
  try {
    parkResourceAreaCompareData.value = await fetchParkResourceAreaCompare();
  } catch {
    parkResourceAreaCompareData.value = { xAxis: [], series: [{ name: '区域平均利用率(%)', data: [] }] };
  }
};
// 获取停车资源类型对比数据
const getParkResourceTypeCompareData = async () => {
  try {
    parkResourceTypeCompareData.value = await fetchParkResourceTypeCompare();
  } catch {
    parkResourceTypeCompareData.value = { xAxis: [], series: [{ name: '类型平均利用率(%)', data: [] }] };
  }
};

// ========== 视图切换方法 ==========
// 设备资源效能视图切换
const changeDeviceResourceEfficiencyView = (viewName: string) => {
  activeDeviceResourceEfficiencyView.value = viewName;
  viewName === '卡片' && nextTick(() => initDeviceResourceEfficiencyNumberAnimations());
  (viewName === '柱状图' || viewName === '折线图' || viewName === '饼图') && nextTick(() => deviceResourceEfficiencyChartRefreshKey.value++);
};
const changeDeviceResourceEfficiencyDetailView = (viewName: string) => {
  activeDeviceResourceEfficiencyDetailView.value = viewName;
};
// 设备资源效能弹窗方法
const openDeviceResourceEfficiencyDetailDialog = async (row: DeviceResourceEfficiencyRow) => {
  await getDeviceResourceEfficiencyDetailData(row.id);
  deviceResourceEfficiencyDetailDialogVisible.value = true;
};
const closeDeviceResourceEfficiencyDetailDialog = () => {
  deviceResourceEfficiencyDetailDialogVisible.value = false;
  deviceResourceEfficiencyDetailSelectedRow.value = {
    id: '',
    sysEquipmentTypeName: '',
    sysAreaAreaName: '',
    sysStatCycleName: '',
    parkDeviceEfficiencyDeviceOperationEfficiency: 0,
    parkDeviceEfficiencyFaultRepairRate: 0,
    parkDeviceEfficiencyAverageFaultFreeDuration: 0,
    parkDeviceEfficiencyYoyGrowthRate: 0,
    parkDeviceEfficiencyMomGrowthRate: 0,
    parkDeviceEfficiencyLowEfficiencyCount: 0,
    parkDeviceEfficiencyMaintenanceSuggestion: '',
    efficiencyCalculationDetails: [],
    faultRecords: [],
    operationLogs: []
  };
  activeDeviceResourceEfficiencyDetailView.value = '效能计算明细';
};
const openDeviceResourceEfficiencyMaintenanceDialog = (row: DeviceResourceEfficiencyRow) => {
  deviceResourceEfficiencyDetailSelectedRow.value.id = row.id;
  deviceResourceEfficiencyDetailSelectedRow.value.sysEquipmentTypeName = row.sysEquipmentTypeName;
  deviceResourceEfficiencyDetailSelectedRow.value.sysAreaAreaName = row.sysAreaAreaName;
  deviceResourceEfficiencyMaintenanceDialogVisible.value = true;
};
const closeDeviceResourceEfficiencyMaintenanceDialog = () => {
  deviceResourceEfficiencyMaintenanceDialogVisible.value = false;
  maintenanceOrderForm.value.maintenanceType = '';
  maintenanceOrderForm.value.maintenanceTime = '';
  maintenanceOrderFormRef.value?.resetFields();
};
// 设备资源效能数据刷新
const refreshDeviceResourceEfficiencyData = async () => {
  await Promise.all([
    getDeviceResourceEfficiencyListData(),
    getDeviceResourceEfficiencyIndicatorsData(),
    getDeviceResourceEfficiencyTypeCompareData(),
    getDeviceResourceEfficiencyTrendData(),
    getDeviceResourceEfficiencyAreaRatioData(),
  ]);
  deviceResourceEfficiencyChartRefreshKey.value++;
  ElMessage.success('设备资源效能数据刷新成功');
};

// 关键岗位人员视图切换
const changeKeyPersonnelView = (viewName: string) => {
  activeKeyPersonnelView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initKeyPersonnelNumberAnimations, 300));
  (viewName === '柱状图' || viewName === '饼图') &&
  nextTick(() => keyPersonnelChartRefreshKey.value++);
};
const changeKeyPersonnelDetailView = (viewName: string) => {
  activeKeyPersonnelDetailView.value = viewName;
};
// 关键岗位人员弹窗方法
const openKeyPersonnelDetailDialog = async (row: KeyPersonnelRow) => {
  await getKeyPersonnelDetailData(row.sysUserUserId);
  keyPersonnelDetailDialogVisible.value = true;
};
const closeKeyPersonnelDetailDialog = () => {
  keyPersonnelDetailDialogVisible.value = false;
  keyPersonnelDetailSelectedRow.value = {
    sysUserUserId: '',
    sysUserUserName: '',
    sysUserUserPhone: '',
    sysUserOnDutyTime: '',
    taskAllTableTaskName: '',
    sysOperationLogOperateTime: '',
    sysRoleRoleName: '',
    sysAreaAreaName: '',
    sysOnlineStatusName: '',
    sysMerchantMerchantName: '',
    permissionScope: [],
    operationLogs: []
  };
  activeKeyPersonnelDetailView.value = '人员详情';
};
const openKeyPersonnelDispatchDialog = () => {
  keyPersonnelDispatchDialogVisible.value = true;
};
const closeKeyPersonnelDispatchDialog = () => {
  keyPersonnelDispatchDialogVisible.value = false;
  dispatchTaskForm.value.taskContent = '';
  dispatchTaskForm.value.deadline = '';
  dispatchTaskFormRef.value?.resetFields();
};
const openKeyPersonnelMessageDialog = () => {
  keyPersonnelMessageDialogVisible.value = true;
};
const closeKeyPersonnelMessageDialog = () => {
  keyPersonnelMessageDialogVisible.value = false;
  personnelMessageForm.value.messageContent = '';
  personnelMessageFormRef.value?.resetFields();
};
// 关键岗位人员数据刷新
const refreshKeyPersonnelData = async () => {
  await Promise.all([
    getKeyPersonnelListData(),
    getKeyPersonnelIndicatorsData(),
    getKeyPersonnelAreaCountData(),
    getKeyPersonnelRoleRatioData(),
  ]);
  keyPersonnelChartRefreshKey.value++;
  ElMessage.success('关键岗位人员数据刷新成功');
};
const getOnlineStatusType = (status: string) => {
  switch(status) {
    case '在线': return 'success';
    case '离线': return 'info';
    case '忙碌': return 'warning';
    default: return 'info';
  }
};

// 终端设备状态视图切换
const changeTerminalDeviceView = (viewName: string) => {
  activeTerminalDeviceView.value = viewName;
  viewName === '卡片' &&
  nextTick(() => setTimeout(initTerminalDeviceNumberAnimations, 300));
  (viewName === '折线图' || viewName === '饼图' || viewName === '柱状图') &&
  nextTick(() => terminalDeviceChartRefreshKey.value++);
};
const changeTerminalDeviceDetailView = (viewName: string) => {
  activeTerminalDeviceDetailView.value = viewName;
};
// 终端设备状态弹窗方法
const openTerminalDeviceDetailDialog = async (row: TerminalDeviceRow) => {
  await getTerminalDeviceDetailData(row.tbDeviceExtendDeviceCode);
  terminalDeviceDetailDialogVisible.value = true;
};
const closeTerminalDeviceDetailDialog = () => {
  terminalDeviceDetailDialogVisible.value = false;
  terminalDeviceDetailSelectedRow.value = {
    tbDeviceExtendDeviceCode: '',
    tbDeviceExtendOfflineTime: '',
    sysFaultTypeName: '',
    sysMaintainUserUserName: '',
    tbDeviceExtendNextMaintainTime: '',
    sysEquipmentTypeName: '',
    tbAssetExtendName: '',
    sysOperationStatusName: '',
    parkDeviceMonitorDataContent: '',
    sysAreaAreaName: '',
    monitorLogs: [],
    faultRecords: []
  };
  activeTerminalDeviceDetailView.value = '设备详情';
};
const openTerminalDeviceDisposalDialog = () => {
  terminalDeviceDisposalDialogVisible.value = true;
};
const closeTerminalDeviceDisposalDialog = () => {
  terminalDeviceDisposalDialogVisible.value = false;
  deviceDisposalForm.value.disposalMeasures = '';
  deviceDisposalForm.value.disposalEvidence = [];
  deviceDisposalFormRef.value?.resetFields();
};
const openTerminalDeviceMaintenanceDialog = () => {
  terminalDeviceMaintenanceDialogVisible.value = true;
};
const closeTerminalDeviceMaintenanceDialog = () => {
  terminalDeviceMaintenanceDialogVisible.value = false;
  deviceMaintenanceForm.value.maintenanceType = '';
  deviceMaintenanceForm.value.maintenanceTime = '';
  deviceMaintenanceFormRef.value?.resetFields();
};
// 终端设备状态数据刷新
const refreshTerminalDeviceData = async () => {
  await Promise.all([
    getTerminalDeviceListData(),
    getTerminalDeviceIndicatorsData(),
    getTerminalDeviceOnlineTrendData(),
    getTerminalDeviceTypeRatioData(),
    getTerminalDeviceStatusRatioData(),
    getTerminalDeviceAreaFaultCountData(),
    getTerminalDeviceTypeFaultCountData(),
  ]);
  terminalDeviceChartRefreshKey.value++;
  ElMessage.success('终端设备状态数据刷新成功');
};
const getOperationStatusType = (status: string) => {
  switch(status) {
    case '在线': return 'success';
    case '故障': return 'danger';
    case '离线': return 'info';
    case '维护中': return 'warning';
    case '待机': return 'primary';
    default: return 'info';
  }
};

// 切换备品备件视图
const changeSparePartView = (viewName: string) => {
  activeSparePartView.value = viewName;
  viewName === '卡片' && nextTick(() => initSparePartNumberAnimations());
  (viewName === '柱状图' || viewName === '饼图') && nextTick(() => sparePartChartRefreshKey.value += 1);
};

// 切换停车资源视图
const changeParkResourceView = (viewName: string) => {
  activeParkResourceView.value = viewName;
  viewName === '卡片' && nextTick(() => initParkResourceNumberAnimations());
  (viewName === '柱状图' || viewName === '折线图' || viewName === '饼图') && nextTick(() => parkResourceChartRefreshKey.value += 1);
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
      terminalDeviceChartRefreshKey.value++;
      sparePartChartRefreshKey.value++;
      parkResourceChartRefreshKey.value++;
      deviceResourceEfficiencyChartRefreshKey.value++;
      keyPersonnelChartRefreshKey.value++;
    }, 300);
  }
  // 退出全屏时：重置面板样式 + 刷新图表 + 清空当前全屏面板
  else {
    currentFullscreenPanel.value.style = '';
    nextTick(() => {
      topMainChartRefreshKey.value++;
      terminalDeviceChartRefreshKey.value++;
      sparePartChartRefreshKey.value++;
      parkResourceChartRefreshKey.value++;
      deviceResourceEfficiencyChartRefreshKey.value++;
      keyPersonnelChartRefreshKey.value++;
    });
    currentFullscreenPanel.value = null;
  }
};

// 处理标签页切换
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

// ========== 格式化方法 ==========
// 获取备件库存状态标签
const getSparePartStockStatusTag = (current: number, min: number): string => {
  if (current >= min) return 'success';
  if (current > 0) return 'warning';
  return 'danger';
};
// 获取备件库存状态名称
const getSparePartStockStatusName = (current: number, min: number): string => {
  if (current >= min) return '库存充足';
  if (current > 0) return '库存预警';
  return '库存缺货';
};
// 获取区域名称
const getAreaName = (val: string): string => {
  switch (val) {
    case 'culture': return '文旅区';
    case 'economic': return '经开区';
    case 'highTech': return '高新区';
    case 'main': return '主城区';
    case 'suburb': return '周边区县';
    default: return '未知区域';
  }
};
// 获取停车场类型标签
const getParkTypeTag = (val: string): { name: string, type: string } => {
  switch (val) {
    case 'business': return { name: '商业车场', type: 'success' };
    case 'community': return { name: '小区车场', type: 'danger' };
    case 'park': return { name: '园区车场', type: 'warning' };
    case 'public': return { name: '公共车场', type: 'primary' };
    case 'tourism': return { name: '文旅车场', type: 'info' };
    default: return { name: '未知类型', type: '' };
  }
};

// 格式化百分比
const formatPercent = (val: number): string => (val ? `${val.toFixed(1)}%` : '0.0%');
// 格式化周转率
const formatTurnover = (val: number): string => val ? `${val.toFixed(1)}次/日` : '0.0次/日';
// 格式化停车场时间戳
const formatParkTimeStamp = (timeStamp: any): string => formatDeviceTimeStamp(timeStamp);


// ========== 生命周期钩子 ==========
onMounted(async () => {
  await initAllMapData();
  resetOrbitConfigForm();
  await Promise.all([
    getTerminalDeviceListData(),
    getTerminalDeviceIndicatorsData(),
    getTerminalDeviceOnlineTrendData(),
    getTerminalDeviceTypeRatioData(),
    getTerminalDeviceStatusRatioData(),
    getTerminalDeviceAreaFaultCountData(),
    getTerminalDeviceTypeFaultCountData(),
    getSparePartListData(),
    getSparePartIndicatorData(),
    getSparePartInOutTrendData(),
    getSparePartTypeRatioData(),
    getParkResourceListData(),
    getParkResourceIndicatorData(),
    getParkResourceTrendData(),
    getParkResourceAreaRatioData(),
    getParkResourceAreaCompareData(),
    getParkResourceTypeCompareData(),
    getMaintainStaffIndicatorData(),
    getMaintainDeptCompareData(),
    getParkPanoramaIndicatorData(),
    getParkResourceTypeRatioData(),
    getParkSpaceTypeRatioData(),
    getCarTrackIndicatorData(),
    getCarTrackSingleTrendData(),
    getDeviceResourceEfficiencyListData(),
    getDeviceResourceEfficiencyIndicatorsData(),
    getDeviceResourceEfficiencyTypeCompareData(),
    getDeviceResourceEfficiencyTrendData(),
    getDeviceResourceEfficiencyAreaRatioData(),
    getKeyPersonnelListData(),
    getKeyPersonnelIndicatorsData(),
    getKeyPersonnelAreaCountData(),
    getKeyPersonnelRoleRatioData(),
  ]);
  setTimeout(() => {
    terminalDeviceChartRefreshKey.value += 1;
    sparePartChartRefreshKey.value += 1;
    parkResourceChartRefreshKey.value += 1;
    deviceResourceEfficiencyChartRefreshKey.value++;
    keyPersonnelChartRefreshKey.value++;
  }, 200);
});

onUnmounted(() => {
  [mapCommon2Ref.value, mapCommon3Ref.value, mapCommon4Ref.value, mapCommon3Ref_Top.value, mapCommon4Ref_Top.value].forEach(ref => {
    ref && ref.stopOrbitAnimation();
  });
  screenFull.off('change', handleFullscreenChange);
  currentFullscreenPanel.value = null;
});
</script>

<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="mainbox">
      <div class="top">
        <div class="panel top-middle" ref="topMiddlePanel">
          <ElTabs v-model="topMiddleActiveTab" class="common-tabs" @tab-change="handleTabChange">
            <el-tab-pane label="资源全景监控" name="tab1">
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
            </el-tab-pane>
            <el-tab-pane label="车辆轨迹监控" name="tab2">
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
            </el-tab-pane>
            <el-tab-pane label="物资调配跟踪" name="tab3">
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
            </el-tab-pane>
          </ElTabs>
          <div class="panel-footer"></div>
        </div>
      </div>
      <div class="bottom">
        <div class="panel bottom-left" ref="bottomLeftPanel">
          <div class="header-actions">
            <div class="actions-left"><p>终端设备状态</p></div>
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
              <el-icon color="#409eff" size="16" @click="refreshTerminalDeviceData"><Refresh /></el-icon>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button
                class="panel-fullscreen-btn"
                @click="togglePanelFullscreen('bottomLeftPanel')"
              >
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <!-- 卡片视图 -->
          <div v-if="activeTerminalDeviceView === '卡片'" class="view-content">
            <div class="indicator-cards3">
              <div class="indicator-card3 card1">
                <div class="indicator-title">总设备数</div>
                <div class="indicator-value">
                  <span :data-value="terminalDeviceIndicators.totalDeviceCount" class="terminal-device-number-animate">{{ terminalDeviceIndicators.totalDeviceCount }}</span>
                </div>
                <div class="indicator-unit">台</div>
              </div>
              <div class="indicator-card3 card2">
                <div class="indicator-title">在线设备数</div>
                <div class="indicator-value">
                  <span :data-value="terminalDeviceIndicators.onlineDeviceCount" class="terminal-device-number-animate">{{ terminalDeviceIndicators.onlineDeviceCount }}</span>
                </div>
                <div class="indicator-unit">台</div>
              </div>
              <div class="indicator-card3 card3">
                <div class="indicator-title">故障设备数</div>
                <div class="indicator-value">
                  <span :data-value="terminalDeviceIndicators.faultDeviceCount" class="terminal-device-number-animate">{{ terminalDeviceIndicators.faultDeviceCount }}</span>
                </div>
                <div class="indicator-unit">台</div>
              </div>
              <div class="indicator-card3 card4">
                <div class="indicator-title">在线率</div>
                <div class="indicator-value">
                  <span :data-value="terminalDeviceIndicators.totalDeviceCount > 0 ? (terminalDeviceIndicators.onlineDeviceCount / terminalDeviceIndicators.totalDeviceCount) * 100 : 0" class="terminal-device-number-animate">
                    {{ formatDecimal((terminalDeviceIndicators.onlineDeviceCount / terminalDeviceIndicators.totalDeviceCount) * 100) }}
                  </span>
                </div>
                <div class="indicator-unit">%</div>
              </div>
            </div>
          </div>
          <!-- 折线图视图 -->
          <div v-if="activeTerminalDeviceView === '折线图'" class="view-content">
            <div
              style="
                display: inline-block;
                width: 100%;
                height: 100%;
                vertical-align: top;
              "
            >
              <ChartLine1
                :data="terminalDeviceOnlineTrendData"
                title="近24小时设备在线率趋势"
                y-axis-name="在线率(%)"
                :key="terminalDeviceChartRefreshKey"
              />
            </div>
          </div>
          <!-- 饼图视图 -->
          <div v-if="activeTerminalDeviceView === '饼图'" class="view-content">
            <div
              style="
                display: inline-block;
                width: 49%;
                height: 100%;
                vertical-align: top;
              "
            >
              <ChartPie1
                :data="terminalDeviceTypeRatioData"
                title="设备类型占比"
                :key="terminalDeviceChartRefreshKey"
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
                :data="terminalDeviceStatusRatioData"
                title="运行状态占比"
                :key="terminalDeviceChartRefreshKey"
              />
            </div>
          </div>
          <!-- 柱状图视图 -->
          <div v-if="activeTerminalDeviceView === '柱状图'" class="view-content">
            <div
              style="
        display: inline-block;
        width: 49%;
        height: 100%;
        vertical-align: top;
      "
            >
              <VerticalBar1
                :x-axis="terminalDeviceAreaFaultCountData.xAxis"
                :series="terminalDeviceAreaFaultCountData.series"
                unit="个"
                title="不同区域故障数对比"
                :key="terminalDeviceChartRefreshKey"
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
              <VerticalBar2
                :x-axis="terminalDeviceTypeFaultCountData.xAxis"
                :series="terminalDeviceTypeFaultCountData.series"
                unit="个"
                title="不同设备类型故障数对比"
                :key="terminalDeviceChartRefreshKey"
              />
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
                  prop="tbDeviceExtendDeviceCode"
                  label="设备编码"
                  align="center"
                  min-width="140"
                />
                <ElTableColumn
                  prop="sysEquipmentTypeName"
                  label="设备类型"
                  align="center"
                />
                <ElTableColumn
                  prop="tbAssetExtendName"
                  label="所属资产"
                  align="center"
                  min-width="120"
                />
                <ElTableColumn
                  prop="sysOperationStatusName"
                  label="运行状态"
                  align="center"
                >
                  <template #default="scope">
                    <ElTag :type="getOperationStatusType(scope.row.sysOperationStatusName)">
                      {{ scope.row.sysOperationStatusName || '-' }}
                    </ElTag>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                  prop="parkDeviceMonitorDataContent"
                  label="核心监控数据"
                  align="center"
                  min-width="180"
                />
                <ElTableColumn
                  prop="sysAreaAreaName"
                  label="所属区域"
                  align="center"
                  min-width="120"
                />
                <ElTableColumn
                  label="操作"
                  align="center"
                  width="100"
                  fixed="right"
                >
                  <template #default="scope">
                    <ElButton
                      v-if="scope.row.sysOperationStatusName === '故障'"
                      type="danger"
                      size="small"
                      plain
                      @click.stop="openTerminalDeviceDisposalDialog()"
                    >
                      处置
                    </ElButton>
                    <ElButton
                      v-if="scope.row.sysOperationStatusName === '在线' || scope.row.sysOperationStatusName === '待机'"
                      type="primary"
                      size="small"
                      plain
                      @click.stop="openTerminalDeviceMaintenanceDialog()"
                    >
                      维护
                    </ElButton>
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-middle" ref="bottomMiddlePanel">
          <ElTabs v-model="bottomMiddleActiveTab" class="common-tabs" @tab-change="handleTabChange">
            <el-tab-pane label="停车资源效能" name="tab1">
              <div class="header-actions">
                <div class="actions-left"></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton v-for="item in parkResourceViewBtnList" :key="item" :type="activeParkResourceView === item ? 'primary' : ''" plain @click="changeParkResourceView(item)" class="view-btn">{{ item }}</ElButton>
                  </div>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('bottomMiddlePanel')">
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
            </el-tab-pane>
            <el-tab-pane label="设备资源效能" name="tab2">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in deviceResourceEfficiencyViewBtnList"
                      :key="item"
                      :type="activeDeviceResourceEfficiencyView === item ? 'primary' : ''"
                      plain
                      @click="changeDeviceResourceEfficiencyView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <el-icon color="#409eff" size="16" @click="refreshDeviceResourceEfficiencyData"><Refresh /></el-icon>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('bottomMiddlePanel')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <!-- 卡片视图 -->
              <div v-if="activeDeviceResourceEfficiencyView === '卡片'" class="view-content">
                <div class="indicator-cards1">
                  <div class="indicator-card1 card1">
                    <div class="indicator-title">设备平均运行效率</div>
                    <div class="indicator-value">
                      <span
                        :data-value="deviceResourceEfficiencyIndicators.avgOperationEfficiency"
                        class="device-resource-efficiency-number-animate"
                      >
                        {{ formatDecimal(deviceResourceEfficiencyIndicators.avgOperationEfficiency) }}
                      </span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                  <div class="indicator-card1 card2">
                    <div class="indicator-title">平均无故障时长</div>
                    <div class="indicator-value">
                      <span
                        :data-value="deviceResourceEfficiencyIndicators.avgFaultFreeDuration"
                        class="device-resource-efficiency-number-animate"
                      >
                        {{ deviceResourceEfficiencyIndicators.avgFaultFreeDuration }}
                      </span>
                    </div>
                    <div class="indicator-unit">小时</div>
                  </div>
                  <div class="indicator-card1 card3">
                    <div class="indicator-title">平均故障修复率</div>
                    <div class="indicator-value">
                      <span
                        :data-value="deviceResourceEfficiencyIndicators.avgFaultRepairRate"
                        class="device-resource-efficiency-number-animate"
                      >
                        {{ formatDecimal(deviceResourceEfficiencyIndicators.avgFaultRepairRate) }}
                      </span>
                    </div>
                    <div class="indicator-unit">%</div>
                  </div>
                </div>
              </div>
              <!-- 柱状图视图 -->
              <div v-if="activeDeviceResourceEfficiencyView === '柱状图'" class="view-content">
                <div style="display: inline-block; width: 100%; height: 100%; vertical-align: top;">
                  <VerticalBar1
                    :x-axis="deviceResourceEfficiencyTypeCompareData.xAxis"
                    :series="deviceResourceEfficiencyTypeCompareData.series"
                    unit="%"
                    title="不同设备类型运行效率对比"
                    :key="deviceResourceEfficiencyChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 折线图视图 -->
              <div v-if="activeDeviceResourceEfficiencyView === '折线图'" class="view-content">
                <div style="display: inline-block; width: 100%; height: 100%; vertical-align: top;">
                  <ChartLine1
                    :data="deviceResourceEfficiencyTrendData"
                    title="近周期设备故障修复率趋势"
                    y-axis-name="故障修复率(%)"
                    :key="deviceResourceEfficiencyChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 饼图视图 -->
              <div v-if="activeDeviceResourceEfficiencyView === '饼图'" class="view-content">
                <div style="display: inline-block; width: 100%; height: 100%; vertical-align: top;">
                  <ChartPie1
                    :data="deviceResourceEfficiencyAreaRatioData"
                    title="各区域设备效能占比"
                    :key="deviceResourceEfficiencyChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 列表视图 -->
              <div v-if="activeDeviceResourceEfficiencyView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="deviceResourceEfficiencyList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openDeviceResourceEfficiencyDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="sysEquipmentTypeName"
                      label="设备类型"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="sysAreaAreaName"
                      label="区域名称"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="sysStatCycleName"
                      label="统计周期"
                      align="center"
                      width="80"
                    />
                    <ElTableColumn
                      prop="parkDeviceEfficiencyDeviceOperationEfficiency"
                      label="设备运行效率"
                      align="center"
                      width="120"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.parkDeviceEfficiencyDeviceOperationEfficiency) }}%
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="parkDeviceEfficiencyFaultRepairRate"
                      label="故障修复率"
                      align="center"
                      width="100"
                    >
                      <template #default="scope">
                        {{ formatDecimal(scope.row.parkDeviceEfficiencyFaultRepairRate) }}%
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="parkDeviceEfficiencyAverageFaultFreeDuration"
                      label="平均无故障时长"
                      align="center"
                      width="120"
                    >
                      <template #default="scope">
                        {{ scope.row.parkDeviceEfficiencyAverageFaultFreeDuration }}小时
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
                          @click.stop="openDeviceResourceEfficiencyMaintenanceDialog(scope.row)"
                        >
                          维护
                        </ElButton>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="关键岗位人员" name="tab3">
              <div class="header-actions">
                <div class="actions-left"><p></p></div>
                <div class="actions-right">
                  <div class="view-btn-group">
                    <ElButton
                      v-for="item in keyPersonnelViewBtnList"
                      :key="item"
                      :type="activeKeyPersonnelView === item ? 'primary' : ''"
                      plain
                      @click="changeKeyPersonnelView(item)"
                      class="view-btn"
                    >
                      {{ item }}
                    </ElButton>
                  </div>
                  <el-icon color="#409eff" size="16" @click="refreshKeyPersonnelData"><Refresh /></el-icon>
                  <el-icon color="#409eff" size="16"><Filter /></el-icon>
                  <button
                    class="panel-fullscreen-btn"
                    @click="togglePanelFullscreen('bottomMiddlePanel')"
                  >
                    <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
                  </button>
                </div>
              </div>
              <!-- 卡片视图 -->
              <div v-if="activeKeyPersonnelView === '卡片'" class="view-content">
                <div class="indicator-cards1">
                  <div class="indicator-card1 card1">
                    <div class="indicator-title">各岗位人员总数</div>
                    <div class="indicator-value">
                      <span :data-value="keyPersonnelIndicators.totalPersonnelCount" class="key-personnel-number-animate">{{ keyPersonnelIndicators.totalPersonnelCount }}</span>
                    </div>
                    <div class="indicator-unit">人</div>
                  </div>
                  <div class="indicator-card1 card2">
                    <div class="indicator-title">在线人数</div>
                    <div class="indicator-value">
                      <span :data-value="keyPersonnelIndicators.onlinePersonnelCount" class="key-personnel-number-animate">{{ keyPersonnelIndicators.onlinePersonnelCount }}</span>
                    </div>
                    <div class="indicator-unit">人</div>
                  </div>
                </div>
              </div>
              <!-- 柱状图视图 -->
              <div v-if="activeKeyPersonnelView === '柱状图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <VerticalBar2
                    :x-axis="keyPersonnelAreaCountData.xAxis"
                    :series="keyPersonnelAreaCountData.series"
                    unit="人"
                    title="不同负责范围人员数量对比"
                    :key="keyPersonnelChartRefreshKey"
                  />
                </div>
              </div>

              <!-- 饼图视图 -->
              <div v-if="activeKeyPersonnelView === '饼图'" class="view-content">
                <div
                  style="
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    vertical-align: top;
                  "
                >
                  <ChartPie1
                    :data="keyPersonnelRoleRatioData"
                    title="岗位角色占比"
                    :key="keyPersonnelChartRefreshKey"
                  />
                </div>
              </div>
              <!-- 列表视图 -->
              <div v-if="activeKeyPersonnelView === '列表'" class="view-content">
                <div class="table-box4">
                  <ElTable
                    class="table4"
                    :data="keyPersonnelList"
                    border
                    size="small"
                    width="100%"
                    height="100%"
                    table-layout="fixed"
                    highlight-current-row
                    @row-click="(row) => openKeyPersonnelDetailDialog(row)"
                  >
                    <ElTableColumn
                      prop="sysUserUserId"
                      label="人员ID"
                      align="center"
                      min-width="140"
                    />
                    <ElTableColumn
                      prop="sysUserUserName"
                      label="人员姓名"
                      align="center"
                      min-width="100"
                    />
                    <ElTableColumn
                      prop="sysRoleRoleName"
                      label="岗位角色"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="sysAreaAreaName"
                      label="负责范围"
                      align="center"
                      min-width="120"
                    />
                    <ElTableColumn
                      prop="sysOnlineStatusName"
                      label="在线状态"
                      align="center"
                      width="100"
                    >
                      <template #default="scope">
                        <ElTag :type="getOnlineStatusType(scope.row.sysOnlineStatusName)">
                          {{ scope.row.sysOnlineStatusName || '-' }}
                        </ElTag>
                      </template>
                    </ElTableColumn>
                    <ElTableColumn
                      prop="sysMerchantMerchantName"
                      label="对接商户名称"
                      align="center"
                      min-width="150"
                    />
                    <ElTableColumn
                      label="操作"
                      align="center"
                      width="200"
                      fixed="right"
                    >
                      <template #default="scope">
                        <ElButton
                          type="primary"
                          size="small"
                          plain
                          @click.stop="openKeyPersonnelDispatchDialog()"
                        >
                          调度
                        </ElButton>
                        <ElButton
                          type="success"
                          size="small"
                          plain
                          @click.stop="openKeyPersonnelMessageDialog()"
                        >
                          留言
                        </ElButton>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            </el-tab-pane>
          </ElTabs>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-right" ref="bottomRightPanel">
          <div class="header-actions">
            <div class="actions-left"><p>备品备件仓储</p></div>
            <div class="actions-right">
              <div class="view-btn-group">
                <ElButton v-for="item in sparePartViewBtnList" :key="item" :type="activeSparePartView === item ? 'primary' : ''" plain @click="changeSparePartView(item)" class="view-btn">{{ item }}</ElButton>
              </div>
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('bottomRightPanel')">
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
          <div class="panel-footer"></div>
        </div>
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

    <!-- 设备资源效能详情弹窗 -->
    <el-dialog
      v-model="deviceResourceEfficiencyDetailDialogVisible"
      width="45%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
      title="设备资源效能详情"
    >
      <div class="header-actions" style="margin-bottom:10px;">
        <div class="actions-right">
          <div class="view-btn-group">
            <ElButton
              v-for="item in deviceResourceEfficiencyDetailViewBtnList"
              :key="item"
              :type="activeDeviceResourceEfficiencyDetailView === item ? 'primary' : ''"
              plain
              @click="changeDeviceResourceEfficiencyDetailView(item)"
              class="view-btn"
            >
              {{ item }}
            </ElButton>
          </div>
        </div>
      </div>

      <!-- 效能计算明细视图 -->
      <div v-if="activeDeviceResourceEfficiencyDetailView === '效能计算明细'" class="view-content" style="padding:0;">
        <ElDescriptions bordered :column="2" class="desc-detail">
          <ElDescriptionsItem label="设备类型">
            {{ deviceResourceEfficiencyDetailSelectedRow.sysEquipmentTypeName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="区域名称">
            {{ deviceResourceEfficiencyDetailSelectedRow.sysAreaAreaName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="统计周期">
            {{ deviceResourceEfficiencyDetailSelectedRow.sysStatCycleName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="设备运行效率">
            {{ formatDecimal(deviceResourceEfficiencyDetailSelectedRow.parkDeviceEfficiencyDeviceOperationEfficiency) }}%
          </ElDescriptionsItem>
          <ElDescriptionsItem label="故障修复率">
            {{ formatDecimal(deviceResourceEfficiencyDetailSelectedRow.parkDeviceEfficiencyFaultRepairRate) }}%
          </ElDescriptionsItem>
          <ElDescriptionsItem label="平均无故障时长">
            {{ deviceResourceEfficiencyDetailSelectedRow.parkDeviceEfficiencyAverageFaultFreeDuration }}小时
          </ElDescriptionsItem>
          <ElDescriptionsItem label="同比增长率">
            {{ formatDecimal(deviceResourceEfficiencyDetailSelectedRow.parkDeviceEfficiencyYoyGrowthRate) }}%
          </ElDescriptionsItem>
          <ElDescriptionsItem label="环比增长率">
            {{ formatDecimal(deviceResourceEfficiencyDetailSelectedRow.parkDeviceEfficiencyMomGrowthRate) }}%
          </ElDescriptionsItem>
          <ElDescriptionsItem label="低效设备数量">
            {{ deviceResourceEfficiencyDetailSelectedRow.parkDeviceEfficiencyLowEfficiencyCount || 0 }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="维护建议" span="2">
            {{ deviceResourceEfficiencyDetailSelectedRow.parkDeviceEfficiencyMaintenanceSuggestion || '-' }}
          </ElDescriptionsItem>
        </ElDescriptions>

        <div style="margin-top: 20px;">
          <ElTable
            :data="deviceResourceEfficiencyDetailSelectedRow.efficiencyCalculationDetails"
            border
            size="small"
            width="100%"
            table-layout="fixed"
          >
            <ElTableColumn prop="item" label="计算项" align="center" width="120" />
            <ElTableColumn prop="value" label="当前值" align="center" width="120" />
            <ElTableColumn prop="standard" label="达标标准" align="center" width="120" />
          </ElTable>
        </div>
      </div>

      <!-- 设备故障记录视图 -->
      <div v-if="activeDeviceResourceEfficiencyDetailView === '设备故障记录'" class="view-content" style="padding:0;">
        <div style="height:400px;">
          <ElTable
            :data="deviceResourceEfficiencyDetailSelectedRow.faultRecords"
            border
            size="small"
            width="100%"
            height="100%"
            table-layout="fixed"
          >
            <ElTableColumn prop="faultTime" label="故障时间" align="center" width="140" />
            <ElTableColumn prop="faultType" label="故障类型" align="center" width="100" />
            <ElTableColumn prop="repairTime" label="修复时间" align="center" width="140" />
            <ElTableColumn prop="status" label="状态" align="center" width="80">
              <template #default="scope">
                <ElTag :type="scope.row.status === '已修复' ? 'success' : 'warning'">
                  {{ scope.row.status }}
                </ElTag>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
      </div>

      <!-- 运行日志视图 -->
      <div v-if="activeDeviceResourceEfficiencyDetailView === '运行日志'" class="view-content" style="padding:0;">
        <div style="height:400px;">
          <ElTable
            :data="deviceResourceEfficiencyDetailSelectedRow.operationLogs"
            border
            size="small"
            width="100%"
            height="100%"
            table-layout="fixed"
          >
            <ElTableColumn prop="time" label="时间" align="center" width="140" />
            <ElTableColumn prop="operation" label="操作" align="center" width="120" />
            <ElTableColumn prop="operator" label="操作人" align="center" width="100" />
            <ElTableColumn prop="result" label="结果" align="center" width="80">
              <template #default="scope">
                <ElTag :type="scope.row.result === '成功' ? 'success' : 'danger'">
                  {{ scope.row.result }}
                </ElTag>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
      </div>

      <template #footer>
        <ElButton plain @click="closeDeviceResourceEfficiencyDetailDialog">关闭</ElButton>
      </template>
    </el-dialog>
    <!-- 维护工单弹窗 -->
    <el-dialog
      v-model="deviceResourceEfficiencyMaintenanceDialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="park-dialog"
      center
      destroy-on-close
      title="发起维护工单"
    >
      <div style="margin-bottom: 15px; font-size: 14px;">
        设备信息：{{ deviceResourceEfficiencyDetailSelectedRow.sysEquipmentTypeName }} - {{ deviceResourceEfficiencyDetailSelectedRow.sysAreaAreaName }}
      </div>
      <el-form
        ref="maintenanceOrderFormRef"
        :model="maintenanceOrderForm"
        :rules="maintenanceOrderFormRules"
        label-width="100px"
        style="width: 100%;"
      >
        <el-form-item label="维护类型" prop="maintenanceType" required>
          <el-radio-group
            v-model="maintenanceOrderForm.maintenanceType"
            placeholder="请选择维护类型"
            style="width: 100%;"
          >
            <el-radio label="预防性维护" value="preventive" />
            <el-radio label="故障修复" value="repair" />
            <el-radio label="定期检查" value="inspection" />
            <el-radio label="软件升级" value="upgrade" />
            <el-radio label="硬件更换" value="replacement" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="维护时间" prop="maintenanceTime" required>
          <ElInput
            v-model="maintenanceOrderForm.maintenanceTime"
            type="datetime-local"
            placeholder="请选择维护时间"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <ElButton plain @click="closeDeviceResourceEfficiencyMaintenanceDialog">取消</ElButton>
        <ElButton type="primary" @click="submitMaintenanceOrderData(deviceResourceEfficiencyDetailSelectedRow.id)">提交</ElButton>
      </template>
    </el-dialog>

    <!-- 关键岗位人员详情弹窗 -->
    <el-dialog
      v-model="keyPersonnelDetailDialogVisible"
      width="40%"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="park-dialog"
      center
      destroy-on-close
      title="关键岗位人员详情"
    >
      <div class="header-actions" style="margin-bottom:10px;">
        <div class="actions-right">
          <div class="view-btn-group">
            <ElButton
              v-for="item in keyPersonnelDetailViewBtnList"
              :key="item"
              :type="activeKeyPersonnelDetailView === item ? 'primary' : ''"
              plain
              @click="changeKeyPersonnelDetailView(item)"
              class="view-btn"
            >
              {{ item }}
            </ElButton>
          </div>
        </div>
      </div>
      <!-- 人员详情视图 -->
      <div v-if="activeKeyPersonnelDetailView === '人员详情'" class="view-content" style="padding:0;">
        <ElDescriptions bordered :column="2" class="desc-detail">
          <ElDescriptionsItem label="人员ID" span="2">
            {{ keyPersonnelDetailSelectedRow.sysUserUserId || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="人员姓名">
            {{ keyPersonnelDetailSelectedRow.sysUserUserName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="联系电话">
            {{ keyPersonnelDetailSelectedRow.sysUserUserPhone || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="在岗时长(小时)">
            {{ keyPersonnelDetailSelectedRow.sysUserOnDutyTime || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="当前任务" span="2">
            {{ keyPersonnelDetailSelectedRow.taskAllTableTaskName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="最后操作时间" span="2">
            {{ keyPersonnelDetailSelectedRow.sysOperationLogOperateTime || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="岗位角色">
            {{ keyPersonnelDetailSelectedRow.sysRoleRoleName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="负责范围">
            {{ keyPersonnelDetailSelectedRow.sysAreaAreaName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="在线状态">
            <ElTag :type="getOnlineStatusType(keyPersonnelDetailSelectedRow.sysOnlineStatusName)">
              {{ keyPersonnelDetailSelectedRow.sysOnlineStatusName || '-' }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="对接商户名称">
            {{ keyPersonnelDetailSelectedRow.sysMerchantMerchantName || '-' }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>
      <!-- 权限范围视图 -->
      <div v-if="activeKeyPersonnelDetailView === '权限范围'" class="view-content" style="padding:0;">
        <div style="height:400px;">
          <ElTable
            :data="keyPersonnelDetailSelectedRow.permissionScope"
            border
            size="small"
            width="100%"
            height="100%"
            table-layout="fixed"
          >
            <ElTableColumn
              prop="scope"
              label="权限范围"
              align="center"
              width="120"
            />
            <ElTableColumn
              prop="value"
              label="权限内容"
              align="center"
              min-width="300"
            />
          </ElTable>
        </div>
      </div>
      <!-- 操作日志视图 -->
      <div v-if="activeKeyPersonnelDetailView === '操作日志'" class="view-content" style="padding:0;">
        <div style="height:400px;">
          <ElTable
            :data="keyPersonnelDetailSelectedRow.operationLogs"
            border
            size="small"
            width="100%"
            height="100%"
            table-layout="fixed"
          >
            <ElTableColumn
              prop="time"
              label="操作时间"
              align="center"
              width="160"
            />
            <ElTableColumn
              prop="operation"
              label="操作内容"
              align="center"
              min-width="200"
            />
            <ElTableColumn
              prop="result"
              label="操作结果"
              align="center"
              width="100"
            />
          </ElTable>
        </div>
      </div>
      <template #footer>
        <ElButton plain @click="closeKeyPersonnelDetailDialog">关闭</ElButton>
      </template>
    </el-dialog>
    <!-- 调度弹窗 -->
    <el-dialog
      v-model="keyPersonnelDispatchDialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="park-dialog"
      center
      destroy-on-close
      title="任务调度"
    >
      <el-form
        ref="dispatchTaskFormRef"
        :model="dispatchTaskForm"
        :rules="dispatchTaskFormRules"
        label-width="100px"
        style="width: 100%;"
      >
        <el-form-item label="任务内容" prop="taskContent" required>
          <el-input
            v-model="dispatchTaskForm.taskContent"
            type="textarea"
            :rows="4"
            placeholder="请输入任务内容（必填）"
          />
        </el-form-item>
        <el-form-item label="完成时限" prop="deadline" required>
          <ElInput
            v-model="dispatchTaskForm.deadline"
            type="datetime-local"
            placeholder="选择日期时间"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <ElButton plain @click="closeKeyPersonnelDispatchDialog">取消</ElButton>
        <ElButton type="primary" @click="submitDispatchTaskData(keyPersonnelDetailSelectedRow.sysUserUserId)">确认</ElButton>
      </template>
    </el-dialog>
    <!-- 留言弹窗 -->
    <el-dialog
      v-model="keyPersonnelMessageDialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="park-dialog"
      center
      destroy-on-close
      title="留言"
    >
      <el-form
        ref="personnelMessageFormRef"
        :model="personnelMessageForm"
        :rules="personnelMessageFormRules"
        label-width="80px"
        style="width: 100%;"
      >
        <el-form-item label="留言内容" prop="messageContent" required>
          <el-input
            v-model="personnelMessageForm.messageContent"
            type="textarea"
            :rows="6"
            placeholder="请输入留言内容（必填）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <ElButton plain @click="closeKeyPersonnelMessageDialog">取消</ElButton>
        <ElButton type="primary" @click="submitPersonnelMessageData(keyPersonnelDetailSelectedRow.sysUserUserId)">发送</ElButton>
      </template>
    </el-dialog>

    <!-- 终端设备详情弹窗 -->
    <ElDialog
      v-model="terminalDeviceDetailDialogVisible"
      width="40%"
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
      <!-- 设备详情视图 -->
      <div v-if="activeTerminalDeviceDetailView === '设备详情'" class="view-content" style="padding:0;">
        <ElDescriptions bordered :column="2" class="desc-detail">
          <ElDescriptionsItem label="设备编码" span="2">
            {{ terminalDeviceDetailSelectedRow.tbDeviceExtendDeviceCode || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="设备类型">
            {{ terminalDeviceDetailSelectedRow.sysEquipmentTypeName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="所属资产">
            {{ terminalDeviceDetailSelectedRow.tbAssetExtendName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="运行状态">
            <ElTag :type="getOperationStatusType(terminalDeviceDetailSelectedRow.sysOperationStatusName)">
              {{ terminalDeviceDetailSelectedRow.sysOperationStatusName || '-' }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="离线时长(小时)">
            {{ terminalDeviceDetailSelectedRow.tbDeviceExtendOfflineTime || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="故障类型">
            {{ terminalDeviceDetailSelectedRow.sysFaultTypeName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="核心监控数据" span="2">
            {{ terminalDeviceDetailSelectedRow.parkDeviceMonitorDataContent || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="所属区域">
            {{ terminalDeviceDetailSelectedRow.sysAreaAreaName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="责任人">
            {{ terminalDeviceDetailSelectedRow.sysMaintainUserUserName || '-' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="下次维护时间" span="2">
            {{ terminalDeviceDetailSelectedRow.tbDeviceExtendNextMaintainTime || '-' }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>
      <!-- 监控日志视图 -->
      <div v-if="activeTerminalDeviceDetailView === '监控日志'" class="view-content" style="padding:0;">
        <div style="height:400px;">
          <ElTable
            :data="terminalDeviceDetailSelectedRow.monitorLogs"
            border
            size="small"
            width="100%"
            height="100%"
            table-layout="fixed"
          >
            <ElTableColumn
              prop="time"
              label="监控时间"
              align="center"
              width="160"
            />
            <ElTableColumn
              prop="data"
              label="监控数据"
              align="center"
              min-width="200"
            />
            <ElTableColumn
              prop="status"
              label="状态"
              align="center"
              width="100"
            >
              <template #default="scope">
                <ElTag :type="scope.row.status === '正常' ? 'success' : 'danger'">
                  {{ scope.row.status }}
                </ElTag>
              </template>
            </ElTableColumn>
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
              prop="time"
              label="故障时间"
              align="center"
              width="160"
            />
            <ElTableColumn
              prop="type"
              label="故障类型"
              align="center"
              min-width="120"
            />
            <ElTableColumn
              prop="duration"
              label="持续时长"
              align="center"
              width="100"
            />
            <ElTableColumn
              prop="result"
              label="处理结果"
              align="center"
              width="100"
            >
              <template #default="scope">
                <ElTag :type="scope.row.result === '已修复' ? 'success' : 'warning'">
                  {{ scope.row.result }}
                </ElTag>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
      </div>
      <template #footer>
        <ElButton plain @click="closeTerminalDeviceDetailDialog">关闭</ElButton>
      </template>
    </ElDialog>
    <!-- 设备处置弹窗 -->
    <ElDialog
      v-model="terminalDeviceDisposalDialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="park-dialog"
      center
      destroy-on-close
      title="设备处置"
    >
      <el-form
        ref="deviceDisposalFormRef"
        :model="deviceDisposalForm"
        :rules="deviceDisposalFormRules"
        label-width="100px"
        style="width: 100%;"
      >
        <el-form-item label="处置措施" prop="disposalMeasures" required>
          <el-input
            v-model="deviceDisposalForm.disposalMeasures"
            type="textarea"
            :rows="4"
            placeholder="请输入处置措施（必填）"
          />
        </el-form-item>
        <el-form-item label="处置凭证">
          <el-upload
            v-model:file-list="deviceDisposalForm.disposalEvidence"
            action="#"
            multiple
            :limit="3"
            :on-exceed="handleFileExceed"
            :before-upload="handleBeforeUpload"
          >
            <ElButton type="primary">上传文件</ElButton>
            <template #tip>
              <div class="el-upload__tip">
                支持上传图片、文档等格式，最多3个文件（可选）
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <ElButton plain @click="closeTerminalDeviceDisposalDialog">取消</ElButton>
        <ElButton type="primary" @click="submitDisposalData(terminalDeviceDetailSelectedRow.tbDeviceExtendDeviceCode)">确认</ElButton>
      </template>
    </ElDialog>
    <!-- 设备维护弹窗 -->
    <ElDialog
      v-model="terminalDeviceMaintenanceDialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="park-dialog"
      center
      destroy-on-close
      title="设备维护"
    >
      <el-form
        ref="deviceMaintenanceFormRef"
        :model="deviceMaintenanceForm"
        :rules="deviceMaintenanceFormRules"
        label-width="100px"
        style="width: 100%;"
      >
        <el-form-item label="维护类型" prop="maintenanceType" required>
          <el-radio-group
            v-model="deviceMaintenanceForm.maintenanceType"
            placeholder="请选择维护类型"
            style="width: 100%;"
          >
            <el-radio label="日常巡检" value="日常巡检" />
            <el-radio label="预防性维护" value="预防性维护" />
            <el-radio label="紧急维修" value="紧急维修" />
            <el-radio label="软件升级" value="软件升级" />
            <el-radio label="硬件更换" value="硬件更换" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="维护时间" prop="maintenanceTime" required>
          <ElInput
            v-model="deviceMaintenanceForm.maintenanceTime"
            type="datetime-local"
            placeholder="选择维护时间"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <ElButton plain @click="closeTerminalDeviceMaintenanceDialog">取消</ElButton>
        <ElButton type="primary" @click="submitMaintenanceData(terminalDeviceDetailSelectedRow.tbDeviceExtendDeviceCode)">提交</ElButton>
      </template>
    </ElDialog>

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
</template>

<style lang="scss" scoped>
@import '../../../templatesstyle/common';
@import '../../../templatesstyle/table1';
@import '../../../templatesstyle/global-data-map';
@import '../../../templatesstyle/table3';
@import '../../../templatesstyle/table4';
@import '../../../templatesstyle/indicator-cards1';
@import '../../../templatesstyle/indicator-cards3';
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
