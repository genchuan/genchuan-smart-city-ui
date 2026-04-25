import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getRangePickerDefaultProps } from '#/utils';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';

export const HANDOVER_LOG_STATUS_DICT = DICT_TYPE.HANDOVER_LOG_STATUS;

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

export function getStatusLabel(value) {
  return getDictLabel(HANDOVER_LOG_STATUS_DICT, value);
}

export function isStatusLabel(value, label) {
  return isDictLabel(HANDOVER_LOG_STATUS_DICT, value, label);
}
export const userOptions = [
  { label: '张三', value: 1 },
  { label: '李四', value: 2 },
  { label: '王五', value: 3 },
  { label: '赵六', value: 4 },
  { label: '陈七', value: 5 },
];

export const statusOptions = getDictOptions(HANDOVER_LOG_STATUS_DICT, 'string');

const handoverContents = [
  '今日场站设备运行正常，无异常情况。',
  '丰泽站2号充电桩需关注枪线温度，已完成现场检查。',
  '晚班需继续跟进鲤城停车场入口道闸日志。',
  '已完成巡检任务交接，消防通道保持畅通。',
  '洛江站视频识别相机偶发离线，已记录待复核。',
  '共享充电柜库存已补充，交由下一班继续核对。',
];

const baseTime = new Date('2026-04-01 08:00:00').getTime();

export function formatHandoverTime(value) {
  if (!value) return '-';
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return value;
  const text = String(value);
  const timestamp = /^\d{10}$/.test(text) ? Number(text) * 1000 : value;
  return formatDate(timestamp) || text;
}

export function getUserName(userId) {
  return (
    userOptions.find((item) => Number(item.value) === Number(userId))?.label ||
    '-'
  );
}

export function getStatusTagType(status) {
  const tagMap = {
    待确认: 'warning',
    已确认: 'success',
  };
  return getDictTagTypeFromDict(
    getDictObj(HANDOVER_LOG_STATUS_DICT, String(status)),
    tagMap[getStatusLabel(status)] || 'info',
  );
}

function toHandoverDate(offset) {
  const date = new Date(baseTime + offset * 86_400_000);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function dataList() {
  return Array.from({ length: 18 }, (_, index) => {
    const user = userOptions[index % userOptions.length];
    const status = index % 3 === 0 ? '待确认' : '已确认';
    const handoverDate = toHandoverDate(index % 12);
    const createTime = baseTime + index * 4 * 3_600_000;
    const confirmUserId =
      status === '已确认'
        ? userOptions[(index + 1) % userOptions.length].value
        : null;
    const confirmTime = status === '已确认' ? createTime + 3_600_000 : null;

    return {
      id: index + 1,
      userId: user.value,
      userName: user.label,
      handoverDate,
      content: handoverContents[index % handoverContents.length],
      status,
      confirmUserId,
      confirmUserName: getUserName(confirmUserId),
      confirmTime,
      reserve1: getUserName(confirmUserId),
      reserve2: status === '已确认' ? '已同步交接记录' : '等待值班长确认',
      creator: user.label,
      updater: 'system',
      createTime,
      updateTime: createTime + 2 * 3_600_000,
    };
  });
}

export function normalizeHandoverLogRow(row) {
  const userId = row.userId ?? row.user_id;
  const handoverDate = row.handoverDate ?? row.handover_date;
  const confirmUserId = row.confirmUserId ?? row.confirm_user_id;
  const confirmTime = row.confirmTime ?? row.confirm_time;
  const createTime = row.createTime ?? row.create_time;
  const updateTime = row.updateTime ?? row.update_time;

  return {
    ...row,
    id: row.id,
    userId,
    userName: row.userName || row.user_name || getUserName(userId),
    handoverDate,
    handoverDateStr: formatHandoverTime(handoverDate),
    content: row.content || '-',
    status: row.statusName || row.status || '待确认',
    confirmUserId,
    confirmUserName:
      row.confirmUserName ||
      row.confirm_user_name ||
      getUserName(confirmUserId),
    confirmTime,
    confirmTimeStr: formatHandoverTime(confirmTime),
    creator: row.creator || '-',
    updater: row.updater || '-',
    createTime,
    createTimeStr: formatHandoverTime(createTime),
    updateTime,
    updateTimeStr: formatHandoverTime(updateTime),
  };
}

function isDateInRange(dateText, range) {
  if (!Array.isArray(range) || range.length !== 2 || !dateText) return true;
  const current = new Date(`${dateText} 00:00:00`).getTime();
  const start = Number(range[0]);
  const end = Number(range[1]);
  return current >= start && current <= end;
}

function isTimeInRange(time, range) {
  if (!Array.isArray(range) || range.length !== 2 || !time) return true;
  return Number(time) >= Number(range[0]) && Number(time) <= Number(range[1]);
}

export function filterMockList(params = {}) {
  const list = dataList().map((item) => normalizeHandoverLogRow(item));
  const handoverDateRange = params.handoverDateRange || params.handoverDate;
  const confirmTimeRange = params.confirmTimeRange || params.confirmTime;

  return list.filter((item) => {
    const matchUser =
      !params.userId || Number(item.userId) === Number(params.userId);
    const matchUserName =
      !params.userName || item.userName.includes(String(params.userName));
    let matchDate = true;
    if (Array.isArray(handoverDateRange)) {
      matchDate = isDateInRange(item.handoverDate, handoverDateRange);
    } else if (params.handoverDate) {
      matchDate = item.handoverDate === params.handoverDate;
    }
    const matchStatus = isSameDictValue(
      HANDOVER_LOG_STATUS_DICT,
      item.status,
      params.status,
    );
    const matchConfirmUser =
      !params.confirmUserId ||
      Number(item.confirmUserId) === Number(params.confirmUserId);
    const matchConfirmTime = isTimeInRange(item.confirmTime, confirmTimeRange);
    const matchTrendTime =
      !params.trendTime || item.handoverDate.includes(String(params.trendTime));

    return (
      matchUser &&
      matchUserName &&
      matchDate &&
      matchStatus &&
      matchConfirmUser &&
      matchConfirmTime &&
      matchTrendTime
    );
  });
}

export function getMockChartData() {
  const list = dataList().map((item) => normalizeHandoverLogRow(item));
  const logCount = list.length;
  const confirmedCount = list.filter((item) => item.status === '已确认').length;
  const trendData = ['01', '02', '03', '04', '05', '06'].map((time, index) => ({
    time,
    logCount: 3 + (index % 3) + index,
  }));

  return {
    trendData,
    cardData: {
      logCount,
      confirmRate: Number((confirmedCount / logCount).toFixed(2)),
    },
  };
}

export function useSearchFormSchema() {
  return [
    {
      fieldName: 'userId',
      label: '交接人员',
      component: 'Select',
      componentProps: {
        placeholder: '请选择交接人员',
        clearable: true,
        options: userOptions,
      },
    },
    {
      fieldName: 'handoverDate',
      label: '交接日期',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
    {
      fieldName: 'status',
      label: '日志状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择日志状态',
        clearable: true,
        options: statusOptions,
      },
    },
    {
      fieldName: 'confirmUserId',
      label: '确认人员',
      component: 'Select',
      componentProps: {
        placeholder: '请选择确认人员',
        clearable: true,
        options: userOptions,
      },
    },
  ];
}

export function useFormSchema() {
  return [
    {
      fieldName: 'handoverDate',
      label: '交接日期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择交接日期',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
        type: 'date',
      },
      rules: 'required',
    },
    {
      fieldName: 'userId',
      label: '交接人员',
      component: 'Select',
      componentProps: {
        placeholder: '请选择交接人员',
        clearable: true,
        options: userOptions,
      },
      rules: 'required',
    },
    {
      fieldName: 'content',
      label: '交接内容',
      component: 'Input',
      componentProps: {
        placeholder: '请输入交接内容',
        rows: 5,
        type: 'textarea',
      },
      rules: 'required',
    },
  ];
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '日志ID', minWidth: 90, sortable: true },
    {
      field: 'userName',
      title: '交接人员',
      minWidth: 120,
      sortable: true,
      slots: { default: 'userName' },
    },
    {
      field: 'handoverDateStr',
      title: '交接日期',
      minWidth: 140,
      sortable: true,
      slots: { default: 'handoverDateStr' },
    },
    {
      field: 'content',
      title: '交接内容',
      minWidth: 260,
      sortable: true,
    },
    {
      field: 'status',
      title: '日志状态',
      minWidth: 110,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'confirmUserName',
      title: '确认人员',
      minWidth: 120,
      sortable: true,
      slots: { default: 'confirmUserName' },
    },
    {
      field: 'confirmTimeStr',
      title: '确认时间',
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
      width: 160,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const detailFields = [
  { key: 'id', label: '日志ID' },
  { key: 'userName', label: '交接人员' },
  { key: 'handoverDateStr', label: '交接日期' },
  { key: 'content', label: '交接内容' },
  {
    key: 'status',
    label: '日志状态',
    type: 'tag',
    tagType: getStatusTagType,
    formatter: getStatusLabel,
  },
  { key: 'confirmUserName', label: '确认人员' },
  { key: 'confirmTimeStr', label: '确认时间' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'updateTimeStr', label: '更新时间' },
];

export const textObj = {
  addText: '新增交接日志',
  excelAllName: '交接日志数据.xlsx',
  total: '交接日志支持日志生成、日志确认、记录同步闭环管理',
};
