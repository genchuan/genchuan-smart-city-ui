import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getRangePickerDefaultProps } from '#/utils';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';

export const INSPECT_REPORT_TYPE_DICT = DICT_TYPE.INSPECT_REPORT_TYPE;
export const INSPECT_REPORT_STATUS_DICT = DICT_TYPE.INSPECT_REPORT_STATUS;

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

export function getReportTypeLabel(value) {
  return getDictLabel(INSPECT_REPORT_TYPE_DICT, value);
}

export function isReportTypeLabel(value, label) {
  return isDictLabel(INSPECT_REPORT_TYPE_DICT, value, label);
}

export function getReportStatusLabel(value) {
  return getDictLabel(INSPECT_REPORT_STATUS_DICT, value);
}

export function isReportStatusLabel(value, label) {
  return isDictLabel(INSPECT_REPORT_STATUS_DICT, value, label);
}
export const taskOptions = [
  { label: '丰泽站日常巡检任务', value: 1 },
  { label: '鲤城停车场专项巡检任务', value: 2 },
  { label: '洛江万安临时巡检任务', value: 3 },
  { label: '晋江综合能源站月度巡检任务', value: 4 },
  { label: '石狮服装城季度巡检任务', value: 5 },
  { label: '南安水头交通枢纽日检任务', value: 6 },
];

export const reportTypeOptions = getDictOptions(
  INSPECT_REPORT_TYPE_DICT,
  'string',
);

export const statusOptions = getDictOptions(
  INSPECT_REPORT_STATUS_DICT,
  'string',
);

const MOCK_REPORT_TYPE_VALUES = ['设备故障', '占位异常', '其他'];
const MOCK_REPORT_STATUS_VALUES = ['待审核', '待处置', '已完成', '已驳回'];

export const auditorOptions = [
  { label: '张三', value: 1 },
  { label: '李四', value: 2 },
  { label: '王五', value: 3 },
  { label: '赵六', value: 4 },
];

export const reporterOptions = [
  { label: 'admin', value: 'admin' },
  { label: 'operator', value: 'operator' },
  { label: 'zhangsan', value: 'zhangsan' },
  { label: 'lisi', value: 'lisi' },
];

const reportUsers = ['admin', 'operator', 'zhangsan', 'lisi'];
const baseTime = 1_775_011_986_000;

function getMockReportContent(type) {
  if (type === '设备故障') {
    return '充电枪无法正常弹出，影响车位使用';
  }
  if (type === '占位异常') {
    return '油车占用新能源车位，需现场处理';
  }
  return '现场巡检发现异常情况，需复核';
}

function getMockReportRemark(status, isProcessed) {
  if (isProcessed) return '处置完成';
  if (status === '已驳回') return '已驳回';
  return '';
}

function normalizeTimeValue(value) {
  if (!value) return value;
  const text = String(value);
  if (/^\d{10}$/.test(text)) return Number(text) * 1000;
  if (/^\d{13}$/.test(text)) return Number(text);
  return value;
}

export function formatReportTime(value) {
  if (!value) return '-';
  const text = String(value);
  const timestamp = /^\d{10}$/.test(text) ? Number(text) * 1000 : value;
  return formatDate(timestamp) || text;
}

export function getTaskName(taskId) {
  return (
    taskOptions.find((item) => Number(item.value) === Number(taskId))?.label ||
    `巡检任务 ${taskId || '-'}`
  );
}

export function getUserName(userId) {
  if (!userId && userId !== 0) return '-';
  return (
    [...auditorOptions, ...reporterOptions].find(
      (item) => String(item.value) === String(userId),
    )?.label || String(userId)
  );
}

export function getReportTypeTagType(type) {
  const tagMap = {
    设备故障: 'danger',
    占位异常: 'warning',
    其他: 'info',
  };
  return getDictTagTypeFromDict(
    getDictObj(INSPECT_REPORT_TYPE_DICT, String(type)),
    tagMap[getReportTypeLabel(type)] || 'info',
  );
}

export function getReportStatusTagType(status) {
  const tagMap = {
    待审核: 'warning',
    待处置: 'primary',
    已完成: 'success',
    已驳回: 'danger',
  };
  return getDictTagTypeFromDict(
    getDictObj(INSPECT_REPORT_STATUS_DICT, String(status)),
    tagMap[getReportStatusLabel(status)] || 'info',
  );
}

export function dataList() {
  return Array.from({ length: 18 }, (_, index) => {
    const status =
      MOCK_REPORT_STATUS_VALUES[index % MOCK_REPORT_STATUS_VALUES.length];
    const type =
      MOCK_REPORT_TYPE_VALUES[index % MOCK_REPORT_TYPE_VALUES.length];
    const task = taskOptions[index % taskOptions.length];
    const auditUser = auditorOptions[index % auditorOptions.length];
    const processUser = auditorOptions[(index + 1) % auditorOptions.length];
    const reportTime = baseTime + index * 3_600_000;
    const isAudited = ['已完成', '已驳回', '待处置'].includes(status);
    const isProcessed = status === '已完成';

    return {
      id: index + 1,
      taskId: task.value,
      taskName: task.label,
      type,
      reportTime,
      status,
      auditUserId: isAudited ? auditUser.value : null,
      auditUserName: isAudited ? auditUser.label : '-',
      auditTime: isAudited ? reportTime + 30 * 60 * 1000 : null,
      auditRemark:
        status === '已驳回' ? '上报信息不完整，请补充现场照片' : '情况属实',
      processUserId: isProcessed ? processUser.value : null,
      processUserName: isProcessed ? processUser.label : '-',
      processTime: isProcessed ? reportTime + 4 * 60 * 60 * 1000 : null,
      processResult: isProcessed ? '已完成现场处置并同步工单' : '',
      content: getMockReportContent(type),
      remark: getMockReportRemark(status, isProcessed),
      reserve1: '',
      reserve2: '',
      creator: reportUsers[index % reportUsers.length],
      updater: isAudited ? auditUser.label : 'system',
      createTime: reportTime - 20 * 60 * 1000,
      updateTime: isProcessed ? reportTime + 4 * 60 * 60 * 1000 : reportTime,
    };
  });
}

export function normalizeInspectReportRow(row) {
  const taskId = row.taskId ?? row.task_id;
  const reportTime = normalizeTimeValue(row.reportTime ?? row.report_time);
  const auditUserId = row.auditUserId ?? row.audit_user_id;
  const auditTime = normalizeTimeValue(row.auditTime ?? row.audit_time);
  const processUserId = row.processUserId ?? row.process_user_id;
  const processTime = normalizeTimeValue(row.processTime ?? row.process_time);
  const createTime = normalizeTimeValue(row.createTime ?? row.create_time);
  const updateTime = normalizeTimeValue(row.updateTime ?? row.update_time);
  const creator = row.reportUserName || row.report_user_name || row.creator;
  const status = row.statusName || row.status || '待审核';
  const type = row.typeName || row.type || '其他';
  const remark = row.processResult || row.process_result || row.remark || '';

  return {
    ...row,
    id: row.id,
    taskId,
    taskName: row.taskName || row.task_name || getTaskName(taskId),
    type,
    reportTime,
    reportTimeStr: formatReportTime(reportTime),
    status,
    auditUserId,
    auditUserName:
      row.auditUserName || row.audit_user_name || getUserName(auditUserId),
    auditTime,
    auditTimeStr: formatReportTime(auditTime),
    auditRemark: row.auditRemark || row.audit_remark || '',
    processUserId,
    processUserName:
      row.processUserName ||
      row.process_user_name ||
      getUserName(processUserId),
    processTime,
    processTimeStr: formatReportTime(processTime),
    processResult: row.processResult || row.process_result || remark,
    content: row.content || '-',
    remark,
    reserve1: row.reserve1 || row.reserve_1 || '',
    reserve2: row.reserve2 || row.reserve_2 || '',
    creator: creator || '-',
    updater: row.updater || '-',
    createTime,
    createTimeStr: formatReportTime(createTime),
    updateTime,
    updateTimeStr: formatReportTime(updateTime),
  };
}

function isInRange(value, range) {
  if (!Array.isArray(range) || range.length !== 2 || !value) return true;
  return Number(value) >= Number(range[0]) && Number(value) <= Number(range[1]);
}

export function buildTrendReportTimeRange(trendTime) {
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

  if (/^\d{4}-\d{2}-\d{2} \d{2}$/.test(value)) {
    const startTime = new Date(`${value}:00:00`.replaceAll('-', '/')).getTime();
    if (Number.isNaN(startTime)) return undefined;
    return [startTime, startTime + 60 * 60 * 1000 - 1];
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

export function isTrendTimeMatched(item, trendTime) {
  if (!trendTime) return true;

  const value = String(trendTime).trim();
  if (/^\d{1,2}$/.test(value)) {
    return item.reportTimeStr.slice(8, 10) === value.padStart(2, '0');
  }

  const trendTimeRange = buildTrendReportTimeRange(trendTime);
  if (trendTimeRange) {
    return isInRange(item.reportTime, trendTimeRange);
  }

  return item.reportTimeStr.includes(String(trendTime));
}

export function filterInspectReportRows(list = [], params = {}) {
  const reportTimeRange = params.reportTimeRange || params.reportTime;

  return list.filter((item) => {
    const matchTask =
      !params.taskId || Number(item.taskId) === Number(params.taskId);
    const matchType = isSameDictValue(
      INSPECT_REPORT_TYPE_DICT,
      item.type,
      params.type,
    );
    const matchStatus = isSameDictValue(
      INSPECT_REPORT_STATUS_DICT,
      item.status,
      params.status,
    );
    const matchAuditUser =
      !params.auditUserId ||
      Number(item.auditUserId) === Number(params.auditUserId);
    const matchProcessUser =
      !params.processUserId ||
      Number(item.processUserId) === Number(params.processUserId);
    const matchCreator =
      !params.creator || String(item.creator) === String(params.creator);
    const matchTrendTime = isTrendTimeMatched(item, params.trendTime);
    const matchReportTime = isInRange(item.reportTime, reportTimeRange);

    return (
      matchTask &&
      matchType &&
      matchStatus &&
      matchAuditUser &&
      matchProcessUser &&
      matchCreator &&
      matchTrendTime &&
      matchReportTime
    );
  });
}

export function filterMockList(params = {}) {
  const list = dataList().map((item) => normalizeInspectReportRow(item));
  return filterInspectReportRows(list, params);
}

export function getMockChartData() {
  const list = dataList().map((item) => normalizeInspectReportRow(item));
  const waitAuditCount = list.filter((item) => item.status === '待审核').length;
  const completedCount = list.filter((item) => item.status === '已完成').length;
  const processFinishRate =
    list.length === 0 ? 0 : completedCount / list.length;
  const typeData = reportTypeOptions.map((option) => ({
    typeName: option.value,
    count: list.filter((item) => item.type === option.value).length,
  }));
  const trendData = list.map((item) => ({
    time: String(Math.floor(Number(item.reportTime) / 1000)),
    reportCount: 1,
  }));

  return {
    trendData,
    typeData,
    cardData: {
      waitAuditCount,
      processFinishRate,
    },
  };
}

export function useSearchFormSchema() {
  return [
    {
      fieldName: 'taskId',
      label: '关联任务',
      component: 'Select',
      componentProps: {
        placeholder: '请选择关联任务',
        clearable: true,
        filterable: true,
        options: taskOptions,
      },
    },
    {
      fieldName: 'type',
      label: '问题类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择问题类型',
        clearable: true,
        options: reportTypeOptions,
      },
    },
    {
      fieldName: 'status',
      label: '上报状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择上报状态',
        clearable: true,
        options: statusOptions,
      },
    },
    {
      fieldName: 'reportTime',
      label: '上报时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
    {
      fieldName: 'auditUserId',
      label: '审核人',
      component: 'Select',
      componentProps: {
        placeholder: '请选择审核人',
        clearable: true,
        filterable: true,
        options: auditorOptions,
      },
    },
    {
      fieldName: 'processUserId',
      label: '处置人',
      component: 'Select',
      componentProps: {
        placeholder: '请选择处置人',
        clearable: true,
        filterable: true,
        options: auditorOptions,
      },
    },
  ];
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '上报ID', minWidth: 90, sortable: true },
    {
      field: 'taskName',
      title: '关联任务',
      minWidth: 190,
      sortable: true,
      slots: { default: 'taskName' },
    },
    {
      field: 'type',
      title: '问题类型',
      minWidth: 110,
      sortable: true,
      slots: { default: 'type' },
    },
    {
      field: 'reportTimeStr',
      title: '上报时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'status',
      title: '上报状态',
      minWidth: 110,
      sortable: true,
      slots: { default: 'status' },
    },
    // {
    //   field: 'creator',
    //   title: '上报人',
    //   minWidth: 110,
    //   sortable: true,
    //   slots: { default: 'creator' },
    // },
    {
      field: 'auditUserName',
      title: '审核人',
      minWidth: 110,
      sortable: true,
      slots: { default: 'auditUserName' },
    },
    {
      field: 'auditTimeStr',
      title: '审核时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'processUserName',
      title: '处置人',
      minWidth: 110,
      sortable: true,
      slots: { default: 'processUserName' },
    },
    {
      field: 'processTimeStr',
      title: '处置时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'remark',
      title: '处置结果/备注',
      minWidth: 170,
      sortable: true,
      slots: { default: 'remark' },
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const detailFields = [
  { key: 'id', label: '上报ID' },
  { key: 'taskName', label: '关联任务' },
  {
    key: 'type',
    label: '问题类型',
    type: 'tag',
    tagType: getReportTypeTagType,
    formatter: getReportTypeLabel,
  },
  { key: 'reportTimeStr', label: '上报时间' },
  {
    key: 'status',
    label: '上报状态',
    type: 'tag',
    tagType: getReportStatusTagType,
    formatter: getReportStatusLabel,
  },
  { key: 'creator', label: '上报人' },
  { key: 'content', label: '上报内容' },
  { key: 'auditUserName', label: '审核人' },
  { key: 'auditTimeStr', label: '审核时间' },
  { key: 'auditRemark', label: '审核意见' },
  { key: 'processUserName', label: '处置人' },
  { key: 'processTimeStr', label: '处置时间' },
  { key: 'processResult', label: '处置结果' },
  { key: 'remark', label: '备注' },
  { key: 'updater', label: '更新者' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'updateTimeStr', label: '更新时间' },
];

export const textObj = {
  excelAllName: '巡检上报数据.xlsx',
  total: '巡检上报支持上报发起、上报审核、处置执行、状态关闭闭环管理',
};
