import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getInspectUserPage } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectUser';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatLocalDateTime } from '#/views/genchuan/industry/chargePark/inspectOp/utils/formatLocalDateTime';

export const FENCE_MGMT_STATUS_DICT = DICT_TYPE.FENCE_MGMT_STATUS;

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

export function getFenceStatusLabel(value) {
  return getDictLabel(FENCE_MGMT_STATUS_DICT, value);
}

export function isFenceStatusLabel(value, label) {
  return isDictLabel(FENCE_MGMT_STATUS_DICT, value, label);
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

export async function loadFenceUserOptions() {
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

export const statusOptions = getDictOptions(FENCE_MGMT_STATUS_DICT, 'string');

const baseTime = 1_775_011_986_000;
const fenceNames = [
  '丰泽站围栏',
  '鲤城停车场围栏',
  '洛江万安围栏',
  '晋江综合能源站围栏',
  '石狮服装城围栏',
  '南安水头交通枢纽围栏',
  '泉港充电站围栏',
  '惠安停车楼围栏',
  '台商区共享设备围栏',
  '安溪换电柜围栏',
  '永春停车场围栏',
  '德化城区设备围栏',
];

const areaLabels = ['丰泽区', '鲤城区', '洛江区', '晋江市', '石狮市', '南安市'];

const areaTemplates = [
  [
    [118.67, 24.89],
    [118.68, 24.89],
    [118.68, 24.9],
    [118.67, 24.9],
  ],
  [
    [118.58, 24.91],
    [118.592, 24.912],
    [118.594, 24.922],
    [118.581, 24.923],
  ],
  [
    [118.66, 24.95],
    [118.672, 24.951],
    [118.674, 24.962],
    [118.661, 24.963],
  ],
  [
    [118.56, 24.78],
    [118.573, 24.781],
    [118.572, 24.793],
    [118.558, 24.792],
  ],
];

function normalizeTimeValue(value) {
  if (!value) return value;
  const text = String(value);
  if (/^\d{10}$/.test(text)) return Number(text) * 1000;
  if (/^\d{13}$/.test(text)) return Number(text);
  return value;
}

export function formatFenceTime(value) {
  if (!value) return '-';
  return formatLocalDateTime(value) || String(value);
}

export function getUserName(userId) {
  return (
    userOptions.find((item) => Number(item.value) === Number(userId))?.label ||
    `巡检人员 ${userId || '-'}`
  );
}

export function getFenceStatusTagType(status) {
  const tagMap = {
    未生效: 'info',
    已生效: 'success',
  };
  return getDictTagTypeFromDict(
    getDictObj(FENCE_MGMT_STATUS_DICT, String(status)),
    tagMap[getFenceStatusLabel(status)] || 'info',
  );
}

export function parseFenceArea(area) {
  if (!area) return [];

  let rawArea = area;
  if (typeof rawArea === 'string') {
    try {
      rawArea = JSON.parse(rawArea);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(rawArea)) return [];

  return rawArea
    .map((point) => {
      if (Array.isArray(point)) {
        return {
          lng: Number(point[0]),
          lat: Number(point[1]),
        };
      }
      return {
        lng: Number(point.lng ?? point.lon ?? point.longitude),
        lat: Number(point.lat ?? point.latitude),
      };
    })
    .filter((point) => !Number.isNaN(point.lng) && !Number.isNaN(point.lat));
}

export function stringifyFenceArea(points = []) {
  return JSON.stringify(
    points.map((point) => [Number(point.lng), Number(point.lat)]),
  );
}

function buildAlarmDetails(row, count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `${row.id}-${index + 1}`,
    fenceId: row.id,
    fenceName: row.name,
    userName: getUserName(row.userId),
    alarmTime: row.createTime + (index + 2) * 3_600_000,
    alarmTimeStr: formatFenceTime(row.createTime + (index + 2) * 3_600_000),
    content:
      index % 2 === 0
        ? '巡检人员触发围栏越界提醒'
        : '定位点短时偏离电子围栏范围',
  }));
}

function getAreaText(area, areaLabel) {
  const points = parseFenceArea(area);
  if (points.length === 0) return areaLabel || '-';
  return `${areaLabel || '围栏区域'}（${points.length} 个点）`;
}

export function dataList() {
  return fenceNames.map((name, index) => {
    const status = index % 3 === 0 ? '未生效' : '已生效';
    const createTime = baseTime + index * 86_400_000;
    const bindTime = createTime + 30 * 60 * 1000;
    const effectTime = status === '已生效' ? createTime + 3_600_000 : null;
    const userId =
      DEFAULT_USER_OPTIONS[index % DEFAULT_USER_OPTIONS.length].value;
    const areaLabel = areaLabels[index % areaLabels.length];
    const area = stringifyFenceArea(
      areaTemplates[index % areaTemplates.length],
    );
    const alarmCount = status === '已生效' ? index % 5 : 0;
    const row = {
      id: index + 1,
      name,
      area,
      areaLabel,
      userId,
      status,
      alarmCount,
      bindTime,
      effectTime,
      reserve1: areaLabel,
      reserve2: '',
      creator: index % 2 === 0 ? 'admin' : 'operator',
      updater: status === '已生效' ? 'system' : '-',
      createTime,
      updateTime: createTime + 2 * 3_600_000,
    };

    return {
      ...row,
      alarmDetails: buildAlarmDetails(row, alarmCount),
    };
  });
}

export function normalizeFenceMgmtRow(row) {
  const createTime = normalizeTimeValue(row.createTime ?? row.create_time);
  const updateTime = normalizeTimeValue(row.updateTime ?? row.update_time);
  const bindTime = normalizeTimeValue(
    row.bindTime ?? row.bind_time ?? row.reserve2,
  );
  const effectTime =
    row.status === '2'
      ? normalizeTimeValue(row.updateTime ?? row.updateTime)
      : null;
  const userId = row.userId ?? row.user_id;
  const status = row.statusName || row.status || '未生效';
  const area = row.area || '[]';
  const areaLabel =
    row.areaLabel ||
    row.area_label ||
    row.areaName ||
    row.reserve1 ||
    '围栏区域';
  const alarmCount = Number(row.alarmCount ?? row.alarm_count ?? 0);

  return {
    ...row,
    id: row.id,
    name: row.name || '-',
    area,
    areaPointList: parseFenceArea(area),
    areaLabel,
    areaText: getAreaText(area, areaLabel),
    userId,
    userName: row.userName || row.user_name || getUserName(userId),
    status,
    alarmCount,
    alarmText: `${alarmCount} 次`,
    alarmDetails: Array.isArray(row.alarmDetails)
      ? row.alarmDetails
      : buildAlarmDetails({ ...row, createTime, userId }, alarmCount),
    bindTime,
    bindTimeStr: formatFenceTime(bindTime),
    effectTime,
    effectTimeStr: formatFenceTime(effectTime),
    creator: row.creator || '-',
    updater: row.updater || '-',
    createTime,
    createTimeStr: formatFenceTime(createTime),
    updateTime,
    updateTimeStr: formatFenceTime(updateTime),
    reserve1: row.reserve1 || '',
    reserve2: row.reserve2 || '',
  };
}

export function filterFenceRows(list = [], params = {}) {
  return list.filter((item) => {
    const matchName = !params.name || item.name.includes(String(params.name));
    const matchUser =
      !params.userId || Number(item.userId) === Number(params.userId);
    const matchStatus = isSameDictValue(
      FENCE_MGMT_STATUS_DICT,
      item.status,
      params.status,
    );
    const matchArea =
      !params.areaLabel || item.areaLabel === String(params.areaLabel);
    const matchAlarmed = !params.alarmed || item.alarmCount > 0;

    return matchName && matchUser && matchStatus && matchArea && matchAlarmed;
  });
}

export function filterMockList(params = {}) {
  const list = dataList().map((item) => normalizeFenceMgmtRow(item));
  return filterFenceRows(list, params);
}

export function getMockChartData() {
  const list = dataList().map((item) => normalizeFenceMgmtRow(item));
  let alarmCount = 0;
  for (const item of list) {
    alarmCount += Number(item.alarmCount || 0);
  }

  return {
    mapData: list.map((item) => ({
      id: item.id,
      name: item.name,
      area: item.area,
      areaLabel: item.areaLabel,
      userId: item.userId,
      userName: item.userName,
      status: item.status,
      alarmCount: item.alarmCount,
    })),
    cardData: {
      fenceCount: list.length,
      alarmCount,
    },
  };
}

export function useSearchFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '围栏名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入围栏名称',
        clearable: true,
      },
    },
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
      fieldName: 'status',
      label: '围栏状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择围栏状态',
        clearable: true,
        options: statusOptions,
      },
    },
  ];
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '围栏ID', minWidth: 90, sortable: true },
    {
      field: 'name',
      title: '围栏名称',
      minWidth: 180,
      sortable: true,
      slots: { default: 'name' },
    },
    {
      field: 'areaText',
      title: '围栏区域',
      minWidth: 180,
      sortable: true,
      slots: { default: 'areaText' },
    },
    {
      field: 'userName',
      title: '关联巡检人员',
      minWidth: 130,
      sortable: true,
      slots: { default: 'userName' },
    },
    {
      field: 'status',
      title: '围栏状态',
      minWidth: 110,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'alarmText',
      title: '告警触发数',
      minWidth: 120,
      sortable: true,
      slots: { default: 'alarmText' },
    },
    {
      field: 'effectTimeStr',
      title: '生效时间',
      minWidth: 180,
      sortable: true,
    },
    // {
    //   field: 'bindTimeStr',
    //   title: '绑定时间',
    //   minWidth: 180,
    //   sortable: true,
    // },
    {
      field: 'createTimeStr',
      title: '创建时间',
      minWidth: 180,
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
  { key: 'id', label: '围栏ID' },
  { key: 'name', label: '围栏名称' },
  { key: 'areaText', label: '围栏区域' },
  { key: 'userName', label: '关联巡检人员' },
  {
    key: 'status',
    label: '围栏状态',
    type: 'tag',
    tagType: getFenceStatusTagType,
    formatter: getFenceStatusLabel,
  },
  { key: 'alarmText', label: '告警触发数' },
  { key: 'effectTimeStr', label: '生效时间' },
  { key: 'bindTimeStr', label: '绑定时间' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'updateTimeStr', label: '更新时间' },
];

export const textObj = {
  addText: '新增电子围栏',
  editText: '编辑电子围栏',
  total: '电子围栏支持围栏创建、围栏绑定、围栏生效、围栏变更闭环管理',
};
