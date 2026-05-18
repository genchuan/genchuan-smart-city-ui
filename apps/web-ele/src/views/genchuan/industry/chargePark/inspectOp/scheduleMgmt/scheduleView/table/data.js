import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import {
  loadScheduleUserOptions,
  userOptions,
} from '#/api/genchuan/industry/chargePark/inspectOp/scheduleMgmt/userOptions';
import { getRangePickerDefaultProps } from '#/utils';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatLocalDateTime } from '#/views/genchuan/industry/chargePark/inspectOp/utils/formatLocalDateTime';

export { loadScheduleUserOptions, userOptions };

export const SCHEDULE_VIEW_SHIFT_TYPE_DICT = DICT_TYPE.SCHEDULE_VIEW_SHIFT_TYPE;
export const SCHEDULE_VIEW_STATUS_DICT = DICT_TYPE.SCHEDULE_VIEW_STATUS;
export const SHIFT_APPLY_STATUS_DICT = DICT_TYPE.SHIFT_APPLY_STATUS;

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

export function getShiftTypeLabel(value) {
  return getDictLabel(SCHEDULE_VIEW_SHIFT_TYPE_DICT, value);
}

export function isShiftTypeLabel(value, label) {
  return isDictLabel(SCHEDULE_VIEW_SHIFT_TYPE_DICT, value, label);
}

export function getScheduleStatusLabel(value) {
  return getDictLabel(SCHEDULE_VIEW_STATUS_DICT, value);
}

export function isScheduleStatusLabel(value, label) {
  return isDictLabel(SCHEDULE_VIEW_STATUS_DICT, value, label);
}

export function getApplyStatusLabel(value) {
  return getDictLabel(SHIFT_APPLY_STATUS_DICT, value);
}

export function isApplyStatusLabel(value, label) {
  return isDictLabel(SHIFT_APPLY_STATUS_DICT, value, label);
}

export const shiftTypeOptions = getDictOptions(
  SCHEDULE_VIEW_SHIFT_TYPE_DICT,
  'string',
);

export const scheduleStatusOptions = getDictOptions(
  SCHEDULE_VIEW_STATUS_DICT,
  'string',
);

/** 按排班状态字典 label 取 value，供图表卡片筛选 */
export function getScheduleStatusOptionValue(label) {
  const opt = scheduleStatusOptions.find(
    (item) => String(item.label) === String(label),
  );
  return opt != null ? opt.value : label;
}

export const shiftApplyStatusOptions = getDictOptions(
  SHIFT_APPLY_STATUS_DICT,
  'string',
);

const MOCK_SHIFT_TYPE_VALUES = ['早班', '中班', '晚班'];

export const positionOptions = [
  { label: '巡检员', value: '巡检员' },
  { label: '值班长', value: '值班长' },
  { label: '设备工程师', value: '设备工程师' },
  { label: '安全巡检员', value: '安全巡检员' },
  { label: '运维专员', value: '运维专员' },
];

const applyRecords = [
  '暂无换班申请',
  '申请与李四互换早班',
  '申请调整至晚班',
  '已完成与王五换班',
  '换班申请被驳回',
];

const baseTime = new Date('2026-04-01 08:00:00').getTime();

export function formatScheduleTime(value) {
  if (!value) return '-';
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return value;
  const text = String(value);
  return formatLocalDateTime(value) || text;
}

export function getUserName(userId) {
  return (
    userOptions.find((item) => Number(item.value) === Number(userId))?.label ||
    '-'
  );
}

export function getPositionName(userId) {
  return (
    userOptions.find((item) => Number(item.value) === Number(userId))
      ?.position || '-'
  );
}

export function getShiftTypeTagType(shiftType) {
  const tagMap = {
    早班: 'success',
    中班: 'warning',
    晚班: 'info',
  };
  return getDictTagTypeFromDict(
    getDictObj(SCHEDULE_VIEW_SHIFT_TYPE_DICT, String(shiftType)),
    tagMap[getShiftTypeLabel(shiftType)] || 'info',
  );
}

export function getScheduleStatusTagType(status) {
  const tagMap = {
    正常: 'success',
    已换班: 'primary',
  };
  return getDictTagTypeFromDict(
    getDictObj(SCHEDULE_VIEW_STATUS_DICT, String(status)),
    tagMap[getScheduleStatusLabel(status)] || 'info',
  );
}

export function getApplyStatusTagType(status) {
  const tagMap = {
    未申请: 'info',
    申请中: 'warning',
    已通过: 'success',
    已驳回: 'danger',
  };
  return getDictTagTypeFromDict(
    getDictObj(SHIFT_APPLY_STATUS_DICT, String(status)),
    tagMap[getApplyStatusLabel(status)] || 'info',
  );
}

function toScheduleDate(offset) {
  const date = new Date(baseTime + offset * 86_400_000);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getMockApplyStatus(status, index) {
  if (status === '已换班') return '已通过';
  if (index % 7 === 0) return '申请中';
  return '未申请';
}

export function dataList() {
  return Array.from({ length: 36 }, (_, index) => {
    const user = userOptions[index % userOptions.length];
    const shiftType =
      MOCK_SHIFT_TYPE_VALUES[index % MOCK_SHIFT_TYPE_VALUES.length];
    const scheduleDate = toScheduleDate(index % 18);
    const status = index % 9 === 0 ? '已换班' : '正常';
    const shiftApplyStatus = getMockApplyStatus(status, index);
    const createTime = baseTime + index * 3_600_000;

    return {
      id: index + 1,
      userId: user.value,
      userName: user.label,
      scheduleDate,
      shiftType,
      positionName: user.position,
      status,
      shiftApplyStatus,
      applyRecord: applyRecords[index % applyRecords.length],
      reserve1: user.position,
      reserve2: applyRecords[index % applyRecords.length],
      creator: index % 2 === 0 ? 'admin' : 'operator',
      updater: 'system',
      createTime,
      updateTime: createTime + 2 * 3_600_000,
    };
  });
}

export function normalizeScheduleViewRow(row) {
  const userId = row.userId ?? row.user_id;
  const scheduleDate = row.scheduleDate ?? row.schedule_date;
  const shiftType = row.shiftType ?? row.shift_type;
  const createTime = row.createTime ?? row.create_time;
  const updateTime = row.updateTime ?? row.update_time;

  return {
    ...row,
    id: row.id,
    userId,
    userName: row.userName || row.user_name || getUserName(userId),
    scheduleDate,
    scheduleDateStr: formatScheduleTime(scheduleDate),
    shiftType: row.shiftTypeName || row.shift_type_name || shiftType || '早班',
    positionName:
      row.positionName ||
      row.position_name ||
      row.reserve1 ||
      getPositionName(userId),
    status: row.statusName || row.status || '正常',
    shiftApplyStatus:
      row.shiftApplyStatus ||
      row.shift_apply_status ||
      row.applyStatus ||
      '未申请',
    applyRecord:
      row.applyRecord || row.apply_record || row.reserve2 || '暂无换班申请',
    creator: row.creator || '-',
    updater: row.updater || '-',
    createTime,
    createTimeStr: formatScheduleTime(createTime),
    updateTime,
    updateTimeStr: formatScheduleTime(updateTime),
  };
}

function isDateInRange(dateText, range) {
  if (!Array.isArray(range) || range.length !== 2 || !dateText) return true;
  const current = new Date(`${dateText} 00:00:00`).getTime();
  const start = Number(range[0]);
  const end = Number(range[1]);
  return current >= start && current <= end;
}

export function filterMockList(params = {}) {
  const list = dataList().map((item) => normalizeScheduleViewRow(item));
  const dateRange = params.scheduleDateRange || params.scheduleDate;

  return list.filter((item) => {
    const matchUser =
      !params.userId || Number(item.userId) === Number(params.userId);
    const matchUserName =
      !params.userName || item.userName.includes(String(params.userName));
    const matchDate =
      !params.scheduleDate || Array.isArray(params.scheduleDate)
        ? isDateInRange(item.scheduleDate, dateRange)
        : item.scheduleDate === params.scheduleDate;
    const matchShiftType = isSameDictValue(
      SCHEDULE_VIEW_SHIFT_TYPE_DICT,
      item.shiftType,
      params.shiftType,
    );
    const matchPosition =
      !params.positionName || item.positionName === params.positionName;
    const matchStatus = isSameDictValue(
      SCHEDULE_VIEW_STATUS_DICT,
      item.status,
      params.status,
    );
    const matchApplyStatus =
      !params.shiftApplyStatus ||
      item.shiftApplyStatus === params.shiftApplyStatus;

    return (
      matchUser &&
      matchUserName &&
      matchDate &&
      matchShiftType &&
      matchPosition &&
      matchStatus &&
      matchApplyStatus
    );
  });
}

export function getMockChartData() {
  const list = dataList().map((item) => normalizeScheduleViewRow(item));
  const scheduleCount = list.length;
  const onDutyCount = new Set(list.map((item) => item.userId)).size;
  const calendarData = list.slice(0, 18).map((item) => ({
    date: item.scheduleDate,
    userId: item.userId,
    userName: item.userName,
    shiftType: item.shiftType,
  }));
  const userData = userOptions.map((user) => ({
    userId: user.value,
    userName: user.label,
    count: list.filter((item) => Number(item.userId) === Number(user.value))
      .length,
  }));

  return {
    calendarData,
    userData,
    cardData: {
      scheduleCount,
      onDutyCount,
    },
  };
}

export function useSearchFormSchema() {
  return [
    {
      fieldName: 'userId',
      label: '关联人员',
      component: 'Select',
      componentProps: {
        placeholder: '请选择巡检人员',
        clearable: true,
        options: userOptions,
      },
    },
    {
      fieldName: 'scheduleDate',
      label: '排班日期',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
    // {
    //   fieldName: 'shiftType',
    //   label: '排班时段',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择排班时段',
    //     clearable: true,
    //     options: shiftTypeOptions,
    //   },
    // },
    // {
    //   fieldName: 'positionName',
    //   label: '所属岗位',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择所属岗位',
    //     clearable: true,
    //     options: positionOptions,
    //   },
    // },
    {
      fieldName: 'status',
      label: '排班状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择排班状态',
        clearable: true,
        options: scheduleStatusOptions,
      },
    },
  ];
}

export function useShiftApplyFormSchema() {
  return [
    {
      fieldName: 'userName',
      label: '当前人员',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'targetUserId',
      label: '换班对象',
      component: 'Select',
      componentProps: {
        placeholder: '请选择换班对象',
        options: userOptions,
      },
      rules: 'required',
    },
    {
      fieldName: 'newDate',
      label: '新日期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择新日期',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
        type: 'date',
      },
      rules: 'required',
    },
    // {
    //   fieldName: 'newShiftType',
    //   label: '新时段',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择新时段',
    //     options: shiftTypeOptions,
    //   },
    //   rules: 'required',
    // },
    {
      fieldName: 'applyRemark',
      label: '申请备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入申请备注',
        rows: 4,
        type: 'textarea',
      },
    },
  ];
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '排班ID', minWidth: 90, sortable: true },
    {
      field: 'userName',
      title: '关联人员',
      minWidth: 120,
      sortable: true,
      slots: { default: 'userName' },
    },
    {
      field: 'scheduleDateStr',
      title: '排班日期',
      minWidth: 140,
      sortable: true,
      slots: { default: 'scheduleDateStr' },
    },
    // {
    //   field: 'shiftType',
    //   title: '排班时段',
    //   minWidth: 110,
    //   sortable: true,
    //   slots: { default: 'shiftType' },
    // },
    // {
    //   field: 'positionName',
    //   title: '所属岗位',
    //   minWidth: 130,
    //   sortable: true,
    //   slots: { default: 'positionName' },
    // },
    {
      field: 'status',
      title: '排班状态',
      minWidth: 110,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'shiftApplyStatus',
      title: '换班状态',
      minWidth: 110,
      sortable: true,
      slots: { default: 'shiftApplyStatus' },
    },
    {
      field: 'applyRecord',
      title: '申请记录',
      minWidth: 210,
      sortable: true,
      slots: { default: 'applyRecord' },
    },
    {
      field: 'createTimeStr',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
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
  { key: 'id', label: '排班ID' },
  { key: 'userName', label: '关联人员' },
  { key: 'scheduleDateStr', label: '排班日期' },
  // {
  //   key: 'shiftType',
  //   label: '排班时段',
  //   type: 'tag',
  //   tagType: getShiftTypeTagType,
  //   formatter: getShiftTypeLabel,
  // },
  // { key: 'positionName', label: '所属岗位' },
  // {
  //   key: 'status',
  //   label: '排班状态',
  //   type: 'tag',
  //   tagType: getScheduleStatusTagType,
  //   formatter: getScheduleStatusLabel,
  // },
  {
    key: 'shiftApplyStatus',
    label: '换班状态',
    type: 'tag',
    tagType: getApplyStatusTagType,
    formatter: getApplyStatusLabel,
  },
  { key: 'applyRecord', label: '申请记录' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'updateTimeStr', label: '更新时间' },
];

export const textObj = {
  applyText: '申请换班',
  excelAllName: '排班查看数据.xlsx',
  total: '排班查看支持排班生成、排班同步、排班展示闭环管理',
};
