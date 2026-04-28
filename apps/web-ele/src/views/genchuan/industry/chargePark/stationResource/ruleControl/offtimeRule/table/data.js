export const pageConfig = {
  apiName: 'OfftimeRule',
  title: '错时规则',
  exportName: '错时规则数据.xlsx',
  nameField: 'offTime',
  primaryField: 'id',
  toolbar: ['create', 'import', 'export'],
  rowActionMap: {
    待生效: ['enable', 'edit', 'detail'],
    已生效: ['disable', 'edit', 'detail'],
    已禁用: ['enable', 'detail'],
  },
  chart: {
    cards: [
      ['enableRuleCount', '生效规则数', '已生效'],
      ['totalOffOrderCount', '错时订单量'],
    ],
    line: ['orderLineList', 'date', 'orderCount', '错时订单趋势'],
  },
};

const statusOptions = ['待生效', '已生效', '已禁用'];

export const searchFields = [
  {
    field: 'stationId',
    label: '所属场站',
    type: 'select',
    options: [],
    required: false,
    apiSource: 'StationInfo',
  },
  { field: 'offTime', label: '错时时段', type: 'input', required: false },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    options: statusOptions,
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
  { field: 'offTime', label: '错时时段', type: 'input', required: true },
  { field: 'offFee', label: '错时费用', type: 'number', required: true },
  { field: 'remark', label: '备注', type: 'textarea', required: false },
  { field: 'reserve1', label: '备用字段1', type: 'input', required: false },
  { field: 'reserve2', label: '备用字段2', type: 'input', required: false },
];

export const tableColumns = [
  { field: 'id', label: '规则编号', minWidth: 120, drillType: 'detail' },
  {
    field: 'stationId',
    label: '所属场站',
    minWidth: 160,
    drillType: 'dialog',
    drillLabel: '场站详情',
  },
  { field: 'offTime', label: '错时时段', minWidth: 160, drillType: 'filter' },
  { field: 'offFee', label: '错时费用', minWidth: 120 },
  {
    field: 'offOrderCount',
    label: '错时订单量',
    minWidth: 120,
    drillType: 'dialog',
    drillLabel: '错时订单明细',
  },
  { field: 'status', label: '状态', minWidth: 120, drillType: 'filter' },
  {
    field: 'auditTime',
    label: '审核时间',
    minWidth: 180,
    formatter: 'formatDateTime',
  },
  { field: 'auditUserId', label: '审核人ID', minWidth: 120 },
  { field: 'creator', label: '创建人', minWidth: 120, drillType: 'filter' },
  {
    field: 'createTime',
    label: '创建时间',
    minWidth: 180,
    formatter: 'formatDateTime',
  },
  { field: 'updater', label: '更新人', minWidth: 120, drillType: 'filter' },
  {
    field: 'updateTime',
    label: '更新时间',
    minWidth: 180,
    formatter: 'formatDateTime',
  },
];

export const detailFields = [
  { key: 'id', label: '规则编号', section: '基础信息' },
  { key: 'stationId', label: '所属场站ID', section: '基础信息' },
  { key: 'status', label: '状态', section: '基础信息' },
  { key: 'offTime', label: '错时时段', section: '规则内容' },
  { key: 'offFee', label: '错时费用', section: '规则内容' },
  { key: 'offOrderCount', label: '错时订单量', section: '运营信息' },
  { key: 'remark', label: '备注', section: '规则内容' },
  { key: 'reserve1', label: '备用字段1', section: '扩展信息' },
  { key: 'reserve2', label: '备用字段2', section: '扩展信息' },
  { key: 'auditTime', label: '审核时间', section: '审计信息' },
  { key: 'auditUserId', label: '审核人ID', section: '审计信息' },
  { key: 'creator', label: '创建人', section: '审计信息' },
  { key: 'createTime', label: '创建时间', section: '审计信息' },
  { key: 'updater', label: '更新人', section: '审计信息' },
  { key: 'updateTime', label: '更新时间', section: '审计信息' },
];
