import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getRangePickerDefaultProps } from '#/utils';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatLocalDateTime } from '#/views/genchuan/industry/chargePark/inspectOp/utils/formatLocalDateTime';

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

export function getStatusLabel(value) {
  return getDictLabel(SHIFT_APPLY_STATUS_DICT, value);
}

export function isStatusLabel(value, label) {
  return isDictLabel(SHIFT_APPLY_STATUS_DICT, value, label);
}
export const userOptions = [
  { label: '张三', position: '巡检员', value: 1 },
  { label: '李四', position: '值班长', value: 2 },
  { label: '王五', position: '设备工程师', value: 3 },
  { label: '赵六', position: '安全巡检员', value: 4 },
  { label: '陈七', position: '运维专员', value: 5 },
];

export const statusOptions = getDictOptions(SHIFT_APPLY_STATUS_DICT, 'string');

export const auditResultOptions = [
  { label: '通过', value: '2' },
  { label: '驳回', value: '3' },
];

const auditRemarks = [
  '同意换班申请，人员安排满足要求',
  '人员不足，暂无法批准换班',
  '已确认双方班次安排',
  '申请信息不完整，需重新提交',
];

const baseTime = new Date('2026-04-01 08:00:00').getTime();

export function formatShiftApplyTime(value) {
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

export function getStatusTagType(status) {
  const tagMap = {
    待审核: 'warning',
    已通过: 'success',
    已驳回: 'danger',
  };
  return getDictTagTypeFromDict(
    getDictObj(SHIFT_APPLY_STATUS_DICT, String(status)),
    tagMap[getStatusLabel(status)] || 'info',
  );
}

function toDate(offset) {
  const date = new Date(baseTime + offset * 86_400_000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return [year, month, day].join('-');
}

export function getMockStatus(index) {
  if (index % 3 === 0) return '待审核';
  if (index % 3 === 1) return '已通过';
  return '已驳回';
}

export function dataList() {
  return Array.from({ length: 18 }, (_, index) => {
    const status = getMockStatus(index);
    const applyUser = userOptions[index % userOptions.length];
    const targetUser = userOptions[(index + 1) % userOptions.length];
    const oldDate = toDate(index % 12);
    const newDate = toDate((index % 12) + 1);
    const createTime = baseTime + index * 4 * 3_600_000;
    const auditUserId = status === '待审核' ? null : userOptions[1].value;
    const auditTime = status === '待审核' ? null : createTime + 3_600_000;
    const effectTime = status === '已通过' ? createTime + 6 * 3_600_000 : null;
    return {
      id: index + 1,
      applyUserId: applyUser.value,
      applyUserName: applyUser.label,
      targetUserId: targetUser.value,
      targetUserName: targetUser.label,
      oldDate,
      newDate,
      status,
      auditUserId,
      auditUserName: getUserName(auditUserId),
      auditTime,
      effectTime,
      auditRemark:
        status === '待审核' ? '' : auditRemarks[index % auditRemarks.length],
      reserve1:
        status === '待审核' ? '' : auditRemarks[index % auditRemarks.length],
      reserve2: status === '已通过' ? '已推送排班变更消息' : '',
      creator: applyUser.label,
      updater: 'system',
      createTime,
      updateTime: createTime + 2 * 3_600_000,
    };
  });
}

export function normalizeShiftApplyRow(row) {
  const applyUserId = row.applyUserId ?? row.apply_user_id;
  const targetUserId = row.targetUserId ?? row.target_user_id;
  const oldDate = row.oldDate ?? row.old_date;
  const newDate = row.newDate ?? row.new_date;
  const auditUserId = row.auditUserId ?? row.audit_user_id;
  const auditTime = row.auditTime ?? row.audit_time;
  const effectTime = row.effectTime ?? row.effect_time;
  const createTime = row.createTime ?? row.create_time;
  const updateTime = row.updateTime ?? row.update_time;
  return {
    ...row,
    id: row.id,
    applyUserId,
    applyUserName:
      row.applyUserName || row.apply_user_name || getUserName(applyUserId),
    targetUserId,
    targetUserName:
      row.targetUserName || row.target_user_name || getUserName(targetUserId),
    oldDate,
    oldDateStr: formatShiftApplyTime(oldDate),
    newDate,
    newDateStr: formatShiftApplyTime(newDate),
    status: row.statusName || row.status || '待审核',
    auditUserId,
    auditUserName:
      row.auditUserName || row.audit_user_name || getUserName(auditUserId),
    auditTime,
    auditTimeStr: formatShiftApplyTime(auditTime),
    effectTime,
    effectTimeStr: formatShiftApplyTime(effectTime),
    auditRemark: row.auditRemark || row.audit_remark || row.reserve1 || '',
    creator: row.creator || '-',
    updater: row.updater || '-',
    createTime,
    createTimeStr: formatShiftApplyTime(createTime),
    updateTime,
    updateTimeStr: formatShiftApplyTime(updateTime),
  };
}

function isDateInRange(dateText, range) {
  if (!Array.isArray(range) || range.length !== 2 || !dateText) return true;
  const current = new Date(`${dateText} 00:00:00`).getTime();
  return current >= Number(range[0]) && current <= Number(range[1]);
}

function isTimeInRange(time, range) {
  if (!Array.isArray(range) || range.length !== 2 || !time) return true;
  return Number(time) >= Number(range[0]) && Number(time) <= Number(range[1]);
}

export function filterMockList(params = {}) {
  const list = dataList().map((item) => normalizeShiftApplyRow(item));
  const oldDateRange = params.oldDateRange || params.oldDate;
  const newDateRange = params.newDateRange || params.newDate;
  const auditTimeRange = params.auditTimeRange || params.auditTime;
  return list.filter((item) => {
    const matchApplyUser =
      !params.applyUserId ||
      Number(item.applyUserId) === Number(params.applyUserId);
    const matchApplyUserName =
      !params.applyUserName ||
      item.applyUserName.includes(String(params.applyUserName));
    const matchTargetUser =
      !params.targetUserId ||
      Number(item.targetUserId) === Number(params.targetUserId);
    const matchTargetUserName =
      !params.targetUserName ||
      item.targetUserName.includes(String(params.targetUserName));
    let matchOldDate = true;
    if (Array.isArray(oldDateRange))
      matchOldDate = isDateInRange(item.oldDate, oldDateRange);
    else if (params.oldDate) matchOldDate = item.oldDate === params.oldDate;
    let matchNewDate = true;
    if (Array.isArray(newDateRange))
      matchNewDate = isDateInRange(item.newDate, newDateRange);
    else if (params.newDate) matchNewDate = item.newDate === params.newDate;
    const matchStatus = isSameDictValue(
      SHIFT_APPLY_STATUS_DICT,
      item.status,
      params.status,
    );
    const matchAuditUser =
      !params.auditUserId ||
      Number(item.auditUserId) === Number(params.auditUserId);
    const matchAuditTime = isTimeInRange(item.auditTime, auditTimeRange);
    const matchTrendTime =
      !params.trendTime ||
      item.createTimeStr.includes(String(params.trendTime));
    return (
      matchApplyUser &&
      matchApplyUserName &&
      matchTargetUser &&
      matchTargetUserName &&
      matchOldDate &&
      matchNewDate &&
      matchStatus &&
      matchAuditUser &&
      matchAuditTime &&
      matchTrendTime
    );
  });
}

export function getMockChartData() {
  const list = dataList().map((item) => normalizeShiftApplyRow(item));
  const applyCount = list.length;
  const passedCount = list.filter((item) => item.status === '已通过').length;
  const trendData = ['01', '02', '03', '04', '05', '06'].map((time, index) => ({
    time,
    applyCount: 1 + index + (index % 2),
  }));
  return {
    trendData,
    cardData: {
      applyCount,
      auditPassRate: Number((passedCount / applyCount).toFixed(2)),
    },
  };
}

export function useSearchFormSchema() {
  return [
    {
      fieldName: 'applyUserId',
      label: '申请人',
      component: 'Select',
      componentProps: {
        placeholder: '请选择申请人',
        clearable: true,
        options: userOptions,
      },
    },
    {
      fieldName: 'targetUserId',
      label: '换班对象',
      component: 'Select',
      componentProps: {
        placeholder: '请选择换班对象',
        clearable: true,
        options: userOptions,
      },
    },
    {
      fieldName: 'oldDate',
      label: '原日期',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
    {
      fieldName: 'newDate',
      label: '新日期',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
    {
      fieldName: 'status',
      label: '申请状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择申请状态',
        clearable: true,
        options: statusOptions,
      },
    },
  ];
}

export function useBatchAuditFormSchema() {
  return [
    {
      fieldName: 'auditResult',
      label: '审核结果',
      component: 'Select',
      componentProps: {
        placeholder: '请选择审核结果',
        options: auditResultOptions,
      },
      rules: 'required',
    },
    {
      fieldName: 'auditRemark',
      label: '审核意见',
      component: 'Input',
      componentProps: {
        placeholder: '请输入审核意见，驳回时不少于10个字',
        rows: 4,
        type: 'textarea',
      },
    },
  ];
}

export function useReapplyFormSchema() {
  return [
    {
      fieldName: 'applyUserName',
      label: '申请人',
      component: 'Input',
      componentProps: { disabled: true },
    },
    {
      fieldName: 'targetUserName',
      label: '换班对象',
      component: 'Input',
      componentProps: { disabled: true },
    },
    {
      fieldName: 'newRemark',
      label: '新申请备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入重新申请备注',
        rows: 4,
        type: 'textarea',
      },
    },
  ];
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '申请ID', minWidth: 90, sortable: true },
    {
      field: 'applyUserName',
      title: '申请人',
      minWidth: 120,
      sortable: true,
      slots: { default: 'applyUserName' },
    },
    {
      field: 'targetUserName',
      title: '换班对象',
      minWidth: 120,
      sortable: true,
      slots: { default: 'targetUserName' },
    },
    {
      field: 'oldDateStr',
      title: '原日期',
      minWidth: 130,
      sortable: true,
      slots: { default: 'oldDateStr' },
    },
    {
      field: 'newDateStr',
      title: '新日期',
      minWidth: 130,
      sortable: true,
      slots: { default: 'newDateStr' },
    },
    {
      field: 'status',
      title: '申请状态',
      minWidth: 110,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'auditUserName',
      title: '审核人',
      minWidth: 110,
      sortable: true,
      slots: { default: 'auditUserName' },
    },
    { field: 'auditTimeStr', title: '审核时间', minWidth: 180, sortable: true },
    {
      field: 'effectTimeStr',
      title: '生效时间',
      minWidth: 180,
      sortable: true,
    },
    { field: 'auditRemark', title: '审核意见', minWidth: 210, sortable: true },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const detailFields = [
  { key: 'id', label: '申请ID' },
  { key: 'applyUserName', label: '申请人' },
  { key: 'targetUserName', label: '换班对象' },
  { key: 'oldDateStr', label: '原日期' },
  { key: 'newDateStr', label: '新日期' },
  { key: 'status', label: '申请状态', type: 'tag', tagType: getStatusTagType },
  { key: 'auditUserName', label: '审核人' },
  { key: 'auditTimeStr', label: '审核时间' },
  { key: 'effectTimeStr', label: '生效时间' },
  { key: 'auditRemark', label: '审核意见' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'updateTimeStr', label: '更新时间' },
];

export const textObj = {
  batchAuditText: '批量审核',
  reapplyText: '重新申请',
  excelAllName: '换班申请数据.xlsx',
  total: '换班申请支持申请发起、申请审核、申请生效、记录同步闭环管理',
};
