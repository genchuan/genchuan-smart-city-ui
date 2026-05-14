export const pageConfig = {
  apiName: 'AreaInfo',
  title: '片区信息',
  exportName: '片区信息数据.xlsx',
  importTemplateName: '片区信息导入模板.xlsx',
  nameField: 'name',
  primaryField: 'areaNo',
  toolbar: ['create', 'import', 'export'],
  rowActionMap: {
    未生效: ['enable', 'edit', 'detail'],
    已生效: ['disable', 'edit', 'detail'],
    已禁用: ['enable', 'detail'],
  },
  chart: {
    cards: [
      ['totalAreaCount', '总片区数', 'allAreas'],
      ['totalStationCount', '覆盖场站数', 'stationList'],
    ],
    bar: ['stationCountBarList', 'name', 'value', '关联场站数', 'stationList'],
    map: true,
  },
};

const statusOptions = ['未生效', '已生效', '已禁用'];

export const searchFields = [
  { field: 'areaNo', label: '片区编号', type: 'input', required: false },
  { field: 'name', label: '片区名称', type: 'input', required: false },
  { field: 'district', label: '所属行政区划', type: 'input', required: false },
  { field: 'userId', label: '负责人', type: 'input', required: false },
  { field: 'phone', label: '联系电话', type: 'input', required: false },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    options: statusOptions,
    required: false,
  },
  { field: 'bindUserId', label: '绑定人', type: 'input', required: false },
  { field: 'creator', label: '创建者', type: 'input', required: false },
  { field: 'updater', label: '更新者', type: 'input', required: false },
];

export const formFields = [
  { field: 'areaNo', label: '片区编号', type: 'input', required: true },
  { field: 'name', label: '片区名称', type: 'input', required: true },
  {
    field: 'districtAreaId',
    label: '所属行政区划',
    type: 'areaSelect',
    required: true,
    placeholder: '请选择省/市/区',
  },
  { field: 'userId', label: '负责人', type: 'input', required: true },
  {
    field: 'phone',
    label: '联系电话',
    type: 'input',
    required: false,
    placeholder: '请输入手机号或座机号',
  },
  { field: 'remark', label: '备注', type: 'textarea', required: false },
];

export const tableColumns = [
  { field: 'areaNo', label: '片区编号', minWidth: 140, drillType: 'detail' },
  { field: 'name', label: '片区名称', minWidth: 160 },
  {
    field: 'district',
    label: '所属行政区划',
    minWidth: 180,
    drillType: 'filter',
  },
  { field: 'userId', label: '负责人', minWidth: 120, drillType: 'filter' },
  { field: 'phone', label: '联系电话', minWidth: 150 },
  {
    field: 'stationCount',
    label: '覆盖场站数',
    minWidth: 140,
    drillType: 'stationList',
    drillLabel: '该片区场站列表',
  },
  {
    field: 'status',
    label: '状态',
    minWidth: 120,
    options: statusOptions,
    drillType: 'filter',
  },
  {
    field: 'bindTime',
    label: '绑定时间',
    minWidth: 180,
    formatter: 'formatDateTime',
  },
  { field: 'bindUserId', label: '绑定人', minWidth: 120, drillType: 'filter' },
  { field: 'remark', label: '备注', minWidth: 150 },
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
  { key: 'areaNo', label: '片区编号', section: '基础信息' },
  { key: 'name', label: '片区名称', section: '基础信息' },
  { key: 'district', label: '所属行政区划', section: '基础信息' },
  { key: 'userId', label: '负责人', section: '联系信息' },
  { key: 'phone', label: '联系电话', section: '联系信息' },
  { key: 'stationCount', label: '覆盖场站数', section: '统计信息' },
  { key: 'remark', label: '备注', section: '详细信息' },
  { key: 'status', label: '状态', section: '状态信息' },
  {
    key: 'bindTime',
    label: '绑定时间',
    section: '状态信息',
    formatter: 'formatDateTime',
  },
  { key: 'bindUserId', label: '绑定人', section: '状态信息' },
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
