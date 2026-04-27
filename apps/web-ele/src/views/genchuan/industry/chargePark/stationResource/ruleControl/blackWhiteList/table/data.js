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
    pie: ['typePieList', 'name', 'value', 'type'],
  },
};

const listTypeOptions = ['白名单', '黑名单'];
const subTypeOptions = ['公务车', '业主车', '残疾人车', '欠费车', '逃费车'];
const statusOptions = ['待生效', '已生效', '已禁用'];

export const searchFields = [
  { field: 'plateNo', label: '车牌号', type: 'input', required: false },
  {
    field: 'type',
    label: '名单类型',
    type: 'select',
    options: listTypeOptions,
    required: false,
  },
  {
    field: 'subType',
    label: '细分类型',
    type: 'select',
    options: subTypeOptions,
    required: false,
  },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    options: statusOptions,
    required: false,
  },
];

export const formFields = [
  { field: 'plateNo', label: '车牌号', type: 'input', required: true },
  {
    field: 'type',
    label: '名单类型',
    type: 'select',
    options: listTypeOptions,
    required: true,
  },
  {
    field: 'subType',
    label: '细分类型',
    type: 'select',
    options: subTypeOptions,
    required: true,
  },
  { field: 'startTime', label: '生效时间', type: 'date', required: true },
  { field: 'endTime', label: '失效时间', type: 'date', required: true },
  { field: 'certInfo', label: '证明材料', type: 'textarea', required: false },
  { field: 'remark', label: '备注', type: 'textarea', required: false },
  { field: 'reserve1', label: '备用字段1', type: 'input', required: false },
  { field: 'reserve2', label: '备用字段2', type: 'input', required: false },
];

export const tableColumns = [
  { field: 'id', label: '名单编号', minWidth: 120, drillType: 'detail' },
  { field: 'plateNo', label: '车牌号', minWidth: 130, drillType: 'filter' },
  { field: 'type', label: '名单类型', minWidth: 120, drillType: 'filter' },
  { field: 'subType', label: '细分类型', minWidth: 120, drillType: 'filter' },
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
  {
    field: 'certInfo',
    label: '证明材料',
    minWidth: 160,
    drillType: 'download',
    drillLabel: '证明材料',
  },
  {
    field: 'interceptCount',
    label: '拦截次数',
    minWidth: 120,
    drillType: 'dialog',
    drillLabel: '拦截明细',
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
  { key: 'id', label: '名单编号', section: '基础信息' },
  { key: 'plateNo', label: '车牌号', section: '车辆信息' },
  { key: 'type', label: '名单类型', section: '车辆信息' },
  { key: 'subType', label: '细分类型', section: '车辆信息' },
  { key: 'status', label: '状态', section: '基础信息' },
  { key: 'startTime', label: '生效时间', section: '生效信息' },
  { key: 'endTime', label: '失效时间', section: '生效信息' },
  { key: 'certInfo', label: '证明材料', section: '生效信息' },
  { key: 'interceptCount', label: '拦截次数', section: '运营信息' },
  { key: 'remark', label: '备注', section: '生效信息' },
  { key: 'reserve1', label: '备用字段1', section: '扩展信息' },
  { key: 'reserve2', label: '备用字段2', section: '扩展信息' },
  { key: 'auditTime', label: '审核时间', section: '审计信息' },
  { key: 'auditUserId', label: '审核人ID', section: '审计信息' },
  { key: 'creator', label: '创建人', section: '审计信息' },
  { key: 'createTime', label: '创建时间', section: '审计信息' },
  { key: 'updater', label: '更新人', section: '审计信息' },
  { key: 'updateTime', label: '更新时间', section: '审计信息' },
];
