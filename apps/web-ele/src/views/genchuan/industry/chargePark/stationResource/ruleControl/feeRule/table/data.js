export const pageConfig = {
  apiName: 'FeeRule',
  title: '费率规则',
  exportName: '费率规则数据.xlsx',
  nameField: 'rateType',
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
      ['totalMatchRate', '订单匹配率(%)'],
    ],
    bar: ['stationBarList', 'name', 'value', '各场站规则分布'],
  },
};

const rateTypeOptions = ['停车收费', '充电收费', '混合收费'];
const chargeUnitOptions = ['小时', '15 分钟', '次'];
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
  {
    field: 'rateType',
    label: '费率类型',
    type: 'select',
    options: rateTypeOptions,
    required: false,
  },
  {
    field: 'chargeUnit',
    label: '计费单位',
    type: 'select',
    options: chargeUnitOptions,
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
  {
    field: 'rateType',
    label: '费率类型',
    type: 'select',
    options: rateTypeOptions,
    required: true,
  },
  { field: 'freeTime', label: '免费时长(分)', type: 'number', required: false },
  {
    field: 'chargeUnit',
    label: '计费单位',
    type: 'select',
    options: chargeUnitOptions,
    required: true,
  },
  {
    field: 'firstHourPrice',
    label: '首小时费用',
    type: 'number',
    required: true,
  },
  { field: 'stepPrice', label: '阶梯费用', type: 'number', required: false },
  { field: 'maxPrice', label: '最高费用', type: 'number', required: false },
  {
    field: 'peakValleyConfig',
    label: '峰谷配置',
    type: 'textarea',
    required: false,
  },
  {
    field: 'memberConfig',
    label: '会员配置',
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
  { field: 'rateType', label: '费率类型', minWidth: 140, drillType: 'filter' },
  { field: 'freeTime', label: '免费时长(分)', minWidth: 130 },
  {
    field: 'chargeUnit',
    label: '计费单位',
    minWidth: 120,
    drillType: 'filter',
  },
  { field: 'firstHourPrice', label: '首小时费用', minWidth: 130 },
  { field: 'stepPrice', label: '阶梯费用', minWidth: 130 },
  { field: 'maxPrice', label: '最高费用', minWidth: 120 },
  { field: 'peakValleyConfig', label: '峰谷配置', minWidth: 160 },
  { field: 'memberConfig', label: '会员配置', minWidth: 160 },
  { field: 'matchRate', label: '匹配率', minWidth: 120, suffix: '%' },
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
  { key: 'rateType', label: '费率类型', section: '费率内容' },
  { key: 'freeTime', label: '免费时长(分)', section: '费率内容' },
  { key: 'chargeUnit', label: '计费单位', section: '费率内容' },
  { key: 'firstHourPrice', label: '首小时费用', section: '费率内容' },
  { key: 'stepPrice', label: '阶梯费用', section: '费率内容' },
  { key: 'maxPrice', label: '最高费用', section: '费率内容' },
  { key: 'peakValleyConfig', label: '峰谷配置', section: '费率内容' },
  { key: 'memberConfig', label: '会员配置', section: '费率内容' },
  { key: 'matchRate', label: '匹配率', section: '运营信息', suffix: '%' },
  { key: 'remark', label: '备注', section: '费率内容' },
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
