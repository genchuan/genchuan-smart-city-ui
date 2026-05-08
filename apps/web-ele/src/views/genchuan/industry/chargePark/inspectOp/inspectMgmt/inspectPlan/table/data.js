import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getRangePickerDefaultProps } from '#/utils';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatLocalDateTime } from '#/views/genchuan/industry/chargePark/inspectOp/utils/formatLocalDateTime';

export const INSPECT_PLAN_TYPE_DICT = DICT_TYPE.INSPECT_PLAN_TYPE;
export const INSPECT_PLAN_CYCLE_DICT = DICT_TYPE.INSPECT_PLAN_CYCLE;
export const INSPECT_PLAN_STATUS_DICT = DICT_TYPE.INSPECT_PLAN_STATUS;

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

export function getPlanTypeLabel(value) {
  return getDictLabel(INSPECT_PLAN_TYPE_DICT, value);
}

export function isPlanTypeLabel(value, label) {
  return isDictLabel(INSPECT_PLAN_TYPE_DICT, value, label);
}

export function getPlanCycleLabel(value) {
  return getDictLabel(INSPECT_PLAN_CYCLE_DICT, value);
}

export function isPlanCycleLabel(value, label) {
  return isDictLabel(INSPECT_PLAN_CYCLE_DICT, value, label);
}

export function getPlanStatusLabel(value) {
  return getDictLabel(INSPECT_PLAN_STATUS_DICT, value);
}

export function getPlanCycleTagType(value) {
  const tagMap = {
    日: 'primary',
    周: 'success',
    月: 'warning',
    季: 'info',
  };
  return getDictTagTypeFromDict(
    getDictObj(INSPECT_PLAN_CYCLE_DICT, String(value)),
    tagMap[getPlanCycleLabel(value)] || 'info',
  );
}

export function isPlanStatusLabel(value, label) {
  return isDictLabel(INSPECT_PLAN_STATUS_DICT, value, label);
}
export const inspectTypeOptions = getDictOptions(
  INSPECT_PLAN_TYPE_DICT,
  'string',
);

export const cycleOptions = getDictOptions(INSPECT_PLAN_CYCLE_DICT, 'string');

export const statusOptions = getDictOptions(INSPECT_PLAN_STATUS_DICT, 'string');

/** 按计划状态字典 label 取 value，供图表卡片筛选 */
export function getPlanStatusOptionValue(label) {
  const opt = statusOptions.find(
    (item) => String(item.label) === String(label),
  );
  return opt != null ? opt.value : label;
}

const MOCK_PLAN_TYPE_VALUES = ['日常', '专项', '临时'];
const MOCK_PLAN_CYCLE_VALUES = ['日', '周', '月', '季'];
const MOCK_PLAN_STATUS_VALUES = ['待生效', '进行中', '已完成', '已暂停'];

export const auditorOptions = [
  { label: '张三', value: 1 },
  { label: '李四', value: 2 },
  { label: '王五', value: 3 },
  { label: '赵六', value: 4 },
];

const planNames = [
  '丰泽站日常巡检计划',
  '鲤城停车场专项巡检计划',
  '洛江万安临时巡检计划',
  '晋江综合能源站月度巡检',
  '石狮服装城季度巡检',
  '南安水头交通枢纽日检',
  '泉港充电站消防专项巡检',
  '惠安停车楼临时保障巡检',
  '台商区共享设备巡检计划',
  '安溪换电柜专项巡检',
  '永春停车场日常巡检',
  '德化城区设备季度巡检',
];

const scopes = [
  '丰泽站所有设备',
  '鲤城公共停车场',
  '洛江万安充停站',
  '晋江池店综合能源站',
  '石狮服装城充停站',
  '南安水头交通枢纽站',
];

const baseTime = 1_775_011_986_000;

export function formatPlanTime(value) {
  if (!value) return '-';
  const text = String(value);
  return formatLocalDateTime(value) || text;
}

export function getAuditUserName(auditUserId) {
  return (
    auditorOptions.find((item) => item.value === Number(auditUserId))?.label ||
    '-'
  );
}

export function getPlanTypeTagType(type) {
  const tagMap = {
    日常: 'success',
    专项: 'warning',
    临时: 'danger',
  };
  return getDictTagTypeFromDict(
    getDictObj(INSPECT_PLAN_TYPE_DICT, String(type)),
    tagMap[getPlanTypeLabel(type)] || 'info',
  );
}

export function getPlanStatusTagType(status) {
  const tagMap = {
    待生效: 'info',
    进行中: 'success',
    已完成: 'primary',
    已暂停: 'warning',
  };
  return getDictTagTypeFromDict(
    getDictObj(INSPECT_PLAN_STATUS_DICT, String(status)),
    tagMap[getPlanStatusLabel(status)] || 'info',
  );
}

export function getProgressStatus(progress) {
  if (Number(progress) >= 100) return 'success';
  if (Number(progress) >= 60) return '';
  if (Number(progress) > 0) return 'warning';
  return 'exception';
}

export function dataList() {
  return planNames.map((name, index) => {
    const type = MOCK_PLAN_TYPE_VALUES[index % MOCK_PLAN_TYPE_VALUES.length];
    const cycle = MOCK_PLAN_CYCLE_VALUES[index % MOCK_PLAN_CYCLE_VALUES.length];
    const status =
      MOCK_PLAN_STATUS_VALUES[index % MOCK_PLAN_STATUS_VALUES.length];
    const createTime = baseTime + index * 86_400_000;
    const effectTime = ['已完成', '已暂停', '进行中'].includes(status)
      ? createTime + 3_600_000
      : null;
    const finishTime = status === '已完成' ? createTime + 5 * 86_400_000 : null;
    const progressMap = {
      待生效: 0,
      进行中: 60 + (index % 3) * 10,
      已完成: 100,
      已暂停: 35 + (index % 3) * 10,
    };

    return {
      id: index + 1,
      name,
      type,
      scope: scopes[index % scopes.length],
      cycle,
      description: `${name}覆盖设备运行、安全隐患和任务执行记录。`,
      status,
      progress: progressMap[status],
      auditUserId: auditorOptions[index % auditorOptions.length].value,
      effectTime,
      finishTime,
      creator: index % 2 === 0 ? 'admin' : 'operator',
      updater: 'system',
      createTime,
      updateTime: createTime + 2 * 3_600_000,
    };
  });
}

export function normalizeInspectPlanRow(row) {
  const auditUserId = row.auditUserId ?? row.audit_user_id;
  const effectTime = row.effectTime ?? row.effect_time;
  const finishTime = row.finishTime ?? row.finish_time;
  const createTime = row.createTime ?? row.create_time;
  const updateTime = row.updateTime ?? row.update_time;
  const progress = Number(row.progress ?? 0);

  return {
    ...row,
    id: row.id,
    name: row.name || row.planName || row.plan_name || '-',
    type:
      row.typeName || row.type || row.inspectType || row.inspect_type || '-',
    scope: row.scope || row.inspectScope || row.inspect_scope || '-',
    cycle: row.cycleName || row.cycle || '-',
    description: row.description || '',
    status: row.statusName || row.status || '待生效',
    progress,
    progressText: `${progress}%`,
    auditUserId,
    auditUserName:
      row.auditUserName || row.audit_user_name || getAuditUserName(auditUserId),
    effectTime,
    effectTimeStr: formatPlanTime(effectTime),
    finishTime,
    finishTimeStr: formatPlanTime(finishTime),
    creator: row.creator || '-',
    updater: row.updater || '-',
    createTime,
    createTimeStr: formatPlanTime(createTime),
    updateTime,
    updateTimeStr: formatPlanTime(updateTime),
  };
}

function isInRange(value, range) {
  if (!Array.isArray(range) || range.length !== 2 || !value) return true;
  return Number(value) >= Number(range[0]) && Number(value) <= Number(range[1]);
}

export function filterMockList(params = {}) {
  const list = dataList().map((item) => normalizeInspectPlanRow(item));
  const createTimeRange = params.createTimeRange || params.timeRange;

  return list.filter((item) => {
    const matchName = !params.name || item.name.includes(String(params.name));
    const matchType = isSameDictValue(
      INSPECT_PLAN_TYPE_DICT,
      item.type,
      params.type,
    );
    const matchScope =
      !params.scope || item.scope.includes(String(params.scope));
    const matchCycle = isSameDictValue(
      INSPECT_PLAN_CYCLE_DICT,
      item.cycle,
      params.cycle,
    );
    const matchStatus = isSameDictValue(
      INSPECT_PLAN_STATUS_DICT,
      item.status,
      params.status,
    );
    const matchAuditor =
      !params.auditUserId ||
      Number(item.auditUserId) === Number(params.auditUserId);
    const matchTrendTime =
      !params.trendTime ||
      item.createTimeStr.includes(String(params.trendTime));
    const matchCreateTime = isInRange(item.createTime, createTimeRange);

    return (
      matchName &&
      matchType &&
      matchScope &&
      matchCycle &&
      matchStatus &&
      matchAuditor &&
      matchTrendTime &&
      matchCreateTime
    );
  });
}

export function getMockChartData() {
  const list = dataList().map((item) => normalizeInspectPlanRow(item));
  const planCount = list.length;
  const finishedCount = list.filter((item) => item.status === '已完成').length;
  const trendData = ['01', '02', '03', '04', '05', '06'].map((time, index) => ({
    time,
    createCount: 2 + (index % 3),
    finishCount: index < 2 ? 1 : 2 + (index % 2),
  }));
  const typeData = inspectTypeOptions.map((option) => ({
    typeName: option.label,
    count: list.filter((item) => item.type === option.value).length,
  }));

  return {
    trendData,
    typeData,
    cardData: {
      planCount,
      finishRate: Number((finishedCount / planCount).toFixed(2)),
    },
  };
}

export function useSearchFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '计划名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入计划名称',
        clearable: true,
      },
    },
    {
      fieldName: 'type',
      label: '巡检类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择巡检类型',
        clearable: true,
        options: inspectTypeOptions,
      },
    },
    // {
    //   fieldName: 'cycle',
    //   label: '执行周期',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择执行周期',
    //     clearable: true,
    //     options: cycleOptions,
    //   },
    // },
    {
      fieldName: 'status',
      label: '计划状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择计划状态',
        clearable: true,
        options: statusOptions,
      },
    },
    // {
    //   fieldName: 'effectTime',
    //   label: '生效时间',
    //   component: 'DatePicker',
    //   componentProps: {
    //     placeholder: '请选择生效时间',
    //     type: 'datetimerange',
    //     valueFormat: 'timestamp',
    //     clearable: true,
    //   },
    // },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
      // componentProps: {
      //   placeholder: ['开始时间', '结束时间'],
      //   showTime: true,
      //   type: 'datetimerange',
      //   valueFormat: 'x',
      //   style: { width: '100%' },
      //   clearable: true,
      // },
    },
  ];
}

export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '计划名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入计划名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'type',
      label: '巡检类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择巡检类型',
        options: inspectTypeOptions,
      },
      rules: 'required',
    },
    {
      fieldName: 'scope',
      label: '巡检范围',
      component: 'Input',
      componentProps: {
        placeholder: '请输入巡检范围',
      },
      rules: 'required',
    },
    {
      fieldName: 'cycle',
      label: '执行周期',
      component: 'Select',
      componentProps: {
        placeholder: '请选择执行周期',
        options: cycleOptions,
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '计划状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择计划状态',
        options: statusOptions,
      },
      rules: 'required',
    },
    // {
    //   fieldName: 'effectTime',
    //   label: '生效时间',
    //   component: 'DatePicker',
    //   componentProps: {
    //     placeholder: '请选择生效时间',
    //     format: 'YYYY-MM-DD HH:mm:ss',
    //     valueFormat: 'timestamp',
    //     type: 'datetime',
    //   },
    // },
    {
      fieldName: 'description',
      label: '计划描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入计划描述',
        rows: 4,
        type: 'textarea',
      },
    },
  ];
}

export function useEditFormSchema() {
  return useFormSchema().map((item) => {
    if (['name', 'scope', 'status', 'type'].includes(item.fieldName)) {
      return {
        ...item,
        componentProps: {
          ...item.componentProps,
          disabled: true,
        },
      };
    }
    return item;
  });
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '计划ID', minWidth: 90, sortable: true },
    {
      field: 'name',
      title: '计划名称',
      minWidth: 190,
      sortable: true,
      slots: { default: 'name' },
    },
    {
      field: 'type',
      title: '巡检类型',
      minWidth: 110,
      sortable: true,
      slots: { default: 'type' },
    },
    {
      field: 'scope',
      title: '巡检范围',
      minWidth: 180,
      sortable: true,
      slots: { default: 'scope' },
    },
    {
      field: 'cycle',
      title: '执行周期',
      minWidth: 100,
      sortable: true,
      slots: { default: 'cycle' },
    },
    {
      field: 'status',
      title: '计划状态',
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
      field: 'auditUserName',
      title: '审核人',
      minWidth: 110,
      sortable: true,
      slots: { default: 'auditUserName' },
    },
    {
      field: 'effectTimeStr',
      title: '生效时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'finishTimeStr',
      title: '完成时间',
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
  { key: 'id', label: '计划ID' },
  { key: 'name', label: '计划名称' },
  {
    key: 'type',
    label: '巡检类型',
    type: 'tag',
    tagType: getPlanTypeTagType,
    formatter: getPlanTypeLabel,
  },
  { key: 'scope', label: '巡检范围' },
  {
    key: 'cycle',
    label: '执行周期',
    type: 'tag',
    tagType: getPlanCycleTagType,
    formatter: getPlanCycleLabel,
  },
  { key: 'description', label: '计划描述' },
  {
    key: 'status',
    label: '计划状态',
    type: 'tag',
    tagType: getPlanStatusTagType,
    formatter: getPlanStatusLabel,
  },
  { key: 'progressText', label: '执行进度' },
  { key: 'auditUserName', label: '审核人' },
  { key: 'effectTimeStr', label: '生效时间' },
  { key: 'finishTimeStr', label: '完成时间' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'updateTimeStr', label: '更新时间' },
];

export const textObj = {
  addText: '新增巡检计划',
  editText: '编辑巡检计划',
  excelAllName: '巡检计划数据.xlsx',
  total: '巡检计划支持计划创建、计划审核、计划生效、计划执行闭环管理',
};
