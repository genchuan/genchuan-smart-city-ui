import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getRangePickerDefaultProps } from '#/utils';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatLocalDateTime } from '#/views/genchuan/industry/chargePark/inspectOp/utils/formatLocalDateTime';

export const SHARE_CHARGE_MONITOR_STATUS_DICT =
  DICT_TYPE.SHARE_CHARGE_MONITOR_STATUS;
export const SHARE_CHARGE_MONITOR_ALARM_STATUS_DICT =
  DICT_TYPE.SHARE_CHARGE_MONITOR_ALARM_STATUS;
export const SHARE_CHARGE_MONITOR_PROCESS_STATUS_DICT =
  DICT_TYPE.SHARE_CHARGE_MONITOR_PROCESS_STATUS;

function getDictLabel(dictType, value) {
  if (value === undefined || value === null || value === '') return '-';
  const dict = getDictObj(dictType, String(value));
  return dict?.label || value;
}

function getDictValueByLabel(dictType, label, fallback = label) {
  const options = getDictOptions(dictType, 'string');
  const option = options.find(
    (item) => item.label === label || String(item.value) === String(label),
  );
  return option?.value ?? fallback;
}

function isDictLabel(dictType, value, label) {
  return (
    String(value) === String(label) || getDictLabel(dictType, value) === label
  );
}

function isSameDictValue(dictType, current, target) {
  if (!target) return true;
  return (
    String(current) === String(target) ||
    getDictLabel(dictType, current) === getDictLabel(dictType, target)
  );
}

export function getMonitorStatusLabel(value) {
  return getDictLabel(SHARE_CHARGE_MONITOR_STATUS_DICT, value);
}

export function isMonitorStatusLabel(value, label) {
  return isDictLabel(SHARE_CHARGE_MONITOR_STATUS_DICT, value, label);
}

export function getMonitorStatusValueByLabel(label) {
  return getDictValueByLabel(SHARE_CHARGE_MONITOR_STATUS_DICT, label);
}

export function getAlarmStatusLabel(value) {
  return getDictLabel(SHARE_CHARGE_MONITOR_ALARM_STATUS_DICT, value);
}

export function isAlarmStatusLabel(value, label) {
  return isDictLabel(SHARE_CHARGE_MONITOR_ALARM_STATUS_DICT, value, label);
}

export function getProcessStatusLabel(value) {
  return getDictLabel(SHARE_CHARGE_MONITOR_PROCESS_STATUS_DICT, value);
}

export function isProcessStatusLabel(value, label) {
  return isDictLabel(SHARE_CHARGE_MONITOR_PROCESS_STATUS_DICT, value, label);
}
export const stationOptions = [
  { label: '泉州丰泽充电站', value: 1 },
  { label: '泉州鲤城公共停车场', value: 2 },
  { label: '洛江万安充停站', value: 3 },
  { label: '晋江池店综合能源站', value: 4 },
  { label: '石狮服装城充停站', value: 5 },
  { label: '南安水头交通枢纽站', value: 6 },
];

export const monitorStatusOptions = getDictOptions(
  SHARE_CHARGE_MONITOR_STATUS_DICT,
  'string',
);

export const alarmStatusOptions = getDictOptions(
  SHARE_CHARGE_MONITOR_ALARM_STATUS_DICT,
  'string',
);

export const processStatusOptions = getDictOptions(
  SHARE_CHARGE_MONITOR_PROCESS_STATUS_DICT,
  'string',
);

const deviceCodes = [
  'SC-01',
  'SC-02',
  'SC-03',
  'SC-04',
  'SC-05',
  'SC-06',
  'SC-07',
  'SC-08',
  'SC-09',
  'SC-10',
  'SC-11',
  'SC-12',
];

const baseTime = 1_775_011_986_000;

export function formatMonitorTime(value) {
  if (!value) return '-';
  const text = String(value);
  return formatLocalDateTime(value) || text;
}

export function getStationName(stationId) {
  return (
    stationOptions.find((item) => item.value === Number(stationId))?.label ||
    '-'
  );
}

export function getMonitorStatusTagType(status) {
  const tagMap = {
    正常: 'success',
    异常: 'danger',
  };
  return getDictTagTypeFromDict(
    getDictObj(SHARE_CHARGE_MONITOR_STATUS_DICT, String(status)),
    tagMap[getMonitorStatusLabel(status)] || 'info',
  );
}

export function getAlarmStatusTagType(status) {
  const tagMap = {
    未告警: 'info',
    已告警: 'warning',
  };
  return getDictTagTypeFromDict(
    getDictObj(SHARE_CHARGE_MONITOR_ALARM_STATUS_DICT, String(status)),
    tagMap[getAlarmStatusLabel(status)] || 'info',
  );
}

export function getProcessStatusTagType(status) {
  const tagMap = {
    未处理: 'info',
    处理中: 'warning',
    已处理: 'success',
  };
  return getDictTagTypeFromDict(
    getDictObj(SHARE_CHARGE_MONITOR_PROCESS_STATUS_DICT, String(status)),
    tagMap[getProcessStatusLabel(status)] || 'info',
  );
}

export function dataList() {
  return deviceCodes.map((deviceCode, index) => {
    const isAbnormal = [1, 5, 9].includes(index);
    const station = stationOptions[index % stationOptions.length];
    const monitorTime = baseTime + index * 12 * 60 * 1000;
    const alarmTime = isAbnormal ? monitorTime + 3 * 60 * 1000 : null;
    let processStatus = '已处理';
    if (isAbnormal) {
      processStatus = index % 2 === 0 ? '处理中' : '未处理';
    }

    return {
      id: index + 1,
      deviceId: 401 + index,
      deviceCode,
      deviceName: `${deviceCode} 共享充电设备`,
      stationId: station.value,
      stationName: station.label,
      regionName: ['丰泽区', '鲤城区', '洛江区', '晋江市'][index % 4],
      monitorTime,
      monitorStatus: isAbnormal ? '异常' : '正常',
      alarmStatus: isAbnormal ? '已告警' : '未告警',
      alarmTime,
      alarmRemark: isAbnormal ? '共享充电宝柜机离线，触发异常告警' : '',
      processStatus,
      longitude: Number((118.675_324 + index * 0.002).toFixed(6)),
      latitude: Number((24.896_541 + index * 0.0015).toFixed(6)),
      creator: index % 2 === 0 ? 'admin' : 'operator',
      updater: isAbnormal ? '运维人员' : 'system',
      createTime: monitorTime - 30 * 60 * 1000,
      updateTime: monitorTime,
    };
  });
}

export function normalizeShareChargeMonitorRow(row) {
  const stationId = row.stationId ?? row.station_id;
  const deviceId = row.deviceId ?? row.device_id;
  const monitorStatus =
    row.monitorStatusName || row.monitorStatus || row.monitor_status;
  const alarmStatus =
    row.alarmStatusName || row.alarmStatus || row.alarm_status || '未告警';
  const processStatus =
    row.processStatusName ||
    row.processStatus ||
    row.process_status ||
    '未处理';
  const monitorTime = row.monitorTime ?? row.monitor_time;
  const alarmTime = row.alarmTime ?? row.alarm_time;
  const createTime = row.createTime ?? row.create_time;
  const updateTime = row.updateTime ?? row.update_time;

  return {
    ...row,
    id: row.id,
    deviceId,
    deviceCode:
      row.deviceCode ||
      row.deviceName ||
      row.device_code ||
      `${deviceId || row.id}`,
    deviceName:
      row.deviceName ||
      row.device_name ||
      row.deviceCode ||
      row.device_code ||
      '-',
    stationId,
    stationName:
      row.stationName || row.station_name || getStationName(stationId),
    regionName: row.regionName || row.region_name || '-',
    monitorTime,
    monitorTimeStr: formatMonitorTime(monitorTime),
    monitorStatus,
    alarmStatus,
    alarmTime,
    alarmTimeStr: formatMonitorTime(alarmTime),
    alarmRemark: row.alarmRemark || row.alarm_remark || '',
    processStatus,
    longitude: row.longitude ?? row.lon,
    latitude: row.latitude ?? row.lat,
    creator: row.creator || '-',
    updater: row.updater || '-',
    createTime,
    createTimeStr: formatMonitorTime(createTime),
    updateTime,
    updateTimeStr: formatMonitorTime(updateTime),
  };
}

export function filterMockList(params = {}) {
  const list = dataList().map((item) => normalizeShareChargeMonitorRow(item));
  const timeRange = params.timeRange || params.monitorTime;

  return list.filter((item) => {
    const matchDevice =
      !params.deviceId ||
      String(item.deviceId).includes(String(params.deviceId)) ||
      item.deviceCode.includes(String(params.deviceId));
    const matchStation =
      !params.stationId || Number(item.stationId) === Number(params.stationId);
    const matchMonitorStatus = isSameDictValue(
      SHARE_CHARGE_MONITOR_STATUS_DICT,
      item.monitorStatus,
      params.monitorStatus,
    );
    const matchAlarmStatus = isSameDictValue(
      SHARE_CHARGE_MONITOR_ALARM_STATUS_DICT,
      item.alarmStatus,
      params.alarmStatus,
    );
    const matchProcessStatus = isSameDictValue(
      SHARE_CHARGE_MONITOR_PROCESS_STATUS_DICT,
      item.processStatus,
      params.processStatus,
    );
    const matchTrendTime =
      !params.trendTime ||
      item.monitorTimeStr.includes(String(params.trendTime));
    const matchTimeRange =
      !Array.isArray(timeRange) ||
      timeRange.length !== 2 ||
      (Number(item.monitorTime) >= Number(timeRange[0]) &&
        Number(item.monitorTime) <= Number(timeRange[1]));

    return (
      matchDevice &&
      matchStation &&
      matchMonitorStatus &&
      matchAlarmStatus &&
      matchProcessStatus &&
      matchTrendTime &&
      matchTimeRange
    );
  });
}

export function getMockChartData() {
  const list = dataList().map((item) => normalizeShareChargeMonitorRow(item));
  const normalDevice = list.filter(
    (item) => item.monitorStatus === '正常',
  ).length;
  const abnormalDevice = list.filter(
    (item) => item.monitorStatus === '异常',
  ).length;
  const trendData = ['08', '09', '10', '11', '12', '13'].map((time, index) => ({
    time,
    normalCount: Math.max(normalDevice - (index % 2), 0),
    abnormalCount: abnormalDevice + (index % 3),
  }));

  return {
    mapData: list.map((item) => ({
      id: item.id,
      name: item.deviceCode,
      status: item.monitorStatus,
      lon: item.longitude,
      lat: item.latitude,
      stationName: item.stationName,
      regionName: item.regionName,
    })),
    trendData,
    cardData: {
      normalDevice,
      abnormalDevice,
    },
  };
}
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'deviceId',
      label: '设备',
      component: 'Input',
      componentProps: {
        placeholder: '请输入设备编号或ID',
        clearable: true,
      },
    },
    {
      fieldName: 'stationName',
      label: '所属场站',
      component: 'Input',
      componentProps: {
        placeholder: '请输入所属场站',
        clearable: true,
        // options: stationOptions,
      },
    },
    {
      fieldName: 'monitorStatus',
      label: '监测状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择监测状态',
        clearable: true,
        options: monitorStatusOptions,
      },
    },
    {
      fieldName: 'updateTime',
      label: '更新时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
    // {
    //   fieldName: 'alarmStatus',
    //   label: '告警状态',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择告警状态',
    //     clearable: true,
    //     options: alarmStatusOptions,
    //   },
    // },
    // {
    //   fieldName: 'processStatus',
    //   label: '处理状态',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择处理状态',
    //     clearable: true,
    //     options: processStatusOptions,
    //   },
    // },
  ];
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '监测ID', minWidth: 90, sortable: true },
    {
      field: 'deviceCode',
      title: '设备',
      minWidth: 130,
      sortable: true,
      slots: { default: 'device_code' },
    },
    {
      field: 'stationName',
      title: '所属场站',
      minWidth: 190,
      sortable: true,
      slots: { default: 'station_name' },
    },
    // { field: 'regionName', title: '所属区域', minWidth: 110, sortable: true },
    {
      field: 'monitorStatus',
      title: '监测状态',
      minWidth: 110,
      sortable: true,
      slots: { default: 'monitor_status' },
    },
    {
      field: 'monitorTimeStr',
      title: '更新时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'alarmStatus',
      title: '告警状态',
      minWidth: 110,
      sortable: true,
      slots: { default: 'alarm_status' },
    },
    {
      field: 'alarmTimeStr',
      title: '告警时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'alarm_time' },
    },
    {
      field: 'processStatus',
      title: '处理状态',
      minWidth: 110,
      sortable: true,
      slots: { default: 'process_status' },
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const detailFields = [
  { key: 'id', label: '监测ID' },
  { key: 'deviceCode', label: '设备编号' },
  // { key: 'deviceName', label: '设备名称' },
  // { key: 'deviceId', label: '设备ID' },
  { key: 'stationName', label: '所属场站' },
  // { key: 'stationId', label: '场站ID' },
  // { key: 'regionName', label: '所属区域' },
  {
    key: 'monitorStatus',
    label: '监测状态',
    type: 'tag',
    tagType: getMonitorStatusTagType,
    formatter: getMonitorStatusLabel,
  },
  { key: 'monitorTimeStr', label: '更新时间' },
  {
    key: 'alarmStatus',
    label: '告警状态',
    type: 'tag',
    tagType: getAlarmStatusTagType,
    formatter: getAlarmStatusLabel,
  },
  { key: 'alarmTimeStr', label: '告警时间' },
  { key: 'alarmRemark', label: '告警备注' },
  {
    key: 'processStatus',
    label: '处理状态',
    type: 'tag',
    tagType: getProcessStatusTagType,
    formatter: getProcessStatusLabel,
  },
  { key: 'longitude', label: '经度' },
  { key: 'latitude', label: '纬度' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'updateTimeStr', label: '更新时间' },
];

export const textObj = {
  excelAllName: '共享充电监测数据.xlsx',
  total: '共享充电监测支持状态采集、状态更新、异常标记、状态同步闭环管理',
};
