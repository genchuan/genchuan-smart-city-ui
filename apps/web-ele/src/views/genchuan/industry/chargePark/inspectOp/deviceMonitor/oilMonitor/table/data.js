import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getRangePickerDefaultProps } from '#/utils';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';

export const OIL_MONITOR_PROCESS_STATUS_DICT =
  DICT_TYPE.OIL_MONITOR_PROCESS_STATUS;

function getDictLabel(dictType, value) {
  if (value === undefined || value === null || value === '') return '-';
  const dict = getDictObj(dictType, String(value));
  return dict?.label || value;
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

export function getProcessStatusLabel(value) {
  return getDictLabel(OIL_MONITOR_PROCESS_STATUS_DICT, value);
}

export function isProcessStatusLabel(value, label) {
  return isDictLabel(OIL_MONITOR_PROCESS_STATUS_DICT, value, label);
}
export const stationOptions = [
  { label: '泉州丰泽充电站', value: 1 },
  { label: '泉州鲤城公共停车场', value: 2 },
  { label: '洛江万安充停站', value: 3 },
  { label: '晋江池店综合能源站', value: 4 },
  { label: '石狮服装城充停站', value: 5 },
  { label: '南安水头交通枢纽站', value: 6 },
];

export const processUserOptions = [
  { label: '张维保', value: 1001 },
  { label: '李巡检', value: 1002 },
  { label: '王处置', value: 1003 },
  { label: '陈运维', value: 1004 },
];

export const processStatusOptions = getDictOptions(
  OIL_MONITOR_PROCESS_STATUS_DICT,
  'string',
);

export const processMethodOptions = [
  { label: '现场劝离', value: '现场劝离' },
  { label: '电话通知', value: '电话通知' },
  { label: '联动执法', value: '联动执法' },
  { label: '系统自动关闭', value: '系统自动关闭' },
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

export function getProcessUserName(processUserId) {
  return (
    processUserOptions.find((item) => item.value === Number(processUserId))
      ?.label || '-'
  );
}

export function getProcessStatusTagType(status) {
  const tagMap = {
    未处理: 'danger',
    处理中: 'warning',
    已关闭: 'success',
  };
  return getDictTagTypeFromDict(
    getDictObj(OIL_MONITOR_PROCESS_STATUS_DICT, String(status)),
    tagMap[getProcessStatusLabel(status)] || 'info',
  );
}

export function dataList() {
  return spaceCodes.map((spaceCode, index) => {
    const station = stationOptions[index % stationOptions.length];
    const statusCycle = ['未处理', '处理中', '已关闭', '未处理'];
    const processStatus = statusCycle[index % statusCycle.length];
    const identifyTime = baseTime + index * 20 * 60 * 1000;
    const processUser =
      processStatus === '未处理'
        ? null
        : processUserOptions[index % processUserOptions.length];
    let processProgress = 0;
    if (processStatus === '已关闭') {
      processProgress = 100;
    } else if (processStatus === '处理中') {
      processProgress = 60 + (index % 3) * 10;
    }

    return {
      id: index + 1,
      spaceId: 201 + index,
      spaceCode,
      stationId: station.value,
      stationName: station.label,
      regionName: ['丰泽区', '鲤城区', '洛江区', '晋江市'][index % 4],
      identifyTime,
      processStatus,
      processUserId: processUser?.value || null,
      processUserName: processUser?.label || '',
      processMethod:
        processStatus === '未处理'
          ? ''
          : processMethodOptions[index % processMethodOptions.length].value,
      processTime:
        processStatus === '未处理' ? null : identifyTime + 30 * 60 * 1000,
      ignoreReason: index === 6 ? '误识别，现场核实无油车占用情况' : '',
      processProgress,
      longitude: Number((118.675_324 + index * 0.0023).toFixed(6)),
      latitude: Number((24.896_541 + index * 0.0018).toFixed(6)),
      creator: index % 2 === 0 ? 'admin' : 'operator',
      updater: processStatus === '未处理' ? 'system' : processUser?.label,
      createTime: identifyTime,
      updateTime: identifyTime + 45 * 60 * 1000,
    };
  });
}

export function normalizeOilMonitorRow(row) {
  const stationId = row.stationId ?? row.station_id;
  const spaceId = row.spaceId ?? row.space_id;
  const processUserId = row.processUserId ?? row.process_user_id;
  const identifyTime = row.identifyTime ?? row.identify_time;
  const processTime = row.processTime ?? row.process_time;
  const createTime = row.createTime ?? row.create_time;
  const updateTime = row.updateTime ?? row.update_time;
  const processStatus =
    row.processStatusName ||
    row.processStatus ||
    row.process_status ||
    '未处理';

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
    identifyTime,
    identifyTimeStr: formatMonitorTime(identifyTime),
    processStatus,
    processUserId,
    processUserName:
      row.processUserName ||
      row.process_user_name ||
      getProcessUserName(processUserId),
    processMethod: row.processMethod || row.process_method || '',
    processTime,
    processTimeStr: formatMonitorTime(processTime),
    ignoreReason: row.ignoreReason || row.ignore_reason || '',
    processProgress: Number(row.processProgress ?? row.process_progress ?? 0),
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
  const list = dataList().map((item) => normalizeOilMonitorRow(item));
  const timeRange = params.timeRange || params.identifyTime;

  return list.filter((item) => {
    const matchSpace =
      !params.spaceId ||
      String(item.spaceId).includes(String(params.spaceId)) ||
      item.spaceCode.includes(String(params.spaceId));
    const matchStation =
      !params.stationId || Number(item.stationId) === Number(params.stationId);
    const matchStatus = isSameDictValue(
      OIL_MONITOR_PROCESS_STATUS_DICT,
      item.processStatus,
      params.processStatus,
    );
    const matchUser =
      !params.processUserId ||
      Number(item.processUserId) === Number(params.processUserId);
    const matchTrendTime =
      !params.trendTime ||
      item.identifyTimeStr.includes(String(params.trendTime));
    const matchStationName =
      !params.stationName || item.stationName === params.stationName;
    const matchTimeRange =
      !Array.isArray(timeRange) ||
      timeRange.length !== 2 ||
      (Number(item.identifyTime) >= Number(timeRange[0]) &&
        Number(item.identifyTime) <= Number(timeRange[1]));

    return (
      matchSpace &&
      matchStation &&
      matchStatus &&
      matchUser &&
      matchTrendTime &&
      matchStationName &&
      matchTimeRange
    );
  });
}

export function getMockChartData() {
  const list = dataList().map((item) => normalizeOilMonitorRow(item));
  const waitProcessCount = list.filter(
    (item) => item.processStatus === '未处理',
  ).length;
  const finishCount = list.filter(
    (item) => item.processStatus === '已关闭',
  ).length;
  const processFinishRate = list.length === 0 ? 0 : finishCount / list.length;
  const trendData = ['08', '09', '10', '11', '12', '13'].map((time, index) => ({
    time,
    identifyCount: 2 + ((index + 1) % 4),
  }));
  const stationData = stationOptions.map((station) => ({
    stationId: station.value,
    stationName: station.label,
    count: list.filter((item) => item.stationId === station.value).length,
  }));

  return {
    trendData,
    stationData,
    cardData: {
      waitProcessCount,
      processFinishRate,
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
      fieldName: 'processStatus',
      label: '处置状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择处置状态',
        clearable: true,
        options: processStatusOptions,
      },
    },
    {
      fieldName: 'identifyTime',
      label: '识别时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
    // {
    //   fieldName: 'processUserId',
    //   label: '处置人',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择处置人',
    //     clearable: true,
    //     options: processUserOptions,
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
    {
      field: 'identifyTimeStr',
      title: '识别时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'processStatus',
      title: '处置状态',
      minWidth: 110,
      sortable: true,
      slots: { default: 'process_status' },
    },
    {
      field: 'processUserName',
      title: '处置人',
      minWidth: 120,
      sortable: true,
      slots: { default: 'process_user' },
    },
    {
      field: 'processTimeStr',
      title: '处置时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'ignoreReason',
      title: '忽略理由',
      minWidth: 200,
      sortable: true,
      slots: { default: 'ignore_reason' },
    },
    {
      field: 'processProgress',
      title: '处置进度',
      minWidth: 140,
      sortable: true,
      slots: { default: 'process_progress' },
    },
    {
      title: '操作',
      width: 170,
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
  { key: 'identifyTimeStr', label: '识别时间' },
  {
    key: 'processStatus',
    label: '处置状态',
    type: 'tag',
    tagType: getProcessStatusTagType,
    formatter: getProcessStatusLabel,
  },
  { key: 'processUserName', label: '处置人' },
  { key: 'processMethod', label: '处置方式' },
  { key: 'processTimeStr', label: '处置时间' },
  { key: 'ignoreReason', label: '忽略理由' },
  { key: 'processProgress', label: '处置进度' },
  { key: 'longitude', label: '经度' },
  { key: 'latitude', label: '纬度' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'updateTimeStr', label: '更新时间' },
];

export const textObj = {
  excelAllName: '油车占位监测数据.xlsx',
  total: '油车占位监测支持占位识别、告警推送、占位处置、占位关闭闭环管理',
};
