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
      ['configuredStationCount', '已配置场站数'],
      ['enableConfigCount', '生效配置数', '已生效'],
    ],
    pie: ['pieData', 'name', 'count'],
  },
};

export const searchFields = [
  {
    field: 'stationId',
    label: '所属场站',
    type: 'select',
    options: [],
    required: false,
    apiSource: 'StationInfo',
  },
  { field: 'type', label: '配置类型', type: 'input', required: false },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    options: ['未生效', '已生效', '已禁用'],
    required: false,
  },
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
  { field: 'type', label: '配置类型', type: 'input', required: true },
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
    drillType: 'dialog',
    drillLabel: '场站详情',
  },
  { field: 'type', label: '配置类型', minWidth: 160, drillType: 'filter' },
  { field: 'content', label: '配置内容', minWidth: 240 },
  { field: 'status', label: '状态', minWidth: 120, drillType: 'filter' },
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
  { key: 'stationId', label: '所属场站ID', section: '基础信息' },
  { key: 'type', label: '配置类型', section: '基础信息' },
  { key: 'status', label: '状态', section: '基础信息' },
  { key: 'content', label: '配置内容', section: '配置详情' },
  { key: 'remark', label: '备注', section: '配置详情' },
  { key: 'creator', label: '创建者', section: '审计信息' },
  { key: 'createTime', label: '创建时间', section: '审计信息' },
  { key: 'updater', label: '更新者', section: '审计信息' },
  { key: 'updateTime', label: '更新时间', section: '审计信息' },
];
