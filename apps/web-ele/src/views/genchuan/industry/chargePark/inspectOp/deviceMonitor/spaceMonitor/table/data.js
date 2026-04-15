import { formatDate } from '#/utils/genchuan/formatTime';

export const stationOptions = [
  { label: '泉州丰泽充电站', value: 1 },
  { label: '泉州鲤城公共停车场', value: 2 },
  { label: '洛江万安充停站', value: 3 },
  { label: '晋江池店综合能源站', value: 4 },
  { label: '石狮服装城充停站', value: 5 },
  { label: '南安水头交通枢纽站', value: 6 },
];

export const monitorStatusOptions = [
  { label: '正常', value: '正常' },
  { label: '异常', value: '异常' },
];

export const alarmStatusOptions = [
  { label: '未告警', value: '未告警' },
  { label: '已告警', value: '已告警' },
];

export const processStatusOptions = [
  { label: '未处理', value: '未处理' },
  { label: '处理中', value: '处理中' },
  { label: '已处理', value: '已处理' },
];

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

export function getMonitorStatusTagType(status) {
  return status === '异常' ? 'danger' : 'success';
}

export function getAlarmStatusTagType(status) {
  return status === '已告警' ? 'warning' : 'info';
}

export function getProcessStatusTagType(status) {
  if (status === '已处理') return 'success';
  if (status === '处理中') return 'warning';
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
    const matchMonitorStatus =
      !params.monitorStatus || item.monitorStatus === params.monitorStatus;
    const matchAlarmStatus =
      !params.alarmStatus || item.alarmStatus === params.alarmStatus;
    const matchProcessStatus =
      !params.processStatus || item.processStatus === params.processStatus;
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
  const normalSpace = list.filter(
    (item) => item.monitorStatus === '正常',
  ).length;
  const abnormalSpace = list.filter(
    (item) => item.monitorStatus === '异常',
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
      status: item.monitorStatus,
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
        options: monitorStatusOptions,
      },
    },
    {
      fieldName: 'timeRange',
      label: '更新时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择更新时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'timestamp',
        type: 'datetimerange',
        clearable: true,
      },
    },
    {
      fieldName: 'alarmStatus',
      label: '告警状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择告警状态',
        clearable: true,
        options: alarmStatusOptions,
      },
    },
    {
      fieldName: 'processStatus',
      label: '处理状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择处理状态',
        clearable: true,
        options: processStatusOptions,
      },
    },
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
    {
      field: 'regionName',
      title: '所属区域',
      minWidth: 110,
      sortable: true,
    },
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
  { key: 'spaceId', label: '车位ID' },
  { key: 'stationName', label: '所属场站' },
  { key: 'stationId', label: '场站ID' },
  { key: 'regionName', label: '所属区域' },
  {
    key: 'monitorStatus',
    label: '监测状态',
    type: 'tag',
    tagType: getMonitorStatusTagType,
  },
  { key: 'monitorTimeStr', label: '更新时间' },
  {
    key: 'alarmStatus',
    label: '告警状态',
    type: 'tag',
    tagType: getAlarmStatusTagType,
  },
  { key: 'alarmTimeStr', label: '告警时间' },
  { key: 'alarmRemark', label: '告警备注' },
  {
    key: 'processStatus',
    label: '处理状态',
    type: 'tag',
    tagType: getProcessStatusTagType,
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
