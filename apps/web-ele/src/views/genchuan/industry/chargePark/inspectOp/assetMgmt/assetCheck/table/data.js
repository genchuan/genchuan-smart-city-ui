import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getRangePickerDefaultProps } from '#/utils';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatLocalDateTime } from '#/views/genchuan/industry/chargePark/inspectOp/utils/formatLocalDateTime';

export const ASSET_CHECK_TYPE_DICT = DICT_TYPE.ASSET_CHECK_TYPE;
export const ASSET_CHECK_STATUS_DICT = DICT_TYPE.ASSET_CHECK_STATUS;

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

export function getCheckTypeLabel(value) {
  return getDictLabel(ASSET_CHECK_TYPE_DICT, value);
}

export function isCheckTypeLabel(value, label) {
  return isDictLabel(ASSET_CHECK_TYPE_DICT, value, label);
}

export function getCheckStatusLabel(value) {
  return getDictLabel(ASSET_CHECK_STATUS_DICT, value);
}

export function isCheckStatusLabel(value, label) {
  return isDictLabel(ASSET_CHECK_STATUS_DICT, value, label);
}
export const checkTypeOptions = getDictOptions(ASSET_CHECK_TYPE_DICT, 'string');

export const checkStatusOptions = getDictOptions(
  ASSET_CHECK_STATUS_DICT,
  'string',
);

/** 按盘点状态字典 label 取 value，供图表卡片筛选 */
export function getCheckStatusOptionValue(label) {
  const opt = checkStatusOptions.find(
    (item) => String(item.label) === String(label),
  );
  return opt != null ? opt.value : label;
}

const MOCK_CHECK_TYPE_VALUES = ['定期', '临时'];
const MOCK_CHECK_STATUS_VALUES = ['待盘点', '盘点中', '已完成'];

export const userOptions = [
  { label: '张三', value: 1 },
  { label: '李四', value: 2 },
  { label: '王五', value: 3 },
  { label: '赵六', value: 4 },
];

export const scopeOptions = [
  { label: '全部资产', value: '全部资产' },
  { label: '监测设备', value: '监测设备' },
  { label: '充电设备', value: '充电设备' },
  { label: '巡检工具', value: '巡检工具' },
  { label: '重点场站资产', value: '重点场站资产' },
];

const scopeList = scopeOptions.map((item) => item.value);
const resultList = [
  '账实一致，未发现异常',
  '发现1项绑定信息需复核',
  '部分资产待补充采购凭证',
  '巡检工具数量与台账一致',
  '充电设备状态已同步资产台账',
];

const baseTime = 1_775_011_986_000;

export function formatCheckTime(value) {
  if (!value) return '-';
  const text = String(value);
  return formatLocalDateTime(value) || text;
}

export function getUserName(userId) {
  return (
    userOptions.find((item) => Number(item.value) === Number(userId))?.label ||
    '-'
  );
}

export function getCheckTypeTagType(type) {
  const tagMap = {
    定期: 'success',
    临时: 'warning',
  };
  return getDictTagTypeFromDict(
    getDictObj(ASSET_CHECK_TYPE_DICT, String(type)),
    tagMap[getCheckTypeLabel(type)] || 'info',
  );
}

export function getCheckStatusTagType(status) {
  const tagMap = {
    待盘点: 'info',
    盘点中: 'warning',
    已完成: 'success',
  };
  return getDictTagTypeFromDict(
    getDictObj(ASSET_CHECK_STATUS_DICT, String(status)),
    tagMap[getCheckStatusLabel(status)] || 'info',
  );
}

export function getProgressStatus(progress) {
  if (Number(progress) >= 100) return 'success';
  if (Number(progress) >= 60) return '';
  if (Number(progress) > 0) return 'warning';
  return 'exception';
}

export function dataList() {
  return Array.from({ length: 14 }, (_, index) => {
    const type = MOCK_CHECK_TYPE_VALUES[index % MOCK_CHECK_TYPE_VALUES.length];
    const status =
      MOCK_CHECK_STATUS_VALUES[index % MOCK_CHECK_STATUS_VALUES.length];
    const checkTime = baseTime - index * 7 * 86_400_000;
    const progressMap = {
      待盘点: 0,
      盘点中: 35 + (index % 4) * 15,
      已完成: 100,
    };
    const confirmUserId =
      status === '已完成'
        ? userOptions[index % userOptions.length].value
        : null;
    const confirmTime = status === '已完成' ? checkTime + 2 * 86_400_000 : null;

    return {
      id: index + 1,
      type,
      checkTime,
      progress: progressMap[status],
      status,
      confirmUserId,
      confirmTime,
      checkScope: scopeList[index % scopeList.length],
      executeUserId: userOptions[(index + 1) % userOptions.length].value,
      result:
        status === '已完成'
          ? resultList[index % resultList.length]
          : '待形成盘点结果',
      reserve1: scopeList[index % scopeList.length],
      reserve2:
        status === '已完成' ? resultList[index % resultList.length] : '',
      creator: userOptions[index % userOptions.length].label,
      updater: 'system',
      createTime: checkTime - 3_600_000,
      updateTime: checkTime + 3_600_000,
    };
  });
}

export function normalizeAssetCheckRow(row) {
  console.log('row', row);
  const checkTime = row.checkTime ?? row.check_time;
  const confirmUserId = row.confirmUserId ?? row.confirm_user_id;
  const confirmTime = row.confirmTime ?? row.confirm_time;
  const executeUserId = row.executeUserId ?? row.execute_user_id;
  const createTime = row.createTime ?? row.create_time;
  const updateTime = row.updateTime ?? row.update_time;
  const progress = Number(row.progress ?? 0);

  return {
    ...row,
    id: row.id,
    type: row.typeName || row.type || '定期',
    checkTime,
    checkTimeStr: formatCheckTime(checkTime),
    progress,
    progressText: `${progress}%`,
    status: row.statusName || row.status || '待盘点',
    confirmUserId,
    confirmUserName:
      row.confirmUserName ||
      row.confirm_user_name ||
      getUserName(confirmUserId),
    confirmTime,
    confirmTimeStr: formatCheckTime(confirmTime),
    checkScope: row.checkScope || row.check_scope || row.reserve1 || '全部资产',
    executeUserId,
    executeUserName:
      row.executeUserName ||
      row.execute_user_name ||
      getUserName(executeUserId),
    result:
      row.result || row.checkResult || row.check_result || row.reserve2 || '-',
    creator: row.creator || '-',
    updater: row.updater || '-',
    createTime,
    createTimeStr: formatCheckTime(createTime),
    updateTime,
    updateTimeStr: formatCheckTime(updateTime),
  };
}

function isInRange(value, range) {
  if (!Array.isArray(range) || range.length !== 2 || !value) return true;
  return Number(value) >= Number(range[0]) && Number(value) <= Number(range[1]);
}

export function filterMockList(params = {}) {
  const list = dataList().map((item) => normalizeAssetCheckRow(item));
  const checkTimeRange = params.checkTimeRange || params.checkTime;
  const confirmTimeRange = params.confirmTimeRange || params.confirmTime;

  return list.filter((item) => {
    const matchType = isSameDictValue(
      ASSET_CHECK_TYPE_DICT,
      item.type,
      params.type,
    );
    const matchStatus = isSameDictValue(
      ASSET_CHECK_STATUS_DICT,
      item.status,
      params.status,
    );
    const matchCreator =
      !params.creator || item.creator.includes(String(params.creator));
    const matchExecutor =
      !params.executeUserId ||
      Number(item.executeUserId) === Number(params.executeUserId);
    const matchConfirmUser =
      !params.confirmUserId ||
      Number(item.confirmUserId) === Number(params.confirmUserId);
    const matchTrendTime =
      !params.trendTime || item.checkTimeStr.includes(String(params.trendTime));
    const matchCheckTime = isInRange(item.checkTime, checkTimeRange);
    const matchConfirmTime = isInRange(item.confirmTime, confirmTimeRange);

    return (
      matchType &&
      matchStatus &&
      matchCreator &&
      matchExecutor &&
      matchConfirmUser &&
      matchTrendTime &&
      matchCheckTime &&
      matchConfirmTime
    );
  });
}

export function getMockChartData() {
  const list = dataList().map((item) => normalizeAssetCheckRow(item));
  const checkCount = list.length;
  const finishedCount = list.filter((item) => item.status === '已完成').length;
  const trendData = ['01', '02', '03', '04', '05', '06'].map((time, index) => ({
    time,
    progress: Math.min(100, 25 + index * 12 + (index % 2) * 6),
  }));

  return {
    trendData,
    cardData: {
      checkCount,
      checkFinishRate: Number((finishedCount / checkCount).toFixed(2)),
    },
  };
}

export function useSearchFormSchema() {
  return [
    {
      fieldName: 'type',
      label: '盘点类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择盘点类型',
        clearable: true,
        options: checkTypeOptions,
      },
    },
    {
      fieldName: 'status',
      label: '盘点状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择盘点状态',
        clearable: true,
        options: checkStatusOptions,
      },
    },
    // {
    //   fieldName: 'executeUserId',
    //   label: '执行人员',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择执行人员',
    //     clearable: true,
    //     options: userOptions,
    //   },
    // },
    // {
    //   fieldName: 'confirmUserId',
    //   label: '确认人员',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择确认人员',
    //     clearable: true,
    //     options: userOptions,
    //   },
    // },
    {
      fieldName: 'checkTime',
      label: '盘点时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
  ];
}

export function useFormSchema() {
  return [
    {
      fieldName: 'type',
      label: '盘点类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择盘点类型',
        options: checkTypeOptions,
      },
      rules: 'required',
    },
    {
      fieldName: 'checkTime',
      label: '盘点时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择采购时间',
        showTime: true,
        valueFormat: 'x',
        format: 'YYYY-MM-DD HH:mm:ss',
        type: 'datetime',
      },
      rules: 'required',
    },
    // {
    //   fieldName: 'progress',
    //   label: '盘点进度',
    //   component: 'InputNumber',
    //   componentProps: {
    //     placeholder: '请输入盘点进度',
    //     min: 0,
    //     max: 100,
    //     step: 1,
    //     precision: 0,
    //     controlsPosition: 'right',
    //   },
    // },
    // {
    //   fieldName: 'checkScope',
    //   label: '盘点范围',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择盘点资产范围',
    //     options: scopeOptions,
    //   },
    //   rules: 'required',
    // },
    // {
    //   fieldName: 'executeUserId',
    //   label: '执行人员',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择执行人员',
    //     options: userOptions,
    //   },
    //   rules: 'required',
    // },
  ];
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '盘点ID', minWidth: 90, sortable: true },
    {
      field: 'type',
      title: '盘点类型',
      minWidth: 110,
      sortable: true,
      slots: { default: 'type' },
    },
    {
      field: 'checkTimeStr',
      title: '盘点时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'progress',
      title: '盘点进度',
      minWidth: 150,
      sortable: true,
      slots: { default: 'progress' },
    },
    {
      field: 'status',
      title: '盘点状态',
      minWidth: 110,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'creator',
      title: '发起人员',
      minWidth: 110,
      sortable: true,
      slots: { default: 'creator' },
    },
    {
      field: 'updater',
      title: '执行人员',
      minWidth: 110,
      sortable: true,
      slots: { default: 'updater' },
    },
    {
      field: 'confirmTimeStr',
      title: '确认时间',
      minWidth: 180,
      sortable: true,
    },
    // {
    //   field: 'result',
    //   title: '盘点结果',
    //   minWidth: 210,
    //   sortable: true,
    //   slots: { default: 'result' },
    // },
    {
      field: 'createTimeStr',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      title: '操作',
      width: 210,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const detailFields = [
  { key: 'id', label: '盘点ID' },
  {
    key: 'type',
    label: '盘点类型',
    type: 'tag',
    tagType: getCheckTypeTagType,
    formatter: getCheckTypeLabel,
  },
  { key: 'checkTimeStr', label: '盘点时间' },
  { key: 'checkScope', label: '盘点范围' },
  { key: 'progressText', label: '盘点进度' },
  {
    key: 'status',
    label: '盘点状态',
    type: 'tag',
    tagType: getCheckStatusTagType,
    formatter: getCheckStatusLabel,
  },
  // { key: 'creator', label: '发起人员' },
  // { key: 'executeUserName', label: '执行人员' },
  { key: 'confirmUserName', label: '确认人员' },
  { key: 'confirmTimeStr', label: '确认时间' },
  // { key: 'result', label: '盘点结果' },
  { key: 'updater', label: '更新者' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'updateTimeStr', label: '更新时间' },
];

export const textObj = {
  addText: '发起资产盘点',
  excelAllName: '资产盘点数据.xlsx',
  total: '资产盘点支持盘点发起、盘点执行、结果确认、记录同步闭环管理',
};
