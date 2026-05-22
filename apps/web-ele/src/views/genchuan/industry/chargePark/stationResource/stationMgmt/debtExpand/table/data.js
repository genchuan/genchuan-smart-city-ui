export const pageConfig = {
  apiName: 'DebtExpand',
  title: '联合追缴拓场',
  exportName: '联合追缴拓场数据.xlsx',
  importTemplateName: '联合追缴拓场导入模板.xlsx',
  nameField: 'stationId',
  primaryField: 'id',
  toolbar: ['create', 'import', 'export'],
  rowActionMap: {
    未生效: ['enable', 'edit', 'detail'],
    已生效: ['disable', 'edit', 'detail'],
    已禁用: ['enable', 'detail'],
  },
  chart: {
    cards: [
      ['expandFinishCount', '拓场完成数'],
      ['recoveryRate', '可追缴完成率', undefined, undefined, '%'],
    ],
    line: [
      'progressLineList',
      'date',
      'progress',
      '拓场进度趋势',
      'createTime',
    ],
    bar: ['recoveryBarList', 'name', 'value', '可追缴完成率', 'stationId', '%'],
  },
};

const typeOptions = ['社会停车场拓场', '联合追缴'];
const rangeOptions = ['本区域', '跨区域', '全平台'];
const statusOptions = ['未生效', '已生效', '已禁用'];

export const searchFields = [
  {
    field: 'stationId',
    label: '合作场站',
    type: 'select',
    options: [],
    required: false,
    apiSource: 'StationInfo',
  },
  {
    field: 'type',
    label: '合作类型',
    type: 'select',
    options: typeOptions,
    required: false,
  },
  {
    field: 'range',
    label: '追缴范围',
    type: 'select',
    options: rangeOptions,
    required: false,
  },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    options: statusOptions,
    required: false,
  },
  {
    field: 'createTimeStart',
    label: '创建开始时间',
    type: 'date',
    required: false,
  },
  {
    field: 'createTimeEnd',
    label: '创建结束时间',
    type: 'date',
    required: false,
  },
  { field: 'creator', label: '创建者', type: 'input', required: false },
  { field: 'updater', label: '更新者', type: 'input', required: false },
];

export const formFields = [
  {
    field: 'stationId',
    label: '合作场站',
    type: 'select',
    options: [],
    required: true,
    apiSource: 'StationInfo',
  },
  {
    field: 'type',
    label: '合作类型',
    type: 'select',
    options: typeOptions,
    required: true,
  },
  {
    field: 'range',
    label: '追缴范围',
    type: 'select',
    options: rangeOptions,
    required: true,
  },
  { field: 'remark', label: '备注', type: 'textarea', required: false },
  { field: 'reserve1', label: '备用字段1', type: 'input', required: false },
  { field: 'reserve2', label: '备用字段2', type: 'input', required: false },
];

export const tableColumns = [
  { field: 'id', label: '拓场编号', minWidth: 120, drillType: 'detail' },
  {
    field: 'stationId',
    label: '合作场站',
    minWidth: 140,
    displayField: 'stationName',
    drillType: 'dialog',
    drillLabel: '场站详情',
  },
  {
    field: 'type',
    label: '合作类型',
    minWidth: 140,
    options: typeOptions,
    drillType: 'filter',
  },
  {
    field: 'range',
    label: '追缴范围',
    minWidth: 140,
    options: rangeOptions,
    drillType: 'filter',
  },
  {
    field: 'progress',
    label: '拓场进度',
    minWidth: 120,
    drillType: 'dialog',
    drillLabel: '拓场进度明细',
  },
  {
    field: 'status',
    label: '状态',
    minWidth: 120,
    options: statusOptions,
    drillType: 'filter',
  },
  {
    field: 'auditTime',
    label: '审核时间',
    minWidth: 180,
    formatter: 'formatDateTime',
  },
  { field: 'auditUserId', label: '审核人ID', minWidth: 120 },
  {
    field: 'finishTime',
    label: '完成时间',
    minWidth: 180,
    formatter: 'formatDateTime',
  },
  { field: 'recoveryRate', label: '可追缴完成率', minWidth: 130, suffix: '%' },
  { field: 'remark', label: '备注', minWidth: 150 },
  { field: 'creator', label: '创建者', minWidth: 120, drillType: 'filter' },
  {
    field: 'createTime',
    label: '创建时间',
    minWidth: 180,
    formatter: 'formatDateTime',
  },
  { field: 'updater', label: '更新者', minWidth: 120, drillType: 'filter' },
  {
    field: 'updateTime',
    label: '更新时间',
    minWidth: 180,
    formatter: 'formatDateTime',
  },
];

export const detailFields = [
  { key: 'id', label: '拓场编号', section: '基础信息' },
  { key: 'stationName', label: '合作场站', section: '基础信息' },
  { key: 'status', label: '状态', section: '基础信息' },
  { key: 'type', label: '合作类型', section: '拓场信息' },
  { key: 'range', label: '追缴范围', section: '拓场信息' },
  { key: 'progress', label: '拓场进度', section: '拓场信息' },
  {
    key: 'recoveryRate',
    label: '可追缴完成率',
    section: '拓场信息',
    suffix: '%',
  },
  {
    key: 'finishTime',
    label: '完成时间',
    section: '拓场信息',
    formatter: 'formatDateTime',
  },
  {
    key: 'auditTime',
    label: '审核时间',
    section: '状态信息',
    formatter: 'formatDateTime',
  },
  { key: 'auditUserId', label: '审核人ID', section: '状态信息' },
  { key: 'remark', label: '备注', section: '拓场信息' },
  { key: 'reserve1', label: '备用字段1', section: '拓场信息' },
  { key: 'reserve2', label: '备用字段2', section: '拓场信息' },
  { key: 'creator', label: '创建者', section: '审计信息' },
  {
    key: 'createTime',
    label: '创建时间',
    section: '审计信息',
    formatter: 'formatDateTime',
  },
  { key: 'updater', label: '更新者', section: '审计信息' },
  {
    key: 'updateTime',
    label: '更新时间',
    section: '审计信息',
    formatter: 'formatDateTime',
  },
];
