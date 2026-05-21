import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getRangePickerDefaultProps } from '#/utils';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatLocalDateTime } from '#/views/genchuan/industry/chargePark/inspectOp/utils/formatLocalDateTime';

export const INSPECT_USER_STATUS_DICT = DICT_TYPE.INSPECT_USER_STATUS;
export const INSPECT_USER_ONLINE_STATUS_DICT =
  DICT_TYPE.INSPECT_USER_ONLINE_STATUS;

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

export function getUserStatusLabel(value) {
  return getDictLabel(INSPECT_USER_STATUS_DICT, value);
}

export function isUserStatusLabel(value, label) {
  return isDictLabel(INSPECT_USER_STATUS_DICT, value, label);
}

export function getOnlineStatusLabel(value) {
  return getDictLabel(INSPECT_USER_ONLINE_STATUS_DICT, value);
}

export function isOnlineStatusLabel(value, label) {
  return isDictLabel(INSPECT_USER_ONLINE_STATUS_DICT, value, label);
}
export const areaOptions = [
  { label: '丰泽区', value: '丰泽区' },
  { label: '鲤城区', value: '鲤城区' },
  { label: '洛江区', value: '洛江区' },
  { label: '晋江市', value: '晋江市' },
  { label: '石狮市', value: '石狮市' },
  { label: '南安市', value: '南安市' },
];

export const statusOptions = getDictOptions(INSPECT_USER_STATUS_DICT, 'string');

export const onlineStatusOptions = getDictOptions(
  INSPECT_USER_ONLINE_STATUS_DICT,
  'string',
);

/** 按在线状态字典 label 取 value，供图表卡片筛选 */
export function getOnlineStatusOptionValue(label) {
  const opt = onlineStatusOptions.find(
    (item) => String(item.label) === String(label),
  );
  return opt != null ? opt.value : label;
}

export const deviceOptions = [
  { label: '巡检终端 A101', value: 101, area: '丰泽区' },
  { label: '巡检终端 B102', value: 102, area: '鲤城区' },
  { label: '巡检终端 C103', value: 103, area: '洛江区' },
  { label: '巡检终端 D104', value: 104, area: '晋江市' },
  { label: '巡检终端 E105', value: 105, area: '石狮市' },
  { label: '巡检终端 F106', value: 106, area: '南安市' },
];

const names = [
  '张三',
  '李四',
  '王五',
  '赵六',
  '陈强',
  '林敏',
  '黄伟',
  '吴磊',
  '郑洁',
  '周宁',
  '许峰',
  '蔡琳',
  '杨洋',
  '孙悦',
  '高明',
  '郭芳',
];
const baseTime = 1_775_011_986_000;

function normalizeTimeValue(value) {
  if (!value) return value;
  const text = String(value);
  if (/^\d{10}$/.test(text)) return Number(text) * 1000;
  if (/^\d{13}$/.test(text)) return Number(text);
  return value;
}

export function formatUserTime(value) {
  if (!value) return '-';
  return formatLocalDateTime(value) || String(value);
}

export function maskPhone(phone) {
  const text = String(phone || '');
  if (!/^1\d{10}$/.test(text)) return text || '-';
  return `${text.slice(0, 3)}****${text.slice(7)}`;
}

export function getDeviceName(deviceId) {
  if (!deviceId && deviceId !== 0) return '-';
  return (
    deviceOptions.find((item) => Number(item.value) === Number(deviceId))
      ?.label || `设备 ${deviceId}`
  );
}

export function getUserStatusTagType(status) {
  const tagMap = {
    正常: 'success',
    禁用: 'danger',
  };
  return getDictTagTypeFromDict(
    getDictObj(INSPECT_USER_STATUS_DICT, String(status)),
    tagMap[getUserStatusLabel(status)] || 'info',
  );
}

export function getOnlineStatusTagType(status) {
  const tagMap = {
    在线: 'success',
    离线: 'info',
  };
  return getDictTagTypeFromDict(
    getDictObj(INSPECT_USER_ONLINE_STATUS_DICT, String(status)),
    tagMap[getOnlineStatusLabel(status)] || 'info',
  );
}

export function getDeviceDetail(row = {}) {
  const device = deviceOptions.find(
    (item) => Number(item.value) === Number(row.deviceId),
  );
  return {
    id: row.deviceId,
    name: device?.label || row.deviceName || getDeviceName(row.deviceId),
    area: device?.area || row.area || '-',
    bindUserName: row.name || '-',
    status: row.onlineStatus === '在线' ? '在线' : '离线',
    lastLoginTimeStr: row.lastLoginTimeStr || '-',
  };
}

function buildTaskRecords(row) {
  return [
    {
      taskName: `${row.area}日常巡检任务`,
      status: row.status === '正常' ? '已完成' : '已暂停',
      time: row.lastLoginTimeStr,
    },
    {
      taskName: `${row.area}设备复核任务`,
      status: row.onlineStatus === '在线' ? '处理中' : '待认领',
      time: row.createTimeStr,
    },
  ];
}

export function dataList() {
  return names.map((name, index) => {
    const area = areaOptions[index % areaOptions.length].value;
    const status = index % 5 === 3 ? '禁用' : '正常';
    const onlineStatus = status === '正常' && index % 3 !== 1 ? '在线' : '离线';
    const createTime = baseTime + index * 3_600_000;
    const lastLoginTime =
      onlineStatus === '在线' ? createTime + 2 * 3_600_000 : null;
    const device = deviceOptions[index % deviceOptions.length];
    const row = {
      id: index + 1,
      name,
      phone: `1380000${String(1200 + index).slice(-4)}`,
      area,
      deviceId: device.value,
      status,
      onlineStatus,
      lastLoginTime,
      reserve1: '',
      reserve2: '',
      creator: index % 2 === 0 ? 'admin' : 'operator',
      updater: status === '禁用' ? 'system' : name,
      createTime,
      updateTime: createTime + 30 * 60 * 1000,
    };
    return {
      ...row,
      taskRecords: buildTaskRecords({
        ...row,
        createTimeStr: formatUserTime(createTime),
        lastLoginTimeStr: formatUserTime(lastLoginTime),
      }),
    };
  });
}

export function normalizeInspectUserRow(row) {
  const deviceId = row.deviceId ?? row.device_id;
  const onlineStatus =
    row.onlineStatusName || row.onlineStatus || row.online_status || '离线';
  const lastLoginTime = normalizeTimeValue(
    row.lastLoginTime ?? row.last_login_time,
  );
  const createTime = normalizeTimeValue(row.createTime ?? row.create_time);
  const updateTime = normalizeTimeValue(row.updateTime ?? row.update_time);
  const normalized = {
    ...row,
    id: row.id,
    name: row.name || '-',
    phone: row.phone || '-',
    phoneText: row.phoneText || maskPhone(row.phone),
    area: row.area || '-',
    deviceId,
    deviceName: row.deviceName || row.device_name || getDeviceName(deviceId),
    status: row.statusName || row.status || '正常',
    onlineStatus,
    lastLoginTime,
    lastLoginTimeStr: formatUserTime(lastLoginTime),
    creator: row.creator || '-',
    updater: row.updater || '-',
    createTime,
    createTimeStr: formatUserTime(createTime),
    updateTime,
    updateTimeStr: formatUserTime(updateTime),
    reserve1: row.reserve1 || row.reserve_1 || '',
    reserve2: row.reserve2 || row.reserve_2 || '',
  };

  return {
    ...normalized,
    taskRecords: Array.isArray(row.taskRecords)
      ? row.taskRecords
      : buildTaskRecords(normalized),
    taskRecordText: normalized?.taskRecordText || '-',
    //`${
    //   Array.isArray(row.taskRecords) ? row.taskRecords.length : 2
    // } 条任务记录`,
  };
}

function isInRange(value, range) {
  if (!Array.isArray(range) || range.length !== 2 || !value) return true;
  return Number(value) >= Number(range[0]) && Number(value) <= Number(range[1]);
}

export function filterInspectUserRows(list = [], params = {}) {
  const lastLoginTimeRange = params.lastLoginTimeRange || params.lastLoginTime;

  return list.filter((item) => {
    const matchName = !params.name || item.name.includes(String(params.name));
    const matchPhone =
      !params.phone ||
      String(item.phone).includes(String(params.phone)) ||
      String(item.phoneText).includes(String(params.phone));
    const matchArea = !params.area || item.area === params.area;
    const matchStatus = isSameDictValue(
      INSPECT_USER_STATUS_DICT,
      item.status,
      params.status,
    );
    const matchOnline =
      !params.onlineStatus || item.onlineStatus === params.onlineStatus;
    const matchLoginTime = isInRange(item.lastLoginTime, lastLoginTimeRange);

    return (
      matchName &&
      matchPhone &&
      matchArea &&
      matchStatus &&
      matchOnline &&
      matchLoginTime
    );
  });
}

export function filterMockList(params = {}) {
  const list = dataList().map((item) => normalizeInspectUserRow(item));
  return filterInspectUserRows(list, params);
}

export function getMockChartData() {
  const list = dataList().map((item) => normalizeInspectUserRow(item));
  let onlineUserCount = 0;

  for (const item of list) {
    if (item.onlineStatus === '在线') onlineUserCount += 1;
  }

  return {
    areaData: areaOptions.map((option) => ({
      areaName: option.value,
      count: list.filter((item) => item.area === option.value).length,
    })),
    cardData: {
      userCount: list.length,
      onlineUserCount,
    },
  };
}

export function useSearchFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '人员姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入人员姓名',
        clearable: true,
      },
    },
    {
      fieldName: 'phone',
      label: '手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入手机号',
        clearable: true,
      },
    },
    {
      fieldName: 'area',
      label: '所属片区',
      component: 'Input',
      componentProps: {
        placeholder: '请输入所属片区',
        clearable: true,
        // options: areaOptions,
      },
    },
    {
      fieldName: 'status',
      label: '人员状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择人员状态',
        clearable: true,
        options: statusOptions,
      },
    },
    {
      fieldName: 'onlineStatus',
      label: '在线状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择在线状态',
        clearable: true,
        options: onlineStatusOptions,
      },
    },
    {
      fieldName: 'lastLoginTime',
      label: '最后登录',
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
    { field: 'id', title: '人员ID', minWidth: 90, sortable: true },
    {
      field: 'name',
      title: '人员姓名',
      minWidth: 120,
      sortable: true,
      slots: { default: 'name' },
    },
    { field: 'phoneText', title: '手机号', minWidth: 130, sortable: true },
    {
      field: 'area',
      title: '所属片区',
      minWidth: 120,
      sortable: true,
      slots: { default: 'area' },
    },
    {
      field: 'deviceName',
      title: '绑定设备',
      minWidth: 150,
      sortable: true,
      slots: { default: 'deviceName' },
    },
    {
      field: 'status',
      title: '人员状态',
      minWidth: 110,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'onlineStatus',
      title: '在线状态',
      minWidth: 110,
      sortable: true,
      slots: { default: 'onlineStatus' },
    },
    {
      field: 'lastLoginTimeStr',
      title: '最后登录时间',
      minWidth: 180,
      sortable: true,
    },
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
  { key: 'id', label: '人员ID' },
  { key: 'name', label: '人员姓名' },
  { key: 'phoneText', label: '手机号' },
  { key: 'area', label: '所属片区' },
  { key: 'deviceName', label: '绑定设备' },
  {
    key: 'status',
    label: '人员状态',
    type: 'tag',
    tagType: getUserStatusTagType,
    formatter: getUserStatusLabel,
  },
  {
    key: 'onlineStatus',
    label: '在线状态',
    type: 'tag',
    tagType: getOnlineStatusTagType,
    formatter: getOnlineStatusLabel,
  },
  { key: 'lastLoginTimeStr', label: '最后登录时间' },
  { key: 'taskRecordText', label: '任务记录' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'updateTimeStr', label: '更新时间' },
];

export const deviceDetailFields = [
  { key: 'id', label: '设备ID' },
  { key: 'name', label: '设备名称' },
  { key: 'area', label: '所属片区' },
  { key: 'bindUserName', label: '绑定人员' },
  {
    key: 'status',
    label: '在线状态',
    type: 'tag',
    tagType: getOnlineStatusTagType,
  },
  { key: 'lastLoginTimeStr', label: '最后同步时间' },
];

export const textObj = {
  addText: '新增巡检人员',
  editText: '编辑巡检人员',
  excelAllName: '巡检人员数据.xlsx',
  total: '巡检人员支持人员创建、人员绑定、状态变更、记录同步闭环管理',
};
