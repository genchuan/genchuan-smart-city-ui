import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getInspectUserPage } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectUser';
import { getRangePickerDefaultProps } from '#/utils';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatLocalDateTime } from '#/views/genchuan/industry/chargePark/inspectOp/utils/formatLocalDateTime';

export const INSPECT_TRACK_STATUS_DICT = DICT_TYPE.INSPECT_TRACK_STATUS;

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

export function getTrackStatusLabel(value) {
  return getDictLabel(INSPECT_TRACK_STATUS_DICT, value);
}

export function isTrackStatusLabel(value, label) {
  return isDictLabel(INSPECT_TRACK_STATUS_DICT, value, label);
}
const DEFAULT_USER_OPTIONS = [
  { label: '张三', value: 1 },
  { label: '李四', value: 2 },
  { label: '王五', value: 3 },
  { label: '赵六', value: 4 },
];
export const userOptions = [...DEFAULT_USER_OPTIONS];
let userOptionsLoaded = false;
let userOptionsLoadingPromise = null;

export async function loadTrackUserOptions() {
  if (userOptionsLoaded) return;
  if (userOptionsLoadingPromise) {
    await userOptionsLoadingPromise;
    return;
  }

  userOptionsLoadingPromise = (async () => {
    try {
      const response = await getInspectUserPage({
        pageNo: 1,
        pageSize: 200,
        status: '1',
      });
      const pageResult = response?.list ? response : response?.data || response;
      const list = Array.isArray(pageResult?.list) ? pageResult.list : [];
      const options = list
        .map((item) => ({
          label: item.name || item.userName || `巡检人员${item.id ?? ''}`,
          value: item.id ?? item.userId,
        }))
        .filter((item) => item.value !== undefined && item.value !== null);

      if (options.length > 0) {
        userOptions.splice(0, userOptions.length, ...options);
        userOptionsLoaded = true;
      }
    } catch (error) {
      console.error('加载巡检人员选项失败，使用默认数据:', error);
    } finally {
      userOptionsLoadingPromise = null;
    }
  })();

  await userOptionsLoadingPromise;
}

export const areaOptions = [
  { label: '丰泽区', value: '丰泽区' },
  { label: '鲤城区', value: '鲤城区' },
  { label: '洛江区', value: '洛江区' },
  { label: '晋江市', value: '晋江市' },
  { label: '石狮市', value: '石狮市' },
  { label: '南安市', value: '南安市' },
];

export const trackStatusOptions = getDictOptions(
  INSPECT_TRACK_STATUS_DICT,
  'string',
);

export const syncStatusOptions = [
  { label: '已同步', value: '已同步' },
  { label: '同步中', value: '同步中' },
  { label: '同步失败', value: '同步失败' },
];

const baseTime = 1_775_011_986_000;
const trackTemplates = [
  [
    [118.675_324, 24.896_541],
    [118.676_324, 24.897_541],
    [118.678_024, 24.898_361],
    [118.680_224, 24.899_141],
  ],
  [
    [118.588_618, 24.910_426],
    [118.590_118, 24.911_126],
    [118.592_018, 24.912_026],
    [118.594_118, 24.912_926],
  ],
  [
    [118.660_835, 24.951_126],
    [118.662_135, 24.952_526],
    [118.664_835, 24.953_126],
    [118.667_135, 24.954_326],
  ],
  [
    [118.560_543, 24.781_612],
    [118.562_843, 24.782_412],
    [118.565_143, 24.783_512],
    [118.568_143, 24.784_312],
  ],
];

function normalizeTimeValue(value) {
  if (!value) return value;
  const text = String(value);
  if (/^\d{10}$/.test(text)) return Number(text) * 1000;
  if (/^\d{13}$/.test(text)) return Number(text);
  return value;
}

export function formatTrackTime(value) {
  if (!value) return '-';
  const text = String(value);
  return formatLocalDateTime(value) || text;
}

export function formatTrendTime(value) {
  if (!value) return '-';
  return formatLocalDateTime(value, 'YYYY-MM-DD') || String(value);
}

export function formatDuration(minutes) {
  const value = Number(minutes || 0);
  if (!value) return '0 分钟';
  const hour = Math.floor(value / 60);
  const minute = value % 60;
  if (!hour) return `${minute} 分钟`;
  if (!minute) return `${hour} 小时`;
  return `${hour} 小时 ${minute} 分钟`;
}

export function getUserName(userId) {
  return (
    userOptions.find((item) => Number(item.value) === Number(userId))?.label ||
    `巡检人员 ${userId || '-'}`
  );
}

export function getTrackStatusTagType(status) {
  const tagMap = {
    正常: 'success',
    异常: 'danger',
  };
  return getDictTagTypeFromDict(
    getDictObj(INSPECT_TRACK_STATUS_DICT, String(status)),
    tagMap[getTrackStatusLabel(status)] || 'info',
  );
}

export function getSyncStatusTagType(status) {
  const tagMap = {
    已同步: 'success',
    同步中: 'warning',
    同步失败: 'danger',
  };
  return tagMap[status] || 'info';
}

export function parseTrackPoints(points) {
  if (!points) return [];

  let rawPoints = points;
  if (typeof rawPoints === 'string') {
    try {
      rawPoints = JSON.parse(rawPoints);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(rawPoints)) return [];

  return rawPoints
    .map((point, index) => {
      if (Array.isArray(point)) {
        return {
          lon: Number(point[0]),
          lat: Number(point[1]),
          time: point[2],
          name: `轨迹点 ${index + 1}`,
        };
      }
      return {
        lon: Number(point.lon ?? point.lng ?? point.longitude),
        lat: Number(point.lat ?? point.latitude),
        time: point.time,
        name: point.name || `轨迹点 ${index + 1}`,
      };
    })
    .filter((point) => !Number.isNaN(point.lon) && !Number.isNaN(point.lat));
}

function stringifyPoints(points) {
  return JSON.stringify(points.map((point) => [point.lon, point.lat]));
}

function isInRange(value, range) {
  if (!Array.isArray(range) || range.length !== 2 || !value) return true;
  return Number(value) >= Number(range[0]) && Number(value) <= Number(range[1]);
}

export function buildTrendTrackTimeRange(trendTime) {
  if (!trendTime) return undefined;

  const value = String(trendTime).trim();
  if (/^\d{10}$/.test(value) || /^\d{13}$/.test(value)) {
    const timestamp = /^\d{10}$/.test(value)
      ? Number(value) * 1000
      : Number(value);
    const date = new Date(timestamp);
    const startTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0,
    ).getTime();
    if (Number.isNaN(startTime)) return undefined;
    return [startTime, startTime + 24 * 60 * 60 * 1000 - 1];
  }

  if (/^\d{1,2}$/.test(value)) {
    const now = new Date();
    const day = Number(value);
    const startTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      day,
      0,
      0,
      0,
      0,
    ).getTime();
    if (Number.isNaN(startTime)) return undefined;
    return [startTime, startTime + 24 * 60 * 60 * 1000 - 1];
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const startTime = new Date(
      `${value} 00:00:00`.replaceAll('-', '/'),
    ).getTime();
    if (Number.isNaN(startTime)) return undefined;
    return [startTime, startTime + 24 * 60 * 60 * 1000 - 1];
  }

  return undefined;
}

function isTrendTimeMatched(item, trendTime) {
  if (!trendTime) return true;

  const value = String(trendTime).trim();
  if (/^\d{1,2}$/.test(value)) {
    return item.trackTimeStr.slice(8, 10) === value.padStart(2, '0');
  }

  const trendTimeRange = buildTrendTrackTimeRange(trendTime);
  if (trendTimeRange) {
    return isInRange(item.trackTime, trendTimeRange);
  }

  return item.trackTimeStr.includes(value);
}

export function dataList() {
  return Array.from({ length: 18 }, (_, index) => {
    const user = DEFAULT_USER_OPTIONS[index % DEFAULT_USER_OPTIONS.length];
    const area = areaOptions[index % areaOptions.length].value;
    const status = index % 5 === 2 || index % 7 === 3 ? '异常' : '正常';
    const syncStatus =
      syncStatusOptions[index % syncStatusOptions.length].value;
    const trackTime = baseTime + index * 3_600_000;
    const points = parseTrackPoints(
      trackTemplates[index % trackTemplates.length],
    ).map((point, pointIndex) => ({
      ...point,
      time: trackTime + pointIndex * 8 * 60 * 1000,
    }));
    const exceptionPoints =
      status === '异常'
        ? [
            {
              ...points[Math.min(1, points.length - 1)],
              type: index % 2 === 0 ? '定位漂移' : '轨迹中断',
              desc:
                index % 2 === 0
                  ? '轨迹点偏离巡检范围，需人工核查'
                  : '移动端上报存在短时中断',
            },
          ]
        : [];

    return {
      id: index + 1,
      userId: user.value,
      userName: user.label,
      trackTime,
      mileage: Number((4.8 + index * 0.72).toFixed(2)),
      duration: 45 + index * 6,
      area,
      status,
      syncStatus,
      points: stringifyPoints(points),
      trackPointList: points,
      exceptionCount: exceptionPoints.length,
      exceptionPoints,
      exceptionSummary:
        exceptionPoints.length > 0 ? exceptionPoints[0].desc : '未发现异常点',
      checkRemark: status === '正常' ? '轨迹正常' : '',
      reserve1: '',
      reserve2: '',
      creator: index % 2 === 0 ? 'admin' : 'operator',
      updater: syncStatus === '同步失败' ? 'system' : user.label,
      createTime: trackTime - 10 * 60 * 1000,
      updateTime: trackTime + 20 * 60 * 1000,
    };
  });
}

export function normalizeInspectTrackRow(row) {
  const userId = row.userId ?? row.user_id;
  const trackTime = normalizeTimeValue(row.trackTime ?? row.track_time);
  const createTime = normalizeTimeValue(row.createTime ?? row.create_time);
  const updateTime = normalizeTimeValue(row.updateTime ?? row.update_time);
  const points = parseTrackPoints(row.points ?? row.trackPointList);
  const status = row.statusName || row.status || '正常';
  const syncStatus =
    row.syncStatusName ||
    row.syncStatus ||
    row.sync_status ||
    row.reserve1 ||
    '已同步';
  let exceptionPoints = [];
  if (Array.isArray(row.exceptionPoints)) {
    exceptionPoints = row.exceptionPoints;
  } else if (Array.isArray(row.exception_points)) {
    exceptionPoints = row.exception_points;
  }
  const exceptionCount = Number(
    row.exceptionCount ??
      row.exception_count ??
      row.abnormalCount ??
      row.abnormal_count ??
      (status === '异常' ? Math.max(exceptionPoints.length, 1) : 0),
  );

  return {
    ...row,
    id: row.id,
    userId,
    userName: row.userName || row.user_name || getUserName(userId),
    trackTime,
    trackTimeStr: formatTrackTime(trackTime),
    mileage: Number(row.mileage || 0),
    mileageText: `${Number(row.mileage || 0).toFixed(2)} km`,
    duration: Number(row.duration || 0),
    durationText: formatDuration(row.duration),
    area: row.area || row.areaName || row.area_name || '-',
    status,
    syncStatus,
    points: row.points || stringifyPoints(points),
    trackPointList: points,
    trackPointsText: `${points.length} 个轨迹点`,
    exceptionCount,
    exceptionText: exceptionCount > 0 ? `${exceptionCount} 个异常点` : '无',
    exceptionPoints,
    exceptionSummary:
      row.exceptionSummary ||
      row.exception_summary ||
      (exceptionCount > 0 ? '轨迹存在异常点，待核查' : '未发现异常点'),
    checkRemark: row.checkRemark || row.check_remark || '',
    reserve1: row.reserve1 || row.reserve_1 || '',
    reserve2: row.reserve2 || row.reserve_2 || '',
    creator: row.creator || '-',
    updater: row.updater || '-',
    createTime,
    createTimeStr: formatTrackTime(createTime),
    updateTime,
    updateTimeStr: formatTrackTime(updateTime),
  };
}

export function filterInspectTrackRows(list = [], params = {}) {
  const trackTimeRange = params.trackTimeRange || params.trackTime;

  return list.filter((item) => {
    const matchUser =
      !params.userId || Number(item.userId) === Number(params.userId);
    const matchArea =
      !params.area || String(item.area).includes(String(params.area));
    const matchStatus = isSameDictValue(
      INSPECT_TRACK_STATUS_DICT,
      item.status,
      params.status,
    );
    const matchSyncStatus =
      !params.syncStatus || item.syncStatus === params.syncStatus;
    const matchTrackTime = isInRange(item.trackTime, trackTimeRange);
    const matchTrendTime = isTrendTimeMatched(item, params.trendTime);

    return (
      matchUser &&
      matchArea &&
      matchStatus &&
      matchSyncStatus &&
      matchTrackTime &&
      matchTrendTime
    );
  });
}

export function filterMockList(params = {}) {
  const list = dataList().map((item) => normalizeInspectTrackRow(item));
  return filterInspectTrackRows(list, params);
}

export function getMockChartData() {
  const list = dataList().map((item) => normalizeInspectTrackRow(item));
  let topUser = list[0];
  const trendMap = new Map();
  let totalMileage = 0;
  let totalDuration = 0;

  for (const item of list) {
    if (Number(item.mileage) > Number(topUser?.mileage || 0)) {
      topUser = item;
    }
    const trendTimeRange = buildTrendTrackTimeRange(item.trackTime);
    const time = String(
      Math.floor(Number(trendTimeRange?.[0] || item.trackTime) / 1000),
    );
    trendMap.set(time, Number((trendMap.get(time) || 0) + item.mileage));
    totalMileage += item.mileage;
    totalDuration += item.duration;
  }

  return {
    mapData: list.slice(0, 8).map((item) => ({
      id: item.id,
      userId: item.userId,
      userName: item.userName,
      area: item.area,
      status: item.status,
      points: item.points,
    })),
    trendData: [...trendMap.entries()].map(([time, totalMileage]) => ({
      time,
      totalMileage: Number(totalMileage),
    })),
    cardData: {
      totalMileage: Number(totalMileage.toFixed(2)),
      totalDuration,
      focusUserId: topUser?.userId,
      focusUserName: topUser?.userName,
    },
  };
}

export function useSearchFormSchema() {
  return [
    {
      fieldName: 'userId',
      label: '巡检人员',
      component: 'Select',
      componentProps: {
        placeholder: '请选择巡检人员',
        clearable: true,
        filterable: true,
        options: userOptions,
      },
    },
    {
      fieldName: 'area',
      label: '所属片区',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属片区',
        clearable: true,
        filterable: true,
        options: areaOptions,
      },
    },
    // {
    //   fieldName: 'status',
    //   label: '轨迹状态',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择轨迹状态',
    //     clearable: true,
    //     options: trackStatusOptions,
    //   },
    // },
    // {
    //   fieldName: 'syncStatus',
    //   label: '同步状态',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择同步状态',
    //     clearable: true,
    //     options: syncStatusOptions,
    //   },
    // },
    {
      fieldName: 'trackTime',
      label: '轨迹时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
  ];
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '轨迹ID', minWidth: 90, sortable: true },
    {
      field: 'userName',
      title: '巡检人员',
      minWidth: 120,
      sortable: true,
      slots: { default: 'userName' },
    },
    {
      field: 'trackTimeStr',
      title: '轨迹时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'mileageText',
      title: '巡检里程',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'durationText',
      title: '巡检时长',
      minWidth: 130,
      sortable: true,
    },
    {
      field: 'area',
      title: '所属片区',
      minWidth: 120,
      sortable: true,
      slots: { default: 'area' },
    },
    {
      field: 'status',
      title: '轨迹状态',
      minWidth: 110,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'exceptionText',
      title: '异常点',
      minWidth: 120,
      sortable: true,
      slots: { default: 'exceptionText' },
    },
    {
      field: 'syncStatus',
      title: '同步状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'syncStatus' },
    },
    {
      field: 'trackPointsText',
      title: '轨迹点',
      minWidth: 110,
      sortable: true,
    },
    {
      title: '操作',
      width: 190,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const detailFields = [
  { key: 'id', label: '轨迹ID' },
  { key: 'userName', label: '巡检人员' },
  { key: 'trackTimeStr', label: '轨迹时间' },
  { key: 'mileageText', label: '巡检里程' },
  { key: 'durationText', label: '巡检时长' },
  { key: 'area', label: '所属片区' },
  {
    key: 'status',
    label: '轨迹状态',
    type: 'tag',
    tagType: getTrackStatusTagType,
    formatter: getTrackStatusLabel,
  },
  {
    key: 'syncStatus',
    label: '同步状态',
    type: 'tag',
    tagType: getSyncStatusTagType,
  },
  { key: 'trackPointsText', label: '轨迹点' },
  { key: 'exceptionText', label: '异常点' },
  { key: 'exceptionSummary', label: '异常说明' },
  { key: 'checkRemark', label: '核查意见' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'updateTimeStr', label: '更新时间' },
];

export const textObj = {
  excelAllName: '巡检轨迹数据.xlsx',
  pdfAllName: '巡检轨迹数据.pdf',
  total: '巡检轨迹支持轨迹采集、轨迹同步、轨迹展示、地图回放和异常核查闭环管理',
};
