export const pageConfig = {
  apiName: 'ChargeParkLink',
  title: '充停联动',
  exportName: '充停联动数据.xlsx',
  nameField: 'stationId',
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
    bar: ['orderBarList', 'name', 'value', '各场站订单量'],
  },
};

export const searchFields = [
  {
    field: 'areaId',
    label: '所属区域',
    type: 'select',
    options: [],
    required: false,
    apiSource: 'AreaInfo',
  },
  {
    field: 'chargeDiscount',
    label: '充电优惠',
    type: 'input',
    required: false,
  },
  { field: 'parkDiscount', label: '停车优惠', type: 'input', required: false },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    options: ['待生效', '已生效', '已禁用'],
    required: false,
  },
];

export const formFields = [
  {
    field: 'areaId',
    label: '所属区域',
    type: 'select',
    options: [],
    required: true,
    apiSource: 'AreaInfo',
  },
  { field: 'chargeDiscount', label: '充电优惠', type: 'input', required: true },
  { field: 'parkDiscount', label: '停车优惠', type: 'input', required: true },
  {
    field: 'minChargeTime',
    label: '最低充电时长',
    type: 'input',
    required: true,
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
    minWidth: 140,
    drillType: 'dialog',
    drillLabel: '场站详情',
  },
  { field: 'discountType', label: '优惠类型', minWidth: 120 },
  { field: 'discount', label: '优惠力度', minWidth: 120 },
  { field: 'carType', label: '车辆类型', minWidth: 140 },
  { field: 'status', label: '状态', minWidth: 120, drillType: 'filter' },
  { field: 'todayOrderCount', label: '今日订单量', minWidth: 120 },
  { field: 'todayIncome', label: '今日营收', minWidth: 120 },
  { field: 'payRate', label: '支付率', minWidth: 120 },
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
  { key: 'id', label: '规则编号', section: '基础信息' },
  { key: 'stationId', label: '所属场站ID', section: '基础信息' },
  { key: 'status', label: '状态', section: '基础信息' },
  { key: 'discountType', label: '优惠类型', section: '联动配置' },
  { key: 'discount', label: '优惠力度', section: '联动配置' },
  { key: 'carType', label: '车辆类型', section: '联动配置' },
  { key: 'todayOrderCount', label: '今日订单量', section: '运营数据' },
  { key: 'todayIncome', label: '今日营收', section: '运营数据' },
  { key: 'payRate', label: '支付率', section: '运营数据' },
  { key: 'remark', label: '备注', section: '联动配置' },
  { key: 'auditTime', label: '审核时间', section: '审计信息' },
  { key: 'auditUserId', label: '审核人ID', section: '审计信息' },
  { key: 'creator', label: '创建者', section: '审计信息' },
  { key: 'createTime', label: '创建时间', section: '审计信息' },
  { key: 'updater', label: '更新者', section: '审计信息' },
  { key: 'updateTime', label: '更新时间', section: '审计信息' },
];
