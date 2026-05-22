export const pageConfig = {
  apiName: 'ChargeParkLink',
  title: '充停联动',
  exportName: '充停联动数据.xlsx',
  importTemplateName: '充停联动导入模板.xlsx',
  nameField: 'discountType',
  primaryField: 'id',
  toolbar: ['create', 'import', 'export'],
  rowActionMap: {
    待生效: ['enable', 'edit', 'detail'],
    已生效: ['disable', 'edit', 'detail'],
    已禁用: ['enable', 'detail'],
  },
  chart: {
    cards: [
      ['todayOrderCount', '今日订单量'],
      ['todayIncome', '今日营收'],
      ['payRate', '支付率'],
    ],
    line: ['discountLineList', 'date', 'useCount', '联动优惠使用趋势'],
    bar: ['orderBarList', 'name', 'value', '各场站订单量', 'stationId'],
  },
};

const discountTypeOptions = ['停车减免', '充电减免', '费用合并'];
const carTypeOptions = ['小型车', '中型车', '大型车', '新能源车'];
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
    field: 'discountType',
    label: '优惠类型',
    type: 'select',
    options: discountTypeOptions,
    required: false,
  },
  {
    field: 'carType',
    label: '车辆类型',
    type: 'select',
    options: carTypeOptions,
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
    field: 'discountType',
    label: '优惠类型',
    type: 'select',
    options: discountTypeOptions,
    required: true,
  },
  { field: 'discount', label: '优惠力度', type: 'input', required: true },
  {
    field: 'carType',
    label: '车辆类型',
    type: 'select',
    options: carTypeOptions,
    required: true,
  },
  { field: 'remark', label: '备注', type: 'textarea', required: false },
  { field: 'reserve1', label: '备用字段1', type: 'input', required: false },
  { field: 'reserve2', label: '备用字段2', type: 'input', required: false },
];

export const tableColumns = [
  { field: 'id', label: '规则编号', minWidth: 120, drillType: 'detail' },
  {
    field: 'stationName',
    label: '所属场站',
    minWidth: 160,
    displayField: 'stationName',
    drillType: 'dialog',
    drillLabel: '场站详情',
  },
  {
    field: 'discountType',
    label: '优惠类型',
    minWidth: 120,
    drillType: 'filter',
  },
  { field: 'discount', label: '优惠力度', minWidth: 120 },
  { field: 'carType', label: '车辆类型', minWidth: 140, drillType: 'filter' },
  { field: 'status', label: '状态', minWidth: 120, drillType: 'filter' },
  { field: 'todayOrderCount', label: '今日订单量', minWidth: 120 },
  { field: 'todayIncome', label: '今日营收', minWidth: 120 },
  { field: 'payRate', label: '支付率', minWidth: 120, suffix: '%' },
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
  { key: 'discountType', label: '优惠类型', section: '联动配置' },
  { key: 'discount', label: '优惠力度', section: '联动配置' },
  { key: 'carType', label: '车辆类型', section: '联动配置' },
  { key: 'todayOrderCount', label: '今日订单量', section: '运营数据' },
  { key: 'todayIncome', label: '今日营收', section: '运营数据' },
  { key: 'payRate', label: '支付率', section: '运营数据', suffix: '%' },
  { key: 'remark', label: '备注', section: '联动配置' },
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
