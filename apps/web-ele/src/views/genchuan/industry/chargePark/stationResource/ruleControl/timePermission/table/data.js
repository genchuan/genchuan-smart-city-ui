export const pageConfig = {
  apiName: 'TimePermission',
  title: '时段准入权限',
  exportName: '时段准入权限数据.xlsx',
  importTemplateName: '时段准入权限导入模板.xlsx',
  nameField: 'timeRange',
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
      ['totalUseCount', '使用次数'],
    ],
    line: ['useLineList', 'date', 'useCount', '使用趋势'],
  },
};

const permissionOptions = ['内部车辆', '外部车辆', '无牌车', '会员车辆'];
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
  { field: 'timeRange', label: '生效时段', type: 'input', required: false },
  {
    field: 'permission',
    label: '准入权限',
    type: 'select',
    options: permissionOptions,
    required: false,
  },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    options: statusOptions,
    required: false,
  },
  { field: 'creator', label: '创建人', type: 'input', required: false },
  { field: 'updater', label: '更新人', type: 'input', required: false },
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
  { field: 'timeRange', label: '生效时段', type: 'input', required: true },
  {
    field: 'permission',
    label: '准入权限',
    type: 'select',
    options: permissionOptions,
    required: true,
  },
  { field: 'maxStay', label: '最长停留时长', type: 'number', required: false },
  {
    field: 'workdayConfig',
    label: '工作日配置',
    type: 'textarea',
    required: false,
  },
  {
    field: 'holidayConfig',
    label: '节假日配置',
    type: 'textarea',
    required: false,
  },
  {
    field: 'peakConfig',
    label: '高峰时段配置',
    type: 'textarea',
    required: false,
  },
  {
    field: 'offpeakConfig',
    label: '平峰时段配置',
    type: 'textarea',
    required: false,
  },
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
    displayField: 'stationName',
    drillType: 'dialog',
    drillLabel: '场站详情',
  },
  { field: 'timeRange', label: '生效时段', minWidth: 160, drillType: 'filter' },
  {
    field: 'permission',
    label: '准入权限',
    minWidth: 140,
    drillType: 'filter',
  },
  { field: 'maxStay', label: '最长停留时长', minWidth: 140 },
  {
    field: 'useCount',
    label: '使用次数',
    minWidth: 120,
    drillType: 'dialog',
    drillLabel: '规则使用明细',
  },
  { field: 'status', label: '状态', minWidth: 120, drillType: 'filter' },
  {
    field: 'auditTime',
    label: '审核时间',
    minWidth: 180,
    formatter: 'formatDateTime',
  },
  {
    field: 'auditUserName',
    label: '审核人',
    minWidth: 120,
    displayField: 'auditUserName',
  },
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
  { key: 'stationName', label: '所属场站', section: '基础信息' },
  { key: 'status', label: '状态', section: '基础信息' },
  { key: 'timeRange', label: '生效时段', section: '规则内容' },
  { key: 'permission', label: '准入权限', section: '规则内容' },
  { key: 'maxStay', label: '最长停留时长', section: '规则内容' },
  { key: 'workdayConfig', label: '工作日配置', section: '规则内容' },
  { key: 'holidayConfig', label: '节假日配置', section: '规则内容' },
  { key: 'peakConfig', label: '高峰时段配置', section: '规则内容' },
  { key: 'offpeakConfig', label: '平峰时段配置', section: '规则内容' },
  { key: 'useCount', label: '使用次数', section: '使用统计' },
  { key: 'remark', label: '备注', section: '规则内容' },
  {
    key: 'auditTime',
    label: '审核时间',
    section: '审计信息',
    formatter: 'formatDateTime',
  },
  { key: 'auditUserName', label: '审核人', section: '审计信息' },
  { key: 'creator', label: '创建人', section: '审计信息' },
  {
    key: 'createTime',
    label: '创建时间',
    section: '审计信息',
    formatter: 'formatDateTime',
  },
  { key: 'updater', label: '更新人', section: '审计信息' },
  {
    key: 'updateTime',
    label: '更新时间',
    section: '审计信息',
    formatter: 'formatDateTime',
  },
];
