import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getRangePickerDefaultProps } from '#/utils';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';

export const stationOptions = [
  { label: '泉州丰泽充电站', value: 1 },
  { label: '泉州鲤城公共停车场', value: 2 },
  { label: '洛江万安充停站', value: 3 },
  { label: '晋江池店综合能源站', value: 4 },
  { label: '石狮服装城充停站', value: 5 },
  { label: '南安水头交通枢纽站', value: 6 },
];

export const SPACE_MONITOR_STATUS_DICT = DICT_TYPE.SPACE_MONITOR_STATUS;
export const SPACE_MONITOR_ALARM_STATUS_DICT =
  DICT_TYPE.SPACE_MONITOR_ALARM_STATUS;
export const SPACE_MONITOR_PROCESS_STATUS_DICT =
  DICT_TYPE.SPACE_MONITOR_PROCESS_STATUS;

export const monitorStatusOptions = getDictOptions(
  SPACE_MONITOR_STATUS_DICT,
  'string',
);
export const alarmStatusOptions = getDictOptions(
  SPACE_MONITOR_ALARM_STATUS_DICT,
  'string',
);
export const processStatusOptions = getDictOptions(
  SPACE_MONITOR_PROCESS_STATUS_DICT,
  'string',
);

const spaceCodes = [
  'A-01',
  'A-02',
  'A-03',
  'A-04',
  'B-01',
  'B-02',
  'B-03',
  'C-01',
  'C-02',
  'C-03',
  'D-01',
  'D-02',
];

const baseTime = 1_775_011_986_000;

export function formatMonitorTime(value) {
  if (!value) return '-';
  const text = String(value);
  const timestamp = /^\d{10}$/.test(text) ? Number(text) * 1000 : value;
  return formatDate(timestamp) || text;
}

export function getStationName(stationId) {
  return (
    stationOptions.find((item) => item.value === Number(stationId))?.label ||
    '-'
  );
}

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

export function getMonitorStatusLabel(status) {
  return getDictLabel(SPACE_MONITOR_STATUS_DICT, status);
}

export function getAlarmStatusLabel(status) {
  return getDictLabel(SPACE_MONITOR_ALARM_STATUS_DICT, status);
}

export function getProcessStatusLabel(status) {
  return getDictLabel(SPACE_MONITOR_PROCESS_STATUS_DICT, status);
}

export function getMonitorStatusValueByLabel(label) {
  return getDictValueByLabel(SPACE_MONITOR_STATUS_DICT, label);
}

export function isMonitorNormal(status) {
  return isDictLabel(SPACE_MONITOR_STATUS_DICT, status, '正常');
}

export function isMonitorAbnormal(status) {
  return isDictLabel(SPACE_MONITOR_STATUS_DICT, status, '异常');
}

export function isAlarmedStatus(status) {
  return isDictLabel(SPACE_MONITOR_ALARM_STATUS_DICT, status, '已告警');
}

export function getMonitorStatusTagType(status) {
  const dict = getDictObj(SPACE_MONITOR_STATUS_DICT, String(status));
  if (dict) {
    return getDictTagTypeFromDict(
      dict,
      isMonitorAbnormal(status) ? 'danger' : 'success',
    );
  }
  return isMonitorAbnormal(status) ? 'danger' : 'success';
}

export function getAlarmStatusTagType(status) {
  const dict = getDictObj(SPACE_MONITOR_ALARM_STATUS_DICT, String(status));
  if (dict) {
    return getDictTagTypeFromDict(
      dict,
      isAlarmedStatus(status) ? 'warning' : 'info',
    );
  }
  return isAlarmedStatus(status) ? 'warning' : 'info';
}

export function getProcessStatusTagType(status) {
  const dict = getDictObj(SPACE_MONITOR_PROCESS_STATUS_DICT, String(status));
  if (dict) {
    return getDictTagTypeFromDict(
      dict,
      isDictLabel(SPACE_MONITOR_PROCESS_STATUS_DICT, status, '已处理')
        ? 'success'
        : 'warning',
    );
  }
  if (isDictLabel(SPACE_MONITOR_PROCESS_STATUS_DICT, status, '已处理')) {
    return 'success';
  }
  if (isDictLabel(SPACE_MONITOR_PROCESS_STATUS_DICT, status, '处理中')) {
    return 'warning';
  }
  return 'info';
}

export function dataList() {
  return spaceCodes.map((spaceCode, index) => {
    const isAbnormal = [2, 5, 8, 11].includes(index);
    const station = stationOptions[index % stationOptions.length];
    const monitorTime = baseTime + index * 15 * 60 * 1000;
    const alarmTime = isAbnormal ? monitorTime + 2 * 60 * 1000 : null;
    let processStatus = '已处理';
    if (isAbnormal) {
      processStatus = index % 3 === 0 ? '处理中' : '未处理';
    }

    return {
      id: index + 1,
      spaceId: 101 + index,
      spaceCode,
      stationId: station.value,
      stationName: station.label,
      regionName: ['丰泽区', '鲤城区', '洛江区', '晋江市'][index % 4],
      monitorTime,
      monitorStatus: isAbnormal ? '异常' : '正常',
      alarmStatus: isAbnormal ? '已告警' : '未告警',
      alarmTime,
      alarmRemark: isAbnormal ? '车位状态异常，无法更新' : '',
      processStatus,
      longitude: Number((118.675_324 + index * 0.0021).toFixed(6)),
      latitude: Number((24.896_541 + index * 0.0016).toFixed(6)),
      creator: index % 2 === 0 ? 'admin' : 'operator',
      updater: 'system',
      createTime: monitorTime - 30 * 60 * 1000,
      updateTime: monitorTime,
    };
  });
}

export function normalizeSpaceMonitorRow(row) {
  const stationId = row.stationId ?? row.station_id;
  const spaceId = row.spaceId ?? row.space_id;
  const monitorStatus =
    row.monitorStatus ?? row.monitor_status ?? row.monitorStatusName;
  const alarmStatus =
    row.alarmStatus ?? row.alarm_status ?? row.alarmStatusName ?? '未告警';
  const processStatus =
    row.processStatus ??
    row.process_status ??
    row.processStatusName ??
    '未处理';
  const monitorTime = row.monitorTime ?? row.monitor_time;
  const alarmTime = row.alarmTime ?? row.alarm_time;
  const createTime = row.createTime ?? row.create_time;
  const updateTime = row.updateTime ?? row.update_time;

  return {
    ...row,
    id: row.id,
    spaceId,
    spaceCode:
      row.spaceCode ||
      row.spaceName ||
      row.space_code ||
      `P-${spaceId || row.id}`,
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
  const list = dataList().map((item) => normalizeSpaceMonitorRow(item));
  const timeRange = params.timeRange || params.monitorTime;

  return list.filter((item) => {
    const matchSpace =
      !params.spaceId ||
      String(item.spaceId).includes(String(params.spaceId)) ||
      item.spaceCode.includes(String(params.spaceId));
    const matchStation =
      !params.stationId || Number(item.stationId) === Number(params.stationId);
    const matchMonitorStatus = isSameDictValue(
      SPACE_MONITOR_STATUS_DICT,
      item.monitorStatus,
      params.monitorStatus,
    );
    const matchAlarmStatus = isSameDictValue(
      SPACE_MONITOR_ALARM_STATUS_DICT,
      item.alarmStatus,
      params.alarmStatus,
    );
    const matchProcessStatus = isSameDictValue(
      SPACE_MONITOR_PROCESS_STATUS_DICT,
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
      matchSpace &&
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
  const list = dataList().map((item) => normalizeSpaceMonitorRow(item));
  const normalSpace = list.filter((item) =>
    isMonitorNormal(item.monitorStatus),
  ).length;
  const abnormalSpace = list.filter((item) =>
    isMonitorAbnormal(item.monitorStatus),
  ).length;
  const trendData = ['08', '09', '10', '11', '12', '13'].map((time, index) => ({
    time,
    normalCount: Math.max(normalSpace - (index % 2), 0),
    abnormalCount: abnormalSpace + (index % 3),
  }));

  return {
    mapData: list.map((item) => ({
      id: item.id,
      name: item.spaceCode,
      status: getMonitorStatusLabel(item.monitorStatus),
      lon: item.longitude,
      lat: item.latitude,
      stationName: item.stationName,
      regionName: item.regionName,
    })),
    trendData,
    cardData: {
      normalSpace,
      abnormalSpace,
    },
  };
}
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'spaceId',
      label: '车位',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位编号或ID',
        clearable: true,
      },
    },
    {
      fieldName: 'stationId',
      label: '所属场站',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属场站',
        clearable: true,
        options: stationOptions,
      },
    },
    {
      fieldName: 'monitorStatus',
      label: '监测状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择监测状态',
        clearable: true,
        options: getDictOptions(SPACE_MONITOR_STATUS_DICT, 'string'),
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
    //     options: getDictOptions(SPACE_MONITOR_ALARM_STATUS_DICT, 'string'),
    //   },
    // },
    // {
    //   fieldName: 'processStatus',
    //   label: '处理状态',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择处理状态',
    //     clearable: true,
    //     options: getDictOptions(SPACE_MONITOR_PROCESS_STATUS_DICT, 'string'),
    //   },
    // },
  ];
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '监测ID',
      minWidth: 90,
      sortable: true,
    },
    {
      field: 'spaceCode',
      title: '车位',
      minWidth: 120,
      sortable: true,
      slots: { default: 'space_code' },
    },
    {
      field: 'stationName',
      title: '所属场站',
      minWidth: 190,
      sortable: true,
      slots: { default: 'station_name' },
    },
    // {
    //   field: 'regionName',
    //   title: '所属区域',
    //   minWidth: 110,
    //   sortable: true,
    // },
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
  { key: 'spaceCode', label: '车位' },
  // { key: 'spaceId', label: '车位ID' },
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
  excelAllName: '车位状态监测数据.xlsx',
  total: '车位状态监测支持状态采集、状态更新、异常标记、状态同步闭环管理',
};
