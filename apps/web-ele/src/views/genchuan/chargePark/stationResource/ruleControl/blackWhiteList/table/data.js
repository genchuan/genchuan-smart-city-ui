export const pageConfig = {
  apiName: 'BlackWhiteList',
  title: '黑白名单',
  exportName: '黑白名单数据.xlsx',
  nameField: 'plateNo',
  primaryField: 'id',
  toolbar: ['create', 'import', 'export'],
  rowActionMap: {
    待生效: ['enable', 'edit', 'detail'],
    已生效: ['disable', 'edit', 'detail'],
    已禁用: ['enable', 'detail'],
  },
  chart: {
    cards: [
      ['enableListCount', '生效名单数', '已生效'],
      ['totalInterceptCount', '拦截次数'],
    ],
    pie: ['typePieList', 'name', 'value'],
  },
};

export const searchFields = [
  { field: 'plateNo', label: '车牌', type: 'input', required: false },
  { field: 'type', label: '名单类型', type: 'input', required: false },
  { field: 'reason', label: '细分类型', type: 'input', required: false },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    options: ['待生效', '已生效', '已禁用'],
    required: false,
  },
];

export const formFields = [
  { field: 'plateNo', label: '车牌', type: 'input', required: true },
  { field: 'type', label: '名单类型', type: 'input', required: true },
  { field: 'reason', label: '细分类型', type: 'input', required: true },
  { field: 'stationIds', label: '适用场站ID', type: 'input', required: false },
  { field: 'startTime', label: '生效时间', type: 'input', required: true },
  { field: 'endTime', label: '失效时间', type: 'input', required: true },
  { field: 'remark', label: '备注', type: 'textarea', required: false },
  { field: 'reserve1', label: '备用字段1', type: 'input', required: false },
  { field: 'reserve2', label: '备用字段2', type: 'input', required: false },
];

export const tableColumns = [
  { field: 'id', label: '名单编号', minWidth: 120, drillType: 'detail' },
  {
    field: 'plateNo',
    label: '车牌',
    minWidth: 140,
    drillType: 'dialog',
    drillLabel: '车辆详情',
  },
  { field: 'type', label: '名单类型', minWidth: 120, drillType: 'filter' },
  { field: 'subType', label: '细分类型', minWidth: 140, drillType: 'filter' },
  { field: 'certInfo', label: '凭证信息', minWidth: 160 },
  {
    field: 'startTime',
    label: '生效时间',
    minWidth: 180,
    formatter: 'formatDateTime',
  },
  {
    field: 'endTime',
    label: '失效时间',
    minWidth: 180,
    formatter: 'formatDateTime',
  },
  { field: 'status', label: '状态', minWidth: 120, drillType: 'filter' },
  { field: 'interceptCount', label: '拦截次数', minWidth: 120 },
  { field: 'remark', label: '备注', minWidth: 140 },
  {
    field: 'auditTime',
    label: '审核时间',
    minWidth: 180,
    formatter: 'formatDateTime',
  },
  { field: 'auditUserId', label: '审核人ID', minWidth: 120 },
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
  { key: 'id', label: '名单编号', section: '基础信息' },
  { key: 'plateNo', label: '车牌', section: '基础信息' },
  { key: 'type', label: '名单类型', section: '基础信息' },
  { key: 'subType', label: '细分类型', section: '基础信息' },
  { key: 'certInfo', label: '凭证信息', section: '基础信息' },
  { key: 'status', label: '状态', section: '基础信息' },
  { key: 'startTime', label: '生效时间', section: '生效信息' },
  { key: 'endTime', label: '失效时间', section: '生效信息' },
  { key: 'interceptCount', label: '拦截次数', section: '生效信息' },
  { key: 'remark', label: '备注', section: '生效信息' },
  { key: 'auditTime', label: '审核时间', section: '审计信息' },
  { key: 'auditUserId', label: '审核人ID', section: '审计信息' },
  { key: 'creator', label: '创建者', section: '审计信息' },
  { key: 'createTime', label: '创建时间', section: '审计信息' },
  { key: 'updater', label: '更新者', section: '审计信息' },
  { key: 'updateTime', label: '更新时间', section: '审计信息' },
];
