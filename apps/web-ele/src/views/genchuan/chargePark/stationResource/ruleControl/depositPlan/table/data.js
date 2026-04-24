export const pageConfig = {
  apiName: 'DepositPlan',
  title: '押金方案',
  exportName: '押金方案数据.xlsx',
  nameField: 'name',
  primaryField: 'id',
  toolbar: ['create', 'import', 'export'],
  rowActionMap: {
    待生效: ['enable', 'edit', 'detail'],
    已生效: ['disable', 'edit', 'detail'],
    已禁用: ['enable', 'detail'],
  },
  chart: {
    cards: [
      ['enablePlanCount', '生效方案数', '已生效'],
      ['orderCount', '押金订单量'],
    ],
    bar: ['barData', 'name', 'count', '方案使用分布'],
  },
};

export const searchFields = [
  { field: 'name', label: '方案名称', type: 'input', required: false },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    options: ['待生效', '已生效', '已禁用'],
    required: false,
  },
];

export const formFields = [
  { field: 'name', label: '方案名称', type: 'input', required: true },
  { field: 'amount', label: '押金金额', type: 'input', required: true },
  { field: 'limitTime', label: '限制时长', type: 'input', required: true },
  { field: 'remark', label: '备注', type: 'textarea', required: false },
  { field: 'reserve1', label: '备用字段1', type: 'input', required: false },
  { field: 'reserve2', label: '备用字段2', type: 'input', required: false },
];

export const tableColumns = [
  { field: 'id', label: '方案编号', minWidth: 120, drillType: 'detail' },
  { field: 'name', label: '方案名称', minWidth: 160, drillType: 'filter' },
  { field: 'amount', label: '押金金额', minWidth: 120 },
  { field: 'limitTime', label: '限制时长', minWidth: 120 },
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
  { key: 'id', label: '方案编号', section: '基础信息' },
  { key: 'name', label: '方案名称', section: '基础信息' },
  { key: 'status', label: '状态', section: '基础信息' },
  { key: 'amount', label: '押金金额', section: '方案内容' },
  { key: 'limitTime', label: '限制时长', section: '方案内容' },
  { key: 'remark', label: '备注', section: '方案内容' },
  { key: 'creator', label: '创建者', section: '审计信息' },
  { key: 'createTime', label: '创建时间', section: '审计信息' },
  { key: 'updater', label: '更新者', section: '审计信息' },
  { key: 'updateTime', label: '更新时间', section: '审计信息' },
];
