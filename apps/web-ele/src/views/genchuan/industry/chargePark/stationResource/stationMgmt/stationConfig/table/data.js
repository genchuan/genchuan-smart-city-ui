export const pageConfig = {
  apiName: 'StationConfig',
  title: '场站配置',
  exportName: '场站配置数据.xlsx',
  nameField: 'type',
  primaryField: 'id',
  toolbar: ['create', 'save'],
  rowActionMap: {
    未生效: ['enable', 'edit', 'detail'],
    已生效: ['disable', 'edit', 'detail'],
    已禁用: ['enable', 'detail'],
  },
  chart: {
    cards: [
      ['configedStationCount', '已配置场站数'],
      ['enableConfigCount', '生效配置数', '已生效'],
    ],
    pie: ['typePieList', 'name', 'value', 'type'],
  },
};

const typeOptions = ['通行规则', '收费规则', '联动规则'];
const statusOptions = ['未生效', '已生效', '已禁用'];

export const searchFields = [
  {
    field: 'stationId',
    label: '所属场站',
    type: 'select',
    options: [],
    required: false,
    apiSource: 'StationInfo',
  },
  {
    field: 'type',
    label: '配置类型',
    type: 'select',
    options: typeOptions,
    required: false,
  },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    options: statusOptions,
    required: false,
  },
  { field: 'creator', label: '创建者', type: 'input', required: false },
  { field: 'updater', label: '更新者', type: 'input', required: false },
];

export const formFields = [
  {
    field: 'stationId',
    label: '所属场站',
    type: 'select',
    options: [],
    required: true,
    apiSource: 'StationInfo',
  },
  {
    field: 'type',
    label: '配置类型',
    type: 'select',
    options: typeOptions,
    required: true,
  },
  { field: 'content', label: '配置内容', type: 'textarea', required: true },
  { field: 'remark', label: '备注', type: 'textarea', required: false },
  { field: 'reserve1', label: '备用字段1', type: 'input', required: false },
  { field: 'reserve2', label: '备用字段2', type: 'input', required: false },
];

export const tableColumns = [
  { field: 'id', label: '配置ID', minWidth: 120, drillType: 'detail' },
  {
    field: 'stationId',
    label: '所属场站',
    minWidth: 140,
    displayField: 'stationName',
    drillType: 'dialog',
    drillLabel: '场站详情',
  },
  {
    field: 'type',
    label: '配置类型',
    minWidth: 140,
    options: typeOptions,
    drillType: 'filter',
  },
  { field: 'content', label: '配置内容', minWidth: 240 },
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
    field: 'syncTime',
    label: '同步时间',
    minWidth: 180,
    formatter: 'formatDateTime',
  },
  { field: 'remark', label: '备注', minWidth: 150 },
  { field: 'reserve1', label: '备用字段1', minWidth: 140 },
  { field: 'reserve2', label: '备用字段2', minWidth: 140 },
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
  { key: 'id', label: '配置ID', section: '基础信息' },
  { key: 'stationName', label: '所属场站', section: '基础信息' },
  { key: 'type', label: '配置类型', section: '基础信息' },
  { key: 'status', label: '状态', section: '基础信息' },
  { key: 'content', label: '配置内容', section: '配置详情' },
  {
    key: 'auditTime',
    label: '审核时间',
    section: '状态信息',
    formatter: 'formatDateTime',
  },
  { key: 'auditUserId', label: '审核人ID', section: '状态信息' },
  {
    key: 'syncTime',
    label: '同步时间',
    section: '状态信息',
    formatter: 'formatDateTime',
  },
  { key: 'remark', label: '备注', section: '配置详情' },
  { key: 'reserve1', label: '备用字段1', section: '配置详情' },
  { key: 'reserve2', label: '备用字段2', section: '配置详情' },
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
