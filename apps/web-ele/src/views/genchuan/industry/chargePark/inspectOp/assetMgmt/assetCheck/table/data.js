import { formatDate } from '#/utils/genchuan/formatTime';

export const checkTypeOptions = [
  { label: '定期', value: '定期' },
  { label: '临时', value: '临时' },
];

export const checkStatusOptions = [
  { label: '待盘点', value: '待盘点' },
  { label: '盘点中', value: '盘点中' },
  { label: '已完成', value: '已完成' },
];

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
  const timestamp = /^\d{10}$/.test(text) ? Number(text) * 1000 : value;
  return formatDate(timestamp) || text;
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
  return tagMap[type] || 'info';
}

export function getCheckStatusTagType(status) {
  const tagMap = {
    待盘点: 'info',
    盘点中: 'warning',
    已完成: 'success',
  };
  return tagMap[status] || 'info';
}

export function getProgressStatus(progress) {
  if (Number(progress) >= 100) return 'success';
  if (Number(progress) >= 60) return '';
  if (Number(progress) > 0) return 'warning';
  return 'exception';
}

export function dataList() {
  return Array.from({ length: 14 }, (_, index) => {
    const type = checkTypeOptions[index % checkTypeOptions.length].value;
    const status = checkStatusOptions[index % checkStatusOptions.length].value;
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
    const matchType = !params.type || item.type === params.type;
    const matchStatus = !params.status || item.status === params.status;
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
    {
      fieldName: 'executeUserId',
      label: '执行人员',
      component: 'Select',
      componentProps: {
        placeholder: '请选择执行人员',
        clearable: true,
        options: userOptions,
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
    {
      fieldName: 'checkTimeRange',
      label: '盘点时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择盘点时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'timestamp',
        type: 'datetimerange',
        clearable: true,
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
        placeholder: '请选择盘点时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'timestamp',
        type: 'datetime',
      },
      rules: 'required',
    },
    {
      fieldName: 'checkScope',
      label: '盘点范围',
      component: 'Select',
      componentProps: {
        placeholder: '请选择盘点资产范围',
        options: scopeOptions,
      },
      rules: 'required',
    },
    {
      fieldName: 'executeUserId',
      label: '执行人员',
      component: 'Select',
      componentProps: {
        placeholder: '请选择执行人员',
        options: userOptions,
      },
      rules: 'required',
    },
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
      field: 'executeUserName',
      title: '执行人员',
      minWidth: 110,
      sortable: true,
      slots: { default: 'executeUserName' },
    },
    {
      field: 'confirmTimeStr',
      title: '确认时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'result',
      title: '盘点结果',
      minWidth: 210,
      sortable: true,
      slots: { default: 'result' },
    },
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
  },
  { key: 'checkTimeStr', label: '盘点时间' },
  { key: 'checkScope', label: '盘点范围' },
  { key: 'progressText', label: '盘点进度' },
  {
    key: 'status',
    label: '盘点状态',
    type: 'tag',
    tagType: getCheckStatusTagType,
  },
  { key: 'creator', label: '发起人员' },
  { key: 'executeUserName', label: '执行人员' },
  { key: 'confirmUserName', label: '确认人员' },
  { key: 'confirmTimeStr', label: '确认时间' },
  { key: 'result', label: '盘点结果' },
  { key: 'updater', label: '更新者' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'updateTimeStr', label: '更新时间' },
];

export const textObj = {
  addText: '发起资产盘点',
  excelAllName: '资产盘点数据.xlsx',
  total: '资产盘点支持盘点发起、盘点执行、结果确认、记录同步闭环管理',
};
