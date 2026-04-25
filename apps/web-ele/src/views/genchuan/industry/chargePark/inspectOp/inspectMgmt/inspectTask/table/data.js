import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getInspectUserPage } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectUser';
import { getRangePickerDefaultProps } from '#/utils';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';

export const INSPECT_TASK_STATUS_DICT = DICT_TYPE.INSPECT_TASK_STATUS;

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

export function getTaskStatusLabel(value) {
  return getDictLabel(INSPECT_TASK_STATUS_DICT, value);
}

export function isTaskStatusLabel(value, label) {
  return isDictLabel(INSPECT_TASK_STATUS_DICT, value, label);
}
export const planOptions = [
  { label: '丰泽站日常巡检计划', value: 1 },
  { label: '鲤城停车场专项巡检计划', value: 2 },
  { label: '洛江万安临时巡检计划', value: 3 },
  { label: '晋江综合能源站月度巡检', value: 4 },
  { label: '石狮服装城季度巡检', value: 5 },
  { label: '南安水头交通枢纽日检', value: 6 },
];

const DEFAULT_USER_OPTIONS = [
  { label: '张三', value: 1 },
  { label: '李四', value: 2 },
  { label: '王五', value: 3 },
  { label: '赵六', value: 4 },
];
export const userOptions = [...DEFAULT_USER_OPTIONS];
let userOptionsLoaded = false;
let userOptionsLoadingPromise = null;

export async function loadTaskUserOptions() {
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

export const taskStatusOptions = getDictOptions(
  INSPECT_TASK_STATUS_DICT,
  'string',
);

const MOCK_TASK_STATUS_VALUES = ['待派发', '待认领', '处理中', '已完成'];

export const archiveOptions = [
  { label: '否', value: false },
  { label: '是', value: true },
];

export const taskTypeOptions = [
  { label: '设备巡检', value: '设备巡检' },
  { label: '占位处置', value: '占位处置' },
  { label: '安全巡检', value: '安全巡检' },
  { label: '其他', value: '其他' },
];

const baseTime = 1_775_011_986_000;

export function formatTaskTime(value) {
  if (!value) return '-';
  const text = String(value);
  const timestamp = /^\d{10}$/.test(text) ? Number(text) * 1000 : value;
  return formatDate(timestamp) || text;
}

export function getPlanName(planId) {
  return (
    planOptions.find((item) => item.value === Number(planId))?.label || '-'
  );
}

export function getUserName(userId) {
  return (
    userOptions.find((item) => item.value === Number(userId))?.label || '-'
  );
}

export function getTaskTypeTagType(type) {
  const tagMap = {
    设备巡检: 'success',
    占位处置: 'warning',
    安全巡检: 'danger',
    其他: 'info',
  };
  return tagMap[type] || 'info';
}

export function getTaskStatusTagType(status) {
  const tagMap = {
    待派发: 'info',
    待认领: 'warning',
    处理中: 'primary',
    已完成: 'success',
  };
  return getDictTagTypeFromDict(
    getDictObj(INSPECT_TASK_STATUS_DICT, String(status)),
    tagMap[getTaskStatusLabel(status)] || 'info',
  );
}

export function getArchiveTagType(isArchive) {
  return isArchive ? 'success' : 'info';
}

export function getProgressStatus(progress) {
  if (Number(progress) >= 100) return 'success';
  if (Number(progress) >= 60) return '';
  if (Number(progress) > 0) return 'warning';
  return 'exception';
}

export function dataList() {
  return Array.from({ length: 16 }, (_, index) => {
    const status =
      MOCK_TASK_STATUS_VALUES[index % MOCK_TASK_STATUS_VALUES.length];
    const taskType = taskTypeOptions[index % taskTypeOptions.length].value;
    const plan = planOptions[index % planOptions.length];
    const user = DEFAULT_USER_OPTIONS[index % DEFAULT_USER_OPTIONS.length];
    const dispatchTime =
      status === '待派发' ? null : baseTime + index * 7_200_000;
    const claimTime = ['处理中', '已完成'].includes(status)
      ? dispatchTime + 1_800_000
      : null;
    const completeTime = status === '已完成' ? claimTime + 9_000_000 : null;
    const progressMap = {
      待派发: 0,
      待认领: 0,
      处理中: 45 + (index % 3) * 15,
      已完成: 100,
    };

    return {
      id: index + 1,
      planId: plan.value,
      planName: plan.label,
      userId: status === '待派发' ? null : user.value,
      userName: status === '待派发' ? '-' : user.label,
      taskType,
      dispatchTime,
      claimTime,
      completeTime,
      status,
      progress: progressMap[status],
      isArchive: status === '已完成' && index % 2 === 0,
      creator: index % 2 === 0 ? 'admin' : 'operator',
      updater: 'system',
      createTime: baseTime - 86_400_000 + index * 3_600_000,
      updateTime: baseTime + index * 7_200_000,
    };
  });
}

export function normalizeInspectTaskRow(row) {
  const planId = row.planId ?? row.plan_id;
  const userId = row.userId ?? row.user_id;
  const dispatchTime = row.dispatchTime ?? row.dispatch_time;
  const claimTime = row.claimTime ?? row.claim_time;
  const completeTime = row.completeTime ?? row.complete_time ?? row.finishTime;
  const createTime = row.createTime ?? row.create_time;
  const updateTime = row.updateTime ?? row.update_time;
  const progress = Number(row.progress ?? 0);
  const isArchive = row.isArchive ?? row.is_archive ?? false;

  return {
    ...row,
    id: row.id,
    planId,
    planName: row.planName || row.plan_name || getPlanName(planId),
    userId,
    userName: row.userName || row.user_name || getUserName(userId),
    taskType:
      row.taskType || row.task_type || row.typeName || row.type || '其他',
    dispatchTime,
    dispatchTimeStr: formatTaskTime(dispatchTime),
    claimTime,
    claimTimeStr: formatTaskTime(claimTime),
    completeTime,
    completeTimeStr: formatTaskTime(completeTime),
    status: row.statusName || row.status || '待派发',
    progress,
    progressText: `${progress}%`,
    isArchive:
      isArchive === true ||
      isArchive === 1 ||
      isArchive === '1' ||
      isArchive === '是',
    archiveText:
      isArchive === true ||
      isArchive === 1 ||
      isArchive === '1' ||
      isArchive === '是'
        ? '是'
        : '否',
    creator: row.creator || '-',
    updater: row.updater || '-',
    createTime,
    createTimeStr: formatTaskTime(createTime),
    updateTime,
    updateTimeStr: formatTaskTime(updateTime),
  };
}

function isInRange(value, range) {
  if (!Array.isArray(range) || range.length !== 2 || !value) return true;
  return Number(value) >= Number(range[0]) && Number(value) <= Number(range[1]);
}

export function filterMockList(params = {}) {
  const list = dataList().map((item) => normalizeInspectTaskRow(item));
  const dispatchTimeRange = params.dispatchTimeRange || params.dispatchTime;

  return list.filter((item) => {
    const matchPlan =
      !params.planId || Number(item.planId) === Number(params.planId);
    const matchUser =
      !params.userId || Number(item.userId) === Number(params.userId);
    const matchType = !params.taskType || item.taskType === params.taskType;
    const matchStatusGroup =
      params.statusGroup !== '???' || item.status !== '???';
    const matchStatus = isSameDictValue(
      INSPECT_TASK_STATUS_DICT,
      item.status,
      params.status,
    );
    const matchArchive =
      params.isArchive === undefined ||
      params.isArchive === '' ||
      item.isArchive === params.isArchive ||
      String(item.isArchive) === String(params.isArchive);
    const matchTrendTime =
      !params.trendTime ||
      item.dispatchTimeStr.includes(String(params.trendTime));
    const matchDispatchTime = isInRange(item.dispatchTime, dispatchTimeRange);

    return (
      matchPlan &&
      matchUser &&
      matchType &&
      matchStatusGroup &&
      matchStatus &&
      matchArchive &&
      matchTrendTime &&
      matchDispatchTime
    );
  });
}

export function getMockChartData() {
  const list = dataList().map((item) => normalizeInspectTaskRow(item));
  const waitTaskCount = list.filter((item) => item.status !== '已完成').length;
  const finishTaskCount = list.filter(
    (item) => item.status === '已完成',
  ).length;
  const typeData = taskTypeOptions.map((option) => ({
    typeName: option.value,
    count: list.filter((item) => item.taskType === option.value).length,
  }));
  const trendData = ['01', '02', '03', '04', '05', '06'].map((time, index) => ({
    time,
    avgHandleTime: 120 - index * 8 + (index % 2) * 6,
  }));

  return {
    typeData,
    trendData,
    cardData: {
      waitTaskCount,
      finishTaskCount,
    },
  };
}

export function useSearchFormSchema() {
  return [
    {
      fieldName: 'planId',
      label: '关联计划',
      component: 'Select',
      componentProps: {
        placeholder: '请选择关联计划',
        clearable: true,
        options: planOptions,
      },
    },
    {
      fieldName: 'userId',
      label: '巡检人员',
      component: 'Select',
      componentProps: {
        placeholder: '请选择巡检人员',
        clearable: true,
        options: userOptions,
      },
    },
    {
      fieldName: 'taskType',
      label: '任务类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择任务类型',
        clearable: true,
        options: taskTypeOptions,
      },
    },
    {
      fieldName: 'status',
      label: '任务状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择任务状态',
        clearable: true,
        options: taskStatusOptions,
      },
    },
    {
      fieldName: 'isArchive',
      label: '归档状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择归档状态',
        clearable: true,
        options: archiveOptions,
      },
    },
    {
      fieldName: 'dispatchTime',
      label: '派发时间',
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
    { field: 'id', title: '任务ID', minWidth: 90, sortable: true },
    {
      field: 'planName',
      title: '关联计划',
      minWidth: 190,
      sortable: true,
      slots: { default: 'planName' },
    },
    {
      field: 'taskType',
      title: '任务类型',
      minWidth: 110,
      sortable: true,
      slots: { default: 'taskType' },
    },
    {
      field: 'userName',
      title: '巡检人员',
      minWidth: 110,
      sortable: true,
      slots: { default: 'userName' },
    },
    {
      field: 'status',
      title: '任务状态',
      minWidth: 110,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'progress',
      title: '执行进度',
      minWidth: 150,
      sortable: true,
      slots: { default: 'progress' },
    },
    {
      field: 'dispatchTimeStr',
      title: '派发时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'claimTimeStr',
      title: '认领时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'completeTimeStr',
      title: '完成时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'archiveText',
      title: '归档状态',
      minWidth: 110,
      sortable: true,
      slots: { default: 'archiveText' },
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
  { key: 'id', label: '任务ID' },
  { key: 'planName', label: '关联计划' },
  {
    key: 'taskType',
    label: '任务类型',
    type: 'tag',
    tagType: getTaskTypeTagType,
  },
  { key: 'userName', label: '巡检人员' },
  {
    key: 'status',
    label: '任务状态',
    type: 'tag',
    tagType: getTaskStatusTagType,
    formatter: getTaskStatusLabel,
  },
  { key: 'progressText', label: '执行进度' },
  { key: 'dispatchTimeStr', label: '派发时间' },
  { key: 'claimTimeStr', label: '认领时间' },
  { key: 'completeTimeStr', label: '完成时间' },
  {
    key: 'archiveText',
    label: '归档状态',
    type: 'tag',
    tagType: (_, row) => getArchiveTagType(row?.isArchive),
  },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'updateTimeStr', label: '更新时间' },
];

export const planDetailFields = [
  { key: 'planId', label: '计划ID' },
  { key: 'planName', label: '计划名称' },
  { key: 'taskType', label: '关联任务类型' },
  { key: 'status', label: '当前任务状态' },
  { key: 'dispatchTimeStr', label: '任务派发时间' },
];

export const textObj = {
  excelAllName: '巡检任务数据.xlsx',
  total: '巡检任务支持任务派发、任务认领、任务执行、任务完成闭环管理',
};
