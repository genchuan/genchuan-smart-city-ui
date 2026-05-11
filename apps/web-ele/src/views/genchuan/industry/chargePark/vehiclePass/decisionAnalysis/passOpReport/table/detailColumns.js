import { createTimeFormatter } from '../../../utils/timeFormatter';

// 入场明细列配置
export const enterDetailColumns = [
  { type: 'checkbox', width: 40 },
  { field: 'plateNo', title: '车牌号', minWidth: 120 },
  { field: 'stationName', title: '场站名称', minWidth: 150 },
  { field: 'enterTime', title: '入场时间', minWidth: 160, formatter: createTimeFormatter() },
  { field: 'enterGate', title: '入场道口', minWidth: 100 },
  { field: 'identifyStatus', title: '识别状态', minWidth: 100 },
  { field: 'vehicleType', title: '车辆类型', minWidth: 100 },
];

// 离场明细列配置
export const leaveDetailColumns = [
  { type: 'checkbox', width: 40 },
  { field: 'plateNo', title: '车牌号', minWidth: 120 },
  { field: 'stationName', title: '场站名称', minWidth: 150 },
  { field: 'leaveTime', title: '离场时间', minWidth: 160, formatter: createTimeFormatter() },
  { field: 'leaveGate', title: '离场道口', minWidth: 100 },
  { field: 'parkDuration', title: '停车时长(分钟)', minWidth: 120 },
  { field: 'fee', title: '停车费用(元)', minWidth: 100 },
];

// 在停车辆明细列配置
export const parkingDetailColumns = [
  { type: 'checkbox', width: 40 },
  { field: 'plateNo', title: '车牌号', minWidth: 120 },
  { field: 'stationName', title: '场站名称', minWidth: 150 },
  { field: 'spaceNo', title: '车位号', minWidth: 100 },
  { field: 'enterTime', title: '入场时间', minWidth: 160, formatter: createTimeFormatter() },
  { field: 'parkDuration', title: '已停时长(分钟)', minWidth: 120 },
  { field: 'vehicleType', title: '车辆类型', minWidth: 100 },
];

// 车牌识别明细列配置
export const identifyDetailColumns = [
  { type: 'checkbox', width: 40 },
  { field: 'plateNo', title: '车牌号', minWidth: 120 },
  { field: 'stationName', title: '场站名称', minWidth: 150 },
  { field: 'identifyTime', title: '识别时间', minWidth: 160, formatter: createTimeFormatter() },
  { field: 'identifyStatus', title: '识别状态', minWidth: 100 },
  { field: 'confidence', title: '识别置信度(%)', minWidth: 120 },
  { field: 'gateNo', title: '道口编号', minWidth: 100 },
];

// 缴费核验明细列配置
export const checkDetailColumns = [
  { type: 'checkbox', width: 40 },
  { field: 'plateNo', title: '车牌号', minWidth: 120 },
  { field: 'stationName', title: '场站名称', minWidth: 150 },
  { field: 'checkTime', title: '核验时间', minWidth: 160, formatter: createTimeFormatter() },
  { field: 'checkStatus', title: '核验状态', minWidth: 100 },
  { field: 'fee', title: '应缴费用(元)', minWidth: 100 },
  { field: 'payStatus', title: '支付状态', minWidth: 100 },
];

// 异常处置明细列配置
export const abnormalDetailColumns = [
  { type: 'checkbox', width: 40 },
  { field: 'plateNo', title: '车牌号', minWidth: 120 },
  { field: 'stationName', title: '场站名称', minWidth: 150 },
  { field: 'abnormalType', title: '异常类型', minWidth: 120 },
  { field: 'abnormalTime', title: '异常时间', minWidth: 160, formatter: createTimeFormatter() },
  { field: 'handleStatus', title: '处置状态', minWidth: 100 },
  { field: 'handleTime', title: '处置时间', minWidth: 160, formatter: createTimeFormatter() },
  { field: 'handler', title: '处置人', minWidth: 100 },
];

// ETC通行明细列配置
export const etcDetailColumns = [
  { type: 'checkbox', width: 40 },
  { field: 'plateNo', title: '车牌号', minWidth: 120 },
  { field: 'stationName', title: '场站名称', minWidth: 150 },
  { field: 'passTime', title: '通行时间', minWidth: 160, formatter: createTimeFormatter() },
  { field: 'passType', title: '通行类型', minWidth: 100 },
  { field: 'etcStatus', title: 'ETC状态', minWidth: 100 },
  { field: 'fee', title: '扣费金额(元)', minWidth: 100 },
];
